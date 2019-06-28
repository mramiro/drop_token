
## Instructions for running locally

### Requirements:
* Docker 18+
* Docker Compose
* NodeJs 10+

Start by getting all the necessary npm packages:

```
npm install
```

Unless you have all the required environment variables set, you'll need a valid .env file. The easiest way of getting one is by copying the provided example.

```
cp .env.example .env
```

The next step is running docker-compose to boot up the DynamoDB local instance:

```
docker-compose up
```

Note: If your port 8000 is being used by some other process, you might have to change it in both the .env file and the docker-compose.yml file

Also note that the `AWS_*` environment variables are used extensively across the project as defaults for credentialing and the like. Make sure that you don't have such variables already set in your session to avoid conflicts.

Once the DB is running, you should be able to initialize the DB with:

```
npm run init-db
```

And last, you can run the application with a simple `npm start`. By default it listens on port 3000.
