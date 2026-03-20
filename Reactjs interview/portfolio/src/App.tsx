import React, { useState, useEffect, useRef } from 'react'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&family=Space+Mono:wght@400;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    /* ── PALETTE ── */
    --navy:        #0a0e2a;
    --navy-mid:    #111840;
    --navy-light:  #1c2455;
    --navy-border: #232d6a;
    --red:         #8b0000;
    --red-bright:  #c0392b;
    --red-glow:    rgba(192,57,43,0.18);

    /* multicolour accents */
    --cyan:        #00d4ff;
    --lime:        #a8ff3e;
    --amber:       #ffb347;
    --violet:      #b44bff;
    --pink:        #ff4da6;
    --teal:        #00e5c8;

    --text:        #f0eeff;
    --text-dim:    #8892b0;
    --surface:     #141933;
    --surface2:    #0f152b;

    --font-h: 'Syne', sans-serif;
    --font-s: 'Instrument Serif', serif;
    --font-m: 'Space Mono', monospace;

    --radius-sm: 6px;
    --radius-md: 12px;
    --radius-lg: 20px;

    /* touch targets */
    --tap: 48px;
  }

  html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }

  body {
    background: var(--navy);
    color: var(--text);
    font-family: var(--font-m);
    overflow-x: hidden;
    line-height: 1.6;
  }

  /* scrollbar */
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: var(--navy); }
  ::-webkit-scrollbar-thumb { background: var(--navy-border); border-radius: 2px; }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes marquee  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes rotate   { to{transform:rotate(360deg)} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes gradShift{
    0%  { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100%{ background-position: 0% 50%; }
  }
  @keyframes pulseRed {
    0%,100%{box-shadow:0 0 0 0 rgba(192,57,43,0.5)}
    60%    {box-shadow:0 0 0 10px rgba(192,57,43,0)}
  }
  @keyframes shimmer {
    from{background-position:-600px 0}
    to  {background-position: 600px 0}
  }

  .fu{animation:fadeUp .65s cubic-bezier(.16,1,.3,1) both}
  .fi{animation:fadeIn .8s ease both}
  .d1{animation-delay:.05s} .d2{animation-delay:.12s}
  .d3{animation-delay:.19s} .d4{animation-delay:.26s}
  .d5{animation-delay:.33s} .d6{animation-delay:.40s}

  /* ════════════════════════════════════
     NAV
  ════════════════════════════════════ */
  nav {
    position: fixed; top:0; left:0; right:0; z-index:500;
    display: flex; align-items:center; justify-content:space-between;
    padding: 0 clamp(1rem,4vw,3rem);
    height: 64px;
    background: rgba(10,14,42,0.92);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--navy-border);
  }

  .nav-logo {
    font-family: var(--font-h); font-weight:800; font-size:1.25rem;
    letter-spacing:1px;
    background: linear-gradient(135deg, var(--cyan), var(--violet));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* desktop nav links */
  .nav-links {
    display: flex; gap:0; list-style:none;
  }
  .nav-links a {
    display: flex; align-items:center;
    height: 64px; padding: 0 1.1rem;
    font-size: 0.62rem; letter-spacing:2px; text-transform:uppercase;
    color: var(--text-dim); text-decoration:none;
    transition: color .2s, border-color .2s;
    border-bottom: 2px solid transparent;
  }
  .nav-links a:hover { color:var(--cyan); border-bottom-color:var(--cyan); }

  .nav-right { display:flex; align-items:center; gap:1rem; }
  .nav-avail {
    display:flex; align-items:center; gap:0.5rem;
    font-size:0.6rem; letter-spacing:1px; color:var(--teal);
    background: rgba(0,229,200,0.08); border:1px solid rgba(0,229,200,0.2);
    padding: 0.35rem 0.8rem; border-radius:999px;
    white-space:nowrap;
  }
  .avail-dot {
    width:7px; height:7px; border-radius:50%;
    background:var(--teal); flex-shrink:0;
    animation: blink 2s ease infinite;
  }

  /* hamburger — hidden on desktop */
  .hamburger {
    display:none; flex-direction:column; gap:5px;
    background:none; border:none; cursor:pointer;
    padding:8px; min-width:var(--tap); min-height:var(--tap);
    align-items:center; justify-content:center;
  }
  .hamburger span {
    display:block; width:22px; height:2px;
    background:var(--text); border-radius:2px;
    transition: transform .3s, opacity .3s;
  }
  .hamburger.open span:nth-child(1){ transform:translateY(7px) rotate(45deg); }
  .hamburger.open span:nth-child(2){ opacity:0; }
  .hamburger.open span:nth-child(3){ transform:translateY(-7px) rotate(-45deg); }

  /* mobile drawer */
  .mobile-drawer {
    display:none; position:fixed;
    top:64px; left:0; right:0; bottom:0;
    background:rgba(10,14,42,0.98);
    backdrop-filter:blur(20px);
    z-index:499; padding:2rem;
    flex-direction:column; gap:0;
    overflow-y:auto;
  }
  .mobile-drawer.open { display:flex; }
  .mobile-drawer a {
    display:flex; align-items:center;
    padding:1.1rem 0; border-bottom:1px solid var(--navy-border);
    font-family:var(--font-h); font-size:1.5rem; font-weight:700;
    letter-spacing:1px; color:var(--text); text-decoration:none;
    transition:color .2s;
  }
  .mobile-drawer a:hover { color:var(--cyan); }
  .mobile-drawer .m-num {
    font-family:var(--font-m); font-size:0.65rem; font-weight:400;
    color:var(--text-dim); margin-right:1rem; min-width:24px;
  }

  /* ════════════════════════════════════
     HERO
  ════════════════════════════════════ */
  .hero {
    min-height: 100svh;
    padding: calc(64px + 3rem) clamp(1rem,5vw,3rem) 4rem;
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 3rem;
    align-items: center;
    position: relative; overflow:hidden;
  }

  /* animated gradient orbs */
  .hero::before {
    content:'';
    position:absolute; top:-20%; right:-10%;
    width:min(650px,80vw); height:min(650px,80vw);
    background:radial-gradient(circle at 40% 40%, rgba(10,14,42,0) 0%, rgba(139,0,0,0.22) 40%, transparent 70%);
    border-radius:50%; pointer-events:none;
    animation:float 8s ease-in-out infinite;
  }
  .hero::after {
    content:'';
    position:absolute; bottom:-20%; left:-10%;
    width:min(500px,70vw); height:min(500px,70vw);
    background:radial-gradient(circle at 60% 60%, rgba(0,212,255,0.1) 0%, transparent 65%);
    border-radius:50%; pointer-events:none;
  }

  .hero-left { position:relative; z-index:1; }

  .hero-eyebrow {
    display:inline-flex; align-items:center; gap:0.6rem;
    font-size: clamp(0.55rem,1.5vw,0.65rem);
    letter-spacing:3px; text-transform:uppercase;
    color:var(--cyan);
    background:rgba(0,212,255,0.08); border:1px solid rgba(0,212,255,0.22);
    padding:0.35rem 1rem; border-radius:999px;
    margin-bottom:1.8rem;
  }

  .hero-name {
    font-family: var(--font-h); font-weight:800;
    font-size: clamp(3rem,8vw,8rem);
    line-height: 0.9; letter-spacing:-2px;
    color: var(--text);
    margin-bottom: 0.3rem;
  }
  .hero-name .grad {
    display:block;
    background: linear-gradient(135deg, var(--red-bright) 0%, var(--violet) 40%, var(--cyan) 80%);
    background-size:200% 200%;
    animation: gradShift 5s ease infinite;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text;
    font-family:var(--font-s); font-style:italic; font-weight:300;
  }

  .hero-desc {
    font-size: clamp(0.72rem,1.8vw,0.82rem);
    line-height:1.9; color:var(--text-dim);
    margin-top:1.8rem; max-width:480px;
  }
  .hero-desc strong { color:var(--text); }

  .hero-btns {
    display:flex; gap:1rem; margin-top:2.5rem; flex-wrap:wrap;
  }

  /* PRIMARY CTA */
  .btn-primary {
    display:inline-flex; align-items:center; gap:0.5rem;
    background: linear-gradient(135deg,var(--red) 0%,var(--red-bright) 100%);
    color:#fff; border:none;
    padding: 0 2rem; height:var(--tap);
    font-family:var(--font-m); font-size:0.68rem;
    font-weight:700; letter-spacing:2px; text-transform:uppercase;
    cursor:pointer; border-radius:var(--radius-sm);
    transition:all .25s; text-decoration:none;
    animation: pulseRed 3s ease infinite;
    min-width:44px;
  }
  .btn-primary:hover { transform:translateY(-3px); box-shadow:0 12px 30px rgba(139,0,0,0.5); }

  .btn-secondary {
    display:inline-flex; align-items:center; gap:0.5rem;
    background:transparent; color:var(--cyan);
    border:1.5px solid rgba(0,212,255,0.4);
    padding: 0 2rem; height:var(--tap);
    font-family:var(--font-m); font-size:0.68rem;
    letter-spacing:2px; text-transform:uppercase;
    cursor:pointer; border-radius:var(--radius-sm);
    transition:all .25s; text-decoration:none;
    min-width:44px;
  }
  .btn-secondary:hover { background:rgba(0,212,255,0.08); border-color:var(--cyan); }

  /* HERO RIGHT — info cards */
  .hero-right {
    display:flex; flex-direction:column; gap:0;
    position:relative; z-index:1;
    background:var(--surface);
    border:1px solid var(--navy-border);
    border-radius:var(--radius-lg);
    overflow:hidden;
  }
  .hero-right-header {
    padding:1rem 1.5rem;
    background:linear-gradient(135deg,var(--navy-light),var(--red) 200%);
    display:flex; align-items:center; gap:0.5rem;
  }
  .hero-right-header span {
    font-size:0.6rem; letter-spacing:2px; text-transform:uppercase; color:rgba(255,255,255,0.6);
  }
  .dot-r { width:10px;height:10px;border-radius:50%;background:var(--red-bright); }
  .dot-y { width:10px;height:10px;border-radius:50%;background:var(--amber); }
  .dot-g { width:10px;height:10px;border-radius:50%;background:var(--lime); }

  .info-row {
    display:flex; align-items:flex-start; gap:1rem;
    padding:0.9rem 1.5rem;
    border-bottom:1px solid rgba(35,45,106,0.6);
    transition:background .2s;
  }
  .info-row:last-child{border-bottom:none;}
  .info-row:hover{background:rgba(255,255,255,0.03);}
  .info-key {
    font-size:0.58rem; letter-spacing:2px; text-transform:uppercase;
    color:var(--text-dim); min-width:80px; flex-shrink:0; padding-top:2px;
  }
  .info-val { font-size:0.72rem; color:var(--text); line-height:1.6; white-space:pre-line; }
  .info-val a { color:var(--cyan); text-decoration:none; transition:color .2s; }
  .info-val a:hover { color:var(--lime); }

  /* ════════════════════════════════════
     TICKER
  ════════════════════════════════════ */
  .ticker {
    overflow:hidden; padding:0.85rem 0;
    background:linear-gradient(90deg,var(--red) 0%,var(--navy-mid) 30%,var(--navy-light) 70%,var(--red) 100%);
    background-size:200% 100%;
    animation:gradShift 8s ease infinite;
    border-top:1px solid var(--navy-border);
    border-bottom:1px solid var(--navy-border);
  }
  .ticker-inner {
    display:flex; white-space:nowrap;
    animation:marquee 25s linear infinite;
    width:max-content;
  }
  .ticker-item {
    font-family:var(--font-h); font-size:0.78rem;
    letter-spacing:3px; color:rgba(240,238,255,0.55);
    padding:0 2rem; text-transform:uppercase;
  }
  .ticker-item b { margin-right:1.5rem; }
  .ticker-item b.c1{color:var(--cyan)}
  .ticker-item b.c2{color:var(--lime)}
  .ticker-item b.c3{color:var(--amber)}
  .ticker-item b.c4{color:var(--violet)}
  .ticker-item b.c5{color:var(--pink)}

  /* ════════════════════════════════════
     SECTION SHELL
  ════════════════════════════════════ */
  .section {
    padding: clamp(3rem,8vw,6rem) clamp(1rem,5vw,3rem);
    border-bottom:1px solid var(--navy-border);
  }
  .sec-head {
    display:flex; align-items:center; gap:1.2rem; margin-bottom:3rem;
    flex-wrap:wrap;
  }
  .sec-num { font-size:0.6rem; letter-spacing:3px; color:var(--text-dim); }
  .sec-title {
    font-family:var(--font-h); font-weight:800;
    font-size:clamp(2rem,5vw,4rem);
    letter-spacing:-1px; line-height:1; color:var(--text);
  }
  .sec-title .accent-word {
    background:linear-gradient(135deg,var(--red-bright),var(--violet));
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  }
  .sec-line{flex:1;height:1px;background:var(--navy-border);min-width:20px;}

  /* ════════════════════════════════════
     ABOUT
  ════════════════════════════════════ */
  .about-grid {
    display:grid; grid-template-columns:1.1fr 0.9fr;
    gap:clamp(2rem,5vw,5rem); align-items:start;
  }
  .about-body {
    font-family:var(--font-s); font-size:clamp(1rem,2.5vw,1.25rem);
    line-height:1.85; color:var(--text-dim); font-style:italic;
  }
  .about-body strong{color:var(--text);font-style:normal;}
  .about-body em{color:var(--cyan);font-style:italic;}

  .edu-card {
    background:linear-gradient(135deg,var(--navy-mid),var(--navy-light));
    border:1px solid var(--navy-border);
    border-radius:var(--radius-md); padding:1.8rem;
    position:relative; overflow:hidden; margin-bottom:1.2rem;
  }
  .edu-card::before {
    content:''; position:absolute; left:0; top:0;
    width:4px; height:100%;
    background:linear-gradient(to bottom,var(--red-bright),var(--violet));
  }
  .edu-degree{font-family:var(--font-h);font-size:1rem;font-weight:700;letter-spacing:0.5px;}
  .edu-uni{font-size:0.7rem;color:var(--cyan);letter-spacing:1px;margin-top:0.4rem;}
  .edu-date{font-size:0.6rem;color:var(--text-dim);letter-spacing:2px;margin-top:0.3rem;}

  .cert-badge {
    display:inline-flex; align-items:center; gap:0.6rem;
    background:rgba(255,179,71,0.08); border:1px solid rgba(255,179,71,0.3);
    border-radius:var(--radius-sm); padding:0.65rem 1.1rem;
    font-size:0.65rem; letter-spacing:1px; color:var(--amber);
  }

  /* ════════════════════════════════════
     SKILLS
  ════════════════════════════════════ */
  .skills-wrap {
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
    gap:1px; background:var(--navy-border);
    border:1px solid var(--navy-border);
    border-radius:var(--radius-md); overflow:hidden;
  }
  .skill-group {
    background:var(--surface); padding:1.8rem;
    transition:background .25s;
  }
  .skill-group:hover{background:var(--surface2);}
  .sg-title {
    font-family:var(--font-h); font-size:0.62rem; font-weight:700;
    letter-spacing:3px; text-transform:uppercase;
    margin-bottom:1.2rem; padding-bottom:0.7rem;
    border-bottom:1px solid var(--navy-border);
  }
  .sg-items{display:flex;flex-direction:column;gap:0;}
  .sg-item {
    display:flex; align-items:center; gap:0.7rem;
    font-size:0.7rem; color:var(--text-dim);
    padding:0.55rem 0; border-bottom:1px solid rgba(35,45,106,0.4);
    transition:color .2s, padding-left .2s;
  }
  .sg-item:last-child{border-bottom:none;}
  .sg-item:hover{color:var(--text);padding-left:0.5rem;}
  .sg-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;}

  /* ════════════════════════════════════
     EXPERIENCE
  ════════════════════════════════════ */
  .exp-card {
    background:var(--surface);
    border:1px solid var(--navy-border);
    border-radius:var(--radius-lg); padding:clamp(1.5rem,4vw,3rem);
    position:relative; overflow:hidden;
  }
  .exp-card::before {
    content:''; position:absolute; top:0; left:0; right:0;
    height:3px;
    background:linear-gradient(90deg,var(--red-bright),var(--violet),var(--cyan));
  }
  .exp-badge {
    position:absolute; top:1.8rem; right:1.8rem;
    font-size:0.58rem; letter-spacing:3px; text-transform:uppercase;
    color:var(--teal); background:rgba(0,229,200,0.08);
    border:1px solid rgba(0,229,200,0.25); padding:0.3rem 0.75rem;
    border-radius:999px;
  }
  .exp-role{font-family:var(--font-h);font-size:clamp(1.5rem,4vw,2.2rem);font-weight:800;letter-spacing:-0.5px;padding-right:7rem;}
  .exp-co{font-size:0.7rem;letter-spacing:3px;color:var(--red-bright);margin:0.6rem 0 0.3rem;}
  .exp-date{font-size:0.6rem;letter-spacing:2px;color:var(--text-dim);margin-bottom:1.8rem;}
  .exp-points{display:flex;flex-direction:column;gap:0.7rem;list-style:none;}
  .exp-points li{
    font-size:clamp(0.68rem,1.8vw,0.76rem); line-height:1.75;
    color:var(--text-dim); padding-left:1.4rem; position:relative;
  }
  .exp-points li::before{content:'▸';position:absolute;left:0;color:var(--cyan);}

  /* ════════════════════════════════════
     PROJECTS
  ════════════════════════════════════ */
  .projects-grid {
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:clamp(0.75rem,2vw,1.2rem);
  }
  .proj-card {
    background:var(--surface);
    border:1px solid var(--navy-border);
    border-radius:var(--radius-lg); padding:clamp(1.5rem,3vw,2.5rem);
    position:relative; overflow:hidden;
    cursor:pointer; transition:transform .25s, box-shadow .25s, border-color .25s;
    display:flex; flex-direction:column; gap:1rem;
  }
  .proj-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    opacity:0; transition:opacity .25s;
  }
  .proj-card:hover { transform:translateY(-5px); border-color:var(--navy-light); }
  .proj-card:hover::before{opacity:1;}
  .proj-card:hover .proj-arr{transform:translate(5px,-5px);}

  .proj-card.featured{
    grid-column:span 2;
    display:grid; grid-template-columns:1fr 1fr;
    gap:clamp(1.5rem,3vw,3rem); align-items:center;
  }
  .proj-card.p1::before{background:linear-gradient(90deg,var(--teal),var(--cyan));}
  .proj-card.p2::before{background:linear-gradient(90deg,var(--amber),var(--pink));}
  .proj-card.p3::before{background:linear-gradient(90deg,var(--red-bright),var(--violet));}
  .proj-card.p4::before{background:linear-gradient(90deg,var(--lime),var(--cyan));}

  .proj-tag{font-size:0.58rem;letter-spacing:3px;text-transform:uppercase;margin-bottom:0.25rem;display:inline-block;}
  .proj-name{font-family:var(--font-h);font-size:clamp(1.5rem,3.5vw,2rem);font-weight:800;letter-spacing:-0.5px;line-height:1;color:var(--text);}
  .proj-card.featured .proj-name{font-size:clamp(2rem,4.5vw,3rem);}
  .proj-sub{font-size:0.6rem;letter-spacing:2px;color:var(--text-dim);margin-top:0.2rem;}
  .proj-desc{font-size:clamp(0.68rem,1.8vw,0.74rem);color:var(--text-dim);line-height:1.75;}
  .proj-stack{display:flex;flex-wrap:wrap;gap:0.4rem;margin-top:auto;}
  .stack-pill{
    font-size:0.58rem;letter-spacing:1px;
    border:1px solid var(--navy-border);padding:0.22rem 0.55rem;
    color:var(--text-dim);border-radius:4px;
    background:var(--surface2);
  }
  .proj-links{display:flex;gap:0.9rem;margin-top:0.5rem;flex-wrap:wrap;}
  .proj-link{
    font-size:0.62rem;letter-spacing:2px;text-transform:uppercase;
    color:var(--cyan);text-decoration:none;
    display:inline-flex;align-items:center;gap:0.3rem;
    padding:0.3rem 0; border-bottom:1px solid rgba(0,212,255,0.3);
    transition:border-color .2s, color .2s; min-height:var(--tap);
  }
  .proj-link:hover{border-color:var(--cyan);color:var(--lime);}
  .proj-arr{position:absolute;top:1.8rem;right:1.8rem;font-size:1.1rem;color:var(--navy-border);transition:transform .2s;}

  /* featured visual */
  .feat-vis{
    aspect-ratio:16/9;
    background:linear-gradient(135deg,var(--navy) 0%,var(--navy-light) 100%);
    border:1px solid var(--navy-border); border-radius:var(--radius-md);
    display:grid;place-items:center;position:relative;overflow:hidden;
  }
  .feat-vis::before{
    content:'';position:absolute;inset:0;
    background:radial-gradient(circle at 50% 50%,rgba(139,0,0,0.25) 0%,transparent 65%);
  }
  .feat-vis-ring{
    width:55%;aspect-ratio:1;
    border:1px solid rgba(0,212,255,0.15);
    border-radius:50%; display:grid;place-items:center;
    font-family:var(--font-h);font-size:clamp(0.6rem,1.5vw,0.75rem);
    font-weight:800;letter-spacing:4px;
    color:rgba(0,212,255,0.4);position:relative;
  }
  .feat-vis-ring::before,.feat-vis-ring::after{
    content:'';position:absolute;
    inset:12px;border:1px dashed rgba(0,212,255,0.1);
    border-radius:50%;animation:rotate 14s linear infinite;
  }
  .feat-vis-ring::after{inset:26px;animation-direction:reverse;animation-duration:9s;}

  /* ════════════════════════════════════
     CREATIVE
  ════════════════════════════════════ */
  .creative-grid{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
    gap:clamp(0.75rem,2vw,1.2rem);
  }
  .cr-card{
    background:var(--surface);
    border:1px solid var(--navy-border);
    border-radius:var(--radius-lg); padding:2rem;
    display:flex;flex-direction:column;gap:1rem;
    cursor:pointer;transition:transform .25s, border-color .25s, background .25s;
    position:relative;overflow:hidden;
  }
  .cr-card::after{
    content:'';position:absolute;top:0;left:0;right:0;height:2px;
    transition:opacity .25s; opacity:0;
  }
  .cr-card.cr1::after{background:linear-gradient(90deg,var(--cyan),var(--teal));}
  .cr-card.cr2::after{background:linear-gradient(90deg,var(--red-bright),var(--pink));}
  .cr-card.cr3::after{background:linear-gradient(90deg,var(--violet),var(--cyan));}
  .cr-card.cr4::after{background:linear-gradient(90deg,var(--lime),var(--amber));}
  .cr-card:hover{transform:translateY(-5px);border-color:var(--navy-light);}
  .cr-card:hover::after{opacity:1;}
  .cr-card:hover .cr-icon{animation:float 1.5s ease infinite;}
  .cr-icon{font-size:2.5rem;line-height:1;}
  .cr-title{font-family:var(--font-h);font-size:1.1rem;font-weight:700;letter-spacing:0.5px;}
  .cr-desc{font-size:0.68rem;color:var(--text-dim);line-height:1.75;}
  .cr-tags{display:flex;flex-wrap:wrap;gap:0.4rem;margin-top:auto;}
  .cr-tag{
    font-size:0.56rem;letter-spacing:1px;
    border:1px solid var(--navy-border);padding:0.22rem 0.5rem;
    color:var(--text-dim);border-radius:4px;
  }

  /* ════════════════════════════════════
     CONTACT
  ════════════════════════════════════ */
  .contact-wrap{display:grid;grid-template-columns:1fr 1fr;gap:clamp(2rem,6vw,6rem);align-items:start;}
  .contact-hl{
    font-family:var(--font-h);font-weight:800;
    font-size:clamp(2.5rem,6vw,5.5rem);
    line-height:0.92;letter-spacing:-1.5px;color:var(--text);
  }
  .contact-hl em{
    font-family:var(--font-s);font-style:italic;font-weight:300;display:block;
    background:linear-gradient(135deg,var(--red-bright),var(--violet),var(--cyan));
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
    background-size:200% 200%;animation:gradShift 5s ease infinite;
  }
  .contact-sub{font-size:0.72rem;color:var(--text-dim);line-height:1.8;margin-top:1.5rem;}

  .c-row{
    display:flex;align-items:center;justify-content:space-between;
    padding:1.2rem 0.75rem;
    border-bottom:1px solid var(--navy-border);
    text-decoration:none;color:var(--text-dim);
    font-size:0.7rem;letter-spacing:2px;text-transform:uppercase;
    transition:all .2s;border-radius:var(--radius-sm);
    min-height:var(--tap);
  }
  .c-row:first-child{border-top:1px solid var(--navy-border);}
  .c-row:hover{color:var(--text);background:rgba(255,255,255,0.03);padding-left:1.2rem;}
  .c-row:hover .c-arr{transform:translate(4px,-4px);color:var(--cyan);}
  .c-arr{display:inline-block;transition:transform .2s;}

  /* ════════════════════════════════════
     FOOTER
  ════════════════════════════════════ */
  footer{
    padding:clamp(1.5rem,4vw,2.5rem) clamp(1rem,5vw,3rem);
    background:var(--surface);
    border-top:1px solid var(--navy-border);
    display:flex;align-items:center;justify-content:space-between;
    flex-wrap:wrap;gap:1rem;
  }
  .ft-copy{font-size:0.6rem;letter-spacing:2px;color:var(--text-dim);}
  .ft-badge{
    font-size:0.6rem;letter-spacing:1px;color:var(--text-dim);
    border:1px solid var(--navy-border);padding:0.35rem 0.85rem;
    border-radius:999px;
  }
  .ft-badge span{
    background:linear-gradient(135deg,var(--cyan),var(--violet));
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  }

  /* ════════════════════════════════════
     RESPONSIVE BREAKPOINTS
     — Tablet  ≤ 960px
     — Mobile  ≤ 600px  (Android/iOS)
     — Small   ≤ 380px  (small phones)
  ════════════════════════════════════ */

  /* TABLET */
  @media (max-width:960px){
    .nav-links{display:none;}
    .hamburger{display:flex;}
    .nav-avail{display:none;}

    .hero{grid-template-columns:1fr;padding-top:calc(64px + 2rem);gap:2rem;}
    .hero-right{border-radius:var(--radius-md);}

    .about-grid{grid-template-columns:1fr;gap:2.5rem;}

    .projects-grid{grid-template-columns:1fr;}
    .proj-card.featured{grid-column:span 1;grid-template-columns:1fr;}

    .creative-grid{grid-template-columns:repeat(2,1fr);}

    .contact-wrap{grid-template-columns:1fr;gap:2.5rem;}
  }

  /* MOBILE — Android / iOS */
  @media (max-width:600px){
    nav{padding:0 1rem;height:56px;}
    .mobile-drawer{top:56px;}

    .hero{padding:calc(56px + 1.5rem) 1rem 2.5rem;gap:1.5rem;}
    .hero-name{font-size:clamp(2.5rem,12vw,4rem);letter-spacing:-1px;}
    .hero-btns{gap:0.75rem;}
    .btn-primary,.btn-secondary{padding:0 1.3rem;font-size:0.62rem;}

    .section{padding:2.5rem 1rem;}

    .skills-wrap{grid-template-columns:1fr;}

    .projects-grid{gap:0.75rem;}
    .proj-card{padding:1.5rem;}
    .proj-card.featured{grid-template-columns:1fr;}

    .creative-grid{grid-template-columns:1fr;gap:0.75rem;}
    .cr-card{padding:1.5rem;flex-direction:row;align-items:flex-start;flex-wrap:wrap;}
    .cr-icon{font-size:1.8rem;}

    .exp-card{padding:1.5rem;}
    .exp-role{padding-right:5rem;font-size:1.4rem;}
    .exp-badge{top:1.5rem;right:1.5rem;}

    .contact-wrap{gap:2rem;}
    .contact-hl{font-size:clamp(2rem,10vw,3.5rem);}

    footer{flex-direction:column;align-items:flex-start;gap:0.75rem;padding:1.5rem 1rem;}

    .sec-title{font-size:clamp(1.8rem,8vw,2.8rem);}
  }

  /* SMALL PHONES ≤ 380px (iPhone SE, budget Android) */
  @media (max-width:380px){
    .hero-name{font-size:2.5rem;}
    .hero-eyebrow{font-size:0.52rem;padding:0.3rem 0.7rem;}
    .btn-primary,.btn-secondary{width:100%;justify-content:center;}
    .hero-btns{flex-direction:column;}
    .cr-card{flex-direction:column;}
    .info-key{min-width:65px;}
  }
