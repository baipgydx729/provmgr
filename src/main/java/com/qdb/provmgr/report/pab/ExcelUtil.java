package com.qdb.provmgr.report.pab;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import com.qdb.provmgr.dao.entity.report.Location;
import com.qdb.provmgr.dao.entity.report.ThreeTuple;



public class ExcelUtil {
	
	
	public static void main(String[] args) throws Exception {
		
		/*List<Object[]> list = new ArrayList<Object[]>(); 
		Object[] object = new Object[]{1.0,1.0};
		Object[] object1 = new Object[]{2.0,2.0};
		list.add(object);
		list.add(object1);
		Object[] sumObject = getSumList(list);
		System.out.println(list);*/
		
		
		String filePath = "/Users/caoqiang/Desktop/ceshi/b.xls";
		String filePath2 = "/Users/caoqiang/Desktop/ceshi/A.xls";
		HSSFWorkbook workbook = getNewExcel(filePath);
		HSSFSheet targetSheet = workbook.getSheetAt(0);
		int lastRowNum = targetSheet.getLastRowNum();
		for (int i = 0; i < 20; i++) {
			Row row = targetSheet.createRow(lastRowNum);
			Cell cell = row.createCell(0);
			cell.setCellValue("nihao"+i);
			lastRowNum++;
		}
		//sheet.shiftRows(insertRowNum, sheet.getLastRowNum(), 1,true,false);
		for (int i = 0; i < 5; i++) {
			
			targetSheet.shiftRows(i, targetSheet.getLastRowNum(), 1,true,false);
			//targetSheet.createRow(i);
			
		}
		exportExcel(workbook, filePath2);
		
		
	}
	
	
	/**
	 * 
	 * @param sourceList 从数据库取出的原始数据
	 * @param titleMap  标题的相关参数
	 * @param titleList 返回的标题list
	 * @param textList  返回的主题日期数据
	 * @param sumList   返回的汇总数据
	 * @param specialColumn 主题数据里特别的列
	 * @throws Exception
	 */
	public static<T> void dealSourceList(List<T> sourceList,
			Map<String, ThreeTuple<String, Location, String>> titleMap,
			List<ThreeTuple<String, Location, String>> titleList,
			List<List<Double>> textList, List<Double> sumList,
			String specialColumn) throws Exception {
		
		boolean firstSumFlag = true;
		for (int i=0;i<sourceList.size();i++) {
			//每天的数据list在for循环里面new
			List<Double> everyDayList = new ArrayList<Double>();
			T model =  sourceList.get(i);
			Field[] fieldList = model.getClass().getDeclaredFields();
			for (int j=0; j<fieldList.length; j++) {
				Field field = fieldList[j];
				String fildName = field.getName();
				String name = fildName.substring(0, 1).toUpperCase() + fildName.substring(1);
				Method m = model.getClass().getMethod("get" + name);
	            String type = field.getGenericType().toString();
				if (type.equals("class java.lang.String")) {
					if(firstSumFlag){//由于表头重复，取第一次
						if(titleMap.containsKey(fildName)){
							String value = (String) m.invoke(model);
							if (value == null) {
								value = "";//数据库为null的时候暂时定位空，定义为返回值变量最好
							}
							ThreeTuple<String,Location,String> target = titleMap.get(fildName);
							target.setFirst(value);
							titleList.add(target);
						}
					}
				}
				if (type.equals("class java.lang.Double")) {
					Double value = (Double) m.invoke(model);
					everyDayList.add(value);
					if(firstSumFlag){
						sumList.add(value);
					}else{
						int pos = everyDayList.size()-1;
						Double periousValue = sumList.get(pos);
						sumList.remove(pos);
						sumList.add(pos, periousValue+value);
					}
				}
				
			}
			dealEveryDayList(specialColumn,everyDayList);
			//将每天的数据放到总的list里
			textList.add(everyDayList);
			firstSumFlag = false;
			
            
		}
		//处理汇总list
		dealEveryDayList(specialColumn,sumList);
	}
	
	//处理特殊数据
	public static void dealEveryDayList(String specialColumn,
			List<Double> list) {
		String[] specialList = specialColumn.split(",");
		for (String string : specialList) {
			int pos = Integer.parseInt(string)-1;
			list.add(pos, 0.0);
		}
	}
	
	//将竖向数据填入表格
	public static void setVerticalTextValue(HSSFSheet sheet,List<List<Double>> textValueList, Location textLocation) {
		int rowNum = textLocation.getRow();
		int columnNum = textLocation.getColumn();
		if(null != textValueList && 0 != textValueList.size()){
			for (List<Double> list : textValueList) {
				if(null != list && 0 != list.size()){
					for (Double value : list) {
						if(null != value){
							Row row = sheet.getRow(rowNum);
							if(null != row){
								Cell cell = row.getCell(columnNum);
								if(null != cell){
									cell.setCellValue(value);
								}
							}
						}
						rowNum++;
					}
					columnNum++;
					rowNum = textLocation.getRow();
				}
			}
		}
	}

