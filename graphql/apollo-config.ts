import Cookies from 'js-cookie'
const pkg = require('../package')
const HOST = process.env.HOST
const PORT = process.env.PORT
const PROXY_URL = HOST ? `http://${HOST}:${PORT}` : ''
const headers = {
  Accept: 'application/json',
  'App-Version': pkg.version,
  'App-Platform': 'Web',
}
if (Cookies.get('token')) Object.assign(headers, { authorization: Cookies.get('token') });

export default ({ app, store }) => {
  const lang = app.i18n && app.i18n.locale || 'th'
  // console.log(lang,'apollo lang')
  return {
    httpEndpoint: `${PROXY_URL}/${lang}/api/graphql`,
    httpLinkOptions: {
      credentials: 'same-origin',
      headers: headers
    },
    inMemoryCacheOptions: {
      freezeResults: false
    }
  }
}
