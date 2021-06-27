const mysql = require("mysql");
const { serverError } = require("./errors");
class base {
    constructor(config) {
        this.host = config.host;
        this.port = config.port;
        this.username = config.username;
        this.password = config.password;
        this.database = config.database;
    }

    uuid4() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            function(c) {
                var r = (Math.random() * 16) | 0,
                    v = c == "x" ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            }
        );
    }

    resolveUpdateValues(values, table) {
        let updateString = "UPDATE `" + table + "` SET ";
        const keys = Object.keys(values);
        keys.forEach((item, index) => {
            if (typeof values[item] == "string") {
                values[item] = values[item].replace(/'/g, "''");
            }
            if (values[item] == null) {
                updateString += `${item}=NULL`;
            } else {
                updateString += `${item}='${values[item]}'`;
            }
            if (index < keys.length - 1) {
                updateString += ",";
            }
        });
        return updateString + " ";
    }

    connect(log) {
        if (!this.db) {
            this.db = mysql.createConnection({
                host: this.host,
                port: this.port,
                user: this.username,
                password: this.password,
                database: this.database,
            });
            this.db.connect(function(err) {
                if (err) {
                    throw new Error(`Cannot connect to database`);
                }
                if (log) {
                    console.log(`Connected to database`);
                }
                return true;
            });
        }
    }

    disconnect(log) {
        if (this.db) {
            this.db.destroy((err) => {
                if (err) {
                    throw new Error(`Cannot disconnect from ${this.host}:${this.port}`);
                }
                if (log) {
                    console.log(
                        `Disconnected from database at ${this.host}:${this.port}`
                    );
                }
                this.db = undefined;
                return true;
            });
        }
    }

    createQuery(SQL) {
        return new Promise((resolve, reject) => {
            this.db.ping((err) => {
                if (err) {
                    throw new Error("database is not connected.");
                }
                this.db.query(SQL, (err, result) => {
                    if (err) {
                        serverError(err);
                        return reject(err);
                    }
                    resolve(result);
                });
            });
        });
    }
}

module.exports.base = base;