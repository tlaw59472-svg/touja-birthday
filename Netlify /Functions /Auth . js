const crypto = require("crypto");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { password } = JSON.parse(event.body || "{}");

    if (password !== process.env.SITE_PASSWORD) {
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "كلمة السر غير صحيحة" })
      };
    }

    const token = crypto
      .createHmac("sha256", process.env.SITE_SECRET)
      .update("touja-birthday")
      .digest("hex");

    return {
      statusCode: 200,
      headers: {
        "Set-Cookie": `touja_auth=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ success: true })
    };
  } catch {
    return { statusCode: 400, body: "Bad Request" };
  }
};
