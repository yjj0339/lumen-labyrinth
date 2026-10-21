export const CHAPTERS=[
 {name:'晨曦花园',en:'THE GARDEN OF DAWN',tag:'01 / 花开之地',n:11,seed:7214,wall:'#e5e1ce',accent:'#8fbca8',flower:'#ebbecb',sky:'#e3edf0',story:'风穿过白色回廊，花园正在等待一位新的访客。寻回三枚光印，让沉睡的昼光之门重新开启。'},
 {name:'琉璃水庭',en:'THE COURT OF TIDES',tag:'02 / 水的记忆',n:13,seed:4179,wall:'#d7e6e3',accent:'#7bb9c6',flower:'#c4c8ed',sky:'#dcecf1',story:'潮声被封存在石墙之间。跟随水纹与回响，修复水庭的三座共鸣台，抵达更高的天空。'},
 {name:'云上圣所',en:'THE SANCTUARY ABOVE',tag:'03 / 逐光而行',n:15,seed:9081,wall:'#e6ded9',accent:'#c5ab7c',flower:'#eed7ad',sky:'#ede8e3',story:'所有走过的路，都在这里汇成一束光。最后三枚光印正等待被唤醒，属于你的花园将在云海之上绽放。'}
];
export const CELL=4.6;
export const DIRS=[[0,-1],[1,0],[0,1],[-1,0]];
export function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
export function makeMaze(chapter){
 const c=CHAPTERS[chapter],n=c.n,random=rng(c.seed),cells=Array.from({length:n*n},(_,id)=>({id,x:id%n,z:Math.floor(id/n),links:[],seen:false}));
 const connect=(a,b)=>{if(!cells[a].links.includes(b))cells[a].links.push(b);if(!cells[b].links.includes(a))cells[b].links.push(a);};
 const stack=[0],visited=new Set(stack);
 while(stack.length){let a=stack.at(-1),p=cells[a],ns=DIRS.map(([x,z])=>[p.x+x,p.z+z]).filter(([x,z])=>x>=0&&z>=0&&x<n&&z<n).map(([x,z])=>z*n+x).filter(i=>!visited.has(i));if(!ns.length){stack.pop();continue;}let b=ns[Math.floor(random()*ns.length)];connect(a,b);visited.add(b);stack.push(b);}
 const court=(x,z,w,h)=>{for(let j=z;j<z+h;j++)for(let i=x;i<x+w;i++){if(i<x+w-1)connect(j*n+i,j*n+i+1);if(j<z+h-1)connect(j*n+i,(j+1)*n+i);}};
 court(0,n-3,3,3);court(Math.floor(n/2)-1,Math.floor(n/2)-1,3,3);court(n-3,0,3,3);
 for(const p of cells)for(const [dx,dz]of [[1,0],[0,1]]){let x=p.x+dx,z=p.z+dz;if(x<n&&z<n&&random()<.08)connect(p.id,z*n+x);}
 const start=(n-2)*n+1,end=n-2,center=Math.floor(n/2)*n+Math.floor(n/2);
 const path=(from,to)=>{let queue=[from],prev=new Map([[from,-1]]);for(let i=0;i<queue.length;i++){let a=queue[i];if(a===to)break;for(let b of cells[a].links)if(!prev.has(b)){prev.set(b,a);queue.push(b);}}if(!prev.has(to))return[];let p=[],a=to;while(a!==-1){p.unshift(a);a=prev.get(a);}return p;};
 const forbidden=new Set([start,end,center]);
 const candidates=cells.filter(p=>p.x>0&&p.x<n-1&&p.z>0&&p.z<n-1&&!((p.x<3&&p.z>=n-3)||(p.x>=n-3&&p.z<3)||(Math.abs(p.x-n/2)<2&&Math.abs(p.z-n/2)<2)));
 const far=(from,filter=()=>true)=>candidates.filter(p=>!forbidden.has(p.id)&&filter(p)).sort((a,b)=>path(from,b.id).length-path(from,a.id).length)[0];
 const altars=[];
 for(let i=0;i<3;i++){let p=far(i?altars[i-1].cell:start,p=>i===0?p.x<n/2:i===1?p.z<n/2:true)||far(start);forbidden.add(p.id);altars.push({id:'altar'+i,cell:p.id,type:i,solved:false,name:['花园光轮','花语回响','星轨平衡'][i]});}
 const items=[];
 for(let i=0;i<15;i++){let p=candidates[Math.floor(random()*candidates.length)];while(forbidden.has(p.id))p=candidates[Math.floor(random()*candidates.length)];forbidden.add(p.id);items.push({id:'item'+i,cell:p.id,type:i<9?'crystal':i<12?'note':'beacon',collected:false,index:i<12?i-9:i-12});}
 const walls=[];
 for(const p of cells){if(p.z===0)walls.push({x:p.x,z:p.z-.5,horizontal:true});if(p.x===0)walls.push({x:p.x-.5,z:p.z,horizontal:false});if(p.z===n-1||!p.links.includes(p.id+n))walls.push({x:p.x,z:p.z+.5,horizontal:true});if(p.x===n-1||!p.links.includes(p.id+1))walls.push({x:p.x+.5,z:p.z,horizontal:false});}
 const world=id=>({x:(cells[id].x-(n-1)/2)*CELL,z:(cells[id].z-(n-1)/2)*CELL});
 const cellAt=(x,z)=>{let i=Math.floor(x/CELL+n/2),j=Math.floor(z/CELL+n/2);return i<0||j<0||i>=n||j>=n?-1:j*n+i;};
 const canStand=(x,z,r=.31)=>{const half=n*CELL/2;if(Math.abs(x)>half-r||Math.abs(z)>half-r)return false;for(const w of walls){let wx=(w.x-(n-1)/2)*CELL,wz=(w.z-(n-1)/2)*CELL,dx=w.horizontal?CELL/2+.15:.19,dz=w.horizontal?.19:CELL/2+.15;if(x>wx-dx-r&&x<wx+dx+r&&z>wz-dz-r&&z<wz+dz+r)return false;}const cp=world(center);if(Math.hypot(x-cp.x,z-cp.z)<1.35+r)return false;return true;};
 return {chapter,n,cells,start,end,center,altars,items,walls,world,cellAt,path,canStand};
}
export function movePlayer(maze,p,dx,dz){const steps=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.15));for(let i=0;i<steps;i++){if(maze.canStand(p.x+dx/steps,p.z))p.x+=dx/steps;if(maze.canStand(p.x,p.z+dz/steps))p.z+=dz/steps;}return p;}
