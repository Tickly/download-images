const Task = require('../../utils/task');


var task = new Task({
    parseImageUrl(html) {
        var reg = new RegExp('<img src="(.*?)" onerror', 'g'),
            images = [],
            result;
        // reg = new RegExp('data-original="(.*?)"', 'g');
        while ((result = reg.exec(html)) != null) {
            images.push(result[1]);
        }
        return images;
    },
    parseFilename({ url, page }) {
        return page + '-' + url.split('!')[0].split('/').pop();
    },
    // page 表示当前页数，是已经获取的页数
    // html 当前html内容，一般判断是否包含下一页的按钮即可
    hasNext(page, html, len) {
        if (page >= 3) return false;
        // return (html.indexOf('page-next') > -1)
        return (html.indexOf('border-r') > -1)
    },
    getUrl(page) {
        return `http://www.tooopen.com/img/87_0_1_${page}.aspx`
    },
});

task.run();