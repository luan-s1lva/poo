class Parede {
  constructor(x, y, tamanho, cor) {
    this.x = x;
    this.y = y;
    this.tamanho = tamanho;
    this.cor = cor;
  }
  
  desenhar() {
    fill(this.cor);
    rectMode(CENTER);
    rect(this.x, this.y, this.tamanho, this.tamanho);
  }
}