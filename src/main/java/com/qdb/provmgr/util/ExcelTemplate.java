package com.qdb.provmgr.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.util.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import net.sf.jxls.transformer.XLSTransformer;

/**
 * @author mashengli
 */
public class ExcelTemplate {

    private static Logger logger = LoggerFactory.getLogger(ExcelTemplate.class);

    static final String DATAKEY = "data_list";

    //每个sheet最大行数
    static final int MAXROWS = 100;

    /**
     * 根据excel模板创建表格
     * @param templateFilePath 模板文件路径
     * @param targetFilePath 目标文件路径
     * @param sheetName sheet
     * @param dataList 数据
     * @param map 其他数据
     * @throws IOException
     */
    public static void createExcel(String templateFilePath, String targetFilePath, String sheetName, List dataList, Map<String, Object> map) throws InvalidFormatException, IOException {
        InputStream is = null;
        OutputStream os = null;
        XLSTransformer transformer = new XLSTransformer();
        Workbook workbook = null;
        try {
            File tempFile = new File(templateFilePath);
            File destFile = new File(targetFilePath);
            try {
                destFile.deleteOnExit();
                destFile.createNewFile();
            } catch (Exception ignored) {}
            is = new FileInputStream(tempFile);
            os = new FileOutputStream(destFile);

            List<List<Object>> splitDateList = new ArrayList<>();
            List<String> sheetNameList = new ArrayList<>();
            createSplitDataList(dataList, splitDateList, sheetName, sheetNameList);
            workbook = transformer.transformMultipleSheetsList(is, splitDateList, sheetNameList, DATAKEY, map, 0);
            workbook.write(os);
            // 将写入到客户端的内存的数据刷新到磁盘
            os.flush();
        } catch (InvalidFormatException | IOException e) {
            logger.error("创建excel异常", e);
            throw e;
        } finally {
            IOUtils.closeQuietly(is);
            IOUtils.closeQuietly(os);
        }
    }

    /**
     * 封装分sheet的数据
     * @param dataList
     * @param splitDataList
     * @param sheetName
     * @param sheetNameList
     */
    private static void createSplitDataList(List<Object> dataList, List<List<Object>> splitDataList, String
            sheetName, List<String> sheetNameList) {
        int total = dataList.size();
        int sheetNum = total / MAXROWS;
        if (total % MAXROWS != 0) {
            sheetNum++;
        }

        for (int i = 0; i < sheetNum; i++) {
            List<Object> sheetDataList = new ArrayList();
            for (int j = 0; j < MAXROWS; j++) {
                int index = i * MAXROWS + j;
                if (index == total) {
                    break;
                }
                Object obj = dataList.get(index);
                sheetDataList.add(obj);
            }
            splitDataList.add(sheetDataList);
            sheetNameList.add(sheetName + (i + 1));
        }
    }
}
