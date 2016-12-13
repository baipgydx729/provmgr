package com.qdb.provmgr.controller.report.view.spdb;

public class CreatedStatus {
	
	private String report_name;
	
	private String message;
	public CreatedStatus(){
		
	}
	
	public CreatedStatus(String report_name,String message){
		this.report_name = report_name;
		this.message = message;
	}

	public String getReport_name() {
		return report_name;
	}

	public void setReport_name(String report_name) {
		this.report_name = report_name;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
	
	

}
