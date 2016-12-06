package com.qdb.provmgr.service.pab;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Workbook;

public interface PABService {
	/**
	 * 导出表T1-1
	 * @param endDay 
	 * @param startDay 
	 * @return
	 * @throws Exception 
	 */
	HSSFWorkbook reportPABTableT1_1(String startDay, String endDay) throws Exception;
	
	/**
	 * 导出表1_6
	 * @param startDay
	 * @param endDay
	 * @return
	 * @throws Exception 
	 */
	Workbook reportPABTableT1_6(String startDay, String endDay) throws Exception;
	/**
	 * 导出1_9
	 * @param startDay
	 * @param endDay
	 * @return
	 * @throws Exception 
	 */
	Workbook reportPABTableT1_9(String startDay, String endDay) throws Exception;
	/**
	 * 导出1_10
	 * @param startDay
	 * @param endDay
	 * @return
	 * @throws Exception 
	 */
	Workbook reportPABTableT1_10(String startDay, String endDay) throws Exception;
	
	/**
	 * 导出1_2
	 * @param startDay
	 * @param endDay
	 * @return
	 * @throws Exception 
	 */
	Workbook reportPABTableT1_2(String startDay, String endDay) throws Exception;
	
	/**
	 * 导出1_2_1
	 * @param startDay
	 * @param endDay
	 * @return
	 * @throws Exception 
	 */
	Workbook reportPABTableT1_2_1(String startDay, String endDay) throws Exception;
	/**
	 * 导出1_13
	 * @param startDay
	 * @param endDay
	 * @return
	 */
	Workbook reportPABTableT1_13(String startDay, String endDay) throws Exception;
	
	/**
	 * 	导出1-3
	 * @param startDay
	 * @param endDay
	 * @return
	 * @throws Exception 
	 */
	Workbook reportPABTableT1_3(String startDay, String endDay) throws Exception;

	
	
	
	
}
