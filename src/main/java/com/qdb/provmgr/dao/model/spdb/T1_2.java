package com.qdb.provmgr.dao.model.spdb;

import com.qdb.provmgr.report.spdb.SpdbConstant;

/**
 * Created by fanjunjian on 2016/11/16.
 */
public class T1_2 extends CommonInfo {

    private String BB01;

    private String BB02;

    private String BB03;

    private String BB04;

    private String BB05;

    private String BB06;

    private String BB07;

    private String BB08;

    private String BB09;


    public String getBB01() {
        return BB01;
    }


    public void setBB01(String bB01) {
        BB01 = bB01;
    }


    public String getBB02() {
        return BB02;
    }


    public void setBB02(String bB02) {
        BB02 = bB02;
    }


    public String getBB03() {
        return BB03;
    }


    public void setBB03(String bB03) {
        BB03 = bB03;
    }


    public String getBB04() {
        return BB04;
    }


    public void setBB04(String bB04) {
        BB04 = bB04;
    }


    public String getBB05() {
        return BB05;
    }


    public void setBB05(String bB05) {
        BB05 = bB05;
    }


    public String getBB06() {
        return BB06;
    }


    public void setBB06(String bB06) {
        BB06 = bB06;
    }


    public String getBB07() {
        return BB07;
    }


    public void setBB07(String bB07) {
        BB07 = bB07;
    }


    public String getBB08() {
        return BB08;
    }


    public void setBB08(String bB08) {
        BB08 = bB08;
    }


    public String getBB09() {
        return BB09;
    }


    public void setBB09(String bB09) {
        BB09 = bB09;
    }


    @Override
    public String toString() {
        return getBankCode() + SpdbConstant.FIELD_SEPARATOR +
                getOrganizationId() + SpdbConstant.FIELD_SEPARATOR +
                getTradeDate() + SpdbConstant.FIELD_SEPARATOR +
                getNatuDate() + SpdbConstant.FIELD_SEPARATOR +
                getCurrencyCode() + SpdbConstant.FIELD_SEPARATOR +
                getBusinessType() + SpdbConstant.FIELD_SEPARATOR +
                getName() + SpdbConstant.FIELD_SEPARATOR +
                getAD() + SpdbConstant.FIELD_SEPARATOR +
                BB01 + SpdbConstant.FIELD_SEPARATOR +
                BB02 + SpdbConstant.FIELD_SEPARATOR +
                BB03 + SpdbConstant.FIELD_SEPARATOR +
                BB04 + SpdbConstant.FIELD_SEPARATOR +
                BB05 + SpdbConstant.FIELD_SEPARATOR +
                BB06 + SpdbConstant.FIELD_SEPARATOR +
                BB07 + SpdbConstant.FIELD_SEPARATOR +
                BB08 + SpdbConstant.FIELD_SEPARATOR +
                BB09 + SpdbConstant.FIELD_SEPARATOR +
                getRemark() + SpdbConstant.FIELD_SEPARATOR;
    }
}
