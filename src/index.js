// as you can tell i don't backend
// there are probably better ways to do this
// it was fun though!

const fs = require('fs')
const express = require('express')
const app = express()
const vukkyLogo = fs.readFileSync(`${__dirname}/vukky.svg`, 'utf8'); 
const vukkyLogoBG = fs.readFileSync(`${__dirname}/vukkybg.svg`, 'utf8'); 
var vukkyColor = "#00a8f3";
var vukkyBackground = "#7289da";
var vukkyFlame = "#ff3f3f";
const rateLimit = require("express-rate-limit");

// middleware shit
const nocache = require('nocache');
const cors = require('cors');
app.use(nocache());
app.use(express.json());
app.use(cors());

app.get('/', function (req, res) {
  res.send('Hii! It\'s me, the LIT Devs logo API!')
})

app.get('/api/vukky', function (req, res) {
  res.header("Content-Type","image/svg+xml");
  res.send(vukkyLogo.replace("$USERSELECTEDCOLORHERE", vukkyColor));
})

app.get('/api/vukky/bg', function (req, res) {
  res.header("Content-Type","image/svg+xml");
  res.send(vukkyLogoBG.replace("$USERSELECTEDCOLORHERE", vukkyColor).replace("$USERSELECTEDBGHERE", vukkyBackground).replace("$USERSELECTEDFLAMEHERE", vukkyFlame));
})

app.get('/api/color', function (req, res) {
  res.send({"color": vukkyColor, "bg": vukkyBackground, "flame": vukkyFlame}); 
})

const editRateLimit = rateLimit({
	windowMs: 1000 * 60,
	max: 1,
	handler: function(req, res) {
		res.status(429).send("lets not cause epilepsy attack")
	},
	keyGenerator: function (req /*, res*/) {
		return req.headers["cf-connecting-ip"];
	}
});

app.post('/api/edit', function (req, res) {
  if(!req.body?.color) return res.status(400).send("Bad request: No main color provided");
  if(!req.body?.bg) return res.status(400).send("Bad request: No background color provided");
  if(!req.body?.flame) return res.status(400).send("Bad request: No flame color provided");
  if(!/^#[0-9a-fA-F]{6}$/.test(req.body.color)) return res.status(400).send("Bad request: Main color is not valid");
  if(!/^#[0-9a-fA-F]{6}$/.test(req.body.bg)) return res.status(400).send("Bad request: Background is not valid");
  if(!/^#[0-9a-fA-F]{6}$/.test(req.body.flame)) return res.status(400).send("Bad request: Flame is not valid");
  editRateLimit(req, res, () => {
    vukkyColor = req.body.color;
    vukkyBackground = req.body.bg;
    vukkyFlame = req.body.flame;
    res.sendStatus(200);
  })
})

app.listen(90)