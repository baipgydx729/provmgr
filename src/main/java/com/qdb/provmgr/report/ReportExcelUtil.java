package com.qdb.provmgr.report;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.util.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.dubbo.common.utils.CollectionUtils;
import com.qdb.provmgr.dao.TableModeEnum;
import com.qdb.provmgr.dao.entity.report.BaseReportEntity;
import com.qdb.provmgr.dao.entity.report.DataTable1_1;
import com.qdb.provmgr.dao.entity.report.DataTable1_10;
import com.qdb.provmgr.dao.entity.report.DataTable1_11;
import com.qdb.provmgr.dao.entity.report.DataTable1_12;
import com.qdb.provmgr.dao.entity.report.DataTable1_13;
import com.qdb.provmgr.dao.entity.report.DataTable1_2;
import com.qdb.provmgr.dao.entity.report.DataTable1_4;
import com.qdb.provmgr.dao.entity.report.DataTable1_5;
import com.qdb.provmgr.dao.entity.report.DataTable1_6;
import com.qdb.provmgr.dao.entity.report.DataTable1_9;
import com.qdb.provmgr.report.pbc.Excel1_1;
import com.qdb.provmgr.report.pbc.Excel1_10;
import com.qdb.provmgr.report.pbc.Excel1_10_2;
import com.qdb.provmgr.report.pbc.Excel1_11;
import com.qdb.provmgr.report.pbc.Excel1_12;
import com.qdb.provmgr.report.pbc.Excel1_13;
import com.qdb.provmgr.report.pbc.Excel1_1_2;
import com.qdb.provmgr.report.pbc.Excel1_2;
import com.qdb.provmgr.report.pbc.Excel1_2_1;
import com.qdb.provmgr.report.pbc.Excel1_3;
import com.qdb.provmgr.report.pbc.Excel1_4;
import com.qdb.provmgr.report.pbc.Excel1_5;
import com.qdb.provmgr.report.pbc.Excel1_6;
import com.qdb.provmgr.report.pbc.Excel1_6_2;
import com.qdb.provmgr.report.pbc.Excel1_9;
import com.qdb.provmgr.report.pbc.Excel1_9_2;
import com.qdb.provmgr.util.FileUtil;
import com.qdb.provmgr.util.POIUtil;

/**
 * @author mashengli
 */
public class ReportExcelUtil {

    private static Logger log = LoggerFactory.getLogger(ReportExcelUtil.class);

    public static File createExcelFile(TableModeEnum tableMode, String templateFile, String targetFileName, PresetContent presetContent, List<BaseReportEntity> dataList) throws Exception {
        File tempFile = FileUtil.createTempFile(targetFileName);
        InputStream is = null;
        OutputStream os = null;
        try {
            is = new FileInputStream(templateFile);
            HSSFWorkbook workbookIn = new HSSFWorkbook(is);
            HSSFSheet sheetIn = workbookIn.getSheetAt(0);

            os = new FileOutputStream(tempFile);
            HSSFWorkbook workbookOut = new HSSFWorkbook();     //创建工作簿
            HSSFSheet sheetOut = workbookOut.createSheet();       //创建sheet

            //拷贝模板
            POIUtil.copySheet(sheetIn, sheetOut, workbookIn, workbookOut);

            //填写数据
            writeData(tableMode, sheetOut, presetContent, dataList);

            workbookOut.write(os);
            os.flush();
        } catch (Exception e) {
            log.error("创建excel失败");
            throw e;
        } finally {
            IOUtils.closeQuietly(os);
            IOUtils.closeQuietly(is);
        }
        return tempFile;
    }

