import uuidv4 from 'uuid/v4';
import DynamoDBClient from '../config/dynamodbConfig';
import { Game, STATE_LIVE, STATE_DEAD } from '../models/game';

const TABLE_NAME = 'games';
const GSI_NAME = 'state-createDate-index';

export default class GameService {

  constructor() {
    this.client = (new DynamoDBClient()).build();
  }

  async getGames() {
    const params = {
      TableName: TABLE_NAME,
      IndexName: GSI_NAME,
      KeyConditionExpression: '#s = :hkey',
      ExpressionAttributeValues: {
        ':hkey': STATE_LIVE,
      },
      ExpressionAttributeNames: {
        '#s': 'state',
      }
    };
    try {
      const data = await this.client.query(params).promise();
      if (data.Item === undefined) {
        return null;
      }
      const ids = data.Items.map((item) => {
        return item.gameId;
      });
      return ids;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async getGameById(gameId) {
    const params = {
      TableName: TABLE_NAME,
      Key: { gameId }
    };
    try {
      const data = await this.client.get(params).promise();
      if (data.Item === undefined) {
        return null;
      }
      return new Game(data.Item);
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async createGame(args) {
    const game = new Game(args);
    game.gameId = uuidv4();
    game.createDate = (new Date()).toISOString();
    const params = {
      TableName: TABLE_NAME,
      Item: game,
    };
    try {
      await this.client.put(params).promise();
      console.log(`Game ${game.gameId} created.`);
      return game;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async updateGame(game) {
    const params = {
      TableName: TABLE_NAME,
      Item: game,
    };
    try {
      await this.client.put(params).promise();
      console.log(`Game ${game.gameId} updated.`);
      return game;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

}
