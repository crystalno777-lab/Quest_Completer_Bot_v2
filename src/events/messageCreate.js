import { getEmoji } from '../handlers/emoji.js';
import { PREFIX } from '../utils/config.js';

export default {
  name: 'messageCreate',
  once: false,
  async execute(message, client) {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    // Commands are not allowed in DMs.
    if (!message.guild) {
      await message.reply(
        `<a:staff:1552015522839797824> **Commands are not allowed in DMs!**\n` +
        `Please go to <#1551981887373709422> and use the command there.\n` +
        `[Go to the channel](https://discord.com/channels/1020369849622470686/1551981887373709422)`
      ).catch(() => {});
      return;
    }

    const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();

    const command = client.prefixCommands.get(commandName);
    if (!command) return;

    try {
      await command.prefixExecute(message, args, client);
    } catch (err) {
      console.error(err);
      await message.reply(`${getEmoji('error')} Something went wrong.`).catch(() => {});
    }
  },
};
