require('../lib/jquery.monthpicker');

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
							label: "中国工商银行",
							value: "中国工商银行"
						},
						{
							label: "中国建设银行",
							value: "中国建设银行"
						},
						{
							label: "中国银行",
							value: "中国银行"
						},
						{
							label: "招商银行",
							value: "招商银行"
						}
					],
					accountList: [
						{
							accountName: "账户1",
							accountNo: "1"
						},
						{
							accountName: "账户2",
							accountNo: "2"
						},
						{
							accountName: "账户3",
							accountNo: "3"
						},
						{
							accountName: "账户4",
							accountNo: "4"
						}
					],
					selectedBankIndex: 0,
					selectedAccountIndex: 0,
					reportList: [
						{
							name: "表 1-1",
							value: "表 1-1",
							status: 1
						},
						{
							name: "表 1-2",
							value: "表 1-2",
							status: 1
						},
						{
							name: "表 1-3",
							value: "表 1-3",
							status: 0
						},
						{
							name: "表 1-6",
							value: "表 1-6",
							status: 1
						},
						{
							name: "表 1-9",
							value: "表 1-9",
							status: 0
						},
						{
							name: "表 1-10",
							value: "表 1-10",
							status: 1
						}
					],
					checkedReportIndexList: []
				},
				selectBank: function () {
					alert(document.getElementsByName("bank")[0].value);
				},
				selectAccount: function () {
					alert(document.getElementsByName("account")[0].value);
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
					//首先获取account列表

					//对每个account获取报表列表

					//判断所有报表的状态
					for(var i=0; i<mainVm.data.reportList.length; i++){
						if (mainVm.data.reportList[i].status==0){
							if(avalon.vmodels['error-controller']!=undefined){
								delete avalon.vmodels['error-controller'];
							}

							var errorVm = avalon.define({
								$id: 'error-controller',
								message: "账户XXX的"+mainVm.data.reportList[i].name+"未生成!"
							});

							var errorTemplate = require("../../template/error.html");

							$('#modal').html(errorTemplate).modal({fadeDuration: 100});
							avalon.scan(document.getElementById("modal").firstChild);

							break;
						}
					}
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

				var yearArray = [];
				for (var i = 0; i <50; i++) {
					yearArray.push(2000+i);
				}

				$('#monthpicker').monthpicker({
					years: yearArray,
					months: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
					topOffset: 6,
					onMonthSelect: function(month, year) {
						alert($('#monthpicker').html());
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
				var yearArray = [];
				for (var i = 0; i <50; i++) {
					yearArray.push(2000+i);
				}

				$('#monthpicker').monthpicker({
					years: yearArray,
					months: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
					topOffset: 6,
					onMonthSelect: function(m, y) {
						
					}
				});
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
							label: "中国工商银行",
							value: "中国工商银行"
						},
						{
							label: "中国建设银行",
							value: "中国建设银行"
						},
						{
							label: "中国银行",
							value: "中国银行"
						},
						{
							label: "招商银行",
							value: "招商银行"
						}
					],
					accountList: [
						{
							accountName: "账户1",
							accountNo: "1"
						},
						{
							accountName: "账户2",
							accountNo: "2"
						},
						{
							accountName: "账户3",
							accountNo: "3"
						},
						{
							accountName: "账户4",
							accountNo: "4"
						}
					],
					selectedBankIndex: 0,
					selectedAccountIndex: 0,
					reportList: [
						{
							name: "表 1-1",
							value: "表 1-1",
							status: 1
						},
						{
							name: "表 1-2",
							value: "表 1-2",
							status: 1
						},
						{
							name: "表 1-3",
							value: "表 1-3",
							status: 0
						},
						{
							name: "表 1-6",
							value: "表 1-6",
							status: 1
						},
						{
							name: "表 1-9",
							value: "表 1-9",
							status: 0
						},
						{
							name: "表 1-10",
							value: "表 1-10",
							status: 1
						}
					],
					checkedReportIndexList: []
				},
				selectBank: function () {
					alert(document.getElementsByName("bank")[0].value);
				},
				selectAccount: function () {
					alert(document.getElementsByName("account")[0].value);
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
					//首先获取account列表

					//对每个account获取报表列表

					//判断所有报表的状态
					for(var i=0; i<mainVm.data.reportList.length; i++){
						if (mainVm.data.reportList[i].status==0){
							if(avalon.vmodels['error-controller']!=undefined){
								delete avalon.vmodels['error-controller'];
							}

							var errorVm = avalon.define({
								$id: 'error-controller',
								message: "账户XXX的"+mainVm.data.reportList[i].name+"未生成!"
							});

							var errorTemplate = require("../../template/error.html");

							$('#modal').html(errorTemplate).modal({fadeDuration: 100});
							avalon.scan(document.getElementById("modal").firstChild);

							break;
						}
					}
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

				var yearArray = [];
				for (var i = 0; i <50; i++) {
					yearArray.push(2000+i);
				}

				$('#monthpicker').monthpicker({
					years: yearArray,
					months: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
					topOffset: 6,
					onMonthSelect: function(month, year) {
						alert($('#monthpicker').html());
					}
				});
			});
			avalon.scan(document.body);
		});
	}
};