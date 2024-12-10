import db from '../utils/db.js';

export default {
    findAll(){
        // return[
        //     {CatID: 1,CatName: 'Laptop'},
        //     {CatID: 2,CatName: 'TV'},
        //     {CatID: 3,CatName: 'Mobile'},
        // ];
        return db('categories');
    },
    add(entity){
        return db('categories').insert(entity);
    },
    findById(id){
        return db('categories').where('CatID', id).first();
    },
    del(id){
        return db('categories').where('CatID', id).del();
    },
    patch(id, changes){
        return db('categories').where('CatID', id).update(changes);
    }
}