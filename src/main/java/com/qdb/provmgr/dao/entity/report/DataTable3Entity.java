package com.qdb.provmgr.dao.entity.report;

import java.util.List;

/**
 * 封装表3行对象
 * Created by yuwenzhong on 2016-11-28.
 */
public class DataTable3Entity {
   private String bankName;
   private String accountNo;
   private String accountName;
   private List<DataTable1_3> list;

   public String getBankName() {
      return bankName;
   }

   public void setBankName(String bankName) {
      this.bankName = bankName;
   }

   public String getAccountNo() {
      return accountNo;
   }

   public void setAccountNo(String accountNo) {
      this.accountNo = accountNo;
   }

   public String getAccountName() {
      return accountName;
   }

   public void setAccountName(String accountName) {
      this.accountName = accountName;
   }

   public List<DataTable1_3> getList() {
      return list;
   }

   public void setList(List<DataTable1_3> list) {
      this.list = list;
   }
}
