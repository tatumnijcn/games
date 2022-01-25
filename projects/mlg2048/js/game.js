import{Observable}from"./misc.js";import*as Random from"./random.js";let _idEnum=0;class Board{constructor(r){this.grid=r||Array.from({length:4},(()=>Array.from({length:4},(()=>({val:0})))))}flat(){return this.grid.reduce(((r,t,i)=>t.reduce(((r,t,e)=>r.concat([{x:e,y:i,val:t.val,id:t.id,merged:t.merged}])),r)),[])}count(r){return this.flat().filter((t=>t.val==r))}equals(r){return this.grid.every(((t,i)=>t.every(((t,e)=>r.grid[i][e].val==t.val))))}clone(){return new Board(this.grid.map((r=>r.map((r=>r)))))}rotate(r){switch((r+360)%360){case 0:return this.clone();case 90:return new Board([[this.grid[0][3],this.grid[1][3],this.grid[2][3],this.grid[3][3]],[this.grid[0][2],this.grid[1][2],this.grid[2][2],this.grid[3][2]],[this.grid[0][1],this.grid[1][1],this.grid[2][1],this.grid[3][1]],[this.grid[0][0],this.grid[1][0],this.grid[2][0],this.grid[3][0]]]);case 180:return new Board(this.grid.map((r=>r.reverse())).reverse());case 270:return this.rotate(90).rotate(180);default:throw new Error(`Can not rotate board by ${r}deg`)}}shift(){return new Board(this.grid.map((r=>{const[t]=r.filter((r=>0!==r.val)).reduce((([r,t],i,e)=>r.length?r[r.length-1].val!=i.val||t?[r.concat([i]),!1]:[r.slice(0,r.length-1).concat([{val:2*i.val,id:++_idEnum,merged:[r[r.length-1].id,i.id]}]),!0]:[[i],!1]),[[],!1]);return t.concat(Array.from({length:4-t.length},(()=>({val:0}))))})))}}export class Game extends Observable{constructor(){super(),this.board=new Board;for(let r=0;r<2;r++){const r=Random.pick(this.board.count(0));this.board.grid[r.y][r.x]={val:2,id:++_idEnum}}}move(r){const t="left"==r?0:"up"==r?90:"right"==r?180:"down"==r?270:-1;if(-1==t)throw new Error(`Unknown direction ${r}`);const i=this.board.clone();if(this.board=this.board.rotate(t).shift().rotate(-t),i.equals(this.board))return;const e=Random.pick(this.board.count(0));this.board.grid[e.y][e.x]={val:Random.pick([2,4]),id:++_idEnum},this.trigger("move",{oldBoard:i,newBoard:this.board,diff:{add:this.board.flat().filter((r=>!i.flat().some((t=>r.id==t.id)))),rem:i.flat().filter((r=>!this.board.flat().some((t=>r.id==t.id))))}}),this.board.count(0).length||[0,90,180,270].some((r=>this.board.rotate(r).shift().count(0).length>0))||this.trigger("lose",{score:this.score(),highestCell:this.board.flat().reduce(((r,t)=>Math.max(t.val,r)),0)}),this.board.count(2048).length&&this.trigger("win")}score(){return this.board.flat().filter((r=>r.val>2)).reduce(((r,t)=>r+t.val*Math.log2(t.val>>1)),0)}}
