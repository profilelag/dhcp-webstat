const express = require('express');
const app = express();
const https = require('https');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const jsonParser = bodyParser.json()

using_https = true

const args = process.argv.slice(-2,process.argv.length)

const sshcmd = (username, pass)=>{return spawnSync("sshpass", ["-e", "ssh", "-p" + args[0], username + "@" + args[1], "/sbin/dhcp-lease-list"], { env: {SSHPASS:pass}});}

const options = {}
app.get('/', function(req, res) {
	res.write(fs.readFileSync(path.join(__dirname, "./index.html")));
	res.end();
});

app.get('/frapp.js', function(req, res) {
	res.write(fs.readFileSync(path.join(__dirname, "./frapp.js")));
	res.end();
});


app.post('/login', jsonParser, (req, res) => {
	const output = sshcmd(req.body.user, req.body.pass);
	if(output.status == 0){
		res.send({status:output.status,response:output.stdout.toString()});
	} else {
		res.send({status:output.status,response:"Aomething went wrong."});
	}
	res.end();
});
if(using_https){
const options = {
  key: fs.readFileSync('keys/key.pem'),
  cert: fs.readFileSync('keys/cert.pem')
};
https.createServer(options, app).listen(8080);
} else
app.listen(8080);
