export default class Bola {
  constructor(cor) {
    this.cor = cor;
    this.posicao = { x: 0, y: 0 };
  }

  moverBola(x, y) {
    this.posicao = { x, y };
  }

  bolaNoPote(pote) {
    if (this.cor === pote.cor) {
      return true;
    }
    return false;
  }
}
