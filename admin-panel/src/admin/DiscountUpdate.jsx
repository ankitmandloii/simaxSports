import React, { useEffect, useState, useRef } from "react";
import { Button, SkeletonPage, Layout, SkeletonBodyText, SkeletonDisplayText, Card } from "@shopify/polaris";

import { DeleteIcon } from "@shopify/polaris-icons";

// ---------- helpers ----------
const toPercent = (d) => (d != null ? Math.round(d * 100 * 100) / 100 : 0);
const toDecimal = (p) => {
  const n = Number(p);
  if (!Number.isFinite(n)) return 0;
  return Math.round((n / 100) * 10000) / 10000;
};
const pct = (d) => Math.round(d * 10000) / 100;
const dec = (p) => Math.round((p / 100) * 10000) / 10000;

function joinUrl(base, path) {
  if (!base) return path.startsWith("/") ? path : `/${path}`;
  const b = base.endsWith("/") ? base.slice(0, -1) : base;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

export default function PricingSettings() {
  // -------- server-backed state --------
  const [tiers, setTiers] = useState([{ minQty: 1, ratePercent: 0 }]);
  const [surcharges, setSurcharges] = useState({ XL: 1, "2XL": 2, "3XL": 3 });
  const [licenseFee, setLicenseFee] = useState(25);
  const [printAreas, setPrintAreas] = useState({ "1": 0.23, "2": 0.46, "3": 12.68, "4": 18.92 });

  // ui state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  // confirm modal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const confirmYesBtnRef = useRef(null);

  // API endpoints
  const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8080/api";
  const GET_TIERS_URL = joinUrl(BASE_URL, "/auth/getDiscountDetails");
  const PUT_TIERS_URL = joinUrl(BASE_URL, "/auth/setDiscountDetails");
  const headers = { "Content-Type": "application/json" };

  // -------- load settings --------
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(""); setOkMsg("");

        const res = await fetch(GET_TIERS_URL, { method: "POST", headers, body: JSON.stringify({}) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load");

        const uiTiers = (data.tiers || []).map(t => ({
          minQty: Number(t.minQty),
          ratePercent: toPercent(Number(t.rate))
        }));
        setTiers(uiTiers.length ? uiTiers : [{ minQty: 1, ratePercent: 0 }]);
        setSurcharges(data.sizeSurcharges || { XL: 1, "2XL": 2, "3XL": 3 });
        setLicenseFee(data.licenseFeeFlat ?? 25);

        const pa = data.printAreaSurcharges || {};
        setPrintAreas({
          "1": Number(pa["1"] ?? 0.23),
          "2": Number(pa["2"] ?? 0.46),
          "3": Number(pa["3"] ?? 12.68),
          "4": Number(pa["4"] ?? 18.92)
        });
      } catch (e) {
        setError(e.message || "Failed to load settings");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [GET_TIERS_URL]);

  // -------- table handlers --------
  const addRow = () => setTiers(prev => [...prev, { minQty: 1, ratePercent: 0 }]);
  const removeRow = (idx) => setTiers(prev => prev.filter((_, i) => i !== idx));
  const updateRow = (idx, field, value) =>
    setTiers(prev => prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row)));

  // -------- validation --------
  function validate() {
    const rows = tiers.slice().sort((a, b) => Number(a.minQty) - Number(b.minQty));
    if (!rows.length) return "At least one tier is required";
    for (const r of rows) {
      const m = Number(r.minQty);
      const p = Number(r.ratePercent);
      if (!Number.isFinite(m) || m < 1) return "minQty must be ≥ 1";
      if (!Number.isFinite(p) || p < 0 || p > 100) return "Discount % must be 0..100";
    }
    for (const [k, v] of Object.entries(surcharges)) {
      if (String(k).trim() === "") return "Size key cannot be empty";
      if (!(Number(v) >= 0)) return `Invalid size surcharge for ${k}`;
    }
    for (const key of ["1", "2", "3", "4"]) {
      if (!(Number(printAreas[key]) >= 0)) return `Invalid print-area surcharge for ${key}`;
    }
    if (!(Number(licenseFee) >= 0)) return "License fee must be ≥ 0";
    return "";
  }

  // -------- save --------
  async function saveAll() {
    setError(""); setOkMsg("");
    const err = validate();
    if (err) { setError(err); return; }

    setSaving(true);
    try {
      const apiTiers = tiers
        .map(r => ({ minQty: Number(r.minQty), rate: toDecimal(Number(r.ratePercent)) }))
        .sort((a, b) => a.minQty - b.minQty);

      const res = await fetch(PUT_TIERS_URL, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          tiers: apiTiers,
          sizeSurcharges: surcharges,
          licenseFeeFlat: Number(licenseFee),
          printAreaSurcharges: {
            "1": Number(printAreas["1"] ?? 0),
            "2": Number(printAreas["2"] ?? 0),
            "3": Number(printAreas["3"] ?? 0),
            "4": Number(printAreas["4"] ?? 0)
          }
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setOkMsg("Settings saved");
    } catch (e) {
      setError(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  // confirm gating
  const onClickSave = () => {
    setError(""); setOkMsg("");
    const err = validate();
    if (err) { setError(err); return; }
    setConfirmOpen(true);
  };
  useEffect(() => {
    if (!confirmOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") { e.preventDefault(); setConfirmOpen(false); }
      if (e.key === "Enter") { e.preventDefault(); handleConfirmYes(); }
    };
    window.addEventListener("keydown", onKeyDown);
    const t = setTimeout(() => confirmYesBtnRef.current?.focus(), 0);
    return () => { window.removeEventListener("keydown", onKeyDown); clearTimeout(t); };
  }, [confirmOpen, saving]);
  const handleConfirmYes = () => { if (!saving) { setConfirmOpen(false); saveAll(); } };

  // ---------- LEARN + TESTER ----------
  function pickLocalTier(tiersDec, qty) {
    let chosen = { minQty: 1, rate: 0 };
    for (const t of tiersDec.sort((a, b) => a.minQty - b.minQty)) {
      if (qty >= t.minQty) chosen = t;
    }
    return chosen;
  }
  function futureLocalTiers(tiersDec, qty) {
    return tiersDec.filter(t => t.minQty > qty).slice(0, 2)
      .map(t => ({ threshold: t.minQty, rate: t.rate, percent: pct(t.rate) }));
  }
  const [testQty, setTestQty] = useState(12);
  const [testSize, setTestSize] = useState("XL");
  const [testAreas, setTestAreas] = useState(2);
  const [testUnit, setTestUnit] = useState(20);
  const [testLicense, setTestLicense] = useState(false);

  function simulate() {
    const tiersDec = tiers.map(t => ({ minQty: Number(t.minQty), rate: dec(Number(t.ratePercent || 0)) }));
    const tier = pickLocalTier(tiersDec, Number(testQty || 0));
    const sizeUp = Number(surcharges[testSize] || 0);
    const unitBefore = Number(testUnit) + sizeUp;           // print-area is flat, not per unit
    const eachBefore = unitBefore;
    const eachAfter = Math.round(unitBefore * (1 - tier.rate) * 100) / 100;
    const subtotalBefore = Math.round(eachBefore * testQty * 100) / 100;
    const discountedSubtotal = Math.round(eachAfter * testQty * 100) / 100;
    const licenseAdd = testLicense ? Number(licenseFee || 0) : 0;
    const paFee = Number(printAreas[String(testAreas)] || 0); // flat fee
    const grand = Math.round((discountedSubtotal + licenseAdd + paFee) * 100) / 100;
    return {
      tier, eachBefore, eachAfter, subtotalBefore, discountedSubtotal,
      licenseFee: licenseAdd, printAreaFee: paFee, grand,
      ladder: futureLocalTiers(tiersDec, Number(testQty || 0)).map(ft => ({
        ...ft, eachAtTier: Math.round((unitBefore * (1 - ft.rate)) * 100) / 100
      }))
    };
  }

  if (loading) return (
    <SkeletonPage primaryAction>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={3} />
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card sectioned>
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={5} />
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card sectioned>
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={2} />
          </Card>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );


  return (
    <div style={{ maxWidth: 880, margin: "20px auto", fontFamily: "Inter, system-ui, Arial" }}>
      <h2>Pricing Settings (Admin)</h2>

      {/* How it works + tester */}
      <section style={{ marginTop: 16, padding: 16, border: "1px solid #e5e5e5", borderRadius: 12, background: "#fafafa" }}>
        <details>
          <summary style={{ cursor: "pointer", fontWeight: 600 }}>How pricing works (for admins)</summary>
          <div style={{ marginTop: 12, lineHeight: 1.5, fontSize: 14 }}>
            <ol style={{ paddingLeft: 18 }}>
              <li><b>Base unit</b> = product price + <i>size surcharge</i>.</li>
              <li><b>Bulk discount</b> (from tiers) applies to the base unit.</li>
              <li><b>Print-area fee</b> is a <u>flat fee</u> per item line (or order, per your server mode) and is not discounted.</li>
              <li><b>License fee</b> (optional) is a flat fee, not discounted.</li>
            </ol>
            <ul style={{ paddingLeft: 18 }}>
              <li><code>eachBeforeDiscount</code> = base unit (no discount, no flat fees)</li>
              <li><code>eachAfterDiscount</code> = grand total ÷ total quantity</li>
              <li><code>grandTotal</code> = (discounted unit × qty) + flat fees</li>
              <li><code>Buy More & Save</code> uses the next tiers for preview.</li>
            </ul>

            {/* sandbox */}
            <div style={{ marginTop: 16, padding: 12, border: "1px dashed #ddd", borderRadius: 10, background: "#fff" }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Try it (sandbox)</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
                <div>
                  <label style={{ fontSize: 12 }}>Unit price</label>
                  <input type="number" value={testUnit} min={0} step="0.01" onChange={e => setTestUnit(Number(e.target.value))} />
                </div>
                <div>
                  <label style={{ fontSize: 12 }}>Qty</label>
                  <input type="number" value={testQty} min={1} onChange={e => setTestQty(Number(e.target.value))} />
                </div>
                <div>
                  <label style={{ fontSize: 12 }}>Size</label>
                  <select value={testSize} onChange={e => setTestSize(e.target.value)}>
                    {Object.keys(surcharges).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12 }}>Print areas (1–4)</label>
                  <select value={testAreas} onChange={e => setTestAreas(Number(e.target.value))}>
                    {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, paddingTop: 18 }}>
                  <input id="lic" type="checkbox" checked={testLicense} onChange={e => setTestLicense(e.target.checked)} />
                  <label htmlFor="lic" style={{ fontSize: 12 }}>Collegiate license</label>
                </div>
              </div>

              {(() => {
                const r = simulate();
                return (
                  <div style={{ marginTop: 10, fontSize: 14 }}>
                    <div>Tier hit: <b>{r.tier.minQty}+ @ {pct(r.tier.rate)}%</b> off</div>
                    <div>Each (before): <b>${r.eachBefore.toFixed(2)}</b>, Each (after): <b>${r.eachAfter.toFixed(2)}</b></div>
                    <div>Subtotal before: <b>${r.subtotalBefore.toFixed(2)}</b></div>
                    <div>Discounted subtotal: <b>${r.discountedSubtotal.toFixed(2)}</b></div>
                    <div>Flat fees → Print-area: <b>${r.printAreaFee.toFixed(2)}</b>{r.licenseFee ? ` + License: $${r.licenseFee.toFixed(2)}` : ""}</div>
                    <div>Grand total: <b>${r.grand.toFixed(2)}</b></div>
                    {!!r.ladder.length && (
                      <div style={{ marginTop: 8 }}>
                        Buy more & save:&nbsp;
                        {r.ladder.map((x, i) => (
                          <span key={x.threshold} style={{ marginRight: 10 }}>
                            {x.threshold} items for <b>${x.eachAtTier.toFixed(2)}</b> ea{i < r.ladder.length - 1 ? " | " : ""}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </details>
      </section>

      {/* Tiers */}
      <section style={{ marginTop: 16 }}>
        <h3>Discount Tiers</h3>
        <p style={{ fontSize: "0.7rem", color: "#555", marginTop: 4 }}>Quantity-based discount (%)</p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr><th align="left">Min Qty</th><th align="left">Discount (%)</th><th /></tr>
          </thead>
          <tbody>
            {tiers.map((row, idx) => (
              <tr key={idx}>
                <td>
                  <input type="number" min={1} value={row.minQty}
                    onChange={e => updateRow(idx, "minQty", e.target.value)} />
                </td>
                <td>
                  <input type="number" min={0} max={100} step="0.01" value={row.ratePercent}
                    onChange={e => updateRow(idx, "ratePercent", e.target.value)} />
                </td>
                <td><Button tone="critical" icon={DeleteIcon} onClick={() => removeRow(idx)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button style={{ marginTop: 8 }} onClick={addRow}>+ Add Tier</Button>
      </section>

      {/* Size Surcharges */}
      <section style={{ marginTop: 24 }}>
        <h3>Size Surcharges ($)</h3>
        <p style={{ fontSize: "0.7rem", color: "#555", marginTop: 4 }}>Per-size add-on (before discount).</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {Object.entries(surcharges).map(([size, val]) => (
            <div key={size} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input value={size} onChange={e => {
                const newKey = e.target.value;
                setSurcharges(prev => {
                  const copy = { ...prev };
                  const v = copy[size];
                  delete copy[size];
                  copy[newKey] = v;
                  return copy;
                });
              }} style={{ width: 80 }} />
              <input type="number" step="0.01" min={0} value={val}
                onChange={e => setSurcharges(prev => ({ ...prev, [size]: Number(e.target.value) }))}
                style={{ width: 90 }} />
            </div>
          ))}
        </div>
        <Button style={{ marginTop: 8 }} onClick={() => setSurcharges(prev => ({ ...prev, "": 0 }))}>+ Add Size</Button>
      </section>

      {/* Print-Area flat fees */}
      <section style={{ marginTop: 24 }}>
        <h3>Print-Area Surcharges ($ flat)</h3>
        <p style={{ fontSize: "0.7rem", color: "#555", marginTop: 4 }}>
          Flat fee per item line (not per unit). Keys 1..4 only.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {["1", "2", "3", "4"].map(k => (
            <div key={k} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input value={k} disabled style={{ width: 80, background: "#f3f3f3" }} />
              <input type="number" step="0.01" min={0} value={printAreas[k]}
                onChange={e => setPrintAreas(prev => ({ ...prev, [k]: Number(e.target.value) }))}
                style={{ width: 90 }} />
            </div>
          ))}
        </div>
      </section>

      {/* License fee */}
      <section style={{ marginTop: 24 }}>
        <h3>Default License Fee ($)</h3>
        <p style={{ fontSize: "0.7rem", color: "#555", marginTop: 4 }}>Applied only when enabled in a quote.</p>
        <input type="number" step="0.01" min={0} value={licenseFee} onChange={e => setLicenseFee(e.target.value)} />
      </section>

      {/* Actions + confirm */}
      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <Button onClick={onClickSave} disabled={saving}>{saving ? "Saving…" : "Save Settings"}</Button>
          {error && <span style={{ color: "crimson" }}>{error}</span>}
          {okMsg && <span style={{ color: "green" }}>{okMsg}</span>}
        </div>

        {confirmOpen && (
          <>
            <div onClick={() => !saving && setConfirmOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 1000 }} />
            <div role="dialog" aria-modal="true"
              style={{
                position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                background: "#fff", border: "1px solid #ddd", borderRadius: 12, padding: 16,
                minWidth: 320, zIndex: 1001, boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
              }}>
              <h4 style={{ margin: 0 }}>Confirm Save</h4>
              <p style={{ marginTop: 8 }}>
                Save these pricing settings? Changes will apply immediately to discount calculations.
              </p>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
                <Button tone="success" ref={confirmYesBtnRef} onClick={handleConfirmYes} disabled={saving}>
                  {saving ? "Saving…" : "Yes, Save"}
                </Button>
                <Button tone="critical" onClick={() => setConfirmOpen(false)} disabled={saving}>
                  No, Cancel
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
