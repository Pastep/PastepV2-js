const https = require("https");

function serverError(error) {
    const currentDate = new Date();
    const data = JSON.stringify({
        content: null,
        embeds: [{
            title: "```Server Error```",
            color: 10956077,
            fields: [{
                    name: "**:drop_of_blood: Error code**",
                    value: "`" + error.errno + "`",
                    inline: true,
                },
                {
                    name: ":exploding_head: **Error explanation**",
                    value: "```" + error + "```",
                },
            ],
            footer: {
                text: "Pastep.Com Backend Report System",
            },
            timestamp: currentDate,
            thumbnail: {
                url: "https://cdn.discordapp.com/attachments/858600493550010408/858602012349956116/pastepLogoLatest_-_copy.png",
            },
        }, ],
    });
    const options = {
        hostname: "discord.com",
        port: 443,
        path: "/api/webhooks/858603303348862986/oRgmBFKlGIn_nBetSQYWDKrCtwqmtB4WpN0dkABHQei2DWdKMNL9uZvRxYpb0tof0wBz",
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

module.exports.serverError = serverError;