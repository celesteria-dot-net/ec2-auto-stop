import {
  EC2Client,
  DescribeInstancesCommand,
  StopInstancesCommand,
} from '@aws-sdk/client-ec2';
import fetch from 'node-fetch';

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

const postToDiscord = async (instanceIds: string[]) => {
  const webhook = process.env.WEBHOOK;
  const normalContent = {
    textContent: '',
    embedContent: 'There are no running instances.',
    color: 1127128,
  };
  const abnormalContent = {
    textContent: '@everyone Check It Now!',
    embedContent: 'Some instances should be stopped!',
    color: 14177041,
  };
  const requestHeader = {
    'User-Agent': 'curl/7.74.0',
    'Content-Type': 'application/json',
  };
  const contents = instanceIds.length === 0 ? normalContent : abnormalContent;
  const requestData = {
    content: contents.textContent,
    embeds: [
      {
        title: 'EC2 Notifications',
        url:
          'https://us-west-2.console.aws.amazon.com/ec2/v2/home?region=us-west-2#Instances:',
        description: contents.embedContent,
        color: contents.color,
        fields: [
          {
            name: 'instance_ids',
            value: instanceIds.length === 0 ? '[]' : instanceIds.join(', '),
          },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  const response = await fetch(webhook, {
    method: 'post',
    body: JSON.stringify(requestData),
    headers: requestHeader,
  });

  return response;
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
