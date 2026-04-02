import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middlewares/checkAuth";
import { FavoriteController } from "./favourite.controller";



const router = Router();

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.USER),
  FavoriteController.getAllFavourite,
);
router.post(
  "/:mediaId",
  checkAuth(Role.ADMIN, Role.USER),
  FavoriteController.createFavourite,
);
router.delete(
  "/:mediaId",
  checkAuth(Role.ADMIN, Role.USER),
  FavoriteController.deleteFavourite,
);

export const FavoriteRouter = router;