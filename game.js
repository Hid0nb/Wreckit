document.getElementById('map-content').style.width = '3000px';
document.getElementById('map-content').style.height = '3000px';
document.getElementById('skill-lines').width = 3000;
document.getElementById('skill-lines').height = 3000;

function fNum(num) {
    if (num >= 1e15) return (num / 1e15).toFixed(2) + 'Qa';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return Math.floor(num).toString();
}

let saveData = { wrenches: 0, unlocked: ['node_base'], maxLevel: 1 };
let selectedCheckpoint = 1; let selectedNodeId = null;

// MASSIVE 89-NODE SKILL TREE
const SKILL_TREE = {
    'node_base': { x: 1500, y: 1500, name: 'Apprentice', cost: 0, req: null, desc: 'Ready to work.', type: 'core' },
    
    // === NORTH: POWER (DMG) ===
    'pow_1': { x: 1500, y: 1350, name: 'Heavier Wood', cost: 10, req: 'node_base', desc: '+50 Hammer DMG', type: 'normal' },
    'pow_2': { x: 1500, y: 1200, name: 'Steel Core', cost: 100, req: 'pow_1', desc: '+250 Hammer DMG', type: 'normal' },
    'pow_3': { x: 1500, y: 1050, name: 'Titanium Head', cost: 1000, req: 'pow_2', desc: '+2,500 Hammer DMG', type: 'notable' },
    'pow_4': { x: 1500, y: 900, name: 'Hydraulic Swing', cost: 15000, req: 'pow_3', desc: 'Hammer DMG x2', type: 'normal' },
    'pow_5': { x: 1500, y: 750, name: 'Mjolnir', cost: 250000, req: 'pow_4', desc: '+50,000 Hammer DMG', type: 'normal' },
    'pow_6': { x: 1500, y: 600, name: 'Cosmic Forge', cost: 5000000, req: 'pow_5', desc: 'Hammer DMG x5', type: 'notable' },
    'pow_7': { x: 1500, y: 450, name: 'Reality Breaker', cost: 50000000, req: 'pow_6', desc: '+10,000,000 Hammer DMG', type: 'normal' },
    'pow_max': { x: 1500, y: 300, name: 'One Punch', cost: 1e9, req: 'pow_7', desc: 'Hammer DMG x100', type: 'keystone' },
    
    // Power Extension
    'pow_8': { x: 1650, y: 300, name: 'Planetary Smasher', cost: 5e10, req: 'pow_max', desc: '+1 Billion DMG', type: 'normal' },
    'pow_9': { x: 1800, y: 300, name: 'Galactic Mallet', cost: 1e12, req: 'pow_8', desc: 'Hammer DMG x10', type: 'notable' },
    'pow_10': { x: 1950, y: 300, name: 'Universal Tool', cost: 5e13, req: 'pow_9', desc: '+100 Billion DMG', type: 'normal' },
    'pow_11': { x: 2100, y: 300, name: 'Big Bang', cost: 1e15, req: 'pow_10', desc: 'Hammer DMG x50', type: 'notable' },
    'pow_max2': { x: 2250, y: 300, name: 'Omnipotence', cost: 1e16, req: 'pow_11', desc: 'Hammer DMG x1,000', type: 'keystone' },

    // Power Fork: Crit
    'crit_1': { x: 1650, y: 1050, name: 'Good Aim', cost: 500, req: 'pow_3', desc: '+10% Crit Chance', type: 'normal' },
    'crit_2': { x: 1800, y: 900, name: 'Laser Sight', cost: 50000, req: 'crit_1', desc: '+20% Crit Chance', type: 'notable' },
    'crit_max': { x: 1950, y: 750, name: 'Bullseye', cost: 2000000, req: 'crit_2', desc: 'Crits do 5x DMG', type: 'keystone' },

    // Power Fork: Auto-Caulk (Repair Over Time)
    'rot_1': { x: 1350, y: 900, name: 'Hot Glue', cost: 5000, req: 'pow_4', desc: '5% chance to Auto-Repair window over 5s', type: 'normal' },
    'rot_2': { x: 1200, y: 900, name: 'Liquid Nails', cost: 50000, req: 'rot_1', desc: '10% chance to Auto-Repair', type: 'normal' },
    'rot_3': { x: 1050, y: 900, name: 'Quick Dry', cost: 500000, req: 'rot_2', desc: 'Auto-Repair is 2x stronger', type: 'notable' },
    'rot_4': { x: 900, y: 900, name: 'Epoxy Resin', cost: 5000000, req: 'rot_3', desc: '15% chance to Auto-Repair', type: 'normal' },
    'rot_5': { x: 750, y: 900, name: 'Industrial Seal', cost: 50000000, req: 'rot_4', desc: 'Auto-Repair is 5x stronger', type: 'notable' },
    'rot_max': { x: 600, y: 900, name: 'Magic Duct Tape', cost: 1e9, req: 'rot_5', desc: '25% chance to apply massive Auto-Repair', type: 'keystone' },

    // === EAST: TANK (HP) ===
    'tnk_1': { x: 1650, y: 1500, name: 'Thick Gloves', cost: 10, req: 'node_base', desc: '+50 Max HP', type: 'normal' },
    'tnk_2': { x: 1800, y: 1500, name: 'Hard Hat', cost: 100, req: 'tnk_1', desc: '+500 Max HP', type: 'normal' },
    'tnk_3': { x: 1950, y: 1500, name: 'Kevlar Vest', cost: 1000, req: 'tnk_2', desc: '+5,000 Max HP', type: 'notable' },
    'tnk_4': { x: 2100, y: 1500, name: 'Exosuit', cost: 15000, req: 'tnk_3', desc: 'Max HP x2', type: 'normal' },
    'tnk_5': { x: 2250, y: 1500, name: 'Blast Plating', cost: 250000, req: 'tnk_4', desc: '+100,000 Max HP', type: 'normal' },
    'tnk_6': { x: 2400, y: 1500, name: 'Forcefield', cost: 5000000, req: 'tnk_5', desc: 'Max HP x5', type: 'notable' },
    'tnk_7': { x: 2550, y: 1500, name: 'Immortality', cost: 50000000, req: 'tnk_6', desc: '+50,000,000 Max HP', type: 'normal' },
    'tnk_max': { x: 2700, y: 1500, name: 'God Mode', cost: 1e9, req: 'tnk_7', desc: 'Max HP x100', type: 'keystone' },

    // Tank Extension
    'tnk_8': { x: 2700, y: 1650, name: 'Titanium Bones', cost: 5e10, req: 'tnk_max', desc: '+1 Billion HP', type: 'normal' },
    'tnk_9': { x: 2700, y: 1800, name: 'Energy Matrix', cost: 1e12, req: 'tnk_8', desc: 'Max HP x10', type: 'notable' },
    'tnk_10': { x: 2700, y: 1950, name: 'Aegis Core', cost: 5e13, req: 'tnk_9', desc: '+100 Billion HP', type: 'normal' },
    'tnk_11': { x: 2700, y: 2100, name: 'Planetary Shield', cost: 1e15, req: 'tnk_10', desc: 'Max HP x50', type: 'notable' },
    'tnk_max2': { x: 2700, y: 2250, name: 'Indestructible', cost: 1e16, req: 'tnk_11', desc: 'Max HP x1,000', type: 'keystone' },

    // Tank Fork: Shield
    'shld_1': { x: 1950, y: 1650, name: 'Energy Shield', cost: 500, req: 'tnk_3', desc: 'Blocks 1 hit. Recharges 15s.', type: 'normal' },
    'shld_2': { x: 2100, y: 1800, name: 'Fast Charger', cost: 50000, req: 'shld_1', desc: 'Recharges 5s.', type: 'notable' },
    'shld_max': { x: 2250, y: 1950, name: 'Reactive', cost: 2000000, req: 'shld_2', desc: 'Ready every level.', type: 'keystone' },

    // Tank Fork: Regen & Lifesteal
    'reg_1': { x: 2100, y: 1350, name: 'First Aid', cost: 5000, req: 'tnk_4', desc: '+100 HP per second', type: 'normal' },
    'reg_2': { x: 2100, y: 1200, name: 'Paramedic', cost: 50000, req: 'reg_1', desc: '+5,000 HP per sec', type: 'normal' },
    'reg_3': { x: 2100, y: 1050, name: 'Cybernetic Cells', cost: 500000, req: 'reg_2', desc: '+250,000 HP per sec', type: 'notable' },
    'reg_4': { x: 2100, y: 900, name: 'Wolverine Blood', cost: 5000000, req: 'reg_3', desc: '+10M HP per sec', type: 'normal' },
    'reg_5': { x: 2100, y: 750, name: 'Phoenix Ash', cost: 50000000, req: 'reg_4', desc: '+500M HP per sec', type: 'notable' },
    'reg_max': { x: 2100, y: 600, name: 'Synergistic Repair', cost: 1e9, req: 'reg_5', desc: 'LIFESTEAL: Heal 2% of FIX DMG dealt!', type: 'keystone' },

    // === SOUTH: ECONOMY (Wrenches) ===
    'eco_1': { x: 1500, y: 1650, name: 'Union Dues', cost: 10, req: 'node_base', desc: '+20% Wrenches', type: 'normal' },
    'eco_2': { x: 1500, y: 1800, name: 'Pensions', cost: 100, req: 'eco_1', desc: '+50% Wrenches', type: 'normal' },
    'eco_3': { x: 1500, y: 1950, name: 'Foreman', cost: 1000, req: 'eco_2', desc: '+200% Wrenches', type: 'notable' },
    'eco_4': { x: 1500, y: 2100, name: 'Kickbacks', cost: 15000, req: 'eco_3', desc: 'Wrenches x5', type: 'normal' },
    'eco_5': { x: 1500, y: 2250, name: 'Monopoly', cost: 250000, req: 'eco_4', desc: 'Wrenches x20', type: 'normal' },
    'eco_6': { x: 1500, y: 2400, name: 'Tax Fraud', cost: 5000000, req: 'eco_5', desc: 'Wrenches x100', type: 'notable' },
    'eco_7': { x: 1500, y: 2550, name: 'Infinite Wealth', cost: 50000000, req: 'eco_6', desc: 'Wrenches x1,000', type: 'normal' },
    'eco_max': { x: 1500, y: 2700, name: 'Capitalism', cost: 1e9, req: 'eco_7', desc: 'Wrenches x10,000', type: 'keystone' },

    // Economy Extension
    'eco_8': { x: 1350, y: 2700, name: 'Billionaire', cost: 5e10, req: 'eco_max', desc: 'Wrenches x5', type: 'normal' },
    'eco_9': { x: 1200, y: 2700, name: 'Trillionaire', cost: 1e12, req: 'eco_8', desc: 'Wrenches x10', type: 'notable' },
    'eco_10': { x: 1050, y: 2700, name: 'Economy Breaker', cost: 5e13, req: 'eco_9', desc: 'Wrenches x50', type: 'normal' },
    'eco_11': { x: 900, y: 2700, name: 'Galactic Mint', cost: 1e15, req: 'eco_10', desc: 'Wrenches x100', type: 'notable' },
    'eco_max2': { x: 750, y: 2700, name: 'Post-Scarcity', cost: 1e16, req: 'eco_11', desc: 'Wrenches x1,000', type: 'keystone' },

    // Economy Fork: Ralph Nerf
    'nrf_1': { x: 1650, y: 2100, name: 'Filing Grievance', cost: 5000, req: 'eco_4', desc: 'Ralph Bricks do 10% less DMG', type: 'normal' },
    'nrf_2': { x: 1800, y: 2100, name: 'Coffee Break', cost: 50000, req: 'nrf_1', desc: 'Ralph throws 10% slower', type: 'normal' },
    'nrf_3': { x: 1950, y: 2100, name: 'Union Strike', cost: 500000, req: 'nrf_2', desc: 'Bricks do 25% less DMG', type: 'notable' },
    'nrf_4': { x: 2100, y: 2100, name: 'Bureaucracy', cost: 5000000, req: 'nrf_3', desc: 'Ralph throws 25% slower', type: 'normal' },
    'nrf_5': { x: 2250, y: 2100, name: 'Safety Audit', cost: 50000000, req: 'nrf_4', desc: 'Bricks do 50% less DMG', type: 'notable' },
    'nrf_max': { x: 2400, y: 2100, name: 'OSHA Mandate', cost: 1e9, req: 'nrf_5', desc: 'Ralph speed & damage reduced by 75%', type: 'keystone' },

    // === WEST: AGILITY (Cooldown & Speed) ===
    'agi_1': { x: 1350, y: 1500, name: 'Light Handle', cost: 10, req: 'node_base', desc: 'Cooldown: 180ms', type: 'normal' },
    'agi_2': { x: 1200, y: 1500, name: 'Quick Wrists', cost: 100, req: 'agi_1', desc: 'Cooldown: 150ms', type: 'normal' },
    'agi_3': { x: 1050, y: 1500, name: 'Blurry Hands', cost: 1000, req: 'agi_2', desc: 'Cooldown: 100ms', type: 'notable' },
    'agi_4': { x: 900, y: 1500, name: 'Hyper Speed', cost: 15000, req: 'agi_3', desc: 'Cooldown: 60ms', type: 'normal' },
    'agi_5': { x: 750, y: 1500, name: 'Time Dilation', cost: 250000, req: 'agi_4', desc: 'Cooldown: 30ms', type: 'normal' },
    'agi_max': { x: 600, y: 1500, name: 'Instant', cost: 5000000, req: 'agi_5', desc: 'Cooldown: 0ms', type: 'keystone' },

    // Agility Extension
    'agi_6': { x: 600, y: 1350, name: 'Light Feet', cost: 5e10, req: 'agi_max', desc: 'Move Speed +1', type: 'normal' },
    'agi_7': { x: 600, y: 1200, name: 'Reflexes', cost: 1e12, req: 'agi_6', desc: 'I-Frames +0.5s', type: 'notable' },
    'agi_8': { x: 600, y: 1050, name: 'Afterimage', cost: 5e13, req: 'agi_7', desc: 'Move Speed +2', type: 'normal' },
    'agi_9': { x: 600, y: 900, name: 'Untouchable', cost: 1e15, req: 'agi_8', desc: 'I-Frames +1s', type: 'notable' },
    'agi_max2': { x: 600, y: 750, name: 'The Flash', cost: 1e16, req: 'agi_9', desc: 'Instant Moves & Huge I-Frames', type: 'keystone' },

    // Agility Fork: Dodge
    'dge_1': { x: 1050, y: 1350, name: 'Lucky Shoes', cost: 500, req: 'agi_3', desc: '10% Dodge', type: 'normal' },
    'dge_2': { x: 900, y: 1200, name: 'Ghost Step', cost: 50000, req: 'dge_1', desc: '25% Dodge', type: 'notable' },
    'dge_max': { x: 750, y: 1050, name: 'Intangible', cost: 2000000, req: 'dge_2', desc: '50% Dodge', type: 'keystone' },

    // Agility Fork: Multi-Strike
    'ms_1': { x: 900, y: 1650, name: 'Double Tap', cost: 5000, req: 'agi_4', desc: '10% chance to Hit Twice', type: 'normal' },
    'ms_2': { x: 900, y: 1800, name: 'Echo Swing', cost: 50000, req: 'ms_1', desc: '25% chance to Hit Twice', type: 'normal' },
    'ms_3': { x: 900, y: 1950, name: 'Flurry', cost: 500000, req: 'ms_2', desc: '50% chance to Hit Twice', type: 'notable' },
    'ms_4': { x: 900, y: 2100, name: 'Dual Wield', cost: 5000000, req: 'ms_3', desc: '100% chance to Hit Twice!', type: 'normal' },
    'ms_5': { x: 900, y: 2250, name: 'Overclock', cost: 50000000, req: 'ms_4', desc: '100% Double + 50% Triple Hit', type: 'notable' },
    'ms_max': { x: 900, y: 2400, name: 'Caffeine Rush', cost: 1e9, req: 'ms_5', desc: 'Guaranteed Triple Strike!', type: 'keystone' }
};

