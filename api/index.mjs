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
  "inlineSchema": 'model Admin {\n  id            String    @id @default(uuid(7))\n  name          String\n  email         String    @unique\n  profilePhoto  String?\n  contactNumber String?\n  isDeleted     Boolean   @default(false)\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  deletedAt     DateTime?\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([email])\n  @@index([isDeleted])\n  @@map("admin")\n}\n\nmodel User {\n  id                 String          @id\n  name               String\n  email              String          @unique\n  emailVerified      Boolean         @default(false)\n  image              String?\n  role               Role            @default(USER)\n  status             UserStatus      @default(ACTIVE)\n  needPasswordChange Boolean         @default(false)\n  isDeleted          Boolean         @default(false)\n  deletedAt          DateTime?\n  createdAt          DateTime        @default(now())\n  updatedAt          DateTime        @updatedAt\n  watchList          WatchList[]\n  accounts           Account[]\n  bookmarks          Bookmark[]\n  favorites          Favorite[]\n  mediaAdded         Media[]         @relation("MediaAddedBy")\n  profile            Profile?\n  ratings            Rating[]\n  reviews            Review[]\n  sessions           Session[]\n  payments           Payment[]\n  subscriptions      Subscription[]\n  mediaPurchases     MediaPurchase[]\n  rentals            Rental[]\n  admins             Admin[]\n\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String   @unique\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel ContactMessage {\n  id        String   @id @default(uuid())\n  name      String\n  email     String\n  message   String\n  isRead    Boolean  @default(false)\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([email])\n  @@index([isRead])\n  @@map("contact_messages")\n}\n\nenum Role {\n  ADMIN\n  USER\n}\n\nenum UserStatus {\n  BLOCKED\n  DELETED\n  ACTIVE\n  PENDING\n  UNVERIFIED\n}\n\nenum MediaType {\n  MOVIE\n  SERIES\n}\n\nenum ReviewStatus {\n  PENDING\n  APPROVED\n  UNPUBLISHED\n}\n\nenum PaymentStatus {\n  PAID\n  UNPAID\n}\n\nenum MediaPurchaseType {\n  RENTAL\n  BUY\n}\n\nenum MediaPurchaseStatus {\n  ACTIVE\n  EXPIRED\n  CANCELLED\n}\n\nenum RentalStatus {\n  ACTIVE\n  EXPIRED\n  CANCELLED\n}\n\nenum PurchaseType {\n  BUY\n  RENT\n}\n\nenum Pricing {\n  FREE\n  PREMIUM\n  RENTAL\n}\n\nenum SubscriptionPlan {\n  FREE\n  MONTHLY\n  YEARLY\n}\n\nenum SubscriptionStatus {\n  ACTIVE\n  CANCELLED\n  EXPIRED\n  PAST_DUE\n}\n\nenum SubStatus {\n  ACTIVE\n  CANCELLED\n  EXPIRED\n}\n\nmodel Genre {\n  id          String   @id @default(uuid())\n  name        String   @unique\n  slug        String   @unique\n  isPublished Boolean  @default(true)\n  isFeatured  Boolean  @default(false)\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n  medias      Media[]  @relation("MediaGenres")\n\n  @@index([name])\n  @@index([isPublished])\n  @@index([isFeatured])\n  @@map("genres")\n}\n\nmodel Media {\n  id             String   @id @default(uuid())\n  title          String\n  slug           String   @unique\n  type           String\n  description    String   @db.Text\n  releaseYear    Int\n  director       String\n  posterUrl      String?\n  backdropUrl    String?\n  images         String[] @default([])\n  trailerUrl     String?\n  streamingUrl   String?\n  rentalPrice    Decimal? @db.Decimal(10, 2)\n  buyPrice       Decimal? @db.Decimal(10, 2)\n  runtimeMinutes Int?\n  seasons        Int?\n  pricing        Pricing  @default(FREE)\n  isPublished    Boolean  @default(true)\n  isFeatured     Boolean  @default(false)\n  avgRating      Float?\n  reviewCount    Int      @default(0)\n  createdAt      DateTime @default(now())\n  updatedAt      DateTime @updatedAt\n\n  genres         Genre[]     @relation("MediaGenres")\n  // platforms      MediaPlatform[]\n  reviews        Review[]\n  watchlistItems WatchList[]\n\n  viewCount Int             @default(0)\n  bookmarks Bookmark[]\n  favorites Favorite[]\n  purchases MediaPurchase[]\n  cast      CastMember[]\n  rentals   Rental[]\n  ratings   Rating[]\n  profiles  Profile[]       @relation("MediaProfiles")\n  users     User[]          @relation("MediaAddedBy")\n\n  @@unique([title, releaseYear])\n  @@index([title])\n  @@index([type])\n  @@index([releaseYear])\n  @@index([director])\n  @@index([pricing])\n  @@index([isFeatured])\n  @@index([createdAt])\n  @@index([viewCount])\n  @@map("media")\n}\n\nmodel CastMember {\n  id    String  @id @default(uuid())\n  name  String\n  role  String\n  image String?\n\n  mediaId String\n  media   Media  @relation(fields: [mediaId], references: [id], onDelete: Cascade)\n\n  @@map("cast_members")\n}\n\n// model MediaPlatform {\n//   id         String   @id @default(uuid())\n//   mediaId    String\n//   media      Media    @relation(fields: [mediaId], references: [id], onDelete: Cascade)\n//   platformId String\n//   platform   Platform @relation(fields: [platformId], references: [id], onDelete: Cascade)\n\n//   @@unique([mediaId, platformId])\n//   @@index([mediaId])\n//   @@index([platformId])\n//   @@map("media_platforms")\n// }\n\nmodel Payment {\n  id String @id @default(uuid())\n\n  subscriptionId String?\n  subscription   Subscription? @relation(fields: [subscriptionId], references: [id])\n  userId         String\n  user           User          @relation(fields: [userId], references: [id])\n\n  amount          Float\n  currency        String  @default("usd")\n  stripePaymentId String? @unique\n  status          String\n\n  mediaPurchaseId String?        @unique\n  mediaPurchase   MediaPurchase? @relation(fields: [mediaPurchaseId], references: [id])\n\n  createdAt DateTime @default(now())\n\n  rentalId String? @unique\n  rental   Rental? @relation(fields: [rentalId], references: [id])\n\n  @@index([subscriptionId])\n  @@index([userId])\n  @@index([status])\n  @@index([createdAt])\n  @@map("payments")\n}\n\nmodel MediaPurchase {\n  id              String              @id @default(uuid())\n  userId          String\n  user            User                @relation(fields: [userId], references: [id], onDelete: Cascade)\n  mediaId         String\n  media           Media               @relation(fields: [mediaId], references: [id], onDelete: Cascade)\n  type            MediaPurchaseType   @default(RENTAL)\n  status          MediaPurchaseStatus @default(ACTIVE)\n  price           Decimal             @default(0.00) @db.Decimal(10, 2)\n  expiresAt       DateTime?\n  stripePaymentId String?\n  createdAt       DateTime            @default(now())\n  updatedAt       DateTime            @updatedAt\n\n  paymentId String?\n  payments  Payment[]\n\n  @@index([userId])\n  @@index([mediaId])\n  @@index([status])\n  @@map("media_purchases")\n}\n\nmodel Rental {\n  id        String       @id @default(uuid())\n  userId    String\n  user      User         @relation(fields: [userId], references: [id])\n  mediaId   String\n  media     Media        @relation(fields: [mediaId], references: [id])\n  status    RentalStatus @default(ACTIVE)\n  price     Decimal      @db.Decimal(10, 2)\n  expiresAt DateTime\n  createdAt DateTime     @default(now())\n  updatedAt DateTime     @updatedAt\n  payment   Payment[]\n\n  @@index([userId])\n  @@index([mediaId])\n  @@index([status])\n  @@map("rentals")\n}\n\nmodel Profile {\n  id         String     @id @default(uuid())\n  userId     String     @unique\n  name       String?\n  email      String?\n  image      String?\n  bio        String?\n  avatar     String?\n  coverImage String?\n  createdAt  DateTime   @default(now())\n  updatedAt  DateTime   @updatedAt\n  bookmark   Bookmark[]\n  favorite   Favorite[]\n  user       User       @relation(fields: [userId], references: [id])\n  medias     Media[]    @relation("MediaProfiles")\n\n  @@map("profile")\n}\n\nmodel Bookmark {\n  id        String   @id @default(uuid())\n  userId    String\n  mediaId   String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  profileId String?\n  media     Media    @relation(fields: [mediaId], references: [id])\n  profile   Profile? @relation(fields: [profileId], references: [id])\n  user      User     @relation(fields: [userId], references: [id])\n\n  @@index([userId])\n  @@map("bookmark")\n}\n\nmodel Favorite {\n  id        String   @id @default(uuid())\n  userId    String\n  mediaId   String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  profileId String?\n  media     Media    @relation(fields: [mediaId], references: [id])\n  profile   Profile? @relation(fields: [profileId], references: [id])\n  user      User     @relation(fields: [userId], references: [id])\n\n  @@index([userId])\n  @@map("favorite")\n}\n\nmodel Rating {\n  id        String   @id @default(uuid())\n  score     Int\n  createdAt DateTime @default(now())\n  userId    String\n  mediaId   String\n  media     Media    @relation(fields: [mediaId], references: [id], onDelete: Cascade)\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([userId, mediaId])\n  @@map("ratings")\n}\n\nmodel Review {\n  id         String       @id @default(uuid())\n  content    String\n  rating     Int\n  status     ReviewStatus @default(UNPUBLISHED)\n  createdAt  DateTime     @default(now())\n  updatedAt  DateTime     @updatedAt\n  userId     String\n  mediaId    String\n  media      Media        @relation(fields: [mediaId], references: [id], onDelete: Cascade)\n  user       User         @relation(fields: [userId], references: [id], onDelete: Cascade)\n  tags       String[]\n  hasSpoiler Boolean      @default(false)\n\n  @@map("reviews")\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Subscription {\n  id                 String             @id @default(uuid())\n  userId             String             @unique\n  user               User               @relation(fields: [userId], references: [id], onDelete: Cascade)\n  plan               SubscriptionPlan   @default(FREE)\n  status             SubscriptionStatus @default(ACTIVE)\n  stripeCustomerId   String?            @unique\n  stripePriceId      String?\n  currentPeriodStart DateTime?\n  currentPeriodEnd   DateTime?\n  cancelAtPeriodEnd  Boolean            @default(false)\n  createdAt          DateTime           @default(now())\n  updatedAt          DateTime           @updatedAt\n\n  payments Payment[]\n\n  @@index([userId])\n  @@index([plan])\n  @@index([status])\n  @@index([currentPeriodEnd])\n  @@map("subscriptions")\n}\n\nmodel WatchList {\n  id        String   @id @default(uuid())\n  userId    String\n  mediaId   String\n  createdAt DateTime @default(now())\n  media     Media    @relation(fields: [mediaId], references: [id], onDelete: Cascade)\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([userId, mediaId])\n}\n',
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
config.runtimeDataModel = JSON.parse('{"models":{"Admin":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"contactNumber","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminToUser"}],"dbName":"admin"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"watchList","kind":"object","type":"WatchList","relationName":"UserToWatchList"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"bookmarks","kind":"object","type":"Bookmark","relationName":"BookmarkToUser"},{"name":"favorites","kind":"object","type":"Favorite","relationName":"FavoriteToUser"},{"name":"mediaAdded","kind":"object","type":"Media","relationName":"MediaAddedBy"},{"name":"profile","kind":"object","type":"Profile","relationName":"ProfileToUser"},{"name":"ratings","kind":"object","type":"Rating","relationName":"RatingToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"},{"name":"subscriptions","kind":"object","type":"Subscription","relationName":"SubscriptionToUser"},{"name":"mediaPurchases","kind":"object","type":"MediaPurchase","relationName":"MediaPurchaseToUser"},{"name":"rentals","kind":"object","type":"Rental","relationName":"RentalToUser"},{"name":"admins","kind":"object","type":"Admin","relationName":"AdminToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"ContactMessage":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"message","kind":"scalar","type":"String"},{"name":"isRead","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"contact_messages"},"Genre":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"isPublished","kind":"scalar","type":"Boolean"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"medias","kind":"object","type":"Media","relationName":"MediaGenres"}],"dbName":"genres"},"Media":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"type","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"releaseYear","kind":"scalar","type":"Int"},{"name":"director","kind":"scalar","type":"String"},{"name":"posterUrl","kind":"scalar","type":"String"},{"name":"backdropUrl","kind":"scalar","type":"String"},{"name":"images","kind":"scalar","type":"String"},{"name":"trailerUrl","kind":"scalar","type":"String"},{"name":"streamingUrl","kind":"scalar","type":"String"},{"name":"rentalPrice","kind":"scalar","type":"Decimal"},{"name":"buyPrice","kind":"scalar","type":"Decimal"},{"name":"runtimeMinutes","kind":"scalar","type":"Int"},{"name":"seasons","kind":"scalar","type":"Int"},{"name":"pricing","kind":"enum","type":"Pricing"},{"name":"isPublished","kind":"scalar","type":"Boolean"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"avgRating","kind":"scalar","type":"Float"},{"name":"reviewCount","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"genres","kind":"object","type":"Genre","relationName":"MediaGenres"},{"name":"reviews","kind":"object","type":"Review","relationName":"MediaToReview"},{"name":"watchlistItems","kind":"object","type":"WatchList","relationName":"MediaToWatchList"},{"name":"viewCount","kind":"scalar","type":"Int"},{"name":"bookmarks","kind":"object","type":"Bookmark","relationName":"BookmarkToMedia"},{"name":"favorites","kind":"object","type":"Favorite","relationName":"FavoriteToMedia"},{"name":"purchases","kind":"object","type":"MediaPurchase","relationName":"MediaToMediaPurchase"},{"name":"cast","kind":"object","type":"CastMember","relationName":"CastMemberToMedia"},{"name":"rentals","kind":"object","type":"Rental","relationName":"MediaToRental"},{"name":"ratings","kind":"object","type":"Rating","relationName":"MediaToRating"},{"name":"profiles","kind":"object","type":"Profile","relationName":"MediaProfiles"},{"name":"users","kind":"object","type":"User","relationName":"MediaAddedBy"}],"dbName":"media"},"CastMember":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"role","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"CastMemberToMedia"}],"dbName":"cast_members"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"subscriptionId","kind":"scalar","type":"String"},{"name":"subscription","kind":"object","type":"Subscription","relationName":"PaymentToSubscription"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"currency","kind":"scalar","type":"String"},{"name":"stripePaymentId","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"mediaPurchaseId","kind":"scalar","type":"String"},{"name":"mediaPurchase","kind":"object","type":"MediaPurchase","relationName":"MediaPurchaseToPayment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"rentalId","kind":"scalar","type":"String"},{"name":"rental","kind":"object","type":"Rental","relationName":"PaymentToRental"}],"dbName":"payments"},"MediaPurchase":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"MediaPurchaseToUser"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"MediaToMediaPurchase"},{"name":"type","kind":"enum","type":"MediaPurchaseType"},{"name":"status","kind":"enum","type":"MediaPurchaseStatus"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"stripePaymentId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"paymentId","kind":"scalar","type":"String"},{"name":"payments","kind":"object","type":"Payment","relationName":"MediaPurchaseToPayment"}],"dbName":"media_purchases"},"Rental":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"RentalToUser"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"MediaToRental"},{"name":"status","kind":"enum","type":"RentalStatus"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"payment","kind":"object","type":"Payment","relationName":"PaymentToRental"}],"dbName":"rentals"},"Profile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"avatar","kind":"scalar","type":"String"},{"name":"coverImage","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"bookmark","kind":"object","type":"Bookmark","relationName":"BookmarkToProfile"},{"name":"favorite","kind":"object","type":"Favorite","relationName":"FavoriteToProfile"},{"name":"user","kind":"object","type":"User","relationName":"ProfileToUser"},{"name":"medias","kind":"object","type":"Media","relationName":"MediaProfiles"}],"dbName":"profile"},"Bookmark":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"profileId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"BookmarkToMedia"},{"name":"profile","kind":"object","type":"Profile","relationName":"BookmarkToProfile"},{"name":"user","kind":"object","type":"User","relationName":"BookmarkToUser"}],"dbName":"bookmark"},"Favorite":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"profileId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"FavoriteToMedia"},{"name":"profile","kind":"object","type":"Profile","relationName":"FavoriteToProfile"},{"name":"user","kind":"object","type":"User","relationName":"FavoriteToUser"}],"dbName":"favorite"},"Rating":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"score","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"MediaToRating"},{"name":"user","kind":"object","type":"User","relationName":"RatingToUser"}],"dbName":"ratings"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"ReviewStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"MediaToReview"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"tags","kind":"scalar","type":"String"},{"name":"hasSpoiler","kind":"scalar","type":"Boolean"}],"dbName":"reviews"},"Subscription":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SubscriptionToUser"},{"name":"plan","kind":"enum","type":"SubscriptionPlan"},{"name":"status","kind":"enum","type":"SubscriptionStatus"},{"name":"stripeCustomerId","kind":"scalar","type":"String"},{"name":"stripePriceId","kind":"scalar","type":"String"},{"name":"currentPeriodStart","kind":"scalar","type":"DateTime"},{"name":"currentPeriodEnd","kind":"scalar","type":"DateTime"},{"name":"cancelAtPeriodEnd","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToSubscription"}],"dbName":"subscriptions"},"WatchList":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"media","kind":"object","type":"Media","relationName":"MediaToWatchList"},{"name":"user","kind":"object","type":"User","relationName":"UserToWatchList"}],"dbName":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","medias","_count","genres","media","user","reviews","watchlistItems","bookmark","profile","favorite","bookmarks","favorites","payments","subscription","mediaPurchase","payment","rental","purchases","cast","rentals","ratings","profiles","users","watchList","accounts","mediaAdded","sessions","subscriptions","mediaPurchases","admins","Admin.findUnique","Admin.findUniqueOrThrow","Admin.findFirst","Admin.findFirstOrThrow","Admin.findMany","data","Admin.createOne","Admin.createMany","Admin.createManyAndReturn","Admin.updateOne","Admin.updateMany","Admin.updateManyAndReturn","create","update","Admin.upsertOne","Admin.deleteOne","Admin.deleteMany","having","_min","_max","Admin.groupBy","Admin.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","ContactMessage.findUnique","ContactMessage.findUniqueOrThrow","ContactMessage.findFirst","ContactMessage.findFirstOrThrow","ContactMessage.findMany","ContactMessage.createOne","ContactMessage.createMany","ContactMessage.createManyAndReturn","ContactMessage.updateOne","ContactMessage.updateMany","ContactMessage.updateManyAndReturn","ContactMessage.upsertOne","ContactMessage.deleteOne","ContactMessage.deleteMany","ContactMessage.groupBy","ContactMessage.aggregate","Genre.findUnique","Genre.findUniqueOrThrow","Genre.findFirst","Genre.findFirstOrThrow","Genre.findMany","Genre.createOne","Genre.createMany","Genre.createManyAndReturn","Genre.updateOne","Genre.updateMany","Genre.updateManyAndReturn","Genre.upsertOne","Genre.deleteOne","Genre.deleteMany","Genre.groupBy","Genre.aggregate","Media.findUnique","Media.findUniqueOrThrow","Media.findFirst","Media.findFirstOrThrow","Media.findMany","Media.createOne","Media.createMany","Media.createManyAndReturn","Media.updateOne","Media.updateMany","Media.updateManyAndReturn","Media.upsertOne","Media.deleteOne","Media.deleteMany","_avg","_sum","Media.groupBy","Media.aggregate","CastMember.findUnique","CastMember.findUniqueOrThrow","CastMember.findFirst","CastMember.findFirstOrThrow","CastMember.findMany","CastMember.createOne","CastMember.createMany","CastMember.createManyAndReturn","CastMember.updateOne","CastMember.updateMany","CastMember.updateManyAndReturn","CastMember.upsertOne","CastMember.deleteOne","CastMember.deleteMany","CastMember.groupBy","CastMember.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","MediaPurchase.findUnique","MediaPurchase.findUniqueOrThrow","MediaPurchase.findFirst","MediaPurchase.findFirstOrThrow","MediaPurchase.findMany","MediaPurchase.createOne","MediaPurchase.createMany","MediaPurchase.createManyAndReturn","MediaPurchase.updateOne","MediaPurchase.updateMany","MediaPurchase.updateManyAndReturn","MediaPurchase.upsertOne","MediaPurchase.deleteOne","MediaPurchase.deleteMany","MediaPurchase.groupBy","MediaPurchase.aggregate","Rental.findUnique","Rental.findUniqueOrThrow","Rental.findFirst","Rental.findFirstOrThrow","Rental.findMany","Rental.createOne","Rental.createMany","Rental.createManyAndReturn","Rental.updateOne","Rental.updateMany","Rental.updateManyAndReturn","Rental.upsertOne","Rental.deleteOne","Rental.deleteMany","Rental.groupBy","Rental.aggregate","Profile.findUnique","Profile.findUniqueOrThrow","Profile.findFirst","Profile.findFirstOrThrow","Profile.findMany","Profile.createOne","Profile.createMany","Profile.createManyAndReturn","Profile.updateOne","Profile.updateMany","Profile.updateManyAndReturn","Profile.upsertOne","Profile.deleteOne","Profile.deleteMany","Profile.groupBy","Profile.aggregate","Bookmark.findUnique","Bookmark.findUniqueOrThrow","Bookmark.findFirst","Bookmark.findFirstOrThrow","Bookmark.findMany","Bookmark.createOne","Bookmark.createMany","Bookmark.createManyAndReturn","Bookmark.updateOne","Bookmark.updateMany","Bookmark.updateManyAndReturn","Bookmark.upsertOne","Bookmark.deleteOne","Bookmark.deleteMany","Bookmark.groupBy","Bookmark.aggregate","Favorite.findUnique","Favorite.findUniqueOrThrow","Favorite.findFirst","Favorite.findFirstOrThrow","Favorite.findMany","Favorite.createOne","Favorite.createMany","Favorite.createManyAndReturn","Favorite.updateOne","Favorite.updateMany","Favorite.updateManyAndReturn","Favorite.upsertOne","Favorite.deleteOne","Favorite.deleteMany","Favorite.groupBy","Favorite.aggregate","Rating.findUnique","Rating.findUniqueOrThrow","Rating.findFirst","Rating.findFirstOrThrow","Rating.findMany","Rating.createOne","Rating.createMany","Rating.createManyAndReturn","Rating.updateOne","Rating.updateMany","Rating.updateManyAndReturn","Rating.upsertOne","Rating.deleteOne","Rating.deleteMany","Rating.groupBy","Rating.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","Subscription.findUnique","Subscription.findUniqueOrThrow","Subscription.findFirst","Subscription.findFirstOrThrow","Subscription.findMany","Subscription.createOne","Subscription.createMany","Subscription.createManyAndReturn","Subscription.updateOne","Subscription.updateMany","Subscription.updateManyAndReturn","Subscription.upsertOne","Subscription.deleteOne","Subscription.deleteMany","Subscription.groupBy","Subscription.aggregate","WatchList.findUnique","WatchList.findUniqueOrThrow","WatchList.findFirst","WatchList.findFirstOrThrow","WatchList.findMany","WatchList.createOne","WatchList.createMany","WatchList.createManyAndReturn","WatchList.updateOne","WatchList.updateMany","WatchList.updateManyAndReturn","WatchList.upsertOne","WatchList.deleteOne","WatchList.deleteMany","WatchList.groupBy","WatchList.aggregate","AND","OR","NOT","id","userId","mediaId","createdAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","SubscriptionPlan","plan","SubscriptionStatus","status","stripeCustomerId","stripePriceId","currentPeriodStart","currentPeriodEnd","cancelAtPeriodEnd","updatedAt","content","rating","ReviewStatus","tags","hasSpoiler","has","hasEvery","hasSome","score","profileId","name","email","image","bio","avatar","coverImage","RentalStatus","price","expiresAt","MediaPurchaseType","type","MediaPurchaseStatus","stripePaymentId","paymentId","subscriptionId","amount","currency","mediaPurchaseId","rentalId","role","title","slug","description","releaseYear","director","posterUrl","backdropUrl","images","trailerUrl","streamingUrl","rentalPrice","buyPrice","runtimeMinutes","seasons","Pricing","pricing","isPublished","isFeatured","avgRating","reviewCount","viewCount","message","isRead","identifier","value","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","emailVerified","Role","UserStatus","needPasswordChange","isDeleted","deletedAt","profilePhoto","contactNumber","every","some","none","userId_mediaId","title_releaseYear","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide","push"]'),
  graph: "hwusAbACDgcAAIIFACDZAgAA_wQAMNoCAABpABDbAgAA_wQAMNwCAQAAAAHdAgEAAAAB3wJAAPIEACH0AkAA8gQAIf8CAQDwBAAhgAMBAAAAAbwDIADxBAAhvQNAAIEFACG-AwEAgAUAIb8DAQCABQAhAQAAAAEAIAkGAACdBQAgBwAAggUAINkCAAC6BQAw2gIAAAMAENsCAAC6BQAw3AIBAPAEACHdAgEA8AQAId4CAQDwBAAh3wJAAPIEACECBgAA5QkAIAcAANYJACAKBgAAnQUAIAcAAIIFACDZAgAAugUAMNoCAAADABDbAgAAugUAMNwCAQAAAAHdAgEA8AQAId4CAQDwBAAh3wJAAPIEACHDAwAAuQUAIAMAAAADACABAAAEADACAAAFACALAwAAkAUAINkCAAC4BQAw2gIAAAcAENsCAAC4BQAw3AIBAPAEACHfAkAA8gQAIfQCQADyBAAh_wIBAPAEACGUAwEA8AQAIaMDIADxBAAhpAMgAPEEACEBAwAA3AkAIAsDAACQBQAg2QIAALgFADDaAgAABwAQ2wIAALgFADDcAgEAAAAB3wJAAPIEACH0AkAA8gQAIf8CAQAAAAGUAwEAAAABowMgAPEEACGkAyAA8QQAIQMAAAAHACABAAAIADACAAAJACAmBQAAtAUAIAgAAJMFACAJAACMBQAgDQAAjgUAIA4AAI8FACAUAACWBQAgFQAAtQUAIBYAAJcFACAXAACSBQAgGAAAtgUAIBkAALcFACDZAgAArwUAMNoCAAALABDbAgAArwUAMNwCAQDwBAAh3wJAAPIEACH0AkAA8gQAIYkDAQDwBAAhkwMBAPAEACGUAwEA8AQAIZUDAQDwBAAhlgMCAJwFACGXAwEA8AQAIZgDAQCABQAhmQMBAIAFACGaAwAAxgQAIJsDAQCABQAhnAMBAIAFACGdAxAAsAUAIZ4DEACwBQAhnwMCALEFACGgAwIAsQUAIaIDAACyBaIDIqMDIADxBAAhpAMgAPEEACGlAwgAswUAIaYDAgCcBQAhpwMCAJwFACEUBQAA6QkAIAgAAN8JACAJAADYCQAgDQAA2gkAIA4AANsJACAUAADiCQAgFQAA6gkAIBYAAOMJACAXAADeCQAgGAAA6wkAIBkAAOwJACCYAwAAxAUAIJkDAADEBQAgmwMAAMQFACCcAwAAxAUAIJ0DAADEBQAgngMAAMQFACCfAwAAxAUAIKADAADEBQAgpQMAAMQFACAnBQAAtAUAIAgAAJMFACAJAACMBQAgDQAAjgUAIA4AAI8FACAUAACWBQAgFQAAtQUAIBYAAJcFACAXAACSBQAgGAAAtgUAIBkAALcFACDZAgAArwUAMNoCAAALABDbAgAArwUAMNwCAQAAAAHfAkAA8gQAIfQCQADyBAAhiQMBAPAEACGTAwEA8AQAIZQDAQAAAAGVAwEA8AQAIZYDAgCcBQAhlwMBAPAEACGYAwEAgAUAIZkDAQCABQAhmgMAAMYEACCbAwEAgAUAIZwDAQCABQAhnQMQALAFACGeAxAAsAUAIZ8DAgCxBQAhoAMCALEFACGiAwAAsgWiAyKjAyAA8QQAIaQDIADxBAAhpQMIALMFACGmAwIAnAUAIacDAgCcBQAhxAMAAK4FACADAAAACwAgAQAADAAwAgAADQAgAQAAAAsAIA8GAACdBQAgBwAAggUAINkCAACsBQAw2gIAABAAENsCAACsBQAw3AIBAPAEACHdAgEA8AQAId4CAQDwBAAh3wJAAPIEACHuAgAArQX4AiL0AkAA8gQAIfUCAQDwBAAh9gICAJwFACH4AgAAxgQAIPkCIADxBAAhAgYAAOUJACAHAADWCQAgDwYAAJ0FACAHAACCBQAg2QIAAKwFADDaAgAAEAAQ2wIAAKwFADDcAgEAAAAB3QIBAPAEACHeAgEA8AQAId8CQADyBAAh7gIAAK0F-AIi9AJAAPIEACH1AgEA8AQAIfYCAgCcBQAh-AIAAMYEACD5AiAA8QQAIQMAAAAQACABAAARADACAAASACADAAAAAwAgAQAABAAwAgAABQAgDAYAAJ0FACAHAACCBQAgCwAAkQUAINkCAACrBQAw2gIAABUAENsCAACrBQAw3AIBAPAEACHdAgEA8AQAId4CAQDwBAAh3wJAAPIEACH0AkAA8gQAIf4CAQCABQAhBAYAAOUJACAHAADWCQAgCwAA3QkAIP4CAADEBQAgDAYAAJ0FACAHAACCBQAgCwAAkQUAINkCAACrBQAw2gIAABUAENsCAACrBQAw3AIBAAAAAd0CAQDwBAAh3gIBAPAEACHfAkAA8gQAIfQCQADyBAAh_gIBAIAFACEDAAAAFQAgAQAAFgAwAgAAFwAgEQMAAJAFACAHAACCBQAgCgAAjgUAIAwAAI8FACDZAgAAmQUAMNoCAAAZABDbAgAAmQUAMNwCAQDwBAAh3QIBAPAEACHfAkAA8gQAIfQCQADyBAAh_wIBAIAFACGAAwEAgAUAIYEDAQCABQAhggMBAIAFACGDAwEAgAUAIYQDAQCABQAhAQAAABkAIAMAAAAVACABAAAWADACAAAXACAMBgAAnQUAIAcAAIIFACALAACRBQAg2QIAAKoFADDaAgAAHAAQ2wIAAKoFADDcAgEA8AQAId0CAQDwBAAh3gIBAPAEACHfAkAA8gQAIfQCQADyBAAh_gIBAIAFACEEBgAA5QkAIAcAANYJACALAADdCQAg_gIAAMQFACAMBgAAnQUAIAcAAIIFACALAACRBQAg2QIAAKoFADDaAgAAHAAQ2wIAAKoFADDcAgEAAAAB3QIBAPAEACHeAgEA8AQAId8CQADyBAAh9AJAAPIEACH-AgEAgAUAIQMAAAAcACABAAAdADACAAAeACABAAAAGQAgAwAAAAsAIAEAAAwAMAIAAA0AIAEAAAAVACABAAAAHAAgAQAAAAsAIAMAAAAcACABAAAdADACAAAeACARBgAAnQUAIAcAAIIFACAPAACGBQAg2QIAAKcFADDaAgAAJgAQ2wIAAKcFADDcAgEA8AQAId0CAQDwBAAh3gIBAPAEACHfAkAA8gQAIe4CAACpBYsDIvQCQADyBAAhhgMQAKAFACGHA0AAgQUAIYkDAACoBYkDIosDAQCABQAhjAMBAIAFACEGBgAA5QkAIAcAANYJACAPAADXCQAghwMAAMQFACCLAwAAxAUAIIwDAADEBQAgEQYAAJ0FACAHAACCBQAgDwAAhgUAINkCAACnBQAw2gIAACYAENsCAACnBQAw3AIBAAAAAd0CAQDwBAAh3gIBAPAEACHfAkAA8gQAIe4CAACpBYsDIvQCQADyBAAhhgMQAKAFACGHA0AAgQUAIYkDAACoBYkDIosDAQCABQAhjAMBAIAFACEDAAAAJgAgAQAAJwAwAgAAKAAgEQcAAIIFACAQAACkBQAgEQAApQUAIBMAAKYFACDZAgAAogUAMNoCAAAqABDbAgAAogUAMNwCAQDwBAAh3QIBAPAEACHfAkAA8gQAIe4CAQDwBAAhiwMBAIAFACGNAwEAgAUAIY4DCACjBQAhjwMBAPAEACGQAwEAgAUAIZEDAQCABQAhCAcAANYJACAQAADmCQAgEQAA5wkAIBMAAOgJACCLAwAAxAUAII0DAADEBQAgkAMAAMQFACCRAwAAxAUAIBEHAACCBQAgEAAApAUAIBEAAKUFACATAACmBQAg2QIAAKIFADDaAgAAKgAQ2wIAAKIFADDcAgEAAAAB3QIBAPAEACHfAkAA8gQAIe4CAQDwBAAhiwMBAAAAAY0DAQCABQAhjgMIAKMFACGPAwEA8AQAIZADAQAAAAGRAwEAAAABAwAAACoAIAEAACsAMAIAACwAIBAHAACCBQAgDwAAhgUAINkCAACDBQAw2gIAAC4AENsCAACDBQAw3AIBAPAEACHdAgEA8AQAId8CQADyBAAh7AIAAIQF7AIi7gIAAIUF7gIi7wIBAIAFACHwAgEAgAUAIfECQACBBQAh8gJAAIEFACHzAiAA8QQAIfQCQADyBAAhAQAAAC4AIAMAAAAqACABAAArADACAAAsACABAAAAKgAgAQAAACYAIA4GAACdBQAgBwAAggUAIBIAAIYFACDZAgAAngUAMNoCAAAzABDbAgAAngUAMNwCAQDwBAAh3QIBAPAEACHeAgEA8AQAId8CQADyBAAh7gIAAJ8FhgMi9AJAAPIEACGGAxAAoAUAIYcDQADyBAAhAQAAADMAIAMAAAAqACABAAArADACAAAsACABAAAAKgAgAQAAACoAIAkGAACdBQAg2QIAAKEFADDaAgAAOAAQ2wIAAKEFADDcAgEA8AQAId4CAQDwBAAh_wIBAPAEACGBAwEAgAUAIZIDAQDwBAAhAgYAAOUJACCBAwAAxAUAIAkGAACdBQAg2QIAAKEFADDaAgAAOAAQ2wIAAKEFADDcAgEAAAAB3gIBAPAEACH_AgEA8AQAIYEDAQCABQAhkgMBAPAEACEDAAAAOAAgAQAAOQAwAgAAOgAgAwYAAOUJACAHAADWCQAgEgAA1wkAIA4GAACdBQAgBwAAggUAIBIAAIYFACDZAgAAngUAMNoCAAAzABDbAgAAngUAMNwCAQAAAAHdAgEA8AQAId4CAQDwBAAh3wJAAPIEACHuAgAAnwWGAyL0AkAA8gQAIYYDEACgBQAhhwNAAPIEACEDAAAAMwAgAQAAPAAwAgAAPQAgCgYAAJ0FACAHAACCBQAg2QIAAJsFADDaAgAAPwAQ2wIAAJsFADDcAgEA8AQAId0CAQDwBAAh3gIBAPAEACHfAkAA8gQAIf0CAgCcBQAhAgYAAOUJACAHAADWCQAgCwYAAJ0FACAHAACCBQAg2QIAAJsFADDaAgAAPwAQ2wIAAJsFADDcAgEAAAAB3QIBAPAEACHeAgEA8AQAId8CQADyBAAh_QICAJwFACHDAwAAmgUAIAMAAAA_ACABAABAADACAABBACAKAwAA3AkAIAcAANYJACAKAADaCQAgDAAA2wkAIP8CAADEBQAggAMAAMQFACCBAwAAxAUAIIIDAADEBQAggwMAAMQFACCEAwAAxAUAIBEDAACQBQAgBwAAggUAIAoAAI4FACAMAACPBQAg2QIAAJkFADDaAgAAGQAQ2wIAAJkFADDcAgEAAAAB3QIBAAAAAd8CQADyBAAh9AJAAPIEACH_AgEAgAUAIYADAQCABQAhgQMBAIAFACGCAwEAgAUAIYMDAQCABQAhhAMBAIAFACEDAAAAGQAgAQAAQwAwAgAARAAgHQgAAJMFACALAACRBQAgDQAAjgUAIA4AAI8FACAPAACGBQAgFgAAlwUAIBcAAJIFACAaAACMBQAgGwAAjQUAIBwAAJAFACAdAACUBQAgHgAAlQUAIB8AAJYFACAgAACYBQAg2QIAAIkFADDaAgAARgAQ2wIAAIkFADDcAgEA8AQAId8CQADyBAAh7gIAAIsFuwMi9AJAAPIEACH_AgEA8AQAIYADAQDwBAAhgQMBAIAFACGSAwAAigW6AyK4AyAA8QQAIbsDIADxBAAhvAMgAPEEACG9A0AAgQUAIRAIAADfCQAgCwAA3QkAIA0AANoJACAOAADbCQAgDwAA1wkAIBYAAOMJACAXAADeCQAgGgAA2AkAIBsAANkJACAcAADcCQAgHQAA4AkAIB4AAOEJACAfAADiCQAgIAAA5AkAIIEDAADEBQAgvQMAAMQFACAdCAAAkwUAIAsAAJEFACANAACOBQAgDgAAjwUAIA8AAIYFACAWAACXBQAgFwAAkgUAIBoAAIwFACAbAACNBQAgHAAAkAUAIB0AAJQFACAeAACVBQAgHwAAlgUAICAAAJgFACDZAgAAiQUAMNoCAABGABDbAgAAiQUAMNwCAQAAAAHfAkAA8gQAIe4CAACLBbsDIvQCQADyBAAh_wIBAPAEACGAAwEAAAABgQMBAIAFACGSAwAAigW6AyK4AyAA8QQAIbsDIADxBAAhvAMgAPEEACG9A0AAgQUAIQMAAABGACABAABHADACAABIACABAAAABwAgAQAAABAAIAEAAAADACABAAAAFQAgAQAAABwAIAEAAAAmACABAAAAOAAgAQAAADMAIAEAAAA_ACABAAAAGQAgAQAAAEYAIBEHAACCBQAg2QIAAIgFADDaAgAAVQAQ2wIAAIgFADDcAgEA8AQAId0CAQDwBAAh3wJAAPIEACH0AkAA8gQAIawDAQDwBAAhrQMBAPAEACGuAwEAgAUAIa8DAQCABQAhsAMBAIAFACGxA0AAgQUAIbIDQACBBQAhswMBAIAFACG0AwEAgAUAIQgHAADWCQAgrgMAAMQFACCvAwAAxAUAILADAADEBQAgsQMAAMQFACCyAwAAxAUAILMDAADEBQAgtAMAAMQFACARBwAAggUAINkCAACIBQAw2gIAAFUAENsCAACIBQAw3AIBAAAAAd0CAQDwBAAh3wJAAPIEACH0AkAA8gQAIawDAQDwBAAhrQMBAPAEACGuAwEAgAUAIa8DAQCABQAhsAMBAIAFACGxA0AAgQUAIbIDQACBBQAhswMBAIAFACG0AwEAgAUAIQMAAABVACABAABWADACAABXACADAAAAFQAgAQAAFgAwAgAAFwAgAwAAABwAIAEAAB0AMAIAAB4AIAMAAAALACABAAAMADACAAANACABAAAAGQAgAwAAAD8AIAEAAEAAMAIAAEEAIAMAAAAQACABAAARADACAAASACAMBwAAggUAINkCAACHBQAw2gIAAF8AENsCAACHBQAw3AIBAPAEACHdAgEA8AQAId8CQADyBAAh9AJAAPIEACGHA0AA8gQAIbUDAQDwBAAhtgMBAIAFACG3AwEAgAUAIQMHAADWCQAgtgMAAMQFACC3AwAAxAUAIAwHAACCBQAg2QIAAIcFADDaAgAAXwAQ2wIAAIcFADDcAgEAAAAB3QIBAPAEACHfAkAA8gQAIfQCQADyBAAhhwNAAPIEACG1AwEAAAABtgMBAIAFACG3AwEAgAUAIQMAAABfACABAABgADACAABhACADAAAAKgAgAQAAKwAwAgAALAAgBgcAANYJACAPAADXCQAg7wIAAMQFACDwAgAAxAUAIPECAADEBQAg8gIAAMQFACAQBwAAggUAIA8AAIYFACDZAgAAgwUAMNoCAAAuABDbAgAAgwUAMNwCAQAAAAHdAgEAAAAB3wJAAPIEACHsAgAAhAXsAiLuAgAAhQXuAiLvAgEAAAAB8AIBAIAFACHxAkAAgQUAIfICQACBBQAh8wIgAPEEACH0AkAA8gQAIQMAAAAuACABAABkADACAABlACADAAAAJgAgAQAAJwAwAgAAKAAgAwAAADMAIAEAADwAMAIAAD0AIA4HAACCBQAg2QIAAP8EADDaAgAAaQAQ2wIAAP8EADDcAgEA8AQAId0CAQDwBAAh3wJAAPIEACH0AkAA8gQAIf8CAQDwBAAhgAMBAPAEACG8AyAA8QQAIb0DQACBBQAhvgMBAIAFACG_AwEAgAUAIQQHAADWCQAgvQMAAMQFACC-AwAAxAUAIL8DAADEBQAgAwAAAGkAIAEAAGoAMAIAAAEAIAEAAAADACABAAAAVQAgAQAAABUAIAEAAAAcACABAAAACwAgAQAAAD8AIAEAAAAQACABAAAAXwAgAQAAACoAIAEAAAAuACABAAAAJgAgAQAAADMAIAEAAABpACABAAAAAQAgAwAAAGkAIAEAAGoAMAIAAAEAIAMAAABpACABAABqADACAAABACADAAAAaQAgAQAAagAwAgAAAQAgCwcAANUJACDcAgEAAAAB3QIBAAAAAd8CQAAAAAH0AkAAAAAB_wIBAAAAAYADAQAAAAG8AyAAAAABvQNAAAAAAb4DAQAAAAG_AwEAAAABASYAAH0AIArcAgEAAAAB3QIBAAAAAd8CQAAAAAH0AkAAAAAB_wIBAAAAAYADAQAAAAG8AyAAAAABvQNAAAAAAb4DAQAAAAG_AwEAAAABASYAAH8AMAEmAAB_ADALBwAA1AkAINwCAQC-BQAh3QIBAL4FACHfAkAAvwUAIfQCQAC_BQAh_wIBAL4FACGAAwEAvgUAIbwDIADMBQAhvQNAAMsFACG-AwEAygUAIb8DAQDKBQAhAgAAAAEAICYAAIIBACAK3AIBAL4FACHdAgEAvgUAId8CQAC_BQAh9AJAAL8FACH_AgEAvgUAIYADAQC-BQAhvAMgAMwFACG9A0AAywUAIb4DAQDKBQAhvwMBAMoFACECAAAAaQAgJgAAhAEAIAIAAABpACAmAACEAQAgAwAAAAEAIC0AAH0AIC4AAIIBACABAAAAAQAgAQAAAGkAIAYEAADRCQAgMwAA0wkAIDQAANIJACC9AwAAxAUAIL4DAADEBQAgvwMAAMQFACAN2QIAAP4EADDaAgAAiwEAENsCAAD-BAAw3AIBAKsEACHdAgEAqwQAId8CQACsBAAh9AJAAKwEACH_AgEAqwQAIYADAQCrBAAhvAMgALcEACG9A0AAtgQAIb4DAQC1BAAhvwMBALUEACEDAAAAaQAgAQAAigEAMDIAAIsBACADAAAAaQAgAQAAagAwAgAAAQAgAQAAAEgAIAEAAABIACADAAAARgAgAQAARwAwAgAASAAgAwAAAEYAIAEAAEcAMAIAAEgAIAMAAABGACABAABHADACAABIACAaCAAAiQgAIAsAAIcIACANAACFCAAgDgAAhggAIA8AAIsIACAWAACOCAAgFwAAiAgAIBoAAIMIACAbAACECAAgHAAA0AkAIB0AAIoIACAeAACMCAAgHwAAjQgAICAAAI8IACDcAgEAAAAB3wJAAAAAAe4CAAAAuwMC9AJAAAAAAf8CAQAAAAGAAwEAAAABgQMBAAAAAZIDAAAAugMCuAMgAAAAAbsDIAAAAAG8AyAAAAABvQNAAAAAAQEmAACTAQAgDNwCAQAAAAHfAkAAAAAB7gIAAAC7AwL0AkAAAAAB_wIBAAAAAYADAQAAAAGBAwEAAAABkgMAAAC6AwK4AyAAAAABuwMgAAAAAbwDIAAAAAG9A0AAAAABASYAAJUBADABJgAAlQEAMBoIAAC-BgAgCwAAvAYAIA0AALoGACAOAAC7BgAgDwAAwAYAIBYAAMMGACAXAAC9BgAgGgAAuAYAIBsAALkGACAcAADHCQAgHQAAvwYAIB4AAMEGACAfAADCBgAgIAAAxAYAINwCAQC-BQAh3wJAAL8FACHuAgAAtga7AyL0AkAAvwUAIf8CAQC-BQAhgAMBAL4FACGBAwEAygUAIZIDAAC1BroDIrgDIADMBQAhuwMgAMwFACG8AyAAzAUAIb0DQADLBQAhAgAAAEgAICYAAJgBACAM3AIBAL4FACHfAkAAvwUAIe4CAAC2BrsDIvQCQAC_BQAh_wIBAL4FACGAAwEAvgUAIYEDAQDKBQAhkgMAALUGugMiuAMgAMwFACG7AyAAzAUAIbwDIADMBQAhvQNAAMsFACECAAAARgAgJgAAmgEAIAIAAABGACAmAACaAQAgAwAAAEgAIC0AAJMBACAuAACYAQAgAQAAAEgAIAEAAABGACAFBAAAxAkAIDMAAMYJACA0AADFCQAggQMAAMQFACC9AwAAxAUAIA_ZAgAA9wQAMNoCAAChAQAQ2wIAAPcEADDcAgEAqwQAId8CQACsBAAh7gIAAPkEuwMi9AJAAKwEACH_AgEAqwQAIYADAQCrBAAhgQMBALUEACGSAwAA-AS6AyK4AyAAtwQAIbsDIAC3BAAhvAMgALcEACG9A0AAtgQAIQMAAABGACABAACgAQAwMgAAoQEAIAMAAABGACABAABHADACAABIACABAAAAYQAgAQAAAGEAIAMAAABfACABAABgADACAABhACADAAAAXwAgAQAAYAAwAgAAYQAgAwAAAF8AIAEAAGAAMAIAAGEAIAkHAADDCQAg3AIBAAAAAd0CAQAAAAHfAkAAAAAB9AJAAAAAAYcDQAAAAAG1AwEAAAABtgMBAAAAAbcDAQAAAAEBJgAAqQEAIAjcAgEAAAAB3QIBAAAAAd8CQAAAAAH0AkAAAAABhwNAAAAAAbUDAQAAAAG2AwEAAAABtwMBAAAAAQEmAACrAQAwASYAAKsBADAJBwAAwgkAINwCAQC-BQAh3QIBAL4FACHfAkAAvwUAIfQCQAC_BQAhhwNAAL8FACG1AwEAvgUAIbYDAQDKBQAhtwMBAMoFACECAAAAYQAgJgAArgEAIAjcAgEAvgUAId0CAQC-BQAh3wJAAL8FACH0AkAAvwUAIYcDQAC_BQAhtQMBAL4FACG2AwEAygUAIbcDAQDKBQAhAgAAAF8AICYAALABACACAAAAXwAgJgAAsAEAIAMAAABhACAtAACpAQAgLgAArgEAIAEAAABhACABAAAAXwAgBQQAAL8JACAzAADBCQAgNAAAwAkAILYDAADEBQAgtwMAAMQFACAL2QIAAPYEADDaAgAAtwEAENsCAAD2BAAw3AIBAKsEACHdAgEAqwQAId8CQACsBAAh9AJAAKwEACGHA0AArAQAIbUDAQCrBAAhtgMBALUEACG3AwEAtQQAIQMAAABfACABAAC2AQAwMgAAtwEAIAMAAABfACABAABgADACAABhACABAAAAVwAgAQAAAFcAIAMAAABVACABAABWADACAABXACADAAAAVQAgAQAAVgAwAgAAVwAgAwAAAFUAIAEAAFYAMAIAAFcAIA4HAAC-CQAg3AIBAAAAAd0CAQAAAAHfAkAAAAAB9AJAAAAAAawDAQAAAAGtAwEAAAABrgMBAAAAAa8DAQAAAAGwAwEAAAABsQNAAAAAAbIDQAAAAAGzAwEAAAABtAMBAAAAAQEmAAC_AQAgDdwCAQAAAAHdAgEAAAAB3wJAAAAAAfQCQAAAAAGsAwEAAAABrQMBAAAAAa4DAQAAAAGvAwEAAAABsAMBAAAAAbEDQAAAAAGyA0AAAAABswMBAAAAAbQDAQAAAAEBJgAAwQEAMAEmAADBAQAwDgcAAL0JACDcAgEAvgUAId0CAQC-BQAh3wJAAL8FACH0AkAAvwUAIawDAQC-BQAhrQMBAL4FACGuAwEAygUAIa8DAQDKBQAhsAMBAMoFACGxA0AAywUAIbIDQADLBQAhswMBAMoFACG0AwEAygUAIQIAAABXACAmAADEAQAgDdwCAQC-BQAh3QIBAL4FACHfAkAAvwUAIfQCQAC_BQAhrAMBAL4FACGtAwEAvgUAIa4DAQDKBQAhrwMBAMoFACGwAwEAygUAIbEDQADLBQAhsgNAAMsFACGzAwEAygUAIbQDAQDKBQAhAgAAAFUAICYAAMYBACACAAAAVQAgJgAAxgEAIAMAAABXACAtAAC_AQAgLgAAxAEAIAEAAABXACABAAAAVQAgCgQAALoJACAzAAC8CQAgNAAAuwkAIK4DAADEBQAgrwMAAMQFACCwAwAAxAUAILEDAADEBQAgsgMAAMQFACCzAwAAxAUAILQDAADEBQAgENkCAAD1BAAw2gIAAM0BABDbAgAA9QQAMNwCAQCrBAAh3QIBAKsEACHfAkAArAQAIfQCQACsBAAhrAMBAKsEACGtAwEAqwQAIa4DAQC1BAAhrwMBALUEACGwAwEAtQQAIbEDQAC2BAAhsgNAALYEACGzAwEAtQQAIbQDAQC1BAAhAwAAAFUAIAEAAMwBADAyAADNAQAgAwAAAFUAIAEAAFYAMAIAAFcAIAnZAgAA9AQAMNoCAADTAQAQ2wIAAPQEADDcAgEAAAAB3wJAAPIEACH0AkAA8gQAIYcDQADyBAAhqgMBAPAEACGrAwEA8AQAIQEAAADQAQAgAQAAANABACAJ2QIAAPQEADDaAgAA0wEAENsCAAD0BAAw3AIBAPAEACHfAkAA8gQAIfQCQADyBAAhhwNAAPIEACGqAwEA8AQAIasDAQDwBAAhAAMAAADTAQAgAQAA1AEAMAIAANABACADAAAA0wEAIAEAANQBADACAADQAQAgAwAAANMBACABAADUAQAwAgAA0AEAIAbcAgEAAAAB3wJAAAAAAfQCQAAAAAGHA0AAAAABqgMBAAAAAasDAQAAAAEBJgAA2AEAIAbcAgEAAAAB3wJAAAAAAfQCQAAAAAGHA0AAAAABqgMBAAAAAasDAQAAAAEBJgAA2gEAMAEmAADaAQAwBtwCAQC-BQAh3wJAAL8FACH0AkAAvwUAIYcDQAC_BQAhqgMBAL4FACGrAwEAvgUAIQIAAADQAQAgJgAA3QEAIAbcAgEAvgUAId8CQAC_BQAh9AJAAL8FACGHA0AAvwUAIaoDAQC-BQAhqwMBAL4FACECAAAA0wEAICYAAN8BACACAAAA0wEAICYAAN8BACADAAAA0AEAIC0AANgBACAuAADdAQAgAQAAANABACABAAAA0wEAIAMEAAC3CQAgMwAAuQkAIDQAALgJACAJ2QIAAPMEADDaAgAA5gEAENsCAADzBAAw3AIBAKsEACHfAkAArAQAIfQCQACsBAAhhwNAAKwEACGqAwEAqwQAIasDAQCrBAAhAwAAANMBACABAADlAQAwMgAA5gEAIAMAAADTAQAgAQAA1AEAMAIAANABACAK2QIAAO8EADDaAgAA7AEAENsCAADvBAAw3AIBAAAAAd8CQADyBAAh9AJAAPIEACH_AgEA8AQAIYADAQDwBAAhqAMBAPAEACGpAyAA8QQAIQEAAADpAQAgAQAAAOkBACAK2QIAAO8EADDaAgAA7AEAENsCAADvBAAw3AIBAPAEACHfAkAA8gQAIfQCQADyBAAh_wIBAPAEACGAAwEA8AQAIagDAQDwBAAhqQMgAPEEACEAAwAAAOwBACABAADtAQAwAgAA6QEAIAMAAADsAQAgAQAA7QEAMAIAAOkBACADAAAA7AEAIAEAAO0BADACAADpAQAgB9wCAQAAAAHfAkAAAAAB9AJAAAAAAf8CAQAAAAGAAwEAAAABqAMBAAAAAakDIAAAAAEBJgAA8QEAIAfcAgEAAAAB3wJAAAAAAfQCQAAAAAH_AgEAAAABgAMBAAAAAagDAQAAAAGpAyAAAAABASYAAPMBADABJgAA8wEAMAfcAgEAvgUAId8CQAC_BQAh9AJAAL8FACH_AgEAvgUAIYADAQC-BQAhqAMBAL4FACGpAyAAzAUAIQIAAADpAQAgJgAA9gEAIAfcAgEAvgUAId8CQAC_BQAh9AJAAL8FACH_AgEAvgUAIYADAQC-BQAhqAMBAL4FACGpAyAAzAUAIQIAAADsAQAgJgAA-AEAIAIAAADsAQAgJgAA-AEAIAMAAADpAQAgLQAA8QEAIC4AAPYBACABAAAA6QEAIAEAAADsAQAgAwQAALQJACAzAAC2CQAgNAAAtQkAIArZAgAA7gQAMNoCAAD_AQAQ2wIAAO4EADDcAgEAqwQAId8CQACsBAAh9AJAAKwEACH_AgEAqwQAIYADAQCrBAAhqAMBAKsEACGpAyAAtwQAIQMAAADsAQAgAQAA_gEAMDIAAP8BACADAAAA7AEAIAEAAO0BADACAADpAQAgAQAAAAkAIAEAAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACAIAwAAswkAINwCAQAAAAHfAkAAAAAB9AJAAAAAAf8CAQAAAAGUAwEAAAABowMgAAAAAaQDIAAAAAEBJgAAhwIAIAfcAgEAAAAB3wJAAAAAAfQCQAAAAAH_AgEAAAABlAMBAAAAAaMDIAAAAAGkAyAAAAABASYAAIkCADABJgAAiQIAMAgDAACqCQAg3AIBAL4FACHfAkAAvwUAIfQCQAC_BQAh_wIBAL4FACGUAwEAvgUAIaMDIADMBQAhpAMgAMwFACECAAAACQAgJgAAjAIAIAfcAgEAvgUAId8CQAC_BQAh9AJAAL8FACH_AgEAvgUAIZQDAQC-BQAhowMgAMwFACGkAyAAzAUAIQIAAAAHACAmAACOAgAgAgAAAAcAICYAAI4CACADAAAACQAgLQAAhwIAIC4AAIwCACABAAAACQAgAQAAAAcAIAMEAACnCQAgMwAAqQkAIDQAAKgJACAK2QIAAO0EADDaAgAAlQIAENsCAADtBAAw3AIBAKsEACHfAkAArAQAIfQCQACsBAAh_wIBAKsEACGUAwEAqwQAIaMDIAC3BAAhpAMgALcEACEDAAAABwAgAQAAlAIAMDIAAJUCACADAAAABwAgAQAACAAwAgAACQAgAQAAAA0AIAEAAAANACADAAAACwAgAQAADAAwAgAADQAgAwAAAAsAIAEAAAwAMAIAAA0AIAMAAAALACABAAAMADACAAANACAjBQAA7AgAIAgAAO0IACAJAADuCAAgDQAA7wgAIA4AAPAIACAUAADxCAAgFQAA8ggAIBYAAPMIACAXAAD0CAAgGAAApgkAIBkAAPUIACDcAgEAAAAB3wJAAAAAAfQCQAAAAAGJAwEAAAABkwMBAAAAAZQDAQAAAAGVAwEAAAABlgMCAAAAAZcDAQAAAAGYAwEAAAABmQMBAAAAAZoDAADrCAAgmwMBAAAAAZwDAQAAAAGdAxAAAAABngMQAAAAAZ8DAgAAAAGgAwIAAAABogMAAACiAwKjAyAAAAABpAMgAAAAAaUDCAAAAAGmAwIAAAABpwMCAAAAAQEmAACdAgAgGNwCAQAAAAHfAkAAAAAB9AJAAAAAAYkDAQAAAAGTAwEAAAABlAMBAAAAAZUDAQAAAAGWAwIAAAABlwMBAAAAAZgDAQAAAAGZAwEAAAABmgMAAOsIACCbAwEAAAABnAMBAAAAAZ0DEAAAAAGeAxAAAAABnwMCAAAAAaADAgAAAAGiAwAAAKIDAqMDIAAAAAGkAyAAAAABpQMIAAAAAaYDAgAAAAGnAwIAAAABASYAAJ8CADABJgAAnwIAMCMFAACiBgAgCAAAowYAIAkAAKQGACANAAClBgAgDgAApgYAIBQAAKcGACAVAACoBgAgFgAAqQYAIBcAAKoGACAYAACaCQAgGQAAqwYAINwCAQC-BQAh3wJAAL8FACH0AkAAvwUAIYkDAQC-BQAhkwMBAL4FACGUAwEAvgUAIZUDAQC-BQAhlgMCAOkFACGXAwEAvgUAIZgDAQDKBQAhmQMBAMoFACGaAwAAnAYAIJsDAQDKBQAhnAMBAMoFACGdAxAAnQYAIZ4DEACdBgAhnwMCAJ4GACGgAwIAngYAIaIDAACfBqIDIqMDIADMBQAhpAMgAMwFACGlAwgAoAYAIaYDAgDpBQAhpwMCAOkFACECAAAADQAgJgAAogIAIBjcAgEAvgUAId8CQAC_BQAh9AJAAL8FACGJAwEAvgUAIZMDAQC-BQAhlAMBAL4FACGVAwEAvgUAIZYDAgDpBQAhlwMBAL4FACGYAwEAygUAIZkDAQDKBQAhmgMAAJwGACCbAwEAygUAIZwDAQDKBQAhnQMQAJ0GACGeAxAAnQYAIZ8DAgCeBgAhoAMCAJ4GACGiAwAAnwaiAyKjAyAAzAUAIaQDIADMBQAhpQMIAKAGACGmAwIA6QUAIacDAgDpBQAhAgAAAAsAICYAAKQCACACAAAACwAgJgAApAIAIAMAAAANACAtAACdAgAgLgAAogIAIAEAAAANACABAAAACwAgDgQAAJUJACAzAACYCQAgNAAAlwkAIKUBAACWCQAgpgEAAJkJACCYAwAAxAUAIJkDAADEBQAgmwMAAMQFACCcAwAAxAUAIJ0DAADEBQAgngMAAMQFACCfAwAAxAUAIKADAADEBQAgpQMAAMQFACAb2QIAAOEEADDaAgAAqwIAENsCAADhBAAw3AIBAKsEACHfAkAArAQAIfQCQACsBAAhiQMBAKsEACGTAwEAqwQAIZQDAQCrBAAhlQMBAKsEACGWAwIAxAQAIZcDAQCrBAAhmAMBALUEACGZAwEAtQQAIZoDAADGBAAgmwMBALUEACGcAwEAtQQAIZ0DEADiBAAhngMQAOIEACGfAwIA4wQAIaADAgDjBAAhogMAAOQEogMiowMgALcEACGkAyAAtwQAIaUDCADlBAAhpgMCAMQEACGnAwIAxAQAIQMAAAALACABAACqAgAwMgAAqwIAIAMAAAALACABAAAMADACAAANACABAAAAOgAgAQAAADoAIAMAAAA4ACABAAA5ADACAAA6ACADAAAAOAAgAQAAOQAwAgAAOgAgAwAAADgAIAEAADkAMAIAADoAIAYGAACUCQAg3AIBAAAAAd4CAQAAAAH_AgEAAAABgQMBAAAAAZIDAQAAAAEBJgAAswIAIAXcAgEAAAAB3gIBAAAAAf8CAQAAAAGBAwEAAAABkgMBAAAAAQEmAAC1AgAwASYAALUCADAGBgAAkwkAINwCAQC-BQAh3gIBAL4FACH_AgEAvgUAIYEDAQDKBQAhkgMBAL4FACECAAAAOgAgJgAAuAIAIAXcAgEAvgUAId4CAQC-BQAh_wIBAL4FACGBAwEAygUAIZIDAQC-BQAhAgAAADgAICYAALoCACACAAAAOAAgJgAAugIAIAMAAAA6ACAtAACzAgAgLgAAuAIAIAEAAAA6ACABAAAAOAAgBAQAAJAJACAzAACSCQAgNAAAkQkAIIEDAADEBQAgCNkCAADgBAAw2gIAAMECABDbAgAA4AQAMNwCAQCrBAAh3gIBAKsEACH_AgEAqwQAIYEDAQC1BAAhkgMBAKsEACEDAAAAOAAgAQAAwAIAMDIAAMECACADAAAAOAAgAQAAOQAwAgAAOgAgAQAAACwAIAEAAAAsACADAAAAKgAgAQAAKwAwAgAALAAgAwAAACoAIAEAACsAMAIAACwAIAMAAAAqACABAAArADACAAAsACAOBwAA3wUAIBAAAOoGACARAADgBQAgEwAA4QUAINwCAQAAAAHdAgEAAAAB3wJAAAAAAe4CAQAAAAGLAwEAAAABjQMBAAAAAY4DCAAAAAGPAwEAAAABkAMBAAAAAZEDAQAAAAEBJgAAyQIAIArcAgEAAAAB3QIBAAAAAd8CQAAAAAHuAgEAAAABiwMBAAAAAY0DAQAAAAGOAwgAAAABjwMBAAAAAZADAQAAAAGRAwEAAAABASYAAMsCADABJgAAywIAMAEAAAAuACABAAAAJgAgAQAAADMAIA4HAADbBQAgEAAA6AYAIBEAANwFACATAADdBQAg3AIBAL4FACHdAgEAvgUAId8CQAC_BQAh7gIBAL4FACGLAwEAygUAIY0DAQDKBQAhjgMIANkFACGPAwEAvgUAIZADAQDKBQAhkQMBAMoFACECAAAALAAgJgAA0QIAIArcAgEAvgUAId0CAQC-BQAh3wJAAL8FACHuAgEAvgUAIYsDAQDKBQAhjQMBAMoFACGOAwgA2QUAIY8DAQC-BQAhkAMBAMoFACGRAwEAygUAIQIAAAAqACAmAADTAgAgAgAAACoAICYAANMCACABAAAALgAgAQAAACYAIAEAAAAzACADAAAALAAgLQAAyQIAIC4AANECACABAAAALAAgAQAAACoAIAkEAACLCQAgMwAAjgkAIDQAAI0JACClAQAAjAkAIKYBAACPCQAgiwMAAMQFACCNAwAAxAUAIJADAADEBQAgkQMAAMQFACAN2QIAAN0EADDaAgAA3QIAENsCAADdBAAw3AIBAKsEACHdAgEAqwQAId8CQACsBAAh7gIBAKsEACGLAwEAtQQAIY0DAQC1BAAhjgMIAN4EACGPAwEAqwQAIZADAQC1BAAhkQMBALUEACEDAAAAKgAgAQAA3AIAMDIAAN0CACADAAAAKgAgAQAAKwAwAgAALAAgAQAAACgAIAEAAAAoACADAAAAJgAgAQAAJwAwAgAAKAAgAwAAACYAIAEAACcAMAIAACgAIAMAAAAmACABAAAnADACAAAoACAOBgAAhwcAIAcAALoIACAPAACIBwAg3AIBAAAAAd0CAQAAAAHeAgEAAAAB3wJAAAAAAe4CAAAAiwMC9AJAAAAAAYYDEAAAAAGHA0AAAAABiQMAAACJAwKLAwEAAAABjAMBAAAAAQEmAADlAgAgC9wCAQAAAAHdAgEAAAAB3gIBAAAAAd8CQAAAAAHuAgAAAIsDAvQCQAAAAAGGAxAAAAABhwNAAAAAAYkDAAAAiQMCiwMBAAAAAYwDAQAAAAEBJgAA5wIAMAEmAADnAgAwDgYAAPsGACAHAAC4CAAgDwAA_AYAINwCAQC-BQAh3QIBAL4FACHeAgEAvgUAId8CQAC_BQAh7gIAAPkGiwMi9AJAAL8FACGGAxAA3AYAIYcDQADLBQAhiQMAAPgGiQMiiwMBAMoFACGMAwEAygUAIQIAAAAoACAmAADqAgAgC9wCAQC-BQAh3QIBAL4FACHeAgEAvgUAId8CQAC_BQAh7gIAAPkGiwMi9AJAAL8FACGGAxAA3AYAIYcDQADLBQAhiQMAAPgGiQMiiwMBAMoFACGMAwEAygUAIQIAAAAmACAmAADsAgAgAgAAACYAICYAAOwCACADAAAAKAAgLQAA5QIAIC4AAOoCACABAAAAKAAgAQAAACYAIAgEAACGCQAgMwAAiQkAIDQAAIgJACClAQAAhwkAIKYBAACKCQAghwMAAMQFACCLAwAAxAUAIIwDAADEBQAgDtkCAADWBAAw2gIAAPMCABDbAgAA1gQAMNwCAQCrBAAh3QIBAKsEACHeAgEAqwQAId8CQACsBAAh7gIAANgEiwMi9AJAAKwEACGGAxAA0QQAIYcDQAC2BAAhiQMAANcEiQMiiwMBALUEACGMAwEAtQQAIQMAAAAmACABAADyAgAwMgAA8wIAIAMAAAAmACABAAAnADACAAAoACABAAAAPQAgAQAAAD0AIAMAAAAzACABAAA8ADACAAA9ACADAAAAMwAgAQAAPAAwAgAAPQAgAwAAADMAIAEAADwAMAIAAD0AIAsGAADsBgAgBwAAowgAIBIAAO0GACDcAgEAAAAB3QIBAAAAAd4CAQAAAAHfAkAAAAAB7gIAAACGAwL0AkAAAAABhgMQAAAAAYcDQAAAAAEBJgAA-wIAIAjcAgEAAAAB3QIBAAAAAd4CAQAAAAHfAkAAAAAB7gIAAACGAwL0AkAAAAABhgMQAAAAAYcDQAAAAAEBJgAA_QIAMAEmAAD9AgAwCwYAAN4GACAHAAChCAAgEgAA3wYAINwCAQC-BQAh3QIBAL4FACHeAgEAvgUAId8CQAC_BQAh7gIAANsGhgMi9AJAAL8FACGGAxAA3AYAIYcDQAC_BQAhAgAAAD0AICYAAIADACAI3AIBAL4FACHdAgEAvgUAId4CAQC-BQAh3wJAAL8FACHuAgAA2waGAyL0AkAAvwUAIYYDEADcBgAhhwNAAL8FACECAAAAMwAgJgAAggMAIAIAAAAzACAmAACCAwAgAwAAAD0AIC0AAPsCACAuAACAAwAgAQAAAD0AIAEAAAAzACAFBAAAgQkAIDMAAIQJACA0AACDCQAgpQEAAIIJACCmAQAAhQkAIAvZAgAAzwQAMNoCAACJAwAQ2wIAAM8EADDcAgEAqwQAId0CAQCrBAAh3gIBAKsEACHfAkAArAQAIe4CAADQBIYDIvQCQACsBAAhhgMQANEEACGHA0AArAQAIQMAAAAzACABAACIAwAwMgAAiQMAIAMAAAAzACABAAA8ADACAAA9ACABAAAARAAgAQAAAEQAIAMAAAAZACABAABDADACAABEACADAAAAGQAgAQAAQwAwAgAARAAgAwAAABkAIAEAAEMAMAIAAEQAIA4DAADJBwAgBwAAgAkAIAoAAMcHACAMAADIBwAg3AIBAAAAAd0CAQAAAAHfAkAAAAAB9AJAAAAAAf8CAQAAAAGAAwEAAAABgQMBAAAAAYIDAQAAAAGDAwEAAAABhAMBAAAAAQEmAACRAwAgCtwCAQAAAAHdAgEAAAAB3wJAAAAAAfQCQAAAAAH_AgEAAAABgAMBAAAAAYEDAQAAAAGCAwEAAAABgwMBAAAAAYQDAQAAAAEBJgAAkwMAMAEmAACTAwAwDgMAAJIGACAHAACRBgAgCgAAjwYAIAwAAJAGACDcAgEAvgUAId0CAQC-BQAh3wJAAL8FACH0AkAAvwUAIf8CAQDKBQAhgAMBAMoFACGBAwEAygUAIYIDAQDKBQAhgwMBAMoFACGEAwEAygUAIQIAAABEACAmAACWAwAgCtwCAQC-BQAh3QIBAL4FACHfAkAAvwUAIfQCQAC_BQAh_wIBAMoFACGAAwEAygUAIYEDAQDKBQAhggMBAMoFACGDAwEAygUAIYQDAQDKBQAhAgAAABkAICYAAJgDACACAAAAGQAgJgAAmAMAIAMAAABEACAtAACRAwAgLgAAlgMAIAEAAABEACABAAAAGQAgCQQAAIwGACAzAACOBgAgNAAAjQYAIP8CAADEBQAggAMAAMQFACCBAwAAxAUAIIIDAADEBQAggwMAAMQFACCEAwAAxAUAIA3ZAgAAzgQAMNoCAACfAwAQ2wIAAM4EADDcAgEAqwQAId0CAQCrBAAh3wJAAKwEACH0AkAArAQAIf8CAQC1BAAhgAMBALUEACGBAwEAtQQAIYIDAQC1BAAhgwMBALUEACGEAwEAtQQAIQMAAAAZACABAACeAwAwMgAAnwMAIAMAAAAZACABAABDADACAABEACABAAAAFwAgAQAAABcAIAMAAAAVACABAAAWADACAAAXACADAAAAFQAgAQAAFgAwAgAAFwAgAwAAABUAIAEAABYAMAIAABcAIAkGAACJBgAgBwAAiwYAIAsAAIoGACDcAgEAAAAB3QIBAAAAAd4CAQAAAAHfAkAAAAAB9AJAAAAAAf4CAQAAAAEBJgAApwMAIAbcAgEAAAAB3QIBAAAAAd4CAQAAAAHfAkAAAAAB9AJAAAAAAf4CAQAAAAEBJgAAqQMAMAEmAACpAwAwAQAAABkAIAkGAACGBgAgBwAAiAYAIAsAAIcGACDcAgEAvgUAId0CAQC-BQAh3gIBAL4FACHfAkAAvwUAIfQCQAC_BQAh_gIBAMoFACECAAAAFwAgJgAArQMAIAbcAgEAvgUAId0CAQC-BQAh3gIBAL4FACHfAkAAvwUAIfQCQAC_BQAh_gIBAMoFACECAAAAFQAgJgAArwMAIAIAAAAVACAmAACvAwAgAQAAABkAIAMAAAAXACAtAACnAwAgLgAArQMAIAEAAAAXACABAAAAFQAgBAQAAIMGACAzAACFBgAgNAAAhAYAIP4CAADEBQAgCdkCAADNBAAw2gIAALcDABDbAgAAzQQAMNwCAQCrBAAh3QIBAKsEACHeAgEAqwQAId8CQACsBAAh9AJAAKwEACH-AgEAtQQAIQMAAAAVACABAAC2AwAwMgAAtwMAIAMAAAAVACABAAAWADACAAAXACABAAAAHgAgAQAAAB4AIAMAAAAcACABAAAdADACAAAeACADAAAAHAAgAQAAHQAwAgAAHgAgAwAAABwAIAEAAB0AMAIAAB4AIAkGAACABgAgBwAAggYAIAsAAIEGACDcAgEAAAAB3QIBAAAAAd4CAQAAAAHfAkAAAAAB9AJAAAAAAf4CAQAAAAEBJgAAvwMAIAbcAgEAAAAB3QIBAAAAAd4CAQAAAAHfAkAAAAAB9AJAAAAAAf4CAQAAAAEBJgAAwQMAMAEmAADBAwAwAQAAABkAIAkGAAD9BQAgBwAA_wUAIAsAAP4FACDcAgEAvgUAId0CAQC-BQAh3gIBAL4FACHfAkAAvwUAIfQCQAC_BQAh_gIBAMoFACECAAAAHgAgJgAAxQMAIAbcAgEAvgUAId0CAQC-BQAh3gIBAL4FACHfAkAAvwUAIfQCQAC_BQAh_gIBAMoFACECAAAAHAAgJgAAxwMAIAIAAAAcACAmAADHAwAgAQAAABkAIAMAAAAeACAtAAC_AwAgLgAAxQMAIAEAAAAeACABAAAAHAAgBAQAAPoFACAzAAD8BQAgNAAA-wUAIP4CAADEBQAgCdkCAADMBAAw2gIAAM8DABDbAgAAzAQAMNwCAQCrBAAh3QIBAKsEACHeAgEAqwQAId8CQACsBAAh9AJAAKwEACH-AgEAtQQAIQMAAAAcACABAADOAwAwMgAAzwMAIAMAAAAcACABAAAdADACAAAeACABAAAAQQAgAQAAAEEAIAMAAAA_ACABAABAADACAABBACADAAAAPwAgAQAAQAAwAgAAQQAgAwAAAD8AIAEAAEAAMAIAAEEAIAcGAAD4BQAgBwAA-QUAINwCAQAAAAHdAgEAAAAB3gIBAAAAAd8CQAAAAAH9AgIAAAABASYAANcDACAF3AIBAAAAAd0CAQAAAAHeAgEAAAAB3wJAAAAAAf0CAgAAAAEBJgAA2QMAMAEmAADZAwAwBwYAAPYFACAHAAD3BQAg3AIBAL4FACHdAgEAvgUAId4CAQC-BQAh3wJAAL8FACH9AgIA6QUAIQIAAABBACAmAADcAwAgBdwCAQC-BQAh3QIBAL4FACHeAgEAvgUAId8CQAC_BQAh_QICAOkFACECAAAAPwAgJgAA3gMAIAIAAAA_ACAmAADeAwAgAwAAAEEAIC0AANcDACAuAADcAwAgAQAAAEEAIAEAAAA_ACAFBAAA8QUAIDMAAPQFACA0AADzBQAgpQEAAPIFACCmAQAA9QUAIAjZAgAAywQAMNoCAADlAwAQ2wIAAMsEADDcAgEAqwQAId0CAQCrBAAh3gIBAKsEACHfAkAArAQAIf0CAgDEBAAhAwAAAD8AIAEAAOQDADAyAADlAwAgAwAAAD8AIAEAAEAAMAIAAEEAIAEAAAASACABAAAAEgAgAwAAABAAIAEAABEAMAIAABIAIAMAAAAQACABAAARADACAAASACADAAAAEAAgAQAAEQAwAgAAEgAgDAYAAO8FACAHAADwBQAg3AIBAAAAAd0CAQAAAAHeAgEAAAAB3wJAAAAAAe4CAAAA-AIC9AJAAAAAAfUCAQAAAAH2AgIAAAAB-AIAAO4FACD5AiAAAAABASYAAO0DACAK3AIBAAAAAd0CAQAAAAHeAgEAAAAB3wJAAAAAAe4CAAAA-AIC9AJAAAAAAfUCAQAAAAH2AgIAAAAB-AIAAO4FACD5AiAAAAABASYAAO8DADABJgAA7wMAMAwGAADsBQAgBwAA7QUAINwCAQC-BQAh3QIBAL4FACHeAgEAvgUAId8CQAC_BQAh7gIAAOoF-AIi9AJAAL8FACH1AgEAvgUAIfYCAgDpBQAh-AIAAOsFACD5AiAAzAUAIQIAAAASACAmAADyAwAgCtwCAQC-BQAh3QIBAL4FACHeAgEAvgUAId8CQAC_BQAh7gIAAOoF-AIi9AJAAL8FACH1AgEAvgUAIfYCAgDpBQAh-AIAAOsFACD5AiAAzAUAIQIAAAAQACAmAAD0AwAgAgAAABAAICYAAPQDACADAAAAEgAgLQAA7QMAIC4AAPIDACABAAAAEgAgAQAAABAAIAUEAADkBQAgMwAA5wUAIDQAAOYFACClAQAA5QUAIKYBAADoBQAgDdkCAADDBAAw2gIAAPsDABDbAgAAwwQAMNwCAQCrBAAh3QIBAKsEACHeAgEAqwQAId8CQACsBAAh7gIAAMUE-AIi9AJAAKwEACH1AgEAqwQAIfYCAgDEBAAh-AIAAMYEACD5AiAAtwQAIQMAAAAQACABAAD6AwAwMgAA-wMAIAMAAAAQACABAAARADACAAASACABAAAAZQAgAQAAAGUAIAMAAAAuACABAABkADACAABlACADAAAALgAgAQAAZAAwAgAAZQAgAwAAAC4AIAEAAGQAMAIAAGUAIA0HAADiBQAgDwAA4wUAINwCAQAAAAHdAgEAAAAB3wJAAAAAAewCAAAA7AIC7gIAAADuAgLvAgEAAAAB8AIBAAAAAfECQAAAAAHyAkAAAAAB8wIgAAAAAfQCQAAAAAEBJgAAgwQAIAvcAgEAAAAB3QIBAAAAAd8CQAAAAAHsAgAAAOwCAu4CAAAA7gIC7wIBAAAAAfACAQAAAAHxAkAAAAAB8gJAAAAAAfMCIAAAAAH0AkAAAAABASYAAIUEADABJgAAhQQAMA0HAADNBQAgDwAAzgUAINwCAQC-BQAh3QIBAL4FACHfAkAAvwUAIewCAADIBewCIu4CAADJBe4CIu8CAQDKBQAh8AIBAMoFACHxAkAAywUAIfICQADLBQAh8wIgAMwFACH0AkAAvwUAIQIAAABlACAmAACIBAAgC9wCAQC-BQAh3QIBAL4FACHfAkAAvwUAIewCAADIBewCIu4CAADJBe4CIu8CAQDKBQAh8AIBAMoFACHxAkAAywUAIfICQADLBQAh8wIgAMwFACH0AkAAvwUAIQIAAAAuACAmAACKBAAgAgAAAC4AICYAAIoEACADAAAAZQAgLQAAgwQAIC4AAIgEACABAAAAZQAgAQAAAC4AIAcEAADFBQAgMwAAxwUAIDQAAMYFACDvAgAAxAUAIPACAADEBQAg8QIAAMQFACDyAgAAxAUAIA7ZAgAAsgQAMNoCAACRBAAQ2wIAALIEADDcAgEAqwQAId0CAQCrBAAh3wJAAKwEACHsAgAAswTsAiLuAgAAtATuAiLvAgEAtQQAIfACAQC1BAAh8QJAALYEACHyAkAAtgQAIfMCIAC3BAAh9AJAAKwEACEDAAAALgAgAQAAkAQAMDIAAJEEACADAAAALgAgAQAAZAAwAgAAZQAgAQAAAAUAIAEAAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAGBgAAwgUAIAcAAMMFACDcAgEAAAAB3QIBAAAAAd4CAQAAAAHfAkAAAAABASYAAJkEACAE3AIBAAAAAd0CAQAAAAHeAgEAAAAB3wJAAAAAAQEmAACbBAAwASYAAJsEADAGBgAAwAUAIAcAAMEFACDcAgEAvgUAId0CAQC-BQAh3gIBAL4FACHfAkAAvwUAIQIAAAAFACAmAACeBAAgBNwCAQC-BQAh3QIBAL4FACHeAgEAvgUAId8CQAC_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-AII5wIAAMcE-AIiBOACAQAAAAX6AgEAAAAB-wIBAAAABPwCAQAAAAQHBAAArgQAIDMAAMgEACA0AADIBAAg4AIAAAD4AgLhAgAAAPgCCOICAAAA-AII5wIAAMcE-AIiBOACAAAA-AIC4QIAAAD4AgjiAgAAAPgCCOcCAADIBPgCIg0EAACuBAAgMwAArgQAIDQAAK4EACClAQAAygQAIKYBAACuBAAg4AICAAAAAeECAgAAAATiAgIAAAAE4wICAAAAAeQCAgAAAAHlAgIAAAAB5gICAAAAAecCAgDJBAAhCOACCAAAAAHhAggAAAAE4gIIAAAABOMCCAAAAAHkAggAAAAB5QIIAAAAAeYCCAAAAAHnAggAygQAIQjZAgAAywQAMNoCAADlAwAQ2wIAAMsEADDcAgEAqwQAId0CAQCrBAAh3gIBAKsEACHfAkAArAQAIf0CAgDEBAAhCdkCAADMBAAw2gIAAM8DABDbAgAAzAQAMNwCAQCrBAAh3QIBAKsEACHeAgEAqwQAId8CQACsBAAh9AJAAKwEACH-AgEAtQQAIQnZAgAAzQQAMNoCAAC3AwAQ2wIAAM0EADDcAgEAqwQAId0CAQCrBAAh3gIBAKsEACHfAkAArAQAIfQCQACsBAAh_gIBALUEACEN2QIAAM4EADDaAgAAnwMAENsCAADOBAAw3AIBAKsEACHdAgEAqwQAId8CQACsBAAh9AJAAKwEACH_AgEAtQQAIYADAQC1BAAhgQMBALUEACGCAwEAtQQAIYMDAQC1BAAhhAMBALUEACEL2QIAAM8EADDaAgAAiQMAENsCAADPBAAw3AIBAKsEACHdAgEAqwQAId4CAQCrBAAh3wJAAKwEACHuAgAA0ASGAyL0AkAArAQAIYYDEADRBAAhhwNAAKwEACEHBAAArgQAIDMAANUEACA0AADVBAAg4AIAAACGAwLhAgAAAIYDCOICAAAAhgMI5wIAANQEhgMiDQQAAK4EACAzAADTBAAgNAAA0wQAIKUBAADTBAAgpgEAANMEACDgAhAAAAAB4QIQAAAABOICEAAAAATjAhAAAAAB5AIQAAAAAeUCEAAAAAHmAhAAAAAB5wIQANIEACENBAAArgQAIDMAANMEACA0AADTBAAgpQEAANMEACCmAQAA0wQAIOACEAAAAAHhAhAAAAAE4gIQAAAABOMCEAAAAAHkAhAAAAAB5QIQAAAAAeYCEAAAAAHnAhAA0gQAIQjgAhAAAAAB4QIQAAAABOICEAAAAATjAhAAAAAB5AIQAAAAAeUCEAAAAAHmAhAAAAAB5wIQANMEACEHBAAArgQAIDMAANUEACA0AADVBAAg4AIAAACGAwLhAgAAAIYDCOICAAAAhgMI5wIAANQEhgMiBOACAAAAhgMC4QIAAACGAwjiAgAAAIYDCOcCAADVBIYDIg7ZAgAA1gQAMNoCAADzAgAQ2wIAANYEADDcAgEAqwQAId0CAQCrBAAh3gIBAKsEACHfAkAArAQAIe4CAADYBIsDIvQCQACsBAAhhgMQANEEACGHA0AAtgQAIYkDAADXBIkDIosDAQC1BAAhjAMBALUEACEHBAAArgQAIDMAANwEACA0AADcBAAg4AIAAACJAwLhAgAAAIkDCOICAAAAiQMI5wIAANsEiQMiBwQAAK4EACAzAADaBAAgNAAA2gQAIOACAAAAiwMC4QIAAACLAwjiAgAAAIsDCOcCAADZBIsDIgcEAACuBAAgMwAA2gQAIDQAANoEACDgAgAAAIsDAuECAAAAiwMI4gIAAACLAwjnAgAA2QSLAyIE4AIAAACLAwLhAgAAAIsDCOICAAAAiwMI5wIAANoEiwMiBwQAAK4EACAzAADcBAAgNAAA3AQAIOACAAAAiQMC4QIAAACJAwjiAgAAAIkDCOcCAADbBIkDIgTgAgAAAIkDAuECAAAAiQMI4gIAAACJAwjnAgAA3ASJAyIN2QIAAN0EADDaAgAA3QIAENsCAADdBAAw3AIBAKsEACHdAgEAqwQAId8CQACsBAAh7gIBAKsEACGLAwEAtQQAIY0DAQC1BAAhjgMIAN4EACGPAwEAqwQAIZADAQC1BAAhkQMBALUEACENBAAArgQAIDMAAMoEACA0AADKBAAgpQEAAMoEACCmAQAAygQAIOACCAAAAAHhAggAAAAE4gIIAAAABOMCCAAAAAHkAggAAAAB5QIIAAAAAeYCCAAAAAHnAggA3wQAIQ0EAACuBAAgMwAAygQAIDQAAMoEACClAQAAygQAIKYBAADKBAAg4AIIAAAAAeECCAAAAATiAggAAAAE4wIIAAAAAeQCCAAAAAHlAggAAAAB5gIIAAAAAecCCADfBAAhCNkCAADgBAAw2gIAAMECABDbAgAA4AQAMNwCAQCrBAAh3gIBAKsEACH_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_ZAgAA9wQAMNoCAAChAQAQ2wIAAPcEADDcAgEAqwQAId8CQACsBAAh7gIAAPkEuwMi9AJAAKwEACH_AgEAqwQAIYADAQCrBAAhgQMBALUEACGSAwAA-AS6AyK4AyAAtwQAIbsDIAC3BAAhvAMgALcEACG9A0AAtgQAIQcEAACuBAAgMwAA_QQAIDQAAP0EACDgAgAAALoDAuECAAAAugMI4gIAAAC6AwjnAgAA_AS6AyIHBAAArgQAIDMAAPsEACA0AAD7BAAg4AIAAAC7AwLhAgAAALsDCOICAAAAuwMI5wIAAPoEuwMiBwQAAK4EACAzAAD7BAAgNAAA-wQAIOACAAAAuwMC4QIAAAC7AwjiAgAAALsDCOcCAAD6BLsDIgTgAgAAALsDAuECAAAAuwMI4gIAAAC7AwjnAgAA-wS7AyIHBAAArgQAIDMAAP0EACA0AAD9BAAg4AIAAAC6AwLhAgAAALoDCOICAAAAugMI5wIAAPwEugMiBOACAAAAugMC4QIAAAC6AwjiAgAAALoDCOcCAAD9BLoDIg3ZAgAA_gQAMNoCAACLAQAQ2wIAAP4EADDcAgEAqwQAId0CAQCrBAAh3wJAAKwEACH0AkAArAQAIf8CAQCrBAAhgAMBAKsEACG8AyAAtwQAIb0DQAC2BAAhvgMBALUEACG_AwEAtQQAIQ4HAACCBQAg2QIAAP8EADDaAgAAaQAQ2wIAAP8EADDcAgEA8AQAId0CAQDwBAAh3wJAAPIEACH0AkAA8gQAIf8CAQDwBAAhgAMBAPAEACG8AyAA8QQAIb0DQACBBQAhvgMBAIAFACG_AwEAgAUAIQvgAgEAAAAB4QIBAAAABeICAQAAAAXjAgEAAAAB5AIBAAAAAeUCAQAAAAHmAgEAAAAB5wIBAL4EACHoAgEAAAAB6QIBAAAAAeoCAQAAAAEI4AJAAAAAAeECQAAAAAXiAkAAAAAF4wJAAAAAAeQCQAAAAAHlAkAAAAAB5gJAAAAAAecCQAC8BAAhHwgAAJMFACALAACRBQAgDQAAjgUAIA4AAI8FACAPAACGBQAgFgAAlwUAIBcAAJIFACAaAACMBQAgGwAAjQUAIBwAAJAFACAdAACUBQAgHgAAlQUAIB8AAJYFACAgAACYBQAg2QIAAIkFADDaAgAARgAQ2wIAAIkFADDcAgEA8AQAId8CQADyBAAh7gIAAIsFuwMi9AJAAPIEACH_AgEA8AQAIYADAQDwBAAhgQMBAIAFACGSAwAAigW6AyK4AyAA8QQAIbsDIADxBAAhvAMgAPEEACG9A0AAgQUAIcUDAABGACDGAwAARgAgEAcAAIIFACAPAACGBQAg2QIAAIMFADDaAgAALgAQ2wIAAIMFADDcAgEA8AQAId0CAQDwBAAh3wJAAPIEACHsAgAAhAXsAiLuAgAAhQXuAiLvAgEAgAUAIfACAQCABQAh8QJAAIEFACHyAkAAgQUAIfMCIADxBAAh9AJAAPIEACEE4AIAAADsAgLhAgAAAOwCCOICAAAA7AII5wIAAMIE7AIiBOACAAAA7gIC4QIAAADuAgjiAgAAAO4CCOcCAADABO4CIgPAAwAAKgAgwQMAACoAIMIDAAAqACAMBwAAggUAINkCAACHBQAw2gIAAF8AENsCAACHBQAw3AIBAPAEACHdAgEA8AQAId8CQADyBAAh9AJAAPIEACGHA0AA8gQAIbUDAQDwBAAhtgMBAIAFACG3AwEAgAUAIREHAACCBQAg2QIAAIgFADDaAgAAVQAQ2wIAAIgFADDcAgEA8AQAId0CAQDwBAAh3wJAAPIEACH0AkAA8gQAIawDAQDwBAAhrQMBAPAEACGuAwEAgAUAIa8DAQCABQAhsAMBAIAFACGxA0AAgQUAIbIDQACBBQAhswMBAIAFACG0AwEAgAUAIR0IAACTBQAgCwAAkQUAIA0AAI4FACAOAACPBQAgDwAAhgUAIBYAAJcFACAXAACSBQAgGgAAjAUAIBsAAI0FACAcAACQBQAgHQAAlAUAIB4AAJUFACAfAACWBQAgIAAAmAUAINkCAACJBQAw2gIAAEYAENsCAACJBQAw3AIBAPAEACHfAkAA8gQAIe4CAACLBbsDIvQCQADyBAAh_wIBAPAEACGAAwEA8AQAIYEDAQCABQAhkgMAAIoFugMiuAMgAPEEACG7AyAA8QQAIbwDIADxBAAhvQNAAIEFACEE4AIAAAC6AwLhAgAAALoDCOICAAAAugMI5wIAAP0EugMiBOACAAAAuwMC4QIAAAC7AwjiAgAAALsDCOcCAAD7BLsDIgPAAwAAAwAgwQMAAAMAIMIDAAADACADwAMAAFUAIMEDAABVACDCAwAAVQAgA8ADAAAVACDBAwAAFQAgwgMAABUAIAPAAwAAHAAgwQMAABwAIMIDAAAcACADwAMAAAsAIMEDAAALACDCAwAACwAgEwMAAJAFACAHAACCBQAgCgAAjgUAIAwAAI8FACDZAgAAmQUAMNoCAAAZABDbAgAAmQUAMNwCAQDwBAAh3QIBAPAEACHfAkAA8gQAIfQCQADyBAAh_wIBAIAFACGAAwEAgAUAIYEDAQCABQAhggMBAIAFACGDAwEAgAUAIYQDAQCABQAhxQMAABkAIMYDAAAZACADwAMAAD8AIMEDAAA_ACDCAwAAPwAgA8ADAAAQACDBAwAAEAAgwgMAABAAIAPAAwAAXwAgwQMAAF8AIMIDAABfACADwAMAAC4AIMEDAAAuACDCAwAALgAgA8ADAAAmACDBAwAAJgAgwgMAACYAIAPAAwAAMwAgwQMAADMAIMIDAAAzACADwAMAAGkAIMEDAABpACDCAwAAaQAgEQMAAJAFACAHAACCBQAgCgAAjgUAIAwAAI8FACDZAgAAmQUAMNoCAAAZABDbAgAAmQUAMNwCAQDwBAAh3QIBAPAEACHfAkAA8gQAIfQCQADyBAAh_wIBAIAFACGAAwEAgAUAIYEDAQCABQAhggMBAIAFACGDAwEAgAUAIYQDAQCABQAhAt0CAQAAAAHeAgEAAAABCgYAAJ0FACAHAACCBQAg2QIAAJsFADDaAgAAPwAQ2wIAAJsFADDcAgEA8AQAId0CAQDwBAAh3gIBAPAEACHfAkAA8gQAIf0CAgCcBQAhCOACAgAAAAHhAgIAAAAE4gICAAAABOMCAgAAAAHkAgIAAAAB5QICAAAAAeYCAgAAAAHnAgIArgQAISgFAAC0BQAgCAAAkwUAIAkAAIwFACANAACOBQAgDgAAjwUAIBQAAJYFACAVAAC1BQAgFgAAlwUAIBcAAJIFACAYAAC2BQAgGQAAtwUAINkCAACvBQAw2gIAAAsAENsCAACvBQAw3AIBAPAEACHfAkAA8gQAIfQCQADyBAAhiQMBAPAEACGTAwEA8AQAIZQDAQDwBAAhlQMBAPAEACGWAwIAnAUAIZcDAQDwBAAhmAMBAIAFACGZAwEAgAUAIZoDAADGBAAgmwMBAIAFACGcAwEAgAUAIZ0DEACwBQAhngMQALAFACGfAwIAsQUAIaADAgCxBQAhogMAALIFogMiowMgAPEEACGkAyAA8QQAIaUDCACzBQAhpgMCAJwFACGnAwIAnAUAIcUDAAALACDGAwAACwAgDgYAAJ0FACAHAACCBQAgEgAAhgUAINkCAACeBQAw2gIAADMAENsCAACeBQAw3AIBAPAEACHdAgEA8AQAId4CAQDwBAAh3wJAAPIEACHuAgAAnwWGAyL0AkAA8gQAIYYDEACgBQAhhwNAAPIEACEE4AIAAACGAwLhAgAAAIYDCOICAAAAhgMI5wIAANUEhgMiCOACEAAAAAHhAhAAAAAE4gIQAAAABOMCEAAAAAHkAhAAAAAB5QIQAAAAAeYCEAAAAAHnAhAA0wQAIQkGAACdBQAg2QIAAKEFADDaAgAAOAAQ2wIAAKEFADDcAgEA8AQAId4CAQDwBAAh_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-CgAgLgAAgwsAIMcDAAD_CgAgyAMAAIILACDNAwAASAAgAy0AAIALACDHAwAAgQsAIM0DAAANACADLQAA_goAIMcDAAD_CgAgzQMAAEgAIAAAAAABygMAAADsAgIBygMAAADuAgIBygMBAAAAAQHKA0AAAAABAcoDIAAAAAEFLQAA6QoAIC4AAPwKACDHAwAA6goAIMgDAAD7CgAgzQMAAEgAIAstAADPBQAwLgAA1AUAMMcDAADQBQAwyAMAANEFADDJAwAA0gUAIMoDAADTBQAwywMAANMFADDMAwAA0wUAMM0DAADTBQAwzgMAANUFADDPAwAA1gUAMAwHAADfBQAgEQAA4AUAIBMAAOEFACDcAgEAAAAB3QIBAAAAAd8CQAAAAAHuAgEAAAABiwMBAAAAAY4DCAAAAAGPAwEAAAABkAMBAAAAAZEDAQAAAAECAAAALAAgLQAA3gUAIAMAAAAsACAtAADeBQAgLgAA2gUAIAEmAAD6CgAwEQcAAIIFACAQAACkBQAgEQAApQUAIBMAAKYFACDZAgAAogUAMNoCAAAqABDbAgAAogUAMNwCAQAAAAHdAgEA8AQAId8CQADyBAAh7gIBAPAEACGLAwEAAAABjQMBAIAFACGOAwgAowUAIY8DAQDwBAAhkAMBAAAAAZEDAQAAAAECAAAALAAgJgAA2gUAIAIAAADXBQAgJgAA2AUAIA3ZAgAA1gUAMNoCAADXBQAQ2wIAANYFADDcAgEA8AQAId0CAQDwBAAh3wJAAPIEACHuAgEA8AQAIYsDAQCABQAhjQMBAIAFACGOAwgAowUAIY8DAQDwBAAhkAMBAIAFACGRAwEAgAUAIQ3ZAgAA1gUAMNoCAADXBQAQ2wIAANYFADDcAgEA8AQAId0CAQDwBAAh3wJAAPIEACHuAgEA8AQAIYsDAQCABQAhjQMBAIAFACGOAwgAowUAIY8DAQDwBAAhkAMBAIAFACGRAwEAgAUAIQncAgEAvgUAId0CAQC-BQAh3wJAAL8FACHuAgEAvgUAIYsDAQDKBQAhjgMIANkFACGPAwEAvgUAIZADAQDKBQAhkQMBAMoFACEFygMIAAAAAdADCAAAAAHRAwgAAAAB0gMIAAAAAdMDCAAAAAEMBwAA2wUAIBEAANwFACATAADdBQAg3AIBAL4FACHdAgEAvgUAId8CQAC_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_BQAhiQMBAL4FACGTAwEAvgUAIZQDAQC-BQAhlQMBAL4FACGWAwIA6QUAIZcDAQC-BQAhmAMBAMoFACGZAwEAygUAIZoDAACcBgAgmwMBAMoFACGcAwEAygUAIZ0DEACdBgAhngMQAJ0GACGfAwIAngYAIaADAgCeBgAhogMAAJ8GogMiowMgAMwFACGkAyAAzAUAIaUDCACgBgAhpgMCAOkFACGnAwIA6QUAIQLKAwEAAAAE1AMBAAAABQXKAxAAAAAB0AMQAAAAAdEDEAAAAAHSAxAAAAAB0wMQAAAAAQXKAwIAAAAB0AMCAAAAAdEDAgAAAAHSAwIAAAAB0wMCAAAAAQHKAwAAAKIDAgXKAwgAAAAB0AMIAAAAAdEDCAAAAAHSAwgAAAAB0wMIAAAAASIFAACiBgAgCAAAowYAIAkAAKQGACANAAClBgAgDgAApgYAIBQAAKcGACAVAACoBgAgFgAAqQYAIBcAAKoGACAZAACrBgAg3AIBAL4FACHfAkAAvwUAIfQCQAC_BQAhiQMBAL4FACGTAwEAvgUAIZQDAQC-BQAhlQMBAL4FACGWAwIA6QUAIZcDAQC-BQAhmAMBAMoFACGZAwEAygUAIZoDAACcBgAgmwMBAMoFACGcAwEAygUAIZ0DEACdBgAhngMQAJ0GACGfAwIAngYAIaADAgCeBgAhogMAAJ8GogMiowMgAMwFACGkAyAAzAUAIaUDCACgBgAhpgMCAOkFACGnAwIA6QUAIQotAADfCAAwLgAA4wgAMMcDAADgCAAwyAMAAOEIADDKAwAA4ggAMMsDAADiCAAwzAMAAOIIADDNAwAA4ggAMM4DAADkCAAwzwMAAOUIADALLQAA1ggAMC4AANoIADDHAwAA1wgAMMgDAADYCAAwyQMAANkIACDKAwAArgcAMMsDAACuBwAwzAMAAK4HADDNAwAArgcAMM4DAADbCAAwzwMAALEHADALLQAAzQgAMC4AANEIADDHAwAAzggAMMgDAADPCAAwyQMAANAIACDKAwAA-gcAMMsDAAD6BwAwzAMAAPoHADDNAwAA-gcAMM4DAADSCAAwzwMAAP0HADALLQAAxAgAMC4AAMgIADDHAwAAxQgAMMgDAADGCAAwyQMAAMcIACDKAwAA0gcAMMsDAADSBwAwzAMAANIHADDNAwAA0gcAMM4DAADJCAAwzwMAAOUHADALLQAAuwgAMC4AAL8IADDHAwAAvAgAMMgDAAC9CAAwyQMAAL4IACDKAwAAzQcAMMsDAADNBwAwzAMAAM0HADDNAwAAzQcAMM4DAADACAAwzwMAANoHADALLQAAsAgAMC4AALQIADDHAwAAsQgAMMgDAACyCAAwyQMAALMIACDKAwAA8gYAMMsDAADyBgAwzAMAAPIGADDNAwAA8gYAMM4DAAC1CAAwzwMAAPUGADALLQAApAgAMC4AAKkIADDHAwAApQgAMMgDAACmCAAwyQMAAKcIACDKAwAAqAgAMMsDAACoCAAwzAMAAKgIADDNAwAAqAgAMM4DAACqCAAwzwMAAKsIADALLQAAmQgAMC4AAJ0IADDHAwAAmggAMMgDAACbCAAwyQMAAJwIACDKAwAA1QYAMMsDAADVBgAwzAMAANUGADDNAwAA1QYAMM4DAACeCAAwzwMAANgGADALLQAAkAgAMC4AAJQIADDHAwAAkQgAMMgDAACSCAAwyQMAAJMIACDKAwAAugcAMMsDAAC6BwAwzAMAALoHADDNAwAAugcAMM4DAACVCAAwzwMAAL0HADAKLQAArAYAMC4AALAGADDHAwAArQYAMMgDAACuBgAwygMAAK8GADDLAwAArwYAMMwDAACvBgAwzQMAAK8GADDOAwAAsQYAMM8DAACyBgAwGQgAAIkIACALAACHCAAgDQAAhQgAIA4AAIYIACAPAACLCAAgFgAAjggAIBcAAIgIACAaAACDCAAgGwAAhAgAIB0AAIoIACAeAACMCAAgHwAAjQgAICAAAI8IACDcAgEAAAAB3wJAAAAAAe4CAAAAuwMC9AJAAAAAAf8CAQAAAAGAAwEAAAABgQMBAAAAAZIDAAAAugMCuAMgAAAAAbsDIAAAAAG8AyAAAAABvQNAAAAAAQIAAABIACAtAACCCAAgAwAAAEgAIC0AAIIIACAuAAC3BgAgHQgAAJMFACALAACRBQAgDQAAjgUAIA4AAI8FACAPAACGBQAgFgAAlwUAIBcAAJIFACAaAACMBQAgGwAAjQUAIBwAAJAFACAdAACUBQAgHgAAlQUAIB8AAJYFACAgAACYBQAg2QIAAIkFADDaAgAARgAQ2wIAAIkFADDcAgEAAAAB3wJAAPIEACHuAgAAiwW7AyL0AkAA8gQAIf8CAQDwBAAhgAMBAAAAAYEDAQCABQAhkgMAAIoFugMiuAMgAPEEACG7AyAA8QQAIbwDIADxBAAhvQNAAIEFACECAAAASAAgJgAAtwYAIAIAAACzBgAgJgAAtAYAIA_ZAgAAsgYAMNoCAACzBgAQ2wIAALIGADDcAgEA8AQAId8CQADyBAAh7gIAAIsFuwMi9AJAAPIEACH_AgEA8AQAIYADAQDwBAAhgQMBAIAFACGSAwAAigW6AyK4AyAA8QQAIbsDIADxBAAhvAMgAPEEACG9A0AAgQUAIQ_ZAgAAsgYAMNoCAACzBgAQ2wIAALIGADDcAgEA8AQAId8CQADyBAAh7gIAAIsFuwMi9AJAAPIEACH_AgEA8AQAIYADAQDwBAAhgQMBAIAFACGSAwAAigW6AyK4AyAA8QQAIbsDIADxBAAhvAMgAPEEACG9A0AAgQUAIQzcAgEAvgUAId8CQAC_BQAh7gIAALYGuwMi9AJAAL8FACH_AgEAvgUAIYADAQC-BQAhgQMBAMoFACGSAwAAtQa6AyK4AyAAzAUAIbsDIADMBQAhvAMgAMwFACG9A0AAywUAIQHKAwAAALoDAgHKAwAAALsDAhkIAAC-BgAgCwAAvAYAIA0AALoGACAOAAC7BgAgDwAAwAYAIBYAAMMGACAXAAC9BgAgGgAAuAYAIBsAALkGACAdAAC_BgAgHgAAwQYAIB8AAMIGACAgAADEBgAg3AIBAL4FACHfAkAAvwUAIe4CAAC2BrsDIvQCQAC_BQAh_wIBAL4FACGAAwEAvgUAIYEDAQDKBQAhkgMAALUGugMiuAMgAMwFACG7AyAAzAUAIbwDIADMBQAhvQNAAMsFACELLQAA9gcAMC4AAPsHADDHAwAA9wcAMMgDAAD4BwAwyQMAAPkHACDKAwAA-gcAMMsDAAD6BwAwzAMAAPoHADDNAwAA-gcAMM4DAAD8BwAwzwMAAP0HADALLQAA6gcAMC4AAO8HADDHAwAA6wcAMMgDAADsBwAwyQMAAO0HACDKAwAA7gcAMMsDAADuBwAwzAMAAO4HADDNAwAA7gcAMM4DAADwBwAwzwMAAPEHADALLQAA3wcAMC4AAOMHADDHAwAA4AcAMMgDAADhBwAwyQMAAOIHACDKAwAA0gcAMMsDAADSBwAwzAMAANIHADDNAwAA0gcAMM4DAADkBwAwzwMAAOUHADALLQAA1AcAMC4AANgHADDHAwAA1QcAMMgDAADWBwAwyQMAANcHACDKAwAAzQcAMMsDAADNBwAwzAMAAM0HADDNAwAAzQcAMM4DAADZBwAwzwMAANoHADAHLQAAwgcAIC4AAMUHACDHAwAAwwcAIMgDAADEBwAgywMAABkAIMwDAAAZACDNAwAARAAgCy0AALYHADAuAAC7BwAwxwMAALcHADDIAwAAuAcAMMkDAAC5BwAgygMAALoHADDLAwAAugcAMMwDAAC6BwAwzQMAALoHADDOAwAAvAcAMM8DAAC9BwAwCy0AAKoHADAuAACvBwAwxwMAAKsHADDIAwAArAcAMMkDAACtBwAgygMAAK4HADDLAwAArgcAMMwDAACuBwAwzQMAAK4HADDOAwAAsAcAMM8DAACxBwAwCy0AAJ4HADAuAACjBwAwxwMAAJ8HADDIAwAAoAcAMMkDAAChBwAgygMAAKIHADDLAwAAogcAMMwDAACiBwAwzQMAAKIHADDOAwAApAcAMM8DAAClBwAwCy0AAJUHADAuAACZBwAwxwMAAJYHADDIAwAAlwcAMMkDAACYBwAgygMAANMFADDLAwAA0wUAMMwDAADTBQAwzQMAANMFADDOAwAAmgcAMM8DAADWBQAwCy0AAIkHADAuAACOBwAwxwMAAIoHADDIAwAAiwcAMMkDAACMBwAgygMAAI0HADDLAwAAjQcAMMwDAACNBwAwzQMAAI0HADDOAwAAjwcAMM8DAACQBwAwCy0AAO4GADAuAADzBgAwxwMAAO8GADDIAwAA8AYAMMkDAADxBgAgygMAAPIGADDLAwAA8gYAMMwDAADyBgAwzQMAAPIGADDOAwAA9AYAMM8DAAD1BgAwCy0AANEGADAuAADWBgAwxwMAANIGADDIAwAA0wYAMMkDAADUBgAgygMAANUGADDLAwAA1QYAMMwDAADVBgAwzQMAANUGADDOAwAA1wYAMM8DAADYBgAwCy0AAMUGADAuAADKBgAwxwMAAMYGADDIAwAAxwYAMMkDAADIBgAgygMAAMkGADDLAwAAyQYAMMwDAADJBgAwzQMAAMkGADDOAwAAywYAMM8DAADMBgAwCdwCAQAAAAHfAkAAAAAB9AJAAAAAAf8CAQAAAAGAAwEAAAABvAMgAAAAAb0DQAAAAAG-AwEAAAABvwMBAAAAAQIAAAABACAtAADQBgAgAwAAAAEAIC0AANAGACAuAADPBgAgASYAALMKADAOBwAAggUAINkCAAD_BAAw2gIAAGkAENsCAAD_BAAw3AIBAAAAAd0CAQAAAAHfAkAA8gQAIfQCQADyBAAh_wIBAPAEACGAAwEAAAABvAMgAPEEACG9A0AAgQUAIb4DAQCABQAhvwMBAIAFACECAAAAAQAgJgAAzwYAIAIAAADNBgAgJgAAzgYAIA3ZAgAAzAYAMNoCAADNBgAQ2wIAAMwGADDcAgEA8AQAId0CAQDwBAAh3wJAAPIEACH0AkAA8gQAIf8CAQDwBAAhgAMBAPAEACG8AyAA8QQAIb0DQACBBQAhvgMBAIAFACG_AwEAgAUAIQ3ZAgAAzAYAMNoCAADNBgAQ2wIAAMwGADDcAgEA8AQAId0CAQDwBAAh3wJAAPIEACH0AkAA8gQAIf8CAQDwBAAhgAMBAPAEACG8AyAA8QQAIb0DQACBBQAhvgMBAIAFACG_AwEAgAUAIQncAgEAvgUAId8CQAC_BQAh9AJAAL8FACH_AgEAvgUAIYADAQC-BQAhvAMgAMwFACG9A0AAywUAIb4DAQDKBQAhvwMBAMoFACEJ3AIBAL4FACHfAkAAvwUAIfQCQAC_BQAh_wIBAL4FACGAAwEAvgUAIbwDIADMBQAhvQNAAMsFACG-AwEAygUAIb8DAQDKBQAhCdwCAQAAAAHfAkAAAAAB9AJAAAAAAf8CAQAAAAGAAwEAAAABvAMgAAAAAb0DQAAAAAG-AwEAAAABvwMBAAAAAQkGAADsBgAgEgAA7QYAINwCAQAAAAHeAgEAAAAB3wJAAAAAAe4CAAAAhgMC9AJAAAAAAYYDEAAAAAGHA0AAAAABAgAAAD0AIC0AAOsGACADAAAAPQAgLQAA6wYAIC4AAN0GACABJgAAsgoAMA4GAACdBQAgBwAAggUAIBIAAIYFACDZAgAAngUAMNoCAAAzABDbAgAAngUAMNwCAQAAAAHdAgEA8AQAId4CAQDwBAAh3wJAAPIEACHuAgAAnwWGAyL0AkAA8gQAIYYDEACgBQAhhwNAAPIEACECAAAAPQAgJgAA3QYAIAIAAADZBgAgJgAA2gYAIAvZAgAA2AYAMNoCAADZBgAQ2wIAANgGADDcAgEA8AQAId0CAQDwBAAh3gIBAPAEACHfAkAA8gQAIe4CAACfBYYDIvQCQADyBAAhhgMQAKAFACGHA0AA8gQAIQvZAgAA2AYAMNoCAADZBgAQ2wIAANgGADDcAgEA8AQAId0CAQDwBAAh3gIBAPAEACHfAkAA8gQAIe4CAACfBYYDIvQCQADyBAAhhgMQAKAFACGHA0AA8gQAIQfcAgEAvgUAId4CAQC-BQAh3wJAAL8FACHuAgAA2waGAyL0AkAAvwUAIYYDEADcBgAhhwNAAL8FACEBygMAAACGAwIFygMQAAAAAdADEAAAAAHRAxAAAAAB0gMQAAAAAdMDEAAAAAEJBgAA3gYAIBIAAN8GACDcAgEAvgUAId4CAQC-BQAh3wJAAL8FACHuAgAA2waGAyL0AkAAvwUAIYYDEADcBgAhhwNAAL8FACEFLQAApwoAIC4AALAKACDHAwAAqAoAIMgDAACvCgAgzQMAAA0AIAstAADgBgAwLgAA5AYAMMcDAADhBgAwyAMAAOIGADDJAwAA4wYAIMoDAADTBQAwywMAANMFADDMAwAA0wUAMM0DAADTBQAwzgMAAOUGADDPAwAA1gUAMAwHAADfBQAgEAAA6gYAIBEAAOAFACDcAgEAAAAB3QIBAAAAAd8CQAAAAAHuAgEAAAABiwMBAAAAAY0DAQAAAAGOAwgAAAABjwMBAAAAAZADAQAAAAECAAAALAAgLQAA6QYAIAMAAAAsACAtAADpBgAgLgAA5wYAIAEmAACuCgAwAgAAACwAICYAAOcGACACAAAA1wUAICYAAOYGACAJ3AIBAL4FACHdAgEAvgUAId8CQAC_BQAh7gIBAL4FACGLAwEAygUAIY0DAQDKBQAhjgMIANkFACGPAwEAvgUAIZADAQDKBQAhDAcAANsFACAQAADoBgAgEQAA3AUAINwCAQC-BQAh3QIBAL4FACHfAkAAvwUAIe4CAQC-BQAhiwMBAMoFACGNAwEAygUAIY4DCADZBQAhjwMBAL4FACGQAwEAygUAIQctAACpCgAgLgAArAoAIMcDAACqCgAgyAMAAKsKACDLAwAALgAgzAMAAC4AIM0DAABlACAMBwAA3wUAIBAAAOoGACARAADgBQAg3AIBAAAAAd0CAQAAAAHfAkAAAAAB7gIBAAAAAYsDAQAAAAGNAwEAAAABjgMIAAAAAY8DAQAAAAGQAwEAAAABAy0AAKkKACDHAwAAqgoAIM0DAABlACAJBgAA7AYAIBIAAO0GACDcAgEAAAAB3gIBAAAAAd8CQAAAAAHuAgAAAIYDAvQCQAAAAAGGAxAAAAABhwNAAAAAAQMtAACnCgAgxwMAAKgKACDNAwAADQAgBC0AAOAGADDHAwAA4QYAMMkDAADjBgAgzQMAANMFADAMBgAAhwcAIA8AAIgHACDcAgEAAAAB3gIBAAAAAd8CQAAAAAHuAgAAAIsDAvQCQAAAAAGGAxAAAAABhwNAAAAAAYkDAAAAiQMCiwMBAAAAAYwDAQAAAAECAAAAKAAgLQAAhgcAIAMAAAAoACAtAACGBwAgLgAA-gYAIAEmAACmCgAwEQYAAJ0FACAHAACCBQAgDwAAhgUAINkCAACnBQAw2gIAACYAENsCAACnBQAw3AIBAAAAAd0CAQDwBAAh3gIBAPAEACHfAkAA8gQAIe4CAACpBYsDIvQCQADyBAAhhgMQAKAFACGHA0AAgQUAIYkDAACoBYkDIosDAQCABQAhjAMBAIAFACECAAAAKAAgJgAA-gYAIAIAAAD2BgAgJgAA9wYAIA7ZAgAA9QYAMNoCAAD2BgAQ2wIAAPUGADDcAgEA8AQAId0CAQDwBAAh3gIBAPAEACHfAkAA8gQAIe4CAACpBYsDIvQCQADyBAAhhgMQAKAFACGHA0AAgQUAIYkDAACoBYkDIosDAQCABQAhjAMBAIAFACEO2QIAAPUGADDaAgAA9gYAENsCAAD1BgAw3AIBAPAEACHdAgEA8AQAId4CAQDwBAAh3wJAAPIEACHuAgAAqQWLAyL0AkAA8gQAIYYDEACgBQAhhwNAAIEFACGJAwAAqAWJAyKLAwEAgAUAIYwDAQCABQAhCtwCAQC-BQAh3gIBAL4FACHfAkAAvwUAIe4CAAD5BosDIvQCQAC_BQAhhgMQANwGACGHA0AAywUAIYkDAAD4BokDIosDAQDKBQAhjAMBAMoFACEBygMAAACJAwIBygMAAACLAwIMBgAA-wYAIA8AAPwGACDcAgEAvgUAId4CAQC-BQAh3wJAAL8FACHuAgAA-QaLAyL0AkAAvwUAIYYDEADcBgAhhwNAAMsFACGJAwAA-AaJAyKLAwEAygUAIYwDAQDKBQAhBS0AAKAKACAuAACkCgAgxwMAAKEKACDIAwAAowoAIM0DAAANACALLQAA_QYAMC4AAIEHADDHAwAA_gYAMMgDAAD_BgAwyQMAAIAHACDKAwAA0wUAMMsDAADTBQAwzAMAANMFADDNAwAA0wUAMM4DAACCBwAwzwMAANYFADAMBwAA3wUAIBAAAOoGACATAADhBQAg3AIBAAAAAd0CAQAAAAHfAkAAAAAB7gIBAAAAAYsDAQAAAAGNAwEAAAABjgMIAAAAAY8DAQAAAAGRAwEAAAABAgAAACwAIC0AAIUHACADAAAALAAgLQAAhQcAIC4AAIQHACABJgAAogoAMAIAAAAsACAmAACEBwAgAgAAANcFACAmAACDBwAgCdwCAQC-BQAh3QIBAL4FACHfAkAAvwUAIe4CAQC-BQAhiwMBAMoFACGNAwEAygUAIY4DCADZBQAhjwMBAL4FACGRAwEAygUAIQwHAADbBQAgEAAA6AYAIBMAAN0FACDcAgEAvgUAId0CAQC-BQAh3wJAAL8FACHuAgEAvgUAIYsDAQDKBQAhjQMBAMoFACGOAwgA2QUAIY8DAQC-BQAhkQMBAMoFACEMBwAA3wUAIBAAAOoGACATAADhBQAg3AIBAAAAAd0CAQAAAAHfAkAAAAAB7gIBAAAAAYsDAQAAAAGNAwEAAAABjgMIAAAAAY8DAQAAAAGRAwEAAAABDAYAAIcHACAPAACIBwAg3AIBAAAAAd4CAQAAAAHfAkAAAAAB7gIAAACLAwL0AkAAAAABhgMQAAAAAYcDQAAAAAGJAwAAAIkDAosDAQAAAAGMAwEAAAABAy0AAKAKACDHAwAAoQoAIM0DAAANACAELQAA_QYAMMcDAAD-BgAwyQMAAIAHACDNAwAA0wUAMAsPAADjBQAg3AIBAAAAAd8CQAAAAAHsAgAAAOwCAu4CAAAA7gIC7wIBAAAAAfACAQAAAAHxAkAAAAAB8gJAAAAAAfMCIAAAAAH0AkAAAAABAgAAAGUAIC0AAJQHACADAAAAZQAgLQAAlAcAIC4AAJMHACABJgAAnwoAMBAHAACCBQAgDwAAhgUAINkCAACDBQAw2gIAAC4AENsCAACDBQAw3AIBAAAAAd0CAQAAAAHfAkAA8gQAIewCAACEBewCIu4CAACFBe4CIu8CAQAAAAHwAgEAgAUAIfECQACBBQAh8gJAAIEFACHzAiAA8QQAIfQCQADyBAAhAgAAAGUAICYAAJMHACACAAAAkQcAICYAAJIHACAO2QIAAJAHADDaAgAAkQcAENsCAACQBwAw3AIBAPAEACHdAgEA8AQAId8CQADyBAAh7AIAAIQF7AIi7gIAAIUF7gIi7wIBAIAFACHwAgEAgAUAIfECQACBBQAh8gJAAIEFACHzAiAA8QQAIfQCQADyBAAhDtkCAACQBwAw2gIAAJEHABDbAgAAkAcAMNwCAQDwBAAh3QIBAPAEACHfAkAA8gQAIewCAACEBewCIu4CAACFBe4CIu8CAQCABQAh8AIBAIAFACHxAkAAgQUAIfICQACBBQAh8wIgAPEEACH0AkAA8gQAIQrcAgEAvgUAId8CQAC_BQAh7AIAAMgF7AIi7gIAAMkF7gIi7wIBAMoFACHwAgEAygUAIfECQADLBQAh8gJAAMsFACHzAiAAzAUAIfQCQAC_BQAhCw8AAM4FACDcAgEAvgUAId8CQAC_BQAh7AIAAMgF7AIi7gIAAMkF7gIi7wIBAMoFACHwAgEAygUAIfECQADLBQAh8gJAAMsFACHzAiAAzAUAIfQCQAC_BQAhCw8AAOMFACDcAgEAAAAB3wJAAAAAAewCAAAA7AIC7gIAAADuAgLvAgEAAAAB8AIBAAAAAfECQAAAAAHyAkAAAAAB8wIgAAAAAfQCQAAAAAEMEAAA6gYAIBEAAOAFACATAADhBQAg3AIBAAAAAd8CQAAAAAHuAgEAAAABiwMBAAAAAY0DAQAAAAGOAwgAAAABjwMBAAAAAZADAQAAAAGRAwEAAAABAgAAACwAIC0AAJ0HACADAAAALAAgLQAAnQcAIC4AAJwHACABJgAAngoAMAIAAAAsACAmAACcBwAgAgAAANcFACAmAACbBwAgCdwCAQC-BQAh3wJAAL8FACHuAgEAvgUAIYsDAQDKBQAhjQMBAMoFACGOAwgA2QUAIY8DAQC-BQAhkAMBAMoFACGRAwEAygUAIQwQAADoBgAgEQAA3AUAIBMAAN0FACDcAgEAvgUAId8CQAC_BQAh7gIBAL4FACGLAwEAygUAIY0DAQDKBQAhjgMIANkFACGPAwEAvgUAIZADAQDKBQAhkQMBAMoFACEMEAAA6gYAIBEAAOAFACATAADhBQAg3AIBAAAAAd8CQAAAAAHuAgEAAAABiwMBAAAAAY0DAQAAAAGOAwgAAAABjwMBAAAAAZADAQAAAAGRAwEAAAABB9wCAQAAAAHfAkAAAAAB9AJAAAAAAYcDQAAAAAG1AwEAAAABtgMBAAAAAbcDAQAAAAECAAAAYQAgLQAAqQcAIAMAAABhACAtAACpBwAgLgAAqAcAIAEmAACdCgAwDAcAAIIFACDZAgAAhwUAMNoCAABfABDbAgAAhwUAMNwCAQAAAAHdAgEA8AQAId8CQADyBAAh9AJAAPIEACGHA0AA8gQAIbUDAQAAAAG2AwEAgAUAIbcDAQCABQAhAgAAAGEAICYAAKgHACACAAAApgcAICYAAKcHACAL2QIAAKUHADDaAgAApgcAENsCAAClBwAw3AIBAPAEACHdAgEA8AQAId8CQADyBAAh9AJAAPIEACGHA0AA8gQAIbUDAQDwBAAhtgMBAIAFACG3AwEAgAUAIQvZAgAApQcAMNoCAACmBwAQ2wIAAKUHADDcAgEA8AQAId0CAQDwBAAh3wJAAPIEACH0AkAA8gQAIYcDQADyBAAhtQMBAPAEACG2AwEAgAUAIbcDAQCABQAhB9wCAQC-BQAh3wJAAL8FACH0AkAAvwUAIYcDQAC_BQAhtQMBAL4FACG2AwEAygUAIbcDAQDKBQAhB9wCAQC-BQAh3wJAAL8FACH0AkAAvwUAIYcDQAC_BQAhtQMBAL4FACG2AwEAygUAIbcDAQDKBQAhB9wCAQAAAAHfAkAAAAAB9AJAAAAAAYcDQAAAAAG1AwEAAAABtgMBAAAAAbcDAQAAAAEKBgAA7wUAINwCAQAAAAHeAgEAAAAB3wJAAAAAAe4CAAAA-AIC9AJAAAAAAfUCAQAAAAH2AgIAAAAB-AIAAO4FACD5AiAAAAABAgAAABIAIC0AALUHACADAAAAEgAgLQAAtQcAIC4AALQHACABJgAAnAoAMA8GAACdBQAgBwAAggUAINkCAACsBQAw2gIAABAAENsCAACsBQAw3AIBAAAAAd0CAQDwBAAh3gIBAPAEACHfAkAA8gQAIe4CAACtBfgCIvQCQADyBAAh9QIBAPAEACH2AgIAnAUAIfgCAADGBAAg-QIgAPEEACECAAAAEgAgJgAAtAcAIAIAAACyBwAgJgAAswcAIA3ZAgAAsQcAMNoCAACyBwAQ2wIAALEHADDcAgEA8AQAId0CAQDwBAAh3gIBAPAEACHfAkAA8gQAIe4CAACtBfgCIvQCQADyBAAh9QIBAPAEACH2AgIAnAUAIfgCAADGBAAg-QIgAPEEACEN2QIAALEHADDaAgAAsgcAENsCAACxBwAw3AIBAPAEACHdAgEA8AQAId4CAQDwBAAh3wJAAPIEACHuAgAArQX4AiL0AkAA8gQAIfUCAQDwBAAh9gICAJwFACH4AgAAxgQAIPkCIADxBAAhCdwCAQC-BQAh3gIBAL4FACHfAkAAvwUAIe4CAADqBfgCIvQCQAC_BQAh9QIBAL4FACH2AgIA6QUAIfgCAADrBQAg-QIgAMwFACEKBgAA7AUAINwCAQC-BQAh3gIBAL4FACHfAkAAvwUAIe4CAADqBfgCIvQCQAC_BQAh9QIBAL4FACH2AgIA6QUAIfgCAADrBQAg-QIgAMwFACEKBgAA7wUAINwCAQAAAAHeAgEAAAAB3wJAAAAAAe4CAAAA-AIC9AJAAAAAAfUCAQAAAAH2AgIAAAAB-AIAAO4FACD5AiAAAAABBQYAAPgFACDcAgEAAAAB3gIBAAAAAd8CQAAAAAH9AgIAAAABAgAAAEEAIC0AAMEHACADAAAAQQAgLQAAwQcAIC4AAMAHACABJgAAmwoAMAsGAACdBQAgBwAAggUAINkCAACbBQAw2gIAAD8AENsCAACbBQAw3AIBAAAAAd0CAQDwBAAh3gIBAPAEACHfAkAA8gQAIf0CAgCcBQAhwwMAAJoFACACAAAAQQAgJgAAwAcAIAIAAAC-BwAgJgAAvwcAIAjZAgAAvQcAMNoCAAC-BwAQ2wIAAL0HADDcAgEA8AQAId0CAQDwBAAh3gIBAPAEACHfAkAA8gQAIf0CAgCcBQAhCNkCAAC9BwAw2gIAAL4HABDbAgAAvQcAMNwCAQDwBAAh3QIBAPAEACHeAgEA8AQAId8CQADyBAAh_QICAJwFACEE3AIBAL4FACHeAgEAvgUAId8CQAC_BQAh_QICAOkFACEFBgAA9gUAINwCAQC-BQAh3gIBAL4FACHfAkAAvwUAIf0CAgDpBQAhBQYAAPgFACDcAgEAAAAB3gIBAAAAAd8CQAAAAAH9AgIAAAABDAMAAMkHACAKAADHBwAgDAAAyAcAINwCAQAAAAHfAkAAAAAB9AJAAAAAAf8CAQAAAAGAAwEAAAABgQMBAAAAAYIDAQAAAAGDAwEAAAABhAMBAAAAAQIAAABEACAtAADCBwAgAwAAABkAIC0AAMIHACAuAADGBwAgDgAAABkAIAMAAJIGACAKAACPBgAgDAAAkAYAICYAAMYHACDcAgEAvgUAId8CQAC_BQAh9AJAAL8FACH_AgEAygUAIYADAQDKBQAhgQMBAMoFACGCAwEAygUAIYMDAQDKBQAhhAMBAMoFACEMAwAAkgYAIAoAAI8GACAMAACQBgAg3AIBAL4FACHfAkAAvwUAIfQCQAC_BQAh_wIBAMoFACGAAwEAygUAIYEDAQDKBQAhggMBAMoFACGDAwEAygUAIYQDAQDKBQAhBC0AAM8HADDHAwAA0AcAMMkDAADRBwAgzQMAANIHADAELQAAygcAMMcDAADLBwAwyQMAAMwHACDNAwAAzQcAMAMtAACTBgAwxwMAAJQGADDNAwAAlgYAMAcGAACABgAgBwAAggYAINwCAQAAAAHdAgEAAAAB3gIBAAAAAd8CQAAAAAH0AkAAAAABAgAAAB4AIC0AAM4HACABJgAAmgoAMAwGAACdBQAgBwAAggUAIAsAAJEFACDZAgAAqgUAMNoCAAAcABDbAgAAqgUAMNwCAQAAAAHdAgEA8AQAId4CAQDwBAAh3wJAAPIEACH0AkAA8gQAIf4CAQCABQAhBwYAAIAGACAHAACCBgAg3AIBAAAAAd0CAQAAAAHeAgEAAAAB3wJAAAAAAfQCQAAAAAEHBgAAiQYAIAcAAIsGACDcAgEAAAAB3QIBAAAAAd4CAQAAAAHfAkAAAAAB9AJAAAAAAQIAAAAXACAtAADTBwAgASYAAJkKADAMBgAAnQUAIAcAAIIFACALAACRBQAg2QIAAKsFADDaAgAAFQAQ2wIAAKsFADDcAgEAAAAB3QIBAPAEACHeAgEA8AQAId8CQADyBAAh9AJAAPIEACH-AgEAgAUAIQcGAACJBgAgBwAAiwYAINwCAQAAAAHdAgEAAAAB3gIBAAAAAd8CQAAAAAH0AkAAAAABBwYAAIAGACALAACBBgAg3AIBAAAAAd4CAQAAAAHfAkAAAAAB9AJAAAAAAf4CAQAAAAECAAAAHgAgLQAA3gcAIAMAAAAeACAtAADeBwAgLgAA3QcAIAEmAACYCgAwAgAAAB4AICYAAN0HACACAAAA2wcAICYAANwHACAJ2QIAANoHADDaAgAA2wcAENsCAADaBwAw3AIBAPAEACHdAgEA8AQAId4CAQDwBAAh3wJAAPIEACH0AkAA8gQAIf4CAQCABQAhCdkCAADaBwAw2gIAANsHABDbAgAA2gcAMNwCAQDwBAAh3QIBAPAEACHeAgEA8AQAId8CQADyBAAh9AJAAPIEACH-AgEAgAUAIQXcAgEAvgUAId4CAQC-BQAh3wJAAL8FACH0AkAAvwUAIf4CAQDKBQAhBwYAAP0FACALAAD-BQAg3AIBAL4FACHeAgEAvgUAId8CQAC_BQAh9AJAAL8FACH-AgEAygUAIQcGAACABgAgCwAAgQYAINwCAQAAAAHeAgEAAAAB3wJAAAAAAfQCQAAAAAH-AgEAAAABBwYAAIkGACALAACKBgAg3AIBAAAAAd4CAQAAAAHfAkAAAAAB9AJAAAAAAf4CAQAAAAECAAAAFwAgLQAA6QcAIAMAAAAXACAtAADpBwAgLgAA6AcAIAEmAACXCgAwAgAAABcAICYAAOgHACACAAAA5gcAICYAAOcHACAJ2QIAAOUHADDaAgAA5gcAENsCAADlBwAw3AIBAPAEACHdAgEA8AQAId4CAQDwBAAh3wJAAPIEACH0AkAA8gQAIf4CAQCABQAhCdkCAADlBwAw2gIAAOYHABDbAgAA5QcAMNwCAQDwBAAh3QIBAPAEACHeAgEA8AQAId8CQADyBAAh9AJAAPIEACH-AgEAgAUAIQXcAgEAvgUAId4CAQC-BQAh3wJAAL8FACH0AkAAvwUAIf4CAQDKBQAhBwYAAIYGACALAACHBgAg3AIBAL4FACHeAgEAvgUAId8CQAC_BQAh9AJAAL8FACH-AgEAygUAIQcGAACJBgAgCwAAigYAINwCAQAAAAHeAgEAAAAB3wJAAAAAAfQCQAAAAAH-AgEAAAABDNwCAQAAAAHfAkAAAAAB9AJAAAAAAawDAQAAAAGtAwEAAAABrgMBAAAAAa8DAQAAAAGwAwEAAAABsQNAAAAAAbIDQAAAAAGzAwEAAAABtAMBAAAAAQIAAABXACAtAAD1BwAgAwAAAFcAIC0AAPUHACAuAAD0BwAgASYAAJYKADARBwAAggUAINkCAACIBQAw2gIAAFUAENsCAACIBQAw3AIBAAAAAd0CAQDwBAAh3wJAAPIEACH0AkAA8gQAIawDAQDwBAAhrQMBAPAEACGuAwEAgAUAIa8DAQCABQAhsAMBAIAFACGxA0AAgQUAIbIDQACBBQAhswMBAIAFACG0AwEAgAUAIQIAAABXACAmAAD0BwAgAgAAAPIHACAmAADzBwAgENkCAADxBwAw2gIAAPIHABDbAgAA8QcAMNwCAQDwBAAh3QIBAPAEACHfAkAA8gQAIfQCQADyBAAhrAMBAPAEACGtAwEA8AQAIa4DAQCABQAhrwMBAIAFACGwAwEAgAUAIbEDQACBBQAhsgNAAIEFACGzAwEAgAUAIbQDAQCABQAhENkCAADxBwAw2gIAAPIHABDbAgAA8QcAMNwCAQDwBAAh3QIBAPAEACHfAkAA8gQAIfQCQADyBAAhrAMBAPAEACGtAwEA8AQAIa4DAQCABQAhrwMBAIAFACGwAwEAgAUAIbEDQACBBQAhsgNAAIEFACGzAwEAgAUAIbQDAQCABQAhDNwCAQC-BQAh3wJAAL8FACH0AkAAvwUAIawDAQC-BQAhrQMBAL4FACGuAwEAygUAIa8DAQDKBQAhsAMBAMoFACGxA0AAywUAIbIDQADLBQAhswMBAMoFACG0AwEAygUAIQzcAgEAvgUAId8CQAC_BQAh9AJAAL8FACGsAwEAvgUAIa0DAQC-BQAhrgMBAMoFACGvAwEAygUAIbADAQDKBQAhsQNAAMsFACGyA0AAywUAIbMDAQDKBQAhtAMBAMoFACEM3AIBAAAAAd8CQAAAAAH0AkAAAAABrAMBAAAAAa0DAQAAAAGuAwEAAAABrwMBAAAAAbADAQAAAAGxA0AAAAABsgNAAAAAAbMDAQAAAAG0AwEAAAABBAYAAMIFACDcAgEAAAAB3gIBAAAAAd8CQAAAAAECAAAABQAgLQAAgQgAIAMAAAAFACAtAACBCAAgLgAAgAgAIAEmAACVCgAwCgYAAJ0FACAHAACCBQAg2QIAALoFADDaAgAAAwAQ2wIAALoFADDcAgEAAAAB3QIBAPAEACHeAgEA8AQAId8CQADyBAAhwwMAALkFACACAAAABQAgJgAAgAgAIAIAAAD-BwAgJgAA_wcAIAfZAgAA_QcAMNoCAAD-BwAQ2wIAAP0HADDcAgEA8AQAId0CAQDwBAAh3gIBAPAEACHfAkAA8gQAIQfZAgAA_QcAMNoCAAD-BwAQ2wIAAP0HADDcAgEA8AQAId0CAQDwBAAh3gIBAPAEACHfAkAA8gQAIQPcAgEAvgUAId4CAQC-BQAh3wJAAL8FACEEBgAAwAUAINwCAQC-BQAh3gIBAL4FACHfAkAAvwUAIQQGAADCBQAg3AIBAAAAAd4CAQAAAAHfAkAAAAABGQgAAIkIACALAACHCAAgDQAAhQgAIA4AAIYIACAPAACLCAAgFgAAjggAIBcAAIgIACAaAACDCAAgGwAAhAgAIB0AAIoIACAeAACMCAAgHwAAjQgAICAAAI8IACDcAgEAAAAB3wJAAAAAAe4CAAAAuwMC9AJAAAAAAf8CAQAAAAGAAwEAAAABgQMBAAAAAZIDAAAAugMCuAMgAAAAAbsDIAAAAAG8AyAAAAABvQNAAAAAAQQtAAD2BwAwxwMAAPcHADDJAwAA-QcAIM0DAAD6BwAwBC0AAOoHADDHAwAA6wcAMMkDAADtBwAgzQMAAO4HADAELQAA3wcAMMcDAADgBwAwyQMAAOIHACDNAwAA0gcAMAQtAADUBwAwxwMAANUHADDJAwAA1wcAIM0DAADNBwAwAy0AAMIHACDHAwAAwwcAIM0DAABEACAELQAAtgcAMMcDAAC3BwAwyQMAALkHACDNAwAAugcAMAQtAACqBwAwxwMAAKsHADDJAwAArQcAIM0DAACuBwAwBC0AAJ4HADDHAwAAnwcAMMkDAAChBwAgzQMAAKIHADAELQAAlQcAMMcDAACWBwAwyQMAAJgHACDNAwAA0wUAMAQtAACJBwAwxwMAAIoHADDJAwAAjAcAIM0DAACNBwAwBC0AAO4GADDHAwAA7wYAMMkDAADxBgAgzQMAAPIGADAELQAA0QYAMMcDAADSBgAwyQMAANQGACDNAwAA1QYAMAQtAADFBgAwxwMAAMYGADDJAwAAyAYAIM0DAADJBgAwBQcAAPkFACDcAgEAAAAB3QIBAAAAAd8CQAAAAAH9AgIAAAABAgAAAEEAIC0AAJgIACADAAAAQQAgLQAAmAgAIC4AAJcIACABJgAAlAoAMAIAAABBACAmAACXCAAgAgAAAL4HACAmAACWCAAgBNwCAQC-BQAh3QIBAL4FACHfAkAAvwUAIf0CAgDpBQAhBQcAAPcFACDcAgEAvgUAId0CAQC-BQAh3wJAAL8FACH9AgIA6QUAIQUHAAD5BQAg3AIBAAAAAd0CAQAAAAHfAkAAAAAB_QICAAAAAQkHAACjCAAgEgAA7QYAINwCAQAAAAHdAgEAAAAB3wJAAAAAAe4CAAAAhgMC9AJAAAAAAYYDEAAAAAGHA0AAAAABAgAAAD0AIC0AAKIIACADAAAAPQAgLQAAoggAIC4AAKAIACABJgAAkwoAMAIAAAA9ACAmAACgCAAgAgAAANkGACAmAACfCAAgB9wCAQC-BQAh3QIBAL4FACHfAkAAvwUAIe4CAADbBoYDIvQCQAC_BQAhhgMQANwGACGHA0AAvwUAIQkHAAChCAAgEgAA3wYAINwCAQC-BQAh3QIBAL4FACHfAkAAvwUAIe4CAADbBoYDIvQCQAC_BQAhhgMQANwGACGHA0AAvwUAIQUtAACOCgAgLgAAkQoAIMcDAACPCgAgyAMAAJAKACDNAwAASAAgCQcAAKMIACASAADtBgAg3AIBAAAAAd0CAQAAAAHfAkAAAAAB7gIAAACGAwL0AkAAAAABhgMQAAAAAYcDQAAAAAEDLQAAjgoAIMcDAACPCgAgzQMAAEgAIATcAgEAAAAB_wIBAAAAAYEDAQAAAAGSAwEAAAABAgAAADoAIC0AAK8IACADAAAAOgAgLQAArwgAIC4AAK4IACABJgAAjQoAMAkGAACdBQAg2QIAAKEFADDaAgAAOAAQ2wIAAKEFADDcAgEAAAAB3gIBAPAEACH_AgEA8AQAIYEDAQCABQAhkgMBAPAEACECAAAAOgAgJgAArggAIAIAAACsCAAgJgAArQgAIAjZAgAAqwgAMNoCAACsCAAQ2wIAAKsIADDcAgEA8AQAId4CAQDwBAAh_wIBAPAEACGBAwEAgAUAIZIDAQDwBAAhCNkCAACrCAAw2gIAAKwIABDbAgAAqwgAMNwCAQDwBAAh3gIBAPAEACH_AgEA8AQAIYEDAQCABQAhkgMBAPAEACEE3AIBAL4FACH_AgEAvgUAIYEDAQDKBQAhkgMBAL4FACEE3AIBAL4FACH_AgEAvgUAIYEDAQDKBQAhkgMBAL4FACEE3AIBAAAAAf8CAQAAAAGBAwEAAAABkgMBAAAAAQwHAAC6CAAgDwAAiAcAINwCAQAAAAHdAgEAAAAB3wJAAAAAAe4CAAAAiwMC9AJAAAAAAYYDEAAAAAGHA0AAAAABiQMAAACJAwKLAwEAAAABjAMBAAAAAQIAAAAoACAtAAC5CAAgAwAAACgAIC0AALkIACAuAAC3CAAgASYAAIwKADACAAAAKAAgJgAAtwgAIAIAAAD2BgAgJgAAtggAIArcAgEAvgUAId0CAQC-BQAh3wJAAL8FACHuAgAA-QaLAyL0AkAAvwUAIYYDEADcBgAhhwNAAMsFACGJAwAA-AaJAyKLAwEAygUAIYwDAQDKBQAhDAcAALgIACAPAAD8BgAg3AIBAL4FACHdAgEAvgUAId8CQAC_BQAh7gIAAPkGiwMi9AJAAL8FACGGAxAA3AYAIYcDQADLBQAhiQMAAPgGiQMiiwMBAMoFACGMAwEAygUAIQUtAACHCgAgLgAAigoAIMcDAACICgAgyAMAAIkKACDNAwAASAAgDAcAALoIACAPAACIBwAg3AIBAAAAAd0CAQAAAAHfAkAAAAAB7gIAAACLAwL0AkAAAAABhgMQAAAAAYcDQAAAAAGJAwAAAIkDAosDAQAAAAGMAwEAAAABAy0AAIcKACDHAwAAiAoAIM0DAABIACAHBwAAggYAIAsAAIEGACDcAgEAAAAB3QIBAAAAAd8CQAAAAAH0AkAAAAAB_gIBAAAAAQIAAAAeACAtAADDCAAgAwAAAB4AIC0AAMMIACAuAADCCAAgASYAAIYKADACAAAAHgAgJgAAwggAIAIAAADbBwAgJgAAwQgAIAXcAgEAvgUAId0CAQC-BQAh3wJAAL8FACH0AkAAvwUAIf4CAQDKBQAhBwcAAP8FACALAAD-BQAg3AIBAL4FACHdAgEAvgUAId8CQAC_BQAh9AJAAL8FACH-AgEAygUAIQcHAACCBgAgCwAAgQYAINwCAQAAAAHdAgEAAAAB3wJAAAAAAfQCQAAAAAH-AgEAAAABBwcAAIsGACALAACKBgAg3AIBAAAAAd0CAQAAAAHfAkAAAAAB9AJAAAAAAf4CAQAAAAECAAAAFwAgLQAAzAgAIAMAAAAXACAtAADMCAAgLgAAywgAIAEmAACFCgAwAgAAABcAICYAAMsIACACAAAA5gcAICYAAMoIACAF3AIBAL4FACHdAgEAvgUAId8CQAC_BQAh9AJAAL8FACH-AgEAygUAIQcHAACIBgAgCwAAhwYAINwCAQC-BQAh3QIBAL4FACHfAkAAvwUAIfQCQAC_BQAh_gIBAMoFACEHBwAAiwYAIAsAAIoGACDcAgEAAAAB3QIBAAAAAd8CQAAAAAH0AkAAAAAB_gIBAAAAAQQHAADDBQAg3AIBAAAAAd0CAQAAAAHfAkAAAAABAgAAAAUAIC0AANUIACADAAAABQAgLQAA1QgAIC4AANQIACABJgAAhAoAMAIAAAAFACAmAADUCAAgAgAAAP4HACAmAADTCAAgA9wCAQC-BQAh3QIBAL4FACHfAkAAvwUAIQQHAADBBQAg3AIBAL4FACHdAgEAvgUAId8CQAC_BQAhBAcAAMMFACDcAgEAAAAB3QIBAAAAAd8CQAAAAAEKBwAA8AUAINwCAQAAAAHdAgEAAAAB3wJAAAAAAe4CAAAA-AIC9AJAAAAAAfUCAQAAAAH2AgIAAAAB-AIAAO4FACD5AiAAAAABAgAAABIAIC0AAN4IACADAAAAEgAgLQAA3ggAIC4AAN0IACABJgAAgwoAMAIAAAASACAmAADdCAAgAgAAALIHACAmAADcCAAgCdwCAQC-BQAh3QIBAL4FACHfAkAAvwUAIe4CAADqBfgCIvQCQAC_BQAh9QIBAL4FACH2AgIA6QUAIfgCAADrBQAg-QIgAMwFACEKBwAA7QUAINwCAQC-BQAh3QIBAL4FACHfAkAAvwUAIe4CAADqBfgCIvQCQAC_BQAh9QIBAL4FACH2AgIA6QUAIfgCAADrBQAg-QIgAMwFACEKBwAA8AUAINwCAQAAAAHdAgEAAAAB3wJAAAAAAe4CAAAA-AIC9AJAAAAAAfUCAQAAAAH2AgIAAAAB-AIAAO4FACD5AiAAAAABB9wCAQAAAAHfAkAAAAAB9AJAAAAAAf8CAQAAAAGUAwEAAAABowMgAAAAAaQDIAAAAAECAAAACQAgLQAA6QgAIAMAAAAJACAtAADpCAAgLgAA6AgAIAsDAACQBQAg2QIAALgFADDaAgAABwAQ2wIAALgFADDcAgEAAAAB3wJAAPIEACH0AkAA8gQAIf8CAQAAAAGUAwEAAAABowMgAPEEACGkAyAA8QQAIQIAAAAJACAmAADoCAAgAgAAAOYIACAmAADnCAAgCtkCAADlCAAw2gIAAOYIABDbAgAA5QgAMNwCAQDwBAAh3wJAAPIEACH0AkAA8gQAIf8CAQDwBAAhlAMBAPAEACGjAyAA8QQAIaQDIADxBAAhCtkCAADlCAAw2gIAAOYIABDbAgAA5QgAMNwCAQDwBAAh3wJAAPIEACH0AkAA8gQAIf8CAQDwBAAhlAMBAPAEACGjAyAA8QQAIaQDIADxBAAhB9wCAQC-BQAh3wJAAL8FACH0AkAAvwUAIf8CAQC-BQAhlAMBAL4FACGjAyAAzAUAIaQDIADMBQAhB9wCAQC-BQAh3wJAAL8FACH0AkAAvwUAIf8CAQC-BQAhlAMBAL4FACGjAyAAzAUAIaQDIADMBQAhB9wCAQAAAAHfAkAAAAAB9AJAAAAAAf8CAQAAAAGUAwEAAAABowMgAAAAAaQDIAAAAAEiBQAA7AgAIAgAAO0IACAJAADuCAAgDQAA7wgAIA4AAPAIACAUAADxCAAgFQAA8ggAIBYAAPMIACAXAAD0CAAgGQAA9QgAINwCAQAAAAHfAkAAAAAB9AJAAAAAAYkDAQAAAAGTAwEAAAABlAMBAAAAAZUDAQAAAAGWAwIAAAABlwMBAAAAAZgDAQAAAAGZAwEAAAABmgMAAOsIACCbAwEAAAABnAMBAAAAAZ0DEAAAAAGeAxAAAAABnwMCAAAAAaADAgAAAAGiAwAAAKIDAqMDIAAAAAGkAyAAAAABpQMIAAAAAaYDAgAAAAGnAwIAAAABAcoDAQAAAAQDLQAA3wgAMMcDAADgCAAwzQMAAOIIADAELQAA1ggAMMcDAADXCAAwyQMAANkIACDNAwAArgcAMAQtAADNCAAwxwMAAM4IADDJAwAA0AgAIM0DAAD6BwAwBC0AAMQIADDHAwAAxQgAMMkDAADHCAAgzQMAANIHADAELQAAuwgAMMcDAAC8CAAwyQMAAL4IACDNAwAAzQcAMAQtAACwCAAwxwMAALEIADDJAwAAswgAIM0DAADyBgAwBC0AAKQIADDHAwAApQgAMMkDAACnCAAgzQMAAKgIADAELQAAmQgAMMcDAACaCAAwyQMAAJwIACDNAwAA1QYAMAQtAACQCAAwxwMAAJEIADDJAwAAkwgAIM0DAAC6BwAwAy0AAKwGADDHAwAArQYAMM0DAACvBgAwAwAAAB4AIC0AAM4HACAuAAD6CAAgAgAAAB4AICYAAPoIACACAAAA2wcAICYAAPkIACAF3AIBAL4FACHdAgEAvgUAId4CAQC-BQAh3wJAAL8FACH0AkAAvwUAIQcGAAD9BQAgBwAA_wUAINwCAQC-BQAh3QIBAL4FACHeAgEAvgUAId8CQAC_BQAh9AJAAL8FACEDAAAAFwAgLQAA0wcAIC4AAP8IACACAAAAFwAgJgAA_wgAIAIAAADmBwAgJgAA_ggAIAXcAgEAvgUAId0CAQC-BQAh3gIBAL4FACHfAkAAvwUAIfQCQAC_BQAhBwYAAIYGACAHAACIBgAg3AIBAL4FACHdAgEAvgUAId4CAQC-BQAh3wJAAL8FACH0AkAAvwUAIQMtAACBCgAgxwMAAIIKACDNAwAASAAgAAAAAAAAAAAAAAAAAAAAAAAABS0AAPwJACAuAAD_CQAgxwMAAP0JACDIAwAA_gkAIM0DAAANACADLQAA_AkAIMcDAAD9CQAgzQMAAA0AIAAAAAAACi0AAJsJADAuAACfCQAwxwMAAJwJADDIAwAAnQkAMMoDAACeCQAwywMAAJ4JADDMAwAAngkAMM0DAACeCQAwzgMAAKAJADDPAwAAoQkAMA0HAACACQAgCgAAxwcAIAwAAMgHACDcAgEAAAAB3QIBAAAAAd8CQAAAAAH0AkAAAAAB_wIBAAAAAYADAQAAAAGBAwEAAAABggMBAAAAAYMDAQAAAAGEAwEAAAABAgAAAEQAIC0AAKUJACADAAAARAAgLQAApQkAIC4AAKQJACARAwAAkAUAIAcAAIIFACAKAACOBQAgDAAAjwUAINkCAACZBQAw2gIAABkAENsCAACZBQAw3AIBAAAAAd0CAQAAAAHfAkAA8gQAIfQCQADyBAAh_wIBAIAFACGAAwEAgAUAIYEDAQCABQAhggMBAIAFACGDAwEAgAUAIYQDAQCABQAhAgAAAEQAICYAAKQJACACAAAAogkAICYAAKMJACAN2QIAAKEJADDaAgAAogkAENsCAAChCQAw3AIBAPAEACHdAgEA8AQAId8CQADyBAAh9AJAAPIEACH_AgEAgAUAIYADAQCABQAhgQMBAIAFACGCAwEAgAUAIYMDAQCABQAhhAMBAIAFACEN2QIAAKEJADDaAgAAogkAENsCAAChCQAw3AIBAPAEACHdAgEA8AQAId8CQADyBAAh9AJAAPIEACH_AgEAgAUAIYADAQCABQAhgQMBAIAFACGCAwEAgAUAIYMDAQCABQAhhAMBAIAFACEK3AIBAL4FACHdAgEAvgUAId8CQAC_BQAh9AJAAL8FACH_AgEAygUAIYADAQDKBQAhgQMBAMoFACGCAwEAygUAIYMDAQDKBQAhhAMBAMoFACENBwAAkQYAIAoAAI8GACAMAACQBgAg3AIBAL4FACHdAgEAvgUAId8CQAC_BQAh9AJAAL8FACH_AgEAygUAIYADAQDKBQAhgQMBAMoFACGCAwEAygUAIYMDAQDKBQAhhAMBAMoFACENBwAAgAkAIAoAAMcHACAMAADIBwAg3AIBAAAAAd0CAQAAAAHfAkAAAAAB9AJAAAAAAf8CAQAAAAGAAwEAAAABgQMBAAAAAYIDAQAAAAGDAwEAAAABhAMBAAAAAQMtAACbCQAwxwMAAJwJADDNAwAAngkAMAAAAAotAACrCQAwLgAArgkAMMcDAACsCQAwyAMAAK0JADDKAwAAlgYAMMsDAACWBgAwzAMAAJYGADDNAwAAlgYAMM4DAACvCQAwzwMAAJkGADAiCAAA7QgAIAkAAO4IACANAADvCAAgDgAA8AgAIBQAAPEIACAVAADyCAAgFgAA8wgAIBcAAPQIACAYAACmCQAgGQAA9QgAINwCAQAAAAHfAkAAAAAB9AJAAAAAAYkDAQAAAAGTAwEAAAABlAMBAAAAAZUDAQAAAAGWAwIAAAABlwMBAAAAAZgDAQAAAAGZAwEAAAABmgMAAOsIACCbAwEAAAABnAMBAAAAAZ0DEAAAAAGeAxAAAAABnwMCAAAAAaADAgAAAAGiAwAAAKIDAqMDIAAAAAGkAyAAAAABpQMIAAAAAaYDAgAAAAGnAwIAAAABAgAAAA0AIC0AALIJACADAAAADQAgLQAAsgkAIC4AALEJACACAAAADQAgJgAAsQkAIAIAAACaBgAgJgAAsAkAIBjcAgEAvgUAId8CQAC_BQAh9AJAAL8FACGJAwEAvgUAIZMDAQC-BQAhlAMBAL4FACGVAwEAvgUAIZYDAgDpBQAhlwMBAL4FACGYAwEAygUAIZkDAQDKBQAhmgMAAJwGACCbAwEAygUAIZwDAQDKBQAhnQMQAJ0GACGeAxAAnQYAIZ8DAgCeBgAhoAMCAJ4GACGiAwAAnwaiAyKjAyAAzAUAIaQDIADMBQAhpQMIAKAGACGmAwIA6QUAIacDAgDpBQAhIggAAKMGACAJAACkBgAgDQAApQYAIA4AAKYGACAUAACnBgAgFQAAqAYAIBYAAKkGACAXAACqBgAgGAAAmgkAIBkAAKsGACDcAgEAvgUAId8CQAC_BQAh9AJAAL8FACGJAwEAvgUAIZMDAQC-BQAhlAMBAL4FACGVAwEAvgUAIZYDAgDpBQAhlwMBAL4FACGYAwEAygUAIZkDAQDKBQAhmgMAAJwGACCbAwEAygUAIZwDAQDKBQAhnQMQAJ0GACGeAxAAnQYAIZ8DAgCeBgAhoAMCAJ4GACGiAwAAnwaiAyKjAyAAzAUAIaQDIADMBQAhpQMIAKAGACGmAwIA6QUAIacDAgDpBQAhIggAAO0IACAJAADuCAAgDQAA7wgAIA4AAPAIACAUAADxCAAgFQAA8ggAIBYAAPMIACAXAAD0CAAgGAAApgkAIBkAAPUIACDcAgEAAAAB3wJAAAAAAfQCQAAAAAGJAwEAAAABkwMBAAAAAZQDAQAAAAGVAwEAAAABlgMCAAAAAZcDAQAAAAGYAwEAAAABmQMBAAAAAZoDAADrCAAgmwMBAAAAAZwDAQAAAAGdAxAAAAABngMQAAAAAZ8DAgAAAAGgAwIAAAABogMAAACiAwKjAyAAAAABpAMgAAAAAaUDCAAAAAGmAwIAAAABpwMCAAAAAQMtAACrCQAwxwMAAKwJADDNAwAAlgYAMAAAAAAAAAAAAAUtAAD3CQAgLgAA-gkAIMcDAAD4CQAgyAMAAPkJACDNAwAASAAgAy0AAPcJACDHAwAA-AkAIM0DAABIACAAAAAFLQAA8gkAIC4AAPUJACDHAwAA8wkAIMgDAAD0CQAgzQMAAEgAIAMtAADyCQAgxwMAAPMJACDNAwAASAAgAAAACi0AAMgJADAuAADLCQAwxwMAAMkJADDIAwAAygkAMMoDAACWBgAwywMAAJYGADDMAwAAlgYAMM0DAACWBgAwzgMAAMwJADDPAwAAmQYAMCIFAADsCAAgCAAA7QgAIAkAAO4IACANAADvCAAgDgAA8AgAIBQAAPEIACAVAADyCAAgFgAA8wgAIBcAAPQIACAYAACmCQAg3AIBAAAAAd8CQAAAAAH0AkAAAAABiQMBAAAAAZMDAQAAAAGUAwEAAAABlQMBAAAAAZYDAgAAAAGXAwEAAAABmAMBAAAAAZkDAQAAAAGaAwAA6wgAIJsDAQAAAAGcAwEAAAABnQMQAAAAAZ4DEAAAAAGfAwIAAAABoAMCAAAAAaIDAAAAogMCowMgAAAAAaQDIAAAAAGlAwgAAAABpgMCAAAAAacDAgAAAAECAAAADQAgLQAAzwkAIAMAAAANACAtAADPCQAgLgAAzgkAIAIAAAANACAmAADOCQAgAgAAAJoGACAmAADNCQAgGNwCAQC-BQAh3wJAAL8FACH0AkAAvwUAIYkDAQC-BQAhkwMBAL4FACGUAwEAvgUAIZUDAQC-BQAhlgMCAOkFACGXAwEAvgUAIZgDAQDKBQAhmQMBAMoFACGaAwAAnAYAIJsDAQDKBQAhnAMBAMoFACGdAxAAnQYAIZ4DEACdBgAhnwMCAJ4GACGgAwIAngYAIaIDAACfBqIDIqMDIADMBQAhpAMgAMwFACGlAwgAoAYAIaYDAgDpBQAhpwMCAOkFACEiBQAAogYAIAgAAKMGACAJAACkBgAgDQAApQYAIA4AAKYGACAUAACnBgAgFQAAqAYAIBYAAKkGACAXAACqBgAgGAAAmgkAINwCAQC-BQAh3wJAAL8FACH0AkAAvwUAIYkDAQC-BQAhkwMBAL4FACGUAwEAvgUAIZUDAQC-BQAhlgMCAOkFACGXAwEAvgUAIZgDAQDKBQAhmQMBAMoFACGaAwAAnAYAIJsDAQDKBQAhnAMBAMoFACGdAxAAnQYAIZ4DEACdBgAhnwMCAJ4GACGgAwIAngYAIaIDAACfBqIDIqMDIADMBQAhpAMgAMwFACGlAwgAoAYAIaYDAgDpBQAhpwMCAOkFACEiBQAA7AgAIAgAAO0IACAJAADuCAAgDQAA7wgAIA4AAPAIACAUAADxCAAgFQAA8ggAIBYAAPMIACAXAAD0CAAgGAAApgkAINwCAQAAAAHfAkAAAAAB9AJAAAAAAYkDAQAAAAGTAwEAAAABlAMBAAAAAZUDAQAAAAGWAwIAAAABlwMBAAAAAZgDAQAAAAGZAwEAAAABmgMAAOsIACCbAwEAAAABnAMBAAAAAZ0DEAAAAAGeAxAAAAABnwMCAAAAAaADAgAAAAGiAwAAAKIDAqMDIAAAAAGkAyAAAAABpQMIAAAAAaYDAgAAAAGnAwIAAAABAy0AAMgJADDHAwAAyQkAMM0DAACWBgAwAAAABS0AAO0JACAuAADwCQAgxwMAAO4JACDIAwAA7wkAIM0DAABIACADLQAA7QkAIMcDAADuCQAgzQMAAEgAIBAIAADfCQAgCwAA3QkAIA0AANoJACAOAADbCQAgDwAA1wkAIBYAAOMJACAXAADeCQAgGgAA2AkAIBsAANkJACAcAADcCQAgHQAA4AkAIB4AAOEJACAfAADiCQAgIAAA5AkAIIEDAADEBQAgvQMAAMQFACAAAAAAAAAKAwAA3AkAIAcAANYJACAKAADaCQAgDAAA2wkAIP8CAADEBQAggAMAAMQFACCBAwAAxAUAIIIDAADEBQAggwMAAMQFACCEAwAAxAUAIAAAAAAAAAAUBQAA6QkAIAgAAN8JACAJAADYCQAgDQAA2gkAIA4AANsJACAUAADiCQAgFQAA6gkAIBYAAOMJACAXAADeCQAgGAAA6wkAIBkAAOwJACCYAwAAxAUAIJkDAADEBQAgmwMAAMQFACCcAwAAxAUAIJ0DAADEBQAgngMAAMQFACCfAwAAxAUAIKADAADEBQAgpQMAAMQFACAGBwAA1gkAIA8AANcJACDvAgAAxAUAIPACAADEBQAg8QIAAMQFACDyAgAAxAUAIAYGAADlCQAgBwAA1gkAIA8AANcJACCHAwAAxAUAIIsDAADEBQAgjAMAAMQFACADBgAA5QkAIAcAANYJACASAADXCQAgAAAAABkIAACJCAAgCwAAhwgAIA0AAIUIACAOAACGCAAgDwAAiwgAIBYAAI4IACAXAACICAAgGgAAgwgAIBsAAIQIACAcAADQCQAgHQAAiggAIB4AAIwIACAfAACNCAAg3AIBAAAAAd8CQAAAAAHuAgAAALsDAvQCQAAAAAH_AgEAAAABgAMBAAAAAYEDAQAAAAGSAwAAALoDArgDIAAAAAG7AyAAAAABvAMgAAAAAb0DQAAAAAECAAAASAAgLQAA7QkAIAMAAABGACAtAADtCQAgLgAA8QkAIBsAAABGACAIAAC-BgAgCwAAvAYAIA0AALoGACAOAAC7BgAgDwAAwAYAIBYAAMMGACAXAAC9BgAgGgAAuAYAIBsAALkGACAcAADHCQAgHQAAvwYAIB4AAMEGACAfAADCBgAgJgAA8QkAINwCAQC-BQAh3wJAAL8FACHuAgAAtga7AyL0AkAAvwUAIf8CAQC-BQAhgAMBAL4FACGBAwEAygUAIZIDAAC1BroDIrgDIADMBQAhuwMgAMwFACG8AyAAzAUAIb0DQADLBQAhGQgAAL4GACALAAC8BgAgDQAAugYAIA4AALsGACAPAADABgAgFgAAwwYAIBcAAL0GACAaAAC4BgAgGwAAuQYAIBwAAMcJACAdAAC_BgAgHgAAwQYAIB8AAMIGACDcAgEAvgUAId8CQAC_BQAh7gIAALYGuwMi9AJAAL8FACH_AgEAvgUAIYADAQC-BQAhgQMBAMoFACGSAwAAtQa6AyK4AyAAzAUAIbsDIADMBQAhvAMgAMwFACG9A0AAywUAIRkIAACJCAAgCwAAhwgAIA0AAIUIACAOAACGCAAgDwAAiwgAIBYAAI4IACAXAACICAAgGgAAgwgAIBsAAIQIACAcAADQCQAgHgAAjAgAIB8AAI0IACAgAACPCAAg3AIBAAAAAd8CQAAAAAHuAgAAALsDAvQCQAAAAAH_AgEAAAABgAMBAAAAAYEDAQAAAAGSAwAAALoDArgDIAAAAAG7AyAAAAABvAMgAAAAAb0DQAAAAAECAAAASAAgLQAA8gkAIAMAAABGACAtAADyCQAgLgAA9gkAIBsAAABGACAIAAC-BgAgCwAAvAYAIA0AALoGACAOAAC7BgAgDwAAwAYAIBYAAMMGACAXAAC9BgAgGgAAuAYAIBsAALkGACAcAADHCQAgHgAAwQYAIB8AAMIGACAgAADEBgAgJgAA9gkAINwCAQC-BQAh3wJAAL8FACHuAgAAtga7AyL0AkAAvwUAIf8CAQC-BQAhgAMBAL4FACGBAwEAygUAIZIDAAC1BroDIrgDIADMBQAhuwMgAMwFACG8AyAAzAUAIb0DQADLBQAhGQgAAL4GACALAAC8BgAgDQAAugYAIA4AALsGACAPAADABgAgFgAAwwYAIBcAAL0GACAaAAC4BgAgGwAAuQYAIBwAAMcJACAeAADBBgAgHwAAwgYAICAAAMQGACDcAgEAvgUAId8CQAC_BQAh7gIAALYGuwMi9AJAAL8FACH_AgEAvgUAIYADAQC-BQAhgQMBAMoFACGSAwAAtQa6AyK4AyAAzAUAIbsDIADMBQAhvAMgAMwFACG9A0AAywUAIRkIAACJCAAgCwAAhwgAIA0AAIUIACAOAACGCAAgDwAAiwgAIBYAAI4IACAXAACICAAgGgAAgwgAIBwAANAJACAdAACKCAAgHgAAjAgAIB8AAI0IACAgAACPCAAg3AIBAAAAAd8CQAAAAAHuAgAAALsDAvQCQAAAAAH_AgEAAAABgAMBAAAAAYEDAQAAAAGSAwAAALoDArgDIAAAAAG7AyAAAAABvAMgAAAAAb0DQAAAAAECAAAASAAgLQAA9wkAIAMAAABGACAtAAD3CQAgLgAA-wkAIBsAAABGACAIAAC-BgAgCwAAvAYAIA0AALoGACAOAAC7BgAgDwAAwAYAIBYAAMMGACAXAAC9BgAgGgAAuAYAIBwAAMcJACAdAAC_BgAgHgAAwQYAIB8AAMIGACAgAADEBgAgJgAA-wkAINwCAQC-BQAh3wJAAL8FACHuAgAAtga7AyL0AkAAvwUAIf8CAQC-BQAhgAMBAL4FACGBAwEAygUAIZIDAAC1BroDIrgDIADMBQAhuwMgAMwFACG8AyAAzAUAIb0DQADLBQAhGQgAAL4GACALAAC8BgAgDQAAugYAIA4AALsGACAPAADABgAgFgAAwwYAIBcAAL0GACAaAAC4BgAgHAAAxwkAIB0AAL8GACAeAADBBgAgHwAAwgYAICAAAMQGACDcAgEAvgUAId8CQAC_BQAh7gIAALYGuwMi9AJAAL8FACH_AgEAvgUAIYADAQC-BQAhgQMBAMoFACGSAwAAtQa6AyK4AyAAzAUAIbsDIADMBQAhvAMgAMwFACG9A0AAywUAISIFAADsCAAgCAAA7QgAIAkAAO4IACANAADvCAAgDgAA8AgAIBQAAPEIACAWAADzCAAgFwAA9AgAIBgAAKYJACAZAAD1CAAg3AIBAAAAAd8CQAAAAAH0AkAAAAABiQMBAAAAAZMDAQAAAAGUAwEAAAABlQMBAAAAAZYDAgAAAAGXAwEAAAABmAMBAAAAAZkDAQAAAAGaAwAA6wgAIJsDAQAAAAGcAwEAAAABnQMQAAAAAZ4DEAAAAAGfAwIAAAABoAMCAAAAAaIDAAAAogMCowMgAAAAAaQDIAAAAAGlAwgAAAABpgMCAAAAAacDAgAAAAECAAAADQAgLQAA_AkAIAMAAAALACAtAAD8CQAgLgAAgAoAICQAAAALACAFAACiBgAgCAAAowYAIAkAAKQGACANAAClBgAgDgAApgYAIBQAAKcGACAWAACpBgAgFwAAqgYAIBgAAJoJACAZAACrBgAgJgAAgAoAINwCAQC-BQAh3wJAAL8FACH0AkAAvwUAIYkDAQC-BQAhkwMBAL4FACGUAwEAvgUAIZUDAQC-BQAhlgMCAOkFACGXAwEAvgUAIZgDAQDKBQAhmQMBAMoFACGaAwAAnAYAIJsDAQDKBQAhnAMBAMoFACGdAxAAnQYAIZ4DEACdBgAhnwMCAJ4GACGgAwIAngYAIaIDAACfBqIDIqMDIADMBQAhpAMgAMwFACGlAwgAoAYAIaYDAgDpBQAhpwMCAOkFACEiBQAAogYAIAgAAKMGACAJAACkBgAgDQAApQYAIA4AAKYGACAUAACnBgAgFgAAqQYAIBcAAKoGACAYAACaCQAgGQAAqwYAINwCAQC-BQAh3wJAAL8FACH0AkAAvwUAIYkDAQC-BQAhkwMBAL4FACGUAwEAvgUAIZUDAQC-BQAhlgMCAOkFACGXAwEAvgUAIZgDAQDKBQAhmQMBAMoFACGaAwAAnAYAIJsDAQDKBQAhnAMBAMoFACGdAxAAnQYAIZ4DEACdBgAhnwMCAJ4GACGgAwIAngYAIaIDAACfBqIDIqMDIADMBQAhpAMgAMwFACGlAwgAoAYAIaYDAgDpBQAhpwMCAOkFACEZCAAAiQgAIA0AAIUIACAOAACGCAAgDwAAiwgAIBYAAI4IACAXAACICAAgGgAAgwgAIBsAAIQIACAcAADQCQAgHQAAiggAIB4AAIwIACAfAACNCAAgIAAAjwgAINwCAQAAAAHfAkAAAAAB7gIAAAC7AwL0AkAAAAAB_wIBAAAAAYADAQAAAAGBAwEAAAABkgMAAAC6AwK4AyAAAAABuwMgAAAAAbwDIAAAAAG9A0AAAAABAgAAAEgAIC0AAIEKACAJ3AIBAAAAAd0CAQAAAAHfAkAAAAAB7gIAAAD4AgL0AkAAAAAB9QIBAAAAAfYCAgAAAAH4AgAA7gUAIPkCIAAAAAED3AIBAAAAAd0CAQAAAAHfAkAAAAABBdwCAQAAAAHdAgEAAAAB3wJAAAAAAfQCQAAAAAH-AgEAAAABBdwCAQAAAAHdAgEAAAAB3wJAAAAAAfQCQAAAAAH-AgEAAAABGQgAAIkIACALAACHCAAgDQAAhQgAIA4AAIYIACAPAACLCAAgFgAAjggAIBcAAIgIACAaAACDCAAgGwAAhAgAIBwAANAJACAdAACKCAAgHgAAjAgAICAAAI8IACDcAgEAAAAB3wJAAAAAAe4CAAAAuwMC9AJAAAAAAf8CAQAAAAGAAwEAAAABgQMBAAAAAZIDAAAAugMCuAMgAAAAAbsDIAAAAAG8AyAAAAABvQNAAAAAAQIAAABIACAtAACHCgAgAwAAAEYAIC0AAIcKACAuAACLCgAgGwAAAEYAIAgAAL4GACALAAC8BgAgDQAAugYAIA4AALsGACAPAADABgAgFgAAwwYAIBcAAL0GACAaAAC4BgAgGwAAuQYAIBwAAMcJACAdAAC_BgAgHgAAwQYAICAAAMQGACAmAACLCgAg3AIBAL4FACHfAkAAvwUAIe4CAAC2BrsDIvQCQAC_BQAh_wIBAL4FACGAAwEAvgUAIYEDAQDKBQAhkgMAALUGugMiuAMgAMwFACG7AyAAzAUAIbwDIADMBQAhvQNAAMsFACEZCAAAvgYAIAsAALwGACANAAC6BgAgDgAAuwYAIA8AAMAGACAWAADDBgAgFwAAvQYAIBoAALgGACAbAAC5BgAgHAAAxwkAIB0AAL8GACAeAADBBgAgIAAAxAYAINwCAQC-BQAh3wJAAL8FACHuAgAAtga7AyL0AkAAvwUAIf8CAQC-BQAhgAMBAL4FACGBAwEAygUAIZIDAAC1BroDIrgDIADMBQAhuwMgAMwFACG8AyAAzAUAIb0DQADLBQAhCtwCAQAAAAHdAgEAAAAB3wJAAAAAAe4CAAAAiwMC9AJAAAAAAYYDEAAAAAGHA0AAAAABiQMAAACJAwKLAwEAAAABjAMBAAAAAQTcAgEAAAAB_wIBAAAAAYEDAQAAAAGSAwEAAAABGQgAAIkIACALAACHCAAgDQAAhQgAIA4AAIYIACAPAACLCAAgFwAAiAgAIBoAAIMIACAbAACECAAgHAAA0AkAIB0AAIoIACAeAACMCAAgHwAAjQgAICAAAI8IACDcAgEAAAAB3wJAAAAAAe4CAAAAuwMC9AJAAAAAAf8CAQAAAAGAAwEAAAABgQMBAAAAAZIDAAAAugMCuAMgAAAAAbsDIAAAAAG8AyAAAAABvQNAAAAAAQIAAABIACAtAACOCgAgAwAAAEYAIC0AAI4KACAuAACSCgAgGwAAAEYAIAgAAL4GACALAAC8BgAgDQAAugYAIA4AALsGACAPAADABgAgFwAAvQYAIBoAALgGACAbAAC5BgAgHAAAxwkAIB0AAL8GACAeAADBBgAgHwAAwgYAICAAAMQGACAmAACSCgAg3AIBAL4FACHfAkAAvwUAIe4CAAC2BrsDIvQCQAC_BQAh_wIBAL4FACGAAwEAvgUAIYEDAQDKBQAhkgMAALUGugMiuAMgAMwFACG7AyAAzAUAIbwDIADMBQAhvQNAAMsFACEZCAAAvgYAIAsAALwGACANAAC6BgAgDgAAuwYAIA8AAMAGACAXAAC9BgAgGgAAuAYAIBsAALkGACAcAADHCQAgHQAAvwYAIB4AAMEGACAfAADCBgAgIAAAxAYAINwCAQC-BQAh3wJAAL8FACHuAgAAtga7AyL0AkAAvwUAIf8CAQC-BQAhgAMBAL4FACGBAwEAygUAIZIDAAC1BroDIrgDIADMBQAhuwMgAMwFACG8AyAAzAUAIb0DQADLBQAhB9wCAQAAAAHdAgEAAAAB3wJAAAAAAe4CAAAAhgMC9AJAAAAAAYYDEAAAAAGHA0AAAAABBNwCAQAAAAHdAgEAAAAB3wJAAAAAAf0CAgAAAAED3AIBAAAAAd4CAQAAAAHfAkAAAAABDNwCAQAAAAHfAkAAAAAB9AJAAAAAAawDAQAAAAGtAwEAAAABrgMBAAAAAa8DAQAAAAGwAwEAAAABsQNAAAAAAbIDQAAAAAGzAwEAAAABtAMBAAAAAQXcAgEAAAAB3gIBAAAAAd8CQAAAAAH0AkAAAAAB_gIBAAAAAQXcAgEAAAAB3gIBAAAAAd8CQAAAAAH0AkAAAAAB_gIBAAAAAQXcAgEAAAAB3QIBAAAAAd4CAQAAAAHfAkAAAAAB9AJAAAAAAQXcAgEAAAAB3QIBAAAAAd4CAQAAAAHfAkAAAAAB9AJAAAAAAQTcAgEAAAAB3gIBAAAAAd8CQAAAAAH9AgIAAAABCdwCAQAAAAHeAgEAAAAB3wJAAAAAAe4CAAAA-AIC9AJAAAAAAfUCAQAAAAH2AgIAAAAB-AIAAO4FACD5AiAAAAABB9wCAQAAAAHfAkAAAAAB9AJAAAAAAYcDQAAAAAG1AwEAAAABtgMBAAAAAbcDAQAAAAEJ3AIBAAAAAd8CQAAAAAHuAgEAAAABiwMBAAAAAY0DAQAAAAGOAwgAAAABjwMBAAAAAZADAQAAAAGRAwEAAAABCtwCAQAAAAHfAkAAAAAB7AIAAADsAgLuAgAAAO4CAu8CAQAAAAHwAgEAAAAB8QJAAAAAAfICQAAAAAHzAiAAAAAB9AJAAAAAASIFAADsCAAgCAAA7QgAIAkAAO4IACANAADvCAAgDgAA8AgAIBUAAPIIACAWAADzCAAgFwAA9AgAIBgAAKYJACAZAAD1CAAg3AIBAAAAAd8CQAAAAAH0AkAAAAABiQMBAAAAAZMDAQAAAAGUAwEAAAABlQMBAAAAAZYDAgAAAAGXAwEAAAABmAMBAAAAAZkDAQAAAAGaAwAA6wgAIJsDAQAAAAGcAwEAAAABnQMQAAAAAZ4DEAAAAAGfAwIAAAABoAMCAAAAAaIDAAAAogMCowMgAAAAAaQDIAAAAAGlAwgAAAABpgMCAAAAAacDAgAAAAECAAAADQAgLQAAoAoAIAncAgEAAAAB3QIBAAAAAd8CQAAAAAHuAgEAAAABiwMBAAAAAY0DAQAAAAGOAwgAAAABjwMBAAAAAZEDAQAAAAEDAAAACwAgLQAAoAoAIC4AAKUKACAkAAAACwAgBQAAogYAIAgAAKMGACAJAACkBgAgDQAApQYAIA4AAKYGACAVAACoBgAgFgAAqQYAIBcAAKoGACAYAACaCQAgGQAAqwYAICYAAKUKACDcAgEAvgUAId8CQAC_BQAh9AJAAL8FACGJAwEAvgUAIZMDAQC-BQAhlAMBAL4FACGVAwEAvgUAIZYDAgDpBQAhlwMBAL4FACGYAwEAygUAIZkDAQDKBQAhmgMAAJwGACCbAwEAygUAIZwDAQDKBQAhnQMQAJ0GACGeAxAAnQYAIZ8DAgCeBgAhoAMCAJ4GACGiAwAAnwaiAyKjAyAAzAUAIaQDIADMBQAhpQMIAKAGACGmAwIA6QUAIacDAgDpBQAhIgUAAKIGACAIAACjBgAgCQAApAYAIA0AAKUGACAOAACmBgAgFQAAqAYAIBYAAKkGACAXAACqBgAgGAAAmgkAIBkAAKsGACDcAgEAvgUAId8CQAC_BQAh9AJAAL8FACGJAwEAvgUAIZMDAQC-BQAhlAMBAL4FACGVAwEAvgUAIZYDAgDpBQAhlwMBAL4FACGYAwEAygUAIZkDAQDKBQAhmgMAAJwGACCbAwEAygUAIZwDAQDKBQAhnQMQAJ0GACGeAxAAnQYAIZ8DAgCeBgAhoAMCAJ4GACGiAwAAnwaiAyKjAyAAzAUAIaQDIADMBQAhpQMIAKAGACGmAwIA6QUAIacDAgDpBQAhCtwCAQAAAAHeAgEAAAAB3wJAAAAAAe4CAAAAiwMC9AJAAAAAAYYDEAAAAAGHA0AAAAABiQMAAACJAwKLAwEAAAABjAMBAAAAASIFAADsCAAgCAAA7QgAIAkAAO4IACANAADvCAAgDgAA8AgAIBQAAPEIACAVAADyCAAgFwAA9AgAIBgAAKYJACAZAAD1CAAg3AIBAAAAAd8CQAAAAAH0AkAAAAABiQMBAAAAAZMDAQAAAAGUAwEAAAABlQMBAAAAAZYDAgAAAAGXAwEAAAABmAMBAAAAAZkDAQAAAAGaAwAA6wgAIJsDAQAAAAGcAwEAAAABnQMQAAAAAZ4DEAAAAAGfAwIAAAABoAMCAAAAAaIDAAAAogMCowMgAAAAAaQDIAAAAAGlAwgAAAABpgMCAAAAAacDAgAAAAECAAAADQAgLQAApwoAIAwHAADiBQAg3AIBAAAAAd0CAQAAAAHfAkAAAAAB7AIAAADsAgLuAgAAAO4CAu8CAQAAAAHwAgEAAAAB8QJAAAAAAfICQAAAAAHzAiAAAAAB9AJAAAAAAQIAAABlACAtAACpCgAgAwAAAC4AIC0AAKkKACAuAACtCgAgDgAAAC4AIAcAAM0FACAmAACtCgAg3AIBAL4FACHdAgEAvgUAId8CQAC_BQAh7AIAAMgF7AIi7gIAAMkF7gIi7wIBAMoFACHwAgEAygUAIfECQADLBQAh8gJAAMsFACHzAiAAzAUAIfQCQAC_BQAhDAcAAM0FACDcAgEAvgUAId0CAQC-BQAh3wJAAL8FACHsAgAAyAXsAiLuAgAAyQXuAiLvAgEAygUAIfACAQDKBQAh8QJAAMsFACHyAkAAywUAIfMCIADMBQAh9AJAAL8FACEJ3AIBAAAAAd0CAQAAAAHfAkAAAAAB7gIBAAAAAYsDAQAAAAGNAwEAAAABjgMIAAAAAY8DAQAAAAGQAwEAAAABAwAAAAsAIC0AAKcKACAuAACxCgAgJAAAAAsAIAUAAKIGACAIAACjBgAgCQAApAYAIA0AAKUGACAOAACmBgAgFAAApwYAIBUAAKgGACAXAACqBgAgGAAAmgkAIBkAAKsGACAmAACxCgAg3AIBAL4FACHfAkAAvwUAIfQCQAC_BQAhiQMBAL4FACGTAwEAvgUAIZQDAQC-BQAhlQMBAL4FACGWAwIA6QUAIZcDAQC-BQAhmAMBAMoFACGZAwEAygUAIZoDAACcBgAgmwMBAMoFACGcAwEAygUAIZ0DEACdBgAhngMQAJ0GACGfAwIAngYAIaADAgCeBgAhogMAAJ8GogMiowMgAMwFACGkAyAAzAUAIaUDCACgBgAhpgMCAOkFACGnAwIA6QUAISIFAACiBgAgCAAAowYAIAkAAKQGACANAAClBgAgDgAApgYAIBQAAKcGACAVAACoBgAgFwAAqgYAIBgAAJoJACAZAACrBgAg3AIBAL4FACHfAkAAvwUAIfQCQAC_BQAhiQMBAL4FACGTAwEAvgUAIZQDAQC-BQAhlQMBAL4FACGWAwIA6QUAIZcDAQC-BQAhmAMBAMoFACGZAwEAygUAIZoDAACcBgAgmwMBAMoFACGcAwEAygUAIZ0DEACdBgAhngMQAJ0GACGfAwIAngYAIaADAgCeBgAhogMAAJ8GogMiowMgAMwFACGkAyAAzAUAIaUDCACgBgAhpgMCAOkFACGnAwIA6QUAIQfcAgEAAAAB3gIBAAAAAd8CQAAAAAHuAgAAAIYDAvQCQAAAAAGGAxAAAAABhwNAAAAAAQncAgEAAAAB3wJAAAAAAfQCQAAAAAH_AgEAAAABgAMBAAAAAbwDIAAAAAG9A0AAAAABvgMBAAAAAb8DAQAAAAEDAAAARgAgLQAAgQoAIC4AALYKACAbAAAARgAgCAAAvgYAIA0AALoGACAOAAC7BgAgDwAAwAYAIBYAAMMGACAXAAC9BgAgGgAAuAYAIBsAALkGACAcAADHCQAgHQAAvwYAIB4AAMEGACAfAADCBgAgIAAAxAYAICYAALYKACDcAgEAvgUAId8CQAC_BQAh7gIAALYGuwMi9AJAAL8FACH_AgEAvgUAIYADAQC-BQAhgQMBAMoFACGSAwAAtQa6AyK4AyAAzAUAIbsDIADMBQAhvAMgAMwFACG9A0AAywUAIRkIAAC-BgAgDQAAugYAIA4AALsGACAPAADABgAgFgAAwwYAIBcAAL0GACAaAAC4BgAgGwAAuQYAIBwAAMcJACAdAAC_BgAgHgAAwQYAIB8AAMIGACAgAADEBgAg3AIBAL4FACHfAkAAvwUAIe4CAAC2BrsDIvQCQAC_BQAh_wIBAL4FACGAAwEAvgUAIYEDAQDKBQAhkgMAALUGugMiuAMgAMwFACG7AyAAzAUAIbwDIADMBQAhvQNAAMsFACEZCAAAiQgAIAsAAIcIACAOAACGCAAgDwAAiwgAIBYAAI4IACAXAACICAAgGgAAgwgAIBsAAIQIACAcAADQCQAgHQAAiggAIB4AAIwIACAfAACNCAAgIAAAjwgAINwCAQAAAAHfAkAAAAAB7gIAAAC7AwL0AkAAAAAB_wIBAAAAAYADAQAAAAGBAwEAAAABkgMAAAC6AwK4AyAAAAABuwMgAAAAAbwDIAAAAAG9A0AAAAABAgAAAEgAIC0AALcKACANAwAAyQcAIAcAAIAJACAMAADIBwAg3AIBAAAAAd0CAQAAAAHfAkAAAAAB9AJAAAAAAf8CAQAAAAGAAwEAAAABgQMBAAAAAYIDAQAAAAGDAwEAAAABhAMBAAAAAQIAAABEACAtAAC5CgAgIgUAAOwIACAIAADtCAAgCQAA7ggAIA4AAPAIACAUAADxCAAgFQAA8ggAIBYAAPMIACAXAAD0CAAgGAAApgkAIBkAAPUIACDcAgEAAAAB3wJAAAAAAfQCQAAAAAGJAwEAAAABkwMBAAAAAZQDAQAAAAGVAwEAAAABlgMCAAAAAZcDAQAAAAGYAwEAAAABmQMBAAAAAZoDAADrCAAgmwMBAAAAAZwDAQAAAAGdAxAAAAABngMQAAAAAZ8DAgAAAAGgAwIAAAABogMAAACiAwKjAyAAAAABpAMgAAAAAaUDCAAAAAGmAwIAAAABpwMCAAAAAQIAAAANACAtAAC7CgAgAwAAAEYAIC0AALcKACAuAAC_CgAgGwAAAEYAIAgAAL4GACALAAC8BgAgDgAAuwYAIA8AAMAGACAWAADDBgAgFwAAvQYAIBoAALgGACAbAAC5BgAgHAAAxwkAIB0AAL8GACAeAADBBgAgHwAAwgYAICAAAMQGACAmAAC_CgAg3AIBAL4FACHfAkAAvwUAIe4CAAC2BrsDIvQCQAC_BQAh_wIBAL4FACGAAwEAvgUAIYEDAQDKBQAhkgMAALUGugMiuAMgAMwFACG7AyAAzAUAIbwDIADMBQAhvQNAAMsFACEZCAAAvgYAIAsAALwGACAOAAC7BgAgDwAAwAYAIBYAAMMGACAXAAC9BgAgGgAAuAYAIBsAALkGACAcAADHCQAgHQAAvwYAIB4AAMEGACAfAADCBgAgIAAAxAYAINwCAQC-BQAh3wJAAL8FACHuAgAAtga7AyL0AkAAvwUAIf8CAQC-BQAhgAMBAL4FACGBAwEAygUAIZIDAAC1BroDIrgDIADMBQAhuwMgAMwFACG8AyAAzAUAIb0DQADLBQAhAwAAABkAIC0AALkKACAuAADCCgAgDwAAABkAIAMAAJIGACAHAACRBgAgDAAAkAYAICYAAMIKACDcAgEAvgUAId0CAQC-BQAh3wJAAL8FACH0AkAAvwUAIf8CAQDKBQAhgAMBAMoFACGBAwEAygUAIYIDAQDKBQAhgwMBAMoFACGEAwEAygUAIQ0DAACSBgAgBwAAkQYAIAwAAJAGACDcAgEAvgUAId0CAQC-BQAh3wJAAL8FACH0AkAAvwUAIf8CAQDKBQAhgAMBAMoFACGBAwEAygUAIYIDAQDKBQAhgwMBAMoFACGEAwEAygUAIQMAAAALACAtAAC7CgAgLgAAxQoAICQAAAALACAFAACiBgAgCAAAowYAIAkAAKQGACAOAACmBgAgFAAApwYAIBUAAKgGACAWAACpBgAgFwAAqgYAIBgAAJoJACAZAACrBgAgJgAAxQoAINwCAQC-BQAh3wJAAL8FACH0AkAAvwUAIYkDAQC-BQAhkwMBAL4FACGUAwEAvgUAIZUDAQC-BQAhlgMCAOkFACGXAwEAvgUAIZgDAQDKBQAhmQMBAMoFACGaAwAAnAYAIJsDAQDKBQAhnAMBAMoFACGdAxAAnQYAIZ4DEACdBgAhnwMCAJ4GACGgAwIAngYAIaIDAACfBqIDIqMDIADMBQAhpAMgAMwFACGlAwgAoAYAIaYDAgDpBQAhpwMCAOkFACEiBQAAogYAIAgAAKMGACAJAACkBgAgDgAApgYAIBQAAKcGACAVAACoBgAgFgAAqQYAIBcAAKoGACAYAACaCQAgGQAAqwYAINwCAQC-BQAh3wJAAL8FACH0AkAAvwUAIYkDAQC-BQAhkwMBAL4FACGUAwEAvgUAIZUDAQC-BQAhlgMCAOkFACGXAwEAvgUAIZgDAQDKBQAhmQMBAMoFACGaAwAAnAYAIJsDAQDKBQAhnAMBAMoFACGdAxAAnQYAIZ4DEACdBgAhnwMCAJ4GACGgAwIAngYAIaIDAACfBqIDIqMDIADMBQAhpAMgAMwFACGlAwgAoAYAIaYDAgDpBQAhpwMCAOkFACEZCAAAiQgAIAsAAIcIACANAACFCAAgDwAAiwgAIBYAAI4IACAXAACICAAgGgAAgwgAIBsAAIQIACAcAADQCQAgHQAAiggAIB4AAIwIACAfAACNCAAgIAAAjwgAINwCAQAAAAHfAkAAAAAB7gIAAAC7AwL0AkAAAAAB_wIBAAAAAYADAQAAAAGBAwEAAAABkgMAAAC6AwK4AyAAAAABuwMgAAAAAbwDIAAAAAG9A0AAAAABAgAAAEgAIC0AAMYKACANAwAAyQcAIAcAAIAJACAKAADHBwAg3AIBAAAAAd0CAQAAAAHfAkAAAAAB9AJAAAAAAf8CAQAAAAGAAwEAAAABgQMBAAAAAYIDAQAAAAGDAwEAAAABhAMBAAAAAQIAAABEACAtAADICgAgIgUAAOwIACAIAADtCAAgCQAA7ggAIA0AAO8IACAUAADxCAAgFQAA8ggAIBYAAPMIACAXAAD0CAAgGAAApgkAIBkAAPUIACDcAgEAAAAB3wJAAAAAAfQCQAAAAAGJAwEAAAABkwMBAAAAAZQDAQAAAAGVAwEAAAABlgMCAAAAAZcDAQAAAAGYAwEAAAABmQMBAAAAAZoDAADrCAAgmwMBAAAAAZwDAQAAAAGdAxAAAAABngMQAAAAAZ8DAgAAAAGgAwIAAAABogMAAACiAwKjAyAAAAABpAMgAAAAAaUDCAAAAAGmAwIAAAABpwMCAAAAAQIAAAANACAtAADKCgAgAwAAAEYAIC0AAMYKACAuAADOCgAgGwAAAEYAIAgAAL4GACALAAC8BgAgDQAAugYAIA8AAMAGACAWAADDBgAgFwAAvQYAIBoAALgGACAbAAC5BgAgHAAAxwkAIB0AAL8GACAeAADBBgAgHwAAwgYAICAAAMQGACAmAADOCgAg3AIBAL4FACHfAkAAvwUAIe4CAAC2BrsDIvQCQAC_BQAh_wIBAL4FACGAAwEAvgUAIYEDAQDKBQAhkgMAALUGugMiuAMgAMwFACG7AyAAzAUAIbwDIADMBQAhvQNAAMsFACEZCAAAvgYAIAsAALwGACANAAC6BgAgDwAAwAYAIBYAAMMGACAXAAC9BgAgGgAAuAYAIBsAALkGACAcAADHCQAgHQAAvwYAIB4AAMEGACAfAADCBgAgIAAAxAYAINwCAQC-BQAh3wJAAL8FACHuAgAAtga7AyL0AkAAvwUAIf8CAQC-BQAhgAMBAL4FACGBAwEAygUAIZIDAAC1BroDIrgDIADMBQAhuwMgAMwFACG8AyAAzAUAIb0DQADLBQAhAwAAABkAIC0AAMgKACAuAADRCgAgDwAAABkAIAMAAJIGACAHAACRBgAgCgAAjwYAICYAANEKACDcAgEAvgUAId0CAQC-BQAh3wJAAL8FACH0AkAAvwUAIf8CAQDKBQAhgAMBAMoFACGBAwEAygUAIYIDAQDKBQAhgwMBAMoFACGEAwEAygUAIQ0DAACSBgAgBwAAkQYAIAoAAI8GACDcAgEAvgUAId0CAQC-BQAh3wJAAL8FACH0AkAAvwUAIf8CAQDKBQAhgAMBAMoFACGBAwEAygUAIYIDAQDKBQAhgwMBAMoFACGEAwEAygUAIQMAAAALACAtAADKCgAgLgAA1AoAICQAAAALACAFAACiBgAgCAAAowYAIAkAAKQGACANAAClBgAgFAAApwYAIBUAAKgGACAWAACpBgAgFwAAqgYAIBgAAJoJACAZAACrBgAgJgAA1AoAINwCAQC-BQAh3wJAAL8FACH0AkAAvwUAIYkDAQC-BQAhkwMBAL4FACGUAwEAvgUAIZUDAQC-BQAhlgMCAOkFACGXAwEAvgUAIZgDAQDKBQAhmQMBAMoFACGaAwAAnAYAIJsDAQDKBQAhnAMBAMoFACGdAxAAnQYAIZ4DEACdBgAhnwMCAJ4GACGgAwIAngYAIaIDAACfBqIDIqMDIADMBQAhpAMgAMwFACGlAwgAoAYAIaYDAgDpBQAhpwMCAOkFACEiBQAAogYAIAgAAKMGACAJAACkBgAgDQAApQYAIBQAAKcGACAVAACoBgAgFgAAqQYAIBcAAKoGACAYAACaCQAgGQAAqwYAINwCAQC-BQAh3wJAAL8FACH0AkAAvwUAIYkDAQC-BQAhkwMBAL4FACGUAwEAvgUAIZUDAQC-BQAhlgMCAOkFACGXAwEAvgUAIZgDAQDKBQAhmQMBAMoFACGaAwAAnAYAIJsDAQDKBQAhnAMBAMoFACGdAxAAnQYAIZ4DEACdBgAhnwMCAJ4GACGgAwIAngYAIaIDAACfBqIDIqMDIADMBQAhpAMgAMwFACGlAwgAoAYAIaYDAgDpBQAhpwMCAOkFACEZCAAAiQgAIAsAAIcIACANAACFCAAgDgAAhggAIA8AAIsIACAWAACOCAAgGgAAgwgAIBsAAIQIACAcAADQCQAgHQAAiggAIB4AAIwIACAfAACNCAAgIAAAjwgAINwCAQAAAAHfAkAAAAAB7gIAAAC7AwL0AkAAAAAB_wIBAAAAAYADAQAAAAGBAwEAAAABkgMAAAC6AwK4AyAAAAABuwMgAAAAAbwDIAAAAAG9A0AAAAABAgAAAEgAIC0AANUKACAiBQAA7AgAIAgAAO0IACAJAADuCAAgDQAA7wgAIA4AAPAIACAUAADxCAAgFQAA8ggAIBYAAPMIACAYAACmCQAgGQAA9QgAINwCAQAAAAHfAkAAAAAB9AJAAAAAAYkDAQAAAAGTAwEAAAABlAMBAAAAAZUDAQAAAAGWAwIAAAABlwMBAAAAAZgDAQAAAAGZAwEAAAABmgMAAOsIACCbAwEAAAABnAMBAAAAAZ0DEAAAAAGeAxAAAAABnwMCAAAAAaADAgAAAAGiAwAAAKIDAqMDIAAAAAGkAyAAAAABpQMIAAAAAaYDAgAAAAGnAwIAAAABAgAAAA0AIC0AANcKACADAAAARgAgLQAA1QoAIC4AANsKACAbAAAARgAgCAAAvgYAIAsAALwGACANAAC6BgAgDgAAuwYAIA8AAMAGACAWAADDBgAgGgAAuAYAIBsAALkGACAcAADHCQAgHQAAvwYAIB4AAMEGACAfAADCBgAgIAAAxAYAICYAANsKACDcAgEAvgUAId8CQAC_BQAh7gIAALYGuwMi9AJAAL8FACH_AgEAvgUAIYADAQC-BQAhgQMBAMoFACGSAwAAtQa6AyK4AyAAzAUAIbsDIADMBQAhvAMgAMwFACG9A0AAywUAIRkIAAC-BgAgCwAAvAYAIA0AALoGACAOAAC7BgAgDwAAwAYAIBYAAMMGACAaAAC4BgAgGwAAuQYAIBwAAMcJACAdAAC_BgAgHgAAwQYAIB8AAMIGACAgAADEBgAg3AIBAL4FACHfAkAAvwUAIe4CAAC2BrsDIvQCQAC_BQAh_wIBAL4FACGAAwEAvgUAIYEDAQDKBQAhkgMAALUGugMiuAMgAMwFACG7AyAAzAUAIbwDIADMBQAhvQNAAMsFACEDAAAACwAgLQAA1woAIC4AAN4KACAkAAAACwAgBQAAogYAIAgAAKMGACAJAACkBgAgDQAApQYAIA4AAKYGACAUAACnBgAgFQAAqAYAIBYAAKkGACAYAACaCQAgGQAAqwYAICYAAN4KACDcAgEAvgUAId8CQAC_BQAh9AJAAL8FACGJAwEAvgUAIZMDAQC-BQAhlAMBAL4FACGVAwEAvgUAIZYDAgDpBQAhlwMBAL4FACGYAwEAygUAIZkDAQDKBQAhmgMAAJwGACCbAwEAygUAIZwDAQDKBQAhnQMQAJ0GACGeAxAAnQYAIZ8DAgCeBgAhoAMCAJ4GACGiAwAAnwaiAyKjAyAAzAUAIaQDIADMBQAhpQMIAKAGACGmAwIA6QUAIacDAgDpBQAhIgUAAKIGACAIAACjBgAgCQAApAYAIA0AAKUGACAOAACmBgAgFAAApwYAIBUAAKgGACAWAACpBgAgGAAAmgkAIBkAAKsGACDcAgEAvgUAId8CQAC_BQAh9AJAAL8FACGJAwEAvgUAIZMDAQC-BQAhlAMBAL4FACGVAwEAvgUAIZYDAgDpBQAhlwMBAL4FACGYAwEAygUAIZkDAQDKBQAhmgMAAJwGACCbAwEAygUAIZwDAQDKBQAhnQMQAJ0GACGeAxAAnQYAIZ8DAgCeBgAhoAMCAJ4GACGiAwAAnwaiAyKjAyAAzAUAIaQDIADMBQAhpQMIAKAGACGmAwIA6QUAIacDAgDpBQAhGQsAAIcIACANAACFCAAgDgAAhggAIA8AAIsIACAWAACOCAAgFwAAiAgAIBoAAIMIACAbAACECAAgHAAA0AkAIB0AAIoIACAeAACMCAAgHwAAjQgAICAAAI8IACDcAgEAAAAB3wJAAAAAAe4CAAAAuwMC9AJAAAAAAf8CAQAAAAGAAwEAAAABgQMBAAAAAZIDAAAAugMCuAMgAAAAAbsDIAAAAAG8AyAAAAABvQNAAAAAAQIAAABIACAtAADfCgAgIgUAAOwIACAJAADuCAAgDQAA7wgAIA4AAPAIACAUAADxCAAgFQAA8ggAIBYAAPMIACAXAAD0CAAgGAAApgkAIBkAAPUIACDcAgEAAAAB3wJAAAAAAfQCQAAAAAGJAwEAAAABkwMBAAAAAZQDAQAAAAGVAwEAAAABlgMCAAAAAZcDAQAAAAGYAwEAAAABmQMBAAAAAZoDAADrCAAgmwMBAAAAAZwDAQAAAAGdAxAAAAABngMQAAAAAZ8DAgAAAAGgAwIAAAABogMAAACiAwKjAyAAAAABpAMgAAAAAaUDCAAAAAGmAwIAAAABpwMCAAAAAQIAAAANACAtAADhCgAgAwAAAEYAIC0AAN8KACAuAADlCgAgGwAAAEYAIAsAALwGACANAAC6BgAgDgAAuwYAIA8AAMAGACAWAADDBgAgFwAAvQYAIBoAALgGACAbAAC5BgAgHAAAxwkAIB0AAL8GACAeAADBBgAgHwAAwgYAICAAAMQGACAmAADlCgAg3AIBAL4FACHfAkAAvwUAIe4CAAC2BrsDIvQCQAC_BQAh_wIBAL4FACGAAwEAvgUAIYEDAQDKBQAhkgMAALUGugMiuAMgAMwFACG7AyAAzAUAIbwDIADMBQAhvQNAAMsFACEZCwAAvAYAIA0AALoGACAOAAC7BgAgDwAAwAYAIBYAAMMGACAXAAC9BgAgGgAAuAYAIBsAALkGACAcAADHCQAgHQAAvwYAIB4AAMEGACAfAADCBgAgIAAAxAYAINwCAQC-BQAh3wJAAL8FACHuAgAAtga7AyL0AkAAvwUAIf8CAQC-BQAhgAMBAL4FACGBAwEAygUAIZIDAAC1BroDIrgDIADMBQAhuwMgAMwFACG8AyAAzAUAIb0DQADLBQAhAwAAAAsAIC0AAOEKACAuAADoCgAgJAAAAAsAIAUAAKIGACAJAACkBgAgDQAApQYAIA4AAKYGACAUAACnBgAgFQAAqAYAIBYAAKkGACAXAACqBgAgGAAAmgkAIBkAAKsGACAmAADoCgAg3AIBAL4FACHfAkAAvwUAIfQCQAC_BQAhiQMBAL4FACGTAwEAvgUAIZQDAQC-BQAhlQMBAL4FACGWAwIA6QUAIZcDAQC-BQAhmAMBAMoFACGZAwEAygUAIZoDAACcBgAgmwMBAMoFACGcAwEAygUAIZ0DEACdBgAhngMQAJ0GACGfAwIAngYAIaADAgCeBgAhogMAAJ8GogMiowMgAMwFACGkAyAAzAUAIaUDCACgBgAhpgMCAOkFACGnAwIA6QUAISIFAACiBgAgCQAApAYAIA0AAKUGACAOAACmBgAgFAAApwYAIBUAAKgGACAWAACpBgAgFwAAqgYAIBgAAJoJACAZAACrBgAg3AIBAL4FACHfAkAAvwUAIfQCQAC_BQAhiQMBAL4FACGTAwEAvgUAIZQDAQC-BQAhlQMBAL4FACGWAwIA6QUAIZcDAQC-BQAhmAMBAMoFACGZAwEAygUAIZoDAACcBgAgmwMBAMoFACGcAwEAygUAIZ0DEACdBgAhngMQAJ0GACGfAwIAngYAIaADAgCeBgAhogMAAJ8GogMiowMgAMwFACGkAyAAzAUAIaUDCACgBgAhpgMCAOkFACGnAwIA6QUAIRkIAACJCAAgCwAAhwgAIA0AAIUIACAOAACGCAAgDwAAiwgAIBYAAI4IACAXAACICAAgGgAAgwgAIBsAAIQIACAcAADQCQAgHQAAiggAIB8AAI0IACAgAACPCAAg3AIBAAAAAd8CQAAAAAHuAgAAALsDAvQCQAAAAAH_AgEAAAABgAMBAAAAAYEDAQAAAAGSAwAAALoDArgDIAAAAAG7AyAAAAABvAMgAAAAAb0DQAAAAAECAAAASAAgLQAA6QoAIAoGAADsBgAgBwAAowgAINwCAQAAAAHdAgEAAAAB3gIBAAAAAd8CQAAAAAHuAgAAAIYDAvQCQAAAAAGGAxAAAAABhwNAAAAAAQIAAAA9ACAtAADrCgAgDQYAAIcHACAHAAC6CAAg3AIBAAAAAd0CAQAAAAHeAgEAAAAB3wJAAAAAAe4CAAAAiwMC9AJAAAAAAYYDEAAAAAGHA0AAAAABiQMAAACJAwKLAwEAAAABjAMBAAAAAQIAAAAoACAtAADtCgAgGQgAAIkIACALAACHCAAgDQAAhQgAIA4AAIYIACAWAACOCAAgFwAAiAgAIBoAAIMIACAbAACECAAgHAAA0AkAIB0AAIoIACAeAACMCAAgHwAAjQgAICAAAI8IACDcAgEAAAAB3wJAAAAAAe4CAAAAuwMC9AJAAAAAAf8CAQAAAAGAAwEAAAABgQMBAAAAAZIDAAAAugMCuAMgAAAAAbsDIAAAAAG8AyAAAAABvQNAAAAAAQIAAABIACAtAADvCgAgAwAAADMAIC0AAOsKACAuAADzCgAgDAAAADMAIAYAAN4GACAHAAChCAAgJgAA8woAINwCAQC-BQAh3QIBAL4FACHeAgEAvgUAId8CQAC_BQAh7gIAANsGhgMi9AJAAL8FACGGAxAA3AYAIYcDQAC_BQAhCgYAAN4GACAHAAChCAAg3AIBAL4FACHdAgEAvgUAId4CAQC-BQAh3wJAAL8FACHuAgAA2waGAyL0AkAAvwUAIYYDEADcBgAhhwNAAL8FACEDAAAAJgAgLQAA7QoAIC4AAPYKACAPAAAAJgAgBgAA-wYAIAcAALgIACAmAAD2CgAg3AIBAL4FACHdAgEAvgUAId4CAQC-BQAh3wJAAL8FACHuAgAA-QaLAyL0AkAAvwUAIYYDEADcBgAhhwNAAMsFACGJAwAA-AaJAyKLAwEAygUAIYwDAQDKBQAhDQYAAPsGACAHAAC4CAAg3AIBAL4FACHdAgEAvgUAId4CAQC-BQAh3wJAAL8FACHuAgAA-QaLAyL0AkAAvwUAIYYDEADcBgAhhwNAAMsFACGJAwAA-AaJAyKLAwEAygUAIYwDAQDKBQAhAwAAAEYAIC0AAO8KACAuAAD5CgAgGwAAAEYAIAgAAL4GACALAAC8BgAgDQAAugYAIA4AALsGACAWAADDBgAgFwAAvQYAIBoAALgGACAbAAC5BgAgHAAAxwkAIB0AAL8GACAeAADBBgAgHwAAwgYAICAAAMQGACAmAAD5CgAg3AIBAL4FACHfAkAAvwUAIe4CAAC2BrsDIvQCQAC_BQAh_wIBAL4FACGAAwEAvgUAIYEDAQDKBQAhkgMAALUGugMiuAMgAMwFACG7AyAAzAUAIbwDIADMBQAhvQNAAMsFACEZCAAAvgYAIAsAALwGACANAAC6BgAgDgAAuwYAIBYAAMMGACAXAAC9BgAgGgAAuAYAIBsAALkGACAcAADHCQAgHQAAvwYAIB4AAMEGACAfAADCBgAgIAAAxAYAINwCAQC-BQAh3wJAAL8FACHuAgAAtga7AyL0AkAAvwUAIf8CAQC-BQAhgAMBAL4FACGBAwEAygUAIZIDAAC1BroDIrgDIADMBQAhuwMgAMwFACG8AyAAzAUAIb0DQADLBQAhCdwCAQAAAAHdAgEAAAAB3wJAAAAAAe4CAQAAAAGLAwEAAAABjgMIAAAAAY8DAQAAAAGQAwEAAAABkQMBAAAAAQMAAABGACAtAADpCgAgLgAA_QoAIBsAAABGACAIAAC-BgAgCwAAvAYAIA0AALoGACAOAAC7BgAgDwAAwAYAIBYAAMMGACAXAAC9BgAgGgAAuAYAIBsAALkGACAcAADHCQAgHQAAvwYAIB8AAMIGACAgAADEBgAgJgAA_QoAINwCAQC-BQAh3wJAAL8FACHuAgAAtga7AyL0AkAAvwUAIf8CAQC-BQAhgAMBAL4FACGBAwEAygUAIZIDAAC1BroDIrgDIADMBQAhuwMgAMwFACG8AyAAzAUAIb0DQADLBQAhGQgAAL4GACALAAC8BgAgDQAAugYAIA4AALsGACAPAADABgAgFgAAwwYAIBcAAL0GACAaAAC4BgAgGwAAuQYAIBwAAMcJACAdAAC_BgAgHwAAwgYAICAAAMQGACDcAgEAvgUAId8CQAC_BQAh7gIAALYGuwMi9AJAAL8FACH_AgEAvgUAIYADAQC-BQAhgQMBAMoFACGSAwAAtQa6AyK4AyAAzAUAIbsDIADMBQAhvAMgAMwFACG9A0AAywUAIRkIAACJCAAgCwAAhwgAIA0AAIUIACAOAACGCAAgDwAAiwgAIBYAAI4IACAXAACICAAgGwAAhAgAIBwAANAJACAdAACKCAAgHgAAjAgAIB8AAI0IACAgAACPCAAg3AIBAAAAAd8CQAAAAAHuAgAAALsDAvQCQAAAAAH_AgEAAAABgAMBAAAAAYEDAQAAAAGSAwAAALoDArgDIAAAAAG7AyAAAAABvAMgAAAAAb0DQAAAAAECAAAASAAgLQAA_goAICIFAADsCAAgCAAA7QgAIA0AAO8IACAOAADwCAAgFAAA8QgAIBUAAPIIACAWAADzCAAgFwAA9AgAIBgAAKYJACAZAAD1CAAg3AIBAAAAAd8CQAAAAAH0AkAAAAABiQMBAAAAAZMDAQAAAAGUAwEAAAABlQMBAAAAAZYDAgAAAAGXAwEAAAABmAMBAAAAAZkDAQAAAAGaAwAA6wgAIJsDAQAAAAGcAwEAAAABnQMQAAAAAZ4DEAAAAAGfAwIAAAABoAMCAAAAAaIDAAAAogMCowMgAAAAAaQDIAAAAAGlAwgAAAABpgMCAAAAAacDAgAAAAECAAAADQAgLQAAgAsAIAMAAABGACAtAAD-CgAgLgAAhAsAIBsAAABGACAIAAC-BgAgCwAAvAYAIA0AALoGACAOAAC7BgAgDwAAwAYAIBYAAMMGACAXAAC9BgAgGwAAuQYAIBwAAMcJACAdAAC_BgAgHgAAwQYAIB8AAMIGACAgAADEBgAgJgAAhAsAINwCAQC-BQAh3wJAAL8FACHuAgAAtga7AyL0AkAAvwUAIf8CAQC-BQAhgAMBAL4FACGBAwEAygUAIZIDAAC1BroDIrgDIADMBQAhuwMgAMwFACG8AyAAzAUAIb0DQADLBQAhGQgAAL4GACALAAC8BgAgDQAAugYAIA4AALsGACAPAADABgAgFgAAwwYAIBcAAL0GACAbAAC5BgAgHAAAxwkAIB0AAL8GACAeAADBBgAgHwAAwgYAICAAAMQGACDcAgEAvgUAId8CQAC_BQAh7gIAALYGuwMi9AJAAL8FACH_AgEAvgUAIYADAQC-BQAhgQMBAMoFACGSAwAAtQa6AyK4AyAAzAUAIbsDIADMBQAhvAMgAMwFACG9A0AAywUAIQMAAAALACAtAACACwAgLgAAhwsAICQAAAALACAFAACiBgAgCAAAowYAIA0AAKUGACAOAACmBgAgFAAApwYAIBUAAKgGACAWAACpBgAgFwAAqgYAIBgAAJoJACAZAACrBgAgJgAAhwsAINwCAQC-BQAh3wJAAL8FACH0AkAAvwUAIYkDAQC-BQAhkwMBAL4FACGUAwEAvgUAIZUDAQC-BQAhlgMCAOkFACGXAwEAvgUAIZgDAQDKBQAhmQMBAMoFACGaAwAAnAYAIJsDAQDKBQAhnAMBAMoFACGdAxAAnQYAIZ4DEACdBgAhnwMCAJ4GACGgAwIAngYAIaIDAACfBqIDIqMDIADMBQAhpAMgAMwFACGlAwgAoAYAIaYDAgDpBQAhpwMCAOkFACEiBQAAogYAIAgAAKMGACANAAClBgAgDgAApgYAIBQAAKcGACAVAACoBgAgFgAAqQYAIBcAAKoGACAYAACaCQAgGQAAqwYAINwCAQC-BQAh3wJAAL8FACH0AkAAvwUAIYkDAQC-BQAhkwMBAL4FACGUAwEAvgUAIZUDAQC-BQAhlgMCAOkFACGXAwEAvgUAIZgDAQDKBQAhmQMBAMoFACGaAwAAnAYAIJsDAQDKBQAhnAMBAMoFACGdAxAAnQYAIZ4DEACdBgAhnwMCAJ4GACGgAwIAngYAIaIDAACfBqIDIqMDIADMBQAhpAMgAMwFACGlAwgAoAYAIaYDAgDpBQAhpwMCAOkFACEBBwACDwQAGAheBwtcCQ1ZCA5aCg9jDRZoEBddFBoGAxtYFhxbBB1iFx5mDh9nDCBrAQIGAAQHAAIMBAAVBQoFCBMHCRQDDRgIDiUKFCkMFTsTFj4QF0IUGEUJGUkCAgMOBAQABgEDDwACBgAEBwACAwYABAcAAgsaCQUDIQQEAAsHAAIKGwgMHwoDBgAEBwACCyAJAwMkAAoiAAwjAAQEABIGAAQHAAIPLQ0EBwACEC8OETIMEzQQAwQADwcAAg8wDQEPMQAEBAARBgAEBwACEjUNARI2AAEPNwABBgAEAgYABAcAAgsFSgAISwAJTAANTQAOTgAUTwAVUAAWUQAXUgAYUwAZVAABBwACAQcAAg0IcgANbgAObwAPdAAWdwAXcQAabAAbbQAccAAdcwAedQAfdgAgeAAAAQcAAgEHAAIDBAAdMwAeNAAfAAAAAwQAHTMAHjQAHwAAAwQAJDMAJTQAJgAAAAMEACQzACU0ACYBBwACAQcAAgMEACszACw0AC0AAAADBAArMwAsNAAtAQcAAgEHAAIDBAAyMwAzNAA0AAAAAwQAMjMAMzQANAAAAAMEADozADs0ADwAAAADBAA6MwA7NAA8AAAAAwQAQjMAQzQARAAAAAMEAEIzAEM0AEQAAAMEAEkzAEo0AEsAAAADBABJMwBKNABLAAAFBABQMwBTNABUpQEAUaYBAFIAAAAAAAUEAFAzAFM0AFSlAQBRpgEAUgEGAAQBBgAEAwQAWTMAWjQAWwAAAAMEAFkzAFo0AFsEBwACEM4CDhHPAgwT0AIQBAcAAhDWAg4R1wIME9gCEAUEAGAzAGM0AGSlAQBhpgEAYgAAAAAABQQAYDMAYzQAZKUBAGGmAQBiAgYABAcAAgIGAAQHAAIFBABpMwBsNABtpQEAaqYBAGsAAAAAAAUEAGkzAGw0AG2lAQBqpgEAawIGAAQHAAICBgAEBwACBQQAcjMAdTQAdqUBAHOmAQB0AAAAAAAFBAByMwB1NAB2pQEAc6YBAHQBBwACAQcAAgMEAHszAHw0AH0AAAADBAB7MwB8NAB9AwYABAcAAgusAwkDBgAEBwACC7IDCQMEAIIBMwCDATQAhAEAAAADBACCATMAgwE0AIQBAwYABAcAAgvEAwkDBgAEBwACC8oDCQMEAIkBMwCKATQAiwEAAAADBACJATMAigE0AIsBAgYABAcAAgIGAAQHAAIFBACQATMAkwE0AJQBpQEAkQGmAQCSAQAAAAAABQQAkAEzAJMBNACUAaUBAJEBpgEAkgECBgAEBwACAgYABAcAAgUEAJkBMwCcATQAnQGlAQCaAaYBAJsBAAAAAAAFBACZATMAnAE0AJ0BpQEAmgGmAQCbAQEHAAIBBwACAwQAogEzAKMBNACkAQAAAAMEAKIBMwCjATQApAECBgAEBwACAgYABAcAAgMEAKkBMwCqATQAqwEAAAADBACpATMAqgE0AKsBIQIBInkBI3oBJHsBJXwBJ34BKIABGSmBARoqgwEBK4UBGSyGARsvhwEBMIgBATGJARk1jAEcNo0BIDeOAQI4jwECOZABAjqRAQI7kgECPJQBAj2WARk-lwEhP5kBAkCbARlBnAEiQp0BAkOeAQJEnwEZRaIBI0ajASdHpAEXSKUBF0mmARdKpwEXS6gBF0yqARdNrAEZTq0BKE-vARdQsQEZUbIBKVKzARdTtAEXVLUBGVW4ASpWuQEuV7oBFli7ARZZvAEWWr0BFlu-ARZcwAEWXcIBGV7DAS9fxQEWYMcBGWHIATBiyQEWY8oBFmTLARllzgExZs8BNWfRATZo0gE2adUBNmrWATZr1wE2bNkBNm3bARlu3AE3b94BNnDgARlx4QE4cuIBNnPjATZ05AEZdecBOXboAT136gE-eOsBPnnuAT567wE-e_ABPnzyAT599AEZfvUBP3_3AT6AAfkBGYEB-gFAggH7AT6DAfwBPoQB_QEZhQGAAkGGAYECRYcBggIFiAGDAgWJAYQCBYoBhQIFiwGGAgWMAYgCBY0BigIZjgGLAkaPAY0CBZABjwIZkQGQAkeSAZECBZMBkgIFlAGTAhmVAZYCSJYBlwJMlwGYAgSYAZkCBJkBmgIEmgGbAgSbAZwCBJwBngIEnQGgAhmeAaECTZ8BowIEoAGlAhmhAaYCTqIBpwIEowGoAgSkAakCGacBrAJPqAGtAlWpAa4CE6oBrwITqwGwAhOsAbECE60BsgITrgG0AhOvAbYCGbABtwJWsQG5AhOyAbsCGbMBvAJXtAG9AhO1Ab4CE7YBvwIZtwHCAli4AcMCXLkBxAINugHFAg27AcYCDbwBxwINvQHIAg2-AcoCDb8BzAIZwAHNAl3BAdICDcIB1AIZwwHVAl7EAdkCDcUB2gINxgHbAhnHAd4CX8gB3wJlyQHgAgzKAeECDMsB4gIMzAHjAgzNAeQCDM4B5gIMzwHoAhnQAekCZtEB6wIM0gHtAhnTAe4CZ9QB7wIM1QHwAgzWAfECGdcB9AJo2AH1Am7ZAfYCENoB9wIQ2wH4AhDcAfkCEN0B-gIQ3gH8AhDfAf4CGeAB_wJv4QGBAxDiAYMDGeMBhANw5AGFAxDlAYYDEOYBhwMZ5wGKA3HoAYsDd-kBjAMJ6gGNAwnrAY4DCewBjwMJ7QGQAwnuAZIDCe8BlAMZ8AGVA3jxAZcDCfIBmQMZ8wGaA3n0AZsDCfUBnAMJ9gGdAxn3AaADevgBoQN--QGiAwj6AaMDCPsBpAMI_AGlAwj9AaYDCP4BqAMI_wGqAxmAAqsDf4ECrgMIggKwAxmDArEDgAGEArMDCIUCtAMIhgK1AxmHArgDgQGIArkDhQGJAroDCooCuwMKiwK8AwqMAr0DCo0CvgMKjgLAAwqPAsIDGZACwwOGAZECxgMKkgLIAxmTAskDhwGUAssDCpUCzAMKlgLNAxmXAtADiAGYAtEDjAGZAtIDFJoC0wMUmwLUAxScAtUDFJ0C1gMUngLYAxSfAtoDGaAC2wONAaEC3QMUogLfAxmjAuADjgGkAuEDFKUC4gMUpgLjAxmnAuYDjwGoAucDlQGpAugDB6oC6QMHqwLqAwesAusDB60C7AMHrgLuAwevAvADGbAC8QOWAbEC8wMHsgL1AxmzAvYDlwG0AvcDB7UC-AMHtgL5Axm3AvwDmAG4Av0DngG5Av4DDroC_wMOuwKABA68AoEEDr0CggQOvgKEBA6_AoYEGcAChwSfAcECiQQOwgKLBBnDAowEoAHEAo0EDsUCjgQOxgKPBBnHApIEoQHIApMEpQHJApQEA8oClQQDywKWBAPMApcEA80CmAQDzgKaBAPPApwEGdACnQSmAdECnwQD0gKhBBnTAqIEpwHUAqMEA9UCpAQD1gKlBBnXAqgEqAHYAqkErAE"
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
  ContactMessageScalarFieldEnum: () => ContactMessageScalarFieldEnum,
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
  ContactMessage: "ContactMessage",
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
var ContactMessageScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  message: "message",
  isRead: "isRead",
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
  images: "images",
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
import { Router as Router13 } from "express";

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
var resetPassword = async (email, newPassword, otp) => {
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
  console.log(req.body);
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
  currentPassword: z.string().min(6, "Password must be at least 6 characters long"),
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
  const userId = req.user.userId;
  const { name, image } = req.body;
  const result = await UserService.updateProfile(userId, { name, image });
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
router2.patch("/profile", checkAuth(Role.USER, Role.ADMIN), UserController.updateProfile);
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
      images: Array.isArray(data.images) ? data.images : [],
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
  images: z3.array(z3.string()).optional(),
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
  images: z3.array(z3.string()).optional(),
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
      avgRating: stats._avg.rating || 0,
      reviewCount: stats._count.id
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

// src/app/modules/contact/contact.route.ts
import { Router as Router12 } from "express";

// src/app/modules/contact/contact.controller.ts
import status20 from "http-status";

// src/app/modules/contact/contact.service.ts
import status19 from "http-status";
var createContactMessage = async (payload) => {
  const result = await prisma.contactMessage.create({
    data: payload
  });
  return result;
};
var getAllContactMessages = async (query) => {
  const contactQuery = new QueryBuilder(prisma.contactMessage, query, {
    searchableFields: ["name", "email", "message"],
    filterableFields: ["isRead"]
  }).search().filter().sort().paginate().fields();
  const result = await contactQuery.execute();
  return result;
};
var markContactMessageAsRead = async (id) => {
  const isExist = await prisma.contactMessage.findUnique({ where: { id } });
  if (!isExist) {
    throw new AppError_default(status19.NOT_FOUND, "Contact message not found");
  }
  const result = await prisma.contactMessage.update({
    where: { id },
    data: { isRead: true }
  });
  return result;
};
var deleteContactMessage = async (id) => {
  const isExist = await prisma.contactMessage.findUnique({ where: { id } });
  if (!isExist) {
    throw new AppError_default(status19.NOT_FOUND, "Contact message not found");
  }
  const result = await prisma.contactMessage.delete({ where: { id } });
  return result;
};
var ContactService = {
  createContactMessage,
  getAllContactMessages,
  markContactMessageAsRead,
  deleteContactMessage
};

// src/app/modules/contact/contact.controller.ts
var createContactMessage2 = catchAsync(
  async (req, res) => {
    const result = await ContactService.createContactMessage(req.body);
    return sendResponse(res, {
      httpStatusCode: status20.CREATED,
      success: true,
      message: "Your message has been sent successfully",
      data: result
    });
  }
);
var getAllContactMessages2 = catchAsync(
  async (req, res) => {
    const query = req.query;
    const result = await ContactService.getAllContactMessages(query);
    return sendResponse(res, {
      httpStatusCode: status20.OK,
      success: true,
      message: "Contact messages fetched successfully",
      data: result
    });
  }
);
var markContactMessageAsRead2 = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const result = await ContactService.markContactMessageAsRead(
      id
    );
    return sendResponse(res, {
      httpStatusCode: status20.OK,
      success: true,
      message: "Contact message marked as read",
      data: result
    });
  }
);
var deleteContactMessage2 = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const result = await ContactService.deleteContactMessage(id);
    return sendResponse(res, {
      httpStatusCode: status20.OK,
      success: true,
      message: "Contact message deleted successfully",
      data: result
    });
  }
);
var ContactController = {
  createContactMessage: createContactMessage2,
  getAllContactMessages: getAllContactMessages2,
  markContactMessageAsRead: markContactMessageAsRead2,
  deleteContactMessage: deleteContactMessage2
};

