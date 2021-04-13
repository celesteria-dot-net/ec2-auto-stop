import { Filter } from '@aws-sdk/client-ec2';
import { MessageBuilder } from 'discord-webhook-node';
import sendEmbed from './util/discord';
import { fetchInstanceIds, startInstances } from './util/ec2';

const filters: Filter[] = [{ Name: 'tag-key', Values: ['bot_container'] }];

// eslint-disable-next-line import/prefer-default-export
export const handler = async (): Promise<void> => {
  const instanceIds = await fetchInstanceIds(filters);
  const existsInstanceToRun = instanceIds.length !== 0;
  if (existsInstanceToRun) await startInstances(instanceIds);

  const embedDescription = existsInstanceToRun ? 'インスタンスを起動しました。' : '起動するインスタンスはありません。'
  const embedColor = existsInstanceToRun ? 14177041 : 1127128;
  const embedInstanceIds = existsInstanceToRun ? instanceIds.join(', ') : '[]'

  const embed = new MessageBuilder()
    .setDescription(embedDescription)
    .setColor(embedColor)
    .addField('インスタンスID', embedInstanceIds);

  await sendEmbed(embed)

  // TODO: SSHしてdockerを再起動
};
