package com.qdb.provmgr.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPClientConfig;
import org.apache.commons.net.ftp.FTPFile;
import org.apache.commons.net.ftp.FTPReply;
import org.apache.poi.util.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.dubbo.common.utils.StringUtils;

/**
 * @author mashengli
 */
public class FTPUtil {

    private static Logger log = LoggerFactory.getLogger(FTPUtil.class);

    public static final String FTP_FILE_SEPARATOR = "/";

    /**
     * 用户FTP账号登录
     *
     * @param url      FTP地址
     * @param port     FTP端口
     * @param username 用户名
     * @param password 密 码
     * @return true/false 成功/失败
     * @throws IOException
     */
    public static FTPClient login(String url, int port, String username, String password) throws IOException {
        FTPClient ftp = new FTPClient();
        int reply;
        ftp.connect(url, port);
        // 2. 设置编码为UTF-8
        ftp.setControlEncoding("UTF-8");
        FTPClientConfig conf = new FTPClientConfig(FTPClientConfig.SYST_NT);
        conf.setServerLanguageCode("zh");
        ftp.login(username, password);
        reply = ftp.getReplyCode();
        if (!FTPReply.isPositiveCompletion(reply)) {
            ftp.disconnect();
            log.info(">>>>>>>>>>>>>>>>连接服务器失败!");
            return null;
        }
        log.info(">>>>>>>>>>>>>>>>>登陆服务器成功!");
        return ftp;
    }

    /**
     * 释放FTP
     */
    public static void close(FTPClient ftp) {
        if (ftp.isAvailable()) {
            try {
                // 退出FTP
                ftp.logout();
            } catch (IOException e) {
                log.error("FTP登录退出异常:" + e.getMessage());
            }
        }
        if (ftp.isConnected()) {
            try {
                // 断开连接
                ftp.disconnect();
            } catch (IOException e) {
                log.error("FTP断开连接异常:" + e.getMessage());
            }
        }
    }

    private static boolean createAndCdDir(FTPClient ftp, String directory) throws IOException {
        if (StringUtils.isBlank(directory)) {
            return true;
        }
        String[] dirs = directory.split(FTP_FILE_SEPARATOR);
        for (String dir : dirs) {
            //目录不为空，防止出现//分割的目录路径
            if (!StringUtils.isBlank(dir)) {
                //目录不存在则创建
                if (!ftp.changeWorkingDirectory(dir)) {
                    ftp.makeDirectory(dir);
                    ftp.changeWorkingDirectory(dir);
                }
            }
        }
        return true;
    }

    /**
     * FTP单文件上传
     *
     * @param url       FTP地址
     * @param port      FTP端口
     * @param username  FTP用户名
     * @param password  FTP密码
     * @param localPath  上传文件路径
     * @param remotePath 指定的FTP文件路径
     * @return
     */
    public static boolean uploadFile(String url, int port, String username, String password,
                              String localPath, String remotePath) {
        if (StringUtils.isBlank(localPath) || StringUtils.isBlank(remotePath)) {
            log.error("文件路径为空不能上传");
            return false;
        }
        String remoteDir = remotePath.substring(0, remotePath.lastIndexOf(FTP_FILE_SEPARATOR) + 1);
        String remoteFileName = remotePath.substring(remotePath.lastIndexOf(FTP_FILE_SEPARATOR) + 1);
        InputStream input = null;
        FTPClient ftp = null;
        try {
            ftp = login(url, port, username, password);
            if (ftp == null || !ftp.isConnected()) {
                log.error("无法登录，上传失败");
                return false;
            }
            log.info("用户登录成功，准备开始上传文件...");
            // 设置PassiveMode传输
            ftp.enterLocalPassiveMode();
            // 设置FTP文件类型为二进制，如果缺省该句 传输txt正常 但图片和其他格式的文件传输出现乱码
            ftp.setFileType(FTP.BINARY_FILE_TYPE);
            //创建远程文件目录
            if (!createAndCdDir(ftp, remoteDir)) {
                log.error("上传失败，原因是无法创建文件夹");
                return false;
            }
            //执行文件上传
            input = new FileInputStream(new File(localPath));
            boolean success = ftp.storeFile(remoteFileName, input);
            log.info("保存标识>>>" + success + "文件名称:" + localPath + (success ? "上传成功!" :
                    "上传失败!"));
            return success;
        } catch (IOException e) {
            log.error("上传文件异常:" + e.getMessage());
            return false;
        } finally {
            IOUtils.closeQuietly(input);
            close(ftp);
        }
    }

