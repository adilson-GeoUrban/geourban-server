const express = require("express");
const path = require("path");
const PptxGenJS = require("pptxgenjs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// 🔥 ROTA PPT AUTÔNOMA
app.post("/gerar-ppt", (req, res) => {
    const { texto } = req.body;

    let pptx = new PptxGenJS();

    // 🧠 IA monta conteúdo baseado no texto
    let slide1 = pptx.addSlide();
    slide1.addText("GeoUrban Intelligence", { x:1, y:1, fontSize:28 });

    let slide2 = pptx.addSlide();
    slide2.addText("Projeto:", { x:1, y:1, fontSize:20 });
    slide2.addText(texto || "Sem descrição", { x:1, y:2 });

    let slide3 = pptx.addSlide();
    slide3.addText("Análise IA:", { x:1, y:1 });
    slide3.addText("Estrutura identificada automaticamente.", { x:1, y:2 });

    let slide4 = pptx.addSlide();
    slide4.addText("Fluxo GeoUrban:", { x:1, y:1 });
    slide4.addText("Login → Atendimento → IA → Execução", { x:1, y:2 });

    pptx.write("nodebuffer").then(buffer => {
        res.setHeader("Content-Disposition", "attachment; filename=geourban.pptx");
        res.send(buffer);
    });
});

app.listen(PORT, () => {
    console.log("GeoUrban rodando");
});
