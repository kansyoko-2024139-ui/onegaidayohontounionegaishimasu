// ==========================================
// 🌙 SOMNUS - メインJS 完全版
// （優先度高め + 中 + 低優先度 全改善反映）
// ==========================================

const IS_DEBUG_FAST_MODE = false;
const RECORD_INTERVAL = IS_DEBUG_FAST_MODE ? 1000 : 60000;
const ENABLE_DEBUG_PANEL =false;   // 本番では false に変更

// ==========================================
// キャラクター定義（拡張）
// ==========================================
const CHARACTERS = [
    {
        id: 'ohiruneinu',
        name: 'おひるねいぬ',
        image: 'img/ohiruneinu.jpg',
        unlockSlee: 0, minRank: null, rarity: 'common', chance: 28, realm: 'mist', isLottie: false
    },
    {
        id: 'suyasuyapanda',
        name: 'すやすやぱんだ',
        image: 'img/suyasuyapanda.jpg',
        unlockSlee: 0, minRank: null, rarity: 'common', chance: 22, realm: 'mist', isLottie: false
    },
    {
        id: 'komorifukuro',
        name: 'こもりふくろう',
        image: 'img/komorifukuro.jpg',
        unlockSlee: 0, minRank: 'C', rarity: 'common', chance: 18, realm: 'well', isLottie: false
    },
    {
        id: 'hitsujikumo',
        name: 'ひつじぐも',
        image: 'img/hitsujikumo.jpg',
        unlockSlee: 20, minRank: 'C', rarity: 'uncommon', chance: 14, realm: 'echo', isLottie: false
    },
    {
        id: 'hamunemuri',
        name: 'モルねむり',
        image: 'img/hamunemuri.jpg',
        unlockSlee: 0, minRank: null, rarity: 'common', chance: 16, realm: 'echo', isLottie: false
    },
    {
        id: 'tsukiyozaru',
        name: 'つきよざる',
        image: 'img/tsukiyozaru.jpg',
        unlockSlee: 0, minRank: 'C', rarity: 'common', chance: 18, realm: 'corridor', isLottie: false
    },
    {
        id: 'tsukikage',
        name: 'つきかげうさぎ',
        image: 'img/tsukikage.jpg',
        unlockSlee: 80, minRank: 'A', rarity: 'rare', chance: 8, realm: 'corridor', isLottie: false
    },
    {
        id: 'ginnoika',
        name: 'ぎんのしか',
        image: 'img/ginnoika.jpg',
        unlockSlee: 60, minRank: 'B', rarity: 'uncommon', chance: 11, realm: 'corridor', isLottie: false
    },
    {
        id: 'tsukipenguin',
        name: 'つきよペンギン',
        image: 'img/tsukipenguin.jpg',
        unlockSlee: 40, minRank: 'B', rarity: 'uncommon', chance: 12, realm: 'corridor', isLottie: false
    },
    {
        id: 'hoshiboshi',
        name: 'ほしぼしねこ',
        image: 'img/hoshiboshi.jpg',
        unlockSlee: 0, minRank: 'A', rarity: 'rare', chance: 10, realm: 'abyss', isLottie: false
    },
    {
        id: 'yumemidori',
        name: 'ゆめみどり',
        image: 'img/yumemidori.jpg',
        unlockSlee: 50, minRank: 'B', rarity: 'uncommon', chance: 12, realm: 'abyss', isLottie: false
    },
    {
        id: 'yorunokitsune',
        name: 'よるのきつね',
        image: 'img/yorunokitsune.jpg',
        unlockSlee: 70, minRank: 'A', rarity: 'rare', chance: 8, realm: 'abyss', isLottie: false
    },
    {
        id: 'yumekurage',
        name: 'ゆめくらげ',
        image: 'img/yumekurage.jpg',
        unlockSlee: 120, minRank: 'A', rarity: 'rare', chance: 6, realm: 'abyss', isLottie: false
    },
    {
        id: 'hoshikuma',
        name: 'ほしとら',
        image: 'img/hoshikuma.jpg',
        unlockSlee: 150, minRank: 'S', rarity: 'legendary', chance: 4, realm: 'abyss', isLottie: false
    },
    {
        id: 'seiunryu',
        name: 'せいうんりゅう',
        image: 'img/seiunryu.jpg',
        unlockSlee: 200, minRank: 'S', rarity: 'legendary', chance: 3, realm: 'abyss', isLottie: false
    }
];


const REALMS = {
    mist: {
        id: 'mist',
        name: '境界の霧',
        short: '霧',
        desc: '薄い霧と静かな星。基本の仲間が集まりやすい次元です。'
    },
    abyss: {
        id: 'abyss',
        name: '星海の深淵',
        short: '星海',
        desc: '濃い青紫の海。深い眠りのあとに開き、レアが現れやすくなります。'
    },
    corridor: {
        id: 'corridor',
        name: '月影の回廊',
        short: '月影',
        desc: '銀色の光と長い影。満月の良い眠りで開き、月の仲間が寄りやすいです。'
    },
    well: {
        id: 'well',
        name: '常夜の井戸',
        short: '常夜',
        desc: '新月の底。光が細く、影の仲間が集まりやすい次元です。'
    },
    echo: {
        id: 'echo',
        name: '残響の庭',
        short: '残響',
        desc: '連続した眠りの余韻。やわらかい光粒が浮かぶ庭です。'
    }
};

// ==========================================
// 状態管理
// ==========================================
let startTime = null;
let timeoutId = null;
let elapsedTime = 0;
let isRunning = false;
let hasSlept = false;
let lastSleepRank = null;
let sleepChartInstance = null;

let minuteTimelineData = [];
let currentMinuteVibCount = 0;
let timelineIntervalId = null;

let watchId = null;
let vibrationCount = 0;
let lastVibrationTime = 0;
let lastSensorActiveTime = 0;

let lastX = null, lastY = null, lastZ = null, lastMagnitude = null;

const SENSOR_FREQUENCY = 1000;
const MOVEMENT_THRESHOLD = 0.32;
const LINEAR_THRESHOLD = 0.75;
const DEBOUNCE_MS = 1500;
const GRAVITY = 9.81;
const ERROR_THRESHOLD_MS = IS_DEBUG_FAST_MODE ? 30000 : (6 * 60 * 60 * 1000);

let currentSlee = 0;
let currentStreak = 0;
let lastSleepDate = null;
let currentRealm = 'mist';
let lastRealmReason = '';
let debugTideOverride = null;
let realmTicket = null;
let inventory = { mist_lamp: 0, abyss_drop: 0, moon_bookmark: 0, well_ink: 0, echo_seed: 0, reroll_bell: 0 };
let orbSkin = 'default';
let ownedOrbs = ['default'];
let ownedFurnishings = [];
let plazaInscription = '';
let pendingDreamNote = '';
let pendingMood = '';
let lastSavedRecordAt = 0;
let morningRiteDone = false;

// テーマ手動上書き（null = 自動）
let manualTheme = null;

// 広場カメラ
let plazaScale = 1.0;
let plazaOffsetX = 0;
let plazaOffsetY = 0;
const PLAZA_MIN_SCALE = 0.6;
const PLAZA_MAX_SCALE = 2.0;
const PLAZA_MAX_OFFSET = 380;
let plazaField = null;
let plazaWrapper = null;
let isPanning = false;
let lastTouchX = 0, lastTouchY = 0;
let initialPinchDistance = 0;
let initialScale = 1;
let currentPlazaCharacters = [];

const STORAGE_HAS_SLEPT   = 'somnus_has_slept';
const STORAGE_LAST_RANK   = 'somnus_last_sleep_rank';
const STORAGE_PLAZA_CHARS = 'somnus_plaza_characters';
const DEX_STORAGE_KEY     = 'somnus_character_dex';
const STORAGE_STREAK      = 'somnus_streak';
const STORAGE_LAST_DATE   = 'somnus_last_sleep_date';
const STORAGE_MANUAL_THEME = 'somnus_manual_theme';
const STORAGE_REALM = 'somnus_current_realm';
const STORAGE_INVENTORY = 'somnus_inventory';
const STORAGE_ORB_SKIN = 'somnus_orb_skin';
const STORAGE_OWNED_ORBS = 'somnus_owned_orbs';
const STORAGE_REALM_TICKET = 'somnus_realm_ticket';
const STORAGE_FURNISHINGS = 'somnus_furnishings';
const STORAGE_INSCRIPTION = 'somnus_inscription';
const STORAGE_REALM_REASON = 'somnus_realm_reason';

let enterBtn, startBtn, stopBtn, display, resultTime, backToHomeBtn, viewSleep;
let resultVibrationCount, resultStatusText, resultComment, resultRankText;
let screenHome, screenPlaza, screenMain, screenHistory, screenDex;
let plazaClockTrigger, historyListContainer;
let tabPlazaBtn, tabHistoryBtn, historyTabPlazaBtn, historyTabHistoryBtn;
let characterArea, plazaStatusText;
let abortModal, modalCancelBtn, modalConfirmBtn;
let pendingTargetScreenId = null;
let rewardSleeBox, rewardSleeText;
let streakDisplay = null;

const innerViews = {};
const navButtons = {};

// ==========================================
// 画面スリープ防止
// ==========================================
function keepScreenAwake() {
    try {
        if (window.plugins && window.plugins.insomnia) {
            window.plugins.insomnia.keepAwake();
        }
    } catch (e) {}
}
function allowScreenSleep() {
    try {
        if (window.plugins && window.plugins.insomnia) {
            window.plugins.insomnia.allowSleepAgain();
        }
    } catch (e) {}
}

// ==========================================
// 永続化
// ==========================================
function savePlazaState() {
    try {
        localStorage.setItem(STORAGE_HAS_SLEPT, hasSlept ? '1' : '0');
        localStorage.setItem(STORAGE_LAST_RANK, lastSleepRank || '');
        const saveData = currentPlazaCharacters.map(item => ({
            id: item.char.id, left: item.left, top: item.top, scale: item.scale
        }));
        localStorage.setItem(STORAGE_PLAZA_CHARS, JSON.stringify(saveData));
    } catch (e) {}
}

function loadPlazaState() {
    try {
        hasSlept = localStorage.getItem(STORAGE_HAS_SLEPT) === '1';
        lastSleepRank = localStorage.getItem(STORAGE_LAST_RANK) || null;
        const raw = localStorage.getItem(STORAGE_PLAZA_CHARS);
        if (!raw) { currentPlazaCharacters = []; return; }
        const saved = JSON.parse(raw);
        if (!Array.isArray(saved)) { currentPlazaCharacters = []; return; }
        currentPlazaCharacters = saved.map(item => {
            const char = CHARACTERS.find(c => c.id === item.id);
            if (!char) return null;
            return { char, left: item.left, top: item.top, scale: item.scale };
        }).filter(Boolean);
    } catch (e) {
        currentPlazaCharacters = [];
        hasSlept = false;
        lastSleepRank = null;
    }
}

function loadStreak() {
    try {
        currentStreak = parseInt(localStorage.getItem(STORAGE_STREAK) || '0', 10);
        lastSleepDate = localStorage.getItem(STORAGE_LAST_DATE) || null;
    } catch (e) {
        currentStreak = 0;
        lastSleepDate = null;
    }
}

function saveStreak() {
    localStorage.setItem(STORAGE_STREAK, String(currentStreak));
    localStorage.setItem(STORAGE_LAST_DATE, lastSleepDate || '');
}

function updateStreakOnSuccess() {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    const prev = currentStreak;

    if (!lastSleepDate) {
        currentStreak = 1;
    } else {
        const last = new Date(lastSleepDate);
        const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) {
            // 同日は更新しない
        } else if (diffDays === 1) {
            currentStreak += 1;
        } else {
            currentStreak = 1;
        }
    }
    lastSleepDate = todayStr;
    saveStreak();
    updateStreakDisplay();
    if (currentStreak > prev && [3, 7, 14].includes(currentStreak)) {
        setTimeout(() => showStreakBlessing(currentStreak), 900);
    }
}

function getStreakBonus(streak) {
    if (streak >= 14) return 30;
    if (streak >= 7) return 20;
    if (streak >= 3) return 10;
    return 0;
}

function updateStreakDisplay() {
    document.querySelectorAll('.streak-amount').forEach(el => {
        el.textContent = currentStreak;
    });
}