    /**
     * 下载文件到本地路径
     * @param url ftp连接
     * @param port ftp端口号
     * @param username ftp登录名
     * @param password ftp登录密码
     * @param remotePath 远程文件路径（若路径以"/"结尾则视为指向文件夹，此时下载该文件夹下的所有文件；否则视为单文件下载）
     * @param localPath 要下载的本地路径
     * @return
     */
    public static boolean retrieveFile(String url, int port, String username, String password,
                                String remotePath, String localPath) {
        if (StringUtils.isBlank(localPath) || StringUtils.isBlank(remotePath)) {
            log.error("文件路径为空不能上传");
            return false;
        }
        FTPClient ftp = null;
        try {
            ftp = login(url, port, username, password);
            if (ftp == null || !ftp.isConnected()) {
                log.error("无法登录，上传失败");
                return false;
            }
            log.info("用户登录成功，准备开始下载文件...");
            ftp.setFileType(FTPClient.BINARY_FILE_TYPE);

            retrieveFile(ftp, remotePath, localPath);
            return true;
        } catch (IOException e) {
            log.error("下载异常", e);
            return false;
        } finally {
            close(ftp);
        }
    }

    private static void retrieveFile(FTPClient ftp, String remotePath, String localPath) {
        try {
            //单文件
            if (!remotePath.endsWith(FTP_FILE_SEPARATOR)) {
                retrieveSingleFile(ftp, remotePath, localPath);
            }
            // 转到指定下载目录
            ftp.changeWorkingDirectory(remotePath);
            FTPFile[] files = ftp.listFiles();
            for (FTPFile file : files) {
                if (file.isDirectory()) {
                    retrieveFile(ftp, remotePath + file.getName() + FTP_FILE_SEPARATOR, localPath + FTP_FILE_SEPARATOR + file.getName() + FTP_FILE_SEPARATOR);
                } else {
                    File localFile = new File(localPath + FTP_FILE_SEPARATOR + file.getName());
                    if (!localFile.getParentFile().exists()) {
                        localFile.getParentFile().mkdirs();
                    }
                    OutputStream is = null;
                    try {
                        is = new FileOutputStream(localFile);
                        ftp.retrieveFile(file.getName(), is);
                    } finally {
                        IOUtils.closeQuietly(is);
                    }
                }
            }
        } catch (Exception e) {
            log.error("下载异常", e);
        }
    }

    /**
     * 下载FTP单文件
     * @param remotePath 远程文件路径
     * @param localPath 要下载的文件位置全路径
     * @return
     */
    private static boolean retrieveSingleFile(FTPClient ftp, String remotePath, String localPath) {
        if (StringUtils.isBlank(localPath) || StringUtils.isBlank(remotePath)) {
            log.error("文件路径为空不能上传");
            return false;
        }
        String remoteDir = remotePath.substring(0, remotePath.lastIndexOf(FTP_FILE_SEPARATOR) + 1);
        String remoteFileName = remotePath.substring(remotePath.lastIndexOf(FTP_FILE_SEPARATOR) + 1);
        OutputStream os = null;
        try {
            ftp.changeWorkingDirectory(remoteDir);
            FTPFile[] files = ftp.listFiles();
            for (FTPFile ftpFile : files) {
                if (ftpFile.getName().equals(remoteFileName)) {
                    os = new FileOutputStream(new File(localPath));
                    ftp.retrieveFile(ftpFile.getName(), os);
                    os.flush();
                }
            }
            return true;
        } catch (IOException e) {
            log.error("下载文件异常:" + e);
            return false;
        } finally {
            IOUtils.closeQuietly(os);
        }
    }

    /**
     * 下载FTP单文件
     * @param url ftp地址
     * @param port 端口
     * @param username ftp登录用户名
     * @param password ftp登录密码
     * @param remotePath 远程文件全路径
     * @param response http请求
     * @return
     */
    public static void downloadFile(String url, int port, String username, String password,
                                String remotePath, HttpServletResponse response) {
        if (StringUtils.isBlank(remotePath)) {
            log.error("文件路径为空不能上传");
            return;
        }
        String remoteDir = remotePath.substring(0, remotePath.lastIndexOf(FTP_FILE_SEPARATOR) + 1);
        String remoteFileName = remotePath.substring(remotePath.lastIndexOf(FTP_FILE_SEPARATOR) + 1);
        OutputStream os = null;
        FTPClient ftp = null;
        try {
            ftp = login(url, port, username, password);
            if (ftp == null || !ftp.isConnected()) {
                log.error("无法登录，上传失败");
                return;
            }

            log.info("用户登录成功，准备开始下载文件...");
            ftp.changeWorkingDirectory(remoteDir);
            FTPFile[] files = ftp.listFiles();
            for (FTPFile ftpFile : files) {
                if (ftpFile.getName().equals(remoteFileName)) {
                    os = response.getOutputStream();
                    ftp.retrieveFile(ftpFile.getName(), os);
                    os.flush();
                }
            }
        } catch (IOException e) {
            log.error("下载文件异常:" + e.getMessage());
        } finally {
            IOUtils.closeQuietly(os);
            close(ftp);
        }
    }

