// AUTO-EXPAND THE SKILL MAP FOR THE MASSIVE TREE
document.getElementById('map-content').style.width = '2000px';
document.getElementById('map-content').style.height = '2000px';
document.getElementById('skill-lines').width = 2000;
document.getElementById('skill-lines').height = 2000;

/**
 * MASSIVE METAPROGRESSION SYSTEM
 */
let saveData = { wrenches: 0, unlocked: ['node_base'], maxLevel: 1 };
let selectedCheckpoint = 1;

// 2000x2000 Map Coordinates (Center is 1000,1000)
const SKILL_TREE = {
    'node_base': { x: 1000, y: 1000, name: 'Apprentice', cost: 0, req: null, desc: 'Ready to work.', type: 'core' },
    
    // --- AGILITY BRANCH (Top Left) ---
    'agi_1': { x: 875, y: 875, name: 'Light Hammer', cost: 5, req: 'node_base', desc: 'Fix windows 10% faster.', type: 'normal' },
    'agi_2': { x: 750, y: 750, name: 'Quick Step', cost: 15, req: 'agi_1', desc: 'Fix windows 20% faster.', type: 'normal' },
    'agi_hand': { x: 625, y: 625, name: 'Coffee Break', cost: 40, req: 'agi_2', desc: 'Fix windows 40% faster.', type: 'notable' },
    
    // Agility Fork A (Dodge)
    'agi_ev1': { x: 750, y: 500, name: 'Lucky Shoes', cost: 30, req: 'agi_hand', desc: '5% chance to dodge any falling object.', type: 'normal' },
    'agi_gst': { x: 875, y: 375, name: 'Ghost Step', cost: 80, req: 'agi_ev1', desc: '15% chance to dodge any falling object.', type: 'notable' },
    
    // Agility Fork B (Crit Fix)
    'agi_ch1': { x: 500, y: 750, name: 'Good Swing', cost: 30, req: 'agi_hand', desc: '5% chance to fix a fully broken window in 1 hit.', type: 'normal' },
    'agi_mst': { x: 375, y: 875, name: 'Master Builder', cost: 80, req: 'agi_ch1', desc: '15% chance to fix a fully broken window in 1 hit.', type: 'notable' },
    
    // Agility Main Path
    'agi_3': { x: 500, y: 500, name: 'Adrenaline', cost: 100, req: 'agi_hand', desc: 'Increases Invincibility frames by 1 second.', type: 'normal' },
    'agi_ninj': { x: 375, y: 375, name: 'Felix Ninja', cost: 300, req: 'agi_3', desc: '+30% Dodge Chance, +25% 1-Hit Fix Chance.', type: 'keystone' },

    // --- TANK BRANCH (Top Right) ---
    'tnk_1': { x: 1125, y: 875, name: 'Thick Gloves', cost: 5, req: 'node_base', desc: '+10 Max HP.', type: 'normal' },
    'tnk_2': { x: 1250, y: 750, name: 'Steel Toes', cost: 15, req: 'tnk_1', desc: '+15 Max HP.', type: 'normal' },
    'tnk_hat': { x: 1375, y: 625, name: 'Hard Hat', cost: 40, req: 'tnk_2', desc: '+50 Max HP.', type: 'notable' },
    
    // Tank Fork A (Shield)
    'tnk_sh1': { x: 1250, y: 500, name: 'Battery Pack', cost: 30, req: 'tnk_hat', desc: '+20 Max HP.', type: 'normal' },
    'tnk_vst': { x: 1125, y: 375, name: 'Kevlar Vest', cost: 80, req: 'tnk_sh1', desc: 'Energy shield absorbs the first hit of every level.', type: 'notable' },
    
    // Tank Fork B (Regen)
    'tnk_rg1': { x: 1500, y: 750, name: 'First Aid', cost: 30, req: 'tnk_hat', desc: '+20 Max HP.', type: 'normal' },
    'tnk_med': { x: 1625, y: 875, name: 'Paramedic', cost: 80, req: 'tnk_rg1', desc: 'Heal 10% of Max HP upon clearing a level.', type: 'notable' },
    
    // Tank Main Path
    'tnk_3': { x: 1500, y: 500, name: 'Iron Will', cost: 100, req: 'tnk_hat', desc: '+40 Max HP.', type: 'normal' },
    'tnk_osh': { x: 1625, y: 375, name: 'OSHA Boss', cost: 300, req: 'tnk_3', desc: '+150 Max HP. Incoming damage reduced by 5.', type: 'keystone' },

    // --- ECONOMY BRANCH (Bottom) ---
    'eco_1': { x: 1000, y: 1150, name: 'Union Dues', cost: 5, req: 'node_base', desc: 'Base score increased by +10%.', type: 'normal' },
    'eco_2': { x: 1000, y: 1300, name: 'Pensions', cost: 15, req: 'eco_1', desc: 'Base score increased by +20%.', type: 'normal' },
    'eco_uni': { x: 1000, y: 1450, name: 'Foreman', cost: 40, req: 'eco_2', desc: 'Base score increased by +50%.', type: 'notable' },
    
    // Economy Fork A (Wrenches)
    'eco_wr1': { x: 850, y: 1450, name: 'Shiny Metal', cost: 30, req: 'eco_uni', desc: 'Earn 1 Wrench per 80 pts instead of 100.', type: 'normal' },
    'eco_ham': { x: 700, y: 1450, name: 'Golden Hammer', cost: 80, req: 'eco_wr1', desc: 'Earn 1 Wrench per 50 pts.', type: 'notable' },
    
    // Economy Fork B (Armor)
    'eco_ar1': { x: 1150, y: 1450, name: 'Padded Shirt', cost: 30, req: 'eco_uni', desc: 'Take 5 less damage from all hits.', type: 'normal' },
    'eco_pl8': { x: 1300, y: 1450, name: 'Riot Gear', cost: 80, req: 'eco_ar1', desc: 'Take 15 less damage from all hits.', type: 'notable' },
    
    // Economy Main Path
    'eco_3': { x: 1000, y: 1600, name: 'Hazard Pay', cost: 150, req: 'eco_uni', desc: 'Base score increased by +100%.', type: 'normal' },
    'eco_ovr': { x: 1000, y: 1750, name: 'Overtime', cost: 400, req: 'eco_3', desc: 'Score x3. Earn Wrenches at 30 pts. Bricks fall 30% faster.', type: 'keystone' }
};

