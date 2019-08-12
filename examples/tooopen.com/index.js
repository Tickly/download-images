const Task = require('../../utils/task');
const $ = require('cheerio')
const path = require('path')

var task = new Task({
  dir: path.resolve(__dirname, 'imgs'),
  parseImageUrl (html) {
    return [
      ...$(html).find('#container img').map((i, e) => $(e).attr('src')).toArray(),
      ...JSON.parse($(html).find('#data-more').text()).map(v => v.imgthumb)
    ]
  },
  parseFilename ({ url, page, pageIndex, }) {
    return `${page}-${pageIndex}` + url.split('!')[0].split('/').pop();
  },
  // page 表示当前页数，是已经获取的页数
  // html 当前html内容，一般判断是否包含下一页的按钮即可
  hasNext (page, html, len) {
    return page < 3
  },
  getPageUrl (page) {
    return `http://www.tooopen.com/img/87_312_1_${page}.aspx`
  },
});

task.run();