const { databaseBase, database } = require("../../../classes/database");
class comment extends databaseBase {
	create(user, paste, content) {
		return this.createQuery(
			"INSERT INTO `comments`(`id`, `user`, `paste`, `content`) VALUES " +
				`(NULL, ${user}, ${paste}, '${content}')`
		);
	}

	all(userId, pasteId) {
		if (userId && pasteId) {
			return this.createQuery(
				"SELECT * FROM `comments` WHERE " +
					`user=${userId} AND paste=${pasteId}`
			);
		}
		if (userId) {
			return this.createQuery("SELECT * FROM `comments` WHERE user=" + userId);
		} else if (pasteId) {
			return this.createQuery(
				"SELECT * FROM `comments` WHERE paste=" + pasteId
			);
		}
		return this.createQuery("SELECT * FROM `comments`");
	}

	getById(id) {
		return this.createQuery("SELECT * FROM `comments` WHERE id='" + id + "'");
	}

	getByPaste(paste) {
		return this.createQuery("SELECT * FROM `comments` WHERE paste=" + paste);
	}

	getByUser(user) {
		return this.createQuery("SELECT * FROM `comments` WHERE user=" + user);
	}
	delete(id) {
		return this.createQuery("DELETE FROM `comments` WHERE id=" + id);
	}
}
const commentDatabase = new comment(database);
module.exports = commentDatabase;
