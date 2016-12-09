package com.qdb.provmgr.util.spdb;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by fanjunjian on 2016/11/10.
 */
public class SpdbFileUtil {
	private static Logger log = LoggerFactory.getLogger(SpdbFileUtil.class);
    /**
     * 将数据写入文件
     * @param filePath  文件全路径
     * @param content    写入内容
     * @throws IOException 
     * @throws Exception 
     */
    public static void writeToFile(String filePath, String content) throws IOException {

        File file = new File(filePath);
        if(file.exists()){
            return;
        }
        FileWriter fw = null;
        BufferedWriter bw = null;
        try {
            fw = new FileWriter(file,true);
            bw = new BufferedWriter(fw);
            bw.write(content);
        } catch (IOException e) {
            throw new IOException(e);
        }finally {
        	if(bw != null){
        		try {
					bw.close();
				} catch (IOException e) {
					log.error("处理流关闭失败。");
				}
        	}
        }

    }
   




}
