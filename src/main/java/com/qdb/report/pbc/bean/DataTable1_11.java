package com.qdb.report.pbc.bean;

/**
 * @author mashengli
 */
public class DataTable1_11 implements Comparable<DataTable1_11> {

    private String natuDate;
    private Double L1;
    private Double L2;
    private Double L3;
    private Double L4;
    private Double L5;
    private Double L6;
    private Double L7;
    private Double L8;
    private Double L9;
    private Double L10;
    private Double L11;
    private Double L12;
    private Double L13;
    private Double L14;
    private Double L15;
    private Double L16;
    private Double L17;
    private Double L18;
    private Double L19;
    private Double L20;
    private Double Z1;
    private Double Z101;
    private Double Z102;
    private Double L21;
    private Double L22;
    private Double L23;
    private Double L24;

    public String getNatuDate() {
        return natuDate;
    }

    public void setNatuDate(String natuDate) {
        this.natuDate = natuDate;
    }

    public Double getL1() {
        return L1;
    }

    public void setL1(Double l1) {
        L1 = l1;
    }

    public Double getL2() {
        return L2;
    }

    public void setL2(Double l2) {
        L2 = l2;
    }

    public Double getL3() {
        return L3;
    }

    public void setL3(Double l3) {
        L3 = l3;
    }

    public Double getL4() {
        return L4;
    }

    public void setL4(Double l4) {
        L4 = l4;
    }

    public Double getL5() {
        return L5;
    }

    public void setL5(Double l5) {
        L5 = l5;
    }

    public Double getL6() {
        return L6;
    }

    public void setL6(Double l6) {
        L6 = l6;
    }

    public Double getL7() {
        return L7;
    }

    public void setL7(Double l7) {
        L7 = l7;
    }

    public Double getL8() {
        return L8;
    }

    public void setL8(Double l8) {
        L8 = l8;
    }

    public Double getL9() {
        return L9;
    }

    public void setL9(Double l9) {
        L9 = l9;
    }

    public Double getL10() {
        return L10;
    }

    public void setL10(Double l10) {
        L10 = l10;
    }

    public Double getL11() {
        return L11;
    }

    public void setL11(Double l11) {
        L11 = l11;
    }

    public Double getL12() {
        return L12;
    }

    public void setL12(Double l12) {
        L12 = l12;
    }

    public Double getL13() {
        return L13;
    }

    public void setL13(Double l13) {
        L13 = l13;
    }

    public Double getL14() {
        return L14;
    }

    public void setL14(Double l14) {
        L14 = l14;
    }

    public Double getL15() {
        return L15;
    }

    public void setL15(Double l15) {
        L15 = l15;
    }

    public Double getL16() {
        return L16;
    }

    public void setL16(Double l16) {
        L16 = l16;
    }

    public Double getL17() {
        return L17;
    }

    public void setL17(Double l17) {
        L17 = l17;
    }

    public Double getL18() {
        return L18;
    }

    public void setL18(Double l18) {
        L18 = l18;
    }

    public Double getL19() {
        return L19;
    }

    public void setL19(Double l19) {
        L19 = l19;
    }

    public Double getL20() {
        return L20;
    }

    public void setL20(Double l20) {
        L20 = l20;
    }

    public Double getZ1() {
        return Z1;
    }

    public void setZ1(Double z1) {
        Z1 = z1;
    }

    public Double getZ101() {
        return Z101;
    }

    public void setZ101(Double z101) {
        Z101 = z101;
    }

    public Double getZ102() {
        return Z102;
    }

    public void setZ102(Double z102) {
        Z102 = z102;
    }

    public Double getL21() {
        return L21;
    }

    public void setL21(Double l21) {
        L21 = l21;
    }

    public Double getL22() {
        return L22;
    }

    public void setL22(Double l22) {
        L22 = l22;
    }

    public Double getL23() {
        return L23;
    }

    public void setL23(Double l23) {
        L23 = l23;
    }

    public Double getL24() {
        return L24;
    }

    public void setL24(Double l24) {
        L24 = l24;
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
