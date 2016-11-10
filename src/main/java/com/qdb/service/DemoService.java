package com.qdb.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.qdb.dao.DemoDao;

import com.alibaba.fastjson.JSON;

/**
 * Service层 调用LoginDao并返回结果 Retuen String
 * @author fangaobo
 *
 */
@Service
public class DemoService {

	// 根据类型注入Bean
	@Autowired
	private DemoDao demoDao;

	public String loginDo(String UserName, String pwd) throws Exception {

		String jsonResult = "";
		Map<String, Object> ldResult = null;

		if (UserName != "" && pwd != "") {

			// 调用Dao作数据查询
			ldResult = demoDao.checkLogin(UserName, pwd);

			if (ldResult == null || ldResult.size() == 0 || ldResult.isEmpty()) {
				jsonResult = "Error1";
			} else {
				// 转为JSON字符串
				jsonResult = JSON.toJSONString(ldResult);
			}

		} else {
			return "Error2";
		}

		return jsonResult;
	}

	public String query() throws Exception {

		String jsonResult = "";
		Map<String, Object> ldResult = null;
			// 调用Dao作数据查询
			ldResult = demoDao.query();

			if (ldResult == null || ldResult.size() == 0 || ldResult.isEmpty()) {
				jsonResult = "no result";
			} else {
				// 转为JSON字符串
				jsonResult = JSON.toJSONString(ldResult);
			}

		return jsonResult;
	}

}