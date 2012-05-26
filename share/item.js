var items = {
    "0":{
        name:"母船",
        speed:20,
        maxLife:1000,
        life:100,
        level:0
    },
    "1":{
        name:"矿船",
        speed:20,
        ability:20,
        maxLife:100,
        life:100,
        level:0
    },
    "2":{
        name:"攻击船",
        speed:20,
        attack:30,
        maxLife:100,
        life:100,
        level:0
    },
    "3":{
        name:"防御塔",
        attack:60,
        maxLife:300,
        life:300
    }
}

function getResourceById(id){
    return items[id];
}
