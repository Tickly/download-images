const Task = require('../../src/utils/task');


var task = new Task({
    parseImageUrl(html) {
        var reg = new RegExp('<img src="(.*?)"', 'g'),
            images = [],
            result;
        reg = new RegExp('data-original="(.*?)"', 'g');
        while ((result = reg.exec(html)) != null) {
            images.push(result[1]);
        }
        return images;
    },
    parseFilename({ url, page }) {
        return page + '-' + url.split('!')[0].split('/').pop();
    },
    // page 表示当前页数，是已经获取的页数
    hasNext(page, html, len) {
        if (page >= 3) return false;
        // return (html.indexOf('page-next') > -1)
        return (html.indexOf('downPage') > -1)
    },
    getUrl(page) {
        return `http://588ku.com/beijing/0-27-pxnum-0-8-0-0-0-${page}/`
    }
});


task.run();