// Recursos Educacionais - Portfólio
// JavaScript para carregamento dinâmico dos cards

document.addEventListener('DOMContentLoaded', function() {
    console.log('Página de Recursos Educacionais carregada!');
    renderTypeFilter();
    loadCards();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(atualizarTextosCortados, 150);
    });
});
//utilsGame
function hasSelectInList(selectId) {
    const selectExist = timelineSelect.findIndex(function(opcao) {
        return opcao.selectId === selectId ? true : false;
    });

    return selectExist;
}

function addSelectOptions(select, oldValue) {
    const option = select.querySelector('#position-' + oldValue);
    option.classList.remove('hidden');
}

function removeSelectOptions(select, value) {
    const options = select.options;

    for (let index = 0; index < options.length; index++) {
        const option = options[index].value;

        if (option === value) {
            options[index].classList.add('hidden');
            break;
        }
    }
}

// Função para embaralhar o array de forma aleatória
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

function returnsRandomColor() {
    return `#${Math.floor(Math.random() * 256 * 256 * 256 - 1).toString(16)}55`;
}

function areTheElementsAllTheSame (array) {
    if (array.length === 0) {
        return true;
    }

    for (let i = 1; i < array.length; i++) {
        if (array[i] !== array[0]) {
            return false;
        }
    }

    return true;
}

function drag(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id);
}

// Adicione a função allowDrop
function allowDrop(ev) {
    ev.preventDefault();
    ev.stopPropagation();
}




// Configuração do filtro por tipo (editar conforme necessidade)
const TYPE_FILTER_CONFIG = {
    allValue: 'all',
    allLabel: 'Todos',
    types: [
        { value: 'game', label: 'Jogos' },
        { value: 'clinicalCase', label: 'Casos Clínicos' },
        { value: 'cardsCarousel', label: 'Cards e Carrosséis' },
        { value: 'sequence', label: 'Sequências e Linhas do Tempo' },
        { value: 'hotspot', label: 'Hotspots e Tooltips' },
        { value: 'animation', label: 'Animação e Destaque' },
        { value: 'media', label: 'Vídeo e Mídia' },
        { value: 'dataViz', label: 'Visualização de Dados' },
        { value: 'activity', label: 'Atividades' }
    ]
};

// Função para carregar a lista de recursos do index.json
async function getAvailableResources() {
    try {
        // Verificar se está rodando via protocolo file://
        if (window.location.protocol === 'file:') {
            console.warn('⚠️ Detectado protocolo file://. Para melhor funcionamento, use um servidor local.');
            console.info('💡 Execute: python -m http.server 8000 ou npx serve .');
        }

        console.log('🔍 Tentando carregar:', window.location.origin + '/wp-resources/index.json');
        const response = await fetch('wp-resources/index.json');
        
        if (!response.ok) {
            throw new Error(`Erro HTTP ao carregar index.json: ${response.status} - ${response.statusText}`);
        }
        
        const index = await response.json();
        console.log(`📋 Carregando ${index.recursos.length} recursos do índice`);
        return index.recursos;
        
    } catch (error) {
        console.error('❌ Erro ao carregar index.json:', error);
        
        // Mensagem de erro mais detalhada
        let errorMessage = 'Erro ao carregar wp-resources/index.json:\n';
        
        if (window.location.protocol === 'file:') {
            errorMessage += '• Você está abrindo o arquivo diretamente no navegador\n';
            errorMessage += '• Use um servidor local (ex: python -m http.server 8000)\n';
            errorMessage += '• Ou use Live Server no VS Code';
        } else if (error.name === 'TypeError') {
            errorMessage += '• Verifique se o arquivo wp-resources/index.json existe\n';
            errorMessage += '• Verifique as permissões do arquivo';
        } else {
            errorMessage += error.message;
        }
        
        throw new Error(errorMessage);
    }
}

