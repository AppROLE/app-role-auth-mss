import * as cdk from 'aws-cdk-lib'
import { envs } from '../src/shared/helpers/envs/envs'
import { IacStack } from './iac/iac_stack'

console.log('Starting the CDK')

const app = new cdk.App()

const awsRegion = envs.AWS_REGION
const awsAccount = envs.AWS_ACCOUNT_ID
const stackName = envs.STACK_NAME

new IacStack(app, stackName, {
  env: {
    region: awsRegion,
    account: awsAccount,
  },
})

app.synth()