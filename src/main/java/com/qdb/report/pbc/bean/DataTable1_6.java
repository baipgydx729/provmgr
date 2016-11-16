package com.qdb.report.pbc.bean;

/**
 * @author mashengli
 */
public class DataTable1_6 implements Comparable<DataTable1_6> {
    private String natuDate;
    private Double F01;
    private Double F02;
    private Double F03;
    private Double F04;
    private Double F05;
    private Double F06;
    private Double F07;
    private Double F08;
    private Double F09;
    private Double F10;

    private Double G01;
    private Double G02;
    private Double G03;
    private Double G04;
    private Double G05;
    private Double G06;
    private Double G07;
    private Double G08;
    private Double G09;
    private Double G10;
    private Double G11;
    private Double G12;
    private Double G13;
    private Double G14;

    public String getNatuDate() {
        return natuDate;
    }

    public void setNatuDate(String natuDate) {
        this.natuDate = natuDate;
    }

    public Double getF01() {
        return F01;
    }

    public void setF01(Double f01) {
        F01 = f01;
    }

    public Double getF02() {
        return F02;
    }

    public void setF02(Double f02) {
        F02 = f02;
    }

    public Double getF03() {
        return F03;
    }

    public void setF03(Double f03) {
        F03 = f03;
    }

    public Double getF04() {
        return F04;
    }

    public void setF04(Double f04) {
        F04 = f04;
    }

    public Double getF05() {
        return F05;
    }

    public void setF05(Double f05) {
        F05 = f05;
    }

    public Double getF06() {
        return F06;
    }

    public void setF06(Double f06) {
        F06 = f06;
    }

    public Double getF07() {
        return F07;
    }

    public void setF07(Double f07) {
        F07 = f07;
    }

    public Double getF08() {
        return F08;
    }

    public void setF08(Double f08) {
        F08 = f08;
    }

    public Double getF09() {
        return F09;
    }

    public void setF09(Double f09) {
        F09 = f09;
    }

    public Double getF10() {
        return F10;
    }

    public void setF10(Double f10) {
        F10 = f10;
    }

    public Double getG01() {
        return G01;
    }

    public void setG01(Double g01) {
        G01 = g01;
    }

    public Double getG02() {
        return G02;
    }

    public void setG02(Double g02) {
        G02 = g02;
    }

    public Double getG03() {
        return G03;
    }

    public void setG03(Double g03) {
        G03 = g03;
    }

    public Double getG04() {
        return G04;
    }

    public void setG04(Double g04) {
        G04 = g04;
    }

    public Double getG05() {
        return G05;
    }

    public void setG05(Double g05) {
        G05 = g05;
    }

    public Double getG06() {
        return G06;
    }

    public void setG06(Double g06) {
        G06 = g06;
    }

    public Double getG07() {
        return G07;
    }

    public void setG07(Double g07) {
        G07 = g07;
    }

    public Double getG08() {
        return G08;
    }

    public void setG08(Double g08) {
        G08 = g08;
    }

    public Double getG09() {
        return G09;
    }

    public void setG09(Double g09) {
        G09 = g09;
    }

    public Double getG10() {
        return G10;
    }

    public void setG10(Double g10) {
        G10 = g10;
    }

    public Double getG11() {
        return G11;
    }

    public void setG11(Double g11) {
        G11 = g11;
    }

    public Double getG12() {
        return G12;
    }

    public void setG12(Double g12) {
        G12 = g12;
    }

    public Double getG13() {
        return G13;
    }

    public void setG13(Double g13) {
        G13 = g13;
    }

    public Double getG14() {
        return G14;
    }

    public void setG14(Double g14) {
        G14 = g14;
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
