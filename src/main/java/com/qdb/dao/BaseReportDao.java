package com.qdb.dao;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.alibaba.dubbo.common.utils.CollectionUtils;
import com.alibaba.dubbo.common.utils.StringUtils;
import com.qdb.util.MapUtil;

/**
 * @author mashengli
 */
@Repository
public class BaseReportDao {

    private Logger log = LoggerFactory.getLogger(BaseReportDao.class);

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

//    public Class getClassByTableMode(TableModeEnum tableMode) {
//        if (TableModeEnum.Table1_1.equals(tableMode)) {
//            return DataTable1_1.class;
//        }
//        if (TableModeEnum.Table1_2.equals(tableMode)) {
//            return DataTable1_2.class;
//        }
//        if (TableModeEnum.Table1_3.equals(tableMode)) {
//            return DataTable1_3.class;
//        }
//        if (TableModeEnum.Table1_4.equals(tableMode)) {
//            return DataTable1_4.class;
//        }
//        if (TableModeEnum.Table1_5.equals(tableMode)) {
//            return DataTable1_5.class;
//        }
//        if (TableModeEnum.Table1_6.equals(tableMode)) {
//            return DataTable1_6.class;
//        }
//        if (TableModeEnum.Table1_9.equals(tableMode)) {
//            return DataTable1_9.class;
//        }
//        if (TableModeEnum.Table1_10.equals(tableMode)) {
//            return DataTable1_10.class;
//        }
//        if (TableModeEnum.Table1_11.equals(tableMode)) {
//            return DataTable1_11.class;
//        }
//        if (TableModeEnum.Table1_12.equals(tableMode)) {
//            return DataTable1_12.class;
//        }
//        if (TableModeEnum.Table1_13.equals(tableMode)) {
//            return DataTable1_13.class;
//        }
//        return null;
//    }
//
//    public String getColumnsByTableMode(TableModeEnum tableMode) {
//        if (TableModeEnum.Table1_1.equals(tableMode)) {
//            return ReportSQLConstant.TABLE1_1_COLUMNS;
//        }
//        if (TableModeEnum.Table1_2.equals(tableMode)) {
//            return ReportSQLConstant.TABLE1_2_COLUMNS;
//        }
//        if (TableModeEnum.Table1_3.equals(tableMode)) {
//            return ReportSQLConstant.TABLE1_3_COLUMNS;
//        }
//        if (TableModeEnum.Table1_4.equals(tableMode)) {
//            return ReportSQLConstant.TABLE1_4_COLUMNS;
//        }
//        if (TableModeEnum.Table1_5.equals(tableMode)) {
//            return ReportSQLConstant.TABLE1_5_COLUMNS;
//        }
//        if (TableModeEnum.Table1_6.equals(tableMode)) {
//            return ReportSQLConstant.TABLE1_6_COLUMNS;
//        }
//        if (TableModeEnum.Table1_9.equals(tableMode)) {
//            return ReportSQLConstant.TABLE1_9_COLUMNS;
//        }
//        if (TableModeEnum.Table1_10.equals(tableMode)) {
//            return ReportSQLConstant.TABLE1_10_COMUMNS;
//        }
//        if (TableModeEnum.Table1_11.equals(tableMode)) {
//            return ReportSQLConstant.TABLE1_11_COLUMNS;
//        }
//        if (TableModeEnum.Table1_12.equals(tableMode)) {
//            return ReportSQLConstant.TABLE1_12_COLUMNS;
//        }
//        if (TableModeEnum.Table1_13.equals(tableMode)) {
//            return ReportSQLConstant.TABLE1_13_COLUMNS;
//        }
//        return "";
//    }
//
//    public String getTableNameByTableMode(TableModeEnum tableMode) {
//        if (TableModeEnum.Table1_1.equals(tableMode)) {
//            return ReportSQLConstant.TABLE1_1_NAME;
//        }
//        if (TableModeEnum.Table1_2.equals(tableMode)) {
//            return ReportSQLConstant.TABLE1_2_NAME;
//        }
//        if (TableModeEnum.Table1_3.equals(tableMode)) {
//            return ReportSQLConstant.TABLE1_3_NAME;
//        }
//        if (TableModeEnum.Table1_4.equals(tableMode)) {
//            return ReportSQLConstant.TABLE1_4_NAME;
//        }
//        if (TableModeEnum.Table1_5.equals(tableMode)) {
//            return ReportSQLConstant.TABLE1_5_NAME;
//        }
//        if (TableModeEnum.Table1_6.equals(tableMode)) {
//            return ReportSQLConstant.TABLE1_6_NAME;
//        }
//        if (TableModeEnum.Table1_9.equals(tableMode)) {
//            return ReportSQLConstant.TABLE1_9_NAME;
//        }
//        if (TableModeEnum.Table1_10.equals(tableMode)) {
//            return ReportSQLConstant.TABLE1_10_NAME;
//        }
//        if (TableModeEnum.Table1_11.equals(tableMode)) {
//            return ReportSQLConstant.TABLE1_11_NAME;
//        }
//        if (TableModeEnum.Table1_12.equals(tableMode)) {
//            return ReportSQLConstant.TABLE1_12_NAME;
//        }
//        if (TableModeEnum.Table1_13.equals(tableMode)) {
//            return ReportSQLConstant.TABLE1_13_NAME;
//        }
//        return "";
//    }

}
