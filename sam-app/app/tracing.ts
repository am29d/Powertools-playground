import { LambdaInterface } from '@aws-lambda-powertools/commons';
import { Context } from 'aws-lambda';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { Logger } from '@aws-lambda-powertools/logger';
import { SSMProvider } from '@aws-lambda-powertools/parameters/ssm';

const tracer = new Tracer();
const logger = new Logger();

const ssmProvider = new SSMProvider();

const PARAMETER_NAME = process.env.PARAMETER_NAME || '';

class LambdaHandler implements LambdaInterface {
    @tracer.captureLambdaHandler()
    @logger.injectLambdaContext({ logEvent: true })
    public async handler(_event: unknown, _context: Context): Promise<string> {
        const param = await ssmProvider.get(PARAMETER_NAME);
        if (param) {
            tracer.getSegment()?.addAnnotation('parameter', param);
        }
        return 'Hello World';
    }
}

const lambdaHandler = new LambdaHandler();
export const handler = lambdaHandler.handler.bind(lambdaHandler);
