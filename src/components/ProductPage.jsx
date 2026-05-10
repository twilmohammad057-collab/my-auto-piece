import { useState, useRef } from "react";

const WA_NUMBER   = "212634119267";
const GS_URL      = "https://script.google.com/macros/s/AKfycbxCkhuEK0TZrlZubrxUX4RAwstTC9Sb3eXo7ct-Kg4USnGHchQmu39Y8ubKd3dhrX6nLQ/exec";
const SUPABASE_STORAGE = "https://fveasrldkddtzwspzgfg.supabase.co/storage/v1/object/public/product%20images";

// ── Helpers ───────────────────────────────────────────────────────────────────
function sanitize(str) {
  if (str == null) return "";
  return String(str)
    .replace(/[^\x20-\x7EÀ-ɏ]/g, c => {
      const cp = c.codePointAt(0);
      return cp >= 0x0600 && cp <= 0x06FF ? c : "";
    })
    .replace(/\s+/g, " ")
    .trim();
}

function parsePrix(raw) {
  if (raw == null || raw === "") return null;
  const cleaned = String(raw).replace(/\s/g, "").replace(/\.(?=\d{3})/g, "").replace(",", ".");
  const n = parseFloat(cleaned);
  return isFinite(n) ? n : null;
}

function resolveImage(value) {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `${SUPABASE_STORAGE}/${trimmed}`;
}

function field(obj, ...keys) {
  for (const k of keys) {
    const v = obj?.[k];
    if (v != null && v !== "") return sanitize(String(v));
  }
  return "";
}

// ── Image fallback ─────────────────────────────────────────────────────────────
function ImageFallback() {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, background: "#F1F5F9" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#fff", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg viewBox="0 0 32 32" width="28" height="28" fill="none" aria-hidden="true">
          <circle cx="16" cy="16" r="14" stroke="#CBD5E1" strokeWidth="1.5"/>
          <circle cx="16" cy="16" r="9"  stroke="#94A3B8" strokeWidth="1.5"/>
          <circle cx="16" cy="16" r="4.5" fill="#CBD5E1"/>
          <circle cx="16" cy="16" r="2"   fill="#94A3B8"/>
          <line x1="16" y1="1"  x2="16" y2="5"  stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="27" y1="5"  x2="24" y2="8"  stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="31" y1="16" x2="27" y2="16" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", letterSpacing: "0.5px" }}>Image en cours</span>
    </div>
  );
}

// ── Icons ──────────────────────────────────────────────────────────────────────
const WaIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.533 5.854L.057 23.215a.75.75 0 0 0 .921.912l5.4-1.485A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.685-.524-5.21-1.435l-.374-.224-3.867 1.063 1.028-3.75-.245-.387A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
  </svg>
);

// ── Spec chip ──────────────────────────────────────────────────────────────────
function SpecChip({ label, value, mono = false, highlight = false, customColor = null }) {
  if (!value) return null;
  const valueColor = customColor || (highlight ? "#1D4ED8" : "#0F172A");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: "10px 14px" }}>
      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.5px", color: "#94A3B8", textTransform: "uppercase" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: valueColor, fontFamily: mono ? "'Courier New',monospace" : "'Inter',sans-serif", lineHeight: 1.3 }}>{value}</span>
    </div>
  );
}

// ── Bilingual field label ──────────────────────────────────────────────────────
function BiLabel({ fr, ar, required }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: "#374151", letterSpacing: "0.3px" }}>
        {fr}{required && <span style={{ color: "#EF4444", marginLeft: 2 }}>*</span>}
      </span>
      <span style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", direction: "rtl" }}>{ar}</span>
    </div>
  );
}

