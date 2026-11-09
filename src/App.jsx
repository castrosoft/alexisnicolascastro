import { Fragment, useEffect, useRef, useState } from "react";
import { clubs, honors, photos, translations } from "./translations.js";

const photoGroups = Array.from(
  photos.reduce((groups, photo, index) => {
    const group = groups.get(photo.club) ?? [];
    group.push({ photo, index });
    groups.set(photo.club, group);
    return groups;
  }, new Map()),
  ([club, items]) => ({ club, photos: items })
);

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

function ClubCrest({ club }) {
  const [hasError, setHasError] = useState(false);

  if (!club.crest || hasError) {
    return <span className="club-crest crest-fallback" aria-hidden="true">{club.initials}</span>;
  }

  return (
    <span className="club-crest" aria-hidden="true">
      <img
        src={`/escudos/${club.crest}`}
        alt=""
        onError={() => setHasError(true)}
      />
    </span>
  );
}

function App() {
  const [language, setLanguage] = useState("es");
  const [theme, setTheme] = useState(getInitialTheme);
  const [activeClubName, setActiveClubName] = useState("Atlético de Rafaela");
  const [activePhoto, setActivePhoto] = useState(null);
  const photoDialogRef = useRef(null);
  const t = translations[language];
  const isPhotoDialogOpen = activePhoto !== null;
  const activeClub = clubs.find((club) => club.name === activeClubName) ?? clubs[0];
  const activeClubPhoto = photos.find((photo) => photo.club === activeClub.name);
  const activePhotoGroup = activePhoto
    ? photoGroups.find((group) => group.club === activePhoto.club)
    : null;
  const activePhotoItem = activePhotoGroup?.photos[activePhoto.index].photo;

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

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return undefined;

    document.documentElement.classList.add("has-motion");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("has-motion");
    };
  }, []);

  useEffect(() => {
    const dialog = photoDialogRef.current;
    if (!dialog) return;

    if (isPhotoDialogOpen && !dialog.open) dialog.showModal();
    if (!isPhotoDialogOpen && dialog.open) dialog.close();
  }, [isPhotoDialogOpen]);

  useEffect(() => {
    if (!isPhotoDialogOpen) return undefined;

    function handlePhotoNavigation(event) {
      if (event.key === "ArrowRight") {
        setActivePhoto((current) => ({
          ...current,
          index: (current.index + 1) % activePhotoGroup.photos.length
        }));
      } else if (event.key === "ArrowLeft") {
        setActivePhoto((current) => ({
          ...current,
          index: (current.index - 1 + activePhotoGroup.photos.length) % activePhotoGroup.photos.length
        }));
      } else if (event.key === "Escape") {
        setActivePhoto(null);
      }
    }

    window.addEventListener("keydown", handlePhotoNavigation);
    return () => window.removeEventListener("keydown", handlePhotoNavigation);
  }, [activePhotoGroup, isPhotoDialogOpen]);

  return (
    <>
      <header className="site-header">
        <a className="wordmark" href="#inicio" aria-label="Alexis Castro, inicio">
          <span className="wordmark-mark wordmark-avatar"><img src="/images/profile/profile.jpg" alt="" /></span>
          <span className="wordmark-name">ALEXIS CASTRO<span>FÚTBOL</span></span>
        </a>
        <nav className="main-nav" aria-label={language === "en" ? "Main navigation" : "Navegación principal"}>
          <a href="#trayectoria">{t.navCareer}</a>
          <a href="#logros">{t.navHonors}</a>
          <a href="#fotos">{t.navPhotos}</a>
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
          <div className="hero-visual" role="img" aria-label={t.heroImageAlt}>
            <img className="hero-photo" src="/images/portada/portada-removebg-preview.png" alt="" fetchPriority="high" />
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
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
          <div className="career-showcase" data-reveal>
            <div className="career-feature" key={activeClub.name}>
              {activeClubPhoto ? (
                <img className="career-feature-image" src={activeClubPhoto.src} alt={activeClubPhoto.alt[language]} />
              ) : (
                <div className="career-feature-empty" />
              )}
              <span className="career-feature-overlay" />
              <div className="career-feature-content">
                <span className="career-feature-kicker">{t.careerSelected} · {Array.isArray(activeClub.years) ? activeClub.years.join(" / ") : activeClub.years}</span>
                <div className="career-feature-main">
                  <ClubCrest club={activeClub} />
                  <h3>{activeClub.name}</h3>
                </div>
                <p>{t[activeClub.country]}<span aria-hidden="true"> · </span>{t.careerLabel} {t.careerLabelSecond}</p>
              </div>
              <span className="career-feature-index">{String(clubs.indexOf(activeClub) + 1).padStart(2, "0")}<span> / {String(clubs.length).padStart(2, "0")}</span></span>
            </div>
            <div className="career-side">
              <p className="career-prompt">{t.careerSelectPrompt}</p>
              <div className="club-list" role="group" aria-label={t.careerLabel}>
                {clubs.map((club) => (
                  <button
                    className={`club-row ${club.highlighted ? "club-highlight" : ""} ${activeClub.name === club.name ? "is-selected" : ""}`}
                    key={club.name}
                    type="button"
                    aria-pressed={activeClub.name === club.name}
                    onClick={() => setActiveClubName(club.name)}
                  >
                    <ClubCrest club={club} />
                    <span className="club-copy">
                      <span className="club-years">
                        {Array.isArray(club.years)
                          ? club.years.map((year) => <Fragment key={year}>{year}<br /></Fragment>)
                          : club.years}
                      </span>
                      <span className="club-name">{club.name}</span>
                      <span className="club-country">{t[club.country]}</span>
                    </span>
                    <span className="club-arrow" aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
              <div className="career-metrics" aria-label={t.careerLabel}>
                <div><strong>{clubs.length}</strong><span>{t.careerClubCount}</span></div>
                <div><strong>{honors.length}</strong><span>{t.careerPromotions}</span></div>
                <div><strong>15</strong><span>{t.careerSeasons}</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="photos section-space" id="fotos">
          <div className="section-wrap">
            <div className="section-heading photos-heading" data-reveal>
              <div>
                <p className="eyebrow"><span className="eyebrow-line" />{t.careerPhotos}</p>
                <h2>{t.photosTitle}<br /><span>{t.photosTitleAccent}</span></h2>
              </div>
              <p className="section-description">{t.photosDescription}</p>
            </div>
            <div className="photo-grid">
              {photoGroups.map((group, index) => {
                const cover = group.photos[0].photo;
                const countLabel = group.photos.length === 1 ? t.photoCountOne : t.photoCount;

                return (
                  <button
                    className={`photo-card photo-card-${index + 1}`}
                    key={group.club}
                    type="button"
                    aria-label={`${t.photoOpen}: ${group.club} (${group.photos.length} ${countLabel.toLowerCase()})`}
                    onClick={() => setActivePhoto({ club: group.club, index: 0 })}
                    data-reveal
                  >
                    <img src={cover.src} alt={cover.alt[language]} loading="lazy" />
                    <span className="photo-shade" />
                    <span className="photo-caption">
                      <span>{group.club}</span>
                      <strong>{group.photos.length} {countLabel}</strong>
                    </span>
                    <span className="photo-expand" aria-hidden="true">↗</span>
                  </button>
                );
              })}
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
            <img className="staff-portrait" src="/images/profile/profile.jpg" alt={t.profilePhotoAlt} />
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
          <a className="wordmark footer-wordmark" href="#inicio"><span className="wordmark-mark wordmark-avatar"><img src="/images/profile/profile.jpg" alt="" /></span><span className="wordmark-name">ALEXIS CASTRO<span>FÚTBOL</span></span></a>
          <p>{t.footerNote}</p>
          <a href="#inicio" className="back-top"><span>{t.backTop}</span> ↑</a>
        </div>
      </footer>
      <dialog
        className="photo-dialog"
        ref={photoDialogRef}
        aria-label={language === "en" ? "Photo gallery" : "Galería de fotos"}
        onCancel={(event) => {
          event.preventDefault();
          setActivePhoto(null);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setActivePhoto(null);
        }}
      >
        {activePhoto && activePhotoGroup && activePhotoItem && (
          <div className="lightbox-content">
            <div className="lightbox-toolbar">
              <span>{activePhoto.club} · {String(activePhoto.index + 1).padStart(2, "0")} / {String(activePhotoGroup.photos.length).padStart(2, "0")}</span>
              <button type="button" className="lightbox-close" aria-label={t.photoClose} onClick={() => setActivePhoto(null)}>×</button>
            </div>
            <div className="lightbox-image-wrap">
              <button
                type="button"
                className="lightbox-arrow lightbox-previous"
                aria-label={t.photoPrevious}
                onClick={() => setActivePhoto((current) => ({
                  ...current,
                  index: (current.index - 1 + activePhotoGroup.photos.length) % activePhotoGroup.photos.length
                }))}
              >
                ←
              </button>
              <img src={activePhotoItem.src} alt={activePhotoItem.alt[language]} />
              <button
                type="button"
                className="lightbox-arrow lightbox-next"
                aria-label={t.photoNext}
                onClick={() => setActivePhoto((current) => ({
                  ...current,
                  index: (current.index + 1) % activePhotoGroup.photos.length
                }))}
              >
                →
              </button>
            </div>
            <p className="lightbox-caption">{activePhotoItem.caption[language]}</p>
          </div>
        )}
      </dialog>
    </>
  );
}

export default App;
