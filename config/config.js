module.exports = {
  db:
    process.env.NODE_ENV === "production"
      ? "production database url"
      : "mongodb://localhost:27017/blog_auth",
  PORT: process.env.PORT || 5000,
  appKey: "yoursecret"
};
