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

function initChatWidget() {
  const NAV_MAP = [
    { kw: ["roadmap", "assessment", "phasen", "phase", "implementation", "innovation"], page: "roadmap.html", label: "→ Roadmap ansehen" },
    { kw: ["ki-beratung", "ki beratung", "beratungsleistung"], page: "ki-beratung.html", label: "→ KI-Beratung" },
    { kw: ["eu ai act", "ai act", "compliance", "regulat", "governance"], page: "eu-ai-act-beratung.html", label: "→ EU AI Act Beratung" },
    { kw: ["n8n", "automatisierung", "workflow", "prototyp"], page: "n8n-automatisierung.html", label: "→ n8n Automatisierung" },
    { kw: ["verwaltung", "schulung", "öffentlich", "behörde"], page: "ki-schulung-verwaltung.html", label: "→ KI-Schulung Verwaltung" },
    { kw: ["mittelstand", "strategisch", "ki-strategie"], page: "ki-strategie-mittelstand.html", label: "→ KI-Strategie Mittelstand" },
    { kw: ["services", "leistungen", "angebote", "pakete", "übersicht"], page: "services.html", label: "→ Alle Services" },
    { kw: ["profil", "über robert", "wer ist robert", "erfahrung", "werdegang"], page: "about.html", label: "→ Profil ansehen" },
    { kw: ["ökosystem", "projekte", "tools", "produkte"], page: "oekosystem.html", label: "→ Ökosystem" },
  ];

  const PROACTIVE = {
    "index.html": "Haben Sie eine Frage zu KI-Transformation?",
    "": "Haben Sie eine Frage zu KI-Transformation?",
    "roadmap.html": "Welcher Einstieg passt zu Ihrem Vorhaben?",
    "ki-beratung.html": "Wie kann ich Ihnen bei der KI-Beratung helfen?",
    "eu-ai-act-beratung.html": "Fragen zum EU AI Act oder Compliance?",
    "n8n-automatisierung.html": "Interesse an Prozessautomatisierung mit n8n?",
    "ki-schulung-verwaltung.html": "Fragen zur KI-Schulung für Verwaltungen?",
    "ki-strategie-mittelstand.html": "Wie weit ist Ihre KI-Strategie?",
    "services.html": "Welcher Service passt zu Ihrem Vorhaben?",
    "about.html": "Fragen zu Roberts Profil oder Ansatz?",
    "oekosystem.html": "Fragen zu den Projekten im Ökosystem?",
  };


  const SYSTEM_PROMPT = `Du bist der Assistent von Robert Meyer, KI-Berater auf ai.rm-on.de. Antworte ausschließlich zu Roberts Arbeit und dem Inhalt der aktuellen Seite. Niemals zu anderen Themen.

WICHTIG – DAS IST DER 13%-ANSATZ: Nur 13% der Beschäftigten nutzen KI aktiv. 87% des Potenzials liegt brach. Das hat nichts mit Finanzen zu tun – es geht ausschließlich um KI-Nutzung in Unternehmen und Verwaltungen.

INHALT DER AKTUELLEN SEITE ({{PAGE}}):
{{CONTENT}}

KONTAKT (exakt, niemals andere URLs erfinden):
E-Mail: rm@kostenmanager.net
LinkedIn: linkedin.com/in/robert-meyer-666b39315
Webseite: ai.rm-on.de
Erstgespräch: kostenlos, 30 Minuten, über das Formular auf ai.rm-on.de anfragen

Regeln: Deutsch, maximal 3 Sätze, kein Markdown, keine Sternchen, keine Aufzählungszeichen, keine eckigen Klammern, konkrete Kontaktdaten nennen wenn gefragt, eine Rückfrage am Ende.`;

  const INITIAL_PROMPTS = [
    {
      role: "user",
      content: "Was ist der 13%-Ansatz?"
    },
    {
      role: "assistant",
      content: "Studien zeigen: Nur 13% der Beschäftigten nutzen KI wirklich aktiv im Arbeitsalltag – 87% des Potenzials liegt ungenutzt brach. Robert Meyer hilft Unternehmen und Verwaltungen, genau diesen Vorsprung jetzt zu erschließen, bevor es die Konkurrenz tut. Trifft das auf Ihre Organisation zu?"
    },
    {
      role: "user",
      content: "Wie kann mir Robert helfen?"
    },
    {
      role: "assistant",
      content: "Das hängt von Ihrer Situation ab. Wenn noch unklar ist, wo KI bei Ihnen Sinn macht, ist der 13%-Check der richtige Einstieg: 30 Tage, drei priorisierte Use Cases, klarer Entscheidungsbrief für die Führungsebene. Falls konkrete Prozesse zu langsam sind, baut Robert einen n8n-Automatisierungsprototyp. Was ist Ihre aktuell größte Herausforderung – Orientierung, Umsetzung oder Compliance?"
    },
    {
      role: "user",
      content: "Was kostet das?"
    },
    {
      role: "assistant",
      content: "Der 13%-Check startet ab 2.500 EUR und dauert 30 Tage. Das Erstgespräch ist kostenlos und unverbindlich – dort schauen wir gemeinsam, ob und welcher Einstieg für Sie passt. Größere Projekte werden individuell kalkuliert. Soll ich direkt ein Erstgespräch für Sie vormerken?"
    },
    {
      role: "user",
      content: "Wie kann ich Robert erreichen?"
    },
    {
      role: "assistant",
      content: "Am schnellsten per E-Mail: rm@kostenmanager.net. Alternativ können Sie das Erstgespräch direkt über ai.rm-on.de anfragen – kostenlos, 30 Minuten, unverbindlich. Auf LinkedIn finden Sie ihn unter linkedin.com/in/robert-meyer-666b39315. Soll ich das Erstgespräch gleich hier für Sie vorbereiten?"
    }
  ];

  const FAQ_FALLBACK = [
    { q: "Was ist der 13%-Ansatz?", a: "Nur 13% der Beschäftigten nutzen KI aktiv – 87% des Potenzials liegt brach. Wer das jetzt erschließt, gewinnt einen messbaren Wettbewerbsvorsprung.\n\nWas beschäftigt Sie – eher Strategie, Umsetzung oder Compliance?" },
    { q: "Welche Services gibt es?", a: "Der Einstieg ist meist der 13%-Check: 30 Tage, klarer Entscheidungsbrief. Daneben: KI-Strategie, EU AI Act Compliance, n8n Automatisierung und Schulungen für Verwaltungen.\n\nWelches Thema trifft Ihre Situation am ehesten?" },
    { q: "Wie läuft ein Erstgespräch ab?", a: "30 Minuten, kostenlos, kein Verkaufsgespräch. Wir schauen gemeinsam, ob KI bei Ihnen Sinn macht und was ein sinnvoller erster Schritt wäre.\n\nHaben Sie ein konkretes Vorhaben im Kopf?" },
    { q: "Für wen ist die Beratung?", a: "Mittelstand und Verwaltungen ab ~50 Mitarbeitern, die KI ernsthaft einsetzen wollen – ohne Hype, mit Substanz.\n\nIn welchem Umfeld arbeiten Sie?" },
    { q: "Was kostet es?", a: "Das Erstgespräch ist kostenlos und unverbindlich. Die Projektkosten hängen von Scope und Umfang ab und werden individuell kalkuliert.\n\nMöchten Sie ein Erstgespräch anfragen?" }
  ];

  const widget = document.createElement("div");
  widget.className = "chat-widget";
  widget.innerHTML = `
    <div class="chat-panel" role="dialog" aria-modal="true" aria-label="KI-Assistent von Robert Meyer">
      <div class="chat-header">
        <div class="chat-avatar">RM</div>
        <div class="chat-header-info">
          <strong>KI-Assistent</strong>
          <span>Robert Meyer · ai.rm-on.de</span>
        </div>
        <div class="chat-status-dot" aria-hidden="true"></div>
      </div>
      <div class="chat-progress-bar" id="chat-pb" hidden><span id="chat-pb-fill"></span></div>
      <div class="chat-messages" id="chat-msgs" role="log" aria-live="polite"></div>
      <div class="chat-chips" id="chat-chips"></div>
      <div class="chat-input-row">
        <textarea class="chat-input" id="chat-input" placeholder="Ihre Frage…" rows="1" aria-label="Nachricht eingeben"></textarea>
        <button class="chat-send" id="chat-send" aria-label="Senden" disabled>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2L2 8l5 2 2 5 5-12z"/></svg>
        </button>
      </div>
      <p class="chat-disclosure" role="note" style="margin:0;padding:0 16px 11px;font-size:10.5px;line-height:1.45;opacity:.5;text-align:center">
        KI-generierte Antworten, Fehler möglich. Verbindliches klären wir persönlich.
      </p>
    </div>
    <button class="chat-trigger" id="chat-trigger" aria-label="KI-Assistent öffnen" aria-expanded="false" data-tooltip="KI-Assistent · Gemini Nano · läuft lokal in Chrome">
      <svg class="icon-chat" width="21" height="21" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
      <svg class="icon-close" width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4L4 14M4 4l10 10"/></svg>
    </button>
  `;
  document.body.appendChild(widget);

  const trigger = widget.querySelector("#chat-trigger");
  const msgsEl = widget.querySelector("#chat-msgs");
  const chipsEl = widget.querySelector("#chat-chips");
  const inputEl = widget.querySelector("#chat-input");
  const sendBtn = widget.querySelector("#chat-send");
  const pb = widget.querySelector("#chat-pb");
  const pbFill = widget.querySelector("#chat-pb-fill");

  let session = null;
  let questionCount = 0;
  let contactState = null;
  let contactData = {};
  let aiReady = false;
  let isFallback = false;
  let initialized = false;

  trigger.addEventListener("click", () => {
    const open = widget.classList.toggle("open");
    trigger.setAttribute("aria-expanded", String(open));
    if (open && !initialized) { initialized = true; boot(); }
    if (open) setTimeout(() => { if (!isFallback) inputEl.focus(); }, 240);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && widget.classList.contains("open")) {
      widget.classList.remove("open");
      trigger.setAttribute("aria-expanded", "false");
      trigger.focus();
    }
  });

  async function typeMsg(text, type, speed = 16) {
    const el = document.createElement("div");
    el.className = `chat-bubble ${type}`;
    msgsEl.appendChild(el);
    for (let i = 1; i <= text.length; i++) {
      el.innerHTML = renderMd(text.slice(0, i));
      msgsEl.scrollTop = msgsEl.scrollHeight;
      await new Promise((r) => setTimeout(r, speed));
    }
    return el;
  }

  function showHint() {
    const el = document.createElement("div");
    el.className = "chat-bubble system chat-hint";
    el.textContent = "/kontakt · /services · /hilfe";
    msgsEl.appendChild(el);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  function renderMd(text) {
    return text
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/^[ \t]*[-*+][ \t]+/gm, "")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>")
      .replace(/\n/g, "<br>");
  }

  function addMsg(text, type) {
    const el = document.createElement("div");
    el.className = `chat-bubble ${type}`;
    if (type === "user") {
      el.textContent = text;
    } else {
      el.innerHTML = renderMd(text);
    }
    msgsEl.appendChild(el);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return el;
  }

  function addTyping() {
    const el = document.createElement("div");
    el.className = "chat-typing";
    el.setAttribute("aria-label", "Assistent schreibt…");
    el.innerHTML = "<span></span><span></span><span></span>";
    msgsEl.appendChild(el);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return el;
  }

  function setInput(enabled) {
    inputEl.disabled = !enabled;
    sendBtn.disabled = !enabled || !inputEl.value.trim();
  }

  function setChips(labels) {
    chipsEl.innerHTML = "";
    labels.forEach((label) => {
      const btn = document.createElement("button");
      btn.className = "chat-chip";
      btn.textContent = label;
      btn.addEventListener("click", () => { chipsEl.innerHTML = ""; chipHandler(label); });
      chipsEl.appendChild(btn);
    });
  }

  function extractPageContent() {
    const main = document.querySelector("main");
    if (!main) return "";
    const clone = main.cloneNode(true);
    clone.querySelectorAll("script, style, svg, .chat-widget, .modal-backdrop, .cookie-banner, .scroll-top, [data-contact-modal]").forEach((el) => el.remove());
    return clone.textContent
      .replace(/\t/g, " ")
      .replace(/ {2,}/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
      .slice(0, 4000);
  }

  function checkNavigation(userText) {
    const lower = userText.toLowerCase();
    const current = location.pathname.split("/").pop() || "index.html";
    const match = NAV_MAP.find(({ kw, page }) => page !== current && kw.some((k) => lower.includes(k)));
    if (!match) return;
    const btn = document.createElement("button");
    btn.className = "chat-chip chat-nav-chip";
    btn.textContent = match.label;
    btn.addEventListener("click", () => { window.location.href = match.page; });
    chipsEl.appendChild(btn);
  }

  function saveHistory() {
    try {
      const bubbles = [...msgsEl.querySelectorAll(".chat-bubble:not(.chat-form-bubble)")];
      const data = bubbles.slice(-24).map((el) => ({
        c: el.classList.contains("user") ? el.textContent : el.innerHTML,
        t: el.classList.contains("user") ? "user" : el.classList.contains("system") ? "system" : "bot"
      }));
      sessionStorage.setItem("rmChat", JSON.stringify(data));
    } catch {}
  }

  function loadHistory() {
    try {
      const data = JSON.parse(sessionStorage.getItem("rmChat") || "[]");
      if (!data.length) return false;
      data.forEach(({ c, t }) => {
        const el = document.createElement("div");
        el.className = `chat-bubble ${t}`;
        if (t === "user") el.textContent = c; else el.innerHTML = c;
        msgsEl.appendChild(el);
      });
      msgsEl.scrollTop = msgsEl.scrollHeight;
      return true;
    } catch { return false; }
  }

  function initVoiceInput() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const micBtn = document.createElement("button");
    micBtn.className = "chat-mic";
    micBtn.setAttribute("aria-label", "Spracheingabe starten");
    micBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0014 0"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="9" y1="22" x2="15" y2="22"/></svg>`;
    const inputRow = widget.querySelector(".chat-input-row");
    inputRow.insertBefore(micBtn, sendBtn);
    const rec = new SR();
    rec.lang = "de-DE";
    rec.continuous = false;
    rec.interimResults = false;
    let listening = false;
    micBtn.addEventListener("click", () => { if (listening) { rec.stop(); return; } try { rec.start(); } catch {} });
    rec.onstart = () => { listening = true; micBtn.classList.add("listening"); };
    rec.onend = () => { listening = false; micBtn.classList.remove("listening"); };
    rec.onerror = () => { listening = false; micBtn.classList.remove("listening"); };
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript.trim();
      if (!text) return;
      inputEl.value = text;
      sendBtn.disabled = false;
      setTimeout(() => handleSend(), 80);
    };
  }

  function initProactiveBubble() {
    const page = location.pathname.split("/").pop() || "index.html";
    const msg = PROACTIVE[page] || "Haben Sie eine Frage zu KI-Transformation?";
    setTimeout(() => {
      if (initialized) return;
      const el = document.createElement("div");
      el.className = "chat-proactive";
      el.textContent = msg;
      widget.insertBefore(el, trigger);
      el.addEventListener("click", () => { trigger.click(); el.remove(); });
      requestAnimationFrame(() => el.classList.add("visible"));
      setTimeout(() => { el.classList.remove("visible"); setTimeout(() => el.remove(), 700); }, 8000);
    }, 30000);
  }

  function chipHandler(label) {
    if (label === "Erstgespräch anfragen" || label === "Ja, gerne") { startContact(); return; }
    if (label === "Noch eine Frage") { setInput(true); inputEl.focus(); return; }
    sendMessage(label);
  }

  function getChromeVersion() {
    const m = navigator.userAgent.match(/Chrome\/(\d+)/);
    return m ? parseInt(m[1]) : 0;
  }

  function isChromeBrowser() {
    return /Chrome/.test(navigator.userAgent) && !/Edg\/|OPR\/|Brave/.test(navigator.userAgent);
  }

  function showActivationGuide() {
    const flagUrl = "chrome://flags/#prompt-api-for-gemini-nano";
    addMsg(
      `Gemini Nano ist fast bereit – noch ein kurzer Schritt:<br><br>` +
      `<span style="display:flex;align-items:center;gap:8px;background:#f3f4f6;padding:7px 10px;border-radius:7px;font-family:monospace;font-size:11px;word-break:break-all;">` +
      `${flagUrl}` +
      `<button onclick="navigator.clipboard.writeText('${flagUrl}').then(()=>{this.textContent='✓ Kopiert'})" ` +
      `style="flex-shrink:0;border:none;background:#4f46e5;color:#fff;padding:3px 9px;border-radius:4px;cursor:pointer;font-size:11px;font-family:sans-serif;">Kopieren</button>` +
      `</span><br>` +
      `→ In Chrome-Adresszeile eingeben &rarr; Dropdown auf <strong>Enabled</strong> stellen &rarr; Chrome neu starten &rarr; Seite neu laden`,
      "bot"
    );
    const retryBtn = document.createElement("button");
    retryBtn.className = "chat-chip";
    retryBtn.textContent = "↺ Nochmal versuchen";
    retryBtn.addEventListener("click", async () => {
      chipsEl.innerHTML = "";
      msgsEl.querySelectorAll(".chat-bubble").forEach((el) => el.remove());
      initialized = false;
      boot();
    });
    chipsEl.appendChild(retryBtn);
  }

  async function boot() {
    if (!isChromeBrowser()) { fallback("other"); return; }

    const version = getChromeVersion();
    if (version > 0 && version < 127) { fallback("outdated", version); return; }

    const LM = window.LanguageModel || window.ai?.languageModel || window.ai?.assistant;
    if (!LM) { showActivationGuide(); return; }

    let avail;
    try {
      avail = typeof LM.availability === "function"
        ? await LM.availability()
        : ((await LM.capabilities?.())?.available ?? "no");
    } catch { avail = "no"; }

    if (avail === "no") { showActivationGuide(); return; }

    const loadingMsg = avail === "after-download"
      ? "Gemini Nano wird einmalig heruntergeladen – einen Moment…"
      : "KI wird initialisiert…";
    addMsg(loadingMsg, "system");
    if (avail === "after-download") pb.hidden = false;

    try {
      const pageName = location.pathname.split("/").pop() || "index.html";
      const pageCtx = `${document.title} (${pageName})`;
      const pageContent = extractPageContent();
      const prompt = SYSTEM_PROMPT
        .replace("{{PAGE}}", pageCtx)
        .replace("{{CONTENT}}", pageContent);
      const opts = { systemPrompt: prompt, initialPrompts: INITIAL_PROMPTS };
      if (avail === "after-download") {
        opts.monitor = (m) => {
          m.addEventListener("downloadprogress", (e) => {
            if (e.total > 0) pbFill.style.width = `${Math.round((e.loaded / e.total) * 100)}%`;
          });
        };
      }
      session = await LM.create({ ...opts });
      pb.hidden = true;
      msgsEl.querySelector(".chat-bubble.system")?.remove();
      aiReady = true;
      setInput(true);
      const hasHistory = loadHistory();
      if (hasHistory) {
        addMsg("Willkommen zurück – Ihr Gespräch wurde wiederhergestellt.", "system");
        showHint();
      } else {
        const greeting = await typeMsg("Guten Tag! Ich bin der KI-Assistent von Robert Meyer – für Fragen zu KI-Transformation, dem 13%-Ansatz und den Services.\n\nWas beschäftigt Sie?", "bot");
        greeting.style.transition = "opacity 800ms ease";
        setTimeout(() => { greeting.style.opacity = "0"; }, 8000);
        setTimeout(() => { greeting.style.maxHeight = "0"; greeting.style.padding = "0"; greeting.style.margin = "0"; greeting.style.overflow = "hidden"; }, 8800);
        showHint();
      }
      setChips(["Was ist der 13%-Ansatz?", "Welche Services gibt es?", "Erstgespräch anfragen"]);
    } catch { fallback(); }
  }

  function fallback(reason = "other", version = 0) {
    isFallback = true;
    inputEl.disabled = false;
    inputEl.placeholder = "/kontakt oder Frage wählen…";
    const messages = {
      outdated: `Ihr Chrome (Version ${version}) ist zu alt. Gemini Nano benötigt Chrome 127 oder neuer. Bitte Chrome aktualisieren – danach läuft der KI-Assistent automatisch.`,
      other: "Der KI-Assistent nutzt Gemini Nano direkt in Chrome – Ihr Browser unterstützt das leider nicht. Hier die häufigsten Fragen:"
    };
    addMsg(messages[reason] || messages.other, "system");
    showHint();
    chipsEl.innerHTML = "";
    FAQ_FALLBACK.forEach(({ q, a }) => {
      const btn = document.createElement("button");
      btn.className = "chat-chip";
      btn.textContent = q;
      btn.addEventListener("click", () => {
        chipsEl.innerHTML = "";
        addMsg(q, "user");
        addMsg(a, "bot");
        questionCount++;
        if (questionCount >= 2) setTimeout(() => setChips(["Erstgespräch anfragen", "Weitere Frage"]), 500);
      });
      chipsEl.appendChild(btn);
    });
    sendBtn.disabled = false;
  }

  async function sendMessage(text) {
    if (!text.trim() || !aiReady) return;
    chipsEl.innerHTML = "";
    addMsg(text, "user");
    setInput(false);
    inputEl.value = "";
    inputEl.style.height = "auto";
    questionCount++;

    const typing = addTyping();
    try {
      let response;
      if (typeof session.prompt === "function") {
        response = await session.prompt(text);
      } else {
        const stream = session.promptStreaming(text);
        for await (const chunk of stream) response = chunk;
      }
      typing.remove();
      addMsg(response || "Keine Antwort – bitte erneut versuchen.", "bot");
    } catch {
      typing.remove();
      addMsg("Entschuldigung, da ist etwas schiefgelaufen. Bitte erneut versuchen.", "bot");
    }

    setInput(true);
    inputEl.focus();
    checkNavigation(text);
    saveHistory();

    if (questionCount === 4) {
      setTimeout(() => {
        addMsg("Klingt nach einem konkreten Vorhaben – soll ich direkt ein Erstgespräch für Sie vormerken?", "system");
        setChips(["Ja, gerne", "Noch eine Frage"]);
      }, 400);
    } else if (questionCount >= 5 && questionCount % 2 === 1) {
      setTimeout(() => setChips(["Erstgespräch anfragen", "Noch eine Frage"]), 400);
    }
  }

  function startContact() {
    chipsEl.innerHTML = "";
    contactState = "name";
    addMsg("Super – das dauert nur 30 Sekunden. Wie heißen Sie?", "bot");
    inputEl.placeholder = "Ihr Name…";
    setInput(true);
    inputEl.focus();
  }

  async function handleContact(text) {
    addMsg(text, "user");
    setInput(false);

    if (contactState === "name") {
      contactData.name = text;
      contactState = "email";
      addMsg(`${text.split(" ")[0]}, danke. Ihre E-Mail-Adresse?`, "bot");
      inputEl.placeholder = "ihre@email.de";
      setInput(true);

    } else if (contactState === "email") {
      if (!text.includes("@") || !text.includes(".")) {
        addMsg("Das sieht nicht wie eine gültige E-Mail aus – bitte nochmal?", "bot");
        setInput(true);
        return;
      }
      contactData.email = text;
      contactState = "date";
      addMsg("Haben Sie einen Wunschtermin? (Optional – einfach leer lassen und Enter drücken)", "bot");
      inputEl.placeholder = "z.B. nächste Woche, oder leer lassen…";
      setInput(true);

    } else if (contactState === "date") {
      contactData.date = text;
      contactState = "done";
      inputEl.placeholder = "Ihre Frage…";

      const typing = addTyping();
      const msgBody = `ANFRAGE via Chat-Assistent (ai.rm-on.de)

Name: ${contactData.name}
E-Mail: ${contactData.email}
Wunschtermin: ${contactData.date || "Nicht angegeben"}
Seite: ${location.href}
Zeit: ${new Date().toLocaleString("de-DE")}`;

      try {
        await fetch("https://n8n.top-beraternetzwerk.de/webhook/teamschat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user: contactData.name, message: msgBody })
        });
        typing.remove();
        addMsg(`Perfekt! Die Anfrage ist angekommen, ${contactData.name.split(" ")[0]}. Robert meldet sich in der Regel innerhalb von 24 Stunden. Bis dann!`, "bot");
        if (window.umami) window.umami.track("chat-contact-submit");
      } catch {
        typing.remove();
        addMsg("Anfrage konnte nicht gesendet werden. Bitte schreiben Sie direkt an rm@kostenmanager.net", "bot");
      }
    }
  }

  function showContactForm() {
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble bot chat-form-bubble";
    bubble.innerHTML = `
      <strong>Erstgespräch anfragen</strong>
      <form class="chat-inline-form">
        <input name="name" placeholder="Ihr Name *" required autocomplete="name">
        <input name="email" type="email" placeholder="E-Mail *" required autocomplete="email">
        <input name="date" placeholder="Wunschtermin (optional)">
        <button class="chat-form-submit" type="submit">Anfrage senden</button>
        <span class="chat-form-status"></span>
      </form>
    `;
    msgsEl.appendChild(bubble);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    bubble.querySelector("input[name='name']").focus();

    bubble.querySelector("form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target));
      if (!data.name || !data.email) return;
      const submitBtn = e.target.querySelector(".chat-form-submit");
      const statusEl = e.target.querySelector(".chat-form-status");
      submitBtn.disabled = true;
      submitBtn.textContent = "Wird gesendet…";
      const msgBody = `ANFRAGE via /kontakt (ai.rm-on.de)\n\nName: ${data.name}\nE-Mail: ${data.email}\nWunschtermin: ${data.date || "Nicht angegeben"}\nSeite: ${location.href}\nZeit: ${new Date().toLocaleString("de-DE")}`;
      try {
        await fetch("https://n8n.top-beraternetzwerk.de/webhook/teamschat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user: data.name, message: msgBody })
        });
        e.target.innerHTML = `<span class="chat-form-success">Danke, ${data.name.split(" ")[0]}! Robert meldet sich innerhalb von 24 Stunden bei Ihnen.</span>`;
        if (window.umami) window.umami.track("chat-command-kontakt");
      } catch {
        submitBtn.disabled = false;
        submitBtn.textContent = "Anfrage senden";
        statusEl.textContent = "Fehler – bitte rm@kostenmanager.net nutzen.";
      }
    });
  }

  function executeCommand(cmd) {
    addMsg("/" + cmd, "user");
    if (cmd === "kontakt") {
      addMsg("Hier direkt das Formular:", "bot");
      showContactForm();
      saveHistory();
      return;
    }
    if (cmd === "services" || cmd === "service") {
      addMsg("Welchen Service möchten Sie vertiefen?", "bot");
      setChips(["13%-Check", "n8n Automatisierung", "EU AI Act Beratung", "KI-Schulung Verwaltung", "Erstgespräch anfragen"]);
      saveHistory();
      return;
    }
    if (cmd === "hilfe" || cmd === "help") {
      addMsg("/kontakt – Formular im Chat\n/services – Services anzeigen\n/roadmap · /n8n · /aiact · /verwaltung · /mittelstand – direkt zur Seite\n/hilfe – diese Übersicht", "bot");
      saveHistory();
      return;
    }
    const navMatch = NAV_MAP.find(({ page }) => {
      const slug = page.replace(".html", "").replace("ki-", "").replace("-beratung", "").replace("-automatisierung", "").replace("-verwaltung", "").replace("-mittelstand", "");
      return cmd === slug || cmd === page.replace(".html", "") || page.replace(".html","").includes(cmd);
    });
    if (navMatch) {
      addMsg(`Ich leite Sie weiter zu: ${navMatch.label.replace("→ ", "")}`, "bot");
      setTimeout(() => { window.location.href = navMatch.page; }, 1000);
      return;
    }
    addMsg("Unbekannter Befehl. Tippen Sie /hilfe für eine Übersicht.", "bot");
  }

  function handleSend() {
    const text = inputEl.value.trim();
    if (!text || inputEl.disabled) return;
    inputEl.value = "";
    inputEl.style.height = "auto";
    if (text.startsWith("/")) {
      executeCommand(text.slice(1).toLowerCase().trim());
      return;
    }
    if (isFallback) return;
    if (contactState && contactState !== "done") {
      handleContact(text);
    } else {
      sendMessage(text);
    }
  }

  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  });

  inputEl.addEventListener("input", () => {
    sendBtn.disabled = !inputEl.value.trim() || inputEl.disabled;
    inputEl.style.height = "auto";
    inputEl.style.height = `${Math.min(80, inputEl.scrollHeight)}px`;
  });

  sendBtn.addEventListener("click", handleSend);

  initVoiceInput();
  initProactiveBubble();
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
initChatWidget();
initTestimonialRotator();
initActiveNav();
const _page = location.pathname.split("/").pop() || "index.html";
if (_page === "index.html" || _page === "") initCookieBanner();
