package com.qdb.provmgr.dao.param;

import java.util.List;

/**
 * @author mashengli
 */
public class ReportParam {
    private String startNatuDate;
    private String endNatuDate;
    private Integer ADID;
    private List<Integer> ADIDs;
    private String bankName;
    /**
     * 是否查询汇总数据，默认不查询汇总
     */
    private Boolean isTotalCount = false;

    public String getStartNatuDate() {
        return startNatuDate;
    }

    public void setStartNatuDate(String startNatuDate) {
        this.startNatuDate = startNatuDate;
    }

    public String getEndNatuDate() {
        return endNatuDate;
    }

    public void setEndNatuDate(String endNatuDate) {
        this.endNatuDate = endNatuDate;
    }

    public Integer getADID() {
        return ADID;
    }

    public void setADID(Integer ADID) {
        this.ADID = ADID;
    }

    public List<Integer> getADIDs() {
        return ADIDs;
    }

    public void setADIDs(List<Integer> ADIDs) {
        this.ADIDs = ADIDs;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public Boolean getIsTotalCount() {
        return isTotalCount;
    }

    public void setIsTotalCount(Boolean isTotalCount) {
        this.isTotalCount = isTotalCount;
    }
}
