app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
/public
   ├── index.html
   ├── abas/
   ├── blocos/
   └── assets/
<button onclick="salvar()">💾 SALVAR</button>
<script>
function salvar() {
    fetch('/salvar-tudo', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            nome: "Adilson",
            sistema: "GeoUrban"
        })
    })
    .then(res => res.json())
    .then(d => {
        alert("✅ Salvo com sucesso!");
        console.log(d);
    })
    .catch(() => {
        alert("❌ Erro ao salvar");
    });
}
</script>
