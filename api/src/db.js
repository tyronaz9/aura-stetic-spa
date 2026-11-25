// Elige la base de datos según el entorno:
// - En la nube: PostgreSQL, cuando existe la variable de entorno DATABASE_URL.
// - En el computador: SQLite integrado en Node.js, como en las unidades 2 y 3.
// Ambos módulos ofrecen las mismas funciones: listar, agregar y eliminar.
module.exports = process.env.DATABASE_URL ? require('./db-postgres') : require('./db-sqlite');