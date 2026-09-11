"use client";

import { useState, useEffect } from "react";

// Types
interface DropOff {
  id: string;
  date: string;
  location: string;
  category: string;
  weight: number;
  points: number;
}

interface Category {
  name: string;
  pointsPerKg: number;
  type: "scrap" | "cert";
  color: string;
  badge?: string;
}

const LOCATIONS = [
  "Koramangala Residents Welfare Society",
  "Indiranagar Green Community Centre",
  "Whitefield Eco-Hub Drop Point",
];

const CATEGORIES: Category[] = [
  {
    name: "Cardboard & Paper",
    pointsPerKg: 2,
    type: "scrap",
    color: "#A9754A",
  },
  {
    name: "PET Bottles & Metal",
    pointsPerKg: 3,
    type: "scrap",
    color: "#3B6E8F",
  },
  {
    name: "Mixed Rigid Plastic",
    pointsPerKg: 2,
    type: "scrap",
    color: "#7C8792",
  },
  {
    name: "Film, Wrappers & Sachets",
    pointsPerKg: 10,
    type: "cert",
    color: "#C98A2C",
    badge: "Highest value",
  },
];

const REWARDS = [
  { name: "₹50 Amazon voucher", points: 500 },
  { name: "₹100 Myntra voucher", points: 1000 },
  { name: "₹150 Grocery voucher", points: 1500 },
  { name: "₹250 Amazon voucher", points: 2500 },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<"resident" | "partner">("resident");
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [weight, setWeight] = useState("");
  const [dropOffs, setDropOffs] = useState<DropOff[]>([]);
  const [rates, setRates] = useState({
    scrap: 15,
    cert: 2.5,
    redeem: 0.1,
  });

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("phirse-data");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setDropOffs(data.dropOffs || []);
        if (data.rates) setRates(data.rates);
      } catch (e) {
        console.error("Failed to load data:", e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("phirse-data", JSON.stringify({ dropOffs, rates }));
  }, [dropOffs, rates]);

  const handleLogDropOff = () => {
    if (!selectedCategory || !weight || parseFloat(weight) <= 0) return;

    const category = CATEGORIES.find((c) => c.name === selectedCategory);
    if (!category) return;

    const weightNum = parseFloat(weight);
    const points = Math.round(weightNum * category.pointsPerKg);

    const newDropOff: DropOff = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      location,
      category: selectedCategory,
      weight: weightNum,
      points,
    };

    setDropOffs([newDropOff, ...dropOffs]);
    setWeight("");
    setSelectedCategory("");
  };

  const totalPoints = dropOffs.reduce((sum, d) => sum + d.points, 0);
  const totalKg = dropOffs.reduce((sum, d) => sum + d.weight, 0);

  // Partner stats
  const categoryStats = CATEGORIES.map((cat) => {
    const catDropOffs = dropOffs.filter((d) => d.category === cat.name);
    const kg = catDropOffs.reduce((sum, d) => sum + d.weight, 0);
    const points = catDropOffs.reduce((sum, d) => sum + d.points, 0);
    return { category: cat.name, kg, points, type: cat.type };
  });

  const scrapKg = categoryStats
    .filter((s) => s.type === "scrap")
    .reduce((sum, s) => sum + s.kg, 0);
  const certKg = categoryStats
    .filter((s) => s.type === "cert")
    .reduce((sum, s) => sum + s.kg, 0);

  const scrapRevenue = scrapKg * rates.scrap;
  const certRevenue = certKg * rates.cert;
  const rewardCost = totalPoints * rates.redeem;
  const netMargin = scrapRevenue + certRevenue - rewardCost;

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-5xl md:text-6xl font-brand font-bold mb-2">
            Phir <span className="text-gold">Se</span>
          </h1>
          <p className="text-xl text-ink/70 mb-2">give it a second life</p>
          <p className="text-sm text-ink/60">
            Resident drop-off tracker + partner revenue calculator
          </p>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("resident")}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              activeTab === "resident"
                ? "bg-ink text-paper-raised"
                : "bg-paper-raised text-ink border border-line hover:border-ink"
            }`}
          >
            Resident View
          </button>
          <button
            onClick={() => setActiveTab("partner")}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              activeTab === "partner"
                ? "bg-ink text-paper-raised"
                : "bg-paper-raised text-ink border border-line hover:border-ink"
            }`}
          >
            Partner Dashboard
          </button>
        </div>

        {/* Content */}
        {activeTab === "resident" ? (
          <ResidentView
            location={location}
            setLocation={setLocation}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            weight={weight}
            setWeight={setWeight}
            handleLogDropOff={handleLogDropOff}
            totalPoints={totalPoints}
            totalKg={totalKg}
            dropOffs={dropOffs}
          />
        ) : (
          <PartnerDashboard
            dropOffs={dropOffs}
            categoryStats={categoryStats}
            scrapKg={scrapKg}
            certKg={certKg}
            rates={rates}
            setRates={setRates}
            scrapRevenue={scrapRevenue}
            certRevenue={certRevenue}
            rewardCost={rewardCost}
            netMargin={netMargin}
          />
        )}
      </div>
    </div>
  );
}

