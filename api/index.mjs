var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import path3 from "path";

// src/app/config/env.ts
import dotenv from "dotenv";
dotenv.config();
var loadEnvVariables = () => {
  const requireEnvVariable = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE",
    "EMAIL_SENDER_SMTP_USER",
    "EMAIL_SENDER_SMTP_PASS",
    "EMAIL_SENDER_SMTP_HOST",
    "EMAIL_SENDER_SMTP_PORT",
    "EMAIL_SENDER_SMTP_FROM",
    // "EMAIL_SENDER_SMTP_HOST",
    // "EMAIL_SENDER_SMTP_PORT",
    // "GOOGLE_CLIENT_ID",
    // "GOOGLE_CLIENT_SECRET",
    // "GOOGLE_CALLBACK_URL",
    "FRONTEND_URL",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD"
  ];
  requireEnvVariable.forEach((variable) => {
    if (!process.env[variable]) {
      throw new Error(
        `Environment variable ${variable} is required but not set in .env file.`
      );
    }
  });
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
    BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: process.env.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN,
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE,
    EMAIL_SENDER: {
      SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER,
      SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS,
      SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST,
      SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT,
      SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM
    },
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    STRIPE: {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET
    },
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
  };
};
var envVars = loadEnvVariables();

// src/app/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/app/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.7.0",
  "engineVersion": "75cbdc1eb7150937890ad5465d861175c6624711",
  "activeProvider": "postgresql",
  "inlineSchema": 'model Admin {\n  id            String    @id @default(uuid(7))\n  name          String\n  email         String    @unique\n  profilePhoto  String?\n  contactNumber String?\n  isDeleted     Boolean   @default(false)\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  deletedAt     DateTime?\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([email])\n  @@index([isDeleted])\n  @@map("admin")\n}\n\nmodel User {\n  id                 String          @id\n  name               String\n  email              String          @unique\n  emailVerified      Boolean         @default(false)\n  image              String?\n  role               Role            @default(USER)\n  status             UserStatus      @default(ACTIVE)\n  needPasswordChange Boolean         @default(false)\n  isDeleted          Boolean         @default(false)\n  deletedAt          DateTime?\n  createdAt          DateTime        @default(now())\n  updatedAt          DateTime        @updatedAt\n  watchList          WatchList[]\n  accounts           Account[]\n  bookmarks          Bookmark[]\n  favorites          Favorite[]\n  mediaAdded         Media[]         @relation("MediaAddedBy")\n  profile            Profile?\n  ratings            Rating[]\n  reviews            Review[]\n  sessions           Session[]\n  payments           Payment[]\n  subscriptions      Subscription[]\n  mediaPurchases     MediaPurchase[]\n  rentals            Rental[]\n  admins             Admin[]\n\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String   @unique\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nenum Role {\n  ADMIN\n  USER\n}\n\nenum UserStatus {\n  BLOCKED\n  DELETED\n  ACTIVE\n  PENDING\n  UNVERIFIED\n}\n\nenum MediaType {\n  MOVIE\n  SERIES\n}\n\nenum ReviewStatus {\n  PENDING\n  APPROVED\n  UNPUBLISHED\n}\n\nenum PaymentStatus {\n  PAID\n  UNPAID\n}\n\nenum MediaPurchaseType {\n  RENTAL\n  BUY\n}\n\nenum MediaPurchaseStatus {\n  ACTIVE\n  EXPIRED\n  CANCELLED\n}\n\nenum RentalStatus {\n  ACTIVE\n  EXPIRED\n  CANCELLED\n}\n\nenum PurchaseType {\n  BUY\n  RENT\n}\n\nenum Pricing {\n  FREE\n  PREMIUM\n  RENTAL\n}\n\nenum SubscriptionPlan {\n  FREE\n  MONTHLY\n  YEARLY\n}\n\nenum SubscriptionStatus {\n  ACTIVE\n  CANCELLED\n  EXPIRED\n  PAST_DUE\n}\n\nenum SubStatus {\n  ACTIVE\n  CANCELLED\n  EXPIRED\n}\n\nmodel Genre {\n  id     String  @id @default(uuid())\n  name   String  @unique\n  medias Media[] @relation("MediaGenres")\n}\n\nmodel Media {\n  id             String   @id @default(uuid())\n  title          String\n  slug           String   @unique\n  type           String\n  description    String   @db.Text\n  releaseYear    Int\n  director       String\n  posterUrl      String?\n  backdropUrl    String?\n  trailerUrl     String?\n  streamingUrl   String?\n  rentalPrice    Decimal? @db.Decimal(10, 2)\n  buyPrice       Decimal? @db.Decimal(10, 2)\n  runtimeMinutes Int?\n  seasons        Int?\n  pricing        Pricing  @default(FREE)\n  isPublished    Boolean  @default(true)\n  isFeatured     Boolean  @default(false)\n  avgRating      Float?\n  reviewCount    Int      @default(0)\n  createdAt      DateTime @default(now())\n  updatedAt      DateTime @updatedAt\n\n  genres         Genre[]     @relation("MediaGenres")\n  // platforms      MediaPlatform[]\n  reviews        Review[]\n  watchlistItems WatchList[]\n\n  viewCount Int             @default(0)\n  bookmarks Bookmark[]\n  favorites Favorite[]\n  purchases MediaPurchase[]\n  cast      CastMember[]\n  rentals   Rental[]\n  ratings   Rating[]\n  profiles  Profile[]       @relation("MediaProfiles")\n  users     User[]          @relation("MediaAddedBy")\n\n  @@unique([title, releaseYear])\n  @@index([title])\n  @@index([type])\n  @@index([releaseYear])\n  @@index([director])\n  @@index([pricing])\n  @@index([isFeatured])\n  @@index([createdAt])\n  @@index([viewCount])\n  @@map("media")\n}\n\nmodel CastMember {\n  id      String  @id @default(uuid())\n  name    String\n  role    String\n  image   String?\n  mediaId String\n  media   Media   @relation(fields: [mediaId], references: [id], onDelete: Cascade)\n\n  @@map("cast_members")\n}\n\n// model MediaPlatform {\n//   id         String   @id @default(uuid())\n//   mediaId    String\n//   media      Media    @relation(fields: [mediaId], references: [id], onDelete: Cascade)\n//   platformId String\n//   platform   Platform @relation(fields: [platformId], references: [id], onDelete: Cascade)\n\n//   @@unique([mediaId, platformId])\n//   @@index([mediaId])\n//   @@index([platformId])\n//   @@map("media_platforms")\n// }\n\nmodel Payment {\n  id String @id @default(uuid())\n\n  subscriptionId String?\n  subscription   Subscription? @relation(fields: [subscriptionId], references: [id])\n  userId         String\n  user           User          @relation(fields: [userId], references: [id])\n\n  amount          Float\n  currency        String  @default("usd")\n  stripePaymentId String? @unique\n  status          String\n\n  mediaPurchaseId String?        @unique\n  mediaPurchase   MediaPurchase? @relation(fields: [mediaPurchaseId], references: [id])\n\n  createdAt DateTime @default(now())\n\n  rentalId String? @unique\n  rental   Rental? @relation(fields: [rentalId], references: [id])\n\n  @@index([subscriptionId])\n  @@index([userId])\n  @@index([status])\n  @@index([createdAt])\n  @@map("payments")\n}\n\nmodel MediaPurchase {\n  id        String              @id @default(uuid())\n  userId    String\n  user      User                @relation(fields: [userId], references: [id])\n  mediaId   String\n  media     Media               @relation(fields: [mediaId], references: [id])\n  type      MediaPurchaseType\n  status    MediaPurchaseStatus @default(ACTIVE)\n  expiresAt DateTime?\n  createdAt DateTime            @default(now())\n  updatedAt DateTime            @updatedAt\n  payment   Payment?\n\n  @@index([userId])\n  @@index([mediaId])\n  @@index([status])\n  @@map("media_purchases")\n}\n\nmodel Rental {\n  id        String       @id @default(uuid())\n  userId    String\n  user      User         @relation(fields: [userId], references: [id])\n  mediaId   String\n  media     Media        @relation(fields: [mediaId], references: [id])\n  status    RentalStatus @default(ACTIVE)\n  expiresAt DateTime\n  createdAt DateTime     @default(now())\n  updatedAt DateTime     @updatedAt\n  payment   Payment?\n\n  @@index([userId])\n  @@index([mediaId])\n  @@index([status])\n  @@map("rentals")\n}\n\nmodel Profile {\n  id         String     @id @default(uuid())\n  userId     String     @unique\n  name       String?\n  email      String?\n  image      String?\n  bio        String?\n  avatar     String?\n  coverImage String?\n  createdAt  DateTime   @default(now())\n  updatedAt  DateTime   @updatedAt\n  bookmark   Bookmark[]\n  favorite   Favorite[]\n  user       User       @relation(fields: [userId], references: [id])\n  medias     Media[]    @relation("MediaProfiles")\n\n  @@map("profile")\n}\n\nmodel Bookmark {\n  id        String   @id @default(uuid())\n  userId    String\n  mediaId   String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  profileId String?\n  media     Media    @relation(fields: [mediaId], references: [id])\n  profile   Profile? @relation(fields: [profileId], references: [id])\n  user      User     @relation(fields: [userId], references: [id])\n\n  @@index([userId])\n  @@map("bookmark")\n}\n\nmodel Favorite {\n  id        String   @id @default(uuid())\n  userId    String\n  mediaId   String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  profileId String?\n  media     Media    @relation(fields: [mediaId], references: [id])\n  profile   Profile? @relation(fields: [profileId], references: [id])\n  user      User     @relation(fields: [userId], references: [id])\n\n  @@index([userId])\n  @@map("favorite")\n}\n\nmodel Rating {\n  id        String   @id @default(uuid())\n  score     Int\n  createdAt DateTime @default(now())\n  userId    String\n  mediaId   String\n  media     Media    @relation(fields: [mediaId], references: [id], onDelete: Cascade)\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([userId, mediaId])\n  @@map("ratings")\n}\n\nmodel Review {\n  id         String       @id @default(uuid())\n  content    String\n  rating     Int\n  status     ReviewStatus @default(UNPUBLISHED)\n  createdAt  DateTime     @default(now())\n  updatedAt  DateTime     @updatedAt\n  userId     String\n  mediaId    String\n  media      Media        @relation(fields: [mediaId], references: [id], onDelete: Cascade)\n  user       User         @relation(fields: [userId], references: [id], onDelete: Cascade)\n  tags       String[]\n  hasSpoiler Boolean      @default(false)\n\n  @@map("reviews")\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Subscription {\n  id                 String             @id @default(uuid())\n  userId             String             @unique\n  user               User               @relation(fields: [userId], references: [id], onDelete: Cascade)\n  plan               SubscriptionPlan   @default(FREE)\n  status             SubscriptionStatus @default(ACTIVE)\n  stripeCustomerId   String?            @unique\n  stripePriceId      String?\n  currentPeriodStart DateTime?\n  currentPeriodEnd   DateTime?\n  cancelAtPeriodEnd  Boolean            @default(false)\n  createdAt          DateTime           @default(now())\n  updatedAt          DateTime           @updatedAt\n\n  payments Payment[]\n\n  @@index([userId])\n  @@index([plan])\n  @@index([status])\n  @@index([currentPeriodEnd])\n  @@map("subscriptions")\n}\n\nmodel WatchList {\n  id        String   @id @default(uuid())\n  userId    String\n  mediaId   String\n  createdAt DateTime @default(now())\n  media     Media    @relation(fields: [mediaId], references: [id], onDelete: Cascade)\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([userId, mediaId])\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Admin":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"contactNumber","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminToUser"}],"dbName":"admin"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"watchList","kind":"object","type":"WatchList","relationName":"UserToWatchList"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"bookmarks","kind":"object","type":"Bookmark","relationName":"BookmarkToUser"},{"name":"favorites","kind":"object","type":"Favorite","relationName":"FavoriteToUser"},{"name":"mediaAdded","kind":"object","type":"Media","relationName":"MediaAddedBy"},{"name":"profile","kind":"object","type":"Profile","relationName":"ProfileToUser"},{"name":"ratings","kind":"object","type":"Rating","relationName":"RatingToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"},{"name":"subscriptions","kind":"object","type":"Subscription","relationName":"SubscriptionToUser"},{"name":"mediaPurchases","kind":"object","type":"MediaPurchase","relationName":"MediaPurchaseToUser"},{"name":"rentals","kind":"object","type":"Rental","relationName":"RentalToUser"},{"name":"admins","kind":"object","type":"Admin","relationName":"AdminToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Genre":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"medias","kind":"object","type":"Media","relationName":"MediaGenres"}],"dbName":null},"Media":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"type","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"releaseYear","kind":"scalar","type":"Int"},{"name":"director","kind":"scalar","type":"String"},{"name":"posterUrl","kind":"scalar","type":"String"},{"name":"backdropUrl","kind":"scalar","type":"String"},{"name":"trailerUrl","kind":"scalar","type":"String"},{"name":"streamingUrl","kind":"scalar","type":"String"},{"name":"rentalPrice","kind":"scalar","type":"Decimal"},{"name":"buyPrice","kind":"scalar","type":"Decimal"},{"name":"runtimeMinutes","kind":"scalar","type":"Int"},{"name":"seasons","kind":"scalar","type":"Int"},{"name":"pricing","kind":"enum","type":"Pricing"},{"name":"isPublished","kind":"scalar","type":"Boolean"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"avgRating","kind":"scalar","type":"Float"},{"name":"reviewCount","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"genres","kind":"object","type":"Genre","relationName":"MediaGenres"},{"name":"reviews","kind":"object","type":"Review","relationName":"MediaToReview"},{"name":"watchlistItems","kind":"object","type":"WatchList","relationName":"MediaToWatchList"},{"name":"viewCount","kind":"scalar","type":"Int"},{"name":"bookmarks","kind":"object","type":"Bookmark","relationName":"BookmarkToMedia"},{"name":"favorites","kind":"object","type":"Favorite","relationName":"FavoriteToMedia"},{"name":"purchases","kind":"object","type":"MediaPurchase","relationName":"MediaToMediaPurchase"},{"name":"cast","kind":"object","type":"CastMember","relationName":"CastMemberToMedia"},{"name":"rentals","kind":"object","type":"Rental","relationName":"MediaToRental"},{"name":"ratings","kind":"object","type":"Rating","relationName":"MediaToRating"},{"name":"profiles","kind":"object","type":"Profile","relationName":"MediaProfiles"},{"name":"users","kind":"object","type":"User","relationName":"MediaAddedBy"}],"dbName":"media"},"CastMember":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"role","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"CastMemberToMedia"}],"dbName":"cast_members"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"subscriptionId","kind":"scalar","type":"String"},{"name":"subscription","kind":"object","type":"Subscription","relationName":"PaymentToSubscription"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"currency","kind":"scalar","type":"String"},{"name":"stripePaymentId","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"mediaPurchaseId","kind":"scalar","type":"String"},{"name":"mediaPurchase","kind":"object","type":"MediaPurchase","relationName":"MediaPurchaseToPayment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"rentalId","kind":"scalar","type":"String"},{"name":"rental","kind":"object","type":"Rental","relationName":"PaymentToRental"}],"dbName":"payments"},"MediaPurchase":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"MediaPurchaseToUser"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"MediaToMediaPurchase"},{"name":"type","kind":"enum","type":"MediaPurchaseType"},{"name":"status","kind":"enum","type":"MediaPurchaseStatus"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"payment","kind":"object","type":"Payment","relationName":"MediaPurchaseToPayment"}],"dbName":"media_purchases"},"Rental":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"RentalToUser"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"MediaToRental"},{"name":"status","kind":"enum","type":"RentalStatus"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"payment","kind":"object","type":"Payment","relationName":"PaymentToRental"}],"dbName":"rentals"},"Profile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"avatar","kind":"scalar","type":"String"},{"name":"coverImage","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"bookmark","kind":"object","type":"Bookmark","relationName":"BookmarkToProfile"},{"name":"favorite","kind":"object","type":"Favorite","relationName":"FavoriteToProfile"},{"name":"user","kind":"object","type":"User","relationName":"ProfileToUser"},{"name":"medias","kind":"object","type":"Media","relationName":"MediaProfiles"}],"dbName":"profile"},"Bookmark":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"profileId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"BookmarkToMedia"},{"name":"profile","kind":"object","type":"Profile","relationName":"BookmarkToProfile"},{"name":"user","kind":"object","type":"User","relationName":"BookmarkToUser"}],"dbName":"bookmark"},"Favorite":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"profileId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"FavoriteToMedia"},{"name":"profile","kind":"object","type":"Profile","relationName":"FavoriteToProfile"},{"name":"user","kind":"object","type":"User","relationName":"FavoriteToUser"}],"dbName":"favorite"},"Rating":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"score","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"MediaToRating"},{"name":"user","kind":"object","type":"User","relationName":"RatingToUser"}],"dbName":"ratings"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"ReviewStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"MediaToReview"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"tags","kind":"scalar","type":"String"},{"name":"hasSpoiler","kind":"scalar","type":"Boolean"}],"dbName":"reviews"},"Subscription":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SubscriptionToUser"},{"name":"plan","kind":"enum","type":"SubscriptionPlan"},{"name":"status","kind":"enum","type":"SubscriptionStatus"},{"name":"stripeCustomerId","kind":"scalar","type":"String"},{"name":"stripePriceId","kind":"scalar","type":"String"},{"name":"currentPeriodStart","kind":"scalar","type":"DateTime"},{"name":"currentPeriodEnd","kind":"scalar","type":"DateTime"},{"name":"cancelAtPeriodEnd","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToSubscription"}],"dbName":"subscriptions"},"WatchList":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"media","kind":"object","type":"Media","relationName":"MediaToWatchList"},{"name":"user","kind":"object","type":"User","relationName":"UserToWatchList"}],"dbName":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","medias","_count","genres","media","user","reviews","watchlistItems","bookmark","profile","favorite","bookmarks","favorites","payments","subscription","mediaPurchase","payment","rental","purchases","cast","rentals","ratings","profiles","users","watchList","accounts","mediaAdded","sessions","subscriptions","mediaPurchases","admins","Admin.findUnique","Admin.findUniqueOrThrow","Admin.findFirst","Admin.findFirstOrThrow","Admin.findMany","data","Admin.createOne","Admin.createMany","Admin.createManyAndReturn","Admin.updateOne","Admin.updateMany","Admin.updateManyAndReturn","create","update","Admin.upsertOne","Admin.deleteOne","Admin.deleteMany","having","_min","_max","Admin.groupBy","Admin.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Genre.findUnique","Genre.findUniqueOrThrow","Genre.findFirst","Genre.findFirstOrThrow","Genre.findMany","Genre.createOne","Genre.createMany","Genre.createManyAndReturn","Genre.updateOne","Genre.updateMany","Genre.updateManyAndReturn","Genre.upsertOne","Genre.deleteOne","Genre.deleteMany","Genre.groupBy","Genre.aggregate","Media.findUnique","Media.findUniqueOrThrow","Media.findFirst","Media.findFirstOrThrow","Media.findMany","Media.createOne","Media.createMany","Media.createManyAndReturn","Media.updateOne","Media.updateMany","Media.updateManyAndReturn","Media.upsertOne","Media.deleteOne","Media.deleteMany","_avg","_sum","Media.groupBy","Media.aggregate","CastMember.findUnique","CastMember.findUniqueOrThrow","CastMember.findFirst","CastMember.findFirstOrThrow","CastMember.findMany","CastMember.createOne","CastMember.createMany","CastMember.createManyAndReturn","CastMember.updateOne","CastMember.updateMany","CastMember.updateManyAndReturn","CastMember.upsertOne","CastMember.deleteOne","CastMember.deleteMany","CastMember.groupBy","CastMember.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","MediaPurchase.findUnique","MediaPurchase.findUniqueOrThrow","MediaPurchase.findFirst","MediaPurchase.findFirstOrThrow","MediaPurchase.findMany","MediaPurchase.createOne","MediaPurchase.createMany","MediaPurchase.createManyAndReturn","MediaPurchase.updateOne","MediaPurchase.updateMany","MediaPurchase.updateManyAndReturn","MediaPurchase.upsertOne","MediaPurchase.deleteOne","MediaPurchase.deleteMany","MediaPurchase.groupBy","MediaPurchase.aggregate","Rental.findUnique","Rental.findUniqueOrThrow","Rental.findFirst","Rental.findFirstOrThrow","Rental.findMany","Rental.createOne","Rental.createMany","Rental.createManyAndReturn","Rental.updateOne","Rental.updateMany","Rental.updateManyAndReturn","Rental.upsertOne","Rental.deleteOne","Rental.deleteMany","Rental.groupBy","Rental.aggregate","Profile.findUnique","Profile.findUniqueOrThrow","Profile.findFirst","Profile.findFirstOrThrow","Profile.findMany","Profile.createOne","Profile.createMany","Profile.createManyAndReturn","Profile.updateOne","Profile.updateMany","Profile.updateManyAndReturn","Profile.upsertOne","Profile.deleteOne","Profile.deleteMany","Profile.groupBy","Profile.aggregate","Bookmark.findUnique","Bookmark.findUniqueOrThrow","Bookmark.findFirst","Bookmark.findFirstOrThrow","Bookmark.findMany","Bookmark.createOne","Bookmark.createMany","Bookmark.createManyAndReturn","Bookmark.updateOne","Bookmark.updateMany","Bookmark.updateManyAndReturn","Bookmark.upsertOne","Bookmark.deleteOne","Bookmark.deleteMany","Bookmark.groupBy","Bookmark.aggregate","Favorite.findUnique","Favorite.findUniqueOrThrow","Favorite.findFirst","Favorite.findFirstOrThrow","Favorite.findMany","Favorite.createOne","Favorite.createMany","Favorite.createManyAndReturn","Favorite.updateOne","Favorite.updateMany","Favorite.updateManyAndReturn","Favorite.upsertOne","Favorite.deleteOne","Favorite.deleteMany","Favorite.groupBy","Favorite.aggregate","Rating.findUnique","Rating.findUniqueOrThrow","Rating.findFirst","Rating.findFirstOrThrow","Rating.findMany","Rating.createOne","Rating.createMany","Rating.createManyAndReturn","Rating.updateOne","Rating.updateMany","Rating.updateManyAndReturn","Rating.upsertOne","Rating.deleteOne","Rating.deleteMany","Rating.groupBy","Rating.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","Subscription.findUnique","Subscription.findUniqueOrThrow","Subscription.findFirst","Subscription.findFirstOrThrow","Subscription.findMany","Subscription.createOne","Subscription.createMany","Subscription.createManyAndReturn","Subscription.updateOne","Subscription.updateMany","Subscription.updateManyAndReturn","Subscription.upsertOne","Subscription.deleteOne","Subscription.deleteMany","Subscription.groupBy","Subscription.aggregate","WatchList.findUnique","WatchList.findUniqueOrThrow","WatchList.findFirst","WatchList.findFirstOrThrow","WatchList.findMany","WatchList.createOne","WatchList.createMany","WatchList.createManyAndReturn","WatchList.updateOne","WatchList.updateMany","WatchList.updateManyAndReturn","WatchList.upsertOne","WatchList.deleteOne","WatchList.deleteMany","WatchList.groupBy","WatchList.aggregate","AND","OR","NOT","id","userId","mediaId","createdAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","SubscriptionPlan","plan","SubscriptionStatus","status","stripeCustomerId","stripePriceId","currentPeriodStart","currentPeriodEnd","cancelAtPeriodEnd","updatedAt","content","rating","ReviewStatus","tags","hasSpoiler","has","hasEvery","hasSome","score","profileId","name","email","image","bio","avatar","coverImage","RentalStatus","expiresAt","MediaPurchaseType","type","MediaPurchaseStatus","subscriptionId","amount","currency","stripePaymentId","mediaPurchaseId","rentalId","role","title","slug","description","releaseYear","director","posterUrl","backdropUrl","trailerUrl","streamingUrl","rentalPrice","buyPrice","runtimeMinutes","seasons","Pricing","pricing","isPublished","isFeatured","avgRating","reviewCount","viewCount","identifier","value","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","emailVerified","Role","UserStatus","needPasswordChange","isDeleted","deletedAt","profilePhoto","contactNumber","every","some","none","userId_mediaId","title_releaseYear","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide","push"]'),
  graph: "1AqeAaACDgcAAOIEACDJAgAA3gQAMMoCAABnABDLAgAA3gQAMMwCAQAAAAHNAgEAAAABzwJAANMEACHkAkAA0wQAIe8CAQDSBAAh8AIBAAAAAacDIADgBAAhqANAAOEEACGpAwEA3wQAIaoDAQDfBAAhAQAAAAEAIAkGAAD9BAAgBwAA4gQAIMkCAACaBQAwygIAAAMAEMsCAACaBQAwzAIBANIEACHNAgEA0gQAIc4CAQDSBAAhzwJAANMEACECBgAAswkAIAcAAKQJACAKBgAA_QQAIAcAAOIEACDJAgAAmgUAMMoCAAADABDLAgAAmgUAMMwCAQAAAAHNAgEA0gQAIc4CAQDSBAAhzwJAANMEACGuAwAAmQUAIAMAAAADACABAAAEADACAAAFACAGAwAA8AQAIMkCAACYBQAwygIAAAcAEMsCAACYBQAwzAIBANIEACHvAgEA0gQAIQEDAACqCQAgBgMAAPAEACDJAgAAmAUAMMoCAAAHABDLAgAAmAUAMMwCAQAAAAHvAgEAAAABAwAAAAcAIAEAAAgAMAIAAAkAICUFAACUBQAgCAAA8wQAIAkAAOwEACANAADuBAAgDgAA7wQAIBQAAPYEACAVAACVBQAgFgAA9wQAIBcAAPIEACAYAACWBQAgGQAAlwUAIMkCAACPBQAwygIAAAsAEMsCAACPBQAwzAIBANIEACHPAkAA0wQAIeQCQADTBAAh-AIBANIEACGBAwEA0gQAIYIDAQDSBAAhgwMBANIEACGEAwIA_AQAIYUDAQDSBAAhhgMBAN8EACGHAwEA3wQAIYgDAQDfBAAhiQMBAN8EACGKAxAAkAUAIYsDEACQBQAhjAMCAJEFACGNAwIAkQUAIY8DAACSBY8DIpADIADgBAAhkQMgAOAEACGSAwgAkwUAIZMDAgD8BAAhlAMCAPwEACEUBQAAuAkAIAgAAK0JACAJAACmCQAgDQAAqAkAIA4AAKkJACAUAACwCQAgFQAAuQkAIBYAALEJACAXAACsCQAgGAAAugkAIBkAALsJACCGAwAApAUAIIcDAACkBQAgiAMAAKQFACCJAwAApAUAIIoDAACkBQAgiwMAAKQFACCMAwAApAUAII0DAACkBQAgkgMAAKQFACAmBQAAlAUAIAgAAPMEACAJAADsBAAgDQAA7gQAIA4AAO8EACAUAAD2BAAgFQAAlQUAIBYAAPcEACAXAADyBAAgGAAAlgUAIBkAAJcFACDJAgAAjwUAMMoCAAALABDLAgAAjwUAMMwCAQAAAAHPAkAA0wQAIeQCQADTBAAh-AIBANIEACGBAwEA0gQAIYIDAQAAAAGDAwEA0gQAIYQDAgD8BAAhhQMBANIEACGGAwEA3wQAIYcDAQDfBAAhiAMBAN8EACGJAwEA3wQAIYoDEACQBQAhiwMQAJAFACGMAwIAkQUAIY0DAgCRBQAhjwMAAJIFjwMikAMgAOAEACGRAyAA4AQAIZIDCACTBQAhkwMCAPwEACGUAwIA_AQAIa8DAACOBQAgAwAAAAsAIAEAAAwAMAIAAA0AIAEAAAALACAPBgAA_QQAIAcAAOIEACDJAgAAjAUAMMoCAAAQABDLAgAAjAUAMMwCAQDSBAAhzQIBANIEACHOAgEA0gQAIc8CQADTBAAh3gIAAI0F6AIi5AJAANMEACHlAgEA0gQAIeYCAgD8BAAh6AIAAKsEACDpAiAA4AQAIQIGAACzCQAgBwAApAkAIA8GAAD9BAAgBwAA4gQAIMkCAACMBQAwygIAABAAEMsCAACMBQAwzAIBAAAAAc0CAQDSBAAhzgIBANIEACHPAkAA0wQAId4CAACNBegCIuQCQADTBAAh5QIBANIEACHmAgIA_AQAIegCAACrBAAg6QIgAOAEACEDAAAAEAAgAQAAEQAwAgAAEgAgAwAAAAMAIAEAAAQAMAIAAAUAIAwGAAD9BAAgBwAA4gQAIAsAAPEEACDJAgAAiwUAMMoCAAAVABDLAgAAiwUAMMwCAQDSBAAhzQIBANIEACHOAgEA0gQAIc8CQADTBAAh5AJAANMEACHuAgEA3wQAIQQGAACzCQAgBwAApAkAIAsAAKsJACDuAgAApAUAIAwGAAD9BAAgBwAA4gQAIAsAAPEEACDJAgAAiwUAMMoCAAAVABDLAgAAiwUAMMwCAQAAAAHNAgEA0gQAIc4CAQDSBAAhzwJAANMEACHkAkAA0wQAIe4CAQDfBAAhAwAAABUAIAEAABYAMAIAABcAIBEDAADwBAAgBwAA4gQAIAoAAO4EACAMAADvBAAgyQIAAPkEADDKAgAAGQAQywIAAPkEADDMAgEA0gQAIc0CAQDSBAAhzwJAANMEACHkAkAA0wQAIe8CAQDfBAAh8AIBAN8EACHxAgEA3wQAIfICAQDfBAAh8wIBAN8EACH0AgEA3wQAIQEAAAAZACADAAAAFQAgAQAAFgAwAgAAFwAgDAYAAP0EACAHAADiBAAgCwAA8QQAIMkCAACKBQAwygIAABwAEMsCAACKBQAwzAIBANIEACHNAgEA0gQAIc4CAQDSBAAhzwJAANMEACHkAkAA0wQAIe4CAQDfBAAhBAYAALMJACAHAACkCQAgCwAAqwkAIO4CAACkBQAgDAYAAP0EACAHAADiBAAgCwAA8QQAIMkCAACKBQAwygIAABwAEMsCAACKBQAwzAIBAAAAAc0CAQDSBAAhzgIBANIEACHPAkAA0wQAIeQCQADTBAAh7gIBAN8EACEDAAAAHAAgAQAAHQAwAgAAHgAgAQAAABkAIAMAAAALACABAAAMADACAAANACABAAAAFQAgAQAAABwAIAEAAAALACADAAAAHAAgAQAAHQAwAgAAHgAgDgYAAP0EACAHAADiBAAgEgAAgAUAIMkCAACHBQAwygIAACYAEMsCAACHBQAwzAIBANIEACHNAgEA0gQAIc4CAQDSBAAhzwJAANMEACHeAgAAiQX6AiLkAkAA0wQAIfYCQADhBAAh-AIAAIgF-AIiBAYAALMJACAHAACkCQAgEgAAtAkAIPYCAACkBQAgDgYAAP0EACAHAADiBAAgEgAAgAUAIMkCAACHBQAwygIAACYAEMsCAACHBQAwzAIBAAAAAc0CAQDSBAAhzgIBANIEACHPAkAA0wQAId4CAACJBfoCIuQCQADTBAAh9gJAAOEEACH4AgAAiAX4AiIDAAAAJgAgAQAAJwAwAgAAKAAgEQcAAOIEACAQAACEBQAgEQAAhQUAIBMAAIYFACDJAgAAggUAMMoCAAAqABDLAgAAggUAMMwCAQDSBAAhzQIBANIEACHPAkAA0wQAId4CAQDSBAAh-gIBAN8EACH7AggAgwUAIfwCAQDSBAAh_QIBAN8EACH-AgEA3wQAIf8CAQDfBAAhAQAAACoAIBAHAADiBAAgDwAA5gQAIMkCAADjBAAwygIAACwAEMsCAADjBAAwzAIBANIEACHNAgEA0gQAIc8CQADTBAAh3AIAAOQE3AIi3gIAAOUE3gIi3wIBAN8EACHgAgEA3wQAIeECQADhBAAh4gJAAOEEACHjAiAA4AQAIeQCQADTBAAhAQAAACwAIAgHAACkCQAgEAAAtQkAIBEAALYJACATAAC3CQAg-gIAAKQFACD9AgAApAUAIP4CAACkBQAg_wIAAKQFACARBwAA4gQAIBAAAIQFACARAACFBQAgEwAAhgUAIMkCAACCBQAwygIAACoAEMsCAACCBQAwzAIBAAAAAc0CAQDSBAAhzwJAANMEACHeAgEA0gQAIfoCAQDfBAAh-wIIAIMFACH8AgEA0gQAIf0CAQAAAAH-AgEAAAAB_wIBAAAAAQMAAAAqACABAAAuADACAAAvACABAAAAKgAgAQAAACYAIA0GAAD9BAAgBwAA4gQAIBIAAIAFACDJAgAA_gQAMMoCAAAzABDLAgAA_gQAMMwCAQDSBAAhzQIBANIEACHOAgEA0gQAIc8CQADTBAAh3gIAAP8E9gIi5AJAANMEACH2AkAA0wQAIQEAAAAzACABAAAAKgAgCQYAAP0EACDJAgAAgQUAMMoCAAA2ABDLAgAAgQUAMMwCAQDSBAAhzgIBANIEACHvAgEA0gQAIfECAQDfBAAhgAMBANIEACECBgAAswkAIPECAACkBQAgCQYAAP0EACDJAgAAgQUAMMoCAAA2ABDLAgAAgQUAMMwCAQAAAAHOAgEA0gQAIe8CAQDSBAAh8QIBAN8EACGAAwEA0gQAIQMAAAA2ACABAAA3ADACAAA4ACADBgAAswkAIAcAAKQJACASAAC0CQAgDQYAAP0EACAHAADiBAAgEgAAgAUAIMkCAAD-BAAwygIAADMAEMsCAAD-BAAwzAIBAAAAAc0CAQDSBAAhzgIBANIEACHPAkAA0wQAId4CAAD_BPYCIuQCQADTBAAh9gJAANMEACEDAAAAMwAgAQAAOgAwAgAAOwAgCgYAAP0EACAHAADiBAAgyQIAAPsEADDKAgAAPQAQywIAAPsEADDMAgEA0gQAIc0CAQDSBAAhzgIBANIEACHPAkAA0wQAIe0CAgD8BAAhAgYAALMJACAHAACkCQAgCwYAAP0EACAHAADiBAAgyQIAAPsEADDKAgAAPQAQywIAAPsEADDMAgEAAAABzQIBANIEACHOAgEA0gQAIc8CQADTBAAh7QICAPwEACGuAwAA-gQAIAMAAAA9ACABAAA-ADACAAA_ACAKAwAAqgkAIAcAAKQJACAKAACoCQAgDAAAqQkAIO8CAACkBQAg8AIAAKQFACDxAgAApAUAIPICAACkBQAg8wIAAKQFACD0AgAApAUAIBEDAADwBAAgBwAA4gQAIAoAAO4EACAMAADvBAAgyQIAAPkEADDKAgAAGQAQywIAAPkEADDMAgEAAAABzQIBAAAAAc8CQADTBAAh5AJAANMEACHvAgEA3wQAIfACAQDfBAAh8QIBAN8EACHyAgEA3wQAIfMCAQDfBAAh9AIBAN8EACEDAAAAGQAgAQAAQQAwAgAAQgAgHQgAAPMEACALAADxBAAgDQAA7gQAIA4AAO8EACAPAADmBAAgFgAA9wQAIBcAAPIEACAaAADsBAAgGwAA7QQAIBwAAPAEACAdAAD0BAAgHgAA9QQAIB8AAPYEACAgAAD4BAAgyQIAAOkEADDKAgAARAAQywIAAOkEADDMAgEA0gQAIc8CQADTBAAh3gIAAOsEpgMi5AJAANMEACHvAgEA0gQAIfACAQDSBAAh8QIBAN8EACGAAwAA6gSlAyKjAyAA4AQAIaYDIADgBAAhpwMgAOAEACGoA0AA4QQAIRAIAACtCQAgCwAAqwkAIA0AAKgJACAOAACpCQAgDwAApQkAIBYAALEJACAXAACsCQAgGgAApgkAIBsAAKcJACAcAACqCQAgHQAArgkAIB4AAK8JACAfAACwCQAgIAAAsgkAIPECAACkBQAgqAMAAKQFACAdCAAA8wQAIAsAAPEEACANAADuBAAgDgAA7wQAIA8AAOYEACAWAAD3BAAgFwAA8gQAIBoAAOwEACAbAADtBAAgHAAA8AQAIB0AAPQEACAeAAD1BAAgHwAA9gQAICAAAPgEACDJAgAA6QQAMMoCAABEABDLAgAA6QQAMMwCAQAAAAHPAkAA0wQAId4CAADrBKYDIuQCQADTBAAh7wIBANIEACHwAgEAAAAB8QIBAN8EACGAAwAA6gSlAyKjAyAA4AQAIaYDIADgBAAhpwMgAOAEACGoA0AA4QQAIQMAAABEACABAABFADACAABGACABAAAABwAgAQAAABAAIAEAAAADACABAAAAFQAgAQAAABwAIAEAAAAmACABAAAANgAgAQAAADMAIAEAAAA9ACABAAAAGQAgAQAAAEQAIBEHAADiBAAgyQIAAOgEADDKAgAAUwAQywIAAOgEADDMAgEA0gQAIc0CAQDSBAAhzwJAANMEACHkAkAA0wQAIZcDAQDSBAAhmAMBANIEACGZAwEA3wQAIZoDAQDfBAAhmwMBAN8EACGcA0AA4QQAIZ0DQADhBAAhngMBAN8EACGfAwEA3wQAIQgHAACkCQAgmQMAAKQFACCaAwAApAUAIJsDAACkBQAgnAMAAKQFACCdAwAApAUAIJ4DAACkBQAgnwMAAKQFACARBwAA4gQAIMkCAADoBAAwygIAAFMAEMsCAADoBAAwzAIBAAAAAc0CAQDSBAAhzwJAANMEACHkAkAA0wQAIZcDAQDSBAAhmAMBANIEACGZAwEA3wQAIZoDAQDfBAAhmwMBAN8EACGcA0AA4QQAIZ0DQADhBAAhngMBAN8EACGfAwEA3wQAIQMAAABTACABAABUADACAABVACADAAAAFQAgAQAAFgAwAgAAFwAgAwAAABwAIAEAAB0AMAIAAB4AIAMAAAALACABAAAMADACAAANACABAAAAGQAgAwAAAD0AIAEAAD4AMAIAAD8AIAMAAAAQACABAAARADACAAASACAMBwAA4gQAIMkCAADnBAAwygIAAF0AEMsCAADnBAAwzAIBANIEACHNAgEA0gQAIc8CQADTBAAh5AJAANMEACH2AkAA0wQAIaADAQDSBAAhoQMBAN8EACGiAwEA3wQAIQMHAACkCQAgoQMAAKQFACCiAwAApAUAIAwHAADiBAAgyQIAAOcEADDKAgAAXQAQywIAAOcEADDMAgEAAAABzQIBANIEACHPAkAA0wQAIeQCQADTBAAh9gJAANMEACGgAwEAAAABoQMBAN8EACGiAwEA3wQAIQMAAABdACABAABeADACAABfACADAAAAKgAgAQAALgAwAgAALwAgBgcAAKQJACAPAAClCQAg3wIAAKQFACDgAgAApAUAIOECAACkBQAg4gIAAKQFACAQBwAA4gQAIA8AAOYEACDJAgAA4wQAMMoCAAAsABDLAgAA4wQAMMwCAQAAAAHNAgEAAAABzwJAANMEACHcAgAA5ATcAiLeAgAA5QTeAiLfAgEAAAAB4AIBAN8EACHhAkAA4QQAIeICQADhBAAh4wIgAOAEACHkAkAA0wQAIQMAAAAsACABAABiADACAABjACADAAAAJgAgAQAAJwAwAgAAKAAgAwAAADMAIAEA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_JAgAA1gQAMMoCAACfAQAQywIAANYEADDMAgEAkAQAIc8CQACRBAAh3gIAANgEpgMi5AJAAJEEACHvAgEAkAQAIfACAQCQBAAh8QIBAJoEACGAAwAA1wSlAyKjAyAAnAQAIaYDIACcBAAhpwMgAJwEACGoA0AAmwQAIQMAAABEACABAACeAQAwMgAAnwEAIAMAAABEACABAABFADACAABGACABAAAAXwAgAQAAAF8AIAMAAABdACABAABeADACAABfACADAAAAXQAgAQAAXgAwAgAAXwAgAwAAAF0AIAEAAF4AMAIAAF8AIAkHAACRCQAgzAIBAAAAAc0CAQAAAAHPAkAAAAAB5AJAAAAAAfYCQAAAAAGgAwEAAAABoQMBAAAAAaIDAQAAAAEBJgAApwEAIAjMAgEAAAABzQIBAAAAAc8CQAAAAAHkAkAAAAAB9gJAAAAAAaADAQAAAAGhAwEAAAABogMBAAAAAQEmAACpAQAwASYAAKkBADAJBwAAkAkAIMwCAQCeBQAhzQIBAJ4FACHPAkAAnwUAIeQCQACfBQAh9gJAAJ8FACGgAwEAngUAIaEDAQCqBQAhogMBAKoFACECAAAAXwAgJgAArAEAIAjMAgEAngUAIc0CAQCeBQAhzwJAAJ8FACHkAkAAnwUAIfYCQACfBQAhoAMBAJ4FACGhAwEAqgUAIaIDAQCqBQAhAgAAAF0AICYAAK4BACACAAAAXQAgJgAArgEAIAMAAABfACAtAACnAQAgLgAArAEAIAEAAABfACABAAAAXQAgBQQAAI0JACAzAACPCQAgNAAAjgkAIKEDAACkBQAgogMAAKQFACALyQIAANUEADDKAgAAtQEAEMsCAADVBAAwzAIBAJAEACHNAgEAkAQAIc8CQACRBAAh5AJAAJEEACH2AkAAkQQAIaADAQCQBAAhoQMBAJoEACGiAwEAmgQAIQMAAABdACABAAC0AQAwMgAAtQEAIAMAAABdACABAABeADACAABfACABAAAAVQAgAQAAAFUAIAMAAABTACABAABUADACAABVACADAAAAUwAgAQAAVAAwAgAAVQAgAwAAAFMAIAEAAFQAMAIAAFUAIA4HAACMCQAgzAIBAAAAAc0CAQAAAAHPAkAAAAAB5AJAAAAAAZcDAQAAAAGYAwEAAAABmQMBAAAAAZoDAQAAAAGbAwEAAAABnANAAAAAAZ0DQAAAAAGeAwEAAAABnwMBAAAAAQEmAAC9AQAgDcwCAQAAAAHNAgEAAAABzwJAAAAAAeQCQAAAAAGXAwEAAAABmAMBAAAAAZkDAQAAAAGaAwEAAAABmwMBAAAAAZwDQAAAAAGdA0AAAAABngMBAAAAAZ8DAQAAAAEBJgAAvwEAMAEmAAC_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_AUAIYwDAgD9BQAhjQMCAP0FACGPAwAA_gWPAyKQAyAArAUAIZEDIACsBQAhkgMIAP8FACGTAwIAyQUAIZQDAgDJBQAhAgAAAA0AICYAAIcCACAXzAIBAJ4FACHPAkAAnwUAIeQCQACfBQAh-AIBAJ4FACGBAwEAngUAIYIDAQCeBQAhgwMBAJ4FACGEAwIAyQUAIYUDAQCeBQAhhgMBAKoFACGHAwEAqgUAIYgDAQCqBQAhiQMBAKoFACGKAxAA_AUAIYsDEAD8BQAhjAMCAP0FACGNAwIA_QUAIY8DAAD-BY8DIpADIACsBQAhkQMgAKwFACGSAwgA_wUAIZMDAgDJBQAhlAMCAMkFACECAAAACwAgJgAAiQIAIAIAAAALACAmAACJAgAgAwAAAA0AIC0AAIICACAuAACHAgAgAQAAAA0AIAEAAAALACAOBAAA5ggAIDMAAOkIACA0AADoCAAglQEAAOcIACCWAQAA6ggAIIYDAACkBQAghwMAAKQFACCIAwAApAUAIIkDAACkBQAgigMAAKQFACCLAwAApAUAIIwDAACkBQAgjQMAAKQFACCSAwAApAUAIBrJAgAAwwQAMMoCAACQAgAQywIAAMMEADDMAgEAkAQAIc8CQACRBAAh5AJAAJEEACH4AgEAkAQAIYEDAQCQBAAhggMBAJAEACGDAwEAkAQAIYQDAgCpBAAhhQMBAJAEACGGAwEAmgQAIYcDAQCaBAAhiAMBAJoEACGJAwEAmgQAIYoDEADEBAAhiwMQAMQEACGMAwIAxQQAIY0DAgDFBAAhjwMAAMYEjwMikAMgAJwEACGRAyAAnAQAIZIDCADHBAAhkwMCAKkEACGUAwIAqQQAIQMAAAALACABAACPAgAwMgAAkAIAIAMAAAALACABAAAMADACAAANACABAAAAOAAgAQAAADgAIAMAAAA2ACABAAA3ADACAAA4ACADAAAANgAgAQAANwAwAgAAOAAgAwAAADYAIAEAADcAMAIAADgAIAYGAADlCAAgzAIBAAAAAc4CAQAAAAHvAgEAAAAB8QIBAAAAAYADAQAAAAEBJgAAmAIAIAXMAgEAAAABzgIBAAAAAe8CAQAAAAHxAgEAAAABgAMBAAAAAQEmAACaAgAwASYAAJoCADAGBgAA5AgAIMwCAQCeBQAhzgIBAJ4FACHvAgEAngUAIfECAQCqBQAhgAMBAJ4FACECAAAAOAAgJgAAnQIAIAXMAgEAngUAIc4CAQCeBQAh7wIBAJ4FACHxAgEAqgUAIYADAQCeBQAhAgAAADYAICYAAJ8CACACAAAANgAgJgAAnwIAIAMAAAA4ACAtAACYAgAgLgAAnQIAIAEAAAA4ACABAAAANgAgBAQAAOEIACAzAADjCAAgNAAA4ggAIPECAACkBQAgCMkCAADCBAAwygIAAKYCABDLAgAAwgQAMMwCAQCQBAAhzgIBAJAEACHvAgEAkAQAIfECAQCaBAAhgAMBAJAEACEDAAAANgAgAQAApQIAMDIAAKYCACADAAAANgAgAQAANwAwAgAAOAAgAQAAAC8AIAEAAAAvACADAAAAKgAgAQAALgAwAgAALwAgAwAAACoAIAEAAC4AMAIAAC8AIAMAAAAqACABAAAuADACAAAvACAOBwAAvwUAIBAAAMQGACARAADABQAgEwAAwQUAIMwCAQAAAAHNAgEAAAABzwJAAAAAAd4CAQAAAAH6AgEAAAAB-wIIAAAAAfwCAQAAAAH9AgEAAAAB_gIBAAAAAf8CAQAAAAEBJgAArgIAIArMAgEAAAABzQIBAAAAAc8CQAAAAAHeAgEAAAAB-gIBAAAAAfsCCAAAAAH8AgEAAAAB_QIBAAAAAf4CAQAAAAH_AgEAAAABASYAALACADABJgAAsAIAMAEAAAAsACABAAAAJgAgAQAAADMAIA4HAAC7BQAgEAAAwwYAIBEAALwFACATAAC9BQAgzAIBAJ4FACHNAgEAngUAIc8CQACfBQAh3gIBAJ4FACH6AgEAqgUAIfsCCAC5BQAh_AIBAJ4FACH9AgEAqgUAIf4CAQCqBQAh_wIBAKoFACECAAAALwAgJgAAtgIAIArMAgEAngUAIc0CAQCeBQAhzwJAAJ8FACHeAgEAngUAIfoCAQCqBQAh-wIIALkFACH8AgEAngUAIf0CAQCqBQAh_gIBAKoFACH_AgEAqgUAIQIAAAAqACAmAAC4AgAgAgAAACoAICYAALgCACABAAAALAAgAQAAACYAIAEAAAAzACADAAAALwAgLQAArgIAIC4AALYCACABAAAALwAgAQAAACoAIAkEAADcCAAgMwAA3wgAIDQAAN4IACCVAQAA3QgAIJYBAADgCAAg-gIAAKQFACD9AgAApAUAIP4CAACkBQAg_wIAAKQFACANyQIAAL8EADDKAgAAwgIAEMsCAAC_BAAwzAIBAJAEACHNAgEAkAQAIc8CQACRBAAh3gIBAJAEACH6AgEAmgQAIfsCCADABAAh_AIBAJAEACH9AgEAmgQAIf4CAQCaBAAh_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_ACADAAAAPQAgAQAAPgAwAgAAPwAgAwAAAD0AIAEAAD4AMAIAAD8AIAMAAAA9ACABAAA-ADACAAA_ACAHBgAA2AUAIAcAANkFACDMAgEAAAABzQIBAAAAAc4CAQAAAAHPAkAAAAAB7QICAAAAAQEmAAC8AwAgBcwCAQAAAAHNAgEAAAABzgIBAAAAAc8CQAAAAAHtAgIAAAABASYAAL4DADABJgAAvgMAMAcGAADWBQAgBwAA1wUAIMwCAQCeBQAhzQIBAJ4FACHOAgEAngUAIc8CQACfBQAh7QICAMkFACECAAAAPwAgJgAAwQMAIAXMAgEAngUAIc0CAQCeBQAhzgIBAJ4FACHPAkAAnwUAIe0CAgDJBQAhAgAAAD0AICYAAMMDACACAAAAPQAgJgAAwwMAIAMAAAA_ACAtAAC8AwAgLgAAwQMAIAEAAAA_ACABAAAAPQAgBQQAANEFACAzAADUBQAgNAAA0wUAIJUBAADSBQAglgEAANUFACAIyQIAALAEADDKAgAAygMAEMsCAACwBAAwzAIBAJAEACHNAgEAkAQAIc4CAQCQBAAhzwJAAJEEACHtAgIAqQQAIQMAAAA9ACABAADJAwAwMgAAygMAIAMAAAA9ACABAAA-ADACAAA_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_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-BAAg0AIAAAD4AgLRAgAAAPgCCNICAAAA-AII1wIAAL0E-AIiBwQAAJMEACAzAAC8BAAgNAAAvAQAINACAAAA-gIC0QIAAAD6AgjSAgAAAPoCCNcCAAC7BPoCIgcEAACTBAAgMwAAvAQAIDQAALwEACDQAgAAAPoCAtECAAAA-gII0gIAAAD6AgjXAgAAuwT6AiIE0AIAAAD6AgLRAgAAAPoCCNICAAAA-gII1wIAALwE-gIiBwQAAJMEACAzAAC-BAAgNAAAvgQAINACAAAA-AIC0QIAAAD4AgjSAgAAAPgCCNcCAAC9BPgCIgTQAgAAAPgCAtECAAAA-AII0gIAAAD4AgjXAgAAvgT4AiINyQIAAL8EADDKAgAAwgIAEMsCAAC_BAAwzAIBAJAEACHNAgEAkAQAIc8CQACRBAAh3gIBAJAEACH6AgEAmgQAIfsCCADABAAh_AIBAJAEACH9AgEAmgQAIf4CAQCaBAAh_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-QQAMMoCAAAZABDLAgAA-QQAMMwCAQDSBAAhzQIBANIEACHPAkAA0wQAIeQCQADTBAAh7wIBAN8EACHwAgEA3wQAIfECAQDfBAAh8gIBAN8EACHzAgEA3wQAIfQCAQDfBAAhsAMAABkAILEDAAAZACADqwMAAD0AIKwDAAA9ACCtAwAAPQAgA6sDAAAQACCsAwAAEAAgrQMAABAAIAOrAwAAXQAgrAMAAF0AIK0DAABdACADqwMAACwAIKwDAAAsACCtAwAALAAgA6sDAAAmACCsAwAAJgAgrQMAACYAIAOrAwAAMwAgrAMAADMAIK0DAAAzACADqwMAAGcAIKwDAABnACCtAwAAZwAgEQMAAPAEACAHAADiBAAgCgAA7gQAIAwAAO8EACDJAgAA-QQAMMoCAAAZABDLAgAA-QQAMMwCAQDSBAAhzQIBANIEACHPAkAA0wQAIeQCQADTBAAh7wIBAN8EACHwAgEA3wQAIfECAQDfBAAh8gIBAN8EACHzAgEA3wQAIfQCAQDfBAAhAs0CAQAAAAHOAgEAAAABCgYAAP0EACAHAADiBAAgyQIAAPsEADDKAgAAPQAQywIAAPsEADDMAgEA0gQAIc0CAQDSBAAhzgIBANIEACHPAkAA0wQAIe0CAgD8BAAhCNACAgAAAAHRAgIAAAAE0gICAAAABNMCAgAAAAHUAgIAAAAB1QICAAAAAdYCAgAAAAHXAgIAkwQAIScFAACUBQAgCAAA8wQAIAkAAOwEACANAADuBAAgDgAA7wQAIBQAAPYEACAVAACVBQAgFgAA9wQAIBcAAPIEACAYAACWBQAgGQAAlwUAIMkCAACPBQAwygIAAAsAEMsCAACPBQAwzAIBANIEACHPAkAA0wQAIeQCQADTBAAh-AIBANIEACGBAwEA0gQAIYIDAQDSBAAhgwMBANIEACGEAwIA_AQAIYUDAQDSBAAhhgMBAN8EACGHAwEA3wQAIYgDAQDfBAAhiQMBAN8EACGKAxAAkAUAIYsDEACQBQAhjAMCAJEFACGNAwIAkQUAIY8DAACSBY8DIpADIADgBAAhkQMgAOAEACGSAwgAkwUAIZMDAgD8BAAhlAMCAPwEACGwAwAACwAgsQMAAAsAIA0GAAD9BAAgBwAA4gQAIBIAAIAFACDJAgAA_gQAMMoCAAAzABDLAgAA_gQAMMwCAQDSBAAhzQIBANIEACHOAgEA0gQAIc8CQADTBAAh3gIAAP8E9gIi5AJAANMEACH2AkAA0wQAIQTQAgAAAPYCAtECAAAA9gII0gIAAAD2AgjXAgAAtwT2AiITBwAA4gQAIBAAAIQFACARAACFBQAgEwAAhgUAIMkCAACCBQAwygIAACoAEMsCAACCBQAwzAIBANIEACHNAgEA0gQAIc8CQADTBAAh3gIBANIEACH6AgEA3wQAIfsCCACDBQAh_AIBANIEACH9AgEA3wQAIf4CAQDfBAAh_wIBAN8EACGwAwAAKgAgsQMAACoAIAkGAAD9BAAgyQIAAIEFADDKAgAANgAQywIAAIEFADDMAgEA0gQAIc4CAQDSBAAh7wIBANIEACHxAgEA3wQAIYADAQDSBAAhEQcAAOIEACAQAACEBQAgEQAAhQUAIBMAAIYFACDJAgAAggUAMMoCAAAqABDLAgAAggUAMMwCAQDSBAAhzQIBANIEACHPAkAA0wQAId4CAQDSBAAh-gIBAN8EACH7AggAgwUAIfwCAQDSBAAh_QIBAN8EACH-AgEA3wQAIf8CAQDfBAAhCNACCAAAAAHRAggAAAAE0gIIAAAABNMCCAAAAAHUAggAAAAB1QIIAAAAAdYCCAAAAAHXAggArwQAIRIHAADiBAAgDwAA5gQAIMkCAADjBAAwygIAACwAEMsCAADjBAAwzAIBANIEACHNAgEA0gQAIc8CQADTBAAh3AIAAOQE3AIi3gIAAOUE3gIi3wIBAN8EACHgAgEA3wQAIeECQADhBAAh4gJAAOEEACHjAiAA4AQAIeQCQADTBAAhsAMAACwAILEDAAAsACAQBgAA_QQAIAcAAOIEACASAACABQAgyQIAAIcFADDKAgAAJgAQywIAAIcFADDMAgEA0gQAIc0CAQDSBAAhzgIBANIEACHPAkAA0wQAId4CAACJBfoCIuQCQADTBAAh9gJAAOEEACH4AgAAiAX4AiKwAwAAJgAgsQMAACYAIA8GAAD9BAAgBwAA4gQAIBIAAIAFACDJAgAA_gQAMMoCAAAzABDLAgAA_gQAMMwCAQDSBAAhzQIBANIEACHOAgEA0gQAIc8CQADTBAAh3gIAAP8E9gIi5AJAANMEACH2AkAA0wQAIbADAAAzACCxAwAAMwAgDgYAAP0EACAHAADiBAAgEgAAgAUAIMkCAACHBQAwygIAACYAEMsCAACHBQAwzAIBANIEACHNAgEA0gQAIc4CAQDSBAAhzwJAANMEACHeAgAAiQX6AiLkAkAA0wQAIfYCQADhBAAh-AIAAIgF-AIiBNACAAAA-AIC0QIAAAD4AgjSAgAAAPgCCNcCAAC-BPgCIgTQAgAAAPoCAtECAAAA-gII0gIAAAD6AgjXAgAAvAT6AiIMBgAA_QQAIAcAAOIEACALAADxBAAgyQIAAIoFADDKAgAAHAAQywIAAIoFADDMAgEA0gQAIc0CAQDSBAAhzgIBANIEACHPAkAA0wQAIeQCQADTBAAh7gIBAN8EACEMBgAA_QQAIAcAAOIEACALAADxBAAgyQIAAIsFADDKAgAAFQAQywIAAIsFADDMAgEA0gQAIc0CAQDSBAAhzgIBANIEACHPAkAA0wQAIeQCQADTBAAh7gIBAN8EACEPBgAA_QQAIAcAAOIEACDJAgAAjAUAMMoCAAAQABDLAgAAjAUAMMwCAQDSBAAhzQIBANIEACHOAgEA0gQAIc8CQADTBAAh3gIAAI0F6AIi5AJAANMEACHlAgEA0gQAIeYCAgD8BAAh6AIAAKsEACDpAiAA4AQAIQTQAgAAAOgCAtECAAAA6AII0gIAAADoAgjXAgAArQToAiICgQMBAAAAAYQDAgAAAAElBQAAlAUAIAgAAPMEACAJAADsBAAgDQAA7gQAIA4AAO8EACAUAAD2BAAgFQAAlQUAIBYAAPcEACAXAADyBAAgGAAAlgUAIBkAAJcFACDJAgAAjwUAMMoCAAALABDLAgAAjwUAMMwCAQDSBAAhzwJAANMEACHkAkAA0wQAIfgCAQDSBAAhgQMBANIEACGCAwEA0gQAIYMDAQDSBAAhhAMCAPwEACGFAwEA0gQAIYYDAQDfBAAhhwMBAN8EACGIAwEA3wQAIYkDAQDfBAAhigMQAJAFACGLAxAAkAUAIYwDAgCRBQAhjQMCAJEFACGPAwAAkgWPAyKQAyAA4AQAIZEDIADgBAAhkgMIAJMFACGTAwIA_AQAIZQDAgD8BAAhCNACEAAAAAHRAhAAAAAF0gIQAAAABdMCEAAAAAHUAhAAAAAB1QIQAAAAAdYCEAAAAAHXAhAAzgQAIQjQAgIAAAAB0QICAAAABdICAgAAAAXTAgIAAAAB1AICAAAAAdUCAgAAAAHWAgIAAAAB1wICAKAEACEE0AIAAACPAwLRAgAAAI8DCNICAAAAjwMI1wIAAMsEjwMiCNACCAAAAAHRAggAAAAF0gIIAAAABdMCCAAAAAHUAggAAAAB1QIIAAAAAdYCCAAAAAHXAggAyQQAIQOrAwAABwAgrAMAAAcAIK0DAAAHACADqwMAADYAIKwDAAA2ACCtAwAANgAgA6sDAAAZACCsAwAAGQAgrQMAABkAIAOrAwAARAAgrAMAAEQAIK0DAABEACAGAwAA8AQAIMkCAACYBQAwygIAAAcAEMsCAACYBQAwzAIBANIEACHvAgEA0gQAIQLNAgEAAAABzgIBAAAAAQkGAAD9BAAgBwAA4gQAIMkCAACaBQAwygIAAAMAEMsCAACaBQAwzAIBANIEACHNAgEA0gQAIc4CAQDSBAAhzwJAANMEACEAAAABtQMBAAAAAQG1A0AAAAABBS0AAM0KACAuAADTCgAgsgMAAM4KACCzAwAA0goAILgDAAANACAFLQAAywoAIC4AANAKACCyAwAAzAoAILMDAADPCgAguAMAAEYAIAMtAADNCgAgsgMAAM4KACC4AwAADQAgAy0AAMsKACCyAwAAzAoAILgDAABGACAAAAAAAbUDAAAA3AICAbUDAAAA3gICAbUDAQAAAAEBtQNAAAAAAQG1AyAAAAABBS0AALYKACAuAADJCgAgsgMAALcKACCzAwAAyAoAILgDAABGACALLQAArwUAMC4AALQFADCyAwAAsAUAMLMDAACxBQAwtAMAALIFACC1AwAAswUAMLYDAACzBQAwtwMAALMFADC4AwAAswUAMLkDAAC1BQAwugMAALYFADAMBwAAvwUAIBEAAMAFACATAADBBQAgzAIBAAAAAc0CAQAAAAHPAkAAAAAB3gIBAAAAAfsCCAAAAAH8AgEAAAAB_QIBAAAAAf4CAQAAAAH_AgEAAAABAgAAAC8AIC0AAL4FACADAAAALwAgLQAAvgUAIC4AALoFACABJgAAxwoAMBEHAADiBAAgEAAAhAUAIBEAAIUFACATAACGBQAgyQIAAIIFADDKAgAAKgAQywIAAIIFADDMAgEAAAABzQIBANIEACHPAkAA0wQAId4CAQDSBAAh-gIBAN8EACH7AggAgwUAIfwCAQDSBAAh_QIBAAAAAf4CAQAAAAH_AgEAAAABAgAAAC8AICYAALoFACACAAAAtwUAICYAALgFACANyQIAALYFADDKAgAAtwUAEMsCAAC2BQAwzAIBANIEACHNAgEA0gQAIc8CQADTBAAh3gIBANIEACH6AgEA3wQAIfsCCACDBQAh_AIBANIEACH9AgEA3wQAIf4CAQDfBAAh_wIBAN8EACENyQIAALYFADDKAgAAtwUAEMsCAAC2BQAwzAIBANIEACHNAgEA0gQAIc8CQADTBAAh3gIBANIEACH6AgEA3wQAIfsCCACDBQAh_AIBANIEACH9AgEA3wQAIf4CAQDfBAAh_wIBAN8EACEJzAIBAJ4FACHNAgEAngUAIc8CQACfBQAh3gIBAJ4FACH7AggAuQUAIfwCAQCeBQAh_QIBAKoFACH-AgEAqgUAIf8CAQCqBQAhBbUDCAAAAAG7AwgAAAABvAMIAAAAAb0DCAAAAAG-AwgAAAABDAcAALsFACARAAC8BQAgEwAAvQUAIMwCAQCeBQAhzQIBAJ4FACHPAkAAnwUAId4CAQCeBQAh-wIIALkFACH8AgEAngUAIf0CAQCqBQAh_gIBAKoFACH_AgEAqgUAIQUtAAC8CgAgLgAAxQoAILIDAAC9CgAgswMAAMQKACC4AwAARgAgBy0AALoKACAuAADCCgAgsgMAALsKACCzAwAAwQoAILYDAAAmACC3AwAAJgAguAMAACgAIActAAC4CgAgLgAAvwoAILIDAAC5CgAgswMAAL4KACC2AwAAMwAgtwMAADMAILgDAAA7ACAMBwAAvwUAIBEAAMAFACATAADBBQAgzAIBAAAAAc0CAQAAAAHPAkAAAAAB3gIBAAAAAfsCCAAAAAH8AgEAAAAB_QIBAAAAAf4CAQAAAAH_AgEAAAABAy0AALwKACCyAwAAvQoAILgDAABGACADLQAAugoAILIDAAC7CgAguAMAACgAIAMtAAC4CgAgsgMAALkKACC4AwAAOwAgAy0AALYKACCyAwAAtwoAILgDAABGACAELQAArwUAMLIDAACwBQAwtAMAALIFACC4AwAAswUAMAAAAAAABbUDAgAAAAG7AwIAAAABvAMCAAAAAb0DAgAAAAG-AwIAAAABAbUDAAAA6AICArUDAQAAAAS_AwEAAAAFBS0AAK4KACAuAAC0CgAgsgMAAK8KACCzAwAAswoAILgDAAANACAFLQAArAoAIC4AALEKACCyAwAArQoAILMDAACwCgAguAMAAEYAIAG1AwEAAAAEAy0AAK4KACCyAwAArwoAILgDAAANACADLQAArAoAILIDAACtCgAguAMAAEYAIAAAAAAABS0AAKQKACAuAACqCgAgsgMAAKUKACCzAwAAqQoAILgDAAANACAFLQAAogoAIC4AAKcKACCyAwAAowoAILMDAACmCgAguAMAAEYAIAMtAACkCgAgsgMAAKUKACC4AwAADQAgAy0AAKIKACCyAwAAowoAILgDAABGACAAAAAFLQAAlwoAIC4AAKAKACCyAwAAmAoAILMDAACfCgAguAMAAA0AIActAACVCgAgLgAAnQoAILIDAACWCgAgswMAAJwKACC2AwAAGQAgtwMAABkAILgDAABCACAFLQAAkwoAIC4AAJoKACCyAwAAlAoAILMDAACZCgAguAMAAEYAIAMtAACXCgAgsgMAAJgKACC4AwAADQAgAy0AAJUKACCyAwAAlgoAILgDAABCACADLQAAkwoAILIDAACUCgAguAMAAEYAIAAAAAUtAACICgAgLgAAkQoAILIDAACJCgAgswMAAJAKACC4AwAADQAgBy0AAIYKACAuAACOCgAgsgMAAIcKACCzAwAAjQoAILYDAAAZACC3AwAAGQAguAMAAEIAIAUtAACECgAgLgAAiwoAILIDAACFCgAgswMAAIoKACC4AwAARgAgAy0AAIgKACCyAwAAiQoAILgDAAANACADLQAAhgoAILIDAACHCgAguAMAAEIAIAMtAACECgAgsgMAAIUKACC4AwAARgAgAAAACy0AAKUHADAuAADRCAAwsgMAAKYHADCzAwAA0AgAMLQDAACnBwAgtQMAAKgHADC2AwAAqAcAMLcDAACoBwAwuAMAAKgHADC5AwAA0ggAMLoDAAC7BwAwCy0AAKAHADAuAADMCAAwsgMAAKEHADCzAwAAywgAMLQDAACiBwAgtQMAAKMHADC2AwAAowcAMLcDAACjBwAwuAMAAKMHADC5AwAAzQgAMLoDAACwBwAwBS0AANAJACAuAACCCgAgsgMAANEJACCzAwAAgQoAILgDAABGACAKLQAA8wUAMC4AAPcFADCyAwAA9AUAMLMDAAD1BQAwtQMAAPYFADC2AwAA9gUAMLcDAAD2BQAwuAMAAPYFADC5AwAA-AUAMLoDAAD5BQAwIQUAAMEIACAIAADCCAAgCQAAwwgAIA0AAMQIACAOAADFCAAgFAAAxggAIBUAAMcIACAWAADICAAgFwAAyQgAIBkAAMoIACDMAgEAAAABzwJAAAAAAeQCQAAAAAH4AgEAAAABgQMBAAAAAYIDAQAAAAGDAwEAAAABhAMCAAAAAYUDAQAAAAGGAwEAAAABhwMBAAAAAYgDAQAAAAGJAwEAAAABigMQAAAAAYsDEAAAAAGMAwIAAAABjQMCAAAAAY8DAAAAjwMCkAMgAAAAAZEDIAAAAAGSAwgAAAABkwMCAAAAAZQDAgAAAAECAAAADQAgLQAAwAgAIAMAAAANACAtAADACAAgLgAAgAYAICYFAACUBQAgCAAA8wQAIAkAAOwEACANAADuBAAgDgAA7wQAIBQAAPYEACAVAACVBQAgFgAA9wQAIBcAAPIEACAYAACWBQAgGQAAlwUAIMkCAACPBQAwygIAAAsAEMsCAACPBQAwzAIBAAAAAc8CQADTBAAh5AJAANMEACH4AgEA0gQAIYEDAQDSBAAhggMBAAAAAYMDAQDSBAAhhAMCAPwEACGFAwEA0gQAIYYDAQDfBAAhhwMBAN8EACGIAwEA3wQAIYkDAQDfBAAhigMQAJAFACGLAxAAkAUAIYwDAgCRBQAhjQMCAJEFACGPAwAAkgWPAyKQAyAA4AQAIZEDIADgBAAhkgMIAJMFACGTAwIA_AQAIZQDAgD8BAAhrwMAAI4FACACAAAADQAgJgAAgAYAIAIAAAD6BQAgJgAA-wUAIBrJAgAA-QUAMMoCAAD6BQAQywIAAPkFADDMAgEA0gQAIc8CQADTBAAh5AJAANMEACH4AgEA0gQAIYEDAQDSBAAhggMBANIEACGDAwEA0gQAIYQDAgD8BAAhhQMBANIEACGGAwEA3wQAIYcDAQDfBAAhiAMBAN8EACGJAwEA3wQAIYoDEACQBQAhiwMQAJAFACGMAwIAkQUAIY0DAgCRBQAhjwMAAJIFjwMikAMgAOAEACGRAyAA4AQAIZIDCACTBQAhkwMCAPwEACGUAwIA_AQAIRrJAgAA-QUAMMoCAAD6BQAQywIAAPkFADDMAgEA0gQAIc8CQADTBAAh5AJAANMEACH4AgEA0gQAIYEDAQDSBAAhggMBANIEACGDAwEA0gQAIYQDAgD8BAAhhQMBANIEACGGAwEA3wQAIYcDAQDfBAAhiAMBAN8EACGJAwEA3wQAIYoDEACQBQAhiwMQAJAFACGMAwIAkQUAIY0DAgCRBQAhjwMAAJIFjwMikAMgAOAEACGRAyAA4AQAIZIDCACTBQAhkwMCAPwEACGUAwIA_AQAIRfMAgEAngUAIc8CQACfBQAh5AJAAJ8FACH4AgEAngUAIYEDAQCeBQAhggMBAJ4FACGDAwEAngUAIYQDAgDJBQAhhQMBAJ4FACGGAwEAqgUAIYcDAQCqBQAhiAMBAKoFACGJAwEAqgUAIYoDEAD8BQAhiwMQAPwFACGMAwIA_QUAIY0DAgD9BQAhjwMAAP4FjwMikAMgAKwFACGRAyAArAUAIZIDCAD_BQAhkwMCAMkFACGUAwIAyQUAIQW1AxAAAAABuwMQAAAAAbwDEAAAAAG9AxAAAAABvgMQAAAAAQW1AwIAAAABuwMCAAAAAbwDAgAAAAG9AwIAAAABvgMCAAAAAQG1AwAAAI8DAgW1AwgAAAABuwMIAAAAAbwDCAAAAAG9AwgAAAABvgMIAAAAASEFAACBBgAgCAAAggYAIAkAAIMGACANAACEBgAgDgAAhQYAIBQAAIYGACAVAACHBgAgFgAAiAYAIBcAAIkGACAZAACKBgAgzAIBAJ4FACHPAkAAnwUAIeQCQACfBQAh-AIBAJ4FACGBAwEAngUAIYIDAQCeBQAhgwMBAJ4FACGEAwIAyQUAIYUDAQCeBQAhhgMBAKoFACGHAwEAqgUAIYgDAQCqBQAhiQMBAKoFACGKAxAA_AUAIYsDEAD8BQAhjAMCAP0FACGNAwIA_QUAIY8DAAD-BY8DIpADIACsBQAhkQMgAKwFACGSAwgA_wUAIZMDAgDJBQAhlAMCAMkFACEKLQAAtQgAMC4AALkIADCyAwAAtggAMLMDAAC3CAAwtQMAALgIADC2AwAAuAgAMLcDAAC4CAAwuAMAALgIADC5AwAAuggAMLoDAAC7CAAwCy0AAKwIADAuAACwCAAwsgMAAK0IADCzAwAArggAMLQDAACvCAAgtQMAAIQHADC2AwAAhAcAMLcDAACEBwAwuAMAAIQHADC5AwAAsQgAMLoDAACHBwAwCy0AAKMIADAuAACnCAAwsgMAAKQIADCzAwAApQgAMLQDAACmCAAgtQMAANAHADC2AwAA0AcAMLcDAADQBwAwuAMAANAHADC5AwAAqAgAMLoDAADTBwAwCy0AAJoIADAuAACeCAAwsgMAAJsIADCzAwAAnAgAMLQDAACdCAAgtQMAAKgHADC2AwAAqAcAMLcDAACoBwAwuAMAAKgHADC5AwAAnwgAMLoDAAC7BwAwCy0AAJEIADAuAACVCAAwsgMAAJIIADCzAwAAkwgAMLQDAACUCAAgtQMAAKMHADC2AwAAowcAMLcDAACjBwAwuAMAAKMHADC5AwAAlggAMLoDAACwBwAwCy0AAIYIADAuAACKCAAwsgMAAIcIADCzAwAAiAgAMLQDAACJCAAgtQMAAMwGADC2AwAAzAYAMLcDAADMBgAwuAMAAMwGADC5AwAAiwgAMLoDAADPBgAwCy0AAPoHADAuAAD_BwAwsgMAAPsHADCzAwAA_AcAMLQDAAD9BwAgtQMAAP4HADC2AwAA_gcAMLcDAAD-BwAwuAMAAP4HADC5AwAAgAgAMLoDAACBCAAwCy0AAO8HADAuAADzBwAwsgMAAPAHADCzAwAA8QcAMLQDAADyBwAgtQMAALQGADC2AwAAtAYAMLcDAAC0BgAwuAMAALQGADC5AwAA9AcAMLoDAAC3BgAwCy0AAOYHADAuAADqBwAwsgMAAOcHADCzAwAA6AcAMLQDAADpBwAgtQMAAJAHADC2AwAAkAcAMLcDAACQBwAwuAMAAJAHADC5AwAA6wcAMLoDAACTBwAwCi0AAIsGADAuAACPBgAwsgMAAIwGADCzAwAAjQYAMLUDAACOBgAwtgMAAI4GADC3AwAAjgYAMLgDAACOBgAwuQMAAJAGADC6AwAAkQYAMBkIAADfBwAgCwAA3QcAIA0AANsHACAOAADcBwAgDwAA4QcAIBYAAOQHACAXAADeBwAgGgAA2QcAIBsAANoHACAdAADgBwAgHgAA4gcAIB8AAOMHACAgAADlBwAgzAIBAAAAAc8CQAAAAAHeAgAAAKYDAuQCQAAAAAHvAgEAAAAB8AIBAAAAAfECAQAAAAGAAwAAAKUDAqMDIAAAAAGmAyAAAAABpwMgAAAAAagDQAAAAAECAAAARgAgLQAA2AcAIAMAAABGACAtAADYBwAgLgAAlgYAIB0IAADzBAAgCwAA8QQAIA0AAO4EACAOAADvBAAgDwAA5gQAIBYAAPcEACAXAADyBAAgGgAA7AQAIBsAAO0EACAcAADwBAAgHQAA9AQAIB4AAPUEACAfAAD2BAAgIAAA-AQAIMkCAADpBAAwygIAAEQAEMsCAADpBAAwzAIBAAAAAc8CQADTBAAh3gIAAOsEpgMi5AJAANMEACHvAgEA0gQAIfACAQAAAAHxAgEA3wQAIYADAADqBKUDIqMDIADgBAAhpgMgAOAEACGnAyAA4AQAIagDQADhBAAhAgAAAEYAICYAAJYGACACAAAAkgYAICYAAJMGACAPyQIAAJEGADDKAgAAkgYAEMsCAACRBgAwzAIBANIEACHPAkAA0wQAId4CAADrBKYDIuQCQADTBAAh7wIBANIEACHwAgEA0gQAIfECAQDfBAAhgAMAAOoEpQMiowMgAOAEACGmAyAA4AQAIacDIADgBAAhqANAAOEEACEPyQIAAJEGADDKAgAAkgYAEMsCAACRBgAwzAIBANIEACHPAkAA0wQAId4CAADrBKYDIuQCQADTBAAh7wIBANIEACHwAgEA0gQAIfECAQDfBAAhgAMAAOoEpQMiowMgAOAEACGmAyAA4AQAIacDIADgBAAhqANAAOEEACEMzAIBAJ4FACHPAkAAnwUAId4CAACVBqYDIuQCQACfBQAh7wIBAJ4FACHwAgEAngUAIfECAQCqBQAhgAMAAJQGpQMiowMgAKwFACGmAyAArAUAIacDIACsBQAhqANAAKsFACEBtQMAAAClAwIBtQMAAACmAwIZCAAAnQYAIAsAAJsGACANAACZBgAgDgAAmgYAIA8AAJ8GACAWAACiBgAgFwAAnAYAIBoAAJcGACAbAACYBgAgHQAAngYAIB4AAKAGACAfAAChBgAgIAAAowYAIMwCAQCeBQAhzwJAAJ8FACHeAgAAlQamAyLkAkAAnwUAIe8CAQCeBQAh8AIBAJ4FACHxAgEAqgUAIYADAACUBqUDIqMDIACsBQAhpgMgAKwFACGnAyAArAUAIagDQACrBQAhCy0AAMwHADAuAADRBwAwsgMAAM0HADCzAwAAzgcAMLQDAADPBwAgtQMAANAHADC2AwAA0AcAMLcDAADQBwAwuAMAANAHADC5AwAA0gcAMLoDAADTBwAwCy0AAMAHADAuAADFBwAwsgMAAMEHADCzAwAAwgcAMLQDAADDBwAgtQMAAMQHADC2AwAAxAcAMLcDAADEBwAwuAMAAMQHADC5AwAAxgcAMLoDAADHBwAwCy0AALUHADAuAAC5BwAwsgMAALYHADCzAwAAtwcAMLQDAAC4BwAgtQMAAKgHADC2AwAAqAcAMLcDAACoBwAwuAMAAKgHADC5AwAAugcAMLoDAAC7BwAwCy0AAKoHADAuAACuBwAwsgMAAKsHADCzAwAArAcAMLQDAACtBwAgtQMAAKMHADC2AwAAowcAMLcDAACjBwAwuAMAAKMHADC5AwAArwcAMLoDAACwBwAwBy0AAJgHACAuAACbBwAgsgMAAJkHACCzAwAAmgcAILYDAAAZACC3AwAAGQAguAMAAEIAIAstAACMBwAwLgAAkQcAMLIDAACNBwAwswMAAI4HADC0AwAAjwcAILUDAACQBwAwtgMAAJAHADC3AwAAkAcAMLgDAACQBwAwuQMAAJIHADC6AwAAkwcAMAstAACABwAwLgAAhQcAMLIDAACBBwAwswMAAIIHADC0AwAAgwcAILUDAACEBwAwtgMAAIQHADC3AwAAhAcAMLgDAACEBwAwuQMAAIYHADC6AwAAhwcAMAstAAD0BgAwLgAA-QYAMLIDAAD1BgAwswMAAPYGADC0AwAA9wYAILUDAAD4BgAwtgMAAPgGADC3AwAA-AYAMLgDAAD4BgAwuQMAAPoGADC6AwAA-wYAMAstAADrBgAwLgAA7wYAMLIDAADsBgAwswMAAO0GADC0AwAA7gYAILUDAACzBQAwtgMAALMFADC3AwAAswUAMLgDAACzBQAwuQMAAPAGADC6AwAAtgUAMAstAADfBgAwLgAA5AYAMLIDAADgBgAwswMAAOEGADC0AwAA4gYAILUDAADjBgAwtgMAAOMGADC3AwAA4wYAMLgDAADjBgAwuQMAAOUGADC6AwAA5gYAMAstAADIBgAwLgAAzQYAMLIDAADJBgAwswMAAMoGADC0AwAAywYAILUDAADMBgAwtgMAAMwGADC3AwAAzAYAMLgDAADMBgAwuQMAAM4GADC6AwAAzwYAMAstAACwBgAwLgAAtQYAMLIDAACxBgAwswMAALIGADC0AwAAswYAILUDAAC0BgAwtgMAALQGADC3AwAAtAYAMLgDAAC0BgAwuQMAALYGADC6AwAAtwYAMAstAACkBgAwLgAAqQYAMLIDAAClBgAwswMAAKYGADC0AwAApwYAILUDAACoBgAwtgMAAKgGADC3AwAAqAYAMLgDAACoBgAwuQMAAKoGADC6AwAAqwYAMAnMAgEAAAABzwJAAAAAAeQCQAAAAAHvAgEAAAAB8AIBAAAAAacDIAAAAAGoA0AAAAABqQMBAAAAAaoDAQAAAAECAAAAAQAgLQAArwYAIAMAAAABACAtAACvBgAgLgAArgYAIAEmAACACgAwDgcAAOIEACDJAgAA3gQAMMoCAABnABDLAgAA3gQAMMwCAQAAAAHNAgEAAAABzwJAANMEACHkAkAA0wQAIe8CAQDSBAAh8AIBAAAAAacDIADgBAAhqANAAOEEACGpAwEA3wQAIaoDAQDfBAAhAgAAAAEAICYAAK4GACACAAAArAYAICYAAK0GACANyQIAAKsGADDKAgAArAYAEMsCAACrBgAwzAIBANIEACHNAgEA0gQAIc8CQADTBAAh5AJAANMEACHvAgEA0gQAIfACAQDSBAAhpwMgAOAEACGoA0AA4QQAIakDAQDfBAAhqgMBAN8EACENyQIAAKsGADDKAgAArAYAEMsCAACrBgAwzAIBANIEACHNAgEA0gQAIc8CQADTBAAh5AJAANMEACHvAgEA0gQAIfACAQDSBAAhpwMgAOAEACGoA0AA4QQAIakDAQDfBAAhqgMBAN8EACEJzAIBAJ4FACHPAkAAnwUAIeQCQACfBQAh7wIBAJ4FACHwAgEAngUAIacDIACsBQAhqANAAKsFACGpAwEAqgUAIaoDAQCqBQAhCcwCAQCeBQAhzwJAAJ8FACHkAkAAnwUAIe8CAQCeBQAh8AIBAJ4FACGnAyAArAUAIagDQACrBQAhqQMBAKoFACGqAwEAqgUAIQnMAgEAAAABzwJAAAAAAeQCQAAAAAHvAgEAAAAB8AIBAAAAAacDIAAAAAGoA0AAAAABqQMBAAAAAaoDAQAAAAEIBgAAxgYAIBIAAMcGACDMAgEAAAABzgIBAAAAAc8CQAAAAAHeAgAAAPYCAuQCQAAAAAH2AkAAAAABAgAAADsAIC0AAMUGACADAAAAOwAgLQAAxQYAIC4AALsGACABJgAA_wkAMA0GAAD9BAAgBwAA4gQAIBIAAIAFACDJAgAA_gQAMMoCAAAzABDLAgAA_gQAMMwCAQAAAAHNAgEA0gQAIc4CAQDSBAAhzwJAANMEACHeAgAA_wT2AiLkAkAA0wQAIfYCQADTBAAhAgAAADsAICYAALsGACACAAAAuAYAICYAALkGACAKyQIAALcGADDKAgAAuAYAEMsCAAC3BgAwzAIBANIEACHNAgEA0gQAIc4CAQDSBAAhzwJAANMEACHeAgAA_wT2AiLkAkAA0wQAIfYCQADTBAAhCskCAAC3BgAwygIAALgGABDLAgAAtwYAMMwCAQDSBAAhzQIBANIEACHOAgEA0gQAIc8CQADTBAAh3gIAAP8E9gIi5AJAANMEACH2AkAA0wQAIQbMAgEAngUAIc4CAQCeBQAhzwJAAJ8FACHeAgAAugb2AiLkAkAAnwUAIfYCQACfBQAhAbUDAAAA9gICCAYAALwGACASAAC9BgAgzAIBAJ4FACHOAgEAngUAIc8CQACfBQAh3gIAALoG9gIi5AJAAJ8FACH2AkAAnwUAIQUtAAD1CQAgLgAA_QkAILIDAAD2CQAgswMAAPwJACC4AwAADQAgBy0AAL4GACAuAADBBgAgsgMAAL8GACCzAwAAwAYAILYDAAAqACC3AwAAKgAguAMAAC8AIAwHAAC_BQAgEAAAxAYAIBEAAMAFACDMAgEAAAABzQIBAAAAAc8CQAAAAAHeAgEAAAAB-gIBAAAAAfsCCAAAAAH8AgEAAAAB_QIBAAAAAf4CAQAAAAECAAAALwAgLQAAvgYAIAMAAAAqACAtAAC-BgAgLgAAwgYAIA4AAAAqACAHAAC7BQAgEAAAwwYAIBEAALwFACAmAADCBgAgzAIBAJ4FACHNAgEAngUAIc8CQACfBQAh3gIBAJ4FACH6AgEAqgUAIfsCCAC5BQAh_AIBAJ4FACH9AgEAqgUAIf4CAQCqBQAhDAcAALsFACAQAADDBgAgEQAAvAUAIMwCAQCeBQAhzQIBAJ4FACHPAkAAnwUAId4CAQCeBQAh-gIBAKoFACH7AggAuQUAIfwCAQCeBQAh_QIBAKoFACH-AgEAqgUAIQctAAD3CQAgLgAA-gkAILIDAAD4CQAgswMAAPkJACC2AwAALAAgtwMAACwAILgDAABjACADLQAA9wkAILIDAAD4CQAguAMAAGMAIAgGAADGBgAgEgAAxwYAIMwCAQAAAAHOAgEAAAABzwJAAAAAAd4CAAAA9gIC5AJAAAAAAfYCQAAAAAEDLQAA9QkAILIDAAD2CQAguAMAAA0AIAMtAAC-BgAgsgMAAL8GACC4AwAALwAgCQYAAN0GACASAADeBgAgzAIBAAAAAc4CAQAAAAHPAkAAAAAB3gIAAAD6AgLkAkAAAAAB9gJAAAAAAfgCAAAA-AICAgAAACgAIC0AANwGACADAAAAKAAgLQAA3AYAIC4AANQGACABJgAA9AkAMA4GAAD9BAAgBwAA4gQAIBIAAIAFACDJAgAAhwUAMMoCAAAmABDLAgAAhwUAMMwCAQAAAAHNAgEA0gQAIc4CAQDSBAAhzwJAANMEACHeAgAAiQX6AiLkAkAA0wQAIfYCQADhBAAh-AIAAIgF-AIiAgAAACgAICYAANQGACACAAAA0AYAICYAANEGACALyQIAAM8GADDKAgAA0AYAEMsCAADPBgAwzAIBANIEACHNAgEA0gQAIc4CAQDSBAAhzwJAANMEACHeAgAAiQX6AiLkAkAA0wQAIfYCQADhBAAh-AIAAIgF-AIiC8kCAADPBgAwygIAANAGABDLAgAAzwYAMMwCAQDSBAAhzQIBANIEACHOAgEA0gQAIc8CQADTBAAh3gIAAIkF-gIi5AJAANMEACH2AkAA4QQAIfgCAACIBfgCIgfMAgEAngUAIc4CAQCeBQAhzwJAAJ8FACHeAgAA0wb6AiLkAkAAnwUAIfYCQACrBQAh-AIAANIG-AIiAbUDAAAA-AICAbUDAAAA-gICCQYAANUGACASAADWBgAgzAIBAJ4FACHOAgEAngUAIc8CQACfBQAh3gIAANMG-gIi5AJAAJ8FACH2AkAAqwUAIfgCAADSBvgCIgUtAADvCQAgLgAA8gkAILIDAADwCQAgswMAAPEJACC4AwAADQAgBy0AANcGACAuAADaBgAgsgMAANgGACCzAwAA2QYAILYDAAAqACC3AwAAKgAguAMAAC8AIAwHAAC_BQAgEAAAxAYAIBMAAMEFACDMAgEAAAABzQIBAAAAAc8CQAAAAAHeAgEAAAAB-gIBAAAAAfsCCAAAAAH8AgEAAAAB_QIBAAAAAf8CAQAAAAECAAAALwAgLQAA1wYAIAMAAAAqACAtAADXBgAgLgAA2wYAIA4AAAAqACAHAAC7BQAgEAAAwwYAIBMAAL0FACAmAADbBgAgzAIBAJ4FACHNAgEAngUAIc8CQACfBQAh3gIBAJ4FACH6AgEAqgUAIfsCCAC5BQAh_AIBAJ4FACH9AgEAqgUAIf8CAQCqBQAhDAcAALsFACAQAADDBgAgEwAAvQUAIMwCAQCeBQAhzQIBAJ4FACHPAkAAnwUAId4CAQCeBQAh-gIBAKoFACH7AggAuQUAIfwCAQCeBQAh_QIBAKoFACH_AgEAqgUAIQkGAADdBgAgEgAA3gYAIMwCAQAAAAHOAgEAAAABzwJAAAAAAd4CAAAA-gIC5AJAAAAAAfYCQAAAAAH4AgAAAPgCAgMtAADvCQAgsgMAAPAJACC4AwAADQAgAy0AANcGACCyAwAA2AYAILgDAAAvACALDwAAwwUAIMwCAQAAAAHPAkAAAAAB3AIAAADcAgLeAgAAAN4CAt8CAQAAAAHgAgEAAAAB4QJAAAAAAeICQAAAAAHjAiAAAAAB5AJAAAAAAQIAAABjACAtAADqBgAgAwAAAGMAIC0AAOoGACAuAADpBgAgASYAAO4JADAQBwAA4gQAIA8AAOYEACDJAgAA4wQAMMoCAAAsABDLAgAA4wQAMMwCAQAAAAHNAgEAAAABzwJAANMEACHcAgAA5ATcAiLeAgAA5QTeAiLfAgEAAAAB4AIBAN8EACHhAkAA4QQAIeICQADhBAAh4wIgAOAEACHkAkAA0wQAIQIAAABjACAmAADpBgAgAgAAAOcGACAmAADoBgAgDskCAADmBgAwygIAAOcGABDLAgAA5gYAMMwCAQDSBAAhzQIBANIEACHPAkAA0wQAIdwCAADkBNwCIt4CAADlBN4CIt8CAQDfBAAh4AIBAN8EACHhAkAA4QQAIeICQADhBAAh4wIgAOAEACHkAkAA0wQAIQ7JAgAA5gYAMMoCAADnBgAQywIAAOYGADDMAgEA0gQAIc0CAQDSBAAhzwJAANMEACHcAgAA5ATcAiLeAgAA5QTeAiLfAgEA3wQAIeACAQDfBAAh4QJAAOEEACHiAkAA4QQAIeMCIADgBAAh5AJAANMEACEKzAIBAJ4FACHPAkAAnwUAIdwCAACoBdwCIt4CAACpBd4CIt8CAQCqBQAh4AIBAKoFACHhAkAAqwUAIeICQACrBQAh4wIgAKwFACHkAkAAnwUAIQsPAACuBQAgzAIBAJ4FACHPAkAAnwUAIdwCAACoBdwCIt4CAACpBd4CIt8CAQCqBQAh4AIBAKoFACHhAkAAqwUAIeICQACrBQAh4wIgAKwFACHkAkAAnwUAIQsPAADDBQAgzAIBAAAAAc8CQAAAAAHcAgAAANwCAt4CAAAA3gIC3wIBAAAAAeACAQAAAAHhAkAAAAAB4gJAAAAAAeMCIAAAAAHkAkAAAAABDBAAAMQGACARAADABQAgEwAAwQUAIMwCAQAAAAHPAkAAAAAB3gIBAAAAAfoCAQAAAAH7AggAAAAB_AIBAAAAAf0CAQAAAAH-AgEAAAAB_wIBAAAAAQIAAAAvACAtAADzBgAgAwAAAC8AIC0AAPMGACAuAADyBgAgASYAAO0JADACAAAALwAgJgAA8gYAIAIAAAC3BQAgJgAA8QYAIAnMAgEAngUAIc8CQACfBQAh3gIBAJ4FACH6AgEAqgUAIfsCCAC5BQAh_AIBAJ4FACH9AgEAqgUAIf4CAQCqBQAh_wIBAKoFACEMEAAAwwYAIBEAALwFACATAAC9BQAgzAIBAJ4FACHPAkAAnwUAId4CAQCeBQAh-gIBAKoFACH7AggAuQUAIfwCAQCeBQAh_QIBAKoFACH-AgEAqgUAIf8CAQCqBQAhDBAAAMQGACARAADABQAgEwAAwQUAIMwCAQAAAAHPAkAAAAAB3gIBAAAAAfoCAQAAAAH7AggAAAAB_AIBAAAAAf0CAQAAAAH-AgEAAAAB_wIBAAAAAQfMAgEAAAABzwJAAAAAAeQCQAAAAAH2AkAAAAABoAMBAAAAAaEDAQAAAAGiAwEAAAABAgAAAF8AIC0AAP8GACADAAAAXwAgLQAA_wYAIC4AAP4GACABJgAA7AkAMAwHAADiBAAgyQIAAOcEADDKAgAAXQAQywIAAOcEADDMAgEAAAABzQIBANIEACHPAkAA0wQAIeQCQADTBAAh9gJAANMEACGgAwEAAAABoQMBAN8EACGiAwEA3wQAIQIAAABfACAmAAD-BgAgAgAAAPwGACAmAAD9BgAgC8kCAAD7BgAwygIAAPwGABDLAgAA-wYAMMwCAQDSBAAhzQIBANIEACHPAkAA0wQAIeQCQADTBAAh9gJAANMEACGgAwEA0gQAIaEDAQDfBAAhogMBAN8EACELyQIAAPsGADDKAgAA_AYAEMsCAAD7BgAwzAIBANIEACHNAgEA0gQAIc8CQADTBAAh5AJAANMEACH2AkAA0wQAIaADAQDSBAAhoQMBAN8EACGiAwEA3wQAIQfMAgEAngUAIc8CQACfBQAh5AJAAJ8FACH2AkAAnwUAIaADAQCeBQAhoQMBAKoFACGiAwEAqgUAIQfMAgEAngUAIc8CQACfBQAh5AJAAJ8FACH2AkAAnwUAIaADAQCeBQAhoQMBAKoFACGiAwEAqgUAIQfMAgEAAAABzwJAAAAAAeQCQAAAAAH2AkAAAAABoAMBAAAAAaEDAQAAAAGiAwEAAAABCgYAAM8FACDMAgEAAAABzgIBAAAAAc8CQAAAAAHeAgAAAOgCAuQCQAAAAAHlAgEAAAAB5gICAAAAAegCAADOBQAg6QIgAAAAAQIAAAASACAtAACLBwAgAwAAABIAIC0AAIsHACAuAACKBwAgASYAAOsJADAPBgAA_QQAIAcAAOIEACDJAgAAjAUAMMoCAAAQABDLAgAAjAUAMMwCAQAAAAHNAgEA0gQAIc4CAQDSBAAhzwJAANMEACHeAgAAjQXoAiLkAkAA0wQAIeUCAQDSBAAh5gICAPwEACHoAgAAqwQAIOkCIADgBAAhAgAAABIAICYAAIoHACACAAAAiAcAICYAAIkHACANyQIAAIcHADDKAgAAiAcAEMsCAACHBwAwzAIBANIEACHNAgEA0gQAIc4CAQDSBAAhzwJAANMEACHeAgAAjQXoAiLkAkAA0wQAIeUCAQDSBAAh5gICAPwEACHoAgAAqwQAIOkCIADgBAAhDckCAACHBwAwygIAAIgHABDLAgAAhwcAMMwCAQDSBAAhzQIBANIEACHOAgEA0gQAIc8CQADTBAAh3gIAAI0F6AIi5AJAANMEACHlAgEA0gQAIeYCAgD8BAAh6AIAAKsEACDpAiAA4AQAIQnMAgEAngUAIc4CAQCeBQAhzwJAAJ8FACHeAgAAygXoAiLkAkAAnwUAIeUCAQCeBQAh5gICAMkFACHoAgAAywUAIOkCIACsBQAhCgYAAMwFACDMAgEAngUAIc4CAQCeBQAhzwJAAJ8FACHeAgAAygXoAiLkAkAAnwUAIeUCAQCeBQAh5gICAMkFACHoAgAAywUAIOkCIACsBQAhCgYAAM8FACDMAgEAAAABzgIBAAAAAc8CQAAAAAHeAgAAAOgCAuQCQAAAAAHlAgEAAAAB5gICAAAAAegCAADOBQAg6QIgAAAAAQUGAADYBQAgzAIBAAAAAc4CAQAAAAHPAkAAAAAB7QICAAAAAQIAAAA_ACAtAACXBwAgAwAAAD8AIC0AAJcHACAuAACWBwAgASYAAOoJADALBgAA_QQAIAcAAOIEACDJAgAA-wQAMMoCAAA9ABDLAgAA-wQAMMwCAQAAAAHNAgEA0gQAIc4CAQDSBAAhzwJAANMEACHtAgIA_AQAIa4DAAD6BAAgAgAAAD8AICYAAJYHACACAAAAlAcAICYAAJUHACAIyQIAAJMHADDKAgAAlAcAEMsCAACTBwAwzAIBANIEACHNAgEA0gQAIc4CAQDSBAAhzwJAANMEACHtAgIA_AQAIQjJAgAAkwcAMMoCAACUBwAQywIAAJMHADDMAgEA0gQAIc0CAQDSBAAhzgIBANIEACHPAkAA0wQAIe0CAgD8BAAhBMwCAQCeBQAhzgIBAJ4FACHPAkAAnwUAIe0CAgDJBQAhBQYAANYFACDMAgEAngUAIc4CAQCeBQAhzwJAAJ8FACHtAgIAyQUAIQUGAADYBQAgzAIBAAAAAc4CAQAAAAHPAkAAAAAB7QICAAAAAQwDAACfBwAgCgAAnQcAIAwAAJ4HACDMAgEAAAABzwJAAAAAAeQCQAAAAAHvAgEAAAAB8AIBAAAAAfECAQAAAAHyAgEAAAAB8wIBAAAAAfQCAQAAAAECAAAAQgAgLQAAmAcAIAMAAAAZACAtAACYBwAgLgAAnAcAIA4AAAAZACADAADyBQAgCgAA7wUAIAwAAPAFACAmAACcBwAgzAIBAJ4FACHPAkAAnwUAIeQCQACfBQAh7wIBAKoFACHwAgEAqgUAIfECAQCqBQAh8gIBAKoFACHzAgEAqgUAIfQCAQCqBQAhDAMAAPIFACAKAADvBQAgDAAA8AUAIMwCAQCeBQAhzwJAAJ8FACHkAkAAnwUAIe8CAQCqBQAh8AIBAKoFACHxAgEAqgUAIfICAQCqBQAh8wIBAKoFACH0AgEAqgUAIQQtAAClBwAwsgMAAKYHADC0AwAApwcAILgDAACoBwAwBC0AAKAHADCyAwAAoQcAMLQDAACiBwAguAMAAKMHADADLQAA8wUAMLIDAAD0BQAwuAMAAPYFADAHBgAA4AUAIAcAAOIFACDMAgEAAAABzQIBAAAAAc4CAQAAAAHPAkAAAAAB5AJAAAAAAQIAAAAeACAtAACkBwAgASYAAOkJADAMBgAA_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_ACAtAADuBwAgAwAAAD8AIC0AAO4HACAuAADtBwAgASYAAOMJADACAAAAPwAgJgAA7QcAIAIAAACUBwAgJgAA7AcAIATMAgEAngUAIc0CAQCeBQAhzwJAAJ8FACHtAgIAyQUAIQUHAADXBQAgzAIBAJ4FACHNAgEAngUAIc8CQACfBQAh7QICAMkFACEFBwAA2QUAIMwCAQAAAAHNAgEAAAABzwJAAAAAAe0CAgAAAAEIBwAA-QcAIBIAAMcGACDMAgEAAAABzQIBAAAAAc8CQAAAAAHeAgAAAPYCAuQCQAAAAAH2AkAAAAABAgAAADsAIC0AAPgHACADAAAAOwAgLQAA-AcAIC4AAPYHACABJgAA4gkAMAIAAAA7ACAmAAD2BwAgAgAAALgGACAmAAD1BwAgBswCAQCeBQAhzQIBAJ4FACHPAkAAnwUAId4CAAC6BvYCIuQCQACfBQAh9gJAAJ8FACEIBwAA9wcAIBIAAL0GACDMAgEAngUAIc0CAQCeBQAhzwJAAJ8FACHeAgAAugb2AiLkAkAAnwUAIfYCQACfBQAhBS0AAN0JACAuAADgCQAgsgMAAN4JACCzAwAA3wkAILgDAABGACAIBwAA-QcAIBIAAMcGACDMAgEAAAABzQIBAAAAAc8CQAAAAAHeAgAAAPYCAuQCQAAAAAH2AkAAAAABAy0AAN0JACCyAwAA3gkAILgDAABGACAEzAIBAAAAAe8CAQAAAAHxAgEAAAABgAMBAAAAAQIAAAA4ACAtAACFCAAgAwAAADgAIC0AAIUIACAuAACECAAgASYAANwJADAJBgAA_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_CAAgAwAAAAkAIC0AAL8IACAuAAC-CAAgBgMAAPAEACDJAgAAmAUAMMoCAAAHABDLAgAAmAUAMMwCAQAAAAHvAgEAAAABAgAAAAkAICYAAL4IACACAAAAvAgAICYAAL0IACAFyQIAALsIADDKAgAAvAgAEMsCAAC7CAAwzAIBANIEACHvAgEA0gQAIQXJAgAAuwgAMMoCAAC8CAAQywIAALsIADDMAgEA0gQAIe8CAQDSBAAhAswCAQCeBQAh7wIBAJ4FACECzAIBAJ4FACHvAgEAngUAIQLMAgEAAAAB7wIBAAAAASEFAADBCAAgCAAAwggAIAkAAMMIACANAADECAAgDgAAxQgAIBQAAMYIACAVAADHCAAgFgAAyAgAIBcAAMkIACAZAADKCAAgzAIBAAAAAc8CQAAAAAHkAkAAAAAB-AIBAAAAAYEDAQAAAAGCAwEAAAABgwMBAAAAAYQDAgAAAAGFAwEAAAABhgMBAAAAAYcDAQAAAAGIAwEAAAABiQMBAAAAAYoDEAAAAAGLAxAAAAABjAMCAAAAAY0DAgAAAAGPAwAAAI8DApADIAAAAAGRAyAAAAABkgMIAAAAAZMDAgAAAAGUAwIAAAABAy0AALUIADCyAwAAtggAMLgDAAC4CAAwBC0AAKwIADCyAwAArQgAMLQDAACvCAAguAMAAIQHADAELQAAowgAMLIDAACkCAAwtAMAAKYIACC4AwAA0AcAMAQtAACaCAAwsgMAAJsIADC0AwAAnQgAILgDAACoBwAwBC0AAJEIADCyAwAAkggAMLQDAACUCAAguAMAAKMHADAELQAAhggAMLIDAACHCAAwtAMAAIkIACC4AwAAzAYAMAQtAAD6BwAwsgMAAPsHADC0AwAA_QcAILgDAAD-BwAwBC0AAO8HADCyAwAA8AcAMLQDAADyBwAguAMAALQGADAELQAA5gcAMLIDAADnBwAwtAMAAOkHACC4AwAAkAcAMAMtAACLBgAwsgMAAIwGADC4AwAAjgYAMAMAAAAeACAtAACkBwAgLgAAzwgAIAIAAAAeACAmAADPCAAgAgAAALEHACAmAADOCAAgBcwCAQCeBQAhzQIBAJ4FACHOAgEAngUAIc8CQACfBQAh5AJAAJ8FACEHBgAA3QUAIAcAAN8FACDMAgEAngUAIc0CAQCeBQAhzgIBAJ4FACHPAkAAnwUAIeQCQACfBQAhAwAAABcAIC0AAKkHACAuAADUCAAgAgAAABcAICYAANQIACACAAAAvAcAICYAANMIACAFzAIBAJ4FACHNAgEAngUAIc4CAQCeBQAhzwJAAJ8FACHkAkAAnwUAIQcGAADmBQAgBwAA6AUAIMwCAQCeBQAhzQIBAJ4FACHOAgEAngUAIc8CQACfBQAh5AJAAJ8FACEDLQAA0AkAILIDAADRCQAguAMAAEYAIAAAAAAAAAAAAAAAAAAABS0AAMsJACAuAADOCQAgsgMAAMwJACCzAwAAzQkAILgDAAANACADLQAAywkAILIDAADMCQAguAMAAA0AIAAAAAAACi0AAOwIADAuAADwCAAwsgMAAO0IADCzAwAA7ggAMLUDAADvCAAwtgMAAO8IADC3AwAA7wgAMLgDAADvCAAwuQMAAPEIADC6AwAA8ggAMA0HAADVCAAgCgAAnQcAIAwAAJ4HACDMAgEAAAABzQIBAAAAAc8CQAAAAAHkAkAAAAAB7wIBAAAAAfACAQAAAAHxAgEAAAAB8gIBAAAAAfMCAQAAAAH0AgEAAAABAgAAAEIAIC0AAPYIACADAAAAQgAgLQAA9ggAIC4AAPUIACARAwAA8AQAIAcAAOIEACAKAADuBAAgDAAA7wQAIMkCAAD5BAAwygIAABkAEMsCAAD5BAAwzAIBAAAAAc0CAQAAAAHPAkAA0wQAIeQCQADTBAAh7wIBAN8EACHwAgEA3wQAIfECAQDfBAAh8gIBAN8EACHzAgEA3wQAIfQCAQDfBAAhAgAAAEIAICYAAPUIACACAAAA8wgAICYAAPQIACANyQIAAPIIADDKAgAA8wgAEMsCAADyCAAwzAIBANIEACHNAgEA0gQAIc8CQADTBAAh5AJAANMEACHvAgEA3wQAIfACAQDfBAAh8QIBAN8EACHyAgEA3wQAIfMCAQDfBAAh9AIBAN8EACENyQIAAPIIADDKAgAA8wgAEMsCAADyCAAwzAIBANIEACHNAgEA0gQAIc8CQADTBAAh5AJAANMEACHvAgEA3wQAIfACAQDfBAAh8QIBAN8EACHyAgEA3wQAIfMCAQDfBAAh9AIBAN8EACEKzAIBAJ4FACHNAgEAngUAIc8CQACfBQAh5AJAAJ8FACHvAgEAqgUAIfACAQCqBQAh8QIBAKoFACHyAgEAqgUAIfMCAQCqBQAh9AIBAKoFACENBwAA8QUAIAoAAO8FACAMAADwBQAgzAIBAJ4FACHNAgEAngUAIc8CQACfBQAh5AJAAJ8FACHvAgEAqgUAIfACAQCqBQAh8QIBAKoFACHyAgEAqgUAIfMCAQCqBQAh9AIBAKoFACENBwAA1QgAIAoAAJ0HACAMAACeBwAgzAIBAAAAAc0CAQAAAAHPAkAAAAAB5AJAAAAAAe8CAQAAAAHwAgEAAAAB8QIBAAAAAfICAQAAAAHzAgEAAAAB9AIBAAAAAQMtAADsCAAwsgMAAO0IADC4AwAA7wgAMAAAAAotAAD8CAAwLgAA_wgAMLIDAAD9CAAwswMAAP4IADC1AwAA9gUAMLYDAAD2BQAwtwMAAPYFADC4AwAA9gUAMLkDAACACQAwugMAAPkFADAhCAAAwggAIAkAAMMIACANAADECAAgDgAAxQgAIBQAAMYIACAVAADHCAAgFgAAyAgAIBcAAMkIACAYAAD3CAAgGQAAyggAIMwCAQAAAAHPAkAAAAAB5AJAAAAAAfgCAQAAAAGBAwEAAAABggMBAAAAAYMDAQAAAAGEAwIAAAABhQMBAAAAAYYDAQAAAAGHAwEAAAABiAMBAAAAAYkDAQAAAAGKAxAAAAABiwMQAAAAAYwDAgAAAAGNAwIAAAABjwMAAACPAwKQAyAAAAABkQMgAAAAAZIDCAAAAAGTAwIAAAABlAMCAAAAAQIAAAANACAtAACDCQAgAwAAAA0AIC0AAIMJACAuAACCCQAgAgAAAA0AICYAAIIJACACAAAA-gUAICYAAIEJACAXzAIBAJ4FACHPAkAAnwUAIeQCQACfBQAh-AIBAJ4FACGBAwEAngUAIYIDAQCeBQAhgwMBAJ4FACGEAwIAyQUAIYUDAQCeBQAhhgMBAKoFACGHAwEAqgUAIYgDAQCqBQAhiQMBAKoFACGKAxAA_AUAIYsDEAD8BQAhjAMCAP0FACGNAwIA_QUAIY8DAAD-BY8DIpADIACsBQAhkQMgAKwFACGSAwgA_wUAIZMDAgDJBQAhlAMCAMkFACEhCAAAggYAIAkAAIMGACANAACEBgAgDgAAhQYAIBQAAIYGACAVAACHBgAgFgAAiAYAIBcAAIkGACAYAADrCAAgGQAAigYAIMwCAQCeBQAhzwJAAJ8FACHkAkAAnwUAIfgCAQCeBQAhgQMBAJ4FACGCAwEAngUAIYMDAQCeBQAhhAMCAMkFACGFAwEAngUAIYYDAQCqBQAhhwMBAKoFACGIAwEAqgUAIYkDAQCqBQAhigMQAPwFACGLAxAA_AUAIYwDAgD9BQAhjQMCAP0FACGPAwAA_gWPAyKQAyAArAUAIZEDIACsBQAhkgMIAP8FACGTAwIAyQUAIZQDAgDJBQAhIQgAAMIIACAJAADDCAAgDQAAxAgAIA4AAMUIACAUAADGCAAgFQAAxwgAIBYAAMgIACAXAADJCAAgGAAA9wgAIBkAAMoIACDMAgEAAAABzwJAAAAAAeQCQAAAAAH4AgEAAAABgQMBAAAAAYIDAQAAAAGDAwEAAAABhAMCAAAAAYUDAQAAAAGGAwEAAAABhwMBAAAAAYgDAQAAAAGJAwEAAAABigMQAAAAAYsDEAAAAAGMAwIAAAABjQMCAAAAAY8DAAAAjwMCkAMgAAAAAZEDIAAAAAGSAwgAAAABkwMCAAAAAZQDAgAAAAEDLQAA_AgAMLIDAAD9CAAwuAMAAPYFADAAAAAAAAAFLQAAxgkAIC4AAMkJACCyAwAAxwkAILMDAADICQAguAMAAEYAIAMtAADGCQAgsgMAAMcJACC4AwAARgAgAAAABS0AAMEJACAuAADECQAgsgMAAMIJACCzAwAAwwkAILgDAABGACADLQAAwQkAILIDAADCCQAguAMAAEYAIAAAAAotAACWCQAwLgAAmQkAMLIDAACXCQAwswMAAJgJADC1AwAA9gUAMLYDAAD2BQAwtwMAAPYFADC4AwAA9gUAMLkDAACaCQAwugMAAPkFADAhBQAAwQgAIAgAAMIIACAJAADDCAAgDQAAxAgAIA4AAMUIACAUAADGCAAgFQAAxwgAIBYAAMgIACAXAADJCAAgGAAA9wgAIMwCAQAAAAHPAkAAAAAB5AJAAAAAAfgCAQAAAAGBAwEAAAABggMBAAAAAYMDAQAAAAGEAwIAAAABhQMBAAAAAYYDAQAAAAGHAwEAAAABiAMBAAAAAYkDAQAAAAGKAxAAAAABiwMQAAAAAYwDAgAAAAGNAwIAAAABjwMAAACPAwKQAyAAAAABkQMgAAAAAZIDCAAAAAGTAwIAAAABlAMCAAAAAQIAAAANACAtAACdCQAgAwAAAA0AIC0AAJ0JACAuAACcCQAgAgAAAA0AICYAAJwJACACAAAA-gUAICYAAJsJACAXzAIBAJ4FACHPAkAAnwUAIeQCQACfBQAh-AIBAJ4FACGBAwEAngUAIYIDAQCeBQAhgwMBAJ4FACGEAwIAyQUAIYUDAQCeBQAhhgMBAKoFACGHAwEAqgUAIYgDAQCqBQAhiQMBAKoFACGKAxAA_AUAIYsDEAD8BQAhjAMCAP0FACGNAwIA_QUAIY8DAAD-BY8DIpADIACsBQAhkQMgAKwFACGSAwgA_wUAIZMDAgDJBQAhlAMCAMkFACEhBQAAgQYAIAgAAIIGACAJAACDBgAgDQAAhAYAIA4AAIUGACAUAACGBgAgFQAAhwYAIBYAAIgGACAXAACJBgAgGAAA6wgAIMwCAQCeBQAhzwJAAJ8FACHkAkAAnwUAIfgCAQCeBQAhgQMBAJ4FACGCAwEAngUAIYMDAQCeBQAhhAMCAMkFACGFAwEAngUAIYYDAQCqBQAhhwMBAKoFACGIAwEAqgUAIYkDAQCqBQAhigMQAPwFACGLAxAA_AUAIYwDAgD9BQAhjQMCAP0FACGPAwAA_gWPAyKQAyAArAUAIZEDIACsBQAhkgMIAP8FACGTAwIAyQUAIZQDAgDJBQAhIQUAAMEIACAIAADCCAAgCQAAwwgAIA0AAMQIACAOAADFCAAgFAAAxggAIBUAAMcIACAWAADICAAgFwAAyQgAIBgAAPcIACDMAgEAAAABzwJAAAAAAeQCQAAAAAH4AgEAAAABgQMBAAAAAYIDAQAAAAGDAwEAAAABhAMCAAAAAYUDAQAAAAGGAwEAAAABhwMBAAAAAYgDAQAAAAGJAwEAAAABigMQAAAAAYsDEAAAAAGMAwIAAAABjQMCAAAAAY8DAAAAjwMCkAMgAAAAAZEDIAAAAAGSAwgAAAABkwMCAAAAAZQDAgAAAAEDLQAAlgkAMLIDAACXCQAwuAMAAPYFADAAAAAFLQAAvAkAIC4AAL8JACCyAwAAvQkAILMDAAC-CQAguAMAAEYAIAMtAAC8CQAgsgMAAL0JACC4AwAARgAgEAgAAK0JACALAACrCQAgDQAAqAkAIA4AAKkJACAPAAClCQAgFgAAsQkAIBcAAKwJACAaAACmCQAgGwAApwkAIBwAAKoJACAdAACuCQAgHgAArwkAIB8AALAJACAgAACyCQAg8QIAAKQFACCoAwAApAUAIAAAAAAAAAoDAACqCQAgBwAApAkAIAoAAKgJACAMAACpCQAg7wIAAKQFACDwAgAApAUAIPECAACkBQAg8gIAAKQFACDzAgAApAUAIPQCAACkBQAgAAAAAAAAABQFAAC4CQAgCAAArQkAIAkAAKYJACANAACoCQAgDgAAqQkAIBQAALAJACAVAAC5CQAgFgAAsQkAIBcAAKwJACAYAAC6CQAgGQAAuwkAIIYDAACkBQAghwMAAKQFACCIAwAApAUAIIkDAACkBQAgigMAAKQFACCLAwAApAUAIIwDAACkBQAgjQMAAKQFACCSAwAApAUAIAgHAACkCQAgEAAAtQkAIBEAALYJACATAAC3CQAg-gIAAKQFACD9AgAApAUAIP4CAACkBQAg_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_AUAIYwDAgD9BQAhjQMCAP0FACGPAwAA_gWPAyKQAyAArAUAIZEDIACsBQAhkgMIAP8FACGTAwIAyQUAIZQDAgDJBQAhIQUAAIEGACAIAACCBgAgCQAAgwYAIA0AAIQGACAOAACFBgAgFAAAhgYAIBYAAIgGACAXAACJBgAgGAAA6wgAIBkAAIoGACDMAgEAngUAIc8CQACfBQAh5AJAAJ8FACH4AgEAngUAIYEDAQCeBQAhggMBAJ4FACGDAwEAngUAIYQDAgDJBQAhhQMBAJ4FACGGAwEAqgUAIYcDAQCqBQAhiAMBAKoFACGJAwEAqgUAIYoDEAD8BQAhiwMQAPwFACGMAwIA_QUAIY0DAgD9BQAhjwMAAP4FjwMikAMgAKwFACGRAyAArAUAIZIDCAD_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_AIBAAAAAf0CAQAAAAH-AgEAAAAB_wIBAAAAAQrMAgEAAAABzwJAAAAAAdwCAAAA3AIC3gIAAADeAgLfAgEAAAAB4AIBAAAAAeECQAAAAAHiAkAAAAAB4wIgAAAAAeQCQAAAAAEhBQAAwQgAIAgAAMIIACAJAADDCAAgDQAAxAgAIA4AAMUIACAVAADHCAAgFgAAyAgAIBcAAMkIACAYAAD3CAAgGQAAyggAIMwCAQAAAAHPAkAAAAAB5AJAAAAAAfgCAQAAAAGBAwEAAAABggMBAAAAAYMDAQAAAAGEAwIAAAABhQMBAAAAAYYDAQAAAAGHAwEAAAABiAMBAAAAAYkDAQAAAAGKAxAAAAABiwMQAAAAAYwDAgAAAAGNAwIAAAABjwMAAACPAwKQAyAAAAABkQMgAAAAAZIDCAAAAAGTAwIAAAABlAMCAAAAAQIAAAANACAtAADvCQAgAwAAAAsAIC0AAO8JACAuAADzCQAgIwAAAAsAIAUAAIEGACAIAACCBgAgCQAAgwYAIA0AAIQGACAOAACFBgAgFQAAhwYAIBYAAIgGACAXAACJBgAgGAAA6wgAIBkAAIoGACAmAADzCQAgzAIBAJ4FACHPAkAAnwUAIeQCQACfBQAh-AIBAJ4FACGBAwEAngUAIYIDAQCeBQAhgwMBAJ4FACGEAwIAyQUAIYUDAQCeBQAhhgMBAKoFACGHAwEAqgUAIYgDAQCqBQAhiQMBAKoFACGKAxAA_AUAIYsDEAD8BQAhjAMCAP0FACGNAwIA_QUAIY8DAAD-BY8DIpADIACsBQAhkQMgAKwFACGSAwgA_wUAIZMDAgDJBQAhlAMCAMkFACEhBQAAgQYAIAgAAIIGACAJAACDBgAgDQAAhAYAIA4AAIUGACAVAACHBgAgFgAAiAYAIBcAAIkGACAYAADrCAAgGQAAigYAIMwCAQCeBQAhzwJAAJ8FACHkAkAAnwUAIfgCAQCeBQAhgQMBAJ4FACGCAwEAngUAIYMDAQCeBQAhhAMCAMkFACGFAwEAngUAIYYDAQCqBQAhhwMBAKoFACGIAwEAqgUAIYkDAQCqBQAhigMQAPwFACGLAxAA_AUAIYwDAgD9BQAhjQMCAP0FACGPAwAA_gWPAyKQAyAArAUAIZEDIACsBQAhkgMIAP8FACGTAwIAyQUAIZQDAgDJBQAhB8wCAQAAAAHOAgEAAAABzwJAAAAAAd4CAAAA-gIC5AJAAAAAAfYCQAAAAAH4AgAAAPgCAiEFAADBCAAgCAAAwggAIAkAAMMIACANAADECAAgDgAAxQgAIBQAAMYIACAVAADHCAAgFwAAyQgAIBgAAPcIACAZAADKCAAgzAIBAAAAAc8CQAAAAAHkAkAAAAAB-AIBAAAAAYEDAQAAAAGCAwEAAAABgwMBAAAAAYQDAgAAAAGFAwEAAAABhgMBAAAAAYcDAQAAAAGIAwEAAAABiQMBAAAAAYoDEAAAAAGLAxAAAAABjAMCAAAAAY0DAgAAAAGPAwAAAI8DApADIAAAAAGRAyAAAAABkgMIAAAAAZMDAgAAAAGUAwIAAAABAgAAAA0AIC0AAPUJACAMBwAAwgUAIMwCAQAAAAHNAgEAAAABzwJAAAAAAdwCAAAA3AIC3gIAAADeAgLfAgEAAAAB4AIBAAAAAeECQAAAAAHiAkAAAAAB4wIgAAAAAeQCQAAAAAECAAAAYwAgLQAA9wkAIAMAAAAsACAtAAD3CQAgLgAA-wkAIA4AAAAsACAHAACtBQAgJgAA-wkAIMwCAQCeBQAhzQIBAJ4FACHPAkAAnwUAIdwCAACoBdwCIt4CAACpBd4CIt8CAQCqBQAh4AIBAKoFACHhAkAAqwUAIeICQACrBQAh4wIgAKwFACHkAkAAnwUAIQwHAACtBQAgzAIBAJ4FACHNAgEAngUAIc8CQACfBQAh3AIAAKgF3AIi3gIAAKkF3gIi3wIBAKoFACHgAgEAqgUAIeECQACrBQAh4gJAAKsFACHjAiAArAUAIeQCQACfBQAhAwAAAAsAIC0AAPUJACAuAAD-CQAgIwAAAAsAIAUAAIEGACAIAACCBgAgCQAAgwYAIA0AAIQGACAOAACFBgAgFAAAhgYAIBUAAIcGACAXAACJBgAgGAAA6wgAIBkAAIoGACAmAAD-CQAgzAIBAJ4FACHPAkAAnwUAIeQCQACfBQAh-AIBAJ4FACGBAwEAngUAIYIDAQCeBQAhgwMBAJ4FACGEAwIAyQUAIYUDAQCeBQAhhgMBAKoFACGHAwEAqgUAIYgDAQCqBQAhiQMBAKoFACGKAxAA_AUAIYsDEAD8BQAhjAMCAP0FACGNAwIA_QUAIY8DAAD-BY8DIpADIACsBQAhkQMgAKwFACGSAwgA_wUAIZMDAgDJBQAhlAMCAMkFACEhBQAAgQYAIAgAAIIGACAJAACDBgAgDQAAhAYAIA4AAIUGACAUAACGBgAgFQAAhwYAIBcAAIkGACAYAADrCAAgGQAAigYAIMwCAQCeBQAhzwJAAJ8FACHkAkAAnwUAIfgCAQCeBQAhgQMBAJ4FACGCAwEAngUAIYMDAQCeBQAhhAMCAMkFACGFAwEAngUAIYYDAQCqBQAhhwMBAKoFACGIAwEAqgUAIYkDAQCqBQAhigMQAPwFACGLAxAA_AUAIYwDAgD9BQAhjQMCAP0FACGPAwAA_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_AUAIYsDEAD8BQAhjAMCAP0FACGNAwIA_QUAIY8DAAD-BY8DIpADIACsBQAhkQMgAKwFACGSAwgA_wUAIZMDAgDJBQAhlAMCAMkFACEhBQAAgQYAIAgAAIIGACAJAACDBgAgDgAAhQYAIBQAAIYGACAVAACHBgAgFgAAiAYAIBcAAIkGACAYAADrCAAgGQAAigYAIMwCAQCeBQAhzwJAAJ8FACHkAkAAnwUAIfgCAQCeBQAhgQMBAJ4FACGCAwEAngUAIYMDAQCeBQAhhAMCAMkFACGFAwEAngUAIYYDAQCqBQAhhwMBAKoFACGIAwEAqgUAIYkDAQCqBQAhigMQAPwFACGLAxAA_AUAIYwDAgD9BQAhjQMCAP0FACGPAwAA_gWPAyKQAyAArAUAIZEDIACsBQAhkgMIAP8FACGTAwIAyQUAIZQDAgDJBQAhGQgAAN8HACALAADdBwAgDQAA2wcAIA8AAOEHACAWAADkBwAgFwAA3gcAIBoAANkHACAbAADaBwAgHAAAngkAIB0AAOAHACAeAADiBwAgHwAA4wcAICAAAOUHACDMAgEAAAABzwJAAAAAAd4CAAAApgMC5AJAAAAAAe8CAQAAAAHwAgEAAAAB8QIBAAAAAYADAAAApQMCowMgAAAAAaYDIAAAAAGnAyAAAAABqANAAAAAAQIAAABGACAtAACTCgAgDQMAAJ8HACAHAADVCAAgCgAAnQcAIMwCAQAAAAHNAgEAAAABzwJAAAAAAeQCQAAAAAHvAgEAAAAB8AIBAAAAAfECAQAAAAHyAgEAAAAB8wIBAAAAAfQCAQAAAAECAAAAQgAgLQAAlQoAICEFAADBCAAgCAAAwggAIAkAAMMIACANAADECAAgFAAAxggAIBUAAMcIACAWAADICAAgFwAAyQgAIBgAAPcIACAZAADKCAAgzAIBAAAAAc8CQAAAAAHkAkAAAAAB-AIBAAAAAYEDAQAAAAGCAwEAAAABgwMBAAAAAYQDAgAAAAGFAwEAAAABhgMBAAAAAYcDAQAAAAGIAwEAAAABiQMBAAAAAYoDEAAAAAGLAxAAAAABjAMCAAAAAY0DAgAAAAGPAwAAAI8DApADIAAAAAGRAyAAAAABkgMIAAAAAZMDAgAAAAGUAwIAAAABAgAAAA0AIC0AAJcKACADAAAARAAgLQAAkwoAIC4AAJsKACAbAAAARAAgCAAAnQYAIAsAAJsGACANAACZBgAgDwAAnwYAIBYAAKIGACAXAACcBgAgGgAAlwYAIBsAAJgGACAcAACVCQAgHQAAngYAIB4AAKAGACAfAAChBgAgIAAAowYAICYAAJsKACDMAgEAngUAIc8CQACfBQAh3gIAAJUGpgMi5AJAAJ8FACHvAgEAngUAIfACAQCeBQAh8QIBAKoFACGAAwAAlAalAyKjAyAArAUAIaYDIACsBQAhpwMgAKwFACGoA0AAqwUAIRkIAACdBgAgCwAAmwYAIA0AAJkGACAPAACfBgAgFgAAogYAIBcAAJwGACAaAACXBgAgGwAAmAYAIBwAAJUJACAdAACeBgAgHgAAoAYAIB8AAKEGACAgAACjBgAgzAIBAJ4FACHPAkAAnwUAId4CAACVBqYDIuQCQACfBQAh7wIBAJ4FACHwAgEAngUAIfECAQCqBQAhgAMAAJQGpQMiowMgAKwFACGmAyAArAUAIacDIACsBQAhqANAAKsFACEDAAAAGQAgLQAAlQoAIC4AAJ4KACAPAAAAGQAgAwAA8gUAIAcAAPEFACAKAADvBQAgJgAAngoAIMwCAQCeBQAhzQIBAJ4FACHPAkAAnwUAIeQCQACfBQAh7wIBAKoFACHwAgEAqgUAIfECAQCqBQAh8gIBAKoFACHzAgEAqgUAIfQCAQCqBQAhDQMAAPIFACAHAADxBQAgCgAA7wUAIMwCAQCeBQAhzQIBAJ4FACHPAkAAnwUAIeQCQACfBQAh7wIBAKoFACHwAgEAqgUAIfECAQCqBQAh8gIBAKoFACHzAgEAqgUAIfQCAQCqBQAhAwAAAAsAIC0AAJcKACAuAAChCgAgIwAAAAsAIAUAAIEGACAIAACCBgAgCQAAgwYAIA0AAIQGACAUAACGBgAgFQAAhwYAIBYAAIgGACAXAACJBgAgGAAA6wgAIBkAAIoGACAmAAChCgAgzAIBAJ4FACHPAkAAnwUAIeQCQACfBQAh-AIBAJ4FACGBAwEAngUAIYIDAQCeBQAhgwMBAJ4FACGEAwIAyQUAIYUDAQCeBQAhhgMBAKoFACGHAwEAqgUAIYgDAQCqBQAhiQMBAKoFACGKAxAA_AUAIYsDEAD8BQAhjAMCAP0FACGNAwIA_QUAIY8DAAD-BY8DIpADIACsBQAhkQMgAKwFACGSAwgA_wUAIZMDAgDJBQAhlAMCAMkFACEhBQAAgQYAIAgAAIIGACAJAACDBgAgDQAAhAYAIBQAAIYGACAVAACHBgAgFgAAiAYAIBcAAIkGACAYAADrCAAgGQAAigYAIMwCAQCeBQAhzwJAAJ8FACHkAkAAnwUAIfgCAQCeBQAhgQMBAJ4FACGCAwEAngUAIYMDAQCeBQAhhAMCAMkFACGFAwEAngUAIYYDAQCqBQAhhwMBAKoFACGIAwEAqgUAIYkDAQCqBQAhigMQAPwFACGLAxAA_AUAIYwDAgD9BQAhjQMCAP0FACGPAwAA_gWPAyKQAyAArAUAIZEDIACsBQAhkgMIAP8FACGTAwIAyQUAIZQDAgDJBQAhGQgAAN8HACALAADdBwAgDQAA2wcAIA4AANwHACAPAADhBwAgFgAA5AcAIBoAANkHACAbAADaBwAgHAAAngkAIB0AAOAHACAeAADiBwAgHwAA4wcAICAAAOUHACDMAgEAAAABzwJAAAAAAd4CAAAApgMC5AJAAAAAAe8CAQAAAAHwAgEAAAAB8QIBAAAAAYADAAAApQMCowMgAAAAAaYDIAAAAAGnAyAAAAABqANAAAAAAQIAAABGACAtAACiCgAgIQUAAMEIACAIAADCCAAgCQAAwwgAIA0AAMQIACAOAADFCAAgFAAAxggAIBUAAMcIACAWAADICAAgGAAA9wgAIBkAAMoIACDMAgEAAAABzwJAAAAAAeQCQAAAAAH4AgEAAAABgQMBAAAAAYIDAQAAAAGDAwEAAAABhAMCAAAAAYUDAQAAAAGGAwEAAAABhwMBAAAAAYgDAQAAAAGJAwEAAAABigMQAAAAAYsDEAAAAAGMAwIAAAABjQMCAAAAAY8DAAAAjwMCkAMgAAAAAZEDIAAAAAGSAwgAAAABkwMCAAAAAZQDAgAAAAECAAAADQAgLQAApAoAIAMAAABEACAtAACiCgAgLgAAqAoAIBsAAABEACAIAACdBgAgCwAAmwYAIA0AAJkGACAOAACaBgAgDwAAnwYAIBYAAKIGACAaAACXBgAgGwAAmAYAIBwAAJUJACAdAACeBgAgHgAAoAYAIB8AAKEGACAgAACjBgAgJgAAqAoAIMwCAQCeBQAhzwJAAJ8FACHeAgAAlQamAyLkAkAAnwUAIe8CAQCeBQAh8AIBAJ4FACHxAgEAqgUAIYADAACUBqUDIqMDIACsBQAhpgMgAKwFACGnAyAArAUAIagDQACrBQAhGQgAAJ0GACALAACbBgAgDQAAmQYAIA4AAJoGACAPAACfBgAgFgAAogYAIBoAAJcGACAbAACYBgAgHAAAlQkAIB0AAJ4GACAeAACgBgAgHwAAoQYAICAAAKMGACDMAgEAngUAIc8CQACfBQAh3gIAAJUGpgMi5AJAAJ8FACHvAgEAngUAIfACAQCeBQAh8QIBAKoFACGAAwAAlAalAyKjAyAArAUAIaYDIACsBQAhpwMgAKwFACGoA0AAqwUAIQMAAAALACAtAACkCgAgLgAAqwoAICMAAAALACAFAACBBgAgCAAAggYAIAkAAIMGACANAACEBgAgDgAAhQYAIBQAAIYGACAVAACHBgAgFgAAiAYAIBgAAOsIACAZAACKBgAgJgAAqwoAIMwCAQCeBQAhzwJAAJ8FACHkAkAAnwUAIfgCAQCeBQAhgQMBAJ4FACGCAwEAngUAIYMDAQCeBQAhhAMCAMkFACGFAwEAngUAIYYDAQCqBQAhhwMBAKoFACGIAwEAqgUAIYkDAQCqBQAhigMQAPwFACGLAxAA_AUAIYwDAgD9BQAhjQMCAP0FACGPAwAA_gWPAyKQAyAArAUAIZEDIACsBQAhkgMIAP8FACGTAwIAyQUAIZQDAgDJBQAhIQUAAIEGACAIAACCBgAgCQAAgwYAIA0AAIQGACAOAACFBgAgFAAAhgYAIBUAAIcGACAWAACIBgAgGAAA6wgAIBkAAIoGACDMAgEAngUAIc8CQACfBQAh5AJAAJ8FACH4AgEAngUAIYEDAQCeBQAhggMBAJ4FACGDAwEAngUAIYQDAgDJBQAhhQMBAJ4FACGGAwEAqgUAIYcDAQCqBQAhiAMBAKoFACGJAwEAqgUAIYoDEAD8BQAhiwMQAPwFACGMAwIA_QUAIY0DAgD9BQAhjwMAAP4FjwMikAMgAKwFACGRAyAArAUAIZIDCAD_BQAhkwMCAMkFACGUAwIAyQUAIRkLAADdBwAgDQAA2wcAIA4AANwHACAPAADhBwAgFgAA5AcAIBcAAN4HACAaAADZBwAgGwAA2gcAIBwAAJ4JACAdAADgBwAgHgAA4gcAIB8AAOMHACAgAADlBwAgzAIBAAAAAc8CQAAAAAHeAgAAAKYDAuQCQAAAAAHvAgEAAAAB8AIBAAAAAfECAQAAAAGAAwAAAKUDAqMDIAAAAAGmAyAAAAABpwMgAAAAAagDQAAAAAECAAAARgAgLQAArAoAICEFAADBCAAgCQAAwwgAIA0AAMQIACAOAADFCAAgFAAAxggAIBUAAMcIACAWAADICAAgFwAAyQgAIBgAAPcIACAZAADKCAAgzAIBAAAAAc8CQAAAAAHkAkAAAAAB-AIBAAAAAYEDAQAAAAGCAwEAAAABgwMBAAAAAYQDAgAAAAGFAwEAAAABhgMBAAAAAYcDAQAAAAGIAwEAAAABiQMBAAAAAYoDEAAAAAGLAxAAAAABjAMCAAAAAY0DAgAAAAGPAwAAAI8DApADIAAAAAGRAyAAAAABkgMIAAAAAZMDAgAAAAGUAwIAAAABAgAAAA0AIC0AAK4KACADAAAARAAgLQAArAoAIC4AALIKACAbAAAARAAgCwAAmwYAIA0AAJkGACAOAACaBgAgDwAAnwYAIBYAAKIGACAXAACcBgAgGgAAlwYAIBsAAJgGACAcAACVCQAgHQAAngYAIB4AAKAGACAfAAChBgAgIAAAowYAICYAALIKACDMAgEAngUAIc8CQACfBQAh3gIAAJUGpgMi5AJAAJ8FACHvAgEAngUAIfACAQCeBQAh8QIBAKoFACGAAwAAlAalAyKjAyAArAUAIaYDIACsBQAhpwMgAKwFACGoA0AAqwUAIRkLAACbBgAgDQAAmQYAIA4AAJoGACAPAACfBgAgFgAAogYAIBcAAJwGACAaAACXBgAgGwAAmAYAIBwAAJUJACAdAACeBgAgHgAAoAYAIB8AAKEGACAgAACjBgAgzAIBAJ4FACHPAkAAnwUAId4CAACVBqYDIuQCQACfBQAh7wIBAJ4FACHwAgEAngUAIfECAQCqBQAhgAMAAJQGpQMiowMgAKwFACGmAyAArAUAIacDIACsBQAhqANAAKsFACEDAAAACwAgLQAArgoAIC4AALUKACAjAAAACwAgBQAAgQYAIAkAAIMGACANAACEBgAgDgAAhQYAIBQAAIYGACAVAACHBgAgFgAAiAYAIBcAAIkGACAYAADrCAAgGQAAigYAICYAALUKACDMAgEAngUAIc8CQACfBQAh5AJAAJ8FACH4AgEAngUAIYEDAQCeBQAhggMBAJ4FACGDAwEAngUAIYQDAgDJBQAhhQMBAJ4FACGGAwEAqgUAIYcDAQCqBQAhiAMBAKoFACGJAwEAqgUAIYoDEAD8BQAhiwMQAPwFACGMAwIA_QUAIY0DAgD9BQAhjwMAAP4FjwMikAMgAKwFACGRAyAArAUAIZIDCAD_BQAhkwMCAMkFACGUAwIAyQUAISEFAACBBgAgCQAAgwYAIA0AAIQGACAOAACFBgAgFAAAhgYAIBUAAIcGACAWAACIBgAgFwAAiQYAIBgAAOsIACAZAACKBgAgzAIBAJ4FACHPAkAAnwUAIeQCQACfBQAh-AIBAJ4FACGBAwEAngUAIYIDAQCeBQAhgwMBAJ4FACGEAwIAyQUAIYUDAQCeBQAhhgMBAKoFACGHAwEAqgUAIYgDAQCqBQAhiQMBAKoFACGKAxAA_AUAIYsDEAD8BQAhjAMCAP0FACGNAwIA_QUAIY8DAAD-BY8DIpADIACsBQAhkQMgAKwFACGSAwgA_wUAIZMDAgDJBQAhlAMCAMkFACEZCAAA3wcAIAsAAN0HACANAADbBwAgDgAA3AcAIA8AAOEHACAWAADkBwAgFwAA3gcAIBoAANkHACAbAADaBwAgHAAAngkAIB0AAOAHACAfAADjBwAgIAAA5QcAIMwCAQAAAAHPAkAAAAAB3gIAAACmAwLkAkAAAAAB7wIBAAAAAfACAQAAAAHxAgEAAAABgAMAAAClAwKjAyAAAAABpgMgAAAAAacDIAAAAAGoA0AAAAABAgAAAEYAIC0AALYKACAJBgAAxgYAIAcAAPkHACDMAgEAAAABzQIBAAAAAc4CAQAAAAHPAkAAAAAB3gIAAAD2AgLkAkAAAAAB9gJAAAAAAQIAAAA7ACAtAAC4CgAgCgYAAN0GACAHAACQCAAgzAIBAAAAAc0CAQAAAAHOAgEAAAABzwJAAAAAAd4CAAAA-gIC5AJAAAAAAfYCQAAAAAH4AgAAAPgCAgIAAAAoACAtAAC6CgAgGQgAAN8HACALAADdBwAgDQAA2wcAIA4AANwHACAWAADkBwAgFwAA3gcAIBoAANkHACAbAADaBwAgHAAAngkAIB0AAOAHACAeAADiBwAgHwAA4wcAICAAAOUHACDMAgEAAAABzwJAAAAAAd4CAAAApgMC5AJAAAAAAe8CAQAAAAHwAgEAAAAB8QIBAAAAAYADAAAApQMCowMgAAAAAaYDIAAAAAGnAyAAAAABqANAAAAAAQIAAABGACAtAAC8CgAgAwAAADMAIC0AALgKACAuAADACgAgCwAAADMAIAYAALwGACAHAAD3BwAgJgAAwAoAIMwCAQCeBQAhzQIBAJ4FACHOAgEAngUAIc8CQACfBQAh3gIAALoG9gIi5AJAAJ8FACH2AkAAnwUAIQkGAAC8BgAgBwAA9wcAIMwCAQCeBQAhzQIBAJ4FACHOAgEAngUAIc8CQACfBQAh3gIAALoG9gIi5AJAAJ8FACH2AkAAnwUAIQMAAAAmACAtAAC6CgAgLgAAwwoAIAwAAAAmACAGAADVBgAgBwAAjggAICYAAMMKACDMAgEAngUAIc0CAQCeBQAhzgIBAJ4FACHPAkAAnwUAId4CAADTBvoCIuQCQACfBQAh9gJAAKsFACH4AgAA0gb4AiIKBgAA1QYAIAcAAI4IACDMAgEAngUAIc0CAQCeBQAhzgIBAJ4FACHPAkAAnwUAId4CAADTBvoCIuQCQACfBQAh9gJAAKsFACH4AgAA0gb4AiIDAAAARAAgLQAAvAoAIC4AAMYKACAbAAAARAAgCAAAnQYAIAsAAJsGACANAACZBgAgDgAAmgYAIBYAAKIGACAXAACcBgAgGgAAlwYAIBsAAJgGACAcAACVCQAgHQAAngYAIB4AAKAGACAfAAChBgAgIAAAowYAICYAAMYKACDMAgEAngUAIc8CQACfBQAh3gIAAJUGpgMi5AJAAJ8FACHvAgEAngUAIfACAQCeBQAh8QIBAKoFACGAAwAAlAalAyKjAyAArAUAIaYDIACsBQAhpwMgAKwFACGoA0AAqwUAIRkIAACdBgAgCwAAmwYAIA0AAJkGACAOAACaBgAgFgAAogYAIBcAAJwGACAaAACXBgAgGwAAmAYAIBwAAJUJACAdAACeBgAgHgAAoAYAIB8AAKEGACAgAACjBgAgzAIBAJ4FACHPAkAAnwUAId4CAACVBqYDIuQCQACfBQAh7wIBAJ4FACHwAgEAngUAIfECAQCqBQAhgAMAAJQGpQMiowMgAKwFACGmAyAArAUAIacDIACsBQAhqANAAKsFACEJzAIBAAAAAc0CAQAAAAHPAkAAAAAB3gIBAAAAAfsCCAAAAAH8AgEAAAAB_QIBAAAAAf4CAQAAAAH_AgEAAAABAwAAAEQAIC0AALYKACAuAADKCgAgGwAAAEQAIAgAAJ0GACALAACbBgAgDQAAmQYAIA4AAJoGACAPAACfBgAgFgAAogYAIBcAAJwGACAaAACXBgAgGwAAmAYAIBwAAJUJACAdAACeBgAgHwAAoQYAICAAAKMGACAmAADKCgAgzAIBAJ4FACHPAkAAnwUAId4CAACVBqYDIuQCQACfBQAh7wIBAJ4FACHwAgEAngUAIfECAQCqBQAhgAMAAJQGpQMiowMgAKwFACGmAyAArAUAIacDIACsBQAhqANAAKsFACEZCAAAnQYAIAsAAJsGACANAACZBgAgDgAAmgYAIA8AAJ8GACAWAACiBgAgFwAAnAYAIBoAAJcGACAbAACYBgAgHAAAlQkAIB0AAJ4GACAfAAChBgAgIAAAowYAIMwCAQCeBQAhzwJAAJ8FACHeAgAAlQamAyLkAkAAnwUAIe8CAQCeBQAh8AIBAJ4FACHxAgEAqgUAIYADAACUBqUDIqMDIACsBQAhpgMgAKwFACGnAyAArAUAIagDQACrBQAhGQgAAN8HACALAADdBwAgDQAA2wcAIA4AANwHACAPAADhBwAgFgAA5AcAIBcAAN4HACAbAADaBwAgHAAAngkAIB0AAOAHACAeAADiBwAgHwAA4wcAICAAAOUHACDMAgEAAAABzwJAAAAAAd4CAAAApgMC5AJAAAAAAe8CAQAAAAHwAgEAAAAB8QIBAAAAAYADAAAApQMCowMgAAAAAaYDIAAAAAGnAyAAAAABqANAAAAAAQIAAABGACAtAADLCgAgIQUAAMEIACAIAADCCAAgDQAAxAgAIA4AAMUIACAUAADGCAAgFQAAxwgAIBYAAMgIACAXAADJCAAgGAAA9wgAIBkAAMoIACDMAgEAAAABzwJAAAAAAeQCQAAAAAH4AgEAAAABgQMBAAAAAYIDAQAAAAGDAwEAAAABhAMCAAAAAYUDAQAAAAGGAwEAAAABhwMBAAAAAYgDAQAAAAGJAwEAAAABigMQAAAAAYsDEAAAAAGMAwIAAAABjQMCAAAAAY8DAAAAjwMCkAMgAAAAAZEDIAAAAAGSAwgAAAABkwMCAAAAAZQDAgAAAAECAAAADQAgLQAAzQoAIAMAAABEACAtAADLCgAgLgAA0QoAIBsAAABEACAIAACdBgAgCwAAmwYAIA0AAJkGACAOAACaBgAgDwAAnwYAIBYAAKIGACAXAACcBgAgGwAAmAYAIBwAAJUJACAdAACeBgAgHgAAoAYAIB8AAKEGACAgAACjBgAgJgAA0QoAIMwCAQCeBQAhzwJAAJ8FACHeAgAAlQamAyLkAkAAnwUAIe8CAQCeBQAh8AIBAJ4FACHxAgEAqgUAIYADAACUBqUDIqMDIACsBQAhpgMgAKwFACGnAyAArAUAIagDQACrBQAhGQgAAJ0GACALAACbBgAgDQAAmQYAIA4AAJoGACAPAACfBgAgFgAAogYAIBcAAJwGACAbAACYBgAgHAAAlQkAIB0AAJ4GACAeAACgBgAgHwAAoQYAICAAAKMGACDMAgEAngUAIc8CQACfBQAh3gIAAJUGpgMi5AJAAJ8FACHvAgEAngUAIfACAQCeBQAh8QIBAKoFACGAAwAAlAalAyKjAyAArAUAIaYDIACsBQAhpwMgAKwFACGoA0AAqwUAIQMAAAALACAtAADNCgAgLgAA1AoAICMAAAALACAFAACBBgAgCAAAggYAIA0AAIQGACAOAACFBgAgFAAAhgYAIBUAAIcGACAWAACIBgAgFwAAiQYAIBgAAOsIACAZAACKBgAgJgAA1AoAIMwCAQCeBQAhzwJAAJ8FACHkAkAAnwUAIfgCAQCeBQAhgQMBAJ4FACGCAwEAngUAIYMDAQCeBQAhhAMCAMkFACGFAwEAngUAIYYDAQCqBQAhhwMBAKoFACGIAwEAqgUAIYkDAQCqBQAhigMQAPwFACGLAxAA_AUAIYwDAgD9BQAhjQMCAP0FACGPAwAA_gWPAyKQAyAArAUAIZEDIACsBQAhkgMIAP8FACGTAwIAyQUAIZQDAgDJBQAhIQUAAIEGACAIAACCBgAgDQAAhAYAIA4AAIUGACAUAACGBgAgFQAAhwYAIBYAAIgGACAXAACJBgAgGAAA6wgAIBkAAIoGACDMAgEAngUAIc8CQACfBQAh5AJAAJ8FACH4AgEAngUAIYEDAQCeBQAhggMBAJ4FACGDAwEAngUAIYQDAgDJBQAhhQMBAJ4FACGGAwEAqgUAIYcDAQCqBQAhiAMBAKoFACGJAwEAqgUAIYoDEAD8BQAhiwMQAPwFACGMAwIA_QUAIY0DAgD9BQAhjwMAAP4FjwMikAMgAKwFACGRAyAArAUAIZIDCAD_BQAhkwMCAMkFACGUAwIAyQUAIQEHAAIPBAAWCFwHC1oJDVcIDlgKD2ENFmYQF1sSGgYDG1YUHFkEHWAVHmQOH2UMIGkBAgYABAcAAgwEABMFCgUIEwcJFAMNGAgOJQoUKQwVOREWPBAXQBIYQwkZRwICAw4EBAAGAQMPAAIGAAQHAAIDBgAEBwACCxoJBQMhBAQACwcAAgobCAwfCgMGAAQHAAILIAkDAyQACiIADCMAAwYABAcAAhIrDQQHAAIQLQ4RMgwTNBADBAAPBwACDzANAQ8xAAMGAAQHAAISNQ0BBgAEAgYABAcAAgsFSAAISQAJSgANSwAOTAAUTQAVTgAWTwAXUAAYUQAZUgABBwACAQcAAg0IcAANbAAObQAPcgAWdQAXbwAaagAbawAcbgAdcQAecwAfdAAgdgAAAQcAAgEHAAIDBAAbMwAcNAAdAAAAAwQAGzMAHDQAHQAAAwQAIjMAIzQAJAAAAAMEACIzACM0ACQBBwACAQcAAgMEACkzACo0ACsAAAADBAApMwAqNAArAQcAAgEHAAIDBAAwMwAxNAAyAAAAAwQAMDMAMTQAMgAAAAMEADgzADk0ADoAAAADBAA4MwA5NAA6AAADBAA_MwBANABBAAAAAwQAPzMAQDQAQQAABQQARjMASTQASpUBAEeWAQBIAAAAAAAFBABGMwBJNABKlQEAR5YBAEgBBgAEAQYABAMEAE8zAFA0AFEAAAADBABPMwBQNABRBAcAAhCzAg4RtAIME7UCEAQHAAIQuwIOEbwCDBO9AhAFBABWMwBZNABalQEAV5YBAFgAAAAAAAUEAFYzAFk0AFqVAQBXlgEAWAIGAAQHAAICBgAEBwACAwQAXzMAYDQAYQAAAAMEAF8zAGA0AGECBgAEBwACAgYABAcAAgMEAGYzAGc0AGgAAAADBABmMwBnNABoAQcAAgEHAAIDBABtMwBuNABvAAAAAwQAbTMAbjQAbwMGAAQHAAILkQMJAwYABAcAAguXAwkDBAB0MwB1NAB2AAAAAwQAdDMAdTQAdgMGAAQHAAILqQMJAwYABAcAAguvAwkDBAB7MwB8NAB9AAAAAwQAezMAfDQAfQIGAAQHAAICBgAEBwACBQQAggEzAIUBNACGAZUBAIMBlgEAhAEAAAAAAAUEAIIBMwCFATQAhgGVAQCDAZYBAIQBAgYABAcAAgIGAAQHAAIFBACLATMAjgE0AI8BlQEAjAGWAQCNAQAAAAAABQQAiwEzAI4BNACPAZUBAIwBlgEAjQEBBwACAQcAAgMEAJQBMwCVATQAlgEAAAADBACUATMAlQE0AJYBAgYABAcAAgIGAAQHAAIDBACbATMAnAE0AJ0BAAAAAwQAmwEzAJwBNACdASECASJ3ASN4ASR5ASV6ASd8ASh-Fyl_GCqBAQErgwEXLIQBGS-FAQEwhgEBMYcBFzWKARo2iwEeN4wBAjiNAQI5jgECOo8BAjuQAQI8kgECPZQBFz6VAR8_lwECQJkBF0GaASBCmwECQ5wBAkSdARdFoAEhRqEBJUeiARVIowEVSaQBFUqlARVLpgEVTKgBFU2qARdOqwEmT60BFVCvARdRsAEnUrEBFVOyARVUswEXVbYBKFa3ASxXuAEUWLkBFFm6ARRauwEUW7wBFFy-ARRdwAEXXsEBLV_DARRgxQEXYcYBLmLHARRjyAEUZMkBF2XMAS9mzQEzZ88BNGjQATRp0wE0atQBNGvVATRs1wE0bdkBF27aATVv3AE0cN4BF3HfATZy4AE0c-EBNHTiARd15QE3duYBO3fnAQV46AEFeekBBXrqAQV76wEFfO0BBX3vARd-8AE8f_IBBYAB9AEXgQH1AT2CAfYBBYMB9wEFhAH4AReFAfsBPoYB_AFChwH9AQSIAf4BBIkB_wEEigGAAgSLAYECBIwBgwIEjQGFAheOAYYCQ48BiAIEkAGKAheRAYsCRJIBjAIEkwGNAgSUAY4CF5cBkQJFmAGSAkuZAZMCEZoBlAIRmwGVAhGcAZYCEZ0BlwIRngGZAhGfAZsCF6ABnAJMoQGeAhGiAaACF6MBoQJNpAGiAhGlAaMCEaYBpAIXpwGnAk6oAagCUqkBqQINqgGqAg2rAasCDawBrAINrQGtAg2uAa8CDa8BsQIXsAGyAlOxAbcCDbIBuQIXswG6AlS0Ab4CDbUBvwINtgHAAhe3AcMCVbgBxAJbuQHFAgy6AcYCDLsBxwIMvAHIAgy9AckCDL4BywIMvwHNAhfAAc4CXMEB0AIMwgHSAhfDAdMCXcQB1AIMxQHVAgzGAdYCF8cB2QJeyAHaAmLJAdsCEMoB3AIQywHdAhDMAd4CEM0B3wIQzgHhAhDPAeMCF9AB5AJj0QHmAhDSAegCF9MB6QJk1AHqAhDVAesCENYB7AIX1wHvAmXYAfACadkB8QIJ2gHyAgnbAfMCCdwB9AIJ3QH1AgneAfcCCd8B-QIX4AH6AmrhAfwCCeIB_gIX4wH_AmvkAYADCeUBgQMJ5gGCAxfnAYUDbOgBhgNw6QGHAwjqAYgDCOsBiQMI7AGKAwjtAYsDCO4BjQMI7wGPAxfwAZADcfEBkwMI8gGVAxfzAZYDcvQBmAMI9QGZAwj2AZoDF_cBnQNz-AGeA3f5AZ8DCvoBoAMK-wGhAwr8AaIDCv0BowMK_gGlAwr_AacDF4ACqAN4gQKrAwqCAq0DF4MCrgN5hAKwAwqFArEDCoYCsgMXhwK1A3qIArYDfokCtwMSigK4AxKLArkDEowCugMSjQK7AxKOAr0DEo8CvwMXkALAA3-RAsIDEpICxAMXkwLFA4ABlALGAxKVAscDEpYCyAMXlwLLA4EBmALMA4cBmQLNAweaAs4DB5sCzwMHnALQAwedAtEDB54C0wMHnwLVAxegAtYDiAGhAtgDB6IC2gMXowLbA4kBpALcAwelAt0DB6YC3gMXpwLhA4oBqALiA5ABqQLjAw6qAuQDDqsC5QMOrALmAw6tAucDDq4C6QMOrwLrAxewAuwDkQGxAu4DDrIC8AMXswLxA5IBtALyAw61AvMDDrYC9AMXtwL3A5MBuAL4A5cBuQL5AwO6AvoDA7sC-wMDvAL8AwO9Av0DA74C_wMDvwKBBBfAAoIEmAHBAoQEA8IChgQXwwKHBJkBxAKIBAPFAokEA8YCigQXxwKNBJoByAKOBJ4B"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AdminScalarFieldEnum: () => AdminScalarFieldEnum,
  AnyNull: () => AnyNull2,
  BookmarkScalarFieldEnum: () => BookmarkScalarFieldEnum,
  CastMemberScalarFieldEnum: () => CastMemberScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  FavoriteScalarFieldEnum: () => FavoriteScalarFieldEnum,
  GenreScalarFieldEnum: () => GenreScalarFieldEnum,
  JsonNull: () => JsonNull2,
  MediaPurchaseScalarFieldEnum: () => MediaPurchaseScalarFieldEnum,
  MediaScalarFieldEnum: () => MediaScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProfileScalarFieldEnum: () => ProfileScalarFieldEnum,
  QueryMode: () => QueryMode,
  RatingScalarFieldEnum: () => RatingScalarFieldEnum,
  RentalScalarFieldEnum: () => RentalScalarFieldEnum,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  SubscriptionScalarFieldEnum: () => SubscriptionScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  WatchListScalarFieldEnum: () => WatchListScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.7.0",
  engine: "75cbdc1eb7150937890ad5465d861175c6624711"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  Admin: "Admin",
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Genre: "Genre",
  Media: "Media",
  CastMember: "CastMember",
  Payment: "Payment",
  MediaPurchase: "MediaPurchase",
  Rental: "Rental",
  Profile: "Profile",
  Bookmark: "Bookmark",
  Favorite: "Favorite",
  Rating: "Rating",
  Review: "Review",
  Subscription: "Subscription",
  WatchList: "WatchList"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var AdminScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  profilePhoto: "profilePhoto",
  contactNumber: "contactNumber",
  isDeleted: "isDeleted",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  deletedAt: "deletedAt",
  userId: "userId"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  role: "role",
  status: "status",
  needPasswordChange: "needPasswordChange",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var GenreScalarFieldEnum = {
  id: "id",
  name: "name"
};
var MediaScalarFieldEnum = {
  id: "id",
  title: "title",
  slug: "slug",
  type: "type",
  description: "description",
  releaseYear: "releaseYear",
  director: "director",
  posterUrl: "posterUrl",
  backdropUrl: "backdropUrl",
  trailerUrl: "trailerUrl",
  streamingUrl: "streamingUrl",
  rentalPrice: "rentalPrice",
  buyPrice: "buyPrice",
  runtimeMinutes: "runtimeMinutes",
  seasons: "seasons",
  pricing: "pricing",
  isPublished: "isPublished",
  isFeatured: "isFeatured",
  avgRating: "avgRating",
  reviewCount: "reviewCount",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  viewCount: "viewCount"
};
var CastMemberScalarFieldEnum = {
  id: "id",
  name: "name",
  role: "role",
  image: "image",
  mediaId: "mediaId"
};
var PaymentScalarFieldEnum = {
  id: "id",
  subscriptionId: "subscriptionId",
  userId: "userId",
  amount: "amount",
  currency: "currency",
  stripePaymentId: "stripePaymentId",
  status: "status",
  mediaPurchaseId: "mediaPurchaseId",
  createdAt: "createdAt",
  rentalId: "rentalId"
};
var MediaPurchaseScalarFieldEnum = {
  id: "id",
  userId: "userId",
  mediaId: "mediaId",
  type: "type",
  status: "status",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var RentalScalarFieldEnum = {
  id: "id",
  userId: "userId",
  mediaId: "mediaId",
  status: "status",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  name: "name",
  email: "email",
  image: "image",
  bio: "bio",
  avatar: "avatar",
  coverImage: "coverImage",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var BookmarkScalarFieldEnum = {
  id: "id",
  userId: "userId",
  mediaId: "mediaId",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  profileId: "profileId"
};
var FavoriteScalarFieldEnum = {
  id: "id",
  userId: "userId",
  mediaId: "mediaId",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  profileId: "profileId"
};
var RatingScalarFieldEnum = {
  id: "id",
  score: "score",
  createdAt: "createdAt",
  userId: "userId",
  mediaId: "mediaId"
};
var ReviewScalarFieldEnum = {
  id: "id",
  content: "content",
  rating: "rating",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  userId: "userId",
  mediaId: "mediaId",
  tags: "tags",
  hasSpoiler: "hasSpoiler"
};
var SubscriptionScalarFieldEnum = {
  id: "id",
  userId: "userId",
  plan: "plan",
  status: "status",
  stripeCustomerId: "stripeCustomerId",
  stripePriceId: "stripePriceId",
  currentPeriodStart: "currentPeriodStart",
  currentPeriodEnd: "currentPeriodEnd",
  cancelAtPeriodEnd: "cancelAtPeriodEnd",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var WatchListScalarFieldEnum = {
  id: "id",
  userId: "userId",
  mediaId: "mediaId",
  createdAt: "createdAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/enums.ts
var Role = {
  ADMIN: "ADMIN",
  USER: "USER"
};
var UserStatus = {
  BLOCKED: "BLOCKED",
  DELETED: "DELETED",
  ACTIVE: "ACTIVE",
  PENDING: "PENDING",
  UNVERIFIED: "UNVERIFIED"
};
var ReviewStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  UNPUBLISHED: "UNPUBLISHED"
};
var MediaPurchaseType = {
  RENTAL: "RENTAL",
  BUY: "BUY"
};
var MediaPurchaseStatus = {
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED"
};
var SubscriptionPlan = {
  FREE: "FREE",
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY"
};
var SubscriptionStatus = {
  ACTIVE: "ACTIVE",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
  PAST_DUE: "PAST_DUE"
};

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/lib/prisma.ts
var connectionString = process.env.DATABASE_URL;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app/utils/email.ts
import path2 from "path";
import nodemailer from "nodemailer";
import ejs from "ejs";
var transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  secure: true,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS
  },
  port: Number(envVars.EMAIL_SENDER.SMTP_PORT)
});
var sendEmail = async ({ subject, templateData, templateName, to, attachments }) => {
  try {
    const templatePath = path2.resolve(process.cwd(), `src/app/templates/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType
      }))
    });
    console.log(`Email sent to ${to} : ${info.messageId}`);
  } catch (error) {
    console.log("Email Sending Error", error.message);
  }
};

// src/app/lib/auth.ts
import { bearer, emailOTP } from "better-auth/plugins";
var auth = betterAuth({
  appName: "CinemaTube",
  baseURL: envVars.BETTER_AUTH_URL,
  secret: envVars.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.USER
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE
      },
      needPasswordChange: {
        type: "boolean",
        required: true,
        defaultValue: false
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true
  },
  socialProviders: {
    google: {
      clientId: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      mapProfileToUser: () => {
        return {
          role: Role.USER,
          status: UserStatus.ACTIVE,
          needPasswordChange: false,
          isDeleted: false,
          deletedAt: null
        };
      }
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true
  },
  session: {
    expiresIn: 60 * 60 * 60 * 24,
    // 1 day in seconds
    updateAge: 60 * 60 * 60 * 24,
    // 1 day in seconds
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 60 * 24
      // 1 day in seconds
    }
  },
  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          const user = await prisma.user.findUnique({
            where: {
              email
            }
          });
          if (!user) {
            console.error(
              `User with email ${email} not found. Cannot send verification OTP.`
            );
            return;
          }
          if (user && !user.emailVerified) {
            sendEmail({
              to: email,
              subject: "Verify your email",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp,
                expires: 2 * 60
                // 2 minutes in seconds
              }
            });
          }
        } else if (type === "forget-password") {
          const user = await prisma.user.findUnique({
            where: {
              email
            }
          });
          if (user) {
            sendEmail({
              to: email,
              subject: "Password Reset OTP",
              templateName: "reset",
              templateData: {
                name: user.name,
                otp
              }
            });
          }
        }
      },
      expiresIn: 2 * 60,
      // 2 minutes in seconds
      otpLength: 6
    })
  ],
  trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:5000", envVars.FRONTEND_URL],
  advanced: {
    useSecureCookies: false,
    cookies: {
      state: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/"
        }
      },
      sessionToken: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/"
        }
      }
    }
  }
});

// src/app/routes/index.ts
import { Router as Router11 } from "express";

// src/app/modules/auth/auth.route.ts
import { Router } from "express";

// src/app/middlewares/validateRequest.ts
var validateRequest = (zodSchema) => {
  return (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    const parsedResult = zodSchema.safeParse(req.body);
    if (!parsedResult.success) {
      next(parsedResult.error);
    }
    req.body = parsedResult.data;
    next();
  };
};

// src/app/modules/shared/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch",
        error: error.message
      });
    }
  };
};

// src/app/utils/cookie.ts
var setCookie = (res, key, value, options) => {
  return res.cookie(key, value, options);
};
var getCookie = (req, key) => {
  return req.cookies[key];
};
var clearCookie = (res, key, options) => {
  return res.clearCookie(key, options);
};
var CookieUtils = {
  setCookie,
  getCookie,
  clearCookie
};

// src/app/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, { expiresIn }) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return {
      success: true,
      data: decoded
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error
    };
  }
};
var decodeToken = (token) => {
  const decoded = jwt.decode(token);
  return decoded;
};
var jwtUtils = {
  createToken,
  verifyToken,
  decodeToken
};

// src/app/utils/token.ts
var getAccessToken = (payload) => {
  const accessToken = jwtUtils.createToken(
    payload,
    envVars.ACCESS_TOKEN_SECRET,
    { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN }
  );
  return accessToken;
};
var getRefreshToken = async (payload) => {
  const refreshToken = jwtUtils.createToken(
    payload,
    envVars.REFRESH_TOKEN_SECRET,
    { expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN }
  );
  return refreshToken;
};
var setAccessTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //1 day
    maxAge: 60 * 60 * 24 * 1e3
  });
};
var setRefreshTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //7d
    maxAge: 60 * 60 * 24 * 1e3 * 7
  });
};
var setBetterAuthSessionCookie = (res, token) => {
  CookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //1 day
    maxAge: 60 * 60 * 24 * 1e3
  });
};
var tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie
};

// src/app/modules/shared/sendResponse.ts
var sendResponse = (res, responseData) => {
  const { httpStatusCode, success, message, data, meta } = responseData;
  res.status(httpStatusCode).json({
    success,
    message,
    data,
    meta
  });
};

// src/app/modules/auth/auth.service.ts
import status from "http-status";

// src/app/errorHelpers/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var AppError_default = AppError;

// src/app/modules/auth/auth.service.ts
var registerUser = async (payload) => {
  const { name, email, password, role, acceptTerms, rememberMe } = payload;
  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password
    }
  });
  if (!data.user?.id) {
    throw new AppError_default(status.FORBIDDEN, "User not created by auth service");
  }
  try {
    const accessToken = tokenUtils.getAccessToken({
      userId: data.user.id,
      role: data.user.role,
      email: data.user.email,
      name: data.user.name,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified
    });
    const refreshToken = tokenUtils.getRefreshToken({
      userId: data.user.id,
      role: data.user.role,
      email: data.user.email,
      name: data.user.name,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified
    });
    return { ...data, accessToken, refreshToken };
  } catch (err) {
    console.log("Register Transition Error", err);
    const userExists = await prisma.user.findUnique({
      where: {
        id: data.user.id
      }
    });
    if (userExists) {
      await prisma.user.delete({
        where: {
          id: userExists.id
        }
      });
    }
    throw new AppError_default(status.FORBIDDEN, "User not created");
  }
};
var loginUser = async (payload) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({
    body: {
      email,
      password
    }
  });
  if (data.user.status === UserStatus.BLOCKED) {
    throw new AppError_default(status.FORBIDDEN, "User is blocked");
  }
  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    throw new AppError_default(status.NOT_FOUND, "User is deleted");
  }
  const accessToken = await tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  const refreshToken = await tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  return { ...data, accessToken, refreshToken };
};
var getMe = async (user) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: user.userId
    },
    include: {
      profile: true,
      favorites: true,
      ratings: true,
      reviews: true,
      watchList: true,
      bookmarks: true,
      subscriptions: true,
      _count: {
        select: {
          favorites: true,
          ratings: true,
          reviews: true,
          watchList: true,
          bookmarks: true,
          subscriptions: true
        }
      }
    }
  });
  if (!isUserExists) {
    throw new AppError_default(status.NOT_FOUND, "User not found");
  }
  return isUserExists;
};
var getNewToken = async (refreshToken, sessionToken) => {
  const isSessionExist = await prisma.session.findUnique({
    where: {
      token: sessionToken
    },
    include: {
      user: true
    }
  });
  if (!isSessionExist) {
    throw new AppError_default(status.UNAUTHORIZED, "Invalid session token");
  }
  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    envVars.REFRESH_TOKEN_SECRET
  );
  if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
    throw new AppError_default(status.UNAUTHORIZED, "Invalid refresh token");
  }
  const data = verifiedRefreshToken.data;
  const newAccessToken = tokenUtils.getAccessToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified
  });
  const newRefreshToken = tokenUtils.getRefreshToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified
  });
  const { token } = await prisma.session.update({
    where: {
      token: sessionToken
    },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1e3),
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionToken: token
  };
};
var changePassword = async (payload, sessionToken) => {
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (!session) {
    throw new AppError_default(status.UNAUTHORIZED, "Invalid session token");
  }
  const { currentPassword, newPassword } = payload;
  const result = await auth.api.changePassword({
    body: {
      currentPassword,
      newPassword,
      revokeOtherSessions: true
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (session.user.needPasswordChange) {
    await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: {
        needPasswordChange: false
      }
    });
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified
  });
  return {
    ...result,
    accessToken,
    refreshToken
  };
};
var logOut = async (sessionToken) => {
  const result = await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  return result;
};
var verifyEmail = async (email, otp) => {
  const result = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp
    }
  });
  if (result.status && !result.user.emailVerified) {
    await prisma.user.update({
      where: {
        email
      },
      data: {
        emailVerified: true
      }
    });
  }
  return result;
};
var forgetPassword = async (email) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExist) {
    throw new AppError_default(status.NOT_FOUND, "User not found");
  }
  if (!isUserExist.emailVerified) {
    throw new AppError_default(status.BAD_REQUEST, "Email not verified");
  }
  if (isUserExist.isDeleted || isUserExist.status === UserStatus.DELETED) {
    throw new AppError_default(status.NOT_FOUND, "User not found");
  }
  await auth.api.requestPasswordResetEmailOTP({
    body: {
      email
    }
  });
};
var resetPassword = async (email, otp, newPassword) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExist) {
    throw new AppError_default(status.NOT_FOUND, "User not found");
  }
  if (!isUserExist.emailVerified) {
    throw new AppError_default(status.BAD_REQUEST, "Email not verified");
  }
  if (isUserExist.isDeleted || isUserExist.status === UserStatus.DELETED) {
    throw new AppError_default(status.NOT_FOUND, "User not found");
  }
  await auth.api.resetPasswordEmailOTP({
    body: {
      email,
      otp,
      password: newPassword
    }
  });
  if (isUserExist.needPasswordChange) {
    await prisma.user.update({
      where: {
        id: isUserExist.id
      },
      data: {
        needPasswordChange: false
      }
    });
  }
  await prisma.session.deleteMany({
    where: {
      userId: isUserExist.id
    }
  });
};
var googleLoginSuccess = async (session) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: session.user.id
    }
  });
  if (!isUserExists) {
    await prisma.user.create({
      data: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email
      }
    });
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name
  });
  return {
    accessToken,
    refreshToken
  };
};
var authService = {
  registerUser,
  logOut,
  loginUser,
  getMe,
  getNewToken,
  changePassword,
  verifyEmail,
  forgetPassword,
  resetPassword,
  googleLoginSuccess
};

// src/app/modules/auth/auth.controller.ts
import status2 from "http-status";
var register = catchAsync(async (req, res) => {
  const result = await authService.registerUser(req.body);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, await refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status2.OK,
    success: true,
    message: "User registered successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest
    }
  });
});
var login = catchAsync(async (req, res) => {
  const result = await authService.loginUser(req.body);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status2.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest
    }
  });
});
var logout = catchAsync(async (req, res) => {
  const betterAuthToken = req.cookies["better-auth.session_token"];
  const result = await authService.logOut(betterAuthToken);
  CookieUtils.clearCookie(res, "accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  CookieUtils.clearCookie(res, "refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  CookieUtils.clearCookie(res, "better-auth.session_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  sendResponse(res, {
    httpStatusCode: status2.OK,
    success: true,
    message: "User logged out successfully",
    data: result
  });
});
var forgotPassword = catchAsync(async (req, res) => {
  const result = await authService.forgetPassword(req.body.email);
  sendResponse(res, {
    httpStatusCode: status2.OK,
    success: true,
    message: "Forgot password successfully",
    data: result
  });
});
var resetPassword2 = catchAsync(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const result = await authService.resetPassword(email, newPassword, otp);
  sendResponse(res, {
    httpStatusCode: status2.OK,
    success: true,
    message: "Reset password successfully",
    data: result
  });
});
var changePassword2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const sessionToken = req.cookies["better-auth.session_token"];
  const result = await authService.changePassword(payload, sessionToken);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, await refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status2.OK,
    success: true,
    message: "Password changed successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest
    }
  });
});
var verifyEmail2 = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  const result = await authService.verifyEmail(email, otp);
  sendResponse(res, {
    httpStatusCode: status2.OK,
    success: true,
    message: "Email verified successfully",
    data: result
  });
});
var sendVerifyOtp = catchAsync(async (req, res) => {
  const { email, type } = req.body;
  const result = await authService.verifyEmail(email, type);
  sendResponse(res, {
    httpStatusCode: status2.OK,
    success: true,
    message: "Verify otp sent successfully",
    data: result
  });
});
var getMe2 = catchAsync(async (req, res) => {
  const result = await authService.getMe(req.user);
  sendResponse(res, {
    httpStatusCode: status2.OK,
    success: true,
    message: "User fetched successfully",
    data: result
  });
});
var getNewToken2 = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const betterAuthToken = req.cookies["better-auth.session_token"];
  if (!refreshToken) {
    throw new AppError_default(status2.UNAUTHORIZED, "Refresh token not found");
  }
  const result = await authService.getNewToken(refreshToken, betterAuthToken);
  const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, await newRefreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, sessionToken);
  sendResponse(res, {
    httpStatusCode: status2.OK,
    success: true,
    message: "New token generated successfully",
    data: {
      sessionToken,
      accessToken,
      refreshToken: newRefreshToken
    }
  });
});
var googleLogin = catchAsync(async (req, res) => {
  const redirectPath = req.query.redirect || "/";
  const encodedRedirectPath = encodeURIComponent(redirectPath);
  const callbackUrl = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;
  res.render("googleRedirect", {
    callbackURL: callbackUrl,
    betterAuthUrl: envVars.BETTER_AUTH_URL
  });
});
var googleSuccess = catchAsync(async (req, res) => {
  const redirectPath = req.query.redirect || "/";
  const sessionToken = req.cookies["better-auth.session_token"];
  if (!sessionToken) {
    return res.redirect(`${envVars.BETTER_AUTH_URL}/login?error=oauth_failed`);
  }
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (!session) {
    return res.redirect(
      `${envVars.BETTER_AUTH_URL}/login?error=no_session_found`
    );
  }
  if (session && !session.user) {
    return res.redirect(`${envVars.BETTER_AUTH_URL}/login?error=no_user_found`);
  }
  const result = await authService.googleLoginSuccess(session);
  const { accessToken, refreshToken } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, await refreshToken);
  const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
  const finalRedirectPath = isValidRedirectPath ? redirectPath : "/";
  res.redirect(`${envVars.FRONTEND_URL}${finalRedirectPath}`);
});
var handleOAuthError = catchAsync((req, res) => {
  const error = req.query.error || "oauth_failed";
  res.redirect(`${envVars.FRONTEND_URL}/login?error=${error}`);
});
var AuthController = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword: resetPassword2,
  changePassword: changePassword2,
  verifyEmail: verifyEmail2,
  getMe: getMe2,
  getNewToken: getNewToken2,
  handleOAuthError,
  googleLogin,
  googleSuccess,
  sendVerifyOtp
};

// src/app/modules/auth/auth.validate.ts
import z from "zod";
var loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters long").regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
  )
});
var registerSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
  // ),
  name: z.string("Name is required").min(3, "Name must be at least 3 characters long"),
  role: z.enum(["USER", "ADMIN"], "Role is required"),
  acceptTerms: z.boolean("Accept Terms and Condition must be true"),
  rememberMe: z.boolean().optional()
});
var changePasswordSchema = z.object({
  oldPassword: z.string().min(6, "Password must be at least 6 characters long"),
  newPassword: z.string().min(6, "Password must be at least 6 characters long")
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
  // ),
});
var forgotPasswordSchema = z.object({
  email: z.email("Invalid email")
});
var resetPasswordSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
  // ),
  token: z.string("Token is required")
});
var verifyEmailSchema = z.object({
  email: z.email("Invalid email"),
  otp: z.string("OTP is required")
});
var sendVerifyOtpSchema = z.object({
  email: z.email("Invalid email"),
  type: z.enum(
    ["sign-in", "email-verification", "forget-password", "change-email"],
    "Type is required"
  )
});
var AuthValidation = {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  sendVerifyOtpSchema
};

// src/app/middlewares/checkAuth.ts
import status3 from "http-status";
var checkAuth = (...authRoles) => async (req, res, next) => {
  try {
    const sessionToken = CookieUtils.getCookie(req, "better-auth.session_token");
    if (!sessionToken) {
      throw new Error("Unauthorized access! No session token provided.");
    }
    if (sessionToken) {
      const sessionExists = await prisma.session.findFirst({
        where: {
          token: sessionToken,
          expiresAt: {
            gt: /* @__PURE__ */ new Date()
          }
        },
        include: {
          user: true
        }
      });
      if (sessionExists && sessionExists.user) {
        const user = sessionExists.user;
        const now = /* @__PURE__ */ new Date();
        const expiresAt = new Date(sessionExists.expiresAt);
        const createdAt = new Date(sessionExists.createdAt);
        const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
        const timeRemaining = expiresAt.getTime() - now.getTime();
        const percentRemaining = timeRemaining / sessionLifeTime * 100;
        if (percentRemaining < 20) {
          res.setHeader("X-Session-Refresh", "true");
          res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
          res.setHeader("X-Time-Remaining", timeRemaining.toString());
          console.log("Session Expiring Soon!!");
        }
        if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
          throw new AppError_default(status3.UNAUTHORIZED, "Unauthorized access! User is not active.");
        }
        if (user.isDeleted) {
          throw new AppError_default(status3.UNAUTHORIZED, "Unauthorized access! User is deleted.");
        }
        if (authRoles.length > 0 && !authRoles.includes(user.role)) {
          throw new AppError_default(status3.FORBIDDEN, "Forbidden access! You do not have permission to access this resource.");
        }
        req.user = {
          userId: user.id,
          role: user.role,
          email: user.email,
          status: user.status,
          name: user.name,
          isDeleted: user.isDeleted
        };
      }
      const accessToken2 = CookieUtils.getCookie(req, "accessToken");
      if (!accessToken2) {
        throw new AppError_default(status3.UNAUTHORIZED, "Unauthorized access! No access token provided.");
      }
    }
    const accessToken = CookieUtils.getCookie(req, "accessToken");
    if (!accessToken) {
      throw new AppError_default(status3.UNAUTHORIZED, "Unauthorized access! No access token provided.");
    }
    const verifiedToken = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);
    if (!verifiedToken.success) {
      throw new AppError_default(status3.UNAUTHORIZED, "Unauthorized access! Invalid access token.");
    }
    if (authRoles.length > 0 && !authRoles.includes(verifiedToken.data.role)) {
      throw new AppError_default(status3.FORBIDDEN, "Forbidden access! You do not have permission to access this resource.");
    }
    next();
  } catch (error) {
    next(error);
  }
};

// src/app/modules/auth/auth.route.ts
var router = Router();
router.post(
  "/register",
  // validateRequest(AuthValidation.registerSchema),
  AuthController.register
);
router.post(
  "/login",
  // validateRequest(AuthValidation.loginSchema),
  AuthController.login
);
router.post("/logout", checkAuth(Role.USER, Role.ADMIN), AuthController.logout);
router.get("/me", checkAuth(Role.USER, Role.ADMIN), AuthController.getMe);
router.post("/refresh-token", AuthController.getNewToken);
router.post(
  "/change-password",
  checkAuth(Role.USER, Role.ADMIN),
  validateRequest(AuthValidation.changePasswordSchema),
  AuthController.changePassword
);
router.post(
  "/forgot-password",
  validateRequest(AuthValidation.forgotPasswordSchema),
  AuthController.forgotPassword
);
router.post(
  "/reset-password",
  validateRequest(AuthValidation.resetPasswordSchema),
  AuthController.resetPassword
);
router.post(
  "/verify-email",
  validateRequest(AuthValidation.verifyEmailSchema),
  AuthController.verifyEmail
);
router.post(
  "/send-verify-otp",
  validateRequest(AuthValidation.sendVerifyOtpSchema),
  AuthController.sendVerifyOtp
);
router.get("/login/google", AuthController.googleLogin);
router.get("/google/success", AuthController.googleSuccess);
router.get("/oauth/error", AuthController.handleOAuthError);
var authRoutes = router;

// src/app/modules/user/user.routes.ts
import { Router as Router2 } from "express";

// src/app/modules/user/user.controller.ts
import status5 from "http-status";

// src/app/modules/user/user.service.ts
import status4 from "http-status";

// src/app/utils/QueryBuilder.ts
var QueryBuilder = class {
  constructor(model, queryParams, config2 = {}) {
    this.model = model;
    this.queryParams = queryParams;
    this.config = config2;
    this.query = {
      where: {},
      include: {},
      orderBy: {},
      skip: 0,
      take: 10
    };
    this.countQuery = {
      where: {}
    };
  }
  query;
  countQuery;
  page = 1;
  limit = 10;
  skip = 0;
  sortBy = "createdAt";
  sortOrder = "desc";
  selectFields;
  search() {
    const { searchTerm } = this.queryParams;
    const { searchableFields } = this.config;
    if (searchTerm && searchableFields && searchableFields.length > 0) {
      const searchConditions = searchableFields.map(
        (field) => {
          if (field.includes(".")) {
            const parts = field.split(".");
            if (parts.length === 2) {
              const [relation, nestedField] = parts;
              const stringFilter2 = {
                contains: searchTerm,
                mode: "insensitive"
              };
              return {
                [relation]: {
                  [nestedField]: stringFilter2
                }
              };
            } else if (parts.length === 3) {
              const [relation, nestedRelation, nestedField] = parts;
              const stringFilter2 = {
                contains: searchTerm,
                mode: "insensitive"
              };
              return {
                [relation]: {
                  some: {
                    [nestedRelation]: {
                      [nestedField]: stringFilter2
                    }
                  }
                }
              };
            }
          }
          const stringFilter = {
            contains: searchTerm,
            mode: "insensitive"
          };
          return {
            [field]: stringFilter
          };
        }
      );
      const whereConditions = this.query.where;
      whereConditions.OR = searchConditions;
      const countWhereConditions = this.countQuery.where;
      countWhereConditions.OR = searchConditions;
    }
    return this;
  }
  // /doctors?searchTerm=john&page=1&sortBy=name&specialty=cardiology&appointmentFee[lt]=100 => {}
  // { specialty: 'cardiology', appointmentFee: { lt: '100' } }
  filter() {
    const { filterableFields } = this.config;
    const excludedField = [
      "searchTerm",
      "page",
      "limit",
      "sortBy",
      "sortOrder",
      "fields",
      "include"
    ];
    const filterParams = {};
    Object.keys(this.queryParams).forEach((key) => {
      if (!excludedField.includes(key)) {
        filterParams[key] = this.queryParams[key];
      }
    });
    const queryWhere = this.query.where;
    const countQueryWhere = this.countQuery.where;
    Object.keys(filterParams).forEach((key) => {
      const value = filterParams[key];
      if (value === void 0 || value === "") {
        return;
      }
      const isAllowedField = !filterableFields || filterableFields.length === 0 || filterableFields.includes(key);
      if (key.includes(".")) {
        const parts = key.split(".");
        if (filterableFields && !filterableFields.includes(key)) {
          return;
        }
        if (parts.length === 2) {
          const [relation, nestedField] = parts;
          if (!queryWhere[relation]) {
            queryWhere[relation] = {};
            countQueryWhere[relation] = {};
          }
          const queryRelation = queryWhere[relation];
          const countRelation = countQueryWhere[relation];
          queryRelation[nestedField] = this.parseFilterValue(value);
          countRelation[nestedField] = this.parseFilterValue(value);
          return;
        } else if (parts.length === 3) {
          const [relation, nestedRelation, nestedField] = parts;
          if (!queryWhere[relation]) {
            queryWhere[relation] = {
              some: {}
            };
            countQueryWhere[relation] = {
              some: {}
            };
          }
          const queryRelation = queryWhere[relation];
          const countRelation = countQueryWhere[relation];
          if (!queryRelation.some) {
            queryRelation.some = {};
          }
          if (!countRelation.some) {
            countRelation.some = {};
          }
          const querySome = queryRelation.some;
          const countSome = countRelation.some;
          if (!querySome[nestedRelation]) {
            querySome[nestedRelation] = {};
          }
          if (!countSome[nestedRelation]) {
            countSome[nestedRelation] = {};
          }
          const queryNestedRelation = querySome[nestedRelation];
          const countNestedRelation = countSome[nestedRelation];
          queryNestedRelation[nestedField] = this.parseFilterValue(value);
          countNestedRelation[nestedField] = this.parseFilterValue(value);
          return;
        }
      }
      if (!isAllowedField) {
        return;
      }
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        queryWhere[key] = this.parseRangeFilter(
          value
        );
        countQueryWhere[key] = this.parseRangeFilter(
          value
        );
        return;
      }
      queryWhere[key] = this.parseFilterValue(value);
      countQueryWhere[key] = this.parseFilterValue(value);
    });
    return this;
  }
  paginate() {
    const page = Number(this.queryParams.page) || 1;
    const limit = Number(this.queryParams.limit) || 10;
    this.page = page;
    this.limit = limit;
    this.skip = (page - 1) * limit;
    this.query.skip = this.skip;
    this.query.take = this.limit;
    return this;
  }
  sort() {
    const sortBy = this.queryParams.sortBy || "createdAt";
    const sortOrder = this.queryParams.sortOrder === "asc" ? "asc" : "desc";
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;
    if (sortBy.includes(".")) {
      const parts = sortBy.split(".");
      if (parts.length === 2) {
        const [relation, nestedField] = parts;
        this.query.orderBy = {
          [relation]: {
            [nestedField]: sortOrder
          }
        };
      } else if (parts.length === 3) {
        const [relation, nestedRelation, nestedField] = parts;
        this.query.orderBy = {
          [relation]: {
            [nestedRelation]: {
              [nestedField]: sortOrder
            }
          }
        };
      } else {
        this.query.orderBy = {
          [sortBy]: sortOrder
        };
      }
    } else {
      this.query.orderBy = {
        [sortBy]: sortOrder
      };
    }
    return this;
  }
  fields() {
    const fieldsParam = this.queryParams.fields;
    if (fieldsParam && typeof fieldsParam === "string") {
      const fieldsArray = fieldsParam?.split(",").map((field) => field.trim());
      this.selectFields = {};
      fieldsArray?.forEach((field) => {
        if (this.selectFields) {
          this.selectFields[field] = true;
        }
      });
      this.query.select = this.selectFields;
      delete this.query.include;
    }
    return this;
  }
  include(relation) {
    if (this.selectFields) {
      return this;
    }
    this.query.include = {
      ...this.query.include,
      ...relation
    };
    return this;
  }
  dynamicInclude(includeConfig, defaultInclude) {
    if (this.selectFields) {
      return this;
    }
    const result = {};
    defaultInclude?.forEach((field) => {
      if (includeConfig[field]) {
        result[field] = includeConfig[field];
      }
    });
    const includeParam = this.queryParams.include;
    if (includeParam && typeof includeParam === "string") {
      const requestedRelations = includeParam.split(",").map((relation) => relation.trim());
      requestedRelations.forEach((relation) => {
        if (includeConfig[relation]) {
          result[relation] = includeConfig[relation];
        }
      });
    }
    this.query.include = {
      ...this.query.include,
      ...result
    };
    return this;
  }
  where(condition) {
    this.query.where = this.deepMerge(
      this.query.where,
      condition
    );
    this.countQuery.where = this.deepMerge(
      this.countQuery.where,
      condition
    );
    return this;
  }
  async execute() {
    const [total, data] = await Promise.all([
      this.model.count(
        this.countQuery
      ),
      this.model.findMany(
        this.query
      )
    ]);
    const totalPages = Math.ceil(total / this.limit);
    return {
      data,
      meta: {
        page: this.page,
        limit: this.limit,
        total,
        totalPages
      }
    };
  }
  async count() {
    return await this.model.count(
      this.countQuery
    );
  }
  getQuery() {
    return this.query;
  }
  deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
        if (result[key] && typeof result[key] === "object" && !Array.isArray(result[key])) {
          result[key] = this.deepMerge(
            result[key],
            source[key]
          );
        } else {
          result[key] = source[key];
        }
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }
  parseFilterValue(value) {
    if (value === "true") {
      return true;
    }
    if (value === "false") {
      return false;
    }
    if (typeof value === "string" && !isNaN(Number(value)) && value != "") {
      return Number(value);
    }
    if (Array.isArray(value)) {
      return { in: value.map((item) => this.parseFilterValue(item)) };
    }
    return value;
  }
  parseRangeFilter(value) {
    const rangeQuery = {};
    Object.keys(value).forEach((operator) => {
      const operatorValue = value[operator];
      const parsedValue = typeof operatorValue === "string" && !isNaN(Number(operatorValue)) ? Number(operatorValue) : operatorValue;
      switch (operator) {
        case "lt":
        case "lte":
        case "gt":
        case "gte":
        case "equals":
        case "not":
        case "contains":
        case "startsWith":
        case "endsWith":
          rangeQuery[operator] = parsedValue;
          break;
        case "in":
        case "notIn":
          if (Array.isArray(operatorValue)) {
            rangeQuery[operator] = operatorValue;
          } else {
            rangeQuery[operator] = [parsedValue];
          }
          break;
        default:
          break;
      }
    });
    return Object.keys(rangeQuery).length > 0 ? rangeQuery : value;
  }
};

// src/app/modules/user/user.service.ts
var getAllUsers = async (query = {}) => {
  const userQuery = new QueryBuilder(prisma.user, query, {
    searchableFields: ["name", "email"],
    filterableFields: ["role", "status", "emailVerified"]
  }).search().filter().sort().paginate().fields();
  const result = await userQuery.execute();
  return result;
};
var getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: {
      id
    }
  });
};
var updateProfile = async (id, data) => {
  return await prisma.user.update({
    where: {
      id
    },
    data
  });
};
var deleteUser = async (id) => {
  return await prisma.user.delete({
    where: {
      id
    }
  });
};
var changeStatus = async (id, payload) => {
  const user = await prisma.user.findUnique({
    where: {
      id
    }
  });
  if (!user) {
    throw new AppError_default(status4.NOT_FOUND, "User not found");
  }
  if (user.status === payload.status) {
    throw new AppError_default(status4.BAD_REQUEST, "User is already in this status");
  }
  return await prisma.user.update({
    where: {
      id
    },
    data: {
      status: payload.status
    }
  });
};
var UserService = {
  getAllUsers,
  getUserById,
  updateProfile,
  deleteUser,
  changeStatus
};

// src/app/modules/user/user.controller.ts
var getAllUsers2 = catchAsync(async (req, res) => {
  const result = await UserService.getAllUsers(req.query);
  sendResponse(res, {
    httpStatusCode: status5.OK,
    success: true,
    message: "Users fetched successfully",
    data: result
  });
});
var getUserById2 = catchAsync(async (req, res) => {
  const result = await UserService.getUserById(req.params.id);
  sendResponse(res, {
    httpStatusCode: status5.OK,
    success: true,
    message: "User fetched successfully",
    data: result
  });
});
var updateProfile2 = catchAsync(async (req, res) => {
  const result = await UserService.updateProfile(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status5.OK,
    success: true,
    message: "Profile updated successfully",
    data: result
  });
});
var deleteUser2 = catchAsync(async (req, res) => {
  const result = await UserService.deleteUser(req.params.id);
  sendResponse(res, {
    httpStatusCode: status5.OK,
    success: true,
    message: "User deleted successfully",
    data: result
  });
});
var changeStatus2 = catchAsync(async (req, res) => {
  const result = await UserService.changeStatus(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status5.OK,
    success: true,
    message: "Status changed successfully",
    data: result
  });
});
var UserController = {
  getAllUsers: getAllUsers2,
  getUserById: getUserById2,
  updateProfile: updateProfile2,
  deleteUser: deleteUser2,
  changeStatus: changeStatus2
};

// src/app/modules/user/user.routes.ts
var router2 = Router2();
router2.get("/", checkAuth(Role.ADMIN), UserController.getAllUsers);
router2.get("/:id", checkAuth(Role.ADMIN), UserController.getUserById);
router2.patch("/profile", checkAuth(Role.USER), UserController.updateProfile);
router2.delete("/:id", checkAuth(Role.ADMIN), UserController.deleteUser);
router2.patch("/:id/status", checkAuth(Role.ADMIN), UserController.changeStatus);
var userRoutes = router2;

// src/app/modules/favourite/favourite.route.ts
import { Router as Router3 } from "express";

// src/app/modules/favourite/favourite.service.ts
import status6 from "http-status";
var getAllFavorite = async (user, query) => {
  const result = await prisma.favorite.findMany({
    where: {
      userId: user.userId
    },
    include: {
      media: true
    }
  });
  return result;
};
var createFavorite = async (payload, user) => {
  const isExist = await prisma.favorite.findFirst({
    where: {
      userId: user.userId,
      mediaId: payload.mediaId
    }
  });
  if (isExist) {
    throw new AppError_default(
      status6.BAD_REQUEST,
      "You already added this media to your favorite"
    );
  }
  const result = await prisma.favorite.create({
    data: {
      userId: user.userId,
      ...payload
    }
  });
  return result;
};
var deleteFavorite = async (mediaId, user) => {
  const isExist = await prisma.favorite.findFirst({
    where: {
      mediaId,
      userId: user.userId
    }
  });
  if (!isExist) {
    throw new AppError_default(
      status6.BAD_REQUEST,
      "You didn't add this media to your favorite"
    );
  }
  const result = await prisma.favorite.delete({
    where: {
      id: isExist.id
    }
  });
  return result;
};
var FavoriteService = {
  getAllFavorite,
  createFavorite,
  deleteFavorite
};

// src/app/modules/favourite/favourite.controller.ts
import status7 from "http-status";
var getAllFavourite = catchAsync(async (req, res) => {
  const user = req.user;
  const query = req.query;
  const result = await FavoriteService.getAllFavorite(user, query);
  sendResponse(res, {
    httpStatusCode: status7.OK,
    success: true,
    message: "Favorite fetched successfully",
    data: result
  });
});
var createFavourite = catchAsync(async (req, res) => {
  const { mediaId } = req.params;
  const user = req.user;
  const result = await FavoriteService.createFavorite({ mediaId }, user);
  sendResponse(res, {
    httpStatusCode: status7.OK,
    success: true,
    message: "Favorite created successfully",
    data: result
  });
});
var deleteFavourite = catchAsync(async (req, res) => {
  const { mediaId } = req.params;
  const user = req.user;
  const result = await FavoriteService.deleteFavorite(mediaId, user);
  sendResponse(res, {
    httpStatusCode: status7.OK,
    success: true,
    message: "Favourite deleted successfully",
    data: result
  });
});
var FavoriteController = {
  getAllFavourite,
  createFavourite,
  deleteFavourite
};

// src/app/modules/favourite/favourite.route.ts
var router3 = Router3();
router3.get(
  "/",
  checkAuth(Role.ADMIN, Role.USER),
  FavoriteController.getAllFavourite
);
router3.post(
  "/:mediaId",
  checkAuth(Role.ADMIN, Role.USER),
  FavoriteController.createFavourite
);
router3.delete(
  "/:mediaId",
  checkAuth(Role.ADMIN, Role.USER),
  FavoriteController.deleteFavourite
);
var FavoriteRouter = router3;

// src/app/modules/bookmark/bookmark.route.ts
import { Router as Router4 } from "express";

// src/app/modules/bookmark/bookmark.controller.ts
import status9 from "http-status";

// src/app/modules/bookmark/bookmark.service.ts
import status8 from "http-status";
var getAllBookmark = async (user, query) => {
  const result = await prisma.bookmark.findMany({
    where: {
      userId: user.userId
    },
    include: {
      media: true
    }
  });
  return result;
};
var createBookmark = async (payload, user) => {
  const isExist = await prisma.bookmark.findFirst({
    where: {
      userId: user.userId,
      mediaId: payload.mediaId
    }
  });
  if (isExist) {
    throw new AppError_default(
      status8.BAD_REQUEST,
      "You already added this media to your bookmark"
    );
  }
  const result = await prisma.bookmark.create({
    data: {
      userId: user.userId,
      ...payload
    }
  });
  return result;
};
var deleteBookmark = async (mediaId, user) => {
  const isExist = await prisma.bookmark.findFirst({
    where: {
      mediaId,
      userId: user.userId
    }
  });
  if (!isExist) {
    throw new AppError_default(
      status8.BAD_REQUEST,
      "You didn't add this media to your bookmark"
    );
  }
  const result = await prisma.bookmark.delete({
    where: {
      id: isExist.id
    }
  });
  return result;
};
var BookmarkService = {
  getAllBookmark,
  createBookmark,
  deleteBookmark
};

// src/app/modules/bookmark/bookmark.controller.ts
var getAllBookmark2 = catchAsync(async (req, res) => {
  const user = req.user;
  const query = req.query;
  const result = await BookmarkService.getAllBookmark(user, query);
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "Bookmark fetched successfully",
    data: result
  });
});
var createBookmark2 = catchAsync(async (req, res) => {
  const { mediaId } = req.params;
  const user = req.user;
  const result = await BookmarkService.createBookmark({ mediaId }, user);
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "Bookmark created successfully",
    data: result
  });
});
var deleteBookmark2 = catchAsync(async (req, res) => {
  const { mediaId } = req.params;
  const user = req.user;
  const result = await BookmarkService.deleteBookmark(mediaId, user);
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "Bookmark deleted successfully",
    data: result
  });
});
var BookmarkController = {
  getAllBookmark: getAllBookmark2,
  createBookmark: createBookmark2,
  deleteBookmark: deleteBookmark2
};

// src/app/modules/bookmark/bookmark.route.ts
var router4 = Router4();
router4.get(
  "/",
  checkAuth(Role.ADMIN, Role.USER),
  BookmarkController.getAllBookmark
);
router4.post(
  "/:mediaId",
  checkAuth(Role.ADMIN, Role.USER),
  BookmarkController.createBookmark
);
router4.delete(
  "/:mediaId",
  checkAuth(Role.ADMIN, Role.USER),
  BookmarkController.deleteBookmark
);
var BookmarkRouter = router4;

// src/app/modules/genre/genre.route.ts
import { Router as Router5 } from "express";

// src/app/modules/genre/genre.controller.ts
import status11 from "http-status";

// src/app/modules/genre/genre.service.ts
import status10 from "http-status";
var createGenre = async (payload) => {
  const isExist = await prisma.genre.findUnique({
    where: { name: payload.name }
  });
  if (isExist) {
    throw new AppError_default(status10.BAD_REQUEST, "Genre already exists");
  }
  const result = await prisma.genre.create({
    data: payload
  });
  return result;
};
var getAllGenres = async (query) => {
  const genreQuery = new QueryBuilder(prisma.genre, query, {
    searchableFields: ["name", "description"],
    filterableFields: ["isFeatured", "isPublished"]
  }).search().filter().sort().paginate().fields();
  const result = await genreQuery.execute();
  return result;
};
var updateGenre = async (id, payload) => {
  const isExist = await prisma.genre.findUnique({
    where: { id }
  });
  if (!isExist) {
    throw new AppError_default(status10.NOT_FOUND, "Genre not found");
  }
  const result = await prisma.genre.update({
    where: { id },
    data: payload
  });
  return result;
};
var deleteGenre = async (id) => {
  const isExist = await prisma.genre.findUnique({
    where: { id }
  });
  if (!isExist) {
    throw new AppError_default(status10.NOT_FOUND, "Genre not found");
  }
  const result = await prisma.genre.delete({
    where: { id }
  });
  return result;
};
var createManyGenre = async (payload) => {
  const result = await prisma.genre.createMany({
    data: payload,
    skipDuplicates: true
  });
  return result;
};
var GenreService = {
  createGenre,
  getAllGenres,
  updateGenre,
  deleteGenre,
  createManyGenre
};

// src/app/modules/genre/genre.controller.ts
var createGenre2 = catchAsync(async (req, res) => {
  const result = await GenreService.createGenre(req.body);
  sendResponse(res, {
    httpStatusCode: status11.CREATED,
    success: true,
    message: "Genre created successfully",
    data: result
  });
});
var getAllGenres2 = catchAsync(async (req, res) => {
  const query = req.query;
  console.log("query from genre get all: ", query);
  const result = await GenreService.getAllGenres(query);
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Genres fetched successfully",
    data: result
  });
});
var deleteGenre2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await GenreService.deleteGenre(id);
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Genre deleted successfully",
    data: result
  });
});
var updateGenre2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await GenreService.updateGenre(id, req.body);
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Genre updated successfully",
    data: result
  });
});
var createManyGenre2 = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await GenreService.createManyGenre(data);
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "All Genres created successfully",
    data: result
  });
});
var GenreController = {
  createGenre: createGenre2,
  getAllGenres: getAllGenres2,
  updateGenre: updateGenre2,
  deleteGenre: deleteGenre2,
  createManyGenre: createManyGenre2
};

// src/app/modules/genre/genre.validation.ts
import { z as z2 } from "zod";
var createGenreSchema = z2.object({
  name: z2.string().min(1, "Genre name is required"),
  slug: z2.string().min(1, "Genre slug is required"),
  description: z2.string().min(1, "Genre description is required"),
  image: z2.string().min(1, "Genre image is required"),
  isPublished: z2.boolean().optional(),
  isFeatured: z2.boolean().optional()
});
var updateGenreSchema = z2.object({
  name: z2.string().min(1, "Genre name is required").optional(),
  description: z2.string().min(1, "Genre description is required").optional(),
  image: z2.string().min(1, "Genre image is required").optional(),
  isPublished: z2.boolean().optional(),
  isFeatured: z2.boolean().optional()
});
var GenreValidation = {
  createGenreSchema,
  updateGenreSchema
};

// src/app/modules/genre/genre.route.ts
var router5 = Router5();
router5.post("/bulk", checkAuth(Role.ADMIN), GenreController.createManyGenre);
router5.post(
  "/",
  checkAuth(Role.ADMIN),
  validateRequest(GenreValidation.createGenreSchema),
  GenreController.createGenre
);
router5.get("/", GenreController.getAllGenres);
router5.patch(
  "/:id",
  checkAuth(Role.ADMIN),
  validateRequest(GenreValidation.updateGenreSchema),
  GenreController.updateGenre
);
router5.delete(
  "/:id",
  checkAuth(Role.ADMIN),
  GenreController.deleteGenre
);
var GenreRoutes = router5;

// src/app/modules/watchList/watchList.route.ts
import { Router as Router6 } from "express";

// src/app/modules/watchList/watchList.controller.ts
import status13 from "http-status";

// src/app/modules/watchList/watchList.service.ts
import status12 from "http-status";
var getAllWatchlist = async (user, query) => {
  const result = await prisma.watchList.findMany({
    where: {
      userId: user.userId
    },
    include: {
      media: true
    }
  });
  return result;
};
var createWatchlist = async (payload, user) => {
  const isExist = await prisma.watchList.findFirst({
    where: {
      userId: user.userId,
      mediaId: payload.mediaId
    }
  });
  if (isExist) {
    throw new AppError_default(
      status12.BAD_REQUEST,
      "You already added this media to your watchlist"
    );
  }
  const result = await prisma.watchList.create({
    data: {
      userId: user.userId,
      ...payload
    }
  });
  return result;
};
var deleteWatchlist = async (mediaId, user) => {
  const isExist = await prisma.watchList.findFirst({
    where: {
      mediaId,
      userId: user.userId
    }
  });
  if (!isExist) {
    throw new AppError_default(
      status12.BAD_REQUEST,
      "You didn't add this media to your watchlist"
    );
  }
  const result = await prisma.watchList.delete({
    where: {
      id: isExist.id
    }
  });
  return result;
};
var WatchlistService = {
  getAllWatchlist,
  createWatchlist,
  deleteWatchlist
};

// src/app/modules/watchList/watchList.controller.ts
var getAllWatchlist2 = catchAsync(async (req, res) => {
  const user = req.user;
  const query = req.query;
  const result = await WatchlistService.getAllWatchlist(user, query);
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "Watchlist fetched successfully",
    data: result
  });
});
var createWatchlist2 = catchAsync(async (req, res) => {
  const { mediaId } = req.params;
  const user = req.user;
  const result = await WatchlistService.createWatchlist({ mediaId }, user);
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "Watchlist created successfully",
    data: result
  });
});
var deleteWatchlist2 = catchAsync(async (req, res) => {
  const { mediaId } = req.params;
  const user = req.user;
  const result = await WatchlistService.deleteWatchlist(
    mediaId,
    user
  );
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "Watchlist deleted successfully",
    data: result
  });
});
var WatchlistController = {
  getAllWatchlist: getAllWatchlist2,
  createWatchlist: createWatchlist2,
  deleteWatchlist: deleteWatchlist2
};

// src/app/modules/watchList/watchList.route.ts
var router6 = Router6();
router6.get(
  "/",
  checkAuth(Role.ADMIN, Role.USER),
  WatchlistController.getAllWatchlist
);
router6.post(
  "/:mediaId",
  checkAuth(Role.ADMIN, Role.USER),
  WatchlistController.createWatchlist
);
router6.delete(
  "/:mediaId",
  checkAuth(Role.ADMIN, Role.USER),
  WatchlistController.deleteWatchlist
);
var WatchlistRouter = router6;

// src/app/modules/payment/payment.route.ts
import { Router as Router7 } from "express";

// src/app/modules/payment/payment.service.ts
import status14 from "http-status";

// src/app/config/stripe.config.ts
import Stripe from "stripe";
var stripe = new Stripe(envVars.STRIPE.STRIPE_SECRET_KEY);

// src/app/modules/payment/payment.service.ts
var RENTAL_DURATION_HOURS = 48;
var getMyPayments = async (user) => {
  return await prisma.payment.findMany({
    where: {
      userId: user.userId
    },
    include: {
      subscription: {
        include: { user: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};
var getAllPayments = async (query) => {
  const paymentQuery = new QueryBuilder(prisma.payment, query, {
    searchableFields: ["stripePaymentId", "status"],
    filterableFields: ["status", "currency"]
  }).search().filter().sort().include({
    user: true,
    subscription: true,
    mediaPurchase: {
      include: { media: true }
    },
    rental: {
      include: { media: true }
    }
  }).paginate().fields();
  const result = await paymentQuery.execute();
  return result;
};
var getMyMediaPurchases = async (user) => {
  return await prisma.mediaPurchase.findMany({
    where: { userId: user.userId },
    include: { media: true },
    orderBy: { createdAt: "desc" }
  });
};
var createMediaCheckoutSession = async (user, mediaId, type) => {
  const media = await prisma.media.findUnique({ where: { id: mediaId } });
  if (!media) throw new AppError_default(status14.NOT_FOUND, "Media not found");
  if (media.pricing === "FREE")
    throw new AppError_default(
      status14.BAD_REQUEST,
      "This media is free, no purchase needed"
    );
  if (type === MediaPurchaseType.RENTAL && media.pricing !== "RENTAL")
    throw new AppError_default(
      status14.BAD_REQUEST,
      "This media is not available for rental"
    );
  const existing = await prisma.mediaPurchase.findFirst({
    where: {
      userId: user.userId,
      mediaId,
      type,
      status: MediaPurchaseStatus.ACTIVE,
      ...type === MediaPurchaseType.RENTAL ? { expiresAt: { gt: /* @__PURE__ */ new Date() } } : {}
    }
  });
  if (existing)
    throw new AppError_default(
      status14.CONFLICT,
      "You already have active access to this media"
    );
  const price = type === MediaPurchaseType.RENTAL ? media.rentalPrice : media.buyPrice;
  if (!price)
    throw new AppError_default(
      status14.BAD_REQUEST,
      `No ${type.toLowerCase()} price set for this media`
    );
  const unitAmount = Math.round(Number(price) * 100);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${type === MediaPurchaseType.RENTAL ? "Rent" : "Buy"} \u2014 ${media.title}`,
            description: type === MediaPurchaseType.RENTAL ? `${RENTAL_DURATION_HOURS}-hour rental access` : "Permanent access"
          },
          unit_amount: unitAmount
        },
        quantity: 1
      }
    ],
    metadata: {
      userId: user.userId,
      mediaId,
      type
    },
    success_url: `${envVars.FRONTEND_URL}/payment/success`,
    cancel_url: `${envVars.FRONTEND_URL}/payment/cancel`
  });
  return { session_url: session.url };
};
var expireOldMediaPurchases = async (userId) => {
  await prisma.mediaPurchase.updateMany({
    where: {
      userId,
      type: MediaPurchaseType.RENTAL,
      status: MediaPurchaseStatus.ACTIVE,
      expiresAt: { lt: /* @__PURE__ */ new Date() }
    },
    data: { status: MediaPurchaseStatus.EXPIRED }
  });
};
var checkMediaAccess = async (user, mediaId) => {
  const media = await prisma.media.findUnique({ where: { id: mediaId } });
  if (!media) throw new AppError_default(status14.NOT_FOUND, "Media not found");
  if (media.pricing === "FREE") return { hasAccess: true, reason: "FREE" };
  if (media.pricing === "PREMIUM") {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.userId }
    });
    const hasAccess = subscription?.status === "ACTIVE" && (subscription.plan === "MONTHLY" || subscription.plan === "YEARLY");
    return { hasAccess, reason: "PREMIUM" };
  }
  if (media.pricing === "RENTAL") {
    await expireOldMediaPurchases(user.userId);
    const purchase = await prisma.mediaPurchase.findFirst({
      where: {
        userId: user.userId,
        mediaId,
        type: MediaPurchaseType.RENTAL,
        status: MediaPurchaseStatus.ACTIVE,
        expiresAt: { gt: /* @__PURE__ */ new Date() }
      }
    });
    return {
      hasAccess: !!purchase,
      reason: "RENTAL",
      expiresAt: purchase?.expiresAt
    };
  }
  return { hasAccess: false, reason: "UNKNOWN" };
};
var PaymentService = {
  getMyPayments,
  getAllPayments,
  getMyMediaPurchases,
  createMediaCheckoutSession,
  checkMediaAccess,
  expireOldMediaPurchases
};