// src/app/modules/contact/contact.validation.ts
import { z as z5 } from "zod";
var createContactMessageSchema = z5.object({
  name: z5.string().min(2, "Name must be at least 2 characters"),
  email: z5.string().email("Please provide a valid email address"),
  message: z5.string().min(10, "Message must be at least 10 characters")
});
var ContactValidation = {
  createContactMessageSchema
};

// src/app/modules/contact/contact.route.ts
var router12 = Router12();
router12.post(
  "/",
  validateRequest(ContactValidation.createContactMessageSchema),
  ContactController.createContactMessage
);
router12.get("/", checkAuth(Role.ADMIN), ContactController.getAllContactMessages);
router12.patch(
  "/:id/read",
  checkAuth(Role.ADMIN),
  ContactController.markContactMessageAsRead
);
router12.delete(
  "/:id",
  checkAuth(Role.ADMIN),
  ContactController.deleteContactMessage
);
var ContactRoutes = router12;

// src/app/routes/index.ts
var router13 = Router13();
router13.use("/auth", authRoutes);
router13.use("/users", userRoutes);
router13.use("/favorites", FavoriteRouter);
router13.use("/genres", GenreRoutes);
router13.use("/bookmarks", BookmarkRouter);
router13.use("/watchlist", WatchlistRouter);
router13.use("/payment", PaymentRoutes);
router13.use("/subscriptions", SubscriptionRouter);
router13.use("/media", MediaRoutes);
router13.use("/reviews", ReviewsRoutes);
router13.use("/admin", AdminRoutes);
router13.use("/contact", ContactRoutes);
var IndexRoutes = router13;

