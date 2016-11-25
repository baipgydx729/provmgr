package com.qdb.service.ccb;

import com.qdb.dao.ccb.CCBReportDao;
import com.qdb.dao.entity.report.DataTable1_3;
import com.qdb.dao.model.DataTable3Entity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 * Created by yuwenzhong on 2016-11-23.
 */
@Service
public class CCBReportService {

    @Autowired
    private CCBReportDao ccbReportDao;

    /**
     * 查询表1、2、3、6、9、10数据
     * @param tableType
     * @param bankName
     * @param accountNo
     * @param beginDate
     * @param endDate
     * @return
     */
    public List<Map<String, Object>> findTableDataList(String tableType, String bankName, String accountNo, String beginDate, String endDate){
        List<Map<String, Object>> dataList = ccbReportDao.queryDataList(tableType, bankName, accountNo, beginDate, endDate);
        return dataList;
    }


    /**
     * 针对表3的数据，封装单行数据对象
     * @param list
     * @return
     */
    public DataTable3Entity convertResult2Entity(List<Map<String, Object>> list){
        DataTable3Entity rowEntity13 = new DataTable3Entity();
        List<DataTable1_3> rowC01List = new LinkedList<>();
        int days = list.size();
        for (int i = 0; i < days; i++) {
            DataTable1_3 dataTable3 = new DataTable1_3();

            Map<String, Object> map = list.get(i);
            dataTable3.setC01((BigDecimal) map.get("C01"));
            rowC01List.add(dataTable3);
        }
        Map<String, Object> map = list.get(0);
        rowEntity13.setBankName((String) map.get("bankName_S"));
        rowEntity13.setAccoutNo((String) map.get("AD"));
        rowEntity13.setAccountName((String) map.get("name"));
        rowEntity13.setList(rowC01List);
        return rowEntity13;
    }

}
