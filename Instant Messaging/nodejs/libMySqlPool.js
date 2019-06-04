var mysql = require('mysql');


class MySqlPool {

    constructor(){
        this._pool = mysql.createPool({
            connectionLimit: 10,
            host: '127.0.0.1', 
            port: 3306,      
            user: 'coturn',              
            password: 'c7oturnW#',                        
            database: 'coturn' 
        });
    }

    getConnection(){
        this._pool.getConnection(function(err, connection){

        });
    }
}