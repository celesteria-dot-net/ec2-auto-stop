import { Filter } from '@aws-sdk/client-ec2';
import { MessageBuilder } from 'discord-webhook-node';
import sendEmbed from './util/discord';
import { fetchInstanceIds, stopInstances } from './util/ec2';

const filters: Filter[] = [
  { Name: 'instance-state-name', Values: ['running', 'pending'] },
];

// eslint-disable-next-line import/prefer-default-export
export const handler = async (): Promise<void> => {
  const instanceIds = await fetchInstanceIds(filters);
  const isRunning = instanceIds.length !== 0;
  if (isRunning) await stopInstances(instanceIds);

  const webhookText = isRunning
    ? '@everyone EC2に関して今すぐ確認が必要です！'
    : '';
  const embedDescription = isRunning
    ? 'インスタンスが実行中です。'
    : '実行中のインスタンスはありません。';
  const embedColor = isRunning ? 14177041 : 1127128;
  const embedInstanceIds = isRunning ? instanceIds.join(', ') : '[]'

  const embed = new MessageBuilder()
    .setText(webhookText)
    .setDescription(embedDescription)
    .setColor(embedColor)
    .addField('インスタンスID', embedInstanceIds);

  await sendEmbed(embed)
};
