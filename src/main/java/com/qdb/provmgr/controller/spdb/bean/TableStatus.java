package com.qdb.provmgr.controller.spdb.bean;

public class TableStatus {
	
	private String report_name;
	
	private String report_status;
	
	public TableStatus(String report_name,String report_status){
		this.report_name = report_name;
		this.report_status = report_status;
	}

	public String getReport_name() {
		return report_name;
	}

	public void setReport_name(String report_name) {
		this.report_name = report_name;
	}

	public String getReport_status() {
		return report_status;
	}

	public void setReport_status(String report_status) {
		this.report_status = report_status;
	}
	
}
