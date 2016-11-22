package com.qdb.report.pbc.bean;

/**
 * @author mashengli
 */
public class DataTable1_10 implements Comparable<DataTable1_10> {
    private String natuDate;
    private Double K01;
    private Double K02;
    private Double K03;
    private Double K04;
    private Double K05;
    private Double K06;
    private Double K07;
    private Double K08;
    private Double K09;
    private Double K10;
    private Double K11;
    private Double K12;
    private Double K13;
    private Double K14;
    private Double K15;
    private Double K16;
    private Double K17;
    private Double K18;
    private Double K19;
    private Double K20;
    private Double K21;
    private Double K22;
    private Double K23;
    private Double K24;

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
        return K01;
    }

    public void setK01(Double k01) {
        K01 = k01;
    }

    public Double getK02() {
        return K02;
    }

    public void setK02(Double k02) {
        K02 = k02;
    }

    public Double getK03() {
        return K03;
    }

    public void setK03(Double k03) {
        K03 = k03;
    }

    public Double getK04() {
        return K04;
    }

    public void setK04(Double k04) {
        K04 = k04;
    }

    public Double getK05() {
        return K05;
    }

    public void setK05(Double k05) {
        K05 = k05;
    }

    public Double getK06() {
        return K06;
    }

    public void setK06(Double k06) {
        K06 = k06;
    }

    public Double getK07() {
        return K07;
    }

    public void setK07(Double k07) {
        K07 = k07;
    }

    public Double getK08() {
        return K08;
    }

    public void setK08(Double k08) {
        K08 = k08;
    }

    public Double getK09() {
        return K09;
    }

    public void setK09(Double k09) {
        K09 = k09;
    }

    public Double getK10() {
        return K10;
    }

    public void setK10(Double k10) {
        K10 = k10;
    }

    public Double getK11() {
        return K11;
    }

    public void setK11(Double k11) {
        K11 = k11;
    }

    public Double getK12() {
        return K12;
    }

    public void setK12(Double k12) {
        K12 = k12;
    }

    public Double getK13() {
        return K13;
    }

    public void setK13(Double k13) {
        K13 = k13;
    }

    public Double getK14() {
        return K14;
    }

    public void setK14(Double k14) {
        K14 = k14;
    }

    public Double getK15() {
        return K15;
    }

    public void setK15(Double k15) {
        K15 = k15;
    }

    public Double getK16() {
        return K16;
    }

    public void setK16(Double k16) {
        K16 = k16;
    }

    public Double getK17() {
        return K17;
    }

    public void setK17(Double k17) {
        K17 = k17;
    }

    public Double getK18() {
        return K18;
    }

    public void setK18(Double k18) {
        K18 = k18;
    }

    public Double getK19() {
        return K19;
    }

    public void setK19(Double k19) {
        K19 = k19;
    }

    public Double getK20() {
        return K20;
    }

    public void setK20(Double k20) {
        K20 = k20;
    }

    public Double getK21() {
        return K21;
    }

    public void setK21(Double k21) {
        K21 = k21;
    }

    public Double getK22() {
        return K22;
    }

    public void setK22(Double k22) {
        K22 = k22;
    }

    public Double getK23() {
        return K23;
    }

    public void setK23(Double k23) {
        K23 = k23;
    }

    public Double getK24() {
        return K24;
    }

    public void setK24(Double k24) {
        K24 = k24;
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
