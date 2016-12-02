package com.qdb.provmgr.controller.report.view;

import java.io.Serializable;

/**
 * @author mashengli
 */
public class Account implements Serializable {
    private static final long serialVersionUID = 4679774260934746734L;
    private String bank_name;
    private String account_id;
    private String account_no;
    private String account_name;

    public String getAccount_name() {
        return account_name;
    }

    public void setAccount_name(String account_name) {
        this.account_name = account_name;
    }

    public String getAccount_no() {
        return account_no;
    }

    public void setAccount_no(String account_no) {
        this.account_no = account_no;
    }

    public String getAccount_id() {
        return account_id;
    }

    public void setAccount_id(String account_id) {
        this.account_id = account_id;
    }

    public String getBank_name() {
        return bank_name;
    }

    public void setBank_name(String bank_name) {
        this.bank_name = bank_name;
    }
}
