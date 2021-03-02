import Express from 'express'
import Env from 'dotenv'
import got from 'got'
import cheerio from 'cheerio'
import AppSettings from './app/settings.js'
Env.config()

const App = Express()
AppSettings(App)

App.get('/', (rew, res) => {
  async function scrapeGutPrices() {
    const html = await got('https://www.proskins.gg/gut')
    const $ = cheerio.load(html.body)
    let data = []

    $('.info-produto').each(function (i, el) {
      data.push({
        title: $(el).find('.nome-produto').text(),
        price: {
          default: $(el).find('.preco-venda').text(),
          promotional: $(el).find('.preco-promocional').text()
        }
      })
    })

    return data
  }

  scrapeGutPrices()
    .then((data) => {
      res.render('index', { title: 'Scraper para skins', data })
    })
    .catch((e) => {
      console.log(e)
    })
})
