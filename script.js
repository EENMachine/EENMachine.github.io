'use strict';

/* ============================================================
   BOOT SEQUENCE
   ============================================================ */
const bootLines = [
    { text: '> Initializing A.I. kernel...', type: 'ok', delay: 0 },
    { text: '> Loading security modules...', type: 'ok', delay: 320 },
    { text: '> Verifying identity...', type: 'granted', delay: 640 },
    { text: '> Establishing secure connection...', type: 'ok', delay: 960 },
    { text: '> Decrypting profile data...', type: 'ok', delay: 1280 },
    { text: '> Welcome. You are now connected to Ask Ian.', type: '', delay: 1600 },
];

function runBoot() {
    document.body.classList.add('boot-active');
    const linesEl = document.getElementById('boot-lines');
    const barEl   = document.getElementById('boot-bar');
    const pctEl   = document.getElementById('boot-pct');

    let pct = 0;
    const totalTime = 1800;
    const interval = setInterval(() => {
        pct = Math.min(pct + Math.random() * 6, 100);
        barEl.style.width = pct + '%';
        pctEl.textContent = Math.floor(pct) + '%';
        if (pct >= 100) clearInterval(interval);
    }, 80);

    bootLines.forEach(({ text, type, delay }) => {
        setTimeout(() => {
            const span = document.createElement('span');
            span.className = 'boot-line' + (type ? ' ' + type : '');
            span.textContent = text;
            linesEl.appendChild(span);
        }, delay);
    });

    setTimeout(() => {
        barEl.style.width = '100%';
        pctEl.textContent = '100%';
    }, totalTime);

    setTimeout(() => {
        const screen = document.getElementById('boot-screen');
        screen.classList.add('hidden');
        document.body.classList.remove('boot-active');
        initReveal();
    }, totalTime + 700);
}

runBoot();

/* ============================================================
   HEX PARTICLE CANVAS
   ============================================================ */
(function initCanvas() {
    const canvas = document.getElementById('hex-canvas');
    const ctx    = canvas.getContext('2d');
    const chars  = '0123456789ABCDEF';
    const particles = [];

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 55; i++) {
        particles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vy: 0.18 + Math.random() * 0.28,
            char: chars[Math.floor(Math.random() * chars.length)],
            opacity: 0.05 + Math.random() * 0.18,
            size: 10 + Math.random() * 8,
            tickRate: 40 + Math.floor(Math.random() * 60),
            tick: 0,
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = 'bold 13px JetBrains Mono, monospace';

        particles.forEach(p => {
            p.tick++;
            if (p.tick >= p.tickRate) {
                p.char = chars[Math.floor(Math.random() * chars.length)];
                p.tick = 0;
            }
            p.y += p.vy;
            if (p.y > canvas.height + 30) {
                p.y = -20;
                p.x = Math.random() * canvas.width;
            }
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle   = '#00d4ff';
            ctx.font        = `bold ${p.size}px JetBrains Mono, monospace`;
            ctx.fillText(p.char, p.x, p.y);
        });

        ctx.globalAlpha = 1;
        requestAnimationFrame(draw);
    }

    draw();
})();

/* ============================================================
   NAVBAR SCROLL
   ============================================================ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    floatBtnVisibility();
}, { passive: true });

/* ============================================================
   MOBILE MENU
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
    });
});

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initReveal() {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                if (e.target.classList.contains('skills-terminal')) animateSkillBars();
            }
        });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
}

/* ============================================================
   SKILL BARS
   ============================================================ */
let skillsAnimated = false;
function animateSkillBars() {
    if (skillsAnimated) return;
    skillsAnimated = true;
    document.querySelectorAll('.skill-fill').forEach(bar => {
        const w = bar.dataset.w;
        requestAnimationFrame(() => { bar.style.width = w + '%'; });
    });
}

/* ============================================================
   CHAT ENGINE
   ============================================================ */
