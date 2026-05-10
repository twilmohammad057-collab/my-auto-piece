import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const WA_NUMBER = "212634119267";
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
  const cleaned = String(raw)
    .replace(/\s/g, "")
    .replace(/\.(?=\d{3})/g, "")
    .replace(",", ".");
  const n = parseFloat(cleaned);
  return isFinite(n) ? n : null;
}

/**
 * Full URL → use as-is.
 * Bare filename → build Supabase Storage URL.
 * Empty / null → null (show ImageFallback).
 */
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

// ── Image fallback — clean modern placeholder ─────────────────────────────────
function ImageFallback() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-gray-100">
      {/* Headlight icon */}
      <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
        <svg viewBox="0 0 32 32" width="22" height="22" fill="none" aria-hidden="true">
          <circle cx="16" cy="16" r="14" stroke="#CBD5E1" strokeWidth="1.5"/>
          <circle cx="16" cy="16" r="9"  stroke="#94A3B8" strokeWidth="1.5"/>
          <circle cx="16" cy="16" r="4.5" fill="#CBD5E1"/>
          <circle cx="16" cy="16" r="2"   fill="#94A3B8"/>
          {/* beam lines */}
          <line x1="16" y1="1" x2="16" y2="5"  stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="27" y1="5" x2="24" y2="8"  stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="31" y1="16" x2="27" y2="16" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <span className="text-[10px] font-semibold text-gray-400 tracking-wide">Image en cours</span>
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const WaIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.533 5.854L.057 23.215a.75.75 0 0 0 .921.912l5.4-1.485A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.685-.524-5.21-1.435l-.374-.224-3.867 1.063 1.028-3.75-.245-.387A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
    width="16" height="16">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

