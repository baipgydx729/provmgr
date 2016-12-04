package com.qdb.provmgr.controller.report;

import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.CollectionCodec;
import com.qdb.provmgr.common.TableNameConstant;
import com.qdb.provmgr.dao.entity.report.DataTable3Entity;
import com.qdb.provmgr.service.FtpFileService;
import com.qdb.provmgr.service.ccb.CCBReportService;
import com.qdb.provmgr.util.ExcelUtils;
import com.qdb.provmgr.util.StringUtils;
import com.qdb.provmgr.util.ZipUtil;
import org.apache.poi.ss.formula.functions.Code;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 建设银行备付金报表
 * Created by yuwenzhong on 2016-11-28.
 */
@RequestMapping("/report/ccb")
@Controller
public class CcbReportController {

    private Logger logger = LoggerFactory.getLogger(CcbReportController.class);

    private Map<String, String> tableNameMap = TableNameConstant.map;

    private final String BANKNAME = "中国建设银行";

    private final String CODE = "code";
    private final String DATA = "data";
    private final String MESSAGE = "message";

    private Map<String, Object> reportMap = new HashMap<>();
    private List<Map<String, Object>> statusList = new ArrayList<>();

    private SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMM");

    @Value("${report.writetable.name}")
    private String writetable;

    @Value("${report.checktable.name}")
    private String checktable;

    @Value("${excel.template.path}")
    private String templatePath;

    @Autowired
    private CCBReportService reportService;

    @Autowired
    private FtpFileService ftpFileService;