const intents = [
    {
        keys: ['who are you', 'who is ian', 'about yourself', 'tell me about you', 'introduce yourself', 'bio', 'background', 'your story', 'about ian'],
        section: 'about',
        label: '~/about',
        response: `Growing up in a household shaped by law enforcement and military service — my dad was a Pennsylvania State Police officer — protecting others has always been part of who I am. Cybersecurity is where that instinct meets technology. I'm Ian Bowser, a CS and Cybersecurity grad from IUP, currently working as a Service Support Analyst at Envera Systems in Florida. Every day on the job reminds me exactly why I got into this field.`,
    },
    {
        keys: ['work', 'job', 'experience', 'career', 'employed', 'armstrong', 'envera', 'professional', 'work history', 'positions'],
        section: 'experience',
        label: '~/experience',
        response: `My career has been a deliberate build. I started at Armstrong Utilities handling 150+ tickets a week, and that job gave me a real, ground-level view of how often cyberattacks actually hit people — not in textbooks, but real people being phished, scammed, having their accounts drained. That sharpened everything for me. Now at Envera Systems, I'm managing security infrastructure for hundreds of communities across Florida and Texas. It's hands-on security operations work, and it's exactly where I want to be.`,
    },
    {
        keys: ['skills', 'tools', 'languages', 'tech', 'python', 'wireshark', 'nmap', 'ghidra', 'know', 'use', 'software', 'proficient', 'stack', 'programming'],
        section: 'skills',
        label: '~/skills',
        response: `On the technical side, I work with Python, Java, and C, and I've got solid hands-on experience with security tools like Wireshark, Nmap, Metasploit, Ghidra, FTK, and Autopsy. On the professional side, I take incident response, threat assessment, and documentation seriously — in security, the paper trail matters just as much as the fix itself. My OS comfort zone spans Linux, Windows, and macOS.`,
    },
    {
        keys: ['projects', 'project', 'built', 'nsa', 'codebreaker', 'portfolio', 'code', 'created', 'developed', 'made', 'work on', 'github'],
        section: 'projects',
        label: '~/projects',
        response: `My most notable project so far is the NSA Codebreaker Challenge — I analyzed PCAP files for anomalous login handshakes using Wireshark and wrote Python scripts to sift through thousands of corporate login records to trace an attack vector to its source. I also built a structured cyber incident response plan using real breaches from the CSIDB, scored vulnerabilities with CVSS, and presented the findings. My project portfolio is actively growing — more coming soon.`,
    },
    {
        keys: ['school', 'education', 'degree', 'iup', 'university', 'studied', 'college', 'major', 'graduated', 'usf', 'florida', 'coursework', 'classes'],
        section: 'about',
        label: '~/about',
        response: `I graduated from Indiana University of Pennsylvania in 2024 with a B.S. in Computer Science and a concentration in Cybersecurity — plus a Minor in Criminology, which honestly pairs really well with security work when you start thinking about threat actor psychology and social engineering. I studied under Dr. Waleed Farag and Dr. Soundarajan Ezekiel, whose mentorship shaped how I approach problems in this field. I'm currently pursuing my M.S. in Cybersecurity at USF.`,
    },
    {
        keys: ['contact', 'hire', 'reach', 'email', 'available', 'talk', 'connect', 'message', 'linkedin', 'open to work', 'opportunities'],
        section: 'contact',
        label: '~/contact',
        response: `Absolutely — I'm always open to connecting. Whether you're a recruiter, a fellow security professional, or just someone who wants to talk cybersecurity, I'm genuinely happy to chat. The best way to reach me is through email at ianbowser6@gmail.com or through LinkedIn. I respond quickly.`,
    },
    {
        keys: ['goal', 'goals', 'future', 'plan', 'soc', 'aspire', 'dream', 'next', 'pursuing', 'master', "master's", 'ambition', 'motivation', 'why cybersecurity', 'why security'],
        section: 'about',
        label: '~/about',
        response: `My goal is to work in a Security Operations Center — I want to be in the room where threats are caught and neutralized in real time. The work I'm doing at Envera is giving me a real taste of that, and I'm pursuing my M.S. in Cybersecurity at USF to sharpen my expertise. The cybersecurity talent shortage is real and well documented. I want to be part of closing that gap.`,
    },
    {
        keys: ['criminology', 'criminal', 'law enforcement', 'police', 'military', 'family', 'father', 'personal'],
        section: 'about',
        label: '~/about',
        response: `My background isn't purely technical. My dad was a Pennsylvania State Police officer, and my family has a deep military background. Growing up in that environment gave me a strong sense of discipline and a genuine commitment to protecting people. When I discovered cybersecurity, it felt like the same mission just moved to a different domain. That's not something I take lightly.`,
    },
];

const fallbacks = [
    `That's a good one — I don't have a pre-loaded answer for that, but I'd be happy to talk it through directly. Send me a message through my contact section.`,
    `Hmm, that one's outside my current database. Shoot me an email or connect on LinkedIn — I'm always down to chat.`,
    `I don't have a scripted answer for that, but reach out directly and we can get into it. That's what I'm here for.`,
];

function matchIntent(query) {
    const q = query.toLowerCase().trim();
    let best = null;
    let bestScore = 0;

    for (const intent of intents) {
        let score = 0;
        for (const key of intent.keys) {
            if (q.includes(key)) {
                score += key.split(' ').length;
            }
        }
        if (score > bestScore) {
            bestScore = score;
            best = intent;
        }
    }

    return bestScore > 0 ? best : null;
}

