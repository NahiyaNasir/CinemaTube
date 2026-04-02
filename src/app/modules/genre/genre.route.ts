import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { GenreController } from "./genre.controller";
import { GenreValidation } from "./genre.validation";

const router = Router();

router.post("/bulk", checkAuth(Role.ADMIN), GenreController.createManyGenre);

router.post(
  "/",
  checkAuth(Role.ADMIN),
  validateRequest(GenreValidation.createGenreSchema),
  GenreController.createGenre,
);

router.get("/", GenreController.getAllGenres);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN),
  validateRequest(GenreValidation.updateGenreSchema),
  GenreController.updateGenre,
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN),
  GenreController.deleteGenre,
);

export const GenreRoutes = router;