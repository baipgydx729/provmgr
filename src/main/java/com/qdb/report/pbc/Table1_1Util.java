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

import com.qdb.report.pbc.bean.DataTable1_1;

/**
 * @author mashengli
 */
public class Table1_1Util {

    private static Logger log = LoggerFactory.getLogger(Table1_1Util.class);

    /**
     * 数据区域起始行数下标（下标从0开始）
     */
    private static int DATA_START_ROW_NUM = 10;

    /**
     * 数据区域结束行数下标（下标从0开始）
     */
    private static int DATA_END_ROW_NUM = 41;

    /**
     * 数据区域起始列数下标（下标从0开始）
     */
    private static int DATA_START_COLUMN_NUM = 1;

    /**
     * 数据区域结束列数下标（下标从0开始）
     */
    private static int DATA_END_COLUMN_NUM = 22;

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
    private static void writeData(HSSFSheet sheet, List<DataTable1_1> dataList) {
        Collections.sort(dataList);
        int size = dataList.size();
        DataTable1_1 total = new DataTable1_1();
        for (int i = 0; i < size; i++) {
            DataTable1_1 dataTable1_1 = dataList.get(i);
            total = addData(total, dataTable1_1);
            for (int j = DATA_START_COLUMN_NUM; j <= DATA_END_COLUMN_NUM; j++) {
                Double value = getDoubleDataByColumnIndex(dataTable1_1, j);
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
     * @param tranPeriod    交易时期
     * @param companyName 支付机构名称
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
                return (double) 0;
        }
    }

    /**
     * 做加法
     * @param data1
     * @param data2
     * @return
     */
    private static DataTable1_1 addData(DataTable1_1 data1, DataTable1_1 data2) {
        if (data1 == null) {
            return data2;
        }
        if (data2 == null) {
            return data1;
        }
        data1.setA01((null != data1.getA01() ? data1.getA01() : 0) + (null != data2.getA01() ? data2.getA01() : 0));
        data1.setA02((null != data1.getA02() ? data1.getA02() : 0) + (null != data2.getA02() ? data2.getA02() : 0));
        data1.setA03((null != data1.getA03() ? data1.getA03() : 0) + (null != data2.getA03() ? data2.getA03() : 0));
        data1.setA0301((null != data1.getA0301() ? data1.getA0301() : 0) + (null != data2.getA0301() ? data2.getA0301() : 0));
        data1.setA0302((null != data1.getA0302() ? data1.getA0302() : 0) + (null != data2.getA0302() ? data2.getA0302() : 0));
        data1.setA04((null != data1.getA04() ? data1.getA04() : 0) + (null != data2.getA04() ? data2.getA04() : 0));
        data1.setA05((null != data1.getA05() ? data1.getA05() : 0) + (null != data2.getA05() ? data2.getA05() : 0));
        data1.setA06((null != data1.getA06() ? data1.getA06() : 0) + (null != data2.getA06() ? data2.getA06() : 0));
        data1.setA0601((null != data1.getA0601() ? data1.getA0601() : 0) + (null != data2.getA0601() ? data2.getA0601() : 0));
        data1.setA0602((null != data1.getA0602() ? data1.getA0602() : 0) + (null != data2.getA0602() ? data2.getA0602() : 0));
        data1.setA07((null != data1.getA07() ? data1.getA07() : 0) + (null != data2.getA07() ? data2.getA07() : 0));
        data1.setA08((null != data1.getA08() ? data1.getA08() : 0) + (null != data2.getA08() ? data2.getA08() : 0));
        data1.setA09((null != data1.getA09() ? data1.getA09() : 0) + (null != data2.getA09() ? data2.getA09() : 0));
        data1.setA0901((null != data1.getA0901() ? data1.getA0901() : 0) + (null != data2.getA0901() ? data2.getA0901() : 0));
        data1.setA0902((null != data1.getA0902() ? data1.getA0902() : 0) + (null != data2.getA0902() ? data2.getA0902() : 0));
        data1.setA10((null != data1.getA10() ? data1.getA10() : 0) + (null != data2.getA10() ? data2.getA10() : 0));
        data1.setA11((null != data1.getA11() ? data1.getA11() : 0) + (null != data2.getA11() ? data2.getA11() : 0));
        data1.setA12((null != data1.getA12() ? data1.getA12() : 0) + (null != data2.getA12() ? data2.getA12() : 0));
        data1.setA13((null != data1.getA13() ? data1.getA13() : 0) + (null != data2.getA13() ? data2.getA13() : 0));
        data1.setA1301((null != data1.getA1301() ? data1.getA1301() : 0) + (null != data2.getA1301() ? data2.getA1301() : 0));
        data1.setA1302((null != data1.getA1302() ? data1.getA1302() : 0) + (null != data2.getA1302() ? data2.getA1302() : 0));
        data1.setA14((null != data1.getA14() ? data1.getA14() : 0) + (null != data2.getA14() ? data2.getA14() : 0));
        return data1;
    }

    public static void main(String[] args) {
        List<DataTable1_1> dataList = new ArrayList<>();

        for (int i = 0; i <= 30; i++) {
            DataTable1_1 dataTable1_1 = new DataTable1_1();
            dataTable1_1.setA01(i + 0.1);
            dataTable1_1.setA02(i + 0.1);
            dataList.add(dataTable1_1);
        }
        try {
            File file = createExcelFile("d:/template_1_1.xls", "table_1_1.xls", "[BJ0000004]北京钱袋宝支付技术有限公司", "201610", "20161116", "许丽丽", "刘仁超", dataList);
            System.out.println(file.getPath());
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
