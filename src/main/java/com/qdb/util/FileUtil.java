package com.qdb.util;

import java.io.File;
import java.io.IOException;

/**
 * @author mashengli
 */
public class FileUtil {

    /**
     * 在系统临时目录创建excel文件
     * @param fileName 文件名
     * @return 文件
     */
    public static File getTempExcelFile(String fileName) {
        File file = new File(System.getProperty("java.io.tmpdir") + File.separator + fileName);
        try {
            file.deleteOnExit();
        } catch (Exception ignored) {}
        try {
            file.createNewFile();
        } catch (IOException ignored) {}
        return file;
    }
}
