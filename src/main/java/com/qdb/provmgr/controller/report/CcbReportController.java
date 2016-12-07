package com.qdb.provmgr.controller.report;

import com.alibaba.fastjson.JSONObject;
import com.qdb.provmgr.common.TableNameConstant;
import com.qdb.provmgr.dao.entity.report.DataTable3Entity;
import com.qdb.provmgr.service.FtpFileService;
import com.qdb.provmgr.service.ccb.CCBReportService;
import com.qdb.provmgr.util.DateUtils;
import com.qdb.provmgr.report.ccb.ExcelUtils;
import com.qdb.provmgr.util.StringUtils;
import com.qdb.provmgr.util.ZipUtil;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 建设银行备付金报表
 * Created by yuwenzhong on 2016-11-28.
 */
@RequestMapping("/report/ccb")
@Controller
public class CcbReportController {

    private Logger logger = LoggerFactory.getLogger(CcbReportController.class);

    private String ccbReportList = TableNameConstant.tableNameStr;
    private Map<String, String> tableNoMap = TableNameConstant.tableNoMap;
    private Map<String, String> tempNameMap = TableNameConstant.tempNameMap;

    String sep = System.getProperty("file.separator");
    private final String BANKNAME = "中国建设银行";
    private final String AGENT_CODE = "20161130";

    private final String FTP_BANK_PATH = "/备付金报表/建设银行/";
    private final String CODE = "code";
    private final String DATA = "data";

    private final String MESSAGE = "message";
    private Map<String, Object> reportMap = new HashMap<>();

    private List<Map<String, Object>> statusList = new ArrayList<>();

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
     * 获取报表列表
     *
     * @param start_day
     * @param end_day
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public String reportList(String start_day, String end_day) {
        try {
            if (CollectionUtils.isEmpty(reportMap)){
                //初始化报表生成状态
                String[] tableTypes = StringUtils.split(ccbReportList, ',');
                for (String tableType : tableTypes) {
                    this.buildReportStatusList(tableType, 0);
                }
            }
            //更新生成状态
            this.getLatestReportStatus(start_day);
        }catch (Exception e){
            logger.error(e.getMessage());
        }
        String jsonString = JSONObject.toJSONString(reportMap);
        logger.info("************" + jsonString + "************");
        return jsonString;
    }

    /**
     * 获取最新的报表生成状态
     * @param start_day
     */
    private String getLatestReportStatus(String start_day) throws Exception {
        String[] tableTypeList = StringUtils.split(ccbReportList, ',');

        Map<String, String> tableTypeMap = new HashMap<>();
        List<String> fileNameList = new ArrayList<>();

        for (String tableType: tableTypeList) {
            String tableNo = tableNoMap.get(tableType);
            String destExcelName = this.getDestExcelName(tableNo, 0);
            fileNameList.add(destExcelName);
            tableTypeMap.put(destExcelName, tableType);
        }

        String ccbFtpDir = FTP_BANK_PATH + start_day.substring(0, 7).replace("-", "") + sep;
        String[] fileNames = new String[fileNameList.size()];
        fileNames = fileNameList.toArray(fileNames);
        String[][] fileStatus = ftpFileService.checkFileStatus(ccbFtpDir, fileNames);
        for (String[] arr: fileStatus) {
            String fileName = arr[0];
            if(StringUtils.isEmpty(fileName)){
                continue;
            }
            String reportStatus = arr[1];
            String tableType = tableTypeMap.get(fileName);
            this.updateCreateStatus(tableType, Integer.parseInt(reportStatus));
        }
        return JSONObject.toJSONString(reportMap);
    }

    /**
     * 根据生成表格式规则,统一拼接文件名称
     * @param tableNo
     * @param n 0:上报给建行 1:上报给建行或其他分行
     * @return
     */
    private String getDestExcelName(String tableNo, int n) {
        //目标文件名称规则: 机构编号_标序号_n.xls
        String destExcelName = AGENT_CODE + "_" + tableNo + "_" + n + ".xls";
        return destExcelName;
    }

