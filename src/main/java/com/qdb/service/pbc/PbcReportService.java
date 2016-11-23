package com.qdb.service.pbc;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.qdb.dao.BaseReportDao;
import com.qdb.dao.TableModeEnum;
import com.qdb.dao.model.DataTable1_1;

/**
 * @author mashengli
 */
@Service
public class PbcReportService {

    private Logger log = LoggerFactory.getLogger(PbcReportService.class);

    @Autowired
    private BaseReportDao baseReportDao;

    public List<DataTable1_1> queryForTable1_1(String startDate, String endDate, Integer ADID) {
        return baseReportDao.queryForList(TableModeEnum.Table1_1, startDate, endDate, Arrays.asList(ADID), DataTable1_1.class);
    }

    public Map<Integer, List<DataTable1_1>> queryListGroupByADID(String startDate, String endDate, List<Integer> ADIDs) {
        List<DataTable1_1> dataList = baseReportDao.queryForList(TableModeEnum.Table1_1, startDate, endDate, ADIDs, DataTable1_1.class);
        Map<Integer, List<DataTable1_1>> map = new HashMap<>();
        if (CollectionUtils.isEmpty(dataList)) {
            return map;
        }
        for (DataTable1_1 dataTable1_1 : dataList) {
            if (map.containsKey(dataTable1_1.getADID())) {
                map.get(dataTable1_1.getADID()).add(dataTable1_1);
            } else {
                List<DataTable1_1> list = new ArrayList<>();
                list.add(dataTable1_1);
                map.put(dataTable1_1.getADID(), list);
            }
        }
        return map;
    }
}