    public static void writeData(TableModeEnum tableMode, HSSFSheet sheet, PresetContent presetContent, List<BaseReportEntity> dataList) {
        if (TableModeEnum.Table1_1.equals(tableMode)) {
            Excel1_1.writeData(sheet, presetContent, dataList);
            return;
        }
        if (TableModeEnum.Table1_1_2.equals(tableMode)) {
            Excel1_1_2.writeData(sheet, presetContent, dataList);
            return;
        }
        if (TableModeEnum.Table1_2.equals(tableMode)) {
            Excel1_2.writeData(sheet, presetContent, dataList);
            return;
        }
        if (TableModeEnum.Table1_2_1.equals(tableMode)) {
            Excel1_2_1.writeData(sheet, presetContent, dataList);
            return;
        }
        if (TableModeEnum.Table1_3.equals(tableMode)) {
            Excel1_3.writeData(sheet, presetContent, dataList);
            return;
        }
        if (TableModeEnum.Table1_4.equals(tableMode)) {
            Excel1_4.writeData(sheet, presetContent, dataList);
            return;
        }
        if (TableModeEnum.Table1_5.equals(tableMode)) {
            Excel1_5.writeData(sheet, presetContent, dataList);
            return;
        }
        if (TableModeEnum.Table1_6.equals(tableMode)) {
            Excel1_6.writeData(sheet, presetContent, dataList);
            return;
        }
        if (TableModeEnum.Table1_6_2.equals(tableMode)) {
            Excel1_6_2.writeData(sheet, presetContent, dataList);
            return;
        }
        if (TableModeEnum.Table1_9.equals(tableMode)) {
            Excel1_9.writeData(sheet, presetContent, dataList);
            return;
        }
        if (TableModeEnum.Table1_9_2.equals(tableMode)) {
            Excel1_9_2.writeData(sheet, presetContent, dataList);
            return;
        }
        if (TableModeEnum.Table1_10.equals(tableMode)) {
            Excel1_10.writeData(sheet, presetContent, dataList);
            return;
        }
        if (TableModeEnum.Table1_10_2.equals(tableMode)) {
            Excel1_10_2.writeData(sheet, presetContent, dataList);
            return;
        }
        if (TableModeEnum.Table1_11.equals(tableMode)) {
            Excel1_11.writeData(sheet, presetContent, dataList);
            return;
        }
        if (TableModeEnum.Table1_12.equals(tableMode)) {
            Excel1_12.writeData(sheet, presetContent, dataList);
            return;
        }
        if (TableModeEnum.Table1_13.equals(tableMode)) {
            Excel1_13.writeData(sheet, presetContent, dataList);
        }
    }
    /**
     * 将原始数据按照账户分割成N个数组
     * @param dataList 源数据
     * @return
     */
    public static List<List<BaseReportEntity>> splitByAD(List<BaseReportEntity> dataList) {
        if (CollectionUtils.isEmpty(dataList)) {
            return Collections.EMPTY_LIST;
        }
        Map<Integer, List<BaseReportEntity>> map = new HashMap<>();
        for (BaseReportEntity baseReportEntity : dataList) {
            if (map.containsKey(baseReportEntity.getADID())) {
                map.get(baseReportEntity.getADID()).add(baseReportEntity);
            } else {
                List<BaseReportEntity> newList = new ArrayList<>();
                newList.add(baseReportEntity);
                map.put(baseReportEntity.getADID(), newList);
            }
        }
        return new ArrayList<>(map.values());
    }

    /**
     * 将原始数据按照账户分割成N个数组
     * @param dataList 源数据
     * @return
     */
    public static List<List<BaseReportEntity>> splitByBankName(List<BaseReportEntity> dataList) {
        if (CollectionUtils.isEmpty(dataList)) {
            return Collections.EMPTY_LIST;
        }
        Map<String, List<BaseReportEntity>> map = new HashMap<>();
        for (BaseReportEntity baseReportEntity : dataList) {
            if (map.containsKey(baseReportEntity.getBankName())) {
                map.get(baseReportEntity.getBankName()).add(baseReportEntity);
            } else {
                List<BaseReportEntity> newList = new ArrayList<>();
                newList.add(baseReportEntity);
                map.put(baseReportEntity.getBankName(), newList);
            }
        }
        return new ArrayList<>(map.values());
    }

    /**
     * 将原始数据按照日期分割成N个数组
     * @param dataList 源数据
     * @return
     */
    public static List<List<BaseReportEntity>> splitByDate(List<BaseReportEntity> dataList) {
        if (CollectionUtils.isEmpty(dataList)) {
            return Collections.EMPTY_LIST;
        }
        Map<String, List<BaseReportEntity>> map = new HashMap<>();
        for (BaseReportEntity baseReportEntity : dataList) {
            if (map.containsKey(baseReportEntity.getNatuDate())) {
                map.get(baseReportEntity.getNatuDate()).add(baseReportEntity);
            } else {
                List<BaseReportEntity> newList = new ArrayList<>();
                newList.add(baseReportEntity);
                map.put(baseReportEntity.getNatuDate(), newList);
            }
        }
        return new ArrayList<>(map.values());
    }

