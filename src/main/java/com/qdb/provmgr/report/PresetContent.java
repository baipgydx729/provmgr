package com.qdb.provmgr.report;

/**
 * @author mashengli
 * 表格模板中预设单元格的内容
 */
public class PresetContent {
    /**
     * 支付机构名称
     */
    private String companyName;
    /**
     * 备付金银行法人名称
     */
    private String legalPerson;
    /**
     * 授权分支机构名称
     */
    private String authCompanyName;
    /**
     * 交易时期。格式yyyyMM
     */
    private String tranPeriod;
    /**
     * 开户银行名称
     */
    private String bankName;
    /**
     * 备付金账户名称
     */
    private String accountName;
    /**
     * 备付金账户
     */
    private String account;
    /**
     * 备付金账户id
     */
    private String accountId;
    /**
     * 填报日期，格式yyyyMMdd
     */
    private String reportDate;

    /**
     * 填报人员名称
     */
    private String reportUserName;

    /**
     * 复核人员名称
     */
    private String checkUserName;

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getLegalPerson() {
        return legalPerson;
    }

    public void setLegalPerson(String legalPerson) {
        this.legalPerson = legalPerson;
    }

    public String getAuthCompanyName() {
        return authCompanyName;
    }

    public void setAuthCompanyName(String authCompanyName) {
        this.authCompanyName = authCompanyName;
    }

    public String getTranPeriod() {
        return tranPeriod;
    }

    public void setTranPeriod(String tranPeriod) {
        this.tranPeriod = tranPeriod;
    }

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

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getReportDate() {
        return reportDate;
    }

    public void setReportDate(String reportDate) {
        this.reportDate = reportDate;
    }

    public String getReportUserName() {
        return reportUserName;
    }

    public void setReportUserName(String reportUserName) {
        this.reportUserName = reportUserName;
    }

    public String getCheckUserName() {
        return checkUserName;
    }

    public void setCheckUserName(String checkUserName) {
        this.checkUserName = checkUserName;
    }

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }
}
