var pbcService = require("../service/pbc-service");

module.exports = {
	getBankList: function () {
	    if ($("#datetime-start").val()!=undefined && $("#datetime-end").val()!=undefined){
            return pbcService.getBankList($("#datetime-start").val(), $("#datetime-end").val());
        } else {
            var dateObj = new Date();
            var year = dateObj.getFullYear();
            var month = dateObj.getMonth()+1;
            var day = dateObj.getDate();

            return pbcService.getBankList(year+"-"+month+"-01", year+"-"+month+"-"+day);
        }
    },
    getReportList: function (reportType, bankName, accountId) {
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

	    if (reportType==0){
            return pbcService.getReportList(reportType, startDay, endDay);
        } else {
	        if (bankName==undefined || accountId==undefined){
                return [];
            }

            return pbcService.getReportList(reportType, startDay, endDay, bankName, accountId);
        }
    },
    generateReport: function(reportList){
        pbcService.generateReport(reportList);
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