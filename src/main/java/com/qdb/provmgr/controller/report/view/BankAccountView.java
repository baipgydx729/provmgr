package com.qdb.provmgr.controller.report.view;

import java.io.Serializable;
import java.util.List;

/**
 * @author mashengli
 */
public class BankAccountView implements Serializable {
    private static final long serialVersionUID = -4484512703973785817L;

    private String bank_name;
    private List<Account> account_list;

    public String getBank_name() {
        return bank_name;
    }

    public void setBank_name(String bank_name) {
        this.bank_name = bank_name;
    }

    public List<Account> getAccount_list() {
        return account_list;
    }

    public void setAccount_list(List<Account> account_list) {
        this.account_list = account_list;
    }
}
