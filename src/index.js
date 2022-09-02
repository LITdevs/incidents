const fs = require('fs')
const express = require('express')
const app = express()
const svg = fs.readFileSync(`${__dirname}/incidents.svg`, 'utf8');
const axios = require('axios').default;
var friendlyTime = require('friendly-time');
var data
if (!fs.existsSync(`${__dirname}/data.json`)) {
  fs.writeFileSync(`${__dirname}/data.json`, '{"lastIncident": 0}')
}
data = JSON.parse(fs.readFileSync(`${__dirname}/data.json`, 'utf8').toString());
require("dotenv").config();

// middleware shit
const nocache = require('nocache');
const cors = require('cors');
app.use(nocache());
app.use(express.json());
app.use(cors());
app.use("/resources", express.static('public/resources'));
app.set("view engine", "ejs");

app.get('/reset', function (req, res) {
  res.send('<link rel="icon" href="/resources/favicon.ico" type="image/x-icon"><title>Here we go again...</title><audio autoplay loop src="/resources/messup.ogg"></audio><h1>Congratulations, LIT Dev!</h1><p>If you are one, and you are here, you probably messed up really badly.<br>This is pretty common here! Enter the secret key, and optionally, a reason.</p><form action="/api/reset"><input type="password" name="key"><input type="submit" value="Reset"><br><br><input type="text" name="reason" placeholder="optional reason"></form>')
})

app.get('/api/image', function (req, res) {
  res.header("Content-Type","image/svg+xml");
  res.send(svg.replace("$TIMESINCEINCIDENT", friendlyTime(new Date(data.lastIncident))));
})

app.get('/api/reset', function (req, res) {
  if (req.query?.key != process.env.KEY) return res.redirect("https://youtu.be/S_ReALgXhBE");
  data.lastIncident = Date.now();
  data.reason = req.query?.reason
  fs.writeFileSync(`${__dirname}/data.json`, JSON.stringify(data, null, 4));
  res.redirect("/?messup")
  axios.post(process.env.DISCORD_FAILHOOK, {
    content: `**NEW EPIC LIT DEV FAILURE JUST ARRIVED!**\n${data.reason ? data.reason : "(too embarrassed to comment)"}`
  })
})

app.get('*', function (req, res) {
  res.render(__dirname + "/../public/index.ejs", { incidentTime: friendlyTime(new Date(data.lastIncident)), reason: data.reason ? `<b>${data.reason}</b>` : "(too embarrassed to comment)" });
})

app.listen(82)