// ==========================================
// DOM初期化
// ==========================================
function initDOMElements() {
    enterBtn = document.getElementById('enterBtn');
    startBtn = document.getElementById('startBtn');
    stopBtn = document.getElementById('stopBtn');
    display = document.getElementById('display');
    resultTime = document.getElementById('result-time');
    backToHomeBtn = document.getElementById('backToHomeBtn');
    viewSleep = document.getElementById('view-sleep');
    resultVibrationCount = document.getElementById('result-vibration-count');
    resultStatusText = document.getElementById('result-status-text');
    resultComment = document.getElementById('result-comment');
    resultRankText = document.getElementById('result-rank-text');
    screenHome = document.getElementById('screen-home');
    screenPlaza = document.getElementById('screen-plaza');
    screenMain = document.getElementById('screen-main');
    screenHistory = document.getElementById('screen-history');
    screenDex = document.getElementById('screen-dex');
    plazaClockTrigger = document.getElementById('plaza-clock-trigger');
    characterArea = document.getElementById('character-area');
    plazaStatusText = document.getElementById('plaza-status-text');
    plazaField = document.getElementById('plaza-field');
    plazaWrapper = document.getElementById('plaza-field-wrapper');
    innerViews.sleep = document.getElementById('view-sleep');
    innerViews.result = document.getElementById('view-result');
    navButtons.homePlaza = document.getElementById('nav-home-plaza');
    navButtons.homeMain = document.getElementById('nav-home-main');
    navButtons.backToPlaza = document.getElementById('nav-back-to-plaza');
    abortModal = document.getElementById('abort-modal');
    modalCancelBtn = document.getElementById('modal-cancel-btn');
    modalConfirmBtn = document.getElementById('modal-confirm-btn');
    historyListContainer = document.getElementById('history-list-container');
    tabPlazaBtn = document.getElementById('tab-plaza-btn');
    tabHistoryBtn = document.getElementById('tab-history-btn');
    historyTabPlazaBtn = document.getElementById('history-tab-plaza-btn');
    historyTabHistoryBtn = document.getElementById('history-tab-history-btn');
    rewardSleeBox = document.getElementById('reward-slee-box');
    rewardSleeText = document.getElementById('reward-slee-text');

    setupEventListeners();
    setupPlazaCamera();
    setupFullscreenKiller();
    loadSlee();
    loadPlazaState();
    loadStreak();
    loadRealm();
    applyPlazaTransform();
    applyRealmVisual();
    initCharacterDex();
    injectStreakUI();
    injectThemeToggle();
    setupDreamNoteUI();
    loadShopState();
    applyOrbSkin();

    if (ENABLE_DEBUG_PANEL) {
        initDebugPanel();
    } else {
        const toggleBtn = document.getElementById('debug-toggle-btn');
        const panel = document.getElementById('debug-panel');
        if (toggleBtn) toggleBtn.style.display = 'none';
        if (panel) panel.style.display = 'none';
    }

    // 手動テーマ復元
    try {
        manualTheme = localStorage.getItem(STORAGE_MANUAL_THEME) || null;
    } catch (e) {}
}

function injectStreakUI() {
    const bar = document.querySelector('.plaza-status-bar');
    if (bar && !document.getElementById('streak-display-plaza')) {
        const streakEl = document.createElement('div');
        streakEl.id = 'streak-display-plaza';
        streakEl.className = 'streak-display';
        streakEl.innerHTML = `<i class="fas fa-fire"></i> <span class="streak-amount">${currentStreak}</span><span class="streak-label">日</span>`;
        bar.appendChild(streakEl);
    }
    updateStreakDisplay();
}

function injectThemeToggle() {
    // ホーム画面にテーマ切替ボタンを追加
    const home = document.getElementById('screen-home');
    if (home && !document.getElementById('theme-toggle-btn')) {
        const btn = document.createElement('button');
        btn.id = 'theme-toggle-btn';
        btn.className = 'theme-toggle-btn';
        btn.innerHTML = '<i class="fas fa-palette"></i>';
        btn.title = 'テーマ切替';
        btn.addEventListener('click', cycleTheme);
        home.appendChild(btn);
    }
}

function cycleTheme() {
    const themes = [null, 'theme-sunrise', 'theme-day', 'theme-evening', 'theme-night', 'theme-midnight'];
    const currentIdx = themes.indexOf(manualTheme);
    const nextIdx = (currentIdx + 1) % themes.length;
    manualTheme = themes[nextIdx];
    try {
        if (manualTheme) localStorage.setItem(STORAGE_MANUAL_THEME, manualTheme);
        else localStorage.removeItem(STORAGE_MANUAL_THEME);
    } catch (e) {}
    updateTimeTheme();
}

function setupFullscreenKiller() {
    const exit = () => {
        if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
        if (document.webkitFullscreenElement) document.webkitExitFullscreen();
    };
    document.addEventListener('fullscreenchange', exit);
    document.addEventListener('webkitfullscreenchange', exit);
    document.addEventListener('webkitbeginfullscreen', exit);
}

function loadSlee() {
    currentSlee = parseInt(localStorage.getItem('slee_currency') || '0', 10);
    updateSleeDisplay();
}
function saveSlee() {
    localStorage.setItem('slee_currency', currentSlee);
}
function addSlee(amount) {
    if (amount <= 0) return;
    currentSlee += amount;
    saveSlee();
    updateSleeDisplay();
}
function updateSleeDisplay() {
    document.querySelectorAll('.slee-amount').forEach(el => {
        el.textContent = currentSlee.toLocaleString();
    });
}
function getRewardByRank(rank) {
    switch (rank) {
        case 'S': return 100;
        case 'A': return 70;
        case 'B': return 50;
        case 'C': return 30;
        case 'D': return 15;
        case 'E': return 5;
        default: return 0;
    }
}

function setupEventListeners() {
    if (enterBtn) enterBtn.addEventListener('click', () => switchScreen('screen-plaza'));
    if (plazaClockTrigger) {
        plazaClockTrigger.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            switchScreen('screen-main');
            switchMainInnerView('sleep');
        });
    }
    if (startBtn) startBtn.addEventListener('click', () => { if (!isRunning) startSleepTracking(); });
    if (stopBtn) stopBtn.addEventListener('click', () => stopSleepTracking(false));
    if (navButtons.homePlaza) {
        navButtons.homePlaza.addEventListener('click', () => {
            if (isRunning) handleNavigationWithInterrupt('screen-home');
            else switchScreen('screen-home');
        });
    }
    if (navButtons.backToPlaza) navButtons.backToPlaza.addEventListener('click', () => handleNavigationWithInterrupt('screen-plaza'));
    if (navButtons.homeMain) navButtons.homeMain.addEventListener('click', () => handleNavigationWithInterrupt('screen-home'));
    if (backToHomeBtn) backToHomeBtn.addEventListener('click', () => switchScreen('screen-plaza'));
    if (modalCancelBtn) {
        modalCancelBtn.addEventListener('click', () => {
            if (abortModal) abortModal.classList.remove('active');
            pendingTargetScreenId = null;
        });
    }
    if (modalConfirmBtn) {
        modalConfirmBtn.addEventListener('click', () => {
            stopVibrationSensor();
            isRunning = false;
            clearTimeout(timeoutId);
            allowScreenSleep();
            if (startBtn) startBtn.classList.remove('hidden');
            if (stopBtn) stopBtn.classList.add('hidden');
            if (display) display.textContent = '00:00:00';
            if (abortModal) abortModal.classList.remove('active');
            const target = pendingTargetScreenId;
            pendingTargetScreenId = null;
            if (target) switchScreen(target);
        });
    }
    if (tabPlazaBtn) tabPlazaBtn.addEventListener('click', () => handleNavigationWithInterrupt('screen-plaza'));
    if (tabHistoryBtn) tabHistoryBtn.addEventListener('click', () => handleNavigationWithInterrupt('screen-history'));
    if (historyTabPlazaBtn) historyTabPlazaBtn.addEventListener('click', () => switchScreen('screen-plaza'));
    if (historyTabHistoryBtn) historyTabHistoryBtn.addEventListener('click', () => switchScreen('screen-history'));
    const navHomeMoon = document.getElementById('nav-home-moon');
    if (navHomeMoon) navHomeMoon.addEventListener('click', () => handleNavigationWithInterrupt('screen-home'));
    const navHomeShop = document.getElementById('nav-home-shop');
    if (navHomeShop) navHomeShop.addEventListener('click', () => handleNavigationWithInterrupt('screen-home'));
    const plazaShopBtn = document.getElementById('plaza-shop-btn');
    if (plazaShopBtn) plazaShopBtn.addEventListener('click', () => handleNavigationWithInterrupt('screen-shop'));
    document.querySelectorAll('.bottom-tab-bar .tab-btn').forEach(btn => {
        if (btn.dataset.tabWired) return;
        btn.dataset.tabWired = '1';
        btn.addEventListener('click', e => {
            const target = btn.dataset.tabTarget;
            if (!target) return;
            e.preventDefault();
            handleNavigationWithInterrupt(target);
        });
    });
}

function handleNavigationWithInterrupt(targetScreenId) {
    if (isRunning) {
        pendingTargetScreenId = targetScreenId;
        if (abortModal) abortModal.classList.add('active');
    } else {
        switchScreen(targetScreenId);
    }
}

function startSleepTracking() {
    if (isRunning) return;
    showSleepStartOverlay(() => {
        isRunning = true;
        startTime = Date.now();
        elapsedTime = 0;
        vibrationCount = 0;
        minuteTimelineData = [];
        currentMinuteVibCount = 0;
        clearTimeout(timeoutId);
        keepScreenAwake();
        startVibrationSensor();
        if (startBtn) startBtn.classList.add('hidden');
        if (stopBtn) stopBtn.classList.remove('hidden');
        if (viewSleep) viewSleep.classList.add('detecting');
        pendingDreamNote = '';
        pendingMood = '';
        const noteInput = document.getElementById('dream-note-input');
        if (noteInput) noteInput.value = '';
        setActiveMood('');
        countUp();
    });
}

