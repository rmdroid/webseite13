const phaseData = {
  assessment: {
    title: "Assessment",
    subtitle: "Status Quo Analyse",
    duration: "4-8 Wochen",
    description: "Bewertung der aktuellen Situation und Identifikation von Verbesserungspotenzialen durch Analyse bestehender Prozesse, Datenlandschaft und organisatorischer Strukturen.",
    deliverables: ["Readiness Score & Gap-Analyse", "Datenqualitäts-Assessment", "Quick-Win Roadmap"],
    metrics: ["Data Quality Score >85%", "Stakeholder Engagement >90%", "Time to Insights <2 Wochen"]
  },
  strategy: {
    title: "Strategy",
    subtitle: "KI-Vision entwickeln",
    duration: "6-10 Wochen",
    description: "Entwicklung einer maßgeschneiderten KI-Strategie mit klarer Vision, messbaren Zielen und priorisierten Use Cases für maximale Wertschöpfung.",
    deliverables: ["KI-Strategie Dokument", "Use Case Priorisierung", "Business Cases & ROI-Modelle"],
    metrics: ["Expected ROI >300%", "Time to Value <6 Monate", "Use Case Pipeline 10+"]
  },
  implementation: {
    title: "Implementation",
    subtitle: "Erste Use Cases umsetzen",
    duration: "12-20 Wochen",
    description: "Praktische Umsetzung erster KI-Anwendungsfälle mit Fokus auf schnelle Erfolge, Integration in bestehende Systeme und nachhaltigen Mehrwert.",
    deliverables: ["Produktive KI-Anwendungen", "Data & ML Pipelines", "Monitoring Dashboard"],
    metrics: ["Model Accuracy >90%", "System Uptime >99.5%", "Cost Reduction 20-40%"]
  },
  innovation: {
    title: "Innovation",
    subtitle: "Kontinuierliche Verbesserung",
    duration: "Kontinuierlich",
    description: "Etablierung einer Innovationskultur mit kontinuierlicher Weiterentwicklung, Skalierung erfolgreicher Lösungen und Exploration neuer KI-Möglichkeiten.",
    deliverables: ["Innovation Framework", "Technology Radar", "Community of Practice"],
    metrics: ["Innovation Pipeline 5+ Ideen/Monat", "Prototype to Production <4 Wochen", "Innovation ROI >500%"]
  }
};

const diagnoseQuestions = [
  {
    text: "Wie konkret ist Ihr KI-Vorhaben?",
    options: [
      { label: "Vage Idee – kein klarer Use Case", score: 0 },
      { label: "Konkreter Prozess im Blick, noch ungeprüft", score: 1 },
      { label: "Use Case validiert, Prozessbezug dokumentiert", score: 2 }
    ]
  },
  {
    text: "Wie ist Ihre Datenlage für diesen Use Case?",
    options: [
      { label: "Unbekannt oder nicht bewertet", score: 0 },
      { label: "Daten vorhanden, Qualität und Zugriff unklar", score: 1 },
      { label: "Strukturiert, zugänglich und dokumentiert", score: 2 }
    ]
  },
  {
    text: "Haben Sie die AI-Act-Risiken für dieses Vorhaben bewertet?",
    options: [
      { label: "Noch nicht betrachtet", score: 0 },
      { label: "Grundsätzlich bekannt, nicht dokumentiert", score: 1 },
      { label: "Klassifiziert und im Governance-Prozess", score: 2 }
    ]
  },
  {
    text: "Wer trägt Verantwortung für KI-Entscheidungen in Ihrer Organisation?",
    options: [
      { label: "Noch ungeklärt", score: 0 },
      { label: "In Diskussion, nicht formalisiert", score: 1 },
      { label: "Klar definiert und dokumentiert", score: 2 }
    ]
  },
  {
    text: "Was ist Ihr größtes Risiko beim KI-Vorhaben?",
    options: [
      { label: "Budget fließt ohne messbare Wirkung", score: 0 },
      { label: "Datenschutz oder AI Act noch ungeklärt", score: 1 },
      { label: "Team-Akzeptanz oder technische Integration", score: 2 }
    ]
  }
];

