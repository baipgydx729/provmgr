package com.qdb.provmgr.service.spdb;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.qdb.provmgr.constant.spdb.Constant;
import com.qdb.provmgr.dao.model.spdb.eum.BankCodeEnum;
import com.qdb.provmgr.dao.model.spdb.eum.TableEnum;
import com.qdb.provmgr.util.FTPUtil;

@Service
public class SpdbFtpService {
	
	private static Logger log = LoggerFactory.getLogger(SpdbFtpService.class);
	
	@Value("${ftp.ip}")
	private String ip;
	@Value("${ftp.port}")
	private int port;
	@Value("${ftp.user}")
	private String userName;
	@Value("${ftp.pwd}")
	private String password;
	
	
	@Value("${spdb.ftp.path}")
	private String spdbFtpPath;
	@Value("${js.ftp.path}")
	private String jSFtpPath;
	@Value("${spdb.temp.path}")
	private String spdbTempPath;
	
	private String ftpPath;
	
	
	public String getFtpPath() {
		return ftpPath;
	}

	public void setFtpPath(String ftpPath) {
		this.ftpPath = ftpPath;
	}

	public String getjSFtpPath() {
		return jSFtpPath;
	}

	public void setjSFtpPath(String jSFtpPath) {
		this.jSFtpPath = jSFtpPath;
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public int getPort() {
		return port;
	}

	public void setPort(int port) {
		this.port = port;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getSpdbTempPath() {
		return spdbTempPath;
	}

	public String getSpdbFtpPath() {
		return spdbFtpPath;
	}

	/**
	 * 获取ftp
	 * @return
	 */
	public FTPClient getFtpConnection(){
		FTPClient ftp = new FTPClient();
		ftp.setControlEncoding("utf-8");
		boolean login = false;
		try {
			ftp.connect(ip, port);
			login = ftp.login(userName, password);
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
	public  void close(FTPClient ftp){
		if(ftp != null && ftp.isConnected()){
			try {
				ftp.disconnect();
			} catch (IOException e) {
				log.error("----------------ftp 关闭断开连接错误");
			}
		}
	}
	
	public void turn(String bankName){
		if(BankCodeEnum.JIANGSU.getBankName().equals(bankName)){
			ftpPath = jSFtpPath;
		}else if(BankCodeEnum.PUFA.getBankName().equals(bankName)){
			ftpPath = spdbFtpPath;
		}else{
			return;
		}
	}
	
	/**
	 * 获取报表状态：是否生成
	 * @param dirName
	 * @return	date  yyyyMMdd 日期
	 * @throws IOException
	 */
	public Map<String, String> listTableStatus(String bankName,String dirName,String date) throws IOException{
		turn(bankName);
		FTPClient ftp = getFtpConnection();
		Map<String, String> tableStatus = null;
		if(ftp != null){
			tableStatus = new LinkedHashMap<>();
			boolean dirIsExist = dirIsExist(ftp, ftpPath, dirName);
			if(!dirIsExist){
				for(TableEnum table: TableEnum.values()){
					tableStatus.put(table.getKey(), "0");
				}
				
			}else{
				for(TableEnum table: TableEnum.values()){
					String fileRegex = table.getKey() + "_" + date;
					boolean fileIsExist = fileIsExist(ftp, ftpPath + dirName, fileRegex);
					if(fileIsExist){
						tableStatus.put(table.getKey(), "1");
					}else{
						tableStatus.put(table.getKey(), "0");
					}
				}
			}
			
			FTPUtil.close(ftp);
		}
		return tableStatus;
	}
	
	
	/**
	 * 上传文件到ftp服务器
	 * @param dir		 仅仅文件夹名字
	 * @param fileName   仅仅文件名字（ftp端）
	 * @param localPath  待上传全路径文件
	 * @return
	 * @throws IOException
	 */
	public boolean uploadFileToFtp(String bankName,String localFile, String timeDir, String fileName,String preffix)throws IOException {
		turn(bankName);
		FTPClient ftp = getFtpConnection();
		boolean success = false;
		if(ftp != null){
			boolean dirIsExist = dirIsExist(ftp, ftpPath, timeDir);
			if(!dirIsExist){
				//文件夹不存在创建文件夹
				boolean dirSuccess = ftp.makeDirectory(ftpPath + timeDir);
				//ftp.deleteFile(spdbFtpPath + timeDir + Constant.SYSTEM_PATH_SEPARATOR + fileName);
				if(!dirSuccess){
					return false;
				}
			}else{
				FTPFile[] ftpFiles = ftp.listFiles(ftpPath + timeDir);
				for(FTPFile ftpFile : ftpFiles){
					if(ftpFile != null && ftpFile.isFile()){
//						Matcher matcher = pattern.matcher(ftpFile.getName());
						boolean fileExist = ftpFile.getName().startsWith(preffix + "_") && ftpFile.getName().endsWith(".dat");
						if(fileExist){
							boolean dele = ftp.deleteFile(ftpPath + timeDir +Constant.SYSTEM_PATH_SEPARATOR + ftpFile.getName());
							if(!dele){
								return false;
							}
						}
					}
				}
				
			}
			InputStream in = new FileInputStream(new File(localFile));
			try {
				success = ftp.storeFile(ftpPath + timeDir + Constant.SYSTEM_PATH_SEPARATOR + fileName, in);
			} catch (IOException e) {
				return false;
			}finally{
				if(in != null){
					in.close();
				}
			}
			close(ftp);
		}
		return success;
	}
	
	/**
	 * 下载文件
	 * @param dir
	 * @param fileNamePreffix
	 * @return
	 * @throws Exception 
	 */
	public InputStream downLoad(String bankName,String dir, String fileName) throws Exception{
		turn(bankName);
		InputStream in = null;
		FTPClient ftp = getFtpConnection();
		if(fileName != null){
			try {
				in = ftp.retrieveFileStream(ftpPath + dir + Constant.SYSTEM_PATH_SEPARATOR + fileName);
			} catch (IOException e) {
				log.error("-------获取{}文件ftp输入流失败-------",fileName);
				return in;
			}
		}else{
			log.error("找不到{}文件",fileName);
			throw new Exception("文件不存在或者文件已被删除");
		}
		return in;
	}
	
	public String getFileName(String bankName,FTPClient ftp, String dir, String fileType, String date){
		turn(bankName);
		String fileKey = null;
		for(TableEnum table: TableEnum.values()){
			if(table.getProvTable().equals(fileType)){
				fileKey = table.getKey();
				break;
			}
		}
		FTPFile[] ftpFiles = null;
		String fileName = null;
		try {
			ftpFiles = ftp.listFiles(ftpPath + dir);
		} catch (IOException e) {
			log.error("获取文件名称失败");
			return fileName;
		}
		for(FTPFile ftpFile : ftpFiles){
			if(ftpFile != null && ftpFile.isFile()){
				boolean is = ftpFile.getName().startsWith(fileKey + "_" + date) && ftpFile.getName().endsWith(".dat");
				if(is){
					fileName = ftpFile.getName();
					break;
				}
			}
		}
		return fileName;
	}
	
	/**
	 * 判断文件夹或者文件是否存在
	 * @return
	 * @throws IOException 
	 */
	public  boolean dirIsExist(FTPClient ftp, String parentPath, String dirName) throws IOException {
		boolean exist = false;
		FTPFile[] ftpFiles = ftp.listDirectories(parentPath);
		for(FTPFile ftpFile : ftpFiles){
			if(ftpFile.getName().equals(dirName)){
				exist = true;
			}
		}
		return exist;
	}
	
	/**
	 * 判断文件是否存在
	 * @param ftp
	 * @param path
	 * @param fileRegex    文件名正则表达式 
	 * @return
	 * @throws IOException 
	 */
	public  boolean fileIsExist(FTPClient ftp, String parentPath, String fileRegex) throws IOException{
		boolean exist = false;
		FTPFile[] ftpFiles = ftp.listFiles(parentPath);
		for(FTPFile ftpFile : ftpFiles){
			if(ftpFile != null && ftpFile.isFile()){
				boolean is = ftpFile.getName().startsWith(fileRegex) && ftpFile.getName().endsWith(".dat");
				if(is){
					return true;
				}
			}
		}
		return exist; 
	}
	
	/**
	 * 
	 * @param remote
	 * @param local
	 * @return
	 */
	public boolean getFtpFileToLocal(String bankName,String remote, String local){
		turn(bankName);
		FTPClient ftp = getFtpConnection();
		boolean cd = false;
		try {
			cd = ftp.changeWorkingDirectory(ftpPath + remote);
		} catch (IOException e) {
			log.info("全部下载时ftp上不存在此路径:{}",ftpPath + remote);
			return false;
		}
		if(!cd){
			return false;
		}
		FTPFile[] files = null;
		OutputStream out = null;
		try {
			files = ftp.listFiles();
			for(FTPFile file : files){
				if(file.isFile()){
					out = new FileOutputStream(local + file.getName());
					ftp.retrieveFile(ftpPath + remote + Constant.SYSTEM_PATH_SEPARATOR + file.getName(),out);
				}
			}
		} catch (IOException e) {
			log.error("从ftp上获取文件到本地时出错");
			return false;
		}finally {
			if(out != null){
				try {
					out.close();
				} catch (IOException e) {
					log.error("输出流关闭出错");
				}
			}
		}
		close(ftp);
		return true;
	}
	

}