	//将水平数据填入表格
	public static void setHorizontalTextValue(HSSFSheet sheet,List<Object[]> textValueList, Location textLocation, String specialColumn) {
		int rowNum = textLocation.getRow();
		int columnNum = textLocation.getColumn();
		if(null != textValueList && 0 != textValueList.size()){
			for (Object[] object : textValueList) {
				if(null != object && 0 != object.length){
					for (int i = 0;i<object.length;i++) {
						if(specialColumn.contains(columnNum+1+"")){
							Double specialvalue = 0.0;
							Row row = sheet.getRow(rowNum);
							if(null != row){
								Cell cell = row.getCell(columnNum);
								if(null != cell){
									cell.setCellValue(specialvalue);
								}
							}
							columnNum++;
						}
						Double value = null;
						if(null == object[i]){
							value = 0.0;
						}else{
							BigDecimal BigDecimalValue = (BigDecimal)object[i];
							value = BigDecimalValue.doubleValue()/10000;//填表单位是万
						}
						if(null != value){//判空为了给不需要填值的地方留的
							Row row = sheet.getRow(rowNum);
							if(null != row){
								Cell cell = row.getCell(columnNum);
								if(null != cell){
									cell.setCellValue(value);
								}
							}
						}
						columnNum++;
					}
				}
				columnNum = textLocation.getColumn();
				rowNum++;
			}
		}
		
	}
	
	/*//将水平数据填入表格
	public static void setHorizontalTextValue(Sheet sheet,List<List<Double>> textValueList, Location textLocation) {
		int rowNum = textLocation.getRow();
		int columnNum = textLocation.getColumn();
		if(null != textValueList && 0 != textValueList.size()){
			for (List<Double> list : textValueList) {
				if(null != list && 0 != list.size()){
					for (Double value : list) {
						if(null != value){//判空为了给不需要填值的地方留的
							Row row = sheet.getRow(rowNum);
							if(null != row){
								Cell cell = row.getCell(columnNum);
								if(null != cell){
									cell.setCellValue(value);
								}
							}
						}
						columnNum++;
					}
				}
			}
			columnNum = textLocation.getColumn();
			rowNum++;
		}
		
	}*/
	
	
	
	
	
	
	//填写表头
	public static void setTitleValue(List<ThreeTuple<String,Location,String>> titleList,HSSFSheet sheet) {
		if(null != titleList && 0 != titleList.size()){
			for (ThreeTuple<String,Location,String> threeTuple : titleList) {
				Location location = threeTuple.second;
				if(null != location){
					Row row = sheet.getRow(location.getRow());
					if(null != row){
						Cell cell = row.getCell(location.getColumn());
						if(null != cell){
							cell.setCellValue(threeTuple.first);
						}
					}
				}
			}
		}
	}
	
	//将excel写到本地
	public static void exportExcel(HSSFWorkbook workbook,String path) throws IOException {
		FileOutputStream out = null;
		try {
			//String filePath = "C://Users//caoqiang//Desktop//ceshi//61.xls";
			out = new FileOutputStream(path);
			workbook.write(out);
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			out.close();
		}
		
	}
	
	//从本地读取文件
	public static HSSFWorkbook getNewExcel(String filePath) throws IOException {
		HSSFWorkbook workbook = null;
		InputStream is = null;
		//String fileName = "C://Users//caoqiang//Desktop//ceshi//6.xls";
		try {
			is = new FileInputStream(filePath);
			workbook = new HSSFWorkbook(is);
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			is.close();
		}
		return workbook;
		
	}

	/**
	 * 填补天数不够的情况
	 * @param textList 主题数据list
	 * @param count 行数
	 * @param columnCount 列数，
	 */
	public static void fillUpList(List<Object[]> textList, int count, int columnCount) {
		Object[] fillObject = new Object[columnCount];
		int pos = textList.size();
		while(count >textList.size()){
			textList.add(pos, fillObject);
		}
	}

	
	public static Object[] getSumList(List<Object[]> textList,int columnCount) {
		Object[] sumObject = new Object[columnCount];
		if(null != textList && 0 != textList.size()){
			for (int i = 0; i < textList.size(); i++) {
				Object[] sourceObject = textList.get(i);
				for (int j = 0; j < textList.get(i).length; j++) {
					BigDecimal value = null;
					if(null == sourceObject[j]){
						value = new BigDecimal(0.0);
					}else{
						value = (BigDecimal) sourceObject[j];
					}
					BigDecimal perviousValue = null;
					if(null == sumObject[j]){
						perviousValue = new BigDecimal(0.0);
					}else{
						perviousValue= (BigDecimal) sumObject[j];
					}
					sumObject[j] = value.add(perviousValue);
				}
			}
		}
		return sumObject;
	}
	
}
