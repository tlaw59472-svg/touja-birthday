const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  const cookies = event.headers.cookie || event.headers.Cookie || "";
  const match = cookies.match(/(?:^|;\s*)touja_auth=([^;]+)/);

  const expected = crypto
    .createHmac("sha256", process.env.SITE_SECRET)
    .update("touja-birthday")
    .digest("hex");

  if (!match || match[1] !== expected) {
    return {
      statusCode: 401,
      headers: { "Content-Type": "text/html; charset=utf-8" },
      body: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>موقع توجة 💗</title>
<body style="background:#ffe6f0;font-family:Arial;text-align:center;padding:40px;color:#8d315b">
<h1>💗 موقع توجة 💗</h1>
<p>هذا الموقع مفاجأة خاصة، أدخل كلمة السر للدخول</p>
<input id="pw" type="password" placeholder="كلمة السر" style="padding:12px;border-radius:12px;border:1px solid #d66">
<button onclick="login()" style="padding:12px;border:0;border-radius:12px;background:#e879a9;color:white">دخول 💕</button>
<p id="msg"></p>
<script>
async function login(){
 const r=await fetch('/.netlify/functions/auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:document.getElementById('pw').value})});
 if(r.ok){location.reload()}else{document.getElementById('msg').textContent='كلمة السر غير صحيحة، حاول مجددًا 💗'}
}
</script>
</body></html>`
    };
  }

  const filePath = path.join(process.cwd(), "index.html");
  const html = fs.readFileSync(filePath, "utf8");

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
    body: html
  };
};
