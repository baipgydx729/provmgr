package com.qdb.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.UUID;

import javax.servlet.http.HttpServletResponse;

import org.apache.poi.util.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.qdb.util.FTPUtil;
import com.qdb.util.ZipUtil;

/**
 * @author mashengli
 */
@Service
public class FileService {
    private Logger log = LoggerFactory.getLogger(FileService.class);

    @Value("${ftp.ip}")
    private String ftp_ip;
    @Value("${ftp.port}")
    private int ftp_port = 21;
    @Value("${ftp.user}")
    private String ftp_user;
    @Value("${ftp.pwd}")
    private String ftp_pwd;

    /**
     * 上传文件至ftp服务器
     * @param localPath 待上传的文件路径
     * @param remotePath 远程ftp路径
     * @return
     */
    public boolean uploadFileToFtp(String localPath, String remotePath) {
        return FTPUtil.uploadFile(ftp_ip, ftp_port,ftp_user,ftp_pwd, localPath, remotePath);
    }

    /**
     * 将ftp远程文件取回到本地路径
     * @param remotePath 远程文件路径或文件夹
     * @param localPath 本地路径
     * @return
     */
    public boolean retrieveFileFromFtp(String remotePath, String localPath) {
        return FTPUtil.retrieveFile(ftp_ip, ftp_port, ftp_user, ftp_pwd, remotePath, localPath);
    }

    /**
     * 通过网络下载ftp文件
     * @param remotePath 远程文件路径
     * @param response http请求
     */
    public void downloadFileFromFtp(String remotePath, HttpServletResponse response) {
        FTPUtil.downloadFile(ftp_ip, ftp_port, ftp_user, ftp_pwd, remotePath, response);
    }

    /**
     * 将ftp远程文件取回并压缩
     * @param remotePath 远程文件路径或文件夹
     * @param targetZipFilePath 目标压缩文件路径
     * @return
     */
    public boolean retrieveAndCompressFromFtp(String remotePath, String targetZipFilePath) {
        String tempDir = System.getProperty("java.io.tmpdir") + UUID.randomUUID().toString() + "/";
        boolean result = FTPUtil.retrieveFile(ftp_ip, ftp_port, ftp_user, ftp_pwd, remotePath, tempDir);
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
     * @param remotePath 远程文件路径或文件夹
     * @param targetFileName 下载显示的默认文件名
     * @param response http请求
     */
    public void downloadAndCompressFromFtp(String remotePath, String targetFileName, HttpServletResponse response) {
        if (!targetFileName.endsWith(ZipUtil.FILE_SUFFIX)) {
            targetFileName = targetFileName + ZipUtil.FILE_SUFFIX;
        }
        FileInputStream fis = null;
        String tempZipFilePath = System.getProperty("java.io.tmpdir") + UUID.randomUUID().toString() + "/" + targetFileName;
        if (retrieveAndCompressFromFtp(remotePath, tempZipFilePath)) {
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

}
