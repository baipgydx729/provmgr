package com.qdb.provmgr.util.spdb;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.zip.CRC32;
import java.util.zip.CheckedOutputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import com.qdb.provmgr.report.spdb.SpdbConstant;

public class SpdbZipUtil {
	
static final int BUFFER = 10240;     
    
  
    public static void compress(String source, String target) {  
    	File file = new File(source);
    	if (!file.exists()) {     
            return;     
        }     
        ZipOutputStream out = null;     
        try {    
            FileOutputStream fileOutputStream = new FileOutputStream(target);     
            CheckedOutputStream cos = new CheckedOutputStream(fileOutputStream,     
                    new CRC32());     
            out = new ZipOutputStream(cos);     
            String basedir = "";   
            compress(new File(source), out, basedir);     
            out.close();    
        } catch (Exception e) {     
            throw new RuntimeException(e);     
        }   
    }     
 
    
    private static void compress(File file, ZipOutputStream out, String basedir) {  
        /* 判断是目录还是文件 */    
        if (file.isDirectory()) {     
            compressDirectory(file, out, basedir);     
        } else {     
            compressFile(file, out, basedir);     
        }     
    }     
    
    /** 压缩一个目录 */    
    private static void compressDirectory(File dir, ZipOutputStream out, String basedir) {     
        if (!dir.exists())     
            return;     
    
        File[] files = dir.listFiles();     
        for (int i = 0; i < files.length; i++) {     
            /* 递归 */    
            compress(files[i], out, basedir + dir.getName() + SpdbConstant.SYSTEM_PATH_SEPARATOR);
        }     
    }     
    
    /** 压缩一个文件 */    
    private static void compressFile(File file, ZipOutputStream out, String basedir) {     
        try {     
            BufferedInputStream bis = new BufferedInputStream(     
                    new FileInputStream(file));     
            ZipEntry entry = new ZipEntry(basedir + file.getName());     
            out.putNextEntry(entry);     
            int count;     
            byte data[] = new byte[BUFFER];     
            while ((count = bis.read(data, 0, BUFFER)) != -1) {     
                out.write(data, 0, count);     
            }     
            bis.close();     
        } catch (Exception e) {     
            throw new RuntimeException(e);     
        }     
    }     

}
