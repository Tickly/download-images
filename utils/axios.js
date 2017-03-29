var axios = require('axios');

function handleAjax(ajax) {
    var promise = new Promise((resolve, reject) => {
        ajax
            .then(res => {
                if (200 === res.status) {
                    resolve(res.data);
                } else {
                    reject(res);
                }
            })
            .catch(err => {
                reject(err);
            })
    });
    return promise;
}

module.exports = {
    get(url, params, options = {}) {
        return handleAjax(axios.get(url, Object.assign({}, options, {
            params
        })));
    },
    getArrayBuffer(url, options = {}) {
        return handleAjax(axios.get(url, Object.assign({}, options, {
            responseType: 'arraybuffer'
        })))
    }
}