// Função para carregar todos os cards dinamicamente
async function loadCards() {
    const container = document.getElementById('cards-container');
    
    if (!container) {
        console.error('❌ Container de cards não encontrado!');
        return;
    }

    // Mostrar indicador de carregamento
    container.innerHTML = '<div class="loading">Carregando recursos...</div>';

    try {
        // Carregar lista de recursos do index.json
        const recursos = await getAvailableResources();
        console.log(recursos);
        if (recursos.length === 0) {
            container.innerHTML = '<div class="error">Nenhum recurso listado no index.json</div>';
            return;
        }

        // Carregar configuração de cada recurso
        const cards = await Promise.all(
            recursos.map(async (recurso) => {
                try {
                    const response = await fetch(`wp-resources/${recurso}/config.json`);
                    if (!response.ok) {
                        throw new Error(`Erro ao carregar ${recurso}: ${response.status}`);
                    }
                    const config = await response.json();
                    return { ...config, resourceId: recurso };
                } catch (error) {
                    console.error(`❌ Erro ao carregar recurso ${recurso}:`, error);
                    return null;
                }
            })
        );

        // Filtrar cards válidos
        const validCards = cards.filter(card => card !== null);
        
        // Limpar container
        container.innerHTML = '';
        
        // Criar e adicionar cada card
        validCards.forEach(config => {
            const cardElement = createCard(config);
            if (config.type) {
                cardElement.dataset.type = String(config.type);
            }
            container.appendChild(cardElement);
        });

        // Inicializar funcionalidades dos cards
        initializeCards();
        addImageErrorHandling();

        console.log(`✅ ${validCards.length} recursos carregados com sucesso!`);
        
    } catch (error) {
        console.error('❌ Erro ao carregar recursos:', error);
        container.innerHTML = `<div class="error">Erro: ${error.message}</div>`;
    }
}

// Função para criar um card baseado na configuração JSON
function createCard(config) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.resourceId = config.resourceId;
    if (config.type) card.dataset.type = String(config.type);
    
    card.tabIndex = 0;
    card.setAttribute('aria-label', `Abrir exemplo: ${config.titulo}`);

    // "observacao" é texto para o público (não técnico); "notasDev" fica só no config.json
    const observacaoHTML = config.observacao ?
        `<div class="note card-texto"><p class="texto-corte">${config.observacao}</p><span class="ver-mais"></span></div>` : '';

    card.innerHTML = `
        <div class="card-image">
            <img src="${config.img}" alt="${config.titulo}">
        </div>
        <div class="card-content">
            <h3>${config.titulo}</h3>
            <div class="card-descricao card-texto"><p class="texto-corte">${config.conteudo}</p><span class="ver-mais"></span></div>
            ${observacaoHTML}
        </div>
    `;

    return card;
}

// Textos longos do card: cortados em N linhas, abrem ao clicar (um por vez na página)
function atualizarTextosCortados() {
    document.querySelectorAll('.card-texto').forEach(texto => {
        if (texto.classList.contains('expandido')) return;
        if (texto.offsetParent === null) return; // card oculto pelo filtro
        const corte = texto.querySelector('.texto-corte');
        const cortado = corte.scrollHeight - corte.clientHeight > 2;
        texto.classList.toggle('cortado', cortado);
        if (cortado) {
            texto.setAttribute('role', 'button');
            texto.tabIndex = 0;
            texto.setAttribute('aria-expanded', 'false');
        } else {
            texto.removeAttribute('role');
            texto.removeAttribute('tabindex');
            texto.removeAttribute('aria-expanded');
        }
    });
}

function recolherTextos(exceto) {
    document.querySelectorAll('.card-texto.expandido').forEach(texto => {
        if (texto === exceto) return;
        texto.classList.remove('expandido');
        texto.setAttribute('aria-expanded', 'false');
    });
}

function alternarTexto(texto) {
    const abrir = !texto.classList.contains('expandido');
    recolherTextos(texto);
    texto.classList.toggle('expandido', abrir);
    texto.setAttribute('aria-expanded', String(abrir));
}

// Renderizar caixa de filtro por tipo
function renderTypeFilter() {
    const bar = document.getElementById('filters-bar');
    if (!bar) return;

    bar.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'filter-group';

    const label = document.createElement('label');
    label.textContent = 'Filtrar por tipo:';
    label.setAttribute('for', 'type-filter');

    const select = document.createElement('select');
    select.id = 'type-filter';

    const optAll = document.createElement('option');
    optAll.value = TYPE_FILTER_CONFIG.allValue;
    optAll.textContent = TYPE_FILTER_CONFIG.allLabel;
    select.appendChild(optAll);

    TYPE_FILTER_CONFIG.types.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.value;
        opt.textContent = t.label;
        select.appendChild(opt);
    });

    select.addEventListener('change', function() {
        applyTypeFilter(this.value);
    });

    wrapper.appendChild(label);
    wrapper.appendChild(select);
    bar.appendChild(wrapper);
}

function applyTypeFilter(selected) {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const cardType = card.dataset.type || '';
        if (selected === TYPE_FILTER_CONFIG.allValue || selected === '' || selected == null) {
            card.style.display = 'flex';
            card.style.animation = 'fadeIn 0.3s ease';
        } else if (cardType === selected) {
            card.style.display = 'flex';
            card.style.animation = 'fadeIn 0.3s ease';
        } else {
            card.style.display = 'none';
        }
    });
    recolherTextos();
    atualizarTextosCortados();
}

