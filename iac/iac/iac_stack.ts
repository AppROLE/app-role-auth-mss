import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import { S3Stack } from "./s3_stack";
import { Construct } from "constructs";
import { stage } from "../get_stage_env";
import { LambdaStack } from "./lambda_stack";
import { CognitoStack } from "./cognito_stack";
import { Stack, StackProps } from "aws-cdk-lib";
import { envs } from "../../src/shared/helpers/envs/envs";
import { Cors, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Distribution, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";

export class IacStack extends Stack {
  constructor(scope: Construct, constructId: string, props?: StackProps) {
    super(scope, constructId, props);

    const restApi = new RestApi(this, `${envs.STACK_NAME}-RestAPI`, {
      restApiName: `${envs.STACK_NAME}-RestAPI`,
      description:
        "This is the REST API for the AppRole Auth MSS Service.",
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowHeaders: ["*"],
      },
    });

    const apigatewayResource = restApi.root.addResource("mss-role-auth", {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowHeaders: Cors.DEFAULT_HEADERS,
      },
    });

    const cognitoStack = new CognitoStack(this, `${envs.STACK_NAME}-CognitoStack`);

    const environmentVariables = {
      STAGE: stage,
      NODE_PATH: '/var/task:/opt/nodejs',
      COGNITO_USER_POOL_ID: cognitoStack.userPool.userPoolId,
      COGNITO_CLIENT_ID: cognitoStack.client.userPoolClientId,
      EMAIL_LOGIN: envs.EMAIL_LOGIN,
      EMAIL_PASSWORD: envs.EMAIL_PASSWORD,
      MONGO_URI: envs.MONGO_URI,
      S3_BUCKET_NAME: envs.S3_BUCKET_NAME + "-" + stage.toLowerCase(),
    };

    const lambdaStack = new LambdaStack(
      this,
      apigatewayResource,
      environmentVariables
    )

    const cognitoAdminPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["cognito-idp:*"],
      resources: [cognitoStack.userPool.userPoolArn],
    });

    for (const fn of lambdaStack.functionsThatNeedCognitoPermissions) {
      fn.addToRolePolicy(cognitoAdminPolicy);
    }

    const s3Stack = new S3Stack(this, `${envs.STACK_NAME}-S3Stack`);

    const s3Policy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["s3:*"],
      resources: [s3Stack.bucket.bucketArn],
    });

    for (const fn of lambdaStack.functionsThatNeedS3Permissions) {
      fn.addToRolePolicy(s3Policy);
    }

    const originAccessIdentity = new OriginAccessIdentity(this, 'AppRoleFrontOAI', {
      comment: 'OAI for S3 bucket',
    });

    const distribution = new Distribution(this, 'AppRoleFrontDistribution', {
      defaultBehavior: {
        origin: new cdk.aws_cloudfront_origins.S3Origin(s3Stack.bucket, {
          originAccessIdentity: originAccessIdentity,
        }),
        allowedMethods: cdk.aws_cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachedMethods: cdk.aws_cloudfront.CachedMethods.CACHE_GET_HEAD,
        viewerProtocolPolicy: cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cdk.aws_cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
    });

    distribution.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    s3Stack.bucket.addToResourcePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['s3:GetObject'],
      resources: [s3Stack.bucket.arnForObjects('*')],
      principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com', {
        conditions: {
          StringEquals: {
            'AWS:SourceArn': `arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`,
          },
        },
      })],
    }));
  }
}