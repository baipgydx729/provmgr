package com.qdb.provmgr.service.pab.impl;

import java.io.IOException;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.qdb.provmgr.dao.entity.report.Location;
import com.qdb.provmgr.dao.entity.report.ThreeTuple;
import com.qdb.provmgr.dao.entity.report.pab.PABEntity;
import com.qdb.provmgr.dao.pab.PABDao;
import com.qdb.provmgr.report.pab.ExcelUtil;
import com.qdb.provmgr.service.pab.PABService;
import com.qdb.provmgr.util.POIUtil;
import com.qdb.provmgr.util.constant.TableEnum;


/**
 * 平安银行
 *
 */
@Service
public class PABServiceImpl implements PABService{
	
	@Autowired
	private PABDao pabDao;
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	
	@Override
	public void createEachTypeExcel(String tempRelativePath,String destFileName, String destExcelPath, String tableType, String beginDate,String endDate) throws Exception {
		switch (tableType) {
		case "T1-1":
			reportPABTableT1_1(tempRelativePath,destFileName,destExcelPath,beginDate,endDate);
			break;
		case "T1-2":
			reportPABTableT1_2(tempRelativePath,destFileName,destExcelPath,beginDate,endDate);
			break;	
		case "T1-2-1":
			reportPABTableT1_2_1(tempRelativePath,destFileName,destExcelPath,beginDate,endDate);
			break;
		case "T1-3":
			reportPABTableT1_3(tempRelativePath,destFileName,destExcelPath,beginDate,endDate);
			break;
		case "T1-6":
			reportPABTableT1_6(tempRelativePath,destFileName,destExcelPath,beginDate,endDate);
			break;
		case "T1-9":
			reportPABTableT1_9(tempRelativePath,destFileName,destExcelPath,beginDate,endDate);
			break;
		case "T1-10":
			reportPABTableT1_10(tempRelativePath,destFileName,destExcelPath,beginDate,endDate);
			break;
		case "T1-13":
			reportPABTableT1_13(tempRelativePath,destFileName,destExcelPath,beginDate,endDate);
			break;
		default:
			break;
		}
		
	}


	private void reportPABTableT1_1(String tempRelativePath,String destFileName, String destExcelPath, String beginDate, String endDate) throws Exception {
		Date nowTime = new Date();
		String nowTimeString = sdf.format(nowTime);
		ThreeTuple<String,Location,String> insertReportTime = 
				new ThreeTuple<String,Location,String>(nowTimeString,new Location(1,0),"String");
		HSSFWorkbook  workBook = ExcelUtil.getNewExcel(tempRelativePath);
		List<PABEntity> pabEntityList =  pabDao.getBaseInfo();
		int sourceSheetNumber = 1;
		copySheet(workBook,pabEntityList.size(),sourceSheetNumber);
		Map<String, Location> everyAccountTitleLocationMap = new HashMap<String, Location>();
		everyAccountTitleLocationMap.put("insertReportTime", new Location(1,0));
		everyAccountTitleLocationMap.put("name", new Location(2,2));
		everyAccountTitleLocationMap.put("AD", new Location(3,2));
		int count = 31;
		int columnCount = 14;
		String specialColumn ="4,8,12,17";
		String everyAccountTableType = TableEnum.TABLE_TYPE.T1_1.getValue();
		boolean haveCount = true;
		Location textLocation = new Location(12,1);
		dealEveryAccount(workBook,pabEntityList,everyAccountTitleLocationMap,count,columnCount,
				specialColumn,everyAccountTableType,textLocation,beginDate,endDate,haveCount,sourceSheetNumber);
		List<ThreeTuple<String,Location,String>>  countTitleList = new ArrayList<ThreeTuple<String,Location,String>>();
		HSSFSheet countSheet = workBook.getSheetAt(0);
		//处理账户总计内容
		String tableType = TableEnum.TABLE_TYPE.T1_1.getValue();
		List<Object[]> textList = pabDao.getPABTable("99999",beginDate,endDate,tableType,true);
		Object[] sumList = ExcelUtil.getSumList(textList,columnCount);
		ExcelUtil.fillUpList(textList,count,columnCount);
		textList.add(sumList);
		specialColumn = "4,8,12,17";
		ExcelUtil.setHorizontalTextValue(countSheet, textList, new Location(12,1),specialColumn);
		//处理标题
		countTitleList.add(insertReportTime);
		ExcelUtil.setTitleValue(countTitleList, countSheet);
		ExcelUtil.exportExcel(workBook, destExcelPath+destFileName);
	}

