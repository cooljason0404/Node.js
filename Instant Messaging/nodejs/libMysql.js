var mysql = require('mysql');

class MySql {

    constructor(pTable, config = 'main'){
        this._mysql_conn = mysql.createConnection({     
            host: '127.0.0.1', 
            port: 3306,      
            user: 'coturn',              
            password: 'c7oturnW#',                        
            database: 'coturn' 
        }); 
        this._mysql_conn.connect();

        this._table = pTable;//數據庫表名
        this._where = '';// 查詢where
        this._bind = '';// 查詢綁定
        this._group = '';// 查詢group by
        this._order = '';// 查詢order by
        this._having = '';// 查詢having
        this._autoCleanOption = true;// 自動重置查詢參數
    }

    /**
     * 關閉MySQL連線
     */
    close(){
        this._mysql_conn.end();
    }

    /**
     * 設置資料表
     * @param {*} pTable string
     */
    setTable(pTable){
        this._table = pTable;
    }

    /**
     * 預設查詢條件
     */
    setWhere(pWhere, pBind = '') {
        this._where = pWhere;
        if(typeof pBind === "object"){
            var sBind = [];
            for(var key in pBind){
                sBind.push(pBind[key]);
            }
            this._bind = sBind;
        }else if(typeof pBind === "array"){
            this._bind = pBind;
        }else if(pBind === ''){
            this._bind = [];
        }else{
            this._bind.push(pBind);
        }
    }

    /**
     * 預設分組
     * @param {*} pGroup string
     */
    setGroup(pGroup) {
        this._group = pGroup;
    }

    /**
     * 預設排序
     * @param {*} pOrder string
     */
    setOrder(pOrder) {
        this._order = pOrder;
    }

    /**
     * 清除查詢條件
     */
    clearOption() {
        if(this._autoCleanOption) {
            this._where = '';
            this._bind = '';
            this._group = '';
            this._order = '';
            this._having = '';
        }
    }

    /**
     * 設置自動清空查詢選項
     */
    setAutoCleanOption(pValue) {
        this._autoCleanOption = pValue;
    }

    /**
     * 根據ID獲得資料
     * @param {*} pField string
     * @param {*} pId number
     * @param {*} pCallback function
     */
    getInfo(pField, pId, pCallback) {
        if(this._table === "")   return;
        if(typeof pField === "string" && typeof pCallback === "function"){
            var sql = `SELECT ${pField} FROM ${this._table} WHERE id = ${pId}`;
            this._mysql_conn.query(sql, pCallback);
        }
    }
    
    /**
     * 寫入數據
     * @param {*} pInData object
     * @param {*} pCallback function
     */
    insert(pInData, pCallback) {
        if(this._table === "")   return;
        if(typeof pInData === "object" && typeof pCallback === "function"){
            var sField = [];
            var sBind = [];
            var sData = [];
            for(var field in pInData){
                sField.push(field);
                sBind.push('?');
                sData.push(pInData[field]);
            }
            var sql = `INSERT INTO ${this._table}(${sField.join(',')}) VALUES (${sBind.join(',')})`;
            this._mysql_conn.query(sql, sData, pCallback);
        }
    }

    /**
     * 獲得資料
     * @param {*} pOffset number
     * @param {*} pLimit number
     * @param {*} pField string
     * @param {*} pCallback function
     */
    getData(pOffset = 0, pLimit = 0, pField = '*', pCallback){
        if(this._table === "")   return;
        if(!pCallback && typeof pOffset === 'function') {
            pCallback = pOffset;
            pOffset = 0;
            pLimit = 0;
            pField = '*';
        }else if(!pCallback && typeof pLimit === 'function'){
            pCallback = pLimit;
            pLimit = 0;
            pField = '*';
        }else if(!pCallback && typeof pField === 'function'){
            pCallback = pField;
            pField = '*';
        }

        if(typeof pCallback === "function"){
            var sql = `SELECT ${pField} FROM ${this._table} `;
            var bind = this._bind;
            if(this._where != ''){
                sql += `WHERE ${this._where} `;
            }else{
                sql += `WHERE 1 `;
            }

            if(this._group != '')   sql += `GROUP BY ${this._group} `;
            if(this._order != '')   sql += `ORDER ${this._order} `;

            this.clearOption();
            this._mysql_conn.query(sql, bind, pCallback);
        }
    }

