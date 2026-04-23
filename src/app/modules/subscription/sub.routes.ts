import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { SubscriptionController } from "./sub.controller";
import { Role } from "../../../generated/prisma/enums";


const router = Router();

router.post("/checkout", checkAuth(Role.USER, Role.ADMIN), SubscriptionController.createCheckoutSession);
router.get("/plans", SubscriptionController.getPlans);

router.get("/status", checkAuth(Role.USER, Role.ADMIN), SubscriptionController.getSubscriptionStatus);
router.get("/history", checkAuth(Role.USER, Role.ADMIN), SubscriptionController.getPaymentHistory);
router.delete(
  "/cancel",
  checkAuth(Role.USER, Role.ADMIN),
  SubscriptionController.cancelSubscription
);

export const SubscriptionRouter = router;