// src/app/middlewares/globalError.ts
import status23 from "http-status";
import z6 from "zod";

// src/app/errorHelpers/handlePrismaError.ts
import status21 from "http-status";
var getStatusCodeFromPrismaError = (errorCode) => {
  if (errorCode === "P2002") {
    return status21.CONFLICT;
  }
  if (["P2025", "P2001", "P2015", "P2018"].includes(errorCode)) {
    return status21.NOT_FOUND;
  }
  if (["P1000", "P6002"].includes(errorCode)) {
    return status21.UNAUTHORIZED;
  }
  if (["P1010", "P6010"].includes(errorCode)) {
    return status21.FORBIDDEN;
  }
  if (errorCode === "P6003") {
    return status21.PAYMENT_REQUIRED;
  }
  if (["P1008", "P2004", "P6004"].includes(errorCode)) {
    return status21.GATEWAY_TIMEOUT;
  }
  if (errorCode === "P5011") {
    return status21.TOO_MANY_REQUESTS;
  }
  if (errorCode === "P6009") {
    return 413;
  }
  if (errorCode.startsWith("P1") || ["P2024", "P2037", "P6008"].includes(errorCode)) {
    return status21.SERVICE_UNAVAILABLE;
  }
  if (errorCode.startsWith("P2")) {
    return status21.BAD_REQUEST;
  }
  if (errorCode.startsWith("P3") || errorCode.startsWith("P4")) {
    return status21.INTERNAL_SERVER_ERROR;
  }
  return status21.INTERNAL_SERVER_ERROR;
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
    statusCode: status21.INTERNAL_SERVER_ERROR,
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
    statusCode: status21.BAD_REQUEST,
    message: `Prisma Client Validation Error: ${mainMessage}`,
    errorSources
  };
};
var handlerPrismaClientInitializationError = (error) => {
  const statusCode = error.errorCode ? getStatusCodeFromPrismaError(error.errorCode) : status21.SERVICE_UNAVAILABLE;
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
    statusCode: status21.INTERNAL_SERVER_ERROR,
    message: "Prisma Client Rust Panic Error: The database engine crashed due to a fatal error.",
    errorSources
  };
};

// src/app/middlewares/handleZodError.ts
import status22 from "http-status";
var handleZodError = (err) => {
  const statusCode = status22.BAD_REQUEST;
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
  let statusCode = status23.INTERNAL_SERVER_ERROR;
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
  } else if (err instanceof z6.ZodError) {
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
    statusCode = status23.INTERNAL_SERVER_ERROR;
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
import status24 from "http-status";
var notFound = (req, res, next) => {
  if (res.headersSent) return next();
  return res.status(status24.NOT_FOUND).json({
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
