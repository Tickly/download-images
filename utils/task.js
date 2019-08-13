const axios = require('./axios.js'),
  helper = require('./helper'),
  path = require('path'),
  fs = require('fs');

const defaultOptions = {
  isFetching: false,
  startPage: 1,
  // 下载任务结束
  onDownloadTaskComplete: () => {
    console.log('结束下载任务');
  }
}



class DownloadQueue {
  constructor () {
    this.queue = []
  }

  /**
   * 尾端添加一个
   */
  enqueue (item) {
    this.queue.push(item)
  }

  /**
   * 移除并返回开头的
   */
  dequeue () {
    return this.queue.shift()
  }

  toArray () {
    return [...this.queue]
  }

  get length () {
    return this.queue.length
  }

}


// 图片下载器
class ImageDownloader {
  constructor (options) {
    let { getUrl } = options

    Object.assign(this, defaultOptions, options)

    // 这个用来保存待处理的队列
    this.downloadQueue = new DownloadQueue()
  }

  // 需要手动调用函数执行
  run () {
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

    // 到这里开始执行
    mkdir(this.downloadPath).then(() => {
      // 接下来开始任务，先抓取所有地址

      // 设置状态
      this.isFetching = true;

      this.fetch(this.startPage);


      this.downloadNext();
    });
  }

  fetch (page) {
    var pageUrl = this.getPageUrl(page)

    axios.get(pageUrl)
      .then(html => {
        // 解析图片地址
        this.parseImageUrl(html).forEach((urlImage, i) => {
          let download = {
            page,
            pageIndex: i,
            url: urlImage,
            referer: pageUrl,
          }
          // 添加到下载队列
          this.downloadQueue.enqueue(download);
        });

        if (this.hasNext(page, html, this.downloadQueue.length)) {
          this.fetch(page + 1);
        } else {
          this.isFetching = false;
        }
      })
      .catch(err => {
        console.log(err);
        if (err.response && 502 === err.response.status) {
          setTimeout(() => {
            console.log('访问频率过快，服务器拒绝，1s后尝试再试一次');
            this.fetch(page);
          }, 1000);
        }
      })
  }

  // 自动下载任务
  downloadNext () {
    console.log('下载队列长度', this.downloadQueue.length);
    if (this.downloadQueue.length > 0) {
      // 如果队列里有数据，立刻处理
      let item = this.downloadQueue.dequeue();

      this.download(item)
        .then(a => {
          // 下载完一个之后，立刻处理下一个
          setTimeout(() => {
            this.downloadNext();
          }, 0);
        })
    } else {
      // 如果下载队列里面已经没有要下载的任务
      // 那先判断是否还在执行抓取任务
      if (this.isFetching) {
        // 1s 检查一遍是否队列中存在数据
        setTimeout(() => {
          console.log('没有数据，1s后重试');
          this.downloadNext();
        }, 1000);
      } else {
        // 所有任务下载完成
        this.onDownloadTaskComplete();
      }
    }
  }

  // 下载文件，返回一个promise
  download ({
    page,
    url, pageIndex,
    referer
  }) {
    return new Promise((resolve, reject) => {
      let filename = this.parseFilename({
        url,
        page,
        pageIndex
      });
      let filepath = path.join(this.downloadPath, filename);

      helper.getArrayBuffer(url, {
        headers: {
          referer
        }
      })
        .then(arraybuffer => {
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
  }
}

module.exports = ImageDownloader