function loadGame() {
    try {
        let saved = localStorage.getItem('fixItFelixRPG');
        if (saved) {
            let parsed = JSON.parse(saved);
            saveData.wrenches = parsed.wrenches || 0;
            saveData.unlocked = parsed.unlocked || ['node_base'];
            saveData.maxLevel = parsed.maxLevel || 1;
        }
    } catch (e) { console.warn("Save load failed", e); }
    updateCheckpointUI();
}

function saveGame() {
    try { localStorage.setItem('fixItFelixRPG', JSON.stringify(saveData)); } 
    catch (e) { console.warn("Save failed", e); }
}

function hasSkill(id) { return saveData.unlocked.includes(id); }
function getMaxCheckpoint() { return Math.max(1, Math.floor((saveData.maxLevel - 1) / 10) * 10 + 1); }

function updateCheckpointUI() {
    document.getElementById('cp-text').innerText = `START LVL: ${selectedCheckpoint}`;
}

document.getElementById('btn-prev-cp').addEventListener('click', () => {
    if (selectedCheckpoint > 1) { selectedCheckpoint -= 10; updateCheckpointUI(); vibe(10); }
});

document.getElementById('btn-next-cp').addEventListener('click', () => {
    if (selectedCheckpoint + 10 <= getMaxCheckpoint()) { selectedCheckpoint += 10; updateCheckpointUI(); vibe(10); }
});

function renderSkillTree() {
    document.getElementById('ui-wrenches').innerText = saveData.wrenches;
    const container = document.getElementById('nodes-container');
    container.innerHTML = '';

    const lineCtx = document.getElementById('skill-lines').getContext('2d');
    lineCtx.clearRect(0, 0, 2000, 2000); lineCtx.lineWidth = 4;

    for (const [id, data] of Object.entries(SKILL_TREE)) {
        let isUnlocked = hasSkill(id);
        let reqMet = data.req === null || hasSkill(data.req);
        let canAfford = saveData.wrenches >= data.cost;
        
        if (data.req) {
            let parent = SKILL_TREE[data.req];
            lineCtx.strokeStyle = hasSkill(id) ? '#4caf50' : (reqMet ? '#666' : '#222');
            lineCtx.beginPath(); lineCtx.moveTo(parent.x, parent.y); lineCtx.lineTo(data.x, data.y); lineCtx.stroke();
        }

        let nodeDiv = document.createElement('div');
        let classes = ['skill-node'];
        if (data.type === 'keystone') classes.push('keystone');
        if (isUnlocked) classes.push('unlocked');
        else if (reqMet) classes.push('available');
        else classes.push('locked');
        
        nodeDiv.className = classes.join(' ');
        nodeDiv.style.left = data.x + 'px'; nodeDiv.style.top = data.y + 'px';
        
        let html = `<div class="node-title">${data.name}</div><div class="node-desc">${data.desc}</div>`;
        if (!isUnlocked) html += `<div class="node-cost">${data.cost} W</div>`;
        
        nodeDiv.innerHTML = html;
        
        if (reqMet && !isUnlocked) {
            nodeDiv.onclick = () => {
                if (saveData.wrenches >= data.cost) {
                    saveData.wrenches -= data.cost; saveData.unlocked.push(id);
                    saveGame(); renderSkillTree(); vibe(30); sfx.cash();
                } else { vibe([50, 50, 50]); }
            };
        }
        container.appendChild(nodeDiv);
    }
}

