const { hash, compare } = require("bcryptjs")
const sqliteConection = require("../database/sqlite")
const AppError = require("../utils/AppError")

class UsersControllers {
   async create(request, response){
        
        const{name, email, password} = request.body

        const database = await sqliteConection()
        const checkUsersExists = await database.get("SELECT * FROM users WHERE email = (?) ", [email])

        if (checkUsersExists) {
            throw new AppError("Este email já esta em uso")
        }

        const hashedPassword = await hash(password, 7)

        await database.run("INSERT INTO users (name, email, password) VALUES (?,?,?)", [name, email, hashedPassword])

        response.status(201).json()

 }

 async update(request, response){
    const {name, email, password, oldpassword} = request.body
    const user_id= request.user.id

    
   try {

    const database = await sqliteConection()
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id])

    if (!user) {
        throw new AppError("Usuario inexistente")
    }

    const userWithUpdateEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email])
    
    if(userWithUpdateEmail && userWithUpdateEmail.id !== user.id){
        throw new AppError("Este email já está em uso")

    }



user.name = name ?? user.name
user.email = email ?? user.email

if (password && !oldpassword) {
    throw new AppError("A senha antiga não foi informada")
    
    
}

if(password && oldpassword){
const checkOldPassword = await compare(oldpassword, user.password)

if(!checkOldPassword){
    throw new AppError("A senha antiga está errada")
    
}

user.password = await hash(password,8)


}


    await database.run( `
        UPDATE users SET
         name = ?, 
         email = ?,
         password =? ,
         updted_at= DATETIME('now')
         WHERE id = ?`,
        [user.name, user.email,user.password, user_id ]) 
       
        return response.json()
        
 }  catch (error) {
    return response.json(error)

}
  }

 
}

module.exports = UsersControllers