var commonModule = require("../module/common-module");

module.exports = {
    getBankList: function (startDay, endDay) {
        var data = null;
        $.ajax({
            url: "/report/bank-account?start_day="+startDay+"&end_day="+endDay,
            type: 'GET',
            async: false,
            dataType: 'json',
            success: function (response) {
                if (response.code == "200") {
                    data = response.data;
                }
            },
            error: function () {
                commonModule.errorModal("接口错误！");
            }
        });

        return data;
    }
}