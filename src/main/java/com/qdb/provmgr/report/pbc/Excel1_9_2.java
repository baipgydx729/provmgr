package com.qdb.provmgr.report.pbc;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

import org.apache.poi.hssf.usermodel.HSSFSheet;

import com.qdb.provmgr.dao.entity.report.BaseReportEntity;
import com.qdb.provmgr.dao.entity.report.DataTable1_9;
import com.qdb.provmgr.report.PresetContent;
import com.qdb.provmgr.report.ReportExcelUtil;

/**
 * @author mashengli
 */
public class Excel1_9_2 extends ReportExcelUtil {
    /**
     * 数据起始行数下标（下标从0开始）
     */
    private static int DATA_START_ROW_NUM = 5;

    /**
     * 数据区域结束行数下标（下标从0开始）
     */
    private static int DATA_END_ROW_NUM = 8;

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
            DataTable1_9 dataTable1_9 = (DataTable1_9)dataList.get(i);
            for (int j = DATA_START_ROW_NUM; j <= DATA_END_ROW_NUM; j++) {
                BigDecimal value = getDoubleDataByRowIndex(dataTable1_9, j);
                sheet.getRow(j).getCell(i + DATA_START_COLUMN_NUM).setCellValue(null != value ? value.doubleValue() : 0);
            }
        }
    }

    /**
     * 填充交易时期、填报日期、填表人及审核人
     *
     * @param sheet         表格
     * @param presetContent 预设内容
     */
    private static void writePresetContent(HSSFSheet sheet, PresetContent presetContent) {
        //填充交易时期、填报日期、填表人及审核人
        sheet.getRow(0).createCell(1).setCellValue(presetContent.getCompanyName());
        sheet.getRow(1).createCell(1).setCellValue(presetContent.getTranPeriod());
        sheet.getRow(2).createCell(1).setCellValue(presetContent.getReportDate());
        sheet.getRow(DATA_END_ROW_NUM + 1).createCell(1).setCellValue(presetContent.getReportDate());
        sheet.getRow(DATA_END_ROW_NUM + 2).createCell(1).setCellValue(presetContent.getCheckUserName());
    }

    /**
     * 获取数据
     *
     * @param dataTable1_9 数据
     * @param index        下标
     * @return
     */
    public static BigDecimal getDoubleDataByRowIndex(DataTable1_9 dataTable1_9, int index) {
        switch (index) {
            case 5:
                return dataTable1_9.getJ01();
            case 6:
                return dataTable1_9.getJ02();
            case 7:
                return dataTable1_9.getJ03();
            case 8:
                return dataTable1_9.getJ04();
            default:
                return new BigDecimal("0");
        }
    }
}
