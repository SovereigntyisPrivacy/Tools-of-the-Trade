import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FIREARMS_DB = [
  {
    id: 'safety',
    title: 'Universal Safety',
    icon: '⚠️',
    color: '#f59e0b',
    isSafety: true,
    overview: 'A firearm is an unforgiving mechanical tool. Safety is not a passive state; it is an active, non-negotiable discipline. Negligence has lethal consequences.',
    rules: [
      { 
        title: '1. All Guns Are Always Loaded', 
        desc: 'Treat every firearm as if it is loaded, even if you just cleared it yourself. Never accept a handed firearm without immediately locking the action back and physically checking the chamber.' 
      },
      { 
        title: '2. Never Point At What You Won\'t Destroy', 
        desc: 'The Laser Rule: Imagine an infinite laser beam projecting from the muzzle. Never let that beam cross anything you are not completely willing to kill or destroy.' 
      },
      { 
        title: '3. Finger Off The Trigger', 
        desc: 'Keep your trigger finger indexed high and straight on the frame of the weapon. Your finger only enters the trigger guard when your sights are on the target and the conscious decision to fire has been made.' 
      },
      { 
        title: '4. Know Your Target And Beyond', 
        desc: 'Bullets easily penetrate drywall, glass, car doors, and bodies. You are mathematically and legally responsible for every projectile that leaves your muzzle until it stops. Always verify what is behind your target.' 
      }
    ],
    storage: 'An unsecured firearm is a liability to you and your community, not an asset. Never leave a loaded firearm unattended or unsecured in an unsafe environment (e.g., a car console, under a mattress, or an open drawer). Use quick-access staging vaults for immediate home defense, and hard-bolted heavy safes for long-term storage. If it is not under your physical control, it must be locked up.'
  },
  {
    id: 'striker',
    title: 'Striker-Fired Pistol',
    icon: '🔫',
    color: '#3b82f6',
    overview: 'The modern standard for sidearms (e.g., Glock, M&P, P320). Unlike hammer-fired pistols, these utilize an internal spring-loaded striker to ignite the primer. They rely on a short-recoil, locked-breech tilting barrel system.',
    mechanism: 'When fired, the barrel and slide recoil backward together for a short distance. The barrel then tilts downward (camming action), unlocking from the slide. The slide continues backward, extracting the spent casing, resetting the striker, and stripping a new round from the magazine as the recoil spring pushes it forward.',
    disassembly: '1. DROP MAGAZINE AND CLEAR CHAMBER.\n2. Point in a safe direction and pull the trigger (striker must be decocked to remove slide).\n3. Pull slide back slightly (~1/8 inch).\n4. Pull down the takedown levers on both sides of the frame.\n5. Push the slide forward and off the frame.\n6. Compress and remove the recoil spring assembly.\n7. Lift the barrel out of the slide.',
    cleaning: 'Apply CLP (Cleaner, Lubricant, Preservative) to a bore brush and run it through the barrel from chamber to muzzle. Scrub the breech face and extractor claw with a nylon brush. Lubrication requires only a few drops: one on each of the four slide rails, one on the barrel hood, and one on the connector hook. Do not over-lube; it attracts carbon and dust.'
  },
  {
    id: 'ar15',
    title: 'Direct Impingement Rifle',
    icon: '🎯',
    color: '#ef4444',
    overview: 'The ubiquitous AR-15 platform. It is highly modular, precision-machined, and relies on tapping high-pressure gas directly from the barrel to cycle the weapon.',
    mechanism: 'Gas is tapped from a port in the barrel, travels back through a narrow gas tube, and enters the Bolt Carrier Group (BCG) inside the upper receiver. The expanding gas forces the bolt carrier backward, which rotates the bolt head via a cam pin, unlocking the lugs from the chamber. The BCG rides backward into the buffer tube, extracting the casing, and is propelled forward by the buffer spring to chamber the next round.',
    disassembly: '1. DROP MAGAZINE AND CLEAR CHAMBER.\n2. Push the rear takedown pin from left to right. Pivot the upper receiver open.\n3. Pull the charging handle rearward and extract the entire BCG.\n4. To field-strip the BCG: Remove the firing pin retaining pin (cotter pin) from the side. Drop the firing pin out the back. Push the bolt face inward, rotate the cam pin 90 degrees, and lift it out. Pull the bolt straight out of the carrier.',
    cleaning: 'The AR-15 blows carbon directly into the receiver. Use a specialized scraper tool on the tail of the bolt to remove baked-on carbon. Clean the star chamber (locking lugs) with a chamber brush. ARs prefer to run wet. Generously lubricate the bolt carrier contact points, the cam pin, and the gas rings. In heavily dusty environments, wipe off excess lube to prevent grit buildup.'
  },
  {
    id: 'ak47',
    title: 'Long-Stroke Piston',
    icon: '⚔️',
    color: '#f59e0b',
    overview: 'The AK pattern rifle. Designed for raw reliability with massive clearances and loose tolerances to power through mud, carbon, and neglect.',
    mechanism: 'Gas is tapped from the barrel into a gas block, but instead of blowing directly into the receiver, it violently strikes a massive metal piston. This piston is permanently attached to the bolt carrier. The entire heavy mass is thrown rearward, rotating the bolt to unlock it, ejecting the shell, and compressing a heavy recoil spring to chamber the next round.',
    disassembly: '1. DROP MAGAZINE AND CLEAR CHAMBER.\n2. Press the button at the rear of the dust cover and lift the cover off.\n3. Push the recoil spring assembly forward to release it from the rear trunnion, then pull it out.\n4. Pull the bolt carrier/piston assembly all the way to the rear and lift it upward and out of the receiver.\n5. Rotate the bolt to clear the cam channel and pull it forward out of the carrier.\n6. Flip the lever on the rear sight block to release and remove the gas tube/upper handguard.',
    cleaning: 'AKs require minimal maintenance. Swab the bore with CLP and scrub the bolt face. The most critical area is the gas piston head and the inside of the gas tube—scrape off severe carbon fouling, but do not heavily oil the gas tube, as the immense heat will bake the oil into sludge. Lightly grease (grease, not oil) the receiver rails where the carrier rides.'
  },
  {
    id: 'pump',
    title: 'Pump-Action Shotgun',
    icon: '🛢️',
    color: '#10b981',
    overview: 'A manually operated system (e.g., Mossberg 500, Remington 870) that relies entirely on the physical force of the user to cycle the weapon. Known for devastating close-range power and absolute mechanical reliability.',
    mechanism: 'Pulling the forend (pump) backward slides the action bars rearward. This movement unlocks the bolt from the barrel extension, extracts the fired hull, ejects it, and trips the shell stop in the magazine tube to release a fresh shell onto the elevator. Pushing the forend forward lifts the elevator and forces the bolt to push the new shell into the chamber and lock into place.',
    disassembly: '1. EMPTY MAGAZINE TUBE AND CLEAR CHAMBER.\n2. Ensure the action is halfway open.\n3. Unscrew the magazine cap at the front of the magazine tube.\n4. Pull the barrel straight forward and out of the receiver.\n5. Push the retention pins out of the trigger group and drop the trigger assembly out of the bottom.\n6. Pinch the shell stops inside the receiver to slide the bolt and action bars forward and out.',
    cleaning: 'Use a 12-gauge bore snake or wide patch to clear the smoothbore barrel of lead and plastic wad fouling. Scrub the bolt face and the extractor claw. Lightly oil the action bars and the outside of the magazine tube where the pump rides to ensure a smooth, frictionless cycle. Keep the trigger group clean of unburnt powder and debris.'
  }
];

