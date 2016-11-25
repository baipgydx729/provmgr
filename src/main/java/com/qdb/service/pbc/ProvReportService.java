package com.qdb.service.pbc;

import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.qdb.dao.ProvReportDao;
import com.qdb.dao.TableModeEnum;
import com.qdb.dao.entity.report.DataTable1_1;
import com.qdb.dao.entity.report.DataTable1_10;
import com.qdb.dao.entity.report.DataTable1_11;
import com.qdb.dao.entity.report.DataTable1_12;
import com.qdb.dao.entity.report.DataTable1_13;
import com.qdb.dao.entity.report.DataTable1_2;
import com.qdb.dao.entity.report.DataTable1_3;
import com.qdb.dao.entity.report.DataTable1_4;
import com.qdb.dao.entity.report.DataTable1_5;
import com.qdb.dao.entity.report.DataTable1_6;
import com.qdb.dao.entity.report.DataTable1_9;

/**
 * @author mashengli
 */
@Service
public class ProvReportService {

    private Logger log = LoggerFactory.getLogger(ProvReportService.class);

    @Autowired
    private ProvReportDao provReportDao;

    public List<DataTable1_1> queryForTable1_1(String startDate, String endDate, List<Integer> ADIDs) {
        List<DataTable1_1> list = provReportDao.queryForList(TableModeEnum.Table1_1, startDate, endDate, ADIDs);
        for (DataTable1_1 dataTable1_1 : list) {
            dataTable1_1.setTableMode(TableModeEnum.Table1_1);
        }
        return list;
    }

    public List<DataTable1_2> queryForTable1_2(String startDate, String endDate, List<Integer> ADIDs) {
        List<DataTable1_2> list = provReportDao.queryForList(TableModeEnum.Table1_2, startDate, endDate, ADIDs);
        for (DataTable1_2 dataTable1_2 : list) {
            dataTable1_2.setTableMode(TableModeEnum.Table1_2);
        }
        return list;
    }

    public List<DataTable1_3> queryForTable1_3(String startDate, String endDate, List<Integer> ADIDs) {
        List<DataTable1_3> list = provReportDao.queryForList(TableModeEnum.Table1_3, startDate, endDate, ADIDs);
        for (DataTable1_3 dataTable1_3 : list) {
            dataTable1_3.setTableMode(TableModeEnum.Table1_3);
        }
        return list;
    }

    public List<DataTable1_4> queryForTable1_4(String startDate, String endDate, List<Integer> ADIDs) {
        List<DataTable1_4> list = provReportDao.queryForList(TableModeEnum.Table1_4, startDate, endDate, ADIDs);
        for (DataTable1_4 dataTable1_4 : list) {
            dataTable1_4.setTableMode(TableModeEnum.Table1_4);
        }
        return list;
    }

    public List<DataTable1_5> queryForTable1_5(String startDate, String endDate, List<Integer> ADIDs) {
        List<DataTable1_5> list = provReportDao.queryForList(TableModeEnum.Table1_5, startDate, endDate, ADIDs);
        for (DataTable1_5 dataTable1_5 : list) {
            dataTable1_5.setTableMode(TableModeEnum.Table1_5);
        }
        return list;
    }

    public List<DataTable1_6> queryForTable1_6(String startDate, String endDate, List<Integer> ADIDs) {
        List<DataTable1_6> list = provReportDao.queryForList(TableModeEnum.Table1_6, startDate, endDate, ADIDs);
        for (DataTable1_6 dataTable1_6 : list) {
            dataTable1_6.setTableMode(TableModeEnum.Table1_6);
        }
        return list;
    }

    public List<DataTable1_9> queryForTable1_9(String startDate, String endDate, List<Integer> ADIDs) {
        List<DataTable1_9> list = provReportDao.queryForList(TableModeEnum.Table1_9, startDate, endDate, ADIDs);
        for (DataTable1_9 dataTable1_9 : list) {
            dataTable1_9.setTableMode(TableModeEnum.Table1_9);
        }
        return list;
    }

    public List<DataTable1_10> queryForTable1_10(String startDate, String endDate, List<Integer> ADIDs) {
        List<DataTable1_10> list = provReportDao.queryForList(TableModeEnum.Table1_10, startDate, endDate, ADIDs);
        for (DataTable1_10 dataTable1_10 : list) {
            dataTable1_10.setTableMode(TableModeEnum.Table1_10);
        }
        return list;
    }

    public List<DataTable1_11> queryForTable1_11(String startDate, String endDate, List<Integer> ADIDs) {
        List<DataTable1_11> list = provReportDao.queryForList(TableModeEnum.Table1_11, startDate, endDate, ADIDs);
        for (DataTable1_11 dataTable1_11 : list) {
            dataTable1_11.setTableMode(TableModeEnum.Table1_11);
        }
        return list;
    }

    public List<DataTable1_12> queryForTable1_12(String startDate, String endDate, List<Integer> ADIDs) {
        List<DataTable1_12> list = provReportDao.queryForList(TableModeEnum.Table1_12, startDate, endDate, ADIDs);
        for (DataTable1_12 dataTable1_12 : list) {
            dataTable1_12.setTableMode(TableModeEnum.Table1_12);
        }
        return list;
    }

    public List<DataTable1_13> queryForTable1_13(String startDate, String endDate, List<Integer> ADIDs) {
        List<DataTable1_13> list = provReportDao.queryForList(TableModeEnum.Table1_13, startDate, endDate, ADIDs);
        for (DataTable1_13 dataTable1_13 : list) {
            dataTable1_13.setTableMode(TableModeEnum.Table1_13);
        }
        return list;
    }

    public <T> List<T> queryForList(TableModeEnum tableMode, String startDate, String endDate, List<Integer> ADIDs) {
        return provReportDao.queryForList(tableMode, startDate, endDate, ADIDs);
    }

    public <T> List<T> queryForList(TableModeEnum tableMode, String startDate, String endDate, Integer ADID) {
        return provReportDao.queryForList(tableMode, startDate, endDate, Collections.singletonList(ADID));
    }

}