    /**
     * 报表生成
     *
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
        int createStatus = 1;
        try {
            JSONObject jsonObject = JSONObject.parseObject(jsonStr);
            String beginDate = (String) jsonObject.get("start_day");
            String endDate = (String) jsonObject.get("end_day");
            List<Map<String, String>> reportList = (List<Map<String, String>>) jsonObject.get("report_list");

            String dateDir = null;
            if (StringUtils.isNotEmpty(beginDate)){
                dateDir = beginDate.substring(0, 7).replace("-", "");
            }
            String destDir = System.getProperty("java.io.tmpdir") + sep + "ccb" + sep;
            File file = new File(destDir);
            if (!file.exists()){
                file.mkdir();
            }
            destDir += dateDir + sep;
            File childFile = new File(destDir);
            if (!childFile.exists()){
                childFile.mkdir();
            }

            for (Map<String, String> map : reportList) {
                String tableType = map.get("report_name");
                String tableNo = tableNoMap.get(tableType);
                String templateName = tempNameMap.get(tableType);
                String destFileName = AGENT_CODE + "_" + tableNo + "_0.xls";
                try {
                    this.createExcel(request, templateName, destDir, destFileName, tableType, beginDate, endDate);
                    logger.info("建设银行备付金报表创建完成! 报表名称:{}", destFileName);
                }catch(Exception e){
                    createStatus = 0;
                    code = 400;
                    message = destFileName + "创建失败!";
                    resultMap.put(CODE, code);
                    resultMap.put(MESSAGE, message);

                    this.updateCreateStatus(tableType, createStatus);

                    logger.error("建设银行备付金报表创建失败! 报表名称:{},失败原因:{}", destFileName, e.getMessage());
                    return JSONObject.toJSONString(resultMap);
                }

                String remotePath = FTP_BANK_PATH + dateDir + "/" + destFileName;
                String destExcelPath = destDir + destFileName;
                boolean isSuccess = ftpFileService.uploadFileToFtp(destExcelPath, remotePath);
                if (!isSuccess) {
                    logger.error("建设银行备付金报表上传至FTP失败,报表名称:{}!", destExcelPath);
                    createStatus = 0;
                    code = 400;
                    message = destFileName + "上传至FTP失败!";
                    resultMap.put(CODE, code);
                    resultMap.put(MESSAGE, message);

                    this.updateCreateStatus(tableType, createStatus);

                    return JSONObject.toJSONString(resultMap);
                }
                this.updateCreateStatus(tableType, createStatus);
            }
            logger.info("************建设银行备付金报表创建并上传至FTP全部完成!************");
        } catch (Exception e) {
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
     * 创建文件
     * @param request
     * @param templateName
     * @param destDir
     * @param destFileName
     * @param tableType
     * @throws IOException
     * @throws InvalidFormatException
     */
    private void createExcel(HttpServletRequest request, String templateName, String destDir, String destFileName, String tableType, String beginDate, String endDate) throws IOException, InvalidFormatException {

        String destExcelPath = destDir + destFileName;
        String sheetName = "sheet";

        //模板相对于WEB-INF的路径
        String tempRelativePath = templatePath + sep + "ccb" + sep + templateName;

        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("writeTable", writetable);
        dataMap.put("checkTable", checktable);
        dataMap.put("writeDate", DateUtils.format(new Date(), DateUtils.DATE_SMALL_STR));

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
    }

