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
    findByCatId(catId){
        return db('products').where('CatID', catId);
    },
    findPageByCatId(catId, limit, offset){
        return db('products').where('CatID', catId).limit(limit).offset(offset);
    },
    findById(id){
        return db('products').where('ProID', id).first();
    },
    countByCatId(catId){
        return db('products').where('CatID',catId).count('* as total').first();
    },
    del(id){
        return db('products').where('ProID', id).del();
    },
    up(id, changes){
        return db('products').where('ProID', id).update(changes);
    }
}