	private void reportPABTableT1_6(String tempRelativePath, String destFileName, String destExcelPath,
			String beginDate, String endDate) throws Exception {
		//String filePath = "C://Users//caoqiang//Desktop//ceshi//6.xls";
		//String filePath2 = "C://Users//caoqiang//Desktop//ceshi//61.xls";
		Date nowTime = new Date();
		String nowTimeString = sdf.format(nowTime);
		ThreeTuple<String,Location,String> insertReportTime = 
				new ThreeTuple<String,Location,String>(nowTimeString,new Location(1,0),"String");
		HSSFWorkbook  workBook = ExcelUtil.getNewExcel(tempRelativePath);
		List<PABEntity> pabEntityList =  pabDao.getBaseInfo();
		int sourceSheetNumber = 1;
		copySheet(workBook,pabEntityList.size(),sourceSheetNumber);
		Map<String, Location> everyAccountTitleLocationMap = new HashMap<String, Location>();
		everyAccountTitleLocationMap.put("insertReportTime", new Location(1,0));
		everyAccountTitleLocationMap.put("name", new Location(2,3));
		everyAccountTitleLocationMap.put("AD", new Location(3,3));
		int count = 31;
		int columnCount = 24;
		String specialColumn ="";
		String everyAccountTableType = TableEnum.TABLE_TYPE.T1_6.getValue();
		boolean haveCount = false;
		Location textLocation = new Location(8,1);
		dealEveryAccount(workBook,pabEntityList,everyAccountTitleLocationMap,count,columnCount,
				specialColumn,everyAccountTableType,textLocation,beginDate,endDate,haveCount,sourceSheetNumber);
		List<ThreeTuple<String,Location,String>>  countTitleList = new ArrayList<ThreeTuple<String,Location,String>>();
		HSSFSheet countSheet = workBook.getSheetAt(0);
		//处理账户总计内容
		String tableType = TableEnum.TABLE_TYPE.T1_6.getValue();
		List<Object[]> textList = pabDao.getPABTable("99999",beginDate,endDate,tableType,true);
		Object[] sumList = ExcelUtil.getSumList(textList,columnCount);
		ExcelUtil.fillUpList(textList,count,columnCount);
		textList.add(sumList);
		specialColumn = "";
		ExcelUtil.setHorizontalTextValue(countSheet, textList, new Location(8,1),specialColumn);
		//处理标题
		countTitleList.add(insertReportTime);
		ExcelUtil.setTitleValue(countTitleList, countSheet);
		ExcelUtil.exportExcel(workBook, destExcelPath+destFileName);
	}

