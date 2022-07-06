const fs = require('fs')
const express = require('express')
const app = express()
const svg = fs.readFileSync(`${__dirname}/incidents.svg`, 'utf8');
var ago = require('s-ago');
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
  res.send('<form action="/api/reset"><input type="text" name="key"><input type="submit" value="Reset"></form>')
})

app.get('/api/image', function (req, res) {
  res.header("Content-Type","image/svg+xml");
  res.send(svg.replace("$TIMESINCEINCIDENT", Date.now() - data.lastIncident + "ms"));
})

app.get('/api/reset', function (req, res) {
  if (req.query?.key != process.env.KEY) return res.sendStatus(403);
  data.lastIncident = Date.now();
  fs.writeFileSync(`${__dirname}/data.json`, JSON.stringify(data, null, 4));
  res.sendStatus(200);
})

app.get('*', function (req, res) {
  res.render(__dirname + "/../public/index.ejs", { incidentTime: ago(new Date(data.lastIncident), 'day') });
})

app.listen(82)