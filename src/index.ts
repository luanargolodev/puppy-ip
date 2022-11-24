import puppeteer from 'puppeteer'
import fs from 'fs'

const data: any[] = [];

async function getIpData(ip: string, page: puppeteer.Page) {
  await new Promise((r) => setTimeout(r, 2000))
  await page.$eval('input[name="ip"]', (el) => {
    if(el instanceof HTMLInputElement) {
      el.value = ''
    }
  })

  await page.type('input[name="ip"]', ip, { delay: 75 })
  await page.click('button[type="submit"]')

  await new Promise((r) => setTimeout(r, 2000))
  const result = await page.$eval('#codeOutput', (el) => el.textContent)

  if(result) {
    data.push(JSON.parse(result))
  }
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  })
  const page = await browser.newPage()
  await page.goto('https://ip-api.com/')

  const ips = ['24.105.30.129', '54.94.196.47', '182.162.135.1']
  for (const ip of ips) {
    await getIpData(ip, page)
  }

  fs.promises.writeFile('data.json', JSON.stringify(data))

  await browser.close()
})()