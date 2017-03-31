const fs = require('fs'),
    path = require('path');

const DownloadQueue = require('../utils/DownloadQueue');

// 图片列表
const urls = [
    'http://img.ui.cn/data/file/6/9/9/1095996.jpg',
    'http://img.ui.cn/data/file/2/0/6/1087602.jpg',
    'http://img.ui.cn/data/file/9/0/9/1086909.jpg',
    'http://img.ui.cn/data/file/4/4/4/1086444.gif',
    'http://img.ui.cn/data/file/4/4/4/1080444.jpg',
    'http://img.ui.cn/data/file/7/0/1/1096107.jpg',
    'http://img.ui.cn/data/file/1/5/8/1075851.jpg',
    'http://img.ui.cn/data/file/9/8/0/1073089.jpg',
    'http://img.ui.cn/data/file/7/3/2/1073237.png',
    'http://img.ui.cn/data/file/8/7/9/1076978.jpg',
    'http://img.ui.cn/data/file/5/1/9/1068915.jpg',
    'http://img.ui.cn/data/file/6/5/1/1066156.png',
    'http://img.ui.cn/data/file/5/0/2/1058205.jpg',
    'http://img.ui.cn/data/file/1/3/8/1052831.png',
    'http://img.ui.cn/data/file/4/1/3/1043314.gif',
    'http://img.ui.cn/data/file/1/7/8/1036871.jpg',
    'http://img.ui.cn/data/file/6/5/4/1036456.jpg',
    'http://img.ui.cn/data/file/5/9/1/1035195.jpg',
    'http://img.ui.cn/data/file/9/6/1/1035169.jpg',
    'http://img.ui.cn/data/file/9/5/7/1031759.jpg',
    'http://img.ui.cn/data/file/0/4/5/1024540.jpg',
    'http://img.ui.cn/data/file/8/8/9/1023988.png',
    'http://img.ui.cn/data/file/6/6/6/1017666.jpg',
    'http://img.ui.cn/data/file/9/3/5/1016539.png',
    'http://img.ui.cn/data/file/2/6/5/1007562.jpg',
    'http://img.ui.cn/data/file/3/9/1/1006193.png',
    'http://img.ui.cn/data/file/4/0/0/1006004.png',
    'http://img.ui.cn/data/file/3/0/8/1002803.jpg',
    'http://img.ui.cn/data/file/4/8/5/1002584.png',
    'http://img.ui.cn/data/file/2/2/4/1000422.jpg',
    'http://img.ui.cn/data/file/4/7/5/992574.png',
    'http://img.ui.cn/data/file/2/2/5/991522.png',
    'http://img.ui.cn/data/file/4/6/7/983764.jpg',
    'http://img.ui.cn/data/file/1/1/3/983311.jpg',
    'http://img.ui.cn/data/file/9/5/7/981759.jpg',
    'http://img.ui.cn/data/file/0/8/5/981580.jpg',
    'http://img.ui.cn/data/file/8/3/7/974738.jpg',
    'http://img.ui.cn/data/file/3/7/0/967073.jpg',
    'http://img.ui.cn/data/file/5/5/4/960455.jpg',
    'http://img.ui.cn/data/file/8/4/9/959948.jpg',
    'http://img.ui.cn/data/file/7/6/9/959967.jpg',
    'http://img.ui.cn/data/file/5/6/7/959765.jpg',
    'http://img.ui.cn/data/file/6/3/1/950136.png',
    'http://img.ui.cn/data/file/3/0/8/943803.png',
    'http://img.ui.cn/data/file/8/2/6/943628.png',
    'http://img.ui.cn/data/file/2/7/7/937772.jpg',
    'http://img.ui.cn/data/file/0/4/1/933140.png',
    'http://img.ui.cn/data/file/3/3/0/933033.jpg',
    'http://img.ui.cn/data/file/7/2/0/927027.jpg',
    'http://img.ui.cn/data/file/9/2/8/926829.jpg',
    'http://img.ui.cn/data/file/4/8/8/925884.jpg',
    'http://img.ui.cn/data/file/8/8/9/920988.jpg',
    'http://img.ui.cn/data/file/5/0/6/915605.png',
    'http://img.ui.cn/data/file/5/0/3/915305.jpg',
    'http://img.ui.cn/data/file/9/9/7/914799.jpg',
    'http://img.ui.cn/data/file/7/0/8/910807.jpg',
    'http://img.ui.cn/data/file/8/0/9/908908.png',
    'http://img.ui.cn/data/file/2/3/6/900632.jpg',
    'http://img.ui.cn/data/file/0/7/4/900470.jpg',
    'http://img.ui.cn/data/file/3/3/2/898233.png',
    'http://img.ui.cn/data/file/8/6/5/896568.png',
    'http://img.ui.cn/data/file/1/1/2/890211.jpg',
    'http://img.ui.cn/data/file/7/2/8/889827.jpg',
    'http://img.ui.cn/data/file/8/7/5/889578.png',
    'http://img.ui.cn/data/file/5/4/0/889045.jpg',
    'http://img.ui.cn/data/file/0/1/3/875310.png',
    'http://img.ui.cn/data/file/5/2/9/872925.jpg',
    'http://img.ui.cn/data/file/0/7/3/866370.jpg',
    'http://img.ui.cn/data/file/1/7/8/866871.jpg',
    'http://img.ui.cn/data/file/2/9/7/866792.jpg',
    'http://img.ui.cn/data/file/7/1/0/861017.jpg',
    'http://img.ui.cn/data/file/5/7/5/859575.jpg',
    'http://img.ui.cn/data/file/1/5/9/852951.jpg',
    'http://img.ui.cn/data/file/5/0/7/851705.jpg',
    'http://img.ui.cn/data/file/2/5/3/851352.jpg',
    'http://img.ui.cn/data/file/0/5/9/850950.png',
    'http://img.ui.cn/data/file/0/4/8/850840.png',
    'http://img.ui.cn/data/file/3/0/1/850103.jpg',
]

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