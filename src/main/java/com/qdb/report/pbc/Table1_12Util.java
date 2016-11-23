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

import com.qdb.dao.model.DataTable1_12;
import com.qdb.util.FileUtil;
import com.qdb.util.POIUtil;

/**
 * @author mashengli
 */
public class Table1_12Util {

    private static Logger log = LoggerFactory.getLogger(Table1_12Util.class);

    /**
     * 数据起始行数下标（下标从0开始）
     */
    private static int DATA_START_ROW_NUM = 4;

    /**
     * 数据区域结束行数下标（下标从0开始）
     */
    private static int DATA_END_ROW_NUM = 23;

    /**
     * 数据起始列数下标（下标从0开始）
     */
    private static int DATA_START_COLUMN_NUM = 2;

    /**
     * 数据区域结束数下标（下标从0开始）
     */
    private static int DATA_END_COLUMN_NUM = 32;

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
                                       String writeUserName, String checkUserName, List<DataTable1_12> dataList) throws Exception {
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
    private static void writeData(HSSFSheet sheet, List<DataTable1_12> dataList) {
        Collections.sort(dataList);
        int size = dataList.size();
        for (int i = 0; i < size; i++) {
            DataTable1_12 dataTable1_12 = dataList.get(i);
            for (int j = DATA_START_ROW_NUM; j <= DATA_END_ROW_NUM; j++) {
                Double value = getDoubleDataByRowIndex(dataTable1_12, j);
                sheet.getRow(j).getCell(i + DATA_START_COLUMN_NUM).setCellValue(null != value ? value : 0);
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
     * @param dataTable1_12 数据
     * @param index        下标
     * @return
     */
    public static Double getDoubleDataByRowIndex(DataTable1_12 dataTable1_12, int index) {
        switch (index) {
            case 4:
                return dataTable1_12.getM1();
            case 5:
                return dataTable1_12.getM2();
            case 6:
                return dataTable1_12.getM3();
            case 7:
                return dataTable1_12.getM4();
            case 8:
                return dataTable1_12.getM5();
            case 9:
                return dataTable1_12.getM6();
            case 10:
                return (double) 0;
            case 11:
                return dataTable1_12.getM7();
            case 12:
                return dataTable1_12.getM8();
            case 13:
                return dataTable1_12.getM9();
            case 14:
                return dataTable1_12.getM10();
            case 15:
                return dataTable1_12.getM11();
            case 16:
                return dataTable1_12.getZ2();
            case 17:
                return dataTable1_12.getZ201();
            case 18:
                return dataTable1_12.getZ202();
            case 19:
                return (double) 0;
            case 20:
                return (double) 0;
            case 21:
                return dataTable1_12.getM12();
            case 22:
                return dataTable1_12.getM13();
            case 23:
                return dataTable1_12.getM14();
            default:
                return (double) 0;
        }
    }

    public static void main(String[] args) {
        List<DataTable1_12> dataList = new ArrayList<>();

        for (int i = 0; i <= 30; i++) {
            DataTable1_12 dataTable1_12 = new DataTable1_12();
            dataTable1_12.setM1(i + 0.1);
            dataTable1_12.setM2(i + 0.2);
            dataTable1_12.setM4(i + 0.3);
            dataTable1_12.setZ2(i + 0.4);
            dataTable1_12.setM14(i + 0.4);
            dataList.add(dataTable1_12);
        }
        try {
            File file = createExcelFile("d:/template_1_12.xls", "table_1_12.xls", "钱袋宝", "201610", "20161116", "许丽丽", "刘仁超", dataList);
            System.out.println(file.getPath());
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
