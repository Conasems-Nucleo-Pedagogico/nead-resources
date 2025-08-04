# NEAD Recursos Educacionais - Portfólio

Portal dinâmico para exibição de recursos educacionais interativos.

## 📁 Estrutura do Projeto

```
nead-recursos/
├── index.html              # Página principal
├── wp-assets/              # Assets CSS e JavaScript
│   ├── script.js           # Script principal com carregamento dinâmico
│   └── style.css           # Estilos da aplicação
├── wp-resources/           # Recursos educacionais
│   ├── index.json          # Índice de recursos disponíveis
│   ├── tooltip-imagem/     # Exemplo de recurso
│   │   └── config.json     # Configuração do recurso
│   └── ...                 # Outros recursos
```

## 🚀 Como Funciona

### Carregamento Dinâmico
A aplicação carrega os recursos baseado no índice:

1. **Lê o arquivo** `wp-resources/index.json` para obter a lista de recursos
2. **Carrega as configurações** de cada recurso listado (`config.json`)
3. **Gera os cards** dinamicamente baseado nas configurações

### Estrutura do config.json
Cada recurso deve ter um arquivo `config.json` com esta estrutura:

```json
{
  "titulo": "NOME DO RECURSO",
  "conteudo": "Descrição do recurso educacional",
  "observacao": "Informações adicionais (opcional)",
  "img": "https://exemplo.com/imagem.png",
  "src": "caminho/para/arquivo/demo.html"
}
```

## ➕ Adicionando Novos Recursos

### Processo Completo
1. **Crie uma nova pasta** em `wp-resources/nome-do-recurso/`
2. **Adicione o arquivo** `config.json` com as informações do recurso
3. **Atualize o índice** adicionando o nome da pasta no array `recursos` do arquivo `wp-resources/index.json`
4. **Recarregue a página** ou execute: `RecursosEducacionais.reloadResources()`

### Exemplo Completo
```bash
# 1. Criar pasta
wp-resources/botao-animado/

# 2. Criar config.json
{
  "titulo": "BOTÃO ANIMADO",
  "conteudo": "Botão com animações CSS avançadas",
  "observacao": "",
  "img": "https://exemplo.com/botao.png", 
  "src": ""
}

# 3. Atualizar index.json
{
  "recursos": [
    "tooltip-imagem",
    "animacao-video",
    ...
    "botao-animado"  ← Adicionar aqui
  ]
}
```

## 🔧 Utilitários do Browser

### Recarregar Recursos
```javascript
// No console do browser
RecursosEducacionais.reloadResources()
```
Recarrega todos os cards baseado no index.json atual.

### Listar Recursos
```javascript
// No console do browser
RecursosEducacionais.getAvailableResources()
```
Mostra a lista de recursos do index.json.

## 🎯 Funcionalidades

- ✅ **Carregamento Dinâmico**: Recursos são descobertos automaticamente
- ✅ **Responsivo**: Layout adaptativo para diferentes telas
- ✅ **Tratamento de Erros**: Fallbacks e mensagens de erro amigáveis
- ✅ **Performance**: Carregamento assíncrono e otimizado
- ✅ **Extensível**: Fácil adição de novos recursos
- ✅ **Filtros**: Sistema de busca e filtros (disponível via API)

## 🔍 Debug e Desenvolvimento

### Console do Browser
A aplicação expõe funções globais para debug:

```javascript
// Listar recursos do index.json
RecursosEducacionais.getAvailableResources()

// Recarregar recursos
RecursosEducacionais.reloadResources()

// Filtrar recursos
RecursosEducacionais.filterResources('tooltip')

// Carregar cards (função interna)
RecursosEducacionais.loadCards()
```

### Logs
A aplicação fornece logs detalhados no console:
- Recursos carregados
- Erros de carregamento
- Performance de descoberta

## 📝 Exemplos de Recursos

### Tooltip com Imagem
```json
{
  "titulo": "TOOLTIP COM IMAGEM",
  "conteudo": "Palavras destacadas em um bloco de texto que, ao passar o mouse sobre elas, exibem um tooltip com uma imagem ilustrativa.",
  "observacao": "Tooltip é uma pequena caixa de texto que aparece quando o usuário passa o cursor sobre um elemento.",
  "img": "https://exemplo.com/tooltip.png",
  "src": ""
}
```

### Recurso com Observação Importante
```json
{
  "titulo": "ANIMAÇÃO DE VÍDEO",
  "conteudo": "Vídeo em um box animado que, ao ser clicado, expande e reproduz o vídeo.",
  "observacao": "IMPORTANTE: Esse recurso funciona apenas para vídeos que podem ser utilizados sem áudio.",
  "img": "https://exemplo.com/video.png",
  "src": "demos/video-animation.html"
}
```

## 🏗️ Arquitetura

### Fluxo de Carregamento
1. **DOMContentLoaded** → Inicializa aplicação
2. **getAvailableResources()** → Lê wp-resources/index.json
3. **loadCards()** → Carrega config.json de cada recurso
4. **createCard()** → Gera HTML dos cards
5. **initializeCards()** → Adiciona interatividade

### Fonte dos Recursos
- **Única fonte**: Lê apenas `wp-resources/index.json`
- **Simples e confiável**: Sem fallbacks ou descoberta automática
- **Controle total**: Você define exatamente quais recursos carregar

## 🚀 Deploy

Para deploy em produção:

1. **Verifique o índice**: Confirme que `wp-resources/index.json` lista todos os recursos

2. **Verifique os recursos**:
   - Todas as imagens estão acessíveis
   - Todos os config.json são válidos
   - Paths dos arquivos src estão corretos

3. **Teste localmente**:
   - Abra o index.html em um servidor local
   - Verifique o console para erros
   - Teste todos os cards

## 📄 Licença

Projeto desenvolvido para CONASEMS - Conselho Nacional de Secretários Municipais de Saúde.