package com.qdb.provmgr.controller.report;

import java.io.File;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.map.HashedMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.dubbo.common.utils.StringUtils;
import com.alibaba.fastjson.JSONObject;
import com.qdb.provmgr.dao.TableModeEnum;
import com.qdb.provmgr.dao.entity.report.AccountInfoEntity;
import com.qdb.provmgr.dao.entity.report.BaseReportEntity;
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
import com.qdb.provmgr.report.PresetContent;
import com.qdb.provmgr.report.ReportHelper;
import com.qdb.provmgr.report.pbc.PbcExcelUtil;
import com.qdb.provmgr.report.pbc.PbcReportHelper;
import com.qdb.provmgr.service.FtpFileService;
import com.qdb.provmgr.service.ReportService;
import com.qdb.provmgr.service.pbc.PbcReportService;
import com.qdb.provmgr.util.DateUtils;
import com.qdb.provmgr.util.FileUtil;

/**
 * @author mashengli
 */
@Controller
@RequestMapping(value = "/report/pbc")
public class PbcReportController {

    private Logger log = LoggerFactory.getLogger(PbcReportController.class);

    private String FILE_SUFFIX = ".xls";

    @Autowired
    private ReportService reportService;
    @Autowired
    private PbcReportService pbcReportService;
    @Autowired
    private FtpFileService ftpFileService;
    @Autowired
    private PbcReportHelper pbcReportHelper;

