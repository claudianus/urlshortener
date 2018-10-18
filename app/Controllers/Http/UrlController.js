'use strict'

const Url = use('App/Models/Url')
const base62 = require('base62/lib/ascii')
const urlParse = require('url-parse')
const Env = use('Env')
const axios = require('axios')
const qs = require('querystring')

class UrlController {
  async store({antl, request, response, session}) {
    const url = request.input('url').trim()

    if(Env.get('RECAPTCHA_ENABLED') === 'true') {
      //recaptcha 사용 설정이면
      const recaptchaInput = request.input('g-recaptcha-response')
      //recaptcha 검사
      if(!recaptchaInput) {
        //recaptcha 값이 없으면
        session.flash({error: 'ILLEGAL ACCESS'})
        return response.route('home')
      }

      //recaptcha 검증
      const recaptchaRes = await axios.post('https://www.google.com/recaptcha/api/siteverify', qs.stringify({
        secret: Env.get('RECAPTCHA_SECRETKEY'),
        response: recaptchaInput
      }))

      if(!recaptchaRes.data.success) {
        //recaptcha 유효하지 않음
        session.flash({error: 'ILLEGAL ACCESS'})
        return response.route('home')
      }
    }

    //url 유효성 검사
    const urlp = urlParse(url)
    const valid = (urlp.protocol == 'http:' || urlp.protocol == 'https:') && urlp.slashes && urlp.href && urlp.href.length > 3 && urlp.host != urlParse(Env.get('APP_URL')).host
    if(!valid){
      //유효하지 않으면
      session.flash({error: antl.formatMessage("messages.NotValidUrl")})
      return response.route('home')
    }

    //db에 url 이미 있으면 그거 가져오고 없으면 새로생성
    const newUrl = await Url.findOrCreate({url}, {url})
    if(!newUrl) {
      //도중에 오류나면
      session.flash({error: antl.formatMessage("messages.UnknownError")})
      return response.route('home')
    }
    //오류안나면

    //url row id 62진수로 인코딩
    const urlId62 = base62.encode(newUrl.id)
    session.flash({ url: `${Env.get('APP_URL')}/${urlId62}` })

    //클라이언트 쿠키 가져오기 (클라이언트가 생성한 url 기록)
    let oldUrlCookie = request.plainCookie('urls')
    if(oldUrlCookie) {
      //쿠키 있으면
      //파싱해서 배열로 만듬
      let urlIds = oldUrlCookie.split('|')
      //empty 항목 제거
      urlIds = urlIds.filter(Boolean)
      //최근 생성한 19개 기록 까지만 남기기, 이후 방금 생성한 한개 추가해서 20개가 됨
      urlIds = urlIds.slice(-19)
      //배열 다시 쿠키로 변환
      oldUrlCookie = urlIds.join('|') + '|'
    }

    //클라이언트 쿠키 설정, 이 부분에서 방금 생성한 url 기록 추가해줌
    response.plainCookie('urls', `${oldUrlCookie ? oldUrlCookie : ''}${urlId62}|`)

    return response.route('home')
  }

  async redirect({response, params}) {
    //db에서 original url 찾기
    const url = await Url.find(base62.decode(params.id62))
    if(!url) {
      //없으면 홈으로
      response.header('cache-control', 'no-store')
      return response.status(404).send()
    }
    //있으면

    //hit 수 증가후 저장
    url.hit++
    await url.save()

    //original url 디코드후 인코드 (여러문제 해결해줌)
    const encoded = encodeURI(decodeURI(url.url))

    //oroginal url으로 리다이렉트
    response.header('cache-control', 'public, max-age=2592000, s-maxage=2592000')
    return response.redirect(encoded, false, 302)
  }
}

module.exports = UrlController
