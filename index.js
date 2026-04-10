<script>
async function salvarCadastro(){

  const nome = document.getElementById("nome").value.trim();
  const escolaridade = document.getElementById("escolaridade").value;
  const profissao = document.getElementById("profissao").value.trim();
  const limitacoes = document.getElementById("limitacoes").value.trim();
  const registro = document.getElementById("registro").value.trim();

  // 🔴 VALIDAÇÃO FRONT
  if(!nome || !escolaridade || !profissao || !limitacoes){
    alert("⚠️ Preencha todos os campos obrigatórios");
    return;
  }

  if((escolaridade === "Técnico" || escolaridade === "Superior") && !registro){
    alert("⚠️ Registro profissional obrigatório (ART/TRT/RRT)");
    return;
  }

  try {

    const res = await fetch("/cadastro", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        nome,
        escolaridade,
        profissao,
        limitacoes,
        registro,
        declaracao: true
      })
    });

    const resposta = await res.json();

    if(resposta.ok){
      alert("✅ Cadastro realizado com sucesso!");
      window.location.href = "/";
    } else {
      alert("❌ " + resposta.erro);
    }

  } catch (erro) {
    alert("🚫 Erro de conexão com o servidor");
    console.error(erro);
  }
}
</script>
