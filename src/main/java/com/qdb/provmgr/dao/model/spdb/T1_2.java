package com.qdb.provmgr.dao.model.spdb;

import com.qdb.provmgr.constant.spdb.Constant;

/**
 * Created by fanjunjian on 2016/11/16.
 */
public class T1_2 extends CommonInfo{

    private String B01;

    private String B02;

    private String B03;

    private String B04;

    private String B05;

    private String B06;

    private String B07;

    private String B08;

    private String B09;


    public String getB01() {
        return B01;
    }

    public void setB01(String b01) {
        B01 = b01;
    }

    public String getB02() {
        return B02;
    }

    public void setB02(String b02) {
        B02 = b02;
    }

    public String getB03() {
        return B03;
    }

    public void setB03(String b03) {
        B03 = b03;
    }

    public String getB04() {
        return B04;
    }

    public void setB04(String b04) {
        B04 = b04;
    }

    public String getB05() {
        return B05;
    }

    public void setB05(String b05) {
        B05 = b05;
    }

    public String getB06() {
        return B06;
    }

    public void setB06(String b06) {
        B06 = b06;
    }

    public String getB07() {
        return B07;
    }

    public void setB07(String b07) {
        B07 = b07;
    }

    public String getB08() {
        return B08;
    }

    public void setB08(String b08) {
        B08 = b08;
    }

    public String getB09() {
        return B09;
    }

    public void setB09(String b09) {
        B09 = b09;
    }

    @Override
    public String toString() {
        return  getBankCode() +
                getOrganizationId() + Constant.FIELD_SEPARATOR +
                getTradeDate() + Constant.FIELD_SEPARATOR +
                getNatuDate() + Constant.FIELD_SEPARATOR +
                getCurrencyCode() + Constant.FIELD_SEPARATOR +
                getBusinessType() + Constant.FIELD_SEPARATOR +
                getName() + Constant.FIELD_SEPARATOR +
                getAD() + Constant.FIELD_SEPARATOR +
                B01 + Constant.FIELD_SEPARATOR +
                B02 + Constant.FIELD_SEPARATOR +
                B03 + Constant.FIELD_SEPARATOR +
                B04 + Constant.FIELD_SEPARATOR +
                B05 + Constant.FIELD_SEPARATOR +
                B06 + Constant.FIELD_SEPARATOR +
                B07 + Constant.FIELD_SEPARATOR +
                B08 + Constant.FIELD_SEPARATOR +
                B09 + Constant.FIELD_SEPARATOR +
                getRemark() + Constant.FIELD_SEPARATOR;
    }
}
