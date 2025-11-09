let scoreElement;
let vidasElement;
let canvasContainer;
let menuImg;
let ranking = [];

function preload() {
  menuImg = loadImage("imgs/menu.png");
  gerarMapa();
}

function setup() {
  let canvas = createCanvas(560, 620);
  canvas.parent("canvas-container");
  scoreElement = document.getElementById("score-valor");
  vidasElement = document.getElementById("vidas-valor");

  //pos inicial pacman
  pacman = new Pacman(23, 13, color(255, 255, 0), 20);

  // posi inicial dos fantasmas
  fantasmaVermelho = new Fantasma(14, 13, color(255, 0, 0), 20, "BLINKY");
  fantasmaRosa = new Fantasma(14, 15, color(255, 184, 222), 20, "PINKY");
  atualizarHUD();
}

function draw() {
  if (tela == 1) {
    background(0);

    for (let parede of paredes) {
      parede.desenhar();
    }
    for (let comida of comidas) {
      comida.desenhar();
    }

    pacman.mover();
    pacman.desenhar();

    fantasmaVermelho.mover();
    fantasmaVermelho.desenhar();

    fantasmaRosa.mover();
    fantasmaRosa.desenhar();

    detectarColisaoInimigo();
    detectarComerComida();

    /*  if(pontuacao == 50){
        ganharJogo();
      }*/

  } /*if (tela == 2) {
    for (var i = 0; i < localStorage.length; i++) {
      localStorage.getItem(localStorage.key(i));
    }
  }*/ else {
    background(menuImg)

  }

}
function mousePressed() {
  if (tela == 0) {
    if (mouseX >= 72 && mouseX <= 170 && mouseY >= 545 && mouseY <= 560) {
      tela = 1;
      document.getElementById('game-start').style.display = 'block';
    }
    if (mouseX >= 383 && mouseX <= 495 && mouseY >= 545 && mouseY <= 560) {
      tela = 2;
    }
  }
}
function keyPressed() {
  if (keyCode === UP_ARROW) {
    pacman.setDirecao("CIMA");
  } else if (keyCode === DOWN_ARROW) {
    pacman.setDirecao("BAIXO");
  } else if (keyCode === LEFT_ARROW) {
    pacman.setDirecao("ESQUERDA");
  } else if (keyCode === RIGHT_ARROW) {
    pacman.setDirecao("DIREITA");
  }
}

const detectarColisaoInimigo = () => {
  if (pacman.colisao(fantasmaVermelho) || pacman.colisao(fantasmaRosa)) {
    pacman.vida -= 1;
    atualizarHUD();

    if (pacman.vida <= 0) {
      detectarMorte(); //
      return;
    }
    resetarPacman();
    resetarFantasmas();
  }
};

const detectarMorte = () => {
  if (pacman.vida == 0) {
    noLoop();
    alert("Morreu! F5 para reiniciar.");
  }
};

const detectarComerComida = () => {
  for (let i = comidas.length - 1; i >= 0; i--) {
    let comida = comidas[i];

    if (pacman.colisao(comida)) {
      if (comida.tipo === "padrao") {
        pontuacao += 10;
      } else {
        pontuacao += 50;
      }

      comidas.splice(i, 1);
      atualizarHUD();
      if (comidas.length === 0) {
        ganharJogo();
      }
    }
  }
};

const gerarMapa = () => {
  paredes = [];
  comidas = [];

  for (let i = 0; i < mapa.length; i++) {
    for (let j = 0; j < mapa[i].length; j++) {
      let valor = mapa[i][j];

      if (valor === 1) {
        let x = j * tamanhoCelula + tamanhoCelula / 2;
        let y = i * tamanhoCelula + tamanhoCelula / 2;
        paredes.push(new Parede(x, y, tamanhoCelula, color(0, 0, 255)));
      } else if (valor === 0) {
        if (
          (i === 3 && j === 1) ||
          (i === 3 && j === 26) || //posi comida maior
          (i === 23 && j === 1) ||
          (i === 23 && j === 26)
        ) {
          comidas.push(new Comida(i, j, "forte"));
        } else if (
          (i >= 12 && i <= 16 && j >= 10 && j <= 17) || // Dentro da caixa
          (i === 26 && j === 13)
        ) {
        } else {
          comidas.push(new Comida(i, j, "padrao"));
        }
      }
    }
  }
};
const resetarPacman = () => {
  pacman.linha = 23;
  pacman.coluna = 13;
  pacman.x = pacman.coluna * tamanhoCelula + tamanhoCelula / 2;
  pacman.y = pacman.linha * tamanhoCelula + tamanhoCelula / 2;
  pacman.vx = 0;
  pacman.vy = 0;
  pacman.direcaoAtual = "NENHUMA";
  pacman.direcaoDesejada = "NENHUMA";
};
const resetarFantasmas = () => {
  fantasmaVermelho.linha = 14;
  fantasmaVermelho.coluna = 13;
  fantasmaVermelho.x =
    fantasmaVermelho.coluna * tamanhoCelula + tamanhoCelula / 2;
  fantasmaVermelho.y =
    fantasmaVermelho.linha * tamanhoCelula + tamanhoCelula / 2;
  fantasmaVermelho.estado = "SPAWNING";
  fantasmaVermelho.vx = -velocidadeFantasma;
  fantasmaVermelho.vy = 0;
  fantasmaVermelho.direcaoAtual = "ESQUERDA";

  fantasmaRosa.linha = 14;
  fantasmaRosa.coluna = 16;
  fantasmaRosa.x = fantasmaRosa.coluna * tamanhoCelula + tamanhoCelula / 2;
  fantasmaRosa.y = fantasmaRosa.linha * tamanhoCelula + tamanhoCelula / 2;
  fantasmaRosa.estado = "SPAWNING";
  fantasmaRosa.vx = -velocidadeFantasma;
  fantasmaRosa.vy = 0;
  fantasmaRosa.direcaoAtual = "ESQUERDA";
};
const atualizarHUD = () => {
  if (scoreElement) {
    scoreElement.innerText = pontuacao;
  }
  if (vidasElement) {
    // garantir que o pm já exista antes de tentar ler a vida dele
    if (pacman) {
      vidasElement.innerText = pacman.vida;
    } else {
      vidasElement.innerText = 3; // valor padrão
    }
  }
};
const ganharJogo = () => {
  noLoop();
  let nome = prompt("VOCÊ VENCEU! Pontuação: " + pontuacao + ". Digite seu nome:");
  let pontos = pontuacao;

  let users = JSON.parse(localStorage.getItem("usuarios") || []);

  users.push({ nome, pontuacao: pontos });

  localStorage.setItem("usuarios", JSON.stringify(users));

  alert("Pontuação salva!");
  console.log(users);

};