    /**
     * 计算合计行（按天累加并合并，合并后不再区分账户）
     * @param dataList 源数据
     * @return
     */
    public static BaseReportEntity mergeAndSumByDate(List<BaseReportEntity> dataList) {
        if (CollectionUtils.isEmpty(dataList)) {
            return null;
        }
        BaseReportEntity baseReportEntity = dataList.get(0);
        baseReportEntity.setAD(null);
        baseReportEntity.setADID(null);
        baseReportEntity.setBankName(null);
        baseReportEntity.setNatuDate(null);
        baseReportEntity.setName(null);
        for (int i = 1; i < dataList.size(); i++) {
            baseReportEntity = addData(baseReportEntity, dataList.get(i));
        }
        return baseReportEntity;
    }

    private static BaseReportEntity addData(BaseReportEntity data1, BaseReportEntity data2) {
        if (!data1.getClass().equals(data2.getClass())) {
            log.error("类型不一致无法进行累加");
            return null;
        }
        if (data1 instanceof DataTable1_1) {
            return addData((DataTable1_1)data1, (DataTable1_1)data2);
        }
        if (data1 instanceof DataTable1_2) {
            return addData((DataTable1_2)data1, (DataTable1_2)data2);
        }
        if (data1 instanceof DataTable1_4) {
            return addData((DataTable1_4)data1, (DataTable1_4)data2);
        }
        if (data1 instanceof DataTable1_5) {
            return addData((DataTable1_5)data1, (DataTable1_5)data2);
        }
        if (data1 instanceof DataTable1_6) {
            return addData((DataTable1_6)data1, (DataTable1_6)data2);
        }
        if (data1 instanceof DataTable1_9) {
            return addData((DataTable1_9)data1, (DataTable1_9)data2);
        }
        if (data1 instanceof DataTable1_10) {
            return addData((DataTable1_10)data1, (DataTable1_10)data2);
        }
        if (data1 instanceof DataTable1_11) {
            return addData((DataTable1_11)data1, (DataTable1_11)data2);
        }
        if (data1 instanceof DataTable1_12) {
            return addData((DataTable1_12)data1, (DataTable1_12)data2);
        }
        if (data1 instanceof DataTable1_13) {
            return addData((DataTable1_13)data1, (DataTable1_13)data2);
        }
        return null;
    }

    /**
     * 做加法
     * @param data1
     * @param data2
     * @return
     */
    public static DataTable1_1 addData(DataTable1_1 data1, DataTable1_1 data2) {
        if (data1 == null) {
            return data2;
        }
        if (data2 == null) {
            return data1;
        }
        data1.setA01(DecimalTool.add(data1.getA01(), data2.getA01()));
        data1.setA02(DecimalTool.add(data1.getA02(), data2.getA02()));
        data1.setA03(DecimalTool.add(data1.getA03(), data2.getA03()));
        data1.setA0301(DecimalTool.add(data1.getA0301(), data2.getA0301()));
        data1.setA0302(DecimalTool.add(data1.getA0302(), data2.getA0302()));
        data1.setA04(DecimalTool.add(data1.getA04(), data2.getA04()));
        data1.setA05(DecimalTool.add(data1.getA05(), data2.getA05()));
        data1.setA06(DecimalTool.add(data1.getA06(), data2.getA06()));
        data1.setA0601(DecimalTool.add(data1.getA0601(), data2.getA0601()));
        data1.setA0602(DecimalTool.add(data1.getA0602(), data2.getA0602()));
        data1.setA07(DecimalTool.add(data1.getA07(), data2.getA07()));
        data1.setA08(DecimalTool.add(data1.getA08(), data2.getA08()));
        data1.setA09(DecimalTool.add(data1.getA09(), data2.getA09()));
        data1.setA0901(DecimalTool.add(data1.getA0901(), data2.getA0901()));
        data1.setA0902(DecimalTool.add(data1.getA0902(), data2.getA0902()));
        data1.setA10(DecimalTool.add(data1.getA10(), data2.getA10()));
        data1.setA11(DecimalTool.add(data1.getA11(), data2.getA11()));
        data1.setA12(DecimalTool.add(data1.getA12(), data2.getA12()));
        data1.setA13(DecimalTool.add(data1.getA13(), data2.getA13()));
        data1.setA1301(DecimalTool.add(data1.getA1301(), data2.getA1301()));
        data1.setA1302(DecimalTool.add(data1.getA1302(), data2.getA1302()));
        data1.setA14(DecimalTool.add(data1.getA14(), data2.getA14()));
       return data1;
    }

