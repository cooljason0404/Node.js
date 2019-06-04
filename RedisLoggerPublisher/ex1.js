var arr = ['1','2','3','4','5','6'];
console.log(arr);
var json = JSON.stringify(arr);
console.log(json);
JSON.parse(json, function(key, val){
    console.log(key + "=>" + val);
})
a = 0;
a++;
console.log(a);



