import 'dotenv/config';
import AWS from 'aws-sdk';

const awsConfig = {
  region: process.env.AWS_DEFAULT_REGION || 'us-west-1',
  endpoint: 'http://localhost:8000',
};
AWS.config.update(awsConfig);

const dynamodb = new AWS.DynamoDB();
const tableParams = {
  TableName: 'games',
  AttributeDefinitions: [
    {
      AttributeName: 'gameId',
      AttributeType: 'S',
    },
    {
      AttributeName: 'state',
      AttributeType: 'S',
    },
    {
      AttributeName: 'createDate',
      AttributeType: 'S',
    }
  ],
  KeySchema: [
    {
      AttributeName: 'gameId',
      KeyType: 'HASH',
    },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'state-createDate-index',
      KeySchema: [
        {
          AttributeName: 'state',
          KeyType: 'HASH'
        },
        {
          AttributeName: 'createDate',
          KeyType: 'RANGE'
        },
      ],
      Projection: {
        ProjectionType: 'INCLUDE',
        NonKeyAttributes: [ 'gameId' ],
      }
    },
  ],
  BillingMode: 'PAY_PER_REQUEST',
};

dynamodb.createTable(tableParams, (err, data) => {
  if (err) {
    console.error("Unable to create table. Error:", JSON.stringify(err, null, 2));
  } else {
    console.log("Created table:", JSON.stringify(data, null, 2));
  }
});
