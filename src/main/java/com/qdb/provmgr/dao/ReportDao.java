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
import com.qdb.provmgr.dao.entity.report.AccountInfoEntity;
import com.qdb.provmgr.dao.entity.report.BaseReportEntity;
import com.qdb.provmgr.dao.param.AccountInfoParam;
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

    public <T> List<T> queryForTableList(TableModeEnum tableMode, ReportParam params) {
        if (tableMode == null || params == null || StringUtils.isBlank(params.getStartNatuDate()) || StringUtils.isBlank(params.getEndNatuDate())) {
            log.warn("参数不全查询请求被拒绝");
            return null;
        }
        List<T> result = new ArrayList<>();
        List<Object> sqlParams = new ArrayList<>();
        StringBuilder SQL = new StringBuilder();
        SQL.append(" SELECT ").append(tableMode.getSqlColumns())
                .append(" FROM ").append(tableMode.getSqlTableName())
                .append(" WHERE t1.natuDate >= ? and t1.natuDate <= ? ");
        sqlParams.add(params.getStartNatuDate());
        sqlParams.add(params.getEndNatuDate());
        if (!TableModeEnum.Table1_2.equals(tableMode)) {
            SQL.append(" and t1.ADID = t2.ADID and t2.isProvision=1 ");
            if (null != params.getIsTotalCount() && !params.getIsTotalCount()) {
                SQL.append(" AND t1.ADID!=99999 ");
            } else {
                SQL.append(" AND t1.ADID=99999 ");
            }
        }
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
        } catch (Exception e) {
            log.error("查询异常", e);
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
        SQL.append(" SELECT DISTINCT t1.ADID,t1.AD,t1.bankName_S bankName,t1.name ")
                .append(" FROM ")
                .append(ReportSQLConstant.TABLE1_3_NAME)
                .append(" WHERE t1.ADID = t2.ADID and t2.isProvision = 1 and t1.ADID != 99999 AND t1.natuDate >= ? and t1.natuDate <= ? ");
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
        } catch (Exception e) {
            log.error("查询异常", e);
        }
        return result;
    }

    public List<AccountInfoEntity> queryForAccountList(AccountInfoParam param) {
        if (param == null) {
            return Collections.EMPTY_LIST;
        }
        List<AccountInfoEntity> result = new ArrayList<>();
        List<Object> sqlParams = new ArrayList<>();
        StringBuilder SQL = new StringBuilder();
        SQL.append(" SELECT ").append(ReportSQLConstant.TABLE_ACCOUNT_INFO_COLUMNS)
                .append(" FROM ")
                .append(ReportSQLConstant.TABLE_ACCOUNT_INFO_NAME);
        StringBuilder sql2 = new StringBuilder();
        if (null != param.getADID()) {
            SQL.append(" WHERE t1.ADID=? ");
            sqlParams.add(param.getADID());
        } else {
            if (null != param.getAD()) {
                sql2.append(" and t1.AD=? ");
                sqlParams.add(param.getAD());
            }
            if (null != param.getAccState()) {
                sql2.append(" and t1.accState=? ");
                sqlParams.add(param.getAccState());
            }
            if (null != param.getAccType()) {
                sql2.append(" and t1.accType=? ");
                sqlParams.add(param.getAccType());
            }
            if (null != param.getBankName()) {
                sql2.append(" and t1.bankName_S=? ");
                sqlParams.add(param.getBankName());
            }
            if (null != param.getIsProvision()) {
                sql2.append(" and t1.isProvision=? ");
                sqlParams.add(param.getIsProvision());
            }
            if (null != param.getIsReport()) {
                sql2.append(" and t1.isReport=? ");
                sqlParams.add(param.getIsReport());
            }
            if (sql2.length() > 0) {
                sql2.substring(4);
            }
            SQL.append(" WHERE ").append(sql2);
        }
        try {
            result = MapUtil.mapsToObjects(dbUtil.queryForList(SQL.toString(), sqlParams.toArray()), AccountInfoEntity.class);
        } catch (Exception e) {
            log.error("查询异常", e);
        }
        return result;
    }

    public AccountInfoEntity queryAccountById(Integer ADID) {
        if (ADID == null) {
            return null;
        }
        StringBuilder SQL = new StringBuilder();
        SQL.append(" SELECT ").append(ReportSQLConstant.TABLE_ACCOUNT_INFO_COLUMNS)
                .append(" FROM ")
                .append(ReportSQLConstant.TABLE_ACCOUNT_INFO_NAME)
                .append(" WHERE t1.ADID=? ");
        try {
            return MapUtil.mapToObject(dbUtil.query(SQL.toString(), new Object[]{ADID}), AccountInfoEntity.class);
        } catch (Exception e) {
            log.error("查询异常", e);
        }
        return null;
    }

}