// ── Order Modal ────────────────────────────────────────────────────────────────
function OrderModal({ productName, onClose, onSuccess }) {
  const [nom,     setNom]     = useState("");
  const [tel,     setTel]     = useState("+212 ");
  const [ville,   setVille]   = useState("");
  const [sending, setSending] = useState(false);
  const [err,     setErr]     = useState("");

  const phoneCleaned = tel.replace(/[\s\-\(\)]/g, "");
  const phoneValid   = /^(\+212|0)(6|7)\d{8}$/.test(phoneCleaned);
  const canSubmit    = nom.trim().length >= 2 && phoneValid && ville.trim().length >= 2;

  const submit = async () => {
    if (!canSubmit || sending) return;
    setSending(true);
    setErr("");
    try {
      await fetch(GS_URL, {
        method:  "POST",
        mode:    "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          customerName:  nom.trim(),
          customerPhone: phoneCleaned,
          customerCity:  ville.trim(),
        }),
      });
      onSuccess();
    } catch {
      setErr("Erreur réseau — veuillez réessayer.");
      setSending(false);
    }
  };

  const inp = (val, set, ph, type = "text") => (
    <input
      type={type}
      value={val}
      onChange={e => set(e.target.value)}
      placeholder={ph}
      disabled={sending}
      style={{
        width: "100%", padding: "11px 13px", borderRadius: 11,
        border: `1.5px solid #E5E7EB`, background: "#FAFAFA",
        color: "#111827", fontSize: 14, fontFamily: "'Inter',sans-serif",
        outline: "none", transition: "border-color .15s, box-shadow .15s",
        boxSizing: "border-box",
      }}
      onFocus={e  => { e.target.style.borderColor = "#1D4ED8"; e.target.style.boxShadow = "0 0 0 3px rgba(29,78,216,0.1)"; e.target.style.background = "#fff"; }}
      onBlur={e   => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; e.target.style.background = "#FAFAFA"; }}
    />
  );

  return (
    <div
      onClick={!sending ? onClose : undefined}
      style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "0", backdropFilter: "blur(6px)" }}
    >
      {/* Sheet slides up from bottom on mobile, centered on desktop */}
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: "#FFFFFF", width: "100%", maxWidth: 480, borderRadius: "22px 22px 0 0", padding: "0 0 env(safe-area-inset-bottom,0)", boxShadow: "0 -8px 40px rgba(0,0,0,0.18)", animation: "om-slide .28s cubic-bezier(0.22,1,0.36,1)", overflow: "hidden" }}
      >
        {/* Header */}
        <div style={{ background: "#1535A0", padding: "18px 20px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 9, letterSpacing: "2px", color: "rgba(255,255,255,0.55)", fontWeight: 700, marginBottom: 3, textTransform: "uppercase" }}>MY Auto Pièces — Commande</p>
            <p style={{ fontSize: 14, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.25 }} dir="auto">{productName}</p>
          </div>
          {!sending && (
            <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: "22px 20px 24px" }}>
          <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 20, lineHeight: 1.6 }} dir="auto">
            Remplissez le formulaire ci-dessous pour passer votre commande.
            <br/>
            <span dir="rtl" style={{ display: "block", textAlign: "right", marginTop: 3 }}>أدخل بياناتك لإتمام الطلب</span>
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Nom */}
            <div>
              <BiLabel fr="Nom Complet" ar="الاسم الكامل" required />
              {inp(nom, setNom, "Ex: Muhammad Al Alami")}
            </div>

            {/* Téléphone */}
            <div>
              <BiLabel fr="Téléphone" ar="رقم الهاتف" required />
              {inp(tel, setTel, "+212 6XX XXX XXX", "tel")}
              {tel.length > 5 && !phoneValid && (
                <p style={{ fontSize: 11, color: "#EF4444", marginTop: 4 }}>
                  Format invalide — ex: +212 612 345 678 ou 0612345678
                </p>
              )}
            </div>

            {/* Ville */}
            <div>
              <BiLabel fr="Ville" ar="المدينة" required />
              {inp(ville, setVille, "Ex: Casablanca")}
            </div>

            {err && (
              <p style={{ fontSize: 12, color: "#EF4444", background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 8, padding: "8px 12px", margin: 0 }}>{err}</p>
            )}

            <button
              onClick={submit}
              disabled={!canSubmit || sending}
              style={{
                marginTop: 4,
                padding: "14px",
                borderRadius: 13,
                border: "none",
                fontSize: 14,
                fontWeight: 800,
                fontFamily: "'Inter',sans-serif",
                cursor: canSubmit && !sending ? "pointer" : "not-allowed",
                transition: "background .2s, opacity .2s, box-shadow .2s",
                background: canSubmit && !sending ? "#D97706" : "#E5E7EB",
                color: canSubmit && !sending ? "#FFFFFF" : "#9CA3AF",
                boxShadow: canSubmit && !sending ? "0 4px 16px rgba(217,119,6,0.35)" : "none",
                letterSpacing: "0.2px",
              }}
            >
              {sending
                ? "Envoi en cours…"
                : "Confirmer la commande | تأكيد الطلب"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

// ── Success overlay ────────────────────────────────────────────────────────────
function SuccessOverlay({ onClose }) {
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(8px)" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: "#FFFFFF", borderRadius: 22, padding: "36px 28px", maxWidth: 380, width: "100%", textAlign: "center", boxShadow: "0 24px 64px rgba(0,0,0,0.22)", animation: "om-slide .3s cubic-bezier(0.22,1,0.36,1)" }}
      >
        {/* Check circle */}
        <div style={{ width: 68, height: 68, borderRadius: "50%", background: "#F0FDF4", border: "2px solid #86EFAC", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" width="32" height="32">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 900, color: "#111827", marginBottom: 6, letterSpacing: "-0.3px" }}>
          Merci ! <span dir="rtl">شكراً لك</span>
        </h2>

        <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.75, marginBottom: 8 }}>
          Votre commande a été reçue. Notre équipe vous contactera sous peu pour la confirmation.
        </p>
        <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.75, marginBottom: 28, direction: "rtl" }}>
          تم استلام طلبك بنجاح. سيتصل بك فريقنا قريباً لتأكيد الطلب.
        </p>

        <button
          onClick={onClose}
          style={{ width: "100%", padding: "13px", borderRadius: 13, border: "none", background: "#1D4ED8", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif" }}
        >
          Fermer
        </button>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function ProductPage({ product, onBack }) {
  const [modalOpen,    setModalOpen]    = useState(false);
  const [showSuccess,  setShowSuccess]  = useState(false);

  // ── Gallery setup ─────────────────────────────────────────────────────────
  const primaryRaw    = product?.Image ?? product?.image ?? null;
  const galleryRaw    = product?.IMAGES2 ?? product?.images2 ?? product?.Images2 ?? null;
  const galleryImages = galleryRaw
    ? galleryRaw.split(",").map(s => s.trim()).filter(Boolean)
    : [];
  const allImages = [primaryRaw, ...galleryImages]
    .map(resolveImage)
    .filter(Boolean);

  const [activeIdx,  setActiveIdx]  = useState(0);
  const [imgError,   setImgError]   = useState(false);
  const [imgLoaded,  setImgLoaded]  = useState(false);
  const touchStartX = useRef(null);

  const goTo = (idx) => {
    const next = (idx + allImages.length) % allImages.length;
    if (next === activeIdx) return;
    setActiveIdx(next);
    setImgLoaded(false);
    setImgError(false);
  };
  const prevImg = () => goTo(activeIdx - 1);
  const nextImg = () => goTo(activeIdx + 1);

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (delta >  50) nextImg();
    if (delta < -50) prevImg();
    touchStartX.current = null;
  };

  const marque      = field(product, "Marque",      "marque",      "brand",       "Brand");
  const modele      = field(product, "Modèle",      "Modele",      "modele",      "model",    "Model");
  const annee       = field(product, "Année",       "Annee",       "annee",       "year",     "Year");
  const cote        = field(product, "Côté",        "Cote",        "cote",        "side",     "Side");
  const type        = field(product, "Type",        "type");
  const reference   = field(product, "Référence",   "Reference",   "reference",   "ref",      "Ref",  "REF");
  const cond        = field(product, "condition",   "Condition",   "etat",        "Etat").toLowerCase();
  // Read raw — skip sanitize() so newlines are preserved for multi-paragraph display
  const description = (
    product?.DESCRIPTION ?? product?.description ?? product?.Description ?? null
  )?.toString().trim() || null;
  const prix        = parsePrix(product?.Prix ?? product?.prix ?? product?.price ?? null);

  const imgSrc = allImages[activeIdx] ?? null;

  const title = [marque, modele, annee].filter(Boolean).join(" ") || "Pièce automobile";
  const waMsg = encodeURIComponent(
    `Bonjour MY Auto Pièces 👋\n\nJe souhaite commander :\n*${title}*\n` +
    (type      ? `Type : ${type}\n`      : "") +
    (cote      ? `Côté : ${cote}\n`      : "") +
    (reference ? `Réf : ${reference}\n`  : "") +
    (prix != null ? `Prix : ${prix.toLocaleString("fr-MA")} DH\n` : "") +
    `\nMerci de confirmer la disponibilité.`
  );
  const waHref = `https://wa.me/${WA_NUMBER}?text=${waMsg}`;

  const condIsNeuf = cond === "neuf";
  const sideBg = (() => {
    const c = cote.toLowerCase();
    if (c.includes("gauche") || c.includes("left"))  return "#4F46E5";
    if (c.includes("droit")  || c.includes("right")) return "#7C3AED";
    return "#475569";
  })();

  const openOrder  = () => { setShowSuccess(false); setModalOpen(true); };
  const closeModal = () => setModalOpen(false);
  const handleSuccess = () => {
    setModalOpen(false);
    setShowSuccess(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes pp-shimmer {
          from { transform: translateX(-100%); }
          to   { transform: translateX(200%); }
        }
        @keyframes pp-fadeup {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes om-slide {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pp-shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%);
          animation: pp-shimmer 1.6s infinite;
        }
        .pp-fadein { animation: pp-fadeup 0.32s ease forwards; }
        .pp-btn:active { transform: scale(0.97); }
        .pp-thumbs { display: flex; gap: 8px; padding: 10px 0 2px; overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; }
        .pp-thumbs::-webkit-scrollbar { display: none; }
        .pp-thumb { flex-shrink: 0; width: 64px; height: 64px; border-radius: 10px; overflow: hidden; border: 2.5px solid transparent; opacity: 0.5; cursor: pointer; padding: 0; background: #E2E8F0; transition: opacity .2s, border-color .2s, transform .15s; }
        .pp-thumb:hover { opacity: 0.8; transform: scale(1.05); }
        .pp-thumb.active { border-color: #1D4ED8; opacity: 1; }
        .pp-arrow { position: absolute; top: 50%; transform: translateY(-50%); z-index: 10; width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.92); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 12px rgba(0,0,0,0.18); transition: background .15s, transform .15s; backdrop-filter: blur(4px); }
        .pp-arrow:hover { background: #fff; transform: translateY(-50%) scale(1.1); }
        .pp-arrow:active { transform: translateY(-50%) scale(0.95); }

        @media (min-width: 768px) {
          .pp-body     { display: flex !important; flex-direction: row !important; align-items: flex-start; max-width: 1100px; margin: 0 auto; padding: 32px 24px 120px; gap: 48px; }
          .pp-img-col  { width: 46%; flex-shrink: 0; position: sticky; top: 110px; }
          .pp-detail-col { flex: 1; min-width: 0; }
          .pp-img-wrap { border-radius: 22px; overflow: hidden; aspect-ratio: 4/3; }
        }
        @media (max-width: 767px) {
          .pp-img-wrap { width: 100%; aspect-ratio: 4/3; max-height: 65vw; min-height: 240px; }
        }
      `}</style>

      {/* ── Modals ── */}
      {modalOpen && (
        <OrderModal
          productName={title}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}
      {showSuccess && <SuccessOverlay onClose={() => setShowSuccess(false)} />}

      <div style={{ fontFamily: "'Inter',sans-serif", background: "#FFFFFF", minHeight: "100vh", paddingBottom: 88 }}>

        {/* ── Back bar ── */}
        <div style={{ position: "sticky", top: 64, zIndex: 40, background: "rgba(255,255,255,0.96)", backdropFilter: "blur(10px)", borderBottom: "1px solid #F1F5F9", padding: "8px 16px" }}>
          <button onClick={onBack}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter',sans-serif", padding: "4px 0" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="14" height="14">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Retour au catalogue
          </button>
        </div>

        {/* ── Body ── */}
        <div className="pp-body" style={{ display: "flex", flexDirection: "column" }}>

          {/* ── Image column ── */}
          <div className="pp-img-col">
            <div
              className="pp-img-wrap"
              style={{ position: "relative", background: "#F1F5F9", overflow: "hidden", userSelect: "none" }}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {imgSrc && !imgError ? (
                <>
                  {!imgLoaded && (
                    <div className="pp-shimmer" style={{ position: "absolute", inset: 0, background: "#E2E8F0", overflow: "hidden" }}/>
                  )}
                  <img
                    key={imgSrc}
                    src={imgSrc}
                    alt={title}
                    onLoad={() => setImgLoaded(true)}
                    onError={() => setImgError(true)}
                    style={{ width: "100%", height: "100%", objectFit: "cover", opacity: imgLoaded ? 1 : 0, transition: "opacity 0.4s ease", display: "block" }}
                  />
                </>
              ) : (
                <ImageFallback />
              )}

              {/* Bottom gradient */}
              {imgSrc && !imgError && imgLoaded && (
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "45%", background: "linear-gradient(to top, rgba(0,0,0,0.45), transparent)", pointerEvents: "none" }}/>
              )}

              {/* Prev / Next arrows — only when multiple images */}
              {allImages.length > 1 && (
                <>
                  <button className="pp-arrow" onClick={prevImg} style={{ left: 10 }} aria-label="Image précédente">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="2.5" strokeLinecap="round" width="16" height="16">
                      <polyline points="15 18 9 12 15 6"/>
                    </svg>
                  </button>
                  <button className="pp-arrow" onClick={nextImg} style={{ right: 10 }} aria-label="Image suivante">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="2.5" strokeLinecap="round" width="16" height="16">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                </>
              )}

              {/* Condition badge */}
              {cond && (
                <span style={{ position: "absolute", top: 12, left: 12, fontSize: 11, fontWeight: 800, padding: "5px 12px", borderRadius: 20, color: "#fff", background: condIsNeuf ? "rgba(16,185,129,0.92)" : "rgba(245,158,11,0.92)", backdropFilter: "blur(6px)", boxShadow: "0 2px 10px rgba(0,0,0,0.18)", letterSpacing: "0.3px" }}>
                  {condIsNeuf ? "✓ Neuf" : "♻ Occasion"}
                </span>
              )}
              {cote && (
                <span style={{ position: "absolute", top: 12, right: 12, fontSize: 11, fontWeight: 800, padding: "5px 12px", borderRadius: 20, color: "#fff", background: sideBg + "dd", backdropFilter: "blur(6px)", boxShadow: "0 2px 10px rgba(0,0,0,0.18)" }}>
                  {cote}
                </span>
              )}

              {/* Bottom overlay: title + dot indicators */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 16px" }}>
                {/* Dots */}
                {allImages.length > 1 && (
                  <div style={{ display: "flex", justifyContent: "center", gap: 5, marginBottom: 8 }}>
                    {allImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goTo(i)}
                        style={{ width: i === activeIdx ? 18 : 6, height: 6, borderRadius: 3, background: i === activeIdx ? "#fff" : "rgba(255,255,255,0.45)", border: "none", padding: 0, cursor: "pointer", transition: "width .2s, background .2s" }}
                        aria-label={`Vue ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
                {imgLoaded && (
                  <>
                    {marque && (
                      <span style={{ display: "block", fontSize: 9, fontWeight: 800, letterSpacing: "2.5px", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", marginBottom: 3 }}>
                        {marque}
                      </span>
                    )}
                    <h1 style={{ fontSize: "clamp(16px,4vw,22px)", fontWeight: 900, color: "#fff", lineHeight: 1.15, margin: 0, textShadow: "0 1px 6px rgba(0,0,0,0.35)" }}>
                      {modele || marque || "Pièce automobile"}
                      {annee && <span style={{ fontWeight: 500, opacity: 0.75, marginLeft: 7 }}>{annee}</span>}
                    </h1>
                  </>
                )}
              </div>
            </div>
          {/* ── Thumbnail strip ── */}
          {allImages.length > 1 && (
            <div className="pp-thumbs">
              {allImages.map((url, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`pp-thumb${i === activeIdx ? " active" : ""}`}
                  aria-label={`Vue ${i + 1}`}
                >
                  <img
                    src={url}
                    alt=""
                    onError={e => { e.currentTarget.parentElement.style.display = "none"; }}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </button>
              ))}
            </div>
          )}
          </div>

          {/* ── Detail column ── */}
          <div className="pp-fadein pp-detail-col" style={{ padding: "18px 16px 12px", maxWidth: 600, width: "100%" }}>

            {/* ① Brand + Title */}
            <div style={{ marginBottom: 16 }}>
              {marque && (
                <span style={{ display: "inline-block", fontSize: 9, fontWeight: 800, letterSpacing: "2px", color: "#1D4ED8", background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 20, padding: "4px 12px", textTransform: "uppercase", marginBottom: 8 }}>
                  {marque}
                </span>
              )}
              <h2 style={{ fontSize: "clamp(20px,5vw,28px)", fontWeight: 900, color: "#0F172A", lineHeight: 1.2, marginBottom: 4, letterSpacing: "-0.3px" }}>
                {modele || marque || "Pièce automobile"}
              </h2>
              {(annee || type) && (
                <p style={{ fontSize: 13, color: "#94A3B8", fontWeight: 500, margin: 0, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  {annee && <span>{annee}</span>}
                  {annee && type && <span style={{ color: "#D1D5DB" }}>·</span>}
                  {type && <span>{type}</span>}
                </p>
              )}
            </div>

            {/* ② Spec grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
              <SpecChip label="Marque"    value={marque} />
              <SpecChip label="Modèle"    value={modele} />
              <SpecChip label="Année"     value={annee} />
              <SpecChip label="Côté"      value={cote} />
              <SpecChip label="Référence" value={reference} mono highlight />
              {cond && (
                <SpecChip
                  label="État"
                  value={condIsNeuf ? "✓ Neuf" : "♻ Occasion"}
                  customColor={condIsNeuf ? "#059669" : "#D97706"}
                />
              )}
            </div>

            {/* ③ Price */}
            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
              {prix != null ? (
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: "clamp(30px,7vw,40px)", fontWeight: 900, color: "#1D4ED8", letterSpacing: "-1.5px", lineHeight: 1 }}>
                    {prix.toLocaleString("fr-MA")}
                  </span>
                  <span style={{ fontSize: 17, fontWeight: 700, color: "#93C5FD" }}>DH</span>
                </div>
              ) : (
                <p style={{ fontSize: 15, color: "#64748B", fontWeight: 600, marginBottom: 4 }}>
                  Prix sur demande
                </p>
              )}
              <p style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.6, margin: 0 }}>
                Acompte de <strong style={{ color: "#64748B" }}>500 DH</strong> à la confirmation — solde à la livraison.
              </p>
            </div>

            {/* ④ Commander CTA (in-page — also duplicated in sticky bar) */}
            <button
              onClick={openOrder}
              className="pp-btn"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, width: "100%", background: "#D97706", color: "#fff", border: "none", borderRadius: 14, padding: "16px 20px", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "'Inter',sans-serif", boxShadow: "0 6px 24px rgba(217,119,6,0.3)", transition: "background 0.2s, box-shadow 0.2s", marginBottom: 12, letterSpacing: "0.3px" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#B45309"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#D97706"; }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" width="18" height="18">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              Commander Maintenant &nbsp;|&nbsp; <span dir="rtl">اطلب الآن</span>
            </button>

            {/* ⑤ Trust chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 24 }}>
              {[["Réponse rapide","#25D366"],["Pièce vérifiée","#1D4ED8"],["Livraison Maroc","#059669"]].map(([text, color]) => (
                <span key={text} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#6B7280", fontWeight: 500 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" width="11" height="11">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {text}
                </span>
              ))}
            </div>

            {/* ⑥ Description — always last */}
            <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 20, marginBottom: 8 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#94A3B8", textTransform: "uppercase", marginBottom: 12 }}>
                Détails du produit
              </p>
              {description ? (
                description.split(/\n+/).map((para, i) => (
                  para.trim() && (
                    <p key={i} style={{ fontSize: 14, color: "#374151", lineHeight: 1.85, margin: i === 0 ? 0 : "12px 0 0", fontWeight: 400 }}>
                      {para.trim()}
                    </p>
                  )
                ))
              ) : (
                <p style={{ fontSize: 13, color: "#9CA3AF", lineHeight: 1.75, margin: 0, fontStyle: "italic" }}>
                  Contactez-nous pour plus d'informations sur cette pièce.
                </p>
              )}
            </div>

          </div>
        </div>

        {/* ── Sticky bottom bar ── */}
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, background: "#FFFFFF", borderTop: "1.5px solid #E2E8F0", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 -6px 24px rgba(0,0,0,0.07)" }}>

          {/* Price */}
          {prix != null ? (
            <div style={{ flexShrink: 0 }}>
              <div style={{ fontSize: 9, color: "#94A3B8", fontWeight: 700, letterSpacing: "1.2px", marginBottom: 1, textTransform: "uppercase" }}>Prix</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                <span style={{ fontSize: 20, fontWeight: 900, color: "#1D4ED8", letterSpacing: "-0.5px", lineHeight: 1 }}>{prix.toLocaleString("fr-MA")}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#93C5FD" }}>DH</span>
              </div>
            </div>
          ) : (
            <div style={{ flexShrink: 0, fontSize: 10, color: "#94A3B8", fontWeight: 600, lineHeight: 1.4 }}>Prix<br/>sur demande</div>
          )}

          {/* Primary: Order button */}
          <button
            onClick={openOrder}
            className="pp-btn"
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: "#D97706", color: "#fff", border: "none", borderRadius: 13, padding: "13px 10px", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Inter',sans-serif", boxShadow: "0 4px 16px rgba(217,119,6,0.35)", transition: "background 0.2s", whiteSpace: "nowrap" }}
            onMouseEnter={e => e.currentTarget.style.background = "#B45309"}
            onMouseLeave={e => e.currentTarget.style.background = "#D97706"}
          >
            Commander | <span dir="rtl" style={{ fontWeight: 700 }}>اطلب</span>
          </button>

        </div>

      </div>
    </>
  );
}
