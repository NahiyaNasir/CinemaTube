import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middlewares/checkAuth";
import { PaymentController } from "./payment.controller";

 const router= Router()
router.get(
  "/my-payments",
  checkAuth(Role.USER, Role.ADMIN),
  PaymentController.getMyPayments,
);
router.get(
  "/all-payments",
  checkAuth(Role.ADMIN),
  PaymentController.getAllPayments,
);
router.get(
  "/my-media-purchases",
  checkAuth(Role.USER, Role.ADMIN),
  PaymentController.getMyMediaPurchases,
);
router.post(
  "/media-checkout",
  checkAuth(Role.USER, Role.ADMIN),
  PaymentController.createMediaCheckoutSession,
);
router.get(
  "/media-access/:mediaId",
  checkAuth(Role.USER, Role.ADMIN),
  PaymentController.checkMediaAccess,
);

export const PaymentRoutes = router;