package com.qdb.provmgr.dao.pab.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.dbutils.handlers.ArrayListHandler;
import org.apache.commons.dbutils.handlers.BeanListHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import com.qdb.provmgr.dao.DBUtil;
import com.qdb.provmgr.dao.entity.report.pab.PABEntity;
import com.qdb.provmgr.dao.pab.PABDao;
import com.qdb.provmgr.util.PublicUtil;
import com.qdb.provmgr.util.constant.TableEnum;



@Repository
public class PABDaoImpl implements PABDao{

	@Autowired
    private DBUtil dbUtil;
	
	@Override
	public List<PABEntity> getBaseInfo() {
		
		String sql = "select ADID,AD,name,bankName_S,branch,openBank,accType "
				+ "from [ProvMgr].[info_ADinfo] where bankName_S='平安银行' and isProvision=1";
		return dbUtil.query(sql, new BeanListHandler<PABEntity>(PABEntity.class));
	}

	@Override
	public List<Object[]> getPABTable(String ADID, String startDay,String endDay,String tableType, boolean isSumFlag) {
		StringBuffer sb = new StringBuffer("");
		if(TableEnum.TABLE_TYPE.T1_1.getValue().equals(tableType)){
			sb.append(" SELECT A01,A02,A03,A04,A05,A06,A07,A08,A09,A10,A11,A12,A13,A14 ");
			sb.append(" FROM " + tableType);
			
		}else if(TableEnum.TABLE_TYPE.T1_6.getValue().equals(tableType)){
			sb.append("SELECT F01,F02,F03,F04,F05,F06,F07,F08,F09,F10,"
					+ "G01,G02,G03,G04,G05,G06,G07,G08,G09,G10,G11,G12,G13,G14  "
					+ "FROM " + tableType);
		}else if(TableEnum.TABLE_TYPE.T1_9.getValue().equals(tableType)){
			sb.append("SELECT J01,J02,J03,J04 "
					+ "FROM " + tableType);
		}else if(TableEnum.TABLE_TYPE.T1_10.getValue().equals(tableType)){
			sb.append("SELECT K01,K02,K03,K04,K05,K06,K07,K08,K09,K10,K11,K12,"
					+ "K13,K14,K15,K16,K17,K18,K19,K20,K21,K22,K23,K24 "
					+ "FROM " + tableType);
		}else if(TableEnum.TABLE_TYPE.T1_2_1.getValue().equals(tableType)){
			sb.append("select BB04,BB05,BB06,BB07,BB08,BB09 "
					+ "from " 
					+ tableType);
		}else if(TableEnum.TABLE_TYPE.T1_2.getValue().equals(tableType)){
			sb.append("select BB01,BB02,BB03,BB04,BB05,BB06,BB07,BB08,BB09 "
					+ "from UacAutoCheck.ProvMgr.report_provision_cent_1_2_1" );
		}else if(TableEnum.TABLE_TYPE.T1_3.getValue().equals(tableType)){
			sb.append("select c01 "
					+ "from " + TableEnum.TABLE_TYPE.T1_3.getValue());
		}
		sb.append(" where 1=1 and bankName_S = '平安银行'");
		if(isSumFlag){
			sb.append(" and name = '汇总'  and ADID='99999' ");
		}
		List<Object> paramList = new ArrayList<Object>();
		if(!StringUtils.isEmpty(ADID)){
			sb.append(" and ADID=? ");
			paramList.add(ADID);
		}
		if(!StringUtils.isEmpty(startDay)){
			sb.append(" and natuDate>=? ");
			paramList.add(startDay);
		}
		if(!StringUtils.isEmpty(endDay)){
			sb.append(" and natuDate<? ");
			paramList.add(endDay);
		}
		sb.append(" order by natuDate asc");
		Object [] params = PublicUtil.listToObj(paramList);
		return dbUtil.query(sb.toString(), params,new ArrayListHandler());
	}

	
	
	
	
	
	
}
