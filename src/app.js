import express from "express";
import router from "./module/auth/auth.routes.js";
import cookieParser from "cookie-parser";
import ApiError from "./common/utils/api-error.js";

const app =express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.use("/api/auth",router);

//catch all undefined routes

app.all("/{*path}", (req, res)=>{
    throw ApiError.notFound(`Route ${req.originalUrl} not found`);
});

// app.use((err, req, res, next) => {
//     console.error(err);

//     const statusCode = err.statuscode || 500;

//     res.status(statusCode).json({
//         success: false,
//         message: err.message || "Internal Server Error"
//     });
// });
//

app.use((err, req, res, next) => {
  let statusCode = err.statuscode || 500;
  let message = err.message;

  if (err.name === "TokenExpiredError") { statusCode = 401; message = "Token expired"; }
  else if (err.name === "JsonWebTokenError") { statusCode = 401; message = "Invalid token"; }
  else if (err.code === 11000) { statusCode = 409; message = "Already exists"; }

  if (statusCode === 500 && process.env.NODE_ENV === "production") {
    message = "Internal Server Error";
  }
  console.error(err);
  res.status(statusCode).json({ success: false, message });
});
export default app