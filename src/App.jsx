import { Fragment, useEffect, useState } from "react";
import { clubs, honors, translations } from "./translations.js";

function getInitialTheme() {
  try {
    return window.localStorage.getItem("alexis-theme") === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

function ThemeIcon({ theme }) {
  return theme === "dark" ? (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M20.2 15.4A8.5 8.5 0 0 1 8.6 3.8 8.5 8.5 0 1 0 20.2 15.4Z" />
    </svg>
  );
}

function App() {
  const [language, setLanguage] = useState("es");
  const [theme, setTheme] = useState(getInitialTheme);
  const t = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === "en"
      ? "Alexis Nicolás Castro | Football career"
      : "Alexis Nicolás Castro | Fútbol y trayectoria";
  }, [language]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      "content",
      theme === "dark" ? "#0b1c2e" : "#f5f8fb"
    );
    try {
      window.localStorage.setItem("alexis-theme", theme);
    } catch {
      // The selected theme remains available for the current page view.
    }
  }, [theme]);

  return (
    <>
      <header className="site-header">
        <a className="wordmark" href="#inicio" aria-label="Alexis Castro, inicio">
          <span className="wordmark-mark">AC</span>
          <span className="wordmark-name">ALEXIS CASTRO<span>FÚTBOL</span></span>
        </a>
        <nav className="main-nav" aria-label={language === "en" ? "Main navigation" : "Navegación principal"}>
          <a href="#trayectoria">{t.navCareer}</a>
          <a href="#logros">{t.navHonors}</a>
          <a href="#cuerpo-tecnico">{t.navStaff}</a>
          <a href="#contacto">{t.navContact}</a>
        </nav>
        <div className="header-controls">
          <div className="language-switch inline-flex items-center gap-1" role="group" aria-label={language === "en" ? "Select language" : "Seleccionar idioma"}>
            {["es", "en"].map((item) => (
              <button
                className={`language-button transition-colors ${language === item ? "is-active" : ""}`}
                key={item}
                type="button"
                aria-pressed={language === item}
                onClick={() => setLanguage(item)}
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            className="theme-toggle inline-flex items-center gap-2 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            type="button"
            role="switch"
            aria-checked={theme === "dark"}
            aria-label={theme === "dark" ? t.themeToLight : t.themeToDark}
            title={t.themeLabel}
            onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")}
          >
            <span className="theme-icon"><ThemeIcon theme={theme} /></span>
            <span className="theme-name">{theme === "dark" ? t.themeDark : t.themeLight}</span>
            <span className="theme-track" aria-hidden="true"><span /></span>
          </button>
        </div>
      </header>

      <main>
        <section className="hero section-wrap" id="inicio">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" />{t.heroEyebrow}</p>
            <h1>Alexis Nicolás<br /><span>Castro.</span></h1>
            <p className="hero-intro">{t.heroIntro}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#trayectoria"><span>{t.heroButton}</span><span aria-hidden="true">↘</span></a>
              <a className="text-link" href="https://www.instagram.com/castronico_84/" target="_blank" rel="noreferrer">Instagram <span aria-hidden="true">↗</span></a>
            </div>
            <div className="hero-meta">
              <span><span className="status-dot" />{t.heroCurrent}</span>
              <span>{t.heroLocation}</span>
            </div>
          </div>
          <div className="hero-visual" role="img" aria-label={language === "en" ? "Alexis Castro visual identity" : "Identidad visual de Alexis Castro"}>
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="hero-monogram">AC</div>
            <div className="hero-number">84</div>
            <div className="hero-caption"><span>{t.heroPosition}</span><span>·</span><span>{t.heroCaption}</span></div>
            <span className="visual-corner corner-top" />
            <span className="visual-corner corner-bottom" />
          </div>
          <div className="hero-scroll" aria-hidden="true"><span />SCROLL</div>
        </section>

        <section className="intro-strip">
          <div className="section-wrap strip-inner">
            <p>{t.stripText}</p>
            <span className="strip-index">01 — 03</span>
          </div>
        </section>

        <section className="career section-wrap section-space" id="trayectoria">
          <div className="section-heading">
            <div>
              <p className="eyebrow"><span className="eyebrow-line" />{t.careerEyebrow}</p>
              <h2>{t.careerTitle}<br /><span>{t.careerTitleAccent}</span></h2>
            </div>
            <p className="section-description">{t.careerDescription}</p>
          </div>
          <div className="career-layout">
            <div className="career-label"><span className="label-number">01</span><span>{t.careerLabel}<br />{t.careerLabelSecond}</span></div>
            <div className="club-list">
              {clubs.map((club) => (
                <article className={`club-row ${club.highlighted ? "club-highlight" : ""}`} key={club.name}>
                  <span className="club-years">
                    {Array.isArray(club.years)
                      ? club.years.map((year) => <Fragment key={year}>{year}<br /></Fragment>)
                      : club.years}
                  </span>
                  <h3>{club.name}</h3>
                  <span className="club-country">{t[club.country]}</span>
                  <span className="club-arrow" aria-hidden="true">↗</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="honors section-space" id="logros">
          <div className="section-wrap">
            <div className="section-heading honors-heading">
              <div>
                <p className="eyebrow eyebrow-light"><span className="eyebrow-line" />{t.honorsEyebrow}</p>
                <h2>{t.honorsTitle}<br /><span>{t.honorsTitleAccent}</span></h2>
              </div>
              <p className="section-description section-description-light">{t.honorsDescription}</p>
            </div>
            <div className="honors-grid">
              {honors.map((honor, index) => (
                <article className="honor-card" key={honor.year}>
                  <span className="honor-year">{honor.year}</span>
                  <span className="honor-rule" />
                  <p className="honor-club">{honor.club}</p>
                  <h3>{t.promotion}<br />{t.firstDivision}</h3>
                  <span className="honor-index">0{index + 1}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="staff section-wrap section-space" id="cuerpo-tecnico">
          <div className="staff-visual">
            <div className="staff-badge"><span>{t.staffBadgeTop}</span><strong>+</strong><span>{t.staffBadgeBottom}</span></div>
            <span className="staff-visual-label">ATLÉTICO DE RAFAELA · 2025—</span>
          </div>
          <div className="staff-copy">
            <p className="eyebrow"><span className="eyebrow-line" />{t.staffEyebrow}</p>
            <h2>{t.staffTitle}<br /><span>{t.staffTitleAccent}</span></h2>
            <p className="staff-description">{t.staffDescription}</p>
            <div className="staff-journey">
              <div><span className="journey-marker" /><p><strong>{t.staffSince}</strong><span>Atlético de Rafaela</span></p></div>
              <p className="staff-coaches">{t.staffCoaches}</p>
            </div>
          </div>
        </section>

        <section className="profile-strip">
          <div className="section-wrap profile-inner">
            <div><span className="profile-label">{t.profileBirth}</span><strong>Mina Clavero</strong><span className="profile-sub">Córdoba, Argentina · 1984</span></div>
            <div><span className="profile-label">{t.profilePosition}</span><strong>{t.profileMidfielder}</strong><span className="profile-sub">{t.profileStyle}</span></div>
            <div><span className="profile-label">{t.profileNow}</span><strong>{t.profileRole}</strong><span className="profile-sub">Atlético de Rafaela</span></div>
          </div>
        </section>
      </main>

      <footer className="footer section-wrap" id="contacto">
        <div className="footer-top">
          <div>
            <p className="eyebrow"><span className="eyebrow-line" />{t.contactEyebrow}</p>
            <h2>{t.contactTitle}<br /><span>{t.contactTitleAccent}</span></h2>
          </div>
          <a className="social-link" href="https://www.instagram.com/castronico_84/" target="_blank" rel="noreferrer">
            <span>Instagram</span><span className="social-handle">@castronico_84</span><span className="social-arrow" aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="footer-bottom">
          <a className="wordmark footer-wordmark" href="#inicio"><span className="wordmark-mark">AC</span><span className="wordmark-name">ALEXIS CASTRO<span>FÚTBOL</span></span></a>
          <p>{t.footerNote}</p>
          <a href="#inicio" className="back-top"><span>{t.backTop}</span> ↑</a>
        </div>
      </footer>
    </>
  );
}

export default App;
