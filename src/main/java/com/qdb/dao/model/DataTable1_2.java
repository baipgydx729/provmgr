package com.qdb.dao.model;

/**
 * @author mashengli
 */
public class DataTable1_2 implements Comparable<DataTable1_2> {
    private String natuDate;
    private Double b01;
    private Double b02;
    private Double b03;
    private Double b04;
    private Double b05;
    private Double b06;
    private Double b07;
    private Double b08;
    private Double b09;

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

    public Double getB01() {
        return b01;
    }

    public void setB01(Double b01) {
        this.b01 = b01;
    }

    public Double getB02() {
        return b02;
    }

    public void setB02(Double b02) {
        this.b02 = b02;
    }

    public Double getB03() {
        return b03;
    }

    public void setB03(Double b03) {
        this.b03 = b03;
    }

    public Double getB04() {
        return b04;
    }

    public void setB04(Double b04) {
        this.b04 = b04;
    }

    public Double getB05() {
        return b05;
    }

    public void setB05(Double b05) {
        this.b05 = b05;
    }

    public Double getB06() {
        return b06;
    }

    public void setB06(Double b06) {
        this.b06 = b06;
    }

    public Double getB07() {
        return b07;
    }

    public void setB07(Double b07) {
        this.b07 = b07;
    }

    public Double getB08() {
        return b08;
    }

    public void setB08(Double b08) {
        this.b08 = b08;
    }

    public Double getB09() {
        return b09;
    }

    public void setB09(Double b09) {
        this.b09 = b09;
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
    public int compareTo(DataTable1_2 o) {
        if (o == null || o.getNatuDate() == null) {
            return 1;
        } else if (this.getNatuDate() == null) {
            return -1;
        } else {
            return this.natuDate.compareTo(o.getNatuDate());
        }
    }
}