function loadGame() {
    try {
        let saved = localStorage.getItem('fixItFelixRPG_v4'); 
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
    try { localStorage.setItem('fixItFelixRPG_v4', JSON.stringify(saveData)); } catch (e) { console.warn("Save failed", e); }
}

function hasSkill(id) { return saveData.unlocked.includes(id); }
function getMaxCheckpoint() { return Math.max(1, Math.floor((saveData.maxLevel - 1) / 10) * 10 + 1); }
function updateCheckpointUI() { document.getElementById('cp-text').innerText = `START LVL: ${selectedCheckpoint}`; }

document.getElementById('btn-prev-cp').addEventListener('click', () => { if (selectedCheckpoint > 1) { selectedCheckpoint -= 10; updateCheckpointUI(); vibe(10); } });
document.getElementById('btn-next-cp').addEventListener('click', () => { if (selectedCheckpoint + 10 <= getMaxCheckpoint()) { selectedCheckpoint += 10; updateCheckpointUI(); vibe(10); } });

// --- STATS ENGINE ---
let statWrenchMult = 1.0; let statDodgeChance = 0; let statHammerCooldownMs = 200; 
let statFixDmg = 50; let statCritChance = 0; let statCritMult = 2;
let statShieldUnlocked = false; let statShieldRegenTime = 900; let statShieldOnRoundStart = false;
let statRotChance = 0; let statRotMult = 0; let statLifesteal = 0; let statRegenPerSec = 0;
let statRalphSpeedMult = 1.0; let statEnemyDmgMult = 1.0; let statMultiStrike = 0; let statIFrames = 90;

function calculateStats() {
    // HP
    let hpFlat = 0; let hpMult = 1;
    if (hasSkill('tnk_1')) hpFlat += 50; if (hasSkill('tnk_2')) hpFlat += 500; if (hasSkill('tnk_3')) hpFlat += 5000;
    if (hasSkill('tnk_5')) hpFlat += 1e5; if (hasSkill('tnk_7')) hpFlat += 5e7;
    if (hasSkill('tnk_8')) hpFlat += 1e9; if (hasSkill('tnk_10')) hpFlat += 1e11;
    if (hasSkill('tnk_4')) hpMult *= 2; if (hasSkill('tnk_6')) hpMult *= 5; if (hasSkill('tnk_max')) hpMult *= 100;
    if (hasSkill('tnk_9')) hpMult *= 10; if (hasSkill('tnk_11')) hpMult *= 50; if (hasSkill('tnk_max2')) hpMult *= 1000;
    maxHp = (100 + hpFlat) * hpMult; hp = maxHp;
    
    // DMG
    let dmgFlat = 0; let dmgMult = 1;
    if (hasSkill('pow_1')) dmgFlat += 50; if (hasSkill('pow_2')) dmgFlat += 250; if (hasSkill('pow_3')) dmgFlat += 2500;
    if (hasSkill('pow_5')) dmgFlat += 5e4; if (hasSkill('pow_7')) dmgFlat += 1e7;
    if (hasSkill('pow_8')) dmgFlat += 1e9; if (hasSkill('pow_10')) dmgFlat += 1e11;
    if (hasSkill('pow_4')) dmgMult *= 2; if (hasSkill('pow_6')) dmgMult *= 5; if (hasSkill('pow_max')) dmgMult *= 100;
    if (hasSkill('pow_9')) dmgMult *= 10; if (hasSkill('pow_11')) dmgMult *= 50; if (hasSkill('pow_max2')) dmgMult *= 1000;
    statFixDmg = (50 + dmgFlat) * dmgMult;

    // AGI & DODGE
    statHammerCooldownMs = hasSkill('agi_max') ? 0 : hasSkill('agi_5') ? 30 : hasSkill('agi_4') ? 60 : hasSkill('agi_3') ? 100 : hasSkill('agi_2') ? 150 : hasSkill('agi_1') ? 180 : 200;
    statDodgeChance = (hasSkill('dge_1') ? 0.10 : 0) + (hasSkill('dge_2') ? 0.25 : 0) + (hasSkill('dge_max') ? 0.50 : 0);
    statIFrames = 90 + (hasSkill('agi_7') ? 30 : 0) + (hasSkill('agi_9') ? 60 : 0) + (hasSkill('agi_max2') ? 120 : 0);
    
    // CRIT
    statCritChance = (hasSkill('crit_1') ? 0.10 : 0) + (hasSkill('crit_2') ? 0.30 : 0); statCritMult = hasSkill('crit_max') ? 5 : 2;
    
    // SHIELD
    statShieldUnlocked = hasSkill('shld_1'); statShieldRegenTime = hasSkill('shld_2') ? 300 : 900; statShieldOnRoundStart = hasSkill('shld_max');

    // ECONOMY
    statWrenchMult = 1.0 + (hasSkill('eco_1') ? 0.2 : 0) + (hasSkill('eco_2') ? 0.5 : 0) + (hasSkill('eco_3') ? 2.0 : 0);
    if (hasSkill('eco_4')) statWrenchMult *= 5; if (hasSkill('eco_5')) statWrenchMult *= 20; if (hasSkill('eco_6')) statWrenchMult *= 100;
    if (hasSkill('eco_7')) statWrenchMult *= 1000; if (hasSkill('eco_max')) statWrenchMult *= 10000;
    if (hasSkill('eco_8')) statWrenchMult *= 5; if (hasSkill('eco_9')) statWrenchMult *= 10; if (hasSkill('eco_10')) statWrenchMult *= 50;
    if (hasSkill('eco_11')) statWrenchMult *= 100; if (hasSkill('eco_max2')) statWrenchMult *= 1000;

    // ROT (Auto-Caulk)
    statRotChance = 0; if (hasSkill('rot_1')) statRotChance = 0.05; if (hasSkill('rot_2')) statRotChance = 0.10; 
    if (hasSkill('rot_4')) statRotChance = 0.15; if (hasSkill('rot_max')) statRotChance = 0.30;
    statRotMult = 0.2; if (hasSkill('rot_3')) statRotMult = 0.4; if (hasSkill('rot_5')) statRotMult = 1.0; if (hasSkill('rot_max')) statRotMult = 3.0;

    // LIFESTEAL & REGEN
    statRegenPerSec = 0; if (hasSkill('reg_1')) statRegenPerSec += 100; if (hasSkill('reg_2')) statRegenPerSec += 5000; 
    if (hasSkill('reg_3')) statRegenPerSec += 250000; if (hasSkill('reg_4')) statRegenPerSec += 1e7; if (hasSkill('reg_5')) statRegenPerSec += 5e8;
    statLifesteal = hasSkill('reg_max') ? 0.02 : 0;

    // RALPH NERF
    statRalphSpeedMult = 1.0; if (hasSkill('nrf_2')) statRalphSpeedMult -= 0.1; if (hasSkill('nrf_4')) statRalphSpeedMult -= 0.15; if (hasSkill('nrf_max')) statRalphSpeedMult -= 0.50;
    statEnemyDmgMult = 1.0; if (hasSkill('nrf_1')) statEnemyDmgMult -= 0.1; if (hasSkill('nrf_3')) statEnemyDmgMult -= 0.15; 
    if (hasSkill('nrf_5')) statEnemyDmgMult -= 0.25; if (hasSkill('nrf_max')) statEnemyDmgMult -= 0.25;

    // MULTI-STRIKE
    statMultiStrike = 0; if (hasSkill('ms_1')) statMultiStrike = 0.1; if (hasSkill('ms_2')) statMultiStrike = 0.25; 
    if (hasSkill('ms_3')) statMultiStrike = 0.50; if (hasSkill('ms_4')) statMultiStrike = 1.0; 
    if (hasSkill('ms_5')) statMultiStrike = 1.5; if (hasSkill('ms_max')) statMultiStrike = 2.0;
}

function updateStatsModal() {
    document.getElementById('s-hp').innerText = fNum(maxHp);
    document.getElementById('s-dmg').innerText = fNum(statFixDmg);
    document.getElementById('s-reg').innerText = fNum(statRegenPerSec);
    document.getElementById('s-ls').innerText = (statLifesteal * 100).toFixed(1) + '%';
    document.getElementById('s-rot').innerText = (statRotChance * 100).toFixed(0) + '% Chance';
    document.getElementById('s-crit').innerText = statCritMult + 'x';
    document.getElementById('s-ms').innerText = '+' + statMultiStrike.toFixed(2) + ' Hits';
    document.getElementById('s-dodge').innerText = (statDodgeChance * 100).toFixed(0) + '%';
    document.getElementById('s-nerf').innerText = '-' + ((1 - statEnemyDmgMult) * 100).toFixed(0) + '% Dmg';
    document.getElementById('s-wm').innerText = fNum(statWrenchMult) + 'x';
}

function renderSkillTree() {
    document.getElementById('ui-wrenches').innerText = fNum(saveData.wrenches);
    const container = document.getElementById('nodes-container'); container.innerHTML = '';
    const lineCtx = document.getElementById('skill-lines').getContext('2d'); lineCtx.clearRect(0, 0, 3000, 3000); lineCtx.lineWidth = 4;

    for (const [id, data] of Object.entries(SKILL_TREE)) {
        let isUnlocked = hasSkill(id); let reqMet = data.req === null || hasSkill(data.req);
        
        if (data.req) {
            let parent = SKILL_TREE[data.req];
            lineCtx.strokeStyle = hasSkill(id) ? '#4caf50' : (reqMet ? '#666' : '#222');
            lineCtx.beginPath(); lineCtx.moveTo(parent.x, parent.y); lineCtx.lineTo(data.x, data.y); lineCtx.stroke();
        }

        let icon = '🔧'; 
        if (id.startsWith('pow') || id.startsWith('crit') || id.startsWith('rot')) icon = '🔨';
        else if (id.startsWith('tnk') || id.startsWith('shld') || id.startsWith('reg')) icon = '🛡️';
        else if (id.startsWith('eco') || id.startsWith('nrf')) icon = '💰';
        else if (id.startsWith('agi') || id.startsWith('dge') || id.startsWith('ms')) icon = '⚡';

        let nodeDiv = document.createElement('div'); let classes = ['skill-node', `node-${data.type}`]; 
        if (isUnlocked) classes.push('unlocked'); else if (reqMet) classes.push('available'); else classes.push('locked');
        
        nodeDiv.className = classes.join(' '); nodeDiv.style.left = data.x + 'px'; nodeDiv.style.top = data.y + 'px'; nodeDiv.innerHTML = icon;

        nodeDiv.onclick = () => {
            selectedNodeId = id; document.getElementById('nm-title').innerText = data.name; document.getElementById('nm-desc').innerText = data.desc;
            let btnBuy = document.getElementById('nm-buy');
            if (isUnlocked) { document.getElementById('nm-cost').innerText = "✓ ALREADY UNLOCKED"; document.getElementById('nm-cost').style.color = "#4caf50"; btnBuy.style.display = 'none'; } 
            else {
                document.getElementById('nm-cost').innerText = `Cost: ${fNum(data.cost)} W`; document.getElementById('nm-cost').style.color = "#ffd700"; btnBuy.style.display = 'block';
                if (reqMet && saveData.wrenches >= data.cost) { btnBuy.disabled = false; btnBuy.innerText = 'UNLOCK'; } 
                else if (!reqMet) { btnBuy.disabled = true; btnBuy.innerText = 'PATH LOCKED'; } 
                else { btnBuy.disabled = true; btnBuy.innerText = 'NOT ENOUGH W'; }
            }
            document.getElementById('node-modal').style.display = 'block'; vibe(10);
        };
        container.appendChild(nodeDiv);
    }
}

// Modal Handlers
document.getElementById('nm-close').addEventListener('click', () => { document.getElementById('node-modal').style.display = 'none'; vibe(10); });
document.getElementById('btn-show-stats').addEventListener('click', () => { updateStatsModal(); document.getElementById('stats-modal').style.display = 'block'; vibe(10); });
document.getElementById('btn-close-stats').addEventListener('click', () => { document.getElementById('stats-modal').style.display = 'none'; vibe(10); });

document.getElementById('nm-buy').addEventListener('click', () => {
    if (!selectedNodeId) return; let data = SKILL_TREE[selectedNodeId];
    if (saveData.wrenches >= data.cost) {
        saveData.wrenches -= data.cost; saveData.unlocked.push(selectedNodeId);
        saveGame(); calculateStats(); 
        document.getElementById('node-modal').style.display = 'none';
        renderSkillTree(); vibe(30); sfx.cash();
    }
});

let mapViewport = document.getElementById('map-viewport'); let mapContent = document.getElementById('map-content');
let isDragging = false, startX, startY; let mapX = 0, mapY = 0, mapZoom = 0.8; let initialDistance = null, initialZoom = 1;

function updateMapTransform() { mapContent.style.transform = `translate(${mapX}px, ${mapY}px) scale(${mapZoom})`; }
function setZoom(newZoom) {
    let oldZoom = mapZoom; mapZoom = Math.max(0.3, Math.min(newZoom, 1.5));
    let viewportCenterX = mapViewport.clientWidth / 2; let viewportCenterY = mapViewport.clientHeight / 2;
    let mapCenterX = (viewportCenterX - mapX) / oldZoom; let mapCenterY = (viewportCenterY - mapY) / oldZoom;
    mapX = viewportCenterX - (mapCenterX * mapZoom); mapY = viewportCenterY - (mapCenterY * mapZoom); updateMapTransform();
}

document.getElementById('btn-zoom-in').addEventListener('click', () => setZoom(mapZoom + 0.2));
document.getElementById('btn-zoom-out').addEventListener('click', () => setZoom(mapZoom - 0.2));

mapViewport.addEventListener('mousedown', (e) => { if(e.target.closest('.modal-ui')) return; isDragging = true; startX = e.pageX - mapX; startY = e.pageY - mapY; });
mapViewport.addEventListener('mouseleave', () => { isDragging = false; }); mapViewport.addEventListener('mouseup', () => { isDragging = false; });
mapViewport.addEventListener('mousemove', (e) => { if (!isDragging) return; e.preventDefault(); mapX = e.pageX - startX; mapY = e.pageY - startY; updateMapTransform(); });
mapViewport.addEventListener('touchstart', (e) => {
    if(e.target.closest('.modal-ui')) return;
    if (e.touches.length === 2) { isDragging = false; initialDistance = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY); initialZoom = mapZoom; } 
    else if (e.touches.length === 1) { isDragging = true; startX = e.touches[0].pageX - mapX; startY = e.touches[0].pageY - mapY; }
});
mapViewport.addEventListener('touchend', () => { isDragging = false; });
mapViewport.addEventListener('touchmove', (e) => {
    if(e.target.closest('.modal-ui')) return; e.preventDefault(); 
    if (e.touches.length === 2 && initialDistance) {
        let currentDist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
        let ratio = currentDist / initialDistance; mapZoom = Math.max(0.3, Math.min(initialZoom * ratio, 1.5));
        let mapCenterX = (mapViewport.clientWidth / 2 - mapX) / mapZoom; let mapCenterY = (mapViewport.clientHeight / 2 - mapY) / mapZoom;
        mapX = mapViewport.clientWidth / 2 - (mapCenterX * mapZoom); mapY = mapViewport.clientHeight / 2 - (mapCenterY * mapZoom); updateMapTransform();
    } else if (e.touches.length === 1 && isDragging) { mapX = e.touches[0].pageX - startX; mapY = e.touches[0].pageY - startY; updateMapTransform(); }
}, { passive: false });

