class Pacman extends Entidade {
  linha;
  coluna;
  vida;
  vx = 0;
  vy = 0;
  direcaoAtual = 'NENHUMA';
  direcaoDesejada = 'NENHUMA';

  constructor(linha, coluna, cor, tamanho) {
    let xInicial = coluna * tamanhoCelula + tamanhoCelula / 2;
    let yInicial = linha * tamanhoCelula + tamanhoCelula / 2;
    super(xInicial, yInicial, cor, tamanho);
    this.linha = linha;
    this.coluna = coluna;
    this.vida = 3;
  }

  setDirecao(direcao) {
    this.direcaoDesejada = direcao;
  }

  estaAlinhadoNoGrid() {
    let xNoGrid = (this.x - tamanhoCelula / 2) % tamanhoCelula === 0;
    let yNoGrid = (this.y - tamanhoCelula / 2) % tamanhoCelula === 0;
    return xNoGrid && yNoGrid;
  }

  checarProximaCelula(direcao) {
    let linhaAlvo = this.linha;
    let colunaAlvo = this.coluna;

    if (direcao === 'CIMA')    linhaAlvo--;
    if (direcao === 'BAIXO')  linhaAlvo++;
    if (direcao === 'ESQUERDA') colunaAlvo--;
    if (direcao === 'DIREITA')  colunaAlvo++;
    

    return mapa[linhaAlvo][colunaAlvo];
  }

  mover() {
    this.coluna = Math.round((this.x - tamanhoCelula / 2) / tamanhoCelula);
    this.linha = Math.round((this.y - tamanhoCelula / 2) / tamanhoCelula);

    if (this.linha === 14) {
      if (this.x < 0) { 
        this.x = (mapa[0].length - 1) * tamanhoCelula + tamanhoCelula / 2;
      } else if (this.x > width) {
        this.x = 0 + tamanhoCelula / 2;
      }
    }

    if (this.estaAlinhadoNoGrid()) {
      let celulaDesejada = this.checarProximaCelula(this.direcaoDesejada);
      
      if (celulaDesejada === 0) { 
        this.direcaoAtual = this.direcaoDesejada;
        this.vx = 0;
        this.vy = 0;
        
        if (this.direcaoAtual === 'CIMA')    this.vy = -velocidade;
        if (this.direcaoAtual === 'BAIXO')  this.vy = velocidade;
        if (this.direcaoAtual === 'ESQUERDA') this.vx = -velocidade;
        if (this.direcaoAtual === 'DIREITA')  this.vx = velocidade;
      } 
      else {
        let celulaAtual = this.checarProximaCelula(this.direcaoAtual);
        if (celulaAtual === 1) { 
          this.vx = 0;
          this.vy = 0;
        }
      }
    }

    this.x += this.vx;
    this.y += this.vy;
  }
}