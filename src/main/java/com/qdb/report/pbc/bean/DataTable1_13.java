package com.qdb.report.pbc.bean;

/**
 * @author mashengli
 */
public class DataTable1_13 implements Comparable<DataTable1_13> {
    private String natuDate;
    private Double N01;
    private Double N02;
    private Double N03;
    private Double N04;
    private Double N05;
    private Double N06;

    public String getNatuDate() {
        return natuDate;
    }

    public void setNatuDate(String natuDate) {
        this.natuDate = natuDate;
    }

    public Double getN01() {
        return N01;
    }

    public void setN01(Double n01) {
        N01 = n01;
    }

    public Double getN02() {
        return N02;
    }

    public void setN02(Double n02) {
        N02 = n02;
    }

    public Double getN03() {
        return N03;
    }

    public void setN03(Double n03) {
        N03 = n03;
    }

    public Double getN04() {
        return N04;
    }

    public void setN04(Double n04) {
        N04 = n04;
    }

    public Double getN05() {
        return N05;
    }

    public void setN05(Double n05) {
        N05 = n05;
    }

    public Double getN06() {
        return N06;
    }

    public void setN06(Double n06) {
        N06 = n06;
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
