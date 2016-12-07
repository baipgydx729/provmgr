var commonModule = require("../module/common-module");

module.exports = {
    getBankList: function (startDay, endDay) {
        var data = [];
        $.ajax({
            url: "/report/bank-account?start_day="+startDay+"&end_day="+endDay,
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
    getReportList: function (reportType, startDay, endDay, bankName, accountId) {
        var parameterList;
        if (reportType==0){
            parameterList = "start_day="+startDay+"&end_day="+endDay+"&report_type="+reportType;
        } else {
            parameterList = "bank_name="+bankName+"&account_id="+accountId+"&start_day="+startDay+"&end_day="+endDay+"&report_type="+reportType;
        }

        var data = [];
        $.ajax({
            url: "/report/pbc/list?"+parameterList,
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
    generateReport: function (reportList) {
        $.ajax({
            url: "/report/pbc/create",
            type: "POST",
            dataType: 'json',
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(reportList),
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
    submitReport: function(startDay, endDay) {
        $.ajax({
            url: "/report/pbc/submit?start_day="+startDay+"&end_day="+endDay,
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
    downloadable: function(bankName, accountId, startDay, endDay, reportName){
        var result = true;

        $.ajax({
            url: "/report/pbc/download?bank_name="+bankName
                    +"&account_id="+accountId
                    +"&start_day="+startDay
                    +"&end_day="+endDay
                    +"&report_name="+reportName,
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
    downloadableAll: function(startDay, endDay){
        var result = true;

        $.ajax({
            url: "/report/pbc/download-all?"
            +"&start_day="+startDay
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