const diagnoseProfiles = {
  stop: {
    label: "Stoppen",
    headline: "Erst Grundlagen, dann KI.",
    text: "Die wichtigsten Voraussetzungen für ein belastbares KI-Vorhaben fehlen noch. Ein schneller Start erhöht das Risiko, senkt ihn nicht. Der richtige nächste Schritt ist eine strukturierte Bestandsaufnahme.",
    service: "13%-Check",
    cta: "13%-Check anfragen"
  },
  secure: {
    label: "Absichern",
    headline: "Compliance vor Umsetzung.",
    text: "Die Idee ist vorhanden, aber AI Act, Datenschutz und Governance sind noch offen. Ein Vorhaben ohne diese Basis wird spätestens beim ersten Review gebremst. Ein Risiko-Sprint schafft die belastbare Grundlage.",
    service: "AI Act Risiko-Sprint",
    cta: "Risiko-Sprint anfragen"
  },
  prototype: {
    label: "Prototyp bauen",
    headline: "Testen vor skalieren.",
    text: "Der Use Case ist konkret, die Grundlagen sind solide. Jetzt prüfen, ob der Prozess als kontrollierbarer Workflow wirklich funktioniert – bevor Vollbudget freigegeben wird.",
    service: "n8n Workflow-Prototyp",
    cta: "Workflow-Prototyp anfragen"
  },
  invest: {
    label: "Investieren",
    headline: "Bereit für den nächsten Schritt.",
    text: "Use Case, Datenlage, Governance und Risikobewertung sind solide. Der 13%-Check verdichtet das in 30 Tagen zu einem managementtauglichen Entscheidungsbrief.",
    service: "13%-Check",
    cta: "13%-Check starten"
  }
};

function getDiagnoseProfile(score) {
  if (score <= 2) return "stop";
  if (score <= 4) return "secure";
  if (score <= 6) return "prototype";
  return "invest";
}

