import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Ec2AutoStop from '../lib/ec2-auto-stop-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Ec2AutoStop.Ec2AutoStopStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
