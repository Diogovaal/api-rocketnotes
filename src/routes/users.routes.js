const {Router} = require("express")
const UsersControllers = require("../controllers/UsersControllers")
const UsersAvatarController = require("../controllers/UserAvatarController")
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')
const uploadConfig = require("../confings/upload")
const multer = require("multer")

const usersRoutes = Router()
const upload = multer(uploadConfig.MULTER)

const usersControllers = new UsersControllers()
const usersAvatarController = new UsersAvatarController()

usersRoutes.post("/", usersControllers.create)
usersRoutes.put("/", ensureAuthenticated, usersControllers.update)
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"),usersAvatarController.update)

module.exports = usersRoutes