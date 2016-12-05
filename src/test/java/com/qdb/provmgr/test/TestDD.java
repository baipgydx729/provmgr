package com.qdb.provmgr.test;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.qdb.provmgr.service.FtpFileService;
import com.qdb.provmgr.util.FTPUtil;

/**
 * @author mashengli
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath*:applicationContext.xml")
public class TestDD {
    @Autowired
    private FtpFileService ftpFileService;

    @Test
    public void test2(){
        FTPUtil.retrieveFile("172.18.198.201", 21, "mashengli", "mslV1234", "/备付金报表/中国人民银行/201611/兴业银行/20161101_20161130表1_1[BJ0000004]北京钱袋宝支付技术有限公司.xls", "/Users/mashengli/Desktop/ftp/");
    }
}
