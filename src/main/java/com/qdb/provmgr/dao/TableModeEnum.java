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
            DataTable1_1.class,
            "表1_1"),
    Table1_1_2(ReportSQLConstant.TABLE1_1_NAME,
            ReportSQLConstant.TABLE1_1_COLUMNS,
            DataTable1_1.class,
            "表1_1_2"),
    Table1_2(ReportSQLConstant.TABLE1_2_NAME,
            ReportSQLConstant.TABLE1_2_COLUMNS,
            DataTable1_2.class,
            "表1_2"),
    Table1_2_1(ReportSQLConstant.TABLE1_2_NAME,
            ReportSQLConstant.TABLE1_2_COLUMNS,
            DataTable1_2.class,
            "表1_2_1"),
    Table1_3(ReportSQLConstant.TABLE1_3_NAME,
            ReportSQLConstant.TABLE1_3_COLUMNS,
            DataTable1_3.class,
            "表1_3"),
    Table1_4(ReportSQLConstant.TABLE1_4_NAME,
            ReportSQLConstant.TABLE1_4_COLUMNS,
            DataTable1_4.class,
            "表1_4"),
    Table1_5(ReportSQLConstant.TABLE1_5_NAME,
            ReportSQLConstant.TABLE1_5_COLUMNS,
            DataTable1_5.class,
            "表1_5"),
    Table1_6(ReportSQLConstant.TABLE1_6_NAME,
            ReportSQLConstant.TABLE1_6_COLUMNS,
            DataTable1_6.class,
            "表1_6"),
    Table1_6_2(ReportSQLConstant.TABLE1_6_NAME,
            ReportSQLConstant.TABLE1_6_COLUMNS,
            DataTable1_6.class,
            "表1_6_2"),
    Table1_9(ReportSQLConstant.TABLE1_9_NAME,
            ReportSQLConstant.TABLE1_9_COLUMNS,
            DataTable1_9.class,
            "表1_9"),
    Table1_9_2(ReportSQLConstant.TABLE1_9_NAME,
            ReportSQLConstant.TABLE1_9_COLUMNS,
            DataTable1_9.class,
            "表1_9_2"),
    Table1_10(ReportSQLConstant.TABLE1_10_NAME,
            ReportSQLConstant.TABLE1_10_COMUMNS,
            DataTable1_10.class,
            "表1_10"),
    Table1_10_2(ReportSQLConstant.TABLE1_10_NAME,
            ReportSQLConstant.TABLE1_10_COMUMNS,
            DataTable1_10.class,
            "表1_10_2"),
    Table1_11(ReportSQLConstant.TABLE1_11_NAME,
            ReportSQLConstant.TABLE1_11_COLUMNS,
            DataTable1_11.class,
            "表1_11"),
    Table1_12(ReportSQLConstant.TABLE1_12_NAME,
            ReportSQLConstant.TABLE1_12_COLUMNS,
            DataTable1_12.class,
            "表1_12"),
    Table1_13(ReportSQLConstant.TABLE1_13_NAME,
            ReportSQLConstant.TABLE1_13_COLUMNS,
            DataTable1_13.class,
            "表1_13");

    private String sqlTableName;
    private String sqlColumns;
    private Class entityClass;
    private String tableName;

    TableModeEnum(String sqlTableName, String sqlColumns, Class entityClass, String tableName) {
        this.sqlTableName = sqlTableName;
        this.sqlColumns = sqlColumns;
        this.entityClass = entityClass;
        this.tableName = tableName;
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

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public static TableModeEnum getEnumByEntityClass(Class entityClass) {
        if (entityClass == null) {
            return null;
        }
        for (TableModeEnum tableMode : TableModeEnum.values()) {
            if (tableMode.getEntityClass().equals(entityClass)) {
                return tableMode;
            }
        }
        return null;
    }

    public static TableModeEnum getEnumByTableName(String tableName) {
        for (TableModeEnum tableMode : TableModeEnum.values()) {
            if (tableMode.getTableName().equals(tableName)) {
                return tableMode;
            }
        }
        return null;
    }
}