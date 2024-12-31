const getIpFromRequest = (req) => {
  const forwardedFor = req.headers["x-forwarded-for"];
  const remoteAddress = req.connection.remoteAddress;
  return (forwardedFor || remoteAddress).replace("::ffff:", "");
};

const parseIpRange = (allowedIpsEnv) => {
  if (!allowedIpsEnv) return [];

  const ranges = allowedIpsEnv.split(", ").map((range) => range.trim());
  return ranges.map((range) => {
    const [baseIp, endRange] = range.split("/");
    if (!baseIp || !endRange) throw new Error("Invalid IP range format");
    const rangeParts = endRange.split("-");
    return {
      baseIp,
      rangeStart: parseInt(rangeParts[0]),
      rangeEnd: parseInt(rangeParts[1]),
    };
  });
};

const isIpAllowed = (currentIp, allowedRanges) => {
  const ipParts = currentIp.split(".");
  const startIp = ipParts.slice(0, 3).join(".");
  const lastOctet = parseInt(ipParts[3], 10);

  for (const range of allowedRanges) {
    if (
      startIp === range.baseIp &&
      lastOctet >= range.rangeStart &&
      lastOctet <= range.rangeEnd
    ) {
      return true;
    }
  }
  return false;
};

const ipFilter = async (req, res, next) => {
  try {
    const currentIp = getIpFromRequest(req);
    const allowedIpsEnv = process.env.ALLOWED_IPS;
    const allowedRanges = parseIpRange(process.env.ALLOWED_IP_RANGE);
    if (!allowedIpsEnv && !allowedRanges.length) {
      next();
      return;
    } else if (!allowedIpsEnv) {
      if (!isIpAllowed(currentIp, allowedRanges)) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      next();
      return;
    }

    const allowedIps = allowedIpsEnv.split(", ").map((ip) => ip.trim());

    if (!allowedIps.includes(currentIp)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    next();
  } catch (err) {
    console.error("IP Filter Error:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = ipFilter;