// Map Dragging Logic
let mapViewport = document.getElementById('map-viewport');
let isDragging = false, startX, startY, scrollLeft, scrollTop;

mapViewport.addEventListener('mousedown', (e) => {
    isDragging = true; startX = e.pageX - mapViewport.offsetLeft; startY = e.pageY - mapViewport.offsetTop;
    scrollLeft = mapViewport.scrollLeft; scrollTop = mapViewport.scrollTop;
});
mapViewport.addEventListener('mouseleave', () => { isDragging = false; });
mapViewport.addEventListener('mouseup', () => { isDragging = false; });
mapViewport.addEventListener('mousemove', (e) => {
    if (!isDragging) return; e.preventDefault();
    const x = e.pageX - mapViewport.offsetLeft; const y = e.pageY - mapViewport.offsetTop;
    mapViewport.scrollLeft = scrollLeft - (x - startX); mapViewport.scrollTop = scrollTop - (y - startY);
});

mapViewport.addEventListener('touchstart', (e) => {
    isDragging = true; startX = e.touches[0].pageX - mapViewport.offsetLeft; startY = e.touches[0].pageY - mapViewport.offsetTop;
    scrollLeft = mapViewport.scrollLeft; scrollTop = mapViewport.scrollTop;
});
mapViewport.addEventListener('touchend', () => { isDragging = false; });
mapViewport.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - mapViewport.offsetLeft; const y = e.touches[0].pageY - mapViewport.offsetTop;
    mapViewport.scrollLeft = scrollLeft - (x - startX); mapViewport.scrollTop = scrollTop - (y - startY);
});

function openSkillTree() {
    renderSkillTree();
    document.getElementById('start-overlay').style.display = 'none';
    document.getElementById('skill-tree-overlay').style.display = 'block';
    // Center the 2000x2000 map
    mapViewport.scrollLeft = 1000 - (mapViewport.clientWidth / 2);
    mapViewport.scrollTop = 1000 - (mapViewport.clientHeight / 2);
}

loadGame();

/**
 * AUDIO ENGINE
 */
let actx, musicInterval, bassInterval;
function initAudio() {
    if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === 'suspended') actx.resume();
}
function playTone(freq, type, dur, vol = 0.1, slideFreq = null) {
    if (!actx) return; const osc = actx.createOscillator(); const gain = actx.createGain();
    osc.type = type; osc.frequency.setValueAtTime(freq, actx.currentTime);
    if (slideFreq) osc.frequency.exponentialRampToValueAtTime(slideFreq, actx.currentTime + dur);
    gain.gain.setValueAtTime(vol, actx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + dur);
    osc.connect(gain); gain.connect(actx.destination); osc.start(); osc.stop(actx.currentTime + dur);
}
function playNoise(dur, vol=0.2) {
    if(!actx) return; const bufferSize = actx.sampleRate * dur; const buffer = actx.createBuffer(1, bufferSize, actx.sampleRate);
    const data = buffer.getChannelData(0); for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = actx.createBufferSource(); noise.buffer = buffer;
    const filter = actx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 800;
    const gain = actx.createGain(); gain.gain.setValueAtTime(vol, actx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + dur);
    noise.connect(filter); filter.connect(gain); gain.connect(actx.destination); noise.start(); noise.stop(actx.currentTime + dur);
}

