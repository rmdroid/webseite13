# ki13prozent.de

Website von Robert Meyer, KI-Beratung für Unternehmen und Verwaltungen. Statische Seite ohne Build-Schritt: HTML, CSS und Vanilla JavaScript, ausgelegt auf GitHub Pages.

## Struktur

| Datei | Inhalt |
| --- | --- |
| `index.html` | Startseite: Raster-Hero, Schnellcheck, Leistungen, Prinzip, 30-Tage-Ablauf, AI-Act-Einordner, Nutzen-Rechner, Liefergegenstände, Stimmen |
| `services.html` | Leistungen: 13%-Check, AI Act Risiko-Sprint, n8n Workflow-Prototyp, Executive KI-Schulung |
| `roadmap.html` | Vorgehen: vier Phasen, Governance, interaktive Einstiegs-Einordnung |
| `about.html` | Profil |
| `oekosystem.html` | Bücher, Schulungsformat, Tools |
| `blog.html` | Beiträge aus PocketBase (`https://pocket.ki-notch.de`, Collection `blog_posts`), Admin-Panel über den Punkt im Footer oder `blog.html#admin` |
| `ki-beratung.html`, `eu-ai-act-beratung.html`, `n8n-automatisierung.html`, `ki-schulung-verwaltung.html`, `ki-strategie-mittelstand.html` | SEO-Landingpages |
| `impressum.html`, `datenschutz.html` | Rechtliches (Text unverändert) |
| `404.html` | Fehlerseite (absolute Pfade, damit sie auf jeder URL funktioniert) |
| `styles.css` | Design-System |
| `app.js` | Alle Interaktionen |
| `assets/` | Schriften (selbst gehostet), Favicon, Portrait, OG-Bild |
| `sitemap.xml`, `robots.txt` | Suchmaschinen |

## Integrationen

- **Kontakt-Wizard** sendet per `POST` JSON `{ user, message }` an den n8n-Webhook (`WEBHOOK` in `app.js`).
- **Chat-Assistent** nutzt die Chrome Prompt API auf dem Gerät, wenn verfügbar; sonst eine FAQ-Antwortlogik. Es werden keine Chatdaten übertragen.
- **Analyse** über Umami (`cv.rm-on.de`), cookielos.
- **Blog** liest öffentlich aus PocketBase; Schreibzugriff nur nach Admin-Anmeldung (Token im `sessionStorage`).

## Lokal ansehen

```bash
python3 -m http.server 8080
# dann http://localhost:8080 öffnen
```

## Inhalte pflegen

- Texte direkt in den HTML-Dateien. Header und Footer sind in jeder Datei identisch enthalten; Änderungen dort bitte in allen Seiten nachziehen.
- Schnellcheck-Fragen und -Profile: `CHECK_QUESTIONS` und `CHECK_PROFILES` in `app.js`.
- Leistungen im Kontakt-Wizard: `SERVICES` in `app.js`.
- Chat-Wissen: `SYSTEM`-Prompt und FAQ-Fallback in `initChat()` in `app.js`.
- OG-Bild: `assets/og-image.png` (1200 × 630).

## Domain

Wenn die Seite unter `ki13prozent.de` live gehen soll: In den Repository-Einstellungen unter *Pages* die Custom Domain setzen (GitHub legt dann die Datei `CNAME` an) und den DNS-Eintrag vom bisherigen Repository umziehen.
