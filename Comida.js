class Comida extends Entidade {
  #tipo = "padrao"; // padrão e forte(mais pontos)

  constructor(linha, coluna, tipo = "padrao") {
    let x = Auxiliar.gridParaPixel_X(coluna);
    let y = Auxiliar.gridParaPixel_Y(linha);
    let tamanho = tipo === "padrao" ? 8 : 16;
    let cor = color(255, 255, 150);
    super(x, y, cor, tamanho);
    this.#tipo = tipo;
  }
  get tipo() {
    return this.#tipo;
  }
  
  set tipo(novoTipo) {
    this.#tipo = novoTipo;
  }
}