const sfx = {
    jump: () => playTone(300, 'sine', 0.15, 0.1, 600),
    fixHit: () => { playTone(800, 'square', 0.05, 0.1); playNoise(0.05, 0.1); },
    fixComplete: () => { playTone(1200, 'square', 0.1, 0.1); playTone(1600, 'square', 0.15, 0.1, 2000); },
    hurt: () => { playTone(150, 'sawtooth', 0.3, 0.2, 50); playNoise(0.3, 0.3); },
    throw: () => playTone(200, 'triangle', 0.2, 0.1, 100),
    stomp: () => { playNoise(0.4, 0.5); playTone(100, 'square', 0.4, 0.3, 20); },
    win: () => { [523, 659, 783, 1046, 1318].forEach((f, i) => setTimeout(() => playTone(f, 'square', 0.2, 0.1), i * 120)); },
    cash: () => { playTone(1000, 'sine', 0.1, 0.1, 2000); setTimeout(()=>playTone(1500, 'sine', 0.2, 0.1, 3000), 100); },
    dodge: () => playTone(900, 'sine', 0.1, 0.1, 1500)
};

function startMusic() {
    if (musicInterval) clearInterval(musicInterval); if (bassInterval) clearInterval(bassInterval);
    const melody = [392, 0, 392, 523, 0, 659, 783, 0]; const bass = [130, 130, 196, 130];
    let mStep = 0, bStep = 0;
    musicInterval = setInterval(() => { if (melody[mStep]) playTone(melody[mStep], 'square', 0.1, 0.05); mStep = (mStep + 1) % melody.length; }, 150);
    bassInterval = setInterval(() => { playTone(bass[bStep], 'sawtooth', 0.15, 0.08); bStep = (bStep + 1) % bass.length; }, 300);
}
function stopMusic() { clearInterval(musicInterval); clearInterval(bassInterval); }
function vibe(ms) { if (navigator.vibrate) navigator.vibrate(ms); }


/**
 * GAME ENGINE
 */
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const COLS = 3; const ROWS = 5;
const PAD_X = 60; const PAD_Y = 180; 
const CELL_W = 80; const CELL_H = 80;

let score = 0, level = 1;
let hp = 100, maxHp = 100;
let gameState = 'START';
let frameCount = 0, cameraShake = 0, wrenchesEarnedThisRun = 0;

let felix = { col: 1, row: 4, actionTimer: 0, xOffset: 0, yOffset: 0, invincibleTimer: 0, shieldActive: false };
let ralph = { x: 180, y: 100, targetX: 180, timer: 0, state: 'IDLE' };
let windows = []; let bricks = []; let particles = []; let birds = []; let floatTexts = [];

// Apply RPG Stats
let statScoreMult = 1.0;
let statWrenchRate = 100;
let statRalphSpeed = 1.0;
let statDmgReduction = 0;
let statDodgeChance = 0;
let statRegen = 0;
let statCritFix = 0;
let statFixTimer = 10;

function calculateStats() {
    maxHp = 100 + (hasSkill('tnk_1') ? 10 : 0) + (hasSkill('tnk_2') ? 15 : 0) + (hasSkill('tnk_hat') ? 50 : 0) +
            (hasSkill('tnk_sh1') ? 20 : 0) + (hasSkill('tnk_rg1') ? 20 : 0) + (hasSkill('tnk_3') ? 40 : 0) +
            (hasSkill('tnk_osh') ? 150 : 0);
    hp = maxHp;
    
    statDodgeChance = 0 + (hasSkill('agi_ev1') ? 0.05 : 0) + (hasSkill('agi_gst') ? 0.15 : 0) + (hasSkill('agi_ninj') ? 0.30 : 0);
    statCritFix = 0 + (hasSkill('agi_ch1') ? 0.05 : 0) + (hasSkill('agi_mst') ? 0.15 : 0) + (hasSkill('agi_ninj') ? 0.25 : 0);
    
    statFixTimer = 10 - (hasSkill('agi_1') ? 1 : 0) - (hasSkill('agi_2') ? 2 : 0) - (hasSkill('agi_hand') ? 4 : 0);
    
    statDmgReduction = 0 + (hasSkill('eco_ar1') ? 5 : 0) + (hasSkill('eco_pl8') ? 15 : 0) + (hasSkill('tnk_osh') ? 5 : 0);
    statRegen = hasSkill('tnk_med') ? 0.10 : 0;
    
    statScoreMult = 1.0 + (hasSkill('eco_1') ? 0.1 : 0) + (hasSkill('eco_2') ? 0.2 : 0) + 
                    (hasSkill('eco_uni') ? 0.5 : 0) + (hasSkill('eco_3') ? 1.0 : 0) + (hasSkill('eco_ovr') ? 2.0 : 0);
                    
    statWrenchRate = hasSkill('eco_ovr') ? 30 : (hasSkill('eco_ham') ? 50 : (hasSkill('eco_wr1') ? 80 : 100));
    statRalphSpeed = hasSkill('eco_ovr') ? 1.3 : 1.0;
}

