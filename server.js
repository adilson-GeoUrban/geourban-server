const PORT = process.env.PORT || 3000;
node server.js
process.on("uncaughtException", (err) => {
  console.error("ERRO CRÍTICO:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("PROMISE NÃO TRATADA:", err);
});
app.listen(PORT, () => {
  console.log("SERVIDOR RODANDO NA PORTA " + PORT);
});
