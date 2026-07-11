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
  "inlineSchema": 'model Admin {\n  id            String    @id @default(uuid(7))\n  name          String\n  email         String    @unique\n  profilePhoto  String?\n  contactNumber String?\n  isDeleted     Boolean   @default(false)\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  deletedAt     DateTime?\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([email])\n  @@index([isDeleted])\n  @@map("admin")\n}\n\nmodel User {\n  id                 String          @id\n  name               String\n  email              String          @unique\n  emailVerified      Boolean         @default(false)\n  image              String?\n  role               Role            @default(USER)\n  status             UserStatus      @default(ACTIVE)\n  needPasswordChange Boolean         @default(false)\n  isDeleted          Boolean         @default(false)\n  deletedAt          DateTime?\n  createdAt          DateTime        @default(now())\n  updatedAt          DateTime        @updatedAt\n  watchList          WatchList[]\n  accounts           Account[]\n  bookmarks          Bookmark[]\n  favorites          Favorite[]\n  mediaAdded         Media[]         @relation("MediaAddedBy")\n  profile            Profile?\n  ratings            Rating[]\n  reviews            Review[]\n  sessions           Session[]\n  payments           Payment[]\n  subscriptions      Subscription[]\n  mediaPurchases     MediaPurchase[]\n  rentals            Rental[]\n  admins             Admin[]\n\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String   @unique\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nenum Role {\n  ADMIN\n  USER\n}\n\nenum UserStatus {\n  BLOCKED\n  DELETED\n  ACTIVE\n  PENDING\n  UNVERIFIED\n}\n\nenum MediaType {\n  MOVIE\n  SERIES\n}\n\nenum ReviewStatus {\n  PENDING\n  APPROVED\n  UNPUBLISHED\n}\n\nenum PaymentStatus {\n  PAID\n  UNPAID\n}\n\nenum MediaPurchaseType {\n  RENTAL\n  BUY\n}\n\nenum MediaPurchaseStatus {\n  ACTIVE\n  EXPIRED\n  CANCELLED\n}\n\nenum RentalStatus {\n  ACTIVE\n  EXPIRED\n  CANCELLED\n}\n\nenum PurchaseType {\n  BUY\n  RENT\n}\n\nenum Pricing {\n  FREE\n  PREMIUM\n  RENTAL\n}\n\nenum SubscriptionPlan {\n  FREE\n  MONTHLY\n  YEARLY\n}\n\nenum SubscriptionStatus {\n  ACTIVE\n  CANCELLED\n  EXPIRED\n  PAST_DUE\n}\n\nenum SubStatus {\n  ACTIVE\n  CANCELLED\n  EXPIRED\n}\n\nmodel Genre {\n  id          String   @id @default(uuid())\n  name        String   @unique\n  slug        String   @unique\n  isPublished Boolean  @default(true)\n  isFeatured  Boolean  @default(false)\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n  medias      Media[]  @relation("MediaGenres")\n\n  @@index([name])\n  @@index([isPublished])\n  @@index([isFeatured])\n  @@map("genres")\n}\n\nmodel Media {\n  id             String   @id @default(uuid())\n  title          String\n  slug           String   @unique\n  type           String\n  description    String   @db.Text\n  releaseYear    Int\n  director       String\n  posterUrl      String?\n  backdropUrl    String?\n  trailerUrl     String?\n  streamingUrl   String?\n  rentalPrice    Decimal? @db.Decimal(10, 2)\n  buyPrice       Decimal? @db.Decimal(10, 2)\n  runtimeMinutes Int?\n  seasons        Int?\n  pricing        Pricing  @default(FREE)\n  isPublished    Boolean  @default(true)\n  isFeatured     Boolean  @default(false)\n  avgRating      Float?\n  reviewCount    Int      @default(0)\n  createdAt      DateTime @default(now())\n  updatedAt      DateTime @updatedAt\n\n  genres         Genre[]     @relation("MediaGenres")\n  // platforms      MediaPlatform[]\n  reviews        Review[]\n  watchlistItems WatchList[]\n\n  viewCount Int             @default(0)\n  bookmarks Bookmark[]\n  favorites Favorite[]\n  purchases MediaPurchase[]\n  cast      CastMember[]\n  rentals   Rental[]\n  ratings   Rating[]\n  profiles  Profile[]       @relation("MediaProfiles")\n  users     User[]          @relation("MediaAddedBy")\n\n  @@unique([title, releaseYear])\n  @@index([title])\n  @@index([type])\n  @@index([releaseYear])\n  @@index([director])\n  @@index([pricing])\n  @@index([isFeatured])\n  @@index([createdAt])\n  @@index([viewCount])\n  @@map("media")\n}\n\nmodel CastMember {\n  id      String  @id @default(uuid())\n  name    String\n  role    String\n  image   String?\n  mediaId String\n  media   Media   @relation(fields: [mediaId], references: [id], onDelete: Cascade)\n\n  @@map("cast_members")\n}\n\n// model MediaPlatform {\n//   id         String   @id @default(uuid())\n//   mediaId    String\n//   media      Media    @relation(fields: [mediaId], references: [id], onDelete: Cascade)\n//   platformId String\n//   platform   Platform @relation(fields: [platformId], references: [id], onDelete: Cascade)\n\n//   @@unique([mediaId, platformId])\n//   @@index([mediaId])\n//   @@index([platformId])\n//   @@map("media_platforms")\n// }\n\nmodel Payment {\n  id String @id @default(uuid())\n\n  subscriptionId String?\n  subscription   Subscription? @relation(fields: [subscriptionId], references: [id])\n  userId         String\n  user           User          @relation(fields: [userId], references: [id])\n\n  amount          Float\n  currency        String  @default("usd")\n  stripePaymentId String? @unique\n  status          String\n\n  mediaPurchaseId String?        @unique\n  mediaPurchase   MediaPurchase? @relation(fields: [mediaPurchaseId], references: [id])\n\n  createdAt DateTime @default(now())\n\n  rentalId String? @unique\n  rental   Rental? @relation(fields: [rentalId], references: [id])\n\n  @@index([subscriptionId])\n  @@index([userId])\n  @@index([status])\n  @@index([createdAt])\n  @@map("payments")\n}\n\nmodel MediaPurchase {\n  id              String              @id @default(uuid())\n  userId          String\n  user            User                @relation(fields: [userId], references: [id], onDelete: Cascade)\n  mediaId         String\n  media           Media               @relation(fields: [mediaId], references: [id], onDelete: Cascade)\n  type            MediaPurchaseType   @default(RENTAL)\n  status          MediaPurchaseStatus @default(ACTIVE)\n  price           Decimal             @default(0.00) @db.Decimal(10, 2)\n  expiresAt       DateTime?\n  stripePaymentId String?\n  createdAt       DateTime            @default(now())\n  updatedAt       DateTime            @updatedAt\n\n  paymentId String?\n  payments  Payment[]\n\n  @@index([userId])\n  @@index([mediaId])\n  @@index([status])\n  @@map("media_purchases")\n}\n\nmodel Rental {\n  id        String       @id @default(uuid())\n  userId    String\n  user      User         @relation(fields: [userId], references: [id])\n  mediaId   String\n  media     Media        @relation(fields: [mediaId], references: [id])\n  status    RentalStatus @default(ACTIVE)\n  price     Decimal      @db.Decimal(10, 2)\n  expiresAt DateTime\n  createdAt DateTime     @default(now())\n  updatedAt DateTime     @updatedAt\n  payment   Payment[]\n\n  @@index([userId])\n  @@index([mediaId])\n  @@index([status])\n  @@map("rentals")\n}\n\nmodel Profile {\n  id         String     @id @default(uuid())\n  userId     String     @unique\n  name       String?\n  email      String?\n  image      String?\n  bio        String?\n  avatar     String?\n  coverImage String?\n  createdAt  DateTime   @default(now())\n  updatedAt  DateTime   @updatedAt\n  bookmark   Bookmark[]\n  favorite   Favorite[]\n  user       User       @relation(fields: [userId], references: [id])\n  medias     Media[]    @relation("MediaProfiles")\n\n  @@map("profile")\n}\n\nmodel Bookmark {\n  id        String   @id @default(uuid())\n  userId    String\n  mediaId   String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  profileId String?\n  media     Media    @relation(fields: [mediaId], references: [id])\n  profile   Profile? @relation(fields: [profileId], references: [id])\n  user      User     @relation(fields: [userId], references: [id])\n\n  @@index([userId])\n  @@map("bookmark")\n}\n\nmodel Favorite {\n  id        String   @id @default(uuid())\n  userId    String\n  mediaId   String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  profileId String?\n  media     Media    @relation(fields: [mediaId], references: [id])\n  profile   Profile? @relation(fields: [profileId], references: [id])\n  user      User     @relation(fields: [userId], references: [id])\n\n  @@index([userId])\n  @@map("favorite")\n}\n\nmodel Rating {\n  id        String   @id @default(uuid())\n  score     Int\n  createdAt DateTime @default(now())\n  userId    String\n  mediaId   String\n  media     Media    @relation(fields: [mediaId], references: [id], onDelete: Cascade)\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([userId, mediaId])\n  @@map("ratings")\n}\n\nmodel Review {\n  id         String       @id @default(uuid())\n  content    String\n  rating     Int\n  status     ReviewStatus @default(UNPUBLISHED)\n  createdAt  DateTime     @default(now())\n  updatedAt  DateTime     @updatedAt\n  userId     String\n  mediaId    String\n  media      Media        @relation(fields: [mediaId], references: [id], onDelete: Cascade)\n  user       User         @relation(fields: [userId], references: [id], onDelete: Cascade)\n  tags       String[]\n  hasSpoiler Boolean      @default(false)\n\n  @@map("reviews")\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Subscription {\n  id                 String             @id @default(uuid())\n  userId             String             @unique\n  user               User               @relation(fields: [userId], references: [id], onDelete: Cascade)\n  plan               SubscriptionPlan   @default(FREE)\n  status             SubscriptionStatus @default(ACTIVE)\n  stripeCustomerId   String?            @unique\n  stripePriceId      String?\n  currentPeriodStart DateTime?\n  currentPeriodEnd   DateTime?\n  cancelAtPeriodEnd  Boolean            @default(false)\n  createdAt          DateTime           @default(now())\n  updatedAt          DateTime           @updatedAt\n\n  payments Payment[]\n\n  @@index([userId])\n  @@index([plan])\n  @@index([status])\n  @@index([currentPeriodEnd])\n  @@map("subscriptions")\n}\n\nmodel WatchList {\n  id        String   @id @default(uuid())\n  userId    String\n  mediaId   String\n  createdAt DateTime @default(now())\n  media     Media    @relation(fields: [mediaId], references: [id], onDelete: Cascade)\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([userId, mediaId])\n}\n',
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
config.runtimeDataModel = JSON.parse('{"models":{"Admin":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"contactNumber","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminToUser"}],"dbName":"admin"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"watchList","kind":"object","type":"WatchList","relationName":"UserToWatchList"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"bookmarks","kind":"object","type":"Bookmark","relationName":"BookmarkToUser"},{"name":"favorites","kind":"object","type":"Favorite","relationName":"FavoriteToUser"},{"name":"mediaAdded","kind":"object","type":"Media","relationName":"MediaAddedBy"},{"name":"profile","kind":"object","type":"Profile","relationName":"ProfileToUser"},{"name":"ratings","kind":"object","type":"Rating","relationName":"RatingToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"},{"name":"subscriptions","kind":"object","type":"Subscription","relationName":"SubscriptionToUser"},{"name":"mediaPurchases","kind":"object","type":"MediaPurchase","relationName":"MediaPurchaseToUser"},{"name":"rentals","kind":"object","type":"Rental","relationName":"RentalToUser"},{"name":"admins","kind":"object","type":"Admin","relationName":"AdminToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Genre":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"isPublished","kind":"scalar","type":"Boolean"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"medias","kind":"object","type":"Media","relationName":"MediaGenres"}],"dbName":"genres"},"Media":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"type","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"releaseYear","kind":"scalar","type":"Int"},{"name":"director","kind":"scalar","type":"String"},{"name":"posterUrl","kind":"scalar","type":"String"},{"name":"backdropUrl","kind":"scalar","type":"String"},{"name":"trailerUrl","kind":"scalar","type":"String"},{"name":"streamingUrl","kind":"scalar","type":"String"},{"name":"rentalPrice","kind":"scalar","type":"Decimal"},{"name":"buyPrice","kind":"scalar","type":"Decimal"},{"name":"runtimeMinutes","kind":"scalar","type":"Int"},{"name":"seasons","kind":"scalar","type":"Int"},{"name":"pricing","kind":"enum","type":"Pricing"},{"name":"isPublished","kind":"scalar","type":"Boolean"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"avgRating","kind":"scalar","type":"Float"},{"name":"reviewCount","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"genres","kind":"object","type":"Genre","relationName":"MediaGenres"},{"name":"reviews","kind":"object","type":"Review","relationName":"MediaToReview"},{"name":"watchlistItems","kind":"object","type":"WatchList","relationName":"MediaToWatchList"},{"name":"viewCount","kind":"scalar","type":"Int"},{"name":"bookmarks","kind":"object","type":"Bookmark","relationName":"BookmarkToMedia"},{"name":"favorites","kind":"object","type":"Favorite","relationName":"FavoriteToMedia"},{"name":"purchases","kind":"object","type":"MediaPurchase","relationName":"MediaToMediaPurchase"},{"name":"cast","kind":"object","type":"CastMember","relationName":"CastMemberToMedia"},{"name":"rentals","kind":"object","type":"Rental","relationName":"MediaToRental"},{"name":"ratings","kind":"object","type":"Rating","relationName":"MediaToRating"},{"name":"profiles","kind":"object","type":"Profile","relationName":"MediaProfiles"},{"name":"users","kind":"object","type":"User","relationName":"MediaAddedBy"}],"dbName":"media"},"CastMember":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"role","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"CastMemberToMedia"}],"dbName":"cast_members"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"subscriptionId","kind":"scalar","type":"String"},{"name":"subscription","kind":"object","type":"Subscription","relationName":"PaymentToSubscription"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"currency","kind":"scalar","type":"String"},{"name":"stripePaymentId","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"mediaPurchaseId","kind":"scalar","type":"String"},{"name":"mediaPurchase","kind":"object","type":"MediaPurchase","relationName":"MediaPurchaseToPayment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"rentalId","kind":"scalar","type":"String"},{"name":"rental","kind":"object","type":"Rental","relationName":"PaymentToRental"}],"dbName":"payments"},"MediaPurchase":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"MediaPurchaseToUser"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"MediaToMediaPurchase"},{"name":"type","kind":"enum","type":"MediaPurchaseType"},{"name":"status","kind":"enum","type":"MediaPurchaseStatus"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"stripePaymentId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"paymentId","kind":"scalar","type":"String"},{"name":"payments","kind":"object","type":"Payment","relationName":"MediaPurchaseToPayment"}],"dbName":"media_purchases"},"Rental":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"RentalToUser"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"MediaToRental"},{"name":"status","kind":"enum","type":"RentalStatus"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"payment","kind":"object","type":"Payment","relationName":"PaymentToRental"}],"dbName":"rentals"},"Profile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"avatar","kind":"scalar","type":"String"},{"name":"coverImage","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"bookmark","kind":"object","type":"Bookmark","relationName":"BookmarkToProfile"},{"name":"favorite","kind":"object","type":"Favorite","relationName":"FavoriteToProfile"},{"name":"user","kind":"object","type":"User","relationName":"ProfileToUser"},{"name":"medias","kind":"object","type":"Media","relationName":"MediaProfiles"}],"dbName":"profile"},"Bookmark":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"profileId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"BookmarkToMedia"},{"name":"profile","kind":"object","type":"Profile","relationName":"BookmarkToProfile"},{"name":"user","kind":"object","type":"User","relationName":"BookmarkToUser"}],"dbName":"bookmark"},"Favorite":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"profileId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"FavoriteToMedia"},{"name":"profile","kind":"object","type":"Profile","relationName":"FavoriteToProfile"},{"name":"user","kind":"object","type":"User","relationName":"FavoriteToUser"}],"dbName":"favorite"},"Rating":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"score","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"MediaToRating"},{"name":"user","kind":"object","type":"User","relationName":"RatingToUser"}],"dbName":"ratings"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"ReviewStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"MediaToReview"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"tags","kind":"scalar","type":"String"},{"name":"hasSpoiler","kind":"scalar","type":"Boolean"}],"dbName":"reviews"},"Subscription":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SubscriptionToUser"},{"name":"plan","kind":"enum","type":"SubscriptionPlan"},{"name":"status","kind":"enum","type":"SubscriptionStatus"},{"name":"stripeCustomerId","kind":"scalar","type":"String"},{"name":"stripePriceId","kind":"scalar","type":"String"},{"name":"currentPeriodStart","kind":"scalar","type":"DateTime"},{"name":"currentPeriodEnd","kind":"scalar","type":"DateTime"},{"name":"cancelAtPeriodEnd","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToSubscription"}],"dbName":"subscriptions"},"WatchList":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"media","kind":"object","type":"Media","relationName":"MediaToWatchList"},{"name":"user","kind":"object","type":"User","relationName":"UserToWatchList"}],"dbName":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","medias","_count","genres","media","user","reviews","watchlistItems","bookmark","profile","favorite","bookmarks","favorites","payments","subscription","mediaPurchase","payment","rental","purchases","cast","rentals","ratings","profiles","users","watchList","accounts","mediaAdded","sessions","subscriptions","mediaPurchases","admins","Admin.findUnique","Admin.findUniqueOrThrow","Admin.findFirst","Admin.findFirstOrThrow","Admin.findMany","data","Admin.createOne","Admin.createMany","Admin.createManyAndReturn","Admin.updateOne","Admin.updateMany","Admin.updateManyAndReturn","create","update","Admin.upsertOne","Admin.deleteOne","Admin.deleteMany","having","_min","_max","Admin.groupBy","Admin.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Genre.findUnique","Genre.findUniqueOrThrow","Genre.findFirst","Genre.findFirstOrThrow","Genre.findMany","Genre.createOne","Genre.createMany","Genre.createManyAndReturn","Genre.updateOne","Genre.updateMany","Genre.updateManyAndReturn","Genre.upsertOne","Genre.deleteOne","Genre.deleteMany","Genre.groupBy","Genre.aggregate","Media.findUnique","Media.findUniqueOrThrow","Media.findFirst","Media.findFirstOrThrow","Media.findMany","Media.createOne","Media.createMany","Media.createManyAndReturn","Media.updateOne","Media.updateMany","Media.updateManyAndReturn","Media.upsertOne","Media.deleteOne","Media.deleteMany","_avg","_sum","Media.groupBy","Media.aggregate","CastMember.findUnique","CastMember.findUniqueOrThrow","CastMember.findFirst","CastMember.findFirstOrThrow","CastMember.findMany","CastMember.createOne","CastMember.createMany","CastMember.createManyAndReturn","CastMember.updateOne","CastMember.updateMany","CastMember.updateManyAndReturn","CastMember.upsertOne","CastMember.deleteOne","CastMember.deleteMany","CastMember.groupBy","CastMember.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","MediaPurchase.findUnique","MediaPurchase.findUniqueOrThrow","MediaPurchase.findFirst","MediaPurchase.findFirstOrThrow","MediaPurchase.findMany","MediaPurchase.createOne","MediaPurchase.createMany","MediaPurchase.createManyAndReturn","MediaPurchase.updateOne","MediaPurchase.updateMany","MediaPurchase.updateManyAndReturn","MediaPurchase.upsertOne","MediaPurchase.deleteOne","MediaPurchase.deleteMany","MediaPurchase.groupBy","MediaPurchase.aggregate","Rental.findUnique","Rental.findUniqueOrThrow","Rental.findFirst","Rental.findFirstOrThrow","Rental.findMany","Rental.createOne","Rental.createMany","Rental.createManyAndReturn","Rental.updateOne","Rental.updateMany","Rental.updateManyAndReturn","Rental.upsertOne","Rental.deleteOne","Rental.deleteMany","Rental.groupBy","Rental.aggregate","Profile.findUnique","Profile.findUniqueOrThrow","Profile.findFirst","Profile.findFirstOrThrow","Profile.findMany","Profile.createOne","Profile.createMany","Profile.createManyAndReturn","Profile.updateOne","Profile.updateMany","Profile.updateManyAndReturn","Profile.upsertOne","Profile.deleteOne","Profile.deleteMany","Profile.groupBy","Profile.aggregate","Bookmark.findUnique","Bookmark.findUniqueOrThrow","Bookmark.findFirst","Bookmark.findFirstOrThrow","Bookmark.findMany","Bookmark.createOne","Bookmark.createMany","Bookmark.createManyAndReturn","Bookmark.updateOne","Bookmark.updateMany","Bookmark.updateManyAndReturn","Bookmark.upsertOne","Bookmark.deleteOne","Bookmark.deleteMany","Bookmark.groupBy","Bookmark.aggregate","Favorite.findUnique","Favorite.findUniqueOrThrow","Favorite.findFirst","Favorite.findFirstOrThrow","Favorite.findMany","Favorite.createOne","Favorite.createMany","Favorite.createManyAndReturn","Favorite.updateOne","Favorite.updateMany","Favorite.updateManyAndReturn","Favorite.upsertOne","Favorite.deleteOne","Favorite.deleteMany","Favorite.groupBy","Favorite.aggregate","Rating.findUnique","Rating.findUniqueOrThrow","Rating.findFirst","Rating.findFirstOrThrow","Rating.findMany","Rating.createOne","Rating.createMany","Rating.createManyAndReturn","Rating.updateOne","Rating.updateMany","Rating.updateManyAndReturn","Rating.upsertOne","Rating.deleteOne","Rating.deleteMany","Rating.groupBy","Rating.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","Subscription.findUnique","Subscription.findUniqueOrThrow","Subscription.findFirst","Subscription.findFirstOrThrow","Subscription.findMany","Subscription.createOne","Subscription.createMany","Subscription.createManyAndReturn","Subscription.updateOne","Subscription.updateMany","Subscription.updateManyAndReturn","Subscription.upsertOne","Subscription.deleteOne","Subscription.deleteMany","Subscription.groupBy","Subscription.aggregate","WatchList.findUnique","WatchList.findUniqueOrThrow","WatchList.findFirst","WatchList.findFirstOrThrow","WatchList.findMany","WatchList.createOne","WatchList.createMany","WatchList.createManyAndReturn","WatchList.updateOne","WatchList.updateMany","WatchList.updateManyAndReturn","WatchList.upsertOne","WatchList.deleteOne","WatchList.deleteMany","WatchList.groupBy","WatchList.aggregate","AND","OR","NOT","id","userId","mediaId","createdAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","SubscriptionPlan","plan","SubscriptionStatus","status","stripeCustomerId","stripePriceId","currentPeriodStart","currentPeriodEnd","cancelAtPeriodEnd","updatedAt","content","rating","ReviewStatus","tags","hasSpoiler","has","hasEvery","hasSome","score","profileId","name","email","image","bio","avatar","coverImage","RentalStatus","price","expiresAt","MediaPurchaseType","type","MediaPurchaseStatus","stripePaymentId","paymentId","subscriptionId","amount","currency","mediaPurchaseId","rentalId","role","title","slug","description","releaseYear","director","posterUrl","backdropUrl","trailerUrl","streamingUrl","rentalPrice","buyPrice","runtimeMinutes","seasons","Pricing","pricing","isPublished","isFeatured","avgRating","reviewCount","viewCount","identifier","value","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","emailVerified","Role","UserStatus","needPasswordChange","isDeleted","deletedAt","profilePhoto","contactNumber","every","some","none","userId_mediaId","title_releaseYear","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide","push"]'),
  graph: "5wqkAaACDgcAAOcEACDJAgAA4wQAMMoCAABpABDLAgAA4wQAMMwCAQAAAAHNAgEAAAABzwJAANgEACHkAkAA2AQAIe8CAQDXBAAh8AIBAAAAAakDIADlBAAhqgNAAOYEACGrAwEA5AQAIawDAQDkBAAhAQAAAAEAIAkGAACCBQAgBwAA5wQAIMkCAACfBQAwygIAAAMAEMsCAACfBQAwzAIBANcEACHNAgEA1wQAIc4CAQDXBAAhzwJAANgEACECBgAAxQkAIAcAALYJACAKBgAAggUAIAcAAOcEACDJAgAAnwUAMMoCAAADABDLAgAAnwUAMMwCAQAAAAHNAgEA1wQAIc4CAQDXBAAhzwJAANgEACGwAwAAngUAIAMAAAADACABAAAEADACAAAFACALAwAA9QQAIMkCAACdBQAwygIAAAcAEMsCAACdBQAwzAIBANcEACHPAkAA2AQAIeQCQADYBAAh7wIBANcEACGEAwEA1wQAIZIDIADlBAAhkwMgAOUEACEBAwAAvAkAIAsDAAD1BAAgyQIAAJ0FADDKAgAABwAQywIAAJ0FADDMAgEAAAABzwJAANgEACHkAkAA2AQAIe8CAQAAAAGEAwEAAAABkgMgAOUEACGTAyAA5QQAIQMAAAAHACABAAAIADACAAAJACAlBQAAmQUAIAgAAPgEACAJAADxBAAgDQAA8wQAIA4AAPQEACAUAAD7BAAgFQAAmgUAIBYAAPwEACAXAAD3BAAgGAAAmwUAIBkAAJwFACDJAgAAlAUAMMoCAAALABDLAgAAlAUAMMwCAQDXBAAhzwJAANgEACHkAkAA2AQAIfkCAQDXBAAhgwMBANcEACGEAwEA1wQAIYUDAQDXBAAhhgMCAIEFACGHAwEA1wQAIYgDAQDkBAAhiQMBAOQEACGKAwEA5AQAIYsDAQDkBAAhjAMQAJUFACGNAxAAlQUAIY4DAgCWBQAhjwMCAJYFACGRAwAAlwWRAyKSAyAA5QQAIZMDIADlBAAhlAMIAJgFACGVAwIAgQUAIZYDAgCBBQAhFAUAAMkJACAIAAC_CQAgCQAAuAkAIA0AALoJACAOAAC7CQAgFAAAwgkAIBUAAMoJACAWAADDCQAgFwAAvgkAIBgAAMsJACAZAADMCQAgiAMAAKkFACCJAwAAqQUAIIoDAACpBQAgiwMAAKkFACCMAwAAqQUAII0DAACpBQAgjgMAAKkFACCPAwAAqQUAIJQDAACpBQAgJgUAAJkFACAIAAD4BAAgCQAA8QQAIA0AAPMEACAOAAD0BAAgFAAA-wQAIBUAAJoFACAWAAD8BAAgFwAA9wQAIBgAAJsFACAZAACcBQAgyQIAAJQFADDKAgAACwAQywIAAJQFADDMAgEAAAABzwJAANgEACHkAkAA2AQAIfkCAQDXBAAhgwMBANcEACGEAwEAAAABhQMBANcEACGGAwIAgQUAIYcDAQDXBAAhiAMBAOQEACGJAwEA5AQAIYoDAQDkBAAhiwMBAOQEACGMAxAAlQUAIY0DEACVBQAhjgMCAJYFACGPAwIAlgUAIZEDAACXBZEDIpIDIADlBAAhkwMgAOUEACGUAwgAmAUAIZUDAgCBBQAhlgMCAIEFACGxAwAAkwUAIAMAAAALACABAAAMADACAAANACABAAAACwAgDwYAAIIFACAHAADnBAAgyQIAAJEFADDKAgAAEAAQywIAAJEFADDMAgEA1wQAIc0CAQDXBAAhzgIBANcEACHPAkAA2AQAId4CAACSBegCIuQCQADYBAAh5QIBANcEACHmAgIAgQUAIegCAACtBAAg6QIgAOUEACECBgAAxQkAIAcAALYJACAPBgAAggUAIAcAAOcEACDJAgAAkQUAMMoCAAAQABDLAgAAkQUAMMwCAQAAAAHNAgEA1wQAIc4CAQDXBAAhzwJAANgEACHeAgAAkgXoAiLkAkAA2AQAIeUCAQDXBAAh5gICAIEFACHoAgAArQQAIOkCIADlBAAhAwAAABAAIAEAABEAMAIAABIAIAMAAAADACABAAAEADACAAAFACAMBgAAggUAIAcAAOcEACALAAD2BAAgyQIAAJAFADDKAgAAFQAQywIAAJAFADDMAgEA1wQAIc0CAQDXBAAhzgIBANcEACHPAkAA2AQAIeQCQADYBAAh7gIBAOQEACEEBgAAxQkAIAcAALYJACALAAC9CQAg7gIAAKkFACAMBgAAggUAIAcAAOcEACALAAD2BAAgyQIAAJAFADDKAgAAFQAQywIAAJAFADDMAgEAAAABzQIBANcEACHOAgEA1wQAIc8CQADYBAAh5AJAANgEACHuAgEA5AQAIQMAAAAVACABAAAWADACAAAXACARAwAA9QQAIAcAAOcEACAKAADzBAAgDAAA9AQAIMkCAAD-BAAwygIAABkAEMsCAAD-BAAwzAIBANcEACHNAgEA1wQAIc8CQADYBAAh5AJAANgEACHvAgEA5AQAIfACAQDkBAAh8QIBAOQEACHyAgEA5AQAIfMCAQDkBAAh9AIBAOQEACEBAAAAGQAgAwAAABUAIAEAABYAMAIAABcAIAwGAACCBQAgBwAA5wQAIAsAAPYEACDJAgAAjwUAMMoCAAAcABDLAgAAjwUAMMwCAQDXBAAhzQIBANcEACHOAgEA1wQAIc8CQADYBAAh5AJAANgEACHuAgEA5AQAIQQGAADFCQAgBwAAtgkAIAsAAL0JACDuAgAAqQUAIAwGAACCBQAgBwAA5wQAIAsAAPYEACDJAgAAjwUAMMoCAAAcABDLAgAAjwUAMMwCAQAAAAHNAgEA1wQAIc4CAQDXBAAhzwJAANgEACHkAkAA2AQAIe4CAQDkBAAhAwAAABwAIAEAAB0AMAIAAB4AIAEAAAAZACADAAAACwAgAQAADAAwAgAADQAgAQAAABUAIAEAAAAcACABAAAACwAgAwAAABwAIAEAAB0AMAIAAB4AIBEGAACCBQAgBwAA5wQAIA8AAOsEACDJAgAAjAUAMMoCAAAmABDLAgAAjAUAMMwCAQDXBAAhzQIBANcEACHOAgEA1wQAIc8CQADYBAAh3gIAAI4F-wIi5AJAANgEACH2AhAAhQUAIfcCQADmBAAh-QIAAI0F-QIi-wIBAOQEACH8AgEA5AQAIQYGAADFCQAgBwAAtgkAIA8AALcJACD3AgAAqQUAIPsCAACpBQAg_AIAAKkFACARBgAAggUAIAcAAOcEACAPAADrBAAgyQIAAIwFADDKAgAAJgAQywIAAIwFADDMAgEAAAABzQIBANcEACHOAgEA1wQAIc8CQADYBAAh3gIAAI4F-wIi5AJAANgEACH2AhAAhQUAIfcCQADmBAAh-QIAAI0F-QIi-wIBAOQEACH8AgEA5AQAIQMAAAAmACABAAAnADACAAAoACARBwAA5wQAIBAAAIkFACARAACKBQAgEwAAiwUAIMkCAACHBQAwygIAACoAEMsCAACHBQAwzAIBANcEACHNAgEA1wQAIc8CQADYBAAh3gIBANcEACH7AgEA5AQAIf0CAQDkBAAh_gIIAIgFACH_AgEA1wQAIYADAQDkBAAhgQMBAOQEACEIBwAAtgkAIBAAAMYJACARAADHCQAgEwAAyAkAIPsCAACpBQAg_QIAAKkFACCAAwAAqQUAIIEDAACpBQAgEQcAAOcEACAQAACJBQAgEQAAigUAIBMAAIsFACDJAgAAhwUAMMoCAAAqABDLAgAAhwUAMMwCAQAAAAHNAgEA1wQAIc8CQADYBAAh3gIBANcEACH7AgEAAAAB_QIBAOQEACH-AggAiAUAIf8CAQDXBAAhgAMBAAAAAYEDAQAAAAEDAAAAKgAgAQAAKwAwAgAALAAgEAcAAOcEACAPAADrBAAgyQIAAOgEADDKAgAALgAQywIAAOgEADDMAgEA1wQAIc0CAQDXBAAhzwJAANgEACHcAgAA6QTcAiLeAgAA6gTeAiLfAgEA5AQAIeACAQDkBAAh4QJAAOYEACHiAkAA5gQAIeMCIADlBAAh5AJAANgEACEBAAAALgAgAwAAACoAIAEAACsAMAIAACwAIAEAAAAqACABAAAAJgAgDgYAAIIFACAHAADnBAAgEgAA6wQAIMkCAACDBQAwygIAADMAEMsCAACDBQAwzAIBANcEACHNAgEA1wQAIc4CAQDXBAAhzwJAANgEACHeAgAAhAX2AiLkAkAA2AQAIfYCEACFBQAh9wJAANgEACEBAAAAMwAgAwAAACoAIAEAACsAMAIAACwAIAEAAAAqACABAAAAKgAgCQYAAIIFACDJAgAAhgUAMMoCAAA4ABDLAgAAhgUAMMwCAQDXBAAhzgIBANcEACHvAgEA1wQAIfECAQDkBAAhggMBANcEACECBgAAxQkAIPECAACpBQAgCQYAAIIFACDJAgAAhgUAMMoCAAA4ABDLAgAAhgUAMMwCAQAAAAHOAgEA1wQAIe8CAQDXBAAh8QIBAOQEACGCAwEA1wQAIQMAAAA4ACABAAA5ADACAAA6ACADBgAAxQkAIAcAALYJACASAAC3CQAgDgYAAIIFACAHAADnBAAgEgAA6wQAIMkCAACDBQAwygIAADMAEMsCAACDBQAwzAIBAAAAAc0CAQDXBAAhzgIBANcEACHPAkAA2AQAId4CAACEBfYCIuQCQADYBAAh9gIQAIUFACH3AkAA2AQAIQMAAAAzACABAAA8ADACAAA9ACAKBgAAggUAIAcAAOcEACDJAgAAgAUAMMoCAAA_ABDLAgAAgAUAMMwCAQDXBAAhzQIBANcEACHOAgEA1wQAIc8CQADYBAAh7QICAIEFACECBgAAxQkAIAcAALYJACALBgAAggUAIAcAAOcEACDJAgAAgAUAMMoCAAA_ABDLAgAAgAUAMMwCAQAAAAHNAgEA1wQAIc4CAQDXBAAhzwJAANgEACHtAgIAgQUAIbADAAD_BAAgAwAAAD8AIAEAAEAAMAIAAEEAIAoDAAC8CQAgBwAAtgkAIAoAALoJACAMAAC7CQAg7wIAAKkFACDwAgAAqQUAIPECAACpBQAg8gIAAKkFACDzAgAAqQUAIPQCAACpBQAgEQMAAPUEACAHAADnBAAgCgAA8wQAIAwAAPQEACDJAgAA_gQAMMoCAAAZABDLAgAA_gQAMMwCAQAAAAHNAgEAAAABzwJAANgEACHkAkAA2AQAIe8CAQDkBAAh8AIBAOQEACHxAgEA5AQAIfICAQDkBAAh8wIBAOQEACH0AgEA5AQAIQMAAAAZACABAABDADACAABEACAdCAAA-AQAIAsAAPYEACANAADzBAAgDgAA9AQAIA8AAOsEACAWAAD8BAAgFwAA9wQAIBoAAPEEACAbAADyBAAgHAAA9QQAIB0AAPkEACAeAAD6BAAgHwAA-wQAICAAAP0EACDJAgAA7gQAMMoCAABGABDLAgAA7gQAMMwCAQDXBAAhzwJAANgEACHeAgAA8ASoAyLkAkAA2AQAIe8CAQDXBAAh8AIBANcEACHxAgEA5AQAIYIDAADvBKcDIqUDIADlBAAhqAMgAOUEACGpAyAA5QQAIaoDQADmBAAhEAgAAL8JACALAAC9CQAgDQAAugkAIA4AALsJACAPAAC3CQAgFgAAwwkAIBcAAL4JACAaAAC4CQAgGwAAuQkAIBwAALwJACAdAADACQAgHgAAwQkAIB8AAMIJACAgAADECQAg8QIAAKkFACCqAwAAqQUAIB0IAAD4BAAgCwAA9gQAIA0AAPMEACAOAAD0BAAgDwAA6wQAIBYAAPwEACAXAAD3BAAgGgAA8QQAIBsAAPIEACAcAAD1BAAgHQAA-QQAIB4AAPoEACAfAAD7BAAgIAAA_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ACwBQAhqwMBAK8FACGsAwEArwUAIQIAAABpACAmAACEAQAgAgAAAGkAICYAAIQBACADAAAAAQAgLQAAfQAgLgAAggEAIAEAAAABACABAAAAaQAgBgQAALEJACAzAACzCQAgNAAAsgkAIKoDAACpBQAgqwMAAKkFACCsAwAAqQUAIA3JAgAA4gQAMMoCAACLAQAQywIAAOIEADDMAgEAkgQAIc0CAQCSBAAhzwJAAJMEACHkAkAAkwQAIe8CAQCSBAAh8AIBAJIEACGpAyAAngQAIaoDQACdBAAhqwMBAJwEACGsAwEAnAQAIQMAAABpACABAACKAQAwMgAAiwEAIAMAAABpACABAABqADACAAABACABAAAASAAgAQAAAEgAIAMAAABGACABAABHADACAABIACADAAAARgAgAQAARwAwAgAASAAgAwAAAEYAIAEAAEcAMAIAAEgAIBoIAADtBwAgCwAA6wcAIA0AAOkHACAOAADqBwAgDwAA7wcAIBYAAPIHACAXAADsBwAgGgAA5wcAIBsAAOgHACAcAACwCQAgHQAA7gcAIB4AAPAHACAfAADxBwAgIAAA8wcAIMwCAQAAAAHPAkAAAAAB3gIAAACoAwLkAkAAAAAB7wIBAAAAAfACAQAAAAHxAgEAAAABggMAAACnAwKlAyAAAAABqAMgAAAAAakDIAAAAAGqA0AAAAABASYAAJMBACAMzAIBAAAAAc8CQAAAAAHeAgAAAKgDAuQCQAAAAAHvAgEAAAAB8AIBAAAAAfECAQAAAAGCAwAAAKcDAqUDIAAAAAGoAyAAAAABqQMgAAAAAaoDQAAAAAEBJgAAlQEAMAEmAACVAQAwGggAAKIGACALAACgBgAgDQAAngYAIA4AAJ8GACAPAACkBgAgFgAApwYAIBcAAKEGACAaAACcBgAgGwAAnQYAIBwAAKcJACAdAACjBgAgHgAApQYAIB8AAKYGACAgAACoBgAgzAIBAKMFACHPAkAApAUAId4CAACaBqgDIuQCQACkBQAh7wIBAKMFACHwAgEAowUAIfECAQCvBQAhggMAAJkGpwMipQMgALEFACGoAyAAsQUAIakDIACxBQAhqgNAALAFACECAAAASAAgJgAAmAEAIAzMAgEAowUAIc8CQACkBQAh3gIAAJoGqAMi5AJAAKQFACHvAgEAowUAIfACAQCjB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-AgAIDMAAPsIACA0AAD6CAAglQEAAPkIACCWAQAA_AgAIIgDAACpBQAgiQMAAKkFACCKAwAAqQUAIIsDAACpBQAgjAMAAKkFACCNAwAAqQUAII4DAACpBQAgjwMAAKkFACCUAwAAqQUAIBrJAgAAyAQAMMoCAACSAgAQywIAAMgEADDMAgEAkgQAIc8CQACTBAAh5AJAAJMEACH5AgEAkgQAIYMDAQCSBAAhhAMBAJIEACGFAwEAkgQAIYYDAgCrBAAhhwMBAJIEACGIAwEAnAQAIYkDAQCcBAAhigMBAJwEACGLAwEAnAQAIYwDEADJBAAhjQMQAMkEACGOAwIAygQAIY8DAgDKBAAhkQMAAMsEkQMikgMgAJ4EACGTAyAAngQAIZQDCADMBAAhlQMCAKsEACGWAwIAqwQAIQMAAAALACABAACRAgAwMgAAkgIAIAMAAAALACABAAAMADACAAANACABAAAAOgAgAQAAADoAIAMAAAA4ACABAAA5ADACAAA6ACADAAAAOAAgAQAAOQAwAgAAOgAgAwAAADgAIAEAADkAMAIAADoAIAYGAAD3CAAgzAIBAAAAAc4CAQAAAAHvAgEAAAAB8QIBAAAAAYIDAQAAAAEBJgAAmgIAIAXMAgEAAAABzgIBAAAAAe8CAQAAAAHxAgEAAAABggMBAAAAAQEmAACcAgAwASYAAJwCADAGBgAA9ggAIMwCAQCjBQAhzgIBAKMFACHvAgEAowUAIfECAQCvBQAhggMBAKMFACECAAAAOgAgJgAAnwIAIAXMAgEAowUAIc4CAQCjBQAh7wIBAKMFACHxAgEArwUAIYIDAQCjBQAhAgAAADgAICYAAKECACACAAAAOAAgJgAAoQIAIAMAAAA6ACAtAACaAgAgLgAAnwIAIAEAAAA6ACABAAAAOAAgBAQAAPMIACAzAAD1CAAgNAAA9AgAIPECAACpBQAgCMkCAADHBAAwygIAAKgCABDLAgAAxwQAMMwCAQCSBAAhzgIBAJIEACHvAgEAkgQAIfECAQCcBAAhggMBAJIEACEDAAAAOAAgAQAApwIAMDIAAKgCACADAAAAOAAgAQAAOQAwAgAAOgAgAQAAACwAIAEAAAAsACADAAAAKgAgAQAAKwAwAgAALAAgAwAAACoAIAEAACsAMAIAACwAIAMAAAAqACABAAArADACAAAsACAOBwAAxAUAIBAAAM4GACARAADFBQAgEwAAxgUAIMwCAQAAAAHNAgEAAAABzwJAAAAAAd4CAQAAAAH7AgEAAAAB_QIBAAAAAf4CCAAAAAH_AgEAAAABgAMBAAAAAYEDAQAAAAEBJgAAsAIAIArMAgEAAAABzQIBAAAAAc8CQAAAAAHeAgEAAAAB-wIBAAAAAf0CAQAAAAH-AggAAAAB_wIBAAAAAYADAQAAAAGBAwEAAAABASYAALICADABJgAAsgIAMAEAAAAuACABAAAAJgAgAQAAADMAIA4HAADABQAgEAAAzAYAIBEAAMEFACATAADCBQAgzAIBAKMFACHNAgEAowUAIc8CQACkBQAh3gIBAKMFACH7AgEArwUAIf0CAQCvBQAh_gIIAL4FACH_AgEAowUAIYADAQCvBQAhgQMBAK8FACECAAAALAAgJgAAuAIAIArMAgEAowUAIc0CAQCjBQAhzwJAAKQFACHeAgEAowUAIfsCAQCvBQAh_QIBAK8FACH-AggAvgUAIf8CAQCjBQAhgAMBAK8FACGBAwEArwUAIQIAAAAqACAmAAC6AgAgAgAAACoAICYAALoCACABAAAALgAgAQAAACYAIAEAAAAzACADAAAALAAgLQAAsAIAIC4AALgCACABAAAALAAgAQAAACoAIAkEAADuCAAgMwAA8QgAIDQAAPAIACCVAQAA7wgAIJYBAADyCAAg-wIAAKkFACD9AgAAqQUAIIADAACpBQAggQMAAKkFACANyQIAAMQEADDKAgAAxAIAEMsCAADEBAAwzAIBAJIEACHNAgEAkgQAIc8CQACTBAAh3gIBAJIEACH7AgEAnAQAIf0CAQCcBAAh_gIIAMUEACH_AgEAkgQAIYADAQCcBAAhgQMBAJwEACEDAAAAKgAgAQAAwwIAMDIAAMQCACADAAAAKgAgAQAAKwAwAgAALAAgAQAAACgAIAEAAAAoACADAAAAJgAgAQAAJwAwAgAAKAAgAwAAACYAIAEAACcAMAIAACgAIAMAAAAmACABAAAnADACAAAoACAOBgAA6wYAIAcAAJ4IACAPAADsBgAgzAIBAAAAAc0CAQAAAAHOAgEAAAABzwJAAAAAAd4CAAAA-wIC5AJAAAAAAfYCEAAAAAH3AkAAAAAB-QIAAAD5AgL7AgEAAAAB_AIBAAAAAQEmAADMAgAgC8wCAQAAAAHNAgEAAAABzgIBAAAAAc8CQAAAAAHeAgAAAPsCAuQCQAAAAAH2AhAAAAAB9wJAAAAAAfkCAAAA-QIC-wIBAAAAAfwCAQAAAAEBJgAAzgIAMAEmAADOAgAwDgYAAN8GACAHAACcCAAgDwAA4AYAIMwCAQCjBQAhzQIBAKMFACHOAgEAowUAIc8CQACkBQAh3gIAAN0G-wIi5AJAAKQFACH2AhAAwAYAIfcCQACwBQAh-QIAANwG-QIi-wIBAK8FACH8AgEArwUAIQIAAAAoACAmAADRAgAgC8wCAQCjBQAhzQIBAKMFACHOAgEAowUAIc8CQACkBQAh3gIAAN0G-wIi5AJAAKQFACH2AhAAwAYAIfcCQACwBQAh-QIAANwG-QIi-wIBAK8FACH8AgEArwUAIQIAAAAmACAmAADTAgAgAgAAACYAICYAANMCACADAAAAKAAgLQAAzAIAIC4AANECACABAAAAKAAgAQAAACYAIAgEAADpCAAgMwAA7AgAIDQAAOsIACCVAQAA6ggAIJYBAADtCAAg9wIAAKkFACD7AgAAqQUAIPwCAACpBQAgDskCAAC9BAAwygIAANoCABDLAgAAvQQAMMwCAQCSBAAhzQIBAJIEACHOAgEAkgQAIc8CQACTBAAh3gIAAL8E-wIi5AJAAJMEACH2AhAAuAQAIfcCQACdBAAh-QIAAL4E-QIi-wIBAJwEACH8AgEAnAQAIQMAAAAmACABAADZAgAwMgAA2gIAIAMAAAAmACABAAAnADACAAAoACABAAAAPQAgAQAAAD0AIAMAAAAzACABAAA8ADACAAA9ACADAAAAMwAgAQAAPAAwAgAAPQAgAwAAADMAIAEAADwAMAIAAD0AIAsGAADQBgAgBwAAhwgAIBIAANEGACDMAgEAAAABzQIBAAAAAc4CAQAAAAHPAkAAAAAB3gIAAAD2AgLkAkAAAAAB9gIQAAAAAfcCQAAAAAEBJgAA4gIAIAjMAgEAAAABzQIBAAAAAc4CAQAAAAHPAkAAAAAB3gIAAAD2AgLkAkAAAAAB9gIQAAAAAfcCQAAAAAEBJgAA5AIAMAEmAADkAgAwCwYAAMIGACAHAACFCAAgEgAAwwYAIMwCAQCjBQAhzQIBAKMFACHOAgEAowUAIc8CQACkBQAh3gIAAL8G9gIi5AJAAKQFACH2AhAAwAYAIfcCQACkBQAhAgAAAD0AICYAAOcCACAIzAIBAKMFACHNAgEAowUAIc4CAQCjBQAhzwJAAKQFACHeAgAAvwb2AiLkAkAApAUAIfYCEADABgAh9wJAAKQFACECAAAAMwAgJgAA6QIAIAIAAAAzACAmAADpAgAgAwAAAD0AIC0AAOICACAuAADnAgAgAQAAAD0AIAEAAAAzACAFBAAA5AgAIDMAAOcIACA0AADmCAAglQEAAOUIACCWAQAA6AgAIAvJAgAAtgQAMMoCAADwAgAQywIAALYEADDMAgEAkgQAIc0CAQCSBAAhzgIBAJIEACHPAkAAkwQAId4CAAC3BPYCIuQCQACTBAAh9gIQALgEACH3AkAAkwQAIQMAAAAzACABAADvAgAwMgAA8AIAIAMAAAAzACABAAA8ADACAAA9ACABAAAARAAgAQAAAEQAIAMAAAAZACABAABDADACAABEACADAAAAGQAgAQAAQwAwAgAARAAgAwAAABkAIAEAAEMAMAIAAEQAIA4DAACtBwAgBwAA4wgAIAoAAKsHACAMAACsBwAgzAIBAAAAAc0CAQAAAAHPAkAAAAAB5AJAAAAAAe8CAQAAAAHwAgEAAAAB8QIBAAAAAfICAQAAAAHzAgEAAAAB9AIBAAAAAQEmAAD4AgAgCswCAQAAAAHNAgEAAAABzwJAAAAAAeQCQAAAAAHvAgEAAAAB8AIBAAAAAfECAQAAAAHyAgEAAAAB8wIBAAAAAfQCAQAAAAEBJgAA-gIAMAEmAAD6AgAwDgMAAPcFACAHAAD2BQAgCgAA9AUAIAwAAPUFACDMAgEAowUAIc0CAQCjBQAhzwJAAKQFACHkAkAApAUAIe8CAQCvBQAh8AIBAK8FACHxAgEArwUAIfICAQCvBQAh8wIBAK8FACH0AgEArwUAIQIAAABEACAmAAD9AgAgCswCAQCjBQAhzQIBAKMFACHPAkAApAUAIeQCQACkBQAh7wIBAK8FACHwAgEArwUAIfECAQCvBQAh8gIBAK8FACHzAgEArwUAIfQCAQCvBQAhAgAAABkAICYAAP8CACACAAAAGQAgJgAA_wIAIAMAAABEACAtAAD4AgAgLgAA_QIAIAEAAABEACABAAAAGQAgCQQAAPEFACAzAADzBQAgNAAA8gUAIO8CAACpBQAg8AIAAKkFACDxAgAAqQUAIPICAACpBQAg8wIAAKkFACD0AgAAqQUAIA3JAgAAtQQAMMoCAACGAwAQywIAALUEADDMAgEAkgQAIc0CAQCSBAAhzwJAAJMEACHkAkAAkwQAIe8CAQCcBAAh8AIBAJwEACHxAgEAnAQAIfICAQCcBAAh8wIBAJwEACH0AgEAnAQAIQMAAAAZACABAACFAwAwMgAAhgMAIAMAAAAZACABAABDADACAABEACABAAAAFwAgAQAAABcAIAMAAAAVACABAAAWADACAAAXACADAAAAFQAgAQAAFgAwAgAAFwAgAwAAABUAIAEAABYAMAIAABcAIAkGAADuBQAgBwAA8AUAIAsAAO8FACDMAgEAAAABzQIBAAAAAc4CAQAAAAHPAkAAAAAB5AJAAAAAAe4CAQAAAAEBJgAAjgMAIAbMAgEAAAABzQIBAAAAAc4CAQAAAAHPAkAAAAAB5AJAAAAAAe4CAQAAAAEBJgAAkAMAMAEmAACQAwAwAQAAABkAIAkGAADrBQAgBwAA7QUAIAsAAOwFACDMAgEAowUAIc0CAQCjBQAhzgIBAKMFACHPAkAApAUAIeQCQACkBQAh7gIBAK8FACECAAAAFwAgJgAAlAMAIAbMAgEAowUAIc0CAQCjBQAhzgIBAKMFACHPAkAApAUAIeQCQACkBQAh7gIBAK8FACECAAAAFQAgJgAAlgMAIAIAAAAVACAmAACWAwAgAQAAABkAIAMAAAAXACAtAACOAwAgLgAAlAMAIAEAAAAXACABAAAAFQAgBAQAAOgFACAzAADqBQAgNAAA6QUAIO4CAACpBQAgCckCAAC0BAAwygIAAJ4DABDLAgAAtAQAMMwCAQCSBAAhzQIBAJIEACHOAgEAkgQAIc8CQACTBAAh5AJAAJMEACHuAgEAnAQAIQMAAAAVACABAACdAwAwMgAAngMAIAMAAAAVACABAAAWADACAAAXACABAAAAHgAgAQAAAB4AIAMAAAAcACABAAAdADACAAAeACADAAAAHAAgAQAAHQAwAgAAHgAgAwAAABwAIAEAAB0AMAIAAB4AIAkGAADlBQAgBwAA5wUAIAsAAOYFACDMAgEAAAABzQIBAAAAAc4CAQAAAAHPAkAAAAAB5AJAAAAAAe4CAQAAAAEBJgAApgMAIAbMAgEAAAABzQIBAAAAAc4CAQAAAAHPAkAAAAAB5AJAAAAAAe4CAQAAAAEBJgAAqAMAMAEmAACoAwAwAQAAABkAIAkGAADiBQAgBwAA5AUAIAsAAOMFACDMAgEAowUAIc0CAQCjBQAhzgIBAKMFACHPAkAApAUAIeQCQACkBQAh7gIBAK8FACECAAAAHgAgJgAArAMAIAbMAgEAowUAIc0CAQCjBQAhzgIBAKMFACHPAkAApAUAIeQCQACkBQAh7gIBAK8FACECAAAAHAAgJgAArgMAIAIAAAAcACAmAACuAwAgAQAAABkAIAMAAAAeACAtAACmAwAgLgAArAMAIAEAAAAeACABAAAAHAAgBAQAAN8FACAzAADhBQAgNAAA4AUAIO4CAACpBQAgCckCAACzBAAwygIAALYDABDLAgAAswQAMMwCAQCSBAAhzQIBAJIEACHOAgEAkgQAIc8CQACTBAAh5AJAAJMEACHuAgEAnAQAIQMAAAAcACABAAC1AwAwMgAAtgMAIAMAAAAcACABAAAdADACAAAeACABAAAAQQAgAQAAAEEAIAMAAAA_ACABAABAADACAABBACADAAAAPwAgAQAAQAAwAgAAQQAgAwAAAD8AIAEAAEAAMAIAAEEAIAcGAADdBQAgBwAA3gUAIMwCAQAAAAHNAgEAAAABzgIBAAAAAc8CQAAAAAHtAgIAAAABASYAAL4DACAFzAIBAAAAAc0CAQAAAAHOAgEAAAABzwJAAAAAAe0CAgAAAAEBJgAAwAMAMAEmAADAAwAwBwYAANsFACAHAADcBQAgzAIBAKMFACHNAgEAowUAIc4CAQCjBQAhzwJAAKQFACHtAgIAzgUAIQIAAABBACAmAADDAwAgBcwCAQCjBQAhzQIBAKMFACHOAgEAowUAIc8CQACkBQAh7QICAM4FACECAAAAPwAgJgAAxQMAIAIAAAA_ACAmAADFAwAgAwAAAEEAIC0AAL4DACAuAADDAwAgAQAAAEEAIAEAAAA_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_BPsCIuQCQACTBAAh9gIQALgEACH3AkAAnQQAIfkCAAC-BPkCIvsCAQCcBAAh_AIBAJwEACEHBAAAlQQAIDMAAMMEACA0AADDBAAg0AIAAAD5AgLRAgAAAPkCCNICAAAA-QII1wIAAMIE-QIiBwQAAJUEACAzAADBBAAgNAAAwQQAINACAAAA-wIC0QIAAAD7AgjSAgAAAPsCCNcCAADABPsCIgcEAACVBAAgMwAAwQQAIDQAAMEEACDQAgAAAPsCAtECAAAA-wII0gIAAAD7AgjXAgAAwAT7AiIE0AIAAAD7AgLRAgAAAPsCCNICAAAA-wII1wIAAMEE-wIiBwQAAJUEACAzAADDBAAgNAAAwwQAINACAAAA-QIC0QIAAAD5AgjSAgAAAPkCCNcCAADCBPkCIgTQAgAAAPkCAtECAAAA-QII0gIAAAD5AgjXAgAAwwT5AiINyQIAAMQEADDKAgAAxAIAEMsCAADEBAAwzAIBAJIEACHNAgEAkgQAIc8CQACTBAAh3gIBAJIEACH7AgEAnAQAIf0CAQCcBAAh_gIIAMUEACH_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_JAgAA2wQAMMoCAAChAQAQywIAANsEADDMAgEAkgQAIc8CQACTBAAh3gIAAN0EqAMi5AJAAJMEACHvAgEAkgQAIfACAQCSBAAh8QIBAJwEACGCAwAA3ASnAyKlAyAAngQAIagDIACeBAAhqQMgAJ4EACGqA0AAnQQAIQcEAACVBAAgMwAA4QQAIDQAAOEEACDQAgAAAKcDAtECAAAApwMI0gIAAACnAwjXAgAA4ASnAyIHBAAAlQQAIDMAAN8EACA0AADfBAAg0AIAAACoAwLRAgAAAKgDCNICAAAAqAMI1wIAAN4EqAMiBwQAAJUEACAzAADfBAAgNAAA3wQAINACAAAAqAMC0QIAAACoAwjSAgAAAKgDCNcCAADeBKgDIgTQAgAAAKgDAtECAAAAqAMI0gIAAACoAwjXAgAA3wSoAyIHBAAAlQQAIDMAAOEEACA0AADhBAAg0AIAAACnAwLRAgAAAKcDCNICAAAApwMI1wIAAOAEpwMiBNACAAAApwMC0QIAAACnAwjSAgAAAKcDCNcCAADhBKcDIg3JAgAA4gQAMMoCAACLAQAQywIAAOIEADDMAgEAkgQAIc0CAQCSBAAhzwJAAJMEACHkAkAAkwQAIe8CAQCSBAAh8AIBAJIEACGpAyAAngQAIaoDQACdBAAhqwMBAJwEACGsAwEAnAQAIQ4HAADnBAAgyQIAAOMEADDKAgAAaQAQywIAAOMEADDMAgEA1wQAIc0CAQDXBAAhzwJAANgEACHkAkAA2AQAIe8CAQDXBAAh8AIBANcEACGpAyAA5QQAIaoDQADmBAAhqwMBAOQEACGsAwEA5AQAIQvQAgEAAAAB0QIBAAAABdICAQAAAAXTAgEAAAAB1AIBAAAAAdUCAQAAAAHWAgEAAAAB1wIBAKUEACHYAgEAAAAB2QIBAAAAAdoCAQAAAAEC0AIgAAAAAdcCIACgBAAhCNACQAAAAAHRAkAAAAAF0gJAAAAABdMCQAAAAAHUAkAAAAAB1QJAAAAAAdYCQAAAAAHXAkAAowQAIR8IAAD4BAAgCwAA9gQAIA0AAPMEACAOAAD0BAAgDwAA6wQAIBYAAPwEACAXAAD3BAAgGgAA8QQAIBsAAPIEACAcAAD1BAAgHQAA-QQAIB4AAPoEACAfAAD7BAAgIAAA_QQAIMkCAADuBAAwygIAAEYAEMsCAADuBAAwzAIBANcEACHPAkAA2AQAId4CAADwBKgDIuQCQADYBAAh7wIBANcEACHwAgEA1wQAIfECAQDkBAAhggMAAO8EpwMipQMgAOUEACGoAyAA5QQAIakDIADlBAAhqgNAAOYEACGyAwAARgAgswMAAEYAIBAHAADnBAAgDwAA6wQAIMkCAADoBAAwygIAAC4AEMsCAADoBAAwzAIBANcEACHNAgEA1wQAIc8CQADYBAAh3AIAAOkE3AIi3gIAAOoE3gIi3wIBAOQEACHgAgEA5AQAIeECQADmBAAh4gJAAOYEACHjAiAA5QQAIeQCQADYBAAhBNACAAAA3AIC0QIAAADcAgjSAgAAANwCCNcCAACpBNwCIgTQAgAAAN4CAtECAAAA3gII0gIAAADeAgjXAgAApwTeAiIDrQMAACoAIK4DAAAqACCvAwAAKgAgDAcAAOcEACDJAgAA7AQAMMoCAABfABDLAgAA7AQAMMwCAQDXBAAhzQIBANcEACHPAkAA2AQAIeQCQADYBAAh9wJAANgEACGiAwEA1wQAIaMDAQDkBAAhpAMBAOQEACERBwAA5wQAIMkCAADtBAAwygIAAFUAEMsCAADtBAAwzAIBANcEACHNAgEA1wQAIc8CQADYBAAh5AJAANgEACGZAwEA1wQAIZoDAQDXBAAhmwMBAOQEACGcAwEA5AQAIZ0DAQDkBAAhngNAAOYEACGfA0AA5gQAIaADAQDkBAAhoQMBAOQEACEdCAAA-AQAIAsAAPYEACANAADzBAAgDgAA9AQAIA8AAOsEACAWAAD8BAAgFwAA9wQAIBoAAPEEACAbAADyBAAgHAAA9QQAIB0AAPkEACAeAAD6BAAgHwAA-wQAICAAAP0EACDJAgAA7gQAMMoCAABGABDLAgAA7gQAMMwCAQDXBAAhzwJAANgEACHeAgAA8ASoAyLkAkAA2AQAIe8CAQDXBAAh8AIBANcEACHxAgEA5AQAIYIDAADvBKcDIqUDIADlBAAhqAMgAOUEACGpAyAA5QQAIaoDQADmBAAhBNACAAAApwMC0QIAAACnAwjSAgAAAKcDCNcCAADhBKcDIgTQAgAAAKgDAtECAAAAqAMI0gIAAACoAwjXAgAA3wSoAyIDrQMAAAMAIK4DAAADACCvAwAAAwAgA60DAABVACCuAwAAVQAgrwMAAFUAIAOtAwAAFQAgrgMAABUAIK8DAAAVACADrQMAABwAIK4DAAAcACCvAwAAHAAgA60DAAALACCuAwAACwAgrwMAAAsAIBMDAAD1BAAgBwAA5wQAIAoAAPMEACAMAAD0BAAgyQIAAP4EADDKAgAAGQAQywIAAP4EADDMAgEA1wQAIc0CAQDXBAAhzwJAANgEACHkAkAA2AQAIe8CAQDkBAAh8AIBAOQEACHxAgEA5AQAIfICAQDkBAAh8wIBAOQEACH0AgEA5AQAIbIDAAAZACCzAwAAGQAgA60DAAA_ACCuAwAAPwAgrwMAAD8AIAOtAwAAEAAgrgMAABAAIK8DAAAQACADrQMAAF8AIK4DAABfACCvAwAAXwAgA60DAAAuACCuAwAALgAgrwMAAC4AIAOtAwAAJgAgrgMAACYAIK8DAAAmACADrQMAADMAIK4DAAAzACCvAwAAMwAgA60DAABpACCuAwAAaQAgrwMAAGkAIBEDAAD1BAAgBwAA5wQAIAoAAPMEACAMAAD0BAAgyQIAAP4EADDKAgAAGQAQywIAAP4EADDMAgEA1wQAIc0CAQDXBAAhzwJAANgEACHkAkAA2AQAIe8CAQDkBAAh8AIBAOQEACHxAgEA5AQAIfICAQDkBAAh8wIBAOQEACH0AgEA5AQAIQLNAgEAAAABzgIBAAAAAQoGAACCBQAgBwAA5wQAIMkCAACABQAwygIAAD8AEMsCAACABQAwzAIBANcEACHNAgEA1wQAIc4CAQDXBAAhzwJAANgEACHtAgIAgQUAIQjQAgIAAAAB0QICAAAABNICAgAAAATTAgIAAAAB1AICAAAAAdUCAgAAAAHWAgIAAAAB1wICAJUEACEnBQAAmQUAIAgAAPgEACAJAADxBAAgDQAA8wQAIA4AAPQEACAUAAD7BAAgFQAAmgUAIBYAAPwEACAXAAD3BAAgGAAAmwUAIBkAAJwFACDJAgAAlAUAMMoCAAALABDLAgAAlAUAMMwCAQDXBAAhzwJAANgEACHkAkAA2AQAIfkCAQDXBAAhgwMBANcEACGEAwEA1wQAIYUDAQDXBAAhhgMCAIEFACGHAwEA1wQAIYgDAQDkBAAhiQMBAOQEACGKAwEA5AQAIYsDAQDkBAAhjAMQAJUFACGNAxAAlQUAIY4DAgCWBQAhjwMCAJYFACGRAwAAlwWRAyKSAyAA5QQAIZMDIADlBAAhlAMIAJgFACGVAwIAgQUAIZYDAgCBBQAhsgMAAAsAILMDAAALACAOBgAAggUAIAcAAOcEACASAADrBAAgyQIAAIMFADDKAgAAMwAQywIAAIMFADDMAgEA1wQAIc0CAQDXBAAhzgIBANcEACHPAkAA2AQAId4CAACEBfYCIuQCQADYBAAh9gIQAIUFACH3AkAA2AQAIQTQAgAAAPYCAtECAAAA9gII0gIAAAD2AgjXAgAAvAT2AiII0AIQAAAAAdECEAAAAATSAhAAAAAE0wIQAAAAAdQCEAAAAAHVAhAAAAAB1gIQAAAAAdcCEAC6BAAhCQYAAIIFACDJAgAAhgUAMMoCAAA4ABDLAgAAhgUAMMwCAQDXBAAhzgIBANcEACHvAgEA1wQAIfECAQDkBAAhggMBANcEACERBwAA5wQAIBAAAIkFACARAACKBQAgEwAAiwUAIMkCAACHBQAwygIAACoAEMsCAACHBQAwzAIBANcEACHNAgEA1wQAIc8CQADYBAAh3gIBANcEACH7AgEA5AQAIf0CAQDkBAAh_gIIAIgFACH_AgEA1wQAIYADAQDkBAAhgQMBAOQEACEI0AIIAAAAAdECCAAAAATSAggAAAAE0wIIAAAAAdQCCAAAAAHVAggAAAAB1gIIAAAAAdcCCACxBAAhEgcAAOcEACAPAADrBAAgyQIAAOgEADDKAgAALgAQywIAAOgEADDMAgEA1wQAIc0CAQDXBAAhzwJAANgEACHcAgAA6QTcAiLeAgAA6gTeAiLfAgEA5AQAIeACAQDkBAAh4QJAAOYEACHiAkAA5gQAIeMCIADlBAAh5AJAANgEACGyAwAALgAgswMAAC4AIBMGAACCBQAgBwAA5wQAIA8AAOsEACDJAgAAjAUAMMoCAAAmABDLAgAAjAUAMMwCAQDXBAAhzQIBANcEACHOAgEA1wQAIc8CQADYBAAh3gIAAI4F-wIi5AJAANgEACH2AhAAhQUAIfcCQADmBAAh-QIAAI0F-QIi-wIBAOQEACH8AgEA5AQAIbIDAAAmACCzAwAAJgAgEAYAAIIFACAHAADnBAAgEgAA6wQAIMkCAACDBQAwygIAADMAEMsCAACDBQAwzAIBANcEACHNAgEA1wQAIc4CAQDXBAAhzwJAANgEACHeAgAAhAX2AiLkAkAA2AQAIfYCEACFBQAh9wJAANgEACGyAwAAMwAgswMAADMAIBEGAACCBQAgBwAA5wQAIA8AAOsEACDJAgAAjAUAMMoCAAAmABDLAgAAjAUAMMwCAQDXBAAhzQIBANcEACHOAgEA1wQAIc8CQADYBAAh3gIAAI4F-wIi5AJAANgEACH2AhAAhQUAIfcCQADmBAAh-QIAAI0F-QIi-wIBAOQEACH8AgEA5AQAIQTQAgAAAPkCAtECAAAA-QII0gIAAAD5AgjXAgAAwwT5AiIE0AIAAAD7AgLRAgAAAPsCCNICAAAA-wII1wIAAMEE-wIiDAYAAIIFACAHAADnBAAgCwAA9gQAIMkCAACPBQAwygIAABwAEMsCAACPBQAwzAIBANcEACHNAgEA1wQAIc4CAQDXBAAhzwJAANgEACHkAkAA2AQAIe4CAQDkBAAhDAYAAIIFACAHAADnBAAgCwAA9gQAIMkCAACQBQAwygIAABUAEMsCAACQBQAwzAIBANcEACHNAgEA1wQAIc4CAQDXBAAhzwJAANgEACHkAkAA2AQAIe4CAQDkBAAhDwYAAIIFACAHAADnBAAgyQIAAJEFADDKAgAAEAAQywIAAJEFADDMAgEA1wQAIc0CAQDXBAAhzgIBANcEACHPAkAA2AQAId4CAACSBegCIuQCQADYBAAh5QIBANcEACHmAgIAgQUAIegCAACtBAAg6QIgAOUEACEE0AIAAADoAgLRAgAAAOgCCNICAAAA6AII1wIAAK8E6AIiAoMDAQAAAAGGAwIAAAABJQUAAJkFACAIAAD4BAAgCQAA8QQAIA0AAPMEACAOAAD0BAAgFAAA-wQAIBUAAJoFACAWAAD8BAAgFwAA9wQAIBgAAJsFACAZAACcBQAgyQIAAJQFADDKAgAACwAQywIAAJQFADDMAgEA1wQAIc8CQADYBAAh5AJAANgEACH5AgEA1wQAIYMDAQDXBAAhhAMBANcEACGFAwEA1wQAIYYDAgCBBQAhhwMBANcEACGIAwEA5AQAIYkDAQDkBAAhigMBAOQEACGLAwEA5AQAIYwDEACVBQAhjQMQAJUFACGOAwIAlgUAIY8DAgCWBQAhkQMAAJcFkQMikgMgAOUEACGTAyAA5QQAIZQDCACYBQAhlQMCAIEFACGWAwIAgQUAIQjQAhAAAAAB0QIQAAAABdICEAAAAAXTAhAAAAAB1AIQAAAAAdUCEAAAAAHWAhAAAAAB1wIQANMEACEI0AICAAAAAdECAgAAAAXSAgIAAAAF0wICAAAAAdQCAgAAAAHVAgIAAAAB1gICAAAAAdcCAgCiBAAhBNACAAAAkQMC0QIAAACRAwjSAgAAAJEDCNcCAADQBJEDIgjQAggAAAAB0QIIAAAABdICCAAAAAXTAggAAAAB1AIIAAAAAdUCCAAAAAHWAggAAAAB1wIIAM4EACEDrQMAAAcAIK4DAAAHACCvAwAABwAgA60DAAA4ACCuAwAAOAAgrwMAADgAIAOtAwAAGQAgrgMAABkAIK8DAAAZACADrQMAAEYAIK4DAABGACCvAwAARgAgCwMAAPUEACDJAgAAnQUAMMoCAAAHABDLAgAAnQUAMMwCAQDXBAAhzwJAANgEACHkAkAA2AQAIe8CAQDXBAAhhAMBANcEACGSAyAA5QQAIZMDIADlBAAhAs0CAQAAAAHOAgEAAAABCQYAAIIFACAHAADnBAAgyQIAAJ8FADDKAgAAAwAQywIAAJ8FADDMAgEA1wQAIc0CAQDXBAAhzgIBANcEACHPAkAA2AQAIQAAAAG3AwEAAAABAbcDQAAAAAEFLQAA4AoAIC4AAOYKACC0AwAA4QoAILUDAADlCgAgugMAAA0AIAUtAADeCgAgLgAA4woAILQDAADfCgAgtQMAAOIKACC6AwAASAAgAy0AAOAKACC0AwAA4QoAILoDAAANACADLQAA3goAILQDAADfCgAgugMAAEgAIAAAAAABtwMAAADcAgIBtwMAAADeAgIBtwMBAAAAAQG3A0AAAAABAbcDIAAAAAEFLQAAyQoAIC4AANwKACC0AwAAygoAILUDAADbCgAgugMAAEgAIAstAAC0BQAwLgAAuQUAMLQDAAC1BQAwtQMAALYFADC2AwAAtwUAILcDAAC4BQAwuAMAALgFADC5AwAAuAUAMLoDAAC4BQAwuwMAALoFADC8AwAAuwUAMAwHAADEBQAgEQAAxQUAIBMAAMYFACDMAgEAAAABzQIBAAAAAc8CQAAAAAHeAgEAAAAB-wIBAAAAAf4CCAAAAAH_AgEAAAABgAMBAAAAAYEDAQAAAAECAAAALAAgLQAAwwUAIAMAAAAsACAtAADDBQAgLgAAvwUAIAEmAADaCgAwEQcAAOcEACAQAACJBQAgEQAAigUAIBMAAIsFACDJAgAAhwUAMMoCAAAqABDLAgAAhwUAMMwCAQAAAAHNAgEA1wQAIc8CQADYBAAh3gIBANcEACH7AgEAAAAB_QIBAOQEACH-AggAiAUAIf8CAQDXBAAhgAMBAAAAAYEDAQAAAAECAAAALAAgJgAAvwUAIAIAAAC8BQAgJgAAvQUAIA3JAgAAuwUAMMoCAAC8BQAQywIAALsFADDMAgEA1wQAIc0CAQDXBAAhzwJAANgEACHeAgEA1wQAIfsCAQDkBAAh_QIBAOQEACH-AggAiAUAIf8CAQDXBAAhgAMBAOQEACGBAwEA5AQAIQ3JAgAAuwUAMMoCAAC8BQAQywIAALsFADDMAgEA1wQAIc0CAQDXBAAhzwJAANgEACHeAgEA1wQAIfsCAQDkBAAh_QIBAOQEACH-AggAiAUAIf8CAQDXBAAhgAMBAOQEACGBAwEA5AQAIQnMAgEAowUAIc0CAQCjBQAhzwJAAKQFACHeAgEAowUAIfsCAQCvBQAh_gIIAL4FACH_AgEAowUAIYADAQCvBQAhgQMBAK8FACEFtwMIAAAAAb0DCAAAAAG-AwgAAAABvwMIAAAAAcADCAAAAAEMBwAAwAUAIBEAAMEFACATAADCBQAgzAIBAKMFACHNAgEAowUAIc8CQACkBQAh3gIBAKMFACH7AgEArwUAIf4CCAC-BQAh_wIBAKMFACGAAwEArwUAIYEDAQCvBQAhBS0AAM8KACAuAADYCgAgtAMAANAKACC1AwAA1woAILoDAABIACAHLQAAzQoAIC4AANUKACC0AwAAzgoAILUDAADUCgAguAMAACYAILkDAAAmACC6AwAAKAAgBy0AAMsKACAuAADSCgAgtAMAAMwKACC1AwAA0QoAILgDAAAzACC5AwAAMwAgugMAAD0AIAwHAADEBQAgEQAAxQUAIBMAAMYFACDMAgEAAAABzQIBAAAAAc8CQAAAAAHeAgEAAAAB-wIBAAAAAf4CCAAAAAH_AgEAAAABgAMBAAAAAYEDAQAAAAEDLQAAzwoAILQDAADQCgAgugMAAEgAIAMtAADNCgAgtAMAAM4KACC6AwAAKAAgAy0AAMsKACC0AwAAzAoAILoDAAA9ACADLQAAyQoAILQDAADKCgAgugMAAEgAIAQtAAC0BQAwtAMAALUFADC2AwAAtwUAILoDAAC4BQAwAAAAAAAFtwMCAAAAAb0DAgAAAAG-AwIAAAABvwMCAAAAAcADAgAAAAEBtwMAAADoAgICtwMBAAAABMEDAQAAAAUFLQAAwQoAIC4AAMcKACC0AwAAwgoAILUDAADGCgAgugMAAA0AIAUtAAC_CgAgLgAAxAoAILQDAADACgAgtQMAAMMKACC6AwAASAAgAbcDAQAAAAQDLQAAwQoAILQDAADCCgAgugMAAA0AIAMtAAC_CgAgtAMAAMAKACC6AwAASAAgAAAAAAAFLQAAtwoAIC4AAL0KACC0AwAAuAoAILUDAAC8CgAgugMAAA0AIAUtAAC1CgAgLgAAugoAILQDAAC2CgAgtQMAALkKACC6AwAASAAgAy0AALcKACC0AwAAuAoAILoDAAANACADLQAAtQoAILQDAAC2CgAgugMAAEgAIAAAAAUtAACqCgAgLgAAswoAILQDAACrCgAgtQMAALIKACC6AwAADQAgBy0AAKgKACAuAACwCgAgtAMAAKkKACC1AwAArwoAILgDAAAZACC5AwAAGQAgugMAAEQAIAUtAACmCgAgLgAArQoAILQDAACnCgAgtQMAAKwKACC6AwAASAAgAy0AAKoKACC0AwAAqwoAILoDAAANACADLQAAqAoAILQDAACpCgAgugMAAEQAIAMtAACmCgAgtAMAAKcKACC6AwAASAAgAAAABS0AAJsKACAuAACkCgAgtAMAAJwKACC1AwAAowoAILoDAAANACAHLQAAmQoAIC4AAKEKACC0AwAAmgoAILUDAACgCgAguAMAABkAILkDAAAZACC6AwAARAAgBS0AAJcKACAuAACeCgAgtAMAAJgKACC1AwAAnQoAILoDAABIACADLQAAmwoAILQDAACcCgAgugMAAA0AIAMtAACZCgAgtAMAAJoKACC6AwAARAAgAy0AAJcKACC0AwAAmAoAILoDAABIACAAAAALLQAAswcAMC4AAN8IADC0AwAAtAcAMLUDAADeCAAwtgMAALUHACC3AwAAtgcAMLgDAAC2BwAwuQMAALYHADC6AwAAtgcAMLsDAADgCAAwvAMAAMkHADALLQAArgcAMC4AANoIADC0AwAArwcAMLUDAADZCAAwtgMAALAHACC3AwAAsQcAMLgDAACxBwAwuQMAALEHADC6AwAAsQcAMLsDAADbCAAwvAMAAL4HADAFLQAA4QkAIC4AAJUKACC0AwAA4gkAILUDAACUCgAgugMAAEgAIAotAAD4BQAwLgAA_AUAMLQDAAD5BQAwtQMAAPoFADC3AwAA-wUAMLgDAAD7BQAwuQMAAPsFADC6AwAA-wUAMLsDAAD9BQAwvAMAAP4FADAhBQAAzwgAIAgAANAIACAJAADRCAAgDQAA0ggAIA4AANMIACAUAADUCAAgFQAA1QgAIBYAANYIACAXAADXCAAgGQAA2AgAIMwCAQAAAAHPAkAAAAAB5AJAAAAAAfkCAQAAAAGDAwEAAAABhAMBAAAAAYUDAQAAAAGGAwIAAAABhwMBAAAAAYgDAQAAAAGJAwEAAAABigMBAAAAAYsDAQAAAAGMAxAAAAABjQMQAAAAAY4DAgAAAAGPAwIAAAABkQMAAACRAwKSAyAAAAABkwMgAAAAAZQDCAAAAAGVAwIAAAABlgMCAAAAAQIAAAANACAtAADOCAAgAwAAAA0AIC0AAM4IACAuAACFBgAgJgUAAJkFACAIAAD4BAAgCQAA8QQAIA0AAPMEACAOAAD0BAAgFAAA-wQAIBUAAJoFACAWAAD8BAAgFwAA9wQAIBgAAJsFACAZAACcBQAgyQIAAJQFADDKAgAACwAQywIAAJQFADDMAgEAAAABzwJAANgEACHkAkAA2AQAIfkCAQDXBAAhgwMBANcEACGEAwEAAAABhQMBANcEACGGAwIAgQUAIYcDAQDXBAAhiAMBAOQEACGJAwEA5AQAIYoDAQDkBAAhiwMBAOQEACGMAxAAlQUAIY0DEACVBQAhjgMCAJYFACGPAwIAlgUAIZEDAACXBZEDIpIDIADlBAAhkwMgAOUEACGUAwgAmAUAIZUDAgCBBQAhlgMCAIEFACGxAwAAkwUAIAIAAAANACAmAACFBgAgAgAAAP8FACAmAACABgAgGskCAAD-BQAwygIAAP8FABDLAgAA_gUAMMwCAQDXBAAhzwJAANgEACHkAkAA2AQAIfkCAQDXBAAhgwMBANcEACGEAwEA1wQAIYUDAQDXBAAhhgMCAIEFACGHAwEA1wQAIYgDAQDkBAAhiQMBAOQEACGKAwEA5AQAIYsDAQDkBAAhjAMQAJUFACGNAxAAlQUAIY4DAgCWBQAhjwMCAJYFACGRAwAAlwWRAyKSAyAA5QQAIZMDIADlBAAhlAMIAJgFACGVAwIAgQUAIZYDAgCBBQAhGskCAAD-BQAwygIAAP8FABDLAgAA_gUAMMwCAQDXBAAhzwJAANgEACHkAkAA2AQAIfkCAQDXBAAhgwMBANcEACGEAwEA1wQAIYUDAQDXBAAhhgMCAIEFACGHAwEA1wQAIYgDAQDkBAAhiQMBAOQEACGKAwEA5AQAIYsDAQDkBAAhjAMQAJUFACGNAxAAlQUAIY4DAgCWBQAhjwMCAJYFACGRAwAAlwWRAyKSAyAA5QQAIZMDIADlBAAhlAMIAJgFACGVAwIAgQUAIZYDAgCBBQAhF8wCAQCjBQAhzwJAAKQFACHkAkAApAUAIfkCAQCjBQAhgwMBAKMFACGEAwEAowUAIYUDAQCjBQAhhgMCAM4FACGHAwEAowUAIYgDAQCvBQAhiQMBAK8FACGKAwEArwUAIYsDAQCvBQAhjAMQAIEGACGNAxAAgQYAIY4DAgCCBgAhjwMCAIIGACGRAwAAgwaRAyKSAyAAsQUAIZMDIACxBQAhlAMIAIQGACGVAwIAzgUAIZYDAgDOBQAhBbcDEAAAAAG9AxAAAAABvgMQAAAAAb8DEAAAAAHAAxAAAAABBbcDAgAAAAG9AwIAAAABvgMCAAAAAb8DAgAAAAHAAwIAAAABAbcDAAAAkQMCBbcDCAAAAAG9AwgAAAABvgMIAAAAAb8DCAAAAAHAAwgAAAABIQUAAIYGACAIAACHBgAgCQAAiAYAIA0AAIkGACAOAACKBgAgFAAAiwYAIBUAAIwGACAWAACNBgAgFwAAjgYAIBkAAI8GACDMAgEAowUAIc8CQACkBQAh5AJAAKQFACH5AgEAowUAIYMDAQCjBQAhhAMBAKMFACGFAwEAowUAIYYDAgDOBQAhhwMBAKMFACGIAwEArwUAIYkDAQCvBQAhigMBAK8FACGLAwEArwUAIYwDEACBBgAhjQMQAIEGACGOAwIAggYAIY8DAgCCBgAhkQMAAIMGkQMikgMgALEFACGTAyAAsQUAIZQDCACEBgAhlQMCAM4FACGWAwIAzgUAIQotAADDCAAwLgAAxwgAMLQDAADECAAwtQMAAMUIADC3AwAAxggAMLgDAADGCAAwuQMAAMYIADC6AwAAxggAMLsDAADICAAwvAMAAMkIADALLQAAuggAMC4AAL4IADC0AwAAuwgAMLUDAAC8CAAwtgMAAL0IACC3AwAAkgcAMLgDAACSBwAwuQMAAJIHADC6AwAAkgcAMLsDAAC_CAAwvAMAAJUHADALLQAAsQgAMC4AALUIADC0AwAAsggAMLUDAACzCAAwtgMAALQIACC3AwAA3gcAMLgDAADeBwAwuQMAAN4HADC6AwAA3gcAMLsDAAC2CAAwvAMAAOEHADALLQAAqAgAMC4AAKwIADC0AwAAqQgAMLUDAACqCAAwtgMAAKsIACC3AwAAtgcAMLgDAAC2BwAwuQMAALYHADC6AwAAtgcAMLsDAACtCAAwvAMAAMkHADALLQAAnwgAMC4AAKMIADC0AwAAoAgAMLUDAAChCAAwtgMAAKIIACC3AwAAsQcAMLgDAACxBwAwuQMAALEHADC6AwAAsQcAMLsDAACkCAAwvAMAAL4HADALLQAAlAgAMC4AAJgIADC0AwAAlQgAMLUDAACWCAAwtgMAAJcIACC3AwAA1gYAMLgDAADWBgAwuQMAANYGADC6AwAA1gYAMLsDAACZCAAwvAMAANkGADALLQAAiAgAMC4AAI0IADC0AwAAiQgAMLUDAACKCAAwtgMAAIsIACC3AwAAjAgAMLgDAACMCAAwuQMAAIwIADC6AwAAjAgAMLsDAACOCAAwvAMAAI8IADALLQAA_QcAMC4AAIEIADC0AwAA_gcAMLUDAAD_BwAwtgMAAIAIACC3AwAAuQYAMLgDAAC5BgAwuQMAALkGADC6AwAAuQYAMLsDAACCCAAwvAMAALwGADALLQAA9AcAMC4AAPgHADC0AwAA9QcAMLUDAAD2BwAwtgMAAPcHACC3AwAAngcAMLgDAACeBwAwuQMAAJ4HADC6AwAAngcAMLsDAAD5BwAwvAMAAKEHADAKLQAAkAYAMC4AAJQGADC0AwAAkQYAMLUDAACSBgAwtwMAAJMGADC4AwAAkwYAMLkDAACTBgAwugMAAJMGADC7AwAAlQYAMLwDAACWBgAwGQgAAO0HACALAADrBwAgDQAA6QcAIA4AAOoHACAPAADvBwAgFgAA8gcAIBcAAOwHACAaAADnBwAgGwAA6AcAIB0AAO4HACAeAADwBwAgHwAA8QcAICAAAPMHACDMAgEAAAABzwJAAAAAAd4CAAAAqAMC5AJAAAAAAe8CAQAAAAHwAgEAAAAB8QIBAAAAAYIDAAAApwMCpQMgAAAAAagDIAAAAAGpAyAAAAABqgNAAAAAAQIAAABIACAtAADmBwAgAwAAAEgAIC0AAOYHACAuAACbBgAgHQgAAPgEACALAAD2BAAgDQAA8wQAIA4AAPQEACAPAADrBAAgFgAA_AQAIBcAAPcEACAaAADxBAAgGwAA8gQAIBwAAPUEACAdAAD5BAAgHgAA-gQAIB8AAPsEACAgAAD9BAAgyQIAAO4EADDKAgAARgAQywIAAO4EADDMAgEAAAABzwJAANgEACHeAgAA8ASoAyLkAkAA2AQAIe8CAQDXBAAh8AIBAAAAAfECAQDkBAAhggMAAO8EpwMipQMgAOUEACGoAyAA5QQAIakDIADlBAAhqgNAAOYEACECAAAASAAgJgAAmwYAIAIAAACXBgAgJgAAmAYAIA_JAgAAlgYAMMoCAACXBgAQywIAAJYGADDMAgEA1wQAIc8CQADYBAAh3gIAAPAEqAMi5AJAANgEACHvAgEA1wQAIfACAQDXBAAh8QIBAOQEACGCAwAA7wSnAyKlAyAA5QQAIagDIADlBAAhqQMgAOUEACGqA0AA5gQAIQ_JAgAAlgYAMMoCAACXBgAQywIAAJYGADDMAgEA1wQAIc8CQADYBAAh3gIAAPAEqAMi5AJAANgEACHvAgEA1wQAIfACAQDXBAAh8QIBAOQEACGCAwAA7wSnAyKlAyAA5QQAIagDIADlBAAhqQMgAOUEACGqA0AA5gQAIQzMAgEAowUAIc8CQACkBQAh3gIAAJoGqAMi5AJAAKQFACHvAgEAowUAIfACAQCjBQAh8QIBAK8FACGCAwAAmQanAyKlAyAAsQUAIagDIACxBQAhqQMgALEFACGqA0AAsAUAIQG3AwAAAKcDAgG3AwAAAKgDAhkIAACiBgAgCwAAoAYAIA0AAJ4GACAOAACfBgAgDwAApAYAIBYAAKcGACAXAAChBgAgGgAAnAYAIBsAAJ0GACAdAACjBgAgHgAApQYAIB8AAKYGACAgAACoBgAgzAIBAKMFACHPAkAApAUAId4CAACaBqgDIuQCQACkBQAh7wIBAKMFACHwAgEAowUAIfECAQCvBQAhggMAAJkGpwMipQMgALEFACGoAyAAsQUAIakDIACxBQAhqgNAALAFACELLQAA2gcAMC4AAN8HADC0AwAA2wcAMLUDAADcBwAwtgMAAN0HACC3AwAA3gcAMLgDAADeBwAwuQMAAN4HADC6AwAA3gcAMLsDAADgBwAwvAMAAOEHADALLQAAzgcAMC4AANMHADC0AwAAzwcAMLUDAADQBwAwtgMAANEHACC3AwAA0gcAMLgDAADSBwAwuQMAANIHADC6AwAA0gcAMLsDAADUBwAwvAMAANUHADALLQAAwwcAMC4AAMcHADC0AwAAxAcAMLUDAADFBwAwtgMAAMYHACC3AwAAtgcAMLgDAAC2BwAwuQMAALYHADC6AwAAtgcAMLsDAADIBwAwvAMAAMkHADALLQAAuAcAMC4AALwHADC0AwAAuQcAMLUDAAC6BwAwtgMAALsHACC3AwAAsQcAMLgDAACxBwAwuQMAALEHADC6AwAAsQcAMLsDAAC9BwAwvAMAAL4HADAHLQAApgcAIC4AAKkHACC0AwAApwcAILUDAACoBwAguAMAABkAILkDAAAZACC6AwAARAAgCy0AAJoHADAuAACfBwAwtAMAAJsHADC1AwAAnAcAMLYDAACdBwAgtwMAAJ4HADC4AwAAngcAMLkDAACeBwAwugMAAJ4HADC7AwAAoAcAMLwDAAChBwAwCy0AAI4HADAuAACTBwAwtAMAAI8HADC1AwAAkAcAMLYDAACRBwAgtwMAAJIHADC4AwAAkgcAMLkDAACSBwAwugMAAJIHADC7AwAAlAcAMLwDAACVBwAwCy0AAIIHADAuAACHBwAwtAMAAIMHADC1AwAAhAcAMLYDAACFBwAgtwMAAIYHADC4AwAAhgcAMLkDAACGBwAwugMAAIYHADC7AwAAiAcAMLwDAACJBwAwCy0AAPkGADAuAAD9BgAwtAMAAPoGADC1AwAA-wYAMLYDAAD8BgAgtwMAALgFADC4AwAAuAUAMLkDAAC4BQAwugMAALgFADC7AwAA_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-wIBAAAAAf0CAQAAAAH-AggAAAAB_wIBAAAAAYADAQAAAAECAAAALAAgLQAAzQYAIAMAAAAsACAtAADNBgAgLgAAywYAIAEmAACOCgAwAgAAACwAICYAAMsGACACAAAAvAUAICYAAMoGACAJzAIBAKMFACHNAgEAowUAIc8CQACkBQAh3gIBAKMFACH7AgEArwUAIf0CAQCvBQAh_gIIAL4FACH_AgEAowUAIYADAQCvBQAhDAcAAMAFACAQAADMBgAgEQAAwQUAIMwCAQCjBQAhzQIBAKMFACHPAkAApAUAId4CAQCjBQAh-wIBAK8FACH9AgEArwUAIf4CCAC-BQAh_wIBAKMFACGAAwEArwUAIQctAACJCgAgLgAAjAoAILQDAACKCgAgtQMAAIsKACC4AwAALgAguQMAAC4AILoDAABlACAMBwAAxAUAIBAAAM4GACARAADFBQAgzAIBAAAAAc0CAQAAAAHPAkAAAAAB3gIBAAAAAfsCAQAAAAH9AgEAAAAB_gIIAAAAAf8CAQAAAAGAAwEAAAABAy0AAIkKACC0AwAAigoAILoDAABlACAJBgAA0AYAIBIAANEGACDMAgEAAAABzgIBAAAAAc8CQAAAAAHeAgAAAPYCAuQCQAAAAAH2AhAAAAAB9wJAAAAAAQMtAACHCgAgtAMAAIgKACC6AwAADQAgBC0AAMQGADC0AwAAxQYAMLYDAADHBgAgugMAALgFADAMBgAA6wYAIA8AAOwGACDMAgEAAAABzgIBAAAAAc8CQAAAAAHeAgAAAPsCAuQCQAAAAAH2AhAAAAAB9wJAAAAAAfkCAAAA-QIC-wIBAAAAAfwCAQAAAAECAAAAKAAgLQAA6gYAIAMAAAAoACAtAADqBgAgLgAA3gYAIAEmAACGCgAwEQYAAIIFACAHAADnBAAgDwAA6wQAIMkCAACMBQAwygIAACYAEMsCAACMBQAwzAIBAAAAAc0CAQDXBAAhzgIBANcEACHPAkAA2AQAId4CAACOBfsCIuQCQADYBAAh9gIQAIUFACH3AkAA5gQAIfkCAACNBfkCIvsCAQDkBAAh_AIBAOQEACECAAAAKAAgJgAA3gYAIAIAAADaBgAgJgAA2wYAIA7JAgAA2QYAMMoCAADaBgAQywIAANkGADDMAgEA1wQAIc0CAQDXBAAhzgIBANcEACHPAkAA2AQAId4CAACOBfsCIuQCQADYBAAh9gIQAIUFACH3AkAA5gQAIfkCAACNBfkCIvsCAQDkBAAh_AIBAOQEACEOyQIAANkGADDKAgAA2gYAEMsCAADZBgAwzAIBANcEACHNAgEA1wQAIc4CAQDXBAAhzwJAANgEACHeAgAAjgX7AiLkAkAA2AQAIfYCEACFBQAh9wJAAOYEACH5AgAAjQX5AiL7AgEA5AQAIfwCAQDkBAAhCswCAQCjBQAhzgIBAKMFACHPAkAApAUAId4CAADdBvsCIuQCQACkBQAh9gIQAMAGACH3AkAAsAUAIfkCAADcBvkCIvsCAQCvBQAh_AIBAK8FACEBtwMAAAD5AgIBtwMAAAD7AgIMBgAA3wYAIA8AAOAGACDMAgEAowUAIc4CAQCjBQAhzwJAAKQFACHeAgAA3Qb7AiLkAkAApAUAIfYCEADABgAh9wJAALAFACH5AgAA3Ab5AiL7AgEArwUAIfwCAQCvBQAhBS0AAIAKACAuAACECgAgtAMAAIEKACC1AwAAgwoAILoDAAANACALLQAA4QYAMC4AAOUGADC0AwAA4gYAMLUDAADjBgAwtgMAAOQGACC3AwAAuAUAMLgDAAC4BQAwuQMAALgFADC6AwAAuAUAMLsDAADmBgAwvAMAALsFADAMBwAAxAUAIBAAAM4GACATAADGBQAgzAIBAAAAAc0CAQAAAAHPAkAAAAAB3gIBAAAAAfsCAQAAAAH9AgEAAAAB_gIIAAAAAf8CAQAAAAGBAwEAAAABAgAAACwAIC0AAOkGACADAAAALAAgLQAA6QYAIC4AAOgGACABJgAAggoAMAIAAAAsACAmAADoBgAgAgAAALwFACAmAADnBgAgCcwCAQCjBQAhzQIBAKMFACHPAkAApAUAId4CAQCjBQAh-wIBAK8FACH9AgEArwUAIf4CCAC-BQAh_wIBAKMFACGBAwEArwUAIQwHAADABQAgEAAAzAYAIBMAAMIFACDMAgEAowUAIc0CAQCjBQAhzwJAAKQFACHeAgEAowUAIfsCAQCvBQAh_QIBAK8FACH-AggAvgUAIf8CAQCjBQAhgQMBAK8FACEMBwAAxAUAIBAAAM4GACATAADGBQAgzAIBAAAAAc0CAQAAAAHPAkAAAAAB3gIBAAAAAfsCAQAAAAH9AgEAAAAB_gIIAAAAAf8CAQAAAAGBAwEAAAABDAYAAOsGACAPAADsBgAgzAIBAAAAAc4CAQAAAAHPAkAAAAAB3gIAAAD7AgLkAkAAAAAB9gIQAAAAAfcCQAAAAAH5AgAAAPkCAvsCAQAAAAH8AgEAAAABAy0AAIAKACC0AwAAgQoAILoDAAANACAELQAA4QYAMLQDAADiBgAwtgMAAOQGACC6AwAAuAUAMAsPAADIBQAgzAIBAAAAAc8CQAAAAAHcAgAAANwCAt4CAAAA3gIC3wIBAAAAAeACAQAAAAHhAkAAAAAB4gJAAAAAAeMCIAAAAAHkAkAAAAABAgAAAGUAIC0AAPgGACADAAAAZQAgLQAA-AYAIC4AAPcGACABJgAA_wkAMBAHAADnBAAgDwAA6wQAIMkCAADoBAAwygIAAC4AEMsCAADoBAAwzAIBAAAAAc0CAQAAAAHPAkAA2AQAIdwCAADpBNwCIt4CAADqBN4CIt8CAQAAAAHgAgEA5AQAIeECQADmBAAh4gJAAOYEACHjAiAA5QQAIeQCQADYBAAhAgAAAGUAICYAAPcGACACAAAA9QYAICYAAPYGACAOyQIAAPQGADDKAgAA9QYAEMsCAAD0BgAwzAIBANcEACHNAgEA1wQAIc8CQADYBAAh3AIAAOkE3AIi3gIAAOoE3gIi3wIBAOQEACHgAgEA5AQAIeECQADmBAAh4gJAAOYEACHjAiAA5QQAIeQCQADYBAAhDskCAAD0BgAwygIAAPUGABDLAgAA9AYAMMwCAQDXBAAhzQIBANcEACHPAkAA2AQAIdwCAADpBNwCIt4CAADqBN4CIt8CAQDkBAAh4AIBAOQEACHhAkAA5gQAIeICQADmBAAh4wIgAOUEACHkAkAA2AQAIQrMAgEAowUAIc8CQACkBQAh3AIAAK0F3AIi3gIAAK4F3gIi3wIBAK8FACHgAgEArwUAIeECQACwBQAh4gJAALAFACHjAiAAsQUAIeQCQACkBQAhCw8AALMFACDMAgEAowUAIc8CQACkBQAh3AIAAK0F3AIi3gIAAK4F3gIi3wIBAK8FACHgAgEArwUAIeECQACwBQAh4gJAALAFACHjAiAAsQUAIeQCQACkBQAhCw8AAMgFACDMAgEAAAABzwJAAAAAAdwCAAAA3AIC3gIAAADeAgLfAgEAAAAB4AIBAAAAAeECQAAAAAHiAkAAAAAB4wIgAAAAAeQCQAAAAAEMEAAAzgYAIBEAAMUFACATAADGBQAgzAIBAAAAAc8CQAAAAAHeAgEAAAAB-wIBAAAAAf0CAQAAAAH-AggAAAAB_wIBAAAAAYADAQAAAAGBAwEAAAABAgAAACwAIC0AAIEHACADAAAALAAgLQAAgQcAIC4AAIAHACABJgAA_gkAMAIAAAAsACAmAACABwAgAgAAALwFACAmAAD_BgAgCcwCAQCjBQAhzwJAAKQFACHeAgEAowUAIfsCAQCvBQAh_QIBAK8FACH-AggAvgUAIf8CAQCjBQAhgAMBAK8FACGBAwEArwUAIQwQAADMBgAgEQAAwQUAIBMAAMIFACDMAgEAowUAIc8CQACkBQAh3gIBAKMFACH7AgEArwUAIf0CAQCvBQAh_gIIAL4FACH_AgEAowUAIYADAQCvBQAhgQMBAK8FACEMEAAAzgYAIBEAAMUFACATAADGBQAgzAIBAAAAAc8CQAAAAAHeAgEAAAAB-wIBAAAAAf0CAQAAAAH-AggAAAAB_wIBAAAAAYADAQAAAAGBAwEAAAABB8wCAQAAAAHPAkAAAAAB5AJAAAAAAfcCQAAAAAGiAwEAAAABowMBAAAAAaQDAQAAAAECAAAAYQAgLQAAjQcAIAMAAABhACAtAACNBwAgLgAAjAcAIAEmAAD9CQAwDAcAAOcEACDJAgAA7AQAMMoCAABfABDLAgAA7AQAMMwCAQAAAAHNAgEA1wQAIc8CQADYBAAh5AJAANgEACH3AkAA2AQAIaIDAQAAAAGjAwEA5AQAIaQDAQDkBAAhAgAAAGEAICYAAIwHACACAAAAigcAICYAAIsHACALyQIAAIkHADDKAgAAigcAEMsCAACJBwAwzAIBANcEACHNAgEA1wQAIc8CQADYBAAh5AJAANgEACH3AkAA2AQAIaIDAQDXBAAhowMBAOQEACGkAwEA5AQAIQvJAgAAiQcAMMoCAACKBwAQywIAAIkHADDMAgEA1wQAIc0CAQDXBAAhzwJAANgEACHkAkAA2AQAIfcCQADYBAAhogMBANcEACGjAwEA5AQAIaQDAQDkBAAhB8wCAQCjBQAhzwJAAKQFACHkAkAApAUAIfcCQACkBQAhogMBAKMFACGjAwEArwUAIaQDAQCvBQAhB8wCAQCjBQAhzwJAAKQFACHkAkAApAUAIfcCQACkBQAhogMBAKMFACGjAwEArwUAIaQDAQCvBQAhB8wCAQAAAAHPAkAAAAAB5AJAAAAAAfcCQAAAAAGiAwEAAAABowMBAAAAAaQDAQAAAAEKBgAA1AUAIMwCAQAAAAHOAgEAAAABzwJAAAAAAd4CAAAA6AIC5AJAAAAAAeUCAQAAAAHmAgIAAAAB6AIAANMFACDpAiAAAAABAgAAABIAIC0AAJkHACADAAAAEgAgLQAAmQcAIC4AAJgHACABJgAA_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_AcAIC4AAPsHACABJgAA9AkAMAIAAABBACAmAAD7BwAgAgAAAKIHACAmAAD6BwAgBMwCAQCjBQAhzQIBAKMFACHPAkAApAUAIe0CAgDOBQAhBQcAANwFACDMAgEAowUAIc0CAQCjBQAhzwJAAKQFACHtAgIAzgUAIQUHAADeBQAgzAIBAAAAAc0CAQAAAAHPAkAAAAAB7QICAAAAAQkHAACHCAAgEgAA0QYAIMwCAQAAAAHNAgEAAAABzwJAAAAAAd4CAAAA9gIC5AJAAAAAAfYCEAAAAAH3AkAAAAABAgAAAD0AIC0AAIYIACADAAAAPQAgLQAAhggAIC4AAIQIACABJgAA8wkAMAIAAAA9ACAmAACECAAgAgAAAL0GACAmAACDCAAgB8wCAQCjBQAhzQIBAKMFACHPAkAApAUAId4CAAC_BvYCIuQCQACkBQAh9gIQAMAGACH3AkAApAUAIQkHAACFCAAgEgAAwwYAIMwCAQCjBQAhzQIBAKMFACHPAkAApAUAId4CAAC_BvYCIuQCQACkBQAh9gIQAMAGACH3AkAApAUAIQUtAADuCQAgLgAA8QkAILQDAADvCQAgtQMAAPAJACC6AwAASAAgCQcAAIcIACASAADRBgAgzAIBAAAAAc0CAQAAAAHPAkAAAAAB3gIAAAD2AgLkAkAAAAAB9gIQAAAAAfcCQAAAAAEDLQAA7gkAILQDAADvCQAgugMAAEgAIATMAgEAAAAB7wIBAAAAAfECAQAAAAGCAwEAAAABAgAAADoAIC0AAJMIACADAAAAOgAgLQAAkwgAIC4AAJIIACABJgAA7QkAMAkGAACCBQAgyQIAAIYFADDKAgAAOAAQywIAAIYFADDMAgEAAAABzgIBANcEACHvAgEA1wQAIfECAQDkBAAhggMBANcEACECAAAAOgAgJgAAkggAIAIAAACQCAAgJgAAkQgAIAjJAgAAjwgAMMoCAACQCAAQywIAAI8IADDMAgEA1wQAIc4CAQDXBAAh7wIBANcEACHxAgEA5AQAIYIDAQDXBAAhCMkCAACPCAAwygIAAJAIABDLAgAAjwgAMMwCAQDXBAAhzgIBANcEACHvAgEA1wQAIfECAQDkBAAhggMBANcEACEEzAIBAKMFACHvAgEAowUAIfECAQCvBQAhggMBAKMFACEEzAIBAKMFACHvAgEAowUAIfECAQCvBQAhggMBAKMFACEEzAIBAAAAAe8CAQAAAAHxAgEAAAABggMBAAAAAQwHAACeCAAgDwAA7AYAIMwCAQAAAAHNAgEAAAABzwJAAAAAAd4CAAAA-wIC5AJAAAAAAfYCEAAAAAH3AkAAAAAB-QIAAAD5AgL7AgEAAAAB_AIBAAAAAQIAAAAoACAtAACdCAAgAwAAACgAIC0AAJ0IACAuAACbCAAgASYAAOwJADACAAAAKAAgJgAAmwgAIAIAAADaBgAgJgAAmggAIArMAgEAowUAIc0CAQCjBQAhzwJAAKQFACHeAgAA3Qb7AiLkAkAApAUAIfYCEADABgAh9wJAALAFACH5AgAA3Ab5AiL7AgEArwUAIfwCAQCvBQAhDAcAAJwIACAPAADgBgAgzAIBAKMFACHNAgEAowUAIc8CQACkBQAh3gIAAN0G-wIi5AJAAKQFACH2AhAAwAYAIfcCQACwBQAh-QIAANwG-QIi-wIBAK8FACH8AgEArwUAIQUtAADnCQAgLgAA6gkAILQDAADoCQAgtQMAAOkJACC6AwAASAAgDAcAAJ4IACAPAADsBgAgzAIBAAAAAc0CAQAAAAHPAkAAAAAB3gIAAAD7AgLkAkAAAAAB9gIQAAAAAfcCQAAAAAH5AgAAAPkCAvsCAQAAAAH8AgEAAAABAy0AAOcJACC0AwAA6AkAILoDAABIACAHBwAA5wUAIAsAAOYFACDMAgEAAAABzQIBAAAAAc8CQAAAAAHkAkAAAAAB7gIBAAAAAQIAAAAeACAtAACnCAAgAwAAAB4AIC0AAKcIACAuAACmCAAgASYAAOYJADACAAAAHgAgJgAApggAIAIAAAC_BwAgJgAApQgAIAXMAgEAowUAIc0CAQCjBQAhzwJAAKQFACHkAkAApAUAIe4CAQCvBQAhBwcAAOQFACALAADjBQAgzAIBAKMFACHNAgEAowUAIc8CQACkBQAh5AJAAKQFACHuAgEArwUAIQcHAADnBQAgCwAA5gUAIMwCAQAAAAHNAgEAAAABzwJAAAAAAeQCQAAAAAHuAgEAAAABBwcAAPAFACALAADvBQAgzAIBAAAAAc0CAQAAAAHPAkAAAAAB5AJAAAAAAe4CAQAAAAECAAAAFwAgLQAAsAgAIAMAAAAXACAtAACwCAAgLgAArwgAIAEmAADlCQAwAgAAABcAICYAAK8IACACAAAAygcAICYAAK4IACAFzAIBAKMFACHNAgEAowUAIc8CQACkBQAh5AJAAKQFACHuAgEArwUAIQcHAADtBQAgCwAA7AUAIMwCAQCjBQAhzQIBAKMFACHPAkAApAUAIeQCQACkBQAh7gIBAK8FACEHBwAA8AUAIAsAAO8FACDMAgEAAAABzQIBAAAAAc8CQAAAAAHkAkAAAAAB7gIBAAAAAQQHAACoBQAgzAIBAAAAAc0CAQAAAAHPAkAAAAABAgAAAAUAIC0AALkIACADAAAABQAgLQAAuQgAIC4AALgIACABJgAA5AkAMAIAAAAFACAmAAC4CAAgAgAAAOIHACAmAAC3CAAgA8wCAQCjBQAhzQIBAKMFACHPAkAApAUAIQQHAACmBQAgzAIBAKMFACHNAgEAowUAIc8CQACkBQAhBAcAAKgFACDMAgEAAAABzQIBAAAAAc8CQAAAAAEKBwAA1QUAIMwCAQAAAAHNAgEAAAABzwJAAAAAAd4CAAAA6AIC5AJAAAAAAeUCAQAAAAHmAgIAAAAB6AIAANMFACDpAiAAAAABAgAAABIAIC0AAMIIACADAAAAEgAgLQAAwggAIC4AAMEIACABJgAA4wkAMAIAAAASACAmAADBCAAgAgAAAJYHACAmAADACAAgCcwCAQCjBQAhzQIBAKMFACHPAkAApAUAId4CAADPBegCIuQCQACkBQAh5QIBAKMFACHmAgIAzgUAIegCAADQBQAg6QIgALEFACEKBwAA0gUAIMwCAQCjBQAhzQIBAKMFACHPAkAApAUAId4CAADPBegCIuQCQACkBQAh5QIBAKMFACHmAgIAzgUAIegCAADQBQAg6QIgALEFACEKBwAA1QUAIMwCAQAAAAHNAgEAAAABzwJAAAAAAd4CAAAA6AIC5AJAAAAAAeUCAQAAAAHmAgIAAAAB6AIAANMFACDpAiAAAAABB8wCAQAAAAHPAkAAAAAB5AJAAAAAAe8CAQAAAAGEAwEAAAABkgMgAAAAAZMDIAAAAAECAAAACQAgLQAAzQgAIAMAAAAJACAtAADNCAAgLgAAzAgAIAsDAAD1BAAgyQIAAJ0FADDKAgAABwAQywIAAJ0FADDMAgEAAAABzwJAANgEACHkAkAA2AQAIe8CAQAAAAGEAwEAAAABkgMgAOUEACGTAyAA5QQAIQIAAAAJACAmAADMCAAgAgAAAMoIACAmAADLCAAgCskCAADJCAAwygIAAMoIABDLAgAAyQgAMMwCAQDXBAAhzwJAANgEACHkAkAA2AQAIe8CAQDXBAAhhAMBANcEACGSAyAA5QQAIZMDIADlBAAhCskCAADJCAAwygIAAMoIABDLAgAAyQgAMMwCAQDXBAAhzwJAANgEACHkAkAA2AQAIe8CAQDXBAAhhAMBANcEACGSAyAA5QQAIZMDIADlBAAhB8wCAQCjBQAhzwJAAKQFACHkAkAApAUAIe8CAQCjBQAhhAMBAKMFACGSAyAAsQUAIZMDIACxBQAhB8wCAQCjBQAhzwJAAKQFACHkAkAApAUAIe8CAQCjBQAhhAMBAKMFACGSAyAAsQUAIZMDIACxBQAhB8wCAQAAAAHPAkAAAAAB5AJAAAAAAe8CAQAAAAGEAwEAAAABkgMgAAAAAZMDIAAAAAEhBQAAzwgAIAgAANAIACAJAADRCAAgDQAA0ggAIA4AANMIACAUAADUCAAgFQAA1QgAIBYAANYIACAXAADXCAAgGQAA2AgAIMwCAQAAAAHPAkAAAAAB5AJAAAAAAfkCAQAAAAGDAwEAAAABhAMBAAAAAYUDAQAAAAGGAwIAAAABhwMBAAAAAYgDAQAAAAGJAwEAAAABigMBAAAAAYsDAQAAAAGMAxAAAAABjQMQAAAAAY4DAgAAAAGPAwIAAAABkQMAAACRAwKSAyAAAAABkwMgAAAAAZQDCAAAAAGVAwIAAAABlgMCAAAAAQMtAADDCAAwtAMAAMQIADC6AwAAxggAMAQtAAC6CAAwtAMAALsIADC2AwAAvQgAILoDAACSBwAwBC0AALEIADC0AwAAsggAMLYDAAC0CAAgugMAAN4HADAELQAAqAgAMLQDAACpCAAwtgMAAKsIACC6AwAAtgcAMAQtAACfCAAwtAMAAKAIADC2AwAAoggAILoDAACxBwAwBC0AAJQIADC0AwAAlQgAMLYDAACXCAAgugMAANYGADAELQAAiAgAMLQDAACJCAAwtgMAAIsIACC6AwAAjAgAMAQtAAD9BwAwtAMAAP4HADC2AwAAgAgAILoDAAC5BgAwBC0AAPQHADC0AwAA9QcAMLYDAAD3BwAgugMAAJ4HADADLQAAkAYAMLQDAACRBgAwugMAAJMGADADAAAAHgAgLQAAsgcAIC4AAN0IACACAAAAHgAgJgAA3QgAIAIAAAC_BwAgJgAA3AgAIAXMAgEAowUAIc0CAQCjBQAhzgIBAKMFACHPAkAApAUAIeQCQACkBQAhBwYAAOIFACAHAADkBQAgzAIBAKMFACHNAgEAowUAIc4CAQCjBQAhzwJAAKQFACHkAkAApAUAIQMAAAAXACAtAAC3BwAgLgAA4ggAIAIAAAAXACAmAADiCAAgAgAAAMoHACAmAADhCAAgBcwCAQCjBQAhzQIBAKMFACHOAgEAowUAIc8CQACkBQAh5AJAAKQFACEHBgAA6wUAIAcAAO0FACDMAgEAowUAIc0CAQCjBQAhzgIBAKMFACHPAkAApAUAIeQCQACkBQAhAy0AAOEJACC0AwAA4gkAILoDAABIACAAAAAAAAAAAAAAAAAAAAAAAAAFLQAA3AkAIC4AAN8JACC0AwAA3QkAILUDAADeCQAgugMAAA0AIAMtAADcCQAgtAMAAN0JACC6AwAADQAgAAAAAAAKLQAA_ggAMC4AAIIJADC0AwAA_wgAMLUDAACACQAwtwMAAIEJADC4AwAAgQkAMLkDAACBCQAwugMAAIEJADC7AwAAgwkAMLwDAACECQAwDQcAAOMIACAKAACrBwAgDAAArAcAIMwCAQAAAAHNAgEAAAABzwJAAAAAAeQCQAAAAAHvAgEAAAAB8AIBAAAAAfECAQAAAAHyAgEAAAAB8wIBAAAAAfQCAQAAAAECAAAARAAgLQAAiAkAIAMAAABEACAtAACICQAgLgAAhwkAIBEDAAD1BAAgBwAA5wQAIAoAAPMEACAMAAD0BAAgyQIAAP4EADDKAgAAGQAQywIAAP4EADDMAgEAAAABzQIBAAAAAc8CQADYBAAh5AJAANgEACHvAgEA5AQAIfACAQDkBAAh8QIBAOQEACHyAgEA5AQAIfMCAQDkBAAh9AIBAOQEACECAAAARAAgJgAAhwkAIAIAAACFCQAgJgAAhgkAIA3JAgAAhAkAMMoCAACFCQAQywIAAIQJADDMAgEA1wQAIc0CAQDXBAAhzwJAANgEACHkAkAA2AQAIe8CAQDkBAAh8AIBAOQEACHxAgEA5AQAIfICAQDkBAAh8wIBAOQEACH0AgEA5AQAIQ3JAgAAhAkAMMoCAACFCQAQywIAAIQJADDMAgEA1wQAIc0CAQDXBAAhzwJAANgEACHkAkAA2AQAIe8CAQDkBAAh8AIBAOQEACHxAgEA5AQAIfICAQDkBAAh8wIBAOQEACH0AgEA5AQAIQrMAgEAowUAIc0CAQCjBQAhzwJAAKQFACHkAkAApAUAIe8CAQCvBQAh8AIBAK8FACHxAgEArwUAIfICAQCvBQAh8wIBAK8FACH0AgEArwUAIQ0HAAD2BQAgCgAA9AUAIAwAAPUFACDMAgEAowUAIc0CAQCjBQAhzwJAAKQFACHkAkAApAUAIe8CAQCvBQAh8AIBAK8FACHxAgEArwUAIfICAQCvBQAh8wIBAK8FACH0AgEArwUAIQ0HAADjCAAgCgAAqwcAIAwAAKwHACDMAgEAAAABzQIBAAAAAc8CQAAAAAHkAkAAAAAB7wIBAAAAAfACAQAAAAHxAgEAAAAB8gIBAAAAAfMCAQAAAAH0AgEAAAABAy0AAP4IADC0AwAA_wgAMLoDAACBCQAwAAAACi0AAI4JADAuAACRCQAwtAMAAI8JADC1AwAAkAkAMLcDAAD7BQAwuAMAAPsFADC5AwAA-wUAMLoDAAD7BQAwuwMAAJIJADC8AwAA_gUAMCEIAADQCAAgCQAA0QgAIA0AANIIACAOAADTCAAgFAAA1AgAIBUAANUIACAWAADWCAAgFwAA1wgAIBgAAIkJACAZAADYCAAgzAIBAAAAAc8CQAAAAAHkAkAAAAAB-QIBAAAAAYMDAQAAAAGEAwEAAAABhQMBAAAAAYYDAgAAAAGHAwEAAAABiAMBAAAAAYkDAQAAAAGKAwEAAAABiwMBAAAAAYwDEAAAAAGNAxAAAAABjgMCAAAAAY8DAgAAAAGRAwAAAJEDApIDIAAAAAGTAyAAAAABlAMIAAAAAZUDAgAAAAGWAwIAAAABAgAAAA0AIC0AAJUJACADAAAADQAgLQAAlQkAIC4AAJQJACACAAAADQAgJgAAlAkAIAIAAAD_BQAgJgAAkwkAIBfMAgEAowUAIc8CQACkBQAh5AJAAKQFACH5AgEAowUAIYMDAQCjBQAhhAMBAKMFACGFAwEAowUAIYYDAgDOBQAhhwMBAKMFACGIAwEArwUAIYkDAQCvBQAhigMBAK8FACGLAwEArwUAIYwDEACBBgAhjQMQAIEGACGOAwIAggYAIY8DAgCCBgAhkQMAAIMGkQMikgMgALEFACGTAyAAsQUAIZQDCACEBgAhlQMCAM4FACGWAwIAzgUAISEIAACHBgAgCQAAiAYAIA0AAIkGACAOAACKBgAgFAAAiwYAIBUAAIwGACAWAACNBgAgFwAAjgYAIBgAAP0IACAZAACPBgAgzAIBAKMFACHPAkAApAUAIeQCQACkBQAh-QIBAKMFACGDAwEAowUAIYQDAQCjBQAhhQMBAKMFACGGAwIAzgUAIYcDAQCjBQAhiAMBAK8FACGJAwEArwUAIYoDAQCvBQAhiwMBAK8FACGMAxAAgQYAIY0DEACBBgAhjgMCAIIGACGPAwIAggYAIZEDAACDBpEDIpIDIACxBQAhkwMgALEFACGUAwgAhAYAIZUDAgDOBQAhlgMCAM4FACEhCAAA0AgAIAkAANEIACANAADSCAAgDgAA0wgAIBQAANQIACAVAADVCAAgFgAA1ggAIBcAANcIACAYAACJCQAgGQAA2AgAIMwCAQAAAAHPAkAAAAAB5AJAAAAAAfkCAQAAAAGDAwEAAAABhAMBAAAAAYUDAQAAAAGGAwIAAAABhwMBAAAAAYgDAQAAAAGJAwEAAAABigMBAAAAAYsDAQAAAAGMAxAAAAABjQMQAAAAAY4DAgAAAAGPAwIAAAABkQMAAACRAwKSAyAAAAABkwMgAAAAAZQDCAAAAAGVAwIAAAABlgMCAAAAAQMtAACOCQAwtAMAAI8JADC6AwAA-wUAMAAAAAAAAAUtAADXCQAgLgAA2gkAILQDAADYCQAgtQMAANkJACC6AwAASAAgAy0AANcJACC0AwAA2AkAILoDAABIACAAAAAFLQAA0gkAIC4AANUJACC0AwAA0wkAILUDAADUCQAgugMAAEgAIAMtAADSCQAgtAMAANMJACC6AwAASAAgAAAACi0AAKgJADAuAACrCQAwtAMAAKkJADC1AwAAqgkAMLcDAAD7BQAwuAMAAPsFADC5AwAA-wUAMLoDAAD7BQAwuwMAAKwJADC8AwAA_gUAMCEFAADPCAAgCAAA0AgAIAkAANEIACANAADSCAAgDgAA0wgAIBQAANQIACAVAADVCAAgFgAA1ggAIBcAANcIACAYAACJCQAgzAIBAAAAAc8CQAAAAAHkAkAAAAAB-QIBAAAAAYMDAQAAAAGEAwEAAAABhQMBAAAAAYYDAgAAAAGHAwEAAAABiAMBAAAAAYkDAQAAAAGKAwEAAAABiwMBAAAAAYwDEAAAAAGNAxAAAAABjgMCAAAAAY8DAgAAAAGRAwAAAJEDApIDIAAAAAGTAyAAAAABlAMIAAAAAZUDAgAAAAGWAwIAAAABAgAAAA0AIC0AAK8JACADAAAADQAgLQAArwkAIC4AAK4JACACAAAADQAgJgAArgkAIAIAAAD_BQAgJgAArQkAIBfMAgEAowUAIc8CQACkBQAh5AJAAKQFACH5AgEAowUAIYMDAQCjBQAhhAMBAKMFACGFAwEAowUAIYYDAgDOBQAhhwMBAKMFACGIAwEArwUAIYkDAQCvBQAhigMBAK8FACGLAwEArwUAIYwDEACBBgAhjQMQAIEGACGOAwIAggYAIY8DAgCCBgAhkQMAAIMGkQMikgMgALEFACGTAyAAsQUAIZQDCACEBgAhlQMCAM4FACGWAwIAzgUAISEFAACGBgAgCAAAhwYAIAkAAIgGACANAACJBgAgDgAAigYAIBQAAIsGACAVAACMBgAgFgAAjQYAIBcAAI4GACAYAAD9CAAgzAIBAKMFACHPAkAApAUAIeQCQACkBQAh-QIBAKMFACGDAwEAowUAIYQDAQCjBQAhhQMBAKMFACGGAwIAzgUAIYcDAQCjBQAhiAMBAK8FACGJAwEArwUAIYoDAQCvBQAhiwMBAK8FACGMAxAAgQYAIY0DEACBBgAhjgMCAIIGACGPAwIAggYAIZEDAACDBpEDIpIDIACxBQAhkwMgALEFACGUAwgAhAYAIZUDAgDOBQAhlgMCAM4FACEhBQAAzwgAIAgAANAIACAJAADRCAAgDQAA0ggAIA4AANMIACAUAADUCAAgFQAA1QgAIBYAANYIACAXAADXCAAgGAAAiQkAIMwCAQAAAAHPAkAAAAAB5AJAAAAAAfkCAQAAAAGDAwEAAAABhAMBAAAAAYUDAQAAAAGGAwIAAAABhwMBAAAAAYgDAQAAAAGJAwEAAAABigMBAAAAAYsDAQAAAAGMAxAAAAABjQMQAAAAAY4DAgAAAAGPAwIAAAABkQMAAACRAwKSAyAAAAABkwMgAAAAAZQDCAAAAAGVAwIAAAABlgMCAAAAAQMtAACoCQAwtAMAAKkJADC6AwAA-wUAMAAAAAUtAADNCQAgLgAA0AkAILQDAADOCQAgtQMAAM8JACC6AwAASAAgAy0AAM0JACC0AwAAzgkAILoDAABIACAQCAAAvwkAIAsAAL0JACANAAC6CQAgDgAAuwkAIA8AALcJACAWAADDCQAgFwAAvgkAIBoAALgJACAbAAC5CQAgHAAAvAkAIB0AAMAJACAeAADBCQAgHwAAwgkAICAAAMQJACDxAgAAqQUAIKoDAACpBQAgAAAAAAAACgMAALwJACAHAAC2CQAgCgAAugkAIAwAALsJACDvAgAAqQUAIPACAACpBQAg8QIAAKkFACDyAgAAqQUAIPMCAACpBQAg9AIAAKkFACAAAAAAAAAAFAUAAMkJACAIAAC_CQAgCQAAuAkAIA0AALoJACAOAAC7CQAgFAAAwgkAIBUAAMoJACAWAADDCQAgFwAAvgkAIBgAAMsJACAZAADMCQAgiAMAAKkFACCJAwAAqQUAIIoDAACpBQAgiwMAAKkFACCMAwAAqQUAII0DAACpBQAgjgMAAKkFACCPAwAAqQUAIJQDAACpBQAgBgcAALYJACAPAAC3CQAg3wIAAKkFACDgAgAAqQUAIOECAACpBQAg4gIAAKkFACAGBgAAxQkAIAcAALYJACAPAAC3CQAg9wIAAKkFACD7AgAAqQUAIPwCAACpBQAgAwYAAMUJACAHAAC2CQAgEgAAtwkAIAAAAAAZCAAA7QcAIAsAAOsHACANAADpBwAgDgAA6gcAIA8AAO8HACAWAADyBwAgFwAA7AcAIBoAAOcHACAbAADoBwAgHAAAsAkAIB0AAO4HACAeAADwBwAgHwAA8QcAIMwCAQAAAAHPAkAAAAAB3gIAAACoAwLkAkAAAAAB7wIBAAAAAfACAQAAAAHxAgEAAAABggMAAACnAwKlAyAAAAABqAMgAAAAAakDIAAAAAGqA0AAAAABAgAAAEgAIC0AAM0JACADAAAARgAgLQAAzQkAIC4AANEJACAbAAAARgAgCAAAogYAIAsAAKAGACANAACeBgAgDgAAnwYAIA8AAKQGACAWAACnBgAgFwAAoQYAIBoAAJwGACAbAACdBgAgHAAApwkAIB0AAKMGACAeAAClBgAgHwAApgYAICYAANEJACDMAgEAowUAIc8CQACkBQAh3gIAAJoGqAMi5AJAAKQFACHvAgEAowUAIfACAQCjBQAh8QIBAK8FACGCAwAAmQanAyKlAyAAsQUAIagDIACxBQAhqQMgALEFACGqA0AAsAUAIRkIAACiBgAgCwAAoAYAIA0AAJ4GACAOAACfBgAgDwAApAYAIBYAAKcGACAXAAChBgAgGgAAnAYAIBsAAJ0GACAcAACnCQAgHQAAowYAIB4AAKUGACAfAACmBgAgzAIBAKMFACHPAkAApAUAId4CAACaBqgDIuQCQACkBQAh7wIBAKMFACHwAgEAowUAIfECAQCvBQAhggMAAJkGpwMipQMgALEFACGoAyAAsQUAIakDIACxBQAhqgNAALAFACEZCAAA7QcAIAsAAOsHACANAADpBwAgDgAA6gcAIA8AAO8HACAWAADyBwAgFwAA7AcAIBoAAOcHACAbAADoBwAgHAAAsAkAIB4AAPAHACAfAADxBwAgIAAA8wcAIMwCAQAAAAHPAkAAAAAB3gIAAACoAwLkAkAAAAAB7wIBAAAAAfACAQAAAAHxAgEAAAABggMAAACnAwKlAyAAAAABqAMgAAAAAakDIAAAAAGqA0AAAAABAgAAAEgAIC0AANIJACADAAAARgAgLQAA0gkAIC4AANYJACAbAAAARgAgCAAAogYAIAsAAKAGACANAACeBgAgDgAAnwYAIA8AAKQGACAWAACnBgAgFwAAoQYAIBoAAJwGACAbAACdBgAgHAAApwkAIB4AAKUGACAfAACmBgAgIAAAqAYAICYAANYJACDMAgEAowUAIc8CQACkBQAh3gIAAJoGqAMi5AJAAKQFACHvAgEAowUAIfACAQCjBQAh8QIBAK8FACGCAwAAmQanAyKlAyAAsQUAIagDIACxBQAhqQMgALEFACGqA0AAsAUAIRkIAACiBgAgCwAAoAYAIA0AAJ4GACAOAACfBgAgDwAApAYAIBYAAKcGACAXAAChBgAgGgAAnAYAIBsAAJ0GACAcAACnCQAgHgAApQYAIB8AAKYGACAgAACoBgAgzAIBAKMFACHPAkAApAUAId4CAACaBqgDIuQCQACkBQAh7wIBAKMFACHwAgEAowUAIfECAQCvBQAhggMAAJkGpwMipQMgALEFACGoAyAAsQUAIakDIACxBQAhqgNAALAFACEZCAAA7QcAIAsAAOsHACANAADpBwAgDgAA6gcAIA8AAO8HACAWAADyBwAgFwAA7AcAIBoAAOcHACAcAACwCQAgHQAA7gcAIB4AAPAHACAfAADxBwAgIAAA8wcAIMwCAQAAAAHPAkAAAAAB3gIAAACoAwLkAkAAAAAB7wIBAAAAAfACAQAAAAHxAgEAAAABggMAAACnAwKlAyAAAAABqAMgAAAAAakDIAAAAAGqA0AAAAABAgAAAEgAIC0AANcJACADAAAARgAgLQAA1wkAIC4AANsJACAbAAAARgAgCAAAogYAIAsAAKAGACANAACeBgAgDgAAnwYAIA8AAKQGACAWAACnBgAgFwAAoQYAIBoAAJwGACAcAACnCQAgHQAAowYAIB4AAKUGACAfAACmBgAgIAAAqAYAICYAANsJACDMAgEAowUAIc8CQACkBQAh3gIAAJoGqAMi5AJAAKQFACHvAgEAowUAIfACAQCjBQAh8QIBAK8FACGCAwAAmQanAyKlAyAAsQUAIagDIACxBQAhqQMgALEFACGqA0AAsAUAIRkIAACiBgAgCwAAoAYAIA0AAJ4GACAOAACfBgAgDwAApAYAIBYAAKcGACAXAAChBgAgGgAAnAYAIBwAAKcJACAdAACjBgAgHgAApQYAIB8AAKYGACAgAACoBgAgzAIBAKMFACHPAkAApAUAId4CAACaBqgDIuQCQACkBQAh7wIBAKMFACHwAgEAowUAIfECAQCvBQAhggMAAJkGpwMipQMgALEFACGoAyAAsQUAIakDIACxBQAhqgNAALAFACEhBQAAzwgAIAgAANAIACAJAADRCAAgDQAA0ggAIA4AANMIACAUAADUCAAgFgAA1ggAIBcAANcIACAYAACJCQAgGQAA2AgAIMwCAQAAAAHPAkAAAAAB5AJAAAAAAfkCAQAAAAGDAwEAAAABhAMBAAAAAYUDAQAAAAGGAwIAAAABhwMBAAAAAYgDAQAAAAGJAwEAAAABigMBAAAAAYsDAQAAAAGMAxAAAAABjQMQAAAAAY4DAgAAAAGPAwIAAAABkQMAAACRAwKSAyAAAAABkwMgAAAAAZQDCAAAAAGVAwIAAAABlgMCAAAAAQIAAAANACAtAADcCQAgAwAAAAsAIC0AANwJACAuAADgCQAgIwAAAAsAIAUAAIYGACAIAACHBgAgCQAAiAYAIA0AAIkGACAOAACKBgAgFAAAiwYAIBYAAI0GACAXAACOBgAgGAAA_QgAIBkAAI8GACAmAADgCQAgzAIBAKMFACHPAkAApAUAIeQCQACkBQAh-QIBAKMFACGDAwEAowUAIYQDAQCjBQAhhQMBAKMFACGGAwIAzgUAIYcDAQCjBQAhiAMBAK8FACGJAwEArwUAIYoDAQCvBQAhiwMBAK8FACGMAxAAgQYAIY0DEACBBgAhjgMCAIIGACGPAwIAggYAIZEDAACDBpEDIpIDIACxBQAhkwMgALEFACGUAwgAhAYAIZUDAgDOBQAhlgMCAM4FACEhBQAAhgYAIAgAAIcGACAJAACIBgAgDQAAiQYAIA4AAIoGACAUAACLBgAgFgAAjQYAIBcAAI4GACAYAAD9CAAgGQAAjwYAIMwCAQCjBQAhzwJAAKQFACHkAkAApAUAIfkCAQCjBQAhgwMBAKMFACGEAwEAowUAIYUDAQCjBQAhhgMCAM4FACGHAwEAowUAIYgDAQCvBQAhiQMBAK8FACGKAwEArwUAIYsDAQCvBQAhjAMQAIEGACGNAxAAgQYAIY4DAgCCBgAhjwMCAIIGACGRAwAAgwaRAyKSAyAAsQUAIZMDIACxBQAhlAMIAIQGACGVAwIAzgUAIZYDAgDOBQAhGQgAAO0HACANAADpBwAgDgAA6gcAIA8AAO8HACAWAADyBwAgFwAA7AcAIBoAAOcHACAbAADoBwAgHAAAsAkAIB0AAO4HACAeAADwBwAgHwAA8QcAICAAAPMHACDMAgEAAAABzwJAAAAAAd4CAAAAqAMC5AJAAAAAAe8CAQAAAAHwAgEAAAAB8QIBAAAAAYIDAAAApwMCpQMgAAAAAagDIAAAAAGpAyAAAAABqgNAAAAAAQIAAABIACAtAADhCQAgCcwCAQAAAAHNAgEAAAABzwJAAAAAAd4CAAAA6AIC5AJAAAAAAeUCAQAAAAHmAgIAAAAB6AIAANMFACDpAiAAAAABA8wCAQAAAAHNAgEAAAABzwJAAAAAAQXMAgEAAAABzQIBAAAAAc8CQAAAAAHkAkAAAAAB7gIBAAAAAQXMAgEAAAABzQIBAAAAAc8CQAAAAAHkAkAAAAAB7gIBAAAAARkIAADtBwAgCwAA6wcAIA0AAOkHACAOAADqBwAgDwAA7wcAIBYAAPIHACAXAADsBwAgGgAA5wcAIBsAAOgHACAcAACwCQAgHQAA7gcAIB4AAPAHACAgAADzBwAgzAIBAAAAAc8CQAAAAAHeAgAAAKgDAuQCQAAAAAHvAgEAAAAB8AIBAAAAAfECAQAAAAGCAwAAAKcDAqUDIAAAAAGoAyAAAAABqQMgAAAAAaoDQAAAAAECAAAASAAgLQAA5wkAIAMAAABGACAtAADnCQAgLgAA6wkAIBsAAABGACAIAACiBgAgCwAAoAYAIA0AAJ4GACAOAACfBgAgDwAApAYAIBYAAKcGACAXAAChBgAgGgAAnAYAIBsAAJ0GACAcAACnCQAgHQAAowYAIB4AAKUGACAgAACoBgAgJgAA6wkAIMwCAQCjBQAhzwJAAKQFACHeAgAAmgaoAyLkAkAApAUAIe8CAQCjBQAh8AIBAKMFACHxAgEArwUAIYIDAACZBqcDIqUDIACxBQAhqAMgALEFACGpAyAAsQUAIaoDQACwBQAhGQgAAKIGACALAACgBgAgDQAAngYAIA4AAJ8GACAPAACkBgAgFgAApwYAIBcAAKEGACAaAACcBgAgGwAAnQYAIBwAAKcJACAdAACjBgAgHgAApQYAICAAAKgGACDMAgEAowUAIc8CQACkBQAh3gIAAJoGqAMi5AJAAKQFACHvAgEAowUAIfACAQCjBQAh8QIBAK8FACGCAwAAmQanAyKlAyAAsQUAIagDIACxBQAhqQMgALEFACGqA0AAsAUAIQrMAgEAAAABzQIBAAAAAc8CQAAAAAHeAgAAAPsCAuQCQAAAAAH2AhAAAAAB9wJAAAAAAfkCAAAA-QIC-wIBAAAAAfwCAQAAAAEEzAIBAAAAAe8CAQAAAAHxAgEAAAABggMBAAAAARkIAADtBwAgCwAA6wcAIA0AAOkHACAOAADqBwAgDwAA7wcAIBcAAOwHACAaAADnBwAgGwAA6AcAIBwAALAJACAdAADuBwAgHgAA8AcAIB8AAPEHACAgAADzBwAgzAIBAAAAAc8CQAAAAAHeAgAAAKgDAuQCQAAAAAHvAgEAAAAB8AIBAAAAAfECAQAAAAGCAwAAAKcDAqUDIAAAAAGoAyAAAAABqQMgAAAAAaoDQAAAAAECAAAASAAgLQAA7gkAIAMAAABGACAtAADuCQAgLgAA8gkAIBsAAABGACAIAACiBgAgCwAAoAYAIA0AAJ4GACAOAACfBgAgDwAApAYAIBcAAKEGACAaAACcBgAgGwAAnQYAIBwAAKcJACAdAACjBgAgHgAApQYAIB8AAKYGACAgAACoBgAgJgAA8gkAIMwCAQCjBQAhzwJAAKQFACHeAgAAmgaoAyLkAkAApAUAIe8CAQCjBQAh8AIBAKMFACHxAgEArwUAIYIDAACZBqcDIqUDIACxBQAhqAMgALEFACGpAyAAsQUAIaoDQACwBQAhGQgAAKIGACALAACgBgAgDQAAngYAIA4AAJ8GACAPAACkBgAgFwAAoQYAIBoAAJwGACAbAACdBgAgHAAApwkAIB0AAKMGACAeAAClBgAgHwAApgYAICAAAKgGACDMAgEAowUAIc8CQACkBQAh3gIAAJoGqAMi5AJAAKQFACHvAgEAowUAIfACAQCjBQAh8QIBAK8FACGCAwAAmQanAyKlAyAAsQUAIagDIACxBQAhqQMgALEFACGqA0AAsAUAIQfMAgEAAAABzQIBAAAAAc8CQAAAAAHeAgAAAPYCAuQCQAAAAAH2AhAAAAAB9wJAAAAAAQTMAgEAAAABzQIBAAAAAc8CQAAAAAHtAgIAAAABA8wCAQAAAAHOAgEAAAABzwJAAAAAAQzMAgEAAAABzwJAAAAAAeQCQAAAAAGZAwEAAAABmgMBAAAAAZsDAQAAAAGcAwEAAAABnQMBAAAAAZ4DQAAAAAGfA0AAAAABoAMBAAAAAaEDAQAAAAEFzAIBAAAAAc4CAQAAAAHPAkAAAAAB5AJAAAAAAe4CAQAAAAEFzAIBAAAAAc4CAQAAAAHPAkAAAAAB5AJAAAAAAe4CAQAAAAEFzAIBAAAAAc0CAQAAAAHOAgEAAAABzwJAAAAAAeQCQAAAAAEFzAIBAAAAAc0CAQAAAAHOAgEAAAABzwJAAAAAAeQCQAAAAAEEzAIBAAAAAc4CAQAAAAHPAkAAAAAB7QICAAAAAQnMAgEAAAABzgIBAAAAAc8CQAAAAAHeAgAAAOgCAuQCQAAAAAHlAgEAAAAB5gICAAAAAegCAADTBQAg6QIgAAAAAQfMAgEAAAABzwJAAAAAAeQCQAAAAAH3AkAAAAABogMBAAAAAaMDAQAAAAGkAwEAAAABCcwCAQAAAAHPAkAAAAAB3gIBAAAAAfsCAQAAAAH9AgEAAAAB_gIIAAAAAf8CAQAAAAGAAwEAAAABgQMBAAAAAQrMAgEAAAABzwJAAAAAAdwCAAAA3AIC3gIAAADeAgLfAgEAAAAB4AIBAAAAAeECQAAAAAHiAkAAAAAB4wIgAAAAAeQCQAAAAAEhBQAAzwgAIAgAANAIACAJAADRCAAgDQAA0ggAIA4AANMIACAVAADVCAAgFgAA1ggAIBcAANcIACAYAACJCQAgGQAA2AgAIMwCAQAAAAHPAkAAAAAB5AJAAAAAAfkCAQAAAAGDAwEAAAABhAMBAAAAAYUDAQAAAAGGAwIAAAABhwMBAAAAAYgDAQAAAAGJAwEAAAABigMBAAAAAYsDAQAAAAGMAxAAAAABjQMQAAAAAY4DAgAAAAGPAwIAAAABkQMAAACRAwKSAyAAAAABkwMgAAAAAZQDCAAAAAGVAwIAAAABlgMCAAAAAQIAAAANACAtAACACgAgCcwCAQAAAAHNAgEAAAABzwJAAAAAAd4CAQAAAAH7AgEAAAAB_QIBAAAAAf4CCAAAAAH_AgEAAAABgQMBAAAAAQMAAAALACAtAACACgAgLgAAhQoAICMAAAALACAFAACGBgAgCAAAhwYAIAkAAIgGACANAACJBgAgDgAAigYAIBUAAIwGACAWAACNBgAgFwAAjgYAIBgAAP0IACAZAACPBgAgJgAAhQoAIMwCAQCjBQAhzwJAAKQFACHkAkAApAUAIfkCAQCjBQAhgwMBAKMFACGEAwEAowUAIYUDAQCjBQAhhgMCAM4FACGHAwEAowUAIYgDAQCvBQAhiQMBAK8FACGKAwEArwUAIYsDAQCvBQAhjAMQAIEGACGNAxAAgQYAIY4DAgCCBgAhjwMCAIIGACGRAwAAgwaRAyKSAyAAsQUAIZMDIACxBQAhlAMIAIQGACGVAwIAzgUAIZYDAgDOBQAhIQUAAIYGACAIAACHBgAgCQAAiAYAIA0AAIkGACAOAACKBgAgFQAAjAYAIBYAAI0GACAXAACOBgAgGAAA_QgAIBkAAI8GACDMAgEAowUAIc8CQACkBQAh5AJAAKQFACH5AgEAowUAIYMDAQCjBQAhhAMBAKMFACGFAwEAowUAIYYDAgDOBQAhhwMBAKMFACGIAwEArwUAIYkDAQCvBQAhigMBAK8FACGLAwEArwUAIYwDEACBBgAhjQMQAIEGACGOAwIAggYAIY8DAgCCBgAhkQMAAIMGkQMikgMgALEFACGTAyAAsQUAIZQDCACEBgAhlQMCAM4FACGWAwIAzgUAIQrMAgEAAAABzgIBAAAAAc8CQAAAAAHeAgAAAPsCAuQCQAAAAAH2AhAAAAAB9wJAAAAAAfkCAAAA-QIC-wIBAAAAAfwCAQAAAAEhBQAAzwgAIAgAANAIACAJAADRCAAgDQAA0ggAIA4AANMIACAUAADUCAAgFQAA1QgAIBcAANcIACAYAACJCQAgGQAA2AgAIMwCAQAAAAHPAkAAAAAB5AJAAAAAAfkCAQAAAAGDAwEAAAABhAMBAAAAAYUDAQAAAAGGAwIAAAABhwMBAAAAAYgDAQAAAAGJAwEAAAABigMBAAAAAYsDAQAAAAGMAxAAAAABjQMQAAAAAY4DAgAAAAGPAwIAAAABkQMAAACRAwKSAyAAAAABkwMgAAAAAZQDCAAAAAGVAwIAAAABlgMCAAAAAQIAAAANACAtAACHCgAgDAcAAMcFACDMAgEAAAABzQIBAAAAAc8CQAAAAAHcAgAAANwCAt4CAAAA3gIC3wIBAAAAAeACAQAAAAHhAkAAAAAB4gJAAAAAAeMCIAAAAAHkAkAAAAABAgAAAGUAIC0AAIkKACADAAAALgAgLQAAiQoAIC4AAI0KACAOAAAALgAgBwAAsgUAICYAAI0KACDMAgEAowUAIc0CAQCjBQAhzwJAAKQFACHcAgAArQXcAiLeAgAArgXeAiLfAgEArwUAIeACAQCvBQAh4QJAALAFACHiAkAAsAUAIeMCIACxBQAh5AJAAKQFACEMBwAAsgUAIMwCAQCjBQAhzQIBAKMFACHPAkAApAUAIdwCAACtBdwCIt4CAACuBd4CIt8CAQCvBQAh4AIBAK8FACHhAkAAsAUAIeICQACwBQAh4wIgALEFACHkAkAApAUAIQnMAgEAAAABzQIBAAAAAc8CQAAAAAHeAgEAAAAB-wIBAAAAAf0CAQAAAAH-AggAAAAB_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_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_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_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-QIC-wIBAAAAAfwCAQAAAAECAAAAKAAgLQAAzQoAIBkIAADtBwAgCwAA6wcAIA0AAOkHACAOAADqBwAgFgAA8gcAIBcAAOwHACAaAADnBwAgGwAA6AcAIBwAALAJACAdAADuBwAgHgAA8AcAIB8AAPEHACAgAADzBwAgzAIBAAAAAc8CQAAAAAHeAgAAAKgDAuQCQAAAAAHvAgEAAAAB8AIBAAAAAfECAQAAAAGCAwAAAKcDAqUDIAAAAAGoAyAAAAABqQMgAAAAAaoDQAAAAAECAAAASAAgLQAAzwoAIAMAAAAzACAtAADLCgAgLgAA0woAIAwAAAAzACAGAADCBgAgBwAAhQgAICYAANMKACDMAgEAowUAIc0CAQCjBQAhzgIBAKMFACHPAkAApAUAId4CAAC_BvYCIuQCQACkBQAh9gIQAMAGACH3AkAApAUAIQoGAADCBgAgBwAAhQgAIMwCAQCjBQAhzQIBAKMFACHOAgEAowUAIc8CQACkBQAh3gIAAL8G9gIi5AJAAKQFACH2AhAAwAYAIfcCQACkBQAhAwAAACYAIC0AAM0KACAuAADWCgAgDwAAACYAIAYAAN8GACAHAACcCAAgJgAA1goAIMwCAQCjBQAhzQIBAKMFACHOAgEAowUAIc8CQACkBQAh3gIAAN0G-wIi5AJAAKQFACH2AhAAwAYAIfcCQACwBQAh-QIAANwG-QIi-wIBAK8FACH8AgEArwUAIQ0GAADfBgAgBwAAnAgAIMwCAQCjBQAhzQIBAKMFACHOAgEAowUAIc8CQACkBQAh3gIAAN0G-wIi5AJAAKQFACH2AhAAwAYAIfcCQACwBQAh-QIAANwG-QIi-wIBAK8FACH8AgEArwUAIQMAAABGACAtAADPCgAgLgAA2QoAIBsAAABGACAIAACiBgAgCwAAoAYAIA0AAJ4GACAOAACfBgAgFgAApwYAIBcAAKEGACAaAACcBgAgGwAAnQYAIBwAAKcJACAdAACjBgAgHgAApQYAIB8AAKYGACAgAACoBgAgJgAA2QoAIMwCAQCjBQAhzwJAAKQFACHeAgAAmgaoAyLkAkAApAUAIe8CAQCjBQAh8AIBAKMFACHxAgEArwUAIYIDAACZBqcDIqUDIACxBQAhqAMgALEFACGpAyAAsQUAIaoDQACwBQAhGQgAAKIGACALAACgBgAgDQAAngYAIA4AAJ8GACAWAACnBgAgFwAAoQYAIBoAAJwGACAbAACdBgAgHAAApwkAIB0AAKMGACAeAAClBgAgHwAApgYAICAAAKgGACDMAgEAowUAIc8CQACkBQAh3gIAAJoGqAMi5AJAAKQFACHvAgEAowUAIfACAQCjBQAh8QIBAK8FACGCAwAAmQanAyKlAyAAsQUAIagDIACxBQAhqQMgALEFACGqA0AAsAUAIQnMAgEAAAABzQIBAAAAAc8CQAAAAAHeAgEAAAAB-wIBAAAAAf4CCAAAAAH_AgEAAAABgAMBAAAAAYEDAQAAAAEDAAAARgAgLQAAyQoAIC4AAN0KACAbAAAARgAgCAAAogYAIAsAAKAGACANAACeBgAgDgAAnwYAIA8AAKQGACAWAACnBgAgFwAAoQYAIBoAAJwGACAbAACdBgAgHAAApwkAIB0AAKMGACAfAACmBgAgIAAAqAYAICYAAN0KACDMAgEAowUAIc8CQACkBQAh3gIAAJoGqAMi5AJAAKQFACHvAgEAowUAIfACAQCjBQAh8QIBAK8FACGCAwAAmQanAyKlAyAAsQUAIagDIACxBQAhqQMgALEFACGqA0AAsAUAIRkIAACiBgAgCwAAoAYAIA0AAJ4GACAOAACfBgAgDwAApAYAIBYAAKcGACAXAAChBgAgGgAAnAYAIBsAAJ0GACAcAACnCQAgHQAAowYAIB8AAKYGACAgAACoBgAgzAIBAKMFACHPAkAApAUAId4CAACaBqgDIuQCQACkBQAh7wIBAKMFACHwAgEAowUAIfECAQCvBQAhggMAAJkGpwMipQMgALEFACGoAyAAsQUAIakDIACxBQAhqgNAALAFACEZCAAA7QcAIAsAAOsHACANAADpBwAgDgAA6gcAIA8AAO8HACAWAADyBwAgFwAA7AcAIBsAAOgHACAcAACwCQAgHQAA7gcAIB4AAPAHACAfAADxBwAgIAAA8wcAIMwCAQAAAAHPAkAAAAAB3gIAAACoAwLkAkAAAAAB7wIBAAAAAfACAQAAAAHxAgEAAAABggMAAACnAwKlAyAAAAABqAMgAAAAAakDIAAAAAGqA0AAAAABAgAAAEgAIC0AAN4KACAhBQAAzwgAIAgAANAIACANAADSCAAgDgAA0wgAIBQAANQIACAVAADVCAAgFgAA1ggAIBcAANcIACAYAACJCQAgGQAA2AgAIMwCAQAAAAHPAkAAAAAB5AJAAAAAAfkCAQAAAAGDAwEAAAABhAMBAAAAAYUDAQAAAAGGAwIAAAABhwMBAAAAAYgDAQAAAAGJAwEAAAABigMBAAAAAYsDAQAAAAGMAxAAAAABjQMQAAAAAY4DAgAAAAGPAwIAAAABkQMAAACRAwKSAyAAAAABkwMgAAAAAZQDCAAAAAGVAwIAAAABlgMCAAAAAQIAAAANACAtAADgCgAgAwAAAEYAIC0AAN4KACAuAADkCgAgGwAAAEYAIAgAAKIGACALAACgBgAgDQAAngYAIA4AAJ8GACAPAACkBgAgFgAApwYAIBcAAKEGACAbAACdBgAgHAAApwkAIB0AAKMGACAeAAClBgAgHwAApgYAICAAAKgGACAmAADkCgAgzAIBAKMFACHPAkAApAUAId4CAACaBqgDIuQCQACkBQAh7wIBAKMFACHwAgEAowUAIfECAQCvBQAhggMAAJkGpwMipQMgALEFACGoAyAAsQUAIakDIACxBQAhqgNAALAFACEZCAAAogYAIAsAAKAGACANAACeBgAgDgAAnwYAIA8AAKQGACAWAACnBgAgFwAAoQYAIBsAAJ0GACAcAACnCQAgHQAAowYAIB4AAKUGACAfAACmBgAgIAAAqAYAIMwCAQCjBQAhzwJAAKQFACHeAgAAmgaoAyLkAkAApAUAIe8CAQCjBQAh8AIBAKMFACHxAgEArwUAIYIDAACZBqcDIqUDIACxBQAhqAMgALEFACGpAyAAsQUAIaoDQACwBQAhAwAAAAsAIC0AAOAKACAuAADnCgAgIwAAAAsAIAUAAIYGACAIAACHBgAgDQAAiQYAIA4AAIoGACAUAACLBgAgFQAAjAYAIBYAAI0GACAXAACOBgAgGAAA_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_mQECQJsBGUGcASJCnQECQ54BAkSfARlFogEjRqMBJ0ekARdIpQEXSaYBF0qnARdLqAEXTKoBF02sARlOrQEoT68BF1CxARlRsgEpUrMBF1O0ARdUtQEZVbgBKla5AS5XugEWWLsBFlm8ARZavQEWW74BFlzAARZdwgEZXsMBL1_FARZgxwEZYcgBMGLJARZjygEWZMsBGWXOATFmzwE1Z9EBNmjSATZp1QE2atYBNmvXATZs2QE2bdsBGW7cATdv3gE2cOABGXHhAThy4gE2c-MBNnTkARl15wE5dugBPXfpAQV46gEFeesBBXrsAQV77QEFfO8BBX3xARl-8gE-f_QBBYAB9gEZgQH3AT-CAfgBBYMB-QEFhAH6ARmFAf0BQIYB_gFEhwH_AQSIAYACBIkBgQIEigGCAgSLAYMCBIwBhQIEjQGHAhmOAYgCRY8BigIEkAGMAhmRAY0CRpIBjgIEkwGPAgSUAZACGZcBkwJHmAGUAk2ZAZUCE5oBlgITmwGXAhOcAZgCE50BmQITngGbAhOfAZ0CGaABngJOoQGgAhOiAaICGaMBowJPpAGkAhOlAaUCE6YBpgIZpwGpAlCoAaoCVKkBqwINqgGsAg2rAa0CDawBrgINrQGvAg2uAbECDa8BswIZsAG0AlWxAbkCDbIBuwIZswG8Ala0AcACDbUBwQINtgHCAhm3AcUCV7gBxgJduQHHAgy6AcgCDLsByQIMvAHKAgy9AcsCDL4BzQIMvwHPAhnAAdACXsEB0gIMwgHUAhnDAdUCX8QB1gIMxQHXAgzGAdgCGccB2wJgyAHcAmbJAd0CEMoB3gIQywHfAhDMAeACEM0B4QIQzgHjAhDPAeUCGdAB5gJn0QHoAhDSAeoCGdMB6wJo1AHsAhDVAe0CENYB7gIZ1wHxAmnYAfICb9kB8wIJ2gH0AgnbAfUCCdwB9gIJ3QH3AgneAfkCCd8B-wIZ4AH8AnDhAf4CCeIBgAMZ4wGBA3HkAYIDCeUBgwMJ5gGEAxnnAYcDcugBiAN26QGJAwjqAYoDCOsBiwMI7AGMAwjtAY0DCO4BjwMI7wGRAxnwAZIDd_EBlQMI8gGXAxnzAZgDePQBmgMI9QGbAwj2AZwDGfcBnwN5-AGgA335AaEDCvoBogMK-wGjAwr8AaQDCv0BpQMK_gGnAwr_AakDGYACqgN-gQKtAwqCAq8DGYMCsAN_hAKyAwqFArMDCoYCtAMZhwK3A4ABiAK4A4QBiQK5AxSKAroDFIsCuwMUjAK8AxSNAr0DFI4CvwMUjwLBAxmQAsIDhQGRAsQDFJICxgMZkwLHA4YBlALIAxSVAskDFJYCygMZlwLNA4cBmALOA40BmQLPAweaAtADB5sC0QMHnALSAwedAtMDB54C1QMHnwLXAxmgAtgDjgGhAtoDB6IC3AMZowLdA48BpALeAwelAt8DB6YC4AMZpwLjA5ABqALkA5YBqQLlAw6qAuYDDqsC5wMOrALoAw6tAukDDq4C6wMOrwLtAxmwAu4DlwGxAvADDrIC8gMZswLzA5gBtAL0Aw61AvUDDrYC9gMZtwL5A5kBuAL6A50BuQL7AwO6AvwDA7sC_QMDvAL-AwO9Av8DA74CgQQDvwKDBBnAAoQEngHBAoYEA8ICiAQZwwKJBJ8BxAKKBAPFAosEA8YCjAQZxwKPBKAByAKQBKQB"
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
  name: "name",
  slug: "slug",
  isPublished: "isPublished",
  isFeatured: "isFeatured",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
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
  price: "price",
  expiresAt: "expiresAt",
  stripePaymentId: "stripePaymentId",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  paymentId: "paymentId"
};
var RentalScalarFieldEnum = {
  id: "id",
  userId: "userId",
  mediaId: "mediaId",
  status: "status",
  price: "price",
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

// src/app/lib/auth.ts
import { bearer } from "better-auth/plugins";
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
    requireEmailVerification: false
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
  //   emailVerification: {
  //   sendOnSignUp: true,
  //   sendOnSignIn: true,
  //   autoSignInAfterVerification: true,
  // },
  session: {
    expiresIn: 60 * 60 * 24,
    // ✅ 86400 = 1 day
    updateAge: 60 * 60 * 24,
    // ✅ 86400 = 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
      // ✅ 300 = 5 minutes
    }
  },
  plugins: [
    bearer()
    // emailOTP({
    //   overrideDefaultEmailVerification: true,
    //   async sendVerificationOTP({ email, otp, type }) {
    //     if (type === "email-verification") {
    //       const user = await prisma.user.findUnique({
    //         where: {
    //           email,
    //         },
    //       });
    //       if (!user) {
    //         console.error(
    //           `User with email ${email} not found. Cannot send verification OTP.`,
    //         );
    //         return;
    //       }
    //       if (user && !user.emailVerified) {
    //         sendEmail({
    //           to: email,
    //           subject: "Verify your email",
    //           templateName: "otp",
    //           templateData: {
    //             name: user.name,
    //             otp,
    //           expires:2 * 60, // 2 minutes in seconds
    //           },
    //         });
    //       }
    //     } else if (type === "forget-password") {
    //       const user = await prisma.user.findUnique({
    //         where: {
    //           email,
    //         },
    //       });
    //       if (user) {
    //         sendEmail({
    //           to: email,
    //           subject: "Password Reset OTP",
    //           templateName: "reset",
    //           templateData: {
    //             name: user.name,
    //             otp,
    //           },
    //         });
    //       }
    //     }
    //   },
    //   expiresIn: 2 * 60, // 2 minutes in seconds
    //   otpLength: 6,
    // }),
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
import { Router as Router12 } from "express";

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
  console.log("better-auth data.token:", typeof data.token, data.token);
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
  // verifyEmail,
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
  // verifyEmail,
  getMe: getMe2,
  getNewToken: getNewToken2,
  handleOAuthError,
  googleLogin,
  googleSuccess
  // sendVerifyOtp,
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
        if (!sessionExists || !sessionExists.user) {
          throw new AppError_default(status3.UNAUTHORIZED, "Session not found or expired");
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
  console.log("query params:", query);
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
var GenreService = {
  createGenre,
  getAllGenres,
  updateGenre,
  deleteGenre
  // createManyGenre,
};

// src/app/modules/genre/genre.controller.ts
var createGenre2 = catchAsync(async (req, res) => {
  const result = await GenreService.createGenre(req.body);
  return sendResponse(res, {
    httpStatusCode: status11.CREATED,
    success: true,
    message: "Genre created successfully",
    data: result
  });
});
var getAllGenres2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await GenreService.getAllGenres(query);
  return sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Genres fetched successfully",
    data: result
  });
});
var deleteGenre2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await GenreService.deleteGenre(id);
  return sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Genre deleted successfully",
    data: result
  });
});
var updateGenre2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await GenreService.updateGenre(id, req.body);
  return sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Genre updated successfully",
    data: result
  });
});
var GenreController = {
  createGenre: createGenre2,
  getAllGenres: getAllGenres2,
  updateGenre: updateGenre2,
  deleteGenre: deleteGenre2
  // createManyGenre,
};