function showSleepStartOverlay(onComplete) {
    const old = document.getElementById('sleep-start-overlay');
    if (old) old.remove();
    const overlay = document.createElement('div');
    overlay.id = 'sleep-start-overlay';
    overlay.className = 'sleep-start-overlay';
    overlay.innerHTML = `
        <div class="sleep-start-content">
            <div class="sleep-start-icon"><i class="fas fa-moon"></i></div>
            <div class="sleep-start-title">計測を開始します</div>
            <div class="sleep-start-sub">穏やかな眠りをお過ごしください</div>
        </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('visible'));
    setTimeout(() => {
        overlay.classList.remove('visible');
        overlay.classList.add('hiding');
        setTimeout(() => {
            overlay.remove();
            if (typeof onComplete === 'function') onComplete();
        }, 400);
    }, 1600);
}

function setupPlazaCamera() {
    if (!plazaWrapper || !plazaField) return;
    plazaWrapper.addEventListener('touchstart', onPlazaTouchStart, { passive: false });
    plazaWrapper.addEventListener('touchmove', onPlazaTouchMove, { passive: false });
    plazaWrapper.addEventListener('touchend', onPlazaTouchEnd, { passive: false });
    plazaWrapper.addEventListener('touchcancel', onPlazaTouchEnd, { passive: false });
}

function applyPlazaTransform() {
    if (!plazaField) return;
    plazaField.style.transform = `translate(calc(-50% + ${plazaOffsetX}px), calc(-50% + ${plazaOffsetY}px)) scale(${plazaScale})`;
}

function clampPlazaCamera() {
    plazaScale = Math.max(PLAZA_MIN_SCALE, Math.min(PLAZA_MAX_SCALE, plazaScale));
    const maxOff = PLAZA_MAX_OFFSET * plazaScale;
    plazaOffsetX = Math.max(-maxOff, Math.min(maxOff, plazaOffsetX));
    plazaOffsetY = Math.max(-maxOff, Math.min(maxOff, plazaOffsetY));
}

function getTouchDistance(t1, t2) {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

function onPlazaTouchStart(e) {
    if (e.target.closest('.cosmic-clock-orb') || e.target.closest('.character-instance')) return;
    e.preventDefault();
    if (e.touches.length === 1) {
        isPanning = true;
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
        isPanning = false;
        initialPinchDistance = getTouchDistance(e.touches[0], e.touches[1]);
        initialScale = plazaScale;
    }
}

function onPlazaTouchMove(e) {
    if (e.target.closest('.cosmic-clock-orb') || e.target.closest('.character-instance')) return;
    e.preventDefault();
    if (e.touches.length === 1 && isPanning) {
        const dx = e.touches[0].clientX - lastTouchX;
        const dy = e.touches[0].clientY - lastTouchY;
        plazaOffsetX += dx;
        plazaOffsetY += dy;
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
        clampPlazaCamera();
        applyPlazaTransform();
    } else if (e.touches.length === 2) {
        const dist = getTouchDistance(e.touches[0], e.touches[1]);
        if (initialPinchDistance > 0) {
            plazaScale = initialScale * (dist / initialPinchDistance);
            clampPlazaCamera();
            applyPlazaTransform();
        }
    }
}

function onPlazaTouchEnd(e) {
    if (e.touches.length === 0) {
        isPanning = false;
        initialPinchDistance = 0;
    } else if (e.touches.length === 1) {
        isPanning = true;
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
    }
}

function resetPlazaCamera() {
    plazaScale = 1.0;
    plazaOffsetX = 0;
    plazaOffsetY = 0;
    applyPlazaTransform();
}

function startVibrationSensor() {
    vibrationCount = 0;
    currentMinuteVibCount = 0;
    minuteTimelineData = [];
    lastVibrationTime = Date.now();
    lastSensorActiveTime = Date.now();
    lastX = lastY = lastZ = lastMagnitude = null;
    const options = { frequency: SENSOR_FREQUENCY };
    if (typeof navigator !== 'undefined' && navigator.accelerometer) {
        try {
            watchId = navigator.accelerometer.watchAcceleration(onAccelerationSuccess, onAccelerationError, options);
        } catch (e) {}
    }
    timelineIntervalId = setInterval(() => {
        if (!isRunning) return;
        if (typeof navigator === 'undefined' || !navigator.accelerometer) {
            const mockIndex = minuteTimelineData.length;
            if (mockIndex < 8) currentMinuteVibCount = Math.random() > 0.6 ? 1 : 0;
            else if (mockIndex < 40) currentMinuteVibCount = Math.random() > 0.85 ? 2 : 0;
            else currentMinuteVibCount = Math.random() > 0.5 ? 3 : 1;
            lastSensorActiveTime = Date.now();
        }
        let depthLevel = 2;
        if (currentMinuteVibCount >= 4) depthLevel = 0;
        else if (currentMinuteVibCount >= 2) depthLevel = 1;
        else if (currentMinuteVibCount === 1) depthLevel = Math.random() > 0.4 ? 1 : 2;
        else depthLevel = 2;
        minuteTimelineData.push(depthLevel);
        currentMinuteVibCount = 0;
        if (Date.now() - lastSensorActiveTime >= ERROR_THRESHOLD_MS) stopSleepTracking(true);
    }, RECORD_INTERVAL);
}

function stopVibrationSensor() {
    if (watchId !== null && typeof navigator !== 'undefined' && navigator.accelerometer) {
        try { navigator.accelerometer.clearWatch(watchId); } catch (e) {}
        watchId = null;
    }
    if (timelineIntervalId) {
        clearInterval(timelineIntervalId);
        timelineIntervalId = null;
    }
    if (viewSleep) viewSleep.classList.remove('detecting');
}

function onAccelerationSuccess(acceleration) {
    const x = acceleration.x, y = acceleration.y, z = acceleration.z;
    const currentTime = Date.now();
    lastSensorActiveTime = currentTime;
    const magnitude = Math.sqrt(x * x + y * y + z * z);
    const linearMag = Math.abs(magnitude - GRAVITY);
    if (lastMagnitude !== null) {
        const delta = Math.abs(magnitude - lastMagnitude);
        const isMovement = (delta > MOVEMENT_THRESHOLD) || (linearMag > LINEAR_THRESHOLD);
        const isDebounced = (currentTime - lastVibrationTime > DEBOUNCE_MS);
        if (isMovement && isDebounced) {
            vibrationCount++;
            currentMinuteVibCount++;
            lastVibrationTime = currentTime;
            if (viewSleep) {
                viewSleep.classList.add('detecting');
                setTimeout(() => { if (viewSleep) viewSleep.classList.remove('detecting'); }, 300);
            }
        }
    }
    lastMagnitude = magnitude;
    lastX = x; lastY = y; lastZ = z;
}

function onAccelerationError(error) {}

function generateSleepReport(isErrorStop = false) {
    if (!resultVibrationCount) return;
    resultVibrationCount.textContent = `${vibrationCount} 回`;
    if (resultRankText) {
        resultRankText.style.color = 'inherit';
        resultRankText.style.webkitTextFillColor = 'inherit';
    }
    if (rewardSleeBox) rewardSleeBox.classList.add('hidden');

    if (isErrorStop) {
        hasSlept = false;
        lastSleepRank = null;
        resultRankText.textContent = 'ERR';
        resultRankText.style.background = 'linear-gradient(135deg, #ef4444, #991b1b)';
        resultRankText.style.webkitBackgroundClip = 'text';
        resultRankText.style.webkitTextFillColor = 'transparent';
        resultStatusText.textContent = '測定エラー（放置検知）';
        resultStatusText.style.color = '#ef4444';
        resultTime.textContent = '00:00:00';
        resultComment.textContent = '【エラー】長時間（6時間以上）アプリの動作が確認できませんでした。正しい睡眠データが取得できないため、記録を無効にします。';
        showRealmOnResult(currentRealm, '測定エラーのため、次元は更新されませんでした');
        updateWakeHero(currentRealm, 'E', 0);
        resetMorningRite(false);
        buildSleepChart(-1, -1);
        savePlazaState();
        return;
    }

    const actualElapsedMs = startTime ? Date.now() - startTime : 0;
    if (minuteTimelineData.length === 0) minuteTimelineData = [2];

    let sleepStartIndex = 0;
    let continuousQuietCount = 0;
    for (let i = 0; i < minuteTimelineData.length; i++) {
        if (minuteTimelineData[i] === 2) {
            continuousQuietCount++;
            if (continuousQuietCount >= 5) { sleepStartIndex = i - 4; break; }
        } else continuousQuietCount = 0;
    }

    let sleepEndIndex = minuteTimelineData.length - 1;
    let continuousWakeCount = 0;
    for (let i = minuteTimelineData.length - 1; i >= sleepStartIndex; i--) {
        if (minuteTimelineData[i] === 0 || minuteTimelineData[i] === 1) {
            continuousWakeCount++;
            if (continuousWakeCount >= 8) { sleepEndIndex = i; break; }
        } else continuousWakeCount = 0;
    }

    if (sleepStartIndex >= sleepEndIndex || (sleepEndIndex - sleepStartIndex) < 1) {
        sleepStartIndex = 0;
        sleepEndIndex = minuteTimelineData.length - 1;
    }

    const excludedMinutes = sleepStartIndex + (minuteTimelineData.length - 1 - sleepEndIndex);
    let finalSleepMs = actualElapsedMs - (excludedMinutes * 60000);
    if (finalSleepMs < 0) finalSleepMs = actualElapsedMs;

    resultTime.textContent = formatTime(finalSleepMs);
    const timeDetail = document.getElementById('result-time-detail');
    if (timeDetail) timeDetail.textContent = formatTime(finalSleepMs);
    const displayHours = finalSleepMs / 3600000;

    let timeRank = 'E';
    if (displayHours >= 7.0 && displayHours <= 10.0) timeRank = 'S';
    else if ((displayHours >= 6.0 && displayHours < 7.0) || (displayHours > 10.0 && displayHours <= 11.5)) timeRank = 'A';
    else if ((displayHours >= 5.0 && displayHours < 6.0) || (displayHours > 11.5 && displayHours <= 13.0)) timeRank = 'B';
    else if ((displayHours >= 4.0 && displayHours < 5.0) || (displayHours > 13.0 && displayHours <= 14.0)) timeRank = 'C';
    else if (displayHours >= 3.0 && displayHours < 4.0) timeRank = 'D';
    if (displayHours > 14.0) timeRank = 'D';
    if (displayHours < 3.0) timeRank = 'E';

    let vibRank = 'E';
    if (vibrationCount >= 12 && vibrationCount <= 40) vibRank = 'S';
    else if ((vibrationCount >= 8 && vibrationCount <= 11) || (vibrationCount >= 41 && vibrationCount <= 50)) vibRank = 'A';
    else if ((vibrationCount >= 5 && vibrationCount <= 7) || (vibrationCount >= 51 && vibrationCount <= 60)) vibRank = 'B';
    else if ((vibrationCount >= 2 && vibrationCount <= 4) || (vibrationCount >= 61 && vibrationCount <= 75)) vibRank = 'C';
    else if (vibrationCount === 1 || vibrationCount >= 76) vibRank = 'D';

    const rankOrder = ['S', 'A', 'B', 'C', 'D', 'E'];
    const finalRankIndex = Math.floor((rankOrder.indexOf(timeRank) + rankOrder.indexOf(vibRank)) / 2);
    let finalRank = rankOrder[finalRankIndex];
    if (displayHours < 3.0) finalRank = 'E';

    resultRankText.textContent = finalRank;
    resultStatusText.innerHTML = `時間: ${timeRank} / 寝返り: ${vibRank}`;
    resultStatusText.style.color = 'inherit';
    setRankVisual(finalRank);

    if (resultComment) resultComment.textContent = buildWakeComment(finalRank, displayHours);

    hasSlept = finalRank !== 'E';
    lastSleepRank = finalRank;

    const decided = decideRealm(finalRank, displayHours, currentStreak);
    setCurrentRealm(decided.id, decided.reason);
    showRealmOnResult(decided.id, decided.reason);
    updateWakeHero(decided.id, finalRank, displayHours);
    resetMorningRite(false);

    // 報酬 + ストリーク + 月の加護
    let reward = getRewardByRank(finalRank);
    let streakBonus = 0;
    let moonBonus = 0;
    if (hasSlept) {
        updateStreakOnSuccess();
        streakBonus = getStreakBonus(currentStreak);
        moonBonus = getMoonBlessingBonus(finalRank);
        reward += streakBonus + moonBonus;
    }

    if (reward > 0) {
        addSlee(reward);
        showEnhancedReward(reward, streakBonus, moonBonus);
    }

    updateTideUI();
    if (hasSlept && shouldPlayRealmReveal(decided.id)) {
        showRealmRevealOverlay(decided.id);
    }

    saveSleepRecord(finalRank, resultTime.textContent, vibrationCount);
    buildSleepChart(sleepStartIndex, sleepEndIndex);

    if (hasSlept) updatePlazaCharacterState(true);
    else savePlazaState();
}

function showEnhancedReward(amount, streakBonus = 0, moonBonus = 0) {
    if (!rewardSleeBox || !rewardSleeText) return;
    let text = `+${amount} スリー 獲得！`;
    const extras = [];
    if (streakBonus > 0) extras.push(`連続${currentStreak}日 +${streakBonus}`);
    if (moonBonus > 0) extras.push(`月の加護 +${moonBonus}`);
    if (extras.length) text += ` (${extras.join(' / ')})`;
    rewardSleeText.textContent = text;
    rewardSleeBox.classList.remove('hidden');
    rewardSleeBox.classList.remove('reward-pop-strong');
    void rewardSleeBox.offsetWidth;
    rewardSleeBox.classList.add('reward-pop-strong');
    createRewardParticles();
}

function createRewardParticles() {
    if (!rewardSleeBox) return;
    const rect = rewardSleeBox.getBoundingClientRect();
    for (let i = 0; i < 8; i++) {
        const p = document.createElement('div');
        p.className = 'reward-particle';
        p.textContent = '✦';
        p.style.left = (rect.left + rect.width / 2) + 'px';
        p.style.top = (rect.top + rect.height / 2) + 'px';
        p.style.setProperty('--tx', (Math.random() - 0.5) * 120 + 'px');
        p.style.setProperty('--ty', (-40 - Math.random() * 60) + 'px');
        p.style.animationDelay = (Math.random() * 0.15) + 's';
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 1200);
    }
}

function downsampleSleepFlow(data, buckets = 12) {
    if (!data.length) return [];
    const size = Math.max(1, Math.ceil(data.length / buckets));
    const out = [];
    for (let i = 0; i < data.length; i += size) {
        const slice = data.slice(i, i + size);
        const counts = [0, 0, 0];
        slice.forEach(v => {
            const n = (v === 2 || v === 1 || v === 0) ? v : 1;
            counts[n]++;
        });
        out.push(counts.indexOf(Math.max(...counts)));
    }
    return out.slice(0, buckets);
}

function buildSleepChart(startIndex, endIndex) {
    const track = document.getElementById('sleep-flow-track');
    const summary = document.getElementById('sleep-flow-summary');
    const ctx = document.getElementById('sleepChart');
    if (sleepChartInstance) {
        try { sleepChartInstance.destroy(); } catch (e) {}
        sleepChartInstance = null;
    }
    if (!track) return;

    const isError = startIndex === -1;
    const source = (!minuteTimelineData || minuteTimelineData.length === 0) ? [1] : minuteTimelineData;
    const blocks = isError ? Array(12).fill(-1) : downsampleSleepFlow(source, 12);

    track.innerHTML = '';
    blocks.forEach(val => {
        const bar = document.createElement('span');
        bar.className = 'sleep-flow-bar ' + (
            val === 2 ? 'is-deep' : val === 1 ? 'is-light' : val === 0 ? 'is-wake' : 'is-error'
        );
        track.appendChild(bar);
    });

    if (summary) {
        if (isError) {
            summary.textContent = '測定エラーのため、流れは表示できません';
        } else {
            const deep = source.filter(v => v === 2).length;
            const light = source.filter(v => v === 1).length;
            const wake = source.filter(v => v === 0).length;
            const total = Math.max(1, source.length);
            summary.textContent = `深い ${Math.round(deep / total * 100)}%  /  うとうと ${Math.round(light / total * 100)}%  /  起きがち ${Math.round(wake / total * 100)}%`;
        }
    }
    if (ctx && ctx.parentElement) ctx.parentElement.classList.add('hidden');
}

function switchScreen(targetScreenId) {
    const screens = ['screen-home', 'screen-plaza', 'screen-main', 'screen-history', 'screen-dex', 'screen-moon', 'screen-shop'];
    screens.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    if (targetScreenId === 'screen-plaza') {
        persistDreamNoteIfNeeded();
        applyRealmVisual();
        updatePlazaCharacterState();
        resetPlazaCamera();
        updateStreakDisplay();
        updatePlazaRealmBadge();
        applyOrbSkin();
        applyPlazaDecor();
        updateTicketChip();
    }
    if (targetScreenId === 'screen-history') renderHistoryList();
    if (targetScreenId === 'screen-dex') renderDex();
    if (targetScreenId === 'screen-moon') renderMoonScreen();
    if (targetScreenId === 'screen-shop') renderShop();
    const target = document.getElementById(targetScreenId);
    if (target) target.classList.remove('hidden');
    updateTabState(targetScreenId);
    updateSleeDisplay();
}

function updateTabState(forceScreenId) {
    let current = forceScreenId;
    if (!current) {
        current = ['screen-home', 'screen-plaza', 'screen-main', 'screen-history', 'screen-dex', 'screen-moon']
            .find(id => {
                const el = document.getElementById(id);
                return el && !el.classList.contains('hidden');
            });
    }
    document.querySelectorAll('.bottom-tab-bar .tab-btn').forEach(btn => btn.classList.remove('active'));
    if (!current) return;
    document.querySelectorAll(`.bottom-tab-bar .tab-btn[data-tab-target="${current}"]`).forEach(btn => btn.classList.add('active'));
    if (current === 'screen-dex') {
        document.querySelectorAll('.bottom-tab-bar .tab-btn').forEach(btn => {
            if (btn.textContent.includes('図鑑')) btn.classList.add('active');
        });
    }
}

function isRankAtLeast(rankA, rankB) {
    if (!rankA || !rankB) return false;
    const order = ['S', 'A', 'B', 'C', 'D', 'E'];
    return order.indexOf(rankA) <= order.indexOf(rankB);
}

function getCharacterWeight(char) {
    let w = char.chance || 1;
    const tide = getMoonTide();

    if (currentRealm === 'corridor') {
        if (char.realm === 'corridor') w *= 3.1;
        if (char.rarity === 'rare' || char.rarity === 'legendary') w *= 1.45;
        if (char.realm === 'mist') w *= 0.5;
        if (char.realm === 'abyss') w *= 0.75;
    } else if (currentRealm === 'abyss') {
        if (char.realm === 'abyss') w *= 2.6;
        if (char.rarity === 'legendary') w *= 2.1;
        else if (char.rarity === 'rare') w *= 1.8;
        if (char.realm === 'mist') w *= 0.45;
    } else if (currentRealm === 'well') {
        if (char.realm === 'well') w *= 3.2;
        if (char.realm === 'mist') w *= 1.3;
        if (char.rarity === 'legendary') w *= 0.45;
    } else if (currentRealm === 'echo') {
        if (char.realm === 'echo') w *= 3.0;
        if (char.realm === 'mist') w *= 1.2;
        if (char.rarity === 'uncommon') w *= 1.3;
    } else {
        if (char.realm === 'mist') w *= 1.4;
        if (char.rarity === 'legendary') w *= 0.7;
    }

    if (tide.key === 'full') {
        if (char.realm === 'corridor') w *= 1.8;
        if (char.rarity === 'rare' || char.rarity === 'legendary') w *= 1.25;
    } else if (tide.key === 'near') {
        if (char.realm === 'corridor') w *= 1.35;
    } else if (tide.key === 'new') {
        if (char.realm === 'mist') w *= 1.6;
        if (char.rarity === 'legendary') w *= 0.35;
        if (char.rarity === 'rare') w *= 0.7;
    }
    return w;
}

function pickWeightedCharacter(available) {
    if (!available.length) return null;
    const totalChance = available.reduce((sum, c) => sum + getCharacterWeight(c), 0);
    let random = Math.random() * totalChance;
    for (const char of available) {
        random -= getCharacterWeight(char);
        if (random <= 0) return char;
    }
    return available[0];
}

function updatePlazaCharacterState(forceNew = false) {
    if (!characterArea || !plazaStatusText) return;
    characterArea.innerHTML = '';
    if (!hasSlept) {
        currentPlazaCharacters = [];
        updatePlazaStatusEmpty();
        savePlazaState();
        return;
    }
    if (!forceNew && currentPlazaCharacters.length > 0) {
        restorePlazaCharacters();
        return;
    }
    const available = CHARACTERS.filter(c => {
        if (currentSlee < c.unlockSlee) return false;
        if (c.minRank && !isRankAtLeast(lastSleepRank, c.minRank)) return false;
        return true;
    });
    if (!available.length) {
        currentPlazaCharacters = [];
        updatePlazaStatusEmpty();
        savePlazaState();
        return;
    }
    const count = Math.floor(Math.random() * 4) + 3;
    const selectedList = [];
    for (let i = 0; i < count; i++) {
        const char = pickWeightedCharacter(available);
        if (char) selectedList.push(char);
    }
    ensureRealmAffinitySpawn(selectedList, available);
    const positions = [];
    for (let i = 0; i < selectedList.length; i++) {
        let attempts = 0;
        let pos;
        do {
            pos = { left: 18 + Math.random() * 64, top: 18 + Math.random() * 58 };
            attempts++;
            const dx = pos.left - 50;
            const dy = pos.top - 50;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const inForbidden = dist < 22;
            const tooClose = positions.some(p => Math.abs(p.left - pos.left) < 12 && Math.abs(p.top - pos.top) < 15);
            if (!inForbidden && !tooClose) break;
        } while (attempts < 30);
        positions.push(pos);
    }
    currentPlazaCharacters = selectedList.map((char, index) => ({
        char, left: positions[index].left, top: positions[index].top, scale: 0.75 + Math.random() * 0.3
    }));
    restorePlazaCharacters();
    selectedList.forEach(char => registerCharacterToDex(char.id));
    savePlazaState();
}

function restorePlazaCharacters() {
    if (!characterArea || !plazaStatusText) return;
    characterArea.innerHTML = '';
    if (currentPlazaCharacters.length === 0) {
        updatePlazaStatusEmpty();
        return;
    }
    currentPlazaCharacters.forEach(item => {
        const { char, left, top, scale } = item;
        const instance = document.createElement('div');
        instance.className = 'character-instance';
        instance.style.left = `${left}%`;
        instance.style.top = `${top}%`;
        instance.style.transform = `scale(${scale})`;
        instance.style.pointerEvents = 'auto';
        instance.style.cursor = 'pointer';

        if (char.isLottie) {
            const lottieContainer = document.createElement('div');
            lottieContainer.className = 'lottie-container sleepy-dog';
            lottieContainer.style.width = '100px';
            lottieContainer.style.height = '100px';
            instance.appendChild(lottieContainer);
            if (typeof lottie !== 'undefined') {
                try {
                    const anim = lottie.loadAnimation({
                        container: lottieContainer, renderer: 'svg', loop: true, autoplay: true, path: char.image
                    });
                    anim.addEventListener('DOMLoaded', () => anim.play());
                } catch (e) {}
            }
        } else {
            const img = document.createElement('img');
            img.className = 'sleepy-dog';
            img.src = char.image;
            img.alt = char.name;
            instance.appendChild(img);
        }

        const zzz = document.createElement('div');
        zzz.className = 'zzz-effect';
        zzz.innerHTML = '<span>z</span><span>z</span><span>Z</span>';
        instance.appendChild(zzz);

        const tag = document.createElement('div');
        tag.className = 'character-tag';
        tag.textContent = char.name;
        instance.appendChild(tag);

        instance.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showCharacterDetail(char);
        });

        characterArea.appendChild(instance);
    });
    const realm = REALMS[currentRealm] || REALMS.mist;
    plazaStatusText.textContent = `${realm.name}に、${currentPlazaCharacters.length}匹の仲間がやってきた！`;
    plazaStatusText.style.color = '#ffe57f';
    updatePlazaRealmBadge();
}

function switchMainInnerView(targetViewKey) {
    Object.values(innerViews).forEach(view => { if (view) view.classList.add('hidden'); });
    if (innerViews[targetViewKey]) innerViews[targetViewKey].classList.remove('hidden');
}

function stopSleepTracking(isErrorStop = false) {
    if (!isRunning) return;
    isRunning = false;
    clearTimeout(timeoutId);
    stopVibrationSensor();
    allowScreenSleep();
    if (display) display.textContent = '00:00:00';
    if (startBtn) startBtn.classList.remove('hidden');
    if (stopBtn) stopBtn.classList.add('hidden');
    elapsedTime = 0;
    switchMainInnerView('result');
    try {
        generateSleepReport(isErrorStop);
    } catch (e) {
        if (resultComment) resultComment.textContent = 'レポートの生成中に問題が発生しました。';
    }
}

function countUp() {
    if (!isRunning) return;
    const currentDiff = Date.now() - startTime + elapsedTime;
    if (display) display.textContent = formatTime(currentDiff);
    timeoutId = setTimeout(countUp, 200);
}

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = num => String(num).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function updateTimeTheme() {
    const body = document.body;
    if (!body) return;
    body.classList.remove('theme-sunrise', 'theme-day', 'theme-evening', 'theme-night', 'theme-midnight');

    if (manualTheme) {
        body.classList.add(manualTheme);
        return;
    }

    const hour = new Date().getHours();
    if (hour >= 4 && hour < 7) body.classList.add('theme-sunrise');
    else if (hour >= 7 && hour < 16) body.classList.add('theme-day');
    else if (hour >= 16 && hour < 19) body.classList.add('theme-evening');
    else if (hour >= 19 && hour < 23) body.classList.add('theme-night');
    else body.classList.add('theme-midnight');
}

function saveSleepRecord(rank, timeStr, vibCount) {
    const now = new Date();
    const dateStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
    const newRecord = {
        date: dateStr,
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        rank, duration: timeStr, vibrations: vibCount,
        realm: currentRealm,
        note: pendingDreamNote || '',
        mood: pendingMood || '',
        rite: '',
        iso: now.toISOString(),
        durationMs: parseDurationToMs(timeStr),
        timeline: [...minuteTimelineData]
    };
    lastSavedRecordAt = now.getTime();
    let history = JSON.parse(localStorage.getItem('sleep_history')) || [];
    history.unshift(newRecord);
    if (history.length > 50) history = history.slice(0, 50);
    localStorage.setItem('sleep_history', JSON.stringify(history));
}

function renderHistoryList() {
    if (!historyListContainer) return;
    const history = JSON.parse(localStorage.getItem('sleep_history')) || [];
    renderWeeklySummary(history);
    historyListContainer.innerHTML = '';
    if (history.length === 0) {
        historyListContainer.innerHTML = `<p class="cosmic-text" style="text-align:center; margin-top:40px; position:static;">まだ睡眠の記憶がありません</p>`;
        return;
    }
    history.forEach((record, idx) => {
        const card = document.createElement('div');
        card.className = 'history-card';
        card.style.cssText = 'background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 14px; margin-bottom: 12px; cursor: pointer;';

        // 簡易スパークライン
        let sparkHtml = '';
        if (record.timeline && record.timeline.length > 0) {
            const maxShow = Math.min(record.timeline.length, 40);
            const step = Math.max(1, Math.floor(record.timeline.length / maxShow));
            const samples = [];
            for (let i = 0; i < record.timeline.length; i += step) samples.push(record.timeline[i]);
            sparkHtml = `<div class="history-sparkline">${samples.map(v => {
                const h = (v + 1) * 6;
                const color = v === 2 ? 'rgba(14,165,233,0.7)' : v === 1 ? 'rgba(139,92,246,0.7)' : 'rgba(245,158,11,0.7)';
                return `<span style="height:${h}px;background:${color}"></span>`;
            }).join('')}</div>`;
        }

        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="text-align:left; flex:1;">
                    <div style="font-size:14px; font-weight:600; color:#ffffff;">
                        ${record.date}
                        <span style="font-size:11px; color:rgba(255,255,255,0.4); font-weight:400;">${record.time}</span>
                    </div>
                    <div style="font-size:13px; color:#e2e8f0; margin-top:4px;">
                        ${record.realm && REALMS[record.realm] ? REALMS[record.realm].name : '境界の霧'}
                    </div>
                    ${sparkHtml}
                    ${record.mood || record.note ? `<div class="history-note">${record.mood ? moodLabel(record.mood) + (record.note ? ' / ' : '') : ''}${escapeHtml(record.note || '')}</div>` : ''}
                    <div class="history-quiet-meta">${record.duration}${record.rite ? ' · ' + riteLabel(record.rite) : ''}</div>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            minuteTimelineData = record.timeline || [];
            resultRankText.textContent = record.rank;
            resultTime.textContent = record.duration;
            resultVibrationCount.textContent = `${record.vibrations} 回`;
            resultStatusText.textContent = `${record.date} の記録`;
            resultComment.textContent = record.note
                ? `記録メモ：${record.note}`
                : '過去の保存データから睡眠レポートを再現しています。';
            if (rewardSleeBox) rewardSleeBox.classList.add('hidden');
            const noteInput = document.getElementById('dream-note-input');
            if (noteInput) noteInput.value = record.note || '';
            setActiveMood(record.mood || '');
            setRankVisual(record.rank);
            buildSleepChart(0, Math.max(0, minuteTimelineData.length - 1));
            switchScreen('screen-main');
            switchMainInnerView('result');
        });
        historyListContainer.appendChild(card);
    });
}

function setRankVisual(rank) {
    if (!resultRankText) return;
    if (rank === 'S') resultRankText.style.background = 'linear-gradient(135deg, #ffe57f 0%, #ffb300 100%)';
    else if (rank === 'A') resultRankText.style.background = 'linear-gradient(135deg, #ffffff 0%, #b4fee7 100%)';
    else if (rank === 'B') resultRankText.style.background = 'linear-gradient(135deg, #e0e0e0 0%, #9e9e9e 100%)';
    else if (rank === 'C') resultRankText.style.background = 'linear-gradient(135deg, #ce93d8 0%, #6a1b9a 100%)';
    else if (rank === 'D') resultRankText.style.background = 'linear-gradient(135deg, #ffab91 0%, #d84315 100%)';
    else resultRankText.style.background = 'linear-gradient(135deg, #ef4444 0%, #7f1d1d 100%)';
    resultRankText.style.webkitBackgroundClip = 'text';
    resultRankText.style.webkitTextFillColor = 'transparent';
}

function initDebugPanel() {
    const toggleBtn = document.getElementById('debug-toggle-btn');
    const panel = document.getElementById('debug-panel');
    const closeBtn = document.getElementById('debug-close-btn');
    const applyBtn = document.getElementById('debug-apply-btn');
    if (!toggleBtn || !panel) return;
    toggleBtn.addEventListener('click', () => panel.classList.toggle('hidden'));
    if (closeBtn) closeBtn.addEventListener('click', () => panel.classList.add('hidden'));
    if (applyBtn) applyBtn.addEventListener('click', applyDebugValues);
}

function applyDebugValues() {
    const minutes = parseInt(document.getElementById('debug-minutes').value, 10) || 480;
    const vibs = parseInt(document.getElementById('debug-vibrations').value, 10) || 0;
    const forcedRank = document.getElementById('debug-rank').value;
    const forcedRealm = (document.getElementById('debug-realm') || {}).value || 'auto';
    const forcedTide = (document.getElementById('debug-tide') || {}).value || 'auto';
    debugTideOverride = (forcedTide === 'auto') ? null : forcedTide;
    isRunning = false;
    clearTimeout(timeoutId);
    stopVibrationSensor();
    allowScreenSleep();
    if (display) display.textContent = '00:00:00';
    if (startBtn) startBtn.classList.remove('hidden');
    if (stopBtn) stopBtn.classList.add('hidden');
    vibrationCount = vibs;
    startTime = Date.now() - (minutes * 60 * 1000);
    minuteTimelineData = [];
    for (let i = 0; i < minutes; i++) {
        const progress = i / minutes;
        if (progress < 0.04) minuteTimelineData.push(1);
        else if (progress > 0.96) minuteTimelineData.push(1);
        else minuteTimelineData.push(Math.random() > 0.12 ? 2 : 1);
    }
    switchScreen('screen-main');
    switchMainInnerView('result');
    generateSleepReport(false);
    if (forcedRank !== 'auto') {
        resultRankText.textContent = forcedRank;
        setRankVisual(forcedRank);
        const reward = getRewardByRank(forcedRank);
        if (reward > 0) {
            showEnhancedReward(reward);
            if (rewardSleeText) rewardSleeText.textContent = `+${reward} スリー 獲得！（DEBUG）`;
        }
        hasSlept = forcedRank !== 'E';
        lastSleepRank = forcedRank;
    }
    if (forcedRealm !== 'auto' && REALMS[forcedRealm]) {
        setCurrentRealm(forcedRealm, 'DEBUGで次元を指定');
        showRealmOnResult(forcedRealm, 'DEBUGで次元を指定');
        updateWakeHero(forcedRealm, lastSleepRank || 'B', 8);
        resetMorningRite(hasSlept);
    }
    updateTideUI();
    applyRealmVisual();
    if (hasSlept) updatePlazaCharacterState(true);
    if (hasSlept && forcedRealm !== 'auto') {
        showRealmRevealOverlay(forcedRealm);
    }
    const panel = document.getElementById('debug-panel');
    if (panel) panel.classList.add('hidden');
}

// ==========================================
// 図鑑
// ==========================================
function getDexData() {
    try { return JSON.parse(localStorage.getItem(DEX_STORAGE_KEY)) || {}; }
    catch (e) { return {}; }
}
function saveDexData(data) {
    localStorage.setItem(DEX_STORAGE_KEY, JSON.stringify(data));
}
function registerCharacterToDex(characterId) {
    const character = CHARACTERS.find(c => c.id === characterId);
    if (!character) return;
    const dex = getDexData();
    if (!dex[character.id]) {
        dex[character.id] = { discovered: true, discoveredAt: Date.now(), count: 1 };
    } else {
        dex[character.id].discovered = true;
        dex[character.id].count = (dex[character.id].count || 0) + 1;
    }
    saveDexData(dex);
}

function initCharacterDex() {
    createDexScreen();
    setupExistingDexTabs();
    updateTabState();
}

function createDexScreen() {
    if (document.getElementById('screen-dex')) return;
    const container = document.querySelector('.container');
    if (!container) return;
    const screen = document.createElement('div');
    screen.id = 'screen-dex';
    screen.className = 'screen-wrapper hidden';
    screen.innerHTML = `
        <div class="plaza-cosmic-bg"></div>
        <div class="dex-screen-content">
            <div class="dex-header">
                <div>
                    <h2 class="dex-title">CHARACTER DEX</h2>
                    <p class="dex-subtitle">眠りの世界で出会った仲間たち</p>
                </div>
                <div class="dex-count-box">
                    <span id="dex-discovered-count">0</span>
                    <span>/ ${CHARACTERS.length}</span>
                </div>
            </div>
            <div class="dex-progress"><div id="dex-progress-bar"></div></div>
            <div id="dex-grid" class="dex-grid"></div>
        </div>
        <div class="bottom-tab-bar dex-bottom-tab-bar">
            <button id="dex-tab-plaza-btn" class="tab-btn" data-tab-target="screen-plaza">🔮 広場</button>
            <button id="dex-tab-history-btn" class="tab-btn" data-tab-target="screen-history">📜 履歴</button>
            <button id="dex-tab-moon-btn" class="tab-btn" data-tab-target="screen-moon">🌙 月</button>
            <button class="tab-btn active" data-tab-target="screen-dex">📖 図鑑</button>
        </div>
    `;
    container.appendChild(screen);
    const plazaBtn = document.getElementById('dex-tab-plaza-btn');
    if (plazaBtn) plazaBtn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); switchScreen('screen-plaza'); });
    const historyBtn = document.getElementById('dex-tab-history-btn');
    if (historyBtn) historyBtn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); switchScreen('screen-history'); });
    const moonBtn = document.getElementById('dex-tab-moon-btn');
    if (moonBtn) moonBtn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); switchScreen('screen-moon'); });
    renderDex();
}

function setupExistingDexTabs() {
    document.querySelectorAll('.bottom-tab-bar').forEach(bar => {
        bar.querySelectorAll('.tab-btn').forEach(button => {
            const text = button.textContent.trim();
            if (!button.dataset.tabTarget) {
                if (text.includes('広場')) button.dataset.tabTarget = 'screen-plaza';
                else if (text.includes('履歴')) button.dataset.tabTarget = 'screen-history';
                else if (text.includes('図鑑')) button.dataset.tabTarget = 'screen-dex';
                else if (text.includes('月')) button.dataset.tabTarget = 'screen-moon';
            }
        });
        const existingDex = bar.querySelector('[data-tab-target="screen-dex"], .dynamic-dex-tab');
        if (existingDex) return;
        const button = document.createElement('button');
        button.className = 'tab-btn dynamic-dex-tab';
        button.dataset.tabTarget = 'screen-dex';
        button.type = 'button';
        button.innerHTML = '📖 図鑑';
        button.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); switchScreen('screen-dex'); });
        bar.appendChild(button);
    });
}

function renderDex() {
    const grid = document.getElementById('dex-grid');
    const countElement = document.getElementById('dex-discovered-count');
    const progressBar = document.getElementById('dex-progress-bar');
    if (!grid) return;
    const dex = getDexData();
    let discoveredCount = 0;
    CHARACTERS.forEach(character => {
        if (dex[character.id] && dex[character.id].discovered) discoveredCount++;
    });
    if (countElement) countElement.textContent = discoveredCount;
    if (progressBar) {
        const percent = CHARACTERS.length > 0 ? (discoveredCount / CHARACTERS.length) * 100 : 0;
        progressBar.style.width = `${percent}%`;
    }
    grid.innerHTML = '';
    CHARACTERS.forEach((character, index) => {
        const data = dex[character.id];
        const discovered = !!(data && data.discovered);
        const card = document.createElement('div');
        card.className = 'dex-card ' + (discovered ? 'dex-discovered' : 'dex-unknown');
        card.dataset.characterId = character.id;
        card.innerHTML = `
            <div class="dex-number">#${String(index + 1).padStart(3, '0')}</div>
            <div class="dex-character-image" id="dex-image-${character.id}"></div>
            <div class="dex-card-name">${discovered ? character.name : '？？？？'}</div>
            <div class="dex-rarity">${getRarityText(character.rarity)}</div>
            ${discovered ? '<div class="dex-new-label">発見済み</div>' : '<div class="dex-unknown-label">未発見</div>'}
        `;
        card.addEventListener('click', () => {
            if (discovered) showCharacterDetail(character);
            else showUnknownCharacter();
        });
        grid.appendChild(card);
        const imageContainer = document.getElementById(`dex-image-${character.id}`);
        if (discovered) createDexCharacterImage(character, imageContainer);
        else if (imageContainer) imageContainer.innerHTML = `<div class="dex-question-mark">?</div>`;
    });
}

function getRarityText(rarity) {
    switch (rarity) {
        case 'legendary': return '★ ★ ★ ★  LEGENDARY';
        case 'rare': return '★ ★ ★  RARE';
        case 'uncommon': return '★ ★  UNCOMMON';
        default: return '★  COMMON';
    }
}

function createDexCharacterImage(character, container) {
    if (!container) return;
    container.innerHTML = '';
    if (character.isLottie && typeof lottie !== 'undefined') {
        try {
            const animation = lottie.loadAnimation({
                container, renderer: 'svg', loop: true, autoplay: true, path: character.image
            });
            animation.addEventListener('DOMLoaded', () => animation.play());
        } catch (e) {}
    } else {
        const img = document.createElement('img');
        img.src = character.image;
        img.alt = character.name;
        img.onerror = () => { container.innerHTML = `<div class="dex-image-error">IMAGE<br>ERROR</div>`; };
        container.appendChild(img);
    }
}

const CHAR_TALKS = {
    ohiruneinu: ['まだ、五分だけ……', '霧のにおいで、よく眠れた。'],
    suyasuyapanda: ['竹、持ってきてないの。', '今日の夜は、やわらかかった。'],
    komorifukuro: ['……見ていたよ。起きなくていい。', '暗い方が、羽が落ち着く。'],
    hitsujikumo: ['数えてた。あなたが、落ちるまで。', '雲のあいだ、通りやすい夜だった。'],
    hamunemuri: ['もぐもぐ……あ、話？', '頬の中に、星がひとつ。'],
    tsukiyozaru: ['月の橋、渡ってきた。', '影が長いときは、急がない。'],
    tsukikage: ['足音、銀になってたよ。', '追いかけないで。置いていくから。'],
    ginnoika: ['角に、露がついてる。', '静かな夜は、歩幅が変わる。'],
    tsukipenguin: ['滑ってきた。 freeze してない。', '白い地面より、月の床の方が好き。'],
    hoshiboshi: ['しっぽに、粉がついた。', '数えないで。消える星もある。'],
    yumemidori: ['葉の裏で、待ってた。', '緑の夢は、音が少ない。'],
    yorunokitsune: ['火は出さない。今夜は。', '道は、教えない。匂いだけ。'],
    yumekurage: ['沈んでた。あなたも、少し。', '触手の先が、光を飲んだ。'],
    hoshikuma: ['縞に、夜が残ってる。', '深いところまで、一緒だった。'],
    seiunryu: ['雲の奥で、一巻きした。', '名前を呼ばないで。風になる。']
};

const REALM_OPENERS = {
    mist: '霧の中から、声がする。',
    abyss: '星の底から、声がする。',
    corridor: '白い柱の陰から、声がする。',
    well: '水面の下から、声がする。',
    echo: '光粒のあいだから、声がする。'
};

function getCharacterTalkLines(character) {
    const base = CHAR_TALKS[character.id] || ['……今夜は、黙っている。'];
    const opener = REALM_OPENERS[currentRealm] || REALM_OPENERS.mist;
    return [opener, ...base];
}

function showCharacterTalk(character) {
    const oldModal = document.getElementById('character-talk-modal');
    if (oldModal) oldModal.remove();
    const lines = getCharacterTalkLines(character);
    let index = 0;
    const modal = document.createElement('div');
    modal.id = 'character-talk-modal';
    modal.className = 'character-detail-overlay';
    modal.innerHTML = `
        <div class="talk-sheet">
            <div class="talk-name">${character.name}</div>
            <p class="talk-line" id="talk-line">${lines[0]}</p>
            <div class="talk-hint">タップで次へ</div>
        </div>
    `;
    document.body.appendChild(modal);
    const lineEl = modal.querySelector('#talk-line');
    const hintEl = modal.querySelector('.talk-hint');
    const advance = () => {
        index += 1;
        if (index >= lines.length) {
            modal.remove();
            return;
        }
        if (lineEl) lineEl.textContent = lines[index];
        if (hintEl) hintEl.textContent = index === lines.length - 1 ? 'タップで閉じる' : 'タップで次へ';
    };
    modal.addEventListener('click', advance);
}

function showCharacterDetail(character) {
    const dex = getDexData();
    const data = dex[character.id];
    const oldModal = document.getElementById('character-detail-modal');
    if (oldModal) oldModal.remove();
    const modal = document.createElement('div');
    modal.id = 'character-detail-modal';
    modal.className = 'character-detail-overlay';
    const count = data ? data.count || 1 : 1;
    modal.innerHTML = `
        <div class="character-detail-card">
            <button class="character-detail-close">×</button>
            <div class="detail-rarity">${getRarityText(character.rarity)}</div>
            <div id="detail-character-image" class="detail-character-image"></div>
            <h3>${character.name}</h3>
            <div class="detail-divider"></div>
            <div class="detail-info">
                <div><span>図鑑番号</span><strong>#${String(CHARACTERS.indexOf(character) + 1).padStart(3, '0')}</strong></div>
                <div><span>発見回数</span><strong>${count} 回</strong></div>
                <div><span>出現条件</span><strong>${character.minRank ? `睡眠ランク ${character.minRank} 以上` : 'すべての睡眠'}${character.unlockSlee > 0 ? ` / スリー ${character.unlockSlee}以上` : ''}</strong></div>
            </div>
            <p class="detail-message">この仲間はあなたの眠りの世界で<br>発見されています。</p>
        </div>
    `;
    document.body.appendChild(modal);
    const imageContainer = document.getElementById('detail-character-image');
    createDexCharacterImage(character, imageContainer);
    modal.querySelector('.character-detail-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

function showUnknownCharacter() {
    const oldModal = document.getElementById('character-unknown-modal');
    if (oldModal) oldModal.remove();
    const modal = document.createElement('div');
    modal.id = 'character-unknown-modal';
    modal.className = 'character-detail-overlay';
    modal.innerHTML = `
        <div class="character-detail-card unknown-detail">
            <button class="character-detail-close">×</button>
            <div class="unknown-big-question">?</div>
            <h3>？？？？</h3>
            <div class="detail-divider"></div>
            <p class="detail-message">まだ発見されていません。<br><br>たくさん眠って、<br>新しい仲間を探してみよう。</p>
        </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.character-detail-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}


