# Auvix Landing

Site institucional da Auvix Tecnologia.

---

## Páginas por cidade (SEO local)

Landing pages geradas automaticamente para cada cidade a partir de um template e uma lista de cidades.

### Estrutura

```
cidades.json          ← lista de cidades (fonte de dados)
template-cidade.html  ← template HTML com placeholders {{CITY_NAME}}, etc.
generate-cities.js    ← script de geração
cidades/
  sao-paulo/index.html
  curitiba/index.html
  ...
```

### Como gerar as páginas

Requer Node.js instalado. Sem dependências externas.

```bash
node generate-cities.js
```

O script lê `cidades.json`, aplica os dados no `template-cidade.html` e gera `cidades/{slug}/index.html` para cada cidade.

### Adicionar uma nova cidade

1. Abra `cidades.json` e adicione um objeto ao array:

```json
{
  "name": "Campinas",
  "slug": "campinas",
  "state": "SP",
  "stateName": "São Paulo",
  "region": "Sudeste",
  "statePrev": "de"
}
```

2. Rode o script:

```bash
node generate-cities.js
```

3. Adicione a URL ao `sitemap.xml`:

```xml
<url>
  <loc>https://www.auvix.com.br/cidades/campinas/</loc>
  <lastmod>AAAA-MM-DD</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

4. Adicione o chip com link na seção de cidades do `index.html`.

### Placeholders disponíveis no template

| Placeholder      | Exemplo   |
| ---------------- | --------- |
| `{{CITY_NAME}}`  | São Paulo |
| `{{CITY_SLUG}}`  | sao-paulo |
| `{{STATE_CODE}}` | SP        |
| `{{STATE_NAME}}` | São Paulo |
| `{{REGION}}`     | Sudeste   |
