import {
  DescribeInstancesCommand,
  EC2Client,
  Filter,
  StartInstancesCommand,
  StartInstancesCommandOutput,
  StopInstancesCommand,
  StopInstancesCommandOutput,
} from '@aws-sdk/client-ec2';

const client = new EC2Client({});

const fetchInstanceIds = async (filters: Filter[]): Promise<string[]> => {
  const data = await client.send(
    new DescribeInstancesCommand({
      Filters: filters,
    }),
  );

  return (
    data.Reservations?.flatMap((res) => res.Instances ?? []).flatMap(
      (ins) => ins.InstanceId ?? [],
    ) ?? []
  );
};

const startInstances = async (
  instanceIds: string[],
): Promise<StartInstancesCommandOutput> =>
  client.send(new StartInstancesCommand({ InstanceIds: instanceIds }));

const stopInstances = async (
  instanceIds: string[],
): Promise<StopInstancesCommandOutput> =>
  client.send(
    new StopInstancesCommand({ InstanceIds: instanceIds, Force: true }),
  );

export { fetchInstanceIds, startInstances, stopInstances };
