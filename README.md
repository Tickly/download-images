# 简介

目的是打算可以写一个通用的，批量下载网页图片，支持自动翻页下载的工具。

目前可以查看examples文件夹查看现在的写法

设计上还不是很优雅，也会慢慢去改进的。



下一步的想法是，分离出自动下载队列，只要给出要下载的图片的列表就可以自动下载。


# 参数

| 名称 | 描述 | 类型 | 可选值 | 默认值 |
| --- | --- | :---: | :---: | :---: |
| startPage | 起始页数 | Number | | 1 |
| imageDir | 下载图片存放的文件夹名称，如果不设置会自动设置为网站域名 | String | - | 网站域名 |
| gerNextPageUrl(page) | 调用此方法得到下一页的url | function | - | - | 
| nextPageString | 判断下一页的字符串 | String | - | - |

# 事件

| 名称 | 描述 | 参数 |
| --- | --- | :---: |
|  |  | - |



# 方法

| 名称 | 参数 | 描述 |
| --- | --- | --- |
|  |  |  |

