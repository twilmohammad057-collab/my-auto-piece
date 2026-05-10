import { useState, useEffect, useRef } from "react";

// ── Mot de passe — changez ici ──────────────────────────
const DASHBOARD_PASSWORD = "200624tt";
const SESSION_KEY        = "myauto_auth";
const STORAGE_KEY        = "myauto_products";

// ────────────────────────────────────────────────────────
function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

const EMPTY = { label: "", ref: "", marque: "", modele: "", annee: "", type: "", prix: "" };

const FIELDS = [
  ["label",  "Désignation *"],
  ["ref",    "Référence"],
  ["marque", "Marque"],
  ["modele", "Modèle"],
  ["annee",  "Année"],
  ["type",   "Type"],
  ["prix",   "Prix (MAD)"],
];

const HEADERS = ["Désignation", "Référence", "Marque", "Modèle", "Année", "Type", "Prix (MAD)"];
const KEYS    = ["label", "ref", "marque", "modele", "annee", "type", "prix"];

const TH = { padding: "11px 14px", textAlign: "left", fontWeight: 700,
  fontSize: 11, letterSpacing: "1px", color: "#6B7280" };
const TD = { padding: "11px 14px" };

// ── Export CSV (Excel-compatible, UTF-8 BOM) ─────────────
function exportCSV(products) {
  const escape = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows   = [HEADERS, ...products.map(p => KEYS.map(k => p[k] ?? ""))];
  const csv    = "﻿" + rows.map(r => r.map(escape).join(";")).join("\r\n");
  const blob   = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url    = URL.createObjectURL(blob);
  const a      = document.createElement("a");
  a.href       = url;
  a.download   = `myauto_produits_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Écran de connexion ───────────────────────────────────
function LoginScreen({ onSuccess }) {
  const [pwd, setPwd]     = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef          = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  function attempt() {
    if (pwd === DASHBOARD_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setPwd("");
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", fontFamily: "'Inter',sans-serif",
        display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
          background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16,
          padding: "40px 36px", width: 340, boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          animation: shake ? "shake .45s ease" : "none",
        }}>

        {/* Lock icon */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
          <div style={{ width: 52, height: 52, background: "#EEF2FF", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#1535A0" strokeWidth="2"
                strokeLinecap="round" width="24" height="24">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
        </div>

        <h2 style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 800, color: "#111827",
            textAlign: "center", letterSpacing: ".5px" }}>
          DASHBOARD
        </h2>
        <p style={{ margin: "0 0 24px", fontSize: 12, color: "#9CA3AF", textAlign: "center" }}>
          MY AUTO PIÈCES — accès réservé
        </p>

        <input ref={inputRef} type="password" placeholder="Mot de passe"
          value={pwd}
          onChange={e => { setPwd(e.target.value); setError(false); }}
          onKeyDown={e => e.key === "Enter" && attempt()}
          style={{
            width: "100%", boxSizing: "border-box",
            border: `1.5px solid ${error ? "#FCA5A5" : "#E5E7EB"}`,
            background: error ? "#FFF5F5" : "#fff",
            borderRadius: 9, padding: "11px 14px", fontSize: 14,
            fontFamily: "'Inter',sans-serif", outline: "none", color: "#111827",
            marginBottom: error ? 8 : 16,
          }}
        />

        {error && (
          <p style={{ margin: "0 0 14px", fontSize: 12, color: "#DC2626", textAlign: "center" }}>
            Mot de passe incorrect
          </p>
        )}

        <button onClick={attempt}
          style={{ width: "100%", background: "#1535A0", color: "#fff", border: "none",
            borderRadius: 9, padding: "12px", fontSize: 14, fontWeight: 700,
            cursor: "pointer", letterSpacing: ".5px" }}>
          Accéder
        </button>
      </div>

      <style>{`
        @keyframes shake {
          0%,100%{ transform:translateX(0) }
          20%    { transform:translateX(-8px) }
          40%    { transform:translateX(8px) }
          60%    { transform:translateX(-6px) }
          80%    { transform:translateX(6px) }
        }
      `}</style>
    </div>
  );
}

// ── Dashboard principal ──────────────────────────────────
export default function Dashboard({ onBack }) {
  const [auth, setAuth]       = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  const [products, setProducts] = useState(load);
  const [form, setForm]         = useState(EMPTY);
  const [search, setSearch]     = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  function add() {
    if (!form.label.trim()) return;
    setProducts(prev => [...prev, { ...form, id: Date.now() }]);
    setForm(EMPTY);
  }

  function remove(id) {
    setProducts(prev => prev.filter(p => p.id !== id));
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    setAuth(false);
  }

  const visible = products.filter(p =>
    FIELDS.some(([k]) => p[k]?.toLowerCase().includes(search.toLowerCase()))
  );

  if (!auth) return <LoginScreen onSuccess={() => setAuth(true)} />;

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Inter',sans-serif" }}>

      {/* ── Header ── */}
      <div style={{ background: "#1535A0", padding: "14px 24px", display: "flex",
          alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <button onClick={onBack}
          style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff",
            borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          ← Retour
        </button>
        <span style={{ color: "#fff", fontWeight: 800, fontSize: 15, letterSpacing: "1.5px" }}>
          DASHBOARD — PRODUITS
        </span>
        <span style={{ background: "rgba(255,255,255,0.15)", color: "#fff",
            borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>
          {products.length} pièce{products.length !== 1 ? "s" : ""}
        </span>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {/* Export Excel */}
          <button onClick={() => exportCSV(products)} disabled={products.length === 0}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: products.length === 0 ? "rgba(255,255,255,0.08)" : "#217346",
              border: "none", color: products.length === 0 ? "rgba(255,255,255,0.35)" : "#fff",
              borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 700,
              cursor: products.length === 0 ? "default" : "pointer", letterSpacing: ".3px",
            }}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
              <path d="M14 2v6h6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 13h2.5M13.5 13H16M8 16.5h2.5M13.5 16.5H16M8 10h8"
                fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            Export Excel
          </button>

          {/* Déconnexion */}
          <button onClick={logout}
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.75)", borderRadius: 8, padding: "7px 13px",
              fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            Déconnexion
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px" }}>

        {/* ── Formulaire ajout ── */}
        <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB",
            borderRadius: 12, padding: "20px", marginBottom: 28 }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 12, fontWeight: 700,
              letterSpacing: "1.5px", color: "#1535A0" }}>
            AJOUTER UNE PIÈCE
          </h3>
          <div style={{ display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(155px,1fr))", gap: 10 }}>
            {FIELDS.map(([key, ph]) => (
              <input key={key} placeholder={ph} value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && add()}
                style={{ border: "1.5px solid #E5E7EB", borderRadius: 8, padding: "9px 12px",
                  fontSize: 13, fontFamily: "'Inter',sans-serif", outline: "none",
                  background: "#fff", color: "#111827" }}
                onFocus={e => (e.target.style.borderColor = "#1535A0")}
                onBlur={e  => (e.target.style.borderColor = "#E5E7EB")}
              />
            ))}
            <button onClick={add}
              style={{ background: "#1535A0", color: "#fff", border: "none",
                borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 700,
                cursor: "pointer", letterSpacing: ".5px" }}>
              + Ajouter
            </button>
          </div>
        </div>

        {/* ── Barre recherche + Export ── */}
        <div style={{ marginBottom: 14, display: "flex",
            justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, color: "#6B7280" }}>
            {visible.length} résultat{visible.length !== 1 ? "s" : ""}
            {search && ` pour "${search}"`}
          </span>
          <input placeholder="Rechercher..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ border: "1.5px solid #E5E7EB", borderRadius: 8, padding: "8px 14px",
              fontSize: 13, fontFamily: "'Inter',sans-serif", outline: "none", width: 220 }}
            onFocus={e => (e.target.style.borderColor = "#1535A0")}
            onBlur={e  => (e.target.style.borderColor = "#E5E7EB")}
          />
        </div>

        {/* ── Tableau ── */}
        <div style={{ border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                  {[...HEADERS, ""].map(h => (
                    <th key={h} style={TH}>{h.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: "44px", textAlign: "center",
                        color: "#9CA3AF", fontSize: 13 }}>
                      {products.length === 0
                        ? "Aucun produit — ajoutez votre première pièce ci-dessus."
                        : `Aucun résultat pour "${search}".`}
                    </td>
                  </tr>
                ) : visible.map((p, i) => (
                  <tr key={p.id}
                    style={{ borderBottom: "1px solid #F3F4F6",
                      background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ ...TD, fontWeight: 600, color: "#111827" }}>{p.label}</td>
                    <td style={{ ...TD, color: "#6B7280", fontFamily: "monospace",
                        fontSize: 12 }}>{p.ref || "—"}</td>
                    <td style={{ ...TD, color: "#374151" }}>{p.marque || "—"}</td>
                    <td style={{ ...TD, color: "#374151" }}>{p.modele || "—"}</td>
                    <td style={{ ...TD, color: "#374151" }}>{p.annee  || "—"}</td>
                    <td style={{ ...TD, color: "#374151" }}>{p.type   || "—"}</td>
                    <td style={{ ...TD, fontWeight: 700, color: "#1535A0" }}>
                      {p.prix ? `${p.prix} DH` : "—"}
                    </td>
                    <td style={TD}>
                      <button onClick={() => remove(p.id)}
                        style={{ background: "#FEF2F2", border: "1px solid #FECACA",
                          color: "#DC2626", borderRadius: 6, padding: "5px 10px",
                          fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

