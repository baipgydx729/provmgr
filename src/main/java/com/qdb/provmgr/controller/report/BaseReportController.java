package com.qdb.provmgr.controller.report;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.qdb.provmgr.controller.report.view.Account;
import com.qdb.provmgr.controller.report.view.BankAccountView;
import com.qdb.provmgr.dao.entity.report.BaseReportEntity;
import com.qdb.provmgr.report.ReportExcelUtil;
import com.qdb.provmgr.report.ReportHelper;
import com.qdb.provmgr.service.ReportService;

/**
 * @author mashengli
 */
@Controller
@RequestMapping(value = "report")
public class BaseReportController {
    private Logger log = LoggerFactory.getLogger(BaseReportController.class);

    @Autowired
    private ReportService reportService;
    @Autowired
    private ReportHelper reportHelper;
    @Autowired
    private ReportExcelUtil reportExcelUtil;

    @RequestMapping(value = "bank-account")
    @ResponseBody
    public Map getBankList(HttpServletRequest request, HttpServletResponse response) {
        Date startDate = null;
        Date endDate = null;
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        try {
            startDate = sdf.parse(request.getParameter("start_day"));
            endDate = sdf.parse(request.getParameter("end_day"));
        } catch (Exception e) {
            log.info("日期为空");
        }
        List<BankAccountView> bankAccountViewList = convertData(reportService.getBankList(null, null, startDate, endDate));
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("code", 200);
        resultMap.put("data", bankAccountViewList);
        return resultMap;
    }

    private List<BankAccountView> convertData(List<BaseReportEntity> dataList) {
        List<BankAccountView> resultList = new ArrayList<>();

        //将数据按照银行分割成多个列表，每个列表表示一个银行的账户列表
        List<List<BaseReportEntity>> splitData = reportExcelUtil.splitByBankName(dataList);
        for (List<BaseReportEntity> baseReportEntityList : splitData) {
            BankAccountView bankAccountView = new BankAccountView();
            bankAccountView.setBank_name(baseReportEntityList.get(0).getBankName());
            List<Account> accountList = new ArrayList<>();
            for (BaseReportEntity baseReportEntity : baseReportEntityList) {
                Account account = new Account();
                account.setAccount_id(baseReportEntity.getADID().toString());
                account.setAccount_name(baseReportEntity.getName());
                account.setAccount_no(baseReportEntity.getAD());
                account.setBank_name(bankAccountView.getBank_name());
                accountList.add(account);
            }
            bankAccountView.setAccount_list(accountList);
            resultList.add(bankAccountView);
        }
        return resultList;
    }
}