	private void reportPABTableT1_9(String tempRelativePath, String destFileName, String destExcelPath,
			String beginDate, String endDate) throws Exception {
		//String filePath = "C://Users//caoqiang//Desktop//ceshi//SZ_T1_9.xls";
		//String filePath2 = "C://Users//caoqiang//Desktop//ceshi//A.xls";
		Date nowTime = new Date();
		String nowTimeString = sdf.format(nowTime);
		ThreeTuple<String,Location,String> insertReportTime = 
				new ThreeTuple<String,Location,String>(nowTimeString,new Location(1,0),"String");
		HSSFWorkbook  workBook = ExcelUtil.getNewExcel(tempRelativePath);
		List<PABEntity> pabEntityList =  pabDao.getBaseInfo();
		int sourceSheetNumber = 1;
		copySheet(workBook,pabEntityList.size(),sourceSheetNumber);
		Map<String, Location> everyAccountTitleLocationMap = new HashMap<String, Location>();
		everyAccountTitleLocationMap.put("insertReportTime", new Location(1,0));
		everyAccountTitleLocationMap.put("name", new Location(2,2));
		everyAccountTitleLocationMap.put("AD", new Location(3,2));
		int count = 31;
		int columnCount = 4;
		String specialColumn ="";
		String everyAccountTableType = TableEnum.TABLE_TYPE.T1_9.getValue();
		boolean haveCount = false;
		Location textLocation = new Location(6,1);
		dealEveryAccount(workBook,pabEntityList,everyAccountTitleLocationMap,count,columnCount,
				specialColumn,everyAccountTableType,textLocation,beginDate,endDate,haveCount,sourceSheetNumber);
		List<ThreeTuple<String,Location,String>>  countTitleList = new ArrayList<ThreeTuple<String,Location,String>>();
		HSSFSheet countSheet = workBook.getSheetAt(0);
		//处理账户总计内容
		String tableType = TableEnum.TABLE_TYPE.T1_9.getValue();
		List<Object[]> textList = pabDao.getPABTable("99999",beginDate,endDate,tableType,true);
		Object[] sumList = ExcelUtil.getSumList(textList,columnCount);
		ExcelUtil.fillUpList(textList,count,columnCount);
		textList.add(sumList);
		specialColumn = "";
		ExcelUtil.setHorizontalTextValue(countSheet, textList, new Location(6,1),specialColumn);
		//处理标题
		countTitleList.add(insertReportTime);
		ExcelUtil.setTitleValue(countTitleList, countSheet);
		ExcelUtil.exportExcel(workBook, destExcelPath+destFileName);
		
	}
	
	private void reportPABTableT1_10(String tempRelativePath, String destFileName, String destExcelPath,
			String beginDate, String endDate) throws Exception {
		//String filePath = "C://Users//caoqiang//Desktop//ceshi//SZ_T1_10.xls";
		//String filePath2 = "C://Users//caoqiang//Desktop//ceshi//A.xls";
		Date nowTime = new Date();
		String nowTimeString = sdf.format(nowTime);
		ThreeTuple<String,Location,String> insertReportTime = 
				new ThreeTuple<String,Location,String>(nowTimeString,new Location(1,0),"String");
		HSSFWorkbook  workBook = ExcelUtil.getNewExcel(tempRelativePath);
		List<PABEntity> pabEntityList =  pabDao.getBaseInfo();
		int sourceSheetNumber = 1;
		copySheet(workBook,pabEntityList.size(),sourceSheetNumber);
		Map<String, Location> everyAccountTitleLocationMap = new HashMap<String, Location>();
		everyAccountTitleLocationMap.put("insertReportTime", new Location(1,0));
		everyAccountTitleLocationMap.put("name", new Location(2,3));
		everyAccountTitleLocationMap.put("AD", new Location(3,3));
		int count = 31;
		int columnCount = 24;
		String specialColumn ="";
		String everyAccountTableType = TableEnum.TABLE_TYPE.T1_10.getValue();
		boolean haveCount = false;
		Location textLocation = new Location(9,1);
		dealEveryAccount(workBook,pabEntityList,everyAccountTitleLocationMap,count,columnCount,
				specialColumn,everyAccountTableType,textLocation,beginDate,endDate,haveCount,sourceSheetNumber);
		List<ThreeTuple<String,Location,String>>  countTitleList = new ArrayList<ThreeTuple<String,Location,String>>();
		HSSFSheet countSheet = workBook.getSheetAt(0);
		//处理账户总计内容
		String tableType = TableEnum.TABLE_TYPE.T1_10.getValue();
		List<Object[]> textList = pabDao.getPABTable("99999",beginDate,endDate,tableType,true);
		Object[] sumList = ExcelUtil.getSumList(textList,columnCount);
		ExcelUtil.fillUpList(textList,count,columnCount);
		textList.add(sumList);
		specialColumn = "";
		ExcelUtil.setHorizontalTextValue(countSheet, textList, new Location(9,1),specialColumn);
		//处理标题
		countTitleList.add(insertReportTime);
		ExcelUtil.setTitleValue(countTitleList, countSheet);
		ExcelUtil.exportExcel(workBook, destExcelPath+destFileName);
		
	}
	
