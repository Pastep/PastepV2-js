const { databaseBase, database } = require("../../../classes/database");
class like extends databaseBase {
	create(user, paste) {
		return this.createQuery(
			"INSERT INTO `likes`(`id`, `user`, `paste`) VALUES " +
				`(NULL, ${user}, ${paste})`
		);
	}

	all(userId, pasteId) {
		if (userId && pasteId) {
			return this.createQuery(
				"SELECT * FROM `likes` WHERE " + `user=${userId} AND paste=${pasteId}`
			);
		}
		if (userId) {
			return this.createQuery("SELECT * FROM `likes` WHERE user=" + userId);
		} else if (pasteId) {
			return this.createQuery("SELECT * FROM `likes` WHERE paste=" + pasteId);
		}
		return this.createQuery("SELECT * FROM `likes`");
	}

	getById(id) {
		return this.createQuery("SELECT * FROM `likes` WHERE id='" + id + "'");
	}

	getByPaste(paste) {
		return this.createQuery("SELECT * FROM `likes` WHERE paste=" + paste);
	}

	getByUser(user) {
		return this.createQuery("SELECT * FROM `likes` WHERE user=" + user);
	}

	deleteById(id) {
		return this.createQuery("DELETE FROM `likes` WHERE id='" + id + "'");
	}

	delete(user, paste) {
		return this.createQuery(
			"DELETE FROM `likes` " + `WHERE user=${user} AND paste=${paste};`
		);
	}
}
const likeDatabase = new like(database);
module.exports = likeDatabase;
