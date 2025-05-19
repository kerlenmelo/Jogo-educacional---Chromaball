import Jogo from './Jogo.js';

const jogo = new Jogo();

window.addEventListener('load', main);

function main() {
  const botaoJogar = document.getElementById('botao-jogar');
  const botaoPontuacoes = document.getElementById('botao-pontuacoes');
  const botaoOpcoes = document.getElementById('botao-opcoes');

  botaoJogar.addEventListener('click', () => {
    const painelJogo = document.getElementById('painel-jogo');
    const menu = document.getElementById('menu');
    menu.classList.add('tela');
    painelJogo.classList.remove('tela');

    jogo.iniciar();
    renderizarJogo(jogo);
  });

  botaoPontuacoes.addEventListener('click', () => {
    const menu = document.getElementById('menu');
    const tabelaPontuacoes = document.getElementById('tabela-pontuacoes');

    menu.classList.add('tela');
    tabelaPontuacoes.classList.remove('tela');

    exibirPontuacoes(tabelaPontuacoes);

    const botaoLimparPlacar = document.getElementById('botao-limpar-placar');
    botaoLimparPlacar.classList.remove('tela');
    botaoLimparPlacar.addEventListener(
      'click',
      limplarPlacar(botaoLimparPlacar, tabelaPontuacoes)
    );
  });

  botaoOpcoes.addEventListener('click', () => {
    const opcoes = document.getElementById('opcoes');
    const menu = document.getElementById('menu');
    menu.classList.add('tela');
    opcoes.classList.remove('tela');
    exibirOpcoes();
  });
}
/** JOGO
 *
 */
function renderizarJogo(jogo) {
  const containerBolas = document.getElementById('container-bolas');
  const containerPotes = document.getElementById('container-potes');

  const textoFase = document.getElementById('fase');
  const textoPontos = document.getElementById('pontos');

  textoFase.textContent = `Fase ${jogo.fase}`;
  textoPontos.textContent = `Pontos: ${jogo.pontos}`;

  containerBolas.innerHTML = '';
  containerPotes.innerHTML = '';

  gerarBolinhas(containerBolas, jogo);
  gerarPotes(containerPotes, jogo);
}

function gerarBolinhas(containerBolas, jogo) {
  const larguraContainer = containerBolas.offsetWidth;
  const alturaContainer = containerBolas.offsetHeight;
  const tamanhoBola = 30; // Valor fixo por enquanto

  const colunas = Math.floor(larguraContainer / tamanhoBola);
  const linhas = Math.floor(alturaContainer / tamanhoBola);

  const totalCelulas = colunas * linhas;
  const posicoesOcupadas = [];

  jogo.bolinhas.forEach((bola) => {
    const bolaDiv = document.createElement('div');
    bolaDiv.classList.add('bola');
    bolaDiv.style.backgroundColor = bola.cor;
    bolaDiv.setAttribute('draggable', true);
    bolaDiv.setAttribute('data-cor', bola.cor);

    let posicaoAleatoria;

    do {
      posicaoAleatoria = Math.floor(Math.random() * totalCelulas);
    } while (posicoesOcupadas.includes(posicaoAleatoria));

    posicoesOcupadas.push(posicaoAleatoria);

    const linha = Math.floor(posicaoAleatoria / colunas);
    const coluna = posicaoAleatoria % colunas;

    const posicaoX = coluna * tamanhoBola;
    const posicaoY = linha * tamanhoBola;

    bolaDiv.style.left = `${posicaoX}px`;
    bolaDiv.style.top = `${posicaoY}px`;

    bolaDiv.addEventListener('dragstart', (e) => {
      e.target.classList.add('arrastando');
      e.dataTransfer.setData('text', e.target.dataset.cor);
    });

    bolaDiv.addEventListener('dragend', (e) => {
      e.target.classList.remove('arrastando');
    });

    containerBolas.appendChild(bolaDiv);
  });
}

