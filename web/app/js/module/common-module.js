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
	}
};