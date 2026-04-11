node server.js
process.on("uncaughtException", (err) => {
  console.error("ERRO CRÍTICO:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("PROMISE NÃO TRATADA:", err);
});