	private void reportPABTableT1_2_1(String tempRelativePath, String destFileName, String destExcelPath,
			String beginDate, String endDate) throws Exception {
		//String filePath = "C://Users//caoqiang//Desktop//ceshi//SZ_T1_2_1.xls";
		//String filePath2 = "C://Users//caoqiang//Desktop//ceshi//A.xls";
		HSSFWorkbook  workBook = ExcelUtil.getNewExcel(tempRelativePath);
		List<PABEntity> pabEntityList =  pabDao.getBaseInfo();
		int sourceSheetNumber = 0;
		copySheet(workBook,pabEntityList.size(),sourceSheetNumber);
		Map<String, Location> everyAccountTitleLocationMap = new HashMap<String, Location>();
		everyAccountTitleLocationMap.put("insertReportTime", new Location(1,0));
		everyAccountTitleLocationMap.put("name", new Location(2,2));
		everyAccountTitleLocationMap.put("AD", new Location(3,2));
		int count = 31;
		int columnCount = 6;
		String specialColumn ="";
		String everyAccountTableType = TableEnum.TABLE_TYPE.T1_10.getValue();
		boolean haveCount = false;
		Location textLocation = new Location(9,1);
		dealEveryAccount(workBook,pabEntityList,everyAccountTitleLocationMap,count,columnCount,
				specialColumn,everyAccountTableType,textLocation,beginDate,endDate,haveCount,sourceSheetNumber);
		ExcelUtil.exportExcel(workBook, destExcelPath+destFileName);
		
	}



	private void reportPABTableT1_2(String tempRelativePath, String destFileName, String destExcelPath,
			String beginDate, String endDate) throws IOException {
		//String filePath = "C://Users//caoqiang//Desktop//ceshi//SZ_T1_2.xls";
		//String filePath2 = "C://Users//caoqiang//Desktop//ceshi//A.xls";
		Date nowTime = new Date();
		String nowTimeString = sdf.format(nowTime);
		ThreeTuple<String,Location,String> insertReportTime = 
				new ThreeTuple<String,Location,String>(nowTimeString,new Location(1,0),"String");
		HSSFWorkbook  workBook = ExcelUtil.getNewExcel(tempRelativePath);
		List<ThreeTuple<String,Location,String>>  countTitleList = new ArrayList<ThreeTuple<String,Location,String>>();
		HSSFSheet countSheet = workBook.getSheetAt(0);
		int count = 31;
		int columnCount = 9;
		//处理账户总计内容
		String tableType = TableEnum.TABLE_TYPE.T1_2.getValue();
		List<Object[]> textList = pabDao.getPABTable(null,beginDate,endDate,tableType,true);
		Object[] sumList = ExcelUtil.getSumList(textList,columnCount);
		ExcelUtil.fillUpList(textList,count,columnCount);
		textList.add(sumList);
		String specialColumn = "";
		ExcelUtil.setHorizontalTextValue(countSheet, textList, new Location(7,1),specialColumn);
		//处理标题
		countTitleList.add(insertReportTime);
		ExcelUtil.setTitleValue(countTitleList, countSheet);
		ExcelUtil.exportExcel(workBook, destExcelPath+destFileName);
	}
	
	

	private void reportPABTableT1_13(String tempRelativePath, String destFileName, String destExcelPath,
			String beginDate, String endDate) throws IOException {
		//String filePath = "C://Users//caoqiang//Desktop//ceshi//SZ_T1_13.xls";
		//String filePath2 = "C://Users//caoqiang//Desktop//ceshi//A.xls";
		Date nowTime = new Date();
		String nowTimeString = sdf.format(nowTime);
		ThreeTuple<String,Location,String> insertReportTime = 
				new ThreeTuple<String,Location,String>(nowTimeString,new Location(1,0),"String");
		HSSFWorkbook  workBook = ExcelUtil.getNewExcel(tempRelativePath);
		List<ThreeTuple<String,Location,String>>  countTitleList = new ArrayList<ThreeTuple<String,Location,String>>();
		HSSFSheet countSheet = workBook.getSheetAt(0);
		//处理账户总计内容
		String tableType = TableEnum.TABLE_TYPE.T1_10.getValue();
		List<Object[]> textList = pabDao.getPABTable("99999",beginDate,endDate,tableType,true);
		int count = 31;
		int columnCount = 6;
		ExcelUtil.fillUpList(textList,count,columnCount);
		String specialColumn = "";
		ExcelUtil.setHorizontalTextValue(countSheet, textList, new Location(5,1),specialColumn);
		//处理标题
		countTitleList.add(insertReportTime);
		ExcelUtil.setTitleValue(countTitleList, countSheet);
		ExcelUtil.exportExcel(workBook, destExcelPath+destFileName);
	}

