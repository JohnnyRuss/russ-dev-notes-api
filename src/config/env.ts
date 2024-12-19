import dotenv from "dotenv";

dotenv.config();

// ENV
const NODE_MODE = process.env.NODE_MODE;
const PORT = parseInt(process.env.PORT || "4000");

// DB
const DB_APP_CONNECTION = process.env.DB_APP_CONNECTION || "";

// APP ORIGINS
const APP_ORIGIN = process.env.APP_ORIGIN || "";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "";

const APP_ORIGINS = [CLIENT_ORIGIN];

// AUTH
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const SESSION_ID_SECRET = process.env.SESSION_ID_SECRET;

export {
  // ENV
  NODE_MODE,
  PORT,
  // DB
  DB_APP_CONNECTION,
  // APP ORIGINS
  APP_ORIGIN,
  APP_ORIGINS,
  // AUTH
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  SESSION_ID_SECRET,
};
