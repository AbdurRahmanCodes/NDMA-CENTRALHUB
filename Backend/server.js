import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

// تحميل متغيرات البيئة
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration (place BEFORE helmet/ratelimiter)
const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"],
  optionsSuccessStatus: 204,
};

// معدل الحد للطلبات
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  // Dev can spike due to React StrictMode/effects; higher ceiling
  max: process.env.NODE_ENV === "production" ? 300 : 2000,
  standardHeaders: true,
  legacyHeaders: false,
  // Skip preflight OPTIONS and optionally disable in non-prod
  skip: (req) =>
    req.method === "OPTIONS" || process.env.NODE_ENV !== "production",
  message: {
    success: false,
    message: "❌ Too many requests from this IP",
  },
});

// middleware الأساسية
// CORS first so all responses (including errors) include CORS headers
app.use(cors(corsOptions));
// Handle preflight for all routes (regex path to avoid path-to-regexp "*" error)
app.options(/.*/, cors(corsOptions));
app.use(helmet());
app.use(limiter);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ⭐ الجديد: خدمة الملفات الثابتة من مجلد uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ⭐ استيراد المسارات
import authRoutes from "./src/routes/authRoutes.js";
import reportRoutes from "./src/routes/reportRoutes.js";
import commentRoutes from "./src/routes/commentRoutes.js";
import bookmarkRoutes from "./src/routes/bookmarkRoutes.js";
import likeRoutes from "./src/routes/likeRoutes.js";

// ⭐ تسجيل المسارات
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/likes", likeRoutes);

// route للتحقق من صحة الخادم
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Server is running successfully!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// route أساسي للجذر
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🌊 Disaster Monitoring API",
    version: "1.0.0",
    endpoints: {
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        profile: "GET /api/auth/me",
      },
      reports: {
        list: "GET /api/reports",
        get: "GET /api/reports/:id",
        create: "POST /api/reports (admin only) - مع رفع صور",
        update: "PUT /api/reports/:id (admin only) - مع رفع صور",
        delete: "DELETE /api/reports/:id (admin only)",
        nearby: "GET /api/reports/nearby/search",
        stats: "GET /api/reports/stats/summary",
      },
      comments: {
        add: "POST /api/comments",
        getByReport: "GET /api/comments/report/:report_id",
        update: "PUT /api/comments/:id",
        delete: "DELETE /api/comments/:id",
        myComments: "GET /api/comments/my/comments",
      },
      bookmarks: {
        toggle: "POST /api/bookmarks/toggle",
        myBookmarks: "GET /api/bookmarks/my",
        check: "GET /api/bookmarks/check/:report_id",
        count: "GET /api/bookmarks/count/:report_id",
      },
      likes: {
        toggle: "POST /api/likes/toggle",
        myLikes: "GET /api/likes/my",
        check: "GET /api/likes/check/:report_id",
        count: "GET /api/likes/count/:report_id",
        list: "GET /api/likes/list/:report_id",
      },
    },
  });
});

// معالجة المسارات غير موجودة
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "🔍 Route not found",
    requestedUrl: req.originalUrl,
    method: req.method,
  });
});

// معالجة الأخطاء العامة
app.use((error, req, res, next) => {
  console.error("🚨 Error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { error: error.message }),
  });
});

// بدء الخادم
app.listen(PORT, () => {
  console.log(`🎯 Server is running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
  console.log(`📊 Reports: http://localhost:${PORT}/api/reports`);
  console.log(`💬 Comments: http://localhost:${PORT}/api/comments`);
  console.log(`🔖 Bookmarks: http://localhost:${PORT}/api/bookmarks`);
  console.log(`❤️ Likes: http://localhost:${PORT}/api/likes`);
  console.log(`📸 Uploads: http://localhost:${PORT}/uploads`);
});

export default app;
