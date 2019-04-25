const { param, body, validationResult } = require('express-validator/check');
const bitcoinMessage = require('bitcoinjs-message'); 
const hex2ascii = require('hex2ascii');
const Block = require('./Block.js');
const BlockChain = require('./BlockChain.js');
const RequestObject = require('./RequestObject.js');
const ValidRequest = require('./ValidRequest.js');
const MemPool = require('./MemPool.js');

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app 
     */
    constructor(app) {
        this.app = app;
        this.blockChain = new BlockChain.BlockChain();
        this.mempool = new MemPool.MemPool();
        this.getBlockByHeight();
        this.getBlockByHash();
        this.getBlocksByAddress();
        this.postNewBlock();
        this.postNewValidation();
        this.postMessageValidate();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by height, url: "block/:blockHeight"
     */
    getBlockByHeight() {
        let self = this;
        this.app.get("/block/:blockHeight", 
        param('blockHeight')
            .isInt()
            .withMessage('Block height must be an integer')
            .custom(blockHeight => {
                if(blockHeight < 0) {
                    throw new Error('Block height less than 0')
                } else {
                    return true;
                }
            }), 
        (req, res) => {
            // Add your code here
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            let blockHeight = req.params["blockHeight"];
            
            this.blockChain.getBlockHeight().then((height) => {
                if(blockHeight > height) {
                    return res.status(400).json({ error: 'Specified block height out of range'});
                } 

                self.blockChain.getBlock(blockHeight).then((block) => {
                    if(block.body.star) {
                        block.body.star.storyDecoded = hex2ascii(block.body.star.story);
                    }
                    
                    return res.status(200).json(block);
                });                    
                
            });
        });
    }

    /** 
    * Implement a GET Endpoint to get a star block by hash, url: "/stars/hash:[HASH]"
    */
    getBlockByHash() {
        let self = this;
        this.app.get("/stars/hash::hash",  (req, res) => {
            let hash = req.params["hash"];
            this.blockChain.getBlockByHash(hash).then((block) => {
                if(!block) {
                    return res.sendStatus(404);
                }

                block.body.star.storyDecoded = hex2ascii(block.body.star.story);
                res.status(200).json(block);
            });
        });    
    }

    /** 
    * Implement a GET Endpoint to get star blocks by wallet address, url: "/stars/address:[ADDRESS]"
    */
    getBlocksByAddress() {
        let self = this;
        this.app.get("/stars/address::address",  (req, res) => {
            let address = req.params["address"];
            this.blockChain.getBlocksByKV("body.address", address).then((blocks) => {
                let decodedBlocks =  blocks.map(x => {
                    x.body.star.storyDecoded = hex2ascii(x.body.star.story);
                    return x;
                });
                res.status(200).json(decodedBlocks);
            });
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    /*
    postNewBlock() {
        this.app.post("/block", 
        body('body')
            .isLength({min: 1})
            .withMessage('Body of the request should contain a body field'), 
        (req, res) => {
            // Add your code here
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            
            this.blockChain.addBlock(new Block.Block(req.body["body"])).then((block) => {
                res.status(200).json(block);
            });           
        });
    }
    */
    postNewBlock() {
        let self = this;
        this.app.post("/block", 
        [
            body('address')
            .isLength({min: 1})
            .withMessage('Body of the request should contain a address field'),

            body('star')
            .withMessage('Body of the request should contain a star field')
            .custom(star => {
                if(Array.isArray(star)) {
                    throw new Error('A request can contain only 1 star');
                } else if(!star.hasOwnProperty("story")){
                    throw new Error('Star should have a story property');
                } else {
                    return true;
                }
            })
        ], 
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            
            let walletAddress = req.body["address"];
            if(!self.mempool.hasValid(walletAddress)) {
                return res.status(400).json({error: "No active valid request found for this address"});
            }

            let body = req.body;
            body.star.story = Buffer(body.star.story).toString('hex');

            this.blockChain.addBlock(new Block.Block(body)).then((block) => {
                self.mempool.removeValid(walletAddress);
                block.body.star.storyDecoded = hex2ascii(block.body.star.story);
                res.status(200).json(block);
            }); 
        });
    }   

    /** 
    * Implement a POST Endpoint to submit a validation request, url: "/requestValidation"
    */
    postNewValidation() {
        let self = this;
        this.app.post("/requestValidation", 
        body('address')
            .isLength({min: 1})
            .withMessage('Body of the request should contain a address field'),
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            let walletAddress = req.body["address"];

            if(!self.mempool.hasValidation(walletAddress)) {
                self.mempool.addValidation(walletAddress, new RequestObject.RequestObject(walletAddress, req.timestamp.unix().toString()));
            }            

            return res.status(200).json(self.mempool.getValidation(walletAddress));

        });
    }

    /** 
    * Implement a POST Endpoint to submit a message validation request, url: "/message-signature/validate"
    */
    postMessageValidate() {
        let self = this;
        this.app.post("/message-signature/validate", 
        [
            body('address')
            .isLength({min: 1})
            .withMessage('Body of the request should contain a address field'),

            body('signature')
            .isLength({min: 1})
            .withMessage('Body of the request should contain a signature field')
        ],
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            let walletAddress = req.body["address"];
            if(!self.mempool.hasValidation(walletAddress)) {
                return res.status(400).json({error: "No active validation request found for this address"});
            }

            let signature = req.body["signature"];
            let requestObject = self.mempool.getValidation(walletAddress);
        
            if (!bitcoinMessage.verify(requestObject.message, walletAddress, signature)) {
                return res.status(400).json({error: "Signature validation failed"});
            }
            
            self.mempool.removeValidation(walletAddress);

            self.mempool.addValid(
                walletAddress, 
                new ValidRequest.ValidRequest(walletAddress, requestObject.requestTimestamp)
            );

            res.status(200).json(self.mempool.getValid(walletAddress));

        });
    }
}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app);}