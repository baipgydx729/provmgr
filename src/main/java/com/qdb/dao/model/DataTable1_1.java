package com.qdb.dao.model;

/**
 * @author mashengli
 */
public class DataTable1_1 implements Comparable<DataTable1_1> {
    private String natuDate;
    private Double A01;
    private Double A02;
    private Double A03;
    private Double A0301;
    private Double A0302;
    private Double A04;
    private Double A05;
    private Double A06;
    private Double A0601;
    private Double A0602;
    private Double A07;
    private Double A08;
    private Double A09;
    private Double A0901;
    private Double A0902;
    private Double A10;
    private Double A11;
    private Double A12;
    private Double A13;
    private Double A1301;
    private Double A1302;
    private Double A14;

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
        return A01;
    }

    public void setA01(Double a01) {
        A01 = a01;
    }

    public Double getA02() {
        return A02;
    }

    public void setA02(Double a02) {
        A02 = a02;
    }

    public Double getA03() {
        return A03;
    }

    public void setA03(Double a03) {
        A03 = a03;
    }

    public Double getA0301() {
        return A0301;
    }

    public void setA0301(Double a0301) {
        A0301 = a0301;
    }

    public Double getA0302() {
        return A0302;
    }

    public void setA0302(Double a0302) {
        A0302 = a0302;
    }

    public Double getA04() {
        return A04;
    }

    public void setA04(Double a04) {
        A04 = a04;
    }

    public Double getA05() {
        return A05;
    }

    public void setA05(Double a05) {
        A05 = a05;
    }

    public Double getA06() {
        return A06;
    }

    public void setA06(Double a06) {
        A06 = a06;
    }

    public Double getA0601() {
        return A0601;
    }

    public void setA0601(Double a0601) {
        A0601 = a0601;
    }

    public Double getA0602() {
        return A0602;
    }

    public void setA0602(Double a0602) {
        A0602 = a0602;
    }

    public Double getA07() {
        return A07;
    }

    public void setA07(Double a07) {
        A07 = a07;
    }

    public Double getA08() {
        return A08;
    }

    public void setA08(Double a08) {
        A08 = a08;
    }

    public Double getA09() {
        return A09;
    }

    public void setA09(Double a09) {
        A09 = a09;
    }

    public Double getA0901() {
        return A0901;
    }

    public void setA0901(Double a0901) {
        A0901 = a0901;
    }

    public Double getA0902() {
        return A0902;
    }

    public void setA0902(Double a0902) {
        A0902 = a0902;
    }

    public Double getA10() {
        return A10;
    }

    public void setA10(Double a10) {
        A10 = a10;
    }

    public Double getA11() {
        return A11;
    }

    public void setA11(Double a11) {
        A11 = a11;
    }

    public Double getA12() {
        return A12;
    }

    public void setA12(Double a12) {
        A12 = a12;
    }

    public Double getA13() {
        return A13;
    }

    public void setA13(Double a13) {
        A13 = a13;
    }

    public Double getA1301() {
        return A1301;
    }

    public void setA1301(Double a1301) {
        A1301 = a1301;
    }

    public Double getA1302() {
        return A1302;
    }

    public void setA1302(Double a1302) {
        A1302 = a1302;
    }

    public Double getA14() {
        return A14;
    }

    public void setA14(Double a14) {
        A14 = a14;
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
