import db from "../utils/db.js";

export default {
    add(entity){
        return db('users').insert(entity);
    },
    findByUserName(username){
        return db('users').where('username',username).first();
    },
    patch(id, entity){
        return db('users').where('id', id).update(entity);
    },
    pat(id, entity){
        return db('users').where('id', id).update(entity);
    }
}