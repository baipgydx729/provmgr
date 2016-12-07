package com.qdb.provmgr.dao.entity.report;

/**
 * @author mashengli
 */
public class AccountInfoEntity {
    private Integer ADID;
    private String AD;
    private String name;
    private String bankName;
    private String branch;
    private String currency;
    private String accType;
    private Integer accState;
    private Boolean isProvision;
    private Boolean isReport;

    public Integer getADID() {
        return ADID;
    }

    public void setADID(Integer ADID) {
        this.ADID = ADID;
    }

    public String getAD() {
        return AD;
    }

    public void setAD(String AD) {
        this.AD = AD;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getAccType() {
        return accType;
    }

    public void setAccType(String accType) {
        this.accType = accType;
    }

    public Integer getAccState() {
        return accState;
    }

    public void setAccState(Integer accState) {
        this.accState = accState;
    }

    public Boolean getIsProvision() {
        return isProvision;
    }

    public void setIsProvision(Boolean isProvision) {
        this.isProvision = isProvision;
    }

    public Boolean getIsReport() {
        return isReport;
    }

    public void setIsReport(Boolean isReport) {
        this.isReport = isReport;
    }

    public void setIsProvision(Integer isProvision) {
        this.isProvision = 1 == isProvision;
    }

    public void setIsReport(Integer isReport) {
        this.isReport = 1 == isReport;
    }
}
