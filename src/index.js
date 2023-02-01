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

// having the same video got boring
// i'm a little biased with my selections
const wrongKeyJumpscares = [
  "https://flipnot.es/KLJPMT",
  "https://youtu.be/XNakLxMVxs8",
  "https://redd.it/xtcwtt",
  "https://redd.it/xsclwq",
  "https://youtu.be/z_Pbq1VC5is",
  "https://youtu.be/vd_Xx1sf7bY",
  "https://youtu.be/lcC5xgx8ISk",
  "https://youtu.be/IbM9lJUn9N0",
  "https://youtu.be/PyYJx_Feboc",
  "https://eatpancakes.vercel.app",
  "https://youtu.be/YbrDTMQTA7M",
  "https://youtu.be/zUsgsEPALic",
  "https://g.co/____",
  "https://web.archive.org/web/20090404032633im_/https://www.google.com/mobile/m/brainsearch/index.html",
  "https://youtu.be/V-jgL7KKg6E",
  "https://youtu.be/CHr9BKj2CuE",
  "https://youtu.be/HZWbJC1WZGg",
  "https://twitter.com/GIRakaCHEEZER/status/1171305152076083200",
  "https://twitter.com/ricchuu_/status/1547179569261813760",
  "https://twitter.com/fruttymoment/status/1539991263763644416",
  "https://i.imgur.com/mAtHQNx.png",
  "https://hmpg.net/",
  "https://imgur.com/gallery/PZFMPAs",
  "https://raw.githubusercontent.com/Jased-0001/jased-0001.github.io/4bb4577b895cc49a71bb53b5bd15d844f2f05bc9/Brick.mp4",
  "https://imgur.com/c63FVbx",
  "https://i.imgur.com/3HUokmq.jpg", // now this is an incident
  "https://youtu.be/dN64s06xC7Q",
  "https://youtu.be/nZiH_Omabfo",
  "https://youtu.be/D0GusFnX178",
  "https://en.wikipedia.org/wiki/G%C3%A4vle_goat",
  "https://redd.it/rtl6il",
  "https://twitter.com/NightMargin/status/1601061269812891650",
  "https://i.imgur.com/NWOJVWi.png",
  "https://twitter.com/NightMargin/status/1202366163822317568",
  "https://twitter.com/GIRakaCHEEZER/status/1601689086569623552",
  "https://twitter.com/avolicis/status/1601019802407309312",
  "https://twitter.com/mothkoisi/status/1600913964526772225",
  "https://twitter.com/PomeloChewy/status/1599849105295310848",
  "https://twitter.com/GIRakaCHEEZER/status/1599566056632496128",
  "https://twitter.com/theluigiguy/status/1596886081626341377",
  "https://github.com/reactjs/reactjs.org/issues/3896",
  "https://twitter.com/MarioBrothBlog/status/1575182944980725760",
  "https://i.imgur.com/zEwYGGY.png",
  "https://redd.it/zl0x3y",
  "https://redd.it/zeqgvx",
  "https://redd.it/z1q4ys",
  "https://redd.it/ylbbiy",
  "https://redd.it/yottgb",
  "https://redd.it/tmg3eu",
  "https://redd.it/vstwpt",
  "https://redd.it/zl9hss",
  "https://youtu.be/qHKGb8IDszc",
  "https://youtu.be/hTAiHiKNXr0",
  "https://clips.twitch.tv/IgnorantSolidDragonfruitSMOrc-GfAzsz1q7GnRiyL5",
  "https://clips.twitch.tv/SoftGoldenArmadilloPartyTime-1nhoyeGqBAdoSsLm",
  "https://i.imgur.com/vamdPvA.png",
  "https://redd.it/10c4qdu",
  "https://commons.wikimedia.org/wiki/File:Buttered_cat.png",
  "https://stackoverflow.com/a/1732454",
  "https://youtu.be/GNTU0liO0vI?t=24"
]

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
  res.send(svg.replace("$TIMESINCEINCIDENT", friendlyTime(new Date(data.lastIncident)).split(" ago")[0]));
})

app.get('/api/reset', function (req, res) {
  let survivalTime = friendlyTime(new Date(data.lastIncident)).split(" ago")[0]
  if (req.query?.key != process.env.KEY) return res.redirect(wrongKeyJumpscares[Math.floor(Math.random()*wrongKeyJumpscares.length)]);
  data.lastIncident = Date.now();
  data.reason = req.query?.reason
  fs.writeFileSync(`${__dirname}/data.json`, JSON.stringify(data, null, 4));
  res.redirect("/?messup")
  axios.post(process.env.DISCORD_FAILHOOK, {
    content: `**NEW EPIC LIT DEV FAILURE JUST ARRIVED!**\nWe were incident-free for ${survivalTime}.\n\n${data.reason ? data.reason : "(too embarrassed to comment)"}\n<https://incidents.litdevs.org>`
  })
})

app.get('*', function (req, res) {
  res.render(__dirname + "/../public/index.ejs", { incidentTime: friendlyTime(new Date(data.lastIncident)), reason: data.reason ? `<b>${data.reason}</b>` : "(too embarrassed to comment)" });
})

app.listen(82)