    /**
     * 判断文件是否存在
     * @param url ftp地址
     * @param port ftp端口
     * @param username ftp登录名
     * @param password ftp登录密码
     * @param remotePath 文件全路径
     * @return
     */
    public static boolean isFileExists(String url, int port, String username, String password,
                                       String remotePath) throws Exception {
        if (StringUtils.isBlank(remotePath)) {
            return false;
        }
        String remoteDir = remotePath.substring(0, remotePath.lastIndexOf(FTP_FILE_SEPARATOR) + 1);
        String remoteFileName = remotePath.substring(remotePath.lastIndexOf(FTP_FILE_SEPARATOR) + 1);
        FTPClient ftp = null;
        try {
            ftp = login(url, port, username, password);
            if (ftp == null || !ftp.isConnected()) {
                log.error("无法登录");
                throw new Exception("无法登录");
            }
            log.info("用户登录成功，准备开始下载文件...");
            boolean changeSuccess = ftp.changeWorkingDirectory(remoteDir);
            if (!changeSuccess) {
                return false;
            }
            if (StringUtils.isBlank(remoteFileName)) {
                return true;
            } else {
                String[] fileNames = ftp.listNames();
                for (String fileName : fileNames) {
                    if (fileName.equals(remoteFileName)) {
                        return true;
                    }
                }
            }
        } catch (IOException e) {
            log.error("下载文件异常:" + e.getMessage());
        } finally {
            close(ftp);
        }
        return false;
    }

    /**
     * 判断文件是否存在
     * @param ftpClient ftp
     * @param remotePath 文件全路径
     * @return
     */
    public static boolean isFileExists(FTPClient ftpClient, String remotePath) {
        if (StringUtils.isBlank(remotePath) || ftpClient == null) {
            return false;
        }
        String remoteDir = remotePath.substring(0, remotePath.lastIndexOf(FTP_FILE_SEPARATOR) + 1);
        String remoteFileName = remotePath.substring(remotePath.lastIndexOf(FTP_FILE_SEPARATOR) + 1);
        try {
            boolean changeSuccess = ftpClient.changeWorkingDirectory(remoteDir);
            if (!changeSuccess) {
                return false;
            }
            if (StringUtils.isBlank(remoteFileName)) {
                return true;
            } else {
                String[] fileNames = ftpClient.listNames();
                for (String fileName : fileNames) {
                    if (fileName.equals(remoteFileName)) {
                        return true;
                    }
                }
            }
        } catch (IOException e) {
            log.error("下载文件异常:" + e.getMessage());
        }
        return false;
    }

    public static void main(String[] args) {
        String ip = "172.18.53.214";
        int port = 21;
        String user = "provreport";
        String pwd = "provreport.9818";
//        try {
//            System.out.println("1111111" + ftpUtils.login(ip, port, user, pwd));
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//        try {
//            System.out.println("2222222" + ftpUtils.createAndCdDir("/a/b/c"));
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//        try {
//            System.out.println("3333333" + ftpUtils.uploadFile(ip, port, user, pwd, "D:/测试.docx", "a/b/c/test.docx"));
//        } catch (Exception e) {
//
//        }
//        try {
//            System.out.println("4444444" + ftpUtils.uploadFile(ip, port, user, pwd, "D:/测试.docx", "a/b/c/test.docx"));
//        } catch (Exception e) {
//
//        }
//
        try {
            FTPUtil.retrieveFile(ip, port, user, pwd, "/a/b/", System.getProperty("java.io.tmpdir"));
        } catch (Exception e) {
            e.printStackTrace();
        }
        try {
            FTPUtil.retrieveFile(ip, port, user, pwd, "/a/b/c/测试.docx", System.getProperty("java.io.tmpdir"));
        } catch (Exception e) {
            e.printStackTrace();
        }

        System.out.println(System.getProperty("file.separator"));
        System.out.println(File.separator);

        File file1 = new File(System.getProperty("java.io.tmpdir") + FTP_FILE_SEPARATOR + "test1.txt");
        File file2 = new File(System.getProperty("java.io.tmpdir") + FTP_FILE_SEPARATOR + "test2.txt");


        System.out.println(file1.getAbsolutePath());
        System.out.println(file2.getAbsolutePath());
    }

}