function initLevel() {
    windows = []; bricks = []; particles = []; birds = [];
    
    // DIFFICULTY WALLS
    let maxWindowState = 1;
    if (level >= 4) maxWindowState = 2;
    if (level >= 10) maxWindowState = 3;
    if (level >= 30) maxWindowState = 4;
    if (level >= 60) maxWindowState = 5;

    let brokenCount = 0;
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            let state = 0; let rand = Math.random();
            if (rand < 0.2 + (level * 0.02)) {
                state = Math.floor(Math.random() * maxWindowState) + 1;
            }
            if (state > 0) brokenCount++;
            windows.push({ col: c, row: r, state: state, maxState: state, anim: 0 });
        }
    }
    if (brokenCount === 0) { windows[0].state = maxWindowState; windows[0].maxState = maxWindowState; }
    
    felix.col = 1; felix.row = 4; felix.invincibleTimer = 0;
    felix.shieldActive = hasSkill('tnk_vst'); 
}

function spawnParticles(x, y, color, count) {
    for(let i=0; i<count; i++) particles.push({ x: x, y: y, vx: (Math.random()-0.5)*8, vy: (Math.random()-0.5)*8 - 2, life: 20 + Math.random()*20, color: color });
}

function spawnFloatText(x, y, text, color) {
    floatTexts.push({ x: x, y: y, text: text, color: color, life: 40 });
}

function updatePhysics() {
    if (gameState !== 'PLAY') return;
    frameCount++; if (cameraShake > 0) cameraShake--;
    if (felix.invincibleTimer > 0) felix.invincibleTimer--;

    felix.xOffset *= 0.7; felix.yOffset *= 0.7;
    if (felix.actionTimer > 0) felix.actionTimer--;

    let speed = (1.5 + (level * 0.3)) * statRalphSpeed;
    if (ralph.state === 'IDLE') {
        if (Math.abs(ralph.x - ralph.targetX) < speed) {
            ralph.x = ralph.targetX; ralph.timer++;
            if (ralph.timer > Math.max(10, (60 - level*2)) / statRalphSpeed) { ralph.state = 'THROW'; ralph.timer = 0; }
        } else { ralph.x += (ralph.x < ralph.targetX) ? speed : -speed; }
    } else if (ralph.state === 'THROW') {
        ralph.timer++;
        if (ralph.timer === 15) {
            bricks.push({ x: ralph.x, y: ralph.y + 20, vx: (Math.random()-0.5)*0.5, vy: -2, rot: 0 });
            sfx.throw(); cameraShake = 5;
        }
        if (ralph.timer > 30) {
            ralph.state = 'IDLE'; ralph.timer = 0;
            let targetCol = Math.random() < 0.6 ? felix.col : Math.floor(Math.random() * COLS);
            ralph.targetX = PAD_X + targetCol * CELL_W + CELL_W/2;
            if(Math.random() < 0.3) { sfx.stomp(); cameraShake = 15; vibe(50); }
        }
    }

    if (level >= 4 && Math.random() < 0.01 + (level * 0.001)) {
        birds.push({ x: -20, y: PAD_Y + Math.floor(Math.random() * ROWS) * CELL_H + CELL_H/2, vx: 3 + level*0.2 });
    }
    for(let i = birds.length-1; i>=0; i--) { birds[i].x += birds[i].vx; if(birds[i].x > 400) birds.splice(i, 1); }

    let fx = PAD_X + felix.col * CELL_W + CELL_W/2; let fy = PAD_Y + felix.row * CELL_H + CELL_H/2;

    // SCALING DAMAGE
    let brickDmg = 35 + Math.max(0, level - 20) * 2;
    let birdDmg = 20 + Math.max(0, level - 20) * 1.5;

    for (let i = bricks.length - 1; i >= 0; i--) {
        let b = bricks[i]; b.vy += 0.4; b.x += b.vx; b.y += b.vy; b.rot += 0.2;
        if (felix.invincibleTimer === 0 && Math.hypot(b.x - fx, b.y - fy) < 25) { 
            bricks.splice(i, 1); takeDamage(brickDmg, fx, fy);
            continue; 
        }
        if (b.y > canvas.height + 50) bricks.splice(i, 1); 
    }

    for (let i = birds.length - 1; i >= 0; i--) {
        if (felix.invincibleTimer === 0 && Math.hypot(birds[i].x - fx, birds[i].y - fy) < 20) { 
            birds.splice(i, 1); takeDamage(birdDmg, fx, fy);
        }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i]; p.x += p.vx; p.y += p.vy; p.vy += 0.2; p.life--;
        if (p.life <= 0) particles.splice(i, 1);
    }
    
    for (let i = floatTexts.length - 1; i >= 0; i--) {
        floatTexts[i].y -= 0.5; floatTexts[i].life--;
        if (floatTexts[i].life <= 0) floatTexts.splice(i, 1);
    }
}

