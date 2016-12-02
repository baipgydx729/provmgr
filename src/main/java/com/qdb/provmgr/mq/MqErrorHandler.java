package com.qdb.provmgr.mq;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.ErrorHandler;

public class MqErrorHandler implements ErrorHandler{

	private final Logger log = LoggerFactory.getLogger(MqErrorHandler.class);
		
	public void handleError(Throwable t) {
		log.error("rabbit mq uncatched exception =", t);
	}
}