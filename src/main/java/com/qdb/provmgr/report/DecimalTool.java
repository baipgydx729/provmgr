package com.qdb.provmgr.report;

import java.math.BigDecimal;

/**
 * @author mashengli
 */
public class DecimalTool {
    public static BigDecimal add(BigDecimal v1, BigDecimal v2) {
        return (null != v1 ? v1 : new BigDecimal("0")).add(null != v2 ? v2 : new BigDecimal("0"));
    }
}
