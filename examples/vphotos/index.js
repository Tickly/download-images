const axios = require('axios'),
    qs = require('qs'),
    fs = require('fs');


const helper = require('../../utils/helper');



const weChatId = '7791F3DF21E9CA3E8B97D237DB6BB561';

const dirPath = 'images';

axios.post('http://api.vphotos.cn/vphotosClient/getPhotoAlbumPhotographListByWeChatId', qs.stringify({
    weChatId,
    pageSize: 0,
    // photoId: '',
    sort: 'desc',
    // photoSizeType:
    rd: 0,
    recommend: 0,
    // displayType:,
    // sign:,
    // uId,
})).then(res => {
    // console.log(res);
    if (200 === res.status) {
        return res.data.data
    }
}).then(({ photos }) => {
    // 这里拿到所有照片
    // 先把目录创建出来
    fs.mkdir(dirPath, err => {
        // 不管是否报错，直接开始获取
        next();
    })
    // 获取
    function next() {
        if (photos.length === 0) return;

        var item = photos.shift();


        getPhotoUrl(item).then(({ smallUrl }) => {
            // 下载图片并保存
            helper.getArrayBuffer(smallUrl).then(arraybuffer => {
                helper.writeFile(dirPath + '/' + item.photoName, arraybuffer).then(filepath => {
                    console.log('download ' + filepath, photos.length);
                    next();
                })
            })
        })
    }
}).catch(err => {
    console.log(err);
})






// 获取高清图片地址
function getPhotoUrl({ photoSizeType = 4, photoId }) {
    return axios
        .post('http://api.vphotos.cn/vphotosClient/getPhotoUrl', qs.stringify({
            photoSizeType, photoId, weChatId,
        }))
        .then(handleResponse)
}


// 自动处理请求数据
function handleResponse(res) {
    if (200 === res.status) {
        return res.data.data
    }
}






