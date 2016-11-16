package com.qdb.report.pbc.bean;

/**
 * @author mashengli
 */
public class DataTable1_2 implements Comparable<DataTable1_2> {
    private String natuDate;
    private Double B01;
    private Double B02;
    private Double B03;
    private Double B04;
    private Double B05;
    private Double B06;
    private Double B07;
    private Double B08;
    private Double B09;

    public String getNatuDate() {
        return natuDate;
    }

    public void setNatuDate(String natuDate) {
        this.natuDate = natuDate;
    }

    public Double getB01() {
        return B01;
    }

    public void setB01(Double b01) {
        B01 = b01;
    }

    public Double getB02() {
        return B02;
    }

    public void setB02(Double b02) {
        B02 = b02;
    }

    public Double getB03() {
        return B03;
    }

    public void setB03(Double b03) {
        B03 = b03;
    }

    public Double getB04() {
        return B04;
    }

    public void setB04(Double b04) {
        B04 = b04;
    }

    public Double getB05() {
        return B05;
    }

    public void setB05(Double b05) {
        B05 = b05;
    }

    public Double getB06() {
        return B06;
    }

    public void setB06(Double b06) {
        B06 = b06;
    }

    public Double getB07() {
        return B07;
    }

    public void setB07(Double b07) {
        B07 = b07;
    }

    public Double getB08() {
        return B08;
    }

    public void setB08(Double b08) {
        B08 = b08;
    }

    public Double getB09() {
        return B09;
    }

    public void setB09(Double b09) {
        B09 = b09;
    }

    /**
     * 按照日期从小到大顺序比较两个数据组
     */
    @Override
    public int compareTo(DataTable1_2 o) {
        if (o == null || o.getNatuDate() == null) {
            return 1;
        } else if (this.getNatuDate() == null) {
            return -1;
        } else {
            return this.natuDate.compareTo(o.getNatuDate());
        }
    }
}
