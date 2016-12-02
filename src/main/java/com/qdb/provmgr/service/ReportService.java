package com.qdb.provmgr.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.qdb.provmgr.dao.ReportDao;
import com.qdb.provmgr.dao.entity.report.BaseReportEntity;
import com.qdb.provmgr.dao.param.ReportParam;
import com.qdb.provmgr.util.DateUtils;

/**
 * @author mashengli
 */
@Service
public class ReportService {
    private Logger log = LoggerFactory.getLogger(ReportService.class);

    @Autowired
    private ReportDao reportDao;

    public List<BaseReportEntity> getBankList(String bankName, List<Integer> ADIDs, Date startDate, Date endDate) {
        ReportParam reportParam = new ReportParam();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        if (null == startDate || null == endDate) {
            try {
                Date dateNow = new Date();
                reportParam.setStartNatuDate(DateUtils.getFirstDayOfMonth(dateNow));
                reportParam.setEndNatuDate(DateUtils.getFirstDayOfMonth(dateNow));
            } catch (ParseException ignored) {}
        } else {
            reportParam.setStartNatuDate(sdf.format(startDate));
            reportParam.setEndNatuDate(sdf.format(endDate));
        }
        reportParam.setBankName(bankName);
        reportParam.setADIDs(ADIDs);
        return reportDao.queryForBankList(reportParam);
    }

}
