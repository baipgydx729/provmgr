package com.qdb.provmgr.dao.model.spdb;

import com.qdb.provmgr.report.spdb.SpdbConstant;

public class CommonInfo {

	//银行代码   江苏：p   浦发：6
	private String bankCode;

	//支付机构代码
	private static String organizationId = SpdbConstant.ORGANIZATIONID;

	//交易日期
	private String tradeDate;

	//数据日期
	private String natuDate;

	//币种
	private static String currencyCode = SpdbConstant.ZERO_VALUE;

	//业务类型
	private static String businessType = "7";

	// 备付金账户名
	private String name;

	// 备付金账号
	private String AD;
	//备注
	private static String remark = "";
	
	public String getBankCode() {
		return bankCode;
	}

	public void setBankCode(String bankCode) {
		this.bankCode = bankCode;
	}

	public static String getOrganizationId() {
		return organizationId;
	}

	public static void setOrganizationId(String organizationId) {
		CommonInfo.organizationId = organizationId;
	}

	public String getTradeDate() {
		return tradeDate;
	}

	public void setTradeDate(String tradeDate) {
		this.tradeDate = tradeDate;
	}

	public String getNatuDate() {
		return natuDate;
	}

	public void setNatuDate(String natuDate) {
		this.natuDate = natuDate;
	}

	public static String getCurrencyCode() {
		return currencyCode;
	}

	public static void setCurrencyCode(String currencyCode) {
		CommonInfo.currencyCode = currencyCode;
	}

	public static String getBusinessType() {
		return businessType;
	}

	public static void setBusinessType(String businessType) {
		CommonInfo.businessType = businessType;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAD() {
		return AD;
	}

	public void setAD(String aD) {
		AD = aD;
	}
	
	public static String getRemark() {
		return remark;
	}

	public static void setRemark(String remark) {
		CommonInfo.remark = remark;
	}


		
		
		

}
