import winston, { format } from "winston";
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  //format the log
  format: winston.format.combine(
    winston.format.timestamp(), //adding timestamp
    winston.format.errors({ stack: true }), //adding errors with stack trace
    winston.format.splat(), //enable support message templateing
    winston.format.json(), //format log message in json
  ),
  //wht service we are using
  defaultMeta: { service: "identity-service" },
  //output destination for logs
  transports: [
    //getting logs on console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), //better readailbilty
        winston.format.simple(),
      ),
    }),
    //log the error in file
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combine.log" }),
  ],
});

module.exports = logger;