`

/* ────── DATA ────── */
const projects = [
  {
    cls: 'p1', tag: 'MERN + AI', tagColor: 'var(--teal)', featured: true,
    name: 'Adoptify', sub: 'Pet Adoption Platform',
    desc: 'Full-stack platform with JWT role control, AI-assisted pet matching via OpenAI, and robust RESTful APIs for seamless adoption workflows.',
    stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'OpenAI API', 'JWT', 'Tailwind CSS'],
    live: '#', code: '#',
  },
  {
    cls: 'p2', tag: 'Machine Learning', tagColor: 'var(--amber)',
    name: 'ATS Detector', sub: 'Resume Scoring Engine',
    desc: 'NLP-powered engine evaluating resumes for ATS compatibility, highlighting keyword gaps, and scoring optimisation levels.',
    stack: ['Python', 'scikit-learn', 'NLTK', 'Pandas'],
    code: '#',
  },
  {
    cls: 'p3', tag: 'React.js', tagColor: 'var(--pink)',
    name: 'Car Rating', sub: 'Web App',
    desc: 'Real-time car review portal with live rating updates, intuitive UI, and robust form validation for high-quality user feedback.',
    stack: ['React.js', 'Tailwind CSS', 'JavaScript', 'LocalStorage'],
    live: '#', code: '#',
  },
  {
    cls: 'p4', tag: 'Frontend', tagColor: 'var(--lime)',
    name: 'LearnCart', sub: 'Online Learning Platform',
    desc: 'Fully responsive multi-page learning experience with dynamic interactive UI components and smooth user navigation.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap'],
    live: '#', code: '#',
  },
]

const skillGroups = [
  { title: 'Languages', dot: '#00d4ff', items: ['Java', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'SQL'] },
  { title: 'Frontend', dot: '#a8ff3e', items: ['React.js', 'Next.js', 'Tailwind CSS', 'Bootstrap', 'Responsive UI'] },
  { title: 'Backend & DB', dot: '#c0392b', items: ['Node.js', 'Express.js', 'REST APIs', 'JWT Auth', 'MongoDB', 'MySQL'] },
  { title: 'Tools', dot: '#ffb347', items: ['Git & GitHub', 'VS Code', 'Postman', 'npm', 'SEO / Analytics'] },
  { title: 'Design & Media', dot: '#b44bff', items: ['Figma', 'Adobe Photoshop', 'Premiere Pro', 'UI/UX Design'] },
  { title: 'Creative', dot: '#ff4da6', items: ['Video Editing', 'Photography', 'Colour Grading', 'Storytelling'] },
]

const creatives = [
  { cls: 'cr1', icon: '📷', title: 'Photography', titleColor: 'var(--cyan)', desc: 'Street, portrait & landscape — capturing light, composition, and emotion in every frame.', tags: ['Street', 'Portrait', 'Landscape', 'Lightroom'] },
  { cls: 'cr2', icon: '🎬', title: 'Video Editing', titleColor: 'var(--red-bright)', desc: 'Crafting narratives through precise cuts, colour grading & motion graphics in Premiere Pro.', tags: ['Premiere Pro', 'Colour Grade', 'Motion', 'Sound'] },
  { cls: 'cr3', icon: '🎨', title: 'UI / UX Design', titleColor: 'var(--violet)', desc: 'Clean, user-centric interfaces in Figma with focus on usability, hierarchy & visual clarity.', tags: ['Figma', 'Wireframes', 'Prototypes', 'Systems'] },
  { cls: 'cr4', icon: '🌐', title: 'Open Source', titleColor: 'var(--lime)', desc: 'Contributing through open repositories, documentation, and collaborative code reviews on GitHub.', tags: ['GitHub', 'OSS', 'React', 'Node.js'] },
]

const ticker = [
  { t: 'React.js', c: 'c1' }, { t: 'Node.js', c: 'c2' }, { t: 'MongoDB', c: 'c3' }, { t: 'TypeScript', c: 'c4' },
  { t: 'Tailwind CSS', c: 'c5' }, { t: 'Express.js', c: 'c1' }, { t: 'OpenAI API', c: 'c2' }, { t: 'Python', c: 'c3' },
  { t: 'Figma', c: 'c4' }, { t: 'Premiere Pro', c: 'c5' }, { t: 'Photography', c: 'c1' }, { t: 'SEO', c: 'c2' },
  { t: 'MySQL', c: 'c3' }, { t: 'Git', c: 'c4' }, { t: 'JWT', c: 'c5' }, { t: 'Next.js', c: 'c1' },
]

/* ────── COMPONENT ────── */
export const App = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const scroll = (id: string) => { setMenuOpen(false); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 50) }

  // lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navLinks = ['about', 'skills', 'experience', 'projects', 'creative', 'contact']

  return (
    <>
      <style>{css}</style>

      {/* ── NAV ── */}
      <nav>
        <div className="nav-logo">AG.</div>

        <ul className="nav-links">
          {navLinks.map(s => (
            <li key={s}><a href={`#${s}`}>{s}</a></li>
          ))}
        </ul>

        <div className="nav-right">
          <div className="nav-avail"><span className="avail-dot" />Available for work</div>
          <button className={`hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      <div className={`mobile-drawer${menuOpen ? ' open' : ''}`}>
        {navLinks.map((s, i) => (
          <a key={s} href={`#${s}`} onClick={() => scroll(s)}>
            <span className="m-num">0{i + 1}</span>{s.charAt(0).toUpperCase() + s.slice(1)}
          </a>
        ))}
        <div style={{ marginTop: '2rem' }}>
          <div className="nav-avail" style={{ width: 'fit-content' }}><span className="avail-dot" />Available for work</div>
        </div>
      </div>

      {/* ── HERO ── */}
      <div className="hero" id="hero">
        <div className="hero-left">
          <div className="hero-eyebrow fu d1">⚡ Full-Stack Developer & Creative</div>
          <h1 className="hero-name fu d2">
            AYUSH
            <span className="grad">Gupta.</span>
          </h1>
          <p className="hero-desc fu d3">
            <strong>MERN stack developer</strong> building complete web applications — scalable REST APIs,
            JWT auth, and expressive UIs. Also a <strong>photographer</strong> and{' '}
            <strong>video editor</strong> who believes every product should tell a story.
          </p>
          <div className="hero-btns fu d4">
            <button className="btn-primary" onClick={() => scroll('projects')}>🚀 View Projects</button>
            <a className="btn-secondary" href="mailto:ayushgupta9510@gmail.com">✉ Hire Me</a>
          </div>
        </div>

        <div className="hero-right fu d3">
          <div className="hero-right-header">
            <span className="dot-r" /><span className="dot-y" /><span className="dot-g" />
            <span style={{ marginLeft: '0.5rem' }}>ayush.portfolio</span>
          </div>
          {[
            { k: 'Location', v: 'Greater Noida, India 🇮🇳' },
            { k: 'Degree', v: 'BCA — Galgotias University\nSep 2023 – Sep 2026' },
            { k: 'Email', v: <a href="mailto:ayushgupta9510@gmail.com">ayushgupta9510@gmail.com</a> },
            { k: 'GitHub', v: <a href="https://github.com/theayushgupta21" target="_blank" rel="noreferrer">github.com/theayushgupta21</a> },
            { k: 'LinkedIn', v: <a href="https://linkedin.com/in/theayushgupta21" target="_blank" rel="noreferrer">theayushgupta21</a> },
            { k: 'Status', v: <span style={{ color: 'var(--teal)' }}>Open to opportunities ✦</span> },
          ].map(r => (
            <div className="info-row" key={r.k}>
              <span className="info-key">{r.k}</span>
              <span className="info-val">{r.v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── TICKER ── */}
      <div className="ticker">
        <div className="ticker-inner">
          {[...ticker, ...ticker].map((t, i) => (
            <span className="ticker-item" key={i}><b className={t.c}>✦</b>{t.t}</span>
          ))}
        </div>
      </div>

      {/* ── ABOUT ── */}
      <section className="section" id="about">
        <div className="sec-head fu">
          <span className="sec-num">01</span>
          <h2 className="sec-title">ABOUT <span className="accent-word">ME</span></h2>
          <div className="sec-line" />
        </div>
        <div className="about-grid">
          <p className="about-body fu d2">
            I'm a <strong>Full-Stack Developer</strong> with hands-on experience building complete web
            applications using the <em>MERN stack</em>. I care about clean architecture,
            snappy interactions, and APIs that just work.<br /><br />
            Beyond code, I carry a camera and a Premiere Pro timeline — because{' '}
            <strong>visual storytelling</strong> sharpens how I think about UX, layout, and the
            human on the other side of the screen.
          </p>
          <div className="fu d3">
            <div className="edu-card">
              <div className="edu-degree">Bachelor of Computer Applications</div>
              <div className="edu-uni">Galgotias University, Greater Noida</div>
              <div className="edu-date">SEP 2023 — SEP 2026</div>
            </div>
            <div className="cert-badge">🏅&nbsp;&nbsp;Machine Learning with Python — Certified</div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section className="section" id="skills" style={{ paddingTop: '3rem' }}>
        <div className="sec-head fu">
          <span className="sec-num">02</span>
          <h2 className="sec-title">TECH <span className="accent-word">SKILLS</span></h2>
          <div className="sec-line" />
        </div>
        <div className="skills-wrap">
          {skillGroups.map((g, i) => (
            <div className="skill-group fu" key={g.title} style={{ animationDelay: `${i * 0.07}s` }}>
              <div className="sg-title" style={{ color: g.dot }}>{g.title}</div>
              <div className="sg-items">
                {g.items.map(item => (
                  <div className="sg-item" key={item}>
                    <span className="sg-dot" style={{ background: g.dot }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section className="section" id="experience">
        <div className="sec-head fu">
          <span className="sec-num">03</span>
          <h2 className="sec-title">WORK <span className="accent-word">EXP</span></h2>
          <div className="sec-line" />
        </div>
        <div className="exp-card fu d2">
          <div className="exp-badge">Internship</div>
          <div className="exp-role">Marketing &amp; SEO Intern</div>
          <div className="exp-co">ROBRAL TECHNOLOGIES</div>
          <div className="exp-date">NOV 2025 — FEB 2026 · 4 MONTHS · GREATER NOIDA</div>
          <ul className="exp-points">
            <li>Performed SEO audits and keyword research (250+ keywords), on-page optimisation, and content strategy that improved organic rankings.</li>
            <li>Managed Next.js SEO using Next SEO library, metadata, JSON-LD schema, and sitemap optimisation for enhanced crawlability.</li>
            <li>Tracked and analysed performance via Google Analytics, Search Console, and Keyword Planner — driving measurable visibility improvements.</li>
            <li>Implemented technical SEO fixes, backlinking strategies, and created SEO-friendly long-form content to boost domain authority.</li>
          </ul>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section className="section" id="projects">
        <div className="sec-head fu">
          <span className="sec-num">04</span>
          <h2 className="sec-title">MY <span className="accent-word">PROJECTS</span></h2>
          <div className="sec-line" />
        </div>
        <div className="projects-grid">
          {projects.map((p, i) => (
            <div className={`proj-card${p.featured ? ' featured' : ''} ${p.cls} fu`} key={p.name} style={{ animationDelay: `${i * 0.1}s` }}>
              {p.featured && (
                <div className="feat-vis">
                  <div className="feat-vis-ring">ADOPTIFY</div>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', height: '100%' }}>
                <div>
                  <span className="proj-tag" style={{ color: p.tagColor }}>{p.tag}</span>
                  <div className="proj-name">{p.name}</div>
                  <div className="proj-sub">{p.sub}</div>
                </div>
                <div className="proj-desc">{p.desc}</div>
                <div className="proj-stack">{p.stack.map(t => <span className="stack-pill" key={t}>{t}</span>)}</div>
                <div className="proj-links">
                  {p.live && <a className="proj-link" href={p.live} target="_blank" rel="noreferrer">Live ↗</a>}
                  {p.code && <a className="proj-link" href={p.code} target="_blank" rel="noreferrer">Code ↗</a>}
                </div>
              </div>
              <div className="proj-arr">↗</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CREATIVE ── */}
      <section className="section" id="creative">
        <div className="sec-head fu">
          <span className="sec-num">05</span>
          <h2 className="sec-title">CREATIVE <span className="accent-word">SIDE</span></h2>
          <div className="sec-line" />
        </div>
        <div className="creative-grid">
          {creatives.map((c, i) => (
            <div className={`cr-card ${c.cls} fu`} key={c.title} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="cr-icon">{c.icon}</div>
              <div className="cr-title" style={{ color: c.titleColor }}>{c.title}</div>
              <div className="cr-desc">{c.desc}</div>
              <div className="cr-tags">{c.tags.map(t => <span className="cr-tag" key={t}>{t}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="section" id="contact" style={{ borderBottom: 'none' }}>
        <div className="contact-wrap">
          <div className="fu">
            <p style={{ fontSize: '0.6rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '1.5rem' }}>06 — Let's Connect</p>
            <h2 className="contact-hl">
              GOT AN
              <em>IDEA?</em>
              LET'S
              BUILD IT.
            </h2>
            <p className="contact-sub">Open to full-time roles, freelance projects, and creative collaborations. Drop a message — let's make something great together.</p>
          </div>
          <div className="fu d2">
            {[
              { label: 'Email', href: 'mailto:ayushgupta9510@gmail.com' },
              { label: 'GitHub', href: 'https://github.com/theayushgupta21' },
              { label: 'LinkedIn', href: 'https://linkedin.com/in/theayushgupta21' },
              { label: 'Phone', href: 'tel:+919045073154' },
            ].map(l => (
              <a className="c-row" href={l.href} key={l.label} target="_blank" rel="noreferrer">
                {l.label}<span className="c-arr">↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <span className="ft-copy">© 2025 AYUSH GUPTA — ALL RIGHTS RESERVED</span>
        <span className="ft-badge">BUILT WITH <span>REACT + TYPESCRIPT</span></span>
      </footer>
    </>
  )
}

export default App