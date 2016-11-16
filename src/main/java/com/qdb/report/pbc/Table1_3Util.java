package com.qdb.report.pbc;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.util.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.qdb.report.pbc.bean.DataTable1_3;

/**
 * @author mashengli
 */
public class Table1_3Util {

    private static Logger log = LoggerFactory.getLogger(Table1_3Util.class);

    /**
     * 数据起始行数下标（下标从0开始）
     */
    private static int DATA_START_ROW_NUM = 5;

    /**
     * 数据起始列数下标（下标从0开始）
     */
    private static int DATA_START_COLUMN_NUM = 4;

    private static SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

    /**
     * 按照表一模板填写表一内容
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
                                       String writeUserName, String checkUserName, List<DataTable1_3> dataList) throws Exception{
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
            writePresetContent(sheetOut, tranPeriod, reportDate);
            //填写数据
            writeData(sheetOut, dataList, writeUserName, checkUserName);

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
     * 填充交易时期、填报日期、填表人及审核人
     * @param sheet 表格
     * @param tranPeriod 交易时期
     * @param reportDate 填表日期
     */
    private static void  writePresetContent(HSSFSheet sheet, String tranPeriod, String reportDate) {
        //填充交易时期、填报日期、填表人及审核人
        sheet.getRow(1).createCell(1).setCellValue(tranPeriod);
        sheet.getRow(2).createCell(1).setCellValue(reportDate);
    }

    /**
     * 写数据
     * @param sheet 表格
     * @param dataList 数据
     */
    private static void writeData(HSSFSheet sheet, List<DataTable1_3> dataList, String writeUserName, String checkUserName) {
        writeData(sheet, convertData(dataList), writeUserName, checkUserName);
    }

    /**
     * 写数据
     * @param sheet 表格
     * @param dataMap 整理的map数据
     */
    private static void writeData(HSSFSheet sheet, Map<String, LinkedHashMap> dataMap, String writeUserName, String checkUserName) {
        int rowNum = DATA_START_ROW_NUM;
        //保存合计的数值
        LinkedHashMap totalDataMap = dataMap.get("total");
        dataMap.remove("total");
        int countAccount = 0;//计数，用于计算实际账户数量
        for (LinkedHashMap rowData : dataMap.values()) {
            countAccount++;
            int column = 0;
            HSSFRow row = sheet.createRow(rowNum++);
            for (Object obj : rowData.values()) {
                if (column < DATA_START_COLUMN_NUM) {
                    row.createCell(column++).setCellValue((String)obj);
                } else {
                    row.createCell(column++).setCellValue((double)obj);
                }
            }
        }

        HSSFRow totalRow = sheet.createRow(DATA_START_ROW_NUM + countAccount);
        int columnNum = 0;
        totalRow.createCell(columnNum++).setCellValue("合计");
        totalRow.createCell(columnNum++);
        totalRow.createCell(columnNum++);
        sheet.addMergedRegion(new CellRangeAddress(DATA_START_ROW_NUM + countAccount, DATA_START_ROW_NUM + countAccount, 0, 2));

        totalRow.createCell(columnNum++);
        for (Object obj : totalDataMap.values()) {
            totalRow.createCell(columnNum++).setCellValue((double)obj);
        }

        HSSFRow secondLastRow = sheet.createRow(DATA_START_ROW_NUM + countAccount + 1);
        secondLastRow.createCell(0).setCellValue("填表人（填写在本行B列）");
        secondLastRow.getCell(0).setCellStyle(sheet.getRow(1).getCell(0).getCellStyle());
        secondLastRow.createCell(1).setCellValue(writeUserName);

        HSSFRow lastRow = sheet.createRow(DATA_START_ROW_NUM + countAccount + 2);
        lastRow.createCell(0).setCellValue("复核人（填写在本行B列）");
        lastRow.getCell(0).setCellStyle(sheet.getRow(1).getCell(0).getCellStyle());
        lastRow.createCell(1).setCellValue(checkUserName);
    }

    /**
     * 数据转化
     * @param dataList 源列表数据
     * @return
     */
    private static Map<String, LinkedHashMap> convertData(List<DataTable1_3> dataList) {
        Map<String, LinkedHashMap> resultMap = new HashMap<>();
        //按照日期进行排序
        Collections.sort(dataList);
        //合计数据，计算各个账户同一天累加的数据,只填数据
        LinkedHashMap<String, Double> totalMap = new LinkedHashMap<>();

        for (DataTable1_3 data : dataList) {
            if (totalMap.containsKey(data.getNatuDate())) {
                Double newValue = totalMap.get(data.getNatuDate()) + (null != data.getC01() ? data.getC01() : 0);
                totalMap.put(data.getNatuDate(), newValue);
            } else {
                totalMap.put(data.getNatuDate(), (null != data.getC01() ? data.getC01() : 0));
            }
            //按照账户进行分组，将同一账户的不同日期进行行列转换，并按照日期顺序进行赋值
            if (resultMap.containsKey(data.getAD())) {
                LinkedHashMap<String, Object> row = resultMap.get(data.getAD());
                row.put(data.getNatuDate(), data.getC01());
            } else {
                LinkedHashMap<String, Object> row = new LinkedHashMap<>();
                row.put("bankName", data.getBankName());
                row.put("name", data.getName());
                row.put("AD", data.getAD());
                row.put("C01", "C01");
                row.put(data.getNatuDate(), (null != data.getC01() ? data.getC01() : 0));
                resultMap.put(data.getName(), row);
            }
        }
        resultMap.put("total", totalMap);
        return resultMap;
    }

    public static void main(String[] args) throws ParseException {
        List<DataTable1_3> dataList = new ArrayList<>();

        for (int i = 1; i<= 31; i++) {
            DataTable1_3 data1 = new DataTable1_3();
            data1.setAD("321080100100292783");
            data1.setName("账户1");
            data1.setBankName("银行1");
            data1.setNatuDate("2016-10-0" + i);
            data1.setC01(i + 0.1);
            dataList.add(data1);
        }

        for (int i = 1; i<= 31; i++) {
            DataTable1_3 data1 = new DataTable1_3();
            data1.setAD("110061137018010014366");
            data1.setName("账户2");
            data1.setBankName("银行2");
            data1.setNatuDate("2016-10-0" + i);
            data1.setC01(i + 0.2);
            dataList.add(data1);
        }
        try {
            File file = createExcelFile("d:/template_1_3.xls", "table_1_3.xls", "201610", "20161115", "许丽丽", "刘仁超", dataList);
            System.out.println(file);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
