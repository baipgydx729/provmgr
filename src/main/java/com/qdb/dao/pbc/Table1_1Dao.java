package com.qdb.dao.pbc;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.alibaba.dubbo.common.utils.CollectionUtils;
import com.alibaba.dubbo.common.utils.StringUtils;
import com.qdb.dao.DBUtil;
import com.qdb.report.pbc.bean.DataTable1_1;
import com.qdb.util.MapUtil;

/**
 * @author mashengli
 */
@Repository
public class Table1_1Dao {

    private Logger log = LoggerFactory.getLogger(Table1_1Dao.class);

    @Autowired
    private DBUtil dbUtil;

    public List<DataTable1_1> queryForList(String startDate, String endDate, List<Integer> ADIDs) {
        if (StringUtils.isBlank(startDate) || StringUtils.isBlank(endDate)) {
            log.info("起始日期不能为空");
            return Collections.EMPTY_LIST;
        }
        Object[] params = null;
        StringBuilder SQL = new StringBuilder();
        SQL.append(" SELECT natuDate,A01,A02,A03,A04,A05,A06,A07,A08,A09,A10,A11,A12,A13,A14")
                .append(" FROM UacAutoCheck.ProvMgr.report_provision_cent_1_1")
                .append(" WHERE natuDate >= ? and natuDate <= ?");
        if (CollectionUtils.isNotEmpty(ADIDs)) {
            int size = ADIDs.size();
            params = new Object[2 + size];
            SQL.append(" AND ADID IN (");
            for (int i = 0; i < size; i++) {
                if (i < size - 1) {
                    SQL.append("?,");
                } else {
                    SQL.append("?)");
                }
                params[i + 2] = ADIDs.get(i);
            }
        } else {
            params = new Object[2];
        }
        params[0] = startDate;
        params[1] = endDate;

        return convert(dbUtil.queryForList(SQL.toString(), params));
    }

    public DataTable1_1 convert(Map<String, Object> rowMap) {
        return (DataTable1_1) MapUtil.convertToBean(DataTable1_1.class, rowMap);
    }

    public List<DataTable1_1> convert(List<Map<String, Object>> rowList) {
        List<DataTable1_1> result = new ArrayList<>();
        for (Map<String, Object> map : rowList) {
            result.add(convert(map));
        }
        return result;
    }

}
