/* ===== RequestObject Class ==============================
|  Class with a constructor for RequestObject 			   |
|  ===============================================*/

class RequestObject {
	constructor(walletAddress, requestTimestamp){
		this.walletAddress = walletAddress,
		this.requestTimestamp = requestTimestamp,
		this.message = walletAddress + ':' + requestTimestamp + ':starRegistry',
		this.validationWindow = 0
	}
}

module.exports.RequestObject = RequestObject;