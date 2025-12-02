// Ponto de saida fixo (igual para todos)
const SAIDA_CAIXA = { linha: 11, coluna: 13 };

class Fantasma extends Entidade {
  linha;
  coluna;
  vx = 0;
  vy = 0;
  direcaoAtual = "ESQUERDA";
  #estado = "SPAWNING"; // estado até sair da caixa
  personalidade = "BLINKY";
  tempoFuga = 0;
  corOriginal;

  constructor(linha, coluna, cor, tamanho, personalidade) {
    let xInicial = Auxiliar.gridParaPixel_X(coluna);
    let yInicial = Auxiliar.gridParaPixel_Y(linha);
    super(xInicial, yInicial, cor, tamanho);

    this.linha = linha;
    this.coluna = coluna;
    this.#estado = "SPAWNING";
    this.personalidade = personalidade;
    this.corOriginal = cor;

    this.vx = -velocidadeFantasma;
  }

  estaAlinhadoNoGrid() {
    let xNoGrid = (this.x - tamanhoCelula / 2) % tamanhoCelula === 0;
    let yNoGrid = (this.y - tamanhoCelula / 2) % tamanhoCelula === 0;
    return xNoGrid && yNoGrid;
  }

  checarProximaCelula(direcao) {
    let linhaAlvo = this.linha;
    let colunaAlvo = this.coluna;

    if (direcao === "CIMA") linhaAlvo--;
    if (direcao === "BAIXO") linhaAlvo++;
    if (direcao === "ESQUERDA") colunaAlvo--;
    if (direcao === "DIREITA") colunaAlvo++;

    if (this.linha === 11 && direcao === "BAIXO") {
      if (this.coluna === 13 || this.coluna === 14) {
        return 1;
      }
    }

    if (
      linhaAlvo < 0 ||
      linhaAlvo >= mapa.length ||
      colunaAlvo < 0 ||
      colunaAlvo >= mapa[0].length
    ) {
      return 1; // parede
    }

    return mapa[linhaAlvo][colunaAlvo];
  }

  acharAlvo() {
    let alvoLinha;
    let alvoColuna;

    if (this.#estado === "FUGITIVE") {
      // Gera um alvo aleatório no mapa
      return {
        x: Math.random() * width,
        y: Math.random() * height,
      };
    }
    if (this.estado === "SPAWNING") {
      // sair da caixa -> evitar bug
      alvoLinha = SAIDA_CAIXA.linha;
      alvoColuna = SAIDA_CAIXA.coluna;
    } else {
      switch (this.personalidade) {
        //Blinky (Vermelho) -> Persegue o pacman
        case "BLINKY":
          alvoLinha = pacman.linha;
          alvoColuna = pacman.coluna;
          break;

        //Pinky(Rosa) -> Persegue 4 casas a frente do pacman
        case "PINKY":
          alvoLinha = pacman.linha;
          alvoColuna = pacman.coluna;

          // direção de onde o pacman vai
          if (pacman.direcaoAtual === "CIMA") alvoLinha -= 4;
          if (pacman.direcaoAtual === "BAIXO") alvoLinha += 4;
          if (pacman.direcaoAtual === "ESQUERDA") alvoColuna -= 4;
          if (pacman.direcaoAtual === "DIREITA") alvoColuna += 4;
          break;

        default: // padrão é perseguir o pacman
          alvoLinha = pacman.linha;
          alvoColuna = pacman.coluna;
          console.log("erro de personalidade");
          break;
      }
    }

    return {
      x: alvoColuna * tamanhoCelula + tamanhoCelula / 2,
      y: alvoLinha * tamanhoCelula + tamanhoCelula / 2,
    };
  }

