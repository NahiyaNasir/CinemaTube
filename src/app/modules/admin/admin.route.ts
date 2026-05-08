import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middlewares/checkAuth";
import { AdminController } from "./admin.controller";

const router = Router();

router.get("/analytics/stats", checkAuth(Role.ADMIN), AdminController.getStats);
router.get("/analytics/sales", checkAuth(Role.ADMIN), AdminController.getSales);
router.get(
  "/analytics/reviews",
  checkAuth(Role.ADMIN),
  AdminController.getReviews,
);
router.get("/media", checkAuth(Role.ADMIN), AdminController.getAllMedia);

export const AdminRoutes = router;