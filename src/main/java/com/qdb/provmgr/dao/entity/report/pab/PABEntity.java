package com.qdb.provmgr.dao.entity.report.pab;

import java.util.List;
/**
 * 
 *平安银行的实体bean
 */
public class PABEntity {
	
	private String ADID;
	
	private String name;
	
	private String bankName_S;
	
	private String branch;
	
	private String openBank;
	
	private String accType;
	
	private String AD;
	
//	List<Double> everyDateList;
	
	public String getADID() {
		return ADID;
	}

	public void setADID(String aDID) {
		ADID = aDID;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getBankName_S() {
		return bankName_S;
	}

	public void setBankName_S(String bankName_S) {
		this.bankName_S = bankName_S;
	}

	public String getBranch() {
		return branch;
	}

	public void setBranch(String branch) {
		this.branch = branch;
	}

	public String getOpenBank() {
		return openBank;
	}

	public void setOpenBank(String openBank) {
		this.openBank = openBank;
	}

	public String getAccType() {
		return accType;
	}

	public void setAccType(String accType) {
		this.accType = accType;
	}

	public String getAD() {
		return AD;
	}

	public void setAD(String aD) {
		AD = aD;
	}
//
//	public List<Double> getEveryDateList() {
//		return everyDateList;
//	}
//
//	public void setEveryDateList(List<Double> everyDateList) {
//		this.everyDateList = everyDateList;
//	}
	
}
