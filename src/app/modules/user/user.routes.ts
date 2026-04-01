import { Router } from "express"
import { Role } from "../../../generated/prisma/enums"

import { UserController } from "./user.controller"
import { checkAuth } from "../../middlewares/checkAuth"



const router = Router()

router.get("/", checkAuth(Role.ADMIN), UserController.getAllUsers) 
router.get("/:id", checkAuth(Role.ADMIN), UserController.getUserById) 
router.patch("/profile", checkAuth(Role.USER), UserController.updateProfile) 
router.delete("/:id", checkAuth(Role.ADMIN), UserController.deleteUser) 
router.patch("/:id/status", checkAuth(Role.ADMIN), UserController.changeStatus) 

export const userRoutes = router