package com.qdb.provmgr.util.constant;

public class TableEnum {
		/**
		 *表名
		 */
		public enum TABLE_TYPE{
			
			/**
			 * 
			 */
			T1_1("UacAutoCheck.ProvMgr.report_provision_cent_1_1"),
			T1_2("T1_2"),
			T1_2_1("UacAutoCheck.ProvMgr.report_provision_cent_1_2_1"),
			T1_3("UacAutoCheck.ProvMgr.report_provision_cent_1_3"),
			T1_6("UacAutoCheck.ProvMgr.report_provision_cent_1_6"),
			T1_9("UacAutoCheck.ProvMgr.report_provision_cent_1_9"),
			T1_10("UacAutoCheck.ProvMgr.report_provision_cent_1_10"),
			T1_13("UacAutoCheck.ProvMgr.report_provision_cent_1_13");
			private final String value;
			
			TABLE_TYPE(String value){
				this.value = value;
			}
			
			public String getValue(){
				return value;
			}
		}
}
