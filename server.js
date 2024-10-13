var express  = require('express'); 
var app = express();

var path = require('path');
var bodyParser = require('body-parser'); 
var mssql = require('mssql');
const connection = require('./js/config');
var port = 8080; 

// подключение модулей для обработки запросов 
var displayHandler = require('./js/displayhandler'); 
var insertHandler = require('./js/inserthandler'); 
var editHandler = require('./js/edithandler'); 

let isAdmin = false;

// установка генератора шаблонов 
app.set('views', __dirname + '/pages'); 
app.set('view engine', 'ejs');

// подгрузка статических файлов из папки pages 
app.use(express.static(path.join(__dirname, 'pages')));

// middleware для обработки данных в формате JSON 
var jsonParser = bodyParser.json();
var textParser = bodyParser.text(); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(jsonParser); 
app.use(textParser); 
app.use((req, res, next) => {
    req.isAdmin = false; // по умолчанию не администратор
    next();
});
// загрузить таблицу с элементами 
app.post('/loginAdmin', function(req, res) {
    const login = req.body.login;
    const password = req.body.password;

    const psCheck = new mssql.PreparedStatement(connection);
    psCheck.input('login', mssql.NVarChar);
    psCheck.input('password', mssql.NVarChar);
	const checkQuery = "SELECT * FROM Admins WHERE login = @login AND password = @password";
    psCheck.prepare(checkQuery, (err) => {
        if (err) return res.status(500).json({ error: 'Ошибка подготовки запроса' });

        psCheck.execute({ login, password }, (err, result) => {
            if (err) return res.status(500).json({ error: 'Ошибка выполнения запроса' });

            if (result.recordset.length === 0) {
                return res.status(401).json({ error: 'Неверный логин или пароль' });
            } else {
                console.log('Администратор успешно авторизован');
                res.redirect(`/?isAdmin=true`); 
            }

            psCheck.unprepare();
        });
    });
});

app.get('/', (req, res) => {
    const isAdmin = req.query.isAdmin === 'true'; // извлекаем параметр
    displayHandler.displayItems(req, res, isAdmin);
});



// загрузка страницы для создания нового элемента 
app.get('/add', insertHandler.loadAddPage); 
// добавить новый элемент 
app.post('/add/newItem', insertHandler.addRow); 

// отобразить элементы в режиме редактирования 
app.get('/edit', displayHandler.displayItems); 

// загрузка страницы для редактирования элементов 
app.get('/edit/:id', editHandler.loadEditPage);

// редактирование элемента в бд 
app.put('/edit/:id', editHandler.changeItem);

// удаление элемента из бд 
app.delete('/edit/:id', editHandler.removeItem); 

// обработка ошибок 
app.use(function(err, req, res, next) {
	if (err) console.log(err.stack); 

	res.status(500).send('oops...something went wrong'); 
}); 

app.listen(port, function() { 

	console.log('app listening on port ' + port); 

});  
