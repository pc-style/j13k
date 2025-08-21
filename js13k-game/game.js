// Quantum Particle Collider - js13k 2025 Entry
// Highly optimized 3D physics engine with quantum mechanics

const c=document.getElementById('c'),ctx=c.getContext('webgl2')||c.getContext('webgl')||c.getContext('experimental-webgl');
if(!ctx)alert('WebGL not supported');

// Optimized shader compilation
const compileShader=(src,type)=>{
const s=ctx.createShader(type);
ctx.shaderSource(s,src);
ctx.compileShader(s);
if(!ctx.getShaderParameter(s,ctx.COMPILE_STATUS))throw new Error(ctx.getShaderInfoLog(s));
return s;
};

// Vertex shader with quantum effects
const vs=compileShader(`
attribute vec3 aPos,aCol,aVel;
uniform mat4 uMVP,uModel;
uniform float uTime,uDim;
varying vec3 vCol,vVel,vPos;
varying float vDim;
void main(){
vPos=aPos;
vCol=aCol;
vVel=aVel;
vDim=uDim;
gl_Position=uMVP*vec4(aPos,1.0);
gl_PointSize=max(2.0,length(aVel)*3.0);
}`,ctx.VERTEX_SHADER);

// Fragment shader with quantum tunneling effect
const fs=compileShader(`
precision mediump float;
varying vec3 vCol,vVel,vPos;
varying float vDim;
uniform float uTime;
void main(){
float d=length(gl_PointCoord-vec2(0.5));
if(d>0.5)discard;
vec3 col=vCol;
float alpha=1.0-d*2.0;
float quantum=sin(uTime*2.0+vPos.x*10.0)*0.5+0.5;
col+=vec3(quantum*0.3,0,quantum*0.5);
gl_FragColor=vec4(col,alpha*0.8);
}`,ctx.FRAGMENT_SHADER);

// Program and attributes
const prog=ctx.createProgram();
ctx.attachShader(prog,vs);
ctx.attachShader(prog,fs);
ctx.linkProgram(prog);
if(!ctx.getProgramParameter(prog,ctx.LINK_STATUS))throw new Error(ctx.getLinkProgramInfoLog(prog));

ctx.useProgram(prog);
const aPos=ctx.getAttribLocation(prog,'aPos'),aCol=ctx.getAttribLocation(prog,'aCol'),aVel=ctx.getAttribLocation(prog,'aVel');
const uMVP=ctx.getUniformLocation(prog,'uMVP'),uModel=ctx.getUniformLocation(prog,'uModel'),uTime=ctx.getUniformLocation(prog,'uTime'),uDim=ctx.getUniformLocation(prog,'uDim');

// Matrix operations (optimized)
const m4={};
m4.identity=()=>new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
m4.translate=(m,x,y,z)=>{m[12]+=m[0]*x+m[4]*y+m[8]*z;m[13]+=m[1]*x+m[5]*y+m[9]*z;m[14]+=m[2]*x+m[6]*y+m[10]*z;m[15]+=m[3]*x+m[7]*y+m[11]*z;return m};
m4.rotateY=(m,angle)=>{const c=Math.cos(angle),s=Math.sin(angle),m0=m[0],m1=m[1],m2=m[2],m3=m[3],m4=m[4],m5=m[5],m6=m[6],m7=m[7];m[0]=m0*c-m8*s;m[1]=m1*c-m9*s;m[2]=m2*c-m10*s;m[3]=m3*c-m11*s;m[4]=m4*c-m12*s;m[5]=m5*c-m13*s;m[6]=m6*c-m14*s;m[7]=m7*c-m15*s;return m};
m4.rotateX=(m,angle)=>{const c=Math.cos(angle),s=Math.sin(angle),m4=m[4],m5=m[5],m6=m[6],m7=m[7],m8=m[8],m9=m[9],m10=m[10],m11=m[11];m[4]=m4*c+m8*s;m[5]=m5*c+m9*s;m[6]=m6*c+m10*s;m[7]=m7*c+m11*s;m[8]=-m4*s+m8*c;m[9]=-m5*s+m9*c;m[10]=-m6*s+m10*c;m[11]=-m7*s+m11*c;return m};
m4.perspective=(fov,aspect,near,far)=>{const f=1/Math.tan(fov*Math.PI/360);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)/(near-far),-1,0,0,2*far*near/(near-far),0])};
m4.multiply=(a,b)=>{const r=new Float32Array(16);for(let i=0;i<4;i++)for(let j=0;j<4;j++){let sum=0;for(let k=0;k<4;k++)sum+=a[i*4+k]*b[k*4+j];r[i*4+j]=sum}return r};

