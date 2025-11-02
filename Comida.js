class Comida extends Entidade {
  tipo = "padrao"; // padrão e forte(mais pontos)

  constructor(linha, coluna, tipo = "padrao") {
    let x = coluna * tamanhoCelula + tamanhoCelula / 2;
    let y = linha * tamanhoCelula + tamanhoCelula / 2;
    let tamanho = tipo === "padrao" ? 8 : 16;
    let cor = color(255, 255, 150);
    super(x, y, cor, tamanho);
    this.tipo = tipo;
  }
}
