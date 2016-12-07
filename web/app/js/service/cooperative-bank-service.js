var commonModule = require("../module/common-module");

module.exports = {
    getReportList: function (bankName, startDay, endDay) {
        var data = [];
        $.ajax({
            url: "/report/"+commonModule.getBankAbbreviation(bankName)+"/list?start_day="+startDay+"&end_day="+endDay,
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
        $.ajax({
            url: "/report/"+commonModule.getBankAbbreviation(bankName)+"/create",
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
    downloadable: function(bankName, startDay, endDay, reportName){
        var result = true;

        $.ajax({
            url: "/report/"+commonModule.getBankAbbreviation(bankName)
                    +"/download?start_day="+startDay
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