package com.qdb.provmgr.controller.report;

import com.qdb.provmgr.common.TableNameConstant;
import com.qdb.provmgr.dao.entity.report.DataTable3Entity;
import com.qdb.provmgr.service.ccb.CCBReportService;
import com.qdb.provmgr.util.ExcelUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by yuwenzhong on 2016-11-28.
 */
@RequestMapping("/report/ccb")
@Controller
public class CcbReportController {

    private Logger logger = LoggerFactory.getLogger(CcbReportController.class);

    private Map<String, String> tableNameMap = TableNameConstant.map;

    private final String BANKNAME = "中国建设银行";

    @Value("${report.writetable.name}")
    private String writetable;

    @Value("${report.checktable.name}")
    private String checktable;

    @Autowired
    private CCBReportService reportService;

    @RequestMapping("/create")
    public void ctrateReports(HttpServletRequest request, HttpServletResponse response){
        String beginDate = "2016-10-01";
        String endDate = "2016-10-31";
        String tableType = "1_10";
//        for (String tableType: typeList) {
        String tableNo = tableNameMap.get(tableType);
        String templateName = "agentCode_" + tableNo + "_n.xls";

        String agentCode = "20161130";
        String destFileName = agentCode+"_" + tableNo + "_0.xls";

        String bankType = "ccb";
        Map<String, Object> infoMap = new HashMap<>();
        infoMap.put("writeTable", writetable);
        infoMap.put("checkTable", checktable);

        String sheetName = "sheet";
        if("1_3".equals(tableType)){
            List<Map<String, Object>> dataList = reportService.findTableDataList(tableType, BANKNAME, "汇总", "99999", null, beginDate, endDate);
            infoMap.put("total", dataList);
//                infoMap.put("dates", dayList);
            List<DataTable3Entity> table3DataList = reportService.findTable3Data(tableType, BANKNAME, null, null, beginDate, endDate);
            ExcelUtils.excelDownLoad(request, response, table3DataList, sheetName, bankType, templateName, destFileName, infoMap);
        }else{
            //建行按照客户级别上报，不分账户，统计每天合计金额
            List<Map<String, Object>> dataList = reportService.findTableDataList(tableType, BANKNAME, "汇总", "99999", null, beginDate, endDate);
            ExcelUtils.createExcel(request, response, dataList, sheetName, bankType, templateName, destFileName,infoMap);
        }
//        }
    }



}