	private void reportPABTableT1_3(String tempRelativePath, String destFileName, String destExcelPath,
			String beginDate, String endDate) throws IOException {
		//String filePath = "/Users/caoqiang/Desktop/ceshi/SZ_T1_3.xls";
		//String filePath2 = "/Users/caoqiang/Desktop/ceshi/A.xls";
		HSSFWorkbook  workBook = ExcelUtil.getNewExcel(tempRelativePath);
		HSSFSheet targetSheet = workBook.getSheetAt(0);
		List<PABEntity> pabEntityList =  pabDao.getBaseInfo();
		
		String everyAccountTableType = TableEnum.TABLE_TYPE.T1_3.getValue();
		boolean isSumFlag = false;
		int textRowNumber = 4;
		int lastRowNum = targetSheet.getLastRowNum();
		for (int i = 0; i < pabEntityList.size(); i++) {
			Row row = targetSheet.createRow(lastRowNum);
			Cell cell = row.createCell(4);
			lastRowNum++;
		}
		if(null != pabEntityList && 0 != pabEntityList.size()){
			for (int i=0;i<pabEntityList.size();i++) {
				PABEntity pabEntity = pabEntityList.get(i);
				isSumFlag = false;
				List<Object[]> textList = pabDao.getPABTable(pabEntity.getADID(),beginDate,endDate,everyAccountTableType,isSumFlag);
				Row row = null;
				if(0 == i){
					row = targetSheet.getRow(textRowNumber);
				}else{
					targetSheet.shiftRows(textRowNumber, targetSheet.getLastRowNum(), 1,true,false);
					row = targetSheet.createRow(textRowNumber);
				}
				Cell cell =null;
				cell =row.getCell(0);
				if(cell == null){
					cell = row.createCell(0);
				}
				cell.setCellValue(pabEntity.getBankName_S());
				cell =row.getCell(1);
				if(cell == null){
					cell = row.createCell(1);
				}
				cell.setCellValue(pabEntity.getName());
				cell =row.getCell(2);
				if(cell == null){
					cell = row.createCell(2);
				}
				cell.setCellValue(pabEntity.getAD());
				if(i != 0){
					cell =row.getCell(3);
					if(cell == null){
						cell = row.createCell(3);
					}
					cell.setCellValue("C01");
				}
				dealReportPABTableT1_3Data(row,textList);
				textRowNumber++;
			}
			isSumFlag = true;
			List<Object[]> sumList = pabDao.getPABTable(null,beginDate,endDate,everyAccountTableType,isSumFlag);
			Row sumRow = targetSheet.getRow(textRowNumber);
			dealReportPABTableT1_3Data(sumRow,sumList);
		}
		ExcelUtil.exportExcel(workBook, destExcelPath+destFileName);
		
	}

