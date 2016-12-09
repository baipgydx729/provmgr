package com.qdb.provmgr.dao.model.spdb.eum;

public enum BankCodeEnum {
	
	JIANGSU("江苏银行","p"),
	PUFA("上海浦东发展银行股份有限公司","6");
	
	public String getBankName() {
		return bankName;
	}

	public void setBankName(String bankName) {
		this.bankName = bankName;
	}

	public String getBankCode() {
		return bankCode;
	}

	public void setBankCode(String bankCode) {
		this.bankCode = bankCode;
	}

	private String bankName;
	
	private String bankCode;
	
	
	
	private BankCodeEnum(String bankName, String bankCode) {
		this.bankName = bankName;
		this.bankCode = bankCode;
	}
	
	public static String getBankCode(String bankName){
		for(BankCodeEnum bank : BankCodeEnum.values()){
			if(bank.bankName.equals(bankName)){
				return bank.bankCode;
			}
		}
		return null;
	}
	

	
	
}
