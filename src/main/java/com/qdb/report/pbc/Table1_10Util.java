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

import com.qdb.report.pbc.bean.DataTable1_10;

/**
 * @author mashengli
 */
public class Table1_10Util {

    private static Logger log = LoggerFactory.getLogger(Table1_10Util.class);

    /**
     * 数据区域起始行数下标（下标从0开始）
     */
    private static int DATA_START_ROW_NUM = 8;

    /**
     * 数据区域结束行数下标（下标从0开始）
     */
    private static int DATA_END_ROW_NUM = 38;

    /**
     * 数据区域起始列数下标（下标从0开始）
     */
    private static int DATA_START_COLUMN_NUM = 1;

    /**
     * 数据区域结束列数下标（下标从0开始）
     */
    private static int DATA_END_COLUMN_NUM = 24;

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
                                       String writeUserName, String checkUserName, List<DataTable1_10> dataList) throws Exception {
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
    private static void writeData(HSSFSheet sheet, List<DataTable1_10> dataList) {
        Collections.sort(dataList);
        int size = dataList.size();
        for (int i = 0; i < size; i++) {
            DataTable1_10 dataTable1_10 = dataList.get(i);
            for (int j = DATA_START_COLUMN_NUM; j <= DATA_END_COLUMN_NUM; j++) {
                Double value = getDoubleDataByColumnIndex(dataTable1_10, j);
                sheet.getRow(i + DATA_START_ROW_NUM).getCell(j).setCellValue(null != value ? value : 0);
            }
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
    private static void writePresetContent(HSSFSheet sheet, String companyName, String tranPeriod, String reportDate, String writeUserName, String checkUserName) {
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
     * @param dataTable1_10 数据
     * @param index        下标
     * @return
     */
    public static Double getDoubleDataByColumnIndex(DataTable1_10 dataTable1_10, int index) {
        switch (index) {
            case 1:
                return dataTable1_10.getK01();
            case 2:
                return dataTable1_10.getK02();
            case 3:
                return dataTable1_10.getK03();
            case 4:
                return dataTable1_10.getK04();
            case 5:
                return dataTable1_10.getK05();
            case 6:
                return dataTable1_10.getK06();
            case 7:
                return dataTable1_10.getK07();
            case 8:
                return dataTable1_10.getK08();
            case 9:
                return dataTable1_10.getK09();
            case 10:
                return dataTable1_10.getK10();
            case 11:
                return dataTable1_10.getK11();
            case 12:
                return dataTable1_10.getK12();
            case 13:
                return dataTable1_10.getK13();
            case 14:
                return dataTable1_10.getK14();
            case 15:
                return dataTable1_10.getK15();
            case 16:
                return dataTable1_10.getK16();
            case 17:
                return dataTable1_10.getK17();
            case 18:
                return dataTable1_10.getK18();
            case 19:
                return dataTable1_10.getK19();
            case 20:
                return dataTable1_10.getK20();
            case 21:
                return dataTable1_10.getK21();
            case 22:
                return dataTable1_10.getK22();
            case 23:
                return dataTable1_10.getK23();
            case 24:
                return dataTable1_10.getK24();
            default:
                return (double) 0;
        }
    }

    public static void main(String[] args) {
        List<DataTable1_10> dataList = new ArrayList<>();

        for (int i = 0; i <= 30; i++) {
            DataTable1_10 dataTable1_10 = new DataTable1_10();
            dataTable1_10.setK01(i + 0.1);
            dataTable1_10.setK02(i + 0.2);
            dataList.add(dataTable1_10);
        }
        try {
            File file = createExcelFile("d:/template_1_10.xls", "table_1_10.xls","钱袋宝", "201610", "20161116", "许丽丽", "刘仁超", dataList);
            System.out.println(file.getPath());
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
