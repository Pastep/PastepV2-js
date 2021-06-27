const { databaseConfig } = require("../../../../config");
const { base } = require("../../../classes/database");

class user extends base {
    create(username, email, password) {
        return this.createQuery(
            "INSERT INTO `users` (`id`, `username`, `password`, `email`, `tmp_password`, `is_verified`, `verification_code`, `token`) VALUES (NULL, '" +
            username +
            "', '" +
            password +
            "', '" +
            email +
            "', NULL, '0', '" +
            this.uuid4() +
            "', '" +
            this.uuid4() +
            "')"
        );
    }

    all() {
        return this.createQuery("SELECT * FROM `users`");
    }

    getById(id) {
        return this.createQuery("SELECT * FROM `users` WHERE id='" + id + "'");
    }

    getByUsername(username) {
        return this.createQuery(
            "SELECT * FROM `users` WHERE username='" + username + "'"
        );
    }

    getByEmail(email) {
        return this.createQuery(
            "SELECT * FROM `users` WHERE email='" + email + "'"
        );
    }

    getByToken(token) {
        return this.createQuery(
            "SELECT * FROM `users` WHERE token='" + token + "'"
        );
    }

    getByVerificationCode(verificationCode) {
        return this.createQuery(
            "SELECT * FROM `users` WHERE verification_code='" + verificationCode + "'"
        );
    }

    deleteById(id) {
        return this.createQuery("DELETE FROM `users` WHERE id='" + id + "'");
    }

    deleteByUsername(username) {
        return this.createQuery(
            "DELETE FROM `users` WHERE username='" + username + "'"
        );
    }

    deleteByEmail(email) {
        return this.createQuery("DELETE FROM `users` WHERE email='" + email + "'");
    }
    updateById(id, values) {
        let updateString = this.resolveUpdateValues(values, "users");
        return this.createQuery(updateString + "WHERE id='" + id + "'");
    }
    updateByUsername(username, values) {
        let updateString = this.resolveUpdateValues(values, "users");
        return this.createQuery(updateString + "WHERE username='" + username + "'");
    }
    updateByEmail(email, values) {
        let updateString = this.resolveUpdateValues(values, "users");
        return this.createQuery(updateString + "WHERE email='" + email + "'");
    }
}
const database = new user(databaseConfig);
database.connect();
module.exports = database;