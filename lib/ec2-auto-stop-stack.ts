import { Rule, Schedule } from '@aws-cdk/aws-events';
import { LambdaFunction } from '@aws-cdk/aws-events-targets';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import * as cdk from '@aws-cdk/core';

// eslint-disable-next-line import/prefer-default-export
export class Ec2AutoStopStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const stopFunc = new NodejsFunction(this, 'stop-func');
    const startFunc = new NodejsFunction(this, 'start-func');

    [
      new PolicyStatement({
        resources: [
          `arn:aws:ec2:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:instance/*`,
        ],
        actions: ['ec2:StopInstances'],
      }),
      // DescribeInstancesはリソースの指定ができない(ref. https://dev.classmethod.jp/articles/tsnote-iam-resource-level-001/)
      new PolicyStatement({
        resources: ['*'],
        actions: ['ec2:DescribeInstances'],
      }),
    ].forEach((policy) => {
      stopFunc.addToRolePolicy(policy);
    });

    [
      new PolicyStatement({
        resources: [
          `arn:aws:ec2:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:instance/*`,
        ],
        actions: ['ec2:StartInstances'],
      }),
      new PolicyStatement({
        resources: ['*'],
        actions: ['ec2:DescribeInstances'],
      }),
    ].forEach((policy) => {
      startFunc.addToRolePolicy(policy);
    });

    new Rule(this, 'stop-func-schedule', {
      schedule: Schedule.cron({
        minute: '30,40',
        hour: '14',
      }),
    }).addTarget(new LambdaFunction(stopFunc));

    new Rule(this, 'start-func-schedule', {
      schedule: Schedule.cron({
        minute: '0',
        hour: '0',
      }),
    }).addTarget(new LambdaFunction(startFunc));
  }
}
