package com.qdb.report.pbc.bean;

/**
 * @author mashengli
 */
public class DataTable1_4 implements Comparable<DataTable1_4> {
    private String natuDate;
    private Double D01;
    private Double D02;
    private Double D03;
    private Double D04;

    public String getNatuDate() {
        return natuDate;
    }

    public void setNatuDate(String natuDate) {
        this.natuDate = natuDate;
    }

    public Double getD01() {
        return D01;
    }

    public void setD01(Double d01) {
        D01 = d01;
    }

    public Double getD02() {
        return D02;
    }

    public void setD02(Double d02) {
        D02 = d02;
    }

    public Double getD03() {
        return D03;
    }

    public void setD03(Double d03) {
        D03 = d03;
    }

    public Double getD04() {
        return D04;
    }

    public void setD04(Double d04) {
        D04 = d04;
    }

    /**
     * 按照日期从小到大顺序比较两个数据组
     */
    @Override
    public int compareTo(DataTable1_4 o) {
        if (o == null || o.getNatuDate() == null) {
            return 1;
        } else if (this.getNatuDate() == null) {
            return -1;
        } else {
            return this.natuDate.compareTo(o.getNatuDate());
        }
    }
}
