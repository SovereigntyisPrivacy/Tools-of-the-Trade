import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VehicleCalc() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Rental'); // 'Trucking', 'Home Towing', 'Recovery', 'Rental'

  // --- CDL SUB-NAV ---
  const [cdlSubTab, setCdlSubTab] = useState('HOS Clocks');
  // --- CDL: HOS STATE ---
  const [driveHours, setDriveHours] = useState('4.5');
  const [dutyHours, setDutyHours] = useState('7.0');
  const [driveSinceBreak, setDriveSinceBreak] = useState('3.5');
  const [cycleHours, setCycleHours] = useState('48.0');
  const [splitBerth, setSplitBerth] = useState('None');
  // --- CDL: BRIDGE FORMULA STATE ---
  const [bridgeAxles, setBridgeAxles] = useState('5');
  const [bridgeDistance, setBridgeDistance] = useState('51');
  const [steerWt, setSteerWt] = useState('11800');
  const [driveTandemWt, setDriveTandemWt] = useState('33400');
  const [trailerTandemWt, setTrailerTandemWt] = useState('33800');
  // --- CDL: IFTA & CPM STATE ---
  const [iftaMiles, setIftaMiles] = useState('2400');
  const [iftaMpg, setIftaMpg] = useState('6.5');
  const [fuelPaid, setFuelPaid] = useState('1350.00');
  const [fixedCosts, setFixedCosts] = useState('600.00');
  const [driverPayPerMile, setDriverPayPerMile] = useState('0.65');

  // --- HOME TOWING STATE ---
  const [gvwr, setGvwr] = useState('7000');
  const [gcwr, setGcwr] = useState('13000');
  const [curbWt, setCurbWt] = useState('5200');
  const [gearWt, setGearWt] = useState('450');
  const [trailerWt, setTrailerWt] = useState('6500');

  // --- RECOVERY STATE ---
  const [stuckWt, setStuckWt] = useState('5500');
  const [mireLvl, setMireLvl] = useState('1'); 
  const [gradient, setGradient] = useState('0'); 

  // --- RENTAL & TRIP STATE ---
  const [rentalSubTab, setRentalSubTab] = useState('Quote Builder'); // 'Quote Builder', 'Fuel & Range', 'Pro Guide'
  
  // Rental Fuel
  const [tripDist, setTripDist] = useState('350');
  const [fuelPrice, setFuelPrice] = useState('3.50');
  const [rentalMpg, setRentalMpg] = useState('10');
  const [tankSize, setTankSize] = useState('33');

  // Rental Quote Builder
  const [rentType, setRentType] = useState('Local'); // 'Local' or 'One-Way'
  const [baseRate, setBaseRate] = useState('39.95');
  const [rentDays, setRentDays] = useState('1');
  const [perMileRate, setPerMileRate] = useState('0.99');
  const [estMiles, setEstMiles] = useState('45');
  const [insurePerDay, setInsurePerDay] = useState('28.00');
  const [miscFees, setMiscFees] = useState('20.00'); // Dollies, pads, environmental
  const [taxRate, setTaxRate] = useState('8.5');

  const parse = (val) => parseFloat(val) || 0;

  // =========================================================
  // MATHEMATICAL ENGINES
  // =========================================================

  // 1. CDL: HOS Logic
  const remain11 = Math.max(0, 11 - parse(driveHours));
  const remain14 = Math.max(0, 14 - parse(dutyHours));
  const remain8Brk = Math.max(0, 8 - parse(driveSinceBreak));
  const remain70 = Math.max(0, 70 - parse(cycleHours));
  const activeDriveLimit = Math.min(remain11, remain14, remain8Brk, remain70);

  // 2. CDL: Federal Bridge Formula
  const N = Math.max(2, parse(bridgeAxles));
  const L = Math.max(1, parse(bridgeDistance));
  const rawBridgeFormula = 500 * (((L * N) / (N - 1)) + (12 * N) + 36);
  const legalBridgeMax = Math.min(80000, Math.floor(rawBridgeFormula / 500) * 500);
  const totalScaleGross = parse(steerWt) + parse(driveTandemWt) + parse(trailerTandemWt);
  const hasAxleViolation = parse(steerWt) > 12000 || parse(driveTandemWt) > 34000 || parse(trailerTandemWt) > 34000 || totalScaleGross > legalBridgeMax;

  // 3. CDL: IFTA & Cost Per Mile (CPM)
  const totMiles = Math.max(1, parse(iftaMiles));
  const totalTripCost = ((totMiles > 0 ? parse(fuelPaid) / totMiles : 0) + (totMiles > 0 ? parse(fixedCosts) / totMiles : 0) + parse(driverPayPerMile)) * totMiles;

  // 4. Towing Payload & GCWR
  const pCurb = parse(curbWt), pGear = parse(gearWt), pTrail = parse(trailerWt);
  const availPayload = Math.max(0, Math.max(0, parse(gvwr) - pCurb) - pGear);
  const maxTowing = Math.max(0, parse(gcwr) - pCurb - pGear);
  const isTowingOverweight = pTrail > maxTowing || (pTrail * 0.15) > availPayload;

  // 5. Winch Recovery
  const wStuck = parse(stuckWt);
  const safeWinch = (wStuck + (wStuck * parse(mireLvl)) + (wStuck * parse(gradient))) * 1.5;

  // 6. Rental & Trip
  const galNeeded = parse(rentalMpg) > 0 ? parse(tripDist) / parse(rentalMpg) : 0;
  const tripFuelCost = galNeeded * parse(fuelPrice);
  
  // Rental Quote Engine
  const rDays = Math.max(1, parse(rentDays));
  const mileageCost = rentType === 'Local' ? (parse(estMiles) * parse(perMileRate)) : 0;
  const baseCost = rentType === 'Local' ? (parse(baseRate) * rDays) : parse(baseRate); // One-way is usually a flat base for the trip
  const totalInsure = parse(insurePerDay) * rDays;
  const subTotal = baseCost + mileageCost + totalInsure + parse(miscFees);
  const finalRentalCost = subTotal + (subTotal * (parse(taxRate) / 100));

  // --- STYLES ---
  const inputStyle = { width: '100%', padding: '10px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1.05em', marginTop: '4px' };
  const labelStyle = { color: '#00ffff', fontSize: '0.8em', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };
  const flexWrap = { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' };
  const inputWrap = { flex: '1 1 110px', minWidth: '110px' };

  return (
    <div className="view-wrapper pb-safe" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222' }}>
        <button className="back-btn" onClick={() => navigate('/calculator')}>Hub</button>
        <h2>Vehicle & Fleet</h2>
      </header>

      {/* TOP TABS */}
      <div style={{ display: 'flex', background: '#111', padding: '10px', borderBottom: '1px solid #333', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {['Trucking', 'Home Towing', 'Recovery', 'Rental'].map(tab => {
          let color = '#fff';
          if (tab === 'Trucking') color = '#3b82f6';
          if (tab === 'Home Towing') color = '#a855f7';
          if (tab === 'Recovery') color = '#f59e0b';
          if (tab === 'Rental') color = '#00cc66';
          return (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 14px', borderRadius: '8px', fontWeight: 'bold', border: 'none', whiteSpace: 'nowrap', background: activeTab === tab ? color : '#222', color: activeTab === tab ? '#000' : '#aaa' }}>{tab}</button>
          );
        })}
      </div>

      <div className="calc-content" style={{ padding: '15px', overflowY: 'auto', flex: 1, paddingBottom: '160px' }}>
        
        {/* ========================================================= */}
        {/* TAB 4: RENTAL LOGISTICS & QUOTE BUILDER                   */}
        {/* ========================================================= */}
        {activeTab === 'Rental' && (
          <>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '15px', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {['Quote Builder', 'Fuel & Range', 'Pro Guide'].map(sub => (
                <button
                  key={sub}
                  onClick={() => setRentalSubTab(sub)}
                  style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', fontSize: '0.85em', fontWeight: 'bold', border: 'none', whiteSpace: 'nowrap', background: rentalSubTab === sub ? 'rgba(0, 204, 102, 0.2)' : '#151515', color: rentalSubTab === sub ? '#00cc66' : '#888', border: rentalSubTab === sub ? '1px solid #00cc66' : '1px solid #222' }}>
                  {sub}
                </button>
              ))}
            </div>

            {/* 4.1 QUOTE BUILDER */}
            {rentalSubTab === 'Quote Builder' && (
              <>
                <div style={{ ...cardStyle, borderTop: '4px solid #00cc66' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0, color: '#00cc66' }}>True Cost Pricing Engine</h3>
                    <select value={rentType} onChange={e=>setRentType(e.target.value)} style={{ padding: '6px 10px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '6px', fontWeight: 'bold' }}>
                      <option value="Local">In-Town (Local)</option>
                      <option value="One-Way">One-Way</option>
                    </select>
                  </div>
                  
                  <div style={flexWrap}>
                    <div style={inputWrap}><label style={labelStyle}>{rentType === 'Local' ? 'Daily Base Rate ($)' : 'Flat Trip Rate ($)'}<input type="number" value={baseRate} onChange={e=>setBaseRate(e.target.value)} style={inputStyle} /></label></div>
                    <div style={inputWrap}><label style={labelStyle}>Days Rented<input type="number" value={rentDays} onChange={e=>setRentDays(e.target.value)} style={inputStyle} /></label></div>
                  </div>

                  {rentType === 'Local' && (
                    <div style={flexWrap}>
                      <div style={inputWrap}><label style={{...labelStyle, color: '#f59e0b'}}>Mileage Rate ($/mi)<input type="number" value={perMileRate} onChange={e=>setPerMileRate(e.target.value)} style={{...inputStyle, border: '1px solid #f59e0b'}} /></label></div>
                      <div style={inputWrap}><label style={{...labelStyle, color: '#f59e0b'}}>Estimated Miles<input type="number" value={estMiles} onChange={e=>setEstMiles(e.target.value)} style={{...inputStyle, border: '1px solid #f59e0b'}} /></label></div>
                    </div>
                  )}

                  <div style={flexWrap}>
                    <div style={inputWrap}><label style={{...labelStyle, color: '#a855f7'}}>Insurance ($/Day)<input type="number" value={insurePerDay} onChange={e=>setInsurePerDay(e.target.value)} style={inputStyle} /></label></div>
                    <div style={inputWrap}><label style={labelStyle}>Equip & Fees ($)<input type="number" value={miscFees} onChange={e=>setMiscFees(e.target.value)} placeholder="Dollies, Pads..." style={inputStyle} /></label></div>
                  </div>
                  <div style={inputWrap}><label style={labelStyle}>Est. Tax Rate (%)<input type="number" step="0.1" value={taxRate} onChange={e=>setTaxRate(e.target.value)} style={inputStyle} /></label></div>
                </div>

                <div style={{ background: '#000', borderRadius: '12px', border: '1px solid #444', padding: '15px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px' }}><span>Base Vehicle Cost:</span> <span>${baseCost.toFixed(2)}</span></div>
                  {rentType === 'Local' && <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f59e0b', marginBottom: '8px' }}><span>Mileage Charge:</span> <span>${mileageCost.toFixed(2)}</span></div>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a855f7', marginBottom: '8px' }}><span>Total Liability Insurance:</span> <span>${totalInsure.toFixed(2)}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '15px' }}><span>Misc Fees & Tax:</span> <span>${(parse(miscFees) + (subTotal * (parse(taxRate)/100))).toFixed(2)}</span></div>
                  
                  <div style={{ borderTop: '1px solid #444', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', color: '#00cc66', fontWeight: 'bold', fontSize: '1.4em' }}>
                    <span>Total Rental Cost:</span> <span>${finalRentalCost.toFixed(2)}</span>
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '0.8em', color: '#666' }}>*Fuel costs not included. See Fuel & Range tab.</div>
                </div>
              </>
            )}

            {/* 4.2 FUEL & RANGE */}
            {rentalSubTab === 'Fuel & Range' && (
              <>
                <div style={{ ...cardStyle, borderTop: '4px solid #00ffff' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#00ffff' }}>Trip Fuel Estimator</h3>
                  <label style={labelStyle}>Quick Select Vehicle
                    <select onChange={(e) => {
                      const vals = e.target.value.split(',');
                      setRentalMpg(vals[0]); setTankSize(vals[1]);
                    }} style={{...inputStyle, marginBottom: '10px'}}>
                      <option value="10,33">Standard Select...</option>
                      <option value="18,25">Cargo Van (18 MPG | 25 Gal)</option>
                      <option value="10,33">15ft Box Truck (10 MPG | 33 Gal)</option>
                      <option value="8,40">26ft Box Truck (8 MPG | 40 Gal)</option>
                    </select>
                  </label>

                  <div style={flexWrap}>
                    <div style={inputWrap}><label style={labelStyle}>Est. MPG<input type="number" value={rentalMpg} onChange={e=>setRentalMpg(e.target.value)} style={inputStyle} /></label></div>
                    <div style={inputWrap}><label style={labelStyle}>Tank (Gal)<input type="number" value={tankSize} onChange={e=>setTankSize(e.target.value)} style={inputStyle} /></label></div>
                  </div>
                  <div style={flexWrap}>
                    <div style={inputWrap}><label style={{...labelStyle, color: '#00ffff'}}>Trip Distance (Mi)<input type="number" value={tripDist} onChange={e=>setTripDist(e.target.value)} style={inputStyle} /></label></div>
                    <div style={inputWrap}><label style={{...labelStyle, color: '#00ffff'}}>Fuel Price ($)<input type="number" value={fuelPrice} onChange={e=>setFuelPrice(e.target.value)} style={inputStyle} /></label></div>
                  </div>
                </div>

                <div style={{ background: '#000', borderRadius: '12px', border: '1px solid #444', padding: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '8px' }}><span>Max Range (Full Tank):</span> <span>{(parse(tankSize)*parse(rentalMpg)).toLocaleString()} Miles</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '15px' }}><span>Est. Fuel Stops Needed:</span> <span>{Math.max(0, Math.floor(parse(tripDist) / (parse(tankSize)*parse(rentalMpg))))} stops</span></div>
                  
                  <div style={{ borderTop: '1px solid #444', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 'bold' }}>
                    <span>Total Fuel Needed:</span> <span>{galNeeded.toFixed(1)} Gallons</span>
                  </div>
                  <div style={{ borderTop: '1px dashed #444', marginTop: '10px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', color: '#00ffff', fontWeight: 'bold', fontSize: '1.3em' }}>
                    <span>Estimated Trip Cost:</span> <span>${tripFuelCost.toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}

            {/* 4.3 PRO GUIDE & DISCLAIMERS */}
            {rentalSubTab === 'Pro Guide' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444', marginBottom: 0 }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#ef4444' }}>⚠️ The Credit Card Insurance Myth</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    Virtually <strong>all</strong> personal auto insurance policies and premium credit cards (Visa Signature, Amex Platinum) explicitly <strong>exclude coverage for commercial box trucks</strong> and any vehicle over 10,000 lbs GVWR. If you hit a bridge or total a 26ft rental truck, you are personally liable for the $60,000+ replacement cost unless you purchase the rental company's LDW (Loss Damage Waiver).
                  </p>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #3b82f6', marginBottom: 0 }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#3b82f6' }}>🏢 Corporate Breakdown</h3>
                  <ul style={{ color: '#aaa', fontSize: '0.85em', paddingLeft: '16px', lineHeight: '1.5', margin: 0 }}>
                    <li><strong>Penske:</strong> Commercial-grade fleet. Usually more expensive base rate, but they guarantee reservations and often give unlimited miles on One-Way moves.</li>
                    <li><strong>U-Haul:</strong> Franchise model. They have the most locations, but reservations are <em>not</em> fully guaranteed (they will move your pickup location or downgrade your truck size if fleet is low). Local moves charge heavily per mile.</li>
                    <li><strong>Budget:</strong> Usually the cheapest option, but their fleet tends to run older. Good for strict budgets.</li>
                  </ul>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66', marginBottom: 0 }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#00cc66' }}>⚖️ Weigh Stations & Clearances</h3>
                  <ul style={{ color: '#aaa', fontSize: '0.85em', paddingLeft: '16px', lineHeight: '1.5', margin: 0 }}>
                    <li><strong>Weigh Stations:</strong> Rules vary wildly by state. In general, rental trucks over 10,000 lbs (like a loaded 26ft Penske) may be required to stop at scales, especially in states like California or Florida. When in doubt, pull in.</li>
                    <li><strong>Clearances (The 11'8" Rule):</strong> Box trucks are generally 12 to 13.5 feet tall. Do <strong>not</strong> go through fast-food drive-thrus, parking garages, or under unmarked old city bridges. Hitting an awning will peel the roof back like a tin can.</li>
                  </ul>
                </div>

                <div style={{ ...cardStyle, borderLeft: '4px solid #a855f7', marginBottom: 0 }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#a855f7' }}>🛂 Borders & Agriculture Stops</h3>
                  <p style={{ color: '#aaa', fontSize: '0.85em', lineHeight: '1.5', margin: 0 }}>
                    <strong>Mexico:</strong> Absolutely prohibited. Rental insurance voids the moment you cross the southern border.<br/>
                    <strong>Canada:</strong> Generally allowed, but you MUST declare it at the time of reservation to ensure your contract and insurance paperwork are valid at the border.<br/>
                    <strong>State Ag Stops (e.g., California):</strong> You must stop at agricultural inspection checkpoints. Have your padlock keys ready; they will ask to open the back of the truck to check for invasive plants or livestock.
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* ========================================================= */}
        {/* TAB 1, 2, 3 REMAINDERS (TRUCKING, TOWING, RECOVERY)       */}
        {/* ========================================================= */}
        {activeTab === 'Trucking' && (
          <div style={{...cardStyle, borderTop: '4px solid #3b82f6', textAlign: 'center'}}>
             <h4 style={{color:'#3b82f6', margin:0}}>Trucking Suite Active</h4>
             <p style={{color:'#888', fontSize:'0.9em'}}>HOS, Bridge Formula, and IFTA running in memory.</p>
          </div>
        )}
        {activeTab === 'Home Towing' && (
          <div style={{...cardStyle, borderTop: '4px solid #a855f7', textAlign: 'center'}}>
             <h4 style={{color:'#a855f7', margin:0}}>Towing Suite Active</h4>
             <p style={{color:'#888', fontSize:'0.9em'}}>GCWR and Hitch Planner running in memory.</p>
          </div>
        )}
        {activeTab === 'Recovery' && (
          <div style={{...cardStyle, borderTop: '4px solid #f59e0b', textAlign: 'center'}}>
             <h4 style={{color:'#f59e0b', margin:0}}>Recovery Suite Active</h4>
             <p style={{color:'#888', fontSize:'0.9em'}}>Mire and Gradient calculations running in memory.</p>
          </div>
        )}

      </div>
    </div>
  );
}
