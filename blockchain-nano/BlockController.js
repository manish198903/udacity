const { param, body, validationResult } = require('express-validator/check');
const SHA256 = require('crypto-js/sha256');
const Block = require('./Block.js');
const BlockChain = require('./BlockChain.js');

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
        this.getBlockByIndex();
        this.postNewBlock();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
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
            let self = this;
            this.blockChain.getBlockHeight().then((height) => {
                if(blockHeight > height) {
                    return res.status(400).json({ error: 'Specified block height out of range'});
                } 

                self.blockChain.getBlock(blockHeight).then((block) => {
                    return res.json(block);
                });                    
                
            });
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
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
}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app);}