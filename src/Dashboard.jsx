import { useState, useEffect, useRef } from "react";
import { supabase } from "./lib/supabaseClient";

// ── Auth ──────────────────────────────────────────────────────────────────────
const DASHBOARD_PASSWORD = "200624tt";
const SESSION_KEY        = "myauto_auth";

// ── Supabase column names — must match your table exactly ─────────────────────
//    Marque | Modele | Annee | Type | Cote | Condition | Reference | Prix | Image
const EMPTY = {
  Modele:    "",
  Reference: "",
  Marque:    "",
  Annee:     "",
  Type:      "",
  Cote:      "",
  Condition: "",
  Prix:      "",
  Image:     "",
};

// [column_key, placeholder, required]
const FORM_FIELDS = [
  ["Modele",    "Modèle / Désignation *",   true ],
  ["Reference", "Référence",                false],
  ["Marque",    "Marque (ex: Dacia)",        false],
  ["Annee",     "Année (ex: 2019)",          false],
  ["Type",      "Type (ex: Phare avant)",    false],
  ["Cote",      "Côté (Gauche / Droit)",     false],
  ["Condition", "État (neuf / occasion)",    false],
  ["Prix",      "Prix en MAD",               false],
  ["Image",     "Nom du fichier image",      false],
];

// Columns shown in the table
const TABLE_COLS = [
  { key: "Modele",    label: "Modèle"     },
  { key: "Reference", label: "Référence"  },
  { key: "Marque",    label: "Marque"     },
  { key: "Annee",     label: "Année"      },
  { key: "Type",      label: "Type"       },
  { key: "Cote",      label: "Côté"       },
  { key: "Condition", label: "État"       },
  { key: "Prix",      label: "Prix"       },
];

// ── CSV export ────────────────────────────────────────────────────────────────
function exportCSV(products) {
  const headers = [...TABLE_COLS.map(c => c.label), "Image"];
  const keys    = [...TABLE_COLS.map(c => c.key),   "Image"];
  const escape  = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows    = [headers, ...products.map(p => keys.map(k => p[k] ?? ""))];
  const csv     = "﻿" + rows.map(r => r.map(escape).join(";")).join("\r\n");
  const blob    = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url     = URL.createObjectURL(blob);
  const a       = Object.assign(document.createElement("a"), {
    href: url,
    download: `myauto_produits_${new Date().toISOString().slice(0, 10)}.csv`,
  });
  a.click();
  URL.revokeObjectURL(url);
}

// ── Convert form → Supabase row (trim + empty string → null) ─────────────────
function formToRow(form) {
  const row = {};
  for (const [key] of FORM_FIELDS) {
    const v = String(form[key] ?? "").trim();
    row[key] = v || null;
  }
  return row;
}

