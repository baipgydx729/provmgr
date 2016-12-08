package com.qdb.provmgr.service.pbc;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.qdb.provmgr.dao.ReportDao;
import com.qdb.provmgr.dao.TableModeEnum;
import com.qdb.provmgr.dao.param.ReportParam;

/**
 * @author mashengli
 */
@Service
public class PbcReportService {

    private Logger log = LoggerFactory.getLogger(PbcReportService.class);

    @Autowired
    private ReportDao reportDao;

    public <T> List<T> queryForList(TableModeEnum tableMode, String startDate, String endDate, List<Integer> ADIDs) {
        ReportParam reportParam = new ReportParam();
        reportParam.setADIDs(ADIDs);
        reportParam.setStartNatuDate(startDate);
        reportParam.setEndNatuDate(endDate);
        return reportDao.queryForTableList(tableMode, reportParam);
    }

}
