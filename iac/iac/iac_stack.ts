import { Stack, StackProps } from "aws-cdk-lib";
import { Cors, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { stage } from "../get_stage_env";
import { LambdaStack } from "./lambda_stack";
import * as iam from "aws-cdk-lib/aws-iam";
import { envs } from "../../src/shared/helpers/envs/envs";
import { CognitoStack } from "./cognito_stack";

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
  }
}