import Jogo from './Jogo.js';

window.addEventListener('load', main);

function main() {
  const botaoJogar = document.getElementById('botao-jogar');
  const botaoPontuacoes = document.getElementById('botao-pontuacoes');
  const botaoOpcoes = document.getElementById('botao-opcoes');

  const jogo = new Jogo();

  botaoJogar.addEventListener('click', () => {
    const painelJogo = document.getElementById('painel-jogo');
    const menu = document.getElementById('menu');
    menu.classList.add('tela');
    painelJogo.classList.remove('tela');
    jogo.iniciar();
    renderizarJogo(jogo);
  });

  botaoPontuacoes.addEventListener('click', () => {
    const tabelaPontuacoes = document.getElementById('tabela-pontuacoes');
    const menu = document.getElementById('menu');
    menu.classList.add('tela');
    tabelaPontuacoes.classList.remove('tela');
    exibirPontuacoes();
  });

  botaoOpcoes.addEventListener('click', () => {
    const opcoes = document.getElementById('opcoes');
    const menu = document.getElementById('menu');
    menu.classList.add('tela');
    opcoes.classList.remove('tela');
    exibirOpcoes();
  });

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
        // e.target.classList.add('colocada');
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
        const bola = document.querySelector(
          `[data-cor="${corBola}"].arrastando`
        );

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
  function exibirPontuacoes() {
    console.log('O botão de Pontuações foi clicado.');
  }

  /** OPÇOES
   *
   */
  function exibirOpcoes() {
    console.log('O botão de Opções foi clicado.');
  }
}
