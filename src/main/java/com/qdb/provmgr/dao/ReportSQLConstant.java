package com.qdb.provmgr.dao;

/**
 * @author mashengli
 */
public interface ReportSQLConstant {

    public static final String TABLE1_1_NAME = " UacAutoCheck.ProvMgr.report_provision_cent_1_1 t1, UacAutoCheck.ProvMgr.info_ADinfo t2 ";
    public static final String TABLE1_1_COLUMNS = " t2.bankName_S + t2.branch bankName,t1.ADID,t1.name,t1.AD,t1.natuDate,t1.A01 a01,t1.A02 a02,t1.A03 a03,t1.A04 a04,t1.A05 a05,t1.A06 a06,t1.A07 a07,t1.A08 a08,t1.A09 a09,t1.A10 a10,t1.A11 a11,t1.A12 a12,t1.A13 a13,t1.A14 a14 ";

    public static final String TABLE1_2_NAME = " UacAutoCheck.ProvMgr.report_provision_cent_1_2 t1 ";
    public static final String TABLE1_2_COLUMNS = " t1.bankName_S bankName,t1.ADID,t1.name,t1.AD,t1.natuDate,t1.B01 b01,t1.B02 b02,t1.B03 b03,t1.B04 b04,t1.B05 b05,t1.B06 b06,t1.B07 b07,t1.B08 b08,t1.B09 b09 ";

    public static final String TABLE1_2_1_NAME = " UacAutoCheck.ProvMgr.report_provision_cent_1_2_1 t1 ";
    public static final String TABLE1_2_1_COLUMNS = " t2.bankName_S + t2.branch bankName,t1.ADID,t1.name,t1.AD,t1.natuDate,t1.B01 b01,t1.B02 b02,t1.B03 b03,t1.B04 b04,t1.B05 b05,t1.B06 b06,t1.B07 b07,t1.B08 b08,t1.B09 b09 ";

    public static final String TABLE1_3_NAME = " UacAutoCheck.ProvMgr.report_provision_cent_1_3 t1, UacAutoCheck.ProvMgr.info_ADinfo t2 ";
    public static final String TABLE1_3_COLUMNS = " t2.bankName_S + t2.branch bankName,t1.ADID,t1.name,t1.AD,t1.natuDate,t1.C01 c01 ";

    public static final String TABLE1_4_NAME = " UacAutoCheck.ProvMgr.report_provision_cent_1_4 t1, UacAutoCheck.ProvMgr.info_ADinfo t2 ";
    public static final String TABLE1_4_COLUMNS = " t2.bankName_S + t2.branch bankName,t1.ADID,t1.name,t1.AD,t1.natuDate,t1.D01 d01,t1.D02 d02,t1.D03 d03,t1.D04 d04 ";

    public static final String TABLE1_5_NAME = " UacAutoCheck.ProvMgr.report_provision_cent_1_5 t1, UacAutoCheck.ProvMgr.info_ADinfo t2 ";
    public static final String TABLE1_5_COLUMNS = " t2.bankName_S + t2.branch bankName,t1.ADID,t1.name,t1.AD,t1.natuDate,t1.E01 e01,t1.E02 e02,t1.E03 e03,t1.E04 e04,t1.E05 e05,t1.E06 e06 ";

    public static final String TABLE1_6_NAME = " UacAutoCheck.ProvMgr.report_provision_cent_1_6 t1, UacAutoCheck.ProvMgr.info_ADinfo t2 ";
    public static final String TABLE1_6_COLUMNS = " t2.bankName_S + t2.branch bankName,t1.ADID,t1.name,t1.AD,t1.natuDate,t1.F01 f01,t1.F02 f02,t1.F03 f03,t1.F04 f04,t1.F05 f05,t1.F06 f06,t1.F07 f07,t1.F08 f08,t1.F09 f09,t1.F10 f10,t1.G01 g01,t1.G02 g02,t1.G03 g03,t1.G04 g04,t1.G05 g05,t1.G06 g06,t1.G07 g07,t1.G08 g08,t1.G09 g09,t1.G10 g10,t1.G11 g11,t1.G12 g12,t1.G13 g13,t1.G14 g14 ";