// Inicializar funcionalidades dos cards
function initializeCards() {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const abrir = () => {
            recolherTextos();
            handleResourceClick(card.dataset.resourceId, card.querySelector('h3').textContent, card);
        };

        // Clique no card (imagem, título, texto curto) abre o exemplo;
        // clique em texto cortado só expande/recolhe o texto
        card.addEventListener('click', function(e) {
            const texto = e.target.closest('.card-texto.cortado, .card-texto.expandido');
            if (texto) {
                alternarTexto(texto);
                return;
            }
            abrir();
        });

        card.addEventListener('keydown', function(e) {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            const texto = e.target.closest('.card-texto.cortado, .card-texto.expandido');
            if (texto) {
                e.preventDefault();
                alternarTexto(texto);
            } else if (e.target === card) {
                e.preventDefault();
                abrir();
            }
        });
    });

    atualizarTextosCortados();
}

// Função para lidar com cliques em recursos específicos
function handleResourceClick(resourceId, cardTitle, button) {
    console.log(`Botão clicado para: ${cardTitle} (${resourceId})`);
    
    // Abrir painel de visualização
    abrirPainelVisualizacao(resourceId, cardTitle);
}

// Função para carregar demonstração específica do recurso
async function loadResourceDemo(resourceId) {
    try {
        // Verificar se existe arquivo de demonstração
        const config = await fetch(`wp-resources/${resourceId}/config.json`).then(r => r.json());
        
        if (config.src) {
            // Se tiver src definido, carregar o arquivo
            console.log(`Carregando demonstração para ${resourceId}: ${config.src}`);
            // Aqui você pode implementar a lógica para carregar e executar o arquivo src
        } else {
            console.log(`Demonstração para ${resourceId} ainda não implementada`);
        }
    } catch (error) {
        console.error(`Erro ao carregar demonstração para ${resourceId}:`, error);
    }
}

// Adicionar tratamento de erro para imagens
function addImageErrorHandling() {
    const images = document.querySelectorAll('.card-image img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Criar um placeholder caso a imagem não carregue
            this.style.display = 'none';
            
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
                width: 100%;
                height: 100%;
                background: linear-gradient(45deg, #ecf0f1, #bdc3c7);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #7f8c8d;
                font-size: 14px;
                text-align: center;
                padding: 20px;
            `;
            placeholder.innerHTML = '🖼️<br>Imagem em<br>desenvolvimento';
            
            this.parentNode.appendChild(placeholder);
        });
        
        // Adicionar efeito de loading
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
    });
}

// Função para recarregar recursos (utilitário)
async function reloadResources() {
    console.log('🔄 Recarregando recursos...');
    await loadCards();
    console.log('✅ Recursos recarregados!');
}

// Função para filtrar recursos
function filterResources(searchTerm) {
    const cards = document.querySelectorAll('.card');
    const term = searchTerm.toLowerCase();
    
    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(term) || description.includes(term)) {
            card.style.display = 'flex';
            card.style.animation = 'fadeIn 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

// Smooth scroll para navegação
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Criar painel de visualização se não existir
function criarPainelVisualizacao() {
    if (document.getElementById('painel-visualizacao')) {
        return; // Painel já existe
    }

    const painelHTML = `
        <div id="painel-overlay" class="painel-overlay"></div>
        <div id="painel-visualizacao" class="painel-visualizacao">
            <div class="painel-header">
                <div class="painel-titulo" id="painel-titulo">VISUALIZANDO RECURSO</div>
                <button class="btn-fechar" id="btn-fechar-painel">×</button>
            </div>
            <div class="painel-conteudo">
                <div class="conteudo-recurso" id="conteudo-recurso">
                    Carregando...
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', painelHTML);

    // Adicionar event listeners
    const btnFechar = document.getElementById('btn-fechar-painel');
    const overlay = document.getElementById('painel-overlay');

    btnFechar.addEventListener('click', fecharPainelVisualizacao);
    overlay.addEventListener('click', fecharPainelVisualizacao);

    // Prevenir scroll do body quando painel estiver aberto
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.getElementById('painel-visualizacao').classList.contains('aberto')) {
            fecharPainelVisualizacao();
        }
    });
}

