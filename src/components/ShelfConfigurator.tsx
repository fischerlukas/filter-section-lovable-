import { useState, useMemo } from "react";
import shelfIllustration from "@/assets/shelf-illustration.png";
import { Check, X } from "lucide-react";
import { ChevronDown, ArrowRight, SlidersHorizontal } from "lucide-react";

const loadOptions = ["500 kg", "1.000 kg", "1.500 kg"];

const widthOptions = ["1.850 mm", "2.200 mm", "2.700 mm", "3.300 mm", "3.600 mm"];
const heightOptions = ["2.000 mm", "2.500 mm", "3.000 mm", "3.500 mm", "4.000 mm", "4.500 mm", "5.000 mm", "5.500 mm", "6.000 mm"];
const depthOptions = ["800 mm", "1.000 mm", "1.100 mm"];
const levelOptions = ["2", "3", "4", "5", "6"];

type SurfaceType = "none" | "wire" | "wood";

const surfaceOptions: { id: SurfaceType; label: string; sub: string; price: string }[] = [
  { id: "none", label: "Ohne Auflage", sub: "Ohne Aufpreis", price: "inkl." },
  { id: "wire", label: "Drahtgitter", sub: "Verzinkt", price: "27,00 €" },
  { id: "wood", label: "Holzboden", sub: "Spanplatte", price: "41,80 €" },
];

type MultiSelectProps = {
  label: string;
  selected: Set<string>;
  options: string[];
  onChange: (selected: Set<string>) => void;
};