    public static final String TABLE1_9_NAME = " UacAutoCheck.ProvMgr.report_provision_cent_1_9 t1, UacAutoCheck.ProvMgr.info_ADinfo t2 ";
    public static final String TABLE1_9_COLUMNS = " t2.bankName_S + t2.branch bankName,t1.ADID,t1.name,t1.AD,t1.natuDate,t1.J01 j01,t1.J02 j02,t1.J03 j03,t1.J04 j04 ";

    public static final String TABLE1_10_NAME = " UacAutoCheck.ProvMgr.report_provision_cent_1_10 t1, UacAutoCheck.ProvMgr.info_ADinfo t2 ";
    public static final String TABLE1_10_COMUMNS = " t2.bankName_S + t2.branch bankName,t1.ADID,t1.name,t1.AD,t1.natuDate,t1.K01 k01,t1.K02 k02,t1.K03 k03,t1.K04 k04,t1.K05 k05,t1.K06 k06,t1.K07 k07,t1.K08 k08,t1.K09 k09,t1.K10 k10,t1.K11 k11,t1.K12 k12,t1.K13 k13,t1.K14 k14,t1.K15 k15,t1.K16 k16,t1.K17 k17,t1.K18 k18,t1.K19 k19,t1.K20 k20,t1.K21 k21,t1.K22 k22,t1.K23 k23,t1.K24 k24 ";

    public static final String TABLE1_11_NAME = " UacAutoCheck.ProvMgr.report_provision_cent_1_11 t1, UacAutoCheck.ProvMgr.info_ADinfo t2 ";
    public static final String TABLE1_11_COLUMNS = " t2.bankName_S + t2.branch bankName,t1.ADID,t1.name,t1.AD,t1.natuDate,t1.L1 l1,t1.L2 l2,t1.L3 l3,t1.L4 l4,t1.L5 l5,t1.L6 l6,t1.L7 l7,t1.L8 l8,t1.L9 l9,t1.L10 l10,t1.L11 l11,t1.L12 l12,t1.L13 l13,t1.L14 l14,t1.L15 l15,t1.L16 l16,t1.L17 l17,t1.L18 l18,t1.L19 l19,t1.L20 l20,t1.L21 l21,t1.L22 l22,t1.L23 l23,t1.L24 l24,t1.L25 l25,t1.L26 l26 ";

    public static final String TABLE1_12_NAME = " UacAutoCheck.ProvMgr.report_provision_cent_1_12 t1, UacAutoCheck.ProvMgr.info_ADinfo t2 ";
    public static final String TABLE1_12_COLUMNS = " t2.bankName_S + t2.branch bankName,t1.ADID,t1.name,t1.AD,t1.natuDate,t1.M1 m1,t1.M2 m2,t1.M3 m3,t1.M4 m4,t1.M5 m5,t1.M6 m6,t1.M7 m7,t1.M8 m8,t1.M9 m9,t1.M10 m10,t1.M11 m11,t1.M12 m12,t1.M13 m13,t1.M14 m14 ";

    public static final String TABLE1_13_NAME = " UacAutoCheck.ProvMgr.report_provision_cent_1_13 t1, UacAutoCheck.ProvMgr.info_ADinfo t2 ";
    public static final String TABLE1_13_COLUMNS = " t2.bankName_S + t2.branch bankName,t1.ADID,t1.name,t1.AD,t1.natuDate,t1.N1 n1,t1.N2 n2,t1.N3 n3,t1.N4 n4,t1.N5 n5,t1.N6 n6 ";

    public static final String TABLE_ACCOUNT_INFO_NAME = "UacAutoCheck.ProvMgr.info_ADInfo t1 ";
    public static final String TABLE_ACCOUNT_INFO_COLUMNS = " t1.bankName_S bankName,t1.ADID,t1.AD,t1.name,t1.branch,t1.currency,t1.accType,t1.accState,t1.isProvision,t1.isReport ";

}
