package com.qdb.provmgr.dao;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.alibaba.druid.pool.DruidDataSource;

@Repository
public class DBUtil {

    @Autowired
    private DruidDataSource dataSource;

    final Logger log = LoggerFactory.getLogger(DBUtil.class);

    /***
     * 获取数据库连接
     *
     * @return 数据库连接对象Connection
     * @throws SQLException
     */
    public Connection getConnection() throws SQLException {
        Connection conn = null;
        try {
            conn = dataSource.getConnection();
        } catch (SQLException e) {
            log.error("数据库连接异常:", e);
            throw e;
        }
        return conn;
    }

    public List<Map<String, Object>> queryForList(String sql, Object[] params) {
        List<Map<String, Object>> result = null;
        Connection conn = null;
        try {
            conn = getConnection();
            PreparedStatement statement = conn.prepareStatement(sql);
            if (params != null && params.length > 0) {
                for (int i = 0; i < params.length; i++) {
                    statement.setObject(i + 1, params[i]);
                }
            }
            ResultSet rs = statement.executeQuery();
            result = convertList(rs);
        } catch (SQLException e) {
            log.error("*************SQL异常, sql语句:{}************", sql);
        } finally {
            close(conn);
        }
        return result;
    }

    public Map<String, Object> query(String sql, Object[] params) {
        Connection conn = null;
        try {
            conn = getConnection();
            PreparedStatement statement = conn.prepareStatement(sql);
            if (params != null && params.length > 0) {
                for (int i = 0; i < params.length; i++) {
                    statement.setObject(i + 1, params[i]);
                }
            }
            ResultSet rs = statement.executeQuery();
            List<Map<String, Object>> resultList = convertList(rs);
            if (resultList != null && resultList.size() > 0) {
                return resultList.get(0);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            close(conn);
        }
        return null;
    }

    private List<Map<String, Object>> convertList(ResultSet resultSet) {
        if (resultSet == null) {
            return Collections.EMPTY_LIST;
        }
        List<Map<String, Object>> list = new ArrayList();
        try {
            ResultSetMetaData metaData = resultSet.getMetaData();
            int columnCount = metaData.getColumnCount();

            while (resultSet.next()) {
                Map<String, Object> row = new HashMap<>();
                for (int i = 1; i <= columnCount; i++) {
                    row.put(metaData.getColumnName(i), resultSet.getObject(i));
                }
                list.add(row);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

//    public int update(String sql, Object paras[]) throws SQLException {
//        QueryRunner qu = new QueryRunner(true);
//        int i = 0;
//        Connection conn = null;
//        try {
//            conn = getConnection();
//            i = qu.update(conn, sql, paras);
//        } catch (SQLException e) {
//            log.error("update sql error:", e);
//            throw e;
//        } finally {
//            close(conn);
//        }
//        return i;
//    }
//
//    public int update(String sql) throws SQLException {
//        QueryRunner qu = new QueryRunner(true);
//        int i = 0;
//        Connection conn = null;
//        try {
//            conn = getConnection();
//            i = qu.update(conn, sql);
//
//        } catch (SQLException e) {
//            log.error("update sql error:", e);
//            throw e;
//        } finally {
//            close(conn);
//        }
//        return i;
//    }
//
//
//    public void execproc(String procname, ArrayList<UParameter> paras, Map<Integer, Object> outmaps) throws SQLException {
//        Connection conn = null;
//        CallableStatement callStmt = null;
//
//        try {
//            conn = getConnection();
//            procname = "{call " + procname + " (" + Strings.repeat("?,", paras.size()) + ")}";
//            callStmt = conn.prepareCall(procname);
//            int index = 1;
//            for (UParameter p : paras) {
//                Object pvalue = p.getValue();
//                if (p.getInOrOut() == 1) {
//                    if (pvalue.getClass() == String.class) {
//                        callStmt.setString(index, pvalue.toString());
//                    } else if (pvalue.getClass() == int.class ||
//                            pvalue.getClass() == Integer.class) {
//                        callStmt.setInt(index, Integer.parseInt(pvalue.toString()));
//                    } else if (pvalue.getClass() == Double.class ||
//                            pvalue.getClass() == double.class) {
//                        callStmt.setDouble(index, Double.parseDouble(pvalue.toString()));
//                    }
//                } else {
//                    callStmt.registerOutParameter(index, (int) pvalue);
//                    outmaps.put(index, null);
//                }
//                index++;
//            }
//            callStmt.execute();
//            Set<Integer> keys = outmaps.keySet();
//            for (Integer key : keys) {
//                outmaps.put(key, callStmt.getObject(key));
//            }
//        } catch (SQLException e) {
//            log.error("execproc error:", e);
//            throw e;
//        } finally {
//            close(callStmt);
//            close(conn);
//        }
//    }
//

    public void close(Connection conn) {
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException e) {
                log.error(e.getMessage());
            } finally {
                conn = null;
            }
        }
    }

    public void close(CallableStatement callStmt) {
        if (callStmt != null) {
            try {
                callStmt.close();
            } catch (SQLException e) {
                log.error(e.getMessage());
            } finally {
                callStmt = null;
            }
        }
    }


}