// src/app/modules/payment/payment.controller.ts
import httpStatus from "http-status";
var getMyPayments2 = catchAsync(async (req, res) => {
  const result = await PaymentService.getMyPayments(req.user);
  console.log(result, "My payments");
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Payment history fetched successfully",
    data: result
  });
});
var getAllPayments2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await PaymentService.getAllPayments(query);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "All payments fetched successfully",
    data: result
  });
});
var getMyMediaPurchases2 = catchAsync(async (req, res) => {
  const result = await PaymentService.getMyMediaPurchases(
    req.user
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Media purchase history fetched successfully",
    data: result
  });
});
var createMediaCheckoutSession2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const { mediaId, type } = req.body;
    const result = await PaymentService.createMediaCheckoutSession(
      user,
      mediaId,
      type
    );
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Media checkout session created successfully",
      data: result
    });
  }
);
var checkMediaAccess2 = catchAsync(async (req, res) => {
  const user = req.user;
  const { mediaId } = req.params;
  const result = await PaymentService.checkMediaAccess(user, mediaId);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Media access checked successfully",
    data: result
  });
});
var PaymentController = {
  getMyPayments: getMyPayments2,
  getAllPayments: getAllPayments2,
  getMyMediaPurchases: getMyMediaPurchases2,
  createMediaCheckoutSession: createMediaCheckoutSession2,
  checkMediaAccess: checkMediaAccess2
};

