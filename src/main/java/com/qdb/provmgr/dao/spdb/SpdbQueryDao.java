package com.qdb.provmgr.dao.spdb;

import java.sql.SQLException;
import java.util.List;

import org.apache.commons.dbutils.handlers.BeanListHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

/**
 * 
 * @author fanjunjian
 *
 */
@Repository
public class SpdbQueryDao {

	private static Logger log = LoggerFactory.getLogger(SpdbQueryDao.class);

	@Autowired
	private SpdbDBUtil dbutil;

	public <T> List<T> query(String bankName, String beginDate, String endDate, String tableName, Class<T> t) throws SQLException {

		String sql = "SELECT  * FROM " + tableName + " WHERE NATUDATE >= ? AND NATUDATE <= ? AND BANKNAME_S = ? ORDER BY NATUDATE ASC";
		Object[] queryArra = { beginDate, endDate, bankName };
		List<T> result = null;
		try {
			result = dbutil.query(sql, queryArra, new BeanListHandler<>(t));
		} catch (SQLException e) {
			log.error("查询数据出错，sql:{}",sql);
			throw new SQLException("DAO层数据处理异常，{}",e.getMessage());
		}
		return result;
	}

}
