require("dotenv").config()
const playScraper = require("google-play-scraper")
const TelegramBot = require("node-telegram-bot-api")
const path = require("path")
const jsonfile = require("jsonfile")

const { promisify } = require("util")

const DATAFILE = path.resolve("./data.json")
const readJson = async (file = DATAFILE) => promisify(jsonfile.readFile)(file)
const writeJson = async (data, file = DATAFILE) =>
  promisify(jsonfile.writeFile)(file, data)

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true })

const TARGET_GROUP = "-1001146414818"

const getCurrentVersion = async () => {
  const data = await playScraper.app({
    appId: "com.tellm.android.app",
    cache: false
  })
  return data.version
}

async function run() {
  let data
  try {
    data = await readJson()
  } catch (e) {
    data = {
      version: "",
      lastChecked: 0
    }
    writeJson(data)
  }

  try {
    let playVersion = await getCurrentVersion()
    if (data.version !== playVersion) {
      data.version = playVersion
      bot.sendMessage(
        TARGET_GROUP,
        `Jodel version ${playVersion} is now on Play Store`
      )
    }
    data.lastChecked = Date.now()
    await writeJson(data)
  } catch (error) {
    console.error(error)
  }
  process.exit(0)
}

run()