// src/app/modules/payment/payment.route.ts
var router7 = Router7();
router7.get(
  "/my-payments",
  checkAuth(Role.USER, Role.ADMIN),
  PaymentController.getMyPayments
);
router7.get(
  "/all-payments",
  checkAuth(Role.ADMIN),
  PaymentController.getAllPayments
);
router7.get(
  "/my-media-purchases",
  checkAuth(Role.USER, Role.ADMIN),
  PaymentController.getMyMediaPurchases
);
router7.post(
  "/media-checkout",
  checkAuth(Role.USER, Role.ADMIN),
  PaymentController.createMediaCheckoutSession
);
router7.get(
  "/media-access/:mediaId",
  checkAuth(Role.USER, Role.ADMIN),
  PaymentController.checkMediaAccess
);
var PaymentRoutes = router7;

// src/app/modules/subscription/sub.routes.ts
import { Router as Router8 } from "express";

// src/app/modules/subscription/sub.controller.ts
import httpStatus3 from "http-status";

// src/app/modules/subscription/sub.service.ts
import httpStatus2 from "http-status";
var getPlans = async () => {
  return [
    {
      name: SubscriptionPlan.FREE,
      price: 0,
      badge: null,
      features: [
        "Access to free titles only",
        "480p streaming quality",
        "1 device at a time",
        "Ad-supported experience",
        "Limited new releases",
        "Community reviews & ratings"
      ]
    },
    {
      name: SubscriptionPlan.MONTHLY,
      price: 9.99,
      badge: "Most Popular",
      features: [
        "Access to all premium titles",
        "Full HD 1080p streaming",
        "2 devices simultaneously",
        "Ad-free experience",
        "New releases on day one",
        "Download for offline viewing",
        "Community reviews & ratings",
        "Cancel anytime"
      ]
    },
    {
      name: SubscriptionPlan.YEARLY,
      price: 99.99,
      badge: "Best Value",
      features: [
        "Everything in Monthly",
        "4K Ultra HD + HDR streaming",
        "4 devices simultaneously",
        "Ad-free experience",
        "Early access to new releases",
        "Download for offline viewing",
        "Priority customer support",
        "Exclusive member-only content",
        "Save 16% vs monthly billing"
      ]
    }
  ];
};
var createCheckoutSession = async (userId, userEmail, plan) => {
  if (plan === SubscriptionPlan.FREE) {
    throw new AppError_default(
      httpStatus2.BAD_REQUEST,
      "Free plan does not require a checkout session."
    );
  }
  const prices = {
    [SubscriptionPlan.MONTHLY]: 999,
    // $9.99 -> 999 cents
    [SubscriptionPlan.YEARLY]: 9999
    // $99.99 -> 9999 cents
  };
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    customer_email: userEmail,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `CinemaTube  ${plan} Plan`,
            description: `Unlock premium features with ${plan} subscription.`
          },
          unit_amount: prices[plan],
          recurring: {
            interval: plan === SubscriptionPlan.MONTHLY ? "month" : "year"
          }
        },
        quantity: 1
      }
    ],
    metadata: {
      userId,
      plan
    },
    success_url: `${envVars.FRONTEND_URL}/payment/success`,
    cancel_url: `${envVars.FRONTEND_URL}/payment/cancel`
  });
  return { session_url: session.url };
};
var handleWebhook = async (body, signature) => {
  console.log("\u{1F514} Webhook received", "thtrjuryjyjyjtyjtitt7utui");
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      envVars.STRIPE.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    throw new AppError_default(
      httpStatus2.BAD_REQUEST,
      `Webhook Signature Error: ${err.message}`
    );
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { userId, plan, mediaId, type } = session.metadata || {};
    const stripePaymentId = session.payment_intent || session.id;
    const amount = (session.amount_total || 0) / 100;
    if (!userId) {
      console.error("\u274C Webhook Error: No userId in metadata", session.id);
      return { received: true };
    }
    if (plan) {
      const currentPeriodStart = /* @__PURE__ */ new Date();
      const currentPeriodEnd = /* @__PURE__ */ new Date();
      if (plan === SubscriptionPlan.MONTHLY) {
        currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
      } else {
        currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
      }
      await prisma.$transaction(async (tx) => {
        const updatedSubscription = await tx.subscription.upsert({
          where: { userId },
          update: {
            plan,
            status: SubscriptionStatus.ACTIVE,
            stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
            currentPeriodStart,
            currentPeriodEnd
          },
          create: {
            userId,
            plan,
            status: SubscriptionStatus.ACTIVE,
            stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
            currentPeriodStart,
            currentPeriodEnd
          }
        });
        await tx.payment.create({
          data: {
            userId,
            subscriptionId: updatedSubscription.id,
            amount,
            currency: session.currency || "usd",
            stripePaymentId,
            status: "COMPLETED"
          }
        });
      });
    }
    if (mediaId && type) {
      await prisma.$transaction(async (tx) => {
        const expiresAt = type === MediaPurchaseType.RENTAL ? new Date(Date.now() + 48 * 60 * 60 * 1e3) : null;
        const mediaPurchase = await tx.mediaPurchase.create({
          data: {
            userId,
            mediaId,
            type,
            status: MediaPurchaseStatus.ACTIVE,
            price: amount,
            expiresAt,
            stripePaymentId
          }
        });
        let rentalId = null;
        if (type === MediaPurchaseType.RENTAL) {
          const rental = await tx.rental.create({
            data: {
              userId,
              mediaId,
              expiresAt,
              price: amount,
              status: "ACTIVE"
            }
          });
          rentalId = rental.id;
        }
        await tx.payment.create({
          data: {
            userId,
            amount,
            currency: session.currency || "usd",
            stripePaymentId,
            status: "COMPLETED",
            mediaPurchaseId: mediaPurchase.id,
            // Links Payment to MediaPurchase
            rentalId
            // Links Payment to Rental
          }
        });
      });
      console.log(`\u2705 Media ${type} successful and connected for User: ${userId}`);
    }
  }
  return { received: true };
};
var getSubscriptionStatus = async (userId) => {
  const subscription = await prisma.subscription.findUnique({
    where: { userId }
  });
  if (!subscription) {
    return { status: SubscriptionStatus.EXPIRED, plan: SubscriptionPlan.FREE };
  }
  if (subscription.currentPeriodEnd && /* @__PURE__ */ new Date() > subscription.currentPeriodEnd && subscription.status === SubscriptionStatus.ACTIVE) {
    const updated = await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: SubscriptionStatus.EXPIRED }
    });
    return updated;
  }
  return subscription;
};
var getPaymentHistory = async (userId) => {
  const subscriptions = await prisma.subscription.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
  return subscriptions;
};
var cancelSubscription = async (userId) => {
  const subscription = await prisma.subscription.findUnique({
    where: { userId }
  });
  if (!subscription) {
    throw new AppError_default(httpStatus2.NOT_FOUND, "No active subscription found");
  }
  if (subscription.status !== SubscriptionStatus.ACTIVE) {
    throw new AppError_default(httpStatus2.BAD_REQUEST, "Subscription is not active");
  }
  if (!subscription.stripeCustomerId) {
    throw new AppError_default(httpStatus2.BAD_REQUEST, "No Stripe customer found");
  }
  const stripeSubscriptions = await stripe.subscriptions.list({
    customer: subscription.stripeCustomerId,
    status: "active",
    limit: 1
  });
  if (!stripeSubscriptions.data.length) {
    throw new AppError_default(
      httpStatus2.NOT_FOUND,
      "No active Stripe subscription found"
    );
  }
  const stripeSubscriptionId = stripeSubscriptions.data[0].id;
  const latestPayment = await prisma.payment.findFirst({
    where: { subscriptionId: subscription.id },
    orderBy: { createdAt: "desc" }
  });
  await stripe.subscriptions.cancel(stripeSubscriptionId);
  let refund = null;
  if (latestPayment?.stripePaymentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        latestPayment.stripePaymentId
      );
      if (paymentIntent.latest_charge) {
        refund = await stripe.refunds.create({
          charge: paymentIntent.latest_charge
          // Remove amount for full refund, or specify partial:
          // amount: Math.round(latestPayment.amount * 100),
        });
      }
    } catch (refundError) {
      console.error("Refund failed:", refundError);
    }
  }
  const updated = await prisma.subscription.update({
    where: { userId },
    data: {
      status: SubscriptionStatus.CANCELLED,
      cancelAtPeriodEnd: false,
      plan: SubscriptionPlan.FREE
    }
  });
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user) {
    try {
      await sendEmail({
        to: user.email,
        subject: "Your Cinema Tube Subscription Has Been Cancelled",
        templateName: "subscription-cancelled",
        templateData: {
          userName: user.name,
          refunded: !!refund,
          loginUrl: `${envVars.FRONTEND_URL}/login`
        }
      });
    } catch (emailError) {
      console.error("Failed to send cancellation email", emailError);
    }
  }
  return {
    cancelled: true,
    refunded: !!refund,
    refundId: refund?.id ?? null
  };
};
var SubscriptionService = {
  getPlans,
  createCheckoutSession,
  handleWebhook,
  getSubscriptionStatus,
  getPaymentHistory,
  cancelSubscription
};

