package com.qdb.dao.model;

/**
 * @author mashengli
 */
public class DataTable1_5 implements Comparable<DataTable1_5> {
    private String natuDate;
    private Double e01;
    private Double e02;
    private Double e03;
    private Double e04;
    private Double e05;
    private Double e06;

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

    public Double getE01() {
        return e01;
    }

    public void setE01(Double e01) {
        this.e01 = e01;
    }

    public Double getE02() {
        return e02;
    }

    public void setE02(Double e02) {
        this.e02 = e02;
    }

    public Double getE03() {
        return e03;
    }

    public void setE03(Double e03) {
        this.e03 = e03;
    }

    public Double getE04() {
        return e04;
    }

    public void setE04(Double e04) {
        this.e04 = e04;
    }

    public Double getE05() {
        return e05;
    }

    public void setE05(Double e05) {
        this.e05 = e05;
    }

    public Double getE06() {
        return e06;
    }

    public void setE06(Double e06) {
        this.e06 = e06;
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
    public int compareTo(DataTable1_5 o) {
        if (o == null || o.getNatuDate() == null) {
            return 1;
        } else if (this.getNatuDate() == null) {
            return -1;
        } else {
            return this.natuDate.compareTo(o.getNatuDate());
        }
    }
}
