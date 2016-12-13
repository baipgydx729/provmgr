package com.qdb.provmgr.dao.model.spdb;

import com.qdb.provmgr.constant.spdb.Constant;

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
        return getBankCode() + Constant.FIELD_SEPARATOR +
                getOrganizationId() + Constant.FIELD_SEPARATOR +
                getTradeDate() + Constant.FIELD_SEPARATOR +
                getCurrencyCode() + Constant.FIELD_SEPARATOR +
                getBusinessType() + Constant.FIELD_SEPARATOR +
                dealDate + Constant.FIELD_SEPARATOR +
                getRemark() + Constant.FIELD_SEPARATOR;
    }
}
