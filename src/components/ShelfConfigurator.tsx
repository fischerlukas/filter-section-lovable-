import { useState } from "react";
import { ChevronDown, ChevronUp, ArrowRight, SlidersHorizontal } from "lucide-react";

const loadOptions = ["500 kg", "1.000 kg", "1.500 kg"];

const widthOptions = ["1.850 mm", "2.200 mm", "2.700 mm", "3.300 mm", "3.600 mm"];
const heightOptions = ["2.000 mm", "2.500 mm", "3.000 mm", "3.500 mm", "4.000 mm", "4.500 mm", "5.000 mm", "5.500 mm", "6.000 mm"];
const depthOptions = ["800 mm", "1.000 mm", "1.100 mm"];
const levelOptions = ["2", "3", "4", "5", "6"];

type SurfaceType = "none" | "wire" | "wood";

type NativeSelectFieldProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

const surfaces: { id: SurfaceType; label: string; sub: string; price: string }[] = [
  { id: "none", label: "Ohne Auflage", sub: "Ohne Aufpreis", price: "inkl." },
  { id: "wire", label: "Drahtgitter", sub: "Verzinkt", price: "104,31 €" },
  { id: "wood", label: "Holzboden", sub: "Spanplatte", price: "91,71 €" },
];

function NativeSelectField({ label, value, options, onChange }: NativeSelectFieldProps) {
  return (
    <div>
      <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-2 block">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-full appearance-none rounded-full border border-input bg-card px-4 pr-10 text-sm text-foreground outline-none transition-colors focus:outline-none"
        >
          <option value="">auswählen</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  );
}

export default function ShelfConfigurator() {
  const [collapsed, setCollapsed] = useState(false);
  const [load, setLoad] = useState("500 kg");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [depth, setDepth] = useState("");
  const [levels, setLevels] = useState("");
  const [surface, setSurface] = useState<SurfaceType>("none");
  const [activeTab, setActiveTab] = useState<"config" | "accessories" | "faq">("config");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
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
      <div className="bg-card shadow-lg max-w-5xl w-full overflow-hidden relative z-10" style={{ borderRadius: "50px" }}>
        <div className="flex items-center justify-between px-12 pt-10 pb-6 border-b border-dashed border-border">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">Palettenregal konfigurieren</h1>
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {collapsed ? "Ausklappen" : "Einklappen"}
            <ChevronUp className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {!collapsed && (
          <div className="flex flex-col lg:flex-row">
            <div className="flex-1 px-12 py-8 pb-12 space-y-6 border-r border-dashed border-border">
              <div>
                <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-3 block">
                  Belastung / Palette
                </label>
                <div className="flex gap-0 rounded-full bg-secondary w-fit">
                  {loadOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setLoad(opt)}
                      className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${
                        load === opt
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <NativeSelectField label="Breite" value={width} options={widthOptions} onChange={setWidth} />
                <NativeSelectField label="Höhe" value={height} options={heightOptions} onChange={setHeight} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <NativeSelectField label="Tiefe" value={depth} options={depthOptions} onChange={setDepth} />
                <NativeSelectField label="Anzahl Ebenen" value={levels} options={levelOptions} onChange={setLevels} />
              </div>

              <div>
                <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-3 block">
                  Auflage
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {surfaces.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSurface(s.id)}
                      className={`rounded-xl border-2 p-4 text-left transition-all ${
                        surface === s.id
                          ? "border-primary bg-primary/5"
                          : "border-transparent bg-secondary hover:border-muted-foreground/30"
                      }`}
                    >
                      <div className="h-10 w-10 rounded bg-muted mb-3" />
                      <div className="text-sm font-medium text-foreground">{s.label}</div>
                      <div className="text-xs text-muted-foreground">{s.sub}</div>
                      <div className={`text-sm font-semibold mt-1 ${surface === s.id ? "text-primary" : "text-foreground"}`}>
                        {s.price}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setActiveTab("config")}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    activeTab === "config"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "border border-border text-foreground hover:bg-secondary"
                  }`}
                >
                  Regalkonfigurator
                  {activeTab === "config" && <ArrowRight className="h-4 w-4" />}
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

            <div className="w-full lg:w-80 flex flex-col items-center justify-center p-12 gap-4">
              <div className="w-48 h-48 border-2 border-dashed border-border rounded-xl flex items-center justify-center">
                <span className="text-sm text-muted-foreground">Regal-Illustration</span>
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>A = Höhe</span>
                <span>B = Tiefe</span>
                <span>C = Breite</span>
                <span>D = Ebenen</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
