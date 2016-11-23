package com.qdb.dao.model;

/**
 * @author mashengli
 */
public class DataTable1_13 implements Comparable<DataTable1_13> {
    private String natuDate;
    private Double n01;
    private Double n02;
    private Double n03;
    private Double n04;
    private Double n05;
    private Double n06;

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

    public Double getN01() {
        return n01;
    }

    public void setN01(Double n01) {
        this.n01 = n01;
    }

    public Double getN02() {
        return n02;
    }

    public void setN02(Double n02) {
        this.n02 = n02;
    }

    public Double getN03() {
        return n03;
    }

    public void setN03(Double n03) {
        this.n03 = n03;
    }

    public Double getN04() {
        return n04;
    }

    public void setN04(Double n04) {
        this.n04 = n04;
    }

    public Double getN05() {
        return n05;
    }

    public void setN05(Double n05) {
        this.n05 = n05;
    }

    public Double getN06() {
        return n06;
    }

    public void setN06(Double n06) {
        this.n06 = n06;
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
    public int compareTo(DataTable1_13 o) {
        if (o == null || o.getNatuDate() == null) {
            return 1;
        } else if (this.getNatuDate() == null) {
            return -1;
        } else {
            return this.natuDate.compareTo(o.getNatuDate());
        }
    }
}
