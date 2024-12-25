require("express-async-error")

 const cors = require('cors')
const migrationsRun = require("./database/sqlite/migration")
const AppError = require("./utils/AppError")
const express = require("express")
const routes = require("./routes")
const uploadConfig = require("./confings/upload")



const app = express()
app.use(cors())
app.use(express.json())
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER))

app.use(routes)

migrationsRun()

app.use((error, request, response, next)=>{

    if(error instanceof AppError){
        return response.status(error.statuscode).json({
            status:"OPA, alguma coisa deu errado aí",
            message:error.message
        })
    }

    console.log(error)

    return response.status(500).json({
        status:"erro",
        message:"Internal server error"
    })
})

const PORT = 3333

app.listen(PORT, ()=> console.log(`Server is running on ${PORT}`))