function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, ch => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
}

function moodLabel(mood) {
    return { calm: '穏やか', deep: '深い', light: '浅い', dream: '夢多し' }[mood] || '';
}

function setupDreamNoteUI() {
    const input = document.getElementById('dream-note-input');
    if (input && !input.dataset.wired) {
        input.dataset.wired = '1';
        input.addEventListener('input', () => {
            pendingDreamNote = input.value.trim();
        });
    }
    document.querySelectorAll('#mood-row .mood-chip').forEach(btn => {
        if (btn.dataset.wired) return;
        btn.dataset.wired = '1';
        btn.addEventListener('click', () => {
            pendingMood = (pendingMood === btn.dataset.mood) ? '' : btn.dataset.mood;
            setActiveMood(pendingMood);
        });
    });
    const detailsBtn = document.getElementById('result-details-toggle');
    const details = document.getElementById('result-details');
    if (detailsBtn && details && !detailsBtn.dataset.wired) {
        detailsBtn.dataset.wired = '1';
        detailsBtn.addEventListener('click', () => {
            const open = details.classList.toggle('hidden');
            detailsBtn.textContent = details.classList.contains('hidden') ? '記録を見る' : '記録をしまう';
        });
    }
    document.querySelectorAll('.rite-btn').forEach(btn => {
        if (btn.dataset.wired) return;
        btn.dataset.wired = '1';
        btn.addEventListener('click', () => performMorningRite(btn.dataset.rite));
    });
}

