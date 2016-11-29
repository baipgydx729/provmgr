package com.qdb.provmgr.dao;

import com.qdb.provmgr.dao.entity.report.DataTable1_1;
import com.qdb.provmgr.dao.entity.report.DataTable1_10;
import com.qdb.provmgr.dao.entity.report.DataTable1_11;
import com.qdb.provmgr.dao.entity.report.DataTable1_12;
import com.qdb.provmgr.dao.entity.report.DataTable1_13;
import com.qdb.provmgr.dao.entity.report.DataTable1_2;
import com.qdb.provmgr.dao.entity.report.DataTable1_3;
import com.qdb.provmgr.dao.entity.report.DataTable1_4;
import com.qdb.provmgr.dao.entity.report.DataTable1_5;
import com.qdb.provmgr.dao.entity.report.DataTable1_6;
import com.qdb.provmgr.dao.entity.report.DataTable1_9;

/**
 * @author mashengli
 */
public enum TableModeEnum {
    Table1_1(ReportSQLConstant.TABLE1_1_NAME,
            ReportSQLConstant.TABLE1_1_COLUMNS,
            DataTable1_1.class),
    Table1_2(ReportSQLConstant.TABLE1_2_NAME,
            ReportSQLConstant.TABLE1_2_COLUMNS,
            DataTable1_2.class),
    Table1_3(ReportSQLConstant.TABLE1_3_NAME,
            ReportSQLConstant.TABLE1_3_COLUMNS,
            DataTable1_3.class),
    Table1_4(ReportSQLConstant.TABLE1_4_NAME,
            ReportSQLConstant.TABLE1_4_COLUMNS,
            DataTable1_4.class),
    Table1_5(ReportSQLConstant.TABLE1_5_NAME,
            ReportSQLConstant.TABLE1_5_COLUMNS,
            DataTable1_5.class),
    Table1_6(ReportSQLConstant.TABLE1_6_NAME,
            ReportSQLConstant.TABLE1_6_COLUMNS,
            DataTable1_6.class),
    Table1_9(ReportSQLConstant.TABLE1_9_NAME,
            ReportSQLConstant.TABLE1_9_COLUMNS,
            DataTable1_9.class),
    Table1_10(ReportSQLConstant.TABLE1_10_NAME,
            ReportSQLConstant.TABLE1_10_COMUMNS,
            DataTable1_10.class),
    Table1_11(ReportSQLConstant.TABLE1_11_NAME,
            ReportSQLConstant.TABLE1_11_COLUMNS,
            DataTable1_11.class),
    Table1_12(ReportSQLConstant.TABLE1_12_NAME,
            ReportSQLConstant.TABLE1_12_COLUMNS,
            DataTable1_12.class),
    Table1_13(ReportSQLConstant.TABLE1_13_NAME,
            ReportSQLConstant.TABLE1_13_COLUMNS,
            DataTable1_13.class);


    private String sqlTableName;
    private String sqlColumns;
    private Class entityClass;

    TableModeEnum(String sqlTableName, String sqlColumns, Class entityClass) {
        this.sqlTableName = sqlTableName;
        this.sqlColumns = sqlColumns;
        this.entityClass = entityClass;
    }

    public String getSqlTableName() {
        return sqlTableName;
    }

    public void setSqlTableName(String sqlTableName) {
        this.sqlTableName = sqlTableName;
    }

    public String getSqlColumns() {
        return sqlColumns;
    }

    public void setSqlColumns(String sqlColumns) {
        this.sqlColumns = sqlColumns;
    }

    public Class getEntityClass() {
        return entityClass;
    }

    public void setEntityClass(Class entityClass) {
        this.entityClass = entityClass;
    }
}