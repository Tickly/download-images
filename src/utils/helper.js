const fs = require('fs'),
    axios = require('./axios');



function getArrayBuffer(url, options) {
    return axios.getArrayBuffer(url, options)
}
function writeFile(filename, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, content, (err) => {
            if (err) reject(err)
            else resolve(filename)
        })
    })
}

module.exports = {
    getArrayBuffer,
    writeFile,
}