function openSkillTree() {
    renderSkillTree(); updateCheckpointUI();
    document.getElementById('start-overlay').style.display = 'none'; document.getElementById('skill-tree-overlay').style.display = 'block';
    mapZoom = 0.8; mapX = (mapViewport.clientWidth / 2) - (1500 * mapZoom); mapY = (mapViewport.clientHeight / 2) - (1500 * mapZoom); updateMapTransform();
}
loadGame();

// AUDIO
let actx, musicInterval, bassInterval;
function initAudio() { if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); }
function playTone(freq, type, dur, vol = 0.1, slideFreq = null) {
    if (!actx) return; const osc = actx.createOscillator(); const gain = actx.createGain(); osc.type = type; osc.frequency.setValueAtTime(freq, actx.currentTime);
    if (slideFreq) osc.frequency.exponentialRampToValueAtTime(slideFreq, actx.currentTime + dur);
    gain.gain.setValueAtTime(vol, actx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + dur);
    osc.connect(gain); gain.connect(actx.destination); osc.start(); osc.stop(actx.currentTime + dur);
}
function playNoise(dur, vol=0.2) {
    if(!actx) return; const bufferSize = actx.sampleRate * dur; const buffer = actx.createBuffer(1, bufferSize, actx.sampleRate);
    const data = buffer.getChannelData(0); for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = actx.createBufferSource(); noise.buffer = buffer; const filter = actx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 800;
    const gain = actx.createGain(); gain.gain.setValueAtTime(vol, actx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + dur);
    noise.connect(filter); filter.connect(gain); gain.connect(actx.destination); noise.start(); noise.stop(actx.currentTime + dur);
}
const sfx = {
    jump: () => playTone(300, 'sine', 0.15, 0.1, 600), fixHit: () => { playTone(800, 'square', 0.05, 0.1); playNoise(0.05, 0.1); },
    fixComplete: () => { playTone(1200, 'square', 0.1, 0.1); playTone(1600, 'square', 0.15, 0.1, 2000); }, hurt: () => { playTone(150, 'sawtooth', 0.3, 0.2, 50); playNoise(0.3, 0.3); },
    throw: () => playTone(200, 'triangle', 0.2, 0.1, 100), stomp: () => { playNoise(0.4, 0.5); playTone(100, 'square', 0.4, 0.3, 20); },
    win: () => { [523, 659, 783, 1046, 1318].forEach((f, i) => setTimeout(() => playTone(f, 'square', 0.2, 0.1), i * 120)); },
    cash: () => { playTone(1000, 'sine', 0.1, 0.1, 2000); setTimeout(()=>playTone(1500, 'sine', 0.2, 0.1, 3000), 100); }, dodge: () => playTone(900, 'sine', 0.1, 0.1, 1500)
};
function startMusic() {
    if (musicInterval) clearInterval(musicInterval); if (bassInterval) clearInterval(bassInterval);
    const melody = [392, 0, 392, 523, 0, 659, 783, 0]; const bass = [130, 130, 196, 130]; let mStep = 0, bStep = 0;
    musicInterval = setInterval(() => { if (melody[mStep]) playTone(melody[mStep], 'square', 0.1, 0.05); mStep = (mStep + 1) % melody.length; }, 150);
    bassInterval = setInterval(() => { playTone(bass[bStep], 'sawtooth', 0.15, 0.08); bStep = (bStep + 1) % bass.length; }, 300);
}
function stopMusic() { clearInterval(musicInterval); clearInterval(bassInterval); }
function vibe(ms) { if (navigator.vibrate) navigator.vibrate(ms); }

