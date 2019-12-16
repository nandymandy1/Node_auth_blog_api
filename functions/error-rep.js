exports.errRespHandler = res => {
  return res
    .status(500)
    .json({ message: "Internal error please retry.", success: false });
};