// ── ProductCard ───────────────────────────────────────────────────────────────
function ProductCard({ product, onProductClick }) {
  const [imgError,  setImgError]  = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const marque    = field(product, "Marque",    "marque",    "brand",     "Brand");
  const modele    = field(product, "Modèle",    "Modele",    "modele",    "model",  "Model");
  const annee     = field(product, "Année",     "Annee",     "annee",     "year",   "Year");
  const cote      = field(product, "Côté",      "Cote",      "cote",      "side",   "Side");
  const type      = field(product, "Type",      "type");
  const reference = field(product, "Référence", "Reference", "reference", "ref",    "Ref", "REF");
  const cond      = field(product, "condition", "Condition", "etat",      "Etat").toLowerCase();

  const prix = parsePrix(product?.Prix ?? product?.prix ?? product?.price ?? null);

  // Build Supabase Storage URL for bare filenames; keep full URLs as-is
  const imgSrc = resolveImage(product?.Image ?? product?.image ?? null);

  const title = [marque, modele, annee].filter(Boolean).join(" ") || "Pièce automobile";
  const waMsg = encodeURIComponent(
    `Bonjour MY Auto Pièces 👋\n\nJe suis intéressé par :\n*${title}*\n` +
    (type      ? `Type : ${type}\n`      : "") +
    (cote      ? `Côté : ${cote}\n`      : "") +
    (reference ? `Réf : ${reference}\n`  : "") +
    (prix != null ? `Prix : ${prix.toLocaleString("fr-MA")} DH\n` : "") +
    `\nEst-elle disponible ?`
  );

  const sideColor = (() => {
    const c = cote.toLowerCase();
    if (c.includes("gauche") || c.includes("left"))  return "bg-indigo-500";
    if (c.includes("droit")  || c.includes("right")) return "bg-violet-500";
    return "bg-blue-500";
  })();

  const canClick = typeof onProductClick === "function";

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 overflow-hidden flex flex-col">

      {/* ── Image zone ── */}
      <div
        className={`relative h-48 overflow-hidden flex-shrink-0 bg-gray-100 ${canClick ? "cursor-pointer" : ""}`}
        onClick={canClick ? () => onProductClick(product) : undefined}
      >
        {imgSrc && !imgError ? (
          <>
            {!imgLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
            <img
              src={imgSrc}
              alt={title}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            />
          </>
        ) : (
          <ImageFallback />
        )}

        {/* Subtle bottom gradient over image */}
        {imgSrc && !imgError && imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
        )}

        {cond && (
          <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2.5 py-1 rounded-full text-white shadow
            ${cond === "neuf" ? "bg-emerald-500" : "bg-amber-500"}`}>
            {cond === "neuf" ? "✓ Neuf" : "♻ Occasion"}
          </span>
        )}
        {cote && (
          <span className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2.5 py-1 rounded-full text-white shadow ${sideColor}`}>
            {cote}
          </span>
        )}
      </div>

      {/* ── Card body ── */}
      <div
        className={`p-4 flex flex-col flex-1 gap-2 ${canClick ? "cursor-pointer" : ""}`}
        onClick={canClick ? () => onProductClick(product) : undefined}
      >
        {marque && (
          <span className="self-start text-[10px] font-extrabold text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-0.5 uppercase tracking-widest">
            {marque}
          </span>
        )}

        <h3 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2 min-h-[2.5rem]">
          {modele || marque || "—"}
        </h3>

        {(annee || type) && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {annee && (
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 rounded px-1.5 py-0.5">{annee}</span>
            )}
            {annee && type && <span className="text-gray-300 text-xs">·</span>}
            {type && <span className="text-[11px] text-gray-400 truncate">{type}</span>}
          </div>
        )}

        {reference && (
          <span className="self-start text-[10px] font-mono text-gray-500 bg-slate-50 border border-slate-200 rounded px-2 py-0.5">
            Réf : {reference}
          </span>
        )}

        {/* Price + CTA pinned to bottom */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex flex-col gap-2.5">
          {prix != null ? (
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-blue-600 tracking-tight leading-none">
                {prix.toLocaleString("fr-MA")}
              </span>
              <span className="text-sm font-bold text-blue-400">DH</span>
            </div>
          ) : (
            <span className="text-sm font-semibold text-gray-400 italic">Contactez-nous</span>
          )}

          {canClick && (
            <button
              onClick={e => { e.stopPropagation(); onProductClick(product); }}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline underline-offset-2 text-left transition-colors"
            >
              Voir les détails →
            </button>
          )}

          <a
            href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`}
            target="_blank"
            rel="noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] active:scale-95 text-white text-sm font-bold py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-green-200/60"
          >
            <WaIcon size={15} />
            Commander sur WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Special Order Banner ──────────────────────────────────────────────────────
function SpecialOrderBanner({ textQuery, brand, model, year }) {
  const SKIP = ["Toutes marques", "Tous modèles", "Toutes années"];

  const brandModel = [brand, model].filter(s => s && !SKIP.includes(s)).join(" ");
  const cleanYear  = year  && !SKIP.includes(year)  ? year  : null;
  const cleanText  = textQuery?.trim() || null;

  // Display chip — shows everything the user searched for
  const displayParts = [brandModel, cleanText].filter(Boolean);
  if (cleanYear) displayParts.push(cleanYear);
  const displayTerm = displayParts.join(" · ") || null;

  // WhatsApp message — structured, professional French
  const lines = ["Bonjour MY Auto Pièces 👋", "", "Je cherche la pièce suivante :"];
  if (brandModel) lines.push(`*${brandModel}*`);
  if (cleanText)  lines.push(cleanText);
  if (cleanYear)  lines.push(`Année : ${cleanYear}`);
  lines.push("", "Est-elle disponible ?");
  const waMsg = encodeURIComponent(lines.join("\n"));
  return (
    <div style={{ padding: "0 16px 32px", marginTop: 8 }}>
      <div style={{ position: "relative", overflow: "hidden", borderRadius: 20, background: "linear-gradient(135deg,#1535A0 0%,#1D4ED8 60%,#2563EB 100%)", padding: "24px 20px", color: "#fff", boxShadow: "0 12px 40px rgba(21,53,160,0.3)" }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }}/>
        <div style={{ position: "absolute", bottom: -24, left: 60, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }}/>

        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,0.15)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
              🔍
            </div>
            <div>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "2px", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", marginBottom: 3 }}>Commande Spéciale</p>
              <h3 style={{ fontSize: 16, fontWeight: 900, margin: 0, lineHeight: 1.2 }}>Pièce introuvable ?</h3>
            </div>
          </div>

          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.65, margin: 0 }}>
            Nous pouvons sourcer <strong style={{ color: "#fff" }}>n'importe quelle optique</strong> pour votre véhicule.
            Envoyez votre demande, on s'occupe du reste.
          </p>

          {displayTerm && (
            <div style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, padding: "8px 12px", fontSize: 12, color: "rgba(255,255,255,0.9)" }}>
              Recherche : <strong style={{ color: "#fff" }}>"{displayTerm}"</strong>
            </div>
          )}

          <a
            href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`}
            target="_blank"
            rel="noreferrer"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#25D366", color: "#fff", borderRadius: 14, padding: "13px 20px", fontSize: 14, fontWeight: 800, textDecoration: "none", fontFamily: "'Inter',sans-serif", boxShadow: "0 4px 16px rgba(37,211,102,0.35)", transition: "background 0.2s", letterSpacing: "0.1px" }}
            onMouseEnter={e => e.currentTarget.style.background = "#1ebe5d"}
            onMouseLeave={e => e.currentTarget.style.background = "#25D366"}
          >
            <WaIcon size={16} /> Faire une demande spéciale
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton loader ───────────────────────────────────────────────────────────
function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 pb-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-200" />
          <div className="p-4 space-y-3">
            <div className="h-2.5 bg-gray-200 rounded-full w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-10 bg-gray-200 rounded-xl mt-3" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function ProductGrid({ brand, model, year, type, onProductClick }) {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [textQuery, setTextQuery] = useState("");

  useEffect(() => {
    if (!supabase) {
      setError("Configuration Supabase manquante — vérifiez le fichier .env");
      setLoading(false);
      return;
    }
    supabase
      .from("products")
      .select("*")
      .then(({ data, error: fetchError }) => {
        if (fetchError) {
          console.error("[ProductGrid] Supabase error:", fetchError);
          setError(fetchError.message);
        } else {
          setProducts(data ?? []);
        }
        setLoading(false);
      });
  }, []);

  const SKIP = { brand: "Toutes marques", model: "Tous modèles", year: "Toutes années", type: "Tous types" };
  const ci  = (a, b) => String(a).trim().toLowerCase() === String(b).trim().toLowerCase();
  const has = (val, q) => String(val).toLowerCase().includes(q.toLowerCase().trim());

  const filtered = products.filter(p => {
    if (brand && brand !== SKIP.brand && !ci(field(p, "Marque",  "marque"),                    brand)) return false;
    if (model && model !== SKIP.model && !ci(field(p, "Modèle",  "Modele", "modele", "model"), model)) return false;
    if (year  && year  !== SKIP.year  && !ci(field(p, "Année",   "Annee",  "annee",  "year"),  year))  return false;
    if (type  && type  !== SKIP.type  && !ci(field(p, "Type",    "type"),                      type))  return false;
    if (textQuery.trim()) {
      const q = textQuery.trim();
      const haystack = [
        field(p, "Marque",    "marque"),
        field(p, "Modèle",    "Modele",    "modele",    "model"),
        field(p, "Année",     "Annee",     "annee",     "year"),
        field(p, "Type",      "type"),
        field(p, "Côté",      "Cote",      "cote",      "side"),
        field(p, "Référence", "Reference", "reference", "ref"),
      ];
      if (!haystack.some(f => has(f, q))) return false;
    }
    return true;
  });

  if (loading) return <SkeletonGrid />;

  if (error) return (
    <div className="p-10 text-center">
      <p className="text-red-500 font-bold text-sm mb-2">Erreur de chargement</p>
      <p className="text-gray-400 text-xs font-mono bg-gray-50 rounded-lg px-4 py-2 inline-block">{error}</p>
    </div>
  );

  return (
    <div>
      {/* Search bar */}
      <div className="px-4 pb-4">
        <div className="relative max-w-sm">
          <SearchIcon />
          <input
            type="text"
            value={textQuery}
            onChange={e => setTextQuery(e.target.value)}
            placeholder="Recherche rapide : Clio, phare, 2020…"
            className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          {textQuery && (
            <button onClick={() => setTextQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Result count */}
      <div className="px-4 pb-3">
        <span className="text-xs font-semibold text-gray-400">
          {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
          {textQuery && <> pour <span className="font-semibold text-gray-600">"{textQuery}"</span></>}
        </span>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 pb-6">
          {filtered.map((p, i) => (
            <ProductCard key={p?.id ?? i} product={p} onProductClick={onProductClick} />
          ))}
        </div>
      ) : products.length === 0 ? (
        /* Catalog empty — no products at all */
        <div style={{ padding: "48px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 14 }}>📦</div>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Catalogue en cours de mise à jour</p>
          <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 22 }}>Les produits arrivent bientôt — revenez dans quelques instants.</p>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Bonjour MY Auto Pièces 👋\nJe cherche une optique — pouvez-vous m'aider ?")}`}
            target="_blank" rel="noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#25D366", color: "#fff", borderRadius: 14, padding: "12px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none", fontFamily: "'Inter',sans-serif", boxShadow: "0 4px 14px rgba(37,211,102,0.3)" }}
          >
            <WaIcon size={16} /> Nous contacter
          </a>
        </div>
      ) : (
        /* Filters returned 0 results */
        <div style={{ padding: "36px 16px 12px", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#F1F5F9", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
            🔍
          </div>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 6 }}>
            Aucune pièce trouvée
          </p>
          <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 4 }}>
            Aucun résultat pour cette sélection. Essayez d'élargir vos filtres.
          </p>
        </div>
      )}

      {!loading && filtered.length === 0 && products.length > 0 && (
        <SpecialOrderBanner textQuery={textQuery} brand={brand} model={model} year={year} />
      )}
      {!loading && filtered.length === 0 && products.length === 0 && null}
    </div>
  );
}