    /**
     * 文件下载
     *
     * @param request
     * @param response
     * @param start_day
     * @param end_day
     * @param report_name
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/download", method = RequestMethod.GET)
    public String download(HttpServletRequest request, HttpServletResponse response, String start_day, String end_day, String report_name) {
        Map<String, Object> resultMap = new HashMap<>();
        int code = 200;
        String message = "成功";

        try {
            this.downloadExcel(request, response, start_day, end_day, report_name);
        } catch (Exception e) {
            logger.error(e.getMessage());
            code = 400;
            message = "失败:" + e.getMessage();
            resultMap.put(CODE, code);
            resultMap.put(MESSAGE, message);
            return JSONObject.toJSONString(resultMap);
        }
        resultMap.put(CODE, code);
        resultMap.put(MESSAGE, message);
        logger.info("**************" + JSONObject.toJSONString(resultMap) + "**************");
        return JSONObject.toJSONString(resultMap);
    }

    /**
     * 单个文件下载
     * @param request
     * @param response
     * @param startDay
     * @param endDay
     * @param tableType
     * @throws Exception
     */
    private void downloadExcel(HttpServletRequest request, HttpServletResponse response, String startDay, String endDay, String tableType) throws Exception {
        String tableNo = tableNoMap.get(tableType);
        String templateName = tempNameMap.get(tableType);
        String sheetName = "sheet";

        //模板相对于WEB-INF的路径
        String tempRelativePath = templatePath + sep + "ccb" + sep + templateName;
        String destFileName = this.getDestExcelName(tableNo, 0);

        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("writeTable", writetable);
        dataMap.put("checkTable", checktable);
        dataMap.put("writeDate", DateUtils.format(new Date(), DateUtils.DATE_SMALL_STR));
        try {
            if ("1_3".equals(tableType)) {
                List<Map<String, Object>> dataList = reportService.findTableDataList(tableType, BANKNAME, "汇总", "99999", null, startDay, endDay);
                dataMap.put("total", dataList);
                List<DataTable3Entity> table3DataList = reportService.findTable3Data(tableType, BANKNAME, null, null, startDay, endDay);
                ExcelUtils.excelDownLoad(request, response, table3DataList, sheetName, tempRelativePath, destFileName, dataMap);
            } else {
                //建行按照客户级别上报，不分账户，统计每天合计金额
                List<Map<String, Object>> dataList = reportService.findTableDataList(tableType, BANKNAME, "汇总", "99999", null, startDay, endDay);
                ExcelUtils.excelDownLoad(request, response, dataList, sheetName, tempRelativePath, destFileName, dataMap);
            }
            logger.info("建设银行备付金报表下载完成! 报表名称:{}", destFileName);
        } catch (Exception e) {
            throw new Exception("下载失败! 报表名称" + destFileName);
        }
    }