// Abrir painel de visualização
async function abrirPainelVisualizacao(resourceId, cardTitle) {
    criarPainelVisualizacao();

    const painel = document.getElementById('painel-visualizacao');
    const overlay = document.getElementById('painel-overlay');
    const titulo = document.getElementById('painel-titulo');
    const conteudo = document.getElementById('conteudo-recurso');

    // Definir título
    titulo.textContent = cardTitle;

    // Mostrar painel
    overlay.classList.add('ativo');
    document.body.style.overflow = 'hidden'; // Prevenir scroll
    
    setTimeout(() => {
        painel.classList.add('aberto');
    }, 100);

    // Carregar conteúdo do recurso
    try {
        const response = await fetch(`wp-resources/${resourceId}/config.json`);
        const config = await response.json();

        if (config.src && config.src.trim() !== '') {
            // Se tem src definido, carregar o conteúdo
            try {
                const srcResponse = await fetch(`wp-resources/${resourceId}/${config.src}`);
                if (srcResponse.ok) {
                    const srcContent = await srcResponse.text();
                    
                    // Verificar se é HTML
                    if (config.src.endsWith('.html')) {
                        // Criar iframe para isolamento completo do CSS e JavaScript
                        const iframe = document.createElement('iframe');
                        iframe.src = `wp-resources/${resourceId}/${config.src}`;
                        iframe.style.cssText = `
                            width: 100%;
                            height: 70vh;
                            min-height: 500px;
                            border: none;
                            border-radius: 10px;
                            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                            background: white;
                        `;
                        iframe.title = `Demonstração: ${cardTitle}`;
                        
                        // Limpar conteúdo e adicionar iframe com loading
                        conteudo.innerHTML = '';
                        conteudo.classList.add('iframe-loading');
                        conteudo.appendChild(iframe);
                        conteudo.classList.remove('em-breve');
                        
                        // Ajustar layout para iframe
                        conteudo.style.display = 'flex';
                        conteudo.style.alignItems = 'flex-start';
                        conteudo.style.justifyContent = 'flex-start';
                        conteudo.style.textAlign = 'center';
                        conteudo.style.padding = '20px';
                        
                        // Adicionar evento de erro para o iframe
                        iframe.addEventListener('error', function() {
                            console.error(`Erro ao carregar iframe para ${resourceId}`);
                            conteudo.classList.remove('iframe-loading');
                            mostrarEmBreve(conteudo);
                        });
                        
                        // Remover loading quando iframe carregar
                        iframe.addEventListener('load', function() {
                            console.log(`✅ Iframe carregado com sucesso para ${resourceId}`);
                            conteudo.classList.remove('iframe-loading');
                            
                            // Pequeno delay para suavizar a transição
                            setTimeout(() => {
                                iframe.style.opacity = '1';
                            }, 100);
                        });
                        
                    } else {
                        // Para outros tipos de arquivo, mostrar como texto
                        conteudo.innerHTML = `<pre style="text-align: left; white-space: pre-wrap; font-family: monospace; margin: 0;">${escapeHtml(srcContent)}</pre>`;
                        conteudo.classList.remove('em-breve');
                        conteudo.style.display = 'flex';
                        conteudo.style.alignItems = 'flex-start';
                        conteudo.style.justifyContent = 'flex-start';
                        conteudo.style.textAlign = 'left';
                    }
                } else {
                    throw new Error('Arquivo src não encontrado');
                }
            } catch (error) {
                console.error(`Erro ao carregar src para ${resourceId}:`, error);
                mostrarEmBreve(conteudo);
            }
        } else {
            // Se não tem src ou está vazio, mostrar "Em breve"
            mostrarEmBreve(conteudo);
        }
    } catch (error) {
        console.error(`Erro ao carregar config para ${resourceId}:`, error);
        mostrarEmBreve(conteudo);
    }
}

// Fechar painel de visualização
function fecharPainelVisualizacao() {
    const painel = document.getElementById('painel-visualizacao');
    const overlay = document.getElementById('painel-overlay');

    if (painel && painel.classList.contains('aberto')) {
        painel.classList.remove('aberto');
        overlay.classList.remove('ativo');
        document.body.style.overflow = ''; // Restaurar scroll

        setTimeout(() => {
            // Limpar conteúdo após animação
            const conteudo = document.getElementById('conteudo-recurso');
            if (conteudo) {
                conteudo.innerHTML = 'Carregando...';
                conteudo.classList.remove('em-breve');
                // Resetar estilos
                conteudo.style.display = 'flex';
                conteudo.style.alignItems = 'center';
                conteudo.style.justifyContent = 'center';
                conteudo.style.textAlign = 'center';
            }
        }, 500);
    }
}

// Mostrar mensagem "Em breve"
function mostrarEmBreve(conteudoElement) {
    conteudoElement.innerHTML = 'Em breve';
    conteudoElement.classList.add('em-breve');
}

// Escapar HTML para exibição segura
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Exportar funções para uso global
window.RecursosEducacionais = {
    loadCards,
    reloadResources,
    filterResources,
    smoothScrollTo,
    getAvailableResources,
    abrirPainelVisualizacao,
    fecharPainelVisualizacao
};