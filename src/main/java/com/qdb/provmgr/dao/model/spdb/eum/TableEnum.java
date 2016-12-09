package com.qdb.provmgr.dao.model.spdb.eum;

import com.qdb.provmgr.constant.spdb.TableConstant;
import com.qdb.provmgr.dao.model.spdb.T1_1;
import com.qdb.provmgr.dao.model.spdb.T1_10;
import com.qdb.provmgr.dao.model.spdb.T1_13;
import com.qdb.provmgr.dao.model.spdb.T1_2;
import com.qdb.provmgr.dao.model.spdb.T1_3;
import com.qdb.provmgr.dao.model.spdb.T1_6;
import com.qdb.provmgr.dao.model.spdb.T1_9;

public enum TableEnum {

	TABLE1("T1-1",TableConstant.TABLE_1, TableConstant.DB_TABLE1_1, T1_1.class),
	TABLE2("T1-2",TableConstant.TABLE_2, TableConstant.DB_TABLE1_2, T1_2.class),
	TABLE3("T1-3",TableConstant.TABLE_3, TableConstant.DB_TABLE1_3, T1_3.class),
	TABLE6("T1-6",TableConstant.TABLE_6, TableConstant.DB_TABLE1_6, T1_6.class),
	TABLE9("T1-9",TableConstant.TABLE_9, TableConstant.DB_TABLE1_9, T1_9.class),
	TABLE10("T1-10",TableConstant.TABLE_10, TableConstant.DB_TABLE1_10, T1_10.class),
	TABLE13("T1-13",TableConstant.TABLE_13, TableConstant.DB_TABLE1_13, T1_13.class),
	TABLE1_ADD("T1-1ADD",TableConstant.TABLE_1_ADD, TableConstant.DB_TABLE1_13, T1_13.class),
	TABLEDATE("TDATE",TableConstant.TABLE_DATE, TableConstant.DB_TABLE1_13, T1_13.class);
	
	
	
	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getProvTable() {
		return provTable;
	}

	public String getDbTable() {
		return dbTable;
	}

	
	public Class<?> getTableClass() {
		return tableClass;
	}

	private String key;
	//备付金表名
	private String provTable;
	//备付金表名对应数据库的表名
	private String dbTable;
	private Class<?> tableClass;
	
	

	private TableEnum(String key, String provTable, String dbTable, Class<?> tableClass) {
		this.key = key;
		this.provTable = provTable;
		this.dbTable = dbTable;
		this.tableClass = tableClass;
	}
	
 
}
