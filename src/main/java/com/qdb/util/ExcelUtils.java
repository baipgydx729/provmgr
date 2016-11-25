package com.qdb.util;

import net.sf.jxls.transformer.XLSTransformer;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Workbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;
import java.util.Map;

/**
 * Created by yuwenzhong on 2016-11-23.
 */
public class ExcelUtils {

    private static Logger logger = LoggerFactory.getLogger(ExcelUtils.class);

    private static  final String DATAKEY = "data_list";

    @Value("#{propertyConfigurer['excel.template.path']}")
    private static String templatePath;

    //按月份到处excel表格
    public static void excelDownByMonth(HttpServletRequest request, HttpServletResponse response,
                          List dataList, List<String> sheetNames, String templateName,
                          String destFileName, Map<String, Object> map, int daysOfMonth){

        String sep = System.getProperty("file.separator");
        String realPath = request.getServletContext().getRealPath("/WEB-INF/");
        String excelTemplatePath = realPath + sep + templatePath + sep + templateName;
        String destExcelPath = System.getProperty("java.io.tmpdir") + sep + destFileName;

        InputStream is = null;
        OutputStream os = null;

        XLSTransformer transformer = new XLSTransformer();
        Workbook workbook = null;

        try {
            File tempFile = new File(excelTemplatePath);
            File destFile = new File(destExcelPath);
            if(!destFile.exists()){
                destFile.createNewFile();
            }
            is = new FileInputStream(tempFile);
            os = new FileOutputStream(destFile);

            workbook = transformer.transformMultipleSheetsList(is, dataList, sheetNames, DATAKEY, map, 0);
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
    private String processFileName(HttpServletRequest request, String fileNames) {
        String codedfilename = null;
        try {
            String agent = request.getHeader("USER-AGENT");
            if (null != agent && -1 != agent.indexOf("MSIE") || null != agent
                    && -1 != agent.indexOf("Trident")) {// ie

                String name = java.net.URLEncoder.encode(fileNames, "UTF8");

                codedfilename = name;
            } else if (null != agent && -1 != agent.indexOf("Mozilla")) {// 火狐,chrome等


                codedfilename = new String(fileNames.getBytes("UTF-8"), "iso-8859-1");
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return codedfilename;
    }

}
