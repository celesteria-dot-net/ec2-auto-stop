import { Filter } from '@aws-sdk/client-ec2';
import { startedInstances, noInstancesToRun } from './domains/webhookContents';
import postToDiscord from './util/discord';
import { fetchInstanceIds, startInstances } from './util/ec2';

const filters: Filter[] = [{ Name: 'tag-key', Values: ['bot_container'] }];

// eslint-disable-next-line import/prefer-default-export
export const handler = async (): Promise<void> => {
  const instanceIds = await fetchInstanceIds(filters);
  if (instanceIds.length !== 0) await startInstances(instanceIds);

  const webhookMessage =
    instanceIds.length === 0 ? noInstancesToRun : startedInstances;
  await postToDiscord(instanceIds, webhookMessage).then((response) => {
    if (response.status !== 204)
      throw new Error(
        `[Webhook Error] StatusCode: ${response.status}, Status: ${response.statusText}`,
      );
  });

  // TODO: SSHしてdockerを再起動
};
