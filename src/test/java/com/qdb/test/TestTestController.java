package com.qdb.test;


import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractTransactionalJUnit4SpringContextTests;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;
import org.springframework.transaction.annotation.Transactional;

import com.qdb.controller.TestController;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

@ContextConfiguration("file:src/main/resources/applicationContext.xml")
@RunWith(SpringJUnit4ClassRunner.class)
@Transactional
@TransactionConfiguration(transactionManager="txManager" ,defaultRollback = true)
public class TestTestController extends
		AbstractTransactionalJUnit4SpringContextTests {
	protected Logger log = LoggerFactory.getLogger(TestTestController.class);

	@Before
	public void before() throws Exception {

	}

	@After
	public void after() {
		
		
	}
	
	@Test
	public void Test() throws Exception {
		
		TestController testc = (TestController) this.applicationContext.getBean("testController");

		MockHttpServletRequest request = new MockHttpServletRequest();
		MockHttpServletResponse response = new MockHttpServletResponse();
		
		request.setMethod("GET");
		request.addParameter("username","com.qdb");
		request.addParameter("pwd", "xxxx");
		
		testc.login(request, response);
		String res=response.getContentAsString();
		
		log.info("接口返回{}",res);
		Assert.assertTrue("Error1".equals(res));
		
		
		request = new MockHttpServletRequest();
		response = new MockHttpServletResponse();
		request.setMethod("GET");
		request.addParameter("username","com.qdb");
		request.addParameter("pwd", "com.qdb");
		
		testc.login(request, response);
		String res1=response.getContentAsString();
		
		log.info("接口返回{}",res1);
		Assert.assertNotNull(res1);
		
		Assert.assertTrue(res1.contains("com.qdb"));
		
		Thread.currentThread().sleep(3000);
	}

}