    /**
     * 做加法
     * @param data1
     * @param data2
     * @return
     */
    public static DataTable1_2 addData(DataTable1_2 data1, DataTable1_2 data2) {
        if (data1 == null) {
            return data2;
        }
        if (data2 == null) {
            return data1;
        }
        data1.setB01(DecimalTool.add(data1.getB01(), data2.getB01()));
        data1.setB02(DecimalTool.add(data1.getB02(), data2.getB02()));
        data1.setB03(DecimalTool.add(data1.getB03(), data2.getB03()));
        data1.setB04(DecimalTool.add(data1.getB04(), data2.getB04()));
        data1.setB05(DecimalTool.add(data1.getB05(), data2.getB05()));
        data1.setB06(DecimalTool.add(data1.getB06(), data2.getB06()));
        data1.setB07(DecimalTool.add(data1.getB07(), data2.getB07()));
        data1.setB08(DecimalTool.add(data1.getB08(), data2.getB08()));
        data1.setB09(DecimalTool.add(data1.getB09(), data2.getB09()));
        return data1;
    }

    /**
     * 做加法
     * @param data1
     * @param data2
     * @return
     */
    public static DataTable1_4 addData(DataTable1_4 data1, DataTable1_4 data2) {
        if (data1 == null) {
            return data2;
        }
        if (data2 == null) {
            return data1;
        }
        data1.setD01(DecimalTool.add(data1.getD01(), data2.getD01()));
        data1.setD02(DecimalTool.add(data1.getD02(), data2.getD02()));
        data1.setD03(DecimalTool.add(data1.getD03(), data2.getD03()));
        data1.setD04(DecimalTool.add(data1.getD04(), data2.getD04()));
        return data1;
    }

    /**
     * 做加法
     * @param data1
     * @param data2
     * @return
     */
    public static DataTable1_5 addData(DataTable1_5 data1, DataTable1_5 data2) {
        if (data1 == null) {
            return data2;
        }
        if (data2 == null) {
            return data1;
        }
        data1.setE01(DecimalTool.add(data1.getE01(), data2.getE01()));
        data1.setE02(DecimalTool.add(data1.getE02(), data2.getE02()));
        data1.setE03(DecimalTool.add(data1.getE03(), data2.getE03()));
        data1.setE04(DecimalTool.add(data1.getE04(), data2.getE04()));
        data1.setE05(DecimalTool.add(data1.getE05(), data2.getE05()));
        data1.setE06(DecimalTool.add(data1.getE06(), data2.getE06()));
        return data1;
    }

    /**
     * 做加法
     * @param data1
     * @param data2
     * @return
     */
    public static DataTable1_6 addData(DataTable1_6 data1, DataTable1_6 data2) {
        if (data1 == null) {
            return data2;
        }
        if (data2 == null) {
            return data1;
        }
        data1.setF01(DecimalTool.add(data1.getF01(), data2.getF01()));
        data1.setF02(DecimalTool.add(data1.getF02(), data2.getF02()));
        data1.setF03(DecimalTool.add(data1.getF03(), data2.getF03()));
        data1.setF04(DecimalTool.add(data1.getF04(), data2.getF04()));
        data1.setF05(DecimalTool.add(data1.getF05(), data2.getF05()));
        data1.setF06(DecimalTool.add(data1.getF06(), data2.getF06()));
        data1.setF07(DecimalTool.add(data1.getF07(), data2.getF07()));
        data1.setF08(DecimalTool.add(data1.getF08(), data2.getF08()));
        data1.setF09(DecimalTool.add(data1.getF09(), data2.getF09()));
        data1.setF10(DecimalTool.add(data1.getF10(), data2.getF10()));
        data1.setG01(DecimalTool.add(data1.getG01(), data2.getG01()));
        data1.setG02(DecimalTool.add(data1.getG02(), data2.getG02()));
        data1.setG03(DecimalTool.add(data1.getG03(), data2.getG03()));
        data1.setG04(DecimalTool.add(data1.getG04(), data2.getG04()));
        data1.setG05(DecimalTool.add(data1.getG05(), data2.getG05()));
        data1.setG06(DecimalTool.add(data1.getG06(), data2.getG06()));
        data1.setG07(DecimalTool.add(data1.getG07(), data2.getG07()));
        data1.setG08(DecimalTool.add(data1.getG08(), data2.getG08()));
        data1.setG09(DecimalTool.add(data1.getG09(), data2.getG09()));
        data1.setG10(DecimalTool.add(data1.getG10(), data2.getG10()));
        data1.setG11(DecimalTool.add(data1.getG11(), data2.getG11()));
        data1.setG12(DecimalTool.add(data1.getG12(), data2.getG12()));
        data1.setG13(DecimalTool.add(data1.getG13(), data2.getG13()));
        data1.setG14(DecimalTool.add(data1.getG14(), data2.getG14()));
        return data1;
    }

