package com.qdb.provmgr.service.pab;

public interface PABService {
	
	/**
	 * 按类型生产报表
	 * @param destFileName
	 * @param destExcelPath
	 * @param tableType
	 * @param beginDate
	 * @param endDate
	 * @param endDate2 
	 * @throws Exception 
	 */
	void createEachTypeExcel(String tempRelativePath,String destFileName, String destExcelPath, String tableType, String beginDate,
			String endDate) throws Exception;

	
	
	
	
}
