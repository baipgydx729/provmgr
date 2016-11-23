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
import com.qdb.dao.model.DataTable1_1;
import com.qdb.service.pbc.PbcReportService;

/**
 * @author mashengli
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath*:applicationContext.xml")
public class DaoTest {
    @Autowired
    private DBUtil dbUtil;
    @Autowired
    private PbcReportService pbcReportService;

    @Test
    public void test() {
        List<DataTable1_1> dataList = pbcReportService.queryForTable1_1("2016-11-01", "2016-11-30", 152);

        List<Integer> adids = new ArrayList<>();
        adids.add(152);
        adids.add(154);
        Map<Integer, List<DataTable1_1>> dataMap = pbcReportService.queryListGroupByADID("2016-11-01", "2016-11-30", adids);

        System.out.println("finish");
    }
}
