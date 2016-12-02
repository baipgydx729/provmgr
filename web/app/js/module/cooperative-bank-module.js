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

        cooperativeBankService.getReportList(bankName, startDay, endDay);

        return [
            {
                report_name: "表1-1",
                report_status: 1
            },
            {
                report_name: "表1-2",
                report_status: 0
            },
            {
                report_name: "表1-3",
                report_status: 1
            },
            {
                report_name: "表1-6",
                report_status: 0
            },
            {
                report_name: "表1-9",
                report_status: 1
            },
            {
                report_name: "表1-10",
                report_status: 0
            }
        ];
    },
    generateReport: function(bankName, reportList){
        cooperativeBankService.generateReport(bankName, reportList);
    },
    submitReport: function(bankName, startDay, endDay){
        cooperativeBankService.submitReport(bankName, startDay, endDay);
    }
};