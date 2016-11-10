package com.qdb.dao;

import java.util.Map;

import org.apache.commons.dbutils.handlers.MapHandler;
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

	public Map<String, Object> checkLogin(String UserName, String pwd)
			throws Exception {

		String sql = "SELECT * FROM dbo.users WHERE UserName=? AND pwd=?";
		Map<String, Object> result = dbutil.query(sql, new Object[] { UserName,
				pwd }, new MapHandler());
		return result;
	}

	public Map<String, Object> query()
			throws Exception {

		String sql = "SELECT * FROM dbo.users";
		Map<String, Object> result = dbutil.query(sql,null,new MapHandler());

		return result;

	}

}
