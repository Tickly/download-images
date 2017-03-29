const Task = require('../../src/utils/task');

var task = new Task({
    parseImageUrl(html) {
        var reg = new RegExp('<img .*? data-original="(.*?)"', 'g'),
            images = [],
            result;
        // reg = new RegExp('data-original="(.*?)"', 'g');
        while ((result = reg.exec(html)) != null) {
            images.push(result[1]);
        }
        return images;
    },
    parseFilename({ url, page }) {
        return page + '-' + url.split('/').pop();
    },
    // page 表示当前页数，是已经获取的页数
    // html 当前html内容，一般判断是否包含下一页的按钮即可
    hasNext(page, html, len) {
        return (html.indexOf('\'next\'') > -1)
    },
    MaxPage: 0,
    getUrl(page) {
        return `http://www.ui.cn/list.html?p=${page}&tag=0&r=edit&subcatid=2&catid=0`
    },
});
task.run();