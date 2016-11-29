package com.qdb.provmgr.dao;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.alibaba.dubbo.common.utils.CollectionUtils;
import com.alibaba.dubbo.common.utils.StringUtils;
import com.qdb.provmgr.util.MapUtil;

/**
 * @author mashengli
 */
@Repository
public class ProvReportDao {

    private Logger log = LoggerFactory.getLogger(ProvReportDao.class);

    @Autowired
    private DBUtil dbUtil;

    public <T> List<T> queryForList(TableModeEnum tableMode, String startDate, String endDate) {
        if (StringUtils.isBlank(startDate) || StringUtils.isBlank(endDate)) {
            log.info("起始日期不能为空");
            return Collections.EMPTY_LIST;
        }
        Object[] params = new Object[]{startDate, endDate};
        StringBuilder SQL = new StringBuilder();
        SQL.append(ReportSQLConstant.SQL_SELECT).append(tableMode.getSqlColumns())
                .append(ReportSQLConstant.SQL_FROM).append(tableMode.getSqlTableName())
                .append(ReportSQLConstant.SQL_WHERE).append(ReportSQLConstant.NATUDATE_PLACEHOLDER);
        try {
            return MapUtil.mapsToObjects(dbUtil.queryForList(SQL.toString(), params), tableMode.getEntityClass());
        } catch (InstantiationException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
        return null;
    }

    public <T> List<T> queryForList(TableModeEnum tableMode, String startDate, String endDate, List<Integer> ADIDs) {
        if (StringUtils.isBlank(startDate) || StringUtils.isBlank(endDate)) {
            log.info("起始日期不能为空");
            return Collections.EMPTY_LIST;
        }
        List<T> result = new ArrayList<>();
        Object[] params = null;
        StringBuilder SQL = new StringBuilder();
        SQL.append(ReportSQLConstant.SQL_SELECT).append(tableMode.getSqlColumns())
                .append(ReportSQLConstant.SQL_FROM).append(tableMode.getSqlTableName())
                .append(ReportSQLConstant.SQL_WHERE).append(ReportSQLConstant.NATUDATE_PLACEHOLDER);
        if (CollectionUtils.isNotEmpty(ADIDs)) {
            int size = ADIDs.size();
            params = new Object[2 + size];
            SQL.append(" AND t1.ADID IN (");
            for (int i = 0; i < size; i++) {
                if (i < size - 1) {
                    SQL.append("?,");
                } else {
                    SQL.append("?)");
                }
                params[i + 2] = ADIDs.get(i);
            }
        } else {
            params = new Object[2];
        }
        params[0] = startDate;
        params[1] = endDate;
        try {
            result = MapUtil.mapsToObjects(dbUtil.queryForList(SQL.toString(), params), tableMode.getEntityClass());
        } catch (InstantiationException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
        return result;
    }

}
