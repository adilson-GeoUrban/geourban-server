app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🔥 FIX CRÍTICO
app.get("/ia", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "ia.html"));
});