// ENGINE
const canvas = document.getElementById('gameCanvas'); const ctx = canvas.getContext('2d');
const COLS = 3; const ROWS = 5; const PAD_X = 60; const PAD_Y = 180; const CELL_W = 80; const CELL_H = 80;

let level = 1; let hp = 100, maxHp = 100; let gameState = 'START';
let frameCount = 0, cameraShake = 0, wrenchesEarnedThisRun = 0;
let currentWindowMaxHp = 0, currentBrickDmg = 0, currentBirdDmg = 0; let isGrinding = false; 

let felix = { col: 1, row: 4, actionTimer: 0, xOffset: 0, yOffset: 0, invincibleTimer: 0, shieldActive: false, shieldRegenTimer: 0, lastSwingTime: 0 };
let ralph = { x: 180, y: 100, targetX: 180, timer: 0, state: 'IDLE' };
let windows = []; let bricks = []; let particles = []; let birds = []; let floatTexts = [];

function initLevel() {
    windows = []; bricks = []; particles = []; birds = [];
    currentWindowMaxHp = Math.floor(100 * Math.pow(1.15, level - 1));
    currentBrickDmg = Math.floor(35 * Math.pow(1.15, level - 1) * statEnemyDmgMult);
    currentBirdDmg = Math.floor(20 * Math.pow(1.15, level - 1) * statEnemyDmgMult);
    isGrinding = (level < saveData.maxLevel);

    let brokenCount = 0;
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            let hp = 0; if (Math.random() < 0.2 + (level * 0.02)) hp = Math.floor(currentWindowMaxHp * (Math.random() * 0.9 + 0.1));
            if (hp > 0) brokenCount++;
            windows.push({ col: c, row: r, hp: hp, maxHp: currentWindowMaxHp, anim: 0, rotTimer: 0, rotDmg: 0 });
        }
    }
    if (brokenCount === 0) { windows[0].hp = currentWindowMaxHp; windows[0].maxHp = currentWindowMaxHp; }
    
    felix.col = 1; felix.row = 4; felix.invincibleTimer = 0;
    if (statShieldOnRoundStart && statShieldUnlocked) { felix.shieldActive = true; felix.shieldRegenTimer = 0; }
}