// src/app/modules/subscription/sub.controller.ts
var getPlans2 = catchAsync(async (req, res) => {
  const result = await SubscriptionService.getPlans();
  sendResponse(res, {
    httpStatusCode: httpStatus3.OK,
    success: true,
    message: "Subscription plans retrieved successfully",
    data: result
  });
});
var createCheckoutSession2 = catchAsync(async (req, res) => {
  const user = req.user;
  const { plan } = req.body;
  const result = await SubscriptionService.createCheckoutSession(
    user.userId,
    user.email,
    plan
  );
  sendResponse(res, {
    httpStatusCode: httpStatus3.OK,
    success: true,
    message: "Checkout session created successfully",
    data: result
  });
});
var webhook = catchAsync(async (req, res) => {
  const signature = req.headers["stripe-signature"];
  const result = await SubscriptionService.handleWebhook(req.body, signature);
  res.status(httpStatus3.OK).json(result);
});
var getSubscriptionStatus2 = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await SubscriptionService.getSubscriptionStatus(user.userId);
  sendResponse(res, {
    httpStatusCode: httpStatus3.OK,
    success: true,
    message: "Subscription status retrieved successfully",
    data: result
  });
});
var getPaymentHistory2 = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await SubscriptionService.getPaymentHistory(user.userId);
  sendResponse(res, {
    httpStatusCode: httpStatus3.OK,
    success: true,
    message: "Payment history retrieved successfully",
    data: result
  });
});
var cancelSubscription2 = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await SubscriptionService.cancelSubscription(user.userId);
  sendResponse(res, {
    httpStatusCode: httpStatus3.OK,
    success: true,
    message: "Subscription cancelled and refund initiated",
    data: result
  });
});
var SubscriptionController = {
  getPlans: getPlans2,
  createCheckoutSession: createCheckoutSession2,
  webhook,
  getSubscriptionStatus: getSubscriptionStatus2,
  getPaymentHistory: getPaymentHistory2,
  cancelSubscription: cancelSubscription2
};

