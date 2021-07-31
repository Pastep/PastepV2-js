const { databaseBase, database } = require("../../../classes/database");
class followers extends databaseBase {
	create(source, target) {
		return this.createQuery(
			"INSERT INTO `followers`(`id`, `source`, `target`) VALUES " +
				`(NULL, ${source}, ${target})`
		);
	}

	get(source, target) {
		return this.createQuery(
			"SELECT * FROM `followers` WHERE source=" +
				source +
				" AND target=" +
				target
		);
	}

	getById(id) {
		return this.createQuery("SELECT * FROM `followers` WHERE id='" + id + "'");
	}

	getBySource(source) {
		return this.createQuery("SELECT * FROM `followers` WHERE source=" + source);
	}

	getByTarget(target) {
		return this.createQuery("SELECT * FROM `followers` WHERE target=" + target);
	}

	deleteById(id) {
		return this.createQuery("DELETE FROM `followers` WHERE id='" + id + "'");
	}

	delete(source, target) {
		return this.createQuery(
			"DELETE FROM `followers` " + `WHERE user=${user} AND paste=${paste};`
		);
	}
}
const followersDatabase = new followers(database);
module.exports = followersDatabase;
