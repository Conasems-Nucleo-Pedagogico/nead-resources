# 📁 Como Adicionar um Novo Recurso

## 🎯 Processo Simples e Direto

Agora o processo é bem simples - sem automação, sem complicação!

### 1️⃣ Criar Pasta do Recurso
```
wp-resources/
└── meu-novo-recurso/           # ← Nova pasta
```

### 2️⃣ Criar config.json
```json
{
  "titulo": "MEU NOVO RECURSO",
  "conteudo": "Descrição detalhada do que este recurso faz",
  "observacao": "IMPORTANTE: Informações importantes (opcional)",
  "img": "https://exemplo.com/imagem-preview.png",
  "src": "demos/meu-recurso.html"
}
```

### 3️⃣ Atualizar index.json
Abra `wp-resources/index.json` e adicione o nome da pasta no array:

```json
{
  "recursos": [
    "tooltip-imagem",
    "animacao-video",
    "carrossel-hover",
    ...
    "meu-novo-recurso"  ← Adicionar aqui
  ],
  "versao": "1.0.0",
  "ultima_atualizacao": "2025-08-04"
}
```

### 4️⃣ Recarregar Página
- **Automático**: Recarregue a página no browser
- **Via Console**: `RecursosEducacionais.reloadResources()`

**Pronto!** ✨ O novo recurso aparecerá na página!

## 📋 Exemplo Completo

### Criando "Galeria Fotos"

**1. Pasta:**
```
wp-resources/galeria-fotos/
```

**2. config.json:**
```json
{
  "titulo": "GALERIA DE FOTOS",
  "conteudo": "Galeria responsiva com lightbox e navegação por teclado.",
  "observacao": "IMPORTANTE: Funciona melhor com imagens otimizadas.",
  "img": "https://exemplo.com/galeria-preview.png",
  "src": "demos/galeria-fotos.html"
}
```

**3. index.json (adicionar linha):**
```json
{
  "recursos": [
    "accordion-hover",
    "animacao-video",
    "background-video",
    "cards-linear",
    "cards-livro",
    "cards-nao-linear",
    "carrossel-hover",
    "carrossel-step",
    "galeria-fotos",         ← Nova linha
    "gif-videos",
    "graficos-interativos",
    "lottie-hotspot",
    "marca-texto",
    "personagens-animados",
    "scroll-horizontal",
    "slide-vertical-duplo",
    "slider-conteudo",
    "slider-icones",
    "steps-conteudo",
    "tooltip-imagem"
  ],
  "versao": "1.0.0",
  "ultima_atualizacao": "2025-08-04"
}
```

## 🔧 Comandos Úteis no Console

```javascript
// Ver recursos carregados
RecursosEducacionais.getAvailableResources()

// Recarregar após adicionar recurso
RecursosEducacionais.reloadResources()

// Filtrar recursos na página
RecursosEducacionais.filterResources('galeria')
```

## ✅ Vantagens da Abordagem Simples

- **📝 Controle Total**: Você define exatamente quais recursos aparecem
- **🚀 Performance**: Carrega apenas recursos listados
- **🛡️ Confiável**: Sem dependências externas ou automação que pode falhar
- **📖 Transparente**: É fácil ver quais recursos estão ativos
- **🔧 Debugável**: Fácil identificar problemas

## ❌ Problemas Comuns

### Recurso não aparece
1. ✅ Verificar se a pasta existe
2. ✅ Verificar se config.json é válido
3. ✅ Verificar se está listado no index.json
4. ✅ Recarregar a página

### Erro de carregamento
1. ✅ Verificar console do browser para erros
2. ✅ Verificar se JSON está bem formatado
3. ✅ Verificar se imagem está acessível

**🎉 Simples e eficiente!** Sem Node.js, sem automação, só o essencial!