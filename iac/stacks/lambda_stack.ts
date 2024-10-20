/* eslint-disable @typescript-eslint/no-explicit-any */
import {Construct} from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import {Resource, LambdaIntegration, CognitoUserPoolsAuthorizer} from 'aws-cdk-lib/aws-apigateway'
import {Duration} from 'aws-cdk-lib'
import * as path from 'path'
import { envs } from '../../src/shared/helpers/envs/envs'
import { stage } from '../get_stage_env'

export class LambdaStack extends Construct {
  functionsThatNeedCognitoPermissions: lambda.Function[] = []
  functionsThatNeedS3Permissions: lambda.Function[] = []
  lambdaLayer: lambda.LayerVersion
  libLayer: lambda.LayerVersion

  forgotPasswordFunction: lambda.Function
  confirmCodeFunction: lambda.Function
  confirmForgotPasswordFunction: lambda.Function
  signUpFunction: lambda.Function
  resendCodeFunction: lambda.Function
  signInFunction: lambda.Function
  finishSignUpFunction: lambda.Function
  uploadProfilePhoto: lambda.Function
  refreshTokenFunction: lambda.Function

  getProfileFunction: lambda.Function
  deleteAccountFunction: lambda.Function
  createReviewFunction: lambda.Function
  getFriendsFunction: lambda.Function
  getAllReviewsByEventFunction: lambda.Function
  findPersonFunction: lambda.Function
  updateProfileFunction: lambda.Function
  favoriteInstituteFunction: lambda.Function
  getAllFavoriteInstitutesFunction: lambda.Function
  followUserFunction: lambda.Function
  getAllFollowersFunction: lambda.Function
  getAllFollowingFunction: lambda.Function

  createLambdaApiGatewayIntegration(
    moduleName: string, 
    method: string, 
    mssApiResource: Resource, 
    environmentVariables: Record<string, any>, 
    authorizer?: CognitoUserPoolsAuthorizer
  ): lambda.Function {
    const modifiedModuleName = moduleName.toLowerCase().split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    // create_user -> Create_user

    console.log(`Creating lambda function for ${modifiedModuleName} in stage ${stage}`)
    console.log(`Environment variables for ${modifiedModuleName}: ${JSON.stringify(environmentVariables)}`)
    const lambdaFunction = new lambda.Function(this, modifiedModuleName, {
      functionName: `${modifiedModuleName}-${envs.STACK_NAME}`,
      // need to take ../../src/modules/${moduleName} to get the correct path
      code: lambda.Code.fromAsset(path.join(__dirname, `../../dist/modules/${moduleName}`)),
      handler: `app/${moduleName}_presenter.lambda_handler`,
      runtime: lambda.Runtime.NODEJS_20_X,
      layers: [this.lambdaLayer, this.libLayer],
      environment: environmentVariables,
      timeout: Duration.seconds(30),
      memorySize: 512
    })

    mssApiResource.addResource(moduleName.toLowerCase().replace(/_/g, '-')).addMethod(method, new LambdaIntegration(lambdaFunction), authorizer ? {
      authorizer: authorizer
    } : undefined)

    return lambdaFunction
  }

  constructor(
    scope: Construct, 
    apiGatewayResource: Resource, 
    environmentVariables: Record<string, any>,
    authorizer?: CognitoUserPoolsAuthorizer
  ) {
    super(scope, `${envs.STACK_NAME}-LambdaStack`)

    this.lambdaLayer = new lambda.LayerVersion(this, `${envs.STACK_NAME}-SharedLayer`, {
      code: lambda.Code.fromAsset(path.join(__dirname, '../shared')),
      compatibleRuntimes: [lambda.Runtime.NODEJS_20_X],
    })

    this.libLayer = new lambda.LayerVersion(this, `${envs.STACK_NAME}-LibLayer`, {
      code: lambda.Code.fromAsset(path.join(__dirname, '../node_dependencies')),
      compatibleRuntimes: [lambda.Runtime.NODEJS_20_X],
    })

    // auth routes
    this.signUpFunction = this.createLambdaApiGatewayIntegration('sign_up', 'POST', apiGatewayResource, environmentVariables)
    this.forgotPasswordFunction = this.createLambdaApiGatewayIntegration('forgot_password', 'POST', apiGatewayResource, environmentVariables)
    this.confirmCodeFunction = this.createLambdaApiGatewayIntegration('confirm_code', 'POST', apiGatewayResource, environmentVariables)
    this.confirmForgotPasswordFunction = this.createLambdaApiGatewayIntegration('confirm_forgot_password', 'POST', apiGatewayResource, environmentVariables)
    this.resendCodeFunction = this.createLambdaApiGatewayIntegration('resend_code', 'POST', apiGatewayResource, environmentVariables)
    this.signInFunction = this.createLambdaApiGatewayIntegration('sign_in', 'POST', apiGatewayResource, environmentVariables)
    this.finishSignUpFunction = this.createLambdaApiGatewayIntegration('finish_sign_up', 'POST', apiGatewayResource, environmentVariables)
    this.uploadProfilePhoto = this.createLambdaApiGatewayIntegration('upload_profile_photo', 'POST', apiGatewayResource, environmentVariables)
    this.refreshTokenFunction = this.createLambdaApiGatewayIntegration('refresh_token', 'POST', apiGatewayResource, environmentVariables)


    // inside app router
    this.getProfileFunction = this.createLambdaApiGatewayIntegration('get_profile', 'GET', apiGatewayResource, environmentVariables, authorizer)
    this.deleteAccountFunction = this.createLambdaApiGatewayIntegration('delete_account', 'DELETE', apiGatewayResource, environmentVariables, authorizer)
    this.getFriendsFunction = this.createLambdaApiGatewayIntegration('get_friends', 'GET', apiGatewayResource, environmentVariables, authorizer)
    this.findPersonFunction = this.createLambdaApiGatewayIntegration('find_person', 'GET', apiGatewayResource, environmentVariables, authorizer)
    this.updateProfileFunction = this.createLambdaApiGatewayIntegration('update_profile', 'PUT', apiGatewayResource, environmentVariables, authorizer)
    this.favoriteInstituteFunction = this.createLambdaApiGatewayIntegration('favorite_institute', 'PUT', apiGatewayResource, environmentVariables, authorizer)
    this.getAllFavoriteInstitutesFunction = this.createLambdaApiGatewayIntegration('get_all_favorite_institutes', 'GET', apiGatewayResource, environmentVariables, authorizer)
    this.followUserFunction = this.createLambdaApiGatewayIntegration('follow_user', 'PUT', apiGatewayResource, environmentVariables, authorizer)
    this.getAllFollowersFunction = this.createLambdaApiGatewayIntegration('get_all_followers', 'GET', apiGatewayResource, environmentVariables, authorizer)
    this.getAllFollowingFunction = this.createLambdaApiGatewayIntegration('get_all_following', 'GET', apiGatewayResource, environmentVariables, authorizer)

    this.functionsThatNeedS3Permissions = [
      this.uploadProfilePhoto
    ]

    this.functionsThatNeedCognitoPermissions = [
      this.forgotPasswordFunction,
      this.signUpFunction,
      this.confirmCodeFunction,
      this.confirmForgotPasswordFunction,
      this.resendCodeFunction,
      this.signInFunction,
      this.finishSignUpFunction,
      this.refreshTokenFunction,
      this.getProfileFunction,
      this.deleteAccountFunction,
      this.updateProfileFunction,
      this.favoriteInstituteFunction,
      this.followUserFunction,
      this.getAllFollowersFunction,
      this.getAllFollowingFunction
    ]
  }
}