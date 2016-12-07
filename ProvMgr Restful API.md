## ProvMgr Restful API ##

### 格式说明 ###
- `-H` —— HTTP请求报文Header应包含的字段
- `-d` —— HTTP请求报文Body
- HTTP响应报文Body为json格式字符串

### 错误码定义 ###

- **200** —— 成功
- **400** —— 错误
- **403** —— 未授权

### 1. 获取银行账户信息接口 ###

GET /report/bank-account?start\_day={startDay}&end\_day={endDay}

成功返回示例：  
{  
　　code: 200,  
　　data: [  
　　　　{  
　　　　　　bank\_name: "中国工商银行",  
　　　　　　account\_list:[  
　　　　　　　　{  
　　　　　　　　　　account\_id: "1000001",  
　　　　　　　　　　account\_no: "1000001",  
　　　　　　　　　　account\_name: "账户1"  
　　　　　　　　},  
　　　　　　　　{  
　　　　　　　　　　account\_id: "1000002",  
　　　　　　　　　　account\_no: "1000001",  
　　　　　　　　　　account\_name: "账户2"  
　　　　　　　　}  
　　　　　　]  
　　　　},  
　　　　{  
　　　　　　bank\_name: "中国银行",  
　　　　　　account\_list:[  
　　　　　　　　{  
　　　　　　　　　　account\_id: "1000001",  
　　　　　　　　　　account\_no: "1000001",  
　　　　　　　　　　account\_name: "账户1"  
　　　　　　　　},  
　　　　　　　　{  
　　　　　　　　　　account\_id: "1000002",  
　　　　　　　　　　account\_no: "1000001",  
　　　　　　　　　　account\_name: "账户2"  
　　　　　　　　}  
　　　　　　]  
　　　　}  
　　]  
}  

错误返回示例：  
{  
　　code: 400,  
　　message: "xxxxxxxxxxx"  
}  

### 2. 获取报表列表接口 ###

GET /report/:bank\_type/list?bank\_name={bankName}&account\_id={accountId}&start\_day={startDay}&end\_day={endDay}&report\_type={reportType}

> 说明：

>bank\_type取值:  
>- pbc —— 中国人民银行  
- cib —— 兴业银行（备付金存管银行）  
以下为合作银行  
- ccb —— 中国建设银行  
- pab —— 平安银行  
- spdb —— 浦发银行  
- bojs —— 江苏银行  

>report\_type只针对中国人民银行，该参数可选，取值如下:  
>- 0 —— 汇总类报表  
- 1 —— 账户类报表
  
> 针对中国人民银行，参数bank\_name、account\_id可选，且account\_id存在时bank\_name必须存在;  
> 针对合作银行，忽略bank\_name，中国建设银行、平安银行、浦发银行、江苏银行忽略参数account\_id 

示例：  
GET /report/pbc?bank\_name=1001&account\_id=1000001&start\_day=2016-11-01&end\_day=2016-11-30

GET /report/pbc?bank\_name=1001&start\_day=2016-11-01&end\_day=2016-11-30

GET /report/pbc?start\_day=2016-11-01&end\_day=2016-11-30

GET /report/ccb?start\_day=2016-11-01&end\_day=2016-11-30

成功返回示例：  
{  
　　code: 200,  
　　data: [  
　　　　{  
　　　　　　bank\_name: "中国工商银行",  
　　　　　　account\_id: "1000001",  
　　　　　　account\_no: "1000001",  
　　　　　　account\_name: "账户1",  
　　　　　　report\_name: "表1-1",  
　　　　　　report\_status: 1  
　　　　},  
　　　　{  
　　　　　　bank\_name: "中国工商银行",  
　　　　　　account\_id: "1000001",  
　　　　　　account\_no: "1000001",  
　　　　　　account\_name: "账户1",  
　　　　　　report\_name: "表1-2",  
　　　　　　report\_status: 1  
　　　　}  
　　]  
}  

错误返回示例：  
{  
　　code: 400,  
　　message: "xxxxxxxxxxx"  
}  

> 说明：  
> 中国建设银行、平安银行、浦发银行、江苏银行忽略bank\_name、account\_id、account\_no、account\_name  
> report\_status取值：0——未生成, 1——已生成  

### 3. 生成报表接口 ###