// src/app/modules/subscription/sub.routes.ts
var router8 = Router8();
router8.post("/checkout", checkAuth(Role.USER, Role.ADMIN), SubscriptionController.createCheckoutSession);
router8.get("/plans", SubscriptionController.getPlans);
router8.get("/status", checkAuth(Role.USER, Role.ADMIN), SubscriptionController.getSubscriptionStatus);
router8.get("/history", checkAuth(Role.USER, Role.ADMIN), SubscriptionController.getPaymentHistory);
router8.delete(
  "/cancel",
  checkAuth(Role.USER, Role.ADMIN),
  SubscriptionController.cancelSubscription
);
var SubscriptionRouter = router8;

// src/app/modules/media/media.route.ts
import { Router as Router9 } from "express";

// src/app/modules/media/media.controller.ts
import status16 from "http-status";

// src/app/modules/media/media.service.ts
import status15 from "http-status";
var createMedia = async (data) => {
  const result = await prisma.media.create({
    data: {
      ...data,
      // Jodi genre relation thake
      genres: data.genreIds ? {
        connect: data.genreIds.map((id) => ({ id }))
      } : void 0
    }
  });
  return result;
};
var getAllMedia = async (query) => {
  const result = await prisma.media.findMany({
    include: {
      genres: true
    }
  });
  return result;
};
var getMediaBySlug = async (slug) => {
  const media = await prisma.media.findUnique({
    where: { slug },
    include: {
      genres: true,
      reviews: true,
      cast: true
    }
  });
  if (!media) {
    return null;
  }
  await prisma.media.update({
    where: { slug },
    data: {
      viewCount: { increment: 1 }
    }
  });
  return media;
};
var getMediaById = async (id) => {
  const result = await prisma.media.findUnique({
    where: { id },
    include: {
      genres: true,
      // platforms: { include: { platform: true } },
      cast: true
    }
  });
  if (!result) {
    throw new AppError_default(status15.NOT_FOUND, "Media not found");
  }
  return result;
};
var updateMedia = async (id, data) => {
  const result = await prisma.media.update({
    where: { id },
    data
  });
  return result;
};
var deleteMedia = async (id) => {
  const result = await prisma.media.delete({
    where: { id }
  });
  return result;
};
var MediaService = {
  createMedia,
  getAllMedia,
  getMediaById,
  updateMedia,
  deleteMedia,
  getMediaBySlug
};

