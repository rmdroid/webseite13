/* ==========================================================================
   ki13prozent.de — Interaktion
   Kein Framework, kein Build. Alles hier drin.
   ========================================================================== */
(() => {
  "use strict";

  const WEBHOOK = "https://n8n.top-beraternetzwerk.de/webhook/teamschat";
  const CONTACT_MAIL = "rm@kostenmanager.net";
  const CONTACT_PHONE = "+49 (0) 162 4194748";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const pageName = () => location.pathname.split("/").pop() || "index.html";
  const fmtEUR = (n) => Math.round(n).toLocaleString("de-DE") + " €";
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const track = (name, data) => { try { window.umami?.track(name, data); } catch { /* ignore */ } };

  async function postWebhook(user, message) {
    const res = await fetch(WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, message })
    });
    if (!res.ok) throw new Error("webhook");
    return res;
  }

  /* ------------------------------------------------------------------------
     Header, Navigation
     ------------------------------------------------------------------------ */
  function initHeader() {
    const header = $("[data-header]");
    if (!header) return;
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const toggle = $("[data-menu-toggle]");
    if (toggle) {
      toggle.addEventListener("click", () => {
        const open = document.body.classList.toggle("nav-open");
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
      });
      $$(".primary-nav a").forEach((a) => a.addEventListener("click", () => {
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      }));
      // Im Mobilmenü ersetzt ein Button die ausgeblendete Kopfzeilen-Schaltfläche
      const nav = $(".primary-nav", header);
      if (nav && !$(".nav-cta", nav)) {
        const cta = document.createElement("button");
        cta.type = "button";
        cta.className = "btn primary nav-cta";
        cta.setAttribute("data-open-contact", "");
        cta.textContent = "Erstgespräch anfragen";
        cta.addEventListener("click", () => {
          document.body.classList.remove("nav-open");
          toggle.setAttribute("aria-expanded", "false");
        });
        nav.appendChild(cta);
      }
    }

    const current = pageName();
    $$(".primary-nav a, .legal-nav a").forEach((a) => {
      const href = a.getAttribute("href");
      if (href === current || (current === "index.html" && href === "index.html")) {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
      }
    });
  }

  /* ------------------------------------------------------------------------
     Reveal beim Scrollen
     ------------------------------------------------------------------------ */
  function initReveal() {
    const items = $$(".reveal");
    if (!items.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach((el) => io.observe(el));
  }

  /* ------------------------------------------------------------------------
     Das Raster: 100 Vorhaben, 13 leuchten
     ------------------------------------------------------------------------ */
  const LIT = [3, 11, 18, 27, 34, 42, 49, 56, 63, 71, 78, 86, 95];

  const FAILED = [
    "Kein klarer Prozess. Das Tool war da, die Aufgabe nicht.",
    "Datenlage nie geprüft. Beim Pilot fehlten die Daten, die im Konzept standen.",
    "Niemand verantwortlich. Nach dem Workshop lag das Thema bei allen und bei keinem.",
    "Demo statt Betrieb. Beeindruckte den Vorstand, überlebte den ersten Fehler nicht.",
    "Governance am Ende. Datenschutz kam beim Deployment und stoppte alles.",
    "Kein Kontrollpunkt. Fehler fielen erst auf, als Kunden sie meldeten.",
    "Falsche Kennzahl. Gemessen wurde Nutzung, nicht Entlastung.",
    "Akzeptanz fehlte. Der Workflow lief neben der Arbeit, nicht in ihr.",
    "Budget ohne Entscheidung. Strategiepapier fertig, niemand sagte Ja oder Nein.",
    "Produkt vor Problem. Man kaufte eine Lizenz und suchte danach den Anwendungsfall.",
    "Kein Betriebspfad. Wer wartet, wer eskaliert, was kostet Jahr drei? Unbeantwortet.",
    "Schulung ohne Transfer. Applaus am Nachmittag, alter Ablauf am Montag.",
    "Scope zu groß. Drei Abteilungen, ein Pilot, kein Ergebnis.",
    "Modell gewechselt, Prozess nicht. Die Ausgabe wurde besser, die Wirkung blieb aus."
  ];

  const WORKED = [
    "Ein konkreter Prozess mit messbarem Zeitverlust als Startpunkt.",
    "Datenlage vor dem Pilot geprüft, Lücken benannt, Zugriff geklärt.",
    "AI-Act-Risiko früh eingeordnet. Compliance war Designparameter, keine Bremse.",
    "Eine Person mit Budget und Entscheidungsrecht, nicht ein Gremium.",
    "Kontrollpunkte im Workflow, an denen ein Mensch prüft und freigibt.",
    "Prototyp im echten Ablauf getestet, bevor Vollbudget floss.",
    "Klare Stopp-Kriterien. Das Team wusste, wann es abbrechen darf.",
    "Schulung an eigenen Aufgaben, Transfer am nächsten Tag geprüft.",
    "Betriebskosten für drei Jahre gerechnet, nicht nur Projektkosten.",
    "Eine Entscheidung auf zwei Seiten, nicht ein Strategiedeck.",
    "Der Fachbereich hat gebaut, die IT hat abgesichert. Nicht umgekehrt.",
    "Kleiner Scope, sauberer Betrieb, dann erst Skalierung.",
    "Eskalationspfad definiert, bevor der erste Fehler kam."
  ];

  function initDots() {
    const wrap = $("[data-dots]");
    if (!wrap) return;
    const note = $("[data-dots-note]");
    const frag = document.createDocumentFragment();
    let lit = 0;
    for (let i = 0; i < 100; i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "dot";
      b.style.setProperty("--i", i);
      const isLit = LIT.includes(i);
      if (isLit) { b.classList.add("on"); b.style.setProperty("--j", lit++); }
      b.setAttribute("aria-label", `Vorhaben ${i + 1}: ${isLit ? "läuft im Betrieb" : "gescheitert"}`);
      b.dataset.i = i;
      frag.appendChild(b);
    }
    wrap.appendChild(frag);

    const show = (i) => {
      const isLit = LIT.includes(i);
      const text = isLit ? WORKED[LIT.indexOf(i) % WORKED.length] : FAILED[(i * 7) % FAILED.length];
      if (note) {
        note.classList.toggle("on", isLit);
        note.innerHTML = `<span class="num">Vorhaben ${String(i + 1).padStart(3, "0")} · ${isLit ? "Warum es lief" : "Woran es scheiterte"}</span>${esc(text)}`;
      }
      $$(".dot.active", wrap).forEach((d) => d.classList.remove("active"));
      wrap.children[i]?.classList.add("active");
    };

    wrap.addEventListener("pointerover", (e) => {
      const d = e.target.closest(".dot");
      if (d) show(Number(d.dataset.i));
    });
    wrap.addEventListener("focusin", (e) => {
      const d = e.target.closest(".dot");
      if (d) show(Number(d.dataset.i));
    });
    wrap.addEventListener("click", (e) => {
      const d = e.target.closest(".dot");
      if (d) show(Number(d.dataset.i));
    });

    const start = () => {
      wrap.classList.add("ready");
      setTimeout(() => wrap.classList.add("lit"), reduceMotion ? 0 : 1000);
    };
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { start(); io.disconnect(); }
      }, { threshold: 0.2 });
      io.observe(wrap);
    } else {
      start();
    }
  }

  function initMiniDots() {
    $$("[data-dots-mini]").forEach((wrap) => {
      const frag = document.createDocumentFragment();
      for (let i = 0; i < 100; i++) {
        const s = document.createElement("i");
        if (LIT.includes(i)) s.className = "on";
        frag.appendChild(s);
      }
      wrap.appendChild(frag);
    });
  }

  /* ------------------------------------------------------------------------
     Schnellcheck
     ------------------------------------------------------------------------ */
  const CHECK_QUESTIONS = [
    {
      key: "usecase", label: "Use Case",
      text: "Wie konkret ist Ihr KI-Vorhaben?",
      hint: "Es geht nicht um die Technologie, sondern um die Arbeit, die sich ändern soll.",
      options: ["Eine Idee. Kein bestimmter Prozess.", "Ein konkreter Prozess, noch ungeprüft.", "Use Case geprüft, Prozessbezug dokumentiert."]
    },
    {
      key: "data", label: "Datenlage",
      text: "Wie steht es um die Daten für diesen Use Case?",
      hint: "Vorhanden heißt nicht zugänglich. Zugänglich heißt nicht brauchbar.",
      options: ["Unbekannt oder nie bewertet.", "Vorhanden, Qualität und Zugriff unklar.", "Strukturiert, zugänglich, dokumentiert."]
    },
    {
      key: "risk", label: "AI-Act-Risiko",
      text: "Haben Sie das AI-Act-Risiko eingeordnet?",
      hint: "Die Risikoklasse entscheidet über Aufwand, Dokumentation und Aufsicht.",
      options: ["Noch nicht betrachtet.", "Grob bekannt, nicht dokumentiert.", "Klassifiziert und in der Governance verankert."]
    },
    {
      key: "owner", label: "Verantwortung",
      text: "Wer trägt Verantwortung für das Vorhaben?",
      hint: "Verantwortung ohne Budget und Entscheidungsrecht ist Zuständigkeit.",
      options: ["Noch ungeklärt.", "In Diskussion, nicht formalisiert.", "Eine Person mit Budget und Entscheidungsrecht."]
    },
    {
      key: "threat", label: "Größtes Risiko",
      text: "Was würde das Vorhaben am ehesten scheitern lassen?",
      hint: "Ehrlich beantwortet ist diese Frage die wichtigste der fünf.",
      options: ["Budget fließt ohne messbare Wirkung.", "Datenschutz oder AI Act bleiben ungeklärt.", "Akzeptanz im Team oder technische Integration."]
    }
  ];

  const CHECK_PROFILES = {
    stop: {
      cls: "stop", label: "Stoppen", title: "Erst Grundlagen, dann KI.",
      body: "Die wichtigsten Voraussetzungen für ein belastbares Vorhaben fehlen noch. Ein schneller Start senkt das Risiko nicht, er erhöht es. Der sinnvolle nächste Schritt ist eine strukturierte Bestandsaufnahme, kein Tool.",
      service: "13%-Check", cta: "Bestandsaufnahme anfragen"
    },
    hold: {
      cls: "hold", label: "Absichern", title: "Compliance vor Umsetzung.",
      body: "Die Idee ist da, aber AI Act, Datenschutz und Verantwortung sind offen. Ohne diese Basis wird das Vorhaben spätestens beim ersten Review gebremst. Ein Risiko-Sprint schafft die Grundlage, auf der Sie bauen dürfen.",
      service: "AI Act Risiko-Sprint", cta: "Risiko-Sprint anfragen"
    },
    proto: {
      cls: "proto", label: "Prototyp", title: "Testen vor skalieren.",
      body: "Use Case und Grundlagen sind konkret. Jetzt zeigt ein Workflow im echten Ablauf, ob der Prozess trägt, bevor Vollbudget freigegeben wird. Nicht als Demo, sondern mit Übergaben und Kontrollpunkten.",
      service: "n8n Workflow-Prototyp", cta: "Workflow-Prototyp anfragen"
    },
    go: {
      cls: "go", label: "Investieren", title: "Bereit für die Entscheidung.",
      body: "Use Case, Datenlage, Governance und Verantwortung tragen. Der 13%-Check verdichtet das in 30 Tagen zu einem Entscheidungsbrief, mit dem die Geschäftsführung freigeben kann, und zu einem Plan, der am Tag danach beginnt.",
      service: "13%-Check", cta: "13%-Check anfragen"
    }
  };

  const profileFor = (score) => (score <= 2 ? "stop" : score <= 4 ? "hold" : score <= 7 ? "proto" : "go");

  let lastCheckSummary = "";

  function initCheck() {
    const root = $("[data-check]");
    if (!root) return;
    const answers = [];

    function renderQuestion(index) {
      const q = CHECK_QUESTIONS[index];
      root.innerHTML = `
        <div class="check-card">
          <div class="check-progress">
            <div class="steps" aria-hidden="true">${CHECK_QUESTIONS.map((_, i) => `<i class="${i < index ? "done" : i === index ? "now" : ""}"></i>`).join("")}</div>
            <span class="num">Frage ${index + 1} von ${CHECK_QUESTIONS.length} · ${q.label}</span>
          </div>
          <p class="check-q">${esc(q.text)}</p>
          <p class="check-hint">${esc(q.hint)}</p>
          <div class="check-options" role="group" aria-label="Antworten">
            ${q.options.map((o, i) => `<button class="check-option" type="button" data-score="${i}"><kbd>${i + 1}</kbd><span>${esc(o)}</span></button>`).join("")}
          </div>
          ${index > 0 ? `<button class="btn ghost sm check-back" type="button" data-back>Zurück</button>` : ""}
        </div>`;

      $$(".check-option", root).forEach((b) => b.addEventListener("click", () => {
        answers[index] = Number(b.dataset.score);
        if (index + 1 < CHECK_QUESTIONS.length) renderQuestion(index + 1); else renderResult();
      }));
      $("[data-back]", root)?.addEventListener("click", () => renderQuestion(index - 1));
      root.onkeydown = (e) => {
        const n = Number(e.key);
        if (n >= 1 && n <= 3) { e.preventDefault(); $$(".check-option", root)[n - 1]?.click(); }
      };
      if (index > 0) $(".check-q", root)?.scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
    }

    function renderResult() {
      root.onkeydown = null;
      const score = answers.reduce((a, b) => a + b, 0);
      const key = profileFor(score);
      const p = CHECK_PROFILES[key];
      const threat = CHECK_QUESTIONS[4].options[answers[4]];
      const core = answers.slice(0, 4);
      const strongest = CHECK_QUESTIONS[core.indexOf(Math.max(...core))].label;
      const weakest = CHECK_QUESTIONS[core.indexOf(Math.min(...core))].label;
      const date = new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });

      lastCheckSummary = `Schnellcheck: ${score}/10 · Empfehlung: ${p.label} (${p.service})\n` +
        CHECK_QUESTIONS.map((q, i) => `${q.label}: ${q.options[answers[i]]}`).join("\n");

      root.innerHTML = `
        <article class="brief" aria-label="Vorschau Entscheidungsbrief">
          <span class="stamp ${p.cls}">${p.label}</span>
          <div class="brief-head">
            <div><span>Dokument</span><b>Entscheidungsbrief · Vorschau</b></div>
            <div><span>Datum</span><b>${date}</b></div>
            <div><span>Basis</span><b>5 Antworten, ${score} von 10 Punkten</b></div>
          </div>
          <h3 class="brief-title">${esc(p.title)}</h3>
          <p class="brief-body">${esc(p.body)}</p>
          <div class="brief-grid">
            <div><span class="num">Empfohlener Einstieg</span><strong>${esc(p.service)}</strong></div>
            <div><span class="num">Größtes Risiko (Ihre Angabe)</span><strong>${esc(threat)}</strong></div>
            <div><span class="num">Stärkste Grundlage</span><strong>${esc(strongest)}</strong></div>
            <div><span class="num">Offenster Punkt</span><strong>${esc(weakest)}</strong></div>
          </div>
          <div class="brief-actions">
            <button class="btn primary" type="button" data-open-contact data-contact-topic="${esc(p.service)}" data-contact-from="check">${esc(p.cta)}</button>
            <button class="btn" type="button" data-print>Als PDF sichern</button>
            <button class="btn ghost" type="button" data-restart>Nochmal</button>
          </div>
        </article>`;

      const side = $(".check-side");
      if (side) {
        side.innerHTML = `
          <div class="card score-panel">
            <p class="eyebrow" style="color:#9aa1a9">Ihr Ergebnis</p>
            <div class="big">${score}<span>/ 10</span></div>
            <div class="score-dots" aria-hidden="true">${Array.from({ length: 10 }, (_, i) => `<i class="${i < score ? "on" : ""}"></i>`).join("")}</div>
            <ul class="score-scale">
              ${["go", "proto", "hold", "stop"].map((k) => `<li class="${k === key ? "now" : ""}"><span>${CHECK_PROFILES[k].label}</span><span class="num">${k === "go" ? "8–10" : k === "proto" ? "5–7" : k === "hold" ? "3–4" : "0–2"}</span></li>`).join("")}
            </ul>
            <p style="margin-top:16px;font-size:13.5px">Eine erste Einordnung, kein Gutachten. Der 13%-Check prüft dieselben Dimensionen mit Ihren Daten, Prozessen und Verantwortlichen.</p>
          </div>`;
      }

      $("[data-restart]", root).addEventListener("click", () => {
        answers.length = 0;
        lastCheckSummary = "";
        if (side) side.outerHTML = SIDE_DEFAULT;
        renderQuestion(0);
        $("#check")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      });
      $("[data-print]", root).addEventListener("click", () => window.print());
      root.querySelector(".brief").scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
      track("check-complete", { profile: key, score });
    }

    const SIDE_DEFAULT = $(".check-side")?.outerHTML || "";
    renderQuestion(0);
  }

  /* ------------------------------------------------------------------------
     30 Tage
     ------------------------------------------------------------------------ */
  function initDays() {
    const root = $("[data-days]");
    if (!root) return;
    const phases = $$("[data-phase]", root);
    const bar = $("[data-day-bar]", root);
    const label = $("[data-day-label]", root);
    const title = $("[data-day-title]", root);
    const text = $("[data-day-text]", root);
    if (bar) bar.innerHTML = Array.from({ length: 30 }, () => "<i></i>").join("");
    const segs = bar ? [...bar.children] : [];

    const activate = (ph) => {
      phases.forEach((p) => p.classList.toggle("active", p === ph));
      const from = Number(ph.dataset.from), to = Number(ph.dataset.to);
      if (label) label.textContent = `Tag ${from}–${to}`;
      segs.forEach((s, i) => s.classList.toggle("on", i + 1 <= to));
      if (title) title.textContent = ph.dataset.title;
      if (text) text.textContent = ph.dataset.text;
    };
    activate(phases[0]);

    phases.forEach((p) => p.addEventListener("click", () => activate(p)));

    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) activate(visible[0].target);
    }, { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] });
    phases.forEach((p) => io.observe(p));
  }

  /* ------------------------------------------------------------------------
     AI-Act-Einordner
     ------------------------------------------------------------------------ */
  const AIACT = {
    prohibited: {
      label: "Verbotene Praxis", title: "So darf das System in der EU nicht betrieben werden.",
      body: "Emotionserkennung am Arbeitsplatz, biometrische Kategorisierung nach sensiblen Merkmalen, Social Scoring und manipulative Systeme fallen unter Artikel 5 der KI-Verordnung. Hier hilft keine Dokumentation. Hier braucht es ein anderes Vorhaben.",
      items: ["Artikel 5 KI-VO: verbotene Praktiken, kein Weg über Einwilligung oder Dokumentation", "Prüfen, ob ein zulässiger Teil des Vorhabens bleibt", "Frühzeitig stoppen ist hier die günstigste Entscheidung"]
    },
    high: {
      label: "Hochrisiko", title: "Zulässig, aber mit vollem Pflichtenprogramm.",
      body: "Systeme, die Entscheidungen über Menschen in Beschäftigung, Bildung, Kreditwürdigkeit, öffentlichen Leistungen oder kritischer Infrastruktur beeinflussen, fallen unter Anhang III. Das bedeutet Risikomanagement, Datenqualität, technische Dokumentation, Protokollierung, menschliche Aufsicht und Konformitätsbewertung.",
      items: ["Risikomanagementsystem über den gesamten Lebenszyklus", "Anforderungen an Trainings- und Betriebsdaten, Dokumentation und Protokollierung", "Wirksame menschliche Aufsicht nach Artikel 14, nicht nur formal", "Rolle klären: Anbieter oder Betreiber, daraus folgen unterschiedliche Pflichten", "Übergangsfristen und aktuelle Anpassungen der Verordnung prüfen"]
    },
    limited: {
      label: "Begrenztes Risiko", title: "Transparenz ist Pflicht, der Rest ist gute Praxis.",
      body: "Systeme, mit denen Menschen interagieren oder deren Inhalte sie sehen, unterliegen den Transparenzpflichten aus Artikel 50. Personen müssen erkennen können, dass sie es mit KI zu tun haben. Generierte Inhalte müssen als solche erkennbar sein.",
      items: ["Kennzeichnung der KI-Interaktion und generierter Inhalte", "Datenschutz-Folgenabschätzung prüfen, sobald personenbezogene Daten fließen", "Eskalation zu einem Menschen vorsehen und testen", "KI-Kompetenz der Mitarbeitenden sicherstellen (Artikel 4)"]
    },
    minimal: {
      label: "Minimales Risiko", title: "Keine besonderen Pflichten aus der KI-Verordnung.",
      body: "Interne Assistenzsysteme ohne direkte Wirkung auf Personen fallen in die Klasse ohne spezifische Pflichten. Was bleibt: KI-Kompetenz der Mitarbeitenden, Datenschutz und die Frage, ob der Prozess den Einsatz überhaupt rechtfertigt.",
      items: ["KI-Kompetenz der Nutzenden sicherstellen (Artikel 4)", "Keine personenbezogenen Daten ohne Rechtsgrundlage in externe Modelle", "Interne Leitplanken: was darf hinein, was nicht", "Kontrollpunkt: wer prüft Ergebnisse, bevor sie weiterverwendet werden"]
    }
  };

  function initAiAct() {
    const form = $("[data-aiact]");
    const out = $("[data-aiact-result]");
    if (!form || !out) return;

    const check = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>`;

    function render() {
      const fd = new FormData(form);
      const use = fd.get("use"), impact = fd.get("impact"), control = fd.get("control");
      if (!use || !impact || !control) return;

      let cls = "minimal";
      if (use === "prohibited") cls = "prohibited";
      else if (use === "decision" || impact === "legal") cls = "high";
      else if (use === "customer" || impact === "interact") cls = "limited";

      const d = AIACT[cls];
      const items = [...d.items];
      if (cls !== "prohibited") {
        if (control === "auto" && cls !== "minimal") items.push("Weitgehend automatischer Betrieb erhöht die Anforderungen an Aufsicht und Protokollierung deutlich. Kontrollpunkte einplanen.");
        if (control === "every") items.push("Prüfung jedes Ergebnisses ist ein starker Kontrollpunkt. Dokumentieren Sie, wie sie tatsächlich stattfindet und wer sie trägt.");
        if (control === "sample") items.push("Stichproben brauchen eine Regel: wie viele, wer, was passiert bei Abweichung.");
      }

      out.dataset.class = cls;
      out.innerHTML = `
        <span class="class-label"><i></i>${esc(d.label)}</span>
        <h3>${esc(d.title)}</h3>
        <p>${esc(d.body)}</p>
        <ul>${items.map((t) => `<li>${check}<span>${esc(t)}</span></li>`).join("")}</ul>
        <p class="disclaimer">Indikative Einordnung auf Basis von drei Angaben, keine Rechtsberatung. Die tatsächliche Klasse hängt vom konkreten Einsatz, den Betroffenen und der Rolle als Anbieter oder Betreiber ab.</p>
        <button class="btn ${cls === "prohibited" ? "" : "primary"} sm" type="button" data-open-contact data-contact-topic="AI Act Risiko-Sprint">Einordnung im Risiko-Sprint prüfen</button>`;
      track("aiact-result", { cls });
    }
    form.addEventListener("change", render);
  }

  /* ------------------------------------------------------------------------
     ROI-Orientierung
     ------------------------------------------------------------------------ */
  function initRoi() {
    const form = $("[data-roi]");
    if (!form) return;
    const get = (n) => Number(form.elements[n].value);
    const outs = Object.fromEntries($$("[data-out]", form).map((o) => [o.dataset.out, o]));
    const mid = $("[data-roi-mid]"), lo = $("[data-roi-lo]"), hi = $("[data-roi-hi]");
    const band = $("[data-roi-band]"), payback = $("[data-roi-payback]"), hours = $("[data-roi-hours]");
    const WEEKS = 46;

    const paintRange = (input) => {
      const pct = ((input.value - input.min) / (input.max - input.min)) * 100;
      input.style.setProperty("--pct", `${pct}%`);
    };

    function calc() {
      const people = get("people"), h = get("hours"), rate = get("rate"), invest = get("invest");
      outs.people.textContent = people;
      outs.hours.textContent = `${h.toLocaleString("de-DE")} h`;
      outs.rate.textContent = `${rate} €`;
      outs.invest.textContent = fmtEUR(invest);

      const base = people * h * WEEKS * rate;
      const vLo = base * 0.15, vMid = base * 0.25, vHi = base * 0.4;
      mid.textContent = Math.round(vMid).toLocaleString("de-DE");
      lo.textContent = fmtEUR(vLo) + " vorsichtig";
      hi.textContent = fmtEUR(vHi) + " ambitioniert";
      const scaleMax = Math.max(vHi * 1.15, invest * 1.2, 1);
      band.style.setProperty("--lo", `${(vLo / scaleMax) * 100}%`);
      band.style.setProperty("--hi", `${(vHi / scaleMax) * 100}%`);
      const months = vMid > 0 ? invest / (vMid / 12) : 0;
      payback.textContent = months > 60 ? "> 60" : months < 1 ? "< 1" : months.toLocaleString("de-DE", { maximumFractionDigits: 1 });
      hours.textContent = Math.round(people * h * WEEKS * 0.25).toLocaleString("de-DE");
      $$("input[type=range]", form).forEach(paintRange);
    }
    form.addEventListener("input", calc);
    calc();
  }

  /* ------------------------------------------------------------------------
     Kontakt: Modal mit drei Schritten
     ------------------------------------------------------------------------ */
  const SERVICES = [
    ["13%-Check", "KI-Vorhaben prüfen, bevor Budget freigegeben wird"],
    ["AI Act Risiko-Sprint", "Compliance-Status klären, Risiken dokumentieren"],
    ["n8n Workflow-Prototyp", "Einen Prozess als echten Workflow testen"],
    ["Executive KI-Schulung", "Geschäftsführung, Fachbereiche oder Verwaltung befähigen"]
  ];

  function mountContactModal() {
    if ($("[data-contact-modal]")) return;
    const wrap = document.createElement("div");
    wrap.className = "modal-backdrop";
    wrap.setAttribute("data-contact-modal", "");
    wrap.setAttribute("aria-hidden", "true");
    wrap.innerHTML = `
      <section class="modal" role="dialog" aria-modal="true" aria-labelledby="contact-title">
        <div class="modal-head">
          <div class="wiz-steps" aria-label="Fortschritt">
            <span class="wiz-step active" data-step="1">1</span><span class="wiz-divider"></span>
            <span class="wiz-step" data-step="2">2</span><span class="wiz-divider"></span>
            <span class="wiz-step" data-step="3">3</span>
          </div>
          <button class="icon-button" type="button" data-close-contact aria-label="Dialog schließen">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
          </button>
        </div>

        <div data-wizard-step="1">
          <p class="eyebrow plain">Schritt 1 von 3</p>
          <h2 id="contact-title" style="margin-top:10px">Womit sollen wir starten?</h2>
          <div class="service-choices">
            ${SERVICES.map(([t, d]) => `<button class="service-choice" type="button" data-choice="${esc(t)}"><strong>${esc(t)}</strong><span>${esc(d)}</span></button>`).join("")}
          </div>
          <p class="form-status">Unsicher? Wählen Sie den 13%-Check. Im Gespräch sortieren wir das.</p>
        </div>

        <div data-wizard-step="2" hidden>
          <p class="eyebrow plain">Schritt 2 von 3</p>
          <h2 style="margin-top:10px">Drei kurze Fragen.</h2>
          <div class="wiz-questions">
            <fieldset class="wiz-fieldset"><legend>Organisation</legend>
              <div class="seg">
                <label><input type="radio" name="wiz-org" value="Unternehmen / Mittelstand"><i></i><span>Unternehmen / Mittelstand</span></label>
                <label><input type="radio" name="wiz-org" value="Verwaltung / öffentliche Stelle"><i></i><span>Verwaltung / öffentlicher Sektor</span></label>
                <label><input type="radio" name="wiz-org" value="Beratung / Agentur"><i></i><span>Beratung / Agentur</span></label>
              </div>
            </fieldset>
            <fieldset class="wiz-fieldset"><legend>Aktueller KI-Status</legend>
              <div class="seg">
                <label><input type="radio" name="wiz-status" value="Erste Ideen"><i></i><span>Erste Ideen, noch kein konkreter Plan</span></label>
                <label><input type="radio" name="wiz-status" value="Pilot läuft oder geplant"><i></i><span>Pilot läuft oder ist konkret geplant</span></label>
                <label><input type="radio" name="wiz-status" value="Tools im Einsatz, Governance offen"><i></i><span>Tools im Einsatz, Governance noch offen</span></label>
              </div>
            </fieldset>
            <fieldset class="wiz-fieldset"><legend>Größtes Risiko</legend>
              <div class="seg">
                <label><input type="radio" name="wiz-risk" value="Budget ohne Wirkung"><i></i><span>Budget ohne nachweisbare Wirkung</span></label>
                <label><input type="radio" name="wiz-risk" value="Datenschutz / AI Act"><i></i><span>Datenschutz oder AI Act</span></label>
                <label><input type="radio" name="wiz-risk" value="Akzeptanz im Team"><i></i><span>Akzeptanz im Team</span></label>
                <label><input type="radio" name="wiz-risk" value="Technische Umsetzung"><i></i><span>Technische Umsetzung</span></label>
              </div>
            </fieldset>
          </div>
          <div class="wiz-nav">
            <button class="btn" type="button" data-wizard-back>Zurück</button>
            <button class="btn primary" type="button" data-wizard-next>Weiter</button>
          </div>
        </div>

        <div data-wizard-step="3" hidden>
          <p class="eyebrow plain">Schritt 3 von 3</p>
          <h2 style="margin-top:10px">Wie erreiche ich Sie?</h2>
          <form data-contact-form novalidate>
            <input type="hidden" name="topic">
            <input type="hidden" name="companyType">
            <input type="hidden" name="aiStatus">
            <input type="hidden" name="biggestRisk">
            <input type="text" name="website" tabindex="-1" autocomplete="off" class="visually-hidden" aria-hidden="true">
            <div class="grid-2" style="gap:0 14px">
              <div class="field"><label for="c-name">Name</label><input id="c-name" name="name" autocomplete="name" required></div>
              <div class="field"><label for="c-org">Organisation</label><input id="c-org" name="org" autocomplete="organization"></div>
            </div>
            <div class="grid-2" style="gap:0 14px">
              <div class="field"><label for="c-email">E-Mail</label><input id="c-email" name="email" type="email" autocomplete="email" required aria-describedby="c-status"></div>
              <div class="field"><label for="c-phone">Telefon (optional)</label><input id="c-phone" name="phone" type="tel" autocomplete="tel"></div>
            </div>
            <div class="field"><label for="c-appointment">Wunschtermin (optional)</label><input id="c-appointment" name="appointment" placeholder="z. B. Dienstagvormittag oder kommende Woche"></div>
            <div class="field"><label for="c-message">Worum geht es?</label><textarea id="c-message" name="message" rows="4"></textarea></div>
            <div class="wiz-nav">
              <button class="btn" type="button" data-wizard-back>Zurück</button>
              <button class="btn primary" type="submit">Anfrage senden</button>
            </div>
            <p id="c-status" class="form-status" data-form-status>Alternativ direkt: <a href="mailto:${CONTACT_MAIL}">${CONTACT_MAIL}</a> · ${CONTACT_PHONE}</p>
          </form>
        </div>
      </section>`;
    document.body.appendChild(wrap);
  }

  function initContact() {
    mountContactModal();
    const backdrop = $("[data-contact-modal]");
    let step = 1, selected = null, opener = null, fromCheck = false;

    const showStep = (n) => {
      step = n;
      $$("[data-wizard-step]", backdrop).forEach((p) => { p.hidden = Number(p.dataset.wizardStep) !== n; });
      $$("[data-step]", backdrop).forEach((s) => s.classList.toggle("active", Number(s.dataset.step) <= n));
    };

    const setOpen = (open) => {
      backdrop.classList.toggle("open", open);
      backdrop.setAttribute("aria-hidden", String(!open));
      document.body.classList.toggle("modal-open", open);
      if (open) {
        showStep(1);
        setTimeout(() => ($(`[data-choice="${selected}"]`, backdrop) || $(".service-choice", backdrop))?.focus(), 60);
      } else if (opener) {
        opener.focus();
      }
    };

    const markChoice = () => $$("[data-choice]", backdrop).forEach((b) => b.classList.toggle("selected", b.dataset.choice === selected));

    $$("[data-choice]", backdrop).forEach((b) => b.addEventListener("click", () => {
      selected = b.dataset.choice;
      markChoice();
      showStep(2);
      $("input[name='wiz-org']", backdrop)?.focus();
    }));

    $("[data-wizard-next]", backdrop).addEventListener("click", () => {
      const form = $("[data-contact-form]", backdrop);
      const val = (n) => $(`input[name='${n}']:checked`, backdrop)?.value || "Nicht angegeben";
      form.topic.value = selected || "13%-Check";
      form.companyType.value = val("wiz-org");
      form.aiStatus.value = val("wiz-status");
      form.biggestRisk.value = val("wiz-risk");
      if (!form.message.value.trim()) {
        form.message.value = fromCheck && lastCheckSummary
          ? `Ergebnis meines Schnellchecks:\n${lastCheckSummary}\n\nWorum es geht: `
          : `Gewünschter Einstieg: ${selected || "13%-Check"}.\nWorum es geht: `;
      }
      showStep(3);
      $("#c-name", backdrop).focus();
    });

    $$("[data-wizard-back]", backdrop).forEach((b) => b.addEventListener("click", () => step > 1 && showStep(step - 1)));
    $$("[data-close-contact]", backdrop).forEach((b) => b.addEventListener("click", () => setOpen(false)));
    backdrop.addEventListener("click", (e) => { if (e.target === backdrop) setOpen(false); });
    window.addEventListener("keydown", (e) => { if (e.key === "Escape" && backdrop.classList.contains("open")) setOpen(false); });

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-open-contact]");
      if (!btn) return;
      opener = btn;
      selected = btn.dataset.contactTopic || null;
      fromCheck = btn.dataset.contactFrom === "check";
      markChoice();
      const form = $("[data-contact-form]", backdrop);
      form.message.value = "";
      setOpen(true);
      track("contact-open", { topic: selected || "none", from: fromCheck ? "check" : "button" });
    });

    const form = $("[data-contact-form]", backdrop);
    const status = $("[data-form-status]", backdrop);
    [form.name, form.email].forEach((f) => f.addEventListener("input", () => {
      f.removeAttribute("aria-invalid");
      if (status.classList.contains("err")) { status.textContent = ""; status.className = "form-status"; }
    }));
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (form.website.value) return;
      const email = form.email;
      const name = form.name;
      if (!name.value.trim()) { name.setAttribute("aria-invalid", "true"); name.focus(); status.textContent = "Bitte Ihren Namen angeben."; status.className = "form-status err"; return; }
      name.removeAttribute("aria-invalid");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) { email.setAttribute("aria-invalid", "true"); email.focus(); status.textContent = "Bitte eine gültige E-Mail-Adresse angeben."; status.className = "form-status err"; return; }
      email.removeAttribute("aria-invalid");

      status.textContent = "Anfrage wird gesendet …";
      status.className = "form-status";
      const d = Object.fromEntries(new FormData(form).entries());
      const message = `NEUE ERSTGESPRÄCHS-ANFRAGE (ki13prozent.de)

Name: ${d.name || "Nicht angegeben"}
Organisation: ${d.org || "Nicht angegeben"}
E-Mail: ${d.email}
Telefon: ${d.phone || "Nicht angegeben"}
Wunschtermin: ${d.appointment || "Nicht angegeben"}

Gewünschter Einstieg: ${d.topic || "13%-Check"}
Organisationstyp: ${d.companyType || "Nicht angegeben"}
KI-Status: ${d.aiStatus || "Nicht angegeben"}
Größtes Risiko: ${d.biggestRisk || "Nicht angegeben"}

Nachricht:
${d.message || "Keine Nachricht"}

Quelle: Website v3
Seite: ${location.href}
Zeitstempel: ${new Date().toLocaleString("de-DE")}`;

      try {
        await postWebhook(d.name || "Website Anfrage", message);
        status.innerHTML = `Danke, ${esc(d.name.split(" ")[0])}. Die Anfrage ist angekommen. Sie hören in der Regel innerhalb eines Werktags von mir.`;
        status.className = "form-status ok";
        form.reset();
        track("contact-submit", { topic: d.topic });
      } catch {
        status.innerHTML = `Senden fehlgeschlagen. Bitte direkt an <a href="mailto:${CONTACT_MAIL}">${CONTACT_MAIL}</a> schreiben.`;
        status.className = "form-status err";
      }
    });
  }

  /* ------------------------------------------------------------------------
     Vorgehen: Priorisierung mit Reglern (roadmap.html)
     ------------------------------------------------------------------------ */
  function initPriority() {
    const root = $("[data-priority]");
    if (!root) return;
    const impact = $("#p-impact", root), data = $("#p-data", root), risk = $("#p-risk", root);
    const out = $("[data-priority-out]", root);
    const rows = $$("[data-score-row]", root);
    const names = { assessment: "Analyse", strategy: "Strategie", implementation: "Umsetzung", innovation: "Skalierung" };
    const why = {
      assessment: "Unklare Datenlage oder hohes Risiko sprechen dafür, zuerst Bestand aufzunehmen.",
      strategy: "Hoher Nutzen bei offenem Risiko: erst klären, wohin, dann bauen.",
      implementation: "Nutzen hoch, Daten brauchbar, Risiko beherrschbar: ein Prototyp beantwortet mehr als ein Workshop.",
      innovation: "Gute Daten und hoher Nutzen: skalieren, was schon läuft, und daraus lernen."
    };
    const labels = { impact: ["niedrig", "mittel", "hoch"], data: ["schwach", "mittel", "gut"], risk: ["niedrig", "mittel", "hoch"] };
    const lbl = (v, k) => labels[k][v < 34 ? 0 : v < 67 ? 1 : 2];

    function update() {
      const i = Number(impact.value), d = Number(data.value), r = Number(risk.value);
      const scores = {
        assessment: Math.max(12, 100 - d + r * 0.8),
        strategy: Math.max(18, i * 0.75 + r * 0.45),
        implementation: Math.max(14, i * 0.9 + d * 0.7 - r * 0.35),
        innovation: Math.max(10, i * 0.55 + d * 0.45)
      };
      const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
      rows.forEach((row) => {
        const k = row.dataset.scoreRow;
        const s = Math.max(8, Math.min(100, Math.round(scores[k])));
        row.style.setProperty("--score", `${s}%`);
        $("[data-score-value]", row).textContent = s;
        row.classList.toggle("winner", k === winner);
      });
      out.innerHTML = `Empfohlener Einstieg: <b>${names[winner]}</b>. ${why[winner]}`;
      $("[data-out='impact']", root).textContent = lbl(i, "impact");
      $("[data-out='data']", root).textContent = lbl(d, "data");
      $("[data-out='risk']", root).textContent = lbl(r, "risk");
      [impact, data, risk].forEach((inp) => inp.style.setProperty("--pct", `${inp.value}%`));
    }
    [impact, data, risk].forEach((inp) => inp.addEventListener("input", update));
    update();
  }

  /* ------------------------------------------------------------------------
     Chat-Assistent: läuft lokal im Browser (Chrome Prompt API), sonst FAQ
     ------------------------------------------------------------------------ */
  function initChat() {
    if (document.body.dataset.noChat !== undefined) return;

    const NAV = [
      { kw: ["vorgehen", "roadmap", "phasen", "phase"], page: "roadmap.html", label: "Vorgehen ansehen" },
      { kw: ["ai act", "ki-verordnung", "compliance", "risikoklasse", "governance"], page: "eu-ai-act-beratung.html", label: "EU AI Act Beratung" },
      { kw: ["n8n", "automatisierung", "workflow", "prototyp"], page: "n8n-automatisierung.html", label: "n8n Automatisierung" },
      { kw: ["verwaltung", "schulung", "behörde", "öffentlich"], page: "ki-schulung-verwaltung.html", label: "KI-Schulung Verwaltung" },
      { kw: ["mittelstand", "strategie"], page: "ki-strategie-mittelstand.html", label: "KI-Strategie Mittelstand" },
      { kw: ["leistungen", "services", "pakete", "angebot"], page: "services.html", label: "Alle Leistungen" },
      { kw: ["profil", "wer ist robert", "erfahrung", "werdegang", "über robert"], page: "about.html", label: "Profil ansehen" },
      { kw: ["ökosystem", "tools", "bücher", "anonymisierer"], page: "oekosystem.html", label: "Ökosystem" }
    ];

    const SYSTEM = `Du bist der KI-Assistent von Robert Meyer, KI-Berater (ki13prozent.de). Antworte ausschließlich zu seiner Arbeit und zum Inhalt der aktuellen Seite. Niemals zu anderen Themen.

DER 13%-ANSATZ: Nur etwa 13 % der KI-Projekte erreichen den Regelbetrieb, 87 % scheitern oder versanden. Der 13%-Check prüft in 30 Tagen, ob ein Vorhaben dazugehört: Use Case, Datenlage, AI-Act-Risiko, Prozesswirkung, Umsetzungspfad. Ergebnis ist ein Entscheidungsbrief.

LEISTUNGEN: 13%-Check (30 Tage), AI Act Risiko-Sprint (1-3 Wochen), n8n Workflow-Prototyp (2-6 Wochen), Executive KI-Schulung (1-2 Tage). Arbeitsprinzip: Code statt PowerPoints.

INHALT DER AKTUELLEN SEITE ({{PAGE}}):
{{CONTENT}}

KONTAKT (exakt, nichts erfinden): E-Mail ${CONTACT_MAIL}, LinkedIn linkedin.com/in/robert-meyer-666b39315. Erstgespräch: 30 Minuten, kostenlos, über das Formular auf der Seite.

PREISE: Nenne keine Preise. Kosten werden im Erstgespräch nach Umfang besprochen.

Regeln: Deutsch, maximal drei Sätze, nüchtern, kein Markdown, keine Aufzählungszeichen, keine Superlative. Eine Rückfrage am Ende.`;

    const FAQ = [
      ["Was bedeutet 13 %?", "Nur etwa 13 % der KI-Projekte erreichen den Regelbetrieb. Der 13%-Check prüft in 30 Tagen, ob Ihr Vorhaben dazugehört, bevor Budget fließt.\n\nGeht es bei Ihnen eher um Orientierung, Umsetzung oder Compliance?"],
      ["Welche Leistungen gibt es?", "Vier Einstiege: 13%-Check (30 Tage), AI Act Risiko-Sprint, n8n Workflow-Prototyp und Executive KI-Schulung. Meist beginnt es mit dem Check.\n\nWelche Frage steht bei Ihnen im Vordergrund?"],
      ["Wie läuft ein Erstgespräch?", "30 Minuten, kostenlos, kein Verkaufsgespräch. Wir klären, ob und welcher Einstieg passt. Wenn keiner passt, sagt Robert das.\n\nHaben Sie ein konkretes Vorhaben im Kopf?"],
      ["Für wen ist das?", "Für Unternehmen und Verwaltungen, die KI ernsthaft prüfen wollen, bevor sie investieren. Geschäftsführung, Fachbereiche, Digitalisierungsverantwortliche.\n\nIn welchem Umfeld arbeiten Sie?"],
      ["Was kostet das?", "Das Erstgespräch ist kostenlos. Projektkosten hängen von Umfang und Einstieg ab und werden dort konkret besprochen.\n\nSoll ich ein Erstgespräch vorbereiten?"]
    ];

    const w = document.createElement("div");
    w.className = "chat-widget";
    w.innerHTML = `
      <div class="chat-panel" role="dialog" aria-label="KI-Assistent von Robert Meyer">
        <div class="chat-header">
          <div class="chat-avatar" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><g fill="#6b737b"><circle cx="4" cy="4" r="1.7"/><circle cx="9.33" cy="4" r="1.7"/><circle cx="14.67" cy="4" r="1.7"/><circle cx="4" cy="9.33" r="1.7"/><circle cx="9.33" cy="9.33" r="1.7"/><circle cx="14.67" cy="9.33" r="1.7"/><circle cx="20" cy="9.33" r="1.7"/><circle cx="4" cy="14.67" r="1.7"/><circle cx="14.67" cy="14.67" r="1.7"/><circle cx="20" cy="14.67" r="1.7"/><circle cx="4" cy="20" r="1.7"/><circle cx="9.33" cy="20" r="1.7"/><circle cx="14.67" cy="20" r="1.7"/><circle cx="20" cy="20" r="1.7"/></g><g fill="#e39a1c"><circle cx="20" cy="4" r="1.7"/><circle cx="9.33" cy="14.67" r="1.7"/></g></svg></div>
          <div><strong>KI-Assistent</strong><span>Fragen zum Vorgehen</span></div>
          <span class="chat-local off" data-chat-local><i></i>prüfe …</span>
        </div>
        <div class="chat-progress" data-chat-pb hidden><span></span></div>
        <div class="chat-messages" data-chat-msgs role="log" aria-live="polite"></div>
        <div class="chat-chips" data-chat-chips></div>
        <div class="chat-input-row">
          <textarea class="chat-input" data-chat-input placeholder="Ihre Frage …" rows="1" aria-label="Nachricht eingeben" disabled></textarea>
          <button class="chat-send" data-chat-send aria-label="Senden" disabled><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></button>
        </div>
        <p class="chat-disclosure" data-chat-disclosure>Antworten werden lokal in Ihrem Browser erzeugt. Nichts wird an einen Server gesendet. Fehler möglich, Verbindliches klären wir persönlich.</p>
      </div>
      <button class="chat-trigger" data-chat-trigger aria-label="KI-Assistent öffnen" aria-expanded="false">
        <span class="chat-tip" aria-hidden="true">KI-Assistent – Gemini Nano – läuft lokal in Chrome</span>
        <span class="pulse" aria-hidden="true"></span>
        <svg class="icon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
      </button>`;
    document.body.appendChild(w);

    const trigger = $("[data-chat-trigger]", w), msgs = $("[data-chat-msgs]", w), chips = $("[data-chat-chips]", w);
    const input = $("[data-chat-input]", w), send = $("[data-chat-send]", w), pb = $("[data-chat-pb]", w), local = $("[data-chat-local]", w);
    const disclosure = $("[data-chat-disclosure]", w);

    let session = null, ready = false, fallback = false, booted = false, count = 0;
    let contactState = null; const contact = {};

    const add = (text, type) => {
      const el = document.createElement("div");
      el.className = `chat-bubble ${type}`;
      el.textContent = text;
      msgs.appendChild(el);
      msgs.scrollTop = msgs.scrollHeight;
      return el;
    };
    const typing = () => {
      const el = document.createElement("div");
      el.className = "chat-typing"; el.innerHTML = "<span></span><span></span><span></span>";
      msgs.appendChild(el); msgs.scrollTop = msgs.scrollHeight; return el;
    };
    const setChips = (arr, handler) => {
      chips.innerHTML = "";
      arr.forEach((label) => {
        const b = document.createElement("button");
        b.className = "chat-chip"; b.type = "button"; b.textContent = label;
        b.addEventListener("click", () => { chips.innerHTML = ""; handler(label); });
        chips.appendChild(b);
      });
      // Die Chip-Zeile verkleinert den Nachrichtenbereich, deshalb erneut ans Ende scrollen
      msgs.scrollTop = msgs.scrollHeight;
    };
    const enable = (on) => { input.disabled = !on; send.disabled = !on || !input.value.trim(); };
    const setLocal = (state, text) => { local.className = `chat-local ${state === "on" ? "" : "off"}`; local.innerHTML = `<i></i>${text}`; };

    const pageText = () => {
      const main = $("main"); if (!main) return "";
      const c = main.cloneNode(true);
      $$("script, style, svg, form, .chat-widget, .modal-backdrop", c).forEach((el) => el.remove());
      return c.textContent.replace(/\s+/g, " ").trim().slice(0, 3500);
    };

    const navHint = (text) => {
      const l = text.toLowerCase(), cur = pageName();
      const m = NAV.find((n) => n.page !== cur && n.kw.some((k) => l.includes(k)));
      if (!m) return;
      const b = document.createElement("button");
      b.className = "chat-chip"; b.type = "button"; b.textContent = `→ ${m.label}`;
      b.addEventListener("click", () => { location.href = m.page; });
      chips.appendChild(b);
      msgs.scrollTop = msgs.scrollHeight;
    };

    const offerContact = () => setChips(["Erstgespräch anfragen", "Weitere Frage"], (l) => {
      if (l === "Erstgespräch anfragen") startContact(); else { enable(true); input.focus(); }
    });

    function startContact() {
      chips.innerHTML = "";
      contactState = "name";
      add("Gern. Drei Angaben genügen. Wie heißen Sie?", "bot");
      input.placeholder = "Ihr Name";
      enable(true); input.focus();
    }

    async function handleContact(text) {
      add(text, "user"); enable(false);
      if (contactState === "name") {
        contact.name = text; contactState = "email";
        add("Danke. Ihre E-Mail-Adresse?", "bot"); input.placeholder = "name@firma.de"; enable(true);
      } else if (contactState === "email") {
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(text)) { add("Das sieht nicht wie eine E-Mail-Adresse aus. Noch einmal?", "bot"); enable(true); return; }
        contact.email = text; contactState = "date";
        add("Haben Sie einen Wunschtermin? Sonst einfach „kein“ schreiben.", "bot"); input.placeholder = "z. B. kommende Woche"; enable(true);
      } else if (contactState === "date") {
        contact.date = text; contactState = null; input.placeholder = "Ihre Frage …";
        const t = typing();
        try {
          await postWebhook(contact.name, `ANFRAGE via Chat-Assistent (ki13prozent.de)\n\nName: ${contact.name}\nE-Mail: ${contact.email}\nWunschtermin: ${contact.date}\nSeite: ${location.href}\nZeit: ${new Date().toLocaleString("de-DE")}`);
          t.remove();
          add(`Angekommen, ${contact.name.split(" ")[0]}. Robert meldet sich in der Regel innerhalb eines Werktags.`, "bot");
          track("chat-contact-submit");
        } catch {
          t.remove();
          add(`Senden fehlgeschlagen. Bitte direkt an ${CONTACT_MAIL} schreiben.`, "bot");
        }
        enable(true);
      }
    }

    async function ask(text) {
      if (!text.trim()) return;
      chips.innerHTML = "";
      add(text, "user");
      enable(false); input.value = ""; input.style.height = "auto";
      count++;
      const t = typing();
      try {
        const res = await session.prompt(text);
        t.remove();
        add(res?.trim() || "Keine Antwort. Bitte noch einmal versuchen.", "bot");
      } catch {
        t.remove();
        add("Da ist etwas schiefgelaufen. Bitte noch einmal versuchen.", "bot");
      }
      enable(true); input.focus();
      navHint(text);
      if (count === 3) setTimeout(offerContact, 300);
    }

    const FAQ_KEYWORDS = [
      ["13", "prozent", "scheitern", "zahl", "statistik"],
      ["leistung", "angebot", "service", "einstieg", "check", "sprint", "prototyp", "schulung", "workshop", "n8n", "ai act", "risiko"],
      ["erstgespräch", "gespräch", "termin", "ablauf", "kontakt", "anrufen", "telefon", "mail"],
      ["für wen", "zielgruppe", "verwaltung", "mittelstand", "unternehmen", "behörde", "geschäftsführ"],
      ["kost", "preis", "honorar", "budget", "tagessatz", "euro", "teuer", "günstig"]
    ];
    const fallbackAnswer = (text) => {
      const l = text.toLowerCase();
      let best = -1, bestHits = 0;
      FAQ_KEYWORDS.forEach((kws, i) => {
        // Preisfragen haben Vorrang, damit die Antwort zur Kostenfrage nicht von Leistungsbegriffen überdeckt wird
        const hits = kws.filter((k) => l.includes(k)).reduce((a, k) => a + k.length, 0) * (i === 4 ? 3 : 1);
        if (hits > bestHits) { bestHits = hits; best = i; }
      });
      return best >= 0 ? FAQ[best][1] : null;
    };

    let fallbackAsk = null;
    function runFallback(reason) {
      fallback = true;
      setLocal("off", "FAQ-Modus");
      disclosure.textContent = "Ihr Browser unterstützt keine lokale KI. Ich antworte aus den häufigsten Fragen, ohne dass Daten übertragen werden.";
      add(reason, "system");
      add("Guten Tag. Wählen Sie eine der häufigen Fragen oder schreiben Sie kurz, worum es geht.", "bot");
      const show = () => setChips(FAQ.map((f) => f[0]).concat(["Erstgespräch anfragen"]), (label) => {
        if (label === "Erstgespräch anfragen") { startContact(); return; }
        const f = FAQ.find((x) => x[0] === label);
        add(label, "user"); add(f[1], "bot"); count++;
        setTimeout(() => (count >= 2 ? offerContact() : show()), 400);
      });
      show();
      enable(true);
      fallbackAsk = (text) => {
        chips.innerHTML = "";
        add(text, "user"); count++;
        const a = fallbackAnswer(text);
        if (a) {
          add(a, "bot");
          navHint(text);
          setTimeout(() => (count >= 2 ? offerContact() : show()), 400);
        } else {
          add("Dazu habe ich hier keine vorbereitete Antwort. Am schnellsten klärt das ein kurzes Erstgespräch mit Robert, oder Sie wählen eine der häufigen Fragen.", "bot");
          navHint(text);
          setTimeout(show, 400);
        }
        enable(true); input.focus();
      };
    }

    async function boot() {
      const LM = window.LanguageModel || window.ai?.languageModel;
      if (!LM) { runFallback("Die lokale KI (Chrome Prompt API) steht in diesem Browser nicht zur Verfügung."); return; }
      let avail = "unavailable";
      try { avail = typeof LM.availability === "function" ? await LM.availability() : "unavailable"; } catch { /* keep */ }
      if (avail === "unavailable" || avail === "no") { runFallback("Die lokale KI ist in diesem Browser nicht aktiviert."); return; }

      const loading = add(avail === "available" || avail === "readily" ? "Lokales Modell wird geladen …" : "Lokales Modell wird einmalig heruntergeladen. Das kann einen Moment dauern.", "system");
      if (avail !== "available" && avail !== "readily") pb.hidden = false;
      try {
        session = await LM.create({
          initialPrompts: [{ role: "system", content: SYSTEM.replace("{{PAGE}}", `${document.title} (${pageName()})`).replace("{{CONTENT}}", pageText()) }],
          monitor(m) { m.addEventListener("downloadprogress", (e) => { const s = $("span", pb); if (s && e.total) s.style.width = `${Math.round((e.loaded / e.total) * 100)}%`; else if (s) s.style.width = `${Math.round(e.loaded * 100)}%`; }); }
        });
        pb.hidden = true; loading.remove();
        ready = true; setLocal("on", "läuft lokal");
        enable(true);
        add("Guten Tag. Ich beantworte Fragen zu Robert Meyers Arbeit, zum 13%-Check und zum Vorgehen. Was beschäftigt Sie?", "bot");
        setChips(["Was bedeutet 13 %?", "Welcher Einstieg passt zu uns?", "Erstgespräch anfragen"], (l) => (l === "Erstgespräch anfragen" ? startContact() : ask(l)));
      } catch {
        loading.remove(); pb.hidden = true;
        runFallback("Das lokale Modell konnte nicht gestartet werden.");
      }
    }

    trigger.addEventListener("click", () => {
      const open = w.classList.toggle("open");
      trigger.setAttribute("aria-expanded", String(open));
      trigger.setAttribute("aria-label", open ? "KI-Assistent schließen" : "KI-Assistent öffnen");
      if (open && !booted) { booted = true; boot(); }
      if (open && ready) setTimeout(() => input.focus(), 200);
      track("chat-toggle", { open });
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && w.classList.contains("open")) { w.classList.remove("open"); trigger.setAttribute("aria-expanded", "false"); trigger.focus(); }
    });

    const submit = () => {
      const text = input.value.trim();
      if (!text || input.disabled) return;
      input.value = ""; input.style.height = "auto";
      if (contactState) { handleContact(text); return; }
      if (fallback) { if (fallbackAsk) fallbackAsk(text); return; }
      if (!ready) return;
      ask(text);
    };
    input.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } });
    input.addEventListener("input", () => { send.disabled = !input.value.trim() || input.disabled; input.style.height = "auto"; input.style.height = `${Math.min(90, input.scrollHeight)}px`; });
    send.addEventListener("click", submit);
  }

  /* ------------------------------------------------------------------------
     Datenschutzhinweis: einmal bestätigen, Bestätigung lokal im Browser
     ------------------------------------------------------------------------ */
  function initCookieNotice() {
    const KEY = "ki13-privacy-ok";
    if (pageName() !== "index.html") return;
    try { if (localStorage.getItem(KEY)) return; } catch { /* Speicher blockiert: Hinweis zeigen */ }
    const n = document.createElement("aside");
    n.className = "cookie";
    n.setAttribute("role", "region");
    n.setAttribute("aria-label", "Datenschutzhinweis");
    n.innerHTML = `
      <strong>Datenschutzhinweis</strong>
      <p>Ohne Cookies. Analyse mit Umami, ohne personenbezogene Daten. <a href="/datenschutz.html">Mehr erfahren</a></p>
      <button class="btn primary sm" type="button" data-cookie-ok>Verstanden</button>`;
    document.body.appendChild(n);
    $("[data-cookie-ok]", n).addEventListener("click", () => {
      try { localStorage.setItem(KEY, "1"); } catch { /* ignore */ }
      n.remove();
      track("privacy-notice-ok");
    });
  }

  /* ------------------------------------------------------------------------
     Start
     ------------------------------------------------------------------------ */
  initHeader();
  initReveal();
  initDots();
  initMiniDots();
  initCheck();
  initDays();
  initAiAct();
  initRoi();
  initContact();
  initPriority();
  initChat();
  initCookieNotice();
})();
