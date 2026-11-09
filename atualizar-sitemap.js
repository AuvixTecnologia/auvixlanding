// Atualiza o sitemap.xml:
// - remove as páginas individuais de cidades (estão com noindex; fica só /cidades/)
// - define o <lastmod> de cada URL pela data real de alteração do arquivo
//   (último commit no git, ou hoje se o arquivo tem alterações não commitadas)
//
// Uso: node atualizar-sitemap.js  (rode depois de alterar páginas, antes do commit)
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const SITE = "https://www.auvix.com.br";
const arquivo = path.join(__dirname, "sitemap.xml");
let xml = fs.readFileSync(arquivo, "utf-8");
const eol = xml.includes("\r\n") ? "\r\n" : "\n";
const hoje = new Date().toISOString().slice(0, 10);

const git = (...args) =>
  execFileSync("git", args, { cwd: __dirname, encoding: "utf-8" }).trim();

function dataDoArquivo(rel) {
  if (!fs.existsSync(path.join(__dirname, rel))) return null;
  if (git("status", "--porcelain", "--", rel)) return hoje;
  return git("log", "-1", "--format=%cs", "--", rel) || hoje;
}

function arquivoDaUrl(loc) {
  let p = loc.replace(SITE, "");
  if (p.endsWith("/")) p += "index.html";
  return p.replace(/^\//, "");
}

let removidas = 0;
let atualizadas = 0;

// remove blocos <url> de páginas individuais de cidades
xml = xml.replace(
  /[ \t]*<url>\s*<loc>https:\/\/www\.auvix\.com\.br\/cidades\/[^/<]+\/<\/loc>[\s\S]*?<\/url>\r?\n?/g,
  () => {
    removidas++;
    return "";
  },
);

// atualiza lastmod
xml = xml.replace(
  /(<loc>([^<]+)<\/loc>\s*<lastmod>)([^<]*)(<\/lastmod>)/g,
  (all, ini, loc, atual, fim) => {
    const data = dataDoArquivo(arquivoDaUrl(loc));
    if (!data) {
      console.warn("arquivo não encontrado para", loc);
      return all;
    }
    if (data !== atual) atualizadas++;
    return ini + data + fim;
  },
);

// remove comentário de seção de cidades que tenha ficado vazio e linhas em branco duplicadas
xml = xml.replace(/(\r?\n){3,}/g, eol + eol);

fs.writeFileSync(arquivo, xml, "utf-8");
const total = (xml.match(/<url>/g) || []).length;
console.log(
  `sitemap.xml: ${total} URLs, ${removidas} cidades removidas, ${atualizadas} datas atualizadas.`,
);
