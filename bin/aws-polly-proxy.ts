#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import {AwsPollyProxyStack} from "../lib/aws-polly-proxy-stack";

const app = new cdk.App();
new AwsPollyProxyStack(app, "AwsPollyProxyStack", {});
