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
    "FRONTEND_URL"
    // "CLOUDINARY_CLOUD_NAME",
    // "CLOUDINARY_API_KEY",
    // "CLOUDINARY_API_SECRET",
    // "STRIPE_SECRET_KEY",
    // "STRIPE_WEBHOOK_SECRET",
    //  'SUPER_ADMIN_EMAIL',
    //     'SUPER_ADMIN_PASSWORD',
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
    FRONTEND_URL: process.env.FRONTEND_URL
    // CLOUDINARY: {
    //   CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
    //   CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
    //   CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
    // },
    //  STRIPE: {
    //         STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
    //         STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET as string,
    //     },
    //       SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
    //     SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
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
  "clientVersion": "7.6.0",
  "engineVersion": "75cbdc1eb7150937890ad5465d861175c6624711",
  "activeProvider": "postgresql",
  "inlineSchema": 'model User {\n  id                 String      @id\n  name               String\n  email              String      @unique\n  emailVerified      Boolean     @default(false)\n  image              String?\n  role               Role        @default(USER)\n  status             UserStatus  @default(ACTIVE)\n  needPasswordChange Boolean     @default(false)\n  isDeleted          Boolean     @default(false)\n  deletedAt          DateTime?\n  createdAt          DateTime    @default(now())\n  updatedAt          DateTime    @updatedAt\n  watchList          WatchList[]\n  accounts           Account[]\n  bookmarks          Bookmark[]\n  favorites          Favorite[]\n  mediaAdded         Media[]     @relation("MediaAddedBy")\n  profile            Profile?\n  ratings            Rating[]\n  reviews            Review[]\n  sessions           Session[]\n\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String   @unique\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nenum Role {\n  SUPER_ADMIN\n  ADMIN\n  USER\n}\n\nenum UserStatus {\n  BLOCKED\n  DELETED\n  ACTIVE\n  PENDING\n  UNVERIFIED\n}\n\nenum MediaType {\n  MOVIE\n  SERIES\n}\n\nenum ReviewStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nenum PaymentStatus {\n  PAID\n  UNPAID\n}\n\nmodel Genre {\n  id     String  @id @default(uuid())\n  name   String  @unique\n  medias Media[] @relation("MediaGenres")\n}\n\nmodel Media {\n  id            String      @id @default(uuid())\n  title         String\n  description   String\n  type          MediaType\n  releaseDate   DateTime\n  genre         String[]\n  coverImage    String\n  trailerUrl    String?\n  streamUrl     String?\n  averageRating Float       @default(0)\n  totalRatings  Int         @default(0)\n  createdAt     DateTime    @default(now())\n  updatedAt     DateTime    @updatedAt\n  createdById   String?\n  watchList     WatchList[]\n  bookmarks     Bookmark[]\n  favorites     Favorite[]\n  createdBy     User?       @relation("MediaAddedBy", fields: [createdById], references: [id])\n  ratings       Rating[]\n  reviews       Review[]\n  genres        Genre[]     @relation("MediaGenres")\n  profiles      Profile[]   @relation("MediaProfiles")\n\n  @@index([title, type])\n  @@map("media")\n}\n\nmodel Profile {\n  id         String     @id @default(uuid())\n  userId     String     @unique\n  name       String?\n  email      String?\n  image      String?\n  bio        String?\n  avatar     String?\n  coverImage String?\n  createdAt  DateTime   @default(now())\n  updatedAt  DateTime   @updatedAt\n  bookmark   Bookmark[]\n  favorite   Favorite[]\n  user       User       @relation(fields: [userId], references: [id])\n  medias     Media[]    @relation("MediaProfiles")\n\n  @@map("profile")\n}\n\nmodel Bookmark {\n  id        String   @id @default(uuid())\n  userId    String\n  mediaId   String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  profileId String?\n  media     Media    @relation(fields: [mediaId], references: [id])\n  profile   Profile? @relation(fields: [profileId], references: [id])\n  user      User     @relation(fields: [userId], references: [id])\n\n  @@index([userId])\n  @@map("bookmark")\n}\n\nmodel Favorite {\n  id        String   @id @default(uuid())\n  userId    String\n  mediaId   String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  profileId String?\n  media     Media    @relation(fields: [mediaId], references: [id])\n  profile   Profile? @relation(fields: [profileId], references: [id])\n  user      User     @relation(fields: [userId], references: [id])\n\n  @@index([userId])\n  @@map("favorite")\n}\n\nmodel Rating {\n  id        String   @id @default(uuid())\n  score     Int\n  createdAt DateTime @default(now())\n  userId    String\n  mediaId   String\n  media     Media    @relation(fields: [mediaId], references: [id], onDelete: Cascade)\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([userId, mediaId])\n  @@map("ratings")\n}\n\nmodel Review {\n  id        String       @id @default(uuid())\n  content   String\n  status    ReviewStatus @default(APPROVED)\n  createdAt DateTime     @default(now())\n  updatedAt DateTime     @updatedAt\n  userId    String\n  mediaId   String\n  media     Media        @relation(fields: [mediaId], references: [id], onDelete: Cascade)\n  user      User         @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@map("reviews")\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel WatchList {\n  id        String   @id @default(uuid())\n  userId    String\n  mediaId   String\n  createdAt DateTime @default(now())\n  media     Media    @relation(fields: [mediaId], references: [id], onDelete: Cascade)\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([userId, mediaId])\n}\n',
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
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"watchList","kind":"object","type":"WatchList","relationName":"UserToWatchList"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"bookmarks","kind":"object","type":"Bookmark","relationName":"BookmarkToUser"},{"name":"favorites","kind":"object","type":"Favorite","relationName":"FavoriteToUser"},{"name":"mediaAdded","kind":"object","type":"Media","relationName":"MediaAddedBy"},{"name":"profile","kind":"object","type":"Profile","relationName":"ProfileToUser"},{"name":"ratings","kind":"object","type":"Rating","relationName":"RatingToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Genre":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"medias","kind":"object","type":"Media","relationName":"MediaGenres"}],"dbName":null},"Media":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"MediaType"},{"name":"releaseDate","kind":"scalar","type":"DateTime"},{"name":"genre","kind":"scalar","type":"String"},{"name":"coverImage","kind":"scalar","type":"String"},{"name":"trailerUrl","kind":"scalar","type":"String"},{"name":"streamUrl","kind":"scalar","type":"String"},{"name":"averageRating","kind":"scalar","type":"Float"},{"name":"totalRatings","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"createdById","kind":"scalar","type":"String"},{"name":"watchList","kind":"object","type":"WatchList","relationName":"MediaToWatchList"},{"name":"bookmarks","kind":"object","type":"Bookmark","relationName":"BookmarkToMedia"},{"name":"favorites","kind":"object","type":"Favorite","relationName":"FavoriteToMedia"},{"name":"createdBy","kind":"object","type":"User","relationName":"MediaAddedBy"},{"name":"ratings","kind":"object","type":"Rating","relationName":"MediaToRating"},{"name":"reviews","kind":"object","type":"Review","relationName":"MediaToReview"},{"name":"genres","kind":"object","type":"Genre","relationName":"MediaGenres"},{"name":"profiles","kind":"object","type":"Profile","relationName":"MediaProfiles"}],"dbName":"media"},"Profile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"avatar","kind":"scalar","type":"String"},{"name":"coverImage","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"bookmark","kind":"object","type":"Bookmark","relationName":"BookmarkToProfile"},{"name":"favorite","kind":"object","type":"Favorite","relationName":"FavoriteToProfile"},{"name":"user","kind":"object","type":"User","relationName":"ProfileToUser"},{"name":"medias","kind":"object","type":"Media","relationName":"MediaProfiles"}],"dbName":"profile"},"Bookmark":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"profileId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"BookmarkToMedia"},{"name":"profile","kind":"object","type":"Profile","relationName":"BookmarkToProfile"},{"name":"user","kind":"object","type":"User","relationName":"BookmarkToUser"}],"dbName":"bookmark"},"Favorite":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"profileId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"FavoriteToMedia"},{"name":"profile","kind":"object","type":"Profile","relationName":"FavoriteToProfile"},{"name":"user","kind":"object","type":"User","relationName":"FavoriteToUser"}],"dbName":"favorite"},"Rating":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"score","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"MediaToRating"},{"name":"user","kind":"object","type":"User","relationName":"RatingToUser"}],"dbName":"ratings"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ReviewStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"MediaToReview"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"}],"dbName":"reviews"},"WatchList":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"media","kind":"object","type":"Media","relationName":"MediaToWatchList"},{"name":"user","kind":"object","type":"User","relationName":"UserToWatchList"}],"dbName":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","watchList","media","bookmark","profile","user","favorite","medias","_count","bookmarks","favorites","createdBy","ratings","reviews","genres","profiles","accounts","mediaAdded","sessions","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Genre.findUnique","Genre.findUniqueOrThrow","Genre.findFirst","Genre.findFirstOrThrow","Genre.findMany","Genre.createOne","Genre.createMany","Genre.createManyAndReturn","Genre.updateOne","Genre.updateMany","Genre.updateManyAndReturn","Genre.upsertOne","Genre.deleteOne","Genre.deleteMany","Genre.groupBy","Genre.aggregate","Media.findUnique","Media.findUniqueOrThrow","Media.findFirst","Media.findFirstOrThrow","Media.findMany","Media.createOne","Media.createMany","Media.createManyAndReturn","Media.updateOne","Media.updateMany","Media.updateManyAndReturn","Media.upsertOne","Media.deleteOne","Media.deleteMany","_avg","_sum","Media.groupBy","Media.aggregate","Profile.findUnique","Profile.findUniqueOrThrow","Profile.findFirst","Profile.findFirstOrThrow","Profile.findMany","Profile.createOne","Profile.createMany","Profile.createManyAndReturn","Profile.updateOne","Profile.updateMany","Profile.updateManyAndReturn","Profile.upsertOne","Profile.deleteOne","Profile.deleteMany","Profile.groupBy","Profile.aggregate","Bookmark.findUnique","Bookmark.findUniqueOrThrow","Bookmark.findFirst","Bookmark.findFirstOrThrow","Bookmark.findMany","Bookmark.createOne","Bookmark.createMany","Bookmark.createManyAndReturn","Bookmark.updateOne","Bookmark.updateMany","Bookmark.updateManyAndReturn","Bookmark.upsertOne","Bookmark.deleteOne","Bookmark.deleteMany","Bookmark.groupBy","Bookmark.aggregate","Favorite.findUnique","Favorite.findUniqueOrThrow","Favorite.findFirst","Favorite.findFirstOrThrow","Favorite.findMany","Favorite.createOne","Favorite.createMany","Favorite.createManyAndReturn","Favorite.updateOne","Favorite.updateMany","Favorite.updateManyAndReturn","Favorite.upsertOne","Favorite.deleteOne","Favorite.deleteMany","Favorite.groupBy","Favorite.aggregate","Rating.findUnique","Rating.findUniqueOrThrow","Rating.findFirst","Rating.findFirstOrThrow","Rating.findMany","Rating.createOne","Rating.createMany","Rating.createManyAndReturn","Rating.updateOne","Rating.updateMany","Rating.updateManyAndReturn","Rating.upsertOne","Rating.deleteOne","Rating.deleteMany","Rating.groupBy","Rating.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","WatchList.findUnique","WatchList.findUniqueOrThrow","WatchList.findFirst","WatchList.findFirstOrThrow","WatchList.findMany","WatchList.createOne","WatchList.createMany","WatchList.createManyAndReturn","WatchList.updateOne","WatchList.updateMany","WatchList.updateManyAndReturn","WatchList.upsertOne","WatchList.deleteOne","WatchList.deleteMany","WatchList.groupBy","WatchList.aggregate","AND","OR","NOT","id","userId","mediaId","createdAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","content","ReviewStatus","status","updatedAt","score","profileId","name","email","image","bio","avatar","coverImage","title","description","MediaType","type","releaseDate","genre","trailerUrl","streamUrl","averageRating","totalRatings","createdById","has","hasEvery","hasSome","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","emailVerified","Role","role","UserStatus","needPasswordChange","isDeleted","deletedAt","every","some","none","userId_mediaId","is","isNot","connectOrCreate","upsert","set","disconnect","delete","connect","updateMany","deleteMany","createMany","increment","decrement","multiply","divide","push"]'),
  graph: "5gZpwAEYAwAAowMAIAYAAKUDACALAACVAwAgDAAAlgMAIA4AAKYDACAPAACnAwAgEgAApAMAIBMAAJcDACAUAACoAwAg3QEAAJ8DADDeAQAAHAAQ3wEAAJ8DADDgAQEAAAAB4wFAAP8CACHxAQAAogOcAiLyAUAA_wIAIfUBAQD-AgAh9gEBAAAAAfcBAQCQAwAhmAIgAKADACGaAgAAoQOaAiKcAiAAoAMAIZ0CIACgAwAhngJAAJMDACEBAAAAAQAgCQQAAJsDACAHAACRAwAg3QEAALIDADDeAQAAAwAQ3wEAALIDADDgAQEA_gIAIeEBAQD-AgAh4gEBAP4CACHjAUAA_wIAIQIEAACFBgAgBwAAhAYAIAoEAACbAwAgBwAAkQMAIN0BAACyAwAw3gEAAAMAEN8BAACyAwAw4AEBAAAAAeEBAQD-AgAh4gEBAP4CACHjAUAA_wIAIaICAACxAwAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAMBAAAmwMAIAYAAKUDACAHAACRAwAg3QEAALADADDeAQAACAAQ3wEAALADADDgAQEA_gIAIeEBAQD-AgAh4gEBAP4CACHjAUAA_wIAIfIBQAD_AgAh9AEBAJADACEEBAAAhQYAIAYAAIAGACAHAACEBgAg9AEAAM4DACAMBAAAmwMAIAYAAKUDACAHAACRAwAg3QEAALADADDeAQAACAAQ3wEAALADADDgAQEAAAAB4QEBAP4CACHiAQEA_gIAIeMBQAD_AgAh8gFAAP8CACH0AQEAkAMAIQMAAAAIACABAAAJADACAAAKACARBQAAlQMAIAcAAJEDACAIAACWAwAgCQAAlwMAIN0BAACUAwAw3gEAAAwAEN8BAACUAwAw4AEBAP4CACHhAQEA_gIAIeMBQAD_AgAh8gFAAP8CACH1AQEAkAMAIfYBAQCQAwAh9wEBAJADACH4AQEAkAMAIfkBAQCQAwAh-gEBAJADACEBAAAADAAgAwAAAAgAIAEAAAkAMAIAAAoAIAwEAACbAwAgBgAApQMAIAcAAJEDACDdAQAArwMAMN4BAAAPABDfAQAArwMAMOABAQD-AgAh4QEBAP4CACHiAQEA_gIAIeMBQAD_AgAh8gFAAP8CACH0AQEAkAMAIQQEAACFBgAgBgAAgAYAIAcAAIQGACD0AQAAzgMAIAwEAACbAwAgBgAApQMAIAcAAJEDACDdAQAArwMAMN4BAAAPABDfAQAArwMAMOABAQAAAAHhAQEA_gIAIeIBAQD-AgAh4wFAAP8CACHyAUAA_wIAIfQBAQCQAwAhAwAAAA8AIAEAABAAMAIAABEAIAEAAAAMACAZAwAAowMAIAsAAJUDACAMAACWAwAgDQAArAMAIA4AAKYDACAPAACnAwAgEAAArQMAIBEAAK4DACDdAQAAqQMAMN4BAAAUABDfAQAAqQMAMOABAQD-AgAh4wFAAP8CACHyAUAA_wIAIfoBAQD-AgAh-wEBAP4CACH8AQEA_gIAIf4BAACqA_4BIv8BQAD_AgAhgAIAAPYCACCBAgEAkAMAIYICAQCQAwAhgwIIAKsDACGEAgIAngMAIYUCAQCQAwAhCwMAAPsFACALAAD9BQAgDAAA_gUAIA0AAIQGACAOAACBBgAgDwAAggYAIBAAAIYGACARAACHBgAggQIAAM4DACCCAgAAzgMAIIUCAADOAwAgGQMAAKMDACALAACVAwAgDAAAlgMAIA0AAKwDACAOAACmAwAgDwAApwMAIBAAAK0DACARAACuAwAg3QEAAKkDADDeAQAAFAAQ3wEAAKkDADDgAQEAAAAB4wFAAP8CACHyAUAA_wIAIfoBAQD-AgAh-wEBAP4CACH8AQEA_gIAIf4BAACqA_4BIv8BQAD_AgAhgAIAAPYCACCBAgEAkAMAIYICAQCQAwAhgwIIAKsDACGEAgIAngMAIYUCAQCQAwAhAwAAABQAIAEAABUAMAIAABYAIAEAAAAIACABAAAADwAgAQAAABQAIAMAAAAPACABAAAQADACAAARACAYAwAAowMAIAYAAKUDACALAACVAwAgDAAAlgMAIA4AAKYDACAPAACnAwAgEgAApAMAIBMAAJcDACAUAACoAwAg3QEAAJ8DADDeAQAAHAAQ3wEAAJ8DADDgAQEA_gIAIeMBQAD_AgAh8QEAAKIDnAIi8gFAAP8CACH1AQEA_gIAIfYBAQD-AgAh9wEBAJADACGYAiAAoAMAIZoCAAChA5oCIpwCIACgAwAhnQIgAKADACGeAkAAkwMAIQEAAAAcACAKBAAAmwMAIAcAAJEDACDdAQAAnQMAMN4BAAAeABDfAQAAnQMAMOABAQD-AgAh4QEBAP4CACHiAQEA_gIAIeMBQAD_AgAh8wECAJ4DACECBAAAhQYAIAcAAIQGACALBAAAmwMAIAcAAJEDACDdAQAAnQMAMN4BAAAeABDfAQAAnQMAMOABAQAAAAHhAQEA_gIAIeIBAQD-AgAh4wFAAP8CACHzAQIAngMAIaICAACcAwAgAwAAAB4AIAEAAB8AMAIAACAAIAwEAACbAwAgBwAAkQMAIN0BAACZAwAw3gEAACIAEN8BAACZAwAw4AEBAP4CACHhAQEA_gIAIeIBAQD-AgAh4wFAAP8CACHvAQEA_gIAIfEBAACaA_EBIvIBQAD_AgAhAgQAAIUGACAHAACEBgAgDAQAAJsDACAHAACRAwAg3QEAAJkDADDeAQAAIgAQ3wEAAJkDADDgAQEAAAAB4QEBAP4CACHiAQEA_gIAIeMBQAD_AgAh7wEBAP4CACHxAQAAmgPxASLyAUAA_wIAIQMAAAAiACABAAAjADACAAAkACAGCQAAlwMAIN0BAACYAwAw3gEAACYAEN8BAACYAwAw4AEBAP4CACH1AQEA_gIAIQEJAAD_BQAgBgkAAJcDACDdAQAAmAMAMN4BAAAmABDfAQAAmAMAMOABAQAAAAH1AQEAAAABAwAAACYAIAEAACcAMAIAACgAIAMAAAAUACABAAAVADACAAAWACABAAAAFAAgCgUAAP0FACAHAACEBgAgCAAA_gUAIAkAAP8FACD1AQAAzgMAIPYBAADOAwAg9wEAAM4DACD4AQAAzgMAIPkBAADOAwAg-gEAAM4DACARBQAAlQMAIAcAAJEDACAIAACWAwAgCQAAlwMAIN0BAACUAwAw3gEAAAwAEN8BAACUAwAw4AEBAAAAAeEBAQAAAAHjAUAA_wIAIfIBQAD_AgAh9QEBAJADACH2AQEAkAMAIfcBAQCQAwAh-AEBAJADACH5AQEAkAMAIfoBAQCQAwAhAwAAAAwAIAEAACwAMAIAAC0AIAEAAAADACABAAAACAAgAQAAAA8AIAEAAAAeACABAAAAIgAgAQAAACYAIAEAAAAMACARBwAAkQMAIN0BAACSAwAw3gEAADYAEN8BAACSAwAw4AEBAP4CACHhAQEA_gIAIeMBQAD_AgAh8gFAAP8CACGMAgEA_gIAIY0CAQD-AgAhjgIBAJADACGPAgEAkAMAIZACAQCQAwAhkQJAAJMDACGSAkAAkwMAIZMCAQCQAwAhlAIBAJADACEIBwAAhAYAII4CAADOAwAgjwIAAM4DACCQAgAAzgMAIJECAADOAwAgkgIAAM4DACCTAgAAzgMAIJQCAADOAwAgEQcAAJEDACDdAQAAkgMAMN4BAAA2ABDfAQAAkgMAMOABAQAAAAHhAQEA_gIAIeMBQAD_AgAh8gFAAP8CACGMAgEA_gIAIY0CAQD-AgAhjgIBAJADACGPAgEAkAMAIZACAQCQAwAhkQJAAJMDACGSAkAAkwMAIZMCAQCQAwAhlAIBAJADACEDAAAANgAgAQAANwAwAgAAOAAgAwAAAAgAIAEAAAkAMAIAAAoAIAMAAAAPACABAAAQADACAAARACADAAAAFAAgAQAAFQAwAgAAFgAgAQAAAAwAIAMAAAAeACABAAAfADACAAAgACADAAAAIgAgAQAAIwAwAgAAJAAgDAcAAJEDACDdAQAAjwMAMN4BAABAABDfAQAAjwMAMOABAQD-AgAh4QEBAP4CACHjAUAA_wIAIfIBQAD_AgAhiwJAAP8CACGVAgEA_gIAIZYCAQCQAwAhlwIBAJADACEDBwAAhAYAIJYCAADOAwAglwIAAM4DACAMBwAAkQMAIN0BAACPAwAw3gEAAEAAEN8BAACPAwAw4AEBAAAAAeEBAQD-AgAh4wFAAP8CACHyAUAA_wIAIYsCQAD_AgAhlQIBAAAAAZYCAQCQAwAhlwIBAJADACEDAAAAQAAgAQAAQQAwAgAAQgAgAQAAAAMAIAEAAAA2ACABAAAACAAgAQAAAA8AIAEAAAAUACABAAAAHgAgAQAAACIAIAEAAABAACABAAAAAQAgCwMAAPsFACAGAACABgAgCwAA_QUAIAwAAP4FACAOAACBBgAgDwAAggYAIBIAAPwFACATAAD_BQAgFAAAgwYAIPcBAADOAwAgngIAAM4DACADAAAAHAAgAQAATQAwAgAAAQAgAwAAABwAIAEAAE0AMAIAAAEAIAMAAAAcACABAABNADACAAABACAVAwAA8gUAIAYAAPcFACALAAD0BQAgDAAA9QUAIA4AAPgFACAPAAD5BQAgEgAA8wUAIBMAAPYFACAUAAD6BQAg4AEBAAAAAeMBQAAAAAHxAQAAAJwCAvIBQAAAAAH1AQEAAAAB9gEBAAAAAfcBAQAAAAGYAiAAAAABmgIAAACaAgKcAiAAAAABnQIgAAAAAZ4CQAAAAAEBGgAAUQAgDOABAQAAAAHjAUAAAAAB8QEAAACcAgLyAUAAAAAB9QEBAAAAAfYBAQAAAAH3AQEAAAABmAIgAAAAAZoCAAAAmgICnAIgAAAAAZ0CIAAAAAGeAkAAAAABARoAAFMAMAEaAABTADAVAwAAlgUAIAYAAJsFACALAACYBQAgDAAAmQUAIA4AAJwFACAPAACdBQAgEgAAlwUAIBMAAJoFACAUAACeBQAg4AEBALYDACHjAUAAtwMAIfEBAACVBZwCIvIBQAC3AwAh9QEBALYDACH2AQEAtgMAIfcBAQDSAwAhmAIgAJMFACGaAgAAlAWaAiKcAiAAkwUAIZ0CIACTBQAhngJAAIgFACECAAAAAQAgGgAAVgAgDOABAQC2AwAh4wFAALcDACHxAQAAlQWcAiLyAUAAtwMAIfUBAQC2AwAh9gEBALYDACH3AQEA0gMAIZgCIACTBQAhmgIAAJQFmgIinAIgAJMFACGdAiAAkwUAIZ4CQACIBQAhAgAAABwAIBoAAFgAIAIAAAAcACAaAABYACADAAAAAQAgIQAAUQAgIgAAVgAgAQAAAAEAIAEAAAAcACAFCgAAkAUAICcAAJIFACAoAACRBQAg9wEAAM4DACCeAgAAzgMAIA_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_QIAMN4BAACRAQAQ3wEAAP0CADDgAQEAAAAB4wFAAP8CACHyAUAA_wIAIYkCAQD-AgAhigIBAP4CACGLAkAA_wIAIQEAAACOAQAgAQAAAI4BACAJ3QEAAP0CADDeAQAAkQEAEN8BAAD9AgAw4AEBAP4CACHjAUAA_wIAIfIBQAD_AgAhiQIBAP4CACGKAgEA_gIAIYsCQAD_AgAhAAMAAACRAQAgAQAAkgEAMAIAAI4BACADAAAAkQEAIAEAAJIBADACAACOAQAgAwAAAJEBACABAACSAQAwAgAAjgEAIAbgAQEAAAAB4wFAAAAAAfIBQAAAAAGJAgEAAAABigIBAAAAAYsCQAAAAAEBGgAAlgEAIAbgAQEAAAAB4wFAAAAAAfIBQAAAAAGJAgEAAAABigIBAAAAAYsCQAAAAAEBGgAAmAEAMAEaAACYAQAwBuABAQC2AwAh4wFAALcDACHyAUAAtwMAIYkCAQC2AwAhigIBALYDACGLAkAAtwMAIQIAAACOAQAgGgAAmwEAIAbgAQEAtgMAIeMBQAC3AwAh8gFAALcDACGJAgEAtgMAIYoCAQC2AwAhiwJAALcDACECAAAAkQEAIBoAAJ0BACACAAAAkQEAIBoAAJ0BACADAAAAjgEAICEAAJYBACAiAACbAQAgAQAAAI4BACABAAAAkQEAIAMKAACCBQAgJwAAhAUAICgAAIMFACAJ3QEAAPwCADDeAQAApAEAEN8BAAD8AgAw4AEBAN4CACHjAUAA3wIAIfIBQADfAgAhiQIBAN4CACGKAgEA3gIAIYsCQADfAgAhAwAAAJEBACABAACjAQAwJgAApAEAIAMAAACRAQAgAQAAkgEAMAIAAI4BACABAAAAKAAgAQAAACgAIAMAAAAmACABAAAnADACAAAoACADAAAAJgAgAQAAJwAwAgAAKAAgAwAAACYAIAEAACcAMAIAACgAIAMJAACBBQAg4AEBAAAAAfUBAQAAAAEBGgAArAEAIALgAQEAAAAB9QEBAAAAAQEaAACuAQAwARoAAK4BADADCQAA-AQAIOABAQC2AwAh9QEBALYDACECAAAAKAAgGgAAsQEAIALgAQEAtgMAIfUBAQC2AwAhAgAAACYAIBoAALMBACACAAAAJgAgGgAAswEAIAMAAAAoACAhAACsAQAgIgAAsQEAIAEAAAAoACABAAAAJgAgAwoAAPUEACAnAAD3BAAgKAAA9gQAIAXdAQAA-wIAMN4BAAC6AQAQ3wEAAPsCADDgAQEA3gIAIfUBAQDeAgAhAwAAACYAIAEAALkBADAmAAC6AQAgAwAAACYAIAEAACcAMAIAACgAIAEAAAAWACABAAAAFgAgAwAAABQAIAEAABUAMAIAABYAIAMAAAAUACABAAAVADACAAAWACADAAAAFAAgAQAAFQAwAgAAFgAgFgMAAMYEACALAADHBAAgDAAAyAQAIA0AAMkEACAOAADKBAAgDwAAywQAIBAAAMwEACARAAD0BAAg4AEBAAAAAeMBQAAAAAHyAUAAAAAB-gEBAAAAAfsBAQAAAAH8AQEAAAAB_gEAAAD-AQL_AUAAAAABgAIAAMUEACCBAgEAAAABggIBAAAAAYMCCAAAAAGEAgIAAAABhQIBAAAAAQEaAADCAQAgDuABAQAAAAHjAUAAAAAB8gFAAAAAAfoBAQAAAAH7AQEAAAAB_AEBAAAAAf4BAAAA_gEC_wFAAAAAAYACAADFBAAggQIBAAAAAYICAQAAAAGDAggAAAABhAICAAAAAYUCAQAAAAEBGgAAxAEAMAEaAADEAQAwAQAAABwAIBYDAAD2AwAgCwAA9wMAIAwAAPgDACANAAD5AwAgDgAA-gMAIA8AAPsDACAQAAD8AwAgEQAA6AQAIOABAQC2AwAh4wFAALcDACHyAUAAtwMAIfoBAQC2AwAh-wEBALYDACH8AQEAtgMAIf4BAADyA_4BIv8BQAC3AwAhgAIAAPMDACCBAgEA0gMAIYICAQDSAwAhgwIIAPQDACGEAgIAyQMAIYUCAQDSAwAhAgAAABYAIBoAAMgBACAO4AEBALYDACHjAUAAtwMAIfIBQAC3AwAh-gEBALYDACH7AQEAtgMAIfwBAQC2AwAh_gEAAPID_gEi_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-gIAIOQBAAAA_gEC5QEAAAD-AQjmAQAAAP4BCOsBAAD5Av4BIgTkAQEAAAAFhgIBAAAAAYcCAQAAAASIAgEAAAAEDQoAAOECACAnAADsAgAgKAAA7AIAIHkAAOwCACB6AADsAgAg5AEIAAAAAeUBCAAAAATmAQgAAAAE5wEIAAAAAegBCAAAAAHpAQgAAAAB6gEIAAAAAesBCAD4AgAhDQoAAOECACAnAADsAgAgKAAA7AIAIHkAAOwCACB6AADsAgAg5AEIAAAAAeUBCAAAAATmAQgAAAAE5wEIAAAAAegBCAAAAAHpAQgAAAAB6gEIAAAAAesBCAD4AgAhBwoAAOECACAnAAD6AgAgKAAA-gIAIOQBAAAA_gEC5QEAAAD-AQjmAQAAAP4BCOsBAAD5Av4BIgTkAQAAAP4BAuUBAAAA_gEI5gEAAAD-AQjrAQAA-gL-ASIF3QEAAPsCADDeAQAAugEAEN8BAAD7AgAw4AEBAN4CACH1AQEA3gIAIQndAQAA_AIAMN4BAACkAQAQ3wEAAPwCADDgAQEA3gIAIeMBQADfAgAh8gFAAN8CACGJAgEA3gIAIYoCAQDeAgAhiwJAAN8CACEJ3QEAAP0CADDeAQAAkQEAEN8BAAD9AgAw4AEBAP4CACHjAUAA_wIAIfIBQAD_AgAhiQIBAP4CACGKAgEA_gIAIYsCQAD_AgAhC-QBAQAAAAHlAQEAAAAE5gEBAAAABOcBAQAAAAHoAQEAAAAB6QEBAAAAAeoBAQAAAAHrAQEA5AIAIewBAQAAAAHtAQEAAAAB7gEBAAAAAQjkAUAAAAAB5QFAAAAABOYBQAAAAATnAUAAAAAB6AFAAAAAAekBQAAAAAHqAUAAAAAB6wFAAOICACEQ3QEAAIADADDeAQAAiwEAEN8BAACAAwAw4AEBAN4CACHhAQEA3gIAIeMBQADfAgAh8gFAAN8CACGMAgEA3gIAIY0CAQDeAgAhjgIBAO4CACGPAgEA7gIAIZACAQDuAgAhkQJAAIEDACGSAkAAgQMAIZMCAQDuAgAhlAIBAO4CACELCgAA8AIAICcAAIMDACAoAACDAwAg5AFAAAAAAeUBQAAAAAXmAUAAAAAF5wFAAAAAAegBQAAAAAHpAUAAAAAB6gFAAAAAAesBQACCAwAhCwoAAPACACAnAACDAwAgKAAAgwMAIOQBQAAAAAHlAUAAAAAF5gFAAAAABecBQAAAAAHoAUAAAAAB6QFAAAAAAeoBQAAAAAHrAUAAggMAIQjkAUAAAAAB5QFAAAAABeYBQAAAAAXnAUAAAAAB6AFAAAAAAekBQAAAAAHqAUAAAAAB6wFAAIMDACEL3QEAAIQDADDeAQAAdQAQ3wEAAIQDADDgAQEA3gIAIeEBAQDeAgAh4wFAAN8CACHyAUAA3wIAIYsCQADfAgAhlQIBAN4CACGWAgEA7gIAIZcCAQDuAgAhD90BAACFAwAw3gEAAF8AEN8BAACFAwAw4AEBAN4CACHjAUAA3wIAIfEBAACIA5wCIvIBQADfAgAh9QEBAN4CACH2AQEA3gIAIfcBAQDuAgAhmAIgAIYDACGaAgAAhwOaAiKcAiAAhgMAIZ0CIACGAwAhngJAAIEDACEFCgAA4QIAICcAAI4DACAoAACOAwAg5AEgAAAAAesBIACNAwAhBwoAAOECACAnAACMAwAgKAAAjAMAIOQBAAAAmgIC5QEAAACaAgjmAQAAAJoCCOsBAACLA5oCIgcKAADhAgAgJwAAigMAICgAAIoDACDkAQAAAJwCAuUBAAAAnAII5gEAAACcAgjrAQAAiQOcAiIHCgAA4QIAICcAAIoDACAoAACKAwAg5AEAAACcAgLlAQAAAJwCCOYBAAAAnAII6wEAAIkDnAIiBOQBAAAAnAIC5QEAAACcAgjmAQAAAJwCCOsBAACKA5wCIgcKAADhAgAgJwAAjAMAICgAAIwDACDkAQAAAJoCAuUBAAAAmgII5gEAAACaAgjrAQAAiwOaAiIE5AEAAACaAgLlAQAAAJoCCOYBAAAAmgII6wEAAIwDmgIiBQoAAOECACAnAACOAwAgKAAAjgMAIOQBIAAAAAHrASAAjQMAIQLkASAAAAAB6wEgAI4DACEMBwAAkQMAIN0BAACPAwAw3gEAAEAAEN8BAACPAwAw4AEBAP4CACHhAQEA_gIAIeMBQAD_AgAh8gFAAP8CACGLAkAA_wIAIZUCAQD-AgAhlgIBAJADACGXAgEAkAMAIQvkAQEAAAAB5QEBAAAABeYBAQAAAAXnAQEAAAAB6AEBAAAAAekBAQAAAAHqAQEAAAAB6wEBAPECACHsAQEAAAAB7QEBAAAAAe4BAQAAAAEaAwAAowMAIAYAAKUDACALAACVAwAgDAAAlgMAIA4AAKYDACAPAACnAwAgEgAApAMAIBMAAJcDACAUAACoAwAg3QEAAJ8DADDeAQAAHAAQ3wEAAJ8DADDgAQEA_gIAIeMBQAD_AgAh8QEAAKIDnAIi8gFAAP8CACH1AQEA_gIAIfYBAQD-AgAh9wEBAJADACGYAiAAoAMAIZoCAAChA5oCIpwCIACgAwAhnQIgAKADACGeAkAAkwMAIaMCAAAcACCkAgAAHAAgEQcAAJEDACDdAQAAkgMAMN4BAAA2ABDfAQAAkgMAMOABAQD-AgAh4QEBAP4CACHjAUAA_wIAIfIBQAD_AgAhjAIBAP4CACGNAgEA_gIAIY4CAQCQAwAhjwIBAJADACGQAgEAkAMAIZECQACTAwAhkgJAAJMDACGTAgEAkAMAIZQCAQCQAwAhCOQBQAAAAAHlAUAAAAAF5gFAAAAABecBQAAAAAHoAUAAAAAB6QFAAAAAAeoBQAAAAAHrAUAAgwMAIREFAACVAwAgBwAAkQMAIAgAAJYDACAJAACXAwAg3QEAAJQDADDeAQAADAAQ3wEAAJQDADDgAQEA_gIAIeEBAQD-AgAh4wFAAP8CACHyAUAA_wIAIfUBAQCQAwAh9gEBAJADACH3AQEAkAMAIfgBAQCQAwAh-QEBAJADACH6AQEAkAMAIQOfAgAACAAgoAIAAAgAIKECAAAIACADnwIAAA8AIKACAAAPACChAgAADwAgA58CAAAUACCgAgAAFAAgoQIAABQAIAYJAACXAwAg3QEAAJgDADDeAQAAJgAQ3wEAAJgDADDgAQEA_gIAIfUBAQD-AgAhDAQAAJsDACAHAACRAwAg3QEAAJkDADDeAQAAIgAQ3wEAAJkDADDgAQEA_gIAIeEBAQD-AgAh4gEBAP4CACHjAUAA_wIAIe8BAQD-AgAh8QEAAJoD8QEi8gFAAP8CACEE5AEAAADxAQLlAQAAAPEBCOYBAAAA8QEI6wEAAOgC8QEiGwMAAKMDACALAACVAwAgDAAAlgMAIA0AAKwDACAOAACmAwAgDwAApwMAIBAAAK0DACARAACuAwAg3QEAAKkDADDeAQAAFAAQ3wEAAKkDADDgAQEA_gIAIeMBQAD_AgAh8gFAAP8CACH6AQEA_gIAIfsBAQD-AgAh_AEBAP4CACH-AQAAqgP-ASL_AUAA_wIAIYACAAD2AgAggQIBAJADACGCAgEAkAMAIYMCCACrAwAhhAICAJ4DACGFAgEAkAMAIaMCAAAUACCkAgAAFAAgAuEBAQAAAAHiAQEAAAABCgQAAJsDACAHAACRAwAg3QEAAJ0DADDeAQAAHgAQ3wEAAJ0DADDgAQEA_gIAIeEBAQD-AgAh4gEBAP4CACHjAUAA_wIAIfMBAgCeAwAhCOQBAgAAAAHlAQIAAAAE5gECAAAABOcBAgAAAAHoAQIAAAAB6QECAAAAAeoBAgAAAAHrAQIA4QIAIRgDAACjAwAgBgAApQMAIAsAAJUDACAMAACWAwAgDgAApgMAIA8AAKcDACASAACkAwAgEwAAlwMAIBQAAKgDACDdAQAAnwMAMN4BAAAcABDfAQAAnwMAMOABAQD-AgAh4wFAAP8CACHxAQAAogOcAiLyAUAA_wIAIfUBAQD-AgAh9gEBAP4CACH3AQEAkAMAIZgCIACgAwAhmgIAAKEDmgIinAIgAKADACGdAiAAoAMAIZ4CQACTAwAhAuQBIAAAAAHrASAAjgMAIQTkAQAAAJoCAuUBAAAAmgII5gEAAACaAgjrAQAAjAOaAiIE5AEAAACcAgLlAQAAAJwCCOYBAAAAnAII6wEAAIoDnAIiA58CAAADACCgAgAAAwAgoQIAAAMAIAOfAgAANgAgoAIAADYAIKECAAA2ACATBQAAlQMAIAcAAJEDACAIAACWAwAgCQAAlwMAIN0BAACUAwAw3gEAAAwAEN8BAACUAwAw4AEBAP4CACHhAQEA_gIAIeMBQAD_AgAh8gFAAP8CACH1AQEAkAMAIfYBAQCQAwAh9wEBAJADACH4AQEAkAMAIfkBAQCQAwAh-gEBAJADACGjAgAADAAgpAIAAAwAIAOfAgAAHgAgoAIAAB4AIKECAAAeACADnwIAACIAIKACAAAiACChAgAAIgAgA58CAABAACCgAgAAQAAgoQIAAEAAIBkDAACjAwAgCwAAlQMAIAwAAJYDACANAACsAwAgDgAApgMAIA8AAKcDACAQAACtAwAgEQAArgMAIN0BAACpAwAw3gEAABQAEN8BAACpAwAw4AEBAP4CACHjAUAA_wIAIfIBQAD_AgAh-gEBAP4CACH7AQEA_gIAIfwBAQD-AgAh_gEAAKoD_gEi_wFAAP8CACGAAgAA9gIAIIECAQCQAwAhggIBAJADACGDAggAqwMAIYQCAgCeAwAhhQIBAJADACEE5AEAAAD-AQLlAQAAAP4BCOYBAAAA_gEI6wEAAPoC_gEiCOQBCAAAAAHlAQgAAAAE5gEIAAAABOcBCAAAAAHoAQgAAAAB6QEIAAAAAeoBCAAAAAHrAQgA7AIAIRoDAACjAwAgBgAApQMAIAsAAJUDACAMAACWAwAgDgAApgMAIA8AAKcDACASAACkAwAgEwAAlwMAIBQAAKgDACDdAQAAnwMAMN4BAAAcABDfAQAAnwMAMOABAQD-AgAh4wFAAP8CACHxAQAAogOcAiLyAUAA_wIAIfUBAQD-AgAh9gEBAP4CACH3AQEAkAMAIZgCIACgAwAhmgIAAKEDmgIinAIgAKADACGdAiAAoAMAIZ4CQACTAwAhowIAABwAIKQCAAAcACADnwIAACYAIKACAAAmACChAgAAJgAgA58CAAAMACCgAgAADAAgoQIAAAwAIAwEAACbAwAgBgAApQMAIAcAAJEDACDdAQAArwMAMN4BAAAPABDfAQAArwMAMOABAQD-AgAh4QEBAP4CACHiAQEA_gIAIeMBQAD_AgAh8gFAAP8CACH0AQEAkAMAIQwEAACbAwAgBgAApQMAIAcAAJEDACDdAQAAsAMAMN4BAAAIABDfAQAAsAMAMOABAQD-AgAh4QEBAP4CACHiAQEA_gIAIeMBQAD_AgAh8gFAAP8CACH0AQEAkAMAIQLhAQEAAAAB4gEBAAAAAQkEAACbAwAgBwAAkQMAIN0BAACyAwAw3gEAAAMAEN8BAACyAwAw4AEBAP4CACHhAQEA_gIAIeIBAQD-AgAh4wFAAP8CACEAAAABpwIBAAAAAQGnAkAAAAABBSEAAN8GACAiAADlBgAgpQIAAOAGACCmAgAA5AYAIKoCAAAWACAFIQAA3QYAICIAAOIGACClAgAA3gYAIKYCAADhBgAgqgIAAAEAIAMhAADfBgAgpQIAAOAGACCqAgAAFgAgAyEAAN0GACClAgAA3gYAIKoCAAABACAAAAABpwIAAADxAQIFIQAA1QYAICIAANsGACClAgAA1gYAIKYCAADaBgAgqgIAABYAIAUhAADTBgAgIgAA2AYAIKUCAADUBgAgpgIAANcGACCqAgAAAQAgAyEAANUGACClAgAA1gYAIKoCAAAWACADIQAA0wYAIKUCAADUBgAgqgIAAAEAIAAAAAAABacCAgAAAAGuAgIAAAABrwICAAAAAbACAgAAAAGxAgIAAAABBSEAAMsGACAiAADRBgAgpQIAAMwGACCmAgAA0AYAIKoCAAAWACAFIQAAyQYAICIAAM4GACClAgAAygYAIKYCAADNBgAgqgIAAAEAIAMhAADLBgAgpQIAAMwGACCqAgAAFgAgAyEAAMkGACClAgAAygYAIKoCAAABACAAAAAAAacCAQAAAAEFIQAAvgYAICIAAMcGACClAgAAvwYAIKYCAADGBgAgqgIAABYAIAchAAC8BgAgIgAAxAYAIKUCAAC9BgAgpgIAAMMGACCoAgAADAAgqQIAAAwAIKoCAAAtACAFIQAAugYAICIAAMEGACClAgAAuwYAIKYCAADABgAgqgIAAAEAIAMhAAC-BgAgpQIAAL8GACCqAgAAFgAgAyEAALwGACClAgAAvQYAIKoCAAAtACADIQAAugYAIKUCAAC7BgAgqgIAAAEAIAAAAAUhAACvBgAgIgAAuAYAIKUCAACwBgAgpgIAALcGACCqAgAAFgAgByEAAK0GACAiAAC1BgAgpQIAAK4GACCmAgAAtAYAIKgCAAAMACCpAgAADAAgqgIAAC0AIAUhAACrBgAgIgAAsgYAIKUCAACsBgAgpgIAALEGACCqAgAAAQAgAyEAAK8GACClAgAAsAYAIKoCAAAWACADIQAArQYAIKUCAACuBgAgqgIAAC0AIAMhAACrBgAgpQIAAKwGACCqAgAAAQAgAAAACyEAANYEADAiAADaBAAwpQIAANcEADCmAgAA2AQAMKcCAACwBAAwqAIAALAEADCpAgAAsAQAMKoCAACwBAAwqwIAANsEADCsAgAAswQAMK0CAADZBAAgCyEAAM0EADAiAADRBAAwpQIAAM4EADCmAgAAzwQAMKcCAACkBAAwqAIAAKQEADCpAgAApAQAMKoCAACkBAAwqwIAANIEADCsAgAApwQAMK0CAADQBAAgBSEAAJoGACAiAACpBgAgpQIAAJsGACCmAgAAqAYAIKoCAAABACAKIQAA6QMAMCIAAO0DADClAgAA6gMAMKYCAADrAwAwpwIAAOwDADCoAgAA7AMAMKkCAADsAwAwqgIAAOwDADCrAgAA7gMAMKwCAADvAwAwFQMAAMYEACALAADHBAAgDAAAyAQAIA0AAMkEACAOAADKBAAgDwAAywQAIBAAAMwEACDgAQEAAAAB4wFAAAAAAfIBQAAAAAH6AQEAAAAB-wEBAAAAAfwBAQAAAAH-AQAAAP4BAv8BQAAAAAGAAgAAxQQAIIECAQAAAAGCAgEAAAABgwIIAAAAAYQCAgAAAAGFAgEAAAABAgAAABYAICEAAMQEACADAAAAFgAgIQAAxAQAICIAAPUDACAZAwAAowMAIAsAAJUDACAMAACWAwAgDQAArAMAIA4AAKYDACAPAACnAwAgEAAArQMAIBEAAK4DACDdAQAAqQMAMN4BAAAUABDfAQAAqQMAMOABAQAAAAHjAUAA_wIAIfIBQAD_AgAh-gEBAP4CACH7AQEA_gIAIfwBAQD-AgAh_gEAAKoD_gEi_wFAAP8CACGAAgAA9gIAIIECAQCQAwAhggIBAJADACGDAggAqwMAIYQCAgCeAwAhhQIBAJADACECAAAAFgAgGgAA9QMAIAIAAADwAwAgGgAA8QMAIBHdAQAA7wMAMN4BAADwAwAQ3wEAAO8DADDgAQEA_gIAIeMBQAD_AgAh8gFAAP8CACH6AQEA_gIAIfsBAQD-AgAh_AEBAP4CACH-AQAAqgP-ASL_AUAA_wIAIYACAAD2AgAggQIBAJADACGCAgEAkAMAIYMCCACrAwAhhAICAJ4DACGFAgEAkAMAIRHdAQAA7wMAMN4BAADwAwAQ3wEAAO8DADDgAQEA_gIAIeMBQAD_AgAh8gFAAP8CACH6AQEA_gIAIfsBAQD-AgAh_AEBAP4CACH-AQAAqgP-ASL_AUAA_wIAIYACAAD2AgAggQIBAJADACGCAgEAkAMAIYMCCACrAwAhhAICAJ4DACGFAgEAkAMAIQ7gAQEAtgMAIeMBQAC3AwAh8gFAALcDACH6AQEAtgMAIfsBAQC2AwAh_AEBALYDACH-AQAA8gP-ASL_AUAAtwMAIYACAADzAwAggQIBANIDACGCAgEA0gMAIYMCCAD0AwAhhAICAMkDACGFAgEA0gMAIQGnAgAAAP4BAgKnAgEAAAAEsgIBAAAABQWnAggAAAABrgIIAAAAAa8CCAAAAAGwAggAAAABsQIIAAAAARUDAAD2AwAgCwAA9wMAIAwAAPgDACANAAD5AwAgDgAA-gMAIA8AAPsDACAQAAD8AwAg4AEBALYDACHjAUAAtwMAIfIBQAC3AwAh-gEBALYDACH7AQEAtgMAIfwBAQC2AwAh_gEAAPID_gEi_wFAALcDACGAAgAA8wMAIIECAQDSAwAhggIBANIDACGDAggA9AMAIYQCAgDJAwAhhQIBANIDACELIQAAuAQAMCIAAL0EADClAgAAuQQAMKYCAAC6BAAwpwIAALwEADCoAgAAvAQAMKkCAAC8BAAwqgIAALwEADCrAgAAvgQAMKwCAAC_BAAwrQIAALsEACALIQAArAQAMCIAALEEADClAgAArQQAMKYCAACuBAAwpwIAALAEADCoAgAAsAQAMKkCAACwBAAwqgIAALAEADCrAgAAsgQAMKwCAACzBAAwrQIAAK8EACALIQAAoAQAMCIAAKUEADClAgAAoQQAMKYCAACiBAAwpwIAAKQEADCoAgAApAQAMKkCAACkBAAwqgIAAKQEADCrAgAApgQAMKwCAACnBAAwrQIAAKMEACAHIQAAngYAICIAAKYGACClAgAAnwYAIKYCAAClBgAgqAIAABwAIKkCAAAcACCqAgAAAQAgCyEAAJQEADAiAACZBAAwpQIAAJUEADCmAgAAlgQAMKcCAACYBAAwqAIAAJgEADCpAgAAmAQAMKoCAACYBAAwqwIAAJoEADCsAgAAmwQAMK0CAACXBAAgCyEAAIgEADAiAACNBAAwpQIAAIkEADCmAgAAigQAMKcCAACMBAAwqAIAAIwEADCpAgAAjAQAMKoCAACMBAAwqwIAAI4EADCsAgAAjwQAMK0CAACLBAAgCiEAAP0DADAiAACBBAAwpQIAAP4DADCmAgAA_wMAMKcCAACABAAwqAIAAIAEADCpAgAAgAQAMKoCAACABAAwqwIAAIIEADCsAgAAgwQAMALgAQEAAAAB9QEBAAAAAQIAAAAoACAhAACHBAAgAwAAACgAICEAAIcEACAiAACGBAAgBgkAAJcDACDdAQAAmAMAMN4BAAAmABDfAQAAmAMAMOABAQAAAAH1AQEAAAABAgAAACgAIBoAAIYEACACAAAAhAQAIBoAAIUEACAF3QEAAIMEADDeAQAAhAQAEN8BAACDBAAw4AEBAP4CACH1AQEA_gIAIQXdAQAAgwQAMN4BAACEBAAQ3wEAAIMEADDgAQEA_gIAIfUBAQD-AgAhAuABAQC2AwAh9QEBALYDACEC4AEBALYDACH1AQEAtgMAIQLgAQEAAAAB9QEBAAAAAQcHAADDAwAg4AEBAAAAAeEBAQAAAAHjAUAAAAAB7wEBAAAAAfEBAAAA8QEC8gFAAAAAAQIAAAAkACAhAACTBAAgAwAAACQAICEAAJMEACAiAACSBAAgARoAAKQGADAMBAAAmwMAIAcAAJEDACDdAQAAmQMAMN4BAAAiABDfAQAAmQMAMOABAQAAAAHhAQEA_gIAIeIBAQD-AgAh4wFAAP8CACHvAQEA_gIAIfEBAACaA_EBIvIBQAD_AgAhAgAAACQAIBoAAJIEACACAAAAkAQAIBoAAJEEACAK3QEAAI8EADDeAQAAkAQAEN8BAACPBAAw4AEBAP4CACHhAQEA_gIAIeIBAQD-AgAh4wFAAP8CACHvAQEA_gIAIfEBAACaA_EBIvIBQAD_AgAhCt0BAACPBAAw3gEAAJAEABDfAQAAjwQAMOABAQD-AgAh4QEBAP4CACHiAQEA_gIAIeMBQAD_AgAh7wEBAP4CACHxAQAAmgPxASLyAUAA_wIAIQbgAQEAtgMAIeEBAQC2AwAh4wFAALcDACHvAQEAtgMAIfEBAAC_A_EBIvIBQAC3AwAhBwcAAMEDACDgAQEAtgMAIeEBAQC2AwAh4wFAALcDACHvAQEAtgMAIfEBAAC_A_EBIvIBQAC3AwAhBwcAAMMDACDgAQEAAAAB4QEBAAAAAeMBQAAAAAHvAQEAAAAB8QEAAADxAQLyAUAAAAABBQcAAM0DACDgAQEAAAAB4QEBAAAAAeMBQAAAAAHzAQIAAAABAgAAACAAICEAAJ8EACADAAAAIAAgIQAAnwQAICIAAJ4EACABGgAAowYAMAsEAACbAwAgBwAAkQMAIN0BAACdAwAw3gEAAB4AEN8BAACdAwAw4AEBAAAAAeEBAQD-AgAh4gEBAP4CACHjAUAA_wIAIfMBAgCeAwAhogIAAJwDACACAAAAIAAgGgAAngQAIAIAAACcBAAgGgAAnQQAIAjdAQAAmwQAMN4BAACcBAAQ3wEAAJsEADDgAQEA_gIAIeEBAQD-AgAh4gEBAP4CACHjAUAA_wIAIfMBAgCeAwAhCN0BAACbBAAw3gEAAJwEABDfAQAAmwQAMOABAQD-AgAh4QEBAP4CACHiAQEA_gIAIeMBQAD_AgAh8wECAJ4DACEE4AEBALYDACHhAQEAtgMAIeMBQAC3AwAh8wECAMkDACEFBwAAywMAIOABAQC2AwAh4QEBALYDACHjAUAAtwMAIfMBAgDJAwAhBQcAAM0DACDgAQEAAAAB4QEBAAAAAeMBQAAAAAHzAQIAAAABBwYAANcDACAHAADYAwAg4AEBAAAAAeEBAQAAAAHjAUAAAAAB8gFAAAAAAfQBAQAAAAECAAAAEQAgIQAAqwQAIAMAAAARACAhAACrBAAgIgAAqgQAIAEaAACiBgAwDAQAAJsDACAGAAClAwAgBwAAkQMAIN0BAACvAwAw3gEAAA8AEN8BAACvAwAw4AEBAAAAAeEBAQD-AgAh4gEBAP4CACHjAUAA_wIAIfIBQAD_AgAh9AEBAJADACECAAAAEQAgGgAAqgQAIAIAAACoBAAgGgAAqQQAIAndAQAApwQAMN4BAACoBAAQ3wEAAKcEADDgAQEA_gIAIeEBAQD-AgAh4gEBAP4CACHjAUAA_wIAIfIBQAD_AgAh9AEBAJADACEJ3QEAAKcEADDeAQAAqAQAEN8BAACnBAAw4AEBAP4CACHhAQEA_gIAIeIBAQD-AgAh4wFAAP8CACHyAUAA_wIAIfQBAQCQAwAhBeABAQC2AwAh4QEBALYDACHjAUAAtwMAIfIBQAC3AwAh9AEBANIDACEHBgAA1AMAIAcAANUDACDgAQEAtgMAIeEBAQC2AwAh4wFAALcDACHyAUAAtwMAIfQBAQDSAwAhBwYAANcDACAHAADYAwAg4AEBAAAAAeEBAQAAAAHjAUAAAAAB8gFAAAAAAfQBAQAAAAEHBgAA4AMAIAcAAOEDACDgAQEAAAAB4QEBAAAAAeMBQAAAAAHyAUAAAAAB9AEBAAAAAQIAAAAKACAhAAC3BAAgAwAAAAoAICEAALcEACAiAAC2BAAgARoAAKEGADAMBAAAmwMAIAYAAKUDACAHAACRAwAg3QEAALADADDeAQAACAAQ3wEAALADADDgAQEAAAAB4QEBAP4CACHiAQEA_gIAIeMBQAD_AgAh8gFAAP8CACH0AQEAkAMAIQIAAAAKACAaAAC2BAAgAgAAALQEACAaAAC1BAAgCd0BAACzBAAw3gEAALQEABDfAQAAswQAMOABAQD-AgAh4QEBAP4CACHiAQEA_gIAIeMBQAD_AgAh8gFAAP8CACH0AQEAkAMAIQndAQAAswQAMN4BAAC0BAAQ3wEAALMEADDgAQEA_gIAIeEBAQD-AgAh4gEBAP4CACHjAUAA_wIAIfIBQAD_AgAh9AEBAJADACEF4AEBALYDACHhAQEAtgMAIeMBQAC3AwAh8gFAALcDACH0AQEA0gMAIQcGAADdAwAgBwAA3gMAIOABAQC2AwAh4QEBALYDACHjAUAAtwMAIfIBQAC3AwAh9AEBANIDACEHBgAA4AMAIAcAAOEDACDgAQEAAAAB4QEBAAAAAeMBQAAAAAHyAUAAAAAB9AEBAAAAAQQHAAC7AwAg4AEBAAAAAeEBAQAAAAHjAUAAAAABAgAAAAUAICEAAMMEACADAAAABQAgIQAAwwQAICIAAMIEACABGgAAoAYAMAoEAACbAwAgBwAAkQMAIN0BAACyAwAw3gEAAAMAEN8BAACyAwAw4AEBAAAAAeEBAQD-AgAh4gEBAP4CACHjAUAA_wIAIaICAACxAwAgAgAAAAUAIBoAAMIEACACAAAAwAQAIBoAAMEEACAH3QEAAL8EADDeAQAAwAQAEN8BAAC_BAAw4AEBAP4CACHhAQEA_gIAIeIBAQD-AgAh4wFAAP8CACEH3QEAAL8EADDeAQAAwAQAEN8BAAC_BAAw4AEBAP4CACHhAQEA_gIAIeIBAQD-AgAh4wFAAP8CACED4AEBALYDACHhAQEAtgMAIeMBQAC3AwAhBAcAALkDACDgAQEAtgMAIeEBAQC2AwAh4wFAALcDACEEBwAAuwMAIOABAQAAAAHhAQEAAAAB4wFAAAAAARUDAADGBAAgCwAAxwQAIAwAAMgEACANAADJBAAgDgAAygQAIA8AAMsEACAQAADMBAAg4AEBAAAAAeMBQAAAAAHyAUAAAAAB-gEBAAAAAfsBAQAAAAH8AQEAAAAB_gEAAAD-AQL_AUAAAAABgAIAAMUEACCBAgEAAAABggIBAAAAAYMCCAAAAAGEAgIAAAABhQIBAAAAAQGnAgEAAAAEBCEAALgEADClAgAAuQQAMKoCAAC8BAAwrQIAALsEACAEIQAArAQAMKUCAACtBAAwqgIAALAEADCtAgAArwQAIAQhAACgBAAwpQIAAKEEADCqAgAApAQAMK0CAACjBAAgAyEAAJ4GACClAgAAnwYAIKoCAAABACAEIQAAlAQAMKUCAACVBAAwqgIAAJgEADCtAgAAlwQAIAQhAACIBAAwpQIAAIkEADCqAgAAjAQAMK0CAACLBAAgAyEAAP0DADClAgAA_gMAMKoCAACABAAwBwQAANYDACAHAADYAwAg4AEBAAAAAeEBAQAAAAHiAQEAAAAB4wFAAAAAAfIBQAAAAAECAAAAEQAgIQAA1QQAIAMAAAARACAhAADVBAAgIgAA1AQAIAEaAACdBgAwAgAAABEAIBoAANQEACACAAAAqAQAIBoAANMEACAF4AEBALYDACHhAQEAtgMAIeIBAQC2AwAh4wFAALcDACHyAUAAtwMAIQcEAADTAwAgBwAA1QMAIOABAQC2AwAh4QEBALYDACHiAQEAtgMAIeMBQAC3AwAh8gFAALcDACEHBAAA1gMAIAcAANgDACDgAQEAAAAB4QEBAAAAAeIBAQAAAAHjAUAAAAAB8gFAAAAAAQcEAADfAwAgBwAA4QMAIOABAQAAAAHhAQEAAAAB4gEBAAAAAeMBQAAAAAHyAUAAAAABAgAAAAoAICEAAN4EACADAAAACgAgIQAA3gQAICIAAN0EACABGgAAnAYAMAIAAAAKACAaAADdBAAgAgAAALQEACAaAADcBAAgBeABAQC2AwAh4QEBALYDACHiAQEAtgMAIeMBQAC3AwAh8gFAALcDACEHBAAA3AMAIAcAAN4DACDgAQEAtgMAIeEBAQC2AwAh4gEBALYDACHjAUAAtwMAIfIBQAC3AwAhBwQAAN8DACAHAADhAwAg4AEBAAAAAeEBAQAAAAHiAQEAAAAB4wFAAAAAAfIBQAAAAAEEIQAA1gQAMKUCAADXBAAwqgIAALAEADCtAgAA2QQAIAQhAADNBAAwpQIAAM4EADCqAgAApAQAMK0CAADQBAAgAyEAAJoGACClAgAAmwYAIKoCAAABACADIQAA6QMAMKUCAADqAwAwqgIAAOwDADAAAAAAAAohAADpBAAwIgAA7QQAMKUCAADqBAAwpgIAAOsEADCnAgAA7AQAMKgCAADsBAAwqQIAAOwEADCqAgAA7AQAMKsCAADuBAAwrAIAAO8EADANBQAA3wQAIAcAAOEEACAIAADgBAAg4AEBAAAAAeEBAQAAAAHjAUAAAAAB8gFAAAAAAfUBAQAAAAH2AQEAAAAB9wEBAAAAAfgBAQAAAAH5AQEAAAAB-gEBAAAAAQIAAAAtACAhAADzBAAgAwAAAC0AICEAAPMEACAiAADyBAAgEQUAAJUDACAHAACRAwAgCAAAlgMAIAkAAJcDACDdAQAAlAMAMN4BAAAMABDfAQAAlAMAMOABAQAAAAHhAQEAAAAB4wFAAP8CACHyAUAA_wIAIfUBAQCQAwAh9gEBAJADACH3AQEAkAMAIfgBAQCQAwAh-QEBAJADACH6AQEAkAMAIQIAAAAtACAaAADyBAAgAgAAAPAEACAaAADxBAAgDd0BAADvBAAw3gEAAPAEABDfAQAA7wQAMOABAQD-AgAh4QEBAP4CACHjAUAA_wIAIfIBQAD_AgAh9QEBAJADACH2AQEAkAMAIfcBAQCQAwAh-AEBAJADACH5AQEAkAMAIfoBAQCQAwAhDd0BAADvBAAw3gEAAPAEABDfAQAA7wQAMOABAQD-AgAh4QEBAP4CACHjAUAA_wIAIfIBQAD_AgAh9QEBAJADACH2AQEAkAMAIfcBAQCQAwAh-AEBAJADACH5AQEAkAMAIfoBAQCQAwAhCuABAQC2AwAh4QEBALYDACHjAUAAtwMAIfIBQAC3AwAh9QEBANIDACH2AQEA0gMAIfcBAQDSAwAh-AEBANIDACH5AQEA0gMAIfoBAQDSAwAhDQUAAOUDACAHAADnAwAgCAAA5gMAIOABAQC2AwAh4QEBALYDACHjAUAAtwMAIfIBQAC3AwAh9QEBANIDACH2AQEA0gMAIfcBAQDSAwAh-AEBANIDACH5AQEA0gMAIfoBAQDSAwAhDQUAAN8EACAHAADhBAAgCAAA4AQAIOABAQAAAAHhAQEAAAAB4wFAAAAAAfIBQAAAAAH1AQEAAAAB9gEBAAAAAfcBAQAAAAH4AQEAAAAB-QEBAAAAAfoBAQAAAAEDIQAA6QQAMKUCAADqBAAwqgIAAOwEADAAAAAKIQAA-QQAMCIAAPwEADClAgAA-gQAMKYCAAD7BAAwpwIAAOwDADCoAgAA7AMAMKkCAADsAwAwqgIAAOwDADCrAgAA_QQAMKwCAADvAwAwFQMAAMYEACALAADHBAAgDAAAyAQAIA0AAMkEACAOAADKBAAgDwAAywQAIBEAAPQEACDgAQEAAAAB4wFAAAAAAfIBQAAAAAH6AQEAAAAB-wEBAAAAAfwBAQAAAAH-AQAAAP4BAv8BQAAAAAGAAgAAxQQAIIECAQAAAAGCAgEAAAABgwIIAAAAAYQCAgAAAAGFAgEAAAABAgAAABYAICEAAIAFACADAAAAFgAgIQAAgAUAICIAAP8EACACAAAAFgAgGgAA_wQAIAIAAADwAwAgGgAA_gQAIA7gAQEAtgMAIeMBQAC3AwAh8gFAALcDACH6AQEAtgMAIfsBAQC2AwAh_AEBALYDACH-AQAA8gP-ASL_AUAAtwMAIYACAADzAwAggQIBANIDACGCAgEA0gMAIYMCCAD0AwAhhAICAMkDACGFAgEA0gMAIRUDAAD2AwAgCwAA9wMAIAwAAPgDACANAAD5AwAgDgAA-gMAIA8AAPsDACARAADoBAAg4AEBALYDACHjAUAAtwMAIfIBQAC3AwAh-gEBALYDACH7AQEAtgMAIfwBAQC2AwAh_gEAAPID_gEi_wFAALcDACGAAgAA8wMAIIECAQDSAwAhggIBANIDACGDAggA9AMAIYQCAgDJAwAhhQIBANIDACEVAwAAxgQAIAsAAMcEACAMAADIBAAgDQAAyQQAIA4AAMoEACAPAADLBAAgEQAA9AQAIOABAQAAAAHjAUAAAAAB8gFAAAAAAfoBAQAAAAH7AQEAAAAB_AEBAAAAAf4BAAAA_gEC_wFAAAAAAYACAADFBAAggQIBAAAAAYICAQAAAAGDAggAAAABhAICAAAAAYUCAQAAAAEDIQAA-QQAMKUCAAD6BAAwqgIAAOwDADAAAAAAAAABpwJAAAAAAQUhAACVBgAgIgAAmAYAIKUCAACWBgAgpgIAAJcGACCqAgAAAQAgAyEAAJUGACClAgAAlgYAIKoCAAABACAAAAAFIQAAkAYAICIAAJMGACClAgAAkQYAIKYCAACSBgAgqgIAAAEAIAMhAACQBgAgpQIAAJEGACCqAgAAAQAgAAAAAacCIAAAAAEBpwIAAACaAgIBpwIAAACcAgILIQAA6QUAMCIAAO0FADClAgAA6gUAMKYCAADrBQAwpwIAALwEADCoAgAAvAQAMKkCAAC8BAAwqgIAALwEADCrAgAA7gUAMKwCAAC_BAAwrQIAAOwFACALIQAA3QUAMCIAAOIFADClAgAA3gUAMKYCAADfBQAwpwIAAOEFADCoAgAA4QUAMKkCAADhBQAwqgIAAOEFADCrAgAA4wUAMKwCAADkBQAwrQIAAOAFACALIQAA1AUAMCIAANgFADClAgAA1QUAMKYCAADWBQAwpwIAALAEADCoAgAAsAQAMKkCAACwBAAwqgIAALAEADCrAgAA2QUAMKwCAACzBAAwrQIAANcFACALIQAAywUAMCIAAM8FADClAgAAzAUAMKYCAADNBQAwpwIAAKQEADCoAgAApAQAMKkCAACkBAAwqgIAAKQEADCrAgAA0AUAMKwCAACnBAAwrQIAAM4FACALIQAAwgUAMCIAAMYFADClAgAAwwUAMKYCAADEBQAwpwIAAOwDADCoAgAA7AMAMKkCAADsAwAwqgIAAOwDADCrAgAAxwUAMKwCAADvAwAwrQIAAMUFACAHIQAAvQUAICIAAMAFACClAgAAvgUAIKYCAAC_BQAgqAIAAAwAIKkCAAAMACCqAgAALQAgCyEAALQFADAiAAC4BQAwpQIAALUFADCmAgAAtgUAMKcCAACYBAAwqAIAAJgEADCpAgAAmAQAMKoCAACYBAAwqwIAALkFADCsAgAAmwQAMK0CAAC3BQAgCyEAAKsFADAiAACvBQAwpQIAAKwFADCmAgAArQUAMKcCAACMBAAwqAIAAIwEADCpAgAAjAQAMKoCAACMBAAwqwIAALAFADCsAgAAjwQAMK0CAACuBQAgCyEAAJ8FADAiAACkBQAwpQIAAKAFADCmAgAAoQUAMKcCAACjBQAwqAIAAKMFADCpAgAAowUAMKoCAACjBQAwqwIAAKUFADCsAgAApgUAMK0CAACiBQAgB-ABAQAAAAHjAUAAAAAB8gFAAAAAAYsCQAAAAAGVAgEAAAABlgIBAAAAAZcCAQAAAAECAAAAQgAgIQAAqgUAIAMAAABCACAhAACqBQAgIgAAqQUAIAEaAACPBgAwDAcAAJEDACDdAQAAjwMAMN4BAABAABDfAQAAjwMAMOABAQAAAAHhAQEA_gIAIeMBQAD_AgAh8gFAAP8CACGLAkAA_wIAIZUCAQAAAAGWAgEAkAMAIZcCAQCQAwAhAgAAAEIAIBoAAKkFACACAAAApwUAIBoAAKgFACAL3QEAAKYFADDeAQAApwUAEN8BAACmBQAw4AEBAP4CACHhAQEA_gIAIeMBQAD_AgAh8gFAAP8CACGLAkAA_wIAIZUCAQD-AgAhlgIBAJADACGXAgEAkAMAIQvdAQAApgUAMN4BAACnBQAQ3wEAAKYFADDgAQEA_gIAIeEBAQD-AgAh4wFAAP8CACHyAUAA_wIAIYsCQAD_AgAhlQIBAP4CACGWAgEAkAMAIZcCAQCQAwAhB-ABAQC2AwAh4wFAALcDACHyAUAAtwMAIYsCQAC3AwAhlQIBALYDACGWAgEA0gMAIZcCAQDSAwAhB-ABAQC2AwAh4wFAALcDACHyAUAAtwMAIYsCQAC3AwAhlQIBALYDACGWAgEA0gMAIZcCAQDSAwAhB-ABAQAAAAHjAUAAAAAB8gFAAAAAAYsCQAAAAAGVAgEAAAABlgIBAAAAAZcCAQAAAAEHBAAAwgMAIOABAQAAAAHiAQEAAAAB4wFAAAAAAe8BAQAAAAHxAQAAAPEBAvIBQAAAAAECAAAAJAAgIQAAswUAIAMAAAAkACAhAACzBQAgIgAAsgUAIAEaAACOBgAwAgAAACQAIBoAALIFACACAAAAkAQAIBoAALEFACAG4AEBALYDACHiAQEAtgMAIeMBQAC3AwAh7wEBALYDACHxAQAAvwPxASLyAUAAtwMAIQcEAADAAwAg4AEBALYDACHiAQEAtgMAIeMBQAC3AwAh7wEBALYDACHxAQAAvwPxASLyAUAAtwMAIQcEAADCAwAg4AEBAAAAAeIBAQAAAAHjAUAAAAAB7wEBAAAAAfEBAAAA8QEC8gFAAAAAAQUEAADMAwAg4AEBAAAAAeIBAQAAAAHjAUAAAAAB8wECAAAAAQIAAAAgACAhAAC8BQAgAwAAACAAICEAALwFACAiAAC7BQAgARoAAI0GADACAAAAIAAgGgAAuwUAIAIAAACcBAAgGgAAugUAIATgAQEAtgMAIeIBAQC2AwAh4wFAALcDACHzAQIAyQMAIQUEAADKAwAg4AEBALYDACHiAQEAtgMAIeMBQAC3AwAh8wECAMkDACEFBAAAzAMAIOABAQAAAAHiAQEAAAAB4wFAAAAAAfMBAgAAAAEMBQAA3wQAIAgAAOAEACAJAADiBAAg4AEBAAAAAeMBQAAAAAHyAUAAAAAB9QEBAAAAAfYBAQAAAAH3AQEAAAAB-AEBAAAAAfkBAQAAAAH6AQEAAAABAgAAAC0AICEAAL0FACADAAAADAAgIQAAvQUAICIAAMEFACAOAAAADAAgBQAA5QMAIAgAAOYDACAJAADoAwAgGgAAwQUAIOABAQC2AwAh4wFAALcDACHyAUAAtwMAIfUBAQDSAwAh9gEBANIDACH3AQEA0gMAIfgBAQDSAwAh-QEBANIDACH6AQEA0gMAIQwFAADlAwAgCAAA5gMAIAkAAOgDACDgAQEAtgMAIeMBQAC3AwAh8gFAALcDACH1AQEA0gMAIfYBAQDSAwAh9wEBANIDACH4AQEA0gMAIfkBAQDSAwAh-gEBANIDACEUAwAAxgQAIAsAAMcEACAMAADIBAAgDgAAygQAIA8AAMsEACAQAADMBAAgEQAA9AQAIOABAQAAAAHjAUAAAAAB8gFAAAAAAfoBAQAAAAH7AQEAAAAB_AEBAAAAAf4BAAAA_gEC_wFAAAAAAYACAADFBAAggQIBAAAAAYICAQAAAAGDAggAAAABhAICAAAAAQIAAAAWACAhAADKBQAgAwAAABYAICEAAMoFACAiAADJBQAgARoAAIwGADACAAAAFgAgGgAAyQUAIAIAAADwAwAgGgAAyAUAIA3gAQEAtgMAIeMBQAC3AwAh8gFAALcDACH6AQEAtgMAIfsBAQC2AwAh_AEBALYDACH-AQAA8gP-ASL_AUAAtwMAIYACAADzAwAggQIBANIDACGCAgEA0gMAIYMCCAD0AwAhhAICAMkDACEUAwAA9gMAIAsAAPcDACAMAAD4AwAgDgAA-gMAIA8AAPsDACAQAAD8AwAgEQAA6AQAIOABAQC2AwAh4wFAALcDACHyAUAAtwMAIfoBAQC2AwAh-wEBALYDACH8AQEAtgMAIf4BAADyA_4BIv8BQAC3AwAhgAIAAPMDACCBAgEA0gMAIYICAQDSAwAhgwIIAPQDACGEAgIAyQMAIRQDAADGBAAgCwAAxwQAIAwAAMgEACAOAADKBAAgDwAAywQAIBAAAMwEACARAAD0BAAg4AEBAAAAAeMBQAAAAAHyAUAAAAAB-gEBAAAAAfsBAQAAAAH8AQEAAAAB_gEAAAD-AQL_AUAAAAABgAIAAMUEACCBAgEAAAABggIBAAAAAYMCCAAAAAGEAgIAAAABBwQAANYDACAGAADXAwAg4AEBAAAAAeIBAQAAAAHjAUAAAAAB8gFAAAAAAfQBAQAAAAECAAAAEQAgIQAA0wUAIAMAAAARACAhAADTBQAgIgAA0gUAIAEaAACLBgAwAgAAABEAIBoAANIFACACAAAAqAQAIBoAANEFACAF4AEBALYDACHiAQEAtgMAIeMBQAC3AwAh8gFAALcDACH0AQEA0gMAIQcEAADTAwAgBgAA1AMAIOABAQC2AwAh4gEBALYDACHjAUAAtwMAIfIBQAC3AwAh9AEBANIDACEHBAAA1gMAIAYAANcDACDgAQEAAAAB4gEBAAAAAeMBQAAAAAHyAUAAAAAB9AEBAAAAAQcEAADfAwAgBgAA4AMAIOABAQAAAAHiAQEAAAAB4wFAAAAAAfIBQAAAAAH0AQEAAAABAgAAAAoAICEAANwFACADAAAACgAgIQAA3AUAICIAANsFACABGgAAigYAMAIAAAAKACAaAADbBQAgAgAAALQEACAaAADaBQAgBeABAQC2AwAh4gEBALYDACHjAUAAtwMAIfIBQAC3AwAh9AEBANIDACEHBAAA3AMAIAYAAN0DACDgAQEAtgMAIeIBAQC2AwAh4wFAALcDACHyAUAAtwMAIfQBAQDSAwAhBwQAAN8DACAGAADgAwAg4AEBAAAAAeIBAQAAAAHjAUAAAAAB8gFAAAAAAfQBAQAAAAEM4AEBAAAAAeMBQAAAAAHyAUAAAAABjAIBAAAAAY0CAQAAAAGOAgEAAAABjwIBAAAAAZACAQAAAAGRAkAAAAABkgJAAAAAAZMCAQAAAAGUAgEAAAABAgAAADgAICEAAOgFACADAAAAOAAgIQAA6AUAICIAAOcFACABGgAAiQYAMBEHAACRAwAg3QEAAJIDADDeAQAANgAQ3wEAAJIDADDgAQEAAAAB4QEBAP4CACHjAUAA_wIAIfIBQAD_AgAhjAIBAP4CACGNAgEA_gIAIY4CAQCQAwAhjwIBAJADACGQAgEAkAMAIZECQACTAwAhkgJAAJMDACGTAgEAkAMAIZQCAQCQAwAhAgAAADgAIBoAAOcFACACAAAA5QUAIBoAAOYFACAQ3QEAAOQFADDeAQAA5QUAEN8BAADkBQAw4AEBAP4CACHhAQEA_gIAIeMBQAD_AgAh8gFAAP8CACGMAgEA_gIAIY0CAQD-AgAhjgIBAJADACGPAgEAkAMAIZACAQCQAwAhkQJAAJMDACGSAkAAkwMAIZMCAQCQAwAhlAIBAJADACEQ3QEAAOQFADDeAQAA5QUAEN8BAADkBQAw4AEBAP4CACHhAQEA_gIAIeMBQAD_AgAh8gFAAP8CACGMAgEA_gIAIY0CAQD-AgAhjgIBAJADACGPAgEAkAMAIZACAQCQAwAhkQJAAJMDACGSAkAAkwMAIZMCAQCQAwAhlAIBAJADACEM4AEBALYDACHjAUAAtwMAIfIBQAC3AwAhjAIBALYDACGNAgEAtgMAIY4CAQDSAwAhjwIBANIDACGQAgEA0gMAIZECQACIBQAhkgJAAIgFACGTAgEA0gMAIZQCAQDSAwAhDOABAQC2AwAh4wFAALcDACHyAUAAtwMAIYwCAQC2AwAhjQIBALYDACGOAgEA0gMAIY8CAQDSAwAhkAIBANIDACGRAkAAiAUAIZICQACIBQAhkwIBANIDACGUAgEA0gMAIQzgAQEAAAAB4wFAAAAAAfIBQAAAAAGMAgEAAAABjQIBAAAAAY4CAQAAAAGPAgEAAAABkAIBAAAAAZECQAAAAAGSAkAAAAABkwIBAAAAAZQCAQAAAAEEBAAAugMAIOABAQAAAAHiAQEAAAAB4wFAAAAAAQIAAAAFACAhAADxBQAgAwAAAAUAICEAAPEFACAiAADwBQAgARoAAIgGADACAAAABQAgGgAA8AUAIAIAAADABAAgGgAA7wUAIAPgAQEAtgMAIeIBAQC2AwAh4wFAALcDACEEBAAAuAMAIOABAQC2AwAh4gEBALYDACHjAUAAtwMAIQQEAAC6AwAg4AEBAAAAAeIBAQAAAAHjAUAAAAABBCEAAOkFADClAgAA6gUAMKoCAAC8BAAwrQIAAOwFACAEIQAA3QUAMKUCAADeBQAwqgIAAOEFADCtAgAA4AUAIAQhAADUBQAwpQIAANUFADCqAgAAsAQAMK0CAADXBQAgBCEAAMsFADClAgAAzAUAMKoCAACkBAAwrQIAAM4FACAEIQAAwgUAMKUCAADDBQAwqgIAAOwDADCtAgAAxQUAIAMhAAC9BQAgpQIAAL4FACCqAgAALQAgBCEAALQFADClAgAAtQUAMKoCAACYBAAwrQIAALcFACAEIQAAqwUAMKUCAACsBQAwqgIAAIwEADCtAgAArgUAIAQhAACfBQAwpQIAAKAFADCqAgAAowUAMK0CAACiBQAgAAAAAAAKBQAA_QUAIAcAAIQGACAIAAD-BQAgCQAA_wUAIPUBAADOAwAg9gEAAM4DACD3AQAAzgMAIPgBAADOAwAg-QEAAM4DACD6AQAAzgMAIAAAAAsDAAD7BQAgBgAAgAYAIAsAAP0FACAMAAD-BQAgDgAAgQYAIA8AAIIGACASAAD8BQAgEwAA_wUAIBQAAIMGACD3AQAAzgMAIJ4CAADOAwAgCwMAAPsFACALAAD9BQAgDAAA_gUAIA0AAIQGACAOAACBBgAgDwAAggYAIBAAAIYGACARAACHBgAggQIAAM4DACCCAgAAzgMAIIUCAADOAwAgAAAD4AEBAAAAAeIBAQAAAAHjAUAAAAABDOABAQAAAAHjAUAAAAAB8gFAAAAAAYwCAQAAAAGNAgEAAAABjgIBAAAAAY8CAQAAAAGQAgEAAAABkQJAAAAAAZICQAAAAAGTAgEAAAABlAIBAAAAAQXgAQEAAAAB4gEBAAAAAeMBQAAAAAHyAUAAAAAB9AEBAAAAAQXgAQEAAAAB4gEBAAAAAeMBQAAAAAHyAUAAAAAB9AEBAAAAAQ3gAQEAAAAB4wFAAAAAAfIBQAAAAAH6AQEAAAAB-wEBAAAAAfwBAQAAAAH-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-QUAIBIAAPMFACATAAD2BQAgFAAA-gUAIOABAQAAAAHjAUAAAAAB8QEAAACcAgLyAUAAAAAB9QEBAAAAAfYBAQAAAAH3AQEAAAABmAIgAAAAAZoCAAAAmgICnAIgAAAAAZ0CIAAAAAGeAkAAAAABAgAAAAEAICEAAKsGACANBwAA4QQAIAgAAOAEACAJAADiBAAg4AEBAAAAAeEBAQAAAAHjAUAAAAAB8gFAAAAAAfUBAQAAAAH2AQEAAAAB9wEBAAAAAfgBAQAAAAH5AQEAAAAB-gEBAAAAAQIAAAAtACAhAACtBgAgFQMAAMYEACAMAADIBAAgDQAAyQQAIA4AAMoEACAPAADLBAAgEAAAzAQAIBEAAPQEACDgAQEAAAAB4wFAAAAAAfIBQAAAAAH6AQEAAAAB-wEBAAAAAfwBAQAAAAH-AQAAAP4BAv8BQAAAAAGAAgAAxQQAIIECAQAAAAGCAgEAAAABgwIIAAAAAYQCAgAAAAGFAgEAAAABAgAAABYAICEAAK8GACADAAAAHAAgIQAAqwYAICIAALMGACAWAAAAHAAgAwAAlgUAIAYAAJsFACAMAACZBQAgDgAAnAUAIA8AAJ0FACASAACXBQAgEwAAmgUAIBQAAJ4FACAaAACzBgAg4AEBALYDACHjAUAAtwMAIfEBAACVBZwCIvIBQAC3AwAh9QEBALYDACH2AQEAtgMAIfcBAQDSAwAhmAIgAJMFACGaAgAAlAWaAiKcAiAAkwUAIZ0CIACTBQAhngJAAIgFACEUAwAAlgUAIAYAAJsFACAMAACZBQAgDgAAnAUAIA8AAJ0FACASAACXBQAgEwAAmgUAIBQAAJ4FACDgAQEAtgMAIeMBQAC3AwAh8QEAAJUFnAIi8gFAALcDACH1AQEAtgMAIfYBAQC2AwAh9wEBANIDACGYAiAAkwUAIZoCAACUBZoCIpwCIACTBQAhnQIgAJMFACGeAkAAiAUAIQMAAAAMACAhAACtBgAgIgAAtgYAIA8AAAAMACAHAADnAwAgCAAA5gMAIAkAAOgDACAaAAC2BgAg4AEBALYDACHhAQEAtgMAIeMBQAC3AwAh8gFAALcDACH1AQEA0gMAIfYBAQDSAwAh9wEBANIDACH4AQEA0gMAIfkBAQDSAwAh-gEBANIDACENBwAA5wMAIAgAAOYDACAJAADoAwAg4AEBALYDACHhAQEAtgMAIeMBQAC3AwAh8gFAALcDACH1AQEA0gMAIfYBAQDSAwAh9wEBANIDACH4AQEA0gMAIfkBAQDSAwAh-gEBANIDACEDAAAAFAAgIQAArwYAICIAALkGACAXAAAAFAAgAwAA9gMAIAwAAPgDACANAAD5AwAgDgAA-gMAIA8AAPsDACAQAAD8AwAgEQAA6AQAIBoAALkGACDgAQEAtgMAIeMBQAC3AwAh8gFAALcDACH6AQEAtgMAIfsBAQC2AwAh_AEBALYDACH-AQAA8gP-ASL_AUAAtwMAIYACAADzAwAggQIBANIDACGCAgEA0gMAIYMCCAD0AwAhhAICAMkDACGFAgEA0gMAIRUDAAD2AwAgDAAA-AMAIA0AAPkDACAOAAD6AwAgDwAA-wMAIBAAAPwDACARAADoBAAg4AEBALYDACHjAUAAtwMAIfIBQAC3AwAh-gEBALYDACH7AQEAtgMAIfwBAQC2AwAh_gEAAPID_gEi_wFAALcDACGAAgAA8wMAIIECAQDSAwAhggIBANIDACGDAggA9AMAIYQCAgDJAwAhhQIBANIDACEUAwAA8gUAIAYAAPcFACALAAD0BQAgDgAA-AUAIA8AAPkFACASAADzBQAgEwAA9gUAIBQAAPoFACDgAQEAAAAB4wFAAAAAAfEBAAAAnAIC8gFAAAAAAfUBAQAAAAH2AQEAAAAB9wEBAAAAAZgCIAAAAAGaAgAAAJoCApwCIAAAAAGdAiAAAAABngJAAAAAAQIAAAABACAhAAC6BgAgDQUAAN8EACAHAADhBAAgCQAA4gQAIOABAQAAAAHhAQEAAAAB4wFAAAAAAfIBQAAAAAH1AQEAAAAB9gEBAAAAAfcBAQAAAAH4AQEAAAAB-QEBAAAAAfoBAQAAAAECAAAALQAgIQAAvAYAIBUDAADGBAAgCwAAxwQAIA0AAMkEACAOAADKBAAgDwAAywQAIBAAAMwEACARAAD0BAAg4AEBAAAAAeMBQAAAAAHyAUAAAAAB-gEBAAAAAfsBAQAAAAH8AQEAAAAB_gEAAAD-AQL_AUAAAAABgAIAAMUEACCBAgEAAAABggIBAAAAAYMCCAAAAAGEAgIAAAABhQIBAAAAAQIAAAAWACAhAAC-BgAgAwAAABwAICEAALoGACAiAADCBgAgFgAAABwAIAMAAJYFACAGAACbBQAgCwAAmAUAIA4AAJwFACAPAACdBQAgEgAAlwUAIBMAAJoFACAUAACeBQAgGgAAwgYAIOABAQC2AwAh4wFAALcDACHxAQAAlQWcAiLyAUAAtwMAIfUBAQC2AwAh9gEBALYDACH3AQEA0gMAIZgCIACTBQAhmgIAAJQFmgIinAIgAJMFACGdAiAAkwUAIZ4CQACIBQAhFAMAAJYFACAGAACbBQAgCwAAmAUAIA4AAJwFACAPAACdBQAgEgAAlwUAIBMAAJoFACAUAACeBQAg4AEBALYDACHjAUAAtwMAIfEBAACVBZwCIvIBQAC3AwAh9QEBALYDACH2AQEAtgMAIfcBAQDSAwAhmAIgAJMFACGaAgAAlAWaAiKcAiAAkwUAIZ0CIACTBQAhngJAAIgFACEDAAAADAAgIQAAvAYAICIAAMUGACAPAAAADAAgBQAA5QMAIAcAAOcDACAJAADoAwAgGgAAxQYAIOABAQC2AwAh4QEBALYDACHjAUAAtwMAIfIBQAC3AwAh9QEBANIDACH2AQEA0gMAIfcBAQDSAwAh-AEBANIDACH5AQEA0gMAIfoBAQDSAwAhDQUAAOUDACAHAADnAwAgCQAA6AMAIOABAQC2AwAh4QEBALYDACHjAUAAtwMAIfIBQAC3AwAh9QEBANIDACH2AQEA0gMAIfcBAQDSAwAh-AEBANIDACH5AQEA0gMAIfoBAQDSAwAhAwAAABQAICEAAL4GACAiAADIBgAgFwAAABQAIAMAAPYDACALAAD3AwAgDQAA-QMAIA4AAPoDACAPAAD7AwAgEAAA_AMAIBEAAOgEACAaAADIBgAg4AEBALYDACHjAUAAtwMAIfIBQAC3AwAh-gEBALYDACH7AQEAtgMAIfwBAQC2AwAh_gEAAPID_gEi_wFAALcDACGAAgAA8wMAIIECAQDSAwAhggIBANIDACGDAggA9AMAIYQCAgDJAwAhhQIBANIDACEVAwAA9gMAIAsAAPcDACANAAD5AwAgDgAA-gMAIA8AAPsDACAQAAD8AwAgEQAA6AQAIOABAQC2AwAh4wFAALcDACHyAUAAtwMAIfoBAQC2AwAh-wEBALYDACH8AQEAtgMAIf4BAADyA_4BIv8BQAC3AwAhgAIAAPMDACCBAgEA0gMAIYICAQDSAwAhgwIIAPQDACGEAgIAyQMAIYUCAQDSAwAhFAMAAPIFACAGAAD3BQAgCwAA9AUAIAwAAPUFACAPAAD5BQAgEgAA8wUAIBMAAPYFACAUAAD6BQAg4AEBAAAAAeMBQAAAAAHxAQAAAJwCAvIBQAAAAAH1AQEAAAAB9gEBAAAAAfcBAQAAAAGYAiAAAAABmgIAAACaAgKcAiAAAAABnQIgAAAAAZ4CQAAAAAECAAAAAQAgIQAAyQYAIBUDAADGBAAgCwAAxwQAIAwAAMgEACANAADJBAAgDwAAywQAIBAAAMwEACARAAD0BAAg4AEBAAAAAeMBQAAAAAHyAUAAAAAB-gEBAAAAAfsBAQAAAAH8AQEAAAAB_gEAAAD-AQL_AUAAAAABgAIAAMUEACCBAgEAAAABggIBAAAAAYMCCAAAAAGEAgIAAAABhQIBAAAAAQIAAAAWACAhAADLBgAgAwAAABwAICEAAMkGACAiAADPBgAgFgAAABwAIAMAAJYFACAGAACbBQAgCwAAmAUAIAwAAJkFACAPAACdBQAgEgAAlwUAIBMAAJoFACAUAACeBQAgGgAAzwYAIOABAQC2AwAh4wFAALcDACHxAQAAlQWcAiLyAUAAtwMAIfUBAQC2AwAh9gEBALYDACH3AQEA0gMAIZgCIACTBQAhmgIAAJQFmgIinAIgAJMFACGdAiAAkwUAIZ4CQACIBQAhFAMAAJYFACAGAACbBQAgCwAAmAUAIAwAAJkFACAPAACdBQAgEgAAlwUAIBMAAJoFACAUAACeBQAg4AEBALYDACHjAUAAtwMAIfEBAACVBZwCIvIBQAC3AwAh9QEBALYDACH2AQEAtgMAIfcBAQDSAwAhmAIgAJMFACGaAgAAlAWaAiKcAiAAkwUAIZ0CIACTBQAhngJAAIgFACEDAAAAFAAgIQAAywYAICIAANIGACAXAAAAFAAgAwAA9gMAIAsAAPcDACAMAAD4AwAgDQAA-QMAIA8AAPsDACAQAAD8AwAgEQAA6AQAIBoAANIGACDgAQEAtgMAIeMBQAC3AwAh8gFAALcDACH6AQEAtgMAIfsBAQC2AwAh_AEBALYDACH-AQAA8gP-ASL_AUAAtwMAIYACAADzAwAggQIBANIDACGCAgEA0gMAIYMCCAD0AwAhhAICAMkDACGFAgEA0gMAIRUDAAD2AwAgCwAA9wMAIAwAAPgDACANAAD5AwAgDwAA-wMAIBAAAPwDACARAADoBAAg4AEBALYDACHjAUAAtwMAIfIBQAC3AwAh-gEBALYDACH7AQEAtgMAIfwBAQC2AwAh_gEAAPID_gEi_wFAALcDACGAAgAA8wMAIIECAQDSAwAhggIBANIDACGDAggA9AMAIYQCAgDJAwAhhQIBANIDACEUAwAA8gUAIAYAAPcFACALAAD0BQAgDAAA9QUAIA4AAPgFACASAADzBQAgEwAA9gUAIBQAAPoFACDgAQEAAAAB4wFAAAAAAfEBAAAAnAIC8gFAAAAAAfUBAQAAAAH2AQEAAAAB9wEBAAAAAZgCIAAAAAGaAgAAAJoCApwCIAAAAAGdAiAAAAABngJAAAAAAQIAAAABACAhAADTBgAgFQMAAMYEACALAADHBAAgDAAAyAQAIA0AAMkEACAOAADKBAAgEAAAzAQAIBEAAPQEACDgAQEAAAAB4wFAAAAAAfIBQAAAAAH6AQEAAAAB-wEBAAAAAfwBAQAAAAH-AQAAAP4BAv8BQAAAAAGAAgAAxQQAIIECAQAAAAGCAgEAAAABgwIIAAAAAYQCAgAAAAGFAgEAAAABAgAAABYAICEAANUGACADAAAAHAAgIQAA0wYAICIAANkGACAWAAAAHAAgAwAAlgUAIAYAAJsFACALAACYBQAgDAAAmQUAIA4AAJwFACASAACXBQAgEwAAmgUAIBQAAJ4FACAaAADZBgAg4AEBALYDACHjAUAAtwMAIfEBAACVBZwCIvIBQAC3AwAh9QEBALYDACH2AQEAtgMAIfcBAQDSAwAhmAIgAJMFACGaAgAAlAWaAiKcAiAAkwUAIZ0CIACTBQAhngJAAIgFACEUAwAAlgUAIAYAAJsFACALAACYBQAgDAAAmQUAIA4AAJwFACASAACXBQAgEwAAmgUAIBQAAJ4FACDgAQEAtgMAIeMBQAC3AwAh8QEAAJUFnAIi8gFAALcDACH1AQEAtgMAIfYBAQC2AwAh9wEBANIDACGYAiAAkwUAIZoCAACUBZoCIpwCIACTBQAhnQIgAJMFACGeAkAAiAUAIQMAAAAUACAhAADVBgAgIgAA3AYAIBcAAAAUACADAAD2AwAgCwAA9wMAIAwAAPgDACANAAD5AwAgDgAA-gMAIBAAAPwDACARAADoBAAgGgAA3AYAIOABAQC2AwAh4wFAALcDACHyAUAAtwMAIfoBAQC2AwAh-wEBALYDACH8AQEAtgMAIf4BAADyA_4BIv8BQAC3AwAhgAIAAPMDACCBAgEA0gMAIYICAQDSAwAhgwIIAPQDACGEAgIAyQMAIYUCAQDSAwAhFQMAAPYDACALAAD3AwAgDAAA-AMAIA0AAPkDACAOAAD6AwAgEAAA_AMAIBEAAOgEACDgAQEAtgMAIeMBQAC3AwAh8gFAALcDACH6AQEAtgMAIfsBAQC2AwAh_AEBALYDACH-AQAA8gP-ASL_AUAAtwMAIYACAADzAwAggQIBANIDACGCAgEA0gMAIYMCCAD0AwAhhAICAMkDACGFAgEA0gMAIRQGAAD3BQAgCwAA9AUAIAwAAPUFACAOAAD4BQAgDwAA-QUAIBIAAPMFACATAAD2BQAgFAAA-gUAIOABAQAAAAHjAUAAAAAB8QEAAACcAgLyAUAAAAAB9QEBAAAAAfYBAQAAAAH3AQEAAAABmAIgAAAAAZoCAAAAmgICnAIgAAAAAZ0CIAAAAAGeAkAAAAABAgAAAAEAICEAAN0GACAVCwAAxwQAIAwAAMgEACANAADJBAAgDgAAygQAIA8AAMsEACAQAADMBAAgEQAA9AQAIOABAQAAAAHjAUAAAAAB8gFAAAAAAfoBAQAAAAH7AQEAAAAB_AEBAAAAAf4BAAAA_gEC_wFAAAAAAYACAADFBAAggQIBAAAAAYICAQAAAAGDAggAAAABhAICAAAAAYUCAQAAAAECAAAAFgAgIQAA3wYAIAMAAAAcACAhAADdBgAgIgAA4wYAIBYAAAAcACAGAACbBQAgCwAAmAUAIAwAAJkFACAOAACcBQAgDwAAnQUAIBIAAJcFACATAACaBQAgFAAAngUAIBoAAOMGACDgAQEAtgMAIeMBQAC3AwAh8QEAAJUFnAIi8gFAALcDACH1AQEAtgMAIfYBAQC2AwAh9wEBANIDACGYAiAAkwUAIZoCAACUBZoCIpwCIACTBQAhnQIgAJMFACGeAkAAiAUAIRQGAACbBQAgCwAAmAUAIAwAAJkFACAOAACcBQAgDwAAnQUAIBIAAJcFACATAACaBQAgFAAAngUAIOABAQC2AwAh4wFAALcDACHxAQAAlQWcAiLyAUAAtwMAIfUBAQC2AwAh9gEBALYDACH3AQEA0gMAIZgCIACTBQAhmgIAAJQFmgIinAIgAJMFACGdAiAAkwUAIZ4CQACIBQAhAwAAABQAICEAAN8GACAiAADmBgAgFwAAABQAIAsAAPcDACAMAAD4AwAgDQAA-QMAIA4AAPoDACAPAAD7AwAgEAAA_AMAIBEAAOgEACAaAADmBgAg4AEBALYDACHjAUAAtwMAIfIBQAC3AwAh-gEBALYDACH7AQEAtgMAIfwBAQC2AwAh_gEAAPID_gEi_wFAALcDACGAAgAA8wMAIIECAQDSAwAhggIBANIDACGDAggA9AMAIYQCAgDJAwAhhQIBANIDACEVCwAA9wMAIAwAAPgDACANAAD5AwAgDgAA-gMAIA8AAPsDACAQAAD8AwAgEQAA6AQAIOABAQC2AwAh4wFAALcDACHyAUAAtwMAIfoBAQC2AwAh-wEBALYDACH8AQEAtgMAIf4BAADyA_4BIv8BQAC3AwAhgAIAAPMDACCBAgEA0gMAIYICAQDSAwAhgwIIAPQDACGEAgIAyQMAIYUCAQDSAwAhCgMGAgY9BQoADws6BAw7Bg4-CA8_CRI5DRM8AxRDDgIEAAMHAAEJAwcCCgAMCwsEDBsGDR0BDiEIDyUJECkKES4FAwQAAwYNBQcAAQUFDgQHAAEIEgYJFwMKAAcDBAADBhMFBwABAwUYAAgZAAkaAAIEAAMHAAECBAADBwABAgkqAwoACwEJKwAHAy8ACzAADDEADjIADzMAEDQAETUAAQcAAQEHAAEIA0QAC0YADEcADkkAD0oAEkUAE0gAFEsAAAAAAwoAFCcAFSgAFgAAAAMKABQnABUoABYBBwABAQcAAQMKABsnABwoAB0AAAADCgAbJwAcKAAdAQcAAQEHAAEDCgAiJwAjKAAkAAAAAwoAIicAIygAJAAAAAMKAConACsoACwAAAADCgAqJwArKAAsAAADCgAxJwAyKAAzAAAAAwoAMScAMigAMwENxwEBAQ3NAQEFCgA4JwA7KAA8eQA5egA6AAAAAAAFCgA4JwA7KAA8eQA5egA6AQcAAQEHAAEDCgBBJwBCKABDAAAAAwoAQScAQigAQwMEAAMG9QEFBwABAwQAAwb7AQUHAAEDCgBIJwBJKABKAAAAAwoASCcASSgASgMEAAMGjQIFBwABAwQAAwaTAgUHAAEDCgBPJwBQKABRAAAAAwoATycAUCgAUQIEAAMHAAECBAADBwABBQoAVicAWSgAWnkAV3oAWAAAAAAABQoAVicAWSgAWnkAV3oAWAIEAAMHAAECBAADBwABAwoAXycAYCgAYQAAAAMKAF8nAGAoAGECBAADBwABAgQAAwcAAQMKAGYnAGcoAGgAAAADCgBmJwBnKABoFQIBFkwBF04BGE8BGVABG1IBHFQQHVURHlcBH1kQIFoSI1sBJFwBJV0QKWATKmEXK2IOLGMOLWQOLmUOL2YOMGgOMWoQMmsYM20ONG8QNXAZNnEON3IOOHMQOXYaOnceO3gNPHkNPXoNPnsNP3wNQH4NQYABEEKBAR9DgwENRIUBEEWGASBGhwENR4gBDUiJARBJjAEhSo0BJUuPASZMkAEmTZMBJk6UASZPlQEmUJcBJlGZARBSmgEnU5wBJlSeARBVnwEoVqABJlehASZYogEQWaUBKVqmAS1bpwEKXKgBCl2pAQpeqgEKX6sBCmCtAQphrwEQYrABLmOyAQpktAEQZbUBL2a2AQpntwEKaLgBEGm7ATBqvAE0a70BA2y-AQNtvwEDbsABA2_BAQNwwwEDccUBEHLGATVzyQEDdMsBEHXMATZ2zgEDd88BA3jQARB70wE3fNQBPX3VAQV-1gEFf9cBBYAB2AEFgQHZAQWCAdsBBYMB3QEQhAHeAT6FAeABBYYB4gEQhwHjAT-IAeQBBYkB5QEFigHmARCLAekBQIwB6gFEjQHrAQSOAewBBI8B7QEEkAHuAQSRAe8BBJIB8QEEkwHzARCUAfQBRZUB9wEElgH5ARCXAfoBRpgB_AEEmQH9AQSaAf4BEJsBgQJHnAGCAkudAYMCBp4BhAIGnwGFAgagAYYCBqEBhwIGogGJAgajAYsCEKQBjAJMpQGPAgamAZECEKcBkgJNqAGUAgapAZUCBqoBlgIQqwGZAk6sAZoCUq0BmwIIrgGcAgivAZ0CCLABngIIsQGfAgiyAaECCLMBowIQtAGkAlO1AaYCCLYBqAIQtwGpAlS4AaoCCLkBqwIIugGsAhC7Aa8CVbwBsAJbvQGxAgm-AbICCb8BswIJwAG0AgnBAbUCCcIBtwIJwwG5AhDEAboCXMUBvAIJxgG-AhDHAb8CXcgBwAIJyQHBAgnKAcICEMsBxQJezAHGAmLNAccCAs4ByAICzwHJAgLQAcoCAtEBywIC0gHNAgLTAc8CENQB0AJj1QHSAgLWAdQCENcB1QJk2AHWAgLZAdcCAtoB2AIQ2wHbAmXcAdwCaQ"
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
  AnyNull: () => AnyNull2,
  BookmarkScalarFieldEnum: () => BookmarkScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  FavoriteScalarFieldEnum: () => FavoriteScalarFieldEnum,
  GenreScalarFieldEnum: () => GenreScalarFieldEnum,
  JsonNull: () => JsonNull2,
  MediaScalarFieldEnum: () => MediaScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProfileScalarFieldEnum: () => ProfileScalarFieldEnum,
  QueryMode: () => QueryMode,
  RatingScalarFieldEnum: () => RatingScalarFieldEnum,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
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
  client: "7.6.0",
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
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Genre: "Genre",
  Media: "Media",
  Profile: "Profile",
  Bookmark: "Bookmark",
  Favorite: "Favorite",
  Rating: "Rating",
  Review: "Review",
  WatchList: "WatchList"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
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
  description: "description",
  type: "type",
  releaseDate: "releaseDate",
  genre: "genre",
  coverImage: "coverImage",
  trailerUrl: "trailerUrl",
  streamUrl: "streamUrl",
  averageRating: "averageRating",
  totalRatings: "totalRatings",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  createdById: "createdById"
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
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  userId: "userId",
  mediaId: "mediaId"
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
  SUPER_ADMIN: "SUPER_ADMIN",
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
import { Router as Router3 } from "express";

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
  const { name, email, password } = payload;
  const data = await auth.api.signUpEmail({
    body: { name, email, password }
  });
  if (!data.user) {
    throw new AppError_default(status.BAD_REQUEST, "Failed to register user");
  }
  try {
    const profile = await prisma.$transaction(async (tx) => {
      const userExists = await tx.user.findUnique({
        where: { id: data.user.id }
      });
      if (!userExists) {
        throw new AppError_default(
          status.BAD_REQUEST,
          "User not found "
        );
      }
      return await tx.profile.create({
        data: {
          userId: data.user.id,
          name: payload.name,
          email: payload.email
        }
      });
    });
    const tokenPayload = {
      userId: data.user.id,
      role: data.user.role,
      name: data.user.name,
      email: data.user.email,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified
    };
    const accessToken = await tokenUtils.getAccessToken(tokenPayload);
    const refreshToken = await tokenUtils.getRefreshToken(tokenPayload);
    return { ...data, profile, accessToken, refreshToken };
  } catch (error) {
    console.log("Transaction error:", error);
    await prisma.user.deleteMany({
      where: { id: data.user.id }
    });
    throw error;
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
      _count: {
        select: {
          favorites: true,
          ratings: true,
          reviews: true,
          watchList: true,
          bookmarks: true
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
  console.log(result);
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
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

// src/app/routes/index.ts
var router3 = Router3();
router3.use("/auth", authRoutes);
router3.use("/users", userRoutes);
var IndexRoutes = router3;

// src/app/middlewares/globalError.ts
import status8 from "http-status";
import z2 from "zod";

// src/app/errorHelpers/handlePrismaError.ts
import status6 from "http-status";
var getStatusCodeFromPrismaError = (errorCode) => {
  if (errorCode === "P2002") {
    return status6.CONFLICT;
  }
  if (["P2025", "P2001", "P2015", "P2018"].includes(errorCode)) {
    return status6.NOT_FOUND;
  }
  if (["P1000", "P6002"].includes(errorCode)) {
    return status6.UNAUTHORIZED;
  }
  if (["P1010", "P6010"].includes(errorCode)) {
    return status6.FORBIDDEN;
  }
  if (errorCode === "P6003") {
    return status6.PAYMENT_REQUIRED;
  }
  if (["P1008", "P2004", "P6004"].includes(errorCode)) {
    return status6.GATEWAY_TIMEOUT;
  }
  if (errorCode === "P5011") {
    return status6.TOO_MANY_REQUESTS;
  }
  if (errorCode === "P6009") {
    return 413;
  }
  if (errorCode.startsWith("P1") || ["P2024", "P2037", "P6008"].includes(errorCode)) {
    return status6.SERVICE_UNAVAILABLE;
  }
  if (errorCode.startsWith("P2")) {
    return status6.BAD_REQUEST;
  }
  if (errorCode.startsWith("P3") || errorCode.startsWith("P4")) {
    return status6.INTERNAL_SERVER_ERROR;
  }
  return status6.INTERNAL_SERVER_ERROR;
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
    statusCode: status6.INTERNAL_SERVER_ERROR,
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
    statusCode: status6.BAD_REQUEST,
    message: `Prisma Client Validation Error: ${mainMessage}`,
    errorSources
  };
};
var handlerPrismaClientInitializationError = (error) => {
  const statusCode = error.errorCode ? getStatusCodeFromPrismaError(error.errorCode) : status6.SERVICE_UNAVAILABLE;
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
    statusCode: status6.INTERNAL_SERVER_ERROR,
    message: "Prisma Client Rust Panic Error: The database engine crashed due to a fatal error.",
    errorSources
  };
};

// src/app/middlewares/handleZodError.ts
import status7 from "http-status";
var handleZodError = (err) => {
  const statusCode = status7.BAD_REQUEST;
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
  let statusCode = status8.INTERNAL_SERVER_ERROR;
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
  } else if (err instanceof z2.ZodError) {
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
    statusCode = status8.INTERNAL_SERVER_ERROR;
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
import status9 from "http-status";
var notFound = (req, res) => {
  res.status(status9.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} Not Found`
  });
};

// src/app.ts
var app = express();
app.use(
  cors({
    origin: [
      envVars.FRONTEND_URL,
      envVars.BETTER_AUTH_URL,
      // "http://localhost:3000",
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
var server;
var bootstrap = async () => {
  try {
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
