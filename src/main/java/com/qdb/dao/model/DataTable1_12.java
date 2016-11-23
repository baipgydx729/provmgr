package com.qdb.dao.model;

/**
 * @author mashengli
 */
public class DataTable1_12 implements Comparable<DataTable1_12> {
    private String natuDate;
    private Double M1;
    private Double M2;
    private Double M3;
    private Double M4;
    private Double M5;
    private Double M6;
    private Double M7;
    private Double M8;
    private Double M9;
    private Double M10;
    private Double M11;
    private Double Z2;
    private Double Z201;
    private Double Z202;
    private Double M12;
    private Double M13;
    private Double M14;

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

    public Double getM1() {
        return M1;
    }

    public void setM1(Double m1) {
        M1 = m1;
    }

    public Double getM2() {
        return M2;
    }

    public void setM2(Double m2) {
        M2 = m2;
    }

    public Double getM3() {
        return M3;
    }

    public void setM3(Double m3) {
        M3 = m3;
    }

    public Double getM4() {
        return M4;
    }

    public void setM4(Double m4) {
        M4 = m4;
    }

    public Double getM5() {
        return M5;
    }

    public void setM5(Double m5) {
        M5 = m5;
    }

    public Double getM6() {
        return M6;
    }

    public void setM6(Double m6) {
        M6 = m6;
    }

    public Double getM7() {
        return M7;
    }

    public void setM7(Double m7) {
        M7 = m7;
    }

    public Double getM8() {
        return M8;
    }

    public void setM8(Double m8) {
        M8 = m8;
    }

    public Double getM9() {
        return M9;
    }

    public void setM9(Double m9) {
        M9 = m9;
    }

    public Double getM10() {
        return M10;
    }

    public void setM10(Double m10) {
        M10 = m10;
    }

    public Double getM11() {
        return M11;
    }

    public void setM11(Double m11) {
        M11 = m11;
    }

    public Double getZ2() {
        return Z2;
    }

    public void setZ2(Double z2) {
        Z2 = z2;
    }

    public Double getZ201() {
        return Z201;
    }

    public void setZ201(Double z201) {
        Z201 = z201;
    }

    public Double getZ202() {
        return Z202;
    }

    public void setZ202(Double z202) {
        Z202 = z202;
    }

    public Double getM12() {
        return M12;
    }

    public void setM12(Double m12) {
        M12 = m12;
    }

    public Double getM13() {
        return M13;
    }

    public void setM13(Double m13) {
        M13 = m13;
    }

    public Double getM14() {
        return M14;
    }

    public void setM14(Double m14) {
        M14 = m14;
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
    public int compareTo(DataTable1_12 o) {
        if (o == null || o.getNatuDate() == null) {
            return 1;
        } else if (this.getNatuDate() == null) {
            return -1;
        } else {
            return this.natuDate.compareTo(o.getNatuDate());
        }
    }
}
