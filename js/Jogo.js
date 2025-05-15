import Bola from './Bola.js';
import Pote from './Pote.js';

export default class Jogo {
  constructor() {
    this.fase = 1;
    this.pontos = 0;
    this.tempo = 180;
    this.bolinhas = [];
    this.potes = [];
    this.cores = [
      '#FFADAD',
      '#FFD6A5',
      '#FDFFB6',
      '#CAFFBF',
      '#9BF6FF',
      '#A0C4FF',
      '#BDB2FF',
      '#FFC6FF',
      '#FFFFFC',
      '#D0F4DE',
      '#FEC8D8',
      '#F8C8DC',
      '#A9DEF9',
      '#EDE7B1',
      '#F7DAD9',
      '#C1FFD7',
      '#D9F0FF',
      '#FFFACD',
      '#D6E9F8',
    ];
    this.intervaloTempo = null;
  }

  iniciar() {
    this.fase = 1;
    this.pontos = 0;
    this.tempo = 180;
    clearInterval(this.intervaloTempo);
    this.iniciarFase();
    this.contarTempo();
  }

  iniciarFase() {
    const coresSelecionadas = this.selecionarCores(this.fase + 2);
    this.bolinhas = this.criarBolinhas(coresSelecionadas, this.fase + 4);
    this.potes = this.criarPotes(coresSelecionadas);
  }

  avancarDeFase() {
    this.calcularBonusPorTempo();
    clearInterval(this.intervaloTempo);
    this.fase++;
    this.tempo = 180;

    this.iniciarFase();
    this.contarTempo();
  }

  adicionarPontos(pontos) {
    this.pontos += pontos;
  }

  calcularBonusPorTempo() {
    const bonus = this.tempo;
    this.adicionarPontos(bonus);
  }

  contarTempo() {
    this.intervaloTempo = setInterval(() => {
      this.tempo--;

      const textoTempo = document.getElementById('tempo');
      textoTempo.textContent = `Tempo: ${this.formatarTempo(this.tempo)}`;

      if (this.tempo <= 0) {
        clearInterval(this.intervaloTempo);
        this.fimDeJogo();
      }
    }, 1000);
  }

  formatarTempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${minutos}:${seg < 10 ? '0' + seg : seg}`;
  }

  selecionarCores(quantidade) {
    const coresSelecionadas = [];

    while (coresSelecionadas.length < quantidade) {
      const corAleatoria =
        this.cores[Math.floor(Math.random() * this.cores.length)];

      if (!coresSelecionadas.includes(corAleatoria)) {
        coresSelecionadas.push(corAleatoria);
      }
    }
    return coresSelecionadas;
  }

  criarBolinhas(cores, quantidadePorCor) {
    let bolasPorCor = [];
    cores.forEach((cor) => {
      for (
        let quantidadeBolas = 0;
        quantidadeBolas < quantidadePorCor;
        quantidadeBolas++
      ) {
        bolasPorCor.push(new Bola(cor));
      }
    });
    return bolasPorCor;
  }

  criarPotes(cores) {
    return cores.map((cor) => new Pote(cor));
  }

  fimDeJogo() {
    window.dispatchEvent(
      new CustomEvent('fimDeJogo', {
        detail: { fase: this.fase, pontos: this.pontos },
      })
    );
  }
}