function setActiveMood(mood) {
    pendingMood = mood || '';
    document.querySelectorAll('#mood-row .mood-chip').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mood === pendingMood);
    });
}

function getRestPhrase(rank) {
    if (rank === 'S' || rank === 'A') return 'よく休めた';
    if (rank === 'B') return 'ほどよく沈んだ';
    if (rank === 'C') return '浅い夜だった';
    return '短い夜だった';
}

function currentMoonName() {
    if (typeof getMoonPhaseInfo !== 'function') return '今夜の月';
    return getMoonPhaseInfo().name || '今夜の月';
}

function updateWakeHero(realmId, rank, hours) {
    const moonEl = document.getElementById('wake-moon-line');
    const restEl = document.getElementById('wake-rest-line');
    if (moonEl) moonEl.textContent = currentMoonName();
    if (restEl) restEl.textContent = getRestPhrase(rank);
}

function buildWakeComment(rank, hours) {
    const realm = REALMS[currentRealm] || REALMS.mist;
    const moon = currentMoonName();
    if (rank === 'S' || rank === 'A') return `${moon}の${realm.name}に、長く足を下ろしていた。`;
    if (rank === 'B') return `${moon}。${realm.name}の縁を、静かに歩いていた。`;
    if (rank === 'C') return `${moon}の${realm.name}は、風が少し強かった。`;
    return `${moon}の下で、夜は短く閉じた。`;
}