// Quantum particle system
class QuantumParticle{
constructor(x,y,z,vx,vy,vz,charge=1,mass=1,quantumState=0){
this.x=x;this.y=y;this.z=z;this.vx=vx;this.vy=vy;this.vz=vz;
this.charge=charge;this.mass=mass;this.quantumState=quantumState;
this.life=1.0;this.entangled=null;this.tunneled=false;
this.color=[0.5+charge*0.5,0.3+Math.abs(charge)*0.4,1.0-charge*0.3];
}
update(dt,gravity,particles,field){
// Quantum tunneling probability
if(Math.random()<0.001*dt)this.tunneled=!this.tunneled;
if(this.tunneled)return;

// Classical physics with quantum corrections
this.vy-=gravity*dt*this.mass;
this.x+=this.vx*dt;this.y+=this.vy*dt;this.z+=this.vz*dt;

// Quantum entanglement effects
if(this.entangled){
const dx=this.x-this.entangled.x,dy=this.y-this.entangled.y,dz=this.z-this.entangled.z;
const dist=Math.sqrt(dx*dx+dy*dy+dz*dz);
if(dist>10)this.entangled=null;
}

// Particle interactions
particles.forEach(p=>{
if(p===this)return;
const dx=p.x-this.x,dy=p.y-this.y,dz=p.z-this.z;
const dist=Math.sqrt(dx*dx+dy*dy+dz*dz);
if(dist<2){
const force=this.charge*p.charge/(dist*dist+0.1);
const fx=dx/dist*force,fy=dy/dist*force,fz=dz/dist*force;
this.vx+=fx*dt/this.mass;this.vy+=fy*dt/this.mass;this.vz+=fz*dt/this.mass;
p.vx-=fx*dt/p.mass;p.vy-=fy*dt/p.mass;p.vz-=fz*dt/p.mass;
}
});

// Boundary conditions with quantum reflection
if(Math.abs(this.x)>20)this.vx*=-0.8;
if(Math.abs(this.y)>20)this.vy*=-0.8;
if(Math.abs(this.z)>20)this.vz*=-0.8;

// Energy loss
this.life-=0.001*dt;
}
}

// Quantum field generator
class QuantumField{
constructor(type='magnetic'){
this.type=type;this.strength=1.0;this.center=[0,0,0];this.radius=15;
}
getForce(x,y,z){
const dx=x-this.center[0],dy=y-this.center[1],dz=z-this.center[2];
const dist=Math.sqrt(dx*dx+dy*dy+dz*dz);
if(dist>this.radius)return[0,0,0];
const force=this.strength/(dist+0.1);
if(this.type==='magnetic')return[-dy*force,dx*force,0];
if(this.type==='electric')return[dx*force,dy*force,dz*force];
return[0,0,0];
}
}

// Level system
const levels=[
{particles:5,field:'magnetic',gravity:0.3,goal:'Create 3 entangled pairs'},
{particles:8,field:'electric',gravity:0.5,goal:'Achieve quantum coherence'},
{particles:12,field:'magnetic',gravity:0.7,goal:'Form stable quantum cluster'},
{particles:15,field:'electric',gravity:1.0,goal:'Quantum teleportation'},
{particles:20,field:'magnetic',gravity:1.2,goal:'Master quantum chaos'}
];

// Game state
let gameState={level:0,particles:[],fields:[],camera:{x:0,y:0,z:30,rx:0,ry:0},paused:false,dimension:3,time:0,energy:100};
let keys={},mouse={x:0,y:0,down:false},lastTime=0;

