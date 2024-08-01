/*
  <Minesweeper.>
  Copyright (C) <2024>  <Robyy54>

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

let field = [];
let mask = [];
const scale = 40;
const fieldH = 10;
const fieldW = 20;

const mine_block = 9;

let off;
let on;
let mine;
let flag;
let one;
let two;
let three;
let four;
let five;
let six;
let seven;
let eight;

function preload(){
  off = loadImage("sprites/off.png");
  on = loadImage("sprites/on.png");
  mine = loadImage("sprites/mine.png");
  flag = loadImage("sprites/flag.png");
  one = loadImage("sprites/one.png");
  two = loadImage('sprites/two.png');
  three = loadImage('sprites/three.png');
  four = loadImage('sprites/four.png');
  five = loadImage('sprites/five.png');
  six = loadImage('sprites/six.png');
  seven = loadImage('sprites/seven.png');
  eight = loadImage('sprites/eight.png');
}

function setup(){
  let canvas = createCanvas(fieldW*scale, fieldH*scale);
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);

  canvas.elt.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });
  noSmooth();
  for(let i=0; i<fieldH; i++){
    field[i] = [];
    mask[i] = [];
    for(let j=0; j<fieldW; j++){
      field[i][j] = 0;
      mask[i][j] = 0;
    }
  }
  generateMines(20);
  enumerate();
}

function draw(){
  for(let i=0; i<field.length; i++){
    for(let j=0; j<field[i].length; j++){
      if(mask[i][j] == 0)
        image(off, j*scale, i*scale, scale, scale);
      else if(mask[i][j] == 1)
        show(i, j);
      else if(mask[i][j] == 2)
        image(flag, j*scale, i*scale, scale, scale);
    }
  }
}

function show(x, y){
  switch(field[x][y]){
    case 0:
      image(on, y*scale, x*scale, scale, scale);
      break;
    case 1:
      image(one, y*scale, x*scale, scale, scale);
      break;
    case 2:
      image(two, y*scale, x*scale, scale, scale);
      break;
    case 3:
      image(three, y*scale, x*scale, scale, scale);
      break;
    case 4:
      image(four, y*scale, x*scale, scale, scale);
      break;
    case 5:
      image(five, y*scale, x*scale, scale, scale);
      break;
    case 6:
      image(six, y*scale, x*scale, scale, scale);
      break;
    case 7:
      image(seven, y*scale, x*scale, scale, scale);
      break;
    case 8:
      image(eight, y*scale, x*scale, scale, scale);
      break;
    case 9:
      image(mine, y*scale, x*scale, scale, scale);
      break;
  }
}

function mousePressed(){
  var x = floor(mouseX/scale);
  var y = floor(mouseY/scale);
  if(mouseButton == LEFT && mask[y][x] != 2){
    if(field[y][x] == mine_block)
      setup();
    else
      revelate(y, x);
  }
  else if(mouseButton == RIGHT){
    if(mask[y][x] == 2)
      mask[y][x] = 0;
    else if(mask[y][x] == 0)
      mask[y][x] = 2;
  }
}

function generateMines(num){
  for(let i = 0; i < num; i++){
    let x = floor(random(0, fieldW));
    let y = floor(random(0, fieldH));
    if(field[y][x] == mine_block)
      i--;
    else
      field[y][x] = mine_block;
  }
}

function enumerate(){
  for(let i = 0; i < field.length; i++){
    for(let j = 0; j < field[i].length; j++){
      let od = 1, or = 1;
      let ol = -1, ou = -1;
      if(field[i][j] != mine_block){
        if(j == 0){
          ol = 0;
        }
        else if(j == fieldW-1){
          or = 0;
        }
        if(i == 0){
          ou = 0;
        }
        else if(i == fieldH-1){
          od = 0;
        }
        rounded(j, i, ou, od, ol, or);
      }
    }
  }
}

function rounded(x, y, ou, od, ol, or){
  for(let i = ou; i <= od; i++){
    for(let j = ol ; j <= or; j++){
      if(field[y+i][x+j] == mine_block){
        field[y][x]++;
      }
    }
  }
}

function revelate(y, x){
  if(mask[y][x] === 0 && field[y][x] === 0){
    mask[y][x] = 1;
    if(x-1 > -1 && field[y][x-1] != mine_block){
      if(field[y][x-1] === 0)
        revelate(y, x-1);
      else
      mask[y][x-1] = 1;
    }
    if(y+1 < fieldH && field[y+1][x] != mine_block){
      if(field[y+1][x] === 0)
        revelate(y+1, x);
      else
      mask[y+1][x] = 1;
    }
    if(x+1 < fieldW && field[y][x+1] != mine_block){
      if(field[y][x+1] === 0)
        revelate(y, x+1);
      else
      mask[y][x+1] = 1;
    }
    if(y-1 > -1 && field[y-1][x] != mine_block){
      if(field[y-1][x] === 0)
        revelate(y-1, x);
      else
      mask[y-1][x] = 1;
    }
    if(x-1 > -1 && y+1 < fieldH && field[y+1][x-1] != mine_block && field[y+1][x-1] != 0)
      mask[y+1][x-1] = 1;
    if(x-1 > -1 && y-1 > -1 && field[y-1][x-1] != mine_block && field[y-1][x-1] != 0)
      mask[y-1][x-1] = 1;
    if(x+1 < fieldW && y+1 < fieldH && field[y+1][x+1] != mine_block && field[y+1][x+1] != 0)
      mask[y+1][x+1] = 1;
    if(x+1 < field && y-1 > -1 && field[y-1][x+1] != mine_block && field[y-1][x+1] != 0)
      mask[y-1][x+1] = 1;
  }
  else if(mask[y][x] === 0 && field[y][x] != mine_block){
    mask[y][x] = 1;
  }
}