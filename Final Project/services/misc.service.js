import db from '../utils/db.js';

export default {
    findAll(){
        // return[
        //     {CatID: 1,CatName: 'Laptop'},
        //     {CatID: 2,CatName: 'TV'},
        //     {CatID: 3,CatName: 'Mobile'},
        // ];
        return db('products');
    },
    add(entity){
        return db('products').insert(entity);
    },
    findById(id){
        return db('products').where('ProID', id).first();
    },
    del(id){
        return db('products').where('ProID', id).del();
    },
    up(id, changes){
        return db('products').where('ProID', id).update(changes);
    }
} 