function spawnParticles(x, y, color, count) { for(let i=0; i<count; i++) particles.push({ x: x, y: y, vx: (Math.random()-0.5)*8, vy: (Math.random()-0.5)*8 - 2, life: 20 + Math.random()*20, color: color }); }
function spawnFloatText(x, y, text, color) { floatTexts.push({ x: x, y: y, text: text, color: color, life: 40 }); }

function updatePhysics() {
    if (gameState !== 'PLAY') return;
    frameCount++; if (cameraShake > 0) cameraShake--;
    if (felix.invincibleTimer > 0) felix.invincibleTimer--;
    if (felix.actionTimer > 0) felix.actionTimer--;

    // Shield Regen
    if (statShieldUnlocked && !felix.shieldActive && felix.shieldRegenTimer > 0) {
        felix.shieldRegenTimer--;
        if (felix.shieldRegenTimer <= 0) { felix.shieldActive = true; sfx.win(); spawnFloatText(PAD_X + felix.col * CELL_W + CELL_W/2, PAD_Y + felix.row * CELL_H + 20, "SHIELD READY", "#0ff"); }
    }

    // Passive HP Regen
    if (statRegenPerSec > 0 && hp < maxHp && frameCount % 60 === 0) {
        hp = Math.min(maxHp, hp + statRegenPerSec);
        let fx = PAD_X + felix.col * CELL_W + CELL_W/2; let fy = PAD_Y + felix.row * CELL_H + CELL_H/2;
        spawnFloatText(fx, fy - 30, `+${fNum(statRegenPerSec)}`, "#0f0");
    }

    // Auto-Caulk (Repair Over Time) Processor
    windows.forEach(w => {
        if (w.hp > 0 && w.rotTimer > 0 && frameCount % 30 === 0) { // Tick twice a second
            w.rotTimer--; let dmg = w.rotDmg;
            w.hp -= dmg; if (w.hp < 0) w.hp = 0; w.anim = 10;
            wrenchesEarnedThisRun += (dmg / 100) * statWrenchMult * (isGrinding ? 0.25 : 1.0);
            
            let wx = PAD_X + w.col * CELL_W + CELL_W/2; let wy = PAD_Y + w.row * CELL_H + CELL_H/2;
            spawnParticles(wx, wy, '#fa0', 5); spawnFloatText(wx + (Math.random()-0.5)*20, wy, `-${fNum(dmg)}`, "#fa0");
            if (w.hp === 0) { sfx.fixComplete(); checkWin(); }
        }
    });

    felix.xOffset *= 0.7; felix.yOffset *= 0.7;

    // Ralph Behavior
    let speed = (1.5 + (level * 0.1)) * statRalphSpeedMult;
    if (ralph.state === 'IDLE') {
        if (Math.abs(ralph.x - ralph.targetX) < speed) {
            ralph.x = ralph.targetX; ralph.timer++;
            if (ralph.timer > Math.max(10, 60 - level) / statRalphSpeedMult) { ralph.state = 'THROW'; ralph.timer = 0; }
        } else { ralph.x += (ralph.x < ralph.targetX) ? speed : -speed; }
    } else if (ralph.state === 'THROW') {
        ralph.timer++;
        if (ralph.timer === 15) { bricks.push({ x: ralph.x, y: ralph.y + 20, vx: (Math.random()-0.5)*0.5, vy: -2, rot: 0 }); sfx.throw(); cameraShake = 5; }
        if (ralph.timer > 30) {
            ralph.state = 'IDLE'; ralph.timer = 0;
            let targetCol = Math.random() < 0.6 ? felix.col : Math.floor(Math.random() * COLS);
            ralph.targetX = PAD_X + targetCol * CELL_W + CELL_W/2;
            if(Math.random() < 0.3) { sfx.stomp(); cameraShake = 15; vibe(50); }
        }
    }

    if (level >= 4 && Math.random() < 0.01 + (level * 0.001)) { birds.push({ x: -20, y: PAD_Y + Math.floor(Math.random() * ROWS) * CELL_H + CELL_H/2, vx: 3 + level*0.1 }); }
    for(let i = birds.length-1; i>=0; i--) { birds[i].x += birds[i].vx; if(birds[i].x > 400) birds.splice(i, 1); }

    let fx = PAD_X + felix.col * CELL_W + CELL_W/2; let fy = PAD_Y + felix.row * CELL_H + CELL_H/2;

    for (let i = bricks.length - 1; i >= 0; i--) {
        let b = bricks[i]; b.vy += 0.4; b.x += b.vx; b.y += b.vy; b.rot += 0.2;
        if (felix.invincibleTimer === 0 && Math.hypot(b.x - fx, b.y - fy) < 25) { bricks.splice(i, 1); takeDamage(currentBrickDmg, fx, fy); continue; }
        if (b.y > canvas.height + 50) bricks.splice(i, 1); 
    }
    for (let i = birds.length - 1; i >= 0; i--) {
        if (felix.invincibleTimer === 0 && Math.hypot(birds[i].x - fx, birds[i].y - fy) < 20) { birds.splice(i, 1); takeDamage(currentBirdDmg, fx, fy); }
    }

    for (let i = particles.length - 1; i >= 0; i--) { let p = particles[i]; p.x += p.vx; p.y += p.vy; p.vy += 0.2; p.life--; if (p.life <= 0) particles.splice(i, 1); }
    for (let i = floatTexts.length - 1; i >= 0; i--) { floatTexts[i].y -= 0.5; floatTexts[i].life--; if (floatTexts[i].life <= 0) floatTexts.splice(i, 1); }
}

