import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middlewares/checkAuth";
import { BookmarkController } from "./bookmark.controller";




const router = Router();

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.USER),
  BookmarkController.getAllBookmark,
);
router.post(
  "/:mediaId",
  checkAuth(Role.ADMIN, Role.USER),
  BookmarkController.createBookmark,
);
router.delete(
  "/:mediaId",
  checkAuth(Role.ADMIN, Role.USER),
  BookmarkController.deleteBookmark,
);

export const BookmarkRouter = router;