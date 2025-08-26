import React, { useEffect, useState, useRef } from "react";
import { Button } from "@shopify/polaris";
import { DeleteIcon } from "@shopify/polaris-icons";
import { InfoIcon } from "@shopify/polaris-icons";

function toPercent(rateDecimal) {
  return rateDecimal != null ? Math.round(rateDecimal * 100 * 100) / 100 : 0;
}
function toDecimal(ratePercent) {
  const n = Number(ratePercent);
  if (!Number.isFinite(n)) return 0;
  return Math.round((n / 100) * 10000) / 10000; // 4dp
}
function joinUrl(base, path) {
  if (!base) return path.startsWith("/") ? path : `/${path}`;
  const b = base.endsWith("/") ? base.slice(0, -1) : base;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

export default function DiscountUpdate() {
  const [tiers, setTiers] = useState([{ minQty: 1, ratePercent: 0 }]);
  const [surcharges, setSurcharges] = useState({ XL: 1, "2XL": 2, "3XL": 3 });
  const [licenseFee, setLicenseFee] = useState(25);
  const [printAreas, setPrintAreas] = useState({ "1": 0.23, "2": 0.46, "3": 12.68, "4": 18.92 }); // NEW

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const confirmYesBtnRef = useRef(null);

  // IMPORTANT: include '/api' if your server routes are prefixed
  const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8080/api";
  const GET_TIERS_URL = joinUrl(BASE_URL, "/auth/getDiscountDetails");
  const PUT_TIERS_URL = joinUrl(BASE_URL, "/auth/setDiscountDetails");

  const headers = { "Content-Type": "application/json" };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        setOkMsg("");

        const res = await fetch(GET_TIERS_URL, {
          method: "POST",
          headers,
          body: JSON.stringify({})
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load");

        // tiers → UI (%)
        const uiTiers = (data.tiers || []).map(t => ({
          minQty: Number(t.minQty),
          ratePercent: toPercent(Number(t.rate))
        }));
        setTiers(uiTiers.length ? uiTiers : [{ minQty: 1, ratePercent: 0 }]);

        // size surcharges & license
        setSurcharges(data.sizeSurcharges || { XL: 1, "2XL": 2, "3XL": 3 });
        setLicenseFee(data.licenseFeeFlat ?? 25);

        // NEW: print-area surcharges (expect keys "1".."4")
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

  function addRow() {
    setTiers(prev => [...prev, { minQty: 1, ratePercent: 0 }]);
  }
  function removeRow(idx) {
    setTiers(prev => prev.filter((_, i) => i !== idx));
  }
  function updateRow(idx, field, value) {
    setTiers(prev => prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row)));
  }

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
    // NEW: print areas 1..4 must be >= 0
    for (const key of ["1", "2", "3", "4"]) {
      if (!(Number(printAreas[key]) >= 0)) return `Invalid print-area surcharge for ${key}`;
    }
    if (!(Number(licenseFee) >= 0)) return "License fee must be ≥ 0";
    return "";
  }

  async function saveAll() {
    setError("");
    setOkMsg("");
    const err = validate();
    if (err) { setError(err); return; }

    setSaving(true);
    try {
      const apiTiers = tiers
        .map(r => ({ minQty: Number(r.minQty), rate: toDecimal(r.ratePercent) }))
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
          } // NEW
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

  // confirm modal triggers
  function onClickSave() {
    setError("");
    setOkMsg("");
    const err = validate();
    if (err) { setError(err); return; }
    setConfirmOpen(true);
  }
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
  function handleConfirmYes() {
    if (saving) return;
    setConfirmOpen(false);
    saveAll();
  }

  if (loading) return <div>Loading…</div>;

  return (
    <div style={{ maxWidth: 820, margin: "20px auto", fontFamily: "Inter, system-ui, Arial" }}>
      <h2>Pricing Settings (App Side)</h2>

      {/* Tiers */}
      <section style={{ marginTop: 16 }}>
        <h3>Discount Tiers</h3>
        <p style={{ fontSize: "0.7rem", color: "#555", marginTop: 4 }}>
          Define quantity-based discounts (percent).
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th align="left">Min Qty</th>
              <th align="left">Discount (%)</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {tiers.map((row, idx) => (
              <tr key={idx}>
                <td>
                  <input
                    type="number"
                    min={1}
                    value={row.minQty}
                    onChange={e => updateRow(idx, "minQty", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step="0.01"
                    value={row.ratePercent}
                    onChange={e => updateRow(idx, "ratePercent", e.target.value)}
                  />
                </td>
                <td>
                  <Button tone="critical" icon={DeleteIcon} onClick={() => removeRow(idx)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button style={{ marginTop: 8 }} onClick={addRow}>+ Add Tier</Button>
      </section>

      {/* Size Surcharges */}
      <section style={{ marginTop: 24 }}>
        <h3>Size Surcharges ($)</h3>
        <p style={{ fontSize: "0.7rem", color: "#555", marginTop: 4 }}>
          Per-size add-on (before discount). E.g. XL = 1, 2XL = 2…
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {Object.entries(surcharges).map(([size, val]) => (
            <div key={size} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                aria-label={`Size key ${size}`}
                value={size}
                onChange={e => {
                  const newKey = e.target.value;
                  setSurcharges(prev => {
                    const copy = { ...prev };
                    const v = copy[size];
                    delete copy[size];
                    copy[newKey] = v;
                    return copy;
                  });
                }}
                style={{ width: 80 }}
              />
              <input
                aria-label={`Surcharge for ${size}`}
                type="number"
                step="0.01"
                min={0}
                value={val}
                onChange={e => setSurcharges(prev => ({ ...prev, [size]: Number(e.target.value) }))}
                style={{ width: 90 }}
              />
            </div>
          ))}
        </div>
        <Button style={{ marginTop: 8 }} onClick={() => setSurcharges(prev => ({ ...prev, "": 0 }))}>
          + Add Size
        </Button>
      </section>

      {/* NEW: Print-Area Surcharges */}
      <section style={{ marginTop: 24 }}>
        <h3>Print-Area Surcharges ($ whole unit)</h3>
        <p style={{ fontSize: "0.7rem", color: "#555", marginTop: 4 }}>
          whole-unit add-on for number of print areas (applied before discount). Only keys 1..4 are supported.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {["1", "2", "3", "4"].map(k => (
            <div key={k} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input value={k} disabled style={{ width: 80, background: "#f3f3f3" }} />
              <input
                aria-label={`Print-area surcharge for ${k}`}
                type="number"
                step="0.01"
                min={0}
                value={printAreas[k]}
                onChange={e => setPrintAreas(prev => ({ ...prev, [k]: Number(e.target.value) }))}
                style={{ width: 90 }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* License fee */}
      <section style={{ marginTop: 24 }}>
        <h3>Default License Fee ($)</h3>
        <p style={{ fontSize: "0.7rem", color: "#555", marginTop: 4 }}>
          Applied only when “Collegiate License” is enabled in a quote.
        </p>
        <input
          type="number"
          step="0.01"
          min={0}
          value={licenseFee}
          onChange={e => setLicenseFee(e.target.value)}
        />
      </section>

      {/* Actions */}
      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <Button onClick={onClickSave} disabled={saving}>
            {saving ? "Saving…" : "Save Settings"}
          </Button>
          {error && <span style={{ color: "crimson" }}>{error}</span>}
          {okMsg && <span style={{ color: "green" }}>{okMsg}</span>}
        </div>

        {/* Confirmation Modal */}
        {confirmOpen && (
          <>
            <div
              onClick={() => !saving && setConfirmOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 1000 }}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirm-title"
              aria-describedby="confirm-desc"
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 16,
                minWidth: 320,
                zIndex: 1001,
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
              }}
            >
              <h4 id="confirm-title" style={{ margin: 0 }}> <InfoIcon width="20px" style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Confirm Save</h4>
              <p id="confirm-desc" style={{ marginTop: 8 }}>
                Are you sure you want to save these settings?

                <br />
                These changes will be applied directly to the app's discount settings.


              </p>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
                <Button
                  tone="success"
                  ref={confirmYesBtnRef}
                  onClick={handleConfirmYes}
                  disabled={saving}
                  aria-busy={saving ? "true" : "false"}
                >

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
