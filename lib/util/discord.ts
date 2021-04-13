/* eslint-disable no-console */
import { Webhook, MessageBuilder } from 'discord-webhook-node';
import env from './env';

const webhook = new Webhook(env.DISCORD_TOKEN);
webhook.setUsername('EC2-Auto-Stop');
webhook.setAvatar('https://i.gyazo.com/5e6236efcc9c6d6f3bbf6253aa38ea31.png');

const sendEmbed = (embed: MessageBuilder): Promise<void> =>
  webhook.send(embed).catch((err) => {
    console.error('DiscordにEmbedを投稿できませんでした');
    console.error(err);
  });

export default sendEmbed;
