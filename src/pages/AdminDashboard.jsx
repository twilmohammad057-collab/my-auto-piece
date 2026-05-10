import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient";

// ── Auth ──────────────────────────────────────────────────────────────────────
const PASSWORD    = "200624tt";
const SESSION_KEY = "myauto_admin_v2";

// ── Supabase column definitions ───────────────────────────────────────────────
// Each entry: [key, short label, input type, flex weight]
const COLS = [
  { key: "Modele",    label: "Modèle",     type: "text",   w: 2   },
  { key: "Marque",    label: "Marque",     type: "text",   w: 1   },
  { key: "Annee",     label: "Année",      type: "text",   w: 0.8 },
  { key: "Type",      label: "Type",       type: "text",   w: 1.5 },
  { key: "Cote",      label: "Côté",       type: "text",   w: 0.8 },
  { key: "Reference", label: "Référence",  type: "text",   w: 1   },
  { key: "Condition", label: "État",       type: "text",   w: 0.8 },
  { key: "Prix",      label: "Prix (DH)",  type: "text",   w: 0.8 },
  { key: "Image",     label: "Image",      type: "text",   w: 1   },
];

const EMPTY_FORM = Object.fromEntries(COLS.map(c => [c.key, ""]));

// ── Helpers ───────────────────────────────────────────────────────────────────
const s = (v) => String(v ?? "").trim() || null; // empty string → null

function formToRow(f) {
  return Object.fromEntries(COLS.map(({ key }) => [key, s(f[key])]));
}

// ── Optics keywords — used for the default Supabase filter ───────────────────
const OPTICS_FILTER = [
  "phare", "optique", "feu", "clignotant", "antibrouillard",
  "position", "led", "xenon", "bloc",
];

function buildOpticsFilter() {
  return OPTICS_FILTER.map(k => `Type.ilike.%${k}%`).join(",");
}

// ── CSV export ────────────────────────────────────────────────────────────────
function exportCSV(rows) {
  const esc  = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const hdrs = COLS.map(c => c.label);
  const data = rows.map(r => COLS.map(c => r[c.key] ?? ""));
  const csv  = "﻿" + [hdrs, ...data].map(r => r.map(esc).join(";")).join("\r\n");
  const url  = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  Object.assign(document.createElement("a"), {
    href: url,
    download: `optiques_${new Date().toISOString().slice(0, 10)}.csv`,
  }).click();
  URL.revokeObjectURL(url);
}

