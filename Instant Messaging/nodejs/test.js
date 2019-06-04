list = [
    {
        id: 0,
        name: 'Jason' 
    },{
        id: 1,
        name: 'Wu'
    }
]
const idList = list.map(item => Object.values(item)[0]);
console.log(idList);

data = {id : 0, name: 'Jason'}
console.log(typeof data);
for(var key in data){
    console.log(`${key} => ${data[key]}`);
}