function gerarPotes(containerPotes, jogo) {
  jogo.potes.forEach((pote) => {
    const poteDiv = document.createElement('div');
    poteDiv.classList.add('pote');
    poteDiv.style.backgroundColor = pote.cor;

    poteDiv.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    poteDiv.addEventListener('drop', (e) => {
      e.preventDefault();
      const corBola = e.dataTransfer.getData('text');
      const bola = document.querySelector(`[data-cor="${corBola}"].arrastando`);

      if (bola && pote.cor === corBola) {
        e.currentTarget.appendChild(bola);
        bola.classList.remove('arrastando');
        bola.classList.add('colocada');

        const poteLargura = poteDiv.offsetWidth;
        const poteAltura = poteDiv.offsetHeight;
        const bolaLargura = bola.offsetWidth;
        const bolaAltura = bola.offsetHeight;

        const posicaoX = (poteLargura - bolaLargura) / 2;
        const posicaoY = (poteAltura - bolaAltura) / 2;

        bola.style.left = `${posicaoX}px`;
        bola.style.top = `${posicaoY}px`;

        jogo.adicionarPontos(1);
        document.getElementById(
          'pontos'
        ).textContent = `Pontos: ${jogo.pontos}`;

        const containerBolas = document.getElementById('container-bolas');
        if (!containerBolas.querySelector('.bola')) {
          jogo.avancarDeFase();
          renderizarJogo(jogo);
        }
      }
    });
    containerPotes.appendChild(poteDiv);
  });
}

/** PONTUAÇÕES
 *
 */
function exibirPontuacoes(tabelaPontuacoes) {
  const tabela = JSON.parse(localStorage.getItem('chromaballScores')) || [];
  tabela.sort((a, b) => b.pontos - a.pontos);

  const tbody = tabelaPontuacoes.querySelector('tbody');
  tbody.innerHTML = '';

  tabela.forEach(({ nome, pontos, fase }) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${nome}</td>
      <td>${pontos}</td>
      <td>${fase}</td>
    `;
    tbody.appendChild(tr);
  });
}

function limplarPlacar(botaoLimparPlacar, tabelaPontuacoes) {
  botaoLimparPlacar.onclick = () => {
    localStorage.removeItem('chromaballScores');
    exibirPontuacoes(tabelaPontuacoes);
  };
}

/** OPÇOES
 *
 */
function exibirOpcoes() {
  console.log('O botão de Opções foi clicado.');
}

window.addEventListener('fimDeJogo', (evento) => {
  const { fase, pontos } = evento.detail;

  const painelDoJogo = document.getElementById('painel-jogo');
  const fimDeJogo = document.getElementById('fim-jogo');

  painelDoJogo.classList.add('tela');
  fimDeJogo.classList.remove('tela');

  const infoFimDeJogo = document.getElementById('fim-jogo-info');
  const infoFase = document.createElement('p');
  const infoPontos = document.createElement('p');

  infoFimDeJogo.innerHTML = '';
  infoFase.textContent = `Fase final: ${fase}`;
  infoPontos.textContent = `Pontuação final: ${pontos}`;

  infoFimDeJogo.appendChild(infoPontos);
  infoFimDeJogo.appendChild(infoFase);

  const salvarPlacar = document.getElementById('salvar-placar');
  const inputNome = document.getElementById('input-nome');
  const botaoSalvar = document.getElementById('botao-salvar');
  const botoesPosSalvamento = document.getElementById('botoes-pos-salvamento');

  botaoSalvar.addEventListener('click', (e) => {
    e.preventDefault();
    const nome = inputNome.value.trim() || 'Anônimo';
    const tabela = JSON.parse(localStorage.getItem('chromaballScores')) || [];
    tabela.push({
      nome,
      fase,
      pontos,
    });
    localStorage.setItem('chromaballScores', JSON.stringify(tabela));
    salvarPlacar.classList.add('tela');
    botoesPosSalvamento.classList.remove('tela');
  });

  const botaoRestart = document.getElementById('botao-restart');
  const botaoMenu = document.getElementById('botao-menu');

  botaoRestart.addEventListener('click', () => {
    fimDeJogo.classList.add('tela');
    painelDoJogo.classList.remove('tela');

    jogo.iniciar();
    renderizarJogo(jogo);
  });

  botaoMenu.addEventListener('click', () => {
    fimDeJogo.classList.add('tela');
    painelDoJogo.classList.add('tela');
    document.getElementById('menu').classList.remove('tela');
  });
});
