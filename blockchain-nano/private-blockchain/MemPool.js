const TimeoutRequestsWindowTime = 5*60*1000;
const TimeoutValidRequestsWindowTime = 30*60*1000;

class MemPool {
    constructor() {
        this.mempoolValidation = new Map();
        this.timeoutRequestsValidation = new Map();

        this.mempoolValid = new Map();        
        this.timeoutRequestsValid = new Map();
    }    

    /**
     * Implement a function to check whether a wallet address is in the validation mempool
     * @param {*} walletAddress
     */
    hasValidation(walletAddress) {
        return (walletAddress in this.mempoolValidation);
    }

    /**
     * Implement a function to get a  validation message from the mempool
     * @param {*} walletAddress
     */
    getValidation(walletAddress) {
        let requestObject = this.mempoolValidation[walletAddress];
        let timeElapse = (new Date().getTime().toString().slice(0,-3)) - parseInt(requestObject.requestTimestamp);
        let timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse;

        requestObject.validationWindow = timeLeft;
        return requestObject;
    }

    /**
     * Implement a function to remove a wallet address from the validation pool
     * @param {*} walletAddress
     */
    removeValidation(walletAddress) {
        delete this.mempoolValidation[walletAddress];
        delete this.timeoutRequestsValidation[walletAddress];
    }

    /**
     * Implement a function to add a validation message to the validation pool
     */
    addValidation(walletAddress, requestObject) {
        let self = this;
        this.mempoolValidation[walletAddress] = requestObject;
        this.timeoutRequestsValidation[walletAddress]=setTimeout(function(){ self.removeValidation(walletAddress) }, TimeoutRequestsWindowTime );
    }

    /**
     * Implement a function to check whether a wallet address is in the valid mempool
     * @param {*} walletAddress
     */
    hasValid(walletAddress) {
        return (walletAddress in this.mempoolValid);
    }

    /**
     * Implement a function to get a  valid message from the mempool
     * @param {*} walletAddress
     */
    getValid(walletAddress) {
        let validRequest = this.mempoolValid[walletAddress];
        let timeElapse = (new Date().getTime().toString().slice(0,-3)) - parseInt(validRequest.status.requestTimestamp);
        let timeLeft = (TimeoutValidRequestsWindowTime/1000) - timeElapse;

        validRequest.status.validationWindow = timeLeft;
        return validRequest;
    }

    /**
     * Implement a function to remove a wallet address from the valid mempool
     * @param {*} walletAddress
     */
    removeValid(walletAddress) {
        delete this.mempoolValid[walletAddress];
        delete this.timeoutRequestsValid[walletAddress];
    }

    /**
     * Implement a function to add a valid message to the valid pool
     */
    addValid(walletAddress, validRequest) {
        let self = this;
        this.mempoolValid[walletAddress] = validRequest;
        this.timeoutRequestsValid[walletAddress]=setTimeout(function(){ self.removeValid(walletAddress) }, TimeoutValidRequestsWindowTime);
    }

}

module.exports.MemPool = MemPool;