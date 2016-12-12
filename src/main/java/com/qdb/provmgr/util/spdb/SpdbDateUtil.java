package com.qdb.provmgr.util.spdb;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class SpdbDateUtil {
	
	public static Logger log = LoggerFactory.getLogger(SpdbDateUtil.class);
	
	public static SimpleDateFormat sf_yyyyMMdd = new SimpleDateFormat("yyyyMMdd");
	
	public static SimpleDateFormat sf_yyyyMM = new SimpleDateFormat("yyyyMM");
	
	public static SimpleDateFormat sf_yyyy_MM_dd = new SimpleDateFormat("yyyy-MM-dd");
	
	
	/**
	 * 格式化日期   yyyyMMdd
	 * @param dateStr  yyyy-MM-dd
	 * @return
	 */
	public static String  getYYYYMMDD(String yyyy_MM_dd){
	
		Date date = null;
		try {
			date = sf_yyyy_MM_dd.parse(yyyy_MM_dd);
		} catch (ParseException e) {
			log.error("日期格式化出错，原日期：{}",yyyy_MM_dd);
		}
		return sf_yyyyMMdd.format(date);
	}
	
	
	public static String getYYYYMMDD(Date date){
		return sf_yyyyMMdd.format(date);		
	}
	
	/**
	 * 根据日期获取yyyyMMdd
	 * @param date
	 * @return
	 */
	public static String  getYYYYMM(String yyyy_MM_dd){
		
		Date date = null;
		try {
			date = sf_yyyy_MM_dd.parse(yyyy_MM_dd);
		} catch (ParseException e) {
			log.error("日期格式化出错，原日期：{}",yyyy_MM_dd);
		}
		return sf_yyyyMM.format(date);
	}
	
	public static String getYYYYMM(Date date){
		return sf_yyyyMM.format(date);		
	}
	
	/**
	 * yyyyMM 日期
	 * @param date1
	 * @param date2
	 * @return
	 * @throws ParseException 
	 */
	public static int monthShort(String date1, String date2) throws ParseException{
			Date date_1 = sf_yyyyMM.parse(date1); 
			Date date_2 = sf_yyyyMM.parse(date2);
			
			Calendar cal1 =Calendar.getInstance();
			cal1.setTime(date_1);
			Calendar cal2 =Calendar.getInstance();
			cal2.setTime(date_2);
			if(cal1.before(cal2)){
				for(int i=0; i<12; i++){
					cal1.setTime(date_1);
					cal1.add(Calendar.MONTH, i);
					if(cal1.equals(cal2)){
						return i;
					}
				}
			}else{
				for(int i=0; i<12; i++){
					cal2.setTime(date_2);
					cal2.add(Calendar.MONTH, i);
					if(cal1.equals(cal2)){
						return i;
					}
				}
			}
				
			return 12;

	}
	
	
//	public static String getLastMonthByToday(Date date){
//		Calendar cal = Calendar.getInstance();
//		cal.setTime(date);
//		cal.add(Calendar.MONTH, -1);
//		String lastMonth = sf_yyyyMM.format(cal.getTime());
//		return lastMonth;
//	}
//	
	/**
	 * 获取月初第一天
	 * @param date
	 * @return
	 */
	public static String getFirstDayOfMonth(Date date){
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.DAY_OF_MONTH, 1);
		return sf_yyyy_MM_dd.format(calendar.getTime());
	}
	
	/**
	 * 获取月末最后一天
	 * @param date
	 * @return
	 */
	public static String getLastDayOfMonth(Date date){
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(new Date());
		calendar.add(Calendar.MONTH, 1);
		calendar.set(Calendar.DAY_OF_MONTH, 0);
		return sf_yyyy_MM_dd.format(calendar.getTime());
	}
	
}
