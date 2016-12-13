package com.qdb.provmgr.service.spdb;

import java.text.ParseException;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.qdb.provmgr.constant.spdb.Constant;
import com.qdb.provmgr.dao.model.spdb.T1_1;
import com.qdb.provmgr.dao.model.spdb.T1_10;
import com.qdb.provmgr.dao.model.spdb.T1_13;
import com.qdb.provmgr.dao.model.spdb.T1_2;
import com.qdb.provmgr.dao.model.spdb.T1_3;
import com.qdb.provmgr.dao.model.spdb.T1_6;
import com.qdb.provmgr.dao.model.spdb.T1_9;
import com.qdb.provmgr.dao.model.spdb.TDate;
import com.qdb.provmgr.dao.model.spdb.eum.BankCodeEnum;
import com.qdb.provmgr.dao.model.spdb.eum.TableEnum;
import com.qdb.provmgr.dao.spdb.SpdbQueryDao;
import com.qdb.provmgr.util.spdb.SpdbDateUtil;


/**
 * 数据 导出service
 * @author fanjunjian
 *
 */
@Service
public class SpdbReportService {
	
	private static Logger log = LoggerFactory.getLogger(SpdbReportService.class);
	
	@Autowired
	private SpdbQueryDao spdbQueryDao;
	

	public String getT1_1Data(String tradeDate, String bankName, String beginDate, String endDate) {

		StringBuilder buffer = new StringBuilder();
		
		List<T1_1> result = null;
		try {
			result = spdbQueryDao.query(bankName, beginDate, endDate, TableEnum.TABLE1.getDbTable(), T1_1.class);
		} catch (Exception e) {
			log.error("T1_1 数据查询获取失败。异常信息：{}",e.getMessage());
			return null;
		}
		buffer.append(result.size() + Constant.FIELD_SEPARATOR + beginDate + Constant.FIELD_SEPARATOR + endDate + Constant.FIELD_SEPARATOR + Constant.CRLF);
		String bankCode = BankCodeEnum.getBankCode(bankName);
		for (T1_1 record : result) {
			record.setBankCode(bankCode);
			record.setNatuDate(SpdbDateUtil.getYYYYMMDD(record.getNatuDate()));
			record.setTradeDate(tradeDate);
			buffer.append(record.toString() + Constant.CRLF);
		}
		return buffer.toString();

	}
	
	public String getT1_2Data(String tradeDate, String bankName, String beginDate, String endDate) {

		StringBuilder buffer = new StringBuilder();
		String bankCode = BankCodeEnum.getBankCode(bankName);
		List<T1_2> result = null;
		try {
			result = spdbQueryDao.query(bankName, beginDate, endDate, TableEnum.TABLE2.getDbTable(), T1_2.class);
		} catch (Exception e) {
			log.error("T1_2 数据查询获取失败。异常信息：{}",e.getMessage());
			return null;
		}
		buffer.append(result.size() + Constant.FIELD_SEPARATOR + beginDate + Constant.FIELD_SEPARATOR + endDate + Constant.FIELD_SEPARATOR + Constant.CRLF);
		for (T1_2 record : result) {
			record.setBankCode(bankCode);
			record.setNatuDate(SpdbDateUtil.getYYYYMMDD(record.getNatuDate()));
			record.setTradeDate(tradeDate);
			buffer.append(record.toString() + Constant.CRLF);
		}
		return buffer.toString();
	}

	public String getT1_3Data(String tradeDate, String bankName, String beginDate, String endDate) {

		StringBuilder buffer = new StringBuilder();
		String bankCode = BankCodeEnum.getBankCode(bankName);
		List<T1_3> result = null;
		try {
			result = spdbQueryDao.query(bankName, beginDate, endDate, TableEnum.TABLE3.getDbTable(), T1_3.class);
		} catch (Exception e) {
			log.error("T1_3 数据查询获取失败。异常信息：{}",e.getMessage());
			return null;
		}
		buffer.append(result.size() + Constant.FIELD_SEPARATOR + beginDate + Constant.FIELD_SEPARATOR + endDate + Constant.FIELD_SEPARATOR + Constant.CRLF);
		for (T1_3 record : result) {
			record.setBankCode(bankCode);
			record.setNatuDate(SpdbDateUtil.getYYYYMMDD(record.getNatuDate()));
			record.setTradeDate(tradeDate);
			buffer.append(record.toString() + Constant.CRLF);
		}
		return buffer.toString();
	}
	
	public String getT1_6Data(String tradeDate,  String bankName, String beginDate, String endDate) {

		StringBuilder buffer = new StringBuilder();
		String bankCode = BankCodeEnum.getBankCode(bankName);
		List<T1_6> result = null;
		try {
			result = spdbQueryDao.query(bankName, beginDate, endDate, TableEnum.TABLE6.getDbTable(), T1_6.class);
		} catch (Exception e) {
			log.error("T1_6 数据查询获取失败。异常信息：{}",e.getMessage());
			return null;
		}
		buffer.append(result.size() + Constant.FIELD_SEPARATOR + beginDate + Constant.FIELD_SEPARATOR + endDate + Constant.FIELD_SEPARATOR + Constant.CRLF);
		for (T1_6 record : result) {
			record.setBankCode(bankCode);
			record.setNatuDate(SpdbDateUtil.getYYYYMMDD(record.getNatuDate()));
			record.setTradeDate(tradeDate);
			buffer.append(record.toString() + Constant.CRLF);
		}
		return buffer.toString();
	}
	
