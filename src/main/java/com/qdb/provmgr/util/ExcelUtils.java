package com.qdb.provmgr.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Workbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import net.sf.jxls.transformer.XLSTransformer;

/**
 * Created by yuwenzhong on 2016-11-23.
 */
public class ExcelUtils {

    private static Logger logger = LoggerFactory.getLogger(ExcelUtils.class);

    private static final String DATAKEY = "data_list";

    //每个sheet最大行数
    private static final int MAXROWS = 31;

//    @Value("${excel.template.path}")
    private static String templatePath = "excelTemplate";


    //按月份到处excel表格
    public static void excelDownLoad(HttpServletRequest request, HttpServletResponse response,
                          List dataList, String sheetName, String bankType, String templateName,
                          String destFileName, Map<String, Object> map){

        String sep = System.getProperty("file.separator");
        String realPath = request.getServletContext().getRealPath("/WEB-INF/");
        String excelTemplatePath = realPath + sep + templatePath + sep + bankType + sep + templateName;
        String destExcelPath = System.getProperty("java.io.tmpdir") + sep + destFileName;

        InputStream is = null;
        OutputStream os = null;

        XLSTransformer transformer = new XLSTransformer();
        Workbook workbook;

        try {
            File tempFile = new File(excelTemplatePath);
            is = new FileInputStream(tempFile);
            os = response.getOutputStream();

            // 设置response的编码方式
            response.setHeader("Cache-Control", "private");
            response.setHeader("Pragma", "private");
            response.setContentType("application/vnd.ms-excel;charset=utf-8");
            response.setHeader("Content-Type", "application/force-download");

            // 解决中文乱码
            destFileName = processFileName(request, destFileName);
            response.setHeader("Content-Disposition", "attachment;filename=" + destFileName);

            List<List<Object>> splitDateList = new ArrayList<>();
            List<String> sheetNameList = new ArrayList<>();
            createSplitDataList(dataList, splitDateList, sheetName, sheetNameList);

            workbook = transformer.transformMultipleSheetsList(is, splitDateList, sheetNameList, DATAKEY, map, 0);
            workbook.write(os);
            // 将写入到客户端的内存的数据刷新到磁盘
            os.flush();
        }catch (InvalidFormatException e) {
            logger.error(e.getMessage());
        } catch (IOException e) {
            logger.error(e.getMessage());
        } finally {
            if(os != null){
                try {
                    os.close();
                }catch (IOException e){
                    logger.error(e.getMessage());
                }
            }
            if(is != null){
                try {
                    is.close();
                }catch (IOException e){
                    logger.error(e.getMessage());
                }
            }
        }
    }

    /**
     * 生成报表
     * @param request
     * @param response
     * @param dataList
     * @param sheetName
     * @param bankType
     * @param templateName
     * @param destFileName
     * @param map
     */
    public static void createExcel(HttpServletRequest request, HttpServletResponse response,
                              List dataList, String sheetName, String bankType, String templateName,
                              String destFileName, Map<String, Object> map){
        String sep = System.getProperty("file.separator");
        String realPath = request.getServletContext().getRealPath("/WEB-INF/");
        String excelTemplatePath = realPath + sep + templatePath + sep + bankType + sep + templateName;
        String destExcelPath = System.getProperty("java.io.tmpdir") + sep + destFileName;

        InputStream is = null;
        OutputStream os = null;

        XLSTransformer transformer = new XLSTransformer();
        Workbook workbook;

        try {
            File tempFile = new File(excelTemplatePath);
            File destFile = new File(destExcelPath);
            if(destFile.exists()){
                destFile.delete();
            }
            is = new FileInputStream(tempFile);
            os = new FileOutputStream(destFile);

            List<List<Object>> splitDateList = new ArrayList<>();
            List<String> sheetNameList = new ArrayList<>();
            createSplitDataList(dataList, splitDateList, sheetName, sheetNameList);
            workbook = transformer.transformMultipleSheetsList(is, splitDateList, sheetNameList, DATAKEY, map, 0);
            workbook.write(os);
            // 将写入到客户端的内存的数据刷新到磁盘
            os.flush();
        }catch (InvalidFormatException e) {
            logger.error(e.getMessage());
        } catch (IOException e) {
            logger.error(e.getMessage());
        } finally {
            if(os != null){
                try {
                    os.close();
                }catch (IOException e){
                    logger.error(e.getMessage());
                }
            }
            if(is != null){
                try {
                    is.close();
                }catch (IOException e){
                    logger.error(e.getMessage());
                }
            }
        }
    }

    /**
     * ie,chrom,firfox下处理文件名显示乱码
     * @param request
     * @param fileNames
     * @return
     */
    public static String processFileName(HttpServletRequest request, String fileNames) {
        String codedFileName = null;
        try {
            String agent = request.getHeader("USER-AGENT");
            if ((null != agent && -1 != agent.indexOf("MSIE")) ||
                (null != agent && -1 != agent.indexOf("Trident"))) {// ie
                codedFileName = URLEncoder.encode(fileNames, "UTF8");
            } else if (null != agent && -1 != agent.indexOf("Mozilla")) {// 火狐,chrome等
                codedFileName = new String(fileNames.getBytes("UTF-8"), "iso-8859-1");
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return codedFileName;
    }

    /**
     * 封装分sheet的数据
     * @param dataList
     * @param splitDataList
     * @param sheetName
     * @param sheetNameList
     */

    public static void createSplitDataList(List<Object> dataList, List<List<Object>> splitDataList, String sheetName, List<String> sheetNameList){
        int total = dataList.size();
        int sheetNum = total / MAXROWS;
        if(total % MAXROWS != 0){
            sheetNum++;
        }

        for (int i = 0; i < sheetNum; i++) {
            List<Object> sheetDataList = new ArrayList();
            for (int j = 0; j < MAXROWS; j++) {
                int index = i * MAXROWS + j;
                if(index == total){
                    break;
                }
                Object obj = dataList.get(index);
                sheetDataList.add(obj);
            }
            splitDataList.add(sheetDataList);
            sheetNameList.add(sheetName +(i+1));
        }
    }
}
