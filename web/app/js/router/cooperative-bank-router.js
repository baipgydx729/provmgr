var pbcModule = require("../module/pbc-module");
var cooperativeBankModule = require("../module/cooperative-bank-module");
var commonModule = require("../module/common-module");

module.exports = {
    init: function(){
        avalon.router.add("/cooperative-bank", function () {
            if(avalon.vmodels['main']!=undefined){
                delete avalon.vmodels['main'];
            }

            var mainVm = avalon.define({
                $id: 'main',
                template: require('../../template/cooperative-bank.html'),
                data: {
                    bankList: [],
                    selectedBankIndex: 0,
                    selectedAccountIndex: 0,
                    reportTypeList: [
                        {
                            label: "汇总报表"
                        },
                        {
                            label: "账户报表"
                        }
                    ],
                    selectedReportTypeIndex: 0,
                    reportList: [],
                    checkedReportIndexList: []
                },
                selectBank: function () {
                    mainVm.data.selectedBankIndex = document.getElementsByName("bank")[0].value;
                    mainVm.data.reportList = cooperativeBankModule.getReportList(
                        mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
                        mainVm.data.selectedReportTypeIndex,
                        mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id
                    );
                },
                selectAccount: function () {
                    mainVm.data.selectedAccountIndex = document.getElementsByName("account")[0].value;

                    mainVm.data.reportList = cooperativeBankModule.getReportList(
                        mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
                        mainVm.data.selectedReportTypeIndex,
                        mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id
                    );
                },
                selectReportType: function(){
                    mainVm.data.selectedReportTypeIndex = document.getElementsByName("report-type")[0].value;

                    if (mainVm.data.selectedReportTypeIndex==1) {
                        mainVm.data.selectedAccountIndex = 0;
                        document.getElementsByName("account")[0].value = 0;
                    }

                    mainVm.data.reportList = cooperativeBankModule.getReportList(
                        mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
                        mainVm.data.selectedReportTypeIndex,
                        mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id
                    );
                },
                checkAll: function () {
                    mainVm.data.checkedReportIndexList=[];

                    if(document.getElementsByName("check-all")[0].checked){
                        for(var i=0; i<mainVm.data.reportList.length; i++){
                            mainVm.data.checkedReportIndexList.push(i);
                        }

                        for(var i=0; i<document.getElementsByName("check-one").length; i++){
                            document.getElementsByName("check-one")[i].checked = true;
                        }
                    } else {
                        for(var i=0; i<document.getElementsByName("check-one").length; i++){
                            document.getElementsByName("check-one")[i].checked = false;
                        }
                    }
                },
                checkOne: function () {
                    mainVm.data.checkedReportIndexList=[];

                    for(var i=0; i<document.getElementsByName("check-one").length; i++){
                        if (document.getElementsByName("check-one")[i].checked) {
                            mainVm.data.checkedReportIndexList.push(i);
                        }
                    }
                },
                generate: function (index) {
                    var year = $('#monthpicker').html().split("-")[0];
                    var month = $('#monthpicker').html().split("-")[1];

                    var reportList={
                        start_day: commonModule.getStartDay(year, month),
                        end_day: commonModule.getEndDay(year, month),
                        report_list: []
                    };

                    if (mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name=="中国建设银行"){
                        reportList.report_type = mainVm.data.selectedReportTypeIndex;
                    }

                    if (mainVm.data.selectedReportTypeIndex==1) {
                        reportList.report_list.push({
                            account_id: mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id,
                            account_name: mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_name,
                            account_no: mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_no,
                            report_name: mainVm.data.reportList[index].report_name
                        });
                    } else {
                        reportList.report_list.push({
                            report_name: mainVm.data.reportList[index].report_name
                        });
                    }

                    var result = cooperativeBankModule.generateReport(
                        mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
                        reportList
                    );

                    if (result) {
                        mainVm.data.reportList = cooperativeBankModule.getReportList(
                            mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
                            mainVm.data.selectedReportTypeIndex,
                            mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id
                        );
                    }
                },
                batchGenerate: function () {
                    if (mainVm.data.checkedReportIndexList.length==0){
                        commonModule.errorModal("请选择您要生成的报表!");

                        return ;
                    }

                    var year = $('#monthpicker').html().split("-")[0];
                    var month = $('#monthpicker').html().split("-")[1];

                    var reportList={
                        start_day: commonModule.getStartDay(year, month),
                        end_day: commonModule.getEndDay(year, month),
                        report_list: []
                    };

                    if (mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name=="中国建设银行"){
                        reportList.report_type = mainVm.data.selectedReportTypeIndex;
                    }

                    if (mainVm.data.selectedReportTypeIndex==1) {
                        for (var i = 0; i < mainVm.data.checkedReportIndexList.length; i++) {
                            reportList.report_list.push({
                                account_id: mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id,
                                account_name: mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_name,
                                account_no: mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_no,
                                report_name: mainVm.data.reportList[mainVm.data.checkedReportIndexList[i]].report_name
                            });
                        }
                    } else {
                        for (var i = 0; i < mainVm.data.checkedReportIndexList.length; i++) {
                            reportList.report_list.push({
                                report_name: mainVm.data.reportList[mainVm.data.checkedReportIndexList[i]].report_name
                            });
                        }
                    }

                    var result = cooperativeBankModule.generateReport(
                        mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
                        reportList
                    );

                    if (result) {
                        mainVm.data.reportList = cooperativeBankModule.getReportList(
                            mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
                            mainVm.data.selectedReportTypeIndex,
                            mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id
                        );
                    }
                },
                submit: function () {
                    if($('#monthpicker').html()==''){
                        commonModule.errorModal("请选择月份!");

                        return;
                    }

                    if(avalon.vmodels['submit-controller']!=undefined){
                        delete avalon.vmodels['submit-controller'];
                    }

                    var year = $('#monthpicker').html().split("-")[0];
                    var month = $('#monthpicker').html().split("-")[1];

                    var submitVm = avalon.define({
                        $id: 'submit-controller',
                        checkReportFlag: 0,
                        submit: function () {
                            cooperativeBankModule.submitReport(
                                mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
                                commonModule.getStartDay(year, month),
                                commonModule.getEndDay(year, month)
                            );
                        },
                        checkReport: function () {
                            if (document.getElementsByName("check-report")[0].checked) {
                                submitVm.checkReportFlag=1;
                            } else {
                                submitVm.checkReportFlag=0;
                            }
                        }
                    });

                    var submitTemplate = require("../../template/submit.html");

                    $('#modal').html(submitTemplate).modal({fadeDuration: 100});
                    avalon.scan(document.getElementById("modal").firstChild);
                },
                download: function (reportName) {
                    var year = $('#monthpicker').html().split("-")[0];
                    var month = $('#monthpicker').html().split("-")[1];

                    cooperativeBankModule.download(
                        mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
                        mainVm.data.selectedReportTypeIndex,
                        mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id,
                        commonModule.getStartDay(year, month),
                        commonModule.getEndDay(year, month),
                        reportName
                    );
                },
                downloadAll: function () {
                    var year = $('#monthpicker').html().split("-")[0];
                    var month = $('#monthpicker').html().split("-")[1];

                    cooperativeBankModule.downloadAll(
                        mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
                        commonModule.getStartDay(year, month),
                        commonModule.getEndDay(year, month)
                    );
                },
                filter: function () {
                    //此处需要调用接口重新获取列表

                    if($('#filter').val()!=''){
                        for(var i=0; i<mainVm.data.reportList.length; i++){
                            if (mainVm.data.reportList[i].name.indexOf($('#filter').val())<0){
                                mainVm.data.reportList.splice(i, 1);
                                i=i-1;
                            }
                        }
                    }
                },
                getOKBankList: function () {
                    var okBankNameList = ["中国建设银行", "平安银行", "江苏银行", "上海浦东发展银行"];
                    var okBankList = [];

                    var allBankList = pbcModule.getBankList();

                    for (var i=0; i<allBankList.length; i++){
                        if (okBankNameList.indexOf(allBankList[i].bank_name)>=0){
                            okBankList.push(allBankList[i]);
                        }
                    }

                    return okBankList;
                }
            });

            mainVm.data.bankList = mainVm.getOKBankList();
            mainVm.data.reportList = cooperativeBankModule.getReportList(
                mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
                mainVm.data.selectedReportTypeIndex,
                mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id
            );

            mainVm.$watch('onReady', function(){
                $("#filter").keydown(function(event){
                    if(event.which == "13"){
                        mainVm.filter();
                    }
                });

                var dateObj = new Date();
                var currentYear = dateObj.getFullYear();

                var years = []
                for (var i=0; i<=currentYear-2008; i++){
                    years.push(currentYear-i);
                }

                $('#monthpicker').monthpicker({
                    years: years,
                    topOffset: 6,
                    onMonthSelect: function(month, year) {
                        mainVm.data.reportList = cooperativeBankModule.getReportList(
                            mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
                            mainVm.data.selectedReportTypeIndex,
                            mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id
                        );
                    }
                });
            });
            avalon.scan(document.body);
        });
    }
};