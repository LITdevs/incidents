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
  "https://youtu.be/XNakLxMVxs8", // niko doesn't like cuss words
  "https://redd.it/xtcwtt", // squeaky niko
  "https://redd.it/xsclwq", // niko summons demon pancakes
  "https://youtu.be/vd_Xx1sf7bY", // club penguin snow halation
  "https://eatpancakes.vercel.app", // niko eats a lot of pancakes
  "https://youtu.be/YbrDTMQTA7M", // niko needs to vent (like in among us)
  "https://g.co/____", // the gboard bar - really long bar as keyboard
  "https://web.archive.org/web/20090404032633im_/https://www.google.com/mobile/m/brainsearch/index.html", // google "brain search", if this rots i will be so surprised
  "https://youtu.be/V-jgL7KKg6E", // result.mp4 - music made by ai, YOU "MADE" THIS I DON'T THINK IT'S GONNA DISAPPEAR
  "https://twitter.com/GIRakaCHEEZER/status/1171305152076083200", // niko plush fancomic - https://archive.ph/iSJZR https://web.archive.org/web/20190925205308/https://twitter.com/GIRakaCHEEZER/status/1171305152076083200
  "https://twitter.com/ricchuu_/status/1547179569261813760", // niko crying (boohoo)
  "https://twitter.com/fruttymoment/status/1539991263763644416", // niko says "meow" (revolutionary)
  "https://wanderers.cloud/file/HcFRmg.png", // vukky and unnamed user discuss food preperation methods
  "https://hmpg.net/", // the end of the internet
  "https://raw.githubusercontent.com/Jased-0001/jased-0001.github.io/4bb4577b895cc49a71bb53b5bd15d844f2f05bc9/Brick.mp4", // spinning brick but unusually long video length
  "https://wanderers.cloud/file/2dyLEg.jpeg", // kao-chan murdered by lightning
  "https://youtu.be/nZiH_Omabfo", // smiling pile of poo
  "https://en.wikipedia.org/wiki/G%C3%A4vle_goat",
  "https://redd.it/rtl6il", // bribing gf with gacha pulls
  "https://twitter.com/NightMargin/status/1601061269812891650", // alula questions blowing up the car(tridge) - https://archive.ph/RGfix http://web.archive.org/web/20230206093414/https://twitter.com/NightMargin/status/1601061269812891650
  "https://twitter.com/mothkoisi/status/1600913964526772225", // niko figures out that the sun goes in the sun-shaped hole - archiving failed
  "https://github.com/reactjs/reactjs.org/issues/3896", // is it safe to use "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED"?
  "https://twitter.com/MarioBrothBlog/status/1575182944980725760", // one-character-kun
  "https://wanderers.cloud/file/1LH7uQ.png", // owo you fowond me!! nyaa~ cwan youo comoe towo my howose and giv me somoe pwets?? ^w^
  "https://redd.it/zeqgvx", // person uses rs3 action bar icons to make it look like someone slipped on a banana
  "https://redd.it/z1q4ys", // 6 people online on sussyscape
  "https://redd.it/ylbbiy", // bird steals an airpod from a news reporter
  "https://redd.it/yottgb", // you finally found the source of the bug! it's a variable named "temp"
  "https://youtu.be/hTAiHiKNXr0", // niko has arrived! (if this rots i will be so sad and cry and angwy)
  "https://clips.twitch.tv/IgnorantSolidDragonfruitSMOrc-GfAzsz1q7GnRiyL5", // neuro-sama sez you should not invest in bitcons
  "https://clips.twitch.tv/SoftGoldenArmadilloPartyTime-1nhoyeGqBAdoSsLm", // neuro-sama's favorite gutworm is rm -rf
  "https://trash.vukky.net/file/srPPaw.png", // sussy reddit logo in css
  "https://youtu.be/o7XxKCMaPUY", // a plane pets niko (by murder)
  "https://redd.it/10c4qdu", // 95% of prize pool, 50% of prize pool, 35% of prize pool... u wot m8
  "https://commons.wikimedia.org/wiki/File:Buttered_cat.png",
  "https://stackoverflow.com/a/1732454", // You can't parse [X]HTML with regex.
  "https://youtu.be/GNTU0liO0vI?t=24", // yaYA!!! go to TEM eSHOP!!!
  "https://twitter.com/cirkelnio/status/1606069515783217153", // richard smallman, head of the twee software foundation
  "https://twitter.com/TriciaLockwood/status/1108102037072433153", // jail for mother for One Thousand Years!!!!
  "https://redd.it/zf4n02", // the quest npcs when you hold spacebar
  "https://twitter.com/GIRakaCHEEZER/status/1604385264478334976", // way too many nikos on the couch!
  "https://redd.it/10quav3", // niko uses the very healthy and not burning computer
  "https://redd.it/10sjsyh", // "sidewalk" rotom
  "https://twitter.com/oskdev/status/1620796870330023936", // thank you for the lovely [[CONNECTION ERROR]] kagari
  "https://redd.it/10ydnbb" // chatgpt plays chess by summoning new pieces and completely breaking the laws of chess piece movement
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
    content: `**NEW EPIC LIT DEV FAILURE JUST ARRIVED!**\nWe were incident-free for ${survivalTime}.\n\n${data.reason || "(too embarrassed to comment)"}\n<https://incidents.litdevs.org>`
  })
})

app.get('*', function (req, res) {
  res.render(__dirname + "/../public/index.ejs", { incidentTime: friendlyTime(new Date(data.lastIncident)), reason: data.reason ? `<b>${data.reason}</b>` : "(too embarrassed to comment)" });
})

app.listen(82)
