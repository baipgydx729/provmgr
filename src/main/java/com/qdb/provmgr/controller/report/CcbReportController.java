package com.qdb.provmgr.controller.report;

import com.qdb.provmgr.common.TableNameConstant;
import com.qdb.provmgr.dao.entity.report.DataTable1_3;
import com.qdb.provmgr.dao.entity.report.DataTable3Entity;
import com.qdb.provmgr.service.ccb.CCBReportService;
import com.qdb.provmgr.util.ExcelUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;

/**
 * Created by yuwenzhong on 2016-11-28.
 */
@RequestMapping("/ccb")
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
        String tableType = "1_2";
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
                DataTable3Entity totalDo = reportService.convertResult2Entity(dataList);
                List<DataTable1_3> totalList = totalDo.getList();
                int days = 0;
                if (!CollectionUtils.isEmpty(totalList)){
                    days = totalList.size();
                }

//                List<Integer> dayList = this.getDayList(days);
                infoMap.put("total", totalDo);
//                infoMap.put("dates", dayList);
                List<DataTable3Entity> table3DataList = reportService.findTable3Data(tableType, BANKNAME, null, null, beginDate, endDate);
                ExcelUtils.createExcel(request, response, table3DataList, sheetName, bankType, templateName, destFileName, infoMap);
            }else{
                //建行按照客户级别上报，不分账户，统计每天合计金额
                List<Map<String, Object>> dataList = reportService.findTableDataList(tableType, BANKNAME, "汇总", "99999", null, beginDate, endDate);
                ExcelUtils.createExcel(request, response, dataList, sheetName, bankType, templateName, destFileName,infoMap);
            }
//        }
    }

    @RequestMapping("/test")
    public void test(){
        logger.info("***********来了***********");
    }
    /**
     * 返回日列表
     * @param days
     * @return
     */
    private List<Integer> getDayList(int days) {
        List<Integer> dayList = new ArrayList<>();
        int i = 1;
        while (i <= days){
            dayList.add(i);
        }
        return dayList;
    }
}
