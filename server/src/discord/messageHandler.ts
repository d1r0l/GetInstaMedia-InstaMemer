import { ChannelType, Message, EmbedBuilder } from 'discord.js';
import regex from '../utils/regex';
import igAgent from '../instagram/igAgent';
import igMediaSizeSelector from '../instagram/igMediaSizeSelector';
import igIdConverter from '../instagram/igIdConverter';
import type MediaInfoResponseItems from '../instagram/igPostDataType';

/**
 * Handles a Discord message by extracting Instagram links, fetching media information,
 * and replying with an embed containing the media.
 */
const messageHandler = async (msg: Message): Promise<void> => {
  if (msg.channel.type !== ChannelType.GuildText) return;

  const baseUrl = igAgent.state.constants.WEBHOST;

  const msgParts = msg.content.replace(/\n+/g, ' ').split(' ');
  const links = msgParts.filter((part) => part.match(/http/));

  if (links.length <= 0) return;

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
      const embed = new EmbedBuilder({
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
      });

      if (postData.items[0].caption)
        embed.setDescription(postData.items[0].caption.text);

      await msg
        .reply({
          files: mediaUrlArray,
          embeds: [embed],
          failIfNotExists: true,
        })
        .then(async () => {
          await msg.suppressEmbeds(true);
        })
        .catch((error) => {
          if (error.code !== 50035) throw error;
        });
    }
  }
};

export default messageHandler;
