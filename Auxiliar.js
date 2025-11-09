class Auxiliar {
  static gridParaPixel_X(coluna) {
    return coluna * tamanhoCelula + tamanhoCelula / 2;
  }
  static gridParaPixel_Y(linha) {
    return linha * tamanhoCelula + tamanhoCelula / 2;
  }
  static estaoColidindo(ent1, ent2) {
    let d = dist(ent1.x, ent1.y, ent2.x, ent2.y);
    return d < ent1.tamanho / 2 + ent2.tamanho / 2;
  }
}