function takeDamage(baseDmg, fx, fy) {
    if (Math.random() < statDodgeChance) {
        spawnFloatText(fx, fy - 20, "DODGED!", "#aaa"); sfx.dodge(); return;
    }

    if (felix.shieldActive) {
        felix.shieldActive = false; felix.invincibleTimer = 60;
        spawnParticles(fx, fy, '#0ff', 30); spawnFloatText(fx, fy - 20, "BLOCKED!", "#0ff");
        sfx.jump(); vibe(20); return;
    }

    let actualDmg = Math.max(1, Math.floor(baseDmg - statDmgReduction));
    hp -= actualDmg;
    if (hp < 0) hp = 0;

    spawnFloatText(fx, fy - 20, `-${actualDmg}`, "#f00");

    felix.invincibleTimer = hasSkill('agi_3') ? 150 : 90; 
    sfx.hurt(); vibe([100, 50, 100]); cameraShake = 20;
    spawnParticles(fx, fy, '#00f', 20);
    
    if (hp <= 0) {
        gameState = 'OVER'; stopMusic();
        wrenchesEarnedThisRun = Math.floor(score / statWrenchRate);
        if (wrenchesEarnedThisRun > 0) {
            saveData.wrenches += wrenchesEarnedThisRun; saveGame(); setTimeout(() => sfx.cash(), 500);
        }
        setTimeout(() => { if (gameState === 'OVER') openSkillTree(); }, 3000);
    }
}

function handleInput(dx, dy) {
    if (gameState !== 'PLAY') return;
    let newC = felix.col + dx; let newR = felix.row + dy;
    if (newC >= 0 && newC < COLS && newR >= 0 && newR < ROWS) {
        felix.col = newC; felix.row = newR; felix.xOffset = -dx * CELL_W * 0.5; felix.yOffset = -dy * CELL_H * 0.5;
        sfx.jump(); vibe(10);
    }
}

function handleFix() {
    if (gameState !== 'PLAY') return;
    felix.actionTimer = statFixTimer;
    
    let w = windows.find(w => w.col === felix.col && w.row === felix.row);
    let wx = PAD_X + w.col * CELL_W + CELL_W/2; let wy = PAD_Y + w.row * CELL_H + CELL_H/2;

    if (w && w.state > 0) {
        if (w.state >= 2 && Math.random() < statCritFix) {
            w.state = 1; spawnFloatText(wx, wy, "CRIT!", "#ff0");
        }

        w.state--; w.anim = 10; score += Math.floor(50 * statScoreMult);
        spawnParticles(wx, wy, '#fff', 10); vibe(20);
        
        if (w.state === 0) {
            score += Math.floor(100 * statScoreMult); sfx.fixComplete(); spawnParticles(wx, wy, '#8df', 15); checkWin();
        } else { sfx.fixHit(); }
    } else { sfx.fixHit(); }
}

function checkWin() {
    if (windows.every(w => w.state === 0)) {
        gameState = 'WIN'; score += Math.floor(1000 * level * statScoreMult); sfx.win(); stopMusic();
        
        level++;
        if (level > saveData.maxLevel) { saveData.maxLevel = level; saveGame(); }
        
        if (statRegen > 0 && hp < maxHp) {
            let heal = Math.floor(maxHp * statRegen);
            hp = Math.min(maxHp, hp + heal);
            spawnFloatText(PAD_X + felix.col * CELL_W + 40, PAD_Y + felix.row * CELL_H, `+${heal} HP`, "#0f0");
        }
        
        setTimeout(() => { initLevel(); gameState = 'PLAY'; startMusic(); }, 3000);
    }
}

function drawRect(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); }

