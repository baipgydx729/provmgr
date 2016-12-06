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
import com.qdb.provmgr.dao.entity.report.BaseReportEntity;
import com.qdb.provmgr.dao.param.ReportParam;
import com.qdb.provmgr.util.MapUtil;

/**
 * @author mashengli
 */
@Repository
public class ReportDao {

    private Logger log = LoggerFactory.getLogger(ReportDao.class);

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
                .append(ReportSQLConstant.SQL_WHERE);
        if (!TableModeEnum.Table1_2.equals(tableMode)) {
            SQL.append(ReportSQLConstant.ADINFO_PLACEHOLDER);
        }
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
                .append(ReportSQLConstant.SQL_WHERE);
        if (!TableModeEnum.Table1_2.equals(tableMode)) {
            SQL.append(ReportSQLConstant.ADINFO_PLACEHOLDER);
        }
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

    public <T> List<T> queryForTableList(TableModeEnum tableMode, ReportParam params) {
        if (tableMode == null || params == null || StringUtils.isBlank(params.getStartNatuDate()) || StringUtils.isBlank(params.getEndNatuDate())) {
            log.warn("参数不全查询请求被拒绝");
            return null;
        }
        List<T> result = new ArrayList<>();
        List<Object> sqlParams = new ArrayList<>();
        StringBuilder SQL = new StringBuilder();
        SQL.append(ReportSQLConstant.SQL_SELECT).append(tableMode.getSqlColumns())
                .append(ReportSQLConstant.SQL_FROM).append(tableMode.getSqlTableName())
                .append(ReportSQLConstant.SQL_WHERE);
        if (!TableModeEnum.Table1_2.equals(tableMode)) {
            SQL.append(ReportSQLConstant.ADINFO_PLACEHOLDER);
        }
        sqlParams.add(params.getStartNatuDate());
        sqlParams.add(params.getEndNatuDate());
        if (null != params.getADID()) {
            SQL.append(" AND t1.ADID = ? ");
            sqlParams.add(params.getADID());
        }
        if (CollectionUtils.isNotEmpty(params.getADIDs())) {
            int size = params.getADIDs().size();
            SQL.append(" AND t1.ADID IN (");
            for (int i = 0; i < size; i++) {
                if (i < size - 1) {
                    SQL.append("?,");
                } else {
                    SQL.append("?)");
                }
                sqlParams.add(params.getADIDs().get(i));
            }
        }
        if (!StringUtils.isBlank(params.getBankName())) {
            SQL.append(" AND t1.bankName_S = ? ");
            sqlParams.add(params.getBankName());
        }

        try {
            result = MapUtil.mapsToObjects(dbUtil.queryForList(SQL.toString(), sqlParams.toArray()), tableMode.getEntityClass());
        } catch (InstantiationException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
        return result;
    }

    public List<BaseReportEntity> queryForBankList(ReportParam params) {
        if (params == null || StringUtils.isBlank(params.getStartNatuDate()) || StringUtils.isBlank(params.getEndNatuDate())) {
            return Collections.EMPTY_LIST;
        }
        List<BaseReportEntity> result = new ArrayList<>();
        List<Object> sqlParams = new ArrayList<>();
        StringBuilder SQL = new StringBuilder();
        SQL.append(" SELECT DISTINCT t1.bankName_S bankName,t1.ADID,t1.AD, t1.name ")
                .append(ReportSQLConstant.SQL_FROM)
                .append(ReportSQLConstant.TABLE1_3_NAME)
                .append(ReportSQLConstant.SQL_WHERE);
        sqlParams.add(params.getStartNatuDate());
        sqlParams.add(params.getEndNatuDate());
        if (null != params.getADID()) {
            SQL.append(" AND t1.ADID = ? ");
            sqlParams.add(params.getADID());
        }
        if (CollectionUtils.isNotEmpty(params.getADIDs())) {
            int size = params.getADIDs().size();
            SQL.append(" AND t1.ADID IN (");
            for (int i = 0; i < size; i++) {
                if (i < size - 1) {
                    SQL.append("?,");
                } else {
                    SQL.append("?)");
                }
                sqlParams.add(params.getADIDs().get(i));
            }
        }
        if (!StringUtils.isBlank(params.getBankName())) {
            SQL.append(" AND t1.bankName_S = ? ");
            sqlParams.add(params.getBankName());
        }
        try {
            result = MapUtil.mapsToObjects(dbUtil.queryForList(SQL.toString(), sqlParams.toArray()), BaseReportEntity.class);
        } catch (InstantiationException | IllegalAccessException e) {
            e.printStackTrace();
        }
        return result;
    }


}
