package com.qdb.provmgr.report.pab;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.List;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import com.qdb.provmgr.dao.entity.report.Location;
import com.qdb.provmgr.dao.entity.report.ThreeTuple;



public class ExcelUtil {
	
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
	
	/**
	 * 获取汇总数据
	 * @param textList
	 * @param columnCount
	 * @return
	 */
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
