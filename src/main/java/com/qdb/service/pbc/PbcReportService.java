package com.qdb.service.pbc;

import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.qdb.dao.BaseReportDao;
import com.qdb.dao.TableModeEnum;
import com.qdb.dao.entity.DataTable1_1;
import com.qdb.dao.entity.DataTable1_10;
import com.qdb.dao.entity.DataTable1_11;
import com.qdb.dao.entity.DataTable1_12;
import com.qdb.dao.entity.DataTable1_13;
import com.qdb.dao.entity.DataTable1_2;
import com.qdb.dao.entity.DataTable1_3;
import com.qdb.dao.entity.DataTable1_4;
import com.qdb.dao.entity.DataTable1_5;
import com.qdb.dao.entity.DataTable1_6;
import com.qdb.dao.entity.DataTable1_9;

/**
 * @author mashengli
 */
@Service
public class PbcReportService {

    private Logger log = LoggerFactory.getLogger(PbcReportService.class);

    @Autowired
    private BaseReportDao baseReportDao;

    public List<DataTable1_1> queryForTable1_1(String startDate, String endDate, Integer ADID) {
        return baseReportDao.queryForList(TableModeEnum.Table1_1, startDate, endDate, Collections.singletonList(ADID));
    }

    public List<DataTable1_2> queryForTable1_2(String startDate, String endDate, Integer ADID) {
        return baseReportDao.queryForList(TableModeEnum.Table1_2, startDate, endDate, Collections.singletonList(ADID));
    }

    public List<DataTable1_3> queryForTable1_3(String startDate, String endDate, Integer ADID) {
        return baseReportDao.queryForList(TableModeEnum.Table1_3, startDate, endDate, Collections.singletonList(ADID));
    }

    public List<DataTable1_4> queryForTable1_4(String startDate, String endDate, Integer ADID) {
        return baseReportDao.queryForList(TableModeEnum.Table1_4, startDate, endDate, Collections.singletonList(ADID));
    }

    public List<DataTable1_5> queryForTable1_5(String startDate, String endDate, Integer ADID) {
        return baseReportDao.queryForList(TableModeEnum.Table1_5, startDate, endDate, Collections.singletonList(ADID));
    }

    public List<DataTable1_6> queryForTable1_6(String startDate, String endDate, Integer ADID) {
        return baseReportDao.queryForList(TableModeEnum.Table1_6, startDate, endDate, Collections.singletonList(ADID));
    }

    public List<DataTable1_9> queryForTable1_9(String startDate, String endDate, Integer ADID) {
        return baseReportDao.queryForList(TableModeEnum.Table1_9, startDate, endDate, Collections.singletonList(ADID));
    }

    public List<DataTable1_10> queryForTable1_10(String startDate, String endDate, Integer ADID) {
        return baseReportDao.queryForList(TableModeEnum.Table1_10, startDate, endDate, Collections.singletonList(ADID));
    }

    public List<DataTable1_11> queryForTable1_11(String startDate, String endDate, Integer ADID) {
        return baseReportDao.queryForList(TableModeEnum.Table1_11, startDate, endDate, Collections.singletonList(ADID));
    }

    public List<DataTable1_12> queryForTable1_12(String startDate, String endDate, Integer ADID) {
        return baseReportDao.queryForList(TableModeEnum.Table1_12, startDate, endDate, Collections.singletonList(ADID));
    }

    public List<DataTable1_13> queryForTable1_13(String startDate, String endDate, Integer ADID) {
        return baseReportDao.queryForList(TableModeEnum.Table1_13, startDate, endDate, Collections.singletonList(ADID));
    }

    public <T> List<T> queryForList(TableModeEnum tableMode, String startDate, String endDate, Integer ADID) {
        return baseReportDao.queryForList(tableMode, startDate, endDate, Collections.singletonList(ADID));
    }

}
