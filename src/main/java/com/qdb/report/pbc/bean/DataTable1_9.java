package com.qdb.report.pbc.bean;

/**
 * @author mashengli
 */
public class DataTable1_9 implements Comparable<DataTable1_9> {
    private String natuDate;
    private Double J01;
    private Double J02;
    private Double J03;
    private Double J04;

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

    public Double getJ01() {
        return J01;
    }

    public void setJ01(Double j01) {
        J01 = j01;
    }

    public Double getJ02() {
        return J02;
    }

    public void setJ02(Double j02) {
        J02 = j02;
    }

    public Double getJ03() {
        return J03;
    }

    public void setJ03(Double j03) {
        J03 = j03;
    }

    public Double getJ04() {
        return J04;
    }

    public void setJ04(Double j04) {
        J04 = j04;
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
    public int compareTo(DataTable1_9 o) {
        if (o == null || o.getNatuDate() == null) {
            return 1;
        } else if (this.getNatuDate() == null) {
            return -1;
        } else {
            return this.natuDate.compareTo(o.getNatuDate());
        }
    }
}
