import * as cdk from 'aws-cdk-lib';
import {
    aws_cognito as cognito,
    RemovalPolicy,
    CfnOutput
} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {envs} from "../../src/shared/helpers/envs/envs";
import { AccountRecovery, CfnIdentityPool, ProviderAttribute, UserPoolDomain, UserPoolIdentityProviderGoogle } from 'aws-cdk-lib/aws-cognito';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { stage } from '../get_stage_env';
import * as iam from 'aws-cdk-lib/aws-iam';

export class CognitoStack extends Construct {
    public readonly userPool: cognito.UserPool;
    public readonly client: cognito.UserPoolClient;

    constructor(scope: Construct, id: string) {      
      super(scope, `${envs.STACK_NAME}-CognitoStack-${stage}`);
      
      // const googleClientId = envs.GOOGLE_WEB_CLIENT_ID || '';
      // const googleSecretValue = Secret.fromSecretNameV2(this, 
      //   `${envs.STACK_NAME}-GoogleClientSecretValue`, 
      //   'GOOGLE_WEB_SECRET_VALUE'
      // )
      // const redirectUrls = envs.REDIRECT_URLS || '';

      // if (!fromEmail || !replyToEmail) {
      //     throw new Error('Missing required environment variables: FROM_EMAIL, REPLY_TO_EMAIL');
      // }

      this.userPool = new cognito.UserPool(this, `${envs.STACK_NAME}-UserPool-${stage}`, {
          selfSignUpEnabled: true,
          accountRecovery: AccountRecovery.EMAIL_ONLY,
          userVerification: {
              emailSubject: 'Verify your email for AppROLE!',
              emailBody: 'Hello {username}, Thanks for signing up to AppROLE! Your verification code is {####}',
              emailStyle: cognito.VerificationEmailStyle.CODE,
          },
          standardAttributes: {
              email: {
                  required: true,
                  mutable: true
              },
              nickname: {
                  required: true,
                  mutable: true
              },
              phoneNumber: {
                  required: false,
                  mutable: true
              },
          },
          customAttributes: {
            name: new cognito.StringAttribute({minLen: 1, maxLen: 2048, mutable: true}),
            roleType: new cognito.StringAttribute({minLen: 1, maxLen: 2048, mutable: true}),
            acceptedTerms: new cognito.BooleanAttribute({mutable: true}),
            confirmationCode: new cognito.StringAttribute({minLen: 1, maxLen: 2048, mutable: true}),
          },
          removalPolicy: RemovalPolicy.DESTROY,
      });

      
      // const googleProvider = new UserPoolIdentityProviderGoogle(this, `${envs.STACK_NAME}-GoogleProvider-${stage}` , {
      //   clientId: googleClientId,
      //   clientSecretValue: googleSecretValue.secretValue,
      //   scopes: ['openid', 'profile', 'email'],
      //   attributeMapping: {
      //     email: ProviderAttribute.GOOGLE_EMAIL,
      //     givenName: ProviderAttribute.GOOGLE_GIVEN_NAME,
      //     familyName: ProviderAttribute.GOOGLE_FAMILY_NAME,
      //     phoneNumber: ProviderAttribute.GOOGLE_PHONE_NUMBERS
      //   },
      //   userPool: this.userPool
      //   });
          
      // this.userPool.registerIdentityProvider(googleProvider)
        
      this.client = this.userPool.addClient(`${envs.STACK_NAME}-UserPoolClient-${stage}`, {
          userPoolClientName: `${envs.STACK_NAME}-UserPoolClient-${stage}`,
          generateSecret: false,
          authFlows: {
              adminUserPassword: true,
              userPassword: true,
              userSrp: true,
          }
      });
      
      new CfnOutput(this, 'UserPoolIdOutput' +  stage, {
        value: this.userPool.userPoolId,
        exportName: 'UserPoolId' + stage
      });

      new CfnOutput(this, 'ClientIdOutput' + stage, {
        value: this.client.userPoolClientId,
        exportName: 'ClientId' + stage
      });
    }
}