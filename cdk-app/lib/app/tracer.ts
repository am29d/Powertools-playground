import { LambdaInterface } from '@aws-lambda-powertools/commons';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { Logger } from '@aws-lambda-powertools/logger';
import { SSMProvider } from '@aws-lambda-powertools/parameters/ssm';
import { SSMClient } from '@aws-sdk/client-ssm';

const tracer = new Tracer();
const logger = new Logger();

const ssmClient = new SSMClient();

const ssmProvider = new SSMProvider({awsSdkV3Client: ssmClient});

tracer.captureAWSv3Client(ssmClient);

const PARAMETER_NAME = process.env.PARAMETER_NAME || '';

class LambdaHandler implements LambdaInterface {
  @tracer.captureLambdaHandler()
  @logger.injectLambdaContext({ logEvent: true })
  public async handler(_event: unknown, _context: unknown): Promise<string> {
    const param = await ssmProvider.get(PARAMETER_NAME, { forceFetch: true});
    if (param) {
      tracer.getSegment()?.addAnnotation('parameter', param);
    }
    return 'Hello World';
  }
}

const lambdaHandler = new LambdaHandler();
export const handler = lambdaHandler.handler.bind(lambdaHandler);
