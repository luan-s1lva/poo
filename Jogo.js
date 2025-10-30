function preload() {

}

function setup() {
    createCanvas(500, 500);
    background(0, 0, 0);
    pacman = new Packman(250, 250, color(255, 0, 0), 30);
    ent2 = new Entidade(100, 200, color(255, 255, 0), 30);
}
function draw() {
    background(0)
    pacman.desenhar();
    ent2.desenhar();

    pacman.mover();
    moverPackman();
    detectarColisao();
    detectarMorte();

}
const moverPackman = () => {
    if (keyIsDown(UP_ARROW)) {
        pacman.y -= 10;
    }
    if (keyIsDown(DOWN_ARROW)) {
        pacman.y += 10;
    }
    if (keyIsDown(LEFT_ARROW)) {
        pacman.x -= 10;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        pacman.x += 10;
    }
}

const detectarColisao = () => {
    if (pacman.colisao(ent2)) {
        pacman.x = 250;
        pacman.y = 250;
        pacman.vida -= 1;
        console.log(pacman.vida)
    }
}

const detectarMorte = () => {
    if (pacman.vida == 0) {
       alert("morreu F5")
    }
}