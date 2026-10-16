const SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];

function requireCsrfHeader(req, res, next) {
  if (SAFE_METHODS.includes(req.method)) return next();

  if (req.get("X-Requested-With") !== "XMLHttpRequest") {
    return res.status(403).json({ message: "Invalid request" });
  }

  return next();
}

export { requireCsrfHeader };
