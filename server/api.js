const axios = require('axios')
const qs = require('qs')
const cheerio = require('cheerio');


/**
 *  axios post로 데이터 받아오는 함수
 * @param {*} url https://wis.hufs.ac.kr/src08/jsp/lecture/LECTURE2020L.jsp
 * @param {*} data 포스트로 넘길 폼 데이터 qs stringify
 */
async function getData(data) {
    return await axios.post("https://wis.hufs.ac.kr/src08/jsp/lecture/LECTURE2020L.jsp", data, {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'});
}

/**
 * 자리 남았는지 알려주는 함수
 * @param {*} res http response
 * @param {*} CN course number
 */
const parseGetLeftSeat = async (res, CN) => {
    return new Promise((resolve, reject) => {
        const $ = cheerio.load(res.data);
        $("#premier1 > div > table > tbody > tr > td").each((i, e) => {
            if (e.firstChild && e.firstChild.data == CN && e.next) {
                const tmp = e.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.next.firstChild.data.split('/')
                resolve(Number(tmp[1].trim()) - Number(tmp[0].trim()) < 1 ? false : true)
            }
        })
    })
}

const scanEmpty = async(data, CN, cb) => {
    if(await parseGetLeftSeat(await getData(data), CN)) cb()
    else {
        await scanEmpty(data,CN,cb)
    }
}

module.exports = {getData, parseGetLeftSeat, scanEmpty}