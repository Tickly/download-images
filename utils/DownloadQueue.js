const helper = require('./helper');



class DownloadItem {
    constructor(option, filename) {
        this.option = option;
        this.filename = filename;
    }
}

class DownloadQueue {
    constructor() {
        this.Queue = [];
    }

    // 开始任务
    run() {
        var loop = () => {
            this.next()
                .then((task) => {
                    console.log(task);
                    loop();
                })
                .catch((err) => {
                    console.log(err);
                    console.log('finished');
                })
        }

        loop();

        return this;
    }

    // 处理任务
    next() {
        // 
        return new Promise((resolve, reject) => {
            var task = this.Queue.shift();
            if (task) {
                helper.getArrayBuffer(task.option.url, task.option)
                    .then(ab => {
                        helper.writeFile(task.filename, ab)
                            .then((filename) => {
                                resolve(filename)
                            })
                            .catch(err => {
                                reject(err);
                            });
                    }).catch(err => {
                        reject(err);
                    });
            } else {
                // 任务结束
                reject('finished');
            }
        })
    }




    // 添加一个下载项
    // option 为请求参数，也可以只是一个url
    // filename 为文件路径+文件名
    push(option, filename) {
        if ('string' === typeof option) {
            option = {
                url: option
            }
        }
        // console.log(option, filename);
        this.Queue.push(new DownloadItem(option, filename));
    }

    // 立即结束下载任务
    abort() {

    }
    // 等待下载完成后自动结束
    // 调用这个方法表示之后已经不会再有新的下载任务被添加
    abortWhenDownloadFinished() {

    }

}


module.exports = DownloadQueue






