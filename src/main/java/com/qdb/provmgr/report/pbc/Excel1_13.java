package com.qdb.provmgr.report.pbc;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

import org.apache.commons.collections.CollectionUtils;
import org.apache.poi.hssf.usermodel.HSSFSheet;

import com.qdb.provmgr.dao.entity.report.BaseReportEntity;
import com.qdb.provmgr.dao.entity.report.DataTable1_13;
import com.qdb.provmgr.report.PresetContent;
import com.qdb.provmgr.report.ReportHelper;

/**
 * @author mashengli
 */
public class Excel1_13 extends ReportHelper {
    /**
     * 数据区域起始行数下标（下标从0开始）
     */
    private static int DATA_START_ROW_NUM = 6;

    /**
     * 数据区域结束行数下标（下标从0开始）
     */
    private static int DATA_END_ROW_NUM = 36;

    /**
     * 数据区域起始列数下标（下标从0开始）
     */
    private static int DATA_START_COLUMN_NUM = 1;

    /**
     * 数据区域结束列数下标（下标从0开始）
     */
    private static int DATA_END_COLUMN_NUM = 6;

    public static void writeData(HSSFSheet sheet, PresetContent presetContent, List<BaseReportEntity> dataList) {
        writePresetContent(sheet, presetContent);
        writeData(sheet, ReportHelper.mergeAndSumByDate(dataList));
    }

    /**
     * 写数据
     * @param sheet 表格
     * @param dataList 数据
     */
    private static void  writeData(HSSFSheet sheet, List<BaseReportEntity> dataList) {
        if (!CollectionUtils.isEmpty(dataList)) {
            Collections.sort(dataList);
            int size = dataList.size();
            for (int i = 0; i < size; i++) {
                DataTable1_13 dataTable1_13 = (DataTable1_13) dataList.get(i);
                for (int j = DATA_START_COLUMN_NUM; j <= DATA_END_COLUMN_NUM; j++) {
                    BigDecimal value = getDoubleDataByColumnIndex(dataTable1_13, j);
                    sheet.getRow(i + DATA_START_ROW_NUM).getCell(j).setCellValue(null != value ? value.doubleValue() : 0);
                }
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
     * @param dataTable1_13 数据
     * @param index 下标
     * @return
     */
    public static BigDecimal getDoubleDataByColumnIndex(DataTable1_13 dataTable1_13, int index) {
        switch (index) {
            case 1:
                return dataTable1_13.getN01();
            case 2:
                return dataTable1_13.getN02();
            case 3:
                return dataTable1_13.getN03();
            case 4:
                return dataTable1_13.getN04();
            case 5:
                return dataTable1_13.getN05();
            case 6:
                return dataTable1_13.getN06();
            default:
                return new BigDecimal("0");
        }
    }
}
