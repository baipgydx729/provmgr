package com.qdb.provmgr.report.pbc;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

import org.apache.poi.hssf.usermodel.HSSFSheet;

import com.qdb.provmgr.dao.entity.report.BaseReportEntity;
import com.qdb.provmgr.dao.entity.report.DataTable1_6;
import com.qdb.provmgr.report.ReportExcelUtil;
import com.qdb.provmgr.report.PresetContent;

/**
 * @author mashengli
 */
public class Excel1_6 extends ReportExcelUtil {

    /**
     * 数据起始行数下标（下标从0开始）
     */
    private static int DATA_START_ROW_NUM = 9;

    /**
     * 数据区域结束行数下标（下标从0开始）
     */
    private static int DATA_END_ROW_NUM = 36;

    /**
     * 数据起始列数下标（下标从0开始）
     */
    private static int DATA_START_COLUMN_NUM = 2;

    /**
     * 数据区域结束数下标（下标从0开始）
     */
    private static int DATA_END_COLUMN_NUM = 32;

    @Override
    public void writeData(HSSFSheet sheet, PresetContent presetContent, List<BaseReportEntity> dataList) {
        writePresetContent(sheet, presetContent);
        writeData(sheet, dataList);
    }

    /**
     * 按照模板写数据
     *
     * @param sheet    表格
     * @param dataList 数据列表
     */
    private void writeData(HSSFSheet sheet, List<BaseReportEntity> dataList) {
        Collections.sort(dataList);
        int size = dataList.size();
        for (int i = 0; i < size; i++) {
            DataTable1_6 dataTable1_6 = (DataTable1_6) dataList.get(i);
            for (int j = DATA_START_ROW_NUM; j <= DATA_END_ROW_NUM; j++) {
                BigDecimal value = getDoubleDataByRowIndex(dataTable1_6, j);
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
    private void writePresetContent(HSSFSheet sheet, PresetContent presetContent) {
        //填充交易时期、填报日期、填表人及审核人
        sheet.getRow(0).createCell(1).setCellValue(presetContent.getCompanyName());
        sheet.getRow(1).createCell(1).setCellValue(presetContent.getLegalPerson());
        sheet.getRow(2).createCell(1).setCellValue(presetContent.getAuthCompanyName());
        sheet.getRow(3).createCell(1).setCellValue(presetContent.getTranPeriod());
        sheet.getRow(4).createCell(1).setCellValue(presetContent.getBankName());
        sheet.getRow(5).createCell(1).setCellValue(presetContent.getAccountName());
        sheet.getRow(6).createCell(1).setCellValue(presetContent.getAccount());
        sheet.getRow(7).createCell(1).setCellValue(presetContent.getReportDate());
        sheet.getRow(DATA_END_ROW_NUM + 1).createCell(1).setCellValue(presetContent.getReportDate());
        sheet.getRow(DATA_END_ROW_NUM + 2).createCell(1).setCellValue(presetContent.getCheckUserName());
    }

    /**
     * 获取数据
     *
     * @param dataTable1_6 数据
     * @param index        下标
     * @return
     */
    public BigDecimal getDoubleDataByRowIndex(DataTable1_6 dataTable1_6, int index) {
        switch (index) {
            case 4:
                return new BigDecimal("0");
            case 5:
                return dataTable1_6.getF01();
            case 6:
                return dataTable1_6.getF02();
            case 7:
                return dataTable1_6.getF03();
            case 8:
                return dataTable1_6.getF04();
            case 9:
                return dataTable1_6.getF05();
            case 10:
                return dataTable1_6.getF06();
            case 11:
                return dataTable1_6.getF07();
            case 12:
                return new BigDecimal("0");
            case 13:
                return dataTable1_6.getF08();
            case 14:
                return dataTable1_6.getF09();
            case 15:
                return dataTable1_6.getF10();
            case 16:
                return new BigDecimal("0");
            case 17:
                return dataTable1_6.getG01();
            case 18:
                return dataTable1_6.getG02();
            case 19:
                return dataTable1_6.getG03();
            case 20:
                return dataTable1_6.getG04();
            case 21:
                return dataTable1_6.getG05();
            case 22:
                return dataTable1_6.getG06();
            case 23:
                return dataTable1_6.getG07();
            case 24:
                return dataTable1_6.getG08();
            case 25:
                return dataTable1_6.getG09();
            case 26:
                return dataTable1_6.getG10();
            case 27:
                return new BigDecimal("0");
            case 28:
                return dataTable1_6.getG11();
            case 29:
                return dataTable1_6.getG12();
            case 30:
                return dataTable1_6.getG13();
            case 31:
                return dataTable1_6.getG14();
            default:
                return new BigDecimal("0");
        }
    }
}
