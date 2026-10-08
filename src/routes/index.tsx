import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import {
  Heart, MapPin, BedDouble, Bath, Maximize, Search, SlidersHorizontal, ArrowRight, Menu, X,
  Compass, Eye, Bookmark, CheckCircle2, Bell, Globe, Apple, Play,
} from "lucide-react";
import { LangProvider, useLang, type Lang } from "@/lib/i18n";
import logo from "@/assets/hekwa-logo.png.asset.json";
import heroImg from "@/assets/hero-villa.jpg";
import interiorImg from "@/assets/interior.jpg";
import homeImg from "@/assets/home.jpg";
import cineImg from "@/assets/cinematic.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HEKWA — Search. See. Love. | The property app" },
      { name: "description", content: "Meet the HEKWA app: search, explore, save and decide on your next place — all in one simple experience." },
      { property: "og:title", content: "HEKWA — Search. See. Love." },
      { property: "og:description", content: "Discover places that feel right, before you even step inside." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <LangProvider>
      <Page />
    </LangProvider>
  ),
});

const ease = [0.22, 1, 0.36, 1] as const;

const properties = [
  { img: heroImg, type: "villa" as const, title: "Modern Villa", loc: "Lahore, Pakistan", price: "PKR 45,000,000", beds: 3, baths: 4, area: "4,500 sqft" },
  { img: interiorImg, type: "apartment" as const, title: "Skyline Apartment", loc: "Karachi, Pakistan", price: "PKR 28,500,000", beds: 2, baths: 2, area: "1,850 sqft" },
  { img: homeImg, type: "home" as const, title: "Garden Family Home", loc: "Islamabad, Pakistan", price: "PKR 36,000,000", beds: 4, baths: 3, area: "3,200 sqft" },
];

function Page() {
  const { lang } = useLang();
  return (
    <div className="overflow-x-clip">
      <Header />
      <AnimatePresence mode="wait">
        <motion.main key={lang} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, ease }}>
          <Hero />
          <Brand />
          <AppShowcase />
          <FeatureGrid />
          <Why />
          <Download />
          <Cinematic />
          <FinalCta />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

function Logo({ className = "" }: { className?: string }) {
  return <img src={logo.url} alt="HEKWA — Search. See. Love." className={`w-auto ${className}`} width={230} height={296} />;
}

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p className={`mb-5 text-xs font-semibold tracking-[0.25em] ${light ? "text-primary-soft" : "text-primary"}`}>{children}</p>
  );
}

const h2 = "text-[2.25rem] md:text-6xl font-semibold leading-[1.05] tracking-tight";

