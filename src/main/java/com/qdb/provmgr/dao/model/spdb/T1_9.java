package com.qdb.provmgr.dao.model.spdb;

import com.qdb.provmgr.constant.spdb.Constant;

/**
 * Created by fanjunjian on 2016/11/17.
 */
public class T1_9 extends CommonInfo{

    private String J01;

    private String J02;

    private String J03;

    private String J04;

    public String getJ01() {
        return J01;
    }

    public void setJ01(String j01) {
        J01 = j01;
    }

    public String getJ02() {
        return J02;
    }

    public void setJ02(String j02) {
        J02 = j02;
    }

    public String getJ03() {
        return J03;
    }

    public void setJ03(String j03) {
        J03 = j03;
    }

    public String getJ04() {
        return J04;
    }

    public void setJ04(String j04) {
        J04 = j04;
    }

    @Override
    public String toString() {
        return  getBankCode() + Constant.FIELD_SEPARATOR +
                getOrganizationId() + Constant.FIELD_SEPARATOR +
                getTradeDate() + Constant.FIELD_SEPARATOR +
                getNatuDate() + Constant.FIELD_SEPARATOR +
                getCurrencyCode() + Constant.FIELD_SEPARATOR +
                getBusinessType() + Constant.FIELD_SEPARATOR +
                getName() + Constant.FIELD_SEPARATOR +
                getAD() + Constant.FIELD_SEPARATOR +
                J01 + Constant.FIELD_SEPARATOR +
                J02 + Constant.FIELD_SEPARATOR +
                J03 + Constant.FIELD_SEPARATOR +
                J04 + Constant.FIELD_SEPARATOR +
                getRemark() + Constant.FIELD_SEPARATOR;
    }
}
