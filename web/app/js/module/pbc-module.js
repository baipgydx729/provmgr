var pbcService = require("../service/pbc-service");

module.exports = {
	getBankList: function () {
	    if ($("#datetime-start").val()!=undefined && $("#datetime-end").val()!=undefined){
            pbcService.getBankList($("#datetime-start").val(), $("#datetime-end").val());
        } else {
            var dateObj = new Date();
            var year = dateObj.getFullYear();
            var month = dateObj.getMonth()+1;
            var day = dateObj.getDate();

            pbcService.getBankList(year+"-"+month+"-01", year+"-"+month+"-"+day);
        }

        return [
            {
                bank_name: "中国建设银行",
                account_list:[
                    {
                        account_id: "1000001",
                        account_no: "1000001",
                        account_name: "账户1"
                    },
                    {
                        account_id: "1000002",
                        account_no: "1000001",
                        account_name: "账户2"
                    }
                ]
            },
            {
                bank_name: "平安银行",
                account_list:[
                    {
                        account_id: "1000001",
                        account_no: "1000001",
                        account_name: "账户3"
                    },
                    {
                        account_id: "1000002",
                        account_no: "1000001",
                        account_name: "账户4"
                    }
                ]
            },
            {
                bank_name: "江苏银行",
                account_list:[
                    {
                        account_id: "1000001",
                        account_no: "1000001",
                        account_name: "账户3"
                    },
                    {
                        account_id: "1000002",
                        account_no: "1000001",
                        account_name: "账户4"
                    }
                ]
            },
            {
                bank_name: "浦发银行",
                account_list:[
                    {
                        account_id: "1000001",
                        account_no: "1000001",
                        account_name: "账户3"
                    },
                    {
                        account_id: "1000002",
                        account_no: "1000001",
                        account_name: "账户4"
                    }
                ]
            }
        ];
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
            pbcService.getReportList(reportType, startDay, endDay);
        } else {
	        if (bankName==undefined || accountId==undefined){
                return [];
            }

            pbcService.getReportList(reportType, startDay, endDay, bankName, accountId);
        }

        return [
            {
                bank_name: "中国工商银行",
                account_id: "1000001",
                account_no: "1000001",
                account_name: "账户1",
                report_name: "表1-1",
                report_status: 1
            },
            {
                bank_name: "中国工商银行",
                account_id: "1000001",
                account_no: "1000001",
                account_name: "账户1",
                report_name: "表1-2",
                report_status: 0
            },
            {
                bank_name: "中国工商银行",
                account_id: "1000001",
                account_no: "1000001",
                account_name: "账户1",
                report_name: "表1-3",
                report_status: 1
            },
            {
                bank_name: "中国工商银行",
                account_id: "1000001",
                account_no: "1000001",
                account_name: "账户1",
                report_name: "表1-6",
                report_status: 0
            },
            {
                bank_name: "中国工商银行",
                account_id: "1000001",
                account_no: "1000001",
                account_name: "账户1",
                report_name: "表1-9",
                report_status: 1
            },
            {
                bank_name: "中国工商银行",
                account_id: "1000001",
                account_no: "1000001",
                account_name: "账户1",
                report_name: "表1-10",
                report_status: 0
            }
        ];
    },
    generateReport: function(reportList){
        pbcService.generateReport(reportList);
    },
    submitReport: function(startDay, endDay){
        pbcService.submitReport(startDay, endDay);
    }
};