import { Filter } from '@aws-sdk/client-ec2';
import { startedInstances, noInstancesToRun } from './domains/webhookContents';
import postToDiscord from './util/discord';
import { fetchInstanceIds, startInstances } from './util/ec2';

const tagNames = ['bot_container']

const filters: Filter[] = [
  { Name: 'tag-key', Values: tagNames },
]

// eslint-disable-next-line import/prefer-default-export
export const handler = async (): Promise<{
  isSuccessful: boolean;
  error?: unknown;
}> => {
  try {
    const instanceIds = await fetchInstanceIds(filters);
    if (instanceIds.length !== 0) await startInstances(instanceIds);

    const webhookMessage =
      instanceIds.length === 0 ? noInstancesToRun : startedInstances;
    const response = await postToDiscord(instanceIds, webhookMessage);
    if (response.status !== 204)
      return {
        isSuccessful: false,
        error: `Webhook error: ${response.statusText}`,
      };

    return {
      isSuccessful: true,
    };
  } catch (err) {
    return {
      isSuccessful: false,
      error: err,
    };
  }
};
