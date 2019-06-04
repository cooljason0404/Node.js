class Config {
    constructor(){
        this._configs = {};
    }

    set(name, config){
        if(typeof name === "string" && !(name in this._configs)){
            this._configs[name] = config;
        }
        return this;
    }

    get(name){
        if(typeof name === "string" && name in this._configs){
            return this._configs[name];
        }
        return this;
    }

    delete(name){
        if(typeof name === "string" && name in this._configs){
            delete this._configs[name];
        }
        return this;
    }

}