	public String getT1_9Data(String tradeDate, String bankName, String beginDate, String endDate) {

		StringBuilder buffer = new StringBuilder();
		String bankCode = BankCodeEnum.getBankCode(bankName);
		List<T1_9> result = null;
		try {
			result = spdbQueryDao.query(bankName, beginDate, endDate, TableEnum.TABLE9.getDbTable(), T1_9.class);
		} catch (Exception e) {
			log.error("T1_9 数据查询获取失败。异常信息：{}",e.getMessage());
			return null;
		}
		buffer.append(result.size() + Constant.FIELD_SEPARATOR + beginDate + Constant.FIELD_SEPARATOR + endDate + Constant.FIELD_SEPARATOR + Constant.CRLF);
		for (T1_9 record : result) {
			record.setBankCode(bankCode);
			record.setNatuDate(SpdbDateUtil.getYYYYMMDD(record.getNatuDate()));
			record.setTradeDate(tradeDate);
			buffer.append(record.toString() + Constant.CRLF);
		}
		return buffer.toString();
	}
	
	public String getT1_10Data(String tradeDate, String bankName, String beginDate, String endDate) {

		StringBuilder buffer = new StringBuilder();
		String bankCode = BankCodeEnum.getBankCode(bankName);
		
		List<T1_10> result = null;
		try {
			result = spdbQueryDao.query(bankName, beginDate, endDate, TableEnum.TABLE10.getDbTable(), T1_10.class);
		} catch (Exception e) {
			log.error("T1_10 数据查询获取失败。异常信息：{}",e.getMessage());
			return null;
		}
		buffer.append(result.size() + Constant.FIELD_SEPARATOR + beginDate + Constant.FIELD_SEPARATOR + endDate + Constant.FIELD_SEPARATOR + Constant.CRLF);
		for (T1_10 record : result) {
			record.setBankCode(bankCode);
			record.setNatuDate(SpdbDateUtil.getYYYYMMDD(record.getNatuDate()));
			record.setTradeDate(tradeDate);
			buffer.append(record.toString() + Constant.CRLF);
		}
		return buffer.toString();
	}
	
	public String getT1_13Data(String tradeDate, String bankName, String beginDate, String endDate) {

		StringBuilder buffer = new StringBuilder();
		String bankCode = BankCodeEnum.getBankCode(bankName);
		List<T1_13> result = null;
		try {
			result = spdbQueryDao.query(bankName, beginDate, endDate, TableEnum.TABLE13.getDbTable(), T1_13.class);
		} catch (Exception e) {
			log.error("T1_13 数据查询获取失败。异常信息：{}",e.getMessage());
			return null;
		}
		buffer.append(result.size() + Constant.FIELD_SEPARATOR + beginDate + Constant.FIELD_SEPARATOR + endDate + Constant.FIELD_SEPARATOR + Constant.CRLF);
		for (T1_13 record : result) {
			record.setBankCode(bankCode);
			record.setNatuDate(SpdbDateUtil.getYYYYMMDD(record.getNatuDate()));
			record.setTradeDate(tradeDate);
			buffer.append(record.toString() + Constant.CRLF);
		}
		return buffer.toString();
	}
	
	
	public  String getTDate_Data( String tradeDate,String bankName, String beginDate, String endDate) {
		
		String bankCode = BankCodeEnum.getBankCode(bankName); 
		
		TDate tdate = new TDate();
		tdate.setBankCode(bankCode);
		tdate.setTradeDate(tradeDate);
		Date beginDate_ = null;
		Date endDate_ = null;
		try {
			beginDate_ = SpdbDateUtil.sf_yyyy_MM_dd.parse(beginDate);
			endDate_ = SpdbDateUtil.sf_yyyy_MM_dd.parse(endDate);
		} catch (ParseException e) {
			log.error("日期格式化错误");
			return null;
		}
		Calendar cal = Calendar.getInstance();
		cal.setTime(beginDate_);
		StringBuilder buffer = new StringBuilder();
		buffer.append(Constant.FIELD_SEPARATOR + Constant.CRLF);
		int i = 0;
		while (!cal.getTime().after(endDate_)) {
			i++;
			tdate.setDealDate(SpdbDateUtil.sf_yyyyMMdd.format(cal.getTime()));
			cal.add(Calendar.DAY_OF_MONTH, 1);
			buffer.append(tdate.toString() + Constant.CRLF);
		}
		return i + buffer.toString();

	}
	
	public String getT1_1ADDData(){
		return "";
	}
}
