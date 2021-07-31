const { databaseBase, database } = require("../../../classes/database");
class paste extends databaseBase {
	create(
		user,
		name,
		title,
		content,
		mode,
		language,
		readme,
		shortDescription,
		password
	) {
		if (password) {
			password = `'${password}'`;
		} else {
			password = "NULL";
		}
		content = content.replace(/'/g, "''");
		if (readme) {
			readme = readme.replace(/'/g, "''");
		}
		if (shortDescription) {
			shortDescription = shortDescription.replace(/'/g, "''");
		}
		return this.createQuery(
			"INSERT INTO `pastes`(`id`, `user`, `name`, `title`, `content`, `mode`, `language`, `readme`, `shortDescription`, `password`) VALUES (NULL, " +
				user +
				", '" +
				name +
				"','" +
				title +
				"','" +
				content +
				"','" +
				mode +
				"','" +
				language +
				"','" +
				readme +
				"','" +
				shortDescription +
				"'," +
				password +
				")"
		);
	}

	all(userId) {
		if (userId) {
			return this.createQuery("SELECT * FROM `pastes` WHERE user=" + userId);
		}
		return this.createQuery("SELECT * FROM `pastes`");
	}

	getById(id) {
		return this.createQuery("SELECT * FROM `pastes` WHERE id='" + id + "'");
	}

	getByName(name) {
		return this.createQuery("SELECT * FROM `pastes` WHERE name='" + name + "'");
	}

	deleteById(id) {
		return this.createQuery("DELETE FROM `pastes` WHERE id='" + id + "'");
	}

	deleteByName(name) {
		return this.createQuery("DELETE FROM `pastes` WHERE name='" + name + "'");
	}

	updateById(id, values) {
		let updateString = this.resolveUpdateValues(values, "pastes");
		return this.createQuery(updateString + "WHERE id='" + id + "'");
	}
	updateByName(name, values) {
		let updateString = this.resolveUpdateValues(values, "pastes");
		return this.createQuery(updateString + "WHERE name='" + name + "'");
	}
}
const pasteDatabase = new paste(database);
module.exports = pasteDatabase;
