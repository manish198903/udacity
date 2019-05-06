/* ===== Status Class ==============================
|  Class with a constructor for Status 			   |
|  ===============================================*/

class Status {
	constructor(walletAddress, requestTimestamp){
		this.address = walletAddress;
		this.requestTimestamp = requestTimestamp;
		this.message = walletAddress + ':' + requestTimestamp + ':starRegistry';
		this.validationWindow = 0;
        this.messageSignature = true;
	}
}
/* ===== RequestObject Class ==============================
|  Class with a constructor for ValidRequest 			   |
|  ===============================================*/

class ValidRequest {
	constructor(walletAddress, requestTimestamp){
        this.registerStar = true;
		this.status = new Status(walletAddress, requestTimestamp)
	}
}

module.exports.ValidRequest = ValidRequest;