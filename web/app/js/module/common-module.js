module.exports = {
	errorModal: function(errorMessage) {
		if(avalon.vmodels['error-controller']!=undefined){
    		delete avalon.vmodels['error-controller'];
    	}

    	var errorVm = avalon.define({
		    $id: 'error-controller',
		    message: ''
		});

    	errorVm.message = errorMessage;
    	var errorTemplate = require("../../template/error.html");
    	
    	$('#modal').html(errorTemplate).modal({fadeDuration: 100});
    	avalon.scan(document.getElementById("modal").firstChild);
	},
	getBankAbbreviation: function (bankName) {
		var bankList = [
			{name: "中国人民银行", abbreviation: "pbc"},
            {name: "中国建设银行", abbreviation: "ccb"},
            {name: "平安银行", abbreviation: "pab"},
            {name: "江苏银行", abbreviation: "bojs"},
            {name: "浦发银行", abbreviation: "spdb"}
		];

		for (var i=0; i<bankList.length; i++){
			if (bankList[i].name==bankName){
				return bankList[i].abbreviation;
			}
		}

		return null;
    }
};