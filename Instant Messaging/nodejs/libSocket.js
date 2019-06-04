var io = require('socket.io');

class Socket{
    constructor(server){
        this._socket = io.connect(server);
    }

    on(eventName, callback){
        if(typeof eventName === "string" && typeof callback === "function"){
            this._socket.on(eventName, callback);
        }
    }
}

module.exports = Socket;