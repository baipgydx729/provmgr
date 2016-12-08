package com.qdb.provmgr.report.citic;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Component;

import com.qdb.provmgr.dao.TableModeEnum;
import com.qdb.provmgr.report.ReportHelper;

/**
 * @author mashengli
 */
@Component
public class CiticReportHelper {

    static final String CITIC_REPORT_ROOT_PATH = "/备付金报表/中信银行/";

    public static final String CITIC_BANK_NAME = "中信银行";

    public static final String FILE_SUFFIX = ".xls";

    //    private String ROOT_PATH = "/Users/mashengli/Desktop/workspace/provmgr/src/main/webapp/WEB-INF/";
    private String ROOT_PATH = Thread.currentThread().getContextClassLoader().getResource("/").getPath() + "../";
    
    /**
     * 获取上报中信银行的合作行报表文件夹
     * @param timeStr 时间串格式为yyyyMM
     * @param AD 账户
     * @return
     */
    public String getCiticFtpDir(String timeStr, String AD) {
        if (AD != null && AD.length() >= 6) {
            return CITIC_REPORT_ROOT_PATH + timeStr + "/" + CITIC_BANK_NAME + AD.substring(AD.length() - 6) + "/";
        }
        return "";
    }

    /**
     * 获取上报中信银行的存管行特殊表文件夹
     * @param timeStr 时间串格式为yyyyMM
     * @return
     */
    public String getCiticFtpDir(String timeStr) {
        return CITIC_REPORT_ROOT_PATH + timeStr + "/";
    }

    public String getCiticZipFileName(Date startDate, Date endDate, String companyName) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMdd");
        return simpleDateFormat.format(startDate) + "_" + simpleDateFormat.format(endDate) + companyName + ".zip";
    }

    /**
     * 获取上报中信银行的合作行表名
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param tableMode 表
     * @param companyName 支付机构名称
     * @param AD 银行账户
     * @return
     */
    public String getCiticFileName(Date startDate, Date endDate, TableModeEnum tableMode, String companyName, String AD) {
        if (AD != null && AD.length() >= 6) {
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMdd");
            return simpleDateFormat.format(startDate) + "_" + simpleDateFormat.format(endDate) + tableMode.getTableName() + companyName + "_" + CITIC_BANK_NAME + AD.substring(AD.length() - 6) + FILE_SUFFIX;
        }
        return "";
    }

    /**
     * 上报中信银行的合作行表集合
     * @return
     */
    public List<TableModeEnum> getCiticReportTables() {
        List<TableModeEnum> result = new ArrayList<>();
        result.add(TableModeEnum.Table1_1);
        result.add(TableModeEnum.Table1_2_1);
        result.add(TableModeEnum.Table1_3);
        result.add(TableModeEnum.Table1_6);
        result.add(TableModeEnum.Table1_9);
        result.add(TableModeEnum.Table1_10);
        result.add(TableModeEnum.Table1_13);
        return result;
    }

    public String getCiticTemplateFile(TableModeEnum tableModeEnum) {
        if (TableModeEnum.Table1_1.equals(tableModeEnum)) {
            return ROOT_PATH + ReportHelper.getExcelTemplateDir() + "/pbc/template_1_1.xls";
        }
        if (TableModeEnum.Table1_2_1.equals(tableModeEnum)) {
            return ROOT_PATH + ReportHelper.getExcelTemplateDir() + "/pbc/template_1_2_1.xls";
        }
        if (TableModeEnum.Table1_3.equals(tableModeEnum)) {
            return ROOT_PATH + ReportHelper.getExcelTemplateDir() + "/pbc/template_1_3.xls";
        }
        if (TableModeEnum.Table1_6.equals(tableModeEnum)) {
            return ROOT_PATH + ReportHelper.getExcelTemplateDir() + "/pbc/template_1_6.xls";
        }
        if (TableModeEnum.Table1_9.equals(tableModeEnum)) {
            return ROOT_PATH + ReportHelper.getExcelTemplateDir() + "/pbc/template_1_9.xls";
        }
        if (TableModeEnum.Table1_10.equals(tableModeEnum)) {
            return ROOT_PATH + ReportHelper.getExcelTemplateDir() + "/pbc/template_1_10.xls";
        }
        if (TableModeEnum.Table1_13.equals(tableModeEnum)) {
            return ROOT_PATH + ReportHelper.getExcelTemplateDir() + "/pbc/template_1_13.xls";
        }
        return "";
    }
}
