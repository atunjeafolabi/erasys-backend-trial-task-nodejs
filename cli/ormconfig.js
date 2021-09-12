const database = {
    development: "testdb",
    test: 'test-database'
}

module.exports = {
    "name": "default",
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "root",
    "password": "",
    "database": database[process.env.NODE_ENV],
    "entities": [
        "src/entity/**/*.ts"
    ]
 }