// src/app/modules/genre/genre.validation.ts
import { z as z2 } from "zod";
var createGenreSchema = z2.object({
  name: z2.string().min(1, "Genre name is required"),
  slug: z2.string().min(1, "Genre slug is required"),
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
  console.log("Current User ID:", user.userId);
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
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      command: error.command
    });
    return { success: false, error: error.message };
  }
};

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
    subscription_data: {
      metadata: {
        userId,
        plan
      }
    },
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
    ;
    const session = event.data.object;
    const { userId, plan, mediaId, type } = session.metadata || session.subscription_data?.metadata || {};
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
      console.log("\u{1F680} About to run transaction...");
      await prisma.$transaction(async (tx) => {
        console.log("\u{1F4DD} Inside transaction");
        try {
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
          console.log("\u2705 Transaction complete!");
        } catch (err) {
          console.error("\u274C DB Error:", err);
          throw err;
        }
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
  console.log(data), "nedia service";
  const result = await prisma.media.create({
    data: {
      title: data.title,
      description: data.description,
      slug: data.slug,
      type: data.type,
      director: data.director,
      pricing: data.pricing,
      isPublished: data.isPublished,
      isFeatured: data.isFeatured,
      releaseYear: Number(data.releaseYear),
      runtimeMinutes: data.runtimeMinutes ? Number(data.runtimeMinutes) : null,
      seasons: data.seasons ? Number(data.seasons) : null,
      posterUrl: data.posterUrl || null,
      backdropUrl: data.backdropUrl || null,
      trailerUrl: data.trailerUrl || null,
      streamingUrl: data.streamingUrl || null,
      rentalPrice: data.rentalPrice != null && data.rentalPrice !== "" ? new prismaNamespace_exports.Decimal(data.rentalPrice) : null,
      buyPrice: data.buyPrice != null && data.buyPrice !== "" ? new prismaNamespace_exports.Decimal(data.buyPrice) : null,
      genres: data.genres?.length ? { connect: data.genres.map((id) => ({ id })) } : void 0,
      cast: data.cast?.length ? {
        create: data.cast.map((member) => ({
          name: member.name,
          role: member.role,
          image: member.image || null
        }))
      } : void 0
    },
    include: { genres: true, cast: true }
  });
  return result;
};
var getAllMedia = async (query) => {
  const { genre, minRating, ...remainingQuery } = query;
  const whereConditions = {};
  if (genre) {
    whereConditions.genres = {
      some: {
        slug: genre
      }
    };
  }
  if (minRating) {
    whereConditions.avgRating = {
      gte: Number(minRating)
    };
  }
  const mediaQuery = new QueryBuilder(prisma.media, remainingQuery, {
    searchableFields: ["title", "description"],
    filterableFields: ["type", "releaseYear"]
  }).search().filter().sort().paginate().where(whereConditions).include({
    genres: true,
    cast: true
  });
  return await mediaQuery.execute();
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

// src/app/modules/media/validation.ts
import { z as z3 } from "zod";
var createMediaValidationSchema = z3.object({
  title: z3.string().min(1, "Title is required"),
  description: z3.string().min(1, "Description is required"),
  slug: z3.string().min(1, "Slug is required"),
  type: z3.string().min(1, "Type is required"),
  releaseYear: z3.coerce.number({ error: "Release year is required" }),
  director: z3.string().min(1, "Director is required"),
  posterUrl: z3.string().min(1, "Poster URL is required"),
  backdropUrl: z3.string().optional(),
  trailerUrl: z3.string().optional(),
  streamingUrl: z3.string().optional(),
  runtimeMinutes: z3.coerce.number().optional(),
  seasons: z3.coerce.number().optional(),
  pricing: z3.enum(["FREE", "PREMIUM", "RENTAL"]),
  rentalPrice: z3.coerce.number().nonnegative().optional().nullable(),
  buyPrice: z3.coerce.number().nonnegative().optional().nullable(),
  isPublished: z3.boolean().default(false),
  isFeatured: z3.boolean().default(false),
  cast: z3.array(
    z3.object({
      name: z3.string(),
      role: z3.string(),
      image: z3.string().optional()
    })
  ).optional(),
  genres: z3.array(z3.string()).optional()
});
var updateMediaValidation = z3.object({
  title: z3.string().min(1, "Title is required").optional(),
  synopsis: z3.string().min(1, "Synopsis is required").optional(),
  slug: z3.string().min(1, "Slug is required").optional(),
  type: z3.string().min(1, "Type is required").optional(),
  releaseYear: z3.string({ error: "Release year is required" }).optional(),
  director: z3.string().min(1, "Director is required").optional(),
  posterUrl: z3.string().min(1, "Poster URL is required").optional(),
  backdropUrl: z3.string().optional(),
  trailerUrl: z3.string().optional(),
  streamingUrl: z3.string().optional(),
  runtimeMinutes: z3.string().optional(),
  seasons: z3.string().optional(),
  pricing: z3.enum(["FREE", "PREMIUM", "RENTAL"]).optional(),
  rentalPrice: z3.coerce.number().nonnegative().optional().nullable(),
  buyPrice: z3.coerce.number().nonnegative().optional().nullable(),
  isPublished: z3.boolean().optional(),
  isFeatured: z3.boolean().optional(),
  cast: z3.array(
    z3.object({
      name: z3.string(),
      role: z3.string(),
      image: z3.string().optional()
    })
  ).optional(),
  genres: z3.array(z3.string()).optional(),
  platforms: z3.array(z3.string()).optional()
});
var changePublishStatusValidation = z3.object({
  isPublished: z3.boolean("isPublished is required")
});
var changeFeaturedStatusValidation = z3.object({
  isFeatured: z3.boolean("isFeatured is required")
});
var MediaValidation = {
  createMediaValidationSchema,
  updateMediaValidation,
  changePublishStatusValidation,
  changeFeaturedStatusValidation
};

// src/app/modules/media/media.route.ts
var router9 = Router9();
router9.post(
  "/",
  checkAuth(Role.ADMIN),
  validateRequest(MediaValidation.createMediaValidationSchema),
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
import { z as z4 } from "zod";
var createReviewValidation = z4.object({
  mediaId: z4.string("Media ID is required"),
  rating: z4.number("Rating must be a number").min(1, "Rating must be at least 1").max(10, "Rating must be at most 10"),
  content: z4.string("Content is required"),
  status: z4.enum(
    ["APPROVED", "UNPUBLISHED", "PENDING"],
    "Status must be one of APPROVED, UNPUBLISHED, PENDING"
  ).optional(),
  userId: z4.string("User ID is required"),
  tags: z4.array(z4.string("Tag is required")),
  hasSpoiler: z4.boolean("Has spoiler must be a boolean")
});
var updateReviewValidation = z4.object({
  mediaId: z4.string("Media ID is required"),
  rating: z4.number("Rating must be a number").min(1, "Rating must be at least 1").max(10, "Rating must be at most 10"),
  content: z4.string("Content is required"),
  status: z4.enum(
    ["APPROVED", "UNPUBLISHED", "PENDING"],
    "Status must be one of APPROVED, UNPUBLISHED, PENDING"
  ).optional(),
  userId: z4.string("User ID is required"),
  tags: z4.array(z4.string("Tag is required")),
  hasSpoiler: z4.boolean("Has spoiler must be a boolean")
});
var updateReviewStatusValidation = z4.object({
  status: z4.enum(
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

// src/app/modules/admin/admin.route.ts
import { Router as Router11 } from "express";

// src/app/modules/admin/admin.service.ts
var getStats = async () => {
  const [
    totalMedia,
    totalReviews,
    totalUsers,
    activeUsers,
    activeSubscriptions,
    revenueAggregate,
    avgRatingAggregate
  ] = await Promise.all([
    prisma.media.count(),
    prisma.review.count({
      where: { status: "APPROVED" }
    }),
    prisma.user.count(),
    prisma.user.count({
      where: { status: "ACTIVE" }
    }),
    prisma.subscription.count({
      where: { status: "ACTIVE" }
    }),
    prisma.payment.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true }
    }),
    prisma.review.aggregate({
      where: { status: "APPROVED" },
      _avg: { rating: true }
    })
  ]);
  return {
    totalMedia,
    totalReviews,
    totalUsers,
    activeUsers,
    activeSubscriptions,
    totalRevenue: revenueAggregate._sum.amount ?? 0,
    avgRating: avgRatingAggregate._avg.rating ?? 0
  };
};
var getSales = async () => {
  const [
    totalSales,
    revenueAggregate,
    subRevenueAggregate,
    purchaseRevenueAggregate,
    // New: Revenue for type BUY
    rentalRevenueAggregate,
    // New: Revenue for type RENTAL
    rawSalesOverTime
  ] = await Promise.all([
    // 1. Count all completed payments
    prisma.payment.count({
      where: { status: "COMPLETED" }
    }),
    // 2. Total Gross Revenue
    prisma.payment.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true }
    }),
    // 3. Subscription Revenue (Linked to a subscriptionId)
    prisma.payment.aggregate({
      where: {
        status: "COMPLETED",
        subscriptionId: { not: null }
      },
      _sum: { amount: true }
    }),
    // 4. Purchase Revenue (Linked to MediaPurchase with type BUY)
    prisma.payment.aggregate({
      where: {
        status: "COMPLETED",
        mediaPurchase: {
          type: "BUY"
        }
      },
      _sum: { amount: true }
    }),
    // 5. Rental Revenue (Linked to MediaPurchase with type RENTAL)
    prisma.payment.aggregate({
      where: {
        status: "COMPLETED",
        mediaPurchase: {
          type: "RENTAL"
        }
      },
      _sum: { amount: true }
    }),
    // 6. Data for Charts
    prisma.payment.findMany({
      where: { status: "COMPLETED" },
      select: { amount: true, createdAt: true },
      orderBy: { createdAt: "asc" }
    })
  ]);
  const totalRevenue = revenueAggregate._sum.amount ?? 0;
  const subscriptionRevenue = subRevenueAggregate._sum.amount ?? 0;
  const purchaseRevenue = purchaseRevenueAggregate._sum.amount ?? 0;
  const rentalRevenue = rentalRevenueAggregate._sum.amount ?? 0;
  const salesOverTime = Object.values(
    rawSalesOverTime.reduce(
      (acc, payment) => {
        const date = payment.createdAt.toISOString().split("T")[0];
        if (!acc[date]) acc[date] = { date, revenue: 0, count: 0 };
        acc[date].revenue += payment.amount;
        acc[date].count += 1;
        return acc;
      },
      {}
    )
  );
  return {
    totalSales,
    totalRevenue,
    purchaseRevenue,
    rentalRevenue,
    subscriptionRevenue,
    salesOverTime
  };
};
var getReviews = async () => {
  const [reviewsData, recentReviews] = await Promise.all([
    prisma.review.groupBy({
      by: ["rating"],
      _count: { id: true },
      orderBy: { rating: "asc" }
    }),
    prisma.review.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        rating: true,
        content: true,
        status: true,
        user: {
          select: { name: true }
        },
        media: {
          select: { title: true }
        }
      }
    })
  ]);
  return {
    byRating: reviewsData,
    // [{rating, _count: {id}}]
    recentReviews
    // matches frontend review list exactly
  };
};
var getAllMedia3 = async (query) => {
  const { genre, minRating } = query;
  const whereConditions = { isPublished: true };
  if (genre) {
    whereConditions.genres = { some: { slug: genre } };
  }
  if (minRating) {
    whereConditions.avgRating = { gte: Number(minRating) };
  }
  const mediaQuery = new QueryBuilder(prisma.media, query, {
    searchableFields: ["title", "description"],
    filterableFields: ["type", "releaseYear", "pricing"]
  }).where(whereConditions).search().filter().sort().paginate().include({
    genres: true,
    cast: true
  });
  const result = await mediaQuery.execute();
  return result;
};
var AdminService = {
  getStats,
  getSales,
  getReviews,
  getAllMedia: getAllMedia3
};

