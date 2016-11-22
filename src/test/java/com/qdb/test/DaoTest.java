package com.qdb.test;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.qdb.dao.DBUtil;
import com.qdb.dao.DemoDao;
import com.qdb.report.pbc.bean.DataTable1_1;

/**
 * @author mashengli
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath*:applicationContext.xml")
public class DaoTest {
    @Autowired
    private DemoDao demoDao;
    @Autowired
    private DBUtil dbUtil;

    @Test
    public void test() {
        List<Integer> adids = new ArrayList<>();
        adids.add(174);
        adids.add(175);
        List<DataTable1_1> list = demoDao.findDataTable1_1List("2016-11-01", "2016-11-30", adids);
        System.out.println(list);
    }
}