function resetMorningRite(show) {
    morningRiteDone = false;
    const box = document.getElementById('morning-rite');
    const msg = document.getElementById('morning-rite-msg');
    const guide = document.getElementById('guide-choices');
    if (msg) msg.textContent = '';
    if (guide) {
        guide.classList.add('hidden');
        guide.innerHTML = '';
    }
    document.querySelectorAll('.rite-btn').forEach(btn => { btn.disabled = false; });
    if (box) box.classList.toggle('hidden', !show);
}

function riteLabel(rite) {
    return { farewell: '見送った', listen: '話を聞いた', guide: '道を教えた' }[rite] || '';
}

function persistRite(rite) {
    morningRiteDone = true;
    try {
        const history = JSON.parse(localStorage.getItem('sleep_history')) || [];
        if (history.length) {
            history[0].rite = rite;
            localStorage.setItem('sleep_history', JSON.stringify(history));
        }
    } catch (e) {}
}

function performMorningRite(rite) {
    if (morningRiteDone) return;
    const msg = document.getElementById('morning-rite-msg');
    const guide = document.getElementById('guide-choices');
    if (rite === 'farewell') {
        addSlee(12);
        persistRite('farewell');
        document.querySelectorAll('.rite-btn').forEach(btn => { btn.disabled = true; });
        if (msg) msg.textContent = '見送りのしずくが、12スリーになった。';
        return;
    }
    if (rite === 'listen') {
        const line = `${currentMoonName()}の${(REALMS[currentRealm] || REALMS.mist).name}。${getRestPhrase(lastSleepRank)}夜。`;
        const input = document.getElementById('dream-note-input');
        pendingDreamNote = pendingDreamNote ? `${pendingDreamNote} / ${line}` : line;
        if (pendingDreamNote.length > 80) pendingDreamNote = pendingDreamNote.slice(0, 80);
        if (input) input.value = pendingDreamNote;
        persistDreamNoteIfNeeded();
        persistRite('listen');
        document.querySelectorAll('.rite-btn').forEach(btn => { btn.disabled = true; });
        if (msg) msg.textContent = line;
        return;
    }
    if (rite === 'guide') {
        if (!guide) return;
        const options = Object.keys(REALMS).filter(id => id !== currentRealm);
        guide.innerHTML = options.map(id => `<button type="button" class="guide-chip" data-guide="${id}">${REALMS[id].name}</button>`).join('');
        guide.classList.remove('hidden');
        if (msg) msg.textContent = '次の夜を、どこへ傾ける。';
        guide.querySelectorAll('.guide-chip').forEach(btn => {
            btn.addEventListener('click', () => {
                if (morningRiteDone) return;
                realmTicket = btn.dataset.guide;
                saveShopState();
                updateTicketChip();
                persistRite('guide');
                document.querySelectorAll('.rite-btn').forEach(b => { b.disabled = true; });
                guide.classList.add('hidden');
                if (msg) msg.textContent = `次の夜は、${REALMS[realmTicket].name}へ傾いた。`;
            });
        });
    }
}

function persistDreamNoteIfNeeded() {
    const input = document.getElementById('dream-note-input');
    if (input) pendingDreamNote = input.value.trim();
    if (!lastSavedRecordAt) return;
    try {
        const history = JSON.parse(localStorage.getItem('sleep_history')) || [];
        if (!history.length) return;
        history[0].note = pendingDreamNote || history[0].note || '';
        history[0].mood = pendingMood || history[0].mood || '';
        localStorage.setItem('sleep_history', JSON.stringify(history));
    } catch (e) {}
}

function parseDurationToMs(timeStr) {
    const parts = String(timeStr || '00:00:00').split(':').map(n => parseInt(n, 10) || 0);
    return ((parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0)) * 1000;
}

function formatHoursMinutes(ms) {
    const totalMin = Math.max(0, Math.round(ms / 60000));
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${h}時間${m}分`;
}

function renderWeeklySummary(history) {
    const avgEl = document.getElementById('week-avg');
    const realmEl = document.getElementById('week-realm');
    if (!avgEl && !realmEl) return;
    const now = Date.now();
    const week = (history || []).filter(rec => {
        const t = rec.iso ? Date.parse(rec.iso) : NaN;
        if (!Number.isNaN(t)) return (now - t) <= 7 * 24 * 60 * 60 * 1000;
        return true;
    }).slice(0, 7);
    if (!week.length) {
        if (avgEl) avgEl.textContent = '—';
        if (realmEl) realmEl.textContent = '—';
        return;
    }
    const totalMs = week.reduce((sum, rec) => sum + (rec.durationMs || parseDurationToMs(rec.duration)), 0);
    if (avgEl) avgEl.textContent = formatHoursMinutes(totalMs / week.length);
    const counts = {};
    week.forEach(rec => {
        if (rec.realm) counts[rec.realm] = (counts[rec.realm] || 0) + 1;
    });
    const top = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
    if (realmEl) realmEl.textContent = top && REALMS[top] ? REALMS[top].short : '—';
}

function showStreakBlessing(streak) {
    const old = document.getElementById('streak-blessing-overlay');
    if (old) old.remove();
    const title = streak >= 14 ? '十四夜の灯' : streak >= 7 ? '七日の軌跡' : '三日の息';
    const sub = streak >= 14
        ? '二週間、眠りが途切れなかった。星海があなたを覚えている。'
        : streak >= 7
            ? '一週間つづいた眠り。星の道が少し濃くなった。'
            : '三日つづいた眠り。霧の奥が、わずかに晴れた。';
    const overlay = document.createElement('div');
    overlay.id = 'streak-blessing-overlay';
    overlay.className = 'realm-reveal-overlay';
    overlay.innerHTML = `
        <div class="realm-reveal-content">
            <div class="realm-reveal-kicker">${streak} DAY STREAK</div>
            <div class="realm-reveal-title">${title}</div>
            <div class="realm-reveal-sub">${sub}</div>
        </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('visible'));
    setTimeout(() => {
        overlay.classList.remove('visible');
        setTimeout(() => overlay.remove(), 450);
    }, 2000);
}

function onAppReady() {
    initDOMElements();
    updateTimeTheme();
    setInterval(updateTimeTheme, 60000);
    switchScreen('screen-home');
    initMoonSystem();
    applyRealmVisual();
    updatePlazaRealmBadge();
    updateTideUI();
}

if (typeof window.cordova !== 'undefined') {
    document.addEventListener('deviceready', onAppReady, false);
} else {
    if (document.readyState === 'complete' || document.readyState === 'interactive') onAppReady();
    else document.addEventListener('DOMContentLoaded', onAppReady, false);
}

// ==========================================
// 🌙 月タブ
// ==========================================
const SYNODIC_MONTH = 29.53058867;
const MOON_REF_UTC = Date.UTC(2000, 0, 6, 18, 14, 0);
const MOON_PHASES = [
    { key: 'new',             name: '新月',       from: 0,     until: 1.85,  flavor: '光が最も細い夜。影の気配が近づきます。' },
    { key: 'waxing_crescent', name: '三日月',     from: 1.85,  until: 5.54,  flavor: '細い光が戻り始めています。' },
    { key: 'first_quarter',   name: '上弦の月',   from: 5.54,  until: 9.23,  flavor: '半分まで満ちた、均衡の夜。' },
    { key: 'waxing_gibbous',  name: '十三夜月',   from: 9.23,  until: 12.92, flavor: '満月へ向かう、静かな高まり。' },
    { key: 'full',            name: '満月',       from: 12.92, until: 16.61, flavor: '月影の回廊が開きやすい夜です。' },
    { key: 'waning_gibbous',  name: '十六夜月',   from: 16.61, until: 20.30, flavor: '満ちた光が、ゆっくり欠けていきます。' },
    { key: 'last_quarter',    name: '下弦の月',   from: 20.30, until: 23.99, flavor: '夜の後半。眠りは少し深くなる頃。' },
    { key: 'waning_crescent', name: '二十六夜月', from: 23.99, until: 27.68, flavor: '光は細く、次の新月を待っています。' },
    { key: 'new',             name: '新月',       from: 27.68, until: 99,    flavor: '光が最も細い夜。影の気配が近づきます。' }
];

function getMoonAge(date = new Date()) {
    const diffDays = (date.getTime() - MOON_REF_UTC) / (1000 * 60 * 60 * 24);
    let age = diffDays % SYNODIC_MONTH;
    if (age < 0) age += SYNODIC_MONTH;
    return age;
}

function getMoonPhaseInfo(date = new Date()) {
    const age = getMoonAge(date);
    const illumination = (1 - Math.cos((age / SYNODIC_MONTH) * 2 * Math.PI)) / 2;
    const phase = MOON_PHASES.find(p => age >= p.from && age < p.until) || MOON_PHASES[0];
    return { age, name: phase.name, key: phase.key, illumination, flavor: phase.flavor };
}

function daysUntilAge(targetAge, date = new Date()) {
    const age = getMoonAge(date);
    let delta = targetAge - age;
    if (delta < 0) delta += SYNODIC_MONTH;
    return delta;
}

function applyMoonDisc(el, info) {
    if (!el) return;
    const shade = el.querySelector('.moon-shade');
    if (!shade) return;
    const illum = Math.max(0, Math.min(1, info.illumination));
    const waxing = info.age < SYNODIC_MONTH / 2;
    el.classList.toggle('moon-newish', illum < 0.08);
    el.classList.toggle('moon-fullish', illum > 0.92);
    if (illum < 0.08) {
        shade.style.transform = 'translateX(0)';
        shade.style.opacity = '0.92';
        return;
    }
    if (illum > 0.92) {
        shade.style.opacity = '0';
        shade.style.transform = waxing ? 'translateX(-120%)' : 'translateX(120%)';
        return;
    }
    const shift = (1 - illum) * 70;
    shade.style.opacity = '1';
    shade.style.transform = waxing ? `translateX(-${shift}%)` : `translateX(${shift}%)`;
}

