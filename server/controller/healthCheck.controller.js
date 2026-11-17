function getHealthCheck(req, res) {
  return res.status(200).json({
    message: "REQUEST RECEIVED.",
  });
}

export { getHealthCheck };
