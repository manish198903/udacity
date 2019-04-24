/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {

    constructor() {
        this.db = level(chainDB);
    }

    // Get data from levelDB with key (Promise)
    getLevelDBData(key){
        let self = this;
        return new Promise(function(resolve, reject) {
            // Add your code here, remember in Promises you need to resolve() or reject()
            self.db.get(key, function(err, value) {
                if (err) reject(err);
                resolve(value);
              })
        });
    }

    // Get data from levelDB by a specific key value combo (Promise)
    getLevelDBDataByKV(key, value) {
        let self = this;
        let blocks = [];

        //assume simple keys
        let keyParts = key.split(".");

        return new Promise(function(resolve, reject){
            // Add your code here, remember in Promises you need to resolve() or reject()
            self.db.createReadStream().on('data', function(data) {

                let currentValue = JSON.parse(data.value);                

                for(var i=0; i<keyParts.length; i++) {
                    currentValue = currentValue[keyParts[i]]; 
                    if(!currentValue) return;
                }
                if(currentValue === value){
                    blocks.push(data.value);
                }
              }).on('error', function(err) {
                reject(err);
              }).on('close', function() {
                resolve(blocks);
              });
        });
    }

    // Add data to levelDB with key and value (Promise)
    addLevelDBData(key, value) {
        let self = this;
        return new Promise(function(resolve, reject) {
            // Add your code here, remember in Promises you need to resolve() or reject()
            self.db.put(key, value, function(err) {
                if (err) reject(err);
                console.log("Key: " + key + " Value: " + value + " added.");
                resolve(true);
            })
        });
    }

    // Method that return the height
    getBlocksCount() {
        let self = this;
        return new Promise(function(resolve, reject){
            // Add your code here, remember in Promises you need to resolve() or reject()
            let i = 0;
            self.db.createKeyStream().on('data', function(data) {
                i++;
              }).on('error', function(err) {
                reject(err);
              }).on('close', function() {
                resolve(i);
              });
        });
    }
        

}

module.exports.LevelSandbox = LevelSandbox;
