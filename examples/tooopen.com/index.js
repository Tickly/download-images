const Task = require('../../utils/task');
const $ = require('cheerio')

var task = new Task({
  parseImageUrl (html) {
    return $(html).find('#container img').map((i, e) => $(e).attr('src')).toArray()
  },
  parseFilename ({ url, page }) {
    return page + '-' + url.split('!')[0].split('/').pop();
  },
  // page 表示当前页数，是已经获取的页数
  // html 当前html内容，一般判断是否包含下一页的按钮即可
  hasNext (page, html, len) {
    if (page >= 3) return false;
    // return (html.indexOf('page-next') > -1)
    return (html.indexOf('border-r') > -1)
  },
  getUrl (page) {
    return `http://www.tooopen.com/img/87_312_1_${page}.aspx`
  },
});

task.run();