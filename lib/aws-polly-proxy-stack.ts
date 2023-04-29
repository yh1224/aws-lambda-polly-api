import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambda_nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as logs from "aws-cdk-lib/aws-logs";
import {Construct} from "constructs";
import * as path from "path";

export class AwsPollyProxyStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const apiFunc = new lambda_nodejs.NodejsFunction(this, "ApiFunction", {
            architecture: lambda.Architecture.ARM_64,
            entry: path.resolve(__dirname, "../src/lambdas/ApiFunc/index.ts"),
            handler: "lambda_handler",
            logRetention: logs.RetentionDays.ONE_WEEK,
            runtime: lambda.Runtime.NODEJS_18_X,
            timeout: cdk.Duration.seconds(30),
        });
        apiFunc.addToRolePolicy(new iam.PolicyStatement({
            actions: [
                "polly:SynthesizeSpeech",
            ],
            resources: ["*"],
        }));
        const url = apiFunc.addFunctionUrl({
            authType: lambda.FunctionUrlAuthType.NONE,
        });

        new cdk.CfnOutput(this, "ApiUrl", {
            value: url.url,
        });
    }
}