    /**
     * 修改數據(無特殊綁定)
     * @param {*} pBind object
     * @param {*} pLimit number
     * @param {*} pCallback function
     */
    update(pBind, pLimit = 0, pCallback) {
        if(this._table === "")   return;
        if(!pCallback && typeof pLimit === 'function') {
            pCallback = pLimit;
            pLimit = 0;
        }

        if(typeof pCallback === "function"){
            var sql = `UPDATE ${this._table} SET `;
            var set = [], bind = [], qBind;
            for(var field in pBind){
                set.push(`${field} = ?`);
                bind.push(pBind[field]);
            }
            sql += set.join(', ');
            sql += ` WHERE ${this._where} `;
            
            if(this._group != '')   sql += `GROUP BY ${this._group} `;
            if(this._order != '')   sql += `ORDER ${this._order} `;

            if(typeof this._bind === "array"){
                qBind = bind.concat(this._bind);
            }else{
                qBind = bind;
            }
            this.clearOption();
            this._mysql_conn.query(sql, qBind, pCallback);
        }
    }

    /**
     * 根據ID修改數據庫數據(無特殊綁定)
     * @param {*} pUpData object
     * @param {*} pId number
     * @param {*} pCallback function
     */
    updateId(pUpData, pId, pCallback) {
        if(this._table === "")   return;
        if(typeof pCallback === "function"){
            var sql = `UPDATE ${this._table} SET `;
            var qSet = [];
            var qBind = [];
            for(var field in pUpData){
                qSet.push(`${field} = ?`);
                qBind.push(pUpData[field]);
            }
            sql += qSet.join(', ');
            sql += ` WHERE id = ?`;
            qBind.push(pId);
            this.clearOption();
            this._mysql_conn.query(sql, qBind, pCallback);
        }
    }
    
    /**
     * 删除數據庫數據
     * @param {*} pCallback function
     * @param {*} pLimit number
     */
    delete(pLimit = 0, pCallback){
        if(this._table === "")   return;
        if(!pCallback && typeof pLimit === "function"){
            pCallback = pLimit;
            pLimit = 0;
        }
        if(typeof pCallback === "function"){
            var sql = `DELETE FROM ${this._table} WHERE ${this._where}`;
            var qBind = this._bind;
            this.clearOption();
            this._mysql_conn.query(sql, qBind, pCallback);      
        }
    }

    /**
     * 根据ID删除數據庫數據
     * @param {*} pId number
     * @param {*} pCallback function
     */
    delId(pId, pCallback){
        if(this._table === "")   return;
        if(typeof pCallback === "function"){
            if(typeof pId === "string"){
                pId = parseInt(pId, 10);
                pId = isNaN(pId) ?  0 : pId;
            }
            if(pId > 0){
                var sql = `DELETE FROM ${this._table} WHERE id = ${pId}`;
                this.clearOption();
                this._mysql_conn.query(sql, pCallback);
            }
        }
    }

}

module.exports = MySql;

var oData = new MySql('admin_user');
oData.setWhere("name = 'jason'");
// oData.delete(function(row){
//     console.log(row);
// });

oData.getData(function(error, results, fields){
    if(error) throw error;
    console.log(results);
});

// oData.insert({
//     name: 'nancy',
//     realm: 'nancy',
//     password: '$5$e018513e9de69e73$5cbdd2e29e04ca46aeb022268a7460d3a3468de193dcb2b95f064901769f455f'
// }, function(error, results, fields){
//     if(error) throw error;
//     console.log(results);
// });
oData.close();
/*
oData.update({realm: 'jason851'}, function(error, results, fields){
    if(error) throw error;
    console.log(results);
});
oData.close();*/

