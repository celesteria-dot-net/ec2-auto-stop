import {
  EC2Client,
  DescribeInstancesCommand,
  StopInstancesCommand,
} from '@aws-sdk/client-ec2';
import postToDiscord from './discord';

const client = new EC2Client({});

const fetchInstanceIds = async () => {
  const data = await client.send(
    new DescribeInstancesCommand({
      Filters: [
        { Name: 'instance-state-name', Values: ['running', 'pending'] },
      ],
    }),
  );

  return (
    data.Reservations?.flatMap((res) => res.Instances ?? []).flatMap(
      (ins) => ins.InstanceId ?? [],
    ) ?? []
  );
};

const stopInstances = async (instanceIds: string[]) => {
  await client.send(
    new StopInstancesCommand({ InstanceIds: instanceIds, Force: true }),
  );
};

// eslint-disable-next-line import/prefer-default-export
export const handler = async (): Promise<{
  isSuccessful: boolean;
  error?: unknown;
}> => {
  try {
    const instanceIds = await fetchInstanceIds();
    if (instanceIds.length !== 0) await stopInstances(instanceIds);

    const response = await postToDiscord(instanceIds);
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
