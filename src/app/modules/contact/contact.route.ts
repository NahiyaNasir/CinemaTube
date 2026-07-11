import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { ContactController } from "./contact.controller";
import { ContactValidation } from "./contact.validation";

const router = Router();

router.post(
  "/",
  validateRequest(ContactValidation.createContactMessageSchema),
  ContactController.createContactMessage,
);

router.get("/", checkAuth(Role.ADMIN), ContactController.getAllContactMessages);

router.patch(
  "/:id/read",
  checkAuth(Role.ADMIN),
  ContactController.markContactMessageAsRead,
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN),
  ContactController.deleteContactMessage,
);

export const ContactRoutes = router;