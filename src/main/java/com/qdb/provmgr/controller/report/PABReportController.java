package com.qdb.provmgr.controller.report;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import com.alibaba.fastjson.JSONObject;
import com.qdb.provmgr.service.FtpFileService;
import com.qdb.provmgr.service.pab.PABService;
import com.qdb.provmgr.util.FileUtil;
import com.qdb.provmgr.util.StringUtils;
import com.qdb.provmgr.util.constant.JSONInfo;

/**
 * 平安银行报表导出
 *
 */
@RequestMapping("/report/pab")
@Controller
public class PABReportController {
	private Logger logger = LoggerFactory.getLogger(PABReportController.class);
	private final String FTP_BANK_PATH = "/备付金报表/平安银行/";
	String sep = System.getProperty("file.separator");
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
	
	private String FILE_SUFFIX = ".xls";
	
	
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
    	Map<String,Object> resultMap = new HashMap<>();
    	List<Object> dataList = new ArrayList<>();
    	String dateString = start_day.substring(0, 7).replace("-", "");
    	String pabFtpDir = FTP_BANK_PATH + dateString + sep;
    	String[] tableList = StringUtils.split(pabReportList, ',');
    	for (int i =0; i<tableList.length;i++) {
    		tableList[i] = dateString + "_BJ0000004_" + tableList[i] + "_SZ_766004.xls";
		}
    	String[][] fileStatus = ftpFileService.checkFileStatus(pabFtpDir, tableList);
    	for (String[] arr: fileStatus) {
    		Map<String, Object> reportMap = new HashMap<>();
            String fileName = arr[0];
            if(StringUtils.isEmpty(fileName)){
                continue;
            }
            String reportStatus = arr[1];
            String tableName = fileName.substring(17, fileName.length()-14);
            reportMap.put("report_status", reportStatus);
            reportMap.put("report_name", tableName);
            dataList.add(reportMap);
        }
    	resultMap.put("code", 200);
    	resultMap.put("data", dataList);
    	return JSONObject.toJSONString(resultMap);
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
    	int succesNumber = 0;
        Map<String, Object> resultMap = new HashMap<>();
        int code = 200;
        String message = "失败";
        List<Map<String, String>> reportList = null;
        int tableNumber = 0;
        try {
            JSONObject jsonObject = JSONObject.parseObject(jsonStr);
            String beginDate = (String) jsonObject.get("start_day");
            String endDate = (String) jsonObject.get("end_day");
            reportList = (List<Map<String, String>>) jsonObject.get("report_list");
            if(null != reportList && 0 != reportList.size()){
            	tableNumber = reportList.size();
            }
            String sep = System.getProperty("file.separator");
            String dateDir = null;
            if (StringUtils.isEmpty(beginDate)){
                resultMap.put("code", 400);
                resultMap.put("message", "日期不能为空");
                return JSONObject.toJSONString(resultMap);
            } else {
            	dateDir = beginDate.substring(0, 7).replace("-", "");
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
                    String destFileName = dateDir + "_BJ0000004_" + tableType + "_SZ_766004.xls";
                    String localExcelPath = destDir;
                    String ftpExcelPath = FTP_BANK_PATH + dateDir + sep;
                    //模板相对于WEB-INF的路径
                    String tempRelativePath = templatePath + sep + "pab" + sep + templateName;
                    String realPath = request.getServletContext().getRealPath("/WEB-INF/");
                    String excelTemplatePath = realPath + sep + tempRelativePath;
                    try {
                    	PABService.createEachTypeExcel(excelTemplatePath,destFileName,localExcelPath,tableType,beginDate,endDate);
                    	boolean uploadResult = ftpFileService.uploadFileToFtp(localExcelPath + destFileName,ftpExcelPath + destFileName );
                    	if(uploadResult){
                    		succesNumber++;
                    	}
                    	logger.info("平安备付金报表创建完成! 报表名称:{}", destFileName);
                    } catch (Exception e) {
                    	e.printStackTrace();
                    }
                }
            }
        } catch (Exception e) {
        	e.printStackTrace();
        }
        if(tableNumber == succesNumber){
        	code = 200;
        	message = "共记" + succesNumber + "张报表，创建成功";
        }else{
        	code = 400;
        	message = "共记" + succesNumber + "张报表创建成功,创建失败" + (tableNumber - succesNumber) + "张";
        }
        resultMap.put(JSONInfo.JSONConstant.CODE.getValue(), code);
        resultMap.put(JSONInfo.JSONConstant.MESSAGE.getValue(), message);
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
    public Map<String, Object> download(HttpServletRequest request, HttpServletResponse response, String start_day, String end_day, String report_name) {
    	int code = 400;
    	String message = "失败";
        Map<String, Object> resultMap = new HashMap<String, Object>();
    	try {
			String dateDir = start_day.substring(0, 7).replace("-", "");
			String fileName = dateDir + "_BJ0000004_" + report_name + "_SZ_766004.xls";
			response.reset();
			response.setHeader("Cache-Control", "private");
			response.setHeader("Pragma", "private");
			response.setContentType("application/vnd.ms-excel;charset=UTF-8");
			response.setHeader("Content-Type", "application/force-download");
			response.setHeader("Content-Disposition", "attachment;filename=" + new String(fileName.getBytes(), "UTF-8"));
			ftpFileService.downloadFileFromFtp(FTP_BANK_PATH + sep + dateDir + sep + fileName, response);
			code = 200;
	    	message = "成功";
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put(JSONInfo.JSONConstant.CODE.getValue(), code);
        resultMap.put(JSONInfo.JSONConstant.MESSAGE.getValue(), message);
        return resultMap;
    }
	
    
    /**
     * 下载全部文件
     * @param request
     * @param response
     * @param start_day
     * @param end_day
     * @return
     */
    @RequestMapping(value = "/download-all", method = RequestMethod.GET)
    @ResponseBody
    public String downloadAll(HttpServletRequest request, HttpServletResponse response, String start_day, String end_day) {
    	int code = 400;
    	String message = "失败";
    	Map<String, Object> resultMap = new HashMap<String, Object>();
    	String dateDir = start_day.substring(0, 7).replace("-", "");
        if (StringUtils.isEmpty(start_day)) {
        	message = "日期不能为空";
        } else {
        	try {
                String ftpPath = FTP_BANK_PATH + dateDir + sep;
                String fileName = dateDir + "_BJ0000004_SZ_766004.zip";
                ftpFileService.downloadAndCompressFromFtp(request, response, ftpPath, fileName, FILE_SUFFIX);
                code = 200;
            	message = "成功";
            } catch (Exception e) {
            	e.printStackTrace();
            }
        }
        resultMap.put(JSONInfo.JSONConstant.CODE.getValue(), code);
        resultMap.put(JSONInfo.JSONConstant.MESSAGE.getValue(), message);
        return JSONObject.toJSONString(resultMap);
    }
	
    /**
     * 报送接口
     *
     * @return
     */
    @RequestMapping(value = "submit")
    @ResponseBody
    public Map<String, Object> submit(HttpServletRequest request, HttpServletResponse response, String start_day, String end_day) {
        Map<String, Object> resultMap = new HashMap<String, Object>();
        int code = 400;
    	String message = "失败";
        String dateDir = start_day.substring(0, 7).replace("-", "");
        if (StringUtils.isEmpty(dateDir)) {
        	message = "日期不能为空";
        }
        String ftpPath = FTP_BANK_PATH + dateDir + sep ;
        String zipName = dateDir + "_BJ0000004_SZ_766004.zip";
        File tempFile = FileUtil.createTempFile( zipName);
        ftpFileService.retrieveAndCompressFromFtp(ftpPath, tempFile.getAbsolutePath(), FILE_SUFFIX);
        boolean result = ftpFileService.uploadFileToFtp(tempFile.getAbsolutePath(), ftpPath + tempFile.getName());
        if (result) {
            resultMap.put("code", 200);
            resultMap.put("message", "成功!");
        }
        //TODO 调用张梦宇报送接口
        resultMap.put(JSONInfo.JSONConstant.CODE.getValue(), code);
        resultMap.put(JSONInfo.JSONConstant.MESSAGE.getValue(), message);
        return resultMap;
    }
	
}
