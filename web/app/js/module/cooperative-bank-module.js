var cooperativeBankService = require("../service/cooperative-bank-service");
var commonModule = require("./common-module");

module.exports = {
    getReportList: function (bankName) {
        var startDay;
        var endDay;

        if ($("#datetime-start").val()!=undefined
            && $("#datetime-start").val()!=""
            && $("#datetime-end").val()!=undefined
            && $("#datetime-end").val()!=""
        ){
            startDay = $("#datetime-start").val();
            endDay = $("#datetime-end").val();
        } else {
            var dateObj = new Date();
            var year = dateObj.getFullYear();
            var month = dateObj.getMonth()+1;
            var day = dateObj.getDate();

            startDay = year+"-"+month+"-01";
            endDay = year+"-"+month+"-"+day;
        }

        return cooperativeBankService.getReportList(bankName, startDay, endDay);
    },
    generateReport: function(bankName, reportList){
        cooperativeBankService.generateReport(bankName, reportList);
    },
    submitReport: function(bankName, startDay, endDay){
        cooperativeBankService.submitReport(bankName, startDay, endDay);
    },
    download: function (bankName, startDay, endDay, reportName) {
        if (cooperativeBankService.downloadable(bankName, startDay, endDay, reportName)){
            window.open(
                "/report/"+commonModule.getBankAbbreviation(bankName)
                +"/download?start_day="+startDay
                +"&end_day="+endDay
                +"&report_name="+reportName
            );
        }
    },
    downloadAll: function (bankName, startDay, endDay) {
        if (cooperativeBankService.downloadableAll(bankName, startDay, endDay)){
            window.open(
                "/report/"+commonModule.getBankAbbreviation(bankName)
                +"/download-all?start_day="+startDay
                +"&end_day="+endDay
            );
        }
    }
};