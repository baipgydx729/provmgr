package com.qdb.report.pbc;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;

import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.util.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.qdb.report.pbc.bean.DataTable1_1;

/**
 * @author mashengli
 */
public class Table1_1Util {

    private static Logger log = LoggerFactory.getLogger(Table1_1Util.class);

    /**
     * 数据起始行数下标（下标从0开始）
     */
    private static int DATA_START_ROW_NUM = 10;

    /**
     * 表格总列数（数据第一列为日期标签，剩余列为数据）
     */
    private static int TOTAL_COLUMNS = 23;

    /**
     * 按照表一模板填写表一内容
     *
     * @param templateFile   模板文件全路径
     * @param targetFileName 目标文件名
     * @param tranPeriod     交易时期
     * @param reportDate     填报日期
     * @param writeUserName  填表人
     * @param checkUserName  复核人
     * @param dataList       数据
     * @return 生成的文件
     * @throws Exception
     */
    public static File createExcelFile(String templateFile, String targetFileName, String tranPeriod, String reportDate,
                                       String writeUserName, String checkUserName, List<DataTable1_1> dataList) throws Exception {
        File tempFile = FileUtil.getTempExcelFile(targetFileName);
        InputStream is = null;
        OutputStream os = null;
        try {
            is = new FileInputStream(templateFile);
            HSSFWorkbook workbookIn = new HSSFWorkbook(is);
            HSSFSheet sheetIn = workbookIn.getSheetAt(0);

            os = new FileOutputStream(tempFile);
            HSSFWorkbook workbookOut = new HSSFWorkbook();     //创建工作簿
            HSSFSheet sheetOut = workbookOut.createSheet();       //创建sheet

            //拷贝模板
            POIUtil.copySheet(sheetIn, sheetOut, workbookIn, workbookOut);
            //填写预设单元格的内容
            writePresetContent(sheetOut, tranPeriod, reportDate, writeUserName, checkUserName);
            //填写数据
            writeData(sheetOut, dataList);

            workbookOut.write(os);
            os.flush();
        } catch (Exception e) {
            log.error("创建excel失败");
            throw e;
        } finally {
            IOUtils.closeQuietly(os);
            IOUtils.closeQuietly(is);
        }
        return tempFile;
    }

    /**
     * 按照模板写数据
     *
     * @param sheet    表格
     * @param dataList 数据列表
     */
    private static void writeData(HSSFSheet sheet, List<DataTable1_1> dataList) {
        int size = dataList.size();
        for (int i = 0; i < size; i++) {
            HSSFRow row = sheet.createRow(i + DATA_START_ROW_NUM);
            DataTable1_1 dataTable1_1 = dataList.get(i);
            for (int j = 1; j <= TOTAL_COLUMNS; j++) {
                Double value = getDoubleDataByColumnIndex(dataTable1_1, j);
                row.createCell(j).setCellValue(null != value ? value : 0);
            }
        }
    }

    /**
     * 填充交易时期、填报日期、填表人及审核人
     *
     * @param sheet         表格
     * @param tranPeriod    交易时期
     * @param reportDate    填表日期
     * @param writeUserName 填表人
     * @param checkUserName 复核人
     */
    private static void writePresetContent(HSSFSheet sheet, String tranPeriod, String reportDate, String writeUserName, String checkUserName) {
        //填充交易时期、填报日期、填表人及审核人
        sheet.getRow(1).createCell(1).setCellValue(tranPeriod);
        sheet.getRow(2).createCell(1).setCellValue(reportDate);
        sheet.getRow(40).createCell(1).setCellValue(writeUserName);
        sheet.getRow(41).createCell(1).setCellValue(checkUserName);
    }

    /**
     * 获取数据
     *
     * @param dataTable1_1 数据
     * @param index        下标
     * @return
     */
    public static Double getDoubleDataByColumnIndex(DataTable1_1 dataTable1_1, int index) {
        switch (index) {
            case 1:
                return dataTable1_1.getA01();
            case 2:
                return dataTable1_1.getA02();
            case 3:
                return dataTable1_1.getA03();
            case 4:
                return dataTable1_1.getA0301();
            case 5:
                return dataTable1_1.getA0302();
            case 6:
                return dataTable1_1.getA04();
            case 7:
                return dataTable1_1.getA05();
            case 8:
                return dataTable1_1.getA06();
            case 9:
                return dataTable1_1.getA0601();
            case 10:
                return dataTable1_1.getA0602();
            case 11:
                return dataTable1_1.getA07();
            case 12:
                return dataTable1_1.getA08();
            case 13:
                return dataTable1_1.getA09();
            case 14:
                return dataTable1_1.getA0901();
            case 15:
                return dataTable1_1.getA0902();
            case 16:
                return dataTable1_1.getA10();
            case 17:
                return dataTable1_1.getA11();
            case 18:
                return dataTable1_1.getA12();
            case 19:
                return dataTable1_1.getA13();
            case 20:
                return dataTable1_1.getA1301();
            case 21:
                return dataTable1_1.getA1302();
            case 22:
                return dataTable1_1.getA14();
            default:
                return 0.0;
        }
    }
}
