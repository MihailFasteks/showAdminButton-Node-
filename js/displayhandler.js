var mssql = require('mssql');
var queries = require('./queries');  
const connection = require('./config');


module.exports = {
    displayItems: function(req, res) {  
        var isAdmin = req.isAdmin; 
        var query = queries.getAllItems(req, res, isAdmin);
    }
};