function drawRender() {
    ctx.save();
    if (cameraShake > 0) { ctx.translate((Math.random()-0.5)*cameraShake, (Math.random()-0.5)*cameraShake); }

    drawRect(0, 0, canvas.width, canvas.height, '#124'); 
    ctx.fillStyle = '#235'; 
    ctx.fillRect(50 + (frameCount*0.2)%400, 70, 80, 20); ctx.fillRect((frameCount*0.1)%500 - 50, 100, 100, 30);

    drawRect(30, 140, 300, canvas.height, '#622'); drawRect(20, 130, 320, 20, '#411'); 

    ctx.fillStyle = '#511'; 
    for(let y=160; y<canvas.height; y+=20) {
        let offset = (y/20)%2===0 ? 0 : 20; for(let x=40; x<320; x+=40) ctx.fillRect(x + offset, y, 38, 18);
    }

    windows.forEach(w => {
        let x = PAD_X + w.col * CELL_W; let y = PAD_Y + w.row * CELL_H;
        let animShake = w.anim > 0 ? (Math.random()-0.5)*4 : 0; if(w.anim > 0) w.anim--;
        
        drawRect(x + animShake, y, 50, 60, '#222'); drawRect(x+5 + animShake, y+5, 40, 50, '#111'); 
        
        drawRect(x-5, y+60, 60, 8, '#333');
        let fillRatio = w.maxState === 0 ? 1 : 1 - (w.state / w.maxState);
        drawRect(x-5, y+60, 60 * fillRatio, 8, '#0f0');
        drawRect(x-5, y+60, 60, 2, 'rgba(255,255,255,0.3)');

        if (w.state === 0) { 
            drawRect(x+5, y+5, 40, 50, '#4af'); drawRect(x+10, y+10, 10, 30, '#8df'); 
        } else {
            drawRect(x+5, y+5, 40, 50, '#4af');
            
            // Multiple crack layers based on damage
            ctx.strokeStyle='#fff'; ctx.lineWidth=2; ctx.beginPath(); 
            ctx.moveTo(x+25, y+5); ctx.lineTo(x+15, y+25); ctx.lineTo(x+5, y+25); 
            if (w.state >= 2) { ctx.moveTo(x+35, y+45); ctx.lineTo(x+25, y+25); }
            if (w.state >= 3) { ctx.moveTo(x+5, y+45); ctx.lineTo(x+15, y+25); }
            if (w.state >= 4) { drawRect(x+15, y+15, 10, 10, '#000'); } // Hole
            ctx.stroke();
        }
    });

    ctx.save(); ctx.translate(ralph.x, ralph.y);
    if(ralph.state === 'THROW') ctx.translate(0, -10);
    drawRect(-25, -20, 50, 40, '#d50'); drawRect(-15, -35, 30, 25, '#fba');
    drawRect(-35, -20, 15, 30, '#fba'); drawRect(20, -20, 15, 30, '#fba');
    drawRect(-8, -28, 4, 4, '#000'); drawRect(4, -28, 4, 4, '#000');
    drawRect(-10, -32, 8, 2, '#000'); drawRect(2, -32, 8, 2, '#000');
    ctx.restore();

    if (felix.invincibleTimer === 0 || Math.floor(frameCount / 4) % 2 === 0) {
        let fx = PAD_X + felix.col * CELL_W + 25 + felix.xOffset; let fy = PAD_Y + felix.row * CELL_H + 30 + felix.yOffset;
        
        if (felix.shieldActive) { 
            ctx.beginPath(); ctx.arc(fx, fy - 5, 28, 0, Math.PI * 2); ctx.fillStyle = 'rgba(0, 255, 255, 0.2)'; ctx.fill();
        }

        drawRect(fx-10, fy, 20, 25, '#05f'); drawRect(fx-8, fy-15, 16, 15, '#fca');
        drawRect(fx-10, fy-20, 20, 8, '#05f'); drawRect(fx-5, fy+25, 10, 10, '#531');
        
        if (felix.actionTimer > 0) {
            ctx.save(); ctx.translate(fx+15, fy-10); ctx.rotate(Math.PI/4);
            drawRect(-2, -15, 4, 20, '#852'); drawRect(-8, -20, 16, 8, '#fd0'); ctx.restore();
        } else { drawRect(fx+10, fy+10, 4, 15, '#852'); drawRect(fx+6, fy+22, 12, 6, '#fd0'); }

        if (felix.shieldActive) { 
            ctx.beginPath(); ctx.arc(fx, fy - 5, 28, 0, Math.PI * 2); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)'; ctx.stroke();
        }
    }

    birds.forEach(b => { drawRect(b.x, b.y, 15, 10, '#fff'); drawRect(b.x + (frameCount%10 < 5 ? 5 : 0), b.y-5, 10, 5, '#ddd'); });
    bricks.forEach(b => { ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.rot); drawRect(-10, -6, 20, 12, '#822'); ctx.restore(); });
    particles.forEach(p => drawRect(p.x, p.y, 4, 4, p.color));
    
    // Draw Floating Combat Text
    ctx.font = '8px "Press Start 2P", monospace';
    floatTexts.forEach(ft => {
        ctx.fillStyle = ft.color;
        ctx.globalAlpha = ft.life / 40;
        ctx.fillText(ft.text, ft.x - 10, ft.y);
        ctx.globalAlpha = 1.0;
    });

    ctx.restore(); 

    // HUD
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, 50); ctx.fillStyle = '#333'; ctx.fillRect(0, 50, canvas.width, 4); 
    ctx.fillStyle = '#0f0'; ctx.font = '10px "Press Start 2P", monospace'; ctx.fillText(`SCORE:${score.toString().padStart(6,'0')}`, 10, 20);
    ctx.fillStyle = '#fff'; ctx.fillText(`LVL:${level}`, 10, 40);

    ctx.fillStyle = '#fff'; ctx.fillText(`HP:`, 85, 40);
    drawRect(120, 30, 100, 12, '#400'); 
    let hpRatio = Math.max(0, hp / maxHp);
    drawRect(120, 30, 100 * hpRatio, 12, hpRatio > 0.3 ? '#0f0' : '#f00'); 
    drawRect(120, 30, 100, 2, 'rgba(255,255,255,0.2)'); 

    if (gameState === 'OVER') {
        ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = '#f00'; ctx.font = '24px "Press Start 2P", monospace';
        ctx.textAlign = 'center'; ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2 - 20);
        
        ctx.fillStyle = '#ffd700'; ctx.font = '10px "Press Start 2P", monospace';
        if (wrenchesEarnedThisRun > 0) {
            ctx.fillText(`+${wrenchesEarnedThisRun} Golden Wrenches`, canvas.width/2, canvas.height/2 + 20);
        } else {
            ctx.fillStyle = '#888'; ctx.fillText(`Score ${statWrenchRate} to earn a wrench`, canvas.width/2, canvas.height/2 + 20);
        }

        ctx.fillStyle = '#fff'; ctx.fillText('Opening Skill Map...', canvas.width/2, canvas.height/2 + 70);
        ctx.textAlign = 'left';
    } else if (gameState === 'WIN') {
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = '#0f0'; ctx.font = '20px "Press Start 2P", monospace';
        ctx.textAlign = 'center'; ctx.fillText('LEVEL CLEARED!', canvas.width/2, canvas.height/2);
        ctx.textAlign = 'left';
    }
}

