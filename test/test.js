const fs = require('fs'),
    path = require('path');

const DownloadQueue = require('../utils/DownloadQueue');

// 图片列表
const urls = [

]



function _list(page) {
    if (page < 10) return []
    return false;
}

function _detail(id) {

}

function control() {
    let page = 1;

    let list;
    do {
        // console.log(page);
    } while ((list = _list(page++)));

    console.log(page);
}


control();


return;
var task = new DownloadQueue();

const imageDir = path.join(__dirname, 'images');

fs.mkdir(imageDir, err => {
    urls.forEach(url => {
        // 添加下载任务到队列，传两个参数，一个是图片请求参数，一个是保存本地路径文件名
        task.push({
            url,
            headers: {
                referer: 'http://www.ui.cn/list.html'
            }
        }, imageDir + '/' + url.split('/').pop());
    });

    task.run();
})