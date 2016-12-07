package com.qdb.provmgr.util;

import java.beans.BeanInfo;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.collections.map.HashedMap;

import com.google.common.collect.Lists;
import com.qdb.provmgr.dao.entity.report.AccountInfoEntity;

/**
 * @author mashengli
 */
public class MapUtil {

    /**
     * 将map转为object对象
     * @param map map
     * @param beanClass beanclass
     * @return
     * @throws Exception
     */
    public static <T> T mapToObject(Map<String, Object> map, Class<T> beanClass) throws Exception {
        if (map == null || map.size() <= 0) {
            return null;
        }
        T obj = beanClass.newInstance();
//        BeanInfo beanInfo = Introspector.getBeanInfo(beanClass, Object.class);
//        PropertyDescriptor[] propertyDescriptors = beanInfo.getPropertyDescriptors();
//        for (PropertyDescriptor property : propertyDescriptors) {
//            Method setter = property.getWriteMethod();
//            if (setter != null) {
//                setter.invoke(obj, map.get(property.getName()));
//            }
//        }

        BeanUtils.copyProperties(obj, map);
//        PropertyUtils.copyProperties(obj, map);

        return obj;
    }

    /**
     * 将object转为map
     * @param obj bean对象
     * @return
     * @throws Exception
     */
    public static Map<String, Object> objectToMap(Object obj) throws Exception {
        if (obj == null)
            return null;

        Map<String, Object> map = new HashMap<>();

        BeanInfo beanInfo = Introspector.getBeanInfo(obj.getClass(), Object.class);
        PropertyDescriptor[] propertyDescriptors = beanInfo.getPropertyDescriptors();
        for (PropertyDescriptor property : propertyDescriptors) {
            String key = property.getName();
            if (key.compareToIgnoreCase("class") == 0) {
                continue;
            }
            Method getter = property.getReadMethod();
            Object value = getter != null ? getter.invoke(obj) : null;
            map.put(key, value);
        }
        return map;
    }

    /**
     * 将List<T>转换为List<Map<String, Object>>
     *
     * @param objList
     * @return
     */
    public static List<Map<String, Object>> objectsToMaps(List<Object> objList) throws Exception {
        List<Map<String, Object>> list = Lists.newArrayList();
        if (objList != null && objList.size() > 0) {
            Map<String, Object> map = null;
            for (Object obj : objList) {
                list.add(objectToMap(obj));
            }
        }
        return list;
    }

    /**
     * 将List<Map<String,Object>>转换为List<T>
     *
     * @param maps
     * @param clazz
     * @return
     * @throws InstantiationException
     * @throws IllegalAccessException
     */
    public static <T> List<T> mapsToObjects(List<Map<String, Object>> maps, Class<T> clazz) throws
            Exception {
        List<T> list = Lists.newArrayList();
        if (maps != null && maps.size() > 0) {
            for (Map<String, Object> map : maps) {
                list.add(mapToObject(map, clazz));
            }
        }
        return list;
    }

    public static void main(String[] args) {
        AccountInfoEntity accountInfoEntity = new AccountInfoEntity();
        accountInfoEntity.setAD("12");
        accountInfoEntity.setADID(123);
        accountInfoEntity.setBankName("中国银行");
        accountInfoEntity.setIsProvision(true);
        try {
            Map map = objectToMap(accountInfoEntity);
            System.out.println(map.values());

            Map<String, Object> map2 = new HashedMap();
            map2.put("AD", "123");
            map2.put("ADID", 12);
            map2.put("isProvision", true);
            map2.put("accState", 1);
            AccountInfoEntity accountInfoEntity2 = mapToObject(map2, AccountInfoEntity.class);
            System.out.println(accountInfoEntity2);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
