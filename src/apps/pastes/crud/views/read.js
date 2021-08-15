const express = require("express");
const markdown = require("markdown").markdown;
const md = require("markdown-it")();
const router = express.Router();
const pasteDatabase = require("../../models/paste");
const userDatabase = require("../../../accounts/models/user");
const likeDatabase = require("../../models/like");
router.get("/", async (request, response) => {
	let paste;
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
			likeInner +
			" WHERE ";
	} else {
		queryString =
			"SELECT pastes.id, pastes.name as paste_name, pastes.title,pastes.content, pastes.mode, languages.id as languageId, languages.slug, languages.name, languages.persianName, languages.extension, pastes.readme, pastes.shortDescription, pastes.password, users.id as userId, users.username, users.persianUsername, users.avatar, users.bio FROM `pastes` INNER JOIN `users` ON pastes.user=users.id INNER JOIN languages on pastes.language=languages.id WHERE ";
	}
	if (request.query.id) {
		paste = await pasteDatabase.createQuery(
			queryString + `pastes.id=${request.query.id}`
		);
	} else if (request.query.name) {
		paste = await pasteDatabase.createQuery(
			queryString + `pastes.name='${request.query.name}'`
		);
	} else {
		response.status(400).json({
			message: "id or name is required.",
		});
		return;
	}
	if (paste.length) {
		paste = paste[0];
		let likesCount = await likeDatabase.getByPaste(paste.id);
		likesCount = likesCount.length;
		if (paste.mode == 1) {
			if (request.headers["authorization"]) {
				if (request.headers.authorization.startsWith("Bearer")) {
					let authorization = request.headers.authorization.replace(
						"Bearer ",
						""
					);
					let result = await userDatabase.getByToken(authorization);
					if (result.length != 0) {
						result = result[0];
						if (!result.is_verified) {
							response.status(403).json({
								message: "Please verify your email.",
							});
						} else {
							if (result.id != paste.user) {
								response.status(403).json({
									message:
										"Paste mode is private, and authorization header is not same as paste.",
								});
								return;
							}
							response.json({
								paste: {
									id: paste.id,
									user: paste.user,
									name: paste.paste_name,
									title: paste.title,
									content: paste.content,
									mode: paste.mode,
									language: paste.language,
									readme:
										request.query.isRaw == "yes"
											? paste.readme
											: md.render(paste.readme),
									shortDescription: paste.shortDescription,
								},
								user: {
									id: paste.userId,
									username: paste.username,
									persianUsername: paste.persianUsername,
									bio: paste.bio,
									avatar: paste.avatar,
								},
								language: {
									id: paste.languageId,
									slug: paste.slug,
									name: paste.name,
									persianName: paste.persianName,
									extension: paste.extension,
								},
								liked: paste.like_id ? true : false,
								likesCount: likesCount,
							});
							return;
						}
					} else {
						response.status(401).json({
							message: "Token is incorrect.",
						});
					}
				}
			}
			response.status(400).json({
				message: "Authorization is missing.",
			});
		} else if (paste.mode == 2) {
			if (request.query.password) {
				if (paste.password != request.query.password) {
					response.status(401).json({
						message: "Password is incorrect.",
					});
					return;
				}
			} else {
				response.status(400).json({
					message: "Paste is password protected, Please include a password.",
				});
				return;
			}
		}
		response.json({
			paste: {
				id: paste.id,
				user: paste.user,
				name: paste.paste_name,
				title: paste.title,
				content: paste.content,
				mode: paste.mode,
				language: paste.language,
				readme:
					request.query.isRaw == "yes" ? paste.readme : md.render(paste.readme),
				shortDescription: paste.shortDescription,
			},
			user: {
				id: paste.userId,
				username: paste.username,
				persianUsername: paste.persianUsername,
				bio: paste.bio,
				avatar: paste.avatar,
			},
			language: {
				id: paste.languageId,
				slug: paste.slug,
				name: paste.name,
				persianName: paste.persianName,
				extension: paste.extension,
			},
			liked: paste.like_id ? true : false,
			likesCount: likesCount,
		});
		return;
	} else {
		response.status(404).json({
			message: "Paste not found.",
		});
		return;
	}
});

module.exports = router;
