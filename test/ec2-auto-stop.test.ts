import '@aws-cdk/assert/jest';
import { SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Ec2AutoStop from '../lib/ec2-auto-stop-stack';

describe('Ec2AutoStopStack Snapshot Test', () => {
  const app = new cdk.App();
  const stack = new Ec2AutoStop.Ec2AutoStopStack(app, 'Ec2AutoStopStack');
  test('stack', () => {
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
  });
});

describe('Ec2AutoStopStack Fine-Grained Test', () => {
  const app = new cdk.App();
  const stack = new Ec2AutoStop.Ec2AutoStopStack(app, 'Ec2AutoStopStack');

  test('Lambda', () => {
    expect(stack).toHaveResource('AWS::Lambda::Function', {
      Handler: 'index.handler',
    });
  });

  test('IAM Policy', () => {
    expect(stack).toHaveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'ec2:StopInstances',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:aws:ec2:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':instance/*',
                ],
              ],
            },
          },
          {
            Action: 'ec2:DescribeInstances',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('Events Rule', () => {
    expect(stack).toHaveResource('AWS::Events::Rule', {
      ScheduleExpression: 'cron(30,40 14 * * ? *)',
    });
  });
});
