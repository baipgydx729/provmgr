package com.qdb.provmgr.report.ccb;

import net.sf.jxls.transformer.XLSTransformer;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Workbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
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

/**
 * Created by yuwenzhong on 2016-11-23.
 */
public class ExcelUtils {

    private static Logger logger = LoggerFactory.getLogger(ExcelUtils.class);

    private static final String DATAKEY = "data_list";

    //每个sheet最大行数
    private static final int MAXROWS = 50;

    //按月份到处excel表格
    public static void excelDownLoad(HttpServletRequest request, HttpServletResponse response,
                                     List dataList, String sheetName, String tempRelativePath,
                                     String destFileName, Map<String, Object> map) throws InvalidFormatException, IOException {

        String sep = System.getProperty("file.separator");
        String realPath = request.getServletContext().getRealPath("/WEB-INF/");
        String excelTemplatePath = realPath + sep + tempRelativePath;

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
            logger.error("**********下载报表{}出现异常, 异常信息:{}",  destFileName  + e.getMessage());
            throw e;
        } catch (IOException e) {
            logger.error("**********下载报表{}出现异常, 异常信息:{}",  destFileName  + e.getMessage());
            throw e;
        } catch (Exception e){
            logger.error("**********下载报表{}出现异常, 异常信息:{}",  destFileName  + e.getMessage());
            throw e;
        }finally {
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
     * @param dataList
     * @param sheetName
     * @param tempRelativePath
     * @param destExcelPath
     * @param map
     * @throws InvalidFormatException
     * @throws IOException
     */
    public static void createExcel(HttpServletRequest request, List dataList, String sheetName, String tempRelativePath,
                                   String destExcelPath, Map<String, Object> map) throws InvalidFormatException, IOException {
        String sep = System.getProperty("file.separator");
        String realPath = request.getServletContext().getRealPath("/WEB-INF/");
        String excelTemplatePath = realPath + sep + tempRelativePath;


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
            logger.error("**********生成报表{}出现异常, 异常信息:{}",  destExcelPath, e.getMessage());
            throw e;
        } catch (IOException e) {
            logger.error("**********生成报表{}出现异常, 异常信息:{}",  destExcelPath, e.getMessage());
            throw e;
        } catch (Exception e){
            logger.error("**********生成报表{}出现异常, 异常信息:{}",  destExcelPath, e.getMessage());
            throw e;
        }finally {
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
     * 下载,不重新生成文件,而是读取已存在的文件
     * @param request
     * @param response
     * @param filePath
     * @param destFileName
     * @throws InvalidFormatException
     * @throws IOException
     */
    public static void downloadZip(HttpServletRequest request, HttpServletResponse response, String filePath, String destFileName) throws InvalidFormatException, IOException {
        InputStream is = null;
        OutputStream os = null;
        try {
            String sep = System.getProperty("file.separator");
            filePath = filePath.endsWith(sep)? filePath + destFileName : filePath + sep + destFileName;
            File tempFile = new File(filePath);
            is = new FileInputStream(tempFile);
            os = response.getOutputStream();

            // 设置response的编码方式
            response.setHeader("Cache-Control", "private");
            response.setHeader("Pragma", "private");
            response.setContentType("application/octet-stream;charset=utf-8");
            response.setHeader("Content-Type", "application/force-download");

            // 解决中文乱码
            destFileName = processFileName(request, destFileName);
            response.setHeader("Content-Disposition", "attachment;filename=" + destFileName);

            byte[] buffer = new byte[1024];
            int r;
            while ((r= is.read(buffer)) != -1){
                os.write(buffer, 0, r);
            }
            // 将写入到客户端的内存的数据刷新到磁盘
        } catch (IOException e) {
            logger.error("**********下载报表{}出现异常, 异常信息:{}", destFileName, e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("**********下载报表{}出现异常, 异常信息:{}", destFileName, e.getMessage());
            throw e;
        } finally {
            if (os != null) {
                try {
                    os.close();
                } catch (IOException e) {
                    logger.error(e.getMessage());
                }
            }
            if (is != null) {
                try {
                    is.close();
                } catch (IOException e) {
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
