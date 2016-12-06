package com.qdb.provmgr.report.pbc;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;

import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.util.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.qdb.provmgr.dao.TableModeEnum;
import com.qdb.provmgr.dao.entity.report.BaseReportEntity;
import com.qdb.provmgr.report.PresetContent;
import com.qdb.provmgr.util.FileUtil;
import com.qdb.provmgr.util.POIUtil;

/**
 * @author mashengli
 */
public class PbcExcelUtil {

    private static Logger log = LoggerFactory.getLogger(PbcExcelUtil.class);

    public static File createExcelFile(TableModeEnum tableMode, String templateFile, String targetFileName, PresetContent presetContent, List<BaseReportEntity> dataList) throws Exception {
        File tempFile = FileUtil.createTempFile(targetFileName);
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

            //填写数据
            writeData(tableMode, sheetOut, presetContent, dataList);

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

    public static void writeData(TableModeEnum tableMode, HSSFSheet sheet, PresetContent presetContent, List<BaseReportEntity> dataList) {
        if (TableModeEnum.Table1_1.equals(tableMode)) {
            Excel1_1.writeData(sheet, presetContent, dataList);
            return;
        }
        if (TableModeEnum.Table1_1_2.equals(tableMode)) {
            Excel1_1_2.writeData(sheet, presetContent, dataList);
            return;
        }
        if (TableModeEnum.Table1_2.equals(tableMode)) {
            Excel1_2.writeData(sheet, presetContent, dataList);
            return;
        }
        if (TableModeEnum.Table1_2_1.equals(tableMode)) {
            Excel1_2_1.writeData(sheet, presetContent, dataList);
            return;
        }
        if (TableModeEnum.Table1_3.equals(tableMode)) {
            Excel1_3.writeData(sheet, presetContent, dataList);
            return;
        }
        if (TableModeEnum.Table1_4.equals(tableMode)) {
            Excel1_4.writeData(sheet, presetContent, dataList);
            return;
        }
        if (TableModeEnum.Table1_5.equals(tableMode)) {
            Excel1_5.writeData(sheet, presetContent, dataList);
            return;
        }
        if (TableModeEnum.Table1_6.equals(tableMode)) {
            Excel1_6.writeData(sheet, presetContent, dataList);
            return;
        }
        if (TableModeEnum.Table1_6_2.equals(tableMode)) {
            Excel1_6_2.writeData(sheet, presetContent, dataList);
            return;
        }
        if (TableModeEnum.Table1_9.equals(tableMode)) {
            Excel1_9.writeData(sheet, presetContent, dataList);
            return;
        }
        if (TableModeEnum.Table1_9_2.equals(tableMode)) {
            Excel1_9_2.writeData(sheet, presetContent, dataList);
            return;
        }
        if (TableModeEnum.Table1_10.equals(tableMode)) {
            ReportHelper.writeData(sheet, presetContent, dataList);
            return;
        }
        if (TableModeEnum.Table1_10_2.equals(tableMode)) {
            Excel1_10_2.writeData(sheet, presetContent, dataList);
            return;
        }
        if (TableModeEnum.Table1_11.equals(tableMode)) {
            Excel1_11.writeData(sheet, presetContent, dataList);
            return;
        }
        if (TableModeEnum.Table1_12.equals(tableMode)) {
            Excel1_12.writeData(sheet, presetContent, dataList);
            return;
        }
        if (TableModeEnum.Table1_13.equals(tableMode)) {
            Excel1_13.writeData(sheet, presetContent, dataList);
        }
    }
}
