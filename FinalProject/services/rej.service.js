import db from "../utils/db.js";

export default {
    // findAll(){
    //     // return[
    //     //     {CatID: 1,CatName: 'Laptop'},
    //     //     {CatID: 2,CatName: 'TV'},
    //     //     {CatID: 3,CatName: 'Mobile'},
    //     // ];
    //     return db('edi');
    // },
    findAlll(){
        // return[
        //     {CatID: 1,CatName: 'Laptop'},
        //     {CatID: 2,CatName: 'TV'},
        //     {CatID: 3,CatName: 'Mobile'},
        // ];
        return db('products');
    },
    add(entity){
        return db('edi').insert(entity);
    }
}