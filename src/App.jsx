import { useState, useRef, useCallback } from "react";
import ProductPage from "./components/ProductPage";
import { Home, Search, Phone, Mail, MapPin, Zap, Circle, ScanLine, Car, Package2, Truck, Award, ShieldCheck, MessageCircle, Star, Store, BookOpen } from "lucide-react";
import ProductGrid from "./components/ProductGrid";
import LOGO_SRC     from "./assets/logo.png";
import LOGO_RENAULT from "./assets/brands/renault.png";
import LOGO_DACIA   from "./assets/brands/dacia.png";
import LOGO_CITROEN from "./assets/brands/citroen.png";
import LOGO_NISSAN  from "./assets/brands/nissan.png";
import LOGO_PEUGEOT from "./assets/brands/peugeot.png";
import LOGO_FIAT    from "./assets/brands/fiat.png";

const WA = "212634119267";

const BRAND_LOGOS = {
  Renault: LOGO_RENAULT,
  Dacia:   LOGO_DACIA,
  Citroën: LOGO_CITROEN,
  Nissan:  LOGO_NISSAN,
  Peugeot: LOGO_PEUGEOT,
  Fiat:    LOGO_FIAT,
};

const LOGO_FILTER = {
  Renault: "invert(1) brightness(0)",
  Dacia:   "invert(1) brightness(0)",
  Citroën: "none",
  Nissan:  "invert(1) brightness(0)",
  Peugeot: "invert(1) brightness(0)",
  Fiat:    "grayscale(1) contrast(4) brightness(0.15)",
};

const BRAND_ACCENT = {
  Renault:"#EFAC00", Dacia:"#2D6A4F", Citroën:"#C8102E",
  Nissan:"#C3002F",  Peugeot:"#002D6A", Fiat:"#2C6CB0",
};

const BRANDS = ["Toutes marques","Citroën","Dacia","Fiat","Nissan","Peugeot","Renault"];
const MODELS = {
  "Toutes marques":["Tous modèles"],
  "Citroën":["Tous modèles","Berlingo B9","Berlingo K9","C3","C3 Aircross","C4","C5 Aircross","Dispatch","Jumper"],
  "Dacia":  ["Tous modèles","Dokker","Duster","Duster 2","Lodgy","Logan","Logan 2","Logan 3","Sandero","Sandero Stepway"],
  "Fiat":   ["Tous modèles","500","500X","Ducato","Fiorino","Panda","Punto","Tipo"],
  "Nissan": ["Tous modèles","Juke","Micra","Navara","Note","Qashqai","X-Trail"],
  "Peugeot":["Tous modèles","206","207","208","2008","301","3008","308","407","408","5008","508","Expert","Partner"],
  "Renault":["Tous modèles","Captur","Clio 4","Clio 5","Kadjar","Kangoo 2","Master","Mégane 4","Trafic","Twingo 3"],
};
const YEARS = ["Toutes années","2015","2016","2017","2018","2019","2020","2021","2022","2023","2024","2025","2026"];


const XIco = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="14" height="14">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const BurgerIco = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" width="20" height="20">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const SearchIco = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const WaIco = ({size=20}) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);
const ChevDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" width="13" height="13">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

