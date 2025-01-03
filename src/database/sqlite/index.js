const sqlite = require("sqlite")
const sqlite3 = require("sqlite3")
const path = require("path")

async function sqliteConection() {
    const database = await sqlite.open({
        filename: path.resolve(__dirname,"..", "dataBase.db"),
        driver: sqlite3.Database
    })

    return database
}

module.exports = sqliteConection