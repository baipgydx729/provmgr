package com.qdb.provmgr.dao.model.spdb;

import com.qdb.provmgr.report.spdb.SpdbConstant;

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
        return  getBankCode() + SpdbConstant.FIELD_SEPARATOR +
                getOrganizationId() + SpdbConstant.FIELD_SEPARATOR +
                getTradeDate() + SpdbConstant.FIELD_SEPARATOR +
                getNatuDate() + SpdbConstant.FIELD_SEPARATOR +
                getCurrencyCode() + SpdbConstant.FIELD_SEPARATOR +
                getBusinessType() + SpdbConstant.FIELD_SEPARATOR +
                getBankName_S() + SpdbConstant.FIELD_SEPARATOR +
                getName() + SpdbConstant.FIELD_SEPARATOR +
                getAD() + SpdbConstant.FIELD_SEPARATOR +
                C01 + SpdbConstant.FIELD_SEPARATOR +
                getRemark() + SpdbConstant.FIELD_SEPARATOR;
    }
}
