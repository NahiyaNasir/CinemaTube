import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { MediaController } from "./media.controller";
import { MediaValidation } from "./validation";

const router = Router();

router.post(
  "/",
  checkAuth(Role.ADMIN),
  // validateRequest(MediaValidation.createMediaValidationSchema),
    MediaController.createMedia,
);
router.get("/", MediaController.getAllMedia); // Public
router.get("/slug/:slug", MediaController.getMediaById); // Public
// 
router.patch(
  "/:id",
  checkAuth(Role.ADMIN),
  // validateRequest(MediaValidation.updateMediaValidation),
  MediaController.updateMedia,
);
router.delete("/:id", checkAuth(Role.ADMIN), MediaController.deleteMedia);


export const MediaRoutes = router;