/* ============================================================
   CHAT UI HELPERS
   ============================================================ */
function typewrite(el, text, speed = 18, done) {
    let i = 0;
    el.textContent = '';
    const iv = setInterval(() => {
        el.textContent += text[i++];
        if (i >= text.length) {
            clearInterval(iv);
            if (done) done();
        }
    }, speed);
}

function scrollToBottom(container) {
    container.scrollTop = container.scrollHeight;
}

function createAIMessage(container) {
    const div = document.createElement('div');
    div.className = 'chat-msg ai-msg';
    const prompt = document.createElement('span');
    prompt.className = 'msg-prompt';
    prompt.textContent = 'ian@portfolio:~$ ';
    const body = document.createElement('span');
    body.className = 'msg-body';
    div.appendChild(prompt);
    div.appendChild(body);
    container.appendChild(div);
    scrollToBottom(container);
    return body;
}

function appendUserMessage(container, text) {
    const div = document.createElement('div');
    div.className = 'chat-msg user-msg';
    div.textContent = text;
    container.appendChild(div);
    scrollToBottom(container);
}

function appendThinking(container) {
    const div = document.createElement('div');
    div.className = 'chat-msg ai-msg thinking-msg';
    div.innerHTML = '<span class="msg-prompt">ian@portfolio:~$ </span><span class="msg-body">thinking<span class="term-blink">█</span></span>';
    container.appendChild(div);
    scrollToBottom(container);
    return div;
}

function appendNavPrompt(container, intent) {
    const btn = document.createElement('button');
    btn.className = 'chat-nav-prompt';
    btn.innerHTML = `<span class="msg-prompt">&gt;&gt;</span> Navigate to: <strong>${intent.label}</strong> &nbsp;→`;
    btn.addEventListener('click', () => {
        const target = document.getElementById(intent.section);
        if (!target) return;
        const offset = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
        setTimeout(() => target.classList.add('section-flash'), 600);
        setTimeout(() => target.classList.remove('section-flash'), 1800);
        if (floatModal && !floatModal.classList.contains('float-modal-hidden')) {
            floatModal.classList.add('float-modal-hidden');
        }
    });
    container.appendChild(btn);
    scrollToBottom(container);
}

function handleQuery(query, messagesEl) {
    if (!query.trim()) return;

    appendUserMessage(messagesEl, query);
    const thinking = appendThinking(messagesEl);

    setTimeout(() => {
        thinking.remove();
        const intent = matchIntent(query);

        const bodyEl = createAIMessage(messagesEl);
        const responseText = intent
            ? intent.response
            : fallbacks[Math.floor(Math.random() * fallbacks.length)];

        typewrite(bodyEl, responseText, 16, () => {
            if (intent) appendNavPrompt(messagesEl, intent);
            scrollToBottom(messagesEl);
        });
    }, 800 + Math.random() * 400);
}

/* ============================================================
   HERO CHAT
   ============================================================ */
const heroForm     = document.getElementById('chat-form');
const heroInput    = document.getElementById('chat-input');
const heroMessages = document.getElementById('chat-messages');

heroForm.addEventListener('submit', e => {
    e.preventDefault();
    const q = heroInput.value.trim();
    if (!q) return;
    heroInput.value = '';
    handleQuery(q, heroMessages);
});

/* ============================================================
   FLOATING CHAT
   ============================================================ */
const floatBtn   = document.getElementById('float-btn');
const floatModal = document.getElementById('float-modal');
const floatClose = document.getElementById('float-close');
const floatForm  = document.getElementById('float-form');
const floatInput = document.getElementById('float-input');
const floatMsgs  = document.getElementById('float-messages');

function floatBtnVisibility() {
    const heroBottom = document.getElementById('home').getBoundingClientRect().bottom;
    floatBtn.classList.toggle('visible', heroBottom < 0);
}

floatBtn.addEventListener('click', () => {
    floatModal.classList.toggle('float-modal-hidden');
    if (!floatModal.classList.contains('float-modal-hidden')) {
        setTimeout(() => floatInput.focus(), 100);
    }
});

floatClose.addEventListener('click', () => {
    floatModal.classList.add('float-modal-hidden');
});

floatForm.addEventListener('submit', e => {
    e.preventDefault();
    const q = floatInput.value.trim();
    if (!q) return;
    floatInput.value = '';
    handleQuery(q, floatMsgs);
});

/* ============================================================
   ACTIVE NAV HIGHLIGHT
   ============================================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                link.style.color = href === '#' + entry.target.id ? 'var(--cyan)' : '';
            });
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObs.observe(s));
