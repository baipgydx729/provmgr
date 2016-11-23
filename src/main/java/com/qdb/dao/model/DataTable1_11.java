package com.qdb.dao.model;

/**
 * @author mashengli
 */
public class DataTable1_11 implements Comparable<DataTable1_11> {

    private String natuDate;
    private Double l1;
    private Double l2;
    private Double l3;
    private Double l4;
    private Double l5;
    private Double l6;
    private Double l7;
    private Double l8;
    private Double l9;
    private Double l10;
    private Double l11;
    private Double l12;
    private Double l13;
    private Double l14;
    private Double l15;
    private Double l16;
    private Double l17;
    private Double l18;
    private Double l19;
    private Double l20;
    private Double z1;
    private Double z101;
    private Double z102;
    private Double l21;
    private Double l22;
    private Double l23;
    private Double l24;

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

    public Double getL1() {
        return l1;
    }

    public void setL1(Double l1) {
        this.l1 = l1;
    }

    public Double getL2() {
        return l2;
    }

    public void setL2(Double l2) {
        this.l2 = l2;
    }

    public Double getL3() {
        return l3;
    }

    public void setL3(Double l3) {
        this.l3 = l3;
    }

    public Double getL4() {
        return l4;
    }

    public void setL4(Double l4) {
        this.l4 = l4;
    }

    public Double getL5() {
        return l5;
    }

    public void setL5(Double l5) {
        this.l5 = l5;
    }

    public Double getL6() {
        return l6;
    }

    public void setL6(Double l6) {
        this.l6 = l6;
    }

    public Double getL7() {
        return l7;
    }

    public void setL7(Double l7) {
        this.l7 = l7;
    }

    public Double getL8() {
        return l8;
    }

    public void setL8(Double l8) {
        this.l8 = l8;
    }

    public Double getL9() {
        return l9;
    }

    public void setL9(Double l9) {
        this.l9 = l9;
    }

    public Double getL10() {
        return l10;
    }

    public void setL10(Double l10) {
        this.l10 = l10;
    }

    public Double getL11() {
        return l11;
    }

    public void setL11(Double l11) {
        this.l11 = l11;
    }

    public Double getL12() {
        return l12;
    }

    public void setL12(Double l12) {
        this.l12 = l12;
    }

    public Double getL13() {
        return l13;
    }

    public void setL13(Double l13) {
        this.l13 = l13;
    }

    public Double getL14() {
        return l14;
    }

    public void setL14(Double l14) {
        this.l14 = l14;
    }

    public Double getL15() {
        return l15;
    }

    public void setL15(Double l15) {
        this.l15 = l15;
    }

    public Double getL16() {
        return l16;
    }

    public void setL16(Double l16) {
        this.l16 = l16;
    }

    public Double getL17() {
        return l17;
    }

    public void setL17(Double l17) {
        this.l17 = l17;
    }

    public Double getL18() {
        return l18;
    }

    public void setL18(Double l18) {
        this.l18 = l18;
    }

    public Double getL19() {
        return l19;
    }

    public void setL19(Double l19) {
        this.l19 = l19;
    }

    public Double getL20() {
        return l20;
    }

    public void setL20(Double l20) {
        this.l20 = l20;
    }

    public Double getZ1() {
        return z1;
    }

    public void setZ1(Double z1) {
        this.z1 = z1;
    }

    public Double getZ101() {
        return z101;
    }

    public void setZ101(Double z101) {
        this.z101 = z101;
    }

    public Double getZ102() {
        return z102;
    }

    public void setZ102(Double z102) {
        this.z102 = z102;
    }

    public Double getL21() {
        return l21;
    }

    public void setL21(Double l21) {
        this.l21 = l21;
    }

    public Double getL22() {
        return l22;
    }

    public void setL22(Double l22) {
        this.l22 = l22;
    }

    public Double getL23() {
        return l23;
    }

    public void setL23(Double l23) {
        this.l23 = l23;
    }

    public Double getL24() {
        return l24;
    }

    public void setL24(Double l24) {
        this.l24 = l24;
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
    public int compareTo(DataTable1_11 o) {
        if (o == null || o.getNatuDate() == null) {
            return 1;
        } else if (this.getNatuDate() == null) {
            return -1;
        } else {
            return this.natuDate.compareTo(o.getNatuDate());
        }
    }
}
