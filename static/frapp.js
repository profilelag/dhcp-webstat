async function login(){
	const prompt = document.getElementById("loginPrompt")
	const list = document.getElementById("list")
	const response = await fetch('/login', {
		    method: 'POST',
		headers: {
		'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			user: prompt.user.value,
			pass: prompt.pass.value
		})
	}).then(response => response.json())
	console.log(response.status)
	if(response.status == 5 || response.status == 255){
		list.innerHTML = "Login failed"
	} else if(response.status == 0) {
		let html = "<tr>\n<th>MAC</th>\n<th>IP</th>\n<th>hostname</th>\n<th>valid until</th>\n</tr>\n"
		response.response.split("=").pop().split("\n").forEach(element => {
			if(element.length > 0){
				const table = element.replace(/\s+/g, ' ').split(" ")
				html += "<tr>\n<th> "+ table[0] + "</th>\n";
				html +=  "<th> "+ table[1] + "</th>\n";
				html +=  "<th> "+ table[2] + "</th>\n";
				html +=  "<th> "+ table[3] + " " + table[4] + "</th>\n</tr>\n"
			}
		});
		list.innerHTML = html
	} else {
		list.innerHTML = response.response
	}
}