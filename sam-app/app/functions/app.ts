import { Logger } from '@aws-lambda-powertools/logger';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { LambdaInterface } from '@aws-lambda-powertools/commons';
import { Context } from 'aws-lambda';
import { DynamoDBPersistenceLayer } from '@aws-lambda-powertools/idempotency/dynamodb';
import { IdempotencyConfig, idempotent } from '@aws-lambda-powertools/idempotency';

const logger = new Logger();
const tracer = new Tracer();

const IDEMPOTENCY_TABLE = process.env.IDEMPOTENCY_TABLE || '';

const persistenceStore = new DynamoDBPersistenceLayer({ tableName: IDEMPOTENCY_TABLE });

class LambdaHandler implements LambdaInterface {
    @tracer.captureLambdaHandler()
    @idempotent({ persistenceStore: persistenceStore, config: new IdempotencyConfig({}) })
    @logger.injectLambdaContext({ logEvent: true })
    public async handler(_event: unknown, _context: Context): Promise<string> {
        return 'Hello World';
    }
}

const lambdaHandler = new LambdaHandler();
export const handler = lambdaHandler.handler.bind(lambdaHandler);
