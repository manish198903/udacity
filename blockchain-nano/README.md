# Project #3. Private Blockchain with API

This is Project 3, Private Blockchain, in this project I created an API to provide over the network access to my private block chain.


## Setup project for Review.

To setup the project for review do the following:
1. Download the project.
2. Run command __npm install__ to install the project dependencies.
3. Run command __node app.js__ in the root directory.

## Endpoint Documentation
### Node.js framework used for the API - [Express.js](https://expressjs.com/)

### Endpoints with associated responses

*GET /block/:blockHeight*

curl -v "http://localhost:8000/block/0"

Reponse:
```
{
  "hash": "2b55be9ce528c761962d3f54086f2e0475a0275f3365b1e0bff24378e0113327",
  "height": 0,
  "body": "First block in the chain - Genesis block",
  "time": "1555963598",
  "previousBlockHash": ""
}
```

*POST /block*

curl "http://localhost:8000/block" -d '{"body": 1234}'  -H "Content-Type: application/json" -v

Reponse:
```
{
  "hash": "cb5656574278bbf4fed4eb61f7e1f7941e261a64ec9cf12cdba2b116a1d902a1",
  "height": 4,
  "body": 1234,
  "time": "1555970033",
  "previousBlockHash": "4af29dca67f909c9eb7d91c5703219e9a99a0a4b131297386457c718c462e794"
}
```

### Errors
 - Invalid block number on the GET endpoint will return an error
   - curl -v "http://localhost:8000/block/-1"
   - curl -v "http://localhost:8000/block/test"

 - Input payload on the POST endpoint must have the 'body' key with some payload
   - curl "http://localhost:8000/block" -d '{"key1":"value1", "data": 1234}'  -H "Content-Type: application/json" -v
   - curl "http://localhost:8000/block" -d '{"body": ""}'  -H "Content-Type: application/json" -v

## What do I learned with this Project

* I was able to write an API for my private block chain.