POST /report/:bank\_type/create -d {
　　start\_day: "xxx",  
　　end\_day: "xxx",  
　　report\_type: "xxx",  
　　report\_list: [  
　　　　{  
　　　　　　bank\_name: "xxx",  
　　　　　　account\_id: "xxx",  
　　　　　　account\_name: "xxx",  
　　　　　　account\_no: "xxx",  
　　　　　　report\_name: "xxx"  
　　　　},  
　　　　{  
　　　　　　bank\_name: "xxx",  
　　　　　　account\_id: "xxx",  
　　　　　　account\_name: "xxx",  
　　　　　　account\_no: "xxx",  
　　　　　　report\_name: "xxx"  
　　　　},  
　　　　{  
　　　　　　bank\_name: "xxx",  
　　　　　　account\_id: "xxx",  
　　　　　　account\_name: "xxx",  
　　　　　　account\_no: "xxx",  
　　　　　　report\_name: "xxx"  
　　　　}  
　　]  
}

> 说明：

>bank\_type取值:

>- pbc —— 中国人民银行
- cib —— 兴业银行（备付金存管银行）  
以下为合作银行
- ccb —— 中国建设银行
- pab —— 平安银行
- spdb —— 浦发银行
- bojs —— 江苏银行

> 针对中国人民银行，参数bank\_name、account\_id可选，且account\_id存在时bank\_name必须存在;
> 针对合作银行，忽略bank\_name、report\_type，中国建设银行、平安银行、浦发银行、江苏银行忽略参数account\_id

成功返回示例：  
{  
　　code: 200,  
　　message: "xxxx"  
}  

错误返回示例：  
{  
　　code: 400,  
　　message: "xxxxxxxxxxx"  
}  

### 4. 报送报表接口 ###

POST /report/:bank\_type/submit?start\_day={startDay}&end\_day={endDay}

> 说明：

>bank\_type取值:  
>- pbc —— 中国人民银行  
- cib —— 兴业银行（备付金存管银行）  
以下为合作银行  
- ccb —— 中国建设银行  
- pab —— 平安银行  
- spdb —— 浦发银行  
- bojs —— 江苏银行

成功返回实例:  
{  
　　code: 200,  
　　message: "xxxxxxxxxxx"  
}  

错误返回示例：  
{  
　　code: 400,  
　　message: "xxxxxxxxxxx"  
}  

### 5. 下载报表接口 ###

GET /report/:bank\_type/download?bank\_name={bankId}&account\_id={accountId}&start\_day={startDay}&end\_day={endDay}&report\_name={reportName}

> 说明：

>bank\_type取值:  
>- pbc —— 中国人民银行  
- cib —— 兴业银行（备付金存管银行）  
以下为合作银行  
- ccb —— 中国建设银行  
- pab —— 平安银行  
- spdb —— 浦发银行  
- bojs —— 江苏银行
  
> 针对中国人民银行，参数bank\_name、account\_id可选，且account\_id存在时bank\_name必须存在;  
> 针对合作银行，忽略bank\_name，中国建设银行、平安银行、浦发银行、江苏银行忽略参数account\_id  

示例：  
GET /report/pbc/download?bank\_name=1001&account\_id=1000001&start\_day=2016-11-01&end\_day=2016-11-30&report\_name=xxx

GET /report/pbc/download?bank\_name=1001&start\_day=2016-11-01&end\_day=2016-11-30&report\_name=xxx

GET /report/pbc/download?start\_day=2016-11-01&end\_day=2016-11-30

GET /report/ccb/download?start\_day=2016-11-01&end\_day=2016-11-30&report\_name=xxx

成功则返回文件  

错误返回示例：  
{  
　　code: 400,  
　　message: "xxxxxxxxxxx"  
}  

### 6. 下载所有报表接口 ###

GET /report/:bank\_type/download-all?start\_day={startDay}&end\_day={endDay}

> 说明：

>bank\_type取值:  
>- pbc —— 中国人民银行  
- cib —— 兴业银行（备付金存管银行）  
以下为合作银行  
- ccb —— 中国建设银行  
- pab —— 平安银行  
- spdb —— 浦发银行  
- bojs —— 江苏银行

成功则返回文件  

错误返回示例：  
{  
　　code: 400,  
　　message: "xxxxxxxxxxx"  
}  
