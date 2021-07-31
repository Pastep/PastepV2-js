const express = require("express");
const markdown = require("markdown");
const router = express.Router();
const pasteDatabase = require("../../models/paste");
const userDatabase = require("../../../accounts/models/user");

router.get("/", async (request, response) => {
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
	const limit = request.query.limit ? ` LIMIT ${request.query.limit}` : "";
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
		pastes = Array.from(
			await pasteDatabase.createQuery(
				queryString + " WHERE pastes.user=" + request.query.user + limit
			)
		);
	} else {
		pastes = Array.from(await pasteDatabase.createQuery(queryString + limit));
	}

	pastes = pastes.filter((item) => item.mode == 0);
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