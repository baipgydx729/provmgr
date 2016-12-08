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
    infoModal: function(infoMessage) {
        if(avalon.vmodels['info-controller']!=undefined){
            delete avalon.vmodels['info-controller'];
        }

        var infoVm = avalon.define({
            $id: 'info-controller',
            message: ''
        });

        infoVm.message = infoMessage;
        var infoTemplate = require("../../template/info.html");

        $('#modal').html(infoTemplate).modal({fadeDuration: 100});
        avalon.scan(document.getElementById("modal").firstChild);
    },
	getBankAbbreviation: function (bankName) {
		var bankList = [
            {name: "中国建设银行", abbreviation: "ccb"},
            {name: "平安银行", abbreviation: "pab"},
            {name: "江苏银行", abbreviation: "bojs"},
            {name: "上海浦东发展银行", abbreviation: "spdb"}
		];

		for (var i=0; i<bankList.length; i++){
			if (bankList[i].name==bankName){
				return bankList[i].abbreviation;
			}
		}

		return null;
    },
    getStartDay: function(year, month){
        return year+"-"+month+"-01";
    },
	getEndDay: function(year, month){
		var total = new Date(year, month, 0).getDate();

		return year+"-"+month+"-"+total;
	}
};