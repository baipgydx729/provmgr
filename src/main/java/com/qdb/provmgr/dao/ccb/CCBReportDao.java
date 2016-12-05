package com.qdb.provmgr.dao.ccb;

import com.qdb.provmgr.dao.DBUtil;
import com.qdb.provmgr.util.StringUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by yuwenzhong on 2016-11-25.
 */
@Repository
public class CCBReportDao {

    @Autowired
    private DBUtil dbUtil;


    /**
     * 查询表1、2、3、6、9、10数据，表1、2、6、9、10部分账户，表3需要根据账户分开展示
     * @param tableType 表名
     * @param bankName 银行名称
     * @param accountNo 账户号
     * @param beginDate 开始日期
     * @param endDate 结束日期
     * @return
     */
    public List<Map<String, Object>> queryDataList(String tableType, String bankName, String name, String adId, String accountNo, String beginDate, String endDate){
        List<String> paramList = new ArrayList<>();
        StringBuffer sqlBuf = this.buildBaseSql(tableType, bankName, name, adId, accountNo, beginDate, endDate, paramList);
        Object[] params = paramList.toArray();
        List<Map<String, Object>> dataList = dbUtil.queryForList(sqlBuf.toString(), params);
        return dataList;
    }

    /**
     * 根据银行名称查询备付金账户
     * @param bankName
     * @return
     */
    public List<String> queryAccountNoList(String bankName){
        List<String> accountNoList = null;

        String sqlStr = "select t.AD, t.bankName_S from UacAutoCheck.ProvMgr.info_ADinfo t where t.isProvision='1' and t.bankName_S=?";
        Object[] params = new Object[]{bankName};

        List<Map<String, Object>> resultList = dbUtil.queryForList(sqlStr, params);
        if(!CollectionUtils.isEmpty(resultList)){
            accountNoList = new ArrayList<>();
            for (Map<String, Object> map :resultList){
                accountNoList.add((String) map.get("AD"));
            }
        }
        return accountNoList;
    }

    /**
     * 拼接sql
     * @param tableType 表名
     * @param bankName 银行名称
     * @param accountNo 账户号
     * @param beginDate 开始日期
     * @param endDate 结束日期
     * @return sql
     */
    private StringBuffer buildBaseSql(String tableType, String bankName, String name, String adId, String accountNo, String beginDate, String endDate, List<String> paramList){
        StringBuffer sqlBuf = new StringBuffer();
        if("1_1".equals(tableType)){
            sqlBuf.append(" SELECT t.bankName_S, t.ADID, t.name, t.AD, DAY(t.natuDate) as 'natuDate', " +
                    " t.A01, t.A02, t.A03, t.A04, t.A05, t.A06, t.A07, " +
                    " t.A08, t.A09, t.A10, t.A11, t.A12, t.A13, t.A14 " +
                    " FROM UacAutoCheck.ProvMgr.report_provision_cent_1_1  t WHERE 1=1");
        }
        if("1_2".equals(tableType)){
            sqlBuf.append(" SELECT t.bankName_S, t.ADID, DAY(t.natuDate) as 'natuDate', " +
                    " t.BB01, t.BB02, t.BB03, t.BB04, t.BB05, t.BB06, t.BB07, t.BB08, t.BB09 " +
                    " FROM UacAutoCheck.ProvMgr.report_provision_cent_1_2_1  t WHERE 1=1 ");
        }
        if("1_3".equals(tableType)){
            sqlBuf.append(" SELECT t.bankName_S, t.AD, t.name, DAY(t.natuDate) as 'natuDate', t.C01 " +
                    " FROM UacAutoCheck.ProvMgr.report_provision_cent_1_3  t WHERE 1=1 ");
        }
        if("1_6".equals(tableType)){
            sqlBuf.append("SELECT t.bankName_S, t.ADID, t.name, t.AD, DAY(t.natuDate) as 'natuDate', " +
                    "t.F01, t.F02, t.F03, t.F04, t.F05, t.F06, t.F07, t.F08, t.F09, t.F10, " +
                    "t.G01, t.G02, t.G03, t.G04, t.G05, t.G06, t.G07, t.G08, t.G09, t.G10, t.G11, t.G12, t.G13, t.G14 " +
                    "  FROM UacAutoCheck.ProvMgr.report_provision_cent_1_6 t WHERE 1=1 " );
        }
        if("1_9".equals(tableType)){
            sqlBuf.append(" SELECT  t.bankName_S, t.ADID, t.name, t.AD, " +
                    "DAY(t.natuDate) as 'natuDate', t.J01, t.J02, t.J03, t.J04 " +
                    " FROM UacAutoCheck.ProvMgr.report_provision_cent_1_9 t WHERE 1=1 ");
        }
        if("1_10".equals(tableType)){
            sqlBuf.append(" SELECT bankName_S, t.ADID, t.name, t.AD, DAY(t.natuDate) as 'natuDate', " +
                    "t.K01, t.K02, t.K03, t.K04, t.K05, t.K06, t.K07, t.K08, t.K09, t.K10, t.K11, t.K12, " +
                    "t.K13, t.K14, t.K15, t.K16, t.K17, t.K18, t.K19, t.K20, t.K21, t.K22, t.K23, t.K24 " +
                    " FROM UacAutoCheck.ProvMgr.report_provision_cent_1_10 t WHERE 1=1" );
        }

        if (StringUtils.isNotEmpty(bankName)){
            sqlBuf.append(" AND t.bankName_S = ? ");
            paramList.add(bankName);
        }
        if(StringUtils.isNotEmpty(name)){
            sqlBuf.append(" AND t.name = ? ");
            paramList.add(name);
        }
        if (StringUtils.isNotEmpty(adId)){
            sqlBuf.append(" AND t.ADID = ? ");
            paramList.add(adId);
        }
        if (StringUtils.isNotEmpty(accountNo)){
            sqlBuf.append(" AND t.AD = ? ");
            paramList.add(accountNo);
        }
        if (StringUtils.isNotEmpty(beginDate)){
            sqlBuf.append(" AND t.natuDate >= ? ");
            paramList.add(beginDate);
        }
        if (StringUtils.isNotEmpty(endDate)){
            sqlBuf.append(" AND t.natuDate <= ? ");
            paramList.add(endDate);
        }
        sqlBuf.append(" ORDER BY t.natuDate ");
        return sqlBuf;
    }

}
