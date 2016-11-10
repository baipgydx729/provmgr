<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="../include.jsp"%>
<html>
<head>
    <title></title>
    <link rel="stylesheet" type="text/css" href="${ctxPath}/static/jquery-easyui/themes/default/easyui.css">
    <link rel="stylesheet" type="text/css" href="${ctxPath}/static/jquery-easyui/themes/color.css">
    <link rel="stylesheet" type="text/css" href="${ctxPath}/static/jquery-easyui/themes/icon.css">
    <link rel="stylesheet" type="text/css" href="${ctxPath}/static/jquery-easyui/demo/demo.css">
    <script src="${ctxPath}/static/jquery-easyui/jquery.min.js" type="text/javascript"></script>
    <script src="${ctxPath}/static/jquery-easyui/easyloader.js" type="text/javascript"></script>
    <script src="${ctxPath}/static/jquery-easyui/jquery.easyui.min.js" type="text/javascript"></script>
    <script src="${ctxPath}/static/jquery-easyui/jquery.easyui.mobile.js" type="text/javascript"></script>
    <script src="${ctxPath}/static/bootstrap/dist/css/bootstrap.css" type="text/javascript"></script>
</head>
<body>
<nav class="navbar navbar-fixed-top navbar-default" role="navigation">
<div class="container">
    <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar"
                aria-expanded="false" aria-controls="navbar" style="border-color: #337ab7;">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar" style="background-color: #337ab7"></span>
            <span class="icon-bar" style="background-color: #337ab7"></span>
            <span class="icon-bar" style="background-color: #337ab7"></span>
        </button>
        <a class="navbar-brand" href="/">
            <img alt="qiandaiLogo" src="${ctxPath}/static/img/navLogo.png" style="height: 36px;position: relative;top: -7px;">
        </a>
    </div>
    <div id="navbar" class="collapse navbar-collapse navbar-default">
        <ul class="nav navbar-nav navbar-right" id="mytab">
            <li role="presentation" class=""><p>欢迎您：${userName}</p></li>
            <li role="presentation" class=""></li>
            <li role="presentation" class=""><a href="/logout">退出</a></li>
        </ul>
    </div>
</div>
</nav>
</body>