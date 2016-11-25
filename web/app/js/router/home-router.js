var homeModule = require("../module/home-module");

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
					bankList: [
						{
							bank_name: "中国工商银行",
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
							bank_name: "中国建设银行",
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
					],
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
					reportList: [
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
					],
					checkedReportIndexList: []
				},
				selectBank: function () {
					mainVm.data.selectedBankIndex = document.getElementsByName("bank")[0].value;
				},
				selectAccount: function () {
					mainVm.data.selectedAccountIndex = document.getElementsByName("account")[0].value;
				},
				selectReportType: function(){
					mainVm.data.selectedReportTypeIndex = document.getElementsByName("report-type")[0].value;
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
				batchGenerate: function () {
					if (mainVm.data.checkedReportIndexList.length==0){
						if(avalon.vmodels['error-controller']!=undefined){
							delete avalon.vmodels['error-controller'];
						}

						var errorVm = avalon.define({
							$id: 'error-controller',
							message: "请选择您要生成的报表!"
						});

						var errorTemplate = require("../../template/error.html");

						$('#modal').html(errorTemplate).modal({fadeDuration: 100});
						avalon.scan(document.getElementById("modal").firstChild);
					} else {

					}
				},
				submit: function () {
					if($('#datetime-start').val()=='' || $('#datetime-end').val()==''){
						if(avalon.vmodels['error-controller']!=undefined){
							delete avalon.vmodels['error-controller'];
						}

						var errorVm = avalon.define({
							$id: 'error-controller',
							message: "请选择时间区间!"
						});

						var errorTemplate = require("../../template/error.html");

						$('#modal').html(errorTemplate).modal({fadeDuration: 100});
						avalon.scan(document.getElementById("modal").firstChild);

						return;
					}

					if(avalon.vmodels['submit-controller']!=undefined){
						delete avalon.vmodels['submit-controller'];
					}

					var submitVm = avalon.define({
						$id: 'submit-controller',
						submit: function () {
							alert("test");
						}
					});

					var submitTemplate = require("../../template/submit.html");

					$('#modal').html(submitTemplate).modal({fadeDuration: 100});
					avalon.scan(document.getElementById("modal").firstChild);
				},
				downloadAll: function () {

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
					}
				});
			});
			avalon.scan(document.body);
		});

		avalon.router.add("/depository-bank", function (index, subIndex) {
			if(avalon.vmodels['main']!=undefined){
				delete avalon.vmodels['main'];
			}

			var mainVm = avalon.define({
				$id: 'main',
				template: require('../../template/depository-bank.html'),
				data: ""
			});

			mainVm.$watch('onReady', function(){
			});
			avalon.scan(document.body);
		});

		avalon.router.add("/cooperative-bank", function (index, subIndex) {
			if(avalon.vmodels['main']!=undefined){
				delete avalon.vmodels['main'];
			}

			var mainVm = avalon.define({
				$id: 'main',
				template: require('../../template/cooperative-bank.html'),
				data: {
					bankList: [
						{
							bank_name: "中国工商银行",
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
							bank_name: "中国建设银行",
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
					],
					selectedBankIndex: 0,
					selectedAccountIndex: 0,
					reportList: [
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
					],
					checkedReportIndexList: []
				},
				selectBank: function () {
					mainVm.data.selectedBankIndex = document.getElementsByName("bank")[0].value;
				},
				selectAccount: function () {
					mainVm.data.selectedAccountIndex = document.getElementsByName("account")[0].value;
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
				batchGenerate: function () {
					if (mainVm.data.checkedReportIndexList.length==0){
						if(avalon.vmodels['error-controller']!=undefined){
							delete avalon.vmodels['error-controller'];
						}

						var errorVm = avalon.define({
							$id: 'error-controller',
							message: "请选择您要生成的报表!"
						});

						var errorTemplate = require("../../template/error.html");

						$('#modal').html(errorTemplate).modal({fadeDuration: 100});
						avalon.scan(document.getElementById("modal").firstChild);
					} else {

					}
				},
				submit: function () {
					if($('#datetime-start').val()=='' || $('#datetime-end').val()==''){
						if(avalon.vmodels['error-controller']!=undefined){
							delete avalon.vmodels['error-controller'];
						}

						var errorVm = avalon.define({
							$id: 'error-controller',
							message: "请选择时间区间!"
						});

						var errorTemplate = require("../../template/error.html");

						$('#modal').html(errorTemplate).modal({fadeDuration: 100});
						avalon.scan(document.getElementById("modal").firstChild);

						return;
					}

					if(avalon.vmodels['submit-controller']!=undefined){
						delete avalon.vmodels['submit-controller'];
					}

					var submitVm = avalon.define({
						$id: 'submit-controller',
						submit: function () {
							alert("test");
						}
					});

					var submitTemplate = require("../../template/submit.html");

					$('#modal').html(submitTemplate).modal({fadeDuration: 100});
					avalon.scan(document.getElementById("modal").firstChild);
				},
				downloadAll: function () {

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
					onShow:function(){
						this.setOptions({
							maxDate: $('#datetime-end').val() ? $('#datetime-end').val() : '+1970/01/01'
						});
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
					}
				});
			});
			avalon.scan(document.body);
		});
	}
};