function renderMoonScreen() {
    const info = getMoonPhaseInfo();
    applyMoonDisc(document.getElementById('moon-hero-disc'), info);
    const nameEl = document.getElementById('moon-hero-name');
    const subEl = document.getElementById('moon-hero-sub');
    const ageEl = document.getElementById('moon-stat-age');
    const illumEl = document.getElementById('moon-stat-illum');
    const flavorEl = document.getElementById('moon-flavor');
    if (nameEl) nameEl.textContent = info.name;
    if (subEl) subEl.textContent = `月齢 ${info.age.toFixed(1)} ・ 輝面 ${Math.round(info.illumination * 100)}%`;
    if (ageEl) ageEl.textContent = info.age.toFixed(1);
    if (illumEl) illumEl.textContent = `${Math.round(info.illumination * 100)}%`;
    if (flavorEl) flavorEl.textContent = info.flavor;
    const realm = REALMS[currentRealm] || REALMS.mist;
    const realmName = document.getElementById('moon-realm-name');
    const realmDesc = document.getElementById('moon-realm-desc');
    if (realmName) realmName.textContent = realm.name;
    if (realmDesc) realmDesc.textContent = lastRealmReason || realm.desc;
    updateTideUI();
    const upcoming = document.getElementById('moon-upcoming');
    if (!upcoming) return;
    const targets = [
        { name: '新月', age: 0 },
        { name: '上弦の月', age: 7.38 },
        { name: '満月', age: 14.77 },
        { name: '下弦の月', age: 22.15 }
    ];
    upcoming.innerHTML = targets.map(t => {
        const days = daysUntilAge(t.age);
        const label = days < 0.6 ? '今夜' : days < 1.4 ? '明日' : `${Math.round(days)}日後`;
        return `<div class="moon-upcoming-item"><span>${t.name}</span><strong>${label}</strong></div>`;
    }).join('');
}



function loadRealm() {
    try {
        const saved = localStorage.getItem(STORAGE_REALM);
        currentRealm = (saved && REALMS[saved]) ? saved : 'mist';
        lastRealmReason = localStorage.getItem(STORAGE_REALM_REASON) || '';
    } catch (e) {
        currentRealm = 'mist';
        lastRealmReason = '';
    }
}

function saveRealm() {
    try {
        localStorage.setItem(STORAGE_REALM, currentRealm);
        localStorage.setItem(STORAGE_REALM_REASON, lastRealmReason || '');
    } catch (e) {}
}

function setCurrentRealm(id, reason) {
    currentRealm = REALMS[id] ? id : 'mist';
    lastRealmReason = reason || '';
    saveRealm();
    applyRealmVisual();
    updatePlazaRealmBadge();
}

function isNearFullMoon(info) {
    if (!info) return false;
    return info.key === 'full' || info.illumination >= 0.90;
}

function decideRealm(rank, hours, streak) {
    const ticket = consumeRealmTicket();
    if (ticket && REALMS[ticket]) {
        return {
            id: ticket,
            reason: `${REALMS[ticket].name}への道しるべが、今夜の次元を開きました`
        };
    }
    const moon = (typeof getMoonPhaseInfo === 'function') ? getMoonPhaseInfo() : { illumination: 0, key: 'new', name: '—' };
    const good = ['S', 'A', 'B'].includes(rank);
    const deep = ['S', 'A'].includes(rank);

    if (isNearFullMoon(moon) && good && hours >= 5) {
        return {
            id: 'corridor',
            reason: `${moon.name}とランク${rank}の眠りが重なり、月影の回廊が開きました`
        };
    }
    const isNew = moon.key === 'new' || moon.illumination <= 0.12;
    if (isNew && good && hours >= 5) {
        return {
            id: 'well',
            reason: `${moon.name}の底が開き、常夜の井戸へ降りました`
        };
    }
    if ((deep && hours >= 6) || (rank === 'B' && streak >= 7 && hours >= 6.5)) {
        return {
            id: 'abyss',
            reason: hours >= 6
                ? `深い眠り（${hours.toFixed(1)}時間 / ${rank}）が星海の深淵を開きました`
                : `連続${streak}日の積み重ねが星海の深淵を開きました`
        };
    }
    if (good && streak >= 3) {
        return {
            id: 'echo',
            reason: `連続${streak}日の眠りが、残響の庭を残しました`
        };
    }
    return {
        id: 'mist',
        reason: '今夜は境界の霧。月と眠りの条件が揃うと、別の次元が開きます'
    };
}


const SHOP_ITEMS = [
    { id: 'mist_lamp', name: '霧の灯', price: 35, desc: '次の起床で、次元を境界の霧に固定する。', realm: 'mist' },
    { id: 'abyss_drop', name: '星の雫', price: 70, desc: '次の起床で、次元を星海の深淵に固定する。', realm: 'abyss' },
    { id: 'moon_bookmark', name: '月の栞', price: 70, desc: '次の起床で、次元を月影の回廊に固定する。', realm: 'corridor' },
    { id: 'well_ink', name: '常夜の墨', price: 70, desc: '次の起床で、次元を常夜の井戸に固定する。', realm: 'well' },
    { id: 'echo_seed', name: '残響の種', price: 50, desc: '次の起床で、次元を残響の庭に固定する。', realm: 'echo' },
    { id: 'reroll_bell', name: '再訪の鈴', price: 55, desc: '広場の仲間を、いまの次元で引き直す。', realm: null }
];
const SHOP_FURNISHINGS = [
    { id: 'lantern', name: '霧の灯籠', price: 80, desc: '広場の端に、小さな灯籠が残ります。' },
    { id: 'chime', name: '星の風鈴', price: 100, desc: '時計のそばに、風鈴が下がります。' },
    { id: 'stone', name: '常夜の石', price: 90, desc: '足元に、低い石がひとつ残ります。' },
    { id: 'basin', name: '月の水盤', price: 140, desc: '月を映す水盤が、広場に置かれます。' }
];
const INSCRIPTION_PRICE = 30;
const SHOP_ORBS = [
    { id: 'default', name: '霧ガラス', price: 0, desc: '最初からある、淡い時計。' },
    { id: 'gold', name: '金の時計', price: 150, desc: '眠りの報酬が灯る、金色のオーブ。' },
    { id: 'star', name: '星海の時計', price: 220, desc: '深い青紫がにじむ、星のオーブ。' }
];

function defaultInventory() {
    return { mist_lamp: 0, abyss_drop: 0, moon_bookmark: 0, well_ink: 0, echo_seed: 0, reroll_bell: 0 };
}

function loadShopState() {
    try {
        const raw = JSON.parse(localStorage.getItem(STORAGE_INVENTORY) || 'null');
        inventory = Object.assign(defaultInventory(), raw || {});
    } catch (e) { inventory = defaultInventory(); }
    try { orbSkin = localStorage.getItem(STORAGE_ORB_SKIN) || 'default'; } catch (e) { orbSkin = 'default'; }
    try {
        ownedOrbs = JSON.parse(localStorage.getItem(STORAGE_OWNED_ORBS) || '["default"]');
        if (!Array.isArray(ownedOrbs) || !ownedOrbs.includes('default')) ownedOrbs = ['default'];
    } catch (e) { ownedOrbs = ['default']; }
    try { realmTicket = localStorage.getItem(STORAGE_REALM_TICKET) || null; } catch (e) { realmTicket = null; }
    if (realmTicket === '') realmTicket = null;
    try {
        ownedFurnishings = JSON.parse(localStorage.getItem(STORAGE_FURNISHINGS) || '[]');
        if (!Array.isArray(ownedFurnishings)) ownedFurnishings = [];
    } catch (e) { ownedFurnishings = []; }
    try { plazaInscription = localStorage.getItem(STORAGE_INSCRIPTION) || ''; } catch (e) { plazaInscription = ''; }
    updateTicketChip();
    applyPlazaDecor();
}

function saveShopState() {
    try { localStorage.setItem(STORAGE_INVENTORY, JSON.stringify(inventory)); } catch (e) {}
    try { localStorage.setItem(STORAGE_ORB_SKIN, orbSkin); } catch (e) {}
    try { localStorage.setItem(STORAGE_OWNED_ORBS, JSON.stringify(ownedOrbs)); } catch (e) {}
    try {
        if (realmTicket) localStorage.setItem(STORAGE_REALM_TICKET, realmTicket);
        else localStorage.removeItem(STORAGE_REALM_TICKET);
    } catch (e) {}
    try { localStorage.setItem(STORAGE_FURNISHINGS, JSON.stringify(ownedFurnishings)); } catch (e) {}
    try {
        if (plazaInscription) localStorage.setItem(STORAGE_INSCRIPTION, plazaInscription);
        else localStorage.removeItem(STORAGE_INSCRIPTION);
    } catch (e) {}
}

function spendSlee(amount) {
    if (currentSlee < amount) return false;
    currentSlee -= amount;
    saveSlee();
    updateSleeDisplay();
    return true;
}

function consumeRealmTicket() {
    const t = realmTicket;
    realmTicket = null;
    saveShopState();
    updateTicketChip();
    return t;
}

function updateTicketChip() {
    const chip = document.getElementById('plaza-ticket-chip');
    if (!chip) return;
    if (!realmTicket || !REALMS[realmTicket]) {
        chip.classList.add('hidden');
        chip.textContent = '';
        return;
    }
    chip.classList.remove('hidden');
    chip.textContent = `次の夜：${REALMS[realmTicket].name}`;
}


function buyFurnishing(id) {
    const item = SHOP_FURNISHINGS.find(x => x.id === id);
    if (!item || ownedFurnishings.includes(id)) return;
    if (!spendSlee(item.price)) {
        alert('スリーが足りません');
        return;
    }
    ownedFurnishings.push(id);
    saveShopState();
    applyPlazaDecor();
    renderShop();
}

function inscribePlazaWord() {
    const input = document.getElementById('shop-inscription-input');
    const text = input ? input.value.trim().slice(0, 18) : '';
    if (!text) {
        alert('言葉を入れてください');
        return;
    }
    if (!spendSlee(INSCRIPTION_PRICE)) {
        alert('スリーが足りません');
        return;
    }
    plazaInscription = text;
    saveShopState();
    applyPlazaDecor();
    renderShop();
}

function applyPlazaDecor() {
    document.querySelectorAll('#plaza-furnishings .furni').forEach(el => {
        el.classList.toggle('is-on', ownedFurnishings.includes(el.dataset.furni));
    });
    const board = document.getElementById('plaza-inscription');
    if (board) {
        if (plazaInscription) {
            board.textContent = plazaInscription;
            board.classList.remove('hidden');
        } else {
            board.textContent = '';
            board.classList.add('hidden');
        }
    }
}

function applyOrbSkin() {
    const orb = document.getElementById('plaza-clock-trigger');
    if (!orb) return;
    orb.classList.remove('orb-skin-default', 'orb-skin-gold', 'orb-skin-star');
    orb.classList.add(`orb-skin-${orbSkin || 'default'}`);
}

function renderShop() {
    try {
    updateSleeDisplay();
    const itemsEl = document.getElementById('shop-items');
    const orbsEl = document.getElementById('shop-orbs');
    if (!inventory) inventory = defaultInventory();
    if (!ownedOrbs) ownedOrbs = ['default'];
    if (itemsEl) {
        itemsEl.innerHTML = SHOP_ITEMS.map(item => {
            const held = inventory[item.id] || 0;
            const pending = (item.realm && realmTicket === item.realm);
            return `
                <div class="shop-card">
                    <div class="shop-card-top">
                        <div>
                            <div class="shop-name">${item.name}</div>
                            <div class="shop-desc">${item.desc}</div>
                        </div>
                        <div class="shop-price">${item.price}</div>
                    </div>
                    <div class="shop-card-bottom">
                        <span class="shop-held">所持 ${held}${pending ? ' ／ 次の夜に使用待ち' : ''}</span>
                        <button type="button" class="shop-buy-btn" data-buy-item="${item.id}">買う</button>
                        <button type="button" class="shop-use-btn" data-use-item="${item.id}" ${held <= 0 ? 'disabled' : ''}>使う</button>
                    </div>
                </div>
            `;
        }).join('');
        itemsEl.querySelectorAll('[data-buy-item]').forEach(btn => {
            btn.addEventListener('click', () => buyShopItem(btn.dataset.buyItem));
        });
        itemsEl.querySelectorAll('[data-use-item]').forEach(btn => {
            btn.addEventListener('click', () => useShopItem(btn.dataset.useItem));
        });
    }
    if (orbsEl) {
        orbsEl.innerHTML = SHOP_ORBS.map(orb => {
            const owned = ownedOrbs.includes(orb.id);
            const active = orbSkin === orb.id;
            const action = active ? '使用中' : owned ? 'つける' : `買う ${orb.price}`;
            return `
                <div class="shop-card ${active ? 'is-active' : ''}">
                    <div class="shop-card-top">
                        <div>
                            <div class="shop-name">${orb.name}</div>
                            <div class="shop-desc">${orb.desc}</div>
                        </div>
                    </div>
                    <div class="shop-card-bottom">
                        <span class="shop-held">${owned ? '所持済み' : '未所持'}</span>
                        <button type="button" class="shop-buy-btn" data-orb="${orb.id}" ${active ? 'disabled' : ''}>${action}</button>
                    </div>
                </div>
            `;
        }).join('');
        orbsEl.querySelectorAll('[data-orb]').forEach(btn => {
            btn.addEventListener('click', () => buyOrEquipOrb(btn.dataset.orb));
        });
    }
    const furnEl = document.getElementById('shop-furnishings');
    if (furnEl) {
        furnEl.innerHTML = SHOP_FURNISHINGS.map(item => {
            const owned = ownedFurnishings.includes(item.id);
            return `
                <div class="shop-card ${owned ? 'is-active' : ''}">
                    <div class="shop-card-top">
                        <div>
                            <div class="shop-name">${item.name}</div>
                            <div class="shop-desc">${item.desc}</div>
                        </div>
                        <div class="shop-price">${owned ? '設置済' : item.price}</div>
                    </div>
                    <div class="shop-card-bottom">
                        <span class="shop-held">${owned ? '広場に残っています' : '未所持'}</span>
                        <button type="button" class="shop-buy-btn" data-furni="${item.id}" ${owned ? 'disabled' : ''}>${owned ? '設置済' : '置く'}</button>
                    </div>
                </div>
            `;
        }).join('');
        furnEl.querySelectorAll('[data-furni]').forEach(btn => {
            btn.addEventListener('click', () => buyFurnishing(btn.dataset.furni));
        });
    }
    const insInput = document.getElementById('shop-inscription-input');
    const insBtn = document.getElementById('shop-inscribe-btn');
    if (insInput && plazaInscription) insInput.value = plazaInscription;
    if (insBtn && !insBtn.dataset.wired) {
        insBtn.dataset.wired = '1';
        insBtn.addEventListener('click', inscribePlazaWord);
    }
    } catch (e) {
        const itemsEl = document.getElementById('shop-items');
        if (itemsEl) itemsEl.innerHTML = '<div class="shop-card"><div class="shop-name">読み込みに失敗しました</div></div>';
    }
}

