import AWS from 'aws-sdk';

export default class DynamoDBClient {

  constructor() {
    const awsConfig = {
      region: process.env.AWS_REGION || 'us-west-1',
    };
    if (process.env.DYNAMO_HOST) {
      awsConfig.endpoint = process.env.DYNAMO_HOST;
    }
    AWS.config.update(awsConfig);
  }

  build() {
    return new AWS.DynamoDB.DocumentClient();
  }

}
