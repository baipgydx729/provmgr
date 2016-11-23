package com.qdb.controller;

import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.google.common.base.Preconditions;

/**
 * Login Demo
 * 获取请求和参数并返回处理结果
 * @author fangaobo
 */
@Controller
public class TestController {
	
	private static Logger log = LoggerFactory.getLogger(TestController.class);
	
	//根据类型注入Bean

	@Autowired
	private  AmqpTemplate mqsender;


	/**
	 * 根据用户名和密码登录
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value="/login.do",method=RequestMethod.GET)//POST
	public void login(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		//设置请求和响应类型与编码
		response.setContentType("text/html;charset=\"UTF-8\"");
		PrintWriter pw=response.getWriter();
		//获取参数
		String UserName = request.getParameter("username");
		String pwd = request.getParameter("pwd");
		
		String resultJson = null;
		//调用Service层

		pw.print(resultJson);
		pw.flush();
		pw.close();
	}
	
	
	/**
	 * 查询数据库
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value="/query.do", method = RequestMethod.GET)
	public String query(HttpServletRequest request, HttpServletResponse response) throws Exception{
        return "main";
	}
	
	
	/**
	 * 消息队列测试
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value="/callrpc.do",method=RequestMethod.GET)//POST
	public void callrpc(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		//设置请求和响应类型与编码
		response.setContentType("text/html;charset=\"UTF-8\"");
		PrintWriter pw=response.getWriter();
		
//		int result=demoadd.add(100, 160);
		int result=100;
		pw.print(result);
		pw.flush();
		pw.close();
	}
	
	/**
	 * 调用远程服务
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value="/mq.do",method=RequestMethod.GET)//POST
	public void mq(HttpServletRequest request, HttpServletResponse response) throws Exception{
		//设置请求和响应类型与编码
		response.setContentType("text/html;charset=\"UTF-8\"");
		PrintWriter pw=response.getWriter();
		String message="demo message";
		
		String exchange=(String)request.getParameter("exchange");
		String key =(String)request.getParameter("key");
		
		
		Preconditions.checkArgument(Preconditions.checkNotNull(exchange, "exchange不能为NULL").length() > 0, "exchange不能为\'\'");
		Preconditions.checkArgument(Preconditions.checkNotNull(key, "key不能为NULL").length() > 0, "key不能为\'\'");
		
		mqsender.convertAndSend(exchange,key,message);
		
		pw.print(message);
		log.info("发送消息{}",message);
		pw.flush();
		pw.close();
	}


	
}
