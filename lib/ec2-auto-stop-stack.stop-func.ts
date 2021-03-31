import { Filter } from '@aws-sdk/client-ec2';
import {
  noRunningInstances,
  runningInstances,
} from './domains/webhookContents';
import postToDiscord from './util/discord';
import { fetchInstanceIds, stopInstances } from './util/ec2';

const filters: Filter[] = [
  { Name: 'instance-state-name', Values: ['running', 'pending'] },
];

// eslint-disable-next-line import/prefer-default-export
export const handler = async (): Promise<{
  isSuccessful: boolean;
  error?: unknown;
}> => {
  try {
    const instanceIds = await fetchInstanceIds(filters);
    if (instanceIds.length !== 0) await stopInstances(instanceIds);

    const webhookMessage =
      instanceIds.length === 0 ? noRunningInstances : runningInstances;
    const response = await postToDiscord(instanceIds, webhookMessage);
    if (response.status !== 204)
      throw new Error(
        `[Webhook Error] StatusCode: ${response.status}, Status: ${response.statusText}`,
      );

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
