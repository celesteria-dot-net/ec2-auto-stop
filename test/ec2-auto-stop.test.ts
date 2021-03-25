import { SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Ec2AutoStop from '../lib/ec2-auto-stop-stack';

test('Ec2AutoStopStack Snapshot Test', () => {
  const app = new cdk.App();
  const stack = new Ec2AutoStop.Ec2AutoStopStack(app, 'MyTestStack');
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});
