'use strict'

const Url = use('App/Models/Url')
const base62 = require('base62/lib/ascii')

class PageController {
  async home({view, request, response}) {
    //url db rows 담을 변수
    let urlRows

    //클라이언트가 보낸 urls 쿠키 값 가져오기
    const cookie = request.plainCookie('urls')
    if(cookie){
      //값이 있으면
      //파싱해서 배열로 만듬
      let urlIds = cookie.split('|')
      //empty 항목 제거
      urlIds = urlIds.filter(Boolean)
      //62진수 id들 10진수로 변환
      urlIds = urlIds.map((x) => base62.decode(x))
      //10진수id로 db에서 url row들 가져옴
      urlRows = await Url.query().whereIn('id', urlIds).orderBy('id', 'desc').limit(20)
    }

    response.header('cache-control', 'no-store')
    return view.render('home', {urlRows})
  }
}

module.exports = PageController
