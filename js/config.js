var mssql = require('mssql');

// параметры соединения с бд
var config = {
	user: 'Michael',   				// пользователь базы данных
	password: 'MyPassword123', 	 			// пароль пользователя 
	server: 'localhost', 			// хост
	database: 'TestDB',    			// имя бд
	port: 1433,			 			// порт, на котором запущен sql server
    options: {
        encrypt: false,  // Использование SSL/TLS
        trustServerCertificate: true // Отключение проверки самоподписанного сертификата
    },
}
var connection = new mssql.ConnectionPool(config); 
var pool = connection.connect(function(err) {
	if (err) console.log(err)
}); 

module.exports = pool; 