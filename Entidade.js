class Entidade {
    constructor(x,y,cor,tamanho){
        this.x = x;
        this.y = y;
        this.cor = cor;
        this.tamanho = tamanho;
        this.velocX = 0;
        this.velocY = 0;
    }
    mover(){
        this.x += this.velocX;
        this.y+= this.velocY;
        this.x = constrain(this.x, this.tamanho / 2, width - this.tamanho / 2);
        this.y = constrain(this.y, this.tamanho / 2, height - this.tamanho / 2);
    }
    desenhar(){
        fill(this.cor)
        circle(this.x,this.y,this.tamanho)
    }
    colisao(alvo){
        let dis = dist(this.x,this.y,alvo.x,alvo.y)
        return dis < (this.tamanho / 2 + alvo.tamanho / 2);
    }
}