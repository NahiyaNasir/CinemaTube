import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { userRoutes } from "../modules/user/user.routes";
import { FavoriteRouter } from "../modules/favourite/favourite.route";
import { BookmarkRouter } from "../modules/bookmark/bookmark.route";
import { GenreRoutes } from "../modules/genre/genre.route";
import { WatchlistRouter } from "../modules/watchList/watchList.route";
import { PaymentRoutes } from "../modules/payment/payment.route";
import { SubscriptionRouter } from "../modules/subscription/sub.routes";
import { MediaRoutes } from "../modules/media/media.route";
import { ReviewsRoutes } from "../modules/review/review.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { ContactRoutes } from "../modules/contact/contact.route";


 const router=Router()

   router.use("/auth",authRoutes)
   router.use("/users",userRoutes)
   router.use("/favorites", FavoriteRouter);
   router.use("/genres", GenreRoutes);
   router.use("/bookmarks", BookmarkRouter);
   router.use("/watchlist", WatchlistRouter);
   router.use("/payment", PaymentRoutes);
   router.use("/subscriptions",  SubscriptionRouter);
   router.use("/media",MediaRoutes)
   router.use("/reviews",ReviewsRoutes)
   router.use("/admin",AdminRoutes);
   router.use("/contact", ContactRoutes);
  

export const IndexRoutes = router;