    /**
     * 批量下载
     * @param request
     * @param response
     * @param start_day
     * @param end_day
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/download-all", method = RequestMethod.GET)
    public String downloadAll(HttpServletRequest request, HttpServletResponse response, String start_day, String end_day) {
        Map<String, Object> resultMap = new HashMap<>();
        int code = 200;
        String message = "成功";

        String dateDir = null;
        if (StringUtils.isNotEmpty(start_day)){
            dateDir = start_day.substring(0, 7).replace("-", "");
        }
        //生成文件存放的目录
        String destDir = System.getProperty("java.io.tmpdir") + sep + "ccb" + sep;
        String targetZipPath = destDir;
        File file = new File(destDir);
        if (!file.exists()){
            file.mkdir();
        }
        destDir += dateDir + sep;
        File childFile = new File(destDir);
        if (!childFile.exists()){
            childFile.mkdir();
        }

        String[] tableTypeList = StringUtils.split(ccbReportList, ',');
        try {
            //step1 生成所有的报表
            for (String tableType: tableTypeList) {
                String tableNo = tableNoMap.get(tableType);
                String templateName = tempNameMap.get(tableType);
                String destFileName = this.getDestExcelName(tableNo, 0);
                this.createExcel(request, templateName, destDir, destFileName, tableType, start_day, end_day);
            }
            //step2 文件压缩
            // form_合约编号_yyyyMMddhhmmss.zip，其中yyyyMM为报表中数据的年月，后面的ddhhmmss取当前时间戳日时分秒(视为唯一标识)
            String heYueHao = "20161205"; //合约号
            SimpleDateFormat df = new SimpleDateFormat("ddhhmmss");
            String dateStr = df.format(new Date()); //当前时间戳, 日时分秒
            String zipName = "form_" + heYueHao + "_" + dateDir + dateStr + ".zip";


            File resourceFile = new File(destDir);
            File[] files = resourceFile.listFiles();
            if(files == null || files.length == 0){
                logger.error("***************建设银行报表文件尚未生成!***************");
                throw new Exception("报表尚未生成");
            }
            //压缩
            boolean isCompressed = ZipUtil.compressed(destDir, targetZipPath, zipName);
            if (!isCompressed) {
                logger.error("建设银行备付金报表压缩失败! 文件名称:{}", zipName);
                code = 400;
                message = "压缩文件失败!";
                resultMap.put(CODE, code);
                resultMap.put(MESSAGE, message);
                return JSONObject.toJSONString(resultMap);
            }
            logger.info("建设银行备付金报表压缩失败! 文件名称:{}", zipName);

            //step3 下载压缩包
            ExcelUtils.downloadZip(request, response, targetZipPath, zipName);
            logger.info("***************建设银行报表批量下载成功!*************");
        } catch (Exception e) {
            logger.error("***************建设银行报表批量下载失败!*************");
            code = 400;
            message = "失败:" + e.getMessage();
        }
        resultMap.put(CODE, code);
        resultMap.put(MESSAGE, message);
        logger.info("**************" + JSONObject.toJSONString(resultMap) + "**************");
        return JSONObject.toJSONString(resultMap);
    }

    /**
     * 报送
     *
     * @param request
     * @param response
     * @return
     */
    //@ResponseBody
    //@RequestMapping(value = "/submit", method = RequestMethod.POST)
    public String submitReport(HttpServletRequest request, HttpServletResponse response, String start_day, String end_day) {
        Map<String, Object> resultMap = new HashMap<>();
        int code = 200;
        String message = "成功";

        SimpleDateFormat df = new SimpleDateFormat("ddhhmmss");
        try {
            // form_合约编号_yyyyMMddhhmmss.zip，其中yyyyMM为报表中数据的年月，后面的ddhhmmss取当前时间戳日时分秒(视为唯一标识)
            String heYueHao = null; //合约号
            String dataMonthDir = null;
            if (StringUtils.isNotEmpty(start_day)){
                dataMonthDir = start_day.substring(0, 7).replace("-", "");
            }
            String dateStr = df.format(new Date()); //当前时间戳, 日时分秒
            String zipName = "form_" + heYueHao + "_" + dataMonthDir + dateStr + ".zip";

            String targetPath = System.getProperty("java.io.tmpdir") + sep + "ccb" + sep;
            String resourcePath = targetPath + dataMonthDir + sep;

            //step1 压缩
            boolean isCompressed = ZipUtil.compressed(resourcePath, targetPath, zipName);
            if (!isCompressed) {
                logger.error("建设银行备付金报表压缩失败! 文件名称:{}", zipName);
                code = 400;
                message = "压缩文件失败";
                resultMap.put(CODE, code);
                resultMap.put(MESSAGE, message);
                return JSONObject.toJSONString(resultMap);
            }
            logger.info("建设银行备付金报表压缩失败! 文件名称:{}", zipName);
/*
            //step2 上传ftp
            String localZipPath = targetPath + zipName;
            String remotePath = "";
            boolean uploadFileToFtp = ftpFileService.uploadFileToFtp(localZipPath, remotePath);
            if (!uploadFileToFtp) {
                logger.error("压缩文件上传至FTP失败! 文件名称:{}", zipName);
                code = 400;
                message = "上传至FTP失败";
                resultMap.put(CODE, code);
                resultMap.put(MESSAGE, message);
                return JSONObject.toJSONString(resultMap);
            }
            logger.info("建设银行备付金报表压缩文件上传至FTP成功! 文件名称:{}", zipName);

            //step3 调用上报接口
            try {
                //ToDo 此处调用张梦宇上报接口

            } catch (Exception e) {
                logger.error("*************建设银行备付金报表上报失败!*************");
                code = 400;
                message = "上报失败";
                resultMap.put(CODE, code);
                resultMap.put(MESSAGE, message);
                return JSONObject.toJSONString(resultMap);
            }*/
            resultMap.put(CODE, code);
            resultMap.put(MESSAGE, message);
            return JSONObject.toJSONString(resultMap);
        } catch (Exception e) {
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
     *
     * @param tableType
     * @param createStatus
     */
    private void buildReportStatusList(String tableType, int createStatus) {
        Map<String, Object> rowMap = new HashMap<>();
        rowMap.put("report_name", tableType);
        rowMap.put("report_status",  createStatus);
        statusList.add(rowMap);

        reportMap.put(CODE, 200);
        reportMap.put(DATA, statusList);
    }

    /**
     * 更新生成状态
     *
     * @param tableType
     * @param createStatus
     */
    private void updateCreateStatus(String tableType, int createStatus) throws Exception {
        List<Map<String, Object>> statusList = (List<Map<String, Object>>) reportMap.get(DATA);
        if (CollectionUtils.isEmpty(statusList)) {
            throw new Exception("暂无该银行报表列表!");
        }
        for (Map<String, Object> rowMap : statusList) {
            boolean isContains = rowMap.containsValue(tableType);
            if (isContains) {
                rowMap.put("report_status", createStatus);
            }
        }
    }
}