// Initialize level
function initLevel(levelIndex){
const level=levels[levelIndex];
gameState.particles=[];
gameState.fields=[];
gameState.energy=100;
gameState.time=0;

// Create quantum field
gameState.fields.push(new QuantumField(level.field));

// Create particles with quantum properties
for(let i=0;i<level.particles;i++){
const angle=(i/level.particles)*Math.PI*2;
const x=Math.cos(angle)*10,y=Math.sin(angle)*5,z=Math.sin(angle*2)*3;
const vx=Math.sin(angle)*2,vy=Math.cos(angle)*1,vz=Math.sin(angle*3)*0.5;
const charge=Math.random()>0.5?1:-1;
const mass=0.5+Math.random()*1.5;
gameState.particles.push(new QuantumParticle(x,y,z,vx,vy,vz,charge,mass,i%3));
}

// Update UI
document.getElementById('levelNum').textContent=levelIndex+1;
document.getElementById('gravity').value=level.gravity;
}

// Input handling
document.addEventListener('keydown',e=>keys[e.code]=true);
document.addEventListener('keyup',e=>keys[e.code]=false);
document.addEventListener('mousedown',e=>{mouse.down=true;mouse.x=e.clientX;mouse.y=e.clientY});
document.addEventListener('mouseup',e=>mouse.down=false);
document.addEventListener('mousemove',e=>{
if(mouse.down){
gameState.camera.rx+=(e.clientY-mouse.y)*0.01;
gameState.camera.ry+=(e.clientX-mouse.x)*0.01;
mouse.x=e.clientX;mouse.y=e.clientY;
}
});

// UI controls
document.getElementById('toggleDim').onclick=()=>{
gameState.dimension=gameState.dimension===3?2:3;
document.getElementById('dimension').textContent=gameState.dimension+'D';
};
document.getElementById('reset').onclick=()=>initLevel(gameState.level);
document.getElementById('gravity').oninput=e=>gameState.gravity=parseFloat(e.target.value);
document.getElementById('timeScale').oninput=e=>gameState.timeScale=parseFloat(e.target.value);

// Main game loop
function gameLoop(currentTime){
const dt=(currentTime-lastTime)*0.001*gameState.timeScale;
lastTime=currentTime;
gameState.time+=dt;

if(!gameState.paused){
// Update particles
gameState.particles.forEach(p=>p.update(dt,gameState.gravity,gameState.particles,gameState.fields[0]));

// Apply quantum fields
gameState.particles.forEach(p=>{
const force=gameState.fields[0].getForce(p.x,p.y,p.z);
p.vx+=force[0]*dt/p.mass;p.vy+=force[1]*dt/p.mass;p.vz+=force[2]*dt/p.mass;
});

// Remove dead particles
gameState.particles=gameState.particles.filter(p=>p.life>0);

// Check level completion
if(checkLevelComplete())showLevelComplete();
}

// Handle input
if(keys['KeyW'])gameState.camera.z-=dt*20;
if(keys['KeyS'])gameState.camera.z+=dt*20;
if(keys['KeyA'])gameState.camera.x-=dt*20;
if(keys['KeyD'])gameState.camera.x+=dt*20;
if(keys['KeyR']){gameState.camera.x=0;gameState.camera.y=0;gameState.camera.z=30;gameState.camera.rx=0;gameState.camera.ry=0;}
if(keys['Space']){gameState.paused=!gameState.paused;}
if(keys['KeyQ']){quantumJump();}

// Render
render();

// Update UI
document.getElementById('particleCount').textContent=gameState.particles.length;
document.getElementById('energy').textContent=Math.floor(gameState.energy);

requestAnimationFrame(gameLoop);
}

// Quantum jump mechanic
function quantumJump(){
if(gameState.energy<20)return;
gameState.energy-=20;
gameState.particles.forEach(p=>{
if(Math.random()<0.3){
p.x+=(Math.random()-0.5)*10;
p.y+=(Math.random()-0.5)*10;
p.z+=(Math.random()-0.5)*10;
p.quantumState=(p.quantumState+1)%3;
}
});
}

