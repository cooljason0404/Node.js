Promise.resolve()
  .then( () => {
    console.log('Step 1');
    return Promise.resolve('Hello');
  })
  .then( value => {
    console.log(value, 'World');
    let p = new Promise( resolve => {
      setTimeout(() => {
        resolve('Good');
      }, 2000);
    });
    return Promise.resolve(p);
  })
  .then( value => {
    console.log(value, ' evening');
    return Promise.resolve({
      then() {
        console.log(', everyone');
      }
    })
  });

// 输出：
// Step 1
// Hello World
// （2秒之后） Good evening
// , everyone