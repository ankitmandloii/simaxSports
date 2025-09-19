import React, { useEffect, useState, useRef } from "react";
import {
    Button,
    Modal,
    Text,
} from "@shopify/polaris";
import { DeleteIcon } from "@shopify/polaris-icons";
import "./DiscountUpdate.css";

export default function DiscountUpdate() {
    const [tiers, setTiers] = useState([{ minQty: 1, ratePercent: 0 }]);
    const [surcharges, setSurcharges] = useState({ XL: 1, "2XL": 2, "3XL": 3 });
    // const [licenseFee, setLicenseFee] = useState(25);
    const [printAreas, setPrintAreas] = useState({ "1": 0.23, "2": 0.46, "3": 12.68, "4": 18.92 });
    const [nameAndNumberSurcharges, setNameAndNumberSurcharges] = useState({ nameSurcharge: 3, numberSurcharge: 4, nameAndNumberBothPrint: 5 });
    const [testUnit, setTestUnit] = useState(20);
    const [testQty, setTestQty] = useState(12);
    const [testSize, setTestSize] = useState("XL");
    const [testAreas, setTestAreas] = useState(2);
    const [testLicense, setTestLicense] = useState(false);
    const [nameChecked, setNameChecked] = useState(false);
    const [numberChecked, setNumberChecked] = useState(false);

    const addRow = () => setTiers(prev => [...prev, { minQty: 1, ratePercent: 0 }]);
    const removeRow = (idx) => setTiers(prev => prev.filter((_, i) => i !== idx));
    const updateRow = (idx, field, value) => setTiers(prev => prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row)));

    function simulate() {
        const tiersDec = tiers.map(t => ({ minQty: Number(t.minQty), rate: Number(t.ratePercent) / 100 }));
        const tier = tiersDec.reduce((prev, curr) => (testQty >= curr.minQty ? curr : prev), { minQty: 1, rate: 0 });
        const sizeUp = Number(surcharges[testSize] || 0);
        const unitBefore = Number(testUnit) + sizeUp;
        const eachBefore = unitBefore;
        const eachAfter = Math.round(unitBefore * (1 - tier.rate) * 100) / 100;
        const subtotalBefore = Math.round(eachBefore * testQty * 100) / 100;
        const discountedSubtotal = Math.round(eachAfter * testQty * 100) / 100;
        const licenseAdd = testLicense ? Number(licenseFee) : 0;
        const paFee = Number(printAreas[String(testAreas)] || 0);
        let nameNumberFee = 0;
        if (nameChecked && numberChecked) nameNumberFee = nameAndNumberSurcharges.nameAndNumberBothPrint;
        else if (nameChecked) nameNumberFee = nameAndNumberSurcharges.nameSurcharge;
        else if (numberChecked) nameNumberFee = nameAndNumberSurcharges.numberSurcharge;
        const grand = Math.round((discountedSubtotal + licenseAdd + paFee + nameNumberFee) * 100) / 100;

        return { eachBefore, eachAfter, subtotalBefore, discountedSubtotal, licenseFee: licenseAdd, printAreaFee: paFee, nameNumberFee, grand };
    }

    const { eachBefore, eachAfter, subtotalBefore, discountedSubtotal, licenseFee, printAreaFee, nameNumberFee, grand } = simulate();

    return (
        <div className="pricing__container">
            <h2>Pricing Settings</h2>

            {/* Pricing Calculator */}
            <section className="pricing-calculator-header">
                <h3>Pricing Calculator </h3>
                <p>Test your pricing configuration with real-time calculations</p>
                <section style={{ marginTop: 16, padding: 16, border: "1px solid #e5e5e5", borderRadius: 12, background: "#fafafa" }}>
                    <details>
                        <summary>How pricing works (for admins) +</summary>
                        <div style={{ marginTop: 12, lineHeight: 1.5, fontSize: 14 }}>
                            <ol style={{ paddingLeft: 18 }}>
                                <li><b>Base unit</b> = product price + <i>size surcharge</i>.</li>
                                <li><b>Bulk discount</b> (from tiers) applies to the base unit.</li>
                                <li><b>Print-area fee</b> is a <u>flat fee</u> per item line.</li>
                                <li><b>License fee</b> (optional) is a flat fee.</li>
                            </ol>
                        </div>
                    </details>
                    <div style={{ marginTop: 16, padding: 12, border: "1px dashed #ddd", borderRadius: 10, background: "#fff" }}>
                        <h3>Test Calculator</h3>
                        <div className="grid-5">
                            <div>
                                <label>Unit Price</label>
                                <input type="number" value={20} min={0} step="0.01" readOnly />
                            </div>
                            <div>
                                <label>Qty</label>
                                <input type="number" value={12} min={1} readOnly />
                            </div>
                            <div>
                                <label>Size</label>
                                <select value="XL" >
                                    <option value="XL">XL</option>
                                    <option value="2XL">2XL</option>
                                    <option value="3XL">3XL</option>
                                </select>
                            </div>
                            <div>
                                <label>Print Areas</label>
                                <select value={2} >
                                    <option value={1}>1 area</option>
                                    <option value={2}>2 areas</option>
                                    <option value={3}>3 areas</option>
                                    <option value={4}>4 areas</option>
                                </select>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, paddingTop: 18 }}>
                                <input id="lic" type="checkbox" checked={false} />
                                <label htmlFor="lic">Collegiate License</label>
                            </div>
                        </div>
                        <div style={{ marginTop: 12 }}>
                            <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
                                <div style={{ flex: 1 }} >
                                    <input id="nameSurcharge" type="checkbox" checked={false} />
                                    <label htmlFor="nameSurcharge">Add Name Printing Surcharge ($3)</label>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <input id="numberSurcharge" type="checkbox" checked={false} />
                                    <label htmlFor="numberSurcharge">Add Number Printing Surcharge ($4)</label>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
                                        <div >
                                            <p>Tier Applied: 1+ @ 0% off</p>
                                            <p>Each (before):</p>
                                            <p>Each (after):</p>
                                            <p>Subtotal before:</p>
                                            <p>Discounted subtotal:</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p><strong>0% off</strong></p>
                                            <p><strong>$21.00</strong></p>
                                            <p><strong>$21.00</strong></p>
                                            <p><strong>$252.00</strong></p>
                                            <p><strong>$252.00</strong></p>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    {/* <p><span style={{ color: "#1a0dab", fontWeight: 600 }}>Print-area fee:</span> $0.46</p>
                  <p>Grand Total: $252.46</p> */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, marginTop: 8 }}>
                                        <div>
                                            <p>Print-area fee:</p>
                                            <p style={{ fontSize: '1rem', fontWeight: 'bold' }}>Grand Total:</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p>$0.46</p>
                                            <p style={{ color: "#1a0dab", fontWeight: 600, fontSize: '1rem' }}>$252.46</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </section>

            {/* Discount Tiers */}
            <section>
                <h3>Discount Tiers</h3>
                <p style={{ fontSize: "0.7rem", color: "#555", marginTop: 4 }}>Quantity-based discount (%)</p>
                <div className="table-wrap">
                    <table>
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
                                    <td><input type="number" min={1} value={row.minQty} onChange={e => updateRow(idx, "minQty", e.target.value)} /></td>
                                    <td><input type="number" min={0} max={100} step="0.01" value={row.ratePercent} onChange={e => updateRow(idx, "ratePercent", e.target.value)} /></td>
                                    <td><Button tone="critical" icon={DeleteIcon} onClick={() => removeRow(idx)} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Button style={{ marginTop: 8 }} onClick={addRow}>+ Add Tier</Button>
            </section>

            {/* Name and Number Surcharges */}
            <section>
                <h3>Name and Number Surcharges</h3>
                <p style={{ fontSize: "0.7rem", color: "#555", marginTop: 4 }}>As per depend on Customer Selection Ex. Only Name or Number or Both</p>
                <div className="grid-3">
                    <div>
                        <label>Name Surcharge ($)</label>
                        <input type="number" step="0.01" min={0} value={nameAndNumberSurcharges.nameSurcharge} onChange={e => setNameAndNumberSurcharges(prev => ({ ...prev, nameSurcharge: Number(e.target.value) }))} />
                    </div>
                    <div>
                        <label>Number Surcharge ($)</label>
                        <input type="number" step="0.01" min={0} value={nameAndNumberSurcharges.numberSurcharge} onChange={e => setNameAndNumberSurcharges(prev => ({ ...prev, numberSurcharge: Number(e.target.value) }))} />
                    </div>
                    <div>
                        <label>Name & Number Surcharge ($)</label>
                        <input type="number" step="0.01" min={0} value={nameAndNumberSurcharges.nameAndNumberBothPrint} onChange={e => setNameAndNumberSurcharges(prev => ({ ...prev, nameAndNumberBothPrint: Number(e.target.value) }))} />
                    </div>
                </div>
            </section>

            {/* Size Surcharges */}
            <section>
                <h3>Size Surcharges ($)</h3>
                <p style={{ fontSize: "0.7rem", color: "#555", marginTop: 4 }}>Per-size add-on (before discount).</p>
                <div className="grid-4">
                    {Object.entries(surcharges).map(([size, val]) => (
                        <div key={size}>
                            <input value={size} disabled style={{ background: "#f3f3f3" }} />
                            <input type="number" step="0.01" min={0} value={val} onChange={e => setSurcharges(prev => ({ ...prev, [size]: Number(e.target.value) }))} />
                        </div>
                    ))}
                </div>
            </section>

            {/* Print-Area Surcharges */}
            <section>
                <h3>Print-Area Surcharges ($ flat)</h3>
                <p style={{ fontSize: "0.7rem", color: "#555", marginTop: 4 }}>Flat fee per item line (not per unit). Keys 1..4 only.</p>
                <div className="grid-4">
                    {["1", "2", "3", "4"].map(k => (
                        <div key={k}>
                            <input value={k} disabled style={{ background: "#f3f3f3" }} />
                            <input type="number" step="0.01" min={0} value={printAreas[k]} onChange={e => setPrintAreas(prev => ({ ...prev, [k]: Number(e.target.value) }))} />
                        </div>
                    ))}
                </div>
            </section>

            {/* Default License Fee */}
            <section>
                <h3>Default License Fee ($)</h3>
                <p style={{ fontSize: "0.7rem", color: "#555", marginTop: 4 }}>Applied only when enabled in a quote.</p>
                {/* <input type="number" step="0.01" min={0} value={licenseFee} onChange={e => setLicenseFee(e.target.value)} /> */}
            </section>

            <Button style={{ marginTop: 24 }}>Save Settings</Button>
        </div>
    );
}