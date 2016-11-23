package com.qdb.dao;

/**
 * @author mashengli
 */
public enum TableModeEnum {
    Table1_1("1_1"),
    Table1_2("1_2"),
    Table1_3("1_3"),
    Table1_4("1_4"),
    Table1_5("1_5"),
    Table1_6("1_6"),
    Table1_9("1_9"),
    Table1_10("1_10"),
    Table1_11("1_11"),
    Table1_12("1_12"),
    Table1_13("1_13");

    private String tableMode;

    TableModeEnum(String tableMode) {
        this.tableMode = tableMode;
    }

    public String getTableMode() {
        return tableMode;
    }

    public void setTableMode(String tableMode) {
        this.tableMode = tableMode;
    }
}