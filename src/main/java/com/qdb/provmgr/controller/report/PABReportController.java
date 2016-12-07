package com.qdb.provmgr.controller.report;

import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.qdb.provmgr.dao.entity.report.DataTable3Entity;
import com.qdb.provmgr.report.ccb.ExcelUtils;
import com.qdb.provmgr.service.FtpFileService;
import com.qdb.provmgr.service.pab.PABService;
import com.qdb.provmgr.util.DateUtils;
import com.qdb.provmgr.util.StringUtils;
import com.qdb.provmgr.util.constant.JSONInfo;

/**
 * 平安银行报表导出
 *
 */
@RequestMapping("/report/pab")
public class PABReportController {
	private Logger logger = LoggerFactory.getLogger(PABReportController.class);
	
	
	@Value("${PAB.report.list}")
    private String pabReportList;
	@Autowired
    private FtpFileService ftpFileService;
	
   @Value("${report.writetable.name}")
    private String writetable;

    @Value("${report.checktable.name}")
    private String checktable;

    @Value("${excel.template.path}")
    private String templatePath;
    
	@Autowired
    private PABService PABService;
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
    	Map<String, Object> reportMap = new HashMap<>();
    	List<Map<String, Object>> statusList = new ArrayList<>();
    	Map<String, Object> rowMap = new HashMap<>();
        String[] tableTypes = StringUtils.split(pabReportList, ',');
        for (String tableType : tableTypes) {
        	rowMap.put("report_name", tableType);
            rowMap.put("report_status", false);
            statusList.add(rowMap);
        }
        reportMap.put(JSONInfo.JSONConstant.CODE.getValue(), 200);
        reportMap.put(JSONInfo.JSONConstant.DATA.getValue(), statusList);
        return JSONObject.toJSONString(reportMap);
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
        try {
            JSONObject jsonObject = JSONObject.parseObject(jsonStr);
            String beginDate = (String) jsonObject.get("start_day");
            String endDate = (String) jsonObject.get("end_day");
            List<Map<String, String>> reportList = (List<Map<String, String>>) jsonObject.get("report_list");

            String sep = System.getProperty("file.separator");
            String dateDir = null;
            if (StringUtils.isNotEmpty(beginDate)){
                dateDir = beginDate.substring(0, 7).replace("-", "");
            }
            String destDir = System.getProperty("java.io.tmpdir") + sep + "pab" + sep;
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
                String templateName = "pab" + tableType + ".xls";
                //201401_BJ0000004_T1-1_SZ_766004.xls
                String destFileName = dateDir + "BJ0000004_" + tableType + "_SZ_766004.xls";
                String destExcelPath = destDir + destFileName;
                //模板相对于WEB-INF的路径
                String tempRelativePath = templatePath + sep + "pab" + sep + templateName;
                try {
                	PABService.createEachTypeExcel(tempRelativePath,destFileName,destExcelPath,tableType,beginDate,endDate);
                    logger.info("建设银行备付金报表创建完成! 报表名称:{}", destFileName);
                } catch (Exception e) {
                    code = 400;
                    message = destFileName + "创建失败!";
                    resultMap.put(JSONInfo.JSONConstant.CODE.getValue(), code);
                    resultMap.put(JSONInfo.JSONConstant.MESSAGE.getValue(), message);
                    logger.error("建设银行备付金报表创建失败! 报表名称:{},失败原因:{}", destFileName, e.getMessage());
                    return JSONObject.toJSONString(resultMap);
                }

                String remotePath = "/备付金报表/建设银行/" + dateDir + "/";
                boolean isSuccess = ftpFileService.uploadFileToFtp(destExcelPath, remotePath);
                if (!isSuccess) {
                    logger.error("建设银行备付金报表上传至FTP失败,报表名称:{}!", destExcelPath);
                    code = 400;
                    message = destFileName + "上传至FTP失败!";
                    resultMap.put(JSONInfo.JSONConstant.CODE.getValue(), code);
                    resultMap.put(JSONInfo.JSONConstant.MESSAGE.getValue(), message);
                    return JSONObject.toJSONString(resultMap);
                }
            }
            logger.info("************建设银行备付金报表创建并上传至FTP全部完成!************");
        } catch (Exception e) {
            code = 400;
            message = "失败:" + e.getMessage();
            logger.error("************建设银行备付金报表创建并上传至FTP失败!************");
        }
        resultMap.put(JSONInfo.JSONConstant.CODE.getValue(), code);
        resultMap.put(JSONInfo.JSONConstant.MESSAGE.getValue(), message);
        logger.info("**************" + JSONObject.toJSONString(resultMap) + "**************");
        return JSONObject.toJSONString(resultMap);
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
		return report_name;
//        Map<String, Object> resultMap = new HashMap<>();
//        int code = 200;
//        String message = "成功";
//
//        try {
//            this.downloadExcel(request, response, start_day, end_day, report_name);
//        } catch (Exception e) {
//            logger.error(e.getMessage());
//            code = 400;
//            message = "失败:" + e.getMessage();
//            resultMap.put(CODE, code);
//            resultMap.put(MESSAGE, message);
//            return JSONObject.toJSONString(resultMap);
//        }
//        resultMap.put(CODE, code);
//        resultMap.put(MESSAGE, message);
//        logger.info("**************" + JSONObject.toJSONString(resultMap) + "**************");
//        return JSONObject.toJSONString(resultMap);
    }
	
	
	
	
	
}
