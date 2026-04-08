const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("OK GEOURBAN ONLINE 🚀");
});

app.listen(3000, () => {
  console.log("Rodando");
});
