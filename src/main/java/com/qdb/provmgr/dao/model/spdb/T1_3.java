package com.qdb.provmgr.dao.model.spdb;

import com.qdb.provmgr.constant.spdb.Constant;

/**
 * Created by fanjunjian on 2016/11/17.
 */
public class T1_3 extends CommonInfo{


	private String bankName_S;
	
    private String C01;

    public String getBankName_S() {
        return bankName_S;
    }

    public void setBankName_S(String bankName_S) {
        this.bankName_S = bankName_S;
    }

   
    public void setC01(String c01) {
        C01 = c01;
    }

    @Override
    public String toString() {
        return  getBankCode() +
                getOrganizationId() + Constant.FIELD_SEPARATOR +
                getTradeDate() + Constant.FIELD_SEPARATOR +
                getNatuDate() + Constant.FIELD_SEPARATOR +
                getCurrencyCode() + Constant.FIELD_SEPARATOR +
                getBusinessType() + Constant.FIELD_SEPARATOR +
                getBankName_S() + Constant.FIELD_SEPARATOR +
                getName() + Constant.FIELD_SEPARATOR +
                getAD() + Constant.FIELD_SEPARATOR +
                C01 + Constant.FIELD_SEPARATOR +
                getRemark() + Constant.FIELD_SEPARATOR;
    }
}
