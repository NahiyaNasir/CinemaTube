import { Prisma } from "../../../generated/prisma/client";
import { IQueryParams } from "../../interface/QueryBuilder.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";

const getStats = async () => {
  const [
    totalMedia,
    totalReviews,
    totalUsers,
    activeUsers,
    activeSubscriptions,
    revenueAggregate,
    avgRatingAggregate,
  ] = await Promise.all([
    prisma.media.count(),

    prisma.review.count({
      where: { status: "APPROVED" },
    }),

    prisma.user.count(),

    prisma.user.count({
      where: { status: "ACTIVE" },
    }),

    prisma.subscription.count({
      where: { status: "ACTIVE" },
    }),

    prisma.payment.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true },
    }),

    prisma.review.aggregate({
      where: { status: "APPROVED" },
      _avg: { rating: true },
    }),
  ]);

  return {
    totalMedia,
    totalReviews,
    totalUsers,
    activeUsers,
    activeSubscriptions,
    totalRevenue: revenueAggregate._sum.amount ?? 0,
    avgRating: avgRatingAggregate._avg.rating ?? 0,
  };
};

const getSales = async () => {
  const [
    totalSales,
    revenueAggregate,
    subRevenueAggregate,
    purchaseRevenueAggregate, // New: Revenue for type BUY
    rentalRevenueAggregate, // New: Revenue for type RENTAL
    rawSalesOverTime,
  ] = await Promise.all([
    // 1. Count all completed payments
    prisma.payment.count({
      where: { status: "COMPLETED" },
    }),

    // 2. Total Gross Revenue
    prisma.payment.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true },
    }),

    // 3. Subscription Revenue (Linked to a subscriptionId)
    prisma.payment.aggregate({
      where: {
        status: "COMPLETED",
        subscriptionId: { not: null },
      },
      _sum: { amount: true },
    }),

    // 4. Purchase Revenue (Linked to MediaPurchase with type BUY)
    prisma.payment.aggregate({
      where: {
        status: "COMPLETED",
        mediaPurchase: {
          type: "BUY",
        },
      },
      _sum: { amount: true },
    }),

    // 5. Rental Revenue (Linked to MediaPurchase with type RENTAL)
    prisma.payment.aggregate({
      where: {
        status: "COMPLETED",
        mediaPurchase: {
          type: "RENTAL",
        },
      },
      _sum: { amount: true },
    }),

    // 6. Data for Charts
    prisma.payment.findMany({
      where: { status: "COMPLETED" },
      select: { amount: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const totalRevenue = revenueAggregate._sum.amount ?? 0;
  const subscriptionRevenue = subRevenueAggregate._sum.amount ?? 0;
  const purchaseRevenue = purchaseRevenueAggregate._sum.amount ?? 0;
  const rentalRevenue = rentalRevenueAggregate._sum.amount ?? 0;

  // Group by date for charts
  const salesOverTime = Object.values(
    rawSalesOverTime.reduce(
      (acc, payment) => {
        const date = payment.createdAt.toISOString().split("T")[0];
        if (!acc[date]) acc[date] = { date, revenue: 0, count: 0 };
        acc[date].revenue += payment.amount;
        acc[date].count += 1;
        return acc;
      },
      {} as Record<string, { date: string; revenue: number; count: number }>,
    ),
  );

  return {
    totalSales,
    totalRevenue,
    purchaseRevenue,
    rentalRevenue,
    subscriptionRevenue,
    salesOverTime,
  };
};

const getReviews = async () => {
  const [reviewsData, recentReviews] = await Promise.all([
    prisma.review.groupBy({
      by: ["rating"],
      _count: { id: true },
      orderBy: { rating: "asc" },
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
          select: { name: true },
        },
        media: {
          select: { title: true },
        },
      },
    }),
  ]);

  return {
    byRating: reviewsData, // [{rating, _count: {id}}]
    recentReviews, // matches frontend review list exactly
  };
};

const getAllMedia = async (query: IQueryParams) => {
  const { genre, minRating } = query;

  const whereConditions: Prisma.MediaWhereInput = { isPublished: true };

  if (genre) {
    whereConditions.genres = { some: { slug: genre as string } };
  }

  if (minRating) {
    whereConditions.avgRating = { gte: Number(minRating) };
  }

  // 2. Pass the FULL query object to QueryBuilder
  // so it can find 'page' and 'limit' inside paginate()
  const mediaQuery = new QueryBuilder(prisma.media, query, {
    searchableFields: ["title", "description"],
    filterableFields: ["type", "releaseYear", "pricing"],
  })
    .where(whereConditions) // Apply custom manual filters first
    .search() // Apply text search
    .filter() // Apply automated filters (type, releaseYear)
    .sort() // Apply sorting
    .paginate() // Apply skip/take LAST
    .include({
      genres: true,
      cast: true,
    });

 const result = await mediaQuery.execute();
// console.log("executed query where:", JSON.stringify((mediaQuery as any).query.where, null, 2));
return result;
};

export const AdminService = {
  getStats,
  getSales,
  getReviews,
  getAllMedia,
};
