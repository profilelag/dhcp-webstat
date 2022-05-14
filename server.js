const express = require("express");
const app = express();
const { createServer } = require("https");
const { json } = require("body-parser");
const { readFileSync } = require("fs");
const { spawnSync } = require("child_process");

const using_https = true,
	http_port = 8080;

const args = process.argv.slice(-2, process.argv.length);

const sshcmd = (username, pass) => spawnSync("sshpass",["-e","ssh","-p" + args[0],username + "@" + args[1],"/sbin/dhcp-lease-list"],{ env: { SSHPASS: pass } });

app.use(express.static(`${__dirname}/public`));

app.post("/login", json(), async(req, res) => {
	const output = sshcmd(req.body.user, req.body.pass);
	if (output.status == 0) res.end(JSON.stringify({ status: output.status, response: output.stdout.toString() }));
	else res.end(JSON.stringify({ status: output.status, response: "Something went wrong." }));
});

if (using_https)
	createServer({
		key: readFileSync("keys/key.pem"),
		cert: readFileSync("keys/cert.pem"),
	}, app).listen(443);
else
	app.listen(http_port);
