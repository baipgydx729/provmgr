package com.qdb.provmgr.report.pbc;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.util.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.CollectionUtils;

import com.qdb.provmgr.dao.entity.report.DataTable1_10;
import com.qdb.provmgr.util.POIUtil;
import com.qdb.provmgr.util.FileUtil;

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
                BigDecimal value = getDoubleDataByColumnIndex(dataTable1_10, j);
                sheet.getRow(i + DATA_START_ROW_NUM).getCell(j).setCellValue(null != value ? value.doubleValue() : 0);
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
     * 将查询结果按日累加并重新组装成列表
     * @param dataList 源数据
     * @return
     */
    public static List<DataTable1_10> mergeAndSumByDate(List<DataTable1_10> dataList) {
        if (CollectionUtils.isEmpty(dataList)) {
            return Collections.EMPTY_LIST;
        }
        Map<String, DataTable1_10> map = new HashMap<>();
        for (DataTable1_10 dataTable1_10 : dataList) {
            if (map.containsKey(dataTable1_10.getNatuDate())) {
                map.put(dataTable1_10.getNatuDate(), addData(map.get(dataTable1_10.getNatuDate()), dataTable1_10));
            } else {
                map.put(dataTable1_10.getNatuDate(), dataTable1_10);
            }
        }
        return new ArrayList<>(map.values());
    }

    /**
     * 做加法
     * @param data1
     * @param data2
     * @return
     */
    private static DataTable1_10 addData(DataTable1_10 data1, DataTable1_10 data2) {
        if (data1 == null) {
            return data2;
        }
        if (data2 == null) {
            return data1;
        }
        data1.setK01(DecimalTool.add(data1.getK01(), data2.getK01()));
        data1.setK02(DecimalTool.add(data1.getK02(), data2.getK02()));
        data1.setK03(DecimalTool.add(data1.getK03(), data2.getK03()));
        data1.setK04(DecimalTool.add(data1.getK04(), data2.getK04()));
        data1.setK05(DecimalTool.add(data1.getK05(), data2.getK05()));
        data1.setK06(DecimalTool.add(data1.getK06(), data2.getK06()));
        data1.setK07(DecimalTool.add(data1.getK07(), data2.getK07()));
        data1.setK08(DecimalTool.add(data1.getK08(), data2.getK08()));
        data1.setK09(DecimalTool.add(data1.getK09(), data2.getK09()));
        data1.setK10(DecimalTool.add(data1.getK10(), data2.getK10()));
        data1.setK11(DecimalTool.add(data1.getK11(), data2.getK11()));
        data1.setK12(DecimalTool.add(data1.getK12(), data2.getK12()));
        data1.setK13(DecimalTool.add(data1.getK13(), data2.getK13()));
        data1.setK14(DecimalTool.add(data1.getK14(), data2.getK14()));
        data1.setK15(DecimalTool.add(data1.getK15(), data2.getK15()));
        data1.setK16(DecimalTool.add(data1.getK16(), data2.getK16()));
        data1.setK17(DecimalTool.add(data1.getK17(), data2.getK17()));
        data1.setK18(DecimalTool.add(data1.getK18(), data2.getK18()));
        data1.setK19(DecimalTool.add(data1.getK19(), data2.getK19()));
        data1.setK20(DecimalTool.add(data1.getK20(), data2.getK20()));
        data1.setK21(DecimalTool.add(data1.getK21(), data2.getK21()));
        data1.setK22(DecimalTool.add(data1.getK22(), data2.getK22()));
        data1.setK23(DecimalTool.add(data1.getK23(), data2.getK23()));
        data1.setK24(DecimalTool.add(data1.getK24(), data2.getK24()));
        return data1;
    }

    /**
     * 获取数据
     *
     * @param dataTable1_10 数据
     * @param index        下标
     * @return
     */
    public static BigDecimal getDoubleDataByColumnIndex(DataTable1_10 dataTable1_10, int index) {
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
                return new BigDecimal("0");
        }
    }

    public static void main(String[] args) {
        List<DataTable1_10> dataList = new ArrayList<>();

        for (int i = 0; i <= 30; i++) {
            DataTable1_10 dataTable1_10 = new DataTable1_10();
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
