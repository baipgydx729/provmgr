var pbcModule = require("../module/pbc-module");
var commonModule = require("../module/common-module");

module.exports = {
	init: function(){
		avalon.router.add("/", function () {
			if(avalon.vmodels['main']!=undefined){
				delete avalon.vmodels['main'];
			}

			var mainVm = avalon.define({
				$id: 'main',
				template: require('../../template/pbc.html'),
				data: {
					bankList: pbcModule.getBankList(),
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
					reportList: pbcModule.getReportList(0),
					checkedReportIndexList: []
				},
				selectBank: function () {
					mainVm.data.selectedBankIndex = document.getElementsByName("bank")[0].value;
                    document.getElementsByName("account")[0].value = 0;
                    mainVm.data.selectedAccountIndex = 0;

                    mainVm.data.reportList = pbcModule.getReportList(
                        mainVm.data.selectedReportTypeIndex,
                        mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
                        mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id
                    );
				},
				selectAccount: function () {
					mainVm.data.selectedAccountIndex = document.getElementsByName("account")[0].value;

                    mainVm.data.reportList = pbcModule.getReportList(
                        mainVm.data.selectedReportTypeIndex,
                        mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
                        mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id
                    );
				},
				selectReportType: function(){
					mainVm.data.selectedReportTypeIndex = document.getElementsByName("report-type")[0].value;

                    mainVm.data.selectedBankIndex = 0;
                    document.getElementsByName("bank")[0].value = 0;

                    mainVm.data.selectedAccountIndex = 0;
                    document.getElementsByName("account")[0].value = 0;

					mainVm.data.reportList = pbcModule.getReportList(
                        mainVm.data.selectedReportTypeIndex,
						mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
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

					console.log(mainVm.data.checkedReportIndexList);
				},
                generate: function (index) {
                    var reportList={
                        start_day: $('#datetime-start').val(),
                        end_day: $('#datetime-end').val(),
                        report_type: mainVm.data.selectedReportTypeIndex,
                        report_list: []
                    };

                    if (mainVm.data.selectedReportTypeIndex==0){
						reportList.report_list.push({
							report_name: mainVm.data.reportList[index].report_name
						});
                    } else {
                        reportList.report_list.push({
                            bank_name: mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
                            account_id: mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id,
                            account_name: mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_name,
                            account_no: mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_no,
                            report_name: mainVm.data.reportList[index].report_name
                        });
					}

                    pbcModule.generateReport(reportList);
                },
				batchGenerate: function () {
					if (mainVm.data.checkedReportIndexList.length==0){
                        commonModule.errorModal("请选择您要生成的报表!");

                        return;
					}

					var reportList={
                        start_day: $('#datetime-start').val(),
                        end_day: $('#datetime-end').val(),
                        report_type: mainVm.data.selectedReportTypeIndex,
                        report_list: []
					};

                    if (mainVm.data.selectedReportTypeIndex==0) {
                        for (var i = 0; i < mainVm.data.checkedReportIndexList.length; i++) {
                            reportList.report_list.push({
                                report_name: mainVm.data.reportList[mainVm.data.checkedReportIndexList[i]].report_name
                            });
                        }
                    } else {
                        for (var i = 0; i < mainVm.data.checkedReportIndexList.length; i++) {
                            reportList.report_list.push({
                                bank_name: mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
                                account_id: mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id,
                                account_name: mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_name,
                                account_no: mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_no,
                                report_name: mainVm.data.reportList[mainVm.data.checkedReportIndexList[i]].report_name
                            });
                        }
					}

                    pbcModule.generateReport(reportList);
				},
				submit: function () {
					if($('#datetime-start').val()=='' || $('#datetime-end').val()==''){
                        commonModule.errorModal("请选择时间区间!");

						return;
					}

					if(avalon.vmodels['submit-controller']!=undefined){
						delete avalon.vmodels['submit-controller'];
					}

					var submitVm = avalon.define({
						$id: 'submit-controller',
                        checkReportFlag: 0,
						submit: function () {
                            pbcModule.submitReport($('#datetime-start').val(), $('#datetime-end').val());
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
                    pbcModule.download(
                        mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
                        mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id,
                        $('#datetime-start').val(),
                        $('#datetime-end').val(),
                        reportName
                    );
                },
				downloadAll: function () {
                    pbcModule.downloadAll(
                        $('#datetime-start').val(),
                        $('#datetime-end').val()
                    );
				},
				filter: function () {
					//此处需要调用接口重新获取列表

					if($('#filter').val()!=''){
						for(var i=0; i<mainVm.data.reportList.length; i++){
							if (mainVm.data.reportList[i].report_name.indexOf($('#filter').val())<0){
								mainVm.data.reportList.splice(i, 1);
								i=i-1;
							}
						}
					}
				}
			});

			mainVm.$watch('onReady', function(){
				$("#filter").keydown(function(event){
					if(event.which == "13"){
						mainVm.filter();
					}
				});

				$.datetimepicker.setLocale('ch');

				$('#datetime-start').datetimepicker({
					timepicker:false,
					format:'Y-m-d',
					maxDate:'+1970/01/01',
					onShow:function(){
						this.setOptions({
							maxDate: $('#datetime-end').val() ? $('#datetime-end').val() : '+1970/01/01'
						});
					},
                    onSelectDate: function(){
                        mainVm.data.reportList = pbcModule.getReportList(
                            mainVm.data.selectedReportTypeIndex,
                            mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
                            mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id
                        );
                    }
				});

				$('#datetime-end').datetimepicker({
					timepicker:false,
					format:'Y-m-d',
					maxDate:'+1970/01/01',
					onShow:function(){
						this.setOptions({
							minDate: $('#datetime-start').val() ? $('#datetime-start').val() : false
						});
					},
                    onSelectDate: function(){
                        mainVm.data.reportList = pbcModule.getReportList(
                            mainVm.data.selectedReportTypeIndex,
                            mainVm.data.bankList[mainVm.data.selectedBankIndex].bank_name,
                            mainVm.data.bankList[mainVm.data.selectedBankIndex].account_list[mainVm.data.selectedAccountIndex].account_id
                        );
                    }
				});

                var dateObj = new Date();
                var year = dateObj.getFullYear();
                var month = dateObj.getMonth()+1;
                var day = dateObj.getDate();

                $("#datetime-start").val(year+"-"+month+"-01");
                $("#datetime-end").val(year+"-"+month+"-"+day);
			});

			avalon.scan(document.body);
		});
	}
};