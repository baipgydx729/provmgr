package com.qdb.provmgr.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.net.ftp.FTPClient;
import org.apache.poi.util.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.qdb.provmgr.util.FTPUtil;
import com.qdb.provmgr.util.FileUtil;
import com.qdb.provmgr.util.ZipUtil;

/**
 * @author mashengli
 */
@Service
public class FtpFileService {
    private Logger log = LoggerFactory.getLogger(FtpFileService.class);

    @Value("${ftp.ip}")
    private String ftp_ip;
    @Value("${ftp.port}")
    private int ftp_port = 21;
    @Value("${ftp.user}")
    private String ftp_user;
    @Value("${ftp.pwd}")
    private String ftp_pwd;
    @Value("${db.user}")
    private String db_user;

    /**
     * 上传文件至ftp服务器
     * @param localPath 待上传的文件全路径
     * @param remotePath 远程ftp路径(若路径以/结尾，怎文件名取上传文件的文件名)
     * @return
     */
    public boolean uploadFileToFtp(String localPath, String remotePath) {
        return FTPUtil.uploadFile(ftp_ip, ftp_port, ftp_user, ftp_pwd, localPath, remotePath);
    }

    /**
     * 通过网络下载ftp文件
     * @param remotePath 远程文件全路径
     * @param response http请求
     */
    public void downloadFileFromFtp(String remotePath, HttpServletResponse response) {
        FTPUtil.downloadFile(ftp_ip, ftp_port, ftp_user, ftp_pwd, remotePath, response);
    }

    /**
     * 将ftp远程文件夹取回并压缩
     * @param remoteDir 远程文件夹路径
     * @param targetZipFilePath 目标压缩文件全路径
     * @param fileSuffix 包含的文件后缀名,可为空默认全部文件
     * @return
     */
    public boolean retrieveAndCompressFromFtp(String remoteDir, String targetZipFilePath, String fileSuffix) {
        String tempDir = FileUtil.getTempPath();
        boolean result = FTPUtil.retrieveDir(ftp_ip, ftp_port, ftp_user, ftp_pwd, remoteDir, tempDir, fileSuffix);
        if (!result) {
            log.error("下载文件异常！请重新下载");
            return false;
        }
        String targetDir = targetZipFilePath.substring(0, targetZipFilePath.lastIndexOf("/") + 1);
        String targetZipName = targetZipFilePath.substring(targetZipFilePath.lastIndexOf("/") + 1);
        return ZipUtil.compressed(tempDir, targetDir, targetZipName);
    }

    /**
     * 将ftp文件压缩并下载
     * @param remoteDir 远程文件路径或文件夹
     * @param targetFileName 下载显示的默认文件名
     * @param fileSuffix 包含的文件后缀名,可为空默认全部文件
     * @param response http请求
     */
    public void downloadAndCompressFromFtp(String remoteDir, String targetFileName, String fileSuffix, HttpServletResponse response) {
        if (!targetFileName.endsWith(ZipUtil.FILE_SUFFIX)) {
            targetFileName = targetFileName + ZipUtil.FILE_SUFFIX;
        }
        FileInputStream fis = null;
        String tempZipFilePath = FileUtil.getTempFilePath(targetFileName);
        if (retrieveAndCompressFromFtp(remoteDir, tempZipFilePath, fileSuffix)) {
            File file = new File(tempZipFilePath);
            try {
                fis = new FileInputStream(file);
                response.reset();
                response.setContentType("application/octet-stream");
                response.setHeader("Content-Disposition","attachment; filename=" + targetFileName);
                IOUtils.copy(fis, response.getOutputStream());
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                IOUtils.closeQuietly(fis);
            }
        }
    }

    /**
     * 判断ftp是否存在指定文件
     * @param dir 目录
     * @param fileNames 文件名
     * @return 数组第一列为文件名，第二列为1存在/0不存在
     */
    public String[][] checkFileStatus(String dir, String[] fileNames) {
        if (fileNames == null || fileNames.length <= 0) {
            return new String[][]{};
        }
        String[][] result = null;
        FTPClient ftpClient = null;
        try {
            ftpClient = FTPUtil.login(ftp_ip, ftp_port, ftp_user, ftp_pwd);
            if (ftpClient == null || !ftpClient.isConnected()) {
                log.error("ftp登录失败");
                throw new IOException("登录失败");
            }
            result = new String[fileNames.length][3];
            String[] listNames = ftpClient.listNames(dir);
            if (listNames == null || listNames.length == 0) {
                log.info("目录为空");
                return result;
            }
            List<String> names = Arrays.asList(listNames);
            if (names.size() <= 0) {
                return result;
            }
            for (int i = 0; i < fileNames.length; i++) {
                result[i][0] = fileNames[i];
                if (containsValue(names, fileNames[i])) {
                    result[i][1] = "1";
                } else {
                    result[i][1] = "0";
                }
            }
            return result;
        } catch (IOException e) {
            log.error("登录异常", e);
        } finally {
            FTPUtil.close(ftpClient);
        }
        return result;
    }

    /**
     * 文件是否存在
     * @param dir ftp路径
     * @param fileNames 文件名
     * @return
     */
    public boolean isFileExists(String dir, String fileNames) {
        try {
            return FTPUtil.isFileExists(ftp_ip, ftp_port, ftp_user, ftp_pwd, dir + fileNames);
        } catch (Exception e) {
            log.error("出现异常", e);
        }
        return false;
    }

    private boolean containsValue(Collection<String> collection, String value) {
        for (String t : collection) {
            if (t.equals(value)) {
                return true;
            }
        }
        return false;
    }

}
