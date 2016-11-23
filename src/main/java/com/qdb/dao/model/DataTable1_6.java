package com.qdb.dao.model;

/**
 * @author mashengli
 */
public class DataTable1_6 implements Comparable<DataTable1_6> {
    private String natuDate;
    private Double f01;
    private Double f02;
    private Double f03;
    private Double f04;
    private Double f05;
    private Double f06;
    private Double f07;
    private Double f08;
    private Double f09;
    private Double f10;

    private Double g01;
    private Double g02;
    private Double g03;
    private Double g04;
    private Double g05;
    private Double g06;
    private Double g07;
    private Double g08;
    private Double g09;
    private Double g10;
    private Double g11;
    private Double g12;
    private Double g13;
    private Double g14;

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

    public Double getF01() {
        return f01;
    }

    public void setF01(Double f01) {
        this.f01 = f01;
    }

    public Double getF02() {
        return f02;
    }

    public void setF02(Double f02) {
        this.f02 = f02;
    }

    public Double getF03() {
        return f03;
    }

    public void setF03(Double f03) {
        this.f03 = f03;
    }

    public Double getF04() {
        return f04;
    }

    public void setF04(Double f04) {
        this.f04 = f04;
    }

    public Double getF05() {
        return f05;
    }

    public void setF05(Double f05) {
        this.f05 = f05;
    }

    public Double getF06() {
        return f06;
    }

    public void setF06(Double f06) {
        this.f06 = f06;
    }

    public Double getF07() {
        return f07;
    }

    public void setF07(Double f07) {
        this.f07 = f07;
    }

    public Double getF08() {
        return f08;
    }

    public void setF08(Double f08) {
        this.f08 = f08;
    }

    public Double getF09() {
        return f09;
    }

    public void setF09(Double f09) {
        this.f09 = f09;
    }

    public Double getF10() {
        return f10;
    }

    public void setF10(Double f10) {
        this.f10 = f10;
    }

    public Double getG01() {
        return g01;
    }

    public void setG01(Double g01) {
        this.g01 = g01;
    }

    public Double getG02() {
        return g02;
    }

    public void setG02(Double g02) {
        this.g02 = g02;
    }

    public Double getG03() {
        return g03;
    }

    public void setG03(Double g03) {
        this.g03 = g03;
    }

    public Double getG04() {
        return g04;
    }

    public void setG04(Double g04) {
        this.g04 = g04;
    }

    public Double getG05() {
        return g05;
    }

    public void setG05(Double g05) {
        this.g05 = g05;
    }

    public Double getG06() {
        return g06;
    }

    public void setG06(Double g06) {
        this.g06 = g06;
    }

    public Double getG07() {
        return g07;
    }

    public void setG07(Double g07) {
        this.g07 = g07;
    }

    public Double getG08() {
        return g08;
    }

    public void setG08(Double g08) {
        this.g08 = g08;
    }

    public Double getG09() {
        return g09;
    }

    public void setG09(Double g09) {
        this.g09 = g09;
    }

    public Double getG10() {
        return g10;
    }

    public void setG10(Double g10) {
        this.g10 = g10;
    }

    public Double getG11() {
        return g11;
    }

    public void setG11(Double g11) {
        this.g11 = g11;
    }

    public Double getG12() {
        return g12;
    }

    public void setG12(Double g12) {
        this.g12 = g12;
    }

    public Double getG13() {
        return g13;
    }

    public void setG13(Double g13) {
        this.g13 = g13;
    }

    public Double getG14() {
        return g14;
    }

    public void setG14(Double g14) {
        this.g14 = g14;
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
    public int compareTo(DataTable1_6 o) {
        if (o == null || o.getNatuDate() == null) {
            return 1;
        } else if (this.getNatuDate() == null) {
            return -1;
        } else {
            return this.natuDate.compareTo(o.getNatuDate());
        }
    }
}
