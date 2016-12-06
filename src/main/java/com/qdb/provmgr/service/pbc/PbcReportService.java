package com.qdb.provmgr.service.pbc;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.qdb.provmgr.dao.ReportDao;
import com.qdb.provmgr.dao.TableModeEnum;
import com.qdb.provmgr.dao.entity.report.DataTable1_1;
import com.qdb.provmgr.dao.entity.report.DataTable1_10;
import com.qdb.provmgr.dao.entity.report.DataTable1_11;
import com.qdb.provmgr.dao.entity.report.DataTable1_12;
import com.qdb.provmgr.dao.entity.report.DataTable1_13;
import com.qdb.provmgr.dao.entity.report.DataTable1_2_1;
import com.qdb.provmgr.dao.entity.report.DataTable1_3;
import com.qdb.provmgr.dao.entity.report.DataTable1_4;
import com.qdb.provmgr.dao.entity.report.DataTable1_5;
import com.qdb.provmgr.dao.entity.report.DataTable1_6;
import com.qdb.provmgr.dao.entity.report.DataTable1_9;

/**
 * @author mashengli
 */
@Service
public class PbcReportService {

    private Logger log = LoggerFactory.getLogger(PbcReportService.class);

    @Autowired
    private ReportDao reportDao;

    public List<DataTable1_1> queryForTable1_1(String startDate, String endDate, List<Integer> ADIDs) {
        List<DataTable1_1> list = reportDao.queryForList(TableModeEnum.Table1_1, startDate, endDate, ADIDs);
        return list;
    }

    public List<DataTable1_2_1> queryForTable1_2(String startDate, String endDate, List<Integer> ADIDs) {
        List<DataTable1_2_1> list = reportDao.queryForList(TableModeEnum.Table1_2, startDate, endDate, ADIDs);
        return list;
    }

    public List<DataTable1_3> queryForTable1_3(String startDate, String endDate, List<Integer> ADIDs) {
        List<DataTable1_3> list = reportDao.queryForList(TableModeEnum.Table1_3, startDate, endDate, ADIDs);
        return list;
    }

    public List<DataTable1_4> queryForTable1_4(String startDate, String endDate, List<Integer> ADIDs) {
        List<DataTable1_4> list = reportDao.queryForList(TableModeEnum.Table1_4, startDate, endDate, ADIDs);
        return list;
    }

    public List<DataTable1_5> queryForTable1_5(String startDate, String endDate, List<Integer> ADIDs) {
        List<DataTable1_5> list = reportDao.queryForList(TableModeEnum.Table1_5, startDate, endDate, ADIDs);
        return list;
    }

    public List<DataTable1_6> queryForTable1_6(String startDate, String endDate, List<Integer> ADIDs) {
        List<DataTable1_6> list = reportDao.queryForList(TableModeEnum.Table1_6, startDate, endDate, ADIDs);
        return list;
    }

    public List<DataTable1_9> queryForTable1_9(String startDate, String endDate, List<Integer> ADIDs) {
        List<DataTable1_9> list = reportDao.queryForList(TableModeEnum.Table1_9, startDate, endDate, ADIDs);
        return list;
    }

    public List<DataTable1_10> queryForTable1_10(String startDate, String endDate, List<Integer> ADIDs) {
        List<DataTable1_10> list = reportDao.queryForList(TableModeEnum.Table1_10, startDate, endDate, ADIDs);
        return list;
    }

    public List<DataTable1_11> queryForTable1_11(String startDate, String endDate, List<Integer> ADIDs) {
        List<DataTable1_11> list = reportDao.queryForList(TableModeEnum.Table1_11, startDate, endDate, ADIDs);
        return list;
    }

    public List<DataTable1_12> queryForTable1_12(String startDate, String endDate, List<Integer> ADIDs) {
        List<DataTable1_12> list = reportDao.queryForList(TableModeEnum.Table1_12, startDate, endDate, ADIDs);
        return list;
    }

    public List<DataTable1_13> queryForTable1_13(String startDate, String endDate, List<Integer> ADIDs) {
        List<DataTable1_13> list = reportDao.queryForList(TableModeEnum.Table1_13, startDate, endDate, ADIDs);
        return list;
    }

    public <T> List<T> queryForList(TableModeEnum tableMode, String startDate, String endDate, List<Integer> ADIDs) {
        return reportDao.queryForList(tableMode, startDate, endDate, ADIDs);
    }

}
