const express = require("express");
const router = express.Router();
const markdown = require("markdown");
const pasteDatabase = require("../../models/paste");
const userDatabase = require("../../../accounts/models/user");
router.get("/", async (request, response) => {
	if (!request.query.title) {
		return response.status(400).json({
			message: "title is missing.",
		});
	}
	let pastes;
	let likeInner = "";
	if (request.headers["authorization"]) {
		if (request.headers.authorization.startsWith("Bearer")) {
			let authorization = request.headers.authorization.replace("Bearer ", "");
			let result = await userDatabase.getByToken(authorization);
			if (result.length != 0) {
				result = result[0];
				if (result.is_verified) {
					likeInner +=
						"LEFT JOIN likes on pastes.id=likes.paste AND users.id=" +
						result.id;
				}
			}
		}
	}
	let queryString;
	if (likeInner) {
		queryString =
			"SELECT likes.id as like_id, pastes.id, pastes.name as paste_name, pastes.title,pastes.content, pastes.mode, languages.id as languageId, languages.slug, languages.name, languages.persianName, languages.extension, pastes.readme, pastes.shortDescription, pastes.password, users.id as userId, users.username, users.persianUsername, users.avatar, users.bio FROM `pastes` INNER JOIN `users` ON pastes.user=users.id INNER JOIN languages on pastes.language=languages.id " +
			likeInner;
	} else {
		queryString =
			"SELECT pastes.id, pastes.name as paste_name, pastes.title,pastes.content, pastes.mode, languages.id as languageId, languages.slug, languages.name, languages.persianName, languages.extension, pastes.readme, pastes.shortDescription, pastes.password, users.id as userId, users.username, users.persianUsername, users.avatar, users.bio FROM `pastes` INNER JOIN `users` ON pastes.user=users.id INNER JOIN languages on pastes.language=languages.id";
	}
	if (request.query.user) {
		if (isNaN(request.query.user)) {
			let user = await userDatabase.getByUsername(request.query.user);
			if (user.length) {
				user = user[0];
				pastes = Array.from(
					await pasteDatabase.createQuery(
						queryString +
							` WHERE pastes.user=${user.id} AND pastes.title LIKE '%${request.query.title}%'`
					)
				);
			} else {
				pastes = Array.from(
					await pasteDatabase.createQuery(
						queryString + ` WHERE pastes.title LIKE '%${request.query.title}%'`
					)
				);
			}
		} else {
			pastes = Array.from(
				await pasteDatabase.createQuery(
					queryString +
						` WHERE pastes.user=${request.query.user} AND pastes.title LIKE '%${request.query.title}%'`
				)
			);
		}
	} else {
		pastes = Array.from(
			await pasteDatabase.createQuery(
				queryString + ` WHERE pastes.title LIKE '%${request.query.title}%'`
			)
		);
	}
	pastes = pastes.filter((item) => item.mode == 0);
	if (request.query.limit && request.query.latest === "yes") {
		pastes = pastes.slice(
			pastes.length - parseInt(request.query.limit),
			pastes.length
		);
	} else if (request.query.limit) {
		pastes = pastes.slice(0, parseInt(request.query.limit));
	}
	let pastes2 = [];
	if (request.query.shuffle === "yes") {
		const pastesLength = pastes.length;
		for (let i = 0; i < pastesLength; i++) {
			const random = Math.floor(Math.random() * pastes.length);
			pastes2.push(pastes[random]);
			pastes.splice(random, 1);
		}
		pastes = pastes2;
	}
	pastes = pastes.map((item) => {
		return {
			paste: {
				id: item.id,
				user: item.user,
				name: item.paste_name,
				title: item.title,
				content: item.content,
				mode: item.mode,
				language: item.language,
				readme: markdown.markdown.toHTML(item.readme),
				shortDescription: item.shortDescription,
			},
			user: {
				id: item.userId,
				username: item.username,
				persianUsername: item.persianUsername,
				bio: item.bio,
				avatar: item.avatar,
			},
			language: {
				id: item.languageId,
				slug: item.slug,
				name: item.name,
				persianName: item.persianName,
				extension: item.extension,
			},
			liked: item.like_id ? true : false,
		};
	});
	return response.json(pastes);
});

module.exports = router;
