package com.qdb.dao.model;

/**
 * @author mashengli
 */
public class DataTable1_5 implements Comparable<DataTable1_5> {
    private String natuDate;
    private Double E01;
    private Double E02;
    private Double E03;
    private Double E04;
    private Double E05;
    private Double E06;

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
        return E01;
    }

    public void setE01(Double e01) {
        E01 = e01;
    }

    public Double getE02() {
        return E02;
    }

    public void setE02(Double e02) {
        E02 = e02;
    }

    public Double getE03() {
        return E03;
    }

    public void setE03(Double e03) {
        E03 = e03;
    }

    public Double getE04() {
        return E04;
    }

    public void setE04(Double e04) {
        E04 = e04;
    }

    public Double getE05() {
        return E05;
    }

    public void setE05(Double e05) {
        E05 = e05;
    }

    public Double getE06() {
        return E06;
    }

    public void setE06(Double e06) {
        E06 = e06;
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
