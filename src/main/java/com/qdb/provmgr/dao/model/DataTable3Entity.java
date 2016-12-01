package com.qdb.provmgr.dao.model;


import com.qdb.provmgr.dao.entity.report.DataTable1_3;

import java.util.List;

/**
 * 表3行对象
 * Created by yuwenzhong on 2016-11-24.
 */
public class DataTable3Entity {
    private String bankName;
    private String accountName;
    private String accoutNo;
    private List<DataTable1_3> list;

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public String getAccoutNo() {
        return accoutNo;
    }

    public void setAccoutNo(String accoutNo) {
        this.accoutNo = accoutNo;
    }

    public List<DataTable1_3> getList() {
        return list;
    }

    public void setList(List<DataTable1_3> list) {
        this.list = list;
    }
}
