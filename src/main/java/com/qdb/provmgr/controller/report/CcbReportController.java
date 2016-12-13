package com.qdb.provmgr.controller.report;

import com.alibaba.fastjson.JSONObject;
import com.qdb.provmgr.common.CCBReportConstant;
import com.qdb.provmgr.common.CCBReportConstant.IReportType;
import com.qdb.provmgr.dao.entity.report.AccountInfoEntity;
import com.qdb.provmgr.dao.entity.report.BaseReportEntity;
import com.qdb.provmgr.dao.entity.report.DataTable3Entity;
import com.qdb.provmgr.service.FtpFileService;
import com.qdb.provmgr.service.ReportService;
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

    private Map<String, String> reportTypeMap = IReportType.reportTypeMap;
    private Map<String, String> tableNoMap = CCBReportConstant.ITemplateFileNames.tableNoMap;
    private Map<String, String> tempNameMap = CCBReportConstant.ITemplateFileNames.tempNameMap;

    String sep = System.getProperty("file.separator");
    private final String BANK_NAME = "中国建设银行";
    private final String ACCOUNT_ID = "99999";
    private final String ACCOUNT_NAME = "汇总";
    private final String AGENT_CODE = "05800000000000000713511";

    private final String FTP_BANK_PATH = "/备付金报表/建设银行/";
    private final String CODE = "code";
    private final String DATA = "data";

    private final String MESSAGE = "message";


    private Map<String, Object> customerReportMap = new HashMap<>();
    private Map<String, Object> accountReportMap = new HashMap<>();

    private List<Map<String, Object>> custumerReportList = new ArrayList<>();
    private List<Map<String, Object>> accountReportList = new ArrayList<>();

    @Value("${report.writetable.name}")
    private String writetable;

    @Value("${report.checktable.name}")
    private String checktable;

    @Value("${excel.template.path}")
    private String templatePath;

    @Autowired
    private CCBReportService ccbReportService;

    @Autowired
    private FtpFileService ftpFileService;

    @Autowired
    private ReportService reportService;

    /**
     * 获取报表列表
     *
     * @param account_id
     * @param start_day
     * @param report_type
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public String reportList(String account_id, String start_day, String end_day, String report_type) {
        String jsonStr = null;
        AccountInfoEntity accountInfo = null;
        if (StringUtils.isNotEmpty(account_id)){
            accountInfo = reportService.queryAccountById(Integer.parseInt(account_id));
        }

        try {
            if (IReportType.CUSTOMER_TYPE.equals(report_type) && CollectionUtils.isEmpty(customerReportMap)){
                this.initReportStatusList(report_type, accountInfo, 0);
            }
            if (IReportType.ACCOUNT_TYPE.equals(report_type) && CollectionUtils.isEmpty(accountReportMap)){
                this.initReportStatusList(report_type, accountInfo, 0);
            }
            //更新生成状态
            String accountNo = null;
            if (accountInfo != null){
                accountNo = accountInfo.getAD();
            }
            jsonStr = this.getLatestReportStatus(report_type, accountNo, start_day);
        }catch (Exception e){
            logger.error(e.getMessage());
        }
        logger.info("************" + jsonStr + "************");
        return jsonStr;
    }

    /**
     * 获取最新的报表生成状态
     * @param reportType
     * @param accountNo
     * @param start_day
     */
    private String getLatestReportStatus(String reportType, String accountNo, String start_day) throws Exception {
        Map<String, String> tableTypeMap = new HashMap<>();
        List<String> fileNameList = new ArrayList<>();
        String tableString = reportTypeMap.get(reportType);
        String[] tableTypes = StringUtils.split(tableString, ',');
        for (String tableType: tableTypes) {
            String destExcelName = this.getDestExcelName(accountNo, tableType, 0);
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
            this.updateCreateStatus(reportType, tableType, Integer.parseInt(reportStatus));
        }

        if (IReportType.CUSTOMER_TYPE.equals(reportType)){
            return JSONObject.toJSONString(customerReportMap);
        }
        return JSONObject.toJSONString(accountReportMap);
    }

    /**
     * 根据生成表格式规则,统一拼接文件名称
     *
     *
     * @param accountNo
     * @param tableType
     * @param n 0:上报给建行 1:上报给建行或其他分行
     * @return
     */
    private String getDestExcelName(String accountNo, String tableType, Integer n) {
        String tableNo = tableNoMap.get(tableType);
        String destExcelName;
        if (StringUtils.isEmpty(accountNo) ){
            //客户级报表命名格式: 机构编号_标序号_n.xls
            destExcelName = AGENT_CODE + "_" + tableNo + "_" + n + ".xls";
        }else {
            //账户级报表命名格式:
            destExcelName = AGENT_CODE+ "_" + accountNo + "_" + tableNo + ".xls";
        }
        return destExcelName;
    }

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
        int createStatus = 1;
        try {
            JSONObject jsonObject = JSONObject.parseObject(jsonStr);
            String beginDate = (String) jsonObject.get("start_day");
            String endDate = (String) jsonObject.get("end_day");
            String reportType = jsonObject.get("report_type")+"";
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
                String bankName = map.get("bank_name");
                String accountId = map.get("account_id");
                String accountNo = map.get("account_no");
                String accountName = map.get("account_name");
                String tableType = map.get("report_name");

                String destFileName = this.getDestExcelName(accountNo, tableType, 0);

                try {
                    if (IReportType.CUSTOMER_TYPE.equals(reportType)){
                        bankName = BANK_NAME;
                        accountId = ACCOUNT_ID;
                        accountName = ACCOUNT_NAME;
                    }
                    this.createExcel(request, destDir, destFileName, bankName, accountId, accountNo, accountName, tableType, beginDate, endDate);
                    logger.info("建设银行备付金报表创建完成! 报表名称:{}", destFileName);
                }catch(Exception e){
                    createStatus = 0;
                    code = 400;
                    message = destFileName + "创建失败:" +e.getMessage();
                    resultMap.put(CODE, code);
                    resultMap.put(MESSAGE, message);

                    this.updateCreateStatus(reportType, tableType, createStatus);

                    logger.error("建设银行备付金报表创建失败! 报表名称:{},失败原因:{}", destFileName, e.getMessage());
                    return JSONObject.toJSONString(resultMap);
                }

                //上传生成文件至FTP
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

                    this.updateCreateStatus(reportType, tableType, createStatus);

                    return JSONObject.toJSONString(resultMap);
                }
                this.updateCreateStatus(reportType, tableType, createStatus);
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
     * @param destDir
     * @param tableType
     * @throws IOException
     * @throws InvalidFormatException
     */
    private void createExcel(HttpServletRequest request, String destDir, String destFileName,  String bankName, String accountId, String accountNo, String accountName, String tableType, String beginDate, String endDate) throws Exception {
        String templateName = tempNameMap.get(tableType);
        String destExcelPath = destDir + destFileName;
        String sheetName = "sheet";

        //模板相对于WEB-INF的路径
        String tempRelativePath = templatePath + sep + "ccb" + sep + templateName;

        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("writeTable", writetable);
        dataMap.put("checkTable", checktable);
        dataMap.put("accountNo", StringUtils.isEmpty(accountNo)? "(本表为客户级报表，该栏位不必输)" : accountNo);

        if (CCBReportConstant.ITemplateFileNames.T1_3.equals(tableType)) {
            //合计
            List<Map<String, Object>> dataList = ccbReportService.findTableDataList(tableType, bankName, accountName, accountId, accountNo, beginDate, endDate);
            if (CollectionUtils.isEmpty(dataList)){
                throw new Exception("尚无数据");
            }
            dataMap.put("total", dataList);
            //主体数据
            List<DataTable3Entity> table3DataList = ccbReportService.findTable3Data(tableType, bankName, null, null, beginDate, endDate);
            ExcelUtils.createExcel(request, table3DataList, sheetName, tempRelativePath, destExcelPath, dataMap);
        } else {
            //建行按照客户级别上报，不分账户，统计每天合计金额
            List<Map<String, Object>> dataList = ccbReportService.findTableDataList(tableType, bankName, accountName, accountId, accountNo, beginDate, endDate);
            if (CollectionUtils.isEmpty(dataList)){
                throw new Exception("尚无数据");
            }
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
    public String download(HttpServletRequest request, HttpServletResponse response, String account_id, String start_day, String end_day, String report_name) {
        Map<String, Object> resultMap = new HashMap<>();
        int code = 200;
        String message = "成功";

        try {
            String accountNo = null;
            if (StringUtils.isNotEmpty(account_id)){
                AccountInfoEntity accountInfo = reportService.queryAccountById(Integer.parseInt(account_id));
                accountNo = accountInfo.getAD();
            }
            this.downloadExcel(request, response, accountNo, start_day, end_day, report_name);
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
    private void downloadExcel(HttpServletRequest request, HttpServletResponse response, String accountNo, String startDay, String endDay, String tableType) throws Exception {
        String templateName = tempNameMap.get(tableType);
        String sheetName = "sheet";

        //模板相对于WEB-INF的路径
        String tempRelativePath = templatePath + sep + "ccb" + sep + templateName;
        String destFileName = this.getDestExcelName(accountNo, tableType, 0);

        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("writeTable", writetable);
        dataMap.put("checkTable", checktable);
        dataMap.put("accountNo", StringUtils.isEmpty(accountNo)? "(本表为客户级报表，该栏位不必输)" : accountNo);
        try {
            if (CCBReportConstant.ITemplateFileNames.T1_3.equals(tableType)) {
                List<Map<String, Object>> dataList = ccbReportService.findTableDataList(tableType, BANK_NAME, ACCOUNT_NAME, ACCOUNT_ID, null, startDay, endDay);
                if (CollectionUtils.isEmpty(dataList)){
                    throw new Exception("尚无数据");
                }
                dataMap.put("total", dataList);
                List<DataTable3Entity> table3DataList = ccbReportService.findTable3Data(tableType, BANK_NAME, null, null, startDay, endDay);
                ExcelUtils.excelDownLoad(request, response, table3DataList, sheetName, tempRelativePath, destFileName, dataMap);
            } else {
                //建行按照客户级别上报，不分账户，统计每天合计金额
                List<Map<String, Object>> dataList = ccbReportService.findTableDataList(tableType, BANK_NAME, ACCOUNT_NAME, ACCOUNT_ID, null, startDay, endDay);
                if (CollectionUtils.isEmpty(dataList)){
                    throw new Exception("尚无数据");
                }
                ExcelUtils.excelDownLoad(request, response, dataList, sheetName, tempRelativePath, destFileName, dataMap);
            }
            logger.info("建设银行备付金报表下载完成! 报表名称:{}", destFileName);
        } catch (Exception e) {
            logger.error("建设银行备付金报表下载失败！报表名称:{}，异常信息：{}", destFileName, e.getMessage());
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
        long start = System.currentTimeMillis();
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

        try {
            //生成账户级表
            String accountTables = CCBReportConstant.ACCOUNT_TABLES;
            String[] accountTableTypeList = StringUtils.split(accountTables, ',');
            //获取建设银行下的账户
            Date startDate = DateUtils.parse(start_day, DateUtils.DATE_SMALL_STR);
            Date endDate = DateUtils.parse(end_day, DateUtils.DATE_SMALL_STR);
            List<BaseReportEntity> bankList = reportService.getBankList(BANK_NAME, null, startDate, endDate);
            for (BaseReportEntity reportEntity: bankList) {
                String accountNo = reportEntity.getAD();
                Integer accountId = reportEntity.getADID();
                String accountName = reportEntity.getName();
                for (String tableType: accountTableTypeList) {
                    String destFileName = this.getDestExcelName(accountNo, tableType, null);
                    this.createExcel(request, destDir, destFileName, BANK_NAME, accountId.toString(), accountNo, accountName, tableType, start_day, end_day);
                }
            }
            //生成客户级表
            String customerTables = CCBReportConstant.CUSTOMER_TABLES;
            String[] customerTableTypeList = StringUtils.split(customerTables, ',');
            //step1 生成所有的客户级报表
            for (String tableType: customerTableTypeList) {
                String destFileName = this.getDestExcelName(null, tableType, 0);
                this.createExcel(request, destDir, destFileName, BANK_NAME, ACCOUNT_ID, null, ACCOUNT_NAME, tableType, start_day, end_day);
            }
            //step2 文件压缩
            // form_合约编号_yyyyMMddhhmmss.zip，其中yyyyMM为报表中数据的年月，后面的ddhhmmss取当前时间戳日时分秒(视为唯一标识)
            SimpleDateFormat df = new SimpleDateFormat("ddhhmmss");
            String dateStr = df.format(new Date()); //当前时间戳, 日时分秒
            String zipName = "form_" + AGENT_CODE + "_" + dateDir + dateStr + ".zip";


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
        long end = System.currentTimeMillis();
        System.out.println((end-start) /1000);
        return JSONObject.toJSONString(resultMap);
    }

    /**
     * 报表生成状态
     * @param reportType
     * @param accountInfo
     * @param createStatus
     */
    private void initReportStatusList(String reportType, AccountInfoEntity accountInfo, int createStatus) {
        //根据报表类型,创建展示的列表
        List<Map<String, Object>> reportList = this.buildReportList(reportType, accountInfo, createStatus);
        //k客户级列表
        if(IReportType.CUSTOMER_TYPE.equals(reportType)){
            custumerReportList.addAll(reportList);
            customerReportMap.put(CODE, 200);
            customerReportMap.put(DATA, custumerReportList);
        }else {
            //账户级列表
            accountReportList.addAll(reportList);
            accountReportMap.put(CODE, 200);
            accountReportMap.put(DATA, accountReportList);
        }
    }

    /**
     *
     * @param reportType
     * @param createStatus
     * @return
     */
    private List<Map<String, Object>> buildReportList(String reportType, AccountInfoEntity accountInfo,  int createStatus) {
        if (accountInfo == null){
            accountInfo = new AccountInfoEntity();
        }
        String tableString = reportTypeMap.get(reportType);
        String[] tableTypes = StringUtils.split(tableString, ',');

        List<Map<String, Object>> reportList = new ArrayList<>();
        for (String tableType: tableTypes) {
            Map<String, Object> rowMap = new HashMap<>();
            if (IReportType.ACCOUNT_TYPE.equals(reportType)){
                rowMap.put("bank_name", accountInfo.getBankName());
                rowMap.put("account_id", accountInfo.getADID());
                rowMap.put("account_no", accountInfo.getAD());
                rowMap.put("account_name", accountInfo.getName());
            }
            rowMap.put("report_name", tableType);
            rowMap.put("report_status",  createStatus);
            reportList.add(rowMap);
        }
        return reportList;
    }

    /**
     * 更新生成状态
     *  @param reportType
     * @param tableType
     * @param createStatus
     */
    private void updateCreateStatus(String reportType, String tableType, int createStatus) throws Exception {
        List<Map<String, Object>> reportList;
        if (IReportType.CUSTOMER_TYPE.equals(reportType)){
            reportList = (List<Map<String, Object>>) customerReportMap.get(DATA);
        }else{
            reportList = (List<Map<String, Object>>) accountReportMap.get(DATA);
        }

        if (CollectionUtils.isEmpty(reportList)) {
            throw new Exception("暂无该银行报表列表!");
        }
        for (Map<String, Object> rowMap : reportList) {
            boolean isContains = rowMap.containsValue(tableType);
            if (isContains) {
                rowMap.put("report_status", createStatus);
            }
        }
    }
}