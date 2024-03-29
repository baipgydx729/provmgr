package com.qdb.provmgr.report.pbc;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

import org.apache.commons.collections.CollectionUtils;
import org.apache.poi.hssf.usermodel.HSSFSheet;

import com.qdb.provmgr.dao.entity.report.BaseReportEntity;
import com.qdb.provmgr.dao.entity.report.DataTable1_2;
import com.qdb.provmgr.report.PresetContent;
import com.qdb.provmgr.report.ReportHelper;

/**
 * @author mashengli
 */
class Excel1_2 {

    /**
     * 数据区域起始行数下标（下标从0开始）
     */
    static int DATA_START_ROW_NUM = 8;

    /**
     * 数据区域结束行数下标（下标从0开始）
     */
    static int DATA_END_ROW_NUM = 39;

    /**
     * 数据区域起始列数下标（下标从0开始）
     */
    static int DATA_START_COLUMN_NUM = 1;

    /**
     * 数据区域结束列数下标（下标从0开始）
     */
    static int DATA_END_COLUMN_NUM = 9;

    public static void writeData(HSSFSheet sheet, PresetContent presetContent, List<BaseReportEntity> dataList) {
        writePresetContent(sheet, presetContent);
        writeData(sheet, dataList);
    }

    private static void writePresetContent(HSSFSheet sheet, PresetContent presetContent) {
        sheet.getRow(0).createCell(0).setCellValue(presetContent.getCompanyName());
        sheet.getRow(1).createCell(1).setCellValue(presetContent.getTranPeriod());
        sheet.getRow(2).createCell(1).setCellValue(presetContent.getReportDate());
        sheet.getRow(DATA_END_ROW_NUM + 1).createCell(1).setCellValue(presetContent.getReportUserName());
        sheet.getRow(DATA_END_ROW_NUM + 2).createCell(1).setCellValue(presetContent.getCheckUserName());
    }

    private static void writeData(HSSFSheet sheet, List<BaseReportEntity> dataList) {
        if (!CollectionUtils.isEmpty(dataList)) {
            Collections.sort(dataList);
            int size = dataList.size();
            DataTable1_2 total = new DataTable1_2();
            for (int i = 0; i < size; i++) {
                DataTable1_2 dataTable1_21 = (DataTable1_2) dataList.get(i);
                total = ReportHelper.addData(total, dataTable1_21);
                for (int j = DATA_START_COLUMN_NUM; j <= DATA_END_COLUMN_NUM; j++) {
                    BigDecimal value = getDoubleDataByColumnIndex(dataTable1_21, j);
                    sheet.getRow(i + DATA_START_ROW_NUM).getCell(j).setCellValue(null != value ? value.doubleValue() : 0);
                }
            }
            //合计行
            for (int j = DATA_START_COLUMN_NUM; j <= DATA_END_COLUMN_NUM; j++) {
                BigDecimal value = getDoubleDataByColumnIndex(total, j);
                sheet.getRow(DATA_END_ROW_NUM).getCell(j).setCellValue(null != value ? value.doubleValue() : 0);
            }
        }
    }

    /**
     * 获取数据
     * @param dataTable1_21 数据
     * @param index 下标
     */
    private static BigDecimal getDoubleDataByColumnIndex(DataTable1_2 dataTable1_21, int index) {
        switch (index) {
            case 1:
                return dataTable1_21.getB01();
            case 2:
                return dataTable1_21.getB02();
            case 3:
                return dataTable1_21.getB03();
            case 4:
                return dataTable1_21.getB04();
            case 5:
                return dataTable1_21.getB05();
            case 6:
                return dataTable1_21.getB06();
            case 7:
                return dataTable1_21.getB07();
            case 8:
                return dataTable1_21.getB08();
            case 9:
                return dataTable1_21.getB09();
            default:
                return new BigDecimal("0");
        }
    }
}
