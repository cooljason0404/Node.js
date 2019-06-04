class Cache {
    constructor(){
        this._caches = {};
    }

    set(name, id){
        if(typeof name === "string" && !(name in this._caches)){
            this._caches[name] = config;
        }
        return this;
    }

    get(name, id){
        if(typeof name === "string" && name in this._caches){
            if(typeof id ==="string" && id in this._caches[name]){
                return this._caches[name][id];
            }
            return this;
        }
        return this;
    }

    delete(name, id){
        if(typeof name === "string" && name in this._caches){
            delete this._caches[name];
        }
        return this;
    }

}
/*
caches = {
    tableName: {
        id : {

        },
        id : {

        }
    },
    tableName: {

    }
}
*/