function MultiSelectDropdown({ label, selected, options, onChange }: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const toggle = (opt: string) => {
    const next = new Set(selected);
    if (next.has(opt)) next.delete(opt);
    else next.add(opt);
    onChange(next);
  };

  const displayText = selected.size > 0
    ? Array.from(selected).join(", ")
    : "auswählen";

  return (
    <div className="relative">
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex h-11 w-full items-center justify-between rounded-full border bg-card px-5 text-sm shadow-sm transition-colors hover:border-muted-foreground/40 ${
          open ? "border-primary" : "border-input"
        }`}
      >
        <span className={`truncate pr-2 ${selected.size > 0 ? "text-foreground" : "text-muted-foreground"}`}>
          {displayText}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
            <div className="overflow-auto max-h-48 p-1 scrollbar-thin">
            {options.map((opt) => {
              const isSelected = selected.has(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggle(opt)}
                  className={`flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm transition-colors ${
                    isSelected
                      ? "bg-primary/10 text-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <div className={`flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                    isSelected ? "border-primary bg-primary" : "border-border bg-card"
                  }`}>
                    {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                  </div>
                  {opt}
                </button>
              );
            })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const sortOptions = [
  "Ausgewählt",
  "Am relevantesten",
  "meistverkauft",
  "Alphabetisch, A-Z",
  "Alphabetisch, Z-A",
  "Preis, niedrig nach hoch",
  "Preis, hoch nach niedrig",
  "Datum, alt zu neu",
  "Datum, neu zu alt",
];

export default function ShelfConfigurator() {
  
  const [loadsSelected, setLoadsSelected] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState("Ausgewählt");
  const [sortOpen, setSortOpen] = useState(false);
  const [widthSelected, setWidthSelected] = useState<Set<string>>(new Set());
  const [heightSelected, setHeightSelected] = useState<Set<string>>(new Set());
  const [depthSelected, setDepthSelected] = useState<Set<string>>(new Set());
  const [levelsSelected, setLevelsSelected] = useState<Set<string>>(new Set());
  const [surfaces_selected, setSurfacesSelected] = useState<Set<SurfaceType>>(new Set());
  const [activeTab, setActiveTab] = useState<"config" | "accessories" | "faq">("config");

  const allFilters = useMemo(() => {
    const filters: { label: string; value: string; remove: () => void }[] = [];
    widthSelected.forEach((v) => filters.push({ label: v, value: v, remove: () => setWidthSelected((prev) => { const n = new Set(prev); n.delete(v); return n; }) }));
    heightSelected.forEach((v) => filters.push({ label: v, value: v, remove: () => setHeightSelected((prev) => { const n = new Set(prev); n.delete(v); return n; }) }));
    depthSelected.forEach((v) => filters.push({ label: v, value: v, remove: () => setDepthSelected((prev) => { const n = new Set(prev); n.delete(v); return n; }) }));
    levelsSelected.forEach((v) => filters.push({ label: v + " Ebenen", value: v, remove: () => setLevelsSelected((prev) => { const n = new Set(prev); n.delete(v); return n; }) }));
    loadsSelected.forEach((v) => filters.push({ label: v, value: v, remove: () => setLoadsSelected((prev) => { const n = new Set(prev); n.delete(v); return n; }) }));
    surfaces_selected.forEach((v) => {
      const s = surfaceOptions.find((o) => o.id === v);
      if (s) filters.push({ label: s.label, value: v, remove: () => setSurfacesSelected((prev) => { const n = new Set(prev); n.delete(v); return n; }) });
    });
    return filters;
  }, [widthSelected, heightSelected, depthSelected, levelsSelected, loadsSelected, surfaces_selected]);

  const totalProducts = 1020;
  const filteredCount = allFilters.length > 0 ? Math.max(1, Math.round(totalProducts / (allFilters.length * 3 + 1))) : totalProducts;

  const clearAll = () => {
    setWidthSelected(new Set());
    setHeightSelected(new Set());
    setDepthSelected(new Set());
    setLevelsSelected(new Set());
    setLoadsSelected(new Set());
    setSurfacesSelected(new Set());
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 L1440,0 L1440,380 Q720,500 0,380 Z"
          fill="hsl(0 0% 93%)"
        />
      </svg>
      <div className="bg-card shadow-lg max-w-5xl w-full relative z-10" style={{ borderRadius: "50px" }}>
        <div className="flex items-center justify-center px-12 pt-10 pb-6 border-b border-dashed border-border">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">Wähle dein Palettenregal</h1>
          </div>
        </div>



          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-[50%] px-12 py-8 pb-12 space-y-6 border-r border-dashed border-border">
              <div>
                <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-3 block">
                  Belastung pro Palette
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {loadOptions.map((opt) => {
                    const isActive = loadsSelected.has(opt);
                    return (
                      <button
                        key={opt}
                        onClick={() => {
                          setLoadsSelected((prev) => {
                            const next = new Set(prev);
                            if (next.has(opt)) next.delete(opt);
                            else next.add(opt);
                            return next;
                          });
                        }}
                        className={`group relative flex items-center gap-2 pl-2.5 pr-4 py-2 rounded-full border-2 transition-all ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-lg border-primary"
                            : "bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground border-border hover:border-muted-foreground/40"
                        }`}
                      >
                        <div className={`flex size-5 shrink-0 items-center justify-center rounded-full shadow-sm ${
                          isActive ? "bg-white" : "bg-muted ring-1 ring-border"
                        }`}>
                          {isActive ? (
                            <Check className="h-3 w-3 text-primary" />
                          ) : (
                            <div className="size-2 rounded-full bg-muted-foreground/30" />
                          )}
                        </div>
                        <span className="text-sm tabular-nums tracking-wide font-bold">
                          {opt}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <MultiSelectDropdown label="Breite" selected={widthSelected} options={widthOptions} onChange={setWidthSelected} />
                <MultiSelectDropdown label="Höhe" selected={heightSelected} options={heightOptions} onChange={setHeightSelected} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <MultiSelectDropdown label="Tiefe" selected={depthSelected} options={depthOptions} onChange={setDepthSelected} />
                <MultiSelectDropdown label="Anzahl Ebenen" selected={levelsSelected} options={levelOptions} onChange={setLevelsSelected} />
              </div>

              <div>
                <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-3 block">
                  Auflage
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {surfaceOptions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSurfacesSelected((prev) => {
                          const next = new Set(prev);
                          if (next.has(s.id)) next.delete(s.id);
                          else next.add(s.id);
                          return next;
                        });
                      }}
                      className={`rounded-xl border-2 p-4 text-left transition-all ${
                        surfaces_selected.has(s.id)
                          ? "border-primary bg-primary/5"
                          : "border-transparent bg-secondary hover:border-muted-foreground/30"
                      }`}
                    >
                      <div className="h-10 w-10 rounded bg-muted mb-3" />
                      <div className="text-sm font-medium text-foreground">{s.label}</div>
                      <div className="text-xs text-muted-foreground">{s.sub}</div>
                      <div className={`text-sm font-semibold mt-1 ${surfaces_selected.has(s.id) ? "text-primary" : "text-foreground"}`}>
                        {s.id !== "none" ? `ab ${s.price}` : s.price}
                      </div>
                    </button>
                  ))}
                </div>
              </div>


              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setActiveTab("config")}
                  className={`group px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center overflow-hidden ${
                    activeTab === "config"
                      ? "bg-primary text-primary-foreground shadow-none hover:shadow-[0_10px_30px_-5px_hsl(var(--primary)/0.5)] hover:scale-105 hover:-translate-y-1"
                      : "border border-border text-foreground hover:bg-secondary"
                  }`}
                >
                  Regalkonfigurator
                  {activeTab === "config" && (
                    <span className="inline-flex w-0 overflow-hidden opacity-0 group-hover:w-6 group-hover:opacity-100 transition-all duration-300 ml-0 group-hover:ml-2">
                      <ArrowRight className="h-4 w-4 shrink-0" />
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("accessories")}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                    activeTab === "accessories"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "border border-border text-foreground hover:bg-secondary"
                  }`}
                >
                  Zubehör
                </button>
                <button
                  onClick={() => setActiveTab("faq")}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                    activeTab === "faq"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "border border-border text-foreground hover:bg-secondary"
                  }`}
                >
                  FAQ
                </button>
              </div>
            </div>

            <div className="w-full lg:w-[50%] flex flex-col items-center justify-center p-12 gap-6">
              <img src={shelfIllustration} alt="Regal-Illustration mit Höhe, Länge, Tiefe und Ebenen" className="w-full object-contain" />
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs tracking-[0.1em] font-medium text-muted-foreground/50">EU</span>
                  {[...Array(12)].map((_, i) => {
                    const angle = (i * 30 - 90) * (Math.PI / 180);
                    const x = 50 + 42 * Math.cos(angle);
                    const y = 50 + 42 * Math.sin(angle);
                    return (
                      <span
                        key={i}
                        className="absolute text-[6px] text-muted-foreground/35"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: 'translate(-50%, -50%)',
                          textShadow: '0 1px 1px rgba(255,255,255,0.9)'
                        }}
                      >
                        ★
                      </span>
                    );
                  })}
                </div>
                <span className="text-[9px] tracking-[0.25em] uppercase font-semibold text-muted-foreground/45">Made in Europe</span>
              </div>
            </div>
          </div>

      </div>

      <div className="flex flex-col items-center gap-3 mt-6 max-w-5xl w-full relative z-10">
        {allFilters.length > 0 && (
          <>
            <p className="text-sm text-muted-foreground">
              {filteredCount} von {totalProducts} Produkten werden angezeigt
            </p>
            <div className="flex flex-wrap justify-center items-center gap-2">
              {allFilters.map((f, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-default"
                >
                  {f.label}
                  <button onClick={f.remove} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={clearAll}
                className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors ml-2"
              >
                Alles löschen
              </button>
            </div>
          </>
        )}

        <div className="relative mt-2 mb-48">
          <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mr-3">
            Sortieren nach:
          </label>
          <button
            type="button"
            onClick={() => setSortOpen(!sortOpen)}
            className={`inline-flex items-center gap-2 rounded-full border bg-card px-5 py-2 text-sm shadow-sm transition-colors hover:border-muted-foreground/40 ${
              sortOpen ? "border-primary" : "border-input"
            }`}
          >
            <span className="text-foreground font-medium">{sortBy}</span>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${sortOpen ? "rotate-180" : ""}`} />
          </button>
          {sortOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
              <div className="absolute left-1/2 -translate-x-1/2 top-full z-20 mt-1 w-64 overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
                <div className="p-1">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => { setSortBy(opt); setSortOpen(false); }}
                      className={`flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm transition-colors ${
                        sortBy === opt
                          ? "bg-primary/10 text-foreground font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {sortBy === opt && <Check className="h-3.5 w-3.5 text-primary" />}
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
