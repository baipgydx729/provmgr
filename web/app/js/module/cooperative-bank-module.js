var cooperativeBankService = require("../service/cooperative-bank-service");
var commonModule = require("./common-module");

module.exports = {
    getReportList: function (bankName, reportType, accountId) {
        if ($('#monthpicker').html()!=undefined && $('#monthpicker').html()!=''){
            var year = $('#monthpicker').html().split("-")[0];
            var month = $('#monthpicker').html().split("-")[1];

            startDay = commonModule.getStartDay(year, month);
            endDay = commonModule.getEndDay(year, month);
        } else {
            var dateObj = new Date();
            var year = dateObj.getFullYear();
            var month = dateObj.getMonth()+1;

            startDay = commonModule.getStartDay(year, month);
            endDay = commonModule.getEndDay(year, month);
        }

        return cooperativeBankService.getReportList(bankName, reportType, accountId, startDay, endDay);
    },
    generateReport: function(bankName, reportList){
        return cooperativeBankService.generateReport(bankName, reportList);
    },
    submitReport: function(bankName, startDay, endDay){
        cooperativeBankService.submitReport(bankName, startDay, endDay);
    },
    download: function (bankName, reportType, accountId, startDay, endDay, reportName) {
        if (cooperativeBankService.downloadable(bankName, reportType, accountId, startDay, endDay, reportName)){
            var url =null;
            if (bankName=="中国建设银行"){
                if(reportType==0){
                    url = "/report/"+commonModule.getBankAbbreviation(bankName)
                        +"/download?report_type="+reportType
                        +"&start_day="+startDay
                        +"&end_day="+endDay
                        +"&report_name="+reportName;
                }else {
                    url = "/report/"+commonModule.getBankAbbreviation(bankName)
                        +"/download?report_type="+reportType
                        +"&account_id="+accountId
                        +"&start_day="+startDay
                        +"&end_day="+endDay
                        +"&report_name="+reportName;
                }
            }else {
                url = "/report/"+commonModule.getBankAbbreviation(bankName)
                    +"/download?start_day="+startDay
                    +"&end_day="+endDay
                    +"&report_name="+reportName;
            }

            window.open(url);
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