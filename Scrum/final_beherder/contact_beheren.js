class EVENT {
    constructor(){
        this.listeners = []
    }

    addListener(listener){
        this.listeners.push(listener)
    }

    trigger(parameters){
        this.listeners.forEach(function(listener){
            return listener(parameters)
        })
    }
}
