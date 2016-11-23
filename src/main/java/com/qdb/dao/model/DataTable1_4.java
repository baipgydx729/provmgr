package com.qdb.dao.model;

/**
 * @author mashengli
 */
public class DataTable1_4 implements Comparable<DataTable1_4> {
    private String natuDate;
    private Double d01;
    private Double d02;
    private Double d03;
    private Double d04;

    //
    private String bankName;
    private String AD;
    private Integer ADID;
    private String name;

    public String getNatuDate() {
        return natuDate;
    }

    public void setNatuDate(String natuDate) {
        this.natuDate = natuDate;
    }

    public Double getD01() {
        return d01;
    }

    public void setD01(Double d01) {
        this.d01 = d01;
    }

    public Double getD02() {
        return d02;
    }

    public void setD02(Double d02) {
        this.d02 = d02;
    }

    public Double getD03() {
        return d03;
    }

    public void setD03(Double d03) {
        this.d03 = d03;
    }

    public Double getD04() {
        return d04;
    }

    public void setD04(Double d04) {
        this.d04 = d04;
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

    /**
     * 按照日期从小到大顺序比较两个数据组
     */
    @Override
    public int compareTo(DataTable1_4 o) {
        if (o == null || o.getNatuDate() == null) {
            return 1;
        } else if (this.getNatuDate() == null) {
            return -1;
        } else {
            return this.natuDate.compareTo(o.getNatuDate());
        }
    }
}
