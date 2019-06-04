const p1 = new Promise(function(resolve, reject){
    setTimeout(function(){
        // 這裡如果用throw，是完全不會拒絕promise
        reject(new Error('error occur!'))
        //throw new Error('error occur!')
    }, 1000)
})

p1.then((val) => {
       console.log(val)
       return val + 2
   }).then((val) => console.log(val))
   .catch((err) => console.log('error:', err.message))
   .then((val) => console.log('done'))