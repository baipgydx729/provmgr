package com.qdb.report.pbc;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.util.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.qdb.report.pbc.bean.DataTable1_2;

/**
 * @author mashengli
 */
public class Table1_2Util {

    private static Logger log = LoggerFactory.getLogger(Table1_2Util.class);

    /**
     * 数据区域起始行数下标（下标从0开始）
     */
    private static int DATA_START_ROW_NUM = 8;

    /**
     * 数据区域结束行数下标（下标从0开始）
     */
    private static int DATA_END_ROW_NUM = 39;

    /**
     * 数据区域起始列数下标（下标从0开始）
     */
    private static int DATA_START_COLUMN_NUM = 1;

    /**
     * 数据区域结束列数下标（下标从0开始）
     */
    private static int DATA_END_COLUMN_NUM = 9;

    /**
     * 按照表二模板填写表二内容
     * @param templateFile 模板文件全路径
     * @param targetFileName 目标文件名
     * @param tranPeriod 交易时期
     * @param reportDate 填报日期
     * @param writeUserName 填表人
     * @param checkUserName 复核人
     * @param dataList 数据
     * @return 生成的文件
     * @throws Exception
     */
    public static File createExcelFile(String templateFile, String targetFileName, String tranPeriod, String reportDate,
                                     String writeUserName, String checkUserName, List<DataTable1_2> dataList) throws Exception {
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

            //填写预设内容
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
     * 写数据
     * @param sheet 表格
     * @param dataList 数据
     */
    private static void  writeData(HSSFSheet sheet, List<DataTable1_2> dataList) {
        int size = dataList.size();
        DataTable1_2 total = new DataTable1_2();
        for (int i = 0; i < size; i++) {
            DataTable1_2 dataTable1_2 = dataList.get(i);
            total = addData(total, dataTable1_2);
            for (int j = DATA_START_COLUMN_NUM; j <= DATA_END_COLUMN_NUM; j++) {
                Double value = getDoubleDataByColumnIndex(dataTable1_2, j);
                sheet.getRow(i + DATA_START_ROW_NUM).getCell(j).setCellValue(null != value ? value : 0);
            }
        }
        //合计行
        for (int j = DATA_START_COLUMN_NUM; j <= DATA_END_COLUMN_NUM; j++) {
            Double value = getDoubleDataByColumnIndex(total, j);
            sheet.getRow(DATA_END_ROW_NUM).getCell(j).setCellValue(null != value ? value : 0);
        }
    }

    /**
     * 写预设的内容
     * @param sheet 表格
     * @param tranPeriod 交易时期
     * @param reportData 填报日期
     * @param writeUserName 填表人
     * @param checkUserName 复核人
     */
    private static void writePresetContent(HSSFSheet sheet, String tranPeriod, String reportData, String writeUserName, String checkUserName) {
        sheet.getRow(1).createCell(1).setCellValue(tranPeriod);
        sheet.getRow(2).createCell(1).setCellValue(reportData);
        sheet.getRow(DATA_END_ROW_NUM + 1).createCell(1).setCellValue(writeUserName);
        sheet.getRow(DATA_END_ROW_NUM + 2).createCell(1).setCellValue(checkUserName);
    }

    /**
     * 获取数据
     * @param dataTable1_2 数据
     * @param index 下标
     * @return
     */
    public static Double getDoubleDataByColumnIndex(DataTable1_2 dataTable1_2, int index) {
        switch (index) {
            case 1:
                return dataTable1_2.getB01();
            case 2:
                return dataTable1_2.getB02();
            case 3:
                return dataTable1_2.getB03();
            case 4:
                return dataTable1_2.getB04();
            case 5:
                return dataTable1_2.getB05();
            case 6:
                return dataTable1_2.getB06();
            case 7:
                return dataTable1_2.getB07();
            case 8:
                return dataTable1_2.getB08();
            case 9:
                return dataTable1_2.getB09();
            default:
                return (double) 0;
        }
    }

    /**
     * 做加法
     * @param data1
     * @param data2
     * @return
     */
    private static DataTable1_2 addData(DataTable1_2 data1, DataTable1_2 data2) {
        if (data1 == null) {
            return data2;
        }
        if (data2 == null) {
            return data1;
        }
        data1.setB01((null != data1.getB01() ? data1.getB01() : 0) + (null != data2.getB01() ? data2.getB01() : 0));
        data1.setB02((null != data1.getB02() ? data1.getB02() : 0) + (null != data2.getB02() ? data2.getB02() : 0));
        data1.setB03((null != data1.getB03() ? data1.getB03() : 0) + (null != data2.getB03() ? data2.getB03() : 0));
        data1.setB04((null != data1.getB04() ? data1.getB04() : 0) + (null != data2.getB04() ? data2.getB04() : 0));
        data1.setB05((null != data1.getB05() ? data1.getB05() : 0) + (null != data2.getB05() ? data2.getB05() : 0));
        data1.setB06((null != data1.getB06() ? data1.getB06() : 0) + (null != data2.getB06() ? data2.getB06() : 0));
        data1.setB07((null != data1.getB07() ? data1.getB07() : 0) + (null != data2.getB07() ? data2.getB07() : 0));
        data1.setB08((null != data1.getB08() ? data1.getB08() : 0) + (null != data2.getB08() ? data2.getB08() : 0));
        data1.setB09((null != data1.getB09() ? data1.getB09() : 0) + (null != data2.getB09() ? data2.getB09() : 0));
        return data1;
    }

    public static void main(String[] args) {
        List<DataTable1_2> dataList = new ArrayList<>();

        for (int i = 0; i <= 30; i++) {
            DataTable1_2 dataTable1_2 = new DataTable1_2();
            dataTable1_2.setB01(i + 0.1);
            dataTable1_2.setB02(i + 0.2);
            dataList.add(dataTable1_2);
        }
        try {
            File file = createExcelFile("d:/template_1_2.xls", "table_1_2.xls", "201610", "20161116", "许丽丽", "刘仁超", dataList);
            System.out.println(file.getPath());
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
