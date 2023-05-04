#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import {AwsLambdaPollyApiStack} from "../lib/aws-lambda-polly-api-stack";

const app = new cdk.App();
new AwsLambdaPollyApiStack(app, "AwsLambdaPollyApiStack", {});
