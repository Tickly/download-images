const axios = require('../../utils/axios');


axios.get('http://www.1kkk.com/ch1-469797-p6/imagefun.ashx', {
    cid: 469797,
    page: 2,
    key: '',
    maxcount: 10,
}, {
        headers: {
            'Accept':'*/*',
            'Referer': 'http://www.1kkk.com/ch1-469797-p6/',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest',
        }
    }).then(res => {
        console.log(res);

        var result = eval(res);

        console.log(result);
    }).catch(err => {
        console.log(err);
    })