// src/app/modules/media/media.controller.ts
var createMedia2 = catchAsync(async (req, res) => {
  const result = await MediaService.createMedia(req.body);
  sendResponse(res, {
    httpStatusCode: status16.CREATED,
    success: true,
    message: "Media created successfully",
    data: result
  });
});
var getAllMedia2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await MediaService.getAllMedia(query);
  sendResponse(res, {
    httpStatusCode: status16.OK,
    success: true,
    message: "Media fetched successfully",
    data: result
  });
});
var getMediaBySlug2 = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const result = await MediaService.getMediaBySlug(slug);
  sendResponse(res, {
    httpStatusCode: status16.OK,
    success: true,
    message: "Media retrieved successfully",
    data: result
  });
});
var getMediaById2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MediaService.getMediaById(id);
  sendResponse(res, {
    httpStatusCode: status16.OK,
    success: true,
    message: "Media retrieved successfully",
    data: result
  });
});
var updateMedia2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MediaService.updateMedia(id, req.body);
  sendResponse(res, {
    httpStatusCode: status16.OK,
    success: true,
    message: "Media updated successfully",
    data: result
  });
});
var deleteMedia2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  await MediaService.deleteMedia(id);
  sendResponse(res, {
    httpStatusCode: status16.OK,
    success: true,
    message: "Media deleted successfully",
    data: null
  });
});
var MediaController = {
  createMedia: createMedia2,
  getAllMedia: getAllMedia2,
  getMediaById: getMediaById2,
  updateMedia: updateMedia2,
  deleteMedia: deleteMedia2,
  getMediaBySlug: getMediaBySlug2
};

