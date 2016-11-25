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

import com.qdb.provmgr.dao.entity.report.DataTable1_6;
import com.qdb.provmgr.util.FileUtil;
import com.qdb.provmgr.util.POIUtil;

/**
 * @author mashengli
 */
public class Table1_6Util {

    private static Logger log = LoggerFactory.getLogger(Table1_6Util.class);

    /**
     * 数据起始行数下标（下标从0开始）
     */
    private static int DATA_START_ROW_NUM = 4;

    /**
     * 数据区域结束行数下标（下标从0开始）
     */
    private static int DATA_END_ROW_NUM = 31;

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
                                       String writeUserName, String checkUserName, List<DataTable1_6> dataList) throws Exception {
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
    private static void writeData(HSSFSheet sheet, List<DataTable1_6> dataList) {
        Collections.sort(dataList);
        int size = dataList.size();
        for (int i = 0; i < size; i++) {
            DataTable1_6 dataTable1_6 = dataList.get(i);
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
    public static List<DataTable1_6> mergeAndSumByDate(List<DataTable1_6> dataList) {
        if (CollectionUtils.isEmpty(dataList)) {
            return Collections.EMPTY_LIST;
        }
        Map<String, DataTable1_6> map = new HashMap<>();
        for (DataTable1_6 dataTable1_6 : dataList) {
            if (map.containsKey(dataTable1_6.getNatuDate())) {
                map.put(dataTable1_6.getNatuDate(), addData(map.get(dataTable1_6.getNatuDate()), dataTable1_6));
            } else {
                map.put(dataTable1_6.getNatuDate(), dataTable1_6);
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
    private static DataTable1_6 addData(DataTable1_6 data1, DataTable1_6 data2) {
        if (data1 == null) {
            return data2;
        }
        if (data2 == null) {
            return data1;
        }
        data1.setF01(DecimalTool.add(data1.getF01(), data2.getF01()));
        data1.setF02(DecimalTool.add(data1.getF02(), data2.getF02()));
        data1.setF03(DecimalTool.add(data1.getF03(), data2.getF03()));
        data1.setF04(DecimalTool.add(data1.getF04(), data2.getF04()));
        data1.setF05(DecimalTool.add(data1.getF05(), data2.getF05()));
        data1.setF06(DecimalTool.add(data1.getF06(), data2.getF06()));
        data1.setF07(DecimalTool.add(data1.getF07(), data2.getF07()));
        data1.setF08(DecimalTool.add(data1.getF08(), data2.getF08()));
        data1.setF09(DecimalTool.add(data1.getF09(), data2.getF09()));
        data1.setF10(DecimalTool.add(data1.getF10(), data2.getF10()));
        data1.setG01(DecimalTool.add(data1.getG01(), data2.getG01()));
        data1.setG02(DecimalTool.add(data1.getG02(), data2.getG02()));
        data1.setG03(DecimalTool.add(data1.getG03(), data2.getG03()));
        data1.setG04(DecimalTool.add(data1.getG04(), data2.getG04()));
        data1.setG05(DecimalTool.add(data1.getG05(), data2.getG05()));
        data1.setG06(DecimalTool.add(data1.getG06(), data2.getG06()));
        data1.setG07(DecimalTool.add(data1.getG07(), data2.getG07()));
        data1.setG08(DecimalTool.add(data1.getG08(), data2.getG08()));
        data1.setG09(DecimalTool.add(data1.getG09(), data2.getG09()));
        data1.setG10(DecimalTool.add(data1.getG10(), data2.getG10()));
        data1.setG11(DecimalTool.add(data1.getG11(), data2.getG11()));
        data1.setG12(DecimalTool.add(data1.getG12(), data2.getG12()));
        data1.setG13(DecimalTool.add(data1.getG13(), data2.getG13()));
        data1.setG14(DecimalTool.add(data1.getG14(), data2.getG14()));
        return data1;
    }
    
    /**
     * 获取数据
     *
     * @param dataTable1_6 数据
     * @param index        下标
     * @return
     */
    public static BigDecimal getDoubleDataByRowIndex(DataTable1_6 dataTable1_6, int index) {
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

    public static void main(String[] args) {
        List<DataTable1_6> dataList = new ArrayList<>();

        for (int i = 0; i <= 30; i++) {
            DataTable1_6 dataTable1_6 = new DataTable1_6();
            dataList.add(dataTable1_6);
        }
        try {
            File file = createExcelFile("d:/template_1_6.xls", "table_1_6.xls", "钱袋宝", "201610", "20161116", "许丽丽", "刘仁超", dataList);
            System.out.println(file.getPath());
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