	/**
	 * 
	 * @param workBook
	 * @param pabEntityList 账户list
	 * @param everyAccountTitleLocationMap 账户标题信息
	 * @param count 表格里需要多少天数据
	 * @param columnCount 表格里有多少列数据
	 * @param specialColumn 特殊的列，用于处理空出的数据
	 * @param everyAccountTableType 查询的数据库的表
	 * @param textLocation 主题数据的位置信息
	 * @param startDay 开始时间
	 * @param endDay 结束时间
	 * @param haveCount 是否有合计
	 * @throws Exception
	 */
	private void dealEveryAccount(HSSFWorkbook workBook,List<PABEntity> pabEntityList,Map<String, Location> everyAccountTitleLocationMap,
			int count,int columnCount, String specialColumn,String everyAccountTableType,
			Location textLocation,String startDay, String endDay, boolean haveCount,int sourceSheetNumber) throws Exception {
		for (int i=0;i<pabEntityList.size();i++) {
			HSSFSheet sheet = workBook.getSheetAt(sourceSheetNumber);
			PABEntity entity = pabEntityList.get(i);
			//处理主题内容
			boolean isSumFlag = false;
			List<Object[]> textList = pabDao.getPABTable(entity.getADID(),startDay,endDay,everyAccountTableType,isSumFlag);
			ExcelUtil.fillUpList(textList,count,columnCount);
			if(haveCount){
				Object[] sumList = ExcelUtil.getSumList(textList,columnCount);
				textList.add(sumList);
			}
			ExcelUtil.setHorizontalTextValue(sheet, textList, textLocation,specialColumn);
			List<ThreeTuple<String,Location,String>>  titleList = dealeveryAccountTitle(entity,everyAccountTitleLocationMap);
			if(everyAccountTitleLocationMap.containsKey("insertReportTime")){
				Location insertReportTimeLocation = everyAccountTitleLocationMap.get("insertReportTime");
				Date nowTime = new Date();
				String nowTimeString = sdf.format(nowTime);
				ThreeTuple<String,Location,String> insertReportTime = 
						new ThreeTuple<String,Location,String>(nowTimeString,insertReportTimeLocation,"String");
				titleList.add(insertReportTime);
			}
			ExcelUtil.setTitleValue(titleList, sheet);
			sourceSheetNumber++;
		}
	}
	
	/**
	 * 
	 * @param entity 处理的账户主信息
	 * @param everyTitleLocationMap 标题的位置信息
	 * @return 
	 * @throws Exception
	 */
	private List<ThreeTuple<String, Location, String>> dealeveryAccountTitle(
			PABEntity entity, Map<String, Location> everyTitleLocationMap) throws Exception {
		List<ThreeTuple<String,Location,String>>  titleList = new ArrayList<ThreeTuple<String,Location,String>>();
		Field[] fieldList = entity.getClass().getDeclaredFields();
		for (int j=0; j<fieldList.length; j++) {
			Field field = fieldList[j];
			String fildName = field.getName();
			String name = fildName.substring(0, 1).toUpperCase() + fildName.substring(1);
			Method m = entity.getClass().getMethod("get" + name);
            String type = field.getGenericType().toString();
			if (type.equals("class java.lang.String")) {
					if(everyTitleLocationMap.containsKey(fildName)){
						String value = (String) m.invoke(entity);
						if (value == null) {
							value = "";//数据库为null的时候暂时定位空，定义为返回值变量最好
						}
						Location titleLocation = everyTitleLocationMap.get(fildName);
						ThreeTuple<String,Location,String>  target = 
								new ThreeTuple<String,Location,String>(value,titleLocation,"String");
						titleList.add(target);
					}
				}
			}
		return titleList;
	}
	
	
	//复制sheet
	private void copySheet(HSSFWorkbook workBook, int size,int sourceSheetNumber) throws Exception {
		HSSFSheet sourceSheet = workBook.getSheetAt(sourceSheetNumber);
		for (int i=0;i<size-1;i++) {
			HSSFSheet targetSheet = workBook.createSheet();
			POIUtil.copySheet(sourceSheet, targetSheet, workBook, workBook);
		}
	}




	//处理表1-3主题数据
	private void dealReportPABTableT1_3Data(Row row, List<Object[]> textList) {
		int columnNumber = 4;
		for (Object[] objects : textList) {
			Cell cell =null;
			cell =row.getCell(columnNumber);
			if(cell == null){
				cell = row.createCell(columnNumber);
			}
			if(null != objects && 0 != objects.length){
				BigDecimal value = (BigDecimal) objects[0];
				cell.setCellValue(value.doubleValue());
			}
			columnNumber++;
		}
		
	}











	



	
}