function loop() { updatePhysics(); drawRender(); requestAnimationFrame(loop); }

/**
 * UI BINDINGS & CONTROLS
 */
function bindBtn(id, action) {
    const el = document.getElementById(id);
    const trigger = (e) => { e.preventDefault(); action(); };
    el.addEventListener('touchstart', trigger); el.addEventListener('mousedown', trigger);
}

bindBtn('btn-up', () => handleInput(0, -1)); bindBtn('btn-down', () => handleInput(0, 1));
bindBtn('btn-left', () => handleInput(-1, 0)); bindBtn('btn-right', () => handleInput(1, 0));
bindBtn('btn-fix', () => { if(gameState === 'PLAY') handleFix(); });

function launchGame() {
    initAudio(); 
    document.getElementById('start-overlay').style.display = 'none';
    document.getElementById('skill-tree-overlay').style.display = 'none';
    score = 0; level = selectedCheckpoint; calculateStats(); initLevel(); gameState = 'PLAY'; startMusic();
}

document.getElementById('btn-insert-coin').addEventListener('click', launchGame);
document.getElementById('btn-restart-run').addEventListener('click', launchGame);
document.getElementById('btn-skills').addEventListener('click', openSkillTree);

document.getElementById('fullscreen-btn').addEventListener('click', () => {
    if (!document.fullscreenElement) { document.documentElement.requestFullscreen().catch(e=>console.log(e)); } 
    else if (document.exitFullscreen) { document.exitFullscreen(); }
});

window.addEventListener('keydown', (e) => {
    if (['ArrowUp','w','W'].includes(e.key)) handleInput(0, -1);
    if (['ArrowDown','s','S'].includes(e.key)) handleInput(0, 1);
    if (['ArrowLeft','a','A'].includes(e.key)) handleInput(-1, 0);
    if (['ArrowRight','d','D'].includes(e.key)) handleInput(1, 0);
    if ([' ','Enter'].includes(e.key)) { if(gameState === 'PLAY') handleFix(); }
});

calculateStats();
drawRender();
loop();
