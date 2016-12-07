package com.qdb.provmgr.util;

import java.net.URLEncoder;

import javax.servlet.http.HttpServletRequest;

/**
 * @author mashengli
 */
public class HttpRequestUtil {

    public static String getAttachFileName(HttpServletRequest request, String sourceName) {
        String codedFileName = null;
        try {
            String agent = request.getHeader("USER-AGENT");
            if (null != agent) {
                if (agent.contains("MSIE") || agent.contains("Trident")) {
                    codedFileName = URLEncoder.encode(sourceName, "UTF8");
                } else if (agent.contains("Mozilla")){
                    codedFileName = new String(sourceName.getBytes(), "iso-8859-1");
                }
            } else {
                codedFileName = new String(sourceName.getBytes(), "ISO-8859-1");
            }
        } catch (Exception e) {
        }
        return codedFileName;
    }
}
