import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "../lib/supabaseClient";
import LOGO_SRC from "../assets/logo.png";

const BRAND_BLUE = "#1535A0";

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function TagPill({ tag }) {
  return (
    <span style={{
      display: "inline-block", fontSize: 10, fontWeight: 700, letterSpacing: "0.8px",
      padding: "3px 10px", borderRadius: 20, background: "#EFF6FF",
      color: "#1D4ED8", border: "1px solid #BFDBFE", textTransform: "uppercase",
    }}>
      {tag}
    </span>
  );
}

function PostCard({ post }) {
  const [hovered, setHovered] = useState(false);
  const excerpt = post.excerpt || "";
  const tags = Array.isArray(post.tags) ? post.tags : (post.tags ? post.tags.split(",").map(t => t.trim()) : []);

  return (
    <Link
      to={`/blog/${post.slug}`}
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <article style={{
        background: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid #E2E8F0",
        transition: "box-shadow .2s, transform .2s",
        boxShadow: hovered ? "0 12px 40px rgba(0,0,0,0.12)" : "0 2px 8px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-3px)" : "none",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Cover image */}
        <div style={{ aspectRatio: "16/9", background: "#F1F5F9", overflow: "hidden", flexShrink: 0 }}>
          {post.image_url ? (
            <img
              src={post.image_url}
              alt={post.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .4s", transform: hovered ? "scale(1.04)" : "scale(1)" }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #1535A0 0%, #1D4ED8 100%)" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" width="40" height="40">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", flex: 1, gap: 10 }}>
          {/* Tags */}
          {tags.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {tags.slice(0, 3).map(t => <TagPill key={t} tag={t} />)}
            </div>
          )}

          {/* Title */}
          <h2 style={{
            fontSize: "clamp(15px,2vw,17px)", fontWeight: 800, color: "#0F172A",
            lineHeight: 1.35, margin: 0, letterSpacing: "-0.2px",
            transition: "color .15s", ...(hovered ? { color: BRAND_BLUE } : {}),
          }}>
            {post.title}
          </h2>

          {/* Excerpt */}
          {excerpt && (
            <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.7, margin: 0, flex: 1,
              display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {excerpt}
            </p>
          )}

          {/* Footer */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 8, borderTop: "1px solid #F1F5F9" }}>
            <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500 }}>{formatDate(post.published_at)}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: BRAND_BLUE, display: "flex", alignItems: "center", gap: 4 }}>
              Lire l'article
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="11" height="11">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function BlogList() {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    supabase
      .from("posts")
      .select("id, title, slug, excerpt, image_url, tags, published_at")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setPosts(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Helmet>
        <title>Blog — MY AUTO PIÈCES | Conseils Auto Maroc</title>
        <meta name="description" content="Conseils, guides et actualités sur les pièces de rechange auto au Maroc. Optiques, phares, feux — MY Auto Pièces Casablanca." />
        <meta name="keywords" content="pièces de rechange Maroc, optiques Renault Casablanca, phares Dacia Maroc, feux arrière Peugeot, blog auto Maroc" />
        <meta property="og:title" content="Blog — MY AUTO PIÈCES" />
        <meta property="og:description" content="Conseils et guides auto au Maroc par MY Auto Pièces, Casablanca." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div style={{ fontFamily: "'Inter',sans-serif", background: "#F8FAFC", minHeight: "100vh" }}>

        {/* Header */}
        <header style={{ background: BRAND_BLUE, position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid rgba(0,0,0,0.15)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <img src={LOGO_SRC} alt="MY Auto Pièces" style={{ height: 40 }} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: "2px", color: "#fff", lineHeight: 1 }}>MY AUTO PIÈCES</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: "1px", marginTop: 2 }}>CASABLANCA · MAROC</div>
              </div>
            </a>
            <nav style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <a href="/" style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)", textDecoration: "none", padding: "6px 12px", borderRadius: 8, transition: "background .15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                Catalogue
              </a>
              <span style={{ color: "rgba(255,255,255,0.2)", fontWeight: 300 }}>|</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", padding: "6px 12px", background: "rgba(255,255,255,0.15)", borderRadius: 8 }}>Blog</span>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <div style={{ background: "linear-gradient(135deg, #1535A0 0%, #1D4ED8 60%, #2563EB 100%)", padding: "48px 20px 52px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
            <span style={{ display: "inline-block", fontSize: 10, fontWeight: 700, letterSpacing: "2.5px", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", marginBottom: 12 }}>
              Conseils & Actualités
            </span>
            <h1 style={{ fontSize: "clamp(26px,5vw,42px)", fontWeight: 900, color: "#fff", lineHeight: 1.15, letterSpacing: "-0.5px", margin: "0 0 14px" }}>
              Blog MY Auto Pièces
            </h1>
            <p style={{ fontSize: "clamp(13px,2vw,16px)", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: 0 }}>
              Guides pratiques, conseils d'entretien et actualités sur les pièces auto au Maroc.
            </p>
          </div>
        </div>

        {/* Content */}
        <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px 80px" }}>

          {loading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 24 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #E2E8F0" }}>
                  <div style={{ aspectRatio: "16/9", background: "#E2E8F0", animation: "pulse 1.5s ease-in-out infinite" }} />
                  <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ height: 12, background: "#E2E8F0", borderRadius: 6, width: "40%", animation: "pulse 1.5s ease-in-out infinite" }} />
                    <div style={{ height: 18, background: "#E2E8F0", borderRadius: 6, animation: "pulse 1.5s ease-in-out infinite" }} />
                    <div style={{ height: 14, background: "#F1F5F9", borderRadius: 6, animation: "pulse 1.5s ease-in-out infinite" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <p style={{ color: "#EF4444", fontSize: 14 }}>Erreur de chargement — veuillez réessayer.</p>
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✍️</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1E293B", marginBottom: 8 }}>Articles bientôt disponibles</h2>
              <p style={{ fontSize: 14, color: "#64748B" }}>Notre équipe prépare des guides et conseils pour vous.</p>
              <a href="/" style={{ display: "inline-block", marginTop: 24, padding: "12px 24px", background: BRAND_BLUE, color: "#fff", borderRadius: 12, textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
                Voir le catalogue →
              </a>
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 24 }}>
              {posts.map(post => <PostCard key={post.id} post={post} />)}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer style={{ background: BRAND_BLUE, borderTop: "1px solid rgba(0,0,0,0.1)", padding: "20px", textAlign: "center" }}>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", margin: 0 }}>
            © 2025 MY AUTO PIÈCES · Casablanca, Maroc ·{" "}
            <a href="/" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>Retour au catalogue</a>
          </p>
        </footer>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </>
  );
}
