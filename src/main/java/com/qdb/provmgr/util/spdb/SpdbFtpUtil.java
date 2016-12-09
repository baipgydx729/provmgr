package com.qdb.provmgr.util.spdb;

import java.io.IOException;

import org.apache.commons.net.ftp.FTPClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SpdbFtpUtil {

	private static Logger log = LoggerFactory.getLogger(SpdbFtpUtil.class);

	public static FTPClient getConnection(String ip, int port, String username, String password) {

		FTPClient ftp = new FTPClient();
		ftp.setControlEncoding("utf-8");
		boolean login = false;
		try {
			ftp.connect(ip, port);
			login = ftp.login(username, password);
		} catch (IOException e) {
			log.error("-------------------ftp服务器连接失败");
			return null;
		}
		// 此处不需要再调用 FTPReply.isPositiveCompletion(reply)，具体查看源代码
		if (!login) {
			return null;
		}
		return ftp;
	}
	
	
	/**
	 * 关闭ftp连接
	 * @param ftp
	 */
	public static void close(FTPClient ftp){
		if(ftp != null && ftp.isConnected()){
			try {
				ftp.disconnect();
			} catch (IOException e) {
				log.error("----------------ftp 关闭断开连接错误");
			}
		}
	}

}
