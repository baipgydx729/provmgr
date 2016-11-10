package com.qdb.dao;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Map;
import java.util.Set;

import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.ResultSetHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.alibaba.druid.pool.DruidDataSource;
import com.google.common.base.Strings;

@Repository
public class DBUtil {

	@Autowired
	private DruidDataSource dataSource;

	final Logger log = LoggerFactory.getLogger(DBUtil.class);

	/***
	 * 获取数据库连接
	 * @return 数据库连接对象Connection
	 * @throws SQLException 
	 */
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
	/* 
	ArrayHandler 将ResultSet转为一个Object[]的ResultSetHandler实现类
	ArrayListHandler 将ResultSet转换为List<Object[]>的ResultSetHandler实现类
	
	MapHandler 将ResultSet的首行转换为一个Map的ResultSetHandler实现类
	MapListHandler 将ResultSet转换为List<Map>的ResultSetHandler实现类
	
	BeanHandler 将ResultSet行转换为一个JavaBean的ResultSetHandler实现类
	BeanListHandler 将ResultSet转换为List<JavaBean>的ResultSetHandler实现类
	
	ColumnListHandler 将ResultSet的一个列转换为List<Object>的ResultSetHandler实现类
	KeyedHandler 将ResultSet转换为Map<Map>的ResultSetHandler实现类
	
	ScalarHandler 将ResultSet的一个列到一个对象。*/
	
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
	
	
	public int update(String sql, Object paras[]) throws SQLException {
		QueryRunner qu = new QueryRunner(true);
		int i = 0;
		Connection conn = null;
		try {
			conn = getConnection();
			i = qu.update(conn, sql, paras);
			
		} catch (SQLException e) {
			log.error("update sql error:",e);
			throw e;
		} finally {
			close(conn);
		}
		return i;
	}
	
	public int update(String sql) throws SQLException {
		QueryRunner qu = new QueryRunner(true);
		int i = 0;
		Connection conn = null;
		try {
			conn = getConnection();
			i = qu.update(conn, sql);
			
		} catch (SQLException e) {
			log.error("update sql error:",e);
			throw e;
		} finally {
			close(conn);
		}
		return i;
	}
	
	
	
	public void execproc(String procname, ArrayList<UParameter> paras,Map<Integer,Object> outmaps) throws SQLException {
		Connection conn = null;
		CallableStatement callStmt = null;
		
		try {
			conn = getConnection();
			procname="{call "+procname+" ("+Strings.repeat("?,", paras.size())+")}";
			callStmt = conn.prepareCall(procname);
			int index=1;
			for (UParameter p : paras) {
				Object pvalue=p.getValue();
				if(p.getInOrOut()==1){
					if(pvalue.getClass()==String.class){
						callStmt.setString(index, pvalue.toString());
					}else if(pvalue.getClass()==int.class  ||
							pvalue.getClass()==Integer.class){
						callStmt.setInt(index, Integer.parseInt(pvalue.toString()));
					}else if(pvalue.getClass()==Double.class  ||
							pvalue.getClass()==double.class){
						callStmt.setDouble(index, Double.parseDouble(pvalue.toString()));
					}
				}else{
					 callStmt.registerOutParameter(index, (int)pvalue);
					 outmaps.put(index, null);
				}
				index++;
			}
            callStmt.execute();
            Set<Integer> keys=outmaps.keySet();
            for (Integer key : keys) {
				outmaps.put(key, callStmt.getObject(key));
			}
		} catch (SQLException e) {
			log.error("execproc error:",e);
			throw e;
		} finally {
			close(callStmt);
			close(conn);
		}
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
	
	public void close(CallableStatement callStmt) {
		if (callStmt != null) {
			try {
				callStmt.close();
			} catch (SQLException e) {
				log.error(e.getMessage());
			} finally {
				callStmt = null;
			}
		}
	}
	

}