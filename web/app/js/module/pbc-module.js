var commonModule = require("./common-module");
var pbcService = require("../service/pbc-service");

module.exports = {
	getBankList: function () {
        var year;
        var month;

	    if ($('#monthpicker').html()!=undefined && $('#monthpicker').html()!=''){
            year = $('#monthpicker').html().split("-")[0];
            month = $('#monthpicker').html().split("-")[1];
        } else {
            var dateObj = new Date();
            year = dateObj.getFullYear();
            month = dateObj.getMonth()+1;
        }

        return pbcService.getBankList(
            commonModule.getStartDay(year, month),
            commonModule.getEndDay(year, month)
        );
    },
    getReportList: function (reportType, bankName, accountId) {
        var year;
        var month;

        if ($('#monthpicker').html()!=undefined && $('#monthpicker').html()!=''){
            year = $('#monthpicker').html().split("-")[0];
            month = $('#monthpicker').html().split("-")[1];
        } else {
            var dateObj = new Date();
            year = dateObj.getFullYear();
            month = dateObj.getMonth()+1;
        }

        var startDay = commonModule.getStartDay(year, month);
        var endDay = commonModule.getEndDay(year, month);

	    if (reportType==0){
            return pbcService.getReportList(reportType, startDay, endDay);
        } else {
            return pbcService.getReportList(reportType, startDay, endDay, bankName, accountId);
        }
    },
    generateReport: function(reportList){
        return pbcService.generateReport(reportList);
    },
    submitReport: function(startDay, endDay){
        pbcService.submitReport(startDay, endDay);
    },
    download: function (reportType, bankName, accountId, startDay, endDay, reportName) {
        if (pbcService.downloadable(reportType, bankName, accountId, startDay, endDay, reportName)){
            if (reportType==0) {
                window.open(
                    "/report/pbc/download?report_type=" + reportType
                    + "&start_day=" + startDay
                    + "&end_day=" + endDay
                    + "&report_name=" + reportName
                );
            } else {
                window.open(
                    "/report/pbc/download?report_type=" + reportType
                    +"&bank_name=" + bankName
                    + "&account_id=" + accountId
                    + "&start_day=" + startDay
                    + "&end_day=" + endDay
                    + "&report_name=" + reportName
                );
            }
        }
    },
    downloadAll: function (startDay, endDay) {
        if (pbcService.downloadableAll(startDay, endDay)){
            window.open(
                "/report/pbc/download-all?"
                +"&start_day="+startDay
                +"&end_day="+endDay
            );
        }
    }
};