    /**
     * 获取报表列表
     *
     * @return
     */
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    @ResponseBody
    public Map index(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> resultMap = new HashMap<>();
        String startDateStr = request.getParameter("start_day");
        String endDateStr = request.getParameter("end_day");
        String reportType = request.getParameter("report_type");

        if (StringUtils.isBlank(startDateStr)) {
            resultMap.put("code", 400);
            resultMap.put("message", "日期不能为空");
            return resultMap;
        }
        if (StringUtils.isBlank(reportType)) {
            resultMap.put("code", 400);
            resultMap.put("message", "报表类型不能为空");
            return resultMap;
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date startDate = null;
        Date endDate = null;
        try {
            startDate = sdf.parse(DateUtils.getFirstDayOfMonth(sdf.parse(startDateStr)));
            endDate = sdf.parse(DateUtils.getLastDayOfMonth(sdf.parse(endDateStr)));
        } catch (ParseException e) {
            e.printStackTrace();
        }

        if ("0".equals(reportType)) {
            //汇总类型的报表，不再区分银行和账户，只区分哪张表
            return getTotalReportList(startDate, endDate);
        } else {
            String bankName = request.getParameter("bank_name");
            String account_id = request.getParameter("account_id");
            List<Integer> adids = null;
            if (!StringUtils.isBlank(account_id)) {
                adids = new ArrayList<>();
                adids.add(Integer.valueOf(account_id));
            }
            return getCorpReportList(startDate, endDate, bankName, adids);
        }
    }

    /**
     * 生成报表接口
     *
     * @return
     */
    @RequestMapping(value = "create")
    @ResponseBody
    public Map createReport(HttpServletRequest request, @RequestBody String jsonData) {
        Map<String, Object> resultMap = new HashMap<>();
        JSONObject jsonObject = null;
        String reportType = null;
        Date startDate = null;
        Date endDate = null;
        List<Map<String, String>> reportListParam = null;
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        try {
            jsonObject = JSONObject.parseObject(jsonData);
            reportType = String.valueOf(jsonObject.get("report_type"));
            startDate = sdf.parse(DateUtils.getFirstDayOfMonth(sdf.parse((String) jsonObject.get("start_day"))));
            endDate = sdf.parse(DateUtils.getLastDayOfMonth(sdf.parse((String) jsonObject.get("end_day"))));
            reportListParam = (List<Map<String, String>>) jsonObject.get("report_list");
        } catch (Exception e) {
            resultMap.put("code", 400);
            resultMap.put("message", "数据格式有误");
            return resultMap;
        }
        if (StringUtils.isBlank(reportType) || CollectionUtils.isEmpty(reportListParam)) {
            resultMap.put("code", 400);
            resultMap.put("message", "参数不全");
            return resultMap;
        }
        int success = 0;
        int total = 0;
        if ("0".equals(reportType)) {
            //汇总行报表，对应存管行特殊表
            for (Map<String, String> map : reportListParam) {
                total++;
                TableModeEnum tableMode = TableModeEnum.getEnumByTableName(map.get("report_name"));
                PresetContent presetContent = new PresetContent();
                presetContent.setCompanyName(pbcReportHelper.getCompanyName());
                presetContent.setReportUserName(pbcReportHelper.getReportUserName());
                presetContent.setCheckUserName(pbcReportHelper.getCheckUserName());
                presetContent.setTranPeriod(new SimpleDateFormat("yyyyMM").format(startDate));
                presetContent.setReportDate(new SimpleDateFormat("yyyyMMdd").format(new Date()));

                try {
                    List<BaseReportEntity> dataList = getDataList(tableMode, startDate, endDate, Collections.EMPTY_LIST);
                    File tempFile = PbcExcelUtil.createExcelFile(tableMode, pbcReportHelper.getPbcTemplateFile(tableMode),
                            pbcReportHelper.getPbcFileNameDP(startDate, endDate, tableMode, pbcReportHelper.getCompanyName()),
                            presetContent,
                            ReportHelper.mergeAndSumByDate(dataList));
                    boolean uploadResult = ftpFileService.uploadFileToFtp(tempFile.getAbsolutePath(), pbcReportHelper
                            .getPbcFtpDirDP(new SimpleDateFormat("yyyyMM").format(startDate)) + tempFile.getName());
                    if (uploadResult) {
                        success++;
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        } else {
            //合作行表
            //汇总行报表，对应存管行特殊表
            for (Map<String, String> map : reportListParam) {
                total++;
                TableModeEnum tableMode = TableModeEnum.getEnumByTableName(map.get("report_name"));
                PresetContent presetContent = new PresetContent();
                presetContent.setCompanyName(pbcReportHelper.getCompanyName());
                presetContent.setReportUserName(pbcReportHelper.getReportUserName());
                presetContent.setCheckUserName(pbcReportHelper.getCheckUserName());
                presetContent.setTranPeriod(new SimpleDateFormat("yyyyMM").format(startDate));
                presetContent.setReportDate(new SimpleDateFormat("yyyyMMdd").format(new Date()));
                presetContent.setAuthCompanyName(pbcReportHelper.getCompanyName());
                presetContent.setAccountId(map.get("account_id"));
                presetContent.setBankName(map.get("bank_name"));
                presetContent.setAccount(map.get("account_no"));
                presetContent.setAccountName(map.get("account_name"));
                presetContent.setLegalPerson(map.get("bank_name"));

                List<Integer> ADIDs = new ArrayList<>();
                ADIDs.add(Integer.valueOf(presetContent.getAccountId()));
                List<BaseReportEntity> dataList = getDataList(tableMode, startDate, endDate, ADIDs);
                try {
                    File tempFile = PbcExcelUtil.createExcelFile(tableMode, pbcReportHelper.getPbcTemplateFile(tableMode),
                            pbcReportHelper.getPbcFileNameCorp(startDate, endDate, tableMode, pbcReportHelper
                                    .getCompanyName(), presetContent.getBankName(), presetContent.getAccount()),
                            presetContent,
                            dataList);
                    boolean uploadResult = ftpFileService.uploadFileToFtp(tempFile.getAbsolutePath(), pbcReportHelper
                            .getPbcFtpDirCorp(new SimpleDateFormat("yyyyMM").format(startDate), presetContent
                                    .getBankName(), presetContent.getAccount()) + tempFile.getName());
                    if (uploadResult) {
                        success++;
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        resultMap.put("code", 200);
        resultMap.put("message", "共记" + total + "张报表，创建成功" + success + "张，创建失败" + (total - success) + "张");
        return resultMap;
    }

    /**
     * 报送接口
     *
     * @return
     */
    @RequestMapping(value = "submit")
    @ResponseBody
    public Map submit(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> resultMap = new HashMap<>();
        String startDateStr = request.getParameter("start_day");
        String endDateStr = request.getParameter("end_day");

        if (StringUtils.isBlank(startDateStr)) {
            resultMap.put("code", 400);
            resultMap.put("message", "日期不能为空");
            return resultMap;
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date startDate = null;
        Date endDate = null;
        try {
            startDate = sdf.parse(DateUtils.getFirstDayOfMonth(sdf.parse(startDateStr)));
            endDate = sdf.parse(DateUtils.getFirstDayOfMonth(sdf.parse(endDateStr)));
        } catch (ParseException e) {
            e.printStackTrace();
        }
        String ftpPath = pbcReportHelper.getPbcFtpDir(new SimpleDateFormat("yyyyMM").format(startDate));
        File tempFile = FileUtil.createTempFile(pbcReportHelper.getPbcZipFileName(startDate, endDate, pbcReportHelper.getCompanyName()));
        ftpFileService.retrieveAndCompressFromFtp(ftpPath, tempFile.getAbsolutePath(), FILE_SUFFIX);

        boolean result = ftpFileService.uploadFileToFtp(tempFile.getAbsolutePath(), ftpPath + tempFile.getName());
        if (!result) {
            resultMap.put("code", 400);
            resultMap.put("message", "失败!");
            return resultMap;
        }
        //TODO 调用张梦宇报送接口
        resultMap.put("code", 200);
        resultMap.put("message", 400);
        return resultMap;
    }

    @RequestMapping(value = "download")
    @ResponseBody
    public Map download(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> resultMap = new HashedMap();
        String startDateStr = request.getParameter("start_day");
        String reportType = request.getParameter("report_type");
        String reportName = request.getParameter("report_name");
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        if (StringUtils.isBlank(startDateStr) || StringUtils.isBlank(reportType) || StringUtils.isBlank(reportName)) {
            resultMap.put("code", 400);
            resultMap.put("message", "参数不全");
            return resultMap;
        }
        try {
            Date startDate = sdf.parse(DateUtils.getFirstDayOfMonth(sdf.parse(startDateStr)));
            Date endDate = sdf.parse(DateUtils.getLastDayOfMonth(sdf.parse(startDateStr)));
            TableModeEnum tableModeEnum = TableModeEnum.getEnumByTableName(reportName);
            if (tableModeEnum == null) {
                resultMap.put("code", 400);
                resultMap.put("message", "请选择报表");
                return resultMap;
            }
            String ftpPath = null;
            String fileName = null;
            if ("0".equals(reportType)) {
                ftpPath = pbcReportHelper.getPbcFtpDirDP(new SimpleDateFormat("yyyyMM").format(startDate));
                fileName = pbcReportHelper.getPbcFileNameDP(startDate, endDate, tableModeEnum, pbcReportHelper.getCompanyName());
            } else {
                String ADID = request.getParameter("account_id");
                if (!StringUtils.isBlank(ADID) && StringUtils.isNumeric(ADID)) {
                    AccountInfoEntity accountInfoEntity = reportService.queryAccountById(Integer.valueOf(ADID));
                    ftpPath = pbcReportHelper.getPbcFtpDirCorp(new SimpleDateFormat("yyyyMM").format(startDate),
                            accountInfoEntity.getBankName(), accountInfoEntity.getAD());
                    fileName = pbcReportHelper.getPbcFileNameCorp(startDate, endDate, tableModeEnum,
                            pbcReportHelper.getCompanyName(), accountInfoEntity.getBankName(), accountInfoEntity.getAD());
                }
            }
            if (StringUtils.isBlank(fileName) || !ftpFileService.isFileExists(ftpPath, fileName)) {
                resultMap.put("code", 400);
                resultMap.put("message", "文件不存在");
                return resultMap;
            }
            // 设置response
            response.reset();
            response.setHeader("Cache-Control", "private");
            response.setHeader("Pragma", "private");
            response.setContentType("application/vnd.ms-excel;charset=UTF-8");
            response.setHeader("Content-Type", "application/force-download");
            response.setHeader("Content-Disposition", "attachment;filename=" + new String(fileName.getBytes(), "UTF-8"));
            ftpFileService.downloadFileFromFtp(ftpPath + fileName, response);
            resultMap.put("code", 200);
            resultMap.put("message", "SUCCESS");
            return resultMap;
        } catch (Exception e) {
            log.error("下载异常", e);
        }
        resultMap.put("code", 400);
        resultMap.put("message", "下载失败");
        return resultMap;
    }

    @RequestMapping(value = "download-all")
    @ResponseBody
    public Map downloadAll(HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> resultMap = new HashedMap();
        String startDateStr = request.getParameter("start_day");
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        if (StringUtils.isBlank(startDateStr)) {
            resultMap.put("code", 400);
            resultMap.put("message", "日期不能为空");
            return resultMap;
        }
        try {
            Date startDate = sdf.parse(DateUtils.getFirstDayOfMonth(sdf.parse(startDateStr)));
            Date endDate = sdf.parse(DateUtils.getLastDayOfMonth(sdf.parse(startDateStr)));
            String ftpPath = pbcReportHelper.getPbcFtpDir(new SimpleDateFormat("yyyyMM").format(startDate));
            String fileName = pbcReportHelper.getPbcZipFileName(startDate, endDate, pbcReportHelper.getCompanyName());
            ftpFileService.downloadAndCompressFromFtp(ftpPath, fileName, FILE_SUFFIX, response);
        } catch (Exception e) {
            log.error("下载异常", e);
        }
        resultMap.put("code", 400);
        resultMap.put("message", "下载失败");
        return resultMap;
    }

    private Map<String, Object> getTotalReportList(Date startDate, Date endDate) {
        Map<String, Object> resultMap = new HashMap<>();
        List<Map<String, Object>> dataList = new ArrayList<>();
        List<TableModeEnum> tables = pbcReportHelper.getPbcReportTablesDP();

        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMM");
        for (TableModeEnum tableMode : tables) {
            Map<String, Object> dataMap = new HashMap<>();
            dataMap.put("bank_name", "中国人民银行");
            dataMap.put("report_name", tableMode.getTableName());
            boolean status = ftpFileService.isFileExists(pbcReportHelper.getPbcFtpDirDP(sdf.format(startDate)),
                    pbcReportHelper.getPbcFileNameDP(startDate, endDate, tableMode, pbcReportHelper.getCompanyName()));
            dataMap.put("report_status", status ? "1" : "0");
            dataList.add(dataMap);
        }

        resultMap.put("code", 200);
        resultMap.put("data", dataList);
        return resultMap;
    }

    private Map<String, Object> getCorpReportList(Date startDate, Date endDate, String bankName, List<Integer> ADIDs) {
        Map<String, Object> resultMap = new HashMap<>();
        List<Map<String, Object>> dataList = new ArrayList<>();
        List<TableModeEnum> tables = pbcReportHelper.getPbcReportTablesCorp();

        List<BaseReportEntity> baseReportEntityList = reportService.getBankList(bankName, ADIDs, startDate, endDate);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMM");
        for (BaseReportEntity baseReportEntity : baseReportEntityList) {
            String dir = pbcReportHelper.getPbcFtpDirCorp(sdf.format(startDate), baseReportEntity.getBankName(), baseReportEntity.getAD());
            String[] fileNames = new String[tables.size()];
            for (int i = 0; i < tables.size(); i++) {
                fileNames[i] = pbcReportHelper.getPbcFileNameCorp(startDate, endDate, tables.get(i), pbcReportHelper
                        .getCompanyName(), baseReportEntity.getBankName(), baseReportEntity.getAD());
            }
            String[][] status = ftpFileService.checkFileStatus(dir, fileNames);
            for (int i = 0; i < fileNames.length; i++) {
                Map<String, Object> element = new HashMap<>();
                element.put("bank_name", baseReportEntity.getBankName());
                element.put("account_id", baseReportEntity.getADID());
                element.put("account_no", baseReportEntity.getAD());
                element.put("account_name", baseReportEntity.getName());
                element.put("report_name", tables.get(i).getTableName());
                element.put("report_status", status[i][1]);
                dataList.add(element);
            }
        }
        resultMap.put("code", 200);
        resultMap.put("data", dataList);
        return resultMap;
    }

    private List<BaseReportEntity> getDataList(TableModeEnum tableMode, Date startDate, Date endDate, List<Integer> ADIDs) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        List<BaseReportEntity> resultList = new ArrayList<>();
        if (TableModeEnum.Table1_1.equals(tableMode) || TableModeEnum.Table1_1_2.equals(tableMode)) {
            List<DataTable1_1> list = pbcReportService.queryForList(tableMode, sdf.format(startDate),
                    sdf.format(endDate), ADIDs);
            resultList.addAll(list);
        }
        if (TableModeEnum.Table1_2.equals(tableMode) || TableModeEnum.Table1_2_1.equals(tableMode)) {
            List<DataTable1_2_1> list = pbcReportService.queryForList(tableMode, sdf.format(startDate),
                    sdf.format(endDate), ADIDs);
            resultList.addAll(list);
        }
        if (TableModeEnum.Table1_3.equals(tableMode)) {
            List<DataTable1_3> list = pbcReportService.queryForList(tableMode, sdf.format(startDate),
                    sdf.format(endDate), ADIDs);
            resultList.addAll(list);
        }
        if (TableModeEnum.Table1_4.equals(tableMode)) {
            List<DataTable1_4> list = pbcReportService.queryForList(tableMode, sdf.format(startDate),
                    sdf.format(endDate), ADIDs);
            resultList.addAll(list);
        }
        if (TableModeEnum.Table1_5.equals(tableMode)) {
            List<DataTable1_5> list = pbcReportService.queryForList(tableMode, sdf.format(startDate),
                    sdf.format(endDate), ADIDs);
            resultList.addAll(list);
        }
        if (TableModeEnum.Table1_6.equals(tableMode) || TableModeEnum.Table1_6_2.equals(tableMode)) {
            List<DataTable1_6> list = pbcReportService.queryForList(tableMode, sdf.format(startDate),
                    sdf.format(endDate), ADIDs);
            resultList.addAll(list);
        }
        if (TableModeEnum.Table1_9.equals(tableMode) || TableModeEnum.Table1_9_2.equals(tableMode)) {
            List<DataTable1_9> list = pbcReportService.queryForList(tableMode, sdf.format(startDate),
                    sdf.format(endDate), ADIDs);
            resultList.addAll(list);
        }
        if (TableModeEnum.Table1_10.equals(tableMode) || TableModeEnum.Table1_10_2.equals(tableMode)) {
            List<DataTable1_10> list = pbcReportService.queryForList(tableMode, sdf.format(startDate),
                    sdf.format(endDate), ADIDs);
            resultList.addAll(list);
        }
        if (TableModeEnum.Table1_11.equals(tableMode)) {
            List<DataTable1_11> list = pbcReportService.queryForList(tableMode, sdf.format(startDate),
                    sdf.format(endDate), ADIDs);
            resultList.addAll(list);
        }
        if (TableModeEnum.Table1_12.equals(tableMode)) {
            List<DataTable1_12> list = pbcReportService.queryForList(tableMode, sdf.format(startDate),
                    sdf.format(endDate), ADIDs);
            resultList.addAll(list);
        }
        if (TableModeEnum.Table1_13.equals(tableMode)) {
            List<DataTable1_13> list = pbcReportService.queryForList(tableMode, sdf.format(startDate),
                    sdf.format(endDate), ADIDs);
            resultList.addAll(list);
        }
        return resultList;
    }
}
