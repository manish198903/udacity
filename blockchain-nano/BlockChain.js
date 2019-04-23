/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class BlockChain {

    constructor() {
        this.db = new LevelSandbox.LevelSandbox();
        this.generateGenesisBlock();       
    }

    // Helper method to create a Genesis Block (always with height= 0)
    // You have two options, because the method will always execute when you create your blockchain
    // you will need to set this up statically or instead you can verify if the height !== 0 then you
    // will not create the genesis block
    generateGenesisBlock(){
        // Add your code here
        let self = this;
        this.getBlockHeight().then((height) => {
            if(0 > height){
                self.addBlock(new Block.Block("First block in the chain - Genesis block")).then(function(data){
                    console.log("Genesis block added to the chain");
                });
            }
        }).catch((err) => {return err;});
        
    }

    // Get block height, it is a helper method that return the height of the blockchain
    getBlockHeight() {
        // Add your code here
        return this.db.getBlocksCount().then((count) => {return count - 1;});
    }

    // Add new block
    addBlock(block) {
        // Add your code here
        // UTC timestamp
        let self = this;
        
        return new Promise(function(resolve, reject){
            block.time = new Date().getTime().toString().slice(0,-3);
            self.getBlockHeight().then((height) => {
                block.height = height+1;
                
                if(block.height > 0) {
                    self.getBlock(block.height-1).then((prevBlock) => {
                        block.previousBlockHash = prevBlock.hash;
                        block.hash = SHA256(JSON.stringify(block)).toString();
                        self.db.addLevelDBData(block.height, JSON.stringify(block).toString()).then((blockAdded) => {
                            resolve(block);
                        }).catch((err) => { console.log(err); reject(err)});
                    });
                } else {
                    block.hash = SHA256(JSON.stringify(block)).toString();
                    self.db.addLevelDBData(block.height, JSON.stringify(block).toString()).then((blockAdded) => {
                        resolve(block);
                    }).catch((err) => { console.log(err); reject(err)});
                }                
                
            }, function(err) {
                console.log(err);
                reject(err);
            });
        });        
                
    }

    // Get Block By Height
    getBlock(height) {
        // Add your code here
        let self = this;
        return self.db.getLevelDBData(height).then((str_block) => { return JSON.parse(str_block);});
    }

    // Validate if Block is being tampered by Block Height
    validateBlock(height) {
        // Add your code here
        let self = this;
        
        return self.getBlock(height).then((block) => {
                let blockHash = block.hash;
                block.hash = '';
                let validBlockHash = SHA256(JSON.stringify(block)).toString();
                return (blockHash===validBlockHash);
                
            });
    }

    _validateBlockWithNext(height) {
        let self = this;
        let promises = [
            self.validateBlock(height),
            self.getBlock(height),
            self.getBlock(height+1)
        ]

        return Promise.all(promises).then((blockWithNext) => {
            if(!blockWithNext[0]){
                return false;
            }
            let block = blockWithNext[1];
            let nextBlock = blockWithNext[2];
            return(block.hash === nextBlock.previousBlockHash);
        });

    }

    // Validate Blockchain
    validateChain() {
        let self = this;  
        let promises = [];
        return self.getBlockHeight().then((height) => {
                for(let i=0; i<height; i++) {
                    promises.push(self._validateBlockWithNext(i));                    
                }
                promises.push(self.validateBlock(height));
                return Promise.all(promises);
            }).then((log) => {
                let errorLog = [];
                for(let i=0; i<log.length; i++){
                    if(!log[i]) {
                        errorLog.push(i);
                    }
                }
                return errorLog;
            });
        
    }
    

    // Utility Method to Tamper a Block for Test Validation
    // This method is for testing purpose
    _modifyBlock(height, block) {
        let self = this;
        return new Promise( (resolve, reject) => {
            self.db.addLevelDBData(height, JSON.stringify(block).toString()).then((blockModified) => {
                resolve(blockModified);
            }).catch((err) => { console.log(err); reject(err)});
        });
    }
   
}

module.exports.BlockChain = BlockChain;
