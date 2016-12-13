package com.qdb.provmgr.dao.model.spdb;

import com.qdb.provmgr.report.spdb.SpdbConstant;

/**
 * Created by fanjunjian on 2016/11/17.
 */
public class TDate extends CommonInfo{

	public String getDealDate() {
		return dealDate;
	}

	public void setDealDate(String dealDate) {
		this.dealDate = dealDate;
	}

	private String dealDate;

    @Override
    public String toString() {
        return getBankCode() + SpdbConstant.FIELD_SEPARATOR +
                getOrganizationId() + SpdbConstant.FIELD_SEPARATOR +
                getTradeDate() + SpdbConstant.FIELD_SEPARATOR +
                getCurrencyCode() + SpdbConstant.FIELD_SEPARATOR +
                getBusinessType() + SpdbConstant.FIELD_SEPARATOR +
                dealDate + SpdbConstant.FIELD_SEPARATOR +
                getRemark() + SpdbConstant.FIELD_SEPARATOR;
    }
}
