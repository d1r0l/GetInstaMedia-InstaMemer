import { Message, TextBasedChannel } from 'discord.js';
import regex from '../utils/regex';
import igAgent from '../utils/igAgent';

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
        const postData = await igAgent.getPostData(postShortCode);
        const mediaUrlArray = await igAgent.mediaUrlArraySelector(postData);
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
          url: `${igAgent.baseUrl}/p/${postShortCode}/`,
          author: {
            name: postData.user.full_name,
            icon_url: postData.user.profile_pic_url,
            url: `${igAgent.baseUrl}/${postData.user.username}`,
          },
          footer: {
            text: 'Instagram',
            icon_url: `${igAgent.baseUrl}/static/images/ico/favicon-192.png/68d99ba29cc8.png`,
          },
        };
        if (postData.caption) embed.description = postData.caption.text;

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
