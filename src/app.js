const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const compression = require("compression");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const httpStatus = require("http-status");
const { postgres } = require("./config/postgres");
const config = require("./config/config");
const morgan = require("./config/morgan");
// const jwt = require('./config/jwt');
const { authLimiter } = require("./middlewares/rateLimiter");
const routes = require("./routes/v1");
const docsRoute = require("./routes/v1/docs.route");
const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");
const passport = require("passport");
const { jwtStrategy } = require("./config/passport");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDefinition = require("./docs/swaggerDef");

const app = express();

if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json({ limit: "50mb" }));

// parse urlencoded request body
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// Basic CORS configuration
app.use(
  cors({
    origin: true, // Allow all origins in development
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Origin",
      "Accept",
      "X-Requested-With",
    ],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 600, // Increase preflight cache time to 10 minutes
  })
);

// Enable pre-flight for all routes
//   app.options('*', cors());

app.use(cookieParser());

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// connect to postgres database
app.use((req, _, next) => {
  req.postgres = postgres;
  next();
});

// limit repeated failed requests to auth endpoints
if (config.env === "prod") {
  app.use("/v1/auth", authLimiter);
}

// v1 api routes
app.use("/v1", routes);

if (["dev", "local", "uat", "prod"].includes(config.env)) {

// if (config.env === "dev" || config.env === "local") {
  // Swagger UI route
  app.use("/", docsRoute);

  // Swagger docs
  const specs = swaggerJsdoc({
    swaggerDefinition,
    apis: ["src/docs/*.yml", "src/routes/v1/*.js"],
  });
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
}

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

// // Add a health check endpoint
// app.get('/health', (req, res) => {
//     res.status(200).json({ status: 'OK' });
// });

module.exports = app;
