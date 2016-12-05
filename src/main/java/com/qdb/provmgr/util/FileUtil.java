package com.qdb.provmgr.util;

import java.io.File;
import java.util.UUID;

/**
 * @author mashengli
 */
public class FileUtil {

    /**
     * 在系统临时目录创建excel文件
     * @param fileName 文件名
     * @return 文件
     */
    public static File createTempFile(String fileName) {
        File file = new File(System.getProperty("java.io.tmpdir") + File.separator + UUID.randomUUID().toString() + File.separator + fileName);
        if (!file.getParentFile().exists()) {
            file.getParentFile().mkdir();
        }
        return file;
    }

    /**
     * 获取临时文件路径
     * @param fileName 文件名
     * @return
     */
    public static String getTempFilePath(String fileName) {
        return System.getProperty("java.io.tmpdir") + File.separator + UUID.randomUUID().toString() + File.separator + fileName;
    }

    /**
     * 获取系统临时文件目录
     * @return
     */
    public static String getTempPath() {
        return System.getProperty("java.io.tmpdir") + File.separator + UUID.randomUUID().toString() + File.separator ;
    }

}
