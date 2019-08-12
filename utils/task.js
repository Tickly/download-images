const axios = require('./axios.js'),
  helper = require('./helper'),
  path = require('path'),
  fs = require('fs');

module.exports = function ({
  // 从html解析出img的url
  parseImageUrl,
  // 从url解析出要保存的文件名
  parseFilename,
  // 是否有下一页
  hasNext,
  // 每一页的url
  getUrl,
  // 用来判断 下一页 的字符串
  nextPageString,
  // 保存图片文件的目录，相对于脚本目录，并且只能有一层，即不能包含 / 
  imageDir = 'images',
  startPage = 1,
  MaxPage = 0,
}) {
  // 这个用来保存待处理的队列
  var Queue = [];

  // 表示获取url的任务是否还在执行
  var isFetching = false;



  [
    'parseImageUrl',
    'parseFilename',
    'getUrl',
  ].forEach(v => {
    if ('function' !== typeof arguments[0][v]) {
      throw new Error(`参数${v}必须传入函数`);
    }
  });

  this.run = run;

  // 需要手动调用函数执行
  function run () {
    // 到这里开始执行
    mkdir(imageDir).then(() => {
      // mkdir(path.resolve(__dirname, imageDir)).then(() => {
      // 接下来开始任务，先抓取所有地址

      // 设置状态
      isFetching = true;
      onFetchTaskStart();
      fetch(startPage);


      onDownloadTaskBegin();
      downloadTask();
    });
  }


  // 创建目录
  function mkdir (dirPath) {
    return new Promise((resolve, reject) => {
      // 先保证目录存在，这里只考虑一层目录的情况
      fs.mkdir(dirPath, err => {
        if (err) {
          if ('EEXIST' === err.code) {
            resolve();
          } else {
            reject(err);
          }
        } else {
          resolve();
        }
      })
    });
  }

  // 是否可以进入下一步
  function canNext (page, html, len) {
    // 如果设置了最大页数，则优先判断最大页数
    if (!!MaxPage) {
      // 如果达到最大页数直接返回false，没有到最大页数，则去下一步判断
      if (page >= MaxPage) return false;

      // 如果设置了
      if (!!hasNext && ('function' === typeof hasNext)) {
        return hasNext(page, html, len)
      } else {
        return true;
      }
    } else {
      // 如果设置了
      if (!!hasNext && ('function' === typeof hasNext)) {
        return hasNext(page, html, len)
      }
    }
    return false;
  }


  function fetch (page) {
    // console.log(`下载第${page}页`);
    // console.log('fetch page:', page);
    var urlPage = getUrl(page)

    console.log('抓取网址', urlPage);

    onFetchPageChange(page);
    axios.get(urlPage)
      .then(html => {
        // 解析图片地址
        parseImageUrl(html, cheerio).forEach(urlImage => {
          Queue.push({
            page,
            url: urlImage,
            referer: urlPage,
          });
          console.log(urlImage);
        });
        console.log(urlPage);

        if (canNext(page, html, Queue.length)) {
          fetch(page + 1);
        } else {
          isFetching = false;
          onFetchTaskComplete(page);
        }
      })
      .catch(err => {
        console.log(err);
        if (err.response && 502 === err.response.status) {
          setTimeout(function () {
            console.log('访问频率过快，服务器拒绝，1s后尝试再试一次');
            fetch(page);
          }, 1000);
        }
      })
  }

  // 自动下载任务
  function downloadTask () {
    console.log('下载队列长度', Queue.length);
    if (Queue.length > 0) {
      // 如果队列里有数据，立刻处理
      let item = Queue.shift();
      onDownloadChange(item);

      download(item)
        .then(a => {
          // 下载完一个之后，立刻处理下一个
          setTimeout(function () {
            downloadTask();
          }, 0);
        })
    } else {
      // 如果下载队列里面已经没有要下载的任务
      // 那先判断是否还在执行抓取任务
      if (isFetching) {
        // 1s 检查一遍是否队列中存在数据
        setTimeout(function () {
          console.log('没有数据，1s后重试');
          downloadTask();
        }, 1000);
      } else {
        // 所有任务下载完成
        onDownloadTaskComplete();
      }
    }
  }


  // 下载文件，返回一个promise
  function download ({
    page,
    url,
    referer
  }) {
    var promise = new Promise((resolve, reject) => {
      var filename = parseFilename({
        url,
        page
      });

      console.log('保存文件名', filename);

      helper.getArrayBuffer(url, {
        headers: {
          referer
        }
      })
        .then(arraybuffer => {
          var filepath = path.join(imageDir, filename);
          helper
            .writeFile(filepath, arraybuffer)
            .then(path => {
              resolve(path);
            }).catch(err => {
              reject(err)
            })
        })
        .catch(err => {
          console.log('err', err);
        })
    });
    return promise
  }

  // 抓取任务change
  function onFetchPageChange (page) {
    console.log(`正在抓取第${page}页`);
  }
  // 抓取任务开始
  function onFetchTaskStart () {
    console.log('抓取任务开始');
  }
  // 抓取任务结束
  function onFetchTaskComplete () {
    console.log('抓取任务结束');
  }


  // 下载任务开始
  function onDownloadTaskBegin () {
    console.log('开始下载任务');
  }
  // 下载任务结束
  function onDownloadTaskComplete () {
    console.log('结束下载任务');
  }
  // 下载任务change
  function onDownloadChange ({
    url
  }) {
    console.log(`正在下载${url}`)
  }

}