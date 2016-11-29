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

import com.qdb.provmgr.dao.entity.report.DataTable1_11;
import com.qdb.provmgr.util.FileUtil;
import com.qdb.provmgr.util.POIUtil;

/**
 * @author mashengli
 */
public class Table1_11Util {

    private static Logger log = LoggerFactory.getLogger(Table1_11Util.class);

    /**
     * 数据起始行数下标（下标从0开始）
     */
    private static int DATA_START_ROW_NUM = 4;

    /**
     * 数据区域结束行数下标（下标从0开始）
     */
    private static int DATA_END_ROW_NUM = 34;

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
                                       String writeUserName, String checkUserName, List<DataTable1_11> dataList) throws Exception {
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
    private static void writeData(HSSFSheet sheet, List<DataTable1_11> dataList) {
        Collections.sort(dataList);
        int size = dataList.size();
        for (int i = 0; i < size; i++) {
            DataTable1_11 dataTable1_11 = dataList.get(i);
            for (int j = DATA_START_ROW_NUM; j <= DATA_END_ROW_NUM; j++) {
                BigDecimal value = getDoubleDataByRowIndex(dataTable1_11, j);
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
    public static List<DataTable1_11> mergeAndSumByDate(List<DataTable1_11> dataList) {
        if (CollectionUtils.isEmpty(dataList)) {
            return Collections.EMPTY_LIST;
        }
        Map<String, DataTable1_11> map = new HashMap<>();
        for (DataTable1_11 dataTable1_11 : dataList) {
            if (map.containsKey(dataTable1_11.getNatuDate())) {
                map.put(dataTable1_11.getNatuDate(), addData(map.get(dataTable1_11.getNatuDate()), dataTable1_11));
            } else {
                map.put(dataTable1_11.getNatuDate(), dataTable1_11);
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
    private static DataTable1_11 addData(DataTable1_11 data1, DataTable1_11 data2) {
        if (data1 == null) {
            return data2;
        }
        if (data2 == null) {
            return data1;
        }
        data1.setL1(DecimalTool.add(data1.getL1(), data2.getL1()));
        data1.setL2(DecimalTool.add(data1.getL2(), data2.getL2()));
        data1.setL3(DecimalTool.add(data1.getL3(), data2.getL3()));
        data1.setL4(DecimalTool.add(data1.getL4(), data2.getL4()));
        data1.setL5(DecimalTool.add(data1.getL5(), data2.getL5()));
        data1.setL6(DecimalTool.add(data1.getL6(), data2.getL6()));
        data1.setL7(DecimalTool.add(data1.getL7(), data2.getL7()));
        data1.setL8(DecimalTool.add(data1.getL8(), data2.getL8()));
        data1.setL9(DecimalTool.add(data1.getL9(), data2.getL9()));
        data1.setL10(DecimalTool.add(data1.getL10(), data2.getL10()));
        data1.setL11(DecimalTool.add(data1.getL11(), data2.getL11()));
        data1.setL12(DecimalTool.add(data1.getL12(), data2.getL12()));
        data1.setL13(DecimalTool.add(data1.getL13(), data2.getL13()));
        data1.setL14(DecimalTool.add(data1.getL14(), data2.getL14()));
        data1.setL15(DecimalTool.add(data1.getL15(), data2.getL15()));
        data1.setL16(DecimalTool.add(data1.getL16(), data2.getL16()));
        data1.setL17(DecimalTool.add(data1.getL17(), data2.getL17()));
        data1.setL18(DecimalTool.add(data1.getL18(), data2.getL18()));
        data1.setL19(DecimalTool.add(data1.getL19(), data2.getL19()));
        data1.setL20(DecimalTool.add(data1.getL20(), data2.getL20()));
        data1.setL21(DecimalTool.add(data1.getL21(), data2.getL21()));
        data1.setL22(DecimalTool.add(data1.getL22(), data2.getL22()));
        data1.setL23(DecimalTool.add(data1.getL23(), data2.getL23()));
        data1.setL24(DecimalTool.add(data1.getL24(), data2.getL24()));
        data1.setL25(DecimalTool.add(data1.getL25(), data2.getL25()));
        data1.setL26(DecimalTool.add(data1.getL26(), data2.getL26()));
        data1.setZ1(DecimalTool.add(data1.getZ1(), data2.getZ1()));
        data1.setZ101(DecimalTool.add(data1.getZ101(), data2.getZ101()));
        data1.setZ102(DecimalTool.add(data1.getZ102(), data2.getZ102()));
        return data1;
    }
    
    /**
     * 获取数据
     *
     * @param dataTable1_11 数据
     * @param index        下标
     * @return
     */
    public static BigDecimal getDoubleDataByRowIndex(DataTable1_11 dataTable1_11, int index) {
        switch (index) {
            case 4:
                return dataTable1_11.getL1();
            case 5:
                return dataTable1_11.getL2();
            case 6:
                return dataTable1_11.getL3();
            case 7:
                return new BigDecimal("0");
            case 8:
                return dataTable1_11.getL4();
            case 9:
                return dataTable1_11.getL5();
            case 10:
                return dataTable1_11.getL6();
            case 11:
                return dataTable1_11.getL7();
            case 12:
                return dataTable1_11.getL8();
            case 13:
                return dataTable1_11.getL9();
            case 14:
                return dataTable1_11.getL10();
            case 15:
                return dataTable1_11.getL11();
            case 16:
                return dataTable1_11.getL12();
            case 17:
                return dataTable1_11.getL13();
            case 18:
                return dataTable1_11.getL14();
            case 19:
                return dataTable1_11.getL15();
            case 20:
                return dataTable1_11.getL16();
            case 21:
                return dataTable1_11.getL17();
            case 22:
                return dataTable1_11.getL18();
            case 23:
                return dataTable1_11.getL19();
            case 24:
                return dataTable1_11.getL20();
            case 25:
                return dataTable1_11.getZ1();
            case 26:
                return dataTable1_11.getZ101();
            case 27:
                return dataTable1_11.getZ102();
            case 28:
                return new BigDecimal("0");
            case 29:
                return new BigDecimal("0");
            case 30:
                return dataTable1_11.getL21();
            case 31:
                return new BigDecimal("0");
            case 32:
                return dataTable1_11.getL22();
            case 33:
                return dataTable1_11.getL23();
            case 34:
                return dataTable1_11.getL24();
            default:
                return new BigDecimal("0");
        }
    }

    public static void main(String[] args) {
        List<DataTable1_11> dataList = new ArrayList<>();

        for (int i = 0; i <= 30; i++) {
            DataTable1_11 dataTable1_11 = new DataTable1_11();
            dataList.add(dataTable1_11);
        }
        try {
            File file = createExcelFile("d:/template_1_11.xls", "table_1_11.xls", "钱袋宝", "201610", "20161116", "许丽丽", "刘仁超", dataList);
            System.out.println(file.getPath());
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
