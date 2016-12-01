package com.qdb.provmgr.test;

import java.util.List;

import com.qdb.provmgr.dao.entity.report.BaseReportEntity;

/**
 * @author mashengli
 */
public abstract class BaseTest {

    public abstract List<BaseReportEntity> splitByDate(List<BaseReportEntity> dataList);
}