function initDiagnoseTool() {
  const container = document.querySelector("[data-diagnose-tool]");
  if (!container) return;

  const answers = [];

  function openContactWithTopic(topic) {
    const backdrop = document.querySelector("[data-contact-modal]");
    if (!backdrop) return;
    backdrop.querySelectorAll("[data-choice]").forEach((b) => {
      b.classList.toggle("selected", b.dataset.choice === topic);
    });
    backdrop.querySelectorAll("[data-wizard-step]").forEach((p) => {
      p.hidden = parseInt(p.dataset.wizardStep) !== 1;
    });
    backdrop.querySelectorAll("[data-step]").forEach((s) => {
      s.classList.toggle("active", parseInt(s.dataset.step) === 1);
    });
    backdrop.classList.add("open");
    backdrop.setAttribute("aria-hidden", "false");
    const matchBtn = backdrop.querySelector(`[data-choice="${topic}"]`);
    if (matchBtn) matchBtn.focus();
  }

  function renderResult() {
    const score = answers.reduce((a, b) => a + b, 0);
    const key = getDiagnoseProfile(score);
    const p = diagnoseProfiles[key];
    const profileColors = {
      stop: "var(--warning)",
      secure: "var(--accent)",
      prototype: "var(--success)",
      invest: "var(--success)"
    };

    container.innerHTML = `
      <div class="diagnose-result-wrapper">
        <div class="diagnose-result-card">
          <div class="diagnose-score-label" style="color:${profileColors[key]}">${p.label}</div>
          <h3 class="diagnose-result-h3">${p.headline}</h3>
          <p style="margin-top:14px;color:var(--muted)">${p.text}</p>
          <p style="margin-top:14px;font-size:14px;color:var(--muted)">Empfohlener Einstieg: <strong style="color:var(--fg)">${p.service}</strong></p>
          <div class="diagnose-result-actions">
            <button class="btn btn-primary" type="button" data-diagnose-contact="${p.service}">${p.cta}</button>
            <button class="btn" type="button" data-diagnose-restart>Nochmal starten</button>
          </div>
        </div>
        <div class="diagnose-score-panel">
          <p class="eyebrow">Ihr Ergebnis</p>
          <div class="diagnose-score-number">${score}<span>/10</span></div>
          <div class="bar" style="margin-top:14px"><span style="width:${score * 10}%"></span></div>
          <div class="diagnose-score-legend">
            ${["invest", "prototype", "secure", "stop"].map((k) => `
              <div class="diagnose-legend-item${k === key ? " current" : ""}">
                <span>${diagnoseProfiles[k].label}</span>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;

    container.querySelector("[data-diagnose-restart]").addEventListener("click", () => {
      answers.length = 0;
      renderQuestion(0);
    });
    container.querySelector("[data-diagnose-contact]").addEventListener("click", (e) => {
      openContactWithTopic(e.currentTarget.dataset.diagnoseContact);
    });
  }

  function renderQuestion(index) {
    const q = diagnoseQuestions[index];
    const pct = Math.round((index / diagnoseQuestions.length) * 100);

    container.innerHTML = `
      <div class="diagnose-card">
        <div class="diagnose-progress-row">
          <div class="bar" style="flex:1"><span style="width:${pct}%"></span></div>
          <span class="diagnose-step-label">Frage ${index + 1} von ${diagnoseQuestions.length}</span>
        </div>
        <p class="diagnose-question">${q.text}</p>
        <div class="diagnose-options">
          ${q.options.map((opt) => `<button class="diagnose-option" type="button" data-score="${opt.score}">${opt.label}</button>`).join("")}
        </div>
      </div>
    `;

    container.querySelectorAll(".diagnose-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        answers[index] = Number(btn.dataset.score);
        if (index + 1 < diagnoseQuestions.length) {
          renderQuestion(index + 1);
        } else {
          renderResult();
        }
      });
    });
  }

  renderQuestion(0);
}

function initMobileNav() {
  const toggle = document.querySelector("[data-menu-toggle]");
  if (!toggle) return;
  toggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  document.querySelectorAll(".primary-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initTabs() {
  document.querySelectorAll("[data-tabs]").forEach((group) => {
    const tabs = [...group.querySelectorAll("[role='tab']")];
    const panels = tabs
      .map((tab) => document.getElementById(tab.getAttribute("aria-controls")))
      .filter(Boolean);
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((item) => item.setAttribute("aria-selected", String(item === tab)));
        panels.forEach((panel) => panel.classList.toggle("active", panel.id === tab.getAttribute("aria-controls")));
      });
    });
  });
}

function initPathway() {
  const detail = document.querySelector("[data-path-detail]");
  const buttons = [...document.querySelectorAll("[data-phase]")];
  if (!detail || buttons.length === 0) return;

  function render(id) {
    const phase = phaseData[id];
    if (!phase) return;
    buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.phase === id)));
    detail.innerHTML = `
      <div>
        <p class="eyebrow">${phase.duration}</p>
        <h3>${phase.title}: ${phase.subtitle}</h3>
        <p class="muted" style="margin-top:14px">${phase.description}</p>
      </div>
      <div class="deliverables">
        ${phase.deliverables.map((item) => `<div class="deliverable"><strong>${item}</strong></div>`).join("")}
      </div>
      <div class="mini-list">
        ${phase.metrics.map((item) => `<div class="mini-row"><span class="live-dot" aria-hidden="true"></span><strong>${item}</strong><span>Messpunkt</span></div>`).join("")}
      </div>
    `;
  }

  buttons.forEach((button) => button.addEventListener("click", () => render(button.dataset.phase)));
  render(buttons[0].dataset.phase);
}

