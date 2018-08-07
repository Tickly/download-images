const {
    URL,
    URLSearchParams,
} = require('url')



const Task = require('../../utils/task')


let task = new Task({
    parseImageUrl(res) {
        return res.result.pics_array.map(v => v.origin_img);
    },
    parseFilename({
        url
    }) {
        return url.split('/').pop().split('?')[0];
    },
    hasNext() {
        return false;
    },
    getUrl(page) {

        // http://wx.plusx.cn/activity/live/1031835?uniqCode=oxxr8oiLKt&from=groupmessage&state=STATE&isappinstalled=0
        // http://wx.plusx.cn/activity/live/4461544?activityNo=4461544&uniqCode=null

        let url = new URL('http://wx.plusx.cn/activity/live/pics');
        let params = new URLSearchParams({
            activityNo: 4461544,
            picIndex: 0,
            isNew: false,
            count: 999,
        })

        url.search = params;


        return url.toString();
    },
})

task.run();