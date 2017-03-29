const Task = require('../../src/utils/task');


var task = new Task({
    getUrl(page) {
        return `http://www.ivsky.com/tupian/ziranfengguang/index_${page}.html`;
    },
    hasNext(page, html, len) {
        return (html.indexOf('page-next') > -1)
    },
    parseImageUrl(html) {
        var reg = new RegExp('<img src="(.*?)"', 'g'),
            images = [],
            result;
        while ((result = reg.exec(html)) != null) {
            images.push(result[1]);
        }
        return images;
    },
    parseFilename({ url, page }) {
        return page + '-' + url.split('/').pop();
    },
});


task.run();