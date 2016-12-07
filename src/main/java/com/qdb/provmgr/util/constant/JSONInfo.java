package com.qdb.provmgr.util.constant;

public class JSONInfo {
	/**
	 *表名
	 */
	public enum JSONConstant{
		/**
		 * 返回状态信息
		 */
	    CODE("code"),
		DATA("data"),
		MESSAGE("message");
		private final String value;
		
		JSONConstant(String value){
			this.value = value;
		}
		
		public String getValue(){
			return value;
		}
	}
}