function ResidentView({
  location,
  setLocation,
  selectedCategory,
  setSelectedCategory,
  weight,
  setWeight,
  handleLogDropOff,
  totalPoints,
  totalKg,
  dropOffs,
}: any) {
  return (
    <div className="space-y-6">
      {/* Location */}
      <div className="bg-paper-raised border border-line rounded-lg p-6">
        <label className="block text-sm font-medium mb-2">Drop-off location</label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-4 py-2 border border-line rounded bg-paper-raised focus:outline-none focus:ring-2 focus:ring-ink"
        >
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Select category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`relative bg-paper-raised border-2 rounded-lg p-4 text-left transition-all ${
                selectedCategory === cat.name
                  ? "border-ink shadow-lg"
                  : "border-line hover:border-ink/50"
              }`}
            >
              <div
                className="absolute top-3 right-3 w-3 h-3 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <h3 className="font-semibold mb-1">{cat.name}</h3>
              <p className="text-sm text-ink/60">
                {cat.pointsPerKg} pts/kg · {cat.type}
              </p>
              {cat.badge && (
                <span className="inline-block mt-2 px-2 py-1 bg-gold/10 text-gold text-xs rounded">
                  {cat.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Weight input */}
      <div className="bg-paper-raised border border-line rounded-lg p-6">
        <label className="block text-sm font-medium mb-2">Weight (kg)</label>
        <div className="flex gap-3">
          <input
            type="number"
            step="0.1"
            min="0"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="0.0"
            className="flex-1 px-4 py-2 border border-line rounded bg-paper focus:outline-none focus:ring-2 focus:ring-ink font-mono"
          />
          <button
            onClick={handleLogDropOff}
            disabled={!selectedCategory || !weight || parseFloat(weight) <= 0}
            className="px-6 py-2 bg-ink text-paper-raised rounded font-medium hover:bg-ink/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Log drop-off
          </button>
        </div>
      </div>

      {/* Points hero */}
      <div className="bg-green text-paper-raised rounded-lg p-8 text-center">
        <div className="text-5xl font-bold mb-2">{totalPoints}</div>
        <div className="text-lg opacity-90">points earned</div>
        <div className="text-sm opacity-75 mt-2">{totalKg.toFixed(1)} kg recycled all-time</div>
      </div>

      {/* Redeem */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Redeem points</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {REWARDS.map((reward) => (
            <button
              key={reward.points}
              disabled={totalPoints < reward.points}
              className="bg-paper-raised border border-line rounded-lg p-4 text-center hover:border-ink disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <div className="font-semibold text-sm mb-1">{reward.name}</div>
              <div className="text-xs text-ink/60">{reward.points} pts</div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent drop-offs */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Recent drop-offs</h2>
        <div className="bg-paper-raised border border-line rounded-lg divide-y divide-line">
          {dropOffs.length === 0 ? (
            <div className="p-6 text-center text-ink/60">No drop-offs yet</div>
          ) : (
            dropOffs.slice(0, 8).map((drop: DropOff) => (
              <div key={drop.id} className="p-4 flex justify-between items-start">
                <div>
                  <div className="font-medium">{drop.category}</div>
                  <div className="text-sm text-ink/60">
                    {new Date(drop.date).toLocaleDateString()} · {drop.location}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-semibold">{drop.weight} kg</div>
                  <div className="text-sm text-green">+{drop.points} pts</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function PartnerDashboard({
  dropOffs,
  categoryStats,
  scrapKg,
  certKg,
  rates,
  setRates,
  scrapRevenue,
  certRevenue,
  rewardCost,
  netMargin,
}: any) {
  const totalKg = scrapKg + certKg;
  const scrapPct = totalKg > 0 ? (scrapKg / totalKg) * 100 : 0;
  const certPct = totalKg > 0 ? (certKg / totalKg) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-paper-raised border border-line rounded-lg p-6">
          <div className="text-3xl font-bold mb-1">{totalKg.toFixed(1)}</div>
          <div className="text-sm text-ink/60">Total kg collected</div>
        </div>
        <div className="bg-paper-raised border border-line rounded-lg p-6">
          <div className="text-3xl font-bold mb-1">{dropOffs.length}</div>
          <div className="text-sm text-ink/60">Drop-offs logged</div>
        </div>
        <div className="bg-paper-raised border border-line rounded-lg p-6">
          <div className="text-3xl font-bold mb-1">{LOCATIONS.length}</div>
          <div className="text-sm text-ink/60">Active locations</div>
        </div>
      </div>

      {/* Category breakdown */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Collection by category</h2>
        <div className="bg-paper-raised border border-line rounded-lg p-6 space-y-3">
          {categoryStats.map((stat: any) => {
            const pct = totalKg > 0 ? (stat.kg / totalKg) * 100 : 0;
            return (
              <div key={stat.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{stat.category}</span>
                  <span className="font-mono">{stat.kg.toFixed(1)} kg</span>
                </div>
                <div className="h-2 bg-line rounded-full overflow-hidden">
                  <div
                    className="h-full bg-ink"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Editable rates */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Revenue rates (editable placeholders)</h2>
        <div className="bg-paper-raised border border-line rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Scrap market rate</label>
            <div className="flex items-center gap-2">
              <span className="text-sm">₹</span>
              <input
                type="number"
                step="0.1"
                value={rates.scrap}
                onChange={(e) =>
                  setRates({ ...rates, scrap: parseFloat(e.target.value) || 0 })
                }
                className="w-20 px-2 py-1 border border-line rounded font-mono text-right focus:outline-none focus:ring-2 focus:ring-ink"
              />
              <span className="text-sm">/kg</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Certificate rate (film/MLP)</label>
            <div className="flex items-center gap-2">
              <span className="text-sm">₹</span>
              <input
                type="number"
                step="0.1"
                value={rates.cert}
                onChange={(e) =>
                  setRates({ ...rates, cert: parseFloat(e.target.value) || 0 })
                }
                className="w-20 px-2 py-1 border border-line rounded font-mono text-right focus:outline-none focus:ring-2 focus:ring-ink"
              />
              <span className="text-sm">/kg</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Reward cost</label>
            <div className="flex items-center gap-2">
              <span className="text-sm">₹</span>
              <input
                type="number"
                step="0.01"
                value={rates.redeem}
                onChange={(e) =>
                  setRates({ ...rates, redeem: parseFloat(e.target.value) || 0 })
                }
                className="w-20 px-2 py-1 border border-line rounded font-mono text-right focus:outline-none focus:ring-2 focus:ring-ink"
              />
              <span className="text-sm">/point</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stream split */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Revenue streams</h2>
        <div className="bg-paper-raised border border-line rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1 h-6 bg-line rounded-full overflow-hidden flex">
              <div
                className="bg-cardboard"
                style={{ width: `${scrapPct}%` }}
                title={`Scrap: ${scrapPct.toFixed(1)}%`}
              />
              <div
                className="bg-gold"
                style={{ width: `${certPct}%` }}
                title={`Certificate: ${certPct.toFixed(1)}%`}
              />
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <div>
              <span className="inline-block w-3 h-3 bg-cardboard rounded mr-2" />
              Scrap {scrapKg.toFixed(1)} kg
            </div>
            <div>
              <span className="inline-block w-3 h-3 bg-gold rounded mr-2" />
              Certificate {certKg.toFixed(1)} kg
            </div>
          </div>
        </div>
      </div>

      {/* Margin calculation */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Partner margin</h2>
        <div className="bg-paper-raised border border-line rounded-lg p-6 space-y-3 font-mono">
          <div className="flex justify-between">
            <span>Scrap revenue</span>
            <span className="text-green">₹{scrapRevenue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Certificate revenue</span>
            <span className="text-green">₹{certRevenue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Reward cost</span>
            <span className="text-red">-₹{rewardCost.toFixed(2)}</span>
          </div>
          <div className="border-t border-line pt-3 flex justify-between font-bold text-lg">
            <span>Net margin</span>
            <span className={netMargin >= 0 ? "text-green" : "text-red"}>
              ₹{netMargin.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="bg-paper border border-line rounded-lg p-6 text-sm text-ink/70">
        <p className="mb-2">
          <strong>Film, wrappers & sachets (MLP)</strong> earn higher points because they map to
          certificate-based revenue in India's EPR system, unlike cardboard/PET/rigid which trade
          on scrap markets.
        </p>
        <p>
          <strong>Important:</strong> Rates shown are editable placeholders for demo purposes. EPR
          certificates in India require a CPCB-registered Plastic Waste Processor — this app does
          not mint credits.
        </p>
      </div>
    </div>
  );
}
