const fs = require("fs");
const path = require("path");

const cities = JSON.parse(
  fs.readFileSync(path.join(__dirname, "cidades.json"), "utf-8"),
);
const template = fs.readFileSync(
  path.join(__dirname, "template-cidade.html"),
  "utf-8",
);

// Garante que a pasta cidades/ existe
const cidadesDir = path.join(__dirname, "cidades");
if (!fs.existsSync(cidadesDir)) {
  fs.mkdirSync(cidadesDir);
}

let generated = 0;

cities.forEach((city) => {
  let html = template;
  html = html.replace(/\{\{CITY_NAME\}\}/g, city.name);
  html = html.replace(/\{\{CITY_SLUG\}\}/g, city.slug);
  html = html.replace(/\{\{STATE_CODE\}\}/g, city.state);
  html = html.replace(/\{\{STATE_NAME\}\}/g, city.stateName);
  html = html.replace(/\{\{REGION\}\}/g, city.region);
  html = html.replace(/\{\{STATE_PREV\}\}/g, city.statePrev);

  // Cria cidades/{slug}/
  const cityDir = path.join(cidadesDir, city.slug);
  if (!fs.existsSync(cityDir)) {
    fs.mkdirSync(cityDir);
  }
  fs.writeFileSync(path.join(cityDir, "index.html"), html, "utf-8");
  console.log(`✓ cidades/${city.slug}/index.html`);

  // Remove pasta controle-de-ponto-{slug}/ se existir (estrutura antiga)
  const oldDir = path.join(__dirname, `controle-de-ponto-${city.slug}`);
  if (fs.existsSync(oldDir)) {
    fs.rmSync(oldDir, { recursive: true });
    console.log(`  ✗ removido: controle-de-ponto-${city.slug}/`);
  }

  generated++;
});

console.log(`\n${generated} página(s) gerada(s) em cidades/.`);
console.log("Lembre de atualizar o sitemap.xml após adicionar novas cidades.");
