package com.qdb.dao.model;

/**
 * @author mashengli
 */
public class DataTable1_1 implements Comparable<DataTable1_1> {
    private String natuDate;
    private Double a01;
    private Double a02;
    private Double a03;
    private Double a0301;
    private Double a0302;
    private Double a04;
    private Double a05;
    private Double a06;
    private Double a0601;
    private Double a0602;
    private Double a07;
    private Double a08;
    private Double a09;
    private Double a0901;
    private Double a0902;
    private Double a10;
    private Double a11;
    private Double a12;
    private Double a13;
    private Double a1301;
    private Double a1302;
    private Double a14;

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

    public Double getA01() {
        return a01;
    }

    public void setA01(Double a01) {
        this.a01 = a01;
    }

    public Double getA02() {
        return a02;
    }

    public void setA02(Double a02) {
        this.a02 = a02;
    }

    public Double getA03() {
        return a03;
    }

    public void setA03(Double a03) {
        this.a03 = a03;
    }

    public Double getA0301() {
        return a0301;
    }

    public void setA0301(Double a0301) {
        this.a0301 = a0301;
    }

    public Double getA0302() {
        return a0302;
    }

    public void setA0302(Double a0302) {
        this.a0302 = a0302;
    }

    public Double getA04() {
        return a04;
    }

    public void setA04(Double a04) {
        this.a04 = a04;
    }

    public Double getA05() {
        return a05;
    }

    public void setA05(Double a05) {
        this.a05 = a05;
    }

    public Double getA06() {
        return a06;
    }

    public void setA06(Double a06) {
        this.a06 = a06;
    }

    public Double getA0601() {
        return a0601;
    }

    public void setA0601(Double a0601) {
        this.a0601 = a0601;
    }

    public Double getA0602() {
        return a0602;
    }

    public void setA0602(Double a0602) {
        this.a0602 = a0602;
    }

    public Double getA07() {
        return a07;
    }

    public void setA07(Double a07) {
        this.a07 = a07;
    }

    public Double getA08() {
        return a08;
    }

    public void setA08(Double a08) {
        this.a08 = a08;
    }

    public Double getA09() {
        return a09;
    }

    public void setA09(Double a09) {
        this.a09 = a09;
    }

    public Double getA0901() {
        return a0901;
    }

    public void setA0901(Double a0901) {
        this.a0901 = a0901;
    }

    public Double getA0902() {
        return a0902;
    }

    public void setA0902(Double a0902) {
        this.a0902 = a0902;
    }

    public Double getA10() {
        return a10;
    }

    public void setA10(Double a10) {
        this.a10 = a10;
    }

    public Double getA11() {
        return a11;
    }

    public void setA11(Double a11) {
        this.a11 = a11;
    }

    public Double getA12() {
        return a12;
    }

    public void setA12(Double a12) {
        this.a12 = a12;
    }

    public Double getA13() {
        return a13;
    }

    public void setA13(Double a13) {
        this.a13 = a13;
    }

    public Double getA1301() {
        return a1301;
    }

    public void setA1301(Double a1301) {
        this.a1301 = a1301;
    }

    public Double getA1302() {
        return a1302;
    }

    public void setA1302(Double a1302) {
        this.a1302 = a1302;
    }

    public Double getA14() {
        return a14;
    }

    public void setA14(Double a14) {
        this.a14 = a14;
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
    public int compareTo(DataTable1_1 o) {
        if (o == null || o.getNatuDate() == null) {
            return 1;
        } else if (this.getNatuDate() == null) {
            return -1;
        } else {
            return this.natuDate.compareTo(o.getNatuDate());
        }
    }

}
