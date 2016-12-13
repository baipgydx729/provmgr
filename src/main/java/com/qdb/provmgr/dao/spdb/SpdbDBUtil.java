package com.qdb.provmgr.dao.spdb;

import java.sql.Connection;
import java.sql.SQLException;

import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.ResultSetHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.alibaba.druid.pool.DruidDataSource;

@Repository
public class SpdbDBUtil {

	@Autowired
	private DruidDataSource dataSource;

	final Logger log = LoggerFactory.getLogger(SpdbDBUtil.class);

	public Connection getConnection() throws SQLException {
		Connection conn = null;
		try {
			conn = dataSource.getConnection();
		} catch (SQLException e) {
			log.error("数据库连接异常:",e);
			throw e;
		}
		return conn;
	}


	public <T> T query(String sql, Object paras[], ResultSetHandler<T> rsh) throws SQLException {
		QueryRunner qu = new QueryRunner();
		T result = null;
		Connection conn = null;
		try {
			conn = getConnection();
			result = (T) qu.query(conn, sql, rsh, paras);
		} catch (SQLException e) {
			log.error("query sql error:",e);
			throw e;
		} finally {
			close(conn);
		}

		return result;
	}

	public void close(Connection conn) {
		if (conn != null) {
			try {
				conn.close();
			} catch (SQLException e) {
				log.error(e.getMessage());
			} finally {
				conn = null;
			}
		}
	}

	

}