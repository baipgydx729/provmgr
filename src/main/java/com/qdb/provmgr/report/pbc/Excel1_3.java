package com.qdb.provmgr.report.pbc;

import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.ss.util.CellRangeAddress;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.qdb.provmgr.dao.entity.report.BaseReportEntity;
import com.qdb.provmgr.dao.entity.report.DataTable1_3;
import com.qdb.provmgr.report.ReportExcelUtil;
import com.qdb.provmgr.report.PresetContent;
import com.qdb.provmgr.util.BigDecimalUtil;

/**
 * @author mashengli
 */
public class Excel1_3 extends ReportExcelUtil {

    private static Logger log = LoggerFactory.getLogger(Excel1_3.class);

    /**
     * 数据起始行数下标（下标从0开始）
     */
    private static int DATA_START_ROW_NUM = 5;

    /**
     * 数据起始列数下标（下标从0开始）
     */
    private static int DATA_START_COLUMN_NUM = 4;

    @Override
    public void writeData(HSSFSheet sheet, PresetContent presetContent, List<BaseReportEntity> dataList) {
        Map<String, LinkedHashMap> dataMap = convertData(dataList);
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

        //填充交易时期、填报日期、填表人及审核人
        sheet.getRow(0).createCell(1).setCellValue(presetContent.getCompanyName());
        sheet.getRow(1).createCell(1).setCellValue(presetContent.getTranPeriod());
        sheet.getRow(2).createCell(1).setCellValue(presetContent.getReportDate());

        HSSFRow secondLastRow = sheet.createRow(DATA_START_ROW_NUM + countAccount + 1);
        secondLastRow.createCell(0).setCellValue("填表人（填写在本行B列）");
        secondLastRow.getCell(0).setCellStyle(sheet.getRow(0).getCell(0).getCellStyle());
        secondLastRow.createCell(1).setCellValue(presetContent.getReportUserName());

        HSSFRow lastRow = sheet.createRow(DATA_START_ROW_NUM + countAccount + 2);
        lastRow.createCell(0).setCellValue("复核人（填写在本行B列）");
        lastRow.getCell(0).setCellStyle(sheet.getRow(0).getCell(0).getCellStyle());
        lastRow.createCell(1).setCellValue(presetContent.getCheckUserName());
    }

    /**
     * 数据转化
     * @param dataList 源列表数据
     * @return
     */
    private Map<String, LinkedHashMap> convertData(List<BaseReportEntity> dataList) {
        Map<String, LinkedHashMap> resultMap = new HashMap<>();
        //按照日期进行排序
        Collections.sort(dataList);
        //合计数据，计算各个账户同一天累加的数据,只填数据
        LinkedHashMap<String, Double> totalMap = new LinkedHashMap<>();

        for (BaseReportEntity baseReportEntity : dataList) {
            DataTable1_3 data = (DataTable1_3) baseReportEntity;
            double cvalue = null != data.getC01() ? data.getC01().doubleValue() : 0;
            if (totalMap.containsKey(data.getNatuDate())) {
                double newValue = BigDecimalUtil.add(totalMap.get(data.getNatuDate()), cvalue);
                totalMap.put(data.getNatuDate(), newValue);
            } else {
                totalMap.put(data.getNatuDate(), cvalue);
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
                row.put(data.getNatuDate(), cvalue);
                resultMap.put(data.getName(), row);
            }
        }
        resultMap.put("total", totalMap);
        return resultMap;
    }
}