  mover() {
    if (this.#estado === "FUGITIVE") {
      this.tempoFuga--;
      if (this.tempoFuga <= 0) {
        this.voltarAoNormal();
      } else {
        if (this.tempoFuga < 120 && Math.floor(this.tempoFuga / 10) % 2 === 0) {
          this.cor = color(255);
        } else {
          this.cor = color(0, 0, 255);
        }
      }
    }
    this.coluna = Math.round((this.x - tamanhoCelula / 2) / tamanhoCelula);
    this.linha = Math.round((this.y - tamanhoCelula / 2) / tamanhoCelula);

    if (this.estado === "SPAWNING" && this.linha === SAIDA_CAIXA.linha) {
      this.estado = "CHASING";
    }

    if (this.estaAlinhadoNoGrid()) {
      let alvo = this.acharAlvo();

      let direcoesPossiveis = ["CIMA", "BAIXO", "ESQUERDA", "DIREITA"];
      let direcoesValidas = [];
      for (let dir of direcoesPossiveis) {
        if (this.checarProximaCelula(dir) === 0) {
          direcoesValidas.push(dir);
        }
      }

      let direcaoOposta = "NENHUMA";
      if (this.direcaoAtual === "CIMA") direcaoOposta = "BAIXO";
      if (this.direcaoAtual === "BAIXO") direcaoOposta = "CIMA";
      if (this.direcaoAtual === "ESQUERDA") direcaoOposta = "DIREITA";
      if (this.direcaoAtual === "DIREITA") direcaoOposta = "ESQUERDA";

      if (direcoesValidas.length > 1) {
        direcoesValidas = direcoesValidas.filter(
          (dir) => dir !== direcaoOposta
        );
      }
      //greed
      let menorDistancia = Infinity;
      let melhorDirecao = "NENHUMA";
      for (let dir of direcoesValidas) {
        let proxLinha = this.linha;
        let proxColuna = this.coluna;
        if (dir === "CIMA") proxLinha--;
        if (dir === "BAIXO") proxLinha++;
        if (dir === "ESQUERDA") proxColuna--;
        if (dir === "DIREITA") proxColuna++;

        let proxX = proxColuna * tamanhoCelula + tamanhoCelula / 2;
        let proxY = proxLinha * tamanhoCelula + tamanhoCelula / 2;

        let d = dist(proxX, proxY, alvo.x, alvo.y);

        if (d < menorDistancia) {
          menorDistancia = d;
          melhorDirecao = dir;
        }
      }

      this.direcaoAtual = melhorDirecao;
      this.vx = 0;
      this.vy = 0;
      if (this.direcaoAtual === "CIMA") this.vy = -velocidadeFantasma;
      if (this.direcaoAtual === "BAIXO") this.vy = velocidadeFantasma;
      if (this.direcaoAtual === "ESQUERDA") this.vx = -velocidadeFantasma;
      if (this.direcaoAtual === "DIREITA") this.vx = velocidadeFantasma;
    }

    this.x += this.vx;
    this.y += this.vy;
  }
  fugir() {
    if (this.#estado !== "SPAWNING" && this.#estado !== "EATEN") {
      this.#estado = "FUGITIVE";
      this.cor = color(0, 0, 255);
      this.tempoFuga = 600;
      if (this.vx !== 0) this.vx *= -1;
      if (this.vy !== 0) this.vy *= -1;

      //Inverter direcao
      if (this.direcaoAtual === "ESQUERDA") this.direcaoAtual = "DIREITA";
      else if (this.direcaoAtual === "DIREITA") this.direcaoAtual = "ESQUERDA";
      else if (this.direcaoAtual === "CIMA") this.direcaoAtual = "BAIXO";
      else if (this.direcaoAtual === "BAIXO") this.direcaoAtual = "CIMA";
    }
  }
  voltarAoNormal() {
    this.#estado = "CHASING";
    this.cor = this.corOriginal;
    this.tempoFuga = 0;
  }
  respawn() {
    this.linha = 14;
    this.coluna = this.personalidade === "BLINKY" ? 13 : 16;

    this.x = this.coluna * tamanhoCelula + tamanhoCelula / 2;
    this.y = this.linha * tamanhoCelula + tamanhoCelula / 2;

    this.#estado = "SPAWNING";
    this.cor = this.corOriginal;
    this.vx = -velocidadeFantasma;
    this.vy = 0;
    this.direcaoAtual = "ESQUERDA";
  }
  get estado() {
    return this.#estado;
  }

  set estado(novoEstado) {
    this.#estado = novoEstado;
  }
}
