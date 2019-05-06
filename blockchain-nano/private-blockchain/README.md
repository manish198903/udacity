# Project #4. Private Blockchain with API and Notary

This is Project 4, Private Blockchain, in this project I created an API to provide over the network access to my private block chain.
The API also contains methods for digitally notarizing content.


## Setup project for Review.

To setup the project for review do the following:
1. Download the project.
2. Run command __npm install__ to install the project dependencies.
3. Run command __node app.js__ in the root directory.

## Endpoint Documentation
### Node.js framework used for the API - [Express.js](https://expressjs.com/)

### Endpoints with associated responses

*POST /requestValidation*

```
curl -X POST \
  http://localhost:8000/requestValidation \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d '{
    "address":"19D61L7L1HDxGnSeTRi1CEhDt5pYj1pdqY"
}'
```
Reponse:
```
{
  "walletAddress": "19D61L7L1HDxGnSeTRi1CEhDt5pYj1pdqY",
  "requestTimestamp": "1556131306",
  "message": "19D61L7L1HDxGnSeTRi1CEhDt5pYj1pdqY:1556131306:starRegistry",
  "validationWindow": 300
}
```

*POST /message-signature/validate*

```
curl -X POST \
  http://localhost:8000/message-signature/validate \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d '{
"address":"19D61L7L1HDxGnSeTRi1CEhDt5pYj1pdqY",
"signature":"IJ6fN9yrvMF/k3Vou6sjMOIEA34I4DB7A0ceSTZ+oRfOILHeIqVZBhZ01U8+z4STxX+F11J53gcbUFaHVKK7Jg0="
}'
```

Reponse:
```
{
  "registerStar": true,
  "status": {
    "address": "19D61L7L1HDxGnSeTRi1CEhDt5pYj1pdqY",
    "requestTimestamp": "1556131306",
    "message": "19D61L7L1HDxGnSeTRi1CEhDt5pYj1pdqY:1556131306:starRegistry",
    "validationWindow": 1714,
    "messageSignature": true
  }
}
```

*POST /block*

```
curl -X POST \
  http://localhost:8000/block \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d '@star.txt'
```


Reponse:
```
{
  "hash": "0e7e1cefd682890bad8c3f403b037d4d8ba7d94d9be26a5094b1a181c716e269",
  "height": 3,
  "body": {
    "address": "19D61L7L1HDxGnSeTRi1CEhDt5pYj1pdqY",
    "star": {
      "dec": "68° 52' 56.9",
      "ra": "16h 29m 1.0s",
      "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
      "storyDecoded": "Found star using https://www.google.com/sky/"
    }
  },
  "time": "1556131505",
  "previousBlockHash": "b4eaa6fd4b1dfce5b90e5569a9d8076d00038e68d00b9daca9ee85c1cccbc90c"
}
```

*GET /stars/hash:hash*

```
curl http://localhost:8000/stars/hash:b4eaa6fd4b1dfce5b90e5569a9d8076d00038e68d00b9daca9ee85c1cccbc90c
```

Reponse:
```
{
  "hash": "b4eaa6fd4b1dfce5b90e5569a9d8076d00038e68d00b9daca9ee85c1cccbc90c",
  "height": 2,
  "body": {
    "address": "19D61L7L1HDxGnSeTRi1CEhDt5pYj1pdqY",
    "star": {
      "dec": "68° 52' 56.9",
      "ra": "16h 29m 1.0s",
      "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
      "storyDecoded": "Found star using https://www.google.com/sky/"
    }
  },
  "time": "1556128162",
  "previousBlockHash": "c9b900642693781c1a29be18c889a275e6c2b4f090bcd72b8a4a47cb02ad655e"
}
```

*GET /stars/address:address*

```
curl http://localhost:8000/stars/address:19D61L7L1HDxGnSeTRi1CEhDt5pYj1pdqY
```

Reponse:
```
[
  {
    "hash": "c9b900642693781c1a29be18c889a275e6c2b4f090bcd72b8a4a47cb02ad655e",
    "height": 1,
    "body": {
      "address": "19D61L7L1HDxGnSeTRi1CEhDt5pYj1pdqY",
      "star": {
        "dec": "68\u00b0 52' 56.9",
        "ra": "16h 29m 1.0s",
        "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
        "storyDecoded": "Found star using https:\/\/www.google.com\/sky\/"
      }
    },
    "time": "1556127968",
    "previousBlockHash": "e2aabc11e76970ffef2264f62f5161c7b1051f249a5f33be844837b7f9d83bd4"
  },
  {
    "hash": "b4eaa6fd4b1dfce5b90e5569a9d8076d00038e68d00b9daca9ee85c1cccbc90c",
    "height": 2,
    "body": {
      "address": "19D61L7L1HDxGnSeTRi1CEhDt5pYj1pdqY",
      "star": {
        "dec": "68\u00b0 52' 56.9",
        "ra": "16h 29m 1.0s",
        "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
        "storyDecoded": "Found star using https:\/\/www.google.com\/sky\/"
      }
    },
    "time": "1556128162",
    "previousBlockHash": "c9b900642693781c1a29be18c889a275e6c2b4f090bcd72b8a4a47cb02ad655e"
  },
  {
    "hash": "0e7e1cefd682890bad8c3f403b037d4d8ba7d94d9be26a5094b1a181c716e269",
    "height": 3,
    "body": {
      "address": "19D61L7L1HDxGnSeTRi1CEhDt5pYj1pdqY",
      "star": {
        "dec": "68\u00b0 52' 56.9",
        "ra": "16h 29m 1.0s",
        "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
        "storyDecoded": "Found star using https:\/\/www.google.com\/sky\/"
      }
    },
    "time": "1556131505",
    "previousBlockHash": "b4eaa6fd4b1dfce5b90e5569a9d8076d00038e68d00b9daca9ee85c1cccbc90c"
  }
]
```

*GET /block/:blockHeight*

```
curl http://localhost:8000/block/1
```

Reponse:
```
{
  "hash": "c9b900642693781c1a29be18c889a275e6c2b4f090bcd72b8a4a47cb02ad655e",
  "height": 1,
  "body": {
    "address": "19D61L7L1HDxGnSeTRi1CEhDt5pYj1pdqY",
    "star": {
      "dec": "68\u00b0 52' 56.9",
      "ra": "16h 29m 1.0s",
      "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
      "storyDecoded": "Found star using https:\/\/www.google.com\/sky\/"
    }
  },
  "time": "1556127968",
  "previousBlockHash": "e2aabc11e76970ffef2264f62f5161c7b1051f249a5f33be844837b7f9d83bd4"
}
```


## What do I learned with this Project

* I was able to write an API for my private block chain.
* I understood how digital rights can be managed on a blockchain platform.
