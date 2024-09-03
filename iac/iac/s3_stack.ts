import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import { envs } from "../../src/shared/helpers/envs/envs";
import * as cdk from "aws-cdk-lib";
import { stage } from "../get_stage_env";

export class S3Stack extends Construct {
  bucket: s3.Bucket;

  constructor(scope: Construct, id: string) {
    super(scope, id);
  

    const bucket = new s3.Bucket(this, `${envs.STACK_NAME}-Bucket`, {
      bucketName: `${envs.S3_BUCKET_NAME.toLowerCase()}-${stage.toLowerCase()}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(30),
        },
      ],
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
          exposedHeaders: ["Access-Control-Allow-Origin"],
        },
      ],
    });

    this.bucket = bucket;

    new cdk.CfnOutput(this, "BucketName", {
      value: bucket.bucketName,
    });

  }
}