    /**
     * 报表生成
     * @param request
     * @param jsonStr
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public String createExcels(HttpServletRequest request, @RequestBody String jsonStr) {
        Map<String, Object> resultMap = new HashMap<>();
        int code = 200;
        String message = "成功";
        boolean createStatus = true;
        try {
            JSONObject jsonObject = JSONObject.parseObject(jsonStr);
            String beginDate = (String) jsonObject.get("start_day");
            String endDate = (String) jsonObject.get("end_day");
            List<Map<String, String>> reportList = (List<Map<String, String>>) jsonObject.get("report_list");
            for (Map<String, String> map : reportList) {
                String tableType = map.get("report_name");
                String tableNo = tableNameMap.get(tableType);
                String templateName = "agentCode_" + tableNo + "_n.xls";

                String agentCode = "20161130";
                String sheetName = "sheet";
                String sep = System.getProperty("file.separator");

                //模板相对于WEB-INF的路径
                String tempRelativePath = templatePath + sep + "ccb" + sep + templateName;
                String destFileName = agentCode + "_" + tableNo + "_0.xls";

                String destExcelPath = System.getProperty("java.io.tmpdir") + sep + "ccb" + sep + dateFormat.format(dateFormat.parse(beginDate)) + sep +destFileName;

                Map<String, Object> dataMap = new HashMap<>();
                dataMap.put("writeTable", writetable);
                dataMap.put("checkTable", checktable);

                try {
                    if ("1_3".equals(tableType)) {
                        List<Map<String, Object>> dataList = reportService.findTableDataList(tableType, BANKNAME, "汇总", "99999", null, beginDate, endDate);
                        dataMap.put("total", dataList);
                        List<DataTable3Entity> table3DataList = reportService.findTable3Data(tableType, BANKNAME, null, null, beginDate, endDate);
                        ExcelUtils.createExcel(request, table3DataList, sheetName, tempRelativePath, destExcelPath, dataMap);
                    } else {
                        //建行按照客户级别上报，不分账户，统计每天合计金额
                        List<Map<String, Object>> dataList = reportService.findTableDataList(tableType, BANKNAME, "汇总", "99999", null, beginDate, endDate);
                        ExcelUtils.createExcel(request, dataList, sheetName, tempRelativePath, destExcelPath, dataMap);
                    }
                    logger.info("建设银行备付金报表创建完成! 报表名称:{}", destFileName);
                } catch (Exception e) {
                    createStatus = false;
                    code = 400;
                    message = destFileName+ "创建失败!";
                    resultMap.put(CODE, code);
                    resultMap.put(MESSAGE, message);

                    this.updateCreateStatus(tableType, createStatus);

                    logger.error("建设银行备付金报表创建失败! 报表名称:{},失败原因:{}", destFileName, e.getMessage());
                    return JSONObject.toJSONString(resultMap);
                }

                String remotePath = null;
                boolean isSuccess = ftpFileService.uploadFileToFtp(destExcelPath, remotePath);
                if(!isSuccess){
                    logger.error("建设银行备付金报表上传至FTP失败,报表名称:{}!", destExcelPath);
                    createStatus = false;
                    code = 400;
                    message = destFileName+ "上传至FTP失败!";
                    resultMap.put(CODE, code);
                    resultMap.put(MESSAGE, message);

                    this.updateCreateStatus(tableType, createStatus);

                    return JSONObject.toJSONString(resultMap);
                }
                this.updateCreateStatus(tableType, createStatus);
            }
            logger.info("************建设银行备付金报表创建并上传至FTP全部完成!************");
        }catch (Exception e){
            code = 400;
            message = "失败:" + e.getMessage();
            logger.error("************建设银行备付金报表创建并上传至FTP失败!************");
        }
        resultMap.put(CODE, code);
        resultMap.put(MESSAGE, message);
        logger.info("**************" + JSONObject.toJSONString(resultMap) + "**************");
        return JSONObject.toJSONString(resultMap);
    }

    /**
     * 文件下载
     * @param request
     * @param response
     * @param start_day
     * @param end_day
     * @param report_name
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/download", method = RequestMethod.GET)
    public String download(HttpServletRequest request, HttpServletResponse response, String start_day, String end_day, String report_name){
        Map<String, Object> resultMap = new HashMap<>();
        int code = 200;
        String message = "成功";

        String tableNo = tableNameMap.get(report_name);
        String templateName = "agentCode_" + tableNo + "_n.xls";

        String agentCode = "20161130";
        String sheetName = "sheet";
        String sep = System.getProperty("file.separator");

        //模板相对于WEB-INF的路径
        String tempRelativePath = templatePath + sep + "ccb" + sep + templateName;
        String destFileName = agentCode + "_" + tableNo + "_0.xls";

        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("writeTable", writetable);
        dataMap.put("checkTable", checktable);
        try {
            if ("1_3".equals(report_name)) {
                List<Map<String, Object>> dataList = reportService.findTableDataList(report_name, BANKNAME, "汇总", "99999", null, start_day, end_day);
                dataMap.put("total", dataList);
                List<DataTable3Entity> table3DataList = reportService.findTable3Data(report_name, BANKNAME, null, null, start_day, end_day);
                ExcelUtils.excelDownLoad(request, response, table3DataList, sheetName, tempRelativePath, destFileName, dataMap);
            } else {
                //建行按照客户级别上报，不分账户，统计每天合计金额
                List<Map<String, Object>> dataList = reportService.findTableDataList(report_name, BANKNAME, "汇总", "99999", null, start_day, end_day);
                ExcelUtils.excelDownLoad(request, response, dataList, sheetName, tempRelativePath, destFileName, dataMap);
            }
            logger.info("建设银行备付金报表下载完成! 报表名称:{}", destFileName);
        } catch (Exception e) {
            code = 400;
            message = "失败:" + e.getMessage();
            logger.error("建设银行备付金报表下载失败! 报表名称:{}", destFileName);
        }
        resultMap.put(CODE, code);
        resultMap.put(MESSAGE, message);
        logger.info("**************" + JSONObject.toJSONString(resultMap) + "**************");
        return JSONObject.toJSONString(resultMap);
    }

    /**
     * 获取报表列表
     * @param start_day
     * @param end_day
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public String reportList(String start_day, String end_day){
        String jsonStr = JSONObject.toJSONString(reportMap);
        if(StringUtils.isNotEmpty(jsonStr)){
            return jsonStr;
        }

        String[] tableTypes = {"1_1", "1_2", "1_3", "1_6", "1_9", "1_10"};
        for (String tableType: tableTypes) {
            this.buildReportStatusList(tableType, false);
        }
        return JSONObject.toJSONString(reportMap);
    }

    /**
     * 报送
     * @param request
     * @param response
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/submit", method = RequestMethod.POST)
    public String submitReport(HttpServletRequest request, HttpServletResponse response, String start_day, String end_day){
        Map<String, Object> resultMap = new HashMap<>();
        int code = 200;
        String message = "成功";

        SimpleDateFormat df = new SimpleDateFormat("ddhhmmss");
        try {
            // form_合约编号_yyyyMMddhhmmss.zip，其中yyyyMM为报表中数据的年月，后面的ddhhmmss取当前时间戳日时分秒(视为唯一标识)
            String heYueHao = null; //合约号
            String dataMonthStr = dateFormat.format(dateFormat.parse(start_day)); //报表数据年月
            String dateStr = df.format(new Date()); //当前时间戳, 日时分秒
            String zipName = "form_" + heYueHao + "_" + dataMonthStr + dateStr + ".zip";

            String sep = System.getProperty("file.separator");
            String targetPath = System.getProperty("java.io.tmpdir") + sep + "ccb" + sep;
            String resourcePath = targetPath + dataMonthStr + sep;

            //step1 压缩
            boolean isCompressed = ZipUtil.compressed(resourcePath, targetPath, zipName);
            if (!isCompressed){
                logger.error("建设银行备付金报表压缩失败! 文件名称:{}", zipName);
                code = 400;
                message = "压缩文件失败";
                resultMap.put(CODE, code);
                resultMap.put(MESSAGE, message);
                return JSONObject.toJSONString(resultMap);
            }
            logger.info("建设银行备付金报表压缩失败! 文件名称:{}", zipName);

            //step2 上传ftp
            String localZipPath= targetPath + zipName;
            String remotePath = "";
            boolean uploadFileToFtp = ftpFileService.uploadFileToFtp(localZipPath, remotePath);
            if (!uploadFileToFtp){
                logger.error("压缩文件上传至FTP失败! 文件名称:{}", zipName);
                code = 400;
                message = "建设银行备付金报表压缩文件上传至FTP失败";
                resultMap.put(CODE, code);
                resultMap.put(MESSAGE, message);
                return JSONObject.toJSONString(resultMap);
            }
            logger.info("建设银行备付金报表压缩文件上传至FTP成功! 文件名称:{}", zipName);

            //step3 调用上报接口
            try {
                //ToDo 此处调用张梦宇上报接口

            }catch (Exception e){
                code = 400;
                message = "上报失败";
                resultMap.put(CODE, code);
                resultMap.put(MESSAGE, message);
                return JSONObject.toJSONString(resultMap);
            }
            resultMap.put(CODE, code);
            resultMap.put(MESSAGE, message);
            return JSONObject.toJSONString(resultMap);
        }catch (Exception e){
            logger.error("************建设银行备付金报表上报失败!************");
            code = 400;
            message = "上报失败";
            resultMap.put(CODE, code);
            resultMap.put(MESSAGE, message);
            return JSONObject.toJSONString(resultMap);
        }
    }

    /**
     * 报表生成状态
     * @param tableType
     * @param createStatus
     */
    private void buildReportStatusList(String tableType, boolean createStatus) {
        Map<String, Object> rowMap = new HashMap<>();
        rowMap.put("report_name", "表" + tableType);
        rowMap.put("report_status", createStatus?1:0);
        statusList.add(rowMap);

        reportMap.put(CODE, 200);
        reportMap.put(DATA, statusList);
    }

    /**
     * 更新生成状态
     * @param tableType
     * @param createStatus
     */
    private void updateCreateStatus(String tableType, boolean createStatus) throws Exception {
        List<Map<String, Object>> statusList = (List<Map<String, Object>>) reportMap.get(DATA);
        if (CollectionUtils.isEmpty(statusList)){
            throw new Exception("暂无该银行报表列表!");
        }
        for (Map<String, Object> rowMap: statusList) {
            boolean isContains = rowMap.containsValue("表" + tableType);
            if (isContains){
                rowMap.put("report_status", createStatus);
            }
        }
    }

}

