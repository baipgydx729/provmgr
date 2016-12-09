package com.qdb.provmgr.dao.pab;

import java.util.List;

import com.qdb.provmgr.dao.entity.report.pab.PABEntity;



public interface PABDao {
	/**
	 * 取所有平安银行的账户
	 * @return
	 */
	List<PABEntity> getBaseInfo();
	
	/**
	 * 通过ADID取
	 * @param ADID 
	 * @param isSumFlag是否是汇总账户查询
	 * @return
	 */
	List<Object[]> getPABTable(String ADID,String startDay, String endDay,String tableType, boolean isSumFlag);

}
