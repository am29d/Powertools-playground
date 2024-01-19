import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {StringParameter} from "aws-cdk-lib/aws-ssm";
import {Runtime, Tracing} from "aws-cdk-lib/aws-lambda";


export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const param = new StringParameter(this, 'MyParameter', {
      parameterName: '/my/parameter',
      stringValue: '42',
    });

    const func = new NodejsFunction(this, 'MyFunction', {
      entry: 'lib/app/tracer.ts',
      handler: 'handler',
      runtime: Runtime.NODEJS_20_X,
      memorySize: 1024,
      environment: {
        PARAMETER_NAME: param.parameterName,
      },
      tracing: Tracing.ACTIVE,
      bundling: {
        minify: true,
        sourceMap: true,
      },
    });

    param.grantRead(func);
  }
}