function takeDamage(actualDmg, fx, fy) {
    if (Math.random() < statDodgeChance) { spawnFloatText(fx, fy - 20, "DODGED!", "#aaa"); sfx.dodge(); return; }
    if (felix.shieldActive) {
        felix.shieldActive = false; felix.invincibleTimer = 60; felix.shieldRegenTimer = statShieldRegenTime; 
        spawnParticles(fx, fy, '#0ff', 30); spawnFloatText(fx, fy - 20, "BLOCKED!", "#0ff"); sfx.jump(); vibe(20); return;
    }

    hp -= actualDmg; if (hp < 0) hp = 0;
    spawnFloatText(fx, fy - 20, `-${fNum(actualDmg)}`, "#f00");

    felix.invincibleTimer = statIFrames; sfx.hurt(); vibe([100, 50, 100]); cameraShake = 20; spawnParticles(fx, fy, '#00f', 20);
    
    if (hp <= 0) {
        gameState = 'OVER'; stopMusic();
        saveData.wrenches += Math.floor(wrenchesEarnedThisRun); saveGame(); 
        if (wrenchesEarnedThisRun >= 1) setTimeout(() => sfx.cash(), 500);
        setTimeout(() => { if (gameState === 'OVER') openSkillTree(); }, 3000);
    }
}

