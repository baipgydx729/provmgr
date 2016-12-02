var depositoryBankModule = require("../module/depository-bank-module");

module.exports = {
    init: function(){
        avalon.router.add("/depository-bank", function (index, subIndex) {
            if(avalon.vmodels['main']!=undefined){
                delete avalon.vmodels['main'];
            }

            var mainVm = avalon.define({
                $id: 'main',
                template: require('../../template/depository-bank.html'),
                data: ""
            });

            mainVm.$watch('onReady', function(){
            });
            avalon.scan(document.body);
        });
    }
};