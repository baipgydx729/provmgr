package com.qdb.provmgr.controller.report;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.net.ftp.FTPClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.qdb.provmgr.report.spdb.TableConstant;
import com.qdb.provmgr.controller.report.view.spdb.TableStatus;
import com.qdb.provmgr.dao.model.spdb.eum.BankCodeEnum;
import com.qdb.provmgr.dao.model.spdb.eum.TableEnum;
import com.qdb.provmgr.service.spdb.SpdbFtpService;
import com.qdb.provmgr.service.spdb.SpdbReportService;
import com.qdb.provmgr.util.spdb.SpdbDateUtil;
import com.qdb.provmgr.util.spdb.SpdbFileUtil;
import com.qdb.provmgr.util.spdb.SpdbZipUtil;

/**
 * 江苏 浦发银行接口
 * 
 * @author fanjunjian
 *
 */
@Controller
public class SpdbController {

	private static Logger log = LoggerFactory.getLogger(SpdbController.class);

	@Autowired
	private SpdbReportService exportService;
	@Autowired
	private SpdbFtpService spdbFtpService;
	/**
	 * 生成各个报表
	 * 
	 * @param bankName
	 * @param param
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/report/{bankName}/create")
	public String export(HttpServletRequest request, HttpServletResponse response,
			@PathVariable("bankName") String bankName, 
			@RequestBody(required = false) String param) {

		JSONObject json = JSON.parseObject(param);
		String start_day = json.getString("start_day");
		String end_day = json.getString("end_day");
		String bankNameParam = null;
		if (bankName.equals("bojs")) {
			bankNameParam = BankCodeEnum.JIANGSU.getBankName();
		} else if (bankName.equals("spdb")) {
			bankNameParam = BankCodeEnum.PUFA.getBankName();
		} else {
			return "{\"code\": 400,\"message\": \"无法处理该银行请求\"}";
		}
		Date date = new Date();
		String checkedMonth = SpdbDateUtil.getYYYYMM(start_day);
		String currenMonth = SpdbDateUtil.getYYYYMM(date);
		int diff = 0;
		try {
			diff = SpdbDateUtil.monthShort(checkedMonth, currenMonth);
		} catch (ParseException e1) {
			log.error("计算月差出错");
			return "{\"code\":\"400\",\"message\":\"查询失败，请确认时间\"}";
		}
		//List<CreatedStatus> statusList = null;
		StringBuilder buffer = new StringBuilder();
		if (diff == 0) {
			return "{\"code\":\"400\",\"message\":\"当月数据无法生成\"}";
		} else if (diff == 1) {
			String tradeDate = SpdbDateUtil.getYYYYMMDD(date);
			String content = null;
			String fileName_prefix = null;
			JSONObject data = null;
			JSONArray dataArray = json.getJSONArray("report_list");
			//statusList = new ArrayList<>();
			for (int i = 0; i < dataArray.size(); i++) {
				data = dataArray.getJSONObject(i);
				String report_name = data.getString("report_name");
				switch (report_name) {
				case TableConstant.TABLE_1:
					fileName_prefix = TableEnum.TABLE1.getKey();
					content = exportService.getT1_1Data(tradeDate, bankNameParam, start_day, end_day);
					break;
				case TableConstant.TABLE_2:
					fileName_prefix = TableEnum.TABLE2.getKey();
					content = exportService.getT1_2Data(tradeDate, bankNameParam, start_day, end_day);
					break;
				case TableConstant.TABLE_3:
					fileName_prefix = TableEnum.TABLE3.getKey();
					content = exportService.getT1_3Data(tradeDate, bankNameParam, start_day, end_day);
					break;
				case TableConstant.TABLE_6:
					fileName_prefix = TableEnum.TABLE6.getKey();
					content = exportService.getT1_6Data(tradeDate, bankNameParam, start_day, end_day);
					break;
				case TableConstant.TABLE_9:
					fileName_prefix = TableEnum.TABLE9.getKey();
					content = exportService.getT1_9Data(tradeDate, bankNameParam, start_day, end_day);
					break;
				case TableConstant.TABLE_10:
					fileName_prefix = TableEnum.TABLE10.getKey();
					content = exportService.getT1_10Data(tradeDate, bankNameParam, start_day, end_day);
					break;
				case TableConstant.TABLE_13:
					fileName_prefix = TableEnum.TABLE13.getKey();
					content = exportService.getT1_13Data(tradeDate, bankNameParam, start_day, end_day);
					break;
				case TableConstant.TABLE_1_ADD:
					fileName_prefix = TableEnum.TABLE1_ADD.getKey();
					content = exportService.getT1_1ADDData();
					break;
				case TableConstant.TABLE_DATE:
					fileName_prefix = TableEnum.TABLEDATE.getKey();
					content = exportService.getTDate_Data(tradeDate, bankNameParam, start_day, end_day);
					break;
				}
				String fileName = fileName_prefix + "_" + tradeDate + "_" + TableConstant.ORGANIZATIONID + ".dat";
				String tempPath = spdbFtpService.getSpdbTempPath();
				String tempFile = tempPath + UUID.randomUUID().toString() + fileName;
				if (content != null) {
					try {
						SpdbFileUtil.writeToFile(tempFile, content);
					} catch (IOException e) {
						log.error("----------------{}临时文件生成失败------------", fileName);
						//statusList.add(new CreatedStatus(report_name, report_name + "文件生成失败"));
						buffer.append(report_name + ":失败;");
						continue;
					}
					String MonthDir = SpdbDateUtil.getYYYYMM(start_day);
					boolean result = false;
					try {
						result = spdbFtpService.uploadFileToFtp(bankNameParam,tempFile, MonthDir, fileName, fileName_prefix);
					} catch (IOException e) {
						log.error("----------------{}文件上传失败------------", fileName);
						//statusList.add(new CreatedStatus(report_name, report_name + "失败"));
						buffer.append(report_name + ":失败;");
						continue;
					}
					if (!result) {
						log.error("----------------{}文件上传失败返回false------------", fileName);
						//statusList.add(new CreatedStatus(report_name, report_name + "失败"));
						buffer.append(report_name + ":失败;");
						continue;
					}
				} else {
					log.error("----------------{}文件没有取到数据------------", fileName);
					//statusList.add(new CreatedStatus(report_name, report_name + "文件生成失败"));
					buffer.append(report_name + ":失败;");
					continue;
				}
				new File(tempPath + tempFile).delete();
				//statusList.add(new CreatedStatus(report_name, report_name + "成功"));
				buffer.append(report_name + ":成功;");
			}

		} else {
			return "{\"code\":\"400\",\"message\":\"已报送数据不能再生成\"}";
		}
		
		return "{\"code\": \"200\",\"message\": " + "\"" + buffer.toString() + "\"" + "}";
	}

	/**
	 * 获取各个报表的状态
	 * 
	 * @param bankName
	 * @param start_day
	 * @param end_day
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/report/{bankName}/list")
	public String tableList(@PathVariable("bankName") String bankName, @RequestParam("start_day") String start_day,
			@RequestParam("end_day") String end_day) {
		String bankNameParam = null;
		if (bankName.equals("bojs")) {
			bankNameParam = BankCodeEnum.JIANGSU.getBankName();
		} else if (bankName.equals("spdb")) {
			bankNameParam = BankCodeEnum.PUFA.getBankName();
		} else {
			return "{\"code\": 400,\"message\": \"无法处理该银行请求\"}";
		}
		Date date = new Date();
		String checkedMonth = SpdbDateUtil.getYYYYMM(start_day);
		String currenMonth = SpdbDateUtil.getYYYYMM(date);
		int diff = 0;
		try {
			diff = SpdbDateUtil.monthShort(checkedMonth, currenMonth);
		} catch (ParseException e1) {
			log.error("计算月差出错");
			return "{\"code\":\"400\",\"message\":\"查询失败，请确认时间\"}";
		}
		String today = SpdbDateUtil.getYYYYMMDD(new Date());
		String result = null;
		Map<String, String> status = null;
//		if (diff == 0) {
//			return "{\"code\":\"400\",\"message\":\"当月无法查询\"}";
//		}
		if (diff == 1 || diff == 0) {
			try {
				status = spdbFtpService.listTableStatus(bankNameParam,checkedMonth, today);
			} catch (IOException e) {
				result = "{\"code\":\"400\",\"message\":\"查询失败\"}";
				return result;
			}

		} else {
			try {
				status = spdbFtpService.listTableStatus(bankNameParam,checkedMonth, "");
			} catch (IOException e) {
				result = "{\"code\":\"400\",\"message\":\"查询失败\"}";
				return result;
			}

		}
		if (status == null) {
			result = "{\"code\":\"400\",\"message\":\"查询失败\"}";
			return result;
		}
		StringBuilder buffer = new StringBuilder();
		List<TableStatus> tableList = new ArrayList<>();
		for (Map.Entry<String, String> entry : status.entrySet()) {
			for (TableEnum table : TableEnum.values()) {
				if (entry.getKey().equals(table.getKey())) {
					TableStatus tableStatus = new TableStatus(table.getProvTable(), entry.getValue());
					tableList.add(tableStatus);
				}
			}
		}
		buffer.append("{\"code\":\"200\",\"data\":").append(JSON.toJSONString(tableList)).append("}");
		result = buffer.toString();
		return result;
	}

	/**
	 * 单个文件下载
	 * 
	 * @param bankName
	 * @param start_day
	 * @param end_day
	 * @param report_name
	 * @param request
	 * @param response
	 * @return
	 * @throws UnsupportedEncodingException
	 */
	@ResponseBody
	@RequestMapping("/report/{bankName}/download")
	public String downLoadFile(@PathVariable("bankName") String bankName, @RequestParam("start_day") String start_day,
			@RequestParam("end_day") String end_day, @RequestParam("report_name") String report_name,
			HttpServletRequest request, HttpServletResponse response) throws UnsupportedEncodingException {
		String bankNameParam = null;
		if (bankName.equals("bojs")) {
			bankNameParam = BankCodeEnum.JIANGSU.getBankName();
		} else if (bankName.equals("spdb")) {
			bankNameParam = BankCodeEnum.PUFA.getBankName();
		} else {
			return "{\"code\": 400,\"message\": \"无法处理该银行请求\"}";
		}
		Date date = new Date();
		String checkedMonth = SpdbDateUtil.getYYYYMM(start_day);
		String currenMonth = SpdbDateUtil.getYYYYMM(date);
		String today = SpdbDateUtil.getYYYYMMDD(new Date());
		int diff = 0;
		try {
			diff = SpdbDateUtil.monthShort(checkedMonth, currenMonth);
		} catch (ParseException e1) {
			log.error("计算月差出错");
			return "{\"code\":\"400\",\"message\":\"下载失败，请确认时间\"}";
		}

		FTPClient ftp = spdbFtpService.getFtpConnection();
		String fileName = null;
		if (diff == 0) {
			return "{\"code\":\"400\",\"message\":\"当月无法下载\"}";
		} else if (diff == 1) {
			fileName = spdbFtpService.getFileName(bankNameParam,ftp, checkedMonth, report_name, today);

		} else {
			fileName = spdbFtpService.getFileName(bankNameParam,ftp, checkedMonth, report_name, "");
		}

		if (fileName == null) {
			spdbFtpService.close(ftp);
			return "{\"code\": \"400\",\"message\": \"文件不存在\"}";
		}
		InputStream in = null;
		try {
			in = spdbFtpService.downLoad(bankNameParam,checkedMonth, fileName);
		} catch (Exception e) {
			return "{\"code\": \"400\",\"message\": \"" + e.getMessage() + "\"}";
		}
		if (in == null) {
			spdbFtpService.close(ftp);
			return "{\"code\": \"400\",\"message\": \"文件下载失败\"}";
		}
		response.setHeader("Content-Disposition",
				"attachment; filename=" + new String(fileName.getBytes("iso8859-1"), "UTF-8"));
		OutputStream out = null;
		try {
			out = response.getOutputStream();
		} catch (IOException e) {
			log.error("下载{}文件时获取输出流失败", fileName);
			return "{\"code\": \"400\",\"message\": \"文件下载失败\"}";
		}
		byte buffer[] = new byte[1024];
		int len = 0;
		try {
			while ((len = in.read(buffer)) > 0) {
				out.write(buffer, 0, len);
			}
		} catch (IOException e) {
			log.error("下载{}文件时写入失败", fileName);
			return "{\"code\": \"400\",\"message\": \"文件下载失败\"}";
		} finally {
			spdbFtpService.close(ftp);
			try {
				if (in != null) {
					in.close();
				}
				if (out != null) {
					out.close();
				}
				
			} catch (IOException e) {
				log.error("下载{}文件时写入失败", fileName);
			}

		}
		return "{\"code\": \"200\",\"message\": \"文件下载成功\"}";
	}
	@ResponseBody
	@RequestMapping("/report/{bankName}/download-all")
	public String downLoadAll(@PathVariable("bankName") String bankName, 
			@RequestParam("start_day") String start_day,
			@RequestParam("end_day") String end_day,
			HttpServletRequest request, 
			HttpServletResponse response) throws UnsupportedEncodingException {
		
		String bankNameParam = null;
		String ftpPath = null;
		if (bankName.equals("bojs")) {
			bankNameParam = BankCodeEnum.JIANGSU.getBankName();
			ftpPath = spdbFtpService.getjSFtpPath();
		} else if (bankName.equals("spdb")) {
			bankNameParam = BankCodeEnum.PUFA.getBankName();
			ftpPath = spdbFtpService.getSpdbFtpPath();
		} else {
			return "{\"code\": 400,\"message\": \"无法处理该银行请求\"}";
		}
		String tempPath = spdbFtpService.getSpdbTempPath();
		String checkedMonth = SpdbDateUtil.getYYYYMM(start_day);;
		String target = null;
		boolean getSuccess = spdbFtpService.getFtpFileToLocal(bankName,checkedMonth, target);
		if(!getSuccess){
			return "{\"code\": \"400\",\"message\": \"文件下载失败，获取远程文件出错\"}";
		}
		String fileName = checkedMonth + "_" + UUID.randomUUID().toString() + ".zip";
		SpdbZipUtil.compress(ftpPath + checkedMonth, tempPath + fileName);
		
		response.setHeader("Content-Disposition",
				"attachment; filename=" + new String(fileName.getBytes("iso8859-1"), "UTF-8"));
		OutputStream out = null;
		InputStream in = null;
		try {
			out = response.getOutputStream();
			in = new FileInputStream(new File(tempPath + fileName));
		} catch (IOException e) {
			log.error("下载{}文件时获取输出流失败", fileName);
			return "{\"code\": \"400\",\"message\": \"文件下载失败\"}";
		}
		byte buffer[] = new byte[1024];
		int len = 0;
		try {
			while ((len = in.read(buffer)) > 0) {
				out.write(buffer, 0, len);
			}
		} catch (IOException e) {
			log.error("下载{}文件时写入失败", fileName);
			return "{\"code\": \"400\",\"message\": \"文件下载失败\"}";
		} finally {
			try {
				if (in != null) {
					in.close();
				}
				if (out != null) {
					out.close();
				}
				
			} catch (IOException e) {
				log.error("下载{}文件时写入失败", fileName);
			}
			new File(tempPath + fileName).delete();
		}
		
		return "{\"code\": \"200\",\"message\": \"文件下载成功\"}";
	}

}
