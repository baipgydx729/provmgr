package com.qdb.provmgr.dao.entity.report.pab;

public class PABEntity_1_3 {
	//SELECT bankName_S,ADID,name,AD,natuDate,C01 from ProvMgr.report_provision_cent_1_3
	
	private String bankName_S;
	
	private String ADID;
	
	private String name;
	
	private String natuDate;
	
	private String C01;

	public String getBankName_S() {
		return bankName_S;
	}

	public void setBankName_S(String bankName_S) {
		this.bankName_S = bankName_S;
	}

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

	public String getNatuDate() {
		return natuDate;
	}

	public void setNatuDate(String natuDate) {
		this.natuDate = natuDate;
	}

	public String getC01() {
		return C01;
	}

	public void setC01(String c01) {
		C01 = c01;
	}
	
	
}
