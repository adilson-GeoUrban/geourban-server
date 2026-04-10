<div class="login-box">

    <h3>GeoUrban 🔐</h3>

    <input id="cpf" placeholder="CPF">
    <input id="senha" type="password" placeholder="Senha">

    <!-- 🔐 LGPD -->
    <div style="font-size:12px; color:#ccc; margin-top:10px;">
        🔐 <b>Proteção de Dados (LGPD)</b><br>
        Seus dados são utilizados apenas para acesso ao sistema e protegidos com criptografia.<br>
        Não compartilhamos informações com terceiros sem autorização.
    </div>

    <label style="font-size:12px; display:block; margin-top:8px;">
        <input type="checkbox" id="termo">
        Li e concordo com o uso dos meus dados conforme a LGPD
    </label>

    <button onclick="cadastrar()">Cadastrar</button>
    <button onclick="login()">Entrar</button>

</div>
<script>
async function cadastrar() {
    const cpf = document.getElementById("cpf").value;
    const senha = document.getElementById("senha").value;
    const termo = document.getElementById("termo").checked;

    if (!cpf || !senha) {
        alert("⚠️ Preencha CPF e senha");
        return;
    }

    if (!termo) {
        alert("⚠️ Você precisa aceitar os termos LGPD para continuar");
        return;
    }

    try {
        const res = await fetch("/cadastro", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ cpf, senha })
        });

        const data = await res.json();

        if (data.ok) {
            alert("✅ Cadastro realizado com sucesso");
        } else {
            alert("❌ " + data.erro);
        }

    } catch (e) {
        alert("❌ Erro ao conectar com servidor");
    }
}
</script>
setTimeout(() => {
    addMsg("🔐 Seus dados estão protegidos conforme a LGPD.");
    addMsg("Utilizamos criptografia e não compartilhamos informações sem consentimento.");
}, 1500);
