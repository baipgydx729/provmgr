package com.qdb.dao.entity.report;

import com.qdb.dao.TableModeEnum;

/**
 * @author mashengli
 */
public abstract class BaseReportEntity implements Comparable<BaseReportEntity> {
    private String natuDate;
    private String bankName;
    private String AD;
    private Integer ADID;
    private String name;
    private TableModeEnum tableMode;

    public String getNatuDate() {
        return natuDate;
    }

    public void setNatuDate(String natuDate) {
        this.natuDate = natuDate;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getAD() {
        return AD;
    }

    public void setAD(String AD) {
        this.AD = AD;
    }

    public Integer getADID() {
        return ADID;
    }

    public void setADID(Integer ADID) {
        this.ADID = ADID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public TableModeEnum getTableMode() {
        return tableMode;
    }

    public void setTableMode(TableModeEnum tableMode) {
        this.tableMode = tableMode;
    }

    /**
     * 按照日期从小到大顺序比较两个数据组
     */
    @Override
    public int compareTo(BaseReportEntity o) {
        if (o == null || o.getNatuDate() == null) {
            return 1;
        } else if (this.getNatuDate() == null) {
            return -1;
        } else {
            return this.natuDate.compareTo(o.getNatuDate());
        }
    }
}
