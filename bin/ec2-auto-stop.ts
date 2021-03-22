#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { Ec2AutoStopStack } from '../lib/ec2-auto-stop-stack';

const app = new cdk.App();
new Ec2AutoStopStack(app, 'Ec2AutoStopStack');
