import {test} from 'node:test';
import assert from 'node:assert/strict';
import {makeMaze,movePlayer,CELL} from '../maze.js';
for(let chapter=0;chapter<3;chapter++){
 test(`Chapter ${chapter+1}: every cell, objective and collectible is reachable`,()=>{const m=makeMaze(chapter);for(let p of m.cells){let route=m.path(m.start,p.id);assert.equal(route[0],m.start);assert.equal(route.at(-1),p.id);for(let i=1;i<route.length;i++)assert(m.cells[route[i-1]].links.includes(route[i]));}assert.equal(m.altars.length,3);assert.equal(m.items.length,15);assert.equal(new Set([...m.altars,...m.items].map(a=>a.cell)).size,18);});
 test(`Chapter ${chapter+1}: wall collision blocks even large movement deltas`,()=>{const m=makeMaze(chapter);let wall=m.walls.find(w=>w.horizontal&&w.z>0&&w.z<m.n-1),x=(wall.x-(m.n-1)/2)*CELL,z=(wall.z-(m.n-1)/2)*CELL;let p={x,z:z-1};movePlayer(m,p,0,3);assert(p.z<z-.45);assert(m.canStand(p.x,p.z));});
 test(`Chapter ${chapter+1}: openings permit continuous travel in both directions`,()=>{const m=makeMaze(chapter);let a=m.cells.find(p=>p.id!==m.center&&p.links.some(i=>i!==m.center&&i===p.id+1));let b=a.links.find(i=>i===a.id+1);const p=m.world(a.id),target=m.world(b);assert(m.canStand(p.x,p.z));movePlayer(m,p,target.x-p.x,0);assert(Math.abs(p.x-target.x)<.0001);});
 test(`Chapter ${chapter+1}: generation is deterministic`,()=>assert.deepEqual(makeMaze(chapter).cells,makeMaze(chapter).cells));
}
