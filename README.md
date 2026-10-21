# OpravaBytov.sk 🏠
> Slovenský cenový sprievodca rekonštrukciami 2026, interaktívna kalkulačka nákladov a prémiové digitálne aktívum na predaj alebo prenájom.

[![GitHub Pages Deployment](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue?style=flat&logo=github)](https://kasperek1ppzzs-ops.github.io/opravabytov-sk/)
[![Cloudflare Ready](https://img.shields.io/badge/Cloudflare-Ready-orange?style=flat&logo=cloudflare)](https://opravabytov.sk)
[![License](https://img.shields.io/badge/License-Proprietary-gold?style=flat)](LICENSE)

---

## 🎯 Účel a stratégia projektu

Projekt **OpravaBytov.sk** je navrhnutý s dvojakým strategickým cieľom:

1. **Pre verejnosť a Google SEO:**
   * Autoritatívny informačný portál o nákladoch na rekonštrukcie bytov, kúpeľní a jadier v SR v roku 2026.
   * **Real-time cenová kalkulačka:** Okamžitý rozpad nákladov na prácu, materiál a dĺžku realizácie podľa m², dispozície a remesiel s možnosťou PDF exportu/tlače.
   * **Interaktívny Before/After posuvník:** Názorná vizuálna transformácia starého jadra na moderný interiér.
   * **Regionálny cenový radar:** Trhové ceny za m² v krajských mestách SR (Bratislava, Košice, Žilina, Poprad, Trnava, Nitra, Banská Bystrica, Prešov).
   * **6-krokový harmonogram a FAQ:** Tipy k statike, stavebnému ohláseniu a bezpečným platbám.

2. **Pre stavebné firmy a investorov (Monetizácia):**
   * Diskrétny, vysoko konverzný predajný portál (`predaj.html`).
   * **3 flexibilné modely spolupráce:**
     * **Jednorazový odkup (Predaj):** 1 490 € (trvalý prepis držiteľa v SK-NIC).
     * **Mesačný prenájom (Lease):** 50 € / mesiac (presmerovanie na firemný web alebo kontakty na portáli).
     * **Nájom s odkúpením (Rent-to-own):** 149 € / mesiac na 12 mesiacov.

---

## 🚀 Technologický stack s nulovými nákladmi (0 € Hosting)

Web je navrhnutý ako moderná, ultra-rýchla statická aplikácia bez potreby platenej databázy alebo drahého PHP webhostingu:

* **HTML5:** Čisté sémantické značkovanie optimalizované pre Google Core Web Vitals.
* **CSS3:** Moderný dizajnový systém (Deep Slate, blueprint grid, glassmorphism, responzívny layout, print štýly).
* **Vanilla JavaScript:** Bleskurýchly výpočtový algoritmus bez ťažkých knižníc.
* **Hosting:** GitHub Pages & Cloudflare Pages – **0 € mesačne doživotne**.
* **SSL / HTTPS:** Automaticky zadarmo.

---

## 🌐 Zachovanie SEO histórie (presmerovania starých adries)

Doména `opravabytov.sk` v minulosti obsahovala web stavebnej firmy. Web teraz beží na **GitHub Pages**, ktoré súbor `_redirects` ignoruje (ten funguje len na Cloudflare Pages). Hlavné staré adresy preto presmerúvajú malé HTML stránky (okamžitý `meta refresh` + `canonical`, Google ich berie ako trvalé presmerovanie):

| Pôvodná historická URL | Presmerovanie | Súbor |
|-------------------------|---------------|-------|
| `/pages/rekonstrukcie`  | `/` | `pages/rekonstrukcie.html` |
| `/pages/galeria` | `/#porovnanie` | `pages/galeria.html` |
| `/blogs/news/oplati-sa-velka-rekonstrukcia-bytu` | `/` | `blogs/news/oplati-sa-velka-rekonstrukcia-bytu.html` |

Staré adresy bez obsahovej náhrady (napr. `/pages/hodinovy-majster`) zámerne vracajú 404 – presmerovanie nesúvisiacej stránky na úvod by Google vyhodnotil ako „soft 404“. Ak sa web presunie na Cloudflare Pages, `_redirects` sa uplatní automaticky.

## ⚙️ Ako prepojiť doménu na Cloudflare Pages (Krok za krokom)

1. Vytvorte bezplatný účet na [Cloudflare.com](https://dash.cloudflare.com).
2. Zvoľte **Workers & Pages** &rarr; **Create application** &rarr; **Pages** &rarr; **Connect to Git**.
3. Vyberte repozitár `opravabytov-sk` a kliknite na **Begin setup**.
4. Build settings ponechajte predvolené (Build command prázdny, Output directory: `.`).
5. Po nasadení prejdite do záložky **Custom domains** a zadajte `opravabytov.sk`.
6. Cloudflare vám vygeneruje 2 nameservery (napr. `alice.ns.cloudflare.com`), ktoré jednoducho skopírujete do administrácie registrátora domény (Websupport / SK-NIC).

---

## 📁 Štruktúra projektu

```text
├── .github/
│   └── workflows/
│       └── deploy.yml        # Automatický GitHub Pages deployment
├── assets/
│   ├── css/
│   │   └── style.css         # Dizajnový systém, kalkulačka, print
│   └── js/
│       └── main.js           # Výpočtový engine, before/after slider, modaly
├── index.html                # Hlavný portál a interaktívny kalkulátor
├── predaj.html               # Akvizičná a prenájmová stránka pre firmy
├── 404.html                  # Vlastná chybová stránka
├── CNAME                     # Konfigurácia domény pre GitHub Pages
├── _redirects                # Pravidlá 301 presmerovaní pre Cloudflare
└── README.md                 # Dokumentácia projektu
```

---
*© 2026 OpravaBytov.sk. Všetky práva vyhradené.*
