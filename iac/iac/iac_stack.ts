import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

export class IacStack extends Stack {
  constructor(scope: Construct, constructId: string, props?: StackProps) {
    super(scope, constructId, props);

    // The code that defines your stack goes here
  }
}