    /**
     * 做加法
     * @param data1
     * @param data2
     * @return
     */
    public static DataTable1_9 addData(DataTable1_9 data1, DataTable1_9 data2) {
        if (data1 == null) {
            return data2;
        }
        if (data2 == null) {
            return data1;
        }
        data1.setJ01(DecimalTool.add(data1.getJ01(), data2.getJ01()));
        data1.setJ02(DecimalTool.add(data1.getJ02(), data2.getJ02()));
        data1.setJ03(DecimalTool.add(data1.getJ03(), data2.getJ03()));
        data1.setJ04(DecimalTool.add(data1.getJ04(), data2.getJ04()));
        return data1;
    }

    /**
     * 做加法
     * @param data1
     * @param data2
     * @return
     */
    public static DataTable1_10 addData(DataTable1_10 data1, DataTable1_10 data2) {
        if (data1 == null) {
            return data2;
        }
        if (data2 == null) {
            return data1;
        }
        data1.setK01(DecimalTool.add(data1.getK01(), data2.getK01()));
        data1.setK02(DecimalTool.add(data1.getK02(), data2.getK02()));
        data1.setK03(DecimalTool.add(data1.getK03(), data2.getK03()));
        data1.setK04(DecimalTool.add(data1.getK04(), data2.getK04()));
        data1.setK05(DecimalTool.add(data1.getK05(), data2.getK05()));
        data1.setK06(DecimalTool.add(data1.getK06(), data2.getK06()));
        data1.setK07(DecimalTool.add(data1.getK07(), data2.getK07()));
        data1.setK08(DecimalTool.add(data1.getK08(), data2.getK08()));
        data1.setK09(DecimalTool.add(data1.getK09(), data2.getK09()));
        data1.setK10(DecimalTool.add(data1.getK10(), data2.getK10()));
        data1.setK11(DecimalTool.add(data1.getK11(), data2.getK11()));
        data1.setK12(DecimalTool.add(data1.getK12(), data2.getK12()));
        data1.setK13(DecimalTool.add(data1.getK13(), data2.getK13()));
        data1.setK14(DecimalTool.add(data1.getK14(), data2.getK14()));
        data1.setK15(DecimalTool.add(data1.getK15(), data2.getK15()));
        data1.setK16(DecimalTool.add(data1.getK16(), data2.getK16()));
        data1.setK17(DecimalTool.add(data1.getK17(), data2.getK17()));
        data1.setK18(DecimalTool.add(data1.getK18(), data2.getK18()));
        data1.setK19(DecimalTool.add(data1.getK19(), data2.getK19()));
        data1.setK20(DecimalTool.add(data1.getK20(), data2.getK20()));
        data1.setK21(DecimalTool.add(data1.getK21(), data2.getK21()));
        data1.setK22(DecimalTool.add(data1.getK22(), data2.getK22()));
        data1.setK23(DecimalTool.add(data1.getK23(), data2.getK23()));
        data1.setK24(DecimalTool.add(data1.getK24(), data2.getK24()));
        return data1;
    }

