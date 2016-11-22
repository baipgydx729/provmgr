package com.qdb.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

/**
 * Dao层 查询数据并返回 Return Map
 * 
 * @author fangaobo
 */
@Repository
public class DemoDao {

	// 根据类型注入Bean
	@Autowired
	private DBUtil dbutil;

//	public Map<String, Object> checkLogin(String UserName, String pwd)
//			throws Exception {
//
//		String sql = "SELECT * FROM dbo.users WHERE UserName=? AND pwd=?";
//		Map<String, Object> result = dbutil.query(sql, new Object[] { UserName,
//				pwd }, new MapHandler());
//		return result;
//	}
//
//	public Map<String, Object> query()
//			throws Exception {
//
//		String sql = "SELECT * FROM dbo.users";
//		Map<String, Object> result = dbutil.query(sql,null,new MapHandler());
//
//		return result;
//
//	}
//
//    public List<DataTable1_1> findDataTable1_1List(String startDate, String endDate, List<Integer> ADIDs) {
//        if (StringUtils.isBlank(startDate) || StringUtils.isBlank(endDate)) {
//            return Collections.EMPTY_LIST;
//        }
//        Object[] params = null;
//        StringBuilder SQL = new StringBuilder();
//        SQL.append(" SELECT natuDate,A01,A02,A03,A04,A05,A06,A07,A08,A09,A10,A11,A12,A13,A14")
//                .append(" FROM UacAutoCheck.ProvMgr.report_provision_cent_1_1")
//                .append(" WHERE natuDate >= ? and natuDate <= ?");
//        if (CollectionUtils.isNotEmpty(ADIDs)) {
//            int size = ADIDs.size();
//            params = new Object[2 + size];
//            SQL.append(" AND ADID IN (");
//            for (int i = 0; i < size; i++) {
//                if (i < size - 1) {
//                    SQL.append("?,");
//                } else {
//                    SQL.append("?)");
//                }
//                params[i + 2] = ADIDs.get(i);
//            }
//        } else {
//            params = new Object[2];
//        }
//        params[0] = startDate;
//        params[1] = endDate;
//
//        try {
//            List<Map<String, Object>> list = dbutil.queryForList(SQL.toString(), params);
//            return list;
//        } catch (SQLException e) {
//            e.printStackTrace();
//        }
//        return Collections.EMPTY_LIST;
//    }

}