function initRoi() {
  const form = document.querySelector("[data-roi]");
  if (!form) return;

  const employees = form.querySelector("#employees");
  const hours = form.querySelector("#hours");
  const rate = form.querySelector("#rate");
  const automation = form.querySelector("#automation");
  const investment = form.querySelector("#investment");
  const roiValue = document.querySelector("[data-roi-value]");
  const savingValue = document.querySelector("[data-saving-value]");
  const paybackValue = document.querySelector("[data-payback-value]");
  const bar = document.querySelector("[data-roi-bar]");

  function calculate() {
    const annualSaving = Number(employees.value) * Number(hours.value) * 52 * Number(rate.value) * (Number(automation.value) / 100);
    const invest = Math.max(Number(investment.value), 1);
    const roi = Math.round(((annualSaving - invest) / invest) * 100);
    const payback = annualSaving > 0 ? Math.max(1, Math.round((invest / annualSaving) * 12)) : 0;
    roiValue.textContent = `${roi}%`;
    savingValue.textContent = `${Math.round(annualSaving).toLocaleString("de-DE")} EUR`;
    paybackValue.textContent = `${payback} Monate`;
    bar.style.setProperty("--value", `${Math.max(8, Math.min(100, roi / 6))}%`);
  }

  form.querySelectorAll("input, select").forEach((input) => input.addEventListener("input", calculate));
  calculate();
}

function initWizardModal() {
  const backdrop = document.querySelector("[data-contact-modal]");
  if (!backdrop) return;

  const openers = [...document.querySelectorAll("[data-open-contact]")];
  let currentStep = 1;
  let selectedService = null;

  function showStep(n) {
    currentStep = n;
    backdrop.querySelectorAll("[data-wizard-step]").forEach((p) => {
      p.hidden = parseInt(p.dataset.wizardStep) !== n;
    });
    backdrop.querySelectorAll("[data-step]").forEach((s) => {
      s.classList.toggle("active", parseInt(s.dataset.step) <= n);
    });
  }

  function setOpen(open) {
    backdrop.classList.toggle("open", open);
    backdrop.setAttribute("aria-hidden", String(!open));
    if (open) {
      showStep(1);
      const first = backdrop.querySelector("button:not([data-close-contact])");
      if (first) first.focus();
    } else {
      if (openers[0]) openers[0].focus();
    }
  }

  backdrop.querySelectorAll("[data-choice]").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedService = btn.dataset.choice;
      backdrop.querySelectorAll("[data-choice]").forEach((b) => b.classList.toggle("selected", b === btn));
      showStep(2);
    });
  });

  const nextBtn = backdrop.querySelector("[data-wizard-next]");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const topicInput = backdrop.querySelector("input[name='topic']");
      const orgInput = backdrop.querySelector("input[name='companyType']");
      const statusInput = backdrop.querySelector("input[name='aiStatus']");
      const riskInput = backdrop.querySelector("input[name='biggestRisk']");
      const msgField = backdrop.querySelector("#message");

      const org = backdrop.querySelector("input[name='wiz-org']:checked")?.value || "Nicht angegeben";
      const status = backdrop.querySelector("input[name='wiz-status']:checked")?.value || "Nicht angegeben";
      const risk = backdrop.querySelector("input[name='wiz-risk']:checked")?.value || "Nicht angegeben";

      if (topicInput) topicInput.value = selectedService || "13%-Check";
      if (orgInput) orgInput.value = org;
      if (statusInput) statusInput.value = status;
      if (riskInput) riskInput.value = risk;
      if (msgField) msgField.value = `Gewünschter Einstieg: ${selectedService || "13%-Check"}.\nOrganisation: ${org}.\nKI-Status: ${status}.\nGrößtes Risiko: ${risk}.`;

      showStep(3);
      const nameField = backdrop.querySelector("#name");
      if (nameField) nameField.focus();
    });
  }

  backdrop.querySelectorAll("[data-wizard-back]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (currentStep > 1) showStep(currentStep - 1);
    });
  });

  openers.forEach((btn) => {
    btn.addEventListener("click", () => {
      const topic = btn.dataset.contactTopic;
      selectedService = topic || null;
      backdrop.querySelectorAll("[data-choice]").forEach((b) => {
        b.classList.toggle("selected", topic ? b.dataset.choice === topic : false);
      });
      setOpen(true);
    });
  });

  backdrop.querySelectorAll("[data-close-contact]").forEach((btn) => btn.addEventListener("click", () => setOpen(false)));
  backdrop.addEventListener("click", (e) => { if (e.target === backdrop) setOpen(false); });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && backdrop.classList.contains("open")) setOpen(false);
  });
}