function FSelect({ label, value, options, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useState(()=>{
    const h = e=>{ if(ref.current&&!ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown",h);
    return ()=>document.removeEventListener("mousedown",h);
  });

  return (
    <div style={{display:"flex",flexDirection:"column",gap:5}} ref={ref}>
      <span style={{fontSize:10,fontWeight:700,letterSpacing:"1.8px",color:"#1D4ED8",textTransform:"uppercase"}}>{label}</span>
      <div style={{position:"relative"}}>
        <button type="button" disabled={disabled} onClick={()=>!disabled&&setOpen(o=>!o)}
          style={{
            width:"100%", padding:"11px 36px 11px 13px",
            background: disabled ? "#F9FAFB" : open ? "#EFF6FF" : "#FFFFFF",
            border:`1.5px solid ${open?"#1D4ED8":"#D1D5DB"}`,
            borderRadius:10, color:disabled?"#9CA3AF":"#1A1A1A",
            fontSize:13, fontFamily:"'Inter',sans-serif", fontWeight:500,
            textAlign:"left", cursor:disabled?"not-allowed":"pointer",
            transition:"all .18s", outline:"none",
            display:"flex", alignItems:"center", justifyContent:"space-between", gap:8,
            boxShadow: open ? "0 0 0 3px rgba(29,78,216,0.1)" : "none",
          }}>
          <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:value.includes("Toutes")||value.includes("Tous")?value===options[0]?"#9CA3AF":"#1A1A1A":"#1A1A1A"}}>
            {value}
          </span>
          <span style={{transform:open?"rotate(180deg)":"rotate(0deg)",transition:"transform .2s",color:open?"#1D4ED8":"#9CA3AF",flexShrink:0}}>
            <ChevDown/>
          </span>
        </button>
        {open&&(
          <div style={{position:"absolute",top:"calc(100% + 5px)",left:0,right:0,background:"#FFFFFF",border:"1.5px solid #1D4ED8",borderRadius:10,zIndex:9999,boxShadow:"0 12px 36px rgba(0,0,0,0.14)",maxHeight:230,overflowY:"auto",animation:"dropIn .15s ease"}}>
            {options.map(o=>(
              <button key={o} type="button" onClick={()=>{onChange(o);setOpen(false);}}
                style={{width:"100%",padding:"10px 14px",background:o===value?"#EFF6FF":"transparent",border:"none",borderLeft:o===value?"2.5px solid #1D4ED8":"2.5px solid transparent",color:o===value?"#1D4ED8":"#374151",fontSize:13,fontFamily:"'Inter',sans-serif",fontWeight:o===value?700:400,textAlign:"left",cursor:"pointer",transition:"background .1s,color .1s"}}
                onMouseEnter={e=>{ if(o!==value){e.currentTarget.style.background="#F9FAFB";e.currentTarget.style.color="#111827";}}}
                onMouseLeave={e=>{ if(o!==value){e.currentTarget.style.background="transparent";e.currentTarget.style.color="#374151";}}}>
                {o}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OrderModal({ product:p, onClose }) {
  const [nom,setNom]=useState(""); const [ville,setVille]=useState(""); const [tel,setTel]=useState(""); const [sent,setSent]=useState(false);
  const buildLink = ()=>{
    const msg=["🛒 *Commande — MY Auto Pièces*","",`📦 ${p.label||"Pièce"}`,`👤 ${nom}`,`📍 ${ville}`,`📞 ${tel}`].join("\n");
    return `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  };
  const submit=()=>{
    if(!nom.trim()||!ville.trim()||!tel.trim()){alert("Veuillez remplir tous les champs.");return;}
    setSent(true); setTimeout(()=>{window.open(buildLink(),"_blank");onClose();},300);
  };
  const inp={padding:"10px 13px",borderRadius:9,border:"1.5px solid #E5E7EB",background:"#fff",color:"#1A1A1A",fontSize:14,fontFamily:"'Inter',sans-serif",outline:"none",width:"100%",transition:"border-color .15s,box-shadow .15s"};
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:300,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(8px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:18,width:"100%",maxWidth:400,boxShadow:"0 24px 64px rgba(0,0,0,0.2)",overflow:"hidden",border:"1px solid #E5E7EB"}}>
        <div style={{background:"#1535A0",padding:"18px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.55)",letterSpacing:"2px",fontWeight:700,marginBottom:3}}>COMMANDER</div>
            <div style={{fontSize:14,fontWeight:800,color:"#fff"}}>{p.label||"Pièce automobile"}</div>
          </div>
          <button onClick={onClose} style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><XIco/></button>
        </div>
        <div style={{padding:"20px 18px 22px"}}>
          <p style={{fontSize:12,color:"#6B7280",marginBottom:18}}>Remplissez le formulaire — on vous contacte sur WhatsApp.</p>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {[["NOM COMPLET","text","Mohamed Alaoui",nom,setNom],["VILLE","text","Casablanca",ville,setVille],["TÉLÉPHONE","tel","06 XX XX XX XX",tel,setTel]].map(([lbl,type,ph,val,set])=>(
              <div key={lbl}>
                <label style={{display:"block",fontSize:9,fontWeight:700,letterSpacing:"1.5px",color:"#9CA3AF",marginBottom:5}}>{lbl} <span style={{color:"#EF4444"}}>*</span></label>
                <input type={type} placeholder={ph} value={val} onChange={e=>set(e.target.value)} style={inp}
                  onFocus={e=>{e.target.style.borderColor="#1D4ED8";e.target.style.boxShadow="0 0 0 3px rgba(29,78,216,0.1)";}}
                  onBlur={e=>{e.target.style.borderColor="#E5E7EB";e.target.style.boxShadow="none";}}/>
              </div>
            ))}
            <button onClick={submit} style={{marginTop:6,background:sent?"#059669":"#1D4ED8",color:"#fff",border:"none",borderRadius:11,fontSize:14,padding:"13px",fontWeight:800,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"background .2s",boxShadow:"0 4px 16px rgba(29,78,216,0.3)"}}>
              {sent?"Ouverture WhatsApp…":"Confirmer la commande"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CarPartsStore() {
  const [view,setView]               = useState("home");
  const [activeBrand,setActiveBrand] = useState(null);
  const [selectedProduct,setSelectedProduct] = useState(null);
  const [fBrand,setFBrand]       = useState("Toutes marques");
  const [fModel,setFModel]       = useState("Tous modèles");
  const [fYear,setFYear]         = useState("Toutes années");
  const [menuOpen,setMenuOpen]   = useState(false);
  const [orderProduct,setOrderProduct] = useState(null);
  const searchRef = useRef(null);
  const topRef    = useRef(null);

  const modelOpts = MODELS[fBrand]||["Tous modèles"];

  const scrollToSearch = useCallback(()=>{
    setView("home");
    setTimeout(()=>searchRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),100);
  },[]);
  const scrollToTop = useCallback(()=>{
    setView("home"); setActiveBrand(null);
    topRef.current?.scrollIntoView({behavior:"smooth"});
  },[]);
  const handleSearch = ()=>{ setView("catalogue"); window.scrollTo({top:0,behavior:"smooth"}); };
  const goToProduct  = product=>{ setSelectedProduct(product); setView("product"); window.scrollTo({top:0,behavior:"smooth"}); };
  const backFromProduct = ()=>{ setView(activeBrand ? "brand" : "catalogue"); window.scrollTo({top:0,behavior:"smooth"}); };
  const goToBrand = brand=>{
    setActiveBrand(brand); setFBrand(brand); setFModel("Tous modèles"); setFYear("Toutes années");
    setView("brand"); window.scrollTo({top:0,behavior:"smooth"});
  };

  const TRUST=[
    {Icon:Award,         title:"Qualité Certifiée",   desc:"Pièces d'origine conformes aux normes OEM. Sélectionnées avec soin.",       accent:"#1D4ED8"},
    {Icon:ShieldCheck,   title:"Vérification Garantie",desc:"Contrôle de l'état des pièces avant paiement. Achetez en toute confiance.", accent:"#059669"},
    {Icon:MessageCircle, title:"Support WhatsApp",     desc:"Conseil technique pour valider la compatibilité. Réponse rapide.",           accent:"#25D366"},
  ];
  const REVIEWS=[
    {name:"Khadija R.",city:"Casablanca",text:"Service client au top. Ils m'ont aidé à choisir le bon phare pour ma Clio. Très professionnel !"},
    {name:"Omar T.",   city:"Rabat",     text:"Qualité d'origine à prix défiant toute concurrence. Très satisfait, je recommande vivement."},
    {name:"Yassine B.",city:"Tanger",    text:"Optiques conformes et bien emballées. Livraison rapide en 48h. Je recommande sans hésitation."},
    {name:"Fatima L.", city:"Marrakech", text:"Ils ont vérifié la compatibilité avec mon véhicule avant l'achat. Sérieux et réactifs !"},
  ];
  const waMsg = encodeURIComponent("Bonjour MY Auto Pièces, je suis intéressé par une pièce.");

  const SearchBox = () => (
    <div ref={searchRef} id="search-section"
      style={{maxWidth:960,margin:"0 auto",background:"#FFFFFF",border:"1.5px solid #E5E7EB",borderRadius:18,boxShadow:"0 8px 32px rgba(0,0,0,0.07)"}}>
      <div style={{padding:"22px 20px"}}>
        <p style={{fontSize:9,fontWeight:700,letterSpacing:"2.5px",color:"#1D4ED8",marginBottom:18}}>TROUVER MON OPTIQUE</p>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
          <FSelect label="Marque" value={fBrand} options={BRANDS} onChange={v=>{setFBrand(v);setFModel("Tous modèles");}}/>
          <FSelect label="Modèle" value={fModel} options={modelOpts} onChange={setFModel} disabled={fBrand==="Toutes marques"}/>
          <FSelect label="Année" value={fYear} options={YEARS} onChange={setFYear}/>

          <div style={{display:"flex",flexDirection:"column",gap:7,minWidth:0}}>
            <button onClick={handleSearch}
              style={{width:"100%",minHeight:46,background:"#1D4ED8",color:"#fff",border:"none",borderRadius:10,fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .18s",boxShadow:"0 4px 16px rgba(29,78,216,0.3)",letterSpacing:".2px"}}
              onMouseEnter={e=>{e.currentTarget.style.background="#1E40AF";e.currentTarget.style.boxShadow="0 6px 22px rgba(29,78,216,0.45)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="#1D4ED8";e.currentTarget.style.boxShadow="0 4px 16px rgba(29,78,216,0.3)";}}>
              Rechercher
            </button>
            <button
              onClick={()=>{setFBrand("Toutes marques");setFModel("Tous modèles");setFYear("Toutes années");}}
              style={{background:"none",border:"none",color:"#9CA3AF",fontSize:11,cursor:"pointer",textDecoration:"underline",fontFamily:"'Inter',sans-serif",transition:"color .15s",whiteSpace:"nowrap"}}
              onMouseEnter={e=>e.currentTarget.style.color="#6B7280"}
              onMouseLeave={e=>e.currentTarget.style.color="#9CA3AF"}>
              Réinitialiser
            </button>
          </div>
        </div>

        {(fBrand!=="Toutes marques"||fModel!=="Tous modèles"||fYear!=="Toutes années")&&(
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginTop:14,paddingTop:14,borderTop:"1px solid #F3F4F6"}}>
            <span style={{fontSize:10,fontWeight:600,color:"#9CA3AF",marginRight:2,alignSelf:"center"}}>Filtres actifs :</span>
            {[
              fBrand!=="Toutes marques"&&{label:fBrand,clear:()=>{ setFBrand("Toutes marques");setFModel("Tous modèles"); }},
              fModel!=="Tous modèles"&&{label:fModel,clear:()=>setFModel("Tous modèles")},
              fYear!=="Toutes années"&&{label:fYear,clear:()=>setFYear("Toutes années")},
            ].filter(Boolean).map(({label,clear})=>(
              <span key={label}
                style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px 3px 12px",background:"#DBEAFE",border:"1px solid #93C5FD",borderRadius:20,fontWeight:600,color:"#1D4ED8"}}>
                {label}
                <button onClick={clear} style={{display:"flex",alignItems:"center",background:"none",border:"none",color:"#60A5FA",cursor:"pointer",padding:0,lineHeight:1}}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="11" height="11"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const HomeView = () => (
    <>
      <div style={{background:"linear-gradient(160deg,#EEF2FF 0%,#F9FAFB 50%,#EFF6FF 100%)",textAlign:"center",padding:"clamp(52px,7vw,88px) 20px clamp(32px,4vw,48px)",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-80,right:-60,width:400,height:400,background:"radial-gradient(circle,rgba(29,78,216,0.05) 0%,transparent 65%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:-60,left:-40,width:300,height:300,background:"radial-gradient(circle,rgba(29,78,216,0.04) 0%,transparent 65%)",pointerEvents:"none"}}/>

        <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"#DBEAFE",border:"1px solid #93C5FD",borderRadius:20,padding:"5px 16px",marginBottom:20}}>
          <span style={{width:5,height:5,background:"#1D4ED8",borderRadius:"50%"}}/>
          <span style={{fontSize:10,fontWeight:700,letterSpacing:"2px",color:"#1D4ED8"}}>SPÉCIALISTE OPTIQUES & PHARES · CASABLANCA</span>
        </div>

        <h1 style={{fontSize:"clamp(30px,5.5vw,56px)",fontWeight:900,lineHeight:1.07,marginBottom:14,color:"#111827",letterSpacing:"-0.5px"}}>
          Optiques & Phares{" "}
          <span style={{color:"#1D4ED8"}}>d'Origine</span>
        </h1>
        <p style={{fontSize:"clamp(13px,1.8vw,15px)",color:"#6B7280",maxWidth:560,margin:"0 auto",lineHeight:1.8,fontWeight:400}}>
          Phares Avant · Feux Arrière · Antibrouillards · Clignotants<br/>
          <strong style={{color:"#374151",fontWeight:600}}>Renault · Dacia · Citroën · Nissan · Peugeot · Fiat</strong>
        </p>
      </div>

      {/* SearchBox — outside overflow:hidden hero, no stacking context so dropdown floats freely */}
      <div style={{background:"#E8EFFE",borderBottom:"1px solid #C7D7FC",padding:"28px 20px 32px"}}>
        <SearchBox/>
      </div>

      <div style={{background:"#FFFFFF",borderBottom:"1px solid #E5E7EB"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:1,borderLeft:"1px solid #E5E7EB"}}>
          {TRUST.map((t,i)=>(
            <div key={i} style={{padding:"26px 24px",borderRight:"1px solid #E5E7EB",display:"flex",gap:14,alignItems:"flex-start"}}>
              <div style={{width:44,height:44,borderRadius:12,background:`${t.accent}12`,border:`1.5px solid ${t.accent}25`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><t.Icon size={22} strokeWidth={1.8}/></div>
              <div>
                <h3 style={{fontSize:13,fontWeight:700,color:"#111827",marginBottom:5}}>{t.title}</h3>
                <p style={{fontSize:12.5,color:"#6B7280",lineHeight:1.6,margin:0}}>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
        {/* 500 DH policy — elegant service note, not a warning */}
        <div style={{maxWidth:1100,margin:"0 auto",padding:"14px 24px 18px",borderTop:"1px solid #F3F4F6",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="1.8" strokeLinecap="round" width="14" height="14">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p style={{fontSize:12,color:"#6B7280",margin:0}}>
            Politique de commande · Un acompte de{" "}
            <strong style={{color:"#374151",fontWeight:700}}>500 DH</strong>{" "}
            est requis à la confirmation — le solde est réglé à la livraison.
          </p>
        </div>
      </div>

      <div style={{background:"#FFFFFF",borderBottom:"1px solid #E5E7EB"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"clamp(48px,6vw,72px) 20px"}}>
          <div style={{textAlign:"center",marginBottom:36}}>
            <p style={{fontSize:10,fontWeight:700,letterSpacing:"2.5px",color:"#1D4ED8",marginBottom:8}}>PAR MARQUE</p>
            <h2 style={{fontSize:"clamp(20px,3.5vw,30px)",fontWeight:800,color:"#111827",letterSpacing:"-0.3px"}}>Trouvez par votre marque</h2>
            <p style={{fontSize:13,color:"#9CA3AF",marginTop:8}}>Cliquez sur votre marque pour explorer les pièces disponibles</p>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:16}}>
            {["Renault","Dacia","Citroën","Nissan","Peugeot","Fiat"].map(brand=>{
              const accent = BRAND_ACCENT[brand]||"#1D4ED8";
              const filter = LOGO_FILTER[brand]||"none";
              const mCount = (MODELS[brand]||[]).filter(m=>m!=="Tous modèles").length;
              return (
                <button key={brand} onClick={()=>goToBrand(brand)}
                  style={{background:"#FFFFFF",border:"1.5px solid #E5E7EB",borderRadius:16,padding:"24px 14px 20px",textAlign:"center",cursor:"pointer",fontFamily:"'Inter',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",gap:14,transition:"transform .18s,border-color .18s,box-shadow .18s",position:"relative",overflow:"hidden"}}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.borderColor=accent;e.currentTarget.style.boxShadow="0 10px 32px rgba(0,0,0,0.1)";}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor="#E5E7EB";e.currentTarget.style.boxShadow="none";}}>

                  <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:accent,borderRadius:"16px 16px 0 0",opacity:0.7}}/>
                  <div style={{width:72,height:52,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <img src={BRAND_LOGOS[brand]} alt={brand} style={{maxWidth:68,maxHeight:48,width:"auto",height:"auto",objectFit:"contain",display:"block",filter:filter,transition:"filter .2s"}}/>
                  </div>
                  <div>
                    <div style={{fontSize:15,fontWeight:800,color:"#111827",marginBottom:3,letterSpacing:"-.2px"}}>{brand}</div>
                    <div style={{fontSize:11,color:"#9CA3AF",fontWeight:400}}>{mCount} modèle{mCount>1?"s":""}</div>
                  </div>
                  <span style={{fontSize:11,fontWeight:700,color:accent,padding:"4px 13px",background:`${accent}12`,borderRadius:20,border:`1px solid ${accent}30`,letterSpacing:".2px"}}>
                    Voir les pièces
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{background:"#F9FAFB",borderBottom:"1px solid #E5E7EB"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"clamp(48px,6vw,72px) 20px"}}>
          <div style={{textAlign:"center",marginBottom:30}}>
            <p style={{fontSize:10,fontWeight:700,letterSpacing:"2.5px",color:"#1D4ED8",marginBottom:8}}>AVIS CLIENTS</p>
            <h2 style={{fontSize:"clamp(20px,3.5vw,30px)",fontWeight:800,color:"#111827",letterSpacing:"-0.3px"}}>Ce que disent nos clients</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14}}>
            {REVIEWS.map((r,i)=>(
              <div key={i} style={{background:"#FFFFFF",border:"1.5px solid #E5E7EB",borderRadius:14,padding:"20px 18px"}}>
                <div style={{marginBottom:9}}><span style={{display:"flex",gap:2}}>{[0,1,2,3,4].map(s=><Star key={s} size={14} fill="#F59E0B" color="#F59E0B"/>)}</span></div>
                <p style={{fontSize:13,color:"#374151",lineHeight:1.75,marginBottom:14,fontStyle:"italic"}}>"{r.text}"</p>
                <div style={{display:"flex",alignItems:"center",gap:9,borderTop:"1px solid #F3F4F6",paddingTop:12}}>
                  <div style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#1D4ED8,#3B82F6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"#fff",flexShrink:0}}>{r.name[0]}</div>
                  <div>
                    <p style={{fontSize:13,fontWeight:700,color:"#111827",margin:0}}>{r.name}</p>
                    <p style={{fontSize:11,color:"#9CA3AF",margin:0}}>{r.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{background:"#FFFFFF"}}>
        <div style={{maxWidth:860,margin:"0 auto",padding:"clamp(40px,5vw,60px) 20px"}}>
          <div style={{textAlign:"center",marginBottom:30}}>
            <p style={{fontSize:10,fontWeight:700,letterSpacing:"2.5px",color:"#1D4ED8",marginBottom:8}}>INFORMATIONS PRATIQUES</p>
            <h2 style={{fontSize:"clamp(20px,3.5vw,28px)",fontWeight:800,color:"#111827",marginBottom:10}}>Livraison & Retrait</h2>
            <div style={{width:36,height:3,background:"#1D4ED8",margin:"0 auto",borderRadius:2}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
            <div style={{background:"#F9FAFB",border:"1.5px solid #E5E7EB",borderRadius:14,padding:"22px 18px",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"#1D4ED8",borderRadius:"14px 14px 0 0"}}/>
              <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:14}}>
                <div style={{width:42,height:42,borderRadius:10,background:"#DBEAFE",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Store size={20} color="#1D4ED8" strokeWidth={1.8}/></div>
                <div>
                  <h3 style={{fontSize:14,fontWeight:700,color:"#111827",margin:0}}>Retrait sur Place</h3>
                  <p style={{fontSize:10,color:"#1D4ED8",fontWeight:600,margin:"3px 0 0"}}>CASABLANCA · GRATUIT</p>
                </div>
              </div>
              <p style={{fontSize:13,color:"#6B7280",lineHeight:1.65,marginBottom:13}}>Retrait gratuit dans notre point de retrait à Casablanca.</p>
              <div style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:9,padding:"10px 12px"}}>
                <p style={{fontSize:10,fontWeight:700,color:"#D97706",margin:"0 0 3px"}}>⚠️ IMPORTANT</p>
                <p style={{fontSize:12,color:"#92400E",lineHeight:1.6,margin:0}}>Ce point n'est pas un magasin. Attendez la confirmation WhatsApp avant de vous déplacer.</p>
              </div>
            </div>
            <div style={{background:"#F9FAFB",border:"1.5px solid #E5E7EB",borderRadius:14,padding:"22px 18px",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"#059669",borderRadius:"14px 14px 0 0"}}/>
              <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:14}}>
                <div style={{width:42,height:42,borderRadius:10,background:"#D1FAE5",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Truck size={20} color="#059669" strokeWidth={1.8}/></div>
                <div>
                  <h3 style={{fontSize:14,fontWeight:700,color:"#111827",margin:0}}>Livraison Partout au Maroc</h3>
                  <p style={{fontSize:10,color:"#059669",fontWeight:600,margin:"3px 0 0"}}>TRANSPORTEURS PROFESSIONNELS</p>
                </div>
              </div>
              <div style={{background:"#FFFFFF",border:"1px solid #E5E7EB",borderRadius:9,padding:"13px",marginBottom:12}}>
                <p style={{fontSize:9,fontWeight:700,letterSpacing:"1px",color:"#9CA3AF",marginBottom:8}}>TARIFS</p>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <span style={{fontSize:12.5,color:"#374151"}}>Petits colis</span>
                  <span style={{fontSize:12.5,fontWeight:700,color:"#059669"}}>à partir de 100 DH</span>
                </div>
              </div>
              <p style={{fontSize:12,color:"#6B7280",lineHeight:1.6}}>Indiquez une adresse professionnelle si vous êtes souvent absent.</p>
            </div>
          </div>
          <div style={{textAlign:"center",marginTop:24}}>
            <a href={`https://wa.me/${WA}?text=${encodeURIComponent("Bonjour MY Auto Pièces, j'ai une question sur la livraison.")}`} target="_blank" rel="noreferrer"
              style={{display:"inline-flex",alignItems:"center",gap:7,padding:"11px 20px",background:"#F0FDF4",border:"1.5px solid #86EFAC",borderRadius:10,color:"#15803D",textDecoration:"none",fontSize:13,fontWeight:700}}>
              <WaIco/> Poser une question
            </a>
          </div>
        </div>
      </div>
    </>
  );

  const CatalogueView = () => {
    const desc=[fBrand!=="Toutes marques"&&fBrand,fModel!=="Tous modèles"&&fModel,fYear!=="Toutes années"&&fYear].filter(Boolean).join(" · ")||"Tout le catalogue";
    return (
      <div style={{maxWidth:1280,margin:"0 auto",padding:"40px 20px"}}>
        <button onClick={()=>setView("home")} style={{display:"inline-flex",alignItems:"center",gap:7,marginBottom:24,background:"#F9FAFB",border:"1.5px solid #E5E7EB",borderRadius:9,padding:"8px 14px",color:"#6B7280",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .15s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="#1D4ED8";e.currentTarget.style.color="#1D4ED8";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="#E5E7EB";e.currentTarget.style.color="#6B7280";}}>← Retour à l'accueil</button>
        <div style={{marginBottom:28}}><SearchBox/></div>
        <div style={{marginBottom:22,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
          <span style={{fontSize:9,fontWeight:700,letterSpacing:"2px",color:"#1D4ED8"}}>RÉSULTATS —</span>
          <span style={{fontSize:13,fontWeight:600,color:"#111827"}}>{desc}</span>
          {(fBrand!=="Toutes marques"||fModel!=="Tous modèles"||fYear!=="Toutes années")&&(
            <button onClick={()=>{setFBrand("Toutes marques");setFModel("Tous modèles");setFYear("Toutes années");}} style={{fontSize:11,color:"#9CA3AF",background:"none",border:"none",cursor:"pointer",textDecoration:"underline",fontFamily:"'Inter',sans-serif"}}>Effacer</button>
          )}
        </div>
        <ProductGrid brand={fBrand} model={fModel} year={fYear} onProductClick={goToProduct} />
      </div>
    );
  };

  const BrandView = () => {
    const accent = BRAND_ACCENT[activeBrand]||"#1D4ED8";
    const filter = LOGO_FILTER[activeBrand]||"none";
    const bModels = (MODELS[activeBrand]||[]).filter(m=>m!=="Tous modèles");
    return (
      <div style={{maxWidth:1280,margin:"0 auto",padding:"40px 20px"}}>
        <button onClick={()=>setView("home")} style={{display:"inline-flex",alignItems:"center",gap:7,marginBottom:24,background:"#F9FAFB",border:"1.5px solid #E5E7EB",borderRadius:9,padding:"8px 14px",color:"#6B7280",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .15s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="#1D4ED8";e.currentTarget.style.color="#1D4ED8";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="#E5E7EB";e.currentTarget.style.color="#6B7280";}}>← Retour à l'accueil</button>

        <div style={{background:"#FFFFFF",border:"1.5px solid #E5E7EB",borderRadius:16,padding:"28px 24px",marginBottom:28,display:"flex",alignItems:"center",gap:20,flexWrap:"wrap",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:4,background:accent,borderRadius:"16px 16px 0 0"}}/>
          <div style={{width:90,height:64,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <img src={BRAND_LOGOS[activeBrand]} alt={activeBrand} style={{maxWidth:84,maxHeight:60,objectFit:"contain",filter:filter}}/>
          </div>
          <div style={{flex:1}}>
            <p style={{fontSize:9,fontWeight:700,letterSpacing:"2px",color:"#9CA3AF",marginBottom:4}}>PIÈCES DISPONIBLES</p>
            <h2 style={{fontSize:"clamp(22px,4vw,34px)",fontWeight:900,color:"#111827",margin:0,letterSpacing:"-.5px"}}>{activeBrand}</h2>
          </div>
          <a href={`https://wa.me/${WA}?text=${encodeURIComponent("Bonjour, je cherche une pièce pour "+activeBrand)}`} target="_blank" rel="noreferrer"
            style={{display:"inline-flex",alignItems:"center",gap:7,padding:"10px 16px",background:"#F0FDF4",border:"1.5px solid #86EFAC",borderRadius:10,color:"#15803D",textDecoration:"none",fontSize:13,fontWeight:700}}>
            <WaIco/> Nous contacter
          </a>
        </div>

        {bModels.length>0&&(
          <div style={{marginBottom:24}}>
            <p style={{fontSize:9,fontWeight:700,letterSpacing:"2px",color:"#1D4ED8",marginBottom:12}}>CHOISIR UN MODÈLE</p>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {["Tous modèles",...bModels].map(m=>(
                <button key={m} onClick={()=>setFModel(m)}
                  style={{padding:"7px 14px",borderRadius:20,border:"1.5px solid",borderColor:fModel===m?accent:"#E5E7EB",background:fModel===m?`${accent}12`:"#fff",color:fModel===m?accent:"#6B7280",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .15s"}}>
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        <ProductGrid brand={fBrand} model={fModel} year={fYear} onProductClick={goToProduct} />
      </div>
    );
  };

  return (
    <div ref={topRef} style={{minHeight:"100vh",background:"#F9FAFB",fontFamily:"'Inter',sans-serif",color:"#111827"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes drawerIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}
        @keyframes dropIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes waPulse{0%,100%{box-shadow:0 4px 20px rgba(37,211,102,0.5)}50%{box-shadow:0 4px 32px rgba(37,211,102,0.8),0 0 0 8px rgba(37,211,102,0.12)}}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#D1D5DB;border-radius:10px}
        .logo-img{display:block;background:transparent!important;border:none!important;box-shadow:none!important;padding:0!important;mix-blend-mode:screen;object-fit:contain;transition:opacity .2s,transform .2s}
        .logo-img:hover{opacity:.88;transform:scale(1.03)}
        .burger{display:flex;align-items:center;justify-content:center;width:40px;height:40px;background:none;border:none;color:rgba(255,255,255,0.65);cursor:pointer;border-radius:8px;transition:color .2s,background .2s}
        .burger:hover{color:#fff;background:rgba(255,255,255,0.12)}
        .hi{padding:0 20px;height:64px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;max-width:1400px;margin:0 auto;width:100%}
        .wa-pill{display:none}
        .mob-hide{display:none}
        @media(min-width:640px){.hi{padding:0 28px;height:70px}.mob-hide{display:inline}}
        @media(min-width:1024px){.hi{padding:0 40px;height:74px}.wa-pill{display:flex}}
      `}</style>

      {orderProduct&&<OrderModal product={orderProduct} onClose={()=>setOrderProduct(null)}/>}

      {menuOpen&&(
        <>
          <div onClick={()=>setMenuOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:500,backdropFilter:"blur(5px)"}}/>
          <div style={{position:"fixed",top:0,left:0,bottom:0,width:300,maxWidth:"85vw",background:"#FFFFFF",borderRight:"1px solid #E5E7EB",zIndex:501,display:"flex",flexDirection:"column",animation:"drawerIn .28s cubic-bezier(0.4,0,0.2,1)",boxShadow:"8px 0 32px rgba(0,0,0,0.12)"}}>

            <div style={{padding:"20px 18px 16px",borderBottom:"1px solid #E5E7EB",background:"#1535A0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <img src={LOGO_SRC} alt="MY" className="logo-img" style={{height:38}}/>
                <div>
                  <div style={{fontSize:17,fontWeight:900,letterSpacing:"2px",color:"#FFFFFF"}}>MY AUTO PIÈCES</div>
                </div>
              </div>
              <button onClick={()=>setMenuOpen(false)} style={{width:30,height:30,borderRadius:"50%",background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><XIco/></button>
            </div>

            <nav style={{flex:1,padding:"12px 10px",overflowY:"auto"}}>
              <p style={{fontSize:9,fontWeight:700,letterSpacing:"2px",color:"#1D4ED8",padding:"8px 10px 6px",margin:0}}>CATÉGORIES</p>
              {[
                [<Zap size={15}/>,      "Phares & Optiques"],
                [<Circle size={15}/>,   "Feux Arrière"],
                [<ScanLine size={15}/>, "Antibrouillards"],
                [<Car size={15}/>,      "Clignotants"],
                [<Package2 size={15}/>, "Tout le Catalogue"],
              ].map(([ico,lbl])=>(
                <button key={lbl} onClick={()=>{setMenuOpen(false);setView("catalogue");window.scrollTo({top:0,behavior:"smooth"});}}
                  style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"11px 10px",borderRadius:10,border:"none",background:"transparent",color:"#374151",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"'Inter',sans-serif",marginBottom:2,transition:"background .12s,color .12s"}}
                  onMouseEnter={e=>{e.currentTarget.style.background="#EFF6FF";e.currentTarget.style.color="#1D4ED8";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#374151";}}>
                  <span style={{display:"flex",flexShrink:0,color:"inherit"}}>{ico}</span>{lbl}
                </button>
              ))}

              <div style={{height:1,background:"#E5E7EB",margin:"10px 10px"}}/>
              <p style={{fontSize:9,fontWeight:700,letterSpacing:"2px",color:"#1D4ED8",padding:"6px 10px",margin:0}}>MARQUES</p>
              {["Renault","Dacia","Citroën","Nissan","Peugeot","Fiat"].map(brand=>(
                <button key={brand} onClick={()=>{setMenuOpen(false);goToBrand(brand);}}
                  style={{width:"100%",display:"flex",alignItems:"center",gap:11,padding:"10px 10px",borderRadius:9,border:"none",background:"transparent",color:"#374151",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"'Inter',sans-serif",marginBottom:2,transition:"background .12s,color .12s"}}
                  onMouseEnter={e=>{e.currentTarget.style.background="#F9FAFB";e.currentTarget.style.color="#111827";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#374151";}}>
                  <div style={{width:30,height:24,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <img src={BRAND_LOGOS[brand]} alt={brand} style={{maxWidth:28,maxHeight:22,objectFit:"contain",filter:LOGO_FILTER[brand]||"none"}}/>
                  </div>
                  {brand}
                </button>
              ))}

              <div style={{height:1,background:"#E5E7EB",margin:"10px 10px"}}/>
              {[
                [<Home size={15}/>,     "Accueil",    ()=>{setMenuOpen(false);scrollToTop();}],
                [<Search size={15}/>,  "Rechercher", ()=>{setMenuOpen(false);scrollToSearch();}],
                [<BookOpen size={15}/>, "Blog",      ()=>{setMenuOpen(false);window.location.href="/blog";}],
                [<Phone size={15}/>,   "Contact",    ()=>setMenuOpen(false)],
              ].map(([ico,lbl,fn])=>(
                <button key={lbl} onClick={fn} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 10px",borderRadius:9,border:"none",background:"transparent",color:"#6B7280",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"'Inter',sans-serif",marginBottom:2,transition:"background .12s,color .12s"}}
                  onMouseEnter={e=>{e.currentTarget.style.background="#F9FAFB";e.currentTarget.style.color="#374151";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#6B7280";}}>
                  <span style={{display:"flex",color:"inherit"}}>{ico}</span>{lbl}
                </button>
              ))}
            </nav>

            <div style={{padding:"14px 18px 24px",borderTop:"1px solid #E5E7EB",background:"#F9FAFB"}}>
              <a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer"
                style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"13px",background:"#25D366",color:"#fff",borderRadius:12,textDecoration:"none",fontSize:14,fontWeight:700}}>
                <WaIco/> 06 34 11 92 67
              </a>
              <p style={{fontSize:10,color:"#9CA3AF",textAlign:"center",marginTop:8}}>Lun–Sam · 09h00 – 18h00</p>
            </div>
          </div>
        </>
      )}

      {view !== "product" && (
        <a href={`https://wa.me/${WA}?text=${waMsg}`} target="_blank" rel="noreferrer"
          style={{position:"fixed",bottom:20,right:16,zIndex:100,width:56,height:56,borderRadius:"50%",background:"#25D366",display:"flex",alignItems:"center",justifyContent:"center",textDecoration:"none",color:"#fff",animation:"waPulse 2.6s ease-in-out infinite",transition:"transform .2s",boxShadow:"0 4px 20px rgba(37,211,102,0.5)"}}
          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"}
          onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
          <WaIco size={24}/>
        </a>
      )}

      <header style={{background:"#1535A0",borderBottom:"1px solid rgba(0,0,0,0.15)",position:"sticky",top:0,zIndex:50}}>
        <div style={{background:"#0F2880",borderBottom:"1px solid rgba(0,0,0,0.1)"}}>
          <div style={{maxWidth:1400,margin:"0 auto",padding:"4px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",gap:16,alignItems:"center"}}>
              <span style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.88)"}}><Phone size={11} style={{display:"inline-block",verticalAlign:"middle",marginRight:3}}/> 06 34 11 92 67</span>
              <span className="mob-hide" style={{fontSize:10,color:"rgba(255,255,255,0.2)"}}>|</span>
              <span className="mob-hide" style={{fontSize:11,color:"rgba(255,255,255,0.55)"}}><Mail size={11} style={{display:"inline-block",verticalAlign:"middle",marginRight:3}}/> myautopieces@gmail.com</span>
            </div>
            <span style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.92)"}}><MapPin size={12} style={{display:"inline-block",verticalAlign:"middle",marginRight:3}}/> Casablanca, Maroc</span>
          </div>
        </div>

        <div className="hi">
          <div style={{display:"flex",alignItems:"center",justifyContent:"flex-start"}}>
            <button className="burger" onClick={()=>setMenuOpen(true)} aria-label="Menu"><BurgerIco/></button>
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
            <button onClick={scrollToTop} style={{display:"flex",alignItems:"center",gap:10,background:"none",border:"none",cursor:"pointer",padding:"4px"}}>
              <img src={LOGO_SRC} alt="MY Auto Pièces" className="logo-img" style={{height:50}}/>
              <div style={{textAlign:"left"}}>
                <div style={{fontSize:"clamp(18px,2.2vw,24px)",fontWeight:900,letterSpacing:"2.5px",color:"#FFFFFF",lineHeight:1,whiteSpace:"nowrap"}}>MY AUTO PIÈCES</div>
              </div>
            </button>
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:10}}>
            <button onClick={scrollToSearch} aria-label="Rechercher"
              style={{width:38,height:38,borderRadius:8,background:"none",border:"none",color:"rgba(255,255,255,0.55)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"color .2s,background .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.color="#fff";e.currentTarget.style.background="rgba(255,255,255,0.12)";}}
              onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.55)";e.currentTarget.style.background="none";}}>
              <SearchIco/>
            </button>
            <a href="/blog"
              style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.75)",textDecoration:"none",padding:"6px 12px",borderRadius:8,transition:"color .2s,background .2s",whiteSpace:"nowrap"}}
              onMouseEnter={e=>{e.currentTarget.style.color="#fff";e.currentTarget.style.background="rgba(255,255,255,0.1)";}}
              onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.75)";e.currentTarget.style.background="transparent";}}>
              Blog
            </a>
            <a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer" className="wa-pill"
              style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.22)",borderRadius:20,color:"#fff",textDecoration:"none",fontSize:11.5,fontWeight:600,whiteSpace:"nowrap",transition:"background .2s"}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.22)"}
              onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.12)"}>
              <WaIco/><span style={{marginLeft:4}}>06 34 11 92 67</span>
            </a>
          </div>
        </div>
      </header>

      {view==="home"      && <HomeView/>}
      {view==="catalogue" && <div style={{background:"#F9FAFB",minHeight:"60vh"}}><CatalogueView/></div>}
      {view==="brand"     && <div style={{background:"#F9FAFB",minHeight:"60vh"}}><BrandView/></div>}
      {view==="product"   && selectedProduct && (
        <ProductPage product={selectedProduct} onBack={backFromProduct} />
      )}

      <footer style={{background:"#1535A0",borderTop:"1px solid rgba(0,0,0,0.1)"}}>
        <div style={{maxWidth:1280,margin:"0 auto",padding:"22px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:14}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <img src={LOGO_SRC} alt="MY" className="logo-img" style={{height:30}}/>
            <div>
              <div style={{fontSize:11,fontWeight:800,letterSpacing:"2px",color:"rgba(255,255,255,0.8)"}}>MY AUTO PIÈCES</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.35)",letterSpacing:"1px",marginTop:1}}>© 2025 · CASABLANCA · MAROC</div>
            </div>
          </div>
          <div style={{display:"flex",gap:18,flexWrap:"wrap"}}>
            <span style={{fontSize:11.5,color:"rgba(255,255,255,0.65)"}}><Phone size={11} style={{display:"inline-block",verticalAlign:"middle",marginRight:3}}/> 06 34 11 92 67</span>
            <span style={{fontSize:11.5,color:"rgba(255,255,255,0.45)"}}><Mail size={11} style={{display:"inline-block",verticalAlign:"middle",marginRight:3}}/> myautopieces@gmail.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