function handleInput(dx, dy) {
    if (gameState !== 'PLAY') return;
    let moveMult = 1 + (hasSkill('agi_6') ? 1 : 0) + (hasSkill('agi_8') ? 2 : 0);
    let newC = felix.col + dx; let newR = felix.row + dy;
    if (newC >= 0 && newC < COLS && newR >= 0 && newR < ROWS) {
        felix.col = newC; felix.row = newR; 
        felix.xOffset = -dx * CELL_W * (hasSkill('agi_max2') ? 0 : 0.5) / moveMult; 
        felix.yOffset = -dy * CELL_H * (hasSkill('agi_max2') ? 0 : 0.5) / moveMult;
        sfx.jump(); vibe(10);
    }
}

function handleFix() {
    if (gameState !== 'PLAY') return;
    
    let now = Date.now();
    if (now - felix.lastSwingTime < statHammerCooldownMs) return;
    felix.lastSwingTime = now; felix.actionTimer = 8; 
    
    let w = windows.find(w => w.col === felix.col && w.row === felix.row);
    let wx = PAD_X + w.col * CELL_W + CELL_W/2; let wy = PAD_Y + w.row * CELL_H + CELL_H/2;

    if (w && w.hp > 0) {
        // Multi-Strike Loop Calculation
        let hits = 1;
        hits += Math.floor(statMultiStrike);
        if (Math.random() < (statMultiStrike % 1)) hits++;
        
        let totalDmgThisSwing = 0;

        for(let i=0; i<hits; i++) {
            if (w.hp <= 0) break;

            let dmg = statFixDmg;
            if (Math.random() < statCritChance) { dmg *= statCritMult; spawnFloatText(wx, wy, "CRIT!", "#ff0"); }
            
            w.hp -= dmg; if (w.hp < 0) w.hp = 0; w.anim = 10;
            totalDmgThisSwing += dmg;
            
            wrenchesEarnedThisRun += (dmg / 100) * statWrenchMult * (isGrinding ? 0.25 : 1.0);
            spawnParticles(wx, wy, '#fff', 10);
            
            // Auto-Caulk Proc check
            if (w.hp > 0 && Math.random() < statRotChance) {
                w.rotTimer = 10; // 5 real seconds
                w.rotDmg = statFixDmg * statRotMult;
                spawnFloatText(wx, wy - 30, "AUTO-CAULK!", "#fa0");
            }
        }
        
        // Lifesteal calculation
        if (statLifesteal > 0 && hp < maxHp) {
            let heal = totalDmgThisSwing * statLifesteal;
            hp = Math.min(maxHp, hp + heal);
            if (Math.random() < 0.3) spawnFloatText(wx + 30, wy, `+${fNum(heal)}`, "#0f0");
        }

        vibe(20);
        if (w.hp === 0) { sfx.fixComplete(); spawnParticles(wx, wy, '#8df', 15); checkWin(); } else { sfx.fixHit(); }
    } else { sfx.fixHit(); }
}

function checkWin() {
    if (windows.every(w => w.hp === 0)) {
        gameState = 'WIN'; sfx.win(); stopMusic();
        level++; if (level > saveData.maxLevel) { saveData.maxLevel = level; saveGame(); }
        setTimeout(() => { initLevel(); gameState = 'PLAY'; startMusic(); }, 3000);
    }
}

function drawRect(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); }