function initContactValidation() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;
  const status = form.querySelector("[data-form-status]");
  if (!status) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = form.querySelector("#email");
    if (!email || !email.value.includes("@")) {
      if (email) email.setAttribute("aria-invalid", "true");
      status.textContent = "Bitte eine gültige E-Mail-Adresse eingeben.";
      status.style.color = "var(--warning)";
      if (email) email.focus();
      return;
    }
    email.removeAttribute("aria-invalid");
    status.textContent = "Anfrage wird gesendet…";
    status.style.color = "var(--muted)";

    const data = Object.fromEntries(new FormData(form).entries());
    const message = `NEUE ERSTGESPRÄCHS-ANFRAGE

Name: ${data.name || "Nicht angegeben"}
E-Mail: ${data.email || "Nicht angegeben"}
Telefon: ${data.phone || "Nicht angegeben"}
Wunschtermin: ${data.appointment || "Nicht angegeben"}
Gewünschter Einstieg: ${data.topic || "13%-Check"}
Organisation: ${data.companyType || "Nicht angegeben"}
Aktueller KI-Status: ${data.aiStatus || "Nicht angegeben"}
Größtes Risiko: ${data.biggestRisk || "Nicht angegeben"}
Nachricht: ${data.message || "Keine Nachricht"}

Quelle: Website v2
Seite: ${location.href}
Zeitstempel: ${new Date().toLocaleString("de-DE")}`;

    try {
      const response = await fetch("https://n8n.top-beraternetzwerk.de/webhook/teamschat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: data.name || "Website Anfrage", message })
      });
      if (!response.ok) throw new Error("Webhook failed");
      status.textContent = "Danke. Die Anfrage wurde gesendet.";
      status.style.color = "var(--success)";
      if (window.umami) window.umami.track("contact-form-submit", { source: "website-v2" });
      form.reset();
    } catch {
      status.textContent = "Senden fehlgeschlagen. Bitte rm@kostenmanager.net nutzen.";
      status.style.color = "var(--warning)";
    }
  });
}

function initPriorityBoard() {
  const board = document.querySelector("[data-priority-board]");
  if (!board) return;
  const impact = board.querySelector("#impact");
  const data = board.querySelector("#dataQuality");
  const risk = board.querySelector("#risk");
  const output = board.querySelector("[data-priority-output]");
  const rows = [...board.querySelectorAll("[data-score-row]")];

  function update() {
    const impactValue = Number(impact.value);
    const dataValue = Number(data.value);
    const riskValue = Number(risk.value);
    const scores = {
      assessment: Math.max(12, 100 - dataValue + riskValue * 0.8),
      strategy: Math.max(18, impactValue * 0.75 + riskValue * 0.45),
      implementation: Math.max(14, impactValue * 0.9 + dataValue * 0.7 - riskValue * 0.35),
      innovation: Math.max(10, impactValue * 0.55 + dataValue * 0.45)
    };
    const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
    const label = phaseData[winner].title;
    rows.forEach((row) => {
      const key = row.dataset.scoreRow;
      const score = Math.max(8, Math.min(100, Math.round(scores[key])));
      row.querySelector(".decision-score span").style.setProperty("--score", `${score}%`);
      row.querySelector("[data-score-value]").textContent = `${score}`;
    });
    output.textContent = `Empfohlener Einstieg: ${label} - ${phaseData[winner].subtitle}`;
  }

  [impact, data, risk].forEach((input) => input.addEventListener("input", update));
  update();
}

