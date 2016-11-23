package com.qdb.dao.model;

/**
 * @author mashengli
 */
public class DataTable1_10 implements Comparable<DataTable1_10> {
    private String natuDate;
    private Double k01;
    private Double k02;
    private Double k03;
    private Double k04;
    private Double k05;
    private Double k06;
    private Double k07;
    private Double k08;
    private Double k09;
    private Double k10;
    private Double k11;
    private Double k12;
    private Double k13;
    private Double k14;
    private Double k15;
    private Double k16;
    private Double k17;
    private Double k18;
    private Double k19;
    private Double k20;
    private Double k21;
    private Double k22;
    private Double k23;
    private Double k24;

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

    public Double getK01() {
        return k01;
    }

    public void setK01(Double k01) {
        this.k01 = k01;
    }

    public Double getK02() {
        return k02;
    }

    public void setK02(Double k02) {
        this.k02 = k02;
    }

    public Double getK03() {
        return k03;
    }

    public void setK03(Double k03) {
        this.k03 = k03;
    }

    public Double getK04() {
        return k04;
    }

    public void setK04(Double k04) {
        this.k04 = k04;
    }

    public Double getK05() {
        return k05;
    }

    public void setK05(Double k05) {
        this.k05 = k05;
    }

    public Double getK06() {
        return k06;
    }

    public void setK06(Double k06) {
        this.k06 = k06;
    }

    public Double getK07() {
        return k07;
    }

    public void setK07(Double k07) {
        this.k07 = k07;
    }

    public Double getK08() {
        return k08;
    }

    public void setK08(Double k08) {
        this.k08 = k08;
    }

    public Double getK09() {
        return k09;
    }

    public void setK09(Double k09) {
        this.k09 = k09;
    }

    public Double getK10() {
        return k10;
    }

    public void setK10(Double k10) {
        this.k10 = k10;
    }

    public Double getK11() {
        return k11;
    }

    public void setK11(Double k11) {
        this.k11 = k11;
    }

    public Double getK12() {
        return k12;
    }

    public void setK12(Double k12) {
        this.k12 = k12;
    }

    public Double getK13() {
        return k13;
    }

    public void setK13(Double k13) {
        this.k13 = k13;
    }

    public Double getK14() {
        return k14;
    }

    public void setK14(Double k14) {
        this.k14 = k14;
    }

    public Double getK15() {
        return k15;
    }

    public void setK15(Double k15) {
        this.k15 = k15;
    }

    public Double getK16() {
        return k16;
    }

    public void setK16(Double k16) {
        this.k16 = k16;
    }

    public Double getK17() {
        return k17;
    }

    public void setK17(Double k17) {
        this.k17 = k17;
    }

    public Double getK18() {
        return k18;
    }

    public void setK18(Double k18) {
        this.k18 = k18;
    }

    public Double getK19() {
        return k19;
    }

    public void setK19(Double k19) {
        this.k19 = k19;
    }

    public Double getK20() {
        return k20;
    }

    public void setK20(Double k20) {
        this.k20 = k20;
    }

    public Double getK21() {
        return k21;
    }

    public void setK21(Double k21) {
        this.k21 = k21;
    }

    public Double getK22() {
        return k22;
    }

    public void setK22(Double k22) {
        this.k22 = k22;
    }

    public Double getK23() {
        return k23;
    }

    public void setK23(Double k23) {
        this.k23 = k23;
    }

    public Double getK24() {
        return k24;
    }

    public void setK24(Double k24) {
        this.k24 = k24;
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
    public int compareTo(DataTable1_10 o) {
        if (o == null || o.getNatuDate() == null) {
            return 1;
        } else if (this.getNatuDate() == null) {
            return -1;
        } else {
            return this.natuDate.compareTo(o.getNatuDate());
        }
    }
}
