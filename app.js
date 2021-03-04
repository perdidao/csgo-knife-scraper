import Express from "express";
import Env from "dotenv";
import got from "got";
import cheerio from "cheerio";
import mysql from "mysql";
import AppSettings from "./app/settings.js";
Env.config();

const App = Express();
AppSettings(App);

var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_SECRET,
  database: process.env.DB_NAME,
});

connection.connect();

App.get("/", (rew, res) => {
  async function scrapeGutPrices() {
    const html = await got("https://www.proskins.gg/gut");
    const $ = cheerio.load(html.body);
    let data = [];

    $(".info-produto").each(function (i, el) {
      const item = {
        title: $(el).find(".nome-produto").text(),
        price: $(el).find(".preco-venda").text(),
        promotional: $(el).find(".preco-promocional").text(),
        storeId: 3,
      };
      data.push(item);
      connection.query(
        "INSERT INTO knifes SET ?",
        item,
        function (error, results, fields) {
          if (error) throw error;
        }
      );
    });

    return data;
  }

  scrapeGutPrices()
    .then((data) => {
      res.render("index", { title: "Scraper para skins", data });
    })
    .catch((e) => {
      console.log(e);
    });
});
