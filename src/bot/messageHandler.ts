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
      const linkMatch = links[i].match(regex.igLink);
      if (linkMatch) {
        const postShortCode = linkMatch[1];
        const postData = await igAgent.getPostData(postShortCode);
        if (postData) console.log('Got post data.');

        // const filesToSendPromices = await filesToSendSelector(postData);
        // const filesToSend = await Promise.all(filesToSendPromices);
        // console.log(filesToSend);

        const msgIsNotDeleted = (): boolean => {
          const fetchedMessage = channel.messages.cache.get(msg.id);
          if (fetchedMessage) return true;
          else return false;
        };

        if (msgIsNotDeleted()) {
          await msg.reply({ content: 'Got IG link #' + i });
          // console.log(postData);
          //   if (replyMsg.files) msg.suppressEmbeds(true);
          // } else {
          //   console.error('Cannot fetch message.');
          // }
        }
      }
    }
  }
};

export default messageHandler;