    /**
     * 做加法
     * @param data1
     * @param data2
     * @return
     */
    public static DataTable1_11 addData(DataTable1_11 data1, DataTable1_11 data2) {
        if (data1 == null) {
            return data2;
        }
        if (data2 == null) {
            return data1;
        }
        data1.setL1(DecimalTool.add(data1.getL1(), data2.getL1()));
        data1.setL2(DecimalTool.add(data1.getL2(), data2.getL2()));
        data1.setL3(DecimalTool.add(data1.getL3(), data2.getL3()));
        data1.setL4(DecimalTool.add(data1.getL4(), data2.getL4()));
        data1.setL5(DecimalTool.add(data1.getL5(), data2.getL5()));
        data1.setL6(DecimalTool.add(data1.getL6(), data2.getL6()));
        data1.setL7(DecimalTool.add(data1.getL7(), data2.getL7()));
        data1.setL8(DecimalTool.add(data1.getL8(), data2.getL8()));
        data1.setL9(DecimalTool.add(data1.getL9(), data2.getL9()));
        data1.setL10(DecimalTool.add(data1.getL10(), data2.getL10()));
        data1.setL11(DecimalTool.add(data1.getL11(), data2.getL11()));
        data1.setL12(DecimalTool.add(data1.getL12(), data2.getL12()));
        data1.setL13(DecimalTool.add(data1.getL13(), data2.getL13()));
        data1.setL14(DecimalTool.add(data1.getL14(), data2.getL14()));
        data1.setL15(DecimalTool.add(data1.getL15(), data2.getL15()));
        data1.setL16(DecimalTool.add(data1.getL16(), data2.getL16()));
        data1.setL17(DecimalTool.add(data1.getL17(), data2.getL17()));
        data1.setL18(DecimalTool.add(data1.getL18(), data2.getL18()));
        data1.setL19(DecimalTool.add(data1.getL19(), data2.getL19()));
        data1.setL20(DecimalTool.add(data1.getL20(), data2.getL20()));
        data1.setL21(DecimalTool.add(data1.getL21(), data2.getL21()));
        data1.setL22(DecimalTool.add(data1.getL22(), data2.getL22()));
        data1.setL23(DecimalTool.add(data1.getL23(), data2.getL23()));
        data1.setL24(DecimalTool.add(data1.getL24(), data2.getL24()));
        data1.setL25(DecimalTool.add(data1.getL25(), data2.getL25()));
        data1.setL26(DecimalTool.add(data1.getL26(), data2.getL26()));
        data1.setZ1(DecimalTool.add(data1.getZ1(), data2.getZ1()));
        data1.setZ101(DecimalTool.add(data1.getZ101(), data2.getZ101()));
        data1.setZ102(DecimalTool.add(data1.getZ102(), data2.getZ102()));
        return data1;
    }

    /**
     * 做加法
     * @param data1
     * @param data2
     * @return
     */
    public static DataTable1_12 addData(DataTable1_12 data1, DataTable1_12 data2) {
        if (data1 == null) {
            return data2;
        }
        if (data2 == null) {
            return data1;
        }
        data1.setM1(DecimalTool.add(data1.getM1(), data2.getM1()));
        data1.setM2(DecimalTool.add(data1.getM2(), data2.getM2()));
        data1.setM3(DecimalTool.add(data1.getM3(), data2.getM3()));
        data1.setM4(DecimalTool.add(data1.getM4(), data2.getM4()));
        data1.setM5(DecimalTool.add(data1.getM5(), data2.getM5()));
        data1.setM6(DecimalTool.add(data1.getM6(), data2.getM6()));
        data1.setM7(DecimalTool.add(data1.getM7(), data2.getM7()));
        data1.setM8(DecimalTool.add(data1.getM8(), data2.getM8()));
        data1.setM9(DecimalTool.add(data1.getM9(), data2.getM9()));
        data1.setM10(DecimalTool.add(data1.getM10(), data2.getM10()));
        data1.setM11(DecimalTool.add(data1.getM11(), data2.getM11()));
        data1.setM12(DecimalTool.add(data1.getM12(), data2.getM12()));
        data1.setM13(DecimalTool.add(data1.getM13(), data2.getM13()));
        data1.setM14(DecimalTool.add(data1.getM14(), data2.getM14()));
        data1.setZ2(DecimalTool.add(data1.getZ2(), data2.getZ2()));
        data1.setZ201(DecimalTool.add(data1.getZ201(), data2.getZ201()));
        data1.setZ202(DecimalTool.add(data1.getZ202(), data2.getZ202()));
        return data1;
    }

    /**
     * 做加法
     * @param data1
     * @param data2
     * @return
     */
    public static DataTable1_13 addData(DataTable1_13 data1, DataTable1_13 data2) {
        if (data1 == null) {
            return data2;
        }
        if (data2 == null) {
            return data1;
        }
        data1.setN01(DecimalTool.add(data1.getN01(), data2.getN01()));
        data1.setN02(DecimalTool.add(data1.getN02(), data2.getN02()));
        data1.setN03(DecimalTool.add(data1.getN03(), data2.getN03()));
        data1.setN04(DecimalTool.add(data1.getN04(), data2.getN04()));
        data1.setN05(DecimalTool.add(data1.getN05(), data2.getN05()));
        data1.setN06(DecimalTool.add(data1.getN06(), data2.getN06()));
        return data1;
    }

}
