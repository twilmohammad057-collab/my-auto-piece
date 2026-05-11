import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "../lib/supabaseClient";
import LOGO_SRC from "../assets/logo.png";

const BRAND_BLUE = "#1535A0";
const WA = "212634119267";

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function TagPill({ tag }) {
  return (
    <span style={{
      display: "inline-block", fontSize: 10, fontWeight: 700, letterSpacing: "0.8px",
      padding: "4px 12px", borderRadius: 20, background: "#EFF6FF",
      color: "#1D4ED8", border: "1px solid #BFDBFE", textTransform: "uppercase",
    }}>
      {tag}
    </span>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post,    setPost]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound,setNotFound]= useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single()
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true);
        else setPost(data);
        setLoading(false);
      });
  }, [slug]);

  const tags = post
    ? (Array.isArray(post.tags) ? post.tags : (post.tags ? post.tags.split(",").map(t => t.trim()) : []))
    : [];

  const waMsg = post
    ? encodeURIComponent(`Bonjour MY Auto Pièces 👋\n\nJ'ai lu votre article : "${post.title}"\n\nJ'ai une question concernant les pièces auto.`)
    : "";

  return (
    <>
      <Helmet>
        <title>{post ? `${post.title} — MY AUTO PIÈCES` : "Article — MY AUTO PIÈCES"}</title>
        <meta name="description"        content={post?.excerpt || "Conseils auto au Maroc par MY Auto Pièces, Casablanca."} />
        <meta name="keywords"           content={tags.join(", ") || "pièces de rechange Maroc, optiques auto Casablanca"} />
        <meta property="og:title"       content={post?.title || "Article"} />
        <meta property="og:description" content={post?.excerpt || ""} />
        {post?.image_url && <meta property="og:image" content={post.image_url} />}
        <meta property="og:type"        content="article" />
        {post?.published_at && <meta property="article:published_time" content={post.published_at} />}
      </Helmet>

      <div style={{ fontFamily: "'Inter',sans-serif", background: "#fff", minHeight: "100vh" }}>

        {/* Header */}
        <header style={{ background: BRAND_BLUE, position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid rgba(0,0,0,0.15)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <img src={LOGO_SRC} alt="MY Auto Pièces" style={{ height: 40, display: "block", background: "transparent", mixBlendMode: "screen", objectFit: "contain" }} />
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
              <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
              <Link to="/blog" style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)", textDecoration: "none", padding: "6px 12px", borderRadius: 8, transition: "background .15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                Blog
              </Link>
            </nav>
          </div>
        </header>

        {/* Loading skeleton */}
        {loading && (
          <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 20px" }}>
            <div style={{ height: 14, background: "#E2E8F0", borderRadius: 6, width: "30%", marginBottom: 32, animation: "pulse 1.5s infinite" }} />
            <div style={{ height: 340, background: "#F1F5F9", borderRadius: 16, marginBottom: 32, animation: "pulse 1.5s infinite" }} />
            <div style={{ height: 36, background: "#E2E8F0", borderRadius: 8, marginBottom: 16, animation: "pulse 1.5s infinite" }} />
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: 16, background: "#F1F5F9", borderRadius: 6, marginBottom: 10, width: i === 3 ? "60%" : "100%", animation: "pulse 1.5s infinite" }} />
            ))}
          </div>
        )}

        {/* 404 */}
        {!loading && notFound && (
          <div style={{ textAlign: "center", padding: "100px 20px" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1E293B", marginBottom: 8 }}>Article introuvable</h1>
            <p style={{ fontSize: 14, color: "#64748B", marginBottom: 28 }}>Cet article n'existe pas ou a été retiré.</p>
            <Link to="/blog" style={{ display: "inline-block", padding: "12px 24px", background: BRAND_BLUE, color: "#fff", borderRadius: 12, textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
              ← Retour au blog
            </Link>
          </div>
        )}

        {/* Article */}
        {!loading && post && (
          <article>

            {/* Back breadcrumb */}
            <div style={{ maxWidth: 760, margin: "0 auto", padding: "20px 20px 0" }}>
              <Link to="/blog" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "#64748B", textDecoration: "none" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="13" height="13">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Retour au blog
              </Link>
            </div>

            {/* Cover image */}
            {post.image_url && (
              <div style={{ maxWidth: 760, margin: "16px auto 0", padding: "0 20px" }}>
                <div style={{ borderRadius: 18, overflow: "hidden", aspectRatio: "16/9" }}>
                  <img src={post.image_url} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              </div>
            )}

            {/* Meta */}
            <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 0" }}>
              {tags.length > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                  {tags.map(t => <TagPill key={t} tag={t} />)}
                </div>
              )}

              <h1 style={{
                fontSize: "clamp(22px,4vw,34px)", fontWeight: 900, color: "#0F172A",
                lineHeight: 1.2, letterSpacing: "-0.5px", margin: "0 0 12px",
              }}>
                {post.title}
              </h1>

              {post.excerpt && (
                <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.7, margin: "0 0 16px", fontWeight: 400, borderLeft: "3px solid #1D4ED8", paddingLeft: 16 }}>
                  {post.excerpt}
                </p>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 24, borderBottom: "1px solid #E2E8F0", marginBottom: 32 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: BRAND_BLUE, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <img src={LOGO_SRC} alt="" style={{ width: 20, height: 20, objectFit: "contain" }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1E293B" }}>MY Auto Pièces</div>
                  <div style={{ fontSize: 11, color: "#94A3B8" }}>{formatDate(post.published_at)}</div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 20px" }}>
              <div className="blog-prose" dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            {/* CTA */}
            <div style={{ maxWidth: 760, margin: "48px auto 0", padding: "0 20px 80px" }}>
              <div style={{ background: "linear-gradient(135deg, #1535A0 0%, #1D4ED8 100%)", borderRadius: 20, padding: "32px 28px", textAlign: "center" }}>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 8, letterSpacing: "-0.2px" }}>
                  Besoin d'une pièce ?
                </h2>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginBottom: 24, lineHeight: 1.6 }}>
                  Contactez-nous sur WhatsApp — réponse rapide, pièces vérifiées, livraison partout au Maroc.
                </p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                  <a
                    href={`https://wa.me/${WA}?text=${waMsg}`}
                    target="_blank" rel="noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 22px", background: "#25D366", color: "#fff", borderRadius: 13, textDecoration: "none", fontSize: 13, fontWeight: 800 }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.533 5.854L.057 23.215a.75.75 0 00.921.912l5.4-1.485A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.685-.524-5.21-1.435l-.374-.224-3.867 1.063 1.028-3.75-.245-.387A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                    </svg>
                    Contacter sur WhatsApp
                  </a>
                  <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 22px", background: "rgba(255,255,255,0.15)", color: "#fff", borderRadius: 13, textDecoration: "none", fontSize: 13, fontWeight: 700, border: "1px solid rgba(255,255,255,0.25)" }}>
                    Voir le catalogue
                  </a>
                </div>
              </div>
            </div>

          </article>
        )}

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
        .blog-prose { font-size: 15px; color: #334155; line-height: 1.85; }
        .blog-prose h2 { font-size: clamp(18px,3vw,24px); font-weight: 800; color: #0F172A; margin: 36px 0 14px; letter-spacing: -0.2px; }
        .blog-prose h3 { font-size: clamp(15px,2.5vw,19px); font-weight: 700; color: #1E293B; margin: 28px 0 10px; }
        .blog-prose p  { margin: 0 0 18px; }
        .blog-prose ul, .blog-prose ol { padding-left: 22px; margin: 0 0 18px; }
        .blog-prose li { margin-bottom: 6px; }
        .blog-prose strong { font-weight: 700; color: #1E293B; }
        .blog-prose a  { color: #1D4ED8; text-decoration: underline; text-underline-offset: 3px; }
        .blog-prose blockquote { border-left: 3px solid #1D4ED8; padding: 12px 18px; background: #EFF6FF; border-radius: 0 10px 10px 0; margin: 24px 0; color: #1E40AF; font-style: italic; }
        .blog-prose img { width: 100%; border-radius: 12px; margin: 24px 0; }
        .blog-prose hr  { border: none; border-top: 1px solid #E2E8F0; margin: 32px 0; }
      `}</style>
    </>
  );
}