// Check level completion
function checkLevelComplete(){
const level=levels[gameState.level];
if(gameState.particles.length<level.particles*0.7)return false;
if(gameState.energy<20)return false;
return true;
}

// Show level complete
function showLevelComplete(){
const level=levels[gameState.level];
document.getElementById('levelStats').textContent=`Particles: ${gameState.particles.length}/${level.particles} | Energy: ${gameState.energy}`;
document.getElementById('level').classList.add('show');
}

// Event listeners for level completion
document.getElementById('nextLevel').onclick=()=>{
document.getElementById('level').classList.remove('show');
if(gameState.level<levels.length-1){
gameState.level++;
initLevel(gameState.level);
}else{
alert('Congratulations! You completed all levels!');
gameState.level=0;
initLevel(0);
}
};

document.getElementById('restart').onclick=()=>{
document.getElementById('level').classList.remove('show');
gameState.level=0;
initLevel(0);
};

// Render function
function render(){
ctx.clearColor(0.1,0.1,0.2,1);
ctx.clear(ctx.COLOR_BUFFER_BIT);
ctx.enable(ctx.BLEND);
ctx.blendFunc(ctx.SRC_ALPHA,ctx.ONE_MINUS_SRC_ALPHA);

// Camera matrix
const view=m4.identity();
m4.translate(view,gameState.camera.x,gameState.camera.y,gameState.camera.z);
m4.rotateY(view,gameState.camera.ry);
m4.rotateX(view,gameState.camera.rx);

// Projection matrix
const proj=m4.perspective(60,c.width/c.height,0.1,1000);
const mvp=m4.multiply(proj,view);

// Update uniforms
ctx.uniformMatrix4fv(uMVP,false,mvp);
ctx.uniform1f(uTime,gameState.time);
ctx.uniform1f(uDim,gameState.dimension);

// Create vertex data
const positions=[],colors=[],velocities=[];
gameState.particles.forEach(p=>{
positions.push(p.x,p.y,p.z);
colors.push(p.color[0],p.color[1],p.color[2]);
velocities.push(p.vx,p.vy,p.vz);
});

// Create buffers
const posBuf=ctx.createBuffer();
ctx.bindBuffer(ctx.ARRAY_BUFFER,posBuf);
ctx.bufferData(ctx.ARRAY_BUFFER,new Float32Array(positions),ctx.DYNAMIC_DRAW);
ctx.enableVertexAttribArray(aPos);
ctx.vertexAttribPointer(aPos,3,ctx.FLOAT,false,0,0);

const colBuf=ctx.createBuffer();
ctx.bindBuffer(ctx.ARRAY_BUFFER,colBuf);
ctx.bufferData(ctx.ARRAY_BUFFER,new Float32Array(colors),ctx.DYNAMIC_DRAW);
ctx.enableVertexAttribArray(aCol);
ctx.vertexAttribPointer(aCol,3,ctx.FLOAT,false,0,0);

const velBuf=ctx.createBuffer();
ctx.bindBuffer(ctx.ARRAY_BUFFER,velBuf);
ctx.bufferData(ctx.ARRAY_BUFFER,new Float32Array(velocities),ctx.DYNAMIC_DRAW);
ctx.enableVertexAttribArray(aVel);
ctx.vertexAttribPointer(aVel,3,ctx.FLOAT,false,0,0);

// Draw particles
ctx.drawArrays(ctx.POINTS,0,gameState.particles.length);

// Clean up
ctx.deleteBuffer(posBuf);
ctx.deleteBuffer(colBuf);
ctx.deleteBuffer(velBuf);
}

// Resize handler
function resize(){
c.width=window.innerWidth;
c.height=window.innerHeight;
ctx.viewport(0,0,c.width,c.height);
}

window.addEventListener('resize',resize);
resize();

// Initialize and start
initLevel(0);
requestAnimationFrame(gameLoop);