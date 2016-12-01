package com.qdb.provmgr.test;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.qdb.provmgr.service.TESTFtpFileService;

/**
 * @author mashengli
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath*:applicationContext.xml")
public class TestDD {
    @Autowired
    private TESTFtpFileService ftpFileService;

    @Test
    public void test2(){
        System.out.println("*****----**");
    }
}
