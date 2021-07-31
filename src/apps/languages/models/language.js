const { database, databaseBase } = require("../../../classes/database");
class language extends databaseBase {
	create(slug, name, persianName, extension) {
		return this.createQuery(
			"INSERT INTO `languages`(`id`, `slug`, `name`,`persianName`, `extension`) VALUES (NULL, '" +
				slug +
				"', '" +
				name +
				"', '" +
				persianName +
				"', '" +
				extension +
				"',)"
		);
	}

	all() {
		return this.createQuery("SELECT * FROM `languages`");
	}

	getById(id) {
		return this.createQuery("SELECT * FROM `languages` WHERE id='" + id + "'");
	}

	getBySlug(slug) {
		return this.createQuery(
			"SELECT * FROM `languages` WHERE slug='" + slug + "'"
		);
	}

	deleteById(id) {
		return this.createQuery("DELETE FROM `languages` WHERE id='" + id + "'");
	}

	deleteBySlug(slug) {
		return this.createQuery("DELETE FROM `slug` WHERE slug='" + slug + "'");
	}

	updateById(id, values) {
		let updateString = this.resolveUpdateValues(values, "languages");
		return this.createQuery(updateString + "WHERE id='" + id + "'");
	}
	updateBySlug(slug, values) {
		let updateString = this.resolveUpdateValues(values, "languages");
		return this.createQuery(updateString + "WHERE slug='" + slug + "'");
	}
}
const languageDatabase = new language(database);
module.exports = languageDatabase;
