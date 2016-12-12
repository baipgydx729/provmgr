var commonModule = require("../module/common-module");

module.exports = {
    getReportList: function (bankName, reportType, accountId, startDay, endDay) {
        var data = [];

        var url =null;
        if (bankName=="中国建设银行" || bankName=="中信银行"){
            if(reportType==0){
                url = "/report/"+commonModule.getBankAbbreviation(bankName)
                        +"/list?report_type="+reportType
                        +"&start_day="+startDay
                        +"&end_day="+endDay;
            }else {
                url = "/report/"+commonModule.getBankAbbreviation(bankName)
                    +"/list?report_type="+reportType
                    +"&account_id="+accountId
                    +"&start_day="+startDay
                    +"&end_day="+endDay;
            }
        }else {
            url = "/report/"+commonModule.getBankAbbreviation(bankName)
                    +"/list?start_day="+startDay
                    +"&end_day="+endDay;
        }

        $.ajax({
            url: url,
            type: 'GET',
            async: false,
            dataType: 'json',
            success: function (response) {
                if (response.code == 200) {
                    data = response.data;
                }
            },
            error: function () {
                commonModule.errorModal("接口错误！");
            }
        });

        return data;
    },
    generateReport: function (bankName, reportList) {
        var result = false;

        $.ajax({
            url: "/report/"+commonModule.getBankAbbreviation(bankName)+"/create",
            type: "POST",
            async: false,
            dataType: 'json',
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(reportList),
            success: function (data) {
                if (data.code == 200) {
                    commonModule.infoModal(data.message);
                    result = true;
                } else if (data.code == 400) {
                    commonModule.errorModal(data.message);
                }
            },
            error: function () {
                commonModule.errorModal("接口错误！");
            }
        });

        return result;
    },
    submitReport: function(bankName, startDay, endDay) {
        $.ajax({
            url: "/report/"+commonModule.getBankAbbreviation(bankName)+"/submit?start_day="+startDay+"&end_day="+endDay,
            type: "POST",
            dataType: 'json',
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.code == 200) {
                    commonModule.infoModal(data.message);
                } else if (data.code == 400) {
                    commonModule.errorModal(data.message);
                }
            },
            error: function () {
                commonModule.errorModal("接口错误！");
            }
        });
    },
    downloadable: function(bankName, reportType, accountId, startDay, endDay, reportName){
        var result = true;

        var url =null;
        if (bankName=="中国建设银行" || bankName=="中信银行"){
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

        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            async: false,
            timeout : 5000,
            success: function (response) {
                if (response.code == 400) {
                    commonModule.errorModal(response.message);

                    result=false;
                }
            }
        });

        return result;
    },
    downloadableAll: function(bankName, startDay, endDay){
        var result = true;

        $.ajax({
            url: "/report/"+commonModule.getBankAbbreviation(bankName)
                    +"/download-all?start_day="+startDay
                    +"&end_day="+endDay,
            type: 'GET',
            dataType: 'json',
            async: false,
            timeout : 5000,
            success: function (response) {
                if (response.code == 400) {
                    commonModule.errorModal(response.message);

                    result=false;
                }
            }
        });

        return result;
    }
}