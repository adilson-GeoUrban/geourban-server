const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("GeoUrban ONLINE 🚀");
});

const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log("Rodando na porta", port);
});
