package com.qdb.provmgr.report.pbc;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

import org.apache.poi.hssf.usermodel.HSSFSheet;

import com.qdb.provmgr.dao.entity.report.BaseReportEntity;
import com.qdb.provmgr.dao.entity.report.DataTable1_11;
import com.qdb.provmgr.report.PresetContent;
import com.qdb.provmgr.report.ReportHelper;

/**
 * @author mashengli
 */
public class Excel1_11 extends ReportHelper {
    /**
     * 数据起始行数下标（下标从0开始）
     */
    private static int DATA_START_ROW_NUM = 4;

    /**
     * 数据区域结束行数下标（下标从0开始）
     */
    private static int DATA_END_ROW_NUM = 34;

    /**
     * 数据起始列数下标（下标从0开始）
     */
    private static int DATA_START_COLUMN_NUM = 2;

    /**
     * 数据区域结束数下标（下标从0开始）
     */
    private static int DATA_END_COLUMN_NUM = 32;

    public static void writeData(HSSFSheet sheet, PresetContent presetContent, List<BaseReportEntity> dataList) {
        writePresetContent(sheet, presetContent);
        writeData(sheet, dataList);
    }

    /**
     * 按照模板写数据
     *
     * @param sheet    表格
     * @param dataList 数据列表
     */
    private static void writeData(HSSFSheet sheet, List<BaseReportEntity> dataList) {
        Collections.sort(dataList);
        int size = dataList.size();
        for (int i = 0; i < size; i++) {
            DataTable1_11 dataTable1_11 = (DataTable1_11)dataList.get(i);
            for (int j = DATA_START_ROW_NUM; j <= DATA_END_ROW_NUM; j++) {
                BigDecimal value = getDoubleDataByRowIndex(dataTable1_11, j);
                sheet.getRow(j).getCell(i + DATA_START_COLUMN_NUM).setCellValue(null != value ? value.doubleValue() : 0);
            }
        }
    }

    /**
     * 填充交易时期、填报日期、填表人及审核人
     *
     * @param sheet         表格
     * @param presetContent 预设内同
     */
    private static void writePresetContent(HSSFSheet sheet, PresetContent presetContent) {
        //填充交易时期、填报日期、填表人及审核人
        sheet.getRow(0).createCell(1).setCellValue(presetContent.getCompanyName());
        sheet.getRow(1).createCell(1).setCellValue(presetContent.getTranPeriod());
        sheet.getRow(2).createCell(1).setCellValue(presetContent.getReportDate());
        sheet.getRow(DATA_END_ROW_NUM + 1).createCell(1).setCellValue(presetContent.getReportUserName());
        sheet.getRow(DATA_END_ROW_NUM + 2).createCell(1).setCellValue(presetContent.getCheckUserName());
    }

    /**
     * 获取数据
     *
     * @param dataTable1_11 数据
     * @param index        下标
     * @return
     */
    public static BigDecimal getDoubleDataByRowIndex(DataTable1_11 dataTable1_11, int index) {
        switch (index) {
            case 4:
                return dataTable1_11.getL1();
            case 5:
                return dataTable1_11.getL2();
            case 6:
                return dataTable1_11.getL3();
            case 7:
                return new BigDecimal("0");
            case 8:
                return dataTable1_11.getL4();
            case 9:
                return dataTable1_11.getL5();
            case 10:
                return dataTable1_11.getL6();
            case 11:
                return dataTable1_11.getL7();
            case 12:
                return dataTable1_11.getL8();
            case 13:
                return dataTable1_11.getL9();
            case 14:
                return dataTable1_11.getL10();
            case 15:
                return dataTable1_11.getL11();
            case 16:
                return dataTable1_11.getL12();
            case 17:
                return dataTable1_11.getL13();
            case 18:
                return dataTable1_11.getL14();
            case 19:
                return dataTable1_11.getL15();
            case 20:
                return dataTable1_11.getL16();
            case 21:
                return dataTable1_11.getL17();
            case 22:
                return dataTable1_11.getL18();
            case 23:
                return dataTable1_11.getL19();
            case 24:
                return dataTable1_11.getL20();
            case 25:
                return dataTable1_11.getZ1();
            case 26:
                return dataTable1_11.getZ101();
            case 27:
                return dataTable1_11.getZ102();
            case 28:
                return new BigDecimal("0");
            case 29:
                return new BigDecimal("0");
            case 30:
                return dataTable1_11.getL21();
            case 31:
                return new BigDecimal("0");
            case 32:
                return dataTable1_11.getL22();
            case 33:
                return dataTable1_11.getL23();
            case 34:
                return dataTable1_11.getL24();
            default:
                return new BigDecimal("0");
        }
    }
}
