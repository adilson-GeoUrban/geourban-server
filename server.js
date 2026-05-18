const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/ia", (req, res) => {
  res.sendFile(path.join(__dirname, "ia.html"));
});

app.get("/health", (req, res) => {
  res.send("OK");
});

app.use((req, res) => {
  res.redirect("/");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0");