function drawRender() {
    ctx.save();
    if (cameraShake > 0) { ctx.translate((Math.random()-0.5)*cameraShake, (Math.random()-0.5)*cameraShake); }

    drawRect(0, 0, canvas.width, canvas.height, '#124'); 
    ctx.fillStyle = '#235'; ctx.fillRect(50 + (frameCount*0.2)%400, 70, 80, 20); ctx.fillRect((frameCount*0.1)%500 - 50, 100, 100, 30);
    drawRect(30, 140, 300, canvas.height, '#622'); drawRect(20, 130, 320, 20, '#411'); 

    ctx.fillStyle = '#511'; 
    for(let y=160; y<canvas.height; y+=20) { let offset = (y/20)%2===0 ? 0 : 20; for(let x=40; x<320; x+=40) ctx.fillRect(x + offset, y, 38, 18); }

    windows.forEach(w => {
        let x = PAD_X + w.col * CELL_W; let y = PAD_Y + w.row * CELL_H;
        let animShake = w.anim > 0 ? (Math.random()-0.5)*4 : 0; if(w.anim > 0) w.anim--;
        
        drawRect(x + animShake, y, 50, 60, '#222'); drawRect(x+5 + animShake, y+5, 40, 50, '#111'); 
        drawRect(x-5, y+60, 60, 8, '#333');
        let fillRatio = w.maxHp === 0 ? 1 : 1 - (w.hp / w.maxHp);
        drawRect(x-5, y+60, 60 * fillRatio, 8, '#0f0'); drawRect(x-5, y+60, 60, 2, 'rgba(255,255,255,0.3)');

        if (w.hp <= 0) { 
            drawRect(x+5, y+5, 40, 50, '#4af'); drawRect(x+10, y+10, 10, 30, '#8df'); 
        } else {
            drawRect(x+5, y+5, 40, 50, '#4af'); let crackRatio = w.hp / w.maxHp;
            ctx.strokeStyle='#fff'; ctx.lineWidth=2; ctx.beginPath(); 
            if (crackRatio < 1.0) { ctx.moveTo(x+25, y+5); ctx.lineTo(x+15, y+25); ctx.lineTo(x+5, y+25); }
            if (crackRatio <= 0.6) { ctx.moveTo(x+35, y+45); ctx.lineTo(x+25, y+25); }
            if (crackRatio <= 0.3) { ctx.moveTo(x+5, y+45); ctx.lineTo(x+15, y+25); drawRect(x+15, y+15, 10, 10, '#000'); } 
            
            // Draw visual fire indicator for burning Auto-Caulk status
            if (w.rotTimer > 0) { drawRect(x+15, y+50, 20, 5, '#fa0'); }
            ctx.stroke();
        }
    });

    ctx.save(); ctx.translate(ralph.x, ralph.y);
    if(ralph.state === 'THROW') ctx.translate(0, -10);
    drawRect(-25, -20, 50, 40, '#d50'); drawRect(-15, -35, 30, 25, '#fba'); drawRect(-35, -20, 15, 30, '#fba'); drawRect(20, -20, 15, 30, '#fba');
    drawRect(-8, -28, 4, 4, '#000'); drawRect(4, -28, 4, 4, '#000'); drawRect(-10, -32, 8, 2, '#000'); drawRect(2, -32, 8, 2, '#000'); ctx.restore();

    if (felix.invincibleTimer === 0 || Math.floor(frameCount / 4) % 2 === 0) {
        let fx = PAD_X + felix.col * CELL_W + 25 + felix.xOffset; let fy = PAD_Y + felix.row * CELL_H + 30 + felix.yOffset;
        
        if (felix.shieldActive) { ctx.beginPath(); ctx.arc(fx, fy - 5, 28, 0, Math.PI * 2); ctx.fillStyle = 'rgba(0, 255, 255, 0.2)'; ctx.fill(); } 
        drawRect(fx-10, fy, 20, 25, '#05f'); drawRect(fx-8, fy-15, 16, 15, '#fca'); drawRect(fx-10, fy-20, 20, 8, '#05f'); drawRect(fx-5, fy+25, 10, 10, '#531');
        
        if (felix.actionTimer > 0) { ctx.save(); ctx.translate(fx+15, fy-10); ctx.rotate(Math.PI/4); drawRect(-2, -15, 4, 20, '#852'); drawRect(-8, -20, 16, 8, '#fd0'); ctx.restore(); } 
        else { drawRect(fx+10, fy+10, 4, 15, '#852'); drawRect(fx+6, fy+22, 12, 6, '#fd0'); }

        if (felix.shieldActive) { ctx.beginPath(); ctx.arc(fx, fy - 5, 28, 0, Math.PI * 2); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)'; ctx.stroke(); }
        if (statShieldUnlocked && !felix.shieldActive && felix.shieldRegenTimer > 0) {
            let pct = 1 - (felix.shieldRegenTimer / statShieldRegenTime);
            ctx.beginPath(); ctx.arc(fx, fy - 5, 28, -Math.PI/2, (-Math.PI/2) + (Math.PI * 2 * pct)); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(0, 255, 255, 0.4)'; ctx.stroke();
        }
    }

    birds.forEach(b => { drawRect(b.x, b.y, 15, 10, '#fff'); drawRect(b.x + (frameCount%10 < 5 ? 5 : 0), b.y-5, 10, 5, '#ddd'); });
    bricks.forEach(b => { ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.rot); drawRect(-10, -6, 20, 12, '#822'); ctx.restore(); });
    particles.forEach(p => drawRect(p.x, p.y, 4, 4, p.color));
    
    ctx.font = '8px "Press Start 2P", monospace';
    floatTexts.forEach(ft => { ctx.fillStyle = ft.color; ctx.globalAlpha = ft.life / 40; ctx.fillText(ft.text, ft.x - 10, ft.y); ctx.globalAlpha = 1.0; });

    ctx.restore(); 

    // HUD Display
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, 65); ctx.fillStyle = '#333'; ctx.fillRect(0, 65, canvas.width, 4); 
    
    ctx.fillStyle = '#ffd700'; ctx.font = '10px "Press Start 2P", monospace'; 
    let totalWrenchesLive = Math.floor(saveData.wrenches + wrenchesEarnedThisRun);
    ctx.fillText(`WRENCHES:${fNum(totalWrenchesLive)}`, 10, 20);
    if (isGrinding) { ctx.fillStyle = '#f55'; ctx.font = '8px "Press Start 2P", monospace'; ctx.fillText(`[GRINDING -75%]`, 190, 18); }
    
    ctx.fillStyle = '#fff'; ctx.font = '10px "Press Start 2P", monospace'; ctx.fillText(`LVL:${level}`, 10, 38);
    ctx.fillText(`HP:`, 85, 38);
    drawRect(120, 28, 100, 12, '#400'); let hpRatio = Math.max(0, hp / maxHp); drawRect(120, 28, 100 * hpRatio, 12, hpRatio > 0.3 ? '#0f0' : '#f00'); 
    ctx.fillStyle = '#fff'; ctx.font = '8px "Press Start 2P", monospace'; ctx.fillText(`${fNum(hp)}/${fNum(maxHp)}`, 125, 38);

    ctx.fillStyle = '#aaa'; ctx.font = '7px "Press Start 2P", monospace';
    ctx.fillText(`WNDW MAX:${fNum(currentWindowMaxHp)} | BLK DMG:${fNum(currentBrickDmg)} | BRD DMG:${fNum(currentBirdDmg)}`, 10, 55);

    if (gameState === 'OVER') {
        ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = '#f00'; ctx.font = '24px "Press Start 2P", monospace'; ctx.textAlign = 'center'; ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2 - 20);
        ctx.fillStyle = '#ffd700'; ctx.font = '10px "Press Start 2P", monospace';
        if (Math.floor(wrenchesEarnedThisRun) > 0) ctx.fillText(`+${fNum(Math.floor(wrenchesEarnedThisRun))} Wrenches Secured`, canvas.width/2, canvas.height/2 + 20);
        ctx.fillStyle = '#fff'; ctx.fillText('Opening Skill Map...', canvas.width/2, canvas.height/2 + 70); ctx.textAlign = 'left';
    } else if (gameState === 'WIN') {
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = '#0f0'; ctx.font = '20px "Press Start 2P", monospace'; ctx.textAlign = 'center'; ctx.fillText('LEVEL CLEARED!', canvas.width/2, canvas.height/2); ctx.textAlign = 'left';
    }
}

function loop() { updatePhysics(); drawRender(); requestAnimationFrame(loop); }

function bindBtn(id, action) {
    const el = document.getElementById(id); const trigger = (e) => { e.preventDefault(); action(); };
    el.addEventListener('touchstart', trigger); el.addEventListener('mousedown', trigger);
}

bindBtn('btn-up', () => handleInput(0, -1)); bindBtn('btn-down', () => handleInput(0, 1));
bindBtn('btn-left', () => handleInput(-1, 0)); bindBtn('btn-right', () => handleInput(1, 0));
bindBtn('btn-fix', () => { if(gameState === 'PLAY') handleFix(); });

function launchGame() {
    initAudio(); 
    document.getElementById('start-overlay').style.display = 'none'; document.getElementById('skill-tree-overlay').style.display = 'none';
    level = selectedCheckpoint; wrenchesEarnedThisRun = 0; calculateStats(); 
    felix.shieldActive = statShieldUnlocked; felix.shieldRegenTimer = 0; felix.lastSwingTime = 0;
    initLevel(); gameState = 'PLAY'; startMusic();
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

calculateStats(); drawRender(); loop();
