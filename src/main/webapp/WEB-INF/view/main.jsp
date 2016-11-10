<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="include.jsp"%>
<html>
<head>
    <title>备付金报表管理系统</title>
    <link rel="stylesheet" type="text/css" href="${ctxPath}/static/jquery-easyui/themes/default/easyui.css">
    <link rel="stylesheet" type="text/css" href="${ctxPath}/static/jquery-easyui/themes/color.css">
    <link rel="stylesheet" type="text/css" href="${ctxPath}/static/jquery-easyui/themes/icon.css">
    <link rel="stylesheet" type="text/css" href="${ctxPath}/static/jquery-easyui/demo/demo.css">
    <script src="${ctxPath}/static/jquery-easyui/jquery.min.js" type="text/javascript"></script>
    <script src="${ctxPath}/static/jquery-easyui/easyloader.js" type="text/javascript"></script>
    <script src="${ctxPath}/static/jquery-easyui/jquery.easyui.min.js" type="text/javascript"></script>
    <script src="${ctxPath}/static/jquery-easyui/jquery.easyui.mobile.js" type="text/javascript"></script>
</head>
<body>
<div style="margin:20px 0;width: 100%;height: auto"></div>
<div class="easyui-layout" style="width:700px;height:350px;">
    <div data-options="region:'north'" style="height:50px"></div>
    <div data-options="region:'south',split:true" style="height:50px;"></div>
    <div data-options="region:'east',split:true" title="East" style="width:180px;">
        <ul class="easyui-tree" data-options="url:'tree_data1.json',method:'get',animate:true,dnd:true"></ul>
    </div>
    <div data-options="region:'west',split:true" title="West" style="width:100px;">
        <div class="easyui-accordion" data-options="fit:true,border:false">
            <div title="Title1" style="padding:10px;">
                content1
            </div>
            <div title="Title2" data-options="selected:true" style="padding:10px;">
                content2
            </div>
            <div title="Title3" style="padding:10px">
                content3
            </div>
        </div>
    </div>
    <div data-options="region:'center',title:'Main Title',iconCls:'icon-ok'">
        <div class="easyui-tabs" data-options="fit:true,border:false,plain:true">
            <div title="About" data-options="href:'_content.html'" style="padding:10px"></div>
            <div title="DataGrid" style="padding:5px">
                <table class="easyui-datagrid"
                       data-options="url:'datagrid_data1.json',method:'get',singleSelect:true,fit:true,fitColumns:true">
                    <thead>
                    <tr>
                        <th data-options="field:'itemid'" width="80">Item ID</th>
                        <th data-options="field:'productid'" width="100">Product ID</th>
                        <th data-options="field:'listprice',align:'right'" width="80">List Price</th>
                        <th data-options="field:'unitcost',align:'right'" width="80">Unit Cost</th>
                        <th data-options="field:'attr1'" width="150">Attribute</th>
                        <th data-options="field:'status',align:'center'" width="50">Status</th>
                    </tr>
                    </thead>
                </table>
            </div>
        </div>
    </div>
</div>
</body>
</html>
