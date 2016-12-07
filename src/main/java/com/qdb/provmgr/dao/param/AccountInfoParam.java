package com.qdb.provmgr.dao.param;

/**
 * @author mashengli
 */
public class AccountInfoParam {
    private Integer ADID;
    private String AD;
    private String bankName;
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

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
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
}
