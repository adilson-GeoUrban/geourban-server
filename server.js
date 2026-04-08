<script>
async function login(){
    const res = await fetch("http://localhost:3000/login",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({user:"admin", pass:"1234"})
    });

    if(res.ok){
        tela.innerHTML = "🔐 Login REAL OK";
    } else {
        tela.innerHTML = "❌ Erro login";
    }
}

async function ia(){
    let tema = prompt("Tema:");
    tela.innerHTML = "📘 Aula sobre " + tema;
}

async function logs(){
    const res = await fetch("http://localhost:3000/logs");
    const data = await res.json();

    let html = "<h3>📊 Logs</h3>";
    data.forEach(l => html += "<p>"+l+"</p>");

    tela.innerHTML = html;
}
</script>
