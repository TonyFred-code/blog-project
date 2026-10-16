function logClientIp(req, res, next) {
  console.log(
    JSON.stringify({
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
      ips: req.ips,
      forwardedFor: req.get("x-forwarded-for"),
      socketAddress: req.socket.remoteAddress,
    })
  );

  next();
}

export { logClientIp };