// ── Pill component ────────────────────────────────────────────────────────────
function Pill({ children, color = "blue" }) {
  const palettes = {
    blue:  { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
    green: { bg: "#D1FAE5", text: "#059669", border: "#6EE7B7" },
    amber: { bg: "#FEF3C7", text: "#D97706", border: "#FDE68A" },
  };
  const p = palettes[color] ?? palettes.blue;
  return (
    <span style={{ background: p.bg, color: p.text, border: `1px solid ${p.border}`,
      borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700,
      whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

// ── Login ─────────────────────────────────────────────────────────────────────
function Login({ onSuccess }) {
  const [pwd, setPwd]     = useState("");
  const [err, setErr]     = useState(false);
  const [shake, setShake] = useState(false);
  const ref               = useRef(null);

  useEffect(() => { ref.current?.focus(); }, []);

  function attempt() {
    if (pwd === PASSWORD) { sessionStorage.setItem(SESSION_KEY, "1"); onSuccess(); }
    else { setErr(true); setShake(true); setPwd(""); setTimeout(() => setShake(false), 450); }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: "#F9FAFB", fontFamily: "'Inter',sans-serif" }}>
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16,
          padding: "40px 36px", width: 340, boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          animation: shake ? "shake .45s ease" : "none" }}>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div style={{ width: 50, height: 50, background: "#EEF2FF", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#1535A0" strokeWidth="2"
                strokeLinecap="round" width="22" height="22">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
        </div>

        <h2 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 800, textAlign: "center",
            color: "#111827", letterSpacing: ".5px" }}>ADMIN — OPTIQUES</h2>
        <p style={{ margin: "0 0 22px", fontSize: 12, color: "#9CA3AF", textAlign: "center" }}>
          MY AUTO PIÈCES
        </p>

        <input ref={ref} type="password" placeholder="Mot de passe" value={pwd}
          onChange={e => { setPwd(e.target.value); setErr(false); }}
          onKeyDown={e => e.key === "Enter" && attempt()}
          style={{ width: "100%", boxSizing: "border-box", padding: "11px 14px",
            border: `1.5px solid ${err ? "#FCA5A5" : "#E5E7EB"}`,
            background: err ? "#FFF5F5" : "#fff",
            borderRadius: 9, fontSize: 14, fontFamily: "inherit",
            outline: "none", color: "#111827", marginBottom: err ? 8 : 16 }} />
        {err && <p style={{ margin: "0 0 12px", fontSize: 12, color: "#DC2626",
            textAlign: "center" }}>Mot de passe incorrect</p>}

        <button onClick={attempt}
          style={{ width: "100%", background: "#1535A0", color: "#fff", border: "none",
            borderRadius: 9, padding: "12px", fontSize: 14, fontWeight: 700,
            cursor: "pointer" }}>
          Accéder
        </button>
      </div>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}`}</style>
    </div>
  );
}

// ── Inline editable row ───────────────────────────────────────────────────────
function ProductRow({ product, onSave, onDelete, rowIndex }) {
  const [editing, setEditing]   = useState(false);
  const [draft,   setDraft]     = useState({});
  const [saving,  setSaving]    = useState(false);
  const [deleting, setDeleting] = useState(false);

  function startEdit() {
    setDraft(Object.fromEntries(COLS.map(c => [c.key, product[c.key] ?? ""])));
    setEditing(true);
  }

  function cancelEdit() { setEditing(false); setDraft({}); }

  async function save() {
    setSaving(true);
    const row = formToRow(draft);
    const { error } = await supabase
      .from("products")
      .update(row)
      .eq("id", product.id);

    if (error) {
      alert("Erreur lors de la mise à jour :\n" + error.message);
    } else {
      onSave({ ...product, ...row });
      setEditing(false);
    }
    setSaving(false);
  }

  async function del() {
    if (!window.confirm(`Supprimer "${product.Modele || "cette pièce"}" ?`)) return;
    setDeleting(true);
    const { error } = await supabase.from("products").delete().eq("id", product.id);
    if (error) {
      alert("Erreur lors de la suppression :\n" + error.message);
      setDeleting(false);
    } else {
      onDelete(product.id);
    }
  }

  const bg = rowIndex % 2 === 0 ? "#fff" : "#FAFAFA";
  const TD = { padding: "10px 12px", verticalAlign: "middle", fontSize: 13 };

  return (
    <tr style={{ borderBottom: "1px solid #F3F4F6", background: bg,
        opacity: deleting ? 0.4 : 1, transition: "opacity .2s" }}>

      {editing ? (
        /* ── Edit mode ── */
        <>
          {COLS.map(({ key, type }) => (
            <td key={key} style={TD}>
              <input
                type={type}
                value={draft[key]}
                onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))}
                style={{ width: "100%", minWidth: 70, border: "1.5px solid #1535A0",
                  borderRadius: 6, padding: "6px 8px", fontSize: 12,
                  fontFamily: "'Inter',sans-serif", outline: "none",
                  background: "#EFF6FF", color: "#111827", boxSizing: "border-box" }}
              />
            </td>
          ))}
          <td style={{ ...TD, whiteSpace: "nowrap" }}>
            <button onClick={save} disabled={saving}
              style={{ background: "#059669", color: "#fff", border: "none",
                borderRadius: 6, padding: "5px 12px", fontSize: 12, fontWeight: 700,
                cursor: saving ? "default" : "pointer", marginRight: 5 }}>
              {saving ? "…" : "✓ Sauver"}
            </button>
            <button onClick={cancelEdit}
              style={{ background: "#F3F4F6", color: "#6B7280", border: "1px solid #E5E7EB",
                borderRadius: 6, padding: "5px 10px", fontSize: 12, fontWeight: 600,
                cursor: "pointer" }}>
              Annuler
            </button>
          </td>
        </>
      ) : (
        /* ── Read mode ── */
        <>
          {/* Modele */}
          <td style={{ ...TD, fontWeight: 600, color: "#111827", maxWidth: 160,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {product.Modele || <span style={{ color: "#D1D5DB" }}>—</span>}
          </td>

          {/* Marque */}
          <td style={TD}>
            {product.Marque
              ? <Pill color="blue">{product.Marque}</Pill>
              : <span style={{ color: "#D1D5DB" }}>—</span>}
          </td>

          {/* Annee */}
          <td style={{ ...TD, color: "#6B7280" }}>{product.Annee || "—"}</td>

          {/* Type */}
          <td style={{ ...TD, color: "#374151", maxWidth: 130,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {product.Type || "—"}
          </td>

          {/* Cote */}
          <td style={{ ...TD, color: "#374151" }}>{product.Cote || "—"}</td>

          {/* Reference */}
          <td style={{ ...TD, fontFamily: "monospace", fontSize: 11, color: "#6B7280" }}>
            {product.Reference || "—"}
          </td>

          {/* Condition */}
          <td style={TD}>
            {product.Condition
              ? <Pill color={product.Condition === "neuf" ? "green" : "amber"}>
                  {product.Condition}
                </Pill>
              : "—"}
          </td>

          {/* Prix */}
          <td style={{ ...TD, fontWeight: 700, color: "#1535A0" }}>
            {product.Prix ? `${product.Prix} DH` : "—"}
          </td>

          {/* Image */}
          <td style={{ ...TD, maxWidth: 100,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              fontSize: 11, color: "#9CA3AF" }}>
            {product.Image || "—"}
          </td>

          {/* Actions */}
          <td style={{ ...TD, whiteSpace: "nowrap" }}>
            <button onClick={startEdit}
              style={{ background: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE",
                borderRadius: 6, padding: "5px 11px", fontSize: 12, fontWeight: 600,
                cursor: "pointer", marginRight: 5 }}>
              ✏ Modifier
            </button>
            <button onClick={del} disabled={deleting}
              style={{ background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA",
                borderRadius: 6, padding: "5px 10px", fontSize: 12, fontWeight: 600,
                cursor: deleting ? "default" : "pointer", opacity: deleting ? 0.5 : 1 }}>
              {deleting ? "…" : "✕"}
            </button>
          </td>
        </>
      )}
    </tr>
  );
}

// ── Add form ──────────────────────────────────────────────────────────────────
function AddForm({ onAdded }) {
  const [form, setForm]     = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [open, setOpen]     = useState(false);

  async function submit() {
    if (!form.Modele.trim()) { alert('Le champ "Modèle" est obligatoire.'); return; }
    setSaving(true);
    const row = formToRow(form);
    const { data, error } = await supabase.from("products").insert([row]).select();
    if (error) {
      alert("Erreur Supabase :\n" + error.message);
    } else {
      onAdded(data[0]);
      setForm(EMPTY_FORM);
      setOpen(false);
      alert(`✅ "${form.Modele}" ajouté avec succès !`);
    }
    setSaving(false);
  }

  return (
    <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB",
        borderRadius: 12, marginBottom: 24, overflow: "hidden" }}>

      {/* Toggle header */}
      <button onClick={() => setOpen(o => !o)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px", background: "none", border: "none", cursor: "pointer",
          fontFamily: "'Inter',sans-serif" }}>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", color: "#1535A0" }}>
          + AJOUTER UNE PIÈCE
        </span>
        <svg viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.2"
          strokeLinecap="round" width="14" height="14"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div style={{ padding: "0 20px 20px", borderTop: "1px solid #E5E7EB" }}>
          <p style={{ margin: "12px 0 14px", fontSize: 11, color: "#9CA3AF" }}>
            La pièce sera enregistrée dans Supabase et apparaîtra immédiatement sur le site.
          </p>
          <div style={{ display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 10 }}>
            {COLS.map(({ key, label, type }) => (
              <div key={key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: "#6B7280",
                    letterSpacing: "1px", textTransform: "uppercase" }}>
                  {label}{key === "Modele" && " *"}
                </label>
                <input type={type} value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && submit()}
                  placeholder={label}
                  style={{ border: "1.5px solid #E5E7EB", borderRadius: 8,
                    padding: "9px 11px", fontSize: 13, fontFamily: "inherit",
                    outline: "none", background: "#fff", color: "#111827",
                    transition: "border-color .15s" }}
                  onFocus={e => (e.target.style.borderColor = "#1535A0")}
                  onBlur={e  => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>
            ))}

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: "transparent",
                  letterSpacing: "1px" }}>·</label>
              <button onClick={submit} disabled={saving || !form.Modele.trim()}
                style={{ background: saving || !form.Modele.trim() ? "#93C5FD" : "#1535A0",
                  color: "#fff", border: "none", borderRadius: 8,
                  padding: "9px 18px", fontSize: 13, fontWeight: 700,
                  cursor: saving || !form.Modele.trim() ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  height: 42 }}>
                {saving ? (
                  <>
                    <span style={{ width: 12, height: 12, border: "2px solid rgba(255,255,255,0.4)",
                      borderTopColor: "#fff", borderRadius: "50%",
                      display: "inline-block", animation: "spin .7s linear infinite" }} />
                    Ajout…
                  </>
                ) : "+ Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main AdminDashboard ───────────────────────────────────────────────────────
export default function AdminDashboard({ onBack }) {
  const [auth, setAuth]         = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [opticsOnly, setOpticsOnly] = useState(true);

  // ── Fetch from Supabase ───────────────────────────────────────────────────
  useEffect(() => {
    if (!auth) return;
    setLoading(true);

    let query = supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    // Default: show only optics — toggle available in header
    if (opticsOnly) {
      query = query.or(buildOpticsFilter());
    }

    query.then(({ data, error }) => {
      if (error) alert("Erreur chargement :\n" + error.message);
      else setProducts(data ?? []);
      setLoading(false);
    });
  }, [auth, opticsOnly]);

  // ── CRUD handlers ─────────────────────────────────────────────────────────
  function handleAdded(row)       { setProducts(p => [row, ...p]); }
  function handleSaved(updated)   { setProducts(p => p.map(r => r.id === updated.id ? updated : r)); }
  function handleDeleted(id)      { setProducts(p => p.filter(r => r.id !== id)); }

  // ── Search filter ─────────────────────────────────────────────────────────
  const visible = search.trim()
    ? products.filter(p =>
        COLS.some(({ key }) =>
          String(p[key] ?? "").toLowerCase().includes(search.toLowerCase().trim())
        )
      )
    : products;

  function logout() { sessionStorage.removeItem(SESSION_KEY); setAuth(false); }

  if (!auth) return <Login onSuccess={() => setAuth(true)} />;

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", fontFamily: "'Inter',sans-serif" }}>

      {/* ── Top bar ── */}
      <div style={{ background: "#1535A0", padding: "13px 24px",
          display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
          position: "sticky", top: 0, zIndex: 50,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>

        {onBack && (
          <button onClick={onBack}
            style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff",
              borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 600,
              cursor: "pointer", flexShrink: 0 }}>
            ← Retour
          </button>
        )}

        <span style={{ color: "#fff", fontWeight: 800, fontSize: 14, letterSpacing: "1.5px" }}>
          ADMIN — OPTIQUES & PHARES
        </span>

        {/* Count */}
        <span style={{ background: "rgba(255,255,255,0.15)", color: "#fff",
            borderRadius: 20, padding: "3px 11px", fontSize: 11, fontWeight: 600 }}>
          {loading ? "…" : `${products.length} pièces`}
        </span>

        {/* Optics filter toggle */}
        <button
          onClick={() => setOpticsOnly(o => !o)}
          style={{ background: opticsOnly ? "#1D9E6A" : "rgba(255,255,255,0.12)",
            border: `1px solid ${opticsOnly ? "#34D399" : "rgba(255,255,255,0.25)"}`,
            color: "#fff", borderRadius: 20, padding: "4px 13px",
            fontSize: 11, fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 5, transition: "all .2s" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%",
              background: opticsOnly ? "#34D399" : "rgba(255,255,255,0.4)" }} />
          {opticsOnly ? "Optiques uniquement" : "Tous les produits"}
        </button>

        {/* Live badge */}
        <span style={{ display: "flex", alignItems: "center", gap: 5,
            background: "rgba(37,211,102,0.18)", border: "1px solid rgba(37,211,102,0.35)",
            color: "#86EFAC", borderRadius: 20, padding: "3px 11px",
            fontSize: 11, fontWeight: 700 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%",
              background: "#25D366", display: "inline-block" }} />
          Supabase Live
        </span>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
          {/* Export */}
          <button onClick={() => exportCSV(visible)} disabled={visible.length === 0}
            style={{ display: "flex", alignItems: "center", gap: 6,
              background: visible.length === 0 ? "rgba(255,255,255,0.08)" : "#217346",
              border: "none",
              color: visible.length === 0 ? "rgba(255,255,255,0.3)" : "#fff",
              borderRadius: 8, padding: "7px 13px", fontSize: 12, fontWeight: 700,
              cursor: visible.length === 0 ? "default" : "pointer" }}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
              <path d="M14 2v6h6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            Export CSV
          </button>

          <button onClick={logout}
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.7)", borderRadius: 8, padding: "6px 12px",
              fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
            Déconnexion
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "24px 20px" }}>

        {/* Add form */}
        <AddForm onAdded={handleAdded} />

        {/* Search + count */}
        <div style={{ display: "flex", justifyContent: "space-between",
            alignItems: "center", marginBottom: 12, gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, color: "#6B7280" }}>
            {loading
              ? "Chargement depuis Supabase…"
              : `${visible.length} résultat${visible.length !== 1 ? "s" : ""}${
                  search ? ` pour "${search}"` : ""}`
            }
          </span>
          <input
            placeholder="Rechercher par modèle, marque, réf…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: "1.5px solid #E5E7EB", borderRadius: 8,
              padding: "8px 14px", fontSize: 13, fontFamily: "inherit",
              outline: "none", width: 260, background: "#fff" }}
            onFocus={e => (e.target.style.borderColor = "#1535A0")}
            onBlur={e  => (e.target.style.borderColor = "#E5E7EB")}
          />
        </div>

        {/* Table */}
        <div style={{ background: "#fff", border: "1px solid #E5E7EB",
            borderRadius: 12, overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                  {[...COLS.map(c => c.label), "Actions"].map((h, i) => (
                    <th key={i} style={{ padding: "11px 12px", textAlign: "left",
                        fontWeight: 700, fontSize: 10, letterSpacing: "1px",
                        color: "#6B7280", whiteSpace: "nowrap" }}>
                      {h.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={COLS.length + 1}
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

                {!loading && visible.length === 0 && (
                  <tr>
                    <td colSpan={COLS.length + 1}
                        style={{ padding: 48, textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>
                      {products.length === 0
                        ? "Aucune pièce trouvée dans Supabase."
                        : `Aucun résultat pour "${search}".`}
                    </td>
                  </tr>
                )}

                {!loading && visible.map((p, i) => (
                  <ProductRow
                    key={p.id}
                    product={p}
                    rowIndex={i}
                    onSave={handleSaved}
                    onDelete={handleDeleted}
                  />
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
