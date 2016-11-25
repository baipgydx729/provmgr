package com.qdb.provmgr.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * @author mashengli
 */
@Controller
public class MainController {

    @RequestMapping(value = "main", method = RequestMethod.GET)
    public String main(HttpServletRequest request, HttpServletResponse response) {
        return "main";
    }
}
