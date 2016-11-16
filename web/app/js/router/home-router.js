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
						console.log('Month: ' + m + ', year: ' + y);
					}
				});
			});
			avalon.scan(document.body);
		});

		avalon.router.add("/:index/:subIndex", function (index, subIndex) {
			console.log("test");
			if(avalon.vmodels['main']!=undefined){
				delete avalon.vmodels['main'];
			}

			var mainVm = avalon.define({
				$id: 'main',
				template: require('../../template/common-bank.html'),
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
						console.log('Month: ' + m + ', year: ' + y);
					}
				});
			});
			avalon.scan(document.body);
		});
	}
};