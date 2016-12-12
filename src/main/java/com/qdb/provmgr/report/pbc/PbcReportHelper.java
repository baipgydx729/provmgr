package com.qdb.provmgr.report.pbc;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.qdb.provmgr.dao.TableModeEnum;
import com.qdb.provmgr.report.ReportHelper;

/**
 * @author mashengli
 */
@Component
public class PbcReportHelper {

    @Autowired
    private ReportHelper reportHelper;
    
    private static final String PBC_REPORT_ROOT_PATH = "/备付金报表/中国人民银行/";

    public static final String FILE_SUFFIX = ".xls";

//    private String ROOT_PATH = "/Users/mashengli/Desktop/workspace/provmgr/src/main/webapp/WEB-INF/";
//    private String ROOT_PATH = Thread.currentThread().getContextClassLoader().getResource("/").getPath() + "../";

    /**
     * 获取上报人行的合作行报表文件夹
     * @param timeStr 时间串格式为yyyyMM
     * @param bankName 银行名称
     * @param AD 账户
     * @return
     */
    public String getPbcFtpDirCorp(String timeStr, String bankName, String AD) {
        if (AD != null && AD.length() >= 6) {
            return PBC_REPORT_ROOT_PATH + timeStr + "/" + bankName + AD.substring(AD.length() - 6) + "/";
        }
        return "";
    }

    /**
     * 获取上报人行的存管行特殊表文件夹
     * @param timeStr 时间串格式为yyyyMM
     * @return
     */
    public String getPbcFtpDirDP(String timeStr) {
        return PBC_REPORT_ROOT_PATH + timeStr + "/兴业银行/存管行特殊表/";
    }

    /**
     * 获取人行报表的文件夹
     * @param timeStr 时间串格式为yyyyMM
     * @return
     */
    public String getPbcFtpDir(String timeStr) {
        return PBC_REPORT_ROOT_PATH + timeStr + "/";
    }

    public String getPbcZipFileName(Date startDate, Date endDate, String companyName) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMdd");
        return simpleDateFormat.format(startDate) + "_" + simpleDateFormat.format(endDate) + companyName + ".zip";
    }

    /**
     * 获取上报人行的存管行特殊表表名
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param tableMode 表
     * @param companyName 支付机构名称
     * @return
     */
    public String getPbcFileNameDP(Date startDate, Date endDate, TableModeEnum tableMode, String companyName) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMdd");
        return simpleDateFormat.format(startDate) + "_" + simpleDateFormat.format(endDate) + tableMode.getTableName() + companyName + FILE_SUFFIX;
    }

    /**
     * 获取上报人行的合作行表名
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param tableMode 表
     * @param companyName 支付机构名称
     * @param bankName 银行名称
     * @param AD 银行账户
     * @return
     */
    public String getPbcFileNameCorp(Date startDate, Date endDate, TableModeEnum tableMode, String companyName, String bankName, String AD) {
        if (AD != null && AD.length() >= 6) {
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMdd");
            return simpleDateFormat.format(startDate) + "_" + simpleDateFormat.format(endDate) + tableMode.getTableName() + companyName + "_" + bankName + AD.substring(AD.length() - 6) + FILE_SUFFIX;
        }
        return "";
    }

    /**
     * 上报人行的合作行表集合
     * @return
     */
    public List<TableModeEnum> getPbcReportTablesCorp() {
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

    /**
     * 上报人行的存管行特殊表集合
     * @return
     */
    public List<TableModeEnum> getPbcReportTablesDP() {
        List<TableModeEnum> result = new ArrayList<>();
        result.add(TableModeEnum.Table1_1_2);
        result.add(TableModeEnum.Table1_2);
        result.add(TableModeEnum.Table1_3);
        result.add(TableModeEnum.Table1_4);
        result.add(TableModeEnum.Table1_5);
        result.add(TableModeEnum.Table1_6_2);
        result.add(TableModeEnum.Table1_9_2);
        result.add(TableModeEnum.Table1_10_2);
        result.add(TableModeEnum.Table1_11);
        result.add(TableModeEnum.Table1_12);
        result.add(TableModeEnum.Table1_13);
        return result;
    }

    /**
     * 获取模板文件相对WEB-INF下的路径
     * @param tableModeEnum
     * @return
     */
    public String getRelativePbcTemplateFile(TableModeEnum tableModeEnum) {
        if (TableModeEnum.Table1_1.equals(tableModeEnum)) {
            return reportHelper.getExcelTemplateDir() + "/pbc/template_1_1.xls";
        }
        if (TableModeEnum.Table1_1_2.equals(tableModeEnum)) {
            return reportHelper.getExcelTemplateDir() + "/pbc/template_1_1_2.xls";
        }
        if (TableModeEnum.Table1_2.equals(tableModeEnum)) {
            return reportHelper.getExcelTemplateDir() + "/pbc/template_1_2.xls";
        }
        if (TableModeEnum.Table1_2_1.equals(tableModeEnum)) {
            return reportHelper.getExcelTemplateDir() + "/pbc/template_1_2_1.xls";
        }
        if (TableModeEnum.Table1_3.equals(tableModeEnum)) {
            return reportHelper.getExcelTemplateDir() + "/pbc/template_1_3.xls";
        }
        if (TableModeEnum.Table1_4.equals(tableModeEnum)) {
            return reportHelper.getExcelTemplateDir() + "/pbc/template_1_4.xls";
        }
        if (TableModeEnum.Table1_5.equals(tableModeEnum)) {
            return reportHelper.getExcelTemplateDir() + "/pbc/template_1_5.xls";
        }
        if (TableModeEnum.Table1_6.equals(tableModeEnum)) {
            return reportHelper.getExcelTemplateDir() + "/pbc/template_1_6.xls";
        }
        if (TableModeEnum.Table1_6_2.equals(tableModeEnum)) {
            return reportHelper.getExcelTemplateDir() + "/pbc/template_1_6_2.xls";
        }
        if (TableModeEnum.Table1_9.equals(tableModeEnum)) {
            return reportHelper.getExcelTemplateDir() + "/pbc/template_1_9.xls";
        }
        if (TableModeEnum.Table1_9_2.equals(tableModeEnum)) {
            return reportHelper.getExcelTemplateDir() + "/pbc/template_1_9_2.xls";
        }
        if (TableModeEnum.Table1_10.equals(tableModeEnum)) {
            return reportHelper.getExcelTemplateDir() + "/pbc/template_1_10.xls";
        }
        if (TableModeEnum.Table1_10_2.equals(tableModeEnum)) {
            return reportHelper.getExcelTemplateDir() + "/pbc/template_1_10_2.xls";
        }
        if (TableModeEnum.Table1_11.equals(tableModeEnum)) {
            return reportHelper.getExcelTemplateDir() + "/pbc/template_1_11.xls";
        }
        if (TableModeEnum.Table1_12.equals(tableModeEnum)) {
            return reportHelper.getExcelTemplateDir() + "/pbc/template_1_12.xls";
        }
        if (TableModeEnum.Table1_13.equals(tableModeEnum)) {
            return reportHelper.getExcelTemplateDir() + "/pbc/template_1_13.xls";
        }
        return "";
    }

}