export default function FirearmsDatabase() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(FIREARMS_DB[0].id);

  const activeWeapon = FIREARMS_DB.find(w => w.id === activeTab);

  return (
    <div className="view-wrapper pb-safe" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', marginRight: '15px' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#ef4444', fontSize: '1.2em', textTransform: 'uppercase', letterSpacing: '1px' }}>Firearms & Armory</h2>
      </header>

      <div style={{ padding: '10px 15px', overflowX: 'auto', display: 'flex', gap: '10px', borderBottom: '1px solid #222', scrollbarWidth: 'none' }}>
        {FIREARMS_DB.map(weapon => (
          <button
            key={weapon.id}
            onClick={() => setActiveTab(weapon.id)}
            style={{
              background: activeTab === weapon.id ? `rgba(239, 68, 68, 0.15)` : '#111',
              color: activeTab === weapon.id ? '#ef4444' : '#888',
              border: activeTab === weapon.id ? '1px solid #ef4444' : '1px solid #333',
              padding: '8px 16px',
              borderRadius: '20px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              fontSize: '0.9em',
              cursor: 'pointer'
            }}
          >
            {weapon.title}
          </button>
        ))}
      </div>

      <div style={{ padding: '20px', overflowY: 'auto' }}>
        {activeWeapon && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
              <span style={{ fontSize: '2.5rem', background: '#111', padding: '10px', borderRadius: '50%', border: `1px solid ${activeWeapon.color}` }}>{activeWeapon.icon}</span>
              <div>
                <h2 style={{ margin: '0 0 5px 0', color: '#fff', fontSize: '1.3em', textTransform: 'uppercase' }}>{activeWeapon.title}</h2>
              </div>
            </div>

            {activeWeapon.isSafety ? (
              <>
                <div style={{ background: '#111', borderRadius: '8px', padding: '15px', borderLeft: `4px solid ${activeWeapon.color}` }}>
                  <p style={{ color: '#ccc', margin: 0, lineHeight: '1.5', fontSize: '1.05em', fontWeight: 'bold' }}>{activeWeapon.overview}</p>
                </div>

                {activeWeapon.rules.map((rule, idx) => (
                  <div key={idx} style={{ background: '#111', borderRadius: '8px', padding: '15px', borderLeft: '4px solid #ef4444' }}>
                    <h4 style={{ color: '#ef4444', marginTop: 0, textTransform: 'uppercase', marginBottom: '8px' }}>{rule.title}</h4>
                    <p style={{ color: '#ccc', margin: 0, lineHeight: '1.5', fontSize: '0.95em' }}>{rule.desc}</p>
                  </div>
                ))}

                <div style={{ background: '#111', borderRadius: '8px', padding: '15px', borderLeft: '4px solid #3b82f6' }}>
                  <h4 style={{ color: '#3b82f6', marginTop: 0, textTransform: 'uppercase', marginBottom: '8px' }}>Secure Storage & Custody</h4>
                  <p style={{ color: '#ccc', margin: 0, lineHeight: '1.5', fontSize: '0.95em' }}>{activeWeapon.storage}</p>
                </div>
              </>
            ) : (
              <>
                <div style={{ background: '#111', borderRadius: '8px', padding: '15px', borderLeft: `4px solid ${activeWeapon.color}` }}>
                  <h4 style={{ color: activeWeapon.color, marginTop: 0, textTransform: 'uppercase', marginBottom: '8px' }}>System Overview</h4>
                  <p style={{ color: '#ccc', margin: 0, lineHeight: '1.5', fontSize: '0.95em' }}>{activeWeapon.overview}</p>
                </div>

                <div style={{ background: '#111', borderRadius: '8px', padding: '15px', borderLeft: '4px solid #a855f7' }}>
                  <h4 style={{ color: '#a855f7', marginTop: 0, textTransform: 'uppercase', marginBottom: '8px' }}>Mechanism of Action</h4>
                  <p style={{ color: '#ccc', margin: 0, lineHeight: '1.5', fontSize: '0.95em' }}>{activeWeapon.mechanism}</p>
                </div>

                <div style={{ background: '#111', borderRadius: '8px', padding: '15px', borderLeft: '4px solid #f97316' }}>
                  <h4 style={{ color: '#f97316', marginTop: 0, textTransform: 'uppercase', marginBottom: '12px' }}>Field Stripping</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {activeWeapon.disassembly.split('\n').map((step, idx) => (
                      <p key={idx} style={{ color: step.includes('CLEAR CHAMBER') ? '#ef4444' : '#ccc', fontWeight: step.includes('CLEAR CHAMBER') ? 'bold' : 'normal', margin: 0, lineHeight: '1.4', fontSize: '0.95em' }}>
                        {step}
                      </p>
                    ))}
                  </div>
                </div>

                <div style={{ background: '#111', borderRadius: '8px', padding: '15px', borderLeft: '4px solid #10b981' }}>
                  <h4 style={{ color: '#10b981', marginTop: 0, textTransform: 'uppercase', marginBottom: '8px' }}>Maintenance & Lubrication</h4>
                  <p style={{ color: '#ccc', margin: 0, lineHeight: '1.5', fontSize: '0.95em' }}>{activeWeapon.cleaning}</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
