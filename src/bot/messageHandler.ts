import { Message, TextBasedChannel } from 'discord.js';
import regex from '../utils/regex';

const messageHandler = async (
  msg: Message<boolean>,
  channel: TextBasedChannel,
) => {
  const msgParts = msg.content.replace(/\n+/g, ' ').split(' ');
  const links = msgParts.filter((part) => part.match(/http/));
  if (links.length > 0) {
    for (let i = 0; i < links.length; i++) {
      if (links[i].match(regex.igLink)) {
        // const prepareMessage = async () => {
        //   let message = await fixInstaLink(links[i]);
        //   for (let i = 0; i < 3; i++) {
        //     if (message?.error === 'auth required') {
        //       await getIgCookies(
        //         process.env.IG_USERNAME,
        //         process.env.IG_PASSWORD,
        //         cookiesPath,
        //       );
        //       message = await fixInstaLink(links[i]);
        //     } else return message;
        //   }
        //   if (message?.error === 'auth required') {
        //     message = { content: 'Cannot get Instagram cookies.' };
        //   }
        //   return message;
        // };
        // const replyMsg = await prepareMessage();

        const msgIsNotDeleted = (): boolean => {
          const fetchedMessage = channel.messages.cache.get(msg.id);
          if (fetchedMessage) return true;
          else return false;
        };

        if (msgIsNotDeleted()) {
          await msg.reply({ content: 'Got IG link #' + i });
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