// src/app/modules/media/media.route.ts
var router9 = Router9();
router9.post(
  "/",
  checkAuth(Role.ADMIN),
  // validateRequest(MediaValidation.createMediaValidationSchema),
  MediaController.createMedia
);
router9.get("/", MediaController.getAllMedia);
router9.get("/slug/:slug", MediaController.getMediaBySlug);
router9.get("/:id", MediaController.getMediaById);
router9.patch(
  "/:id",
  checkAuth(Role.ADMIN),
  // validateRequest(MediaValidation.updateMediaValidation),
  MediaController.updateMedia
);
router9.delete("/:id", checkAuth(Role.ADMIN), MediaController.deleteMedia);
var MediaRoutes = router9;

// src/app/modules/review/review.route.ts
import { Router as Router10 } from "express";

// src/app/modules/review/review.controller.ts
import status18 from "http-status";

// src/app/modules/review/review.service.ts
import status17 from "http-status";

// src/app/modules/review/review.constsnt.ts
var reviewIncludeConfig = {
  user: true,
  media: true
};

// src/app/modules/review/review.service.ts
var getAllReview = async (user, query) => {
  const reviewQuery = new QueryBuilder(prisma.review, query, {
    searchableFields: ["content", "rating"],
    filterableFields: ["status", "mediaId", "userId", "rating"]
  }).search().filter().sort().paginate().fields();
  const result = await reviewQuery.execute();
  return result;
};
var getSingleReview = async (id) => {
  const result = await prisma.review.findUnique({
    where: {
      id
    }
  });
  return result;
};
var getReviewByMediaId = async (mediaId) => {
  const isMediaExist = await prisma.media.findUnique({
    where: {
      id: mediaId
    }
  });
  if (!isMediaExist) {
    throw new AppError_default(status17.NOT_FOUND, "Media not found");
  }
  const result = await prisma.review.findMany({
    where: {
      mediaId,
      status: "APPROVED"
    },
    include: {
      user: true
    }
  });
  return result;
};
var createReview = async (user, data) => {
  const result = await prisma.review.create({
    data: {
      userId: user.userId,
      ...data
    }
  });
  return result;
};
var updateReview = async (id, data) => {
  const isReviewExist = await prisma.review.findUnique({
    where: {
      id
    }
  });
  if (!isReviewExist) {
    throw new AppError_default(status17.NOT_FOUND, "Review not found");
  }
  const result = await prisma.review.update({
    where: {
      id
    },
    data: {
      ...data
    }
  });
  return result;
};
var deleteReview = async (id) => {
  const isReviewExist = await prisma.review.findUnique({
    where: {
      id
    }
  });
  if (!isReviewExist) {
    throw new AppError_default(status17.NOT_FOUND, "Review not found");
  }
  if (isReviewExist.status === ReviewStatus.APPROVED) {
    throw new AppError_default(
      status17.NOT_FOUND,
      "You can only delete pending or unpublished review"
    );
  }
  const result = await prisma.review.delete({
    where: {
      id
    }
  });
  return result;
};
var updateMediaRating = async (mediaId) => {
  const stats = await prisma.review.aggregate({
    where: {
      mediaId,
      status: ReviewStatus.APPROVED
    },
    _avg: {
      rating: true
    },
    _count: {
      id: true
    }
  });
  await prisma.media.update({
    where: { id: mediaId },
    data: {
      averageRating: stats._avg.rating || 0,
      totalRatings: stats._count.id
    }
  });
};
var updateReviewStatus = async (id, payload) => {
  const isReviewExist = await prisma.review.findUnique({
    where: {
      id
    }
  });
  if (!isReviewExist) {
    throw new AppError_default(status17.NOT_FOUND, "Review not found");
  }
  const result = await prisma.review.update({
    where: {
      id
    },
    data: {
      status: payload.status
    }
  });
  await updateMediaRating(isReviewExist.mediaId);
  return result;
};
var deleteReviewByAdmin = async (id) => {
  const isReviewExist = await prisma.review.findUnique({
    where: {
      id
    }
  });
  if (!isReviewExist) {
    throw new AppError_default(status17.NOT_FOUND, "Review not found");
  }
  const result = await prisma.review.delete({
    where: {
      id
    }
  });
  await updateMediaRating(isReviewExist.mediaId);
  return result;
};
var getAllReviewAdmin = async (query) => {
  const reviewQuery = new QueryBuilder(prisma.review, query, {
    searchableFields: ["content", "rating"],
    filterableFields: ["status", "mediaId", "userId", "rating"]
  }).search().filter().include({
    user: true,
    media: true
  }).dynamicInclude(reviewIncludeConfig).sort().paginate().fields();
  const result = await reviewQuery.execute();
  return result;
};
var ReviewsService = {
  getAllReview,
  getSingleReview,
  getReviewByMediaId,
  createReview,
  updateReview,
  deleteReview,
  updateReviewStatus,
  deleteReviewByAdmin,
  getAllReviewAdmin
};

