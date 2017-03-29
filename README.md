# 简介




# 参数

| 名称 | 描述 | 类型 | 可选值 | 默认值 |
| --- | --- | :---: | :---: | :---: |
| startPage | 起始页数 | Number | | 1 |
| maxPage | 最大获取的页数 | Number | - | - |
| imageDir | 下载图片存放的文件夹名称，如果不设置会自动设置为网站域名 | String | - | 网站域名 |
| gerNextPageUrl(page) | 调用此方法得到下一页的url | function | - | - | 
| nextPageString | 判断下一页的字符串 | String | - | - |

# 事件

| 名称 | 描述 | 参数 |
| --- | --- | :---: |
| onPageChange |  | - |



# 方法

| 名称 | 参数 | 描述 |
| --- | --- | --- |
| add | url,filename | 添加一个待下载对象到待下载队列里面 |