/* ---------------- Header ---------------- */
function LangToggle() {
  const { lang, setLang } = useLang();
  const change = (l: Lang) => { const y = window.scrollY; setLang(l); requestAnimationFrame(() => window.scrollTo(0, y)); };
  return (
    <div className="relative flex rounded-full bg-muted p-1 text-xs font-semibold" role="group" aria-label="Language">
      {(["en", "fr"] as const).map((l) => (
        <button key={l} onClick={() => change(l)} aria-pressed={lang === l}
          className={`relative z-10 rounded-full px-3 py-1.5 transition-colors ${lang === l ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
          {lang === l && <motion.span layoutId="lang-pill" className="absolute inset-0 -z-10 rounded-full bg-primary" transition={{ duration: 0.4, ease }} />}
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function Header() {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 30);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const ids = ["home", "how", "features", "about", "download"];
  return (
    <motion.header initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.3, ease }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-5">
      <div className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-border/60 px-4 backdrop-blur-xl transition-all duration-500 md:px-6 ${scrolled ? "bg-card/90 py-2 shadow-soft" : "bg-card/60 py-3"}`}>
        <a href="#home" aria-label="HEKWA home"><Logo className={`transition-all duration-500 ${scrolled ? "h-11" : "h-14"}`} /></a>
        <nav className="hidden items-center gap-8 lg:flex">
          {t.nav.map((n, i) => (
            <a key={n} href={`#${ids[i]}`} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">{n}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LangToggle />
          <a href="#download" className="btn-primary hidden rounded-full px-5 py-2.5 text-sm font-semibold md:inline-flex">{t.explore}</a>
          <button className="rounded-full p-2 lg:hidden" onClick={() => setOpen(!open)} aria-label={t.menu} aria-expanded={open}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease }}
            className="glass mx-auto mt-2 max-w-7xl rounded-2xl p-6 lg:hidden">
            <nav className="flex flex-col gap-1">
              {t.nav.map((n, i) => (
                <a key={n} href={`#${ids[i]}`} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-2xl font-semibold tracking-tight hover:bg-muted">{n}</a>
              ))}
            </nav>
            <a href="#download" onClick={() => setOpen(false)} className="btn-primary mt-4 flex justify-center rounded-full px-5 py-3 font-semibold">{t.explore}</a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ---------------- Hero ---------------- */
function SaveButton({ dark = false }: { dark?: boolean }) {
  const { t } = useLang();
  const [on, setOn] = useState(false);
  return (
    <button onClick={() => setOn(!on)} aria-pressed={on}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${on ? "bg-primary text-primary-foreground" : dark ? "bg-card/20 text-navy-foreground" : "bg-primary-soft text-primary"}`}>
      <motion.span animate={on ? { scale: [1, 1.4, 1] } : {}} transition={{ duration: 0.4 }}>
        <Heart className={`h-3.5 w-3.5 ${on ? "fill-current" : ""}`} />
      </motion.span>
      {on ? t.saved : t.save}
    </button>
  );
}

function Hero() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  return (
    <section id="home" ref={ref} className="relative min-h-screen pt-32 pb-20 md:pt-40">
      <div className="bg-gradient-soft pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.5, ease }}>
            <Eyebrow>{t.heroEyebrow}</Eyebrow>
          </motion.div>
          <h1 className="text-[2.9rem] font-semibold leading-[0.98] tracking-tight sm:text-7xl xl:text-[6.2rem]">
            {t.heroTitle.map((w, i) => (
              <span key={w} className="block overflow-hidden pb-1">
                <motion.span className={`block ${i === 2 ? "text-primary" : ""}`} initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: 0.7 + i * 0.15, ease }}>
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.3, ease }}
            className="mt-8 max-w-lg text-xl font-medium leading-snug text-foreground md:text-2xl">{t.heroSub}</motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.45, ease }}
            className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">{t.heroPara}</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.6, ease }}
            className="mt-10 flex flex-wrap gap-3">
            <a href="#download" className="btn-primary inline-flex items-center gap-2 rounded-full px-7 py-4 font-semibold">{t.explore} <ArrowRight className="h-4 w-4" /></a>
            <a href="#features" className="btn-secondary inline-flex items-center rounded-full px-7 py-4 font-semibold">{t.discoverHekwa}</a>
          </motion.div>
        </div>

        <div className="relative">
          <motion.div initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.8, delay: 0.1, ease }}
            className="shadow-float relative aspect-[4/5] overflow-hidden rounded-[2rem] sm:aspect-[5/4] lg:aspect-[4/5]">
            <motion.img style={{ y: imgY }} src={heroImg} alt="Modern villa with infinity pool at blue hour" width={1600} height={1104}
              className="absolute inset-0 h-[115%] w-full object-cover" />
          </motion.div>

          <motion.div style={{ y: cardY }} className="absolute -bottom-8 left-3 right-3 sm:left-auto sm:-left-10 sm:right-auto sm:w-80">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 1.9, ease }}
              className="glass rounded-3xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-primary">{t.heroCardTag}</p>
                  <p className="mt-1 text-lg font-semibold leading-tight">{t.heroCardTitle}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t.heroCardText}</p>
                </div>
                <SaveButton />
              </div>
              <div className="mt-4 flex items-center gap-4 border-t border-border/70 pt-4 text-xs font-semibold text-muted-foreground">
                <span className="flex items-center gap-1"><Search className="h-3.5 w-3.5 text-primary" />{t.stages[0]!.k}</span>
                <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5 text-primary" />{t.stages[1]!.k}</span>
                <span className="flex items-center gap-1"><Bookmark className="h-3.5 w-3.5 text-primary" />{t.stages[3]!.k}</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.1, delay: 2.1, ease }}
            className="glass absolute -right-4 top-10 hidden items-center gap-3 rounded-2xl px-4 py-3 md:flex">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground"><Search className="h-4 w-4" /></span>
            <div className="text-sm"><p className="font-semibold">Lahore</p><p className="text-xs text-muted-foreground">{t.filters[0]} · {t.filters[2]}</p></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Brand ---------------- */
function Brand() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  return (
    <section id="how" ref={ref} className="relative py-28 md:py-40">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <Eyebrow>{t.brandEyebrow}</Eyebrow>
          <h2 className={h2}>{t.brandTitle}</h2>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-muted-foreground">{t.brandText}</p>
        </Reveal>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-float lg:-mr-24">
          <motion.img style={{ y }} src={interiorImg} alt="Bright living room with city views" loading="lazy" width={1408} height={1008}
            className="absolute inset-0 h-[120%] w-full -translate-y-[8%] object-cover" />
        </div>
      </div>
    </section>
  );
}

/* ---------------- App showcase ---------------- */
function Screen({ progress, index, children }: { progress: MotionValue<number>; index: number; children: ReactNode }) {
  const step = 1 / 5;
  const s = index * step;
  const e = s + step;
  const first = index === 0, last = index === 4;
  const p = useTransform(progress, (v) => Math.min(1, Math.max(0, v)));
  const r = first ? [0, 0.01, e - 0.04, e + 0.04] : last ? [s - 0.06, s + 0.02, 0.99, 1] : [s - 0.06, s + 0.02, e - 0.04, e + 0.04];
  const opacity = useTransform(p, r, [first ? 1 : 0, 1, 1, last ? 1 : 0]);
  const y = useTransform(p, r, [first ? 0 : 60, 0, 0, last ? 0 : -60]);
  const scale = useTransform(p, r, [first ? 1 : 0.94, 1, 1, last ? 1 : 1.04]);
  const blur = useTransform(p, r, [first ? 0 : 8, 0, 0, last ? 0 : 8]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  return <motion.div style={{ opacity, y, scale, filter }} className="absolute inset-0 p-4 pt-12">{children}</motion.div>;
}

function StageText({ progress, index, k, title, desc }: { progress: MotionValue<number>; index: number; k: string; title: string; desc: string }) {
  const s = index / 5, e = s + 0.2;
  const p = useTransform(progress, (v) => Math.min(1, Math.max(0, v)));
  const r = index === 0 ? [0, 0.01, e - 0.04, e + 0.02] : index === 4 ? [s - 0.04, s + 0.03, 0.99, 1] : [s - 0.04, s + 0.03, e - 0.04, e + 0.02];
  const opacity = useTransform(p, r, [index === 0 ? 1 : 0, 1, 1, index === 4 ? 1 : 0]);
  const y = useTransform(p, r, [index === 0 ? 0 : 30, 0, 0, index === 4 ? 0 : -30]);
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 top-0">
      <p className="text-sm font-semibold tracking-[0.2em] text-primary">0{index + 1} — {k.toUpperCase()}</p>
      <h3 className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-5xl">{title}</h3>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">{desc}</p>
    </motion.div>
  );
}

function MiniCard({ img, title, price, loc }: { img: string; title: string; price: string; loc: string }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-card p-2 shadow-soft">
      <img src={img} alt="" className="h-16 w-20 rounded-xl object-cover" loading="lazy" />
      <div className="min-w-0 py-1">
        <p className="truncate text-sm font-semibold">{title}</p>
        <p className="truncate text-[11px] text-muted-foreground">{loc}</p>
        <p className="mt-1 text-xs font-bold text-primary">{price}</p>
      </div>
    </div>
  );
}

function AppShowcase() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const phoneRotate = useTransform(scrollYProgress, [0, 0.5, 1], [-4, 0, 3]);
  const barW = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <section id="features" className="relative">
      <div className="mx-auto max-w-4xl px-5 pt-28 text-center md:pt-36">
        <Reveal>
          <Eyebrow>{t.appEyebrow}</Eyebrow>
          <h2 className={h2}>{t.appTitle}</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">{t.appText}</p>
        </Reveal>
      </div>
      <div ref={ref} className="relative h-[500vh]">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="bg-gradient-soft pointer-events-none absolute inset-0" />
          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-8 px-5 md:grid-cols-2 md:px-8">
            <div className="relative order-2 h-44 md:order-1 md:h-72">
              {t.stages.map((s, i) => <StageText key={s.k} progress={scrollYProgress} index={i} k={s.k} title={s.t} desc={s.d} />)}
              <div className="absolute -bottom-6 left-0 h-1 w-40 overflow-hidden rounded-full bg-border md:bottom-0">
                <motion.div style={{ width: barW }} className="h-full bg-primary" />
              </div>
            </div>
            <motion.div style={{ rotate: phoneRotate }} className="order-1 mx-auto md:order-2">
              <div className="shadow-float relative h-[58vh] max-h-[640px] min-h-[440px] aspect-[9/19] rounded-[2.8rem] border-[10px] border-navy bg-background">
                <div className="absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-navy" />
                <div className="pointer-events-none absolute inset-0 z-10 rounded-[2.2rem] bg-[linear-gradient(130deg,oklch(1_0_0/0.25),transparent_35%)]" />
                <div className="relative h-full overflow-hidden rounded-[2.2rem]">
                  {/* Search */}
                  <Screen progress={scrollYProgress} index={0}>
                    <Logo className="mx-auto h-16" />
                    <div className="mt-4 flex items-center gap-2 rounded-2xl bg-card px-3 py-3 shadow-soft">
                      <Search className="h-4 w-4 text-primary" /><span className="text-xs text-muted-foreground">{t.searchPh}</span>
                      <SlidersHorizontal className="ml-auto h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {t.filters.map((f, i) => <span key={f} className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{f}</span>)}
                    </div>
                    <div className="mt-5 space-y-2">
                      {["Lahore", "Islamabad", "Karachi"].map((c) => (
                        <div key={c} className="flex items-center gap-2 rounded-xl bg-muted/70 px-3 py-2.5 text-xs"><MapPin className="h-3.5 w-3.5 text-primary" />{c}, Pakistan</div>
                      ))}
                    </div>
                  </Screen>
                  {/* Explore */}
                  <Screen progress={scrollYProgress} index={1}>
                    <p className="text-lg font-semibold">{t.stages[1]!.k}</p>
                    <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-2xl">
                      <img src={heroImg} alt="" className="h-full w-full object-cover" loading="lazy" />
                      <div className="glass absolute inset-x-2 bottom-2 rounded-xl p-2">
                        <p className="text-xs font-semibold">{t.villa}</p><p className="text-[11px] font-bold text-primary">PKR 45,000,000</p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-2">
                      {properties.slice(1).map((p) => <MiniCard key={p.title} img={p.img} title={p.title} price={p.price} loc={p.loc} />)}
                    </div>
                  </Screen>
                  {/* Details */}
                  <Screen progress={scrollYProgress} index={2}>
                    <div className="-mx-4 -mt-12 aspect-[4/3.4] overflow-hidden"><img src={homeImg} alt="" className="h-full w-full object-cover" loading="lazy" /></div>
                    <div className="relative -mt-6 rounded-t-3xl bg-background pt-4">
                      <div className="flex items-start justify-between">
                        <div><p className="text-base font-semibold">Garden Family Home</p><p className="text-[11px] text-muted-foreground">Islamabad, Pakistan</p></div>
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground"><Heart className="h-4 w-4 fill-current" /></span>
                      </div>
                      <p className="mt-2 text-lg font-bold text-primary">PKR 36,000,000</p>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px]">
                        <div className="rounded-xl bg-muted py-2">4 {t.beds}</div><div className="rounded-xl bg-muted py-2">3 {t.baths}</div><div className="rounded-xl bg-muted py-2">3,200</div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">{t.amenities.map((a) => <span key={a} className="rounded-full bg-primary-soft px-2.5 py-1 text-[10px] font-semibold text-primary">{a}</span>)}</div>
                    </div>
                  </Screen>
                  {/* Save */}
                  <Screen progress={scrollYProgress} index={3}>
                    <p className="flex items-center gap-2 text-lg font-semibold"><Heart className="h-5 w-5 fill-primary text-primary" />{t.favorites}</p>
                    <div className="mt-4 space-y-2">
                      {[...properties, properties[0]!].map((p, i) => <MiniCard key={i} img={p.img} title={p.title} price={p.price} loc={p.loc} />)}
                    </div>
                  </Screen>
                  {/* Decide */}
                  <Screen progress={scrollYProgress} index={4}>
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <div className="relative w-full overflow-hidden rounded-3xl shadow-float">
                        <img src={heroImg} alt="" className="aspect-square w-full object-cover" loading="lazy" />
                        <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground"><CheckCircle2 className="h-5 w-5" /></span>
                      </div>
                      <p className="mt-5 text-lg font-semibold">{t.villa}</p>
                      <p className="text-xs text-muted-foreground">Lahore, Pakistan</p>
                      <span className="btn-primary mt-5 rounded-full px-6 py-2.5 text-sm font-semibold">{t.explore}</span>
                    </div>
                  </Screen>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Feature grid ---------------- */
function FeatureGrid() {
  const { t } = useLang();
  const icons = [Search, SlidersHorizontal, MapPin, Heart, Bell, Globe];
  return (
    <section className="bg-secondary/60 py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow>{t.featEyebrow}</Eyebrow>
          <h2 className={h2}>{t.featTitle}</h2>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">{t.featText}</p>
        </Reveal>
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.feats.map((f, i) => {
            const I = icons[i]!;
            return (
              <Reveal key={f.t} delay={(i % 3) * 0.1}>
                <div className="group h-full rounded-3xl border border-border bg-card p-7 transition-all duration-500 hover:-translate-y-1 hover:border-primary hover:shadow-soft">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"><I className="h-6 w-6" /></span>
                  <p className="mt-8 text-xl font-semibold leading-snug">{f.t}</p>
                  <p className="mt-3 text-muted-foreground">{f.d}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Download ---------------- */
function Download() {
  const { t } = useLang();
  return (
    <section id="download" className="pb-28 md:pb-36">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <Eyebrow>{t.dlEyebrow}</Eyebrow>
          <h2 className={h2}>{t.dlTitle}</h2>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">{t.dlText}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <StoreButton icon={<Apple className="h-6 w-6" />} small={t.dlIos} big="App Store" />
            <StoreButton icon={<Play className="h-6 w-6" />} small={t.dlAndroid} big="Google Play" />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">{t.dlSoon}</p>
        </Reveal>
        <Reveal delay={0.1} className="overflow-hidden rounded-[2rem] shadow-float">
          <img src={interiorImg} alt="Bright living room seen through the HEKWA app" loading="lazy" width={1408} height={1008} className="aspect-[4/3] w-full object-cover" />
        </Reveal>
      </div>
    </section>
  );
}

function StoreButton({ icon, small, big }: { icon: ReactNode; small: string; big: string }) {
  return (
    <a href="#download" className="inline-flex items-center gap-3 rounded-2xl bg-foreground px-5 py-3 text-background transition-transform duration-500 hover:-translate-y-0.5">
      {icon}
      <span className="text-left leading-tight"><span className="block text-[11px] opacity-75">{small}</span><span className="block text-lg font-semibold">{big}</span></span>
    </a>
  );
}

/* ---------------- Why ---------------- */
function Why() {
  const { t } = useLang();
  const icons = [Compass, Eye, Bookmark, CheckCircle2];
  return (
    <section id="about" className="py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow>{t.whyEyebrow}</Eyebrow>
          <h2 className={h2}>{t.whyTitle}</h2>
        </Reveal>
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.why.map((w, i) => {
            const I = icons[i]!;
            return (
              <Reveal key={w.k} delay={i * 0.1}>
                <div className="h-full rounded-3xl border border-border bg-card p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-soft">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary"><I className="h-6 w-6" /></span>
                  <p className="mt-8 text-sm font-semibold tracking-[0.2em] text-primary">{w.k.toUpperCase()}</p>
                  <p className="mt-3 text-xl font-semibold leading-snug">{w.t}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Cinematic ---------------- */
function Cinematic() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [80, -60]);
  const overlay = useTransform(useTransform(scrollYProgress, (v) => Math.min(1, Math.max(0, v))), [0, 0.5, 1], [0.3, 0.55, 0.7]);
  return (
    <section ref={ref} className="relative h-[90vh] min-h-[600px] overflow-hidden">
      <motion.img style={{ scale }} src={cineImg} alt="Glass hillside residence at dusk above city lights" loading="lazy" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover" />
      <motion.div style={{ opacity: overlay }} className="absolute inset-0 bg-navy" />
      <motion.div style={{ y }} className="relative flex h-full flex-col items-center justify-center px-5 text-center text-navy-foreground">
        <p className="text-sm font-semibold tracking-[0.3em] text-primary-soft">SEARCH. SEE. LOVE.</p>
        <h2 className="mt-6 max-w-4xl text-[2.5rem] font-semibold leading-[1.02] tracking-tight md:text-7xl">{t.cineTitle}</h2>
        <a href="#download" className="btn-primary mt-10 inline-flex items-center gap-2 rounded-full px-7 py-4 font-semibold">{t.explore} <ArrowRight className="h-4 w-4" /></a>
      </motion.div>
    </section>
  );
}

/* ---------------- Final CTA ---------------- */
function FinalCta() {
  const { t } = useLang();
  return (
    <section className="px-3 py-24 md:px-6 md:py-32">
      <Reveal>
        <div className="bg-gradient-cta shine mx-auto max-w-7xl rounded-[2.5rem] px-6 py-20 text-center text-primary-foreground md:py-28">
          <div className="mx-auto mb-10 inline-block rounded-3xl bg-card p-4 shadow-float"><Logo className="h-24" /></div>
          <h2 className="mx-auto max-w-3xl text-[2.25rem] font-semibold leading-[1.05] tracking-tight md:text-6xl">{t.ctaTitle}</h2>
          <p className="mt-6 text-lg opacity-85">{t.ctaText}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href="#download" className="inline-flex items-center gap-2 rounded-full bg-card px-7 py-4 font-semibold text-primary transition-transform duration-500 hover:-translate-y-0.5">{t.explore} <ArrowRight className="h-4 w-4" /></a>
            <a href="#home" className="glass-dark inline-flex rounded-full px-7 py-4 font-semibold">{t.getStarted}</a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-8">
        <div>
          <Logo className="h-28" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">{t.footDesc}</p>
        </div>
        {t.footCols.map((c) => (
          <div key={c.h}>
            <p className="text-xs font-semibold tracking-[0.2em] text-foreground">{c.h.toUpperCase()}</p>
            <ul className="mt-5 space-y-3">
              {c.l.map((l) => <li key={l}><a href="#home" className="text-sm text-muted-foreground transition-colors hover:text-primary">{l}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-5 py-6 text-xs text-muted-foreground md:px-8">{t.rights}</p>
      </div>
    </footer>
  );
}
