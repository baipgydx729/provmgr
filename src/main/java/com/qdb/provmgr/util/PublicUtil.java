package com.qdb.provmgr.util;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Map.Entry;
import javax.servlet.http.HttpServletRequest;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
  

/**
 * public util
 * 工具类
 * @author luming
 */
public class PublicUtil {
	public static Object[] listToObj(List<Object> list) {
		int mapLen = list.size();
		
		if(mapLen==0){
			return null;
		}
		
		Object[] params = new Object[mapLen];
		
		for(int i=0;i<mapLen;i++){
			params[i] = list.get(i);
		}
		
		return params;
	}
	public static boolean checkUrl(String url,HttpServletRequest request) {
		String data = request.getSession().getAttribute("urls").toString();
		JSONObject jsonObj = JSON.parseObject(data);
		JSONObject dataObj = jsonObj.getJSONObject("data");
		String urls="";
		if(dataObj.getJSONObject("qd0013") != null){
			JSONArray array = dataObj.getJSONObject("qd0013").getJSONArray("child");
			urls=JSON.toJSONString(array);
		}
		boolean flag= false;
		if(urls.contains(url)){
			flag=true;
		}
		System.out.println("urls:"+urls);
		System.out.println("url:"+url);
		System.out.println("flag:"+flag);
		return flag;
	}
	public static String MD5(String str) throws NoSuchAlgorithmException{
		byte [] buf = str.getBytes();
		MessageDigest md5 = MessageDigest.getInstance("MD5");
		md5.update(buf);
		byte [] tmp = md5.digest();
		StringBuilder sb = new StringBuilder();
		
		for (byte b:tmp) {
			sb.append(Integer.toHexString(b&0xff));
		}
//		System.out.println(sb);
		String MD5Str = sb.toString();
		return MD5Str;
	}
	public static String replaceBlank(String str) {
        String dest = "";
        if (str!=null) {
            Pattern p = Pattern.compile("\\s*|\t|\r|\n");
            Matcher m = p.matcher(str);
            dest = m.replaceAll("");
        }
        return dest;
    }
	/** 
     * 得到几天前的时间 
     *  
     * @param d 
     * @param day 
     * @return 
     */  
    public static Date getDateBefore(Date d, int day) {  
        Calendar now = Calendar.getInstance();  
        now.setTime(d);  
        now.set(Calendar.DATE, now.get(Calendar.DATE) - day);  
        return now.getTime();  
    }    
    /** 
     * 得到几天后的时间 
     *  
     * @param d 
     * @param day 
     * @return 
     */  
    public static Date getDateAfter(Date d, int day) {  
        Calendar now = Calendar.getInstance();  
        now.setTime(d);  
        now.set(Calendar.DATE, now.get(Calendar.DATE) + day);  
        return now.getTime();  
    }
    public static List<Object> mapByList(Map<String, Object> map){
		List<Object> list = new ArrayList<Object>();
		Set<Entry<String, Object>> set = map.entrySet();
		Iterator<Entry<String, Object>> it = set.iterator();
		//将map对象里面的属性循环遍历出来
		while(it.hasNext()){
			Entry<String, Object> entry = it.next();
			//得到value值，装到list里面，也可以entry.getKey()。
			//如果2个都需要装。可以弄成一个对象来装
			list.add(entry.getValue());
		}
		return list;
	}  
    
}