// src/app/modules/admin/admin.controller.ts
import httpStatus4 from "http-status";
var getStats2 = catchAsync(async (req, res) => {
  const result = await AdminService.getStats();
  sendResponse(res, {
    httpStatusCode: httpStatus4.OK,
    success: true,
    message: "Admin statistics retrieved successfully",
    data: result
  });
});
var getSales2 = catchAsync(async (req, res) => {
  const result = await AdminService.getSales();
  sendResponse(res, {
    httpStatusCode: httpStatus4.OK,
    success: true,
    message: "Admin sales retrieved successfully",
    data: result
  });
});
var getReviews2 = catchAsync(async (req, res) => {
  const result = await AdminService.getReviews();
  sendResponse(res, {
    httpStatusCode: httpStatus4.OK,
    success: true,
    message: "Admin reviews retrieved successfully",
    data: result
  });
});
var getAllMedia4 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await AdminService.getAllMedia(query);
  sendResponse(res, {
    httpStatusCode: httpStatus4.OK,
    success: true,
    message: "Admin media retrieved successfully",
    data: result
  });
});
var AdminController = {
  getStats: getStats2,
  getSales: getSales2,
  getReviews: getReviews2,
  getAllMedia: getAllMedia4
};

// src/app/modules/admin/admin.route.ts
var router11 = Router11();
router11.get("/analytics/stats", checkAuth(Role.ADMIN), AdminController.getStats);
router11.get("/analytics/sales", checkAuth(Role.ADMIN), AdminController.getSales);
router11.get(
  "/analytics/reviews",
  checkAuth(Role.ADMIN),
  AdminController.getReviews
);
router11.get("/media", checkAuth(Role.ADMIN), AdminController.getAllMedia);
var AdminRoutes = router11;

// src/app/routes/index.ts
var router12 = Router12();
router12.use("/auth", authRoutes);
router12.use("/users", userRoutes);
router12.use("/favorites", FavoriteRouter);
router12.use("/genres", GenreRoutes);
router12.use("/bookmarks", BookmarkRouter);
router12.use("/watchlist", WatchlistRouter);
router12.use("/payment", PaymentRoutes);
router12.use("/subscriptions", SubscriptionRouter);
router12.use("/media", MediaRoutes);
router12.use("/reviews", ReviewsRoutes);
router12.use("/admin", AdminRoutes);
var IndexRoutes = router12;

// src/app/middlewares/globalError.ts
import status21 from "http-status";
import z5 from "zod";

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
  } else if (err instanceof z5.ZodError) {
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
var notFound = (req, res, next) => {
  if (res.headersSent) return next();
  return res.status(status22.NOT_FOUND).json({
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
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path3.resolve(process.cwd(), `src/app/templates`));
app.use("/api/auth", toNodeHandler(auth));
app.use("/api/v1", IndexRoutes);
app.get("/", async (req, res) => {
  res.status(201).json({
    success: true,
    message: "API is working"
  });
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
