package com.qdb.provmgr.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPClientConfig;
import org.apache.commons.net.ftp.FTPFile;
import org.apache.commons.net.ftp.FTPReply;
import org.apache.poi.util.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;

import com.alibaba.dubbo.common.utils.StringUtils;

/**
 * @author mashengli
 */
public class FTPUtil {

    private static Logger log = LoggerFactory.getLogger(FTPUtil.class);

    public static final String FTP_FILE_SEPARATOR = "/";

    @Value("${ftp.encoding}")
    static String SERVER_CHARSET = "ISO-8859-1";

    private static long count = 0;

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
        ftp.enterLocalPassiveMode();// 设置被动模式
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
        if (ftp != null) {
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
                dir = new String(dir.getBytes(), SERVER_CHARSET);
                if (!ftp.changeWorkingDirectory(dir)) {
                    ftp.makeDirectory(dir);
                    ftp.changeWorkingDirectory(dir);
                }
            }
        }
        return true;
    }

    private static boolean changeWorkingDirectory(FTPClient ftpClient, String dir) throws IOException {
        if (StringUtils.isBlank(dir)) {
            return true;
        }
        String[] paths = dir.split(FTPUtil.FTP_FILE_SEPARATOR);
        for (String path : paths) {
            if (StringUtils.isNotEmpty(path)) {
                if (!ftpClient.changeWorkingDirectory(path) && !ftpClient.changeWorkingDirectory(new String(path.getBytes(), SERVER_CHARSET))) {
                    return false;
                }
            }
        }
        return true;
    }

    private static boolean isFileNameExists(FTPClient ftpClient, String remoteFileName) throws IOException {
        if (StringUtils.isBlank(remoteFileName)) {
            return true;
        } else {
            String[] fileNames = ftpClient.listNames();
            for (String fileName : fileNames) {
                if (new String(fileName.getBytes(SERVER_CHARSET)).equals(remoteFileName)) {
                    return true;
                }
            }
        }
        return false;
    }

    private static FTPFile[] getFileListWithoutCD(FTPClient ftpClient, String remotePath) {
        if (StringUtils.isBlank(remotePath)) {
            return null;
        } else {
            FTPFile[] files = null;
            //先切换到指定的目录，记录切换的层数
            String[] paths = remotePath.split(FTP_FILE_SEPARATOR);
            int count = 0;
            for (String path : paths) {
                if (StringUtils.isNotEmpty(path)) {
                    try {
                        if (ftpClient.changeWorkingDirectory(new String(path.getBytes(), SERVER_CHARSET))) {
                            count ++;
                        }
                    } catch (IOException ignored) {
                    }
                }
            }
            //若没有切换目录则表示目录不存在，此时返回空
            if (count == 0) {
                return null;
            }
            try {
                files = ftpClient.listFiles();
            } catch (IOException e) {
                e.printStackTrace();
            }
            //按照进入层数再次切回原目录
            while (count > 0) {
                try {
                    if (ftpClient.changeToParentDirectory()) {
                        count--;
                    }
                } catch (IOException ignored) {
                }
            }
            return files;
        }
    }

    /**
     * 获取文件名列表
     * @param url ftp地址
     * @param port ftp端口
     * @param username ftp登录名
     * @param password ftp密码
     * @param dir ftp路径
     * @return
     */
    public static String[] listNames(String url, int port, String username, String password, String dir) {
        FTPClient ftp = null;
        String[] names = null;
        try {
            ftp = login(url, port, username, password);
            if (ftp == null || !ftp.isConnected()) {
                log.error("无法登录");
                return null;
            }
            if (changeWorkingDirectory(ftp, dir)) {
                String[] listNames = ftp.listNames();
                if (listNames != null && listNames.length > 0) {
                    names = new String[listNames.length];
                    for (int i = 0; i < listNames.length; i++) {
                        names[i] = new String(listNames[i].getBytes(SERVER_CHARSET));
                    }
                }
            }
            return names;
        } catch (Exception ignored) {
        } finally {
            close(ftp);
        }
        return null;
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
            boolean success = ftp.storeFile(new String(remoteFileName.getBytes(), SERVER_CHARSET), input);
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
     * 下载文件到本地:
     * 若下载远程文件夹，请保证路径以分隔符"/"结尾否则将视为下载单文件
     * @param url ftp连接
     * @param port ftp端口号
     * @param username ftp登录名
     * @param password ftp登录密码
     * @param remotePath 远程文件路径
     * @param localPath 要下载的本地路径
     * @param fileSuffix 要下载的文件后缀，若为空则下载所有文件
     * @return
     */
    public static boolean retrieveFile(String url, int port, String username, String password,
                                      String remotePath, String localPath, String fileSuffix) {
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
            if (!remotePath.endsWith(FTP_FILE_SEPARATOR)) {
                retrieveSingleFile(ftp, remotePath, localPath);
            } else {
                retrieveDir(ftp, remotePath, localPath, fileSuffix);
            }
            return true;
        } catch (IOException e) {
            log.error("下载异常", e);
            return false;
        } finally {
            close(ftp);
        }
    }

    private static void retrieveDir(FTPClient ftp, String remotePath, String localPath, String fileSuffix) {
        try {

            FTPFile[] files = getFileListWithoutCD(ftp, remotePath);
            if (files != null) {
                for (FTPFile file : files) {
                    String fileName = new String(file.getName().getBytes(SERVER_CHARSET));
                    if (file.isDirectory()) {
                        retrieveDir(ftp, remotePath + fileName + FTP_FILE_SEPARATOR, localPath + fileName + FTP_FILE_SEPARATOR, fileSuffix);
                    } else if (StringUtils.isBlank(fileSuffix) || (!StringUtils.isBlank(fileSuffix) && fileName.endsWith(fileSuffix))) {
                        File localFile = new File(localPath + FTP_FILE_SEPARATOR + fileName);
                        if (!localFile.getParentFile().exists()) {
                            localFile.getParentFile().mkdirs();
                        }
                        OutputStream os = null;
                        try {
                            os = new FileOutputStream(localFile);
                            ftp.retrieveFile(fileName, os);
                        } finally {
                            IOUtils.closeQuietly(os);
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("下载异常", e);
        }
    }

    private static boolean retrieveSingleFile(FTPClient ftp, String remotePath, String localPath) {
        String remoteDir = remotePath.substring(0, remotePath.lastIndexOf(FTP_FILE_SEPARATOR) + 1);
        String remoteFileName = remotePath.substring(remotePath.lastIndexOf(FTP_FILE_SEPARATOR) + 1);
        if (localPath.endsWith(FTPUtil.FTP_FILE_SEPARATOR)) {
            localPath = localPath + remoteFileName;
        }
        OutputStream os = null;
        try {
            if (changeWorkingDirectory(ftp, remoteDir)) {
                FTPFile[] files = ftp.listFiles();
                for (FTPFile ftpFile : files) {
                    String ftpFileName = new String(ftpFile.getName().getBytes(SERVER_CHARSET));
                    if (ftpFileName.equals(remoteFileName)) {
                        os = new FileOutputStream(new File(localPath));
                        ftp.retrieveFile(ftpFileName, os);
                        os.flush();
                    }
                }
                return true;
            }
            return false;
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
     * @param remotePath 远程文件全路径,不支持下载文件夹或多文件
     * @param response http请求
     * @return
     */
    public static void downloadFile(String url, int port, String username, String password,
                                String remotePath, HttpServletResponse response) throws Exception {
        if (StringUtils.isBlank(remotePath)) {
            throw new Exception("文件路径为空");
        }
        String remoteDir = remotePath.substring(0, remotePath.lastIndexOf(FTP_FILE_SEPARATOR) + 1);
        String remoteFileName = remotePath.substring(remotePath.lastIndexOf(FTP_FILE_SEPARATOR) + 1);
        OutputStream os = null;
        FTPClient ftp = null;
        try {
            ftp = login(url, port, username, password);
            if (ftp == null || !ftp.isConnected()) {
                throw new IOException("无法登录");
            }
            log.info("用户登录成功，准备开始下载文件...");
            if (!changeWorkingDirectory(ftp, remoteDir)) {
                throw new Exception("文件不存在");
            }
            FTPFile[] ftpFiles = ftp.listFiles();
            boolean status = false;
            for (FTPFile file : ftpFiles) {
                String fileName = new String(file.getName().getBytes(SERVER_CHARSET));
                if (fileName.equals(remoteFileName)) {
                    status = true;
                    os = response.getOutputStream();
                    ftp.retrieveFile(file.getName(), os);
                    os.flush();
                }
            }
            if (!status) {
                throw new Exception("文件不存在");
            }
        } catch (Exception e) {
            log.error("下载文件异常:" + e.getMessage());
            throw e;
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
            boolean changeSuccess = changeWorkingDirectory(ftp, remoteDir);
            if (!changeSuccess) {
                return false;
            }
            return isFileNameExists(ftp, remoteFileName);
        } catch (IOException e) {
            log.error("下载文件异常:" + e.getMessage());
        } finally {
            close(ftp);
        }
        return false;
    }

    /**
     * 在指定文件夹内统计指定后缀的文件数量
     * @param url ftp地址
     * @param port ftp端口
     * @param username ftp登录名
     * @param password ftp密码
     * @param remotePath 远程路径
     * @param fileSuffix 文件后缀，为空表示所有非文件夹文件
     * @return
     * @throws Exception
     */
    public static long countFiles(String url, int port, String username, String password,
                                  String remotePath, String fileSuffix) throws Exception {
        if (StringUtils.isBlank(remotePath)) {
            return 0;
        }
        FTPClient ftp = null;
        try {
            ftp = login(url, port, username, password);
            if (ftp == null || !ftp.isConnected()) {
                log.error("无法登录");
                throw new Exception("无法登录");
            }
            log.info("用户登录成功，准备开始下载文件...");
            countFiles(ftp, remotePath, fileSuffix);
            return count;
        } finally {
            close(ftp);
        }
    }

    private static void countFiles(FTPClient ftpClient, String remotePath, String fileSuffix) throws
            UnsupportedEncodingException {
        FTPFile[] files = getFileListWithoutCD(ftpClient, remotePath);
        if (files != null) {
            for (FTPFile file : files) {
                if (file.isDirectory()) {
                    countFiles(ftpClient, remotePath + new String(file.getName().getBytes(SERVER_CHARSET)) + FTP_FILE_SEPARATOR, fileSuffix);
                }
                try {
                    String fileName = new String(file.getName().getBytes(SERVER_CHARSET));
                    if (StringUtils.isBlank(fileSuffix)) {
                        count++;
                    } else if (fileName.endsWith(fileSuffix)) {
                        count++;
                    }
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public static void main(String[] args) {
        String ip = "172.18.198.201";
        int port = 21;
        String user = "mashengli";
        String pwd = "mslV1234";
        try {
            System.out.println(countFiles(ip, port, user, pwd, "/备付金报表/中国人民银行/201612/", ".xls"));
        } catch (Exception e) {
            e.printStackTrace();
        }
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
//        try {
//            FTPUtil.retrieveFile(ip, port, user, pwd, "/a/b/", System.getProperty("java.io.tmpdir"));
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//        try {
//            FTPUtil.retrieveFile(ip, port, user, pwd, "/a/b/c/测试.docx", System.getProperty("java.io.tmpdir"));
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//
//        System.out.println(System.getProperty("file.separator"));
//        System.out.println(File.separator);
//
//        File file1 = new File(System.getProperty("java.io.tmpdir") + FTP_FILE_SEPARATOR + "test1.txt");
//        File file2 = new File(System.getProperty("java.io.tmpdir") + FTP_FILE_SEPARATOR + "test2.txt");
//
//
//        System.out.println(file1.getAbsolutePath());
//        System.out.println(file2.getAbsolutePath());
//
//        String path = "/备付金报表/中国人民银行/201611/";
//        try {
//            FTPClient ftpClient = FTPUtil.login(ip, port, user, pwd);
//            ftpClient.makeDirectory("备付金报表");
//            ftpClient.changeWorkingDirectory("备付金报表");
//            ftpClient.makeDirectory("中国人民银行");
//            ftpClient.changeWorkingDirectory("中国人民银行");
//            ftpClient.makeDirectory("201611");
//            ftpClient.changeWorkingDirectory("201611");
//
//            FTPClient ftpClient1 = FTPUtil.login(ip, port, user, pwd);
//            ftpClient1.makeDirectory(new String("备付金报表".getBytes(), "ISO-8859-1"));
//            ftpClient1.changeWorkingDirectory(new String("备付金报表".getBytes(), "ISO-8859-1"));
//            ftpClient1.makeDirectory(new String("中国人民银行".getBytes(), "ISO-8859-1"));
//            ftpClient1.changeWorkingDirectory(new String("中国人民银行".getBytes(), "ISO-8859-1"));
//            ftpClient1.makeDirectory(new String("201611".getBytes(), "ISO-8859-1"));
//            ftpClient1.changeWorkingDirectory(new String("201611".getBytes(), "ISO-8859-1"));
//
//            FTPClient ftpClient3 = FTPUtil.login(ip, port, user, pwd);
//            boolean result = ftpClient3.changeWorkingDirectory(path);
//            String[] paths = path.split("/");
//            for (String patha : paths) {
//                if (StringUtils.isNotEmpty(patha)) {
//                    System.out.println(ftpClient3.changeWorkingDirectory(patha));
//                }
//            }
//
//            FTPClient ftpClient2 = FTPUtil.login(ip, port, user, pwd);
//            boolean result2 = ftpClient2.changeWorkingDirectory(new String(path.getBytes(), "ISO-8859-1"));
//            String[] paths2 = path.split("/");
//            for (String patha : paths2) {
//                if (StringUtils.isNotEmpty(patha)) {
//                    System.out.println(ftpClient2.changeWorkingDirectory(patha));
//                }
//            }
//
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
    }

}
