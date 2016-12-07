package com.qdb.provmgr.common;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by yuwenzhong on 2016-11-28.
 */
public interface TableNameConstant {

    String tableNameStr = "1_1,1_2,1_3,1_6,1_9,1_10";

    //表标识tableType
    String T1_1 = "1_1";
    String T1_2 = "1_2";
    String T1_3 = "1_3";
    String T1_6 = "1_6";
    String T1_9 = "1_9";
    String T1_10 = "1_10";

    Map<String, String> tableNoMap = new HashMap(){
        {
            this.put(T1_1 , "001");
            this.put(T1_2 , "002");
            this.put(T1_3 , "003");
            this.put(T1_6 , "006");
            this.put(T1_9 , "009");
            this.put(T1_10, "010");
        }
    };

    Map<String, String> tempNameMap = new HashMap(){
        {
            this.put(T1_1 , "agentCode_001_n.xls");
            this.put(T1_2 , "agentCode_002_n.xls");
            this.put(T1_3 , "agentCode_003_n.xls");
            this.put(T1_6 , "agentCode_006_n.xls");
            this.put(T1_9 , "agentCode_009_n.xls");
            this.put(T1_10, "agentCode_010_n.xls");
        }
    };
}
