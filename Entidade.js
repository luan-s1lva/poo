class Entidade {
  #x;
  #y;
  #cor;
  #tamanho;

  constructor(x, y, cor, tamanho) {
    this.#x = x;
    this.#y = y;
    this.#cor = cor;
    this.#tamanho = tamanho;
  }

  get x() {
    return this.#x;
  }
  set x(valor) {
    this.#x = valor;
  }

  get y() {
    return this.#y;
  }
  set y(valor) {
    this.#y = valor;
  }

  get cor() {
    return this.#cor;
  }
  set cor(valor) {
    this.#cor = valor;
  }

  get tamanho() {
    return this.#tamanho;
  }
  set tamanho(valor) {
    this.#tamanho = valor;
  }

  desenhar() {
    fill(this.#cor);
    noStroke();
    circle(this.#x, this.#y, this.#tamanho);
  }

  colisao(alvo) {
    let dis = dist(this.#x, this.#y, alvo.x, alvo.y);
    return dis < this.#tamanho / 2 + alvo.tamanho / 2;
  }
}