// ── Login screen ──────────────────────────────────────────────────────────────
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
      setError(true); setShake(true); setPwd("");
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", fontFamily: "'Inter',sans-serif",
        display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16,
          padding: "40px 36px", width: 340, boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          animation: shake ? "shake .45s ease" : "none" }}>

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
            textAlign: "center", letterSpacing: ".5px" }}>DASHBOARD</h2>
        <p style={{ margin: "0 0 24px", fontSize: 12, color: "#9CA3AF", textAlign: "center" }}>
          MY AUTO PIÈCES — accès réservé
        </p>

        <input ref={inputRef} type="password" placeholder="Mot de passe"
          value={pwd}
          onChange={e => { setPwd(e.target.value); setError(false); }}
          onKeyDown={e => e.key === "Enter" && attempt()}
          style={{ width: "100%", boxSizing: "border-box",
            border: `1.5px solid ${error ? "#FCA5A5" : "#E5E7EB"}`,
            background: error ? "#FFF5F5" : "#fff",
            borderRadius: 9, padding: "11px 14px", fontSize: 14,
            fontFamily: "'Inter',sans-serif", outline: "none", color: "#111827",
            marginBottom: error ? 8 : 16 }}
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

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard({ onBack }) {
  const [auth, setAuth]         = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  const [products, setProducts] = useState([]);
  const [form, setForm]         = useState(EMPTY);
  const [search, setSearch]     = useState("");
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(null); // id currently being deleted

  // ── Load all products from Supabase ─────────────────────────────────────
  useEffect(() => {
    if (!auth) return;
    setLoading(true);
    supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          alert("Erreur de chargement Supabase :\n" + error.message);
        } else {
          setProducts(data ?? []);
        }
        setLoading(false);
      });
  }, [auth]);

  // ── Add product → Supabase ───────────────────────────────────────────────
  async function add() {
    const label = form.Modele.trim();
    if (!label) {
      alert("Le champ \"Modèle\" est obligatoire.");
      return;
    }

    setSaving(true);

    const row = formToRow(form);
    const { data, error } = await supabase
      .from("products")
      .insert([row])
      .select(); // returns the inserted row with its generated id

    if (error) {
      alert("Erreur Supabase lors de l'ajout :\n" + error.message);
    } else {
      // Prepend to local list so it appears immediately at the top
      setProducts(prev => [data[0], ...prev]);
      setForm(EMPTY);
      alert(`✅ Pièce ajoutée avec succès !\n\nModèle : ${label}`);
    }

    setSaving(false);
  }

  // ── Delete product from Supabase ─────────────────────────────────────────
  async function remove(id, label) {
    const confirmed = window.confirm(`Supprimer "${label || "cette pièce"}" ?`);
    if (!confirmed) return;

    setDeleting(id);
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Erreur Supabase lors de la suppression :\n" + error.message);
    } else {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
    setDeleting(null);
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    setAuth(false);
  }

  // ── Client-side search filter ────────────────────────────────────────────
  const visible = search.trim()
    ? products.filter(p =>
        TABLE_COLS.some(({ key }) =>
          String(p[key] ?? "").toLowerCase().includes(search.toLowerCase().trim())
        )
      )
    : products;

  const TH = { padding: "11px 14px", textAlign: "left", fontWeight: 700,
    fontSize: 11, letterSpacing: "1px", color: "#6B7280" };
  const TD = { padding: "11px 14px", color: "#374151", fontSize: 13 };

  if (!auth) return <LoginScreen onSuccess={() => setAuth(true)} />;

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Inter',sans-serif" }}>

      {/* ── Header ── */}
      <div style={{ background: "#1535A0", padding: "14px 24px",
          display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>

        <button onClick={onBack}
          style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff",
            borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          ← Retour
        </button>

        <span style={{ color: "#fff", fontWeight: 800, fontSize: 15, letterSpacing: "1.5px" }}>
          DASHBOARD — PRODUITS
        </span>

        {/* Count badge */}
        <span style={{ background: "rgba(255,255,255,0.15)", color: "#fff",
            borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>
          {loading ? "…" : `${products.length} pièce${products.length !== 1 ? "s" : ""}`}
        </span>

        {/* Live indicator */}
        <span style={{ display: "flex", alignItems: "center", gap: 5,
            background: "rgba(37,211,102,0.18)", border: "1px solid rgba(37,211,102,0.35)",
            color: "#86EFAC", borderRadius: 20, padding: "4px 12px",
            fontSize: 11, fontWeight: 700 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%",
              background: "#25D366", display: "inline-block" }} />
          Supabase Live
        </span>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button
            onClick={() => exportCSV(products)}
            disabled={products.length === 0}
            style={{ display: "flex", alignItems: "center", gap: 6,
              background: products.length === 0 ? "rgba(255,255,255,0.08)" : "#217346",
              border: "none",
              color: products.length === 0 ? "rgba(255,255,255,0.3)" : "#fff",
              borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 700,
              cursor: products.length === 0 ? "default" : "pointer" }}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
              <path d="M14 2v6h6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            Export Excel
          </button>

          <button onClick={logout}
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.75)", borderRadius: 8, padding: "7px 13px",
              fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            Déconnexion
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px" }}>

        {/* ── Add form ── */}
        <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB",
            borderRadius: 12, padding: "22px", marginBottom: 28 }}>

          <div style={{ marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: 12, fontWeight: 700,
                letterSpacing: "1.5px", color: "#1535A0" }}>
              AJOUTER UNE PIÈCE
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: 11, color: "#9CA3AF" }}>
              La pièce sera enregistrée directement dans Supabase et apparaîtra immédiatement sur le site.
            </p>
          </div>

          <div style={{ display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(158px, 1fr))", gap: 10 }}>

            {FORM_FIELDS.map(([key, ph, required]) => (
              <input
                key={key}
                placeholder={ph}
                value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && add()}
                style={{
                  border: "1.5px solid #E5E7EB",
                  borderRadius: 8, padding: "10px 12px",
                  fontSize: 13, fontFamily: "'Inter',sans-serif",
                  outline: "none", background: "#fff", color: "#111827",
                  transition: "border-color .15s",
                }}
                onFocus={e => (e.target.style.borderColor = "#1535A0")}
                onBlur={e  => (e.target.style.borderColor = "#E5E7EB")}
              />
            ))}

            {/* Submit button */}
            <button
              onClick={add}
              disabled={saving || !form.Modele.trim()}
              style={{
                background: saving || !form.Modele.trim() ? "#93C5FD" : "#1535A0",
                color: "#fff", border: "none", borderRadius: 8,
                padding: "10px 18px", fontSize: 13, fontWeight: 700,
                cursor: saving || !form.Modele.trim() ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                transition: "background .2s",
              }}>
              {saving ? (
                <>
                  <span style={{
                    width: 13, height: 13,
                    border: "2px solid rgba(255,255,255,0.35)",
                    borderTopColor: "#fff", borderRadius: "50%",
                    display: "inline-block", animation: "spin .7s linear infinite",
                  }} />
                  Enregistrement…
                </>
              ) : (
                <>+ Ajouter</>
              )}
            </button>
          </div>
        </div>

        {/* ── Search bar + count ── */}
        <div style={{ marginBottom: 14, display: "flex",
            justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, color: "#6B7280" }}>
            {loading
              ? "Chargement depuis Supabase…"
              : `${visible.length} résultat${visible.length !== 1 ? "s" : ""}${search ? ` pour "${search}"` : ""}`}
          </span>
          <input
            placeholder="Rechercher…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: "1.5px solid #E5E7EB", borderRadius: 8,
              padding: "8px 14px", fontSize: 13, fontFamily: "'Inter',sans-serif",
              outline: "none", width: 200 }}
            onFocus={e => (e.target.style.borderColor = "#1535A0")}
            onBlur={e  => (e.target.style.borderColor = "#E5E7EB")}
          />
        </div>

        {/* ── Products table ── */}
        <div style={{ border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                  {[...TABLE_COLS.map(c => c.label), ""].map((h, i) => (
                    <th key={i} style={TH}>{h.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* Loading state */}
                {loading && (
                  <tr>
                    <td colSpan={TABLE_COLS.length + 1}
                        style={{ padding: 48, textAlign: "center", color: "#9CA3AF" }}>
                      <div style={{ display: "flex", alignItems: "center",
                          justifyContent: "center", gap: 10 }}>
                        <span style={{ width: 16, height: 16,
                          border: "2px solid #E5E7EB", borderTopColor: "#1535A0",
                          borderRadius: "50%", display: "inline-block",
                          animation: "spin .7s linear infinite" }} />
                        Chargement depuis Supabase…
                      </div>
                    </td>
                  </tr>
                )}

                {/* Empty state */}
                {!loading && visible.length === 0 && (
                  <tr>
                    <td colSpan={TABLE_COLS.length + 1}
                        style={{ padding: 48, textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>
                      {products.length === 0
                        ? "Aucun produit dans Supabase — ajoutez votre première pièce ci-dessus."
                        : `Aucun résultat pour "${search}".`}
                    </td>
                  </tr>
                )}

                {/* Data rows */}
                {!loading && visible.map((p, i) => (
                  <tr key={p.id}
                    style={{ borderBottom: "1px solid #F3F4F6",
                      background: i % 2 === 0 ? "#fff" : "#FAFAFA",
                      opacity: deleting === p.id ? 0.4 : 1,
                      transition: "opacity .2s" }}>

                    {/* Modele */}
                    <td style={{ ...TD, fontWeight: 600, color: "#111827", minWidth: 140 }}>
                      {p.Modele || <span style={{ color: "#D1D5DB" }}>—</span>}
                    </td>

                    {/* Reference */}
                    <td style={{ ...TD, fontFamily: "monospace", fontSize: 11, color: "#6B7280" }}>
                      {p.Reference || "—"}
                    </td>

                    {/* Marque */}
                    <td style={TD}>
                      {p.Marque ? (
                        <span style={{ background: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE",
                          borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>
                          {p.Marque}
                        </span>
                      ) : "—"}
                    </td>

                    {/* Annee */}
                    <td style={TD}>{p.Annee || "—"}</td>

                    {/* Type */}
                    <td style={{ ...TD, maxWidth: 130, overflow: "hidden",
                        textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.Type || "—"}
                    </td>

                    {/* Cote */}
                    <td style={TD}>{p.Cote || "—"}</td>

                    {/* Condition */}
                    <td style={TD}>
                      {p.Condition ? (
                        <span style={{
                          background: p.Condition === "neuf" ? "#D1FAE5" : "#FEF3C7",
                          color:      p.Condition === "neuf" ? "#059669" : "#D97706",
                          border:     `1px solid ${p.Condition === "neuf" ? "#6EE7B7" : "#FDE68A"}`,
                          borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700,
                        }}>
                          {p.Condition}
                        </span>
                      ) : "—"}
                    </td>

                    {/* Prix */}
                    <td style={{ ...TD, fontWeight: 700, color: "#1535A0" }}>
                      {p.Prix ? `${p.Prix} DH` : "—"}
                    </td>

                    {/* Delete button */}
                    <td style={{ ...TD, whiteSpace: "nowrap" }}>
                      <button
                        onClick={() => remove(p.id, p.Modele)}
                        disabled={deleting === p.id}
                        style={{ background: "#FEF2F2", border: "1px solid #FECACA",
                          color: "#DC2626", borderRadius: 6, padding: "5px 12px",
                          fontSize: 12, fontWeight: 600,
                          cursor: deleting === p.id ? "default" : "pointer",
                          opacity: deleting === p.id ? 0.5 : 1 }}>
                        {deleting === p.id ? "…" : "Supprimer"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
