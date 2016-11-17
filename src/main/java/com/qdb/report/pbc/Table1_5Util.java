package com.qdb.report.pbc;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.util.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.qdb.report.pbc.bean.DataTable1_5;

/**
 * @author mashengli
 */
public class Table1_5Util {

    private static Logger log = LoggerFactory.getLogger(Table1_5Util.class);

    /**
     * 数据起始行数下标（下标从0开始）
     */
    private static int DATA_START_ROW_NUM = 6;

    /**
     * 数据区域结束行数下标（下标从0开始）
     */
    private static int DATA_END_ROW_NUM = 36;

    /**
     * 数据起始列数下标（下标从0开始）
     */
    private static int DATA_START_COLUMN_NUM = 1;

    /**
     * 数据区域结束行数下标（下标从0开始）
     */
    private static int DATA_END_COLUMN_NUM = 6;

    /**
     * 按照表一模板填写表一内容
     *
     * @param templateFile   模板文件全路径
     * @param targetFileName 目标文件名
     * @param companyName 支付机构名称
     * @param tranPeriod     交易时期
     * @param reportDate     填报日期
     * @param writeUserName  填表人
     * @param checkUserName  复核人
     * @param dataList       数据
     * @return 生成的文件
     * @throws Exception
     */
    public static File createExcelFile(String templateFile, String targetFileName, String companyName, String tranPeriod, String reportDate,
                                       String writeUserName, String checkUserName, List<DataTable1_5> dataList) throws Exception {
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
            writePresetContent(sheetOut, companyName, tranPeriod, reportDate, writeUserName, checkUserName);
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
    private static void writeData(HSSFSheet sheet, List<DataTable1_5> dataList) {
        Collections.sort(dataList);
        int size = dataList.size();
        DataTable1_5 total = new DataTable1_5();
        for (int i = 0; i < size; i++) {
            DataTable1_5 dataTable1_5 = dataList.get(i);
            total = addData(total, dataTable1_5);
            for (int j = DATA_START_COLUMN_NUM; j <= DATA_END_COLUMN_NUM; j++) {
                Double value = getDoubleDataByColumnIndex(dataTable1_5, j);
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
     * 填充交易时期、填报日期、填表人及审核人
     *
     * @param sheet         表格
     * @param companyName 支付机构名称
     * @param tranPeriod    交易时期
     * @param reportDate    填表日期
     * @param writeUserName 填表人
     * @param checkUserName 复核人
     */
    private static void writePresetContent(HSSFSheet sheet, String tranPeriod, String companyName, String reportDate, String writeUserName, String checkUserName) {
        //填充交易时期、填报日期、填表人及审核人
        sheet.getRow(0).createCell(1).setCellValue(companyName);
        sheet.getRow(1).createCell(1).setCellValue(tranPeriod);
        sheet.getRow(2).createCell(1).setCellValue(reportDate);
        sheet.getRow(DATA_END_ROW_NUM + 1).createCell(1).setCellValue(writeUserName);
        sheet.getRow(DATA_END_ROW_NUM + 2).createCell(1).setCellValue(checkUserName);
    }

    /**
     * 获取数据
     *
     * @param dataTable1_5 数据
     * @param index        下标
     * @return
     */
    public static Double getDoubleDataByColumnIndex(DataTable1_5 dataTable1_5, int index) {
        switch (index) {
            case 1:
                return dataTable1_5.getE01();
            case 2:
                return dataTable1_5.getE02();
            case 3:
                return dataTable1_5.getE03();
            case 4:
                return dataTable1_5.getE04();
            case 5:
                return dataTable1_5.getE05();
            case 6:
                return dataTable1_5.getE06();
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
    private static DataTable1_5 addData(DataTable1_5 data1, DataTable1_5 data2) {
        if (data1 == null) {
            return data2;
        }
        if (data2 == null) {
            return data1;
        }
        data1.setE01((null != data1.getE01() ? data1.getE01() : 0) + (null != data2.getE01() ? data2.getE01() : 0));
        data1.setE02((null != data1.getE02() ? data1.getE02() : 0) + (null != data2.getE02() ? data2.getE02() : 0));
        data1.setE03((null != data1.getE03() ? data1.getE03() : 0) + (null != data2.getE03() ? data2.getE03() : 0));
        data1.setE04((null != data1.getE04() ? data1.getE04() : 0) + (null != data2.getE04() ? data2.getE04() : 0));
        data1.setE05((null != data1.getE05() ? data1.getE05() : 0) + (null != data2.getE05() ? data2.getE05() : 0));
        data1.setE06((null != data1.getE06() ? data1.getE06() : 0) + (null != data2.getE06() ? data2.getE06() : 0));
        return data1;
    }

    public static void main(String[] args) {
        List<DataTable1_5> dataList = new ArrayList<>();

        for (int i = 0; i <= 30; i++) {
            DataTable1_5 dataTable1_5 = new DataTable1_5();
            dataTable1_5.setE01(i + 0.1);
            dataTable1_5.setE02(i + 0.2);
            dataTable1_5.setE03(i + 0.3);
            dataTable1_5.setE04(i + 0.4);
            dataTable1_5.setE05(i + 0.4);
            dataTable1_5.setE06(i + 0.4);
            dataList.add(dataTable1_5);
        }
        try {
            File file = createExcelFile("d:/template_1_5.xls", "table_1_5.xls", "钱袋宝", "201610", "20161116", "许丽丽", "刘仁超", dataList);
            System.out.println(file.getPath());
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
