import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

// POST /sms-proxy
app.post("/sms-proxy", async (req, res) => {
  const { to, from, body } = req.body;
  if (!to || !from || !body) {
    return res.status(400).json({ error: "Missing to/from/body" });
  }

  try {
    // Use your TextGrid credentials
    const auth = {
      username: "bsmP3M1uzUswpnoGjA8Q2w",
      password: "6e93bf3b99e24e1cb289ef0be56bf3e5",
    };

    const url = "https://api.textgrid.com/2010-04-01/Accounts/bsmP3M1uzUswpnoGjA8Q2w/Messages.json";

    const data = new URLSearchParams({
      From: `+${from.replace(/\D/g, "")}`,
      To: `+${to.replace(/\D/g, "")}`,
      Body: body,
    });

    const response = await axios.post(url, data, {
      auth,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    res.json({ ok: true, messageSid: response.data.sid || null });
  } catch (err) {
    console.error("SMS send failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 SMS proxy running on port ${PORT}`));