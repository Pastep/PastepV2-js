const Discord = require("discord.js");
const https = require("https");
const { host } = require("../../config");

function createLog({ webhook, body }) {
	const data = JSON.stringify(body);
	const options = {
		hostname: "discord.com",
		port: 443,
		path: webhook,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Content-Length": data.length,
		},
	};

	const req = https.request(options, (res) => {
		res.on("data", (d) => {
			process.stdout.write(d);
		});
	});

	req.on("error", (error) => {
		console.error(error);
	});

	req.write(data);
	req.end();
}

const createNewPasteLog = ({ user, paste }) => {
	const userAvatar = user.avatar
		? `https://${host}/avatars/${user.avatar}`
		: "https://pastep.com/images/guest.jpg";
	const webhookClient = new Discord.WebhookClient(
		"806095884190220288",
		"bG5d3PlnRFm6vCK5oWz_Xc3HFhvQls_eHXbw3ff0yfjHDjn8Gqc1uVkUnksX9JfOxWbD"
	);
	const currentDate = new Date();
	const content =
		paste.content.substr(0, 100) === paste.content
			? paste.content
			: paste.content.substr(0, 100);
	const shortDescription = paste.shortDescription || "فاقد توضیحات";
	const embed = new Discord.MessageEmbed()
		.setAuthor(
			`${user.persianUsername || user.username} پیست کرد!`,
			userAvatar,
			"https://pastep.com/accounts/view/" + user.username
		)
		.setFooter("Pastep.com | پیستپ")
		.setTimestamp(currentDate)
		.addField("موضوع", `**${paste.title}**`, true)
		.addField("زبان", `**${paste.language}**`, true)
		.addField(
			"لینک",
			`[کلیک کنید](https://pastep.com/pastes/view/${paste.name})`,
			true
		)
		.addField("پیش نمایش", "```" + paste.language + "\n" + content + "\n```")
		.addField("توضیحات", "```" + shortDescription + "```");
	webhookClient.send({
		embeds: [embed],
	});
};

module.exports.createNewPasteLog = createNewPasteLog;
