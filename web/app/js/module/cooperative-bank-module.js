var cooperativeBankService = require("../service/cooperative-bank-service");

module.exports = {
    getReportList: function (bankName) {
        var startDay;
        var endDay;

        if ($("#datetime-start").val()!=undefined && $("#datetime-end").val()!=undefined){
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
    }
};