function initBriefLab() {
  const lab = document.querySelector("[data-brief-lab]");
  if (!lab) return;
  const title = lab.querySelector("[data-brief-title]");
  const body = lab.querySelector("[data-brief-body]");
  const options = [...lab.querySelectorAll("input[name='brief']")];
  const copy = {
    risk: {
      title: "KI-Due-Diligence vor dem nächsten Budget.",
      body: "In 30 Tagen werden Use Cases, AI-Act-Risiko, Datenlage und Verantwortlichkeiten so verdichtet, dass eine Investitionsentscheidung ohne Folien-Nebel möglich ist."
    },
    process: {
      title: "Ein Workflow als Beweis, kein Strategietheater.",
      body: "Der Startpunkt ist ein realer Prozess mit Zeitverlust. Ziel ist ein belastbarer n8n-Prototyp mit klaren Kontrollpunkten, Übergaben und Messgrößen."
    },
    public: {
      title: "KI-Kompetenz, die Verwaltungspraxis aushält.",
      body: "Der Fokus liegt auf Schulung, Datenschutz, Akzeptanz und konkreten Verwaltungsabläufen. Nicht Toolshow, sondern handlungsfähige Teams."
    }
  };

  function render() {
    const selected = options.find((o) => o.checked)?.value || "risk";
    title.textContent = copy[selected].title;
    body.textContent = copy[selected].body;
  }

  options.forEach((o) => o.addEventListener("change", render));
  render();
}

function initScrollTop() {
  const btn = document.createElement("button");
  btn.className = "scroll-top";
  btn.setAttribute("aria-label", "Nach oben scrollen");
  btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 13V3"/><path d="M3 8l5-5 5 5"/></svg>';
  document.body.appendChild(btn);
  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initTestimonialRotator() {
  document.querySelectorAll("[data-testimonials]").forEach((container) => {
    const items = Array.from(container.querySelectorAll("[data-testimonial]"));
    if (items.length < 2) return;
    let current = 0;
    setInterval(() => {
      items[current].classList.remove("active");
      current = (current + 1) % items.length;
      items[current].classList.add("active");
    }, 5000);
  });
}

function initCookieBanner() {
  const key = "cookieConsent";
  let accepted = false;
  try { accepted = localStorage.getItem(key) === "true"; } catch { accepted = false; }
  if (accepted) return;

  const banner = document.createElement("div");
  banner.className = "cookie-banner";
  banner.innerHTML = `
    <div>
      <strong>Datenschutz & Cookies</strong>
      <p>Diese Website verwendet keine eigenen Tracking-Cookies. Umami wird als datensparsame Seitenanalyse eingebunden. Mit Akzeptieren wird dieser Hinweis lokal gespeichert.</p>
    </div>
    <button class="btn" type="button">Akzeptieren</button>
  `;
  document.body.appendChild(banner);
  window.setTimeout(() => banner.classList.add("open"), 700);
  banner.querySelector("button").addEventListener("click", () => {
    try { localStorage.setItem(key, "true"); } catch { }
    banner.classList.remove("open");
  });
}


function initActiveNav() {
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".primary-nav a, .legal-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === current || (current === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

initMobileNav();
initTabs();
initPathway();
initRoi();
initWizardModal();
initContactValidation();
initDiagnoseTool();
initPriorityBoard();
initBriefLab();
initScrollTop();
initTestimonialRotator();
initActiveNav();
const _page = location.pathname.split("/").pop() || "index.html";
if (_page === "index.html" || _page === "") initCookieBanner();
