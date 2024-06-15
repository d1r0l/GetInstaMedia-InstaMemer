import { Message, TextBasedChannel } from 'discord.js';
import regex from '../utils/regex';
import igAgent from '../instagram/igAgent';
import igMediaSizeSelector from '../instagram/igMediaSizeSelector';
import igIdConverter from '../instagram/igIdConverter';
import type MediaInfoResponseItems from '../instagram/igPostDataType';

const baseUrl = igAgent.state.constants.WEBHOST;

const messageHandler = async (
  msg: Message<boolean>,
  channel: TextBasedChannel,
) => {
  const msgParts = msg.content.replace(/\n+/g, ' ').split(' ');
  const links = msgParts.filter((part) => part.match(/http/));

  if (links.length > 0) {
    for (let i = 0; i < links.length; i++) {
      const igLinkMatch = links[i].match(regex.igLink);

      if (igLinkMatch) {
        const postShortCode = igLinkMatch[1];
        const igPostId = igIdConverter.shortcodeToMediaId(postShortCode);

        const postData = await igAgent.media.info(igPostId);
        const mediaUrlArray = await igMediaSizeSelector(
          postData.items as MediaInfoResponseItems[],
          25 * 1024 * 1024,
        );
        const embed: {
          color: number;
          url: string;
          author: {
            name: string;
            icon_url: string;
            url: string;
          };
          description?: string;
          footer: {
            text: string;
            icon_url: string;
          };
        } = {
          color: 0xe1306c,
          url: `${baseUrl}/p/${postShortCode}/`,
          author: {
            name: postData.items[0].user.full_name,
            icon_url: postData.items[0].user.profile_pic_url,
            url: `${baseUrl}/${postData.items[0].user.username}`,
          },
          footer: {
            text: 'Instagram',
            icon_url: `${baseUrl}/static/images/ico/favicon-192.png/68d99ba29cc8.png`,
          },
        };

        if (postData.items[0].caption)
          embed.description = postData.items[0].caption.text;

        const responseMessage = {
          files: mediaUrlArray,
          embeds: [embed],
        };

        const msgIsNotDeleted = (): boolean => {
          const fetchedMessage = channel.messages.cache.get(msg.id);
          if (fetchedMessage) return true;
          else return false;
        };

        if (msgIsNotDeleted()) {
          await msg.reply(responseMessage);
          await msg.suppressEmbeds(true);
        }
      }
    }
  }
};

export default messageHandler;
