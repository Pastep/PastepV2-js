const { databaseConfig } = require("../../../../config");
const { base } = require("../../../classes/database");

class language extends base {
    create(slug, name, extension) {
        return this.createQuery(
            "INSERT INTO `languages`(`id`, `slug`, `name`, `extension`) VALUES (NULL, '" +
            slug +
            "', '" +
            name +
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
const database = new language(databaseConfig);
database.connect();

module.exports = database;