function buyShopItem(id) {
    const item = SHOP_ITEMS.find(x => x.id === id);
    if (!item) return;
    if (!spendSlee(item.price)) {
        alert('スリーが足りません');
        return;
    }
    inventory[id] = (inventory[id] || 0) + 1;
    saveShopState();
    renderShop();
}

function useShopItem(id) {
    const item = SHOP_ITEMS.find(x => x.id === id);
    if (!item || (inventory[id] || 0) <= 0) return;
    if (id === 'reroll_bell') {
        if (!hasSlept) {
            alert('まだ今夜の仲間がいません');
            return;
        }
        inventory[id] -= 1;
        saveShopState();
        updatePlazaCharacterState(true);
        switchScreen('screen-plaza');
        return;
    }
    if (item.realm) {
        inventory[id] -= 1;
        realmTicket = item.realm;
        saveShopState();
        updateTicketChip();
        renderShop();
    }
}

function buyOrEquipOrb(id) {
    const orb = SHOP_ORBS.find(x => x.id === id);
    if (!orb) return;
    if (!ownedOrbs.includes(id)) {
        if (!spendSlee(orb.price)) {
            alert('スリーが足りません');
            return;
        }
        ownedOrbs.push(id);
    }
    orbSkin = id;
    saveShopState();
    applyOrbSkin();
    renderShop();
}


function applyRealmVisual() {
    const body = document.body;
    if (!body) return;
    body.classList.remove('realm-mist', 'realm-abyss', 'realm-corridor', 'realm-well', 'realm-echo');
    body.classList.add(`realm-${currentRealm || 'mist'}`);
    ensurePlazaRealmFx();
    updateTideUI();
}

function ensurePlazaRealmFx() {
    const host = document.getElementById('plaza-realm-fx');
    if (!host) return;
    const stars = host.querySelector('.fx-abyss-stars');
    if (stars && !stars.dataset.filled) {
        stars.innerHTML = '';
        for (let i = 0; i < 56; i++) {
            const s = document.createElement('span');
            s.className = 'fx-star';
            s.style.left = `${Math.random() * 100}%`;
            s.style.top = `${Math.random() * 72}%`;
            s.style.width = s.style.height = `${1 + Math.random() * 2.4}px`;
            s.style.animationDelay = `${Math.random() * 5}s`;
            s.style.animationDuration = `${2.4 + Math.random() * 3}s`;
            stars.appendChild(s);
        }
        stars.dataset.filled = '1';
    }
    const dust = host.querySelector('.fx-echo-dust');
    if (dust && !dust.dataset.filled) {
        dust.innerHTML = '';
        for (let i = 0; i < 18; i++) {
            const p = document.createElement('span');
            p.className = 'fx-mote';
            p.style.left = `${10 + Math.random() * 80}%`;
            p.style.animationDelay = `${Math.random() * 6}s`;
            p.style.animationDuration = `${7 + Math.random() * 6}s`;
            dust.appendChild(p);
        }
        dust.dataset.filled = '1';
    }
}

function updatePlazaRealmBadge() {
    const badge = document.getElementById('plaza-realm-badge');
    if (badge) badge.textContent = (REALMS[currentRealm] || REALMS.mist).name;
}

function updatePlazaStatusEmpty() {
    const realm = REALMS[currentRealm] || REALMS.mist;
    if (plazaStatusText) {
        plazaStatusText.textContent = `${realm.name}は静かだ（誰もいないようだ…）`;
        plazaStatusText.style.color = 'rgba(255, 255, 255, 0.4)';
    }
    updatePlazaRealmBadge();
}

function showRealmOnResult(id, reason) {
    const nameEl = document.getElementById('result-realm-name');
    const reasonEl = document.getElementById('result-realm-reason');
    const box = document.getElementById('result-realm-box');
    const realm = REALMS[id] || REALMS.mist;
    if (nameEl) nameEl.textContent = realm.name;
    if (reasonEl) reasonEl.textContent = reason || realm.desc;
    if (box) {
        box.classList.remove('realm-mist', 'realm-abyss', 'realm-corridor', 'realm-well', 'realm-echo');
        box.classList.add(`realm-${realm.id}`);
    }
}


function getMoonTide() {
    if (debugTideOverride === 'full') return { key: 'full', name: '月の加護', desc: '満月の光が眠りに寄り添っています。月の仲間とレアが出やすく、スリーも増えます。' };
    if (debugTideOverride === 'near') return { key: 'near', name: '満ちゆく光', desc: '満月が近づいています。月影の回廊が開きやすくなっています。' };
    if (debugTideOverride === 'new') return { key: 'new', name: '影の静けさ', desc: '光が細い夜。基本の仲間が寄りやすく、伝説は現れにくくなります。' };
    if (debugTideOverride === 'none') return { key: 'none', name: '静かな夜', desc: '特別な加護はありません。' };

    const info = (typeof getMoonPhaseInfo === 'function')
        ? getMoonPhaseInfo()
        : { illumination: 0.5, key: 'first_quarter', name: '—' };

    if (info.key === 'full' || info.illumination >= 0.85) {
        return { key: 'full', name: '月の加護', desc: `${info.name}。月の仲間とレアが出やすく、良い眠りにはスリーが加算されます。` };
    }
    if (info.illumination >= 0.75 || info.key === 'waxing_gibbous' || info.key === 'waning_gibbous') {
        return { key: 'near', name: '満ちゆく光', desc: `${info.name}。月影の回廊が開きやすい夜です。` };
    }
    if (info.key === 'new' || info.illumination <= 0.12) {
        return { key: 'new', name: '影の静けさ', desc: `${info.name}。霧の仲間が寄りやすく、伝説は隠れがちです。` };
    }
    return { key: 'none', name: '静かな夜', desc: `${info.name}。特別な加護はありません。` };
}

function getMoonBlessingBonus(rank) {
    const tide = getMoonTide();
    if (!['S', 'A', 'B', 'C'].includes(rank)) return 0;
    if (tide.key === 'full') return rank === 'S' || rank === 'A' ? 25 : 15;
    if (tide.key === 'near') return 10;
    if (tide.key === 'new' && currentRealm === 'mist') return 6;
    return 0;
}

function shouldPlayRealmReveal(realmId) {
    const tide = getMoonTide();
    return realmId === 'corridor' || realmId === 'abyss' || tide.key === 'full';
}

function ensureRealmAffinitySpawn(selectedList, available) {
    if (!selectedList.length || !available.length) return;
    const tide = getMoonTide();
    const wantRealm = currentRealm === 'mist' ? null : currentRealm;
    if (wantRealm) {
        const affinityPool = available.filter(c => c.realm === wantRealm);
        if (affinityPool.length && !selectedList.some(c => c.realm === wantRealm)) {
            selectedList[0] = pickWeightedCharacter(affinityPool) || selectedList[0];
        }
    }
    if (tide.key === 'full') {
        const moonPool = available.filter(c => c.realm === 'corridor');
        if (moonPool.length && Math.random() < 0.6) {
            selectedList[selectedList.length - 1] = pickWeightedCharacter(moonPool);
        }
    }
    if (currentRealm === 'abyss') {
        const rarePool = available.filter(c => c.rarity === 'rare' || c.rarity === 'legendary');
        if (rarePool.length && Math.random() < 0.4) {
            selectedList[Math.floor(selectedList.length / 2)] = pickWeightedCharacter(rarePool);
        }
    }
}

function updateTideUI() {
    const tide = getMoonTide();
    const body = document.body;
    if (body) {
        body.classList.remove('tide-full', 'tide-near', 'tide-new', 'tide-none');
        body.classList.add(`tide-${tide.key}`);
    }

    const plazaTide = document.getElementById('plaza-tide-badge');
    if (plazaTide) {
        plazaTide.classList.remove('hidden');
        plazaTide.textContent = tide.name;
        plazaTide.dataset.tide = tide.key;
    }

    const chip = document.getElementById('result-tide-chip');
    if (chip) {
        if (tide.key === 'none') chip.classList.add('hidden');
        else {
            chip.classList.remove('hidden');
            chip.textContent = tide.name;
        }
    }

    const tideName = document.getElementById('moon-tide-name');
    const tideDesc = document.getElementById('moon-tide-desc');
    if (tideName) tideName.textContent = tide.name;
    if (tideDesc) tideDesc.textContent = tide.desc;
}

function showRealmRevealOverlay(realmId) {
    const realm = REALMS[realmId] || REALMS.mist;
    const tide = getMoonTide();
    const old = document.getElementById('realm-reveal-overlay');
    if (old) old.remove();
    const overlay = document.createElement('div');
    overlay.id = 'realm-reveal-overlay';
    overlay.className = 'realm-reveal-overlay';
    overlay.innerHTML = `
        <div class="realm-reveal-content">
            <div class="realm-reveal-kicker">${tide.key === 'full' ? 'FULL MOON' : 'REALM OPEN'}</div>
            <div class="realm-reveal-title">${realm.name}</div>
            <div class="realm-reveal-sub">${tide.key === 'full' ? '月の加護が広場を銀に染めます' : realm.desc}</div>
        </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('visible'));
    setTimeout(() => {
        overlay.classList.remove('visible');
        setTimeout(() => overlay.remove(), 450);
    }, 1800);
}

function initMoonSystem() {
    document.querySelectorAll('.cosmic-moon, .moon-phase-label, .moon-info-toast').forEach(el => el.remove());
    document.querySelectorAll('.bottom-tab-bar').forEach(bar => {
        if (bar.querySelector('[data-tab-target="screen-moon"]')) return;
        const button = document.createElement('button');
        button.className = 'tab-btn';
        button.dataset.tabTarget = 'screen-moon';
        button.type = 'button';
        button.textContent = '🌙 月';
        button.addEventListener('click', e => {
            e.preventDefault();
            handleNavigationWithInterrupt('screen-moon');
        });
        const dexBtn = bar.querySelector('[data-tab-target="screen-dex"]');
        if (dexBtn) bar.insertBefore(button, dexBtn);
        else bar.appendChild(button);
    });
    renderMoonScreen();
    bindPlazaTideBadge();
}

function bindPlazaTideBadge() {
    const badge = document.getElementById('plaza-tide-badge');
    if (!badge || badge.dataset.wired) return;
    badge.dataset.wired = '1';
    badge.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        showTideDetailSheet();
    });
}

function getTideEffectLines(tide) {
    if (tide.key === 'full') {
        return [
            ['出現', '月の仲間・レアが出やすい'],
            ['スリー', 'S/A で +25、B/C で +15'],
            ['次元', '月影の回廊が開きやすい']
        ];
    }
    if (tide.key === 'near') {
        return [
            ['出現', '月の仲間がやや増えやすい'],
            ['スリー', '良い眠りで +10'],
            ['次元', '月影の回廊が開きやすい']
        ];
    }
    if (tide.key === 'new') {
        return [
            ['出現', '霧の仲間が増え、伝説は出にくい'],
            ['スリー', '境界の霧なら +6'],
            ['次元', '静かな夜向き']
        ];
    }
    return [
        ['出現', '偏りなし'],
        ['スリー', '加護ボーナスなし'],
        ['次元', '今夜の眠り次第']
    ];
}

function showTideDetailSheet() {
    const old = document.getElementById('tide-detail-overlay');
    if (old) old.remove();

    const tide = getMoonTide();
    const moon = (typeof getMoonPhaseInfo === 'function')
        ? getMoonPhaseInfo()
        : { name: '—', age: 0, illumination: 0 };
    const realm = REALMS[currentRealm] || REALMS.mist;
    const rows = getTideEffectLines(tide).map(([label, value]) =>
        `<div class="tide-detail-row"><span>${label}</span><strong>${value}</strong></div>`
    ).join('');

    const overlay = document.createElement('div');
    overlay.id = 'tide-detail-overlay';
    overlay.className = 'tide-detail-overlay';
    overlay.innerHTML = `
        <div class="tide-detail-card" role="dialog" aria-label="今夜の加護">
            <div class="tide-detail-kicker">TONIGHT'S BLESSING</div>
            <div class="tide-detail-title">${tide.name}</div>
            <div class="tide-detail-moon">${moon.name}　月齢 ${Number(moon.age).toFixed(1)}　輝面 ${Math.round(moon.illumination * 100)}%</div>
            <p class="tide-detail-desc">${tide.desc}</p>
            <div class="tide-detail-list">
                ${rows}
                <div class="tide-detail-row"><span>いまの次元</span><strong>${realm.name}</strong></div>
            </div>
            <button type="button" class="tide-detail-close">閉じる</button>
        </div>
    `;
    document.body.appendChild(overlay);
    const close = () => overlay.remove();
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    overlay.querySelector('.tide-detail-close').addEventListener('click', close);
}