// src/app/modules/review/review.controller.ts
var getAllReview2 = catchAsync(async (req, res) => {
  const query = req.query;
  const user = req.user;
  const result = await ReviewsService.getAllReview(user, query);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Reviews fetched successfully",
    data: result
  });
});
var getSingleReview2 = catchAsync(async (req, res) => {
  const result = await ReviewsService.getSingleReview(req.params.id);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Review fetched successfully",
    data: result
  });
});
var getReviewByMediaId2 = catchAsync(async (req, res) => {
  const result = await ReviewsService.getReviewByMediaId(
    req.params.mediaId
  );
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Review fetched successfully",
    data: result
  });
});
var createReview2 = catchAsync(async (req, res) => {
  const result = await ReviewsService.createReview(
    req.user,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Review created successfully",
    data: result
  });
});
var updateReview2 = catchAsync(async (req, res) => {
  const result = await ReviewsService.updateReview(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Review updated successfully",
    data: result
  });
});
var deleteReview2 = catchAsync(async (req, res) => {
  console.log(req.params.id);
  const result = await ReviewsService.deleteReview(req.params.id);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Review deleted successfully",
    data: result
  });
});
var updateReviewStatus2 = catchAsync(async (req, res) => {
  const result = await ReviewsService.updateReviewStatus(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Review status updated successfully",
    data: result
  });
});
var deleteReviewByAdmin2 = catchAsync(async (req, res) => {
  const result = await ReviewsService.deleteReviewByAdmin(
    req.params.id
  );
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Review deleted successfully",
    data: result
  });
});
var getAllReviewAdmin2 = catchAsync(async (req, res) => {
  const result = await ReviewsService.getAllReviewAdmin(req.query);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Reviews fetched successfully",
    data: result
  });
});
var ReviewsController = {
  getAllReview: getAllReview2,
  getSingleReview: getSingleReview2,
  getReviewByMediaId: getReviewByMediaId2,
  createReview: createReview2,
  updateReview: updateReview2,
  deleteReview: deleteReview2,
  updateReviewStatus: updateReviewStatus2,
  deleteReviewByAdmin: deleteReviewByAdmin2,
  getAllReviewAdmin: getAllReviewAdmin2
};

// src/generated/prisma/internal/prismaNamespaceBrowser.ts
import * as runtime3 from "@prisma/client/runtime/index-browser";
var NullTypes4 = {
  DbNull: runtime3.NullTypes.DbNull,
  JsonNull: runtime3.NullTypes.JsonNull,
  AnyNull: runtime3.NullTypes.AnyNull
};
var TransactionIsolationLevel2 = runtime3.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});

// src/app/modules/review/review.validation.ts
import { z as z3 } from "zod";
var createReviewValidation = z3.object({
  mediaId: z3.string("Media ID is required"),
  rating: z3.number("Rating must be a number").min(1, "Rating must be at least 1").max(10, "Rating must be at most 10"),
  content: z3.string("Content is required"),
  status: z3.enum(
    ["APPROVED", "UNPUBLISHED", "PENDING"],
    "Status must be one of APPROVED, UNPUBLISHED, PENDING"
  ).optional(),
  userId: z3.string("User ID is required"),
  tags: z3.array(z3.string("Tag is required")),
  hasSpoiler: z3.boolean("Has spoiler must be a boolean")
});
var updateReviewValidation = z3.object({
  mediaId: z3.string("Media ID is required"),
  rating: z3.number("Rating must be a number").min(1, "Rating must be at least 1").max(10, "Rating must be at most 10"),
  content: z3.string("Content is required"),
  status: z3.enum(
    ["APPROVED", "UNPUBLISHED", "PENDING"],
    "Status must be one of APPROVED, UNPUBLISHED, PENDING"
  ).optional(),
  userId: z3.string("User ID is required"),
  tags: z3.array(z3.string("Tag is required")),
  hasSpoiler: z3.boolean("Has spoiler must be a boolean")
});
var updateReviewStatusValidation = z3.object({
  status: z3.enum(
    ["APPROVED", "UNPUBLISHED", "PENDING"],
    "Status must be one of APPROVED, UNPUBLISHED, PENDING"
  )
});
var ReviewsValidation = {
  createReviewValidation,
  updateReviewValidation,
  updateReviewStatusValidation
};

// src/app/modules/review/review.route.ts
var router10 = Router10();
router10.get("/", ReviewsController.getAllReview);
router10.get("/admin", checkAuth(Role.ADMIN), ReviewsController.getAllReviewAdmin);
router10.get("/media/:mediaId", ReviewsController.getReviewByMediaId);
router10.get("/:id", ReviewsController.getSingleReview);
router10.post(
  "/",
  checkAuth(Role.USER),
  validateRequest(ReviewsValidation.createReviewValidation),
  ReviewsController.createReview
);
router10.patch(
  "/:id",
  checkAuth(Role.USER),
  validateRequest(ReviewsValidation.updateReviewValidation),
  ReviewsController.updateReview
);
router10.delete(
  "/:id",
  checkAuth(Role.USER),
  ReviewsController.deleteReview
);
router10.patch(
  "/admin/status/:id",
  checkAuth(Role.ADMIN),
  validateRequest(ReviewsValidation.updateReviewStatusValidation),
  ReviewsController.updateReviewStatus
);
router10.delete(
  "/admin/delete/:id",
  checkAuth(Role.ADMIN),
  ReviewsController.deleteReviewByAdmin
);
var ReviewsRoutes = router10;

// src/app/routes/index.ts
var router11 = Router11();
router11.use("/auth", authRoutes);
router11.use("/users", userRoutes);
router11.use("/favorites", FavoriteRouter);
router11.use("/genres", GenreRoutes);
router11.use("/bookmarks", BookmarkRouter);
router11.use("/watchlist", WatchlistRouter);
router11.use("/payment", PaymentRoutes);
router11.use("/subscriptions", SubscriptionRouter);
router11.use("/media", MediaRoutes);
router11.use("/reviews", ReviewsRoutes);
var IndexRoutes = router11;

// src/app/middlewares/globalError.ts
import status21 from "http-status";
import z4 from "zod";

// src/app/errorHelpers/handlePrismaError.ts
import status19 from "http-status";
var getStatusCodeFromPrismaError = (errorCode) => {
  if (errorCode === "P2002") {
    return status19.CONFLICT;
  }
  if (["P2025", "P2001", "P2015", "P2018"].includes(errorCode)) {
    return status19.NOT_FOUND;
  }
  if (["P1000", "P6002"].includes(errorCode)) {
    return status19.UNAUTHORIZED;
  }
  if (["P1010", "P6010"].includes(errorCode)) {
    return status19.FORBIDDEN;
  }
  if (errorCode === "P6003") {
    return status19.PAYMENT_REQUIRED;
  }
  if (["P1008", "P2004", "P6004"].includes(errorCode)) {
    return status19.GATEWAY_TIMEOUT;
  }
  if (errorCode === "P5011") {
    return status19.TOO_MANY_REQUESTS;
  }
  if (errorCode === "P6009") {
    return 413;
  }
  if (errorCode.startsWith("P1") || ["P2024", "P2037", "P6008"].includes(errorCode)) {
    return status19.SERVICE_UNAVAILABLE;
  }
  if (errorCode.startsWith("P2")) {
    return status19.BAD_REQUEST;
  }
  if (errorCode.startsWith("P3") || errorCode.startsWith("P4")) {
    return status19.INTERNAL_SERVER_ERROR;
  }
  return status19.INTERNAL_SERVER_ERROR;
};
var formatErrorMeta = (meta) => {
  if (!meta) return "";
  const parts = [];
  if (meta.target) {
    parts.push(`Field(s): ${String(meta.target)}`);
  }
  if (meta.field_name) {
    parts.push(`Field: ${String(meta.field_name)}`);
  }
  if (meta.column_name) {
    parts.push(`Column: ${String(meta.column_name)}`);
  }
  if (meta.table) {
    parts.push(`Table: ${String(meta.table)}`);
  }
  if (meta.model_name) {
    parts.push(`Model: ${String(meta.model_name)}`);
  }
  if (meta.relation_name) {
    parts.push(`Relation: ${String(meta.relation_name)}`);
  }
  if (meta.constraint) {
    parts.push(`Constraint: ${String(meta.constraint)}`);
  }
  if (meta.database_error) {
    parts.push(`Database Error: ${String(meta.database_error)}`);
  }
  return parts.length > 0 ? parts.join(" |") : "";
};
var handlePrismaClientKnownRequestError = (error) => {
  const statusCode = getStatusCodeFromPrismaError(error.code);
  const metaInfo = formatErrorMeta(error.meta);
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An error occurred with the database operation.";
  const errorSources = [
    {
      path: error.code,
      message: metaInfo ? `${mainMessage} | ${metaInfo}` : mainMessage
    }
  ];
  if (error.meta?.cause) {
    errorSources.push({
      path: "cause",
      message: String(error.meta.cause)
    });
  }
  return {
    success: false,
    statusCode,
    message: `Prisma Client Known Request Error: ${mainMessage}`,
    errorSources
  };
};
var handlePrismaClientUnknownError = (error) => {
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An unknown error occurred with the database operation.";
  const errorSources = [
    {
      path: "Unknown Prisma Error",
      message: mainMessage
    }
  ];
  return {
    success: false,
    statusCode: status19.INTERNAL_SERVER_ERROR,
    message: `Prisma Client Unknown Request Error: ${mainMessage}`,
    errorSources
  };
};
var handlePrismaClientValidationError = (error) => {
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const errorSources = [];
  const fieldMatch = cleanMessage.match(/Argument `(\w+)`/i);
  const fieldName = fieldMatch ? fieldMatch[1] : "Unknown Field";
  const mainMessage = lines.find(
    (line) => !line.includes("Argument") && !line.includes("\u2192") && line.length > 10
  ) || lines[0] || "Invalid query parameters provided to the database operation.";
  errorSources.push({
    path: fieldName,
    message: mainMessage
  });
  return {
    success: false,
    statusCode: status19.BAD_REQUEST,
    message: `Prisma Client Validation Error: ${mainMessage}`,
    errorSources
  };
};
var handlerPrismaClientInitializationError = (error) => {
  const statusCode = error.errorCode ? getStatusCodeFromPrismaError(error.errorCode) : status19.SERVICE_UNAVAILABLE;
  const cleanMessage = error.message;
  cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An error occurred while initializing the Prisma Client.";
  const errorSources = [
    {
      path: error.errorCode || "Initialization Error",
      message: mainMessage
    }
  ];
  return {
    success: false,
    statusCode,
    message: `Prisma Client Initialization Error: ${mainMessage}`,
    errorSources
  };
};
var handlerPrismaClientRustPanicError = () => {
  const errorSources = [{
    path: "Rust Engine Crashed",
    message: "The database engine encountered a fatal error and crashed. This is usually due to an internal bug in the Prisma engine or an unexpected edge case in the database operation. Please check the Prisma logs for more details and consider reporting this issue to the Prisma team if it persists."
  }];
  return {
    success: false,
    statusCode: status19.INTERNAL_SERVER_ERROR,
    message: "Prisma Client Rust Panic Error: The database engine crashed due to a fatal error.",
    errorSources
  };
};

// src/app/middlewares/handleZodError.ts
import status20 from "http-status";
var handleZodError = (err) => {
  const statusCode = status20.BAD_REQUEST;
  const message = "Zod Validation Error";
  const errorSources = [];
  err.issues.forEach((issue) => {
    errorSources.push({
      path: issue.path.join(" => "),
      message: issue.message
    });
  });
  return {
    success: false,
    message,
    errorSources,
    statusCode
  };
};

// src/app/middlewares/globalError.ts
var globalErrorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);
  if (envVars.NODE_ENV === "development") {
    console.log("Error from Global Error Handler", err);
  }
  let errorSources = [];
  let statusCode = status21.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let stack = void 0;
  if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    const simplifiedError = handlePrismaClientKnownRequestError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    const simplifiedError = handlePrismaClientUnknownError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    const simplifiedError = handlePrismaClientValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientRustPanicError) {
    const simplifiedError = handlerPrismaClientRustPanicError();
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    const simplifiedError = handlerPrismaClientInitializationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof z4.ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof AppError_default) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ];
  } else if (err instanceof Error) {
    statusCode = status21.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ];
  }
  const errorResponse = {
    success: false,
    message,
    errorSources,
    error: envVars.NODE_ENV === "development" ? err : void 0,
    stack: envVars.NODE_ENV === "development" ? stack : void 0
  };
  return res.status(statusCode).json(errorResponse);
};

// src/app/middlewares/notFound.ts
import status22 from "http-status";
var notFound = (req, res) => {
  res.status(status22.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} Not Found`
  });
};

// src/app.ts
var app = express();
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  SubscriptionController.webhook
);
app.use(
  cors({
    origin: [
      envVars.FRONTEND_URL,
      envVars.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:5000"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.set("view engine", "ejs");
app.set("views", path3.resolve(process.cwd(), `src/app/templates`));
app.use("/api/auth", toNodeHandler(auth));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", IndexRoutes);
app.get("/", async (req, res) => {
  res.status(201).json({
    success: true,
    message: "API is working"
  });
  res.send("Hello, World!");
});
app.use(globalErrorHandler);
app.use(notFound);
var app_default = app;

// src/index.ts
import { Server } from "http";

// src/app/utils/seedAdmin.ts
import dotenv2 from "dotenv";
dotenv2.config();
var seedAdmin = async () => {
  try {
    const isDefaultAdminExist = await prisma.user.findFirst({
      where: { role: Role.ADMIN }
    });
    if (isDefaultAdminExist) {
      console.log("Default admin already exist. Skipping seeding Default-Admin.");
      return;
    }
    const defaultAdminUser = await auth.api.signUpEmail({
      body: {
        email: envVars.ADMIN_EMAIL,
        password: envVars.ADMIN_PASSWORD,
        name: "Default Admin",
        role: Role.ADMIN,
        needPasswordChange: false,
        rememberMe: false
      }
    });
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: defaultAdminUser.user.id
        },
        data: {
          status: UserStatus.ACTIVE,
          emailVerified: true
        }
      });
      await tx.admin.create({
        data: {
          userId: defaultAdminUser.user.id,
          name: "Default Admin",
          email: envVars.ADMIN_EMAIL
        }
      });
    });
    const defaultAdmin = await prisma.admin.findFirst({
      where: {
        email: envVars.ADMIN_EMAIL
      },
      include: {
        user: true
      }
    });
    console.log(`Default Admin created:`, defaultAdmin);
  } catch (error) {
    console.error(`Error seeding default admin: `, error);
    await prisma.user.delete({
      where: {
        email: envVars.ADMIN_EMAIL
      }
    });
  }
};

// src/index.ts
var server;
var bootstrap = async () => {
  try {
    await seedAdmin();
    server = app_default.listen(envVars.PORT, () => {
      console.log(`Server is running on http://localhost:${envVars.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received. Shutting down server...");
  if (server) {
    server.close(() => {
      console.log("Server closed gracefully.");
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("SIGINT", () => {
  console.log("SIGINT signal received. Shutting down server...");
  if (server) {
    server.close(() => {
      console.log("Server closed gracefully.");
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("uncaughtException", (error) => {
  console.log("Uncaught Exception Detected... Shutting down server", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("unhandledRejection", (error) => {
  console.log("Unhandled Rejection Detected... Shutting down server", error);
  if (Server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
bootstrap();
