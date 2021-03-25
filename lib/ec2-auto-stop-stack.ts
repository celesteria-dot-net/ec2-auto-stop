import * as cdk from '@aws-cdk/core';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { Rule, Schedule } from '@aws-cdk/aws-events';
import { LambdaFunction } from '@aws-cdk/aws-events-targets';

// eslint-disable-next-line import/prefer-default-export
export class Ec2AutoStopStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const policyStatements = [
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
    ];

    const stopFunc = new NodejsFunction(this, 'stop-func');
    policyStatements.forEach((policy) => {
      stopFunc.addToRolePolicy(policy);
    });

    const stopFuncTriggers = [
      new Rule(this, 'stop-func-schedule', {
        schedule: Schedule.cron({
          minute: '30,40',
          hour: '14',
        }),
      }),
    ];

    stopFuncTriggers.forEach((rule) =>
      rule.addTarget(new LambdaFunction(stopFunc)),
    );
  }
}
