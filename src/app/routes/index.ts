import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { userRoutes } from "../modules/user/user.routes";
import { FavoriteRouter } from "../modules/favourite/favourite.route";
import { BookmarkRouter } from "../modules/bookmark/bookmark.route";
import { GenreRoutes } from "../modules/genre/genre.route";


 const router=Router()

   router.use("/auth",authRoutes)
   router.use("/users",userRoutes)
   router.use("/favorites", FavoriteRouter);
   router.use("/genres", GenreRoutes);
   router.use("/bookmarks", BookmarkRouter);

export const IndexRoutes = router;