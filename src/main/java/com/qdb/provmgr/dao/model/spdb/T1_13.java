package com.qdb.provmgr.dao.model.spdb;

import com.qdb.provmgr.report.spdb.SpdbConstant;

/**
 * Created by fanjunjian on 2016/11/17.
 */
public class T1_13 extends CommonInfo{

    private String N1;

    private String N2;

    private String N3;

    private String N4;

    private String N5;

    private String N6;

    public String getN1() {
        return N1;
    }

    public void setN1(String n1) {
        N1 = n1;
    }

    public String getN2() {
        return N2;
    }

    public void setN2(String n2) {
        N2 = n2;
    }

    public String getN3() {
        return N3;
    }

    public void setN3(String n3) {
        N3 = n3;
    }

    public String getN4() {
        return N4;
    }

    public void setN4(String n4) {
        N4 = n4;
    }

    public String getN5() {
        return N5;
    }

    public void setN5(String n5) {
        N5 = n5;
    }

    public String getN6() {
        return N6;
    }

    public void setN6(String n6) {
        N6 = n6;
    }

    @Override
    public String toString() {
        return getBankCode() + SpdbConstant.FIELD_SEPARATOR +
                getOrganizationId() + SpdbConstant.FIELD_SEPARATOR +
                getTradeDate() + SpdbConstant.FIELD_SEPARATOR +
                getNatuDate() + SpdbConstant.FIELD_SEPARATOR +
                getCurrencyCode() + SpdbConstant.FIELD_SEPARATOR +
                getBusinessType() + SpdbConstant.FIELD_SEPARATOR +
                N1 + SpdbConstant.FIELD_SEPARATOR +
                N2 + SpdbConstant.FIELD_SEPARATOR +
                N3 + SpdbConstant.FIELD_SEPARATOR +
                N4 + SpdbConstant.FIELD_SEPARATOR +
                N5 + SpdbConstant.FIELD_SEPARATOR +
                N6 + SpdbConstant.FIELD_SEPARATOR +
                getRemark() + SpdbConstant.FIELD_SEPARATOR;
                
    }
}
