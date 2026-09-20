import React, { useState } from 'react';

export const FirearmReferenceCards = () => {
  const [expandedCaliber, setExpandedCaliber] = useState(null);

  const calibers = [
    {
      id: '22lr',
      name: '.22 LR',
      desc: 'Rimfire, cheap, zero recoil training.',
      grains: '36gr, 40gr',
      velocity: '~1,070 - 1,250 fps',
      energy: '~100 - 140 ft-lbs'
    },
    {
      id: '9mm',
      name: '9mm Luger',
      desc: 'Global standard defensive handgun round.',
      grains: '115gr, 124gr, 147gr (Subsonic)',
      velocity: '~1,100 - 1,250 fps',
      energy: '~350 - 400 ft-lbs'
    },
    {
      id: '38_357',
      name: '.38 Spl / .357 Mag',
      desc: 'Iconic revolver power; long barrels allow complete magnum powder ignition for massive velocity.',
      grains: '125gr, 158gr',
      velocity: '~800 fps (.38) / ~1,200+ fps (.357)',
      energy: '~200 ft-lbs (.38) / ~500+ ft-lbs (.357)'
    },
    {
      id: '45acp',
      name: '.45 ACP',
      desc: 'Heavy, slow, naturally subsonic stopping power.',
      grains: '230gr (Standard)',
      velocity: '~830 - 950 fps',
      energy: '~350 - 400 ft-lbs'
    },
    {
      id: '10mm',
      name: '10mm Auto',
      desc: 'High-pressure magnum automatic round used for defense against large predators.',
      grains: '180gr, 200gr, 220gr',
      velocity: '~1,150 - 1,300 fps',
      energy: '~550 - 700 ft-lbs'
    },
    {
      id: '556',
      name: '5.56 NATO / .223 Rem',
      desc: 'High-velocity, flat-shooting standard AR rifle cartridge.',
      grains: '55gr, 62gr, 77gr',
      velocity: '~2,900 - 3,100 fps',
      energy: '~1,175 - 1,300 ft-lbs'
    },
    {
      id: '300blk',
      name: '.300 Blackout',
      desc: 'Optimized for suppressed short-barrel performance.',
      grains: '110-125gr (Super), 190-220gr (Sub)',
      velocity: '~2,250 fps (Super) / ~1,000 fps (Sub)',
      energy: '~1,350 ft-lbs (Super) / ~480 ft-lbs (Sub)'
    },
    {
      id: '308',
      name: '.308 Win / 7.62 NATO',
      desc: 'Battle-proven medium/long-range heavy hitter.',
      grains: '147gr, 168gr, 175gr',
      velocity: '~2,600 - 2,800 fps',
      energy: '~2,500 - 2,700 ft-lbs'
    },
    {
      id: '65cm',
      name: '6.5 Creedmoor',
      desc: 'High-BC aerodynamic long-range match caliber.',
      grains: '120gr, 140gr, 147gr',
      velocity: '~2,700 - 2,900 fps',
      energy: '~2,300 - 2,500 ft-lbs'
    }
  ];

  const toggleCaliber = (id) => {
    setExpandedCaliber(expandedCaliber === id ? null : id);
  };

  return (
    <div className="flex flex-col gap-5 p-4 bg-black text-gray-200">
      
      {/* 2A Quote Header */}
      <div className="bg-gray-900 border-2 border-gray-700 rounded-xl p-5 text-center shadow-lg">
        <h2 className="text-lg italic font-serif font-bold text-white uppercase tracking-wider mb-2">The Second Amendment</h2>
        <p className="text-md italic text-gray-300">
          "A well regulated Militia, being necessary to the security of a free State, the right of the people to keep and bear Arms, shall not be infringed."
        </p>
      </div>

      {/* 1. Classifications */}
      <div className="border-l-4 border-blue-600 rounded-r-xl bg-gray-900 p-4 shadow-md">
        <h3 className="text-xl font-bold text-blue-500 mb-3">1. Firearm Classifications</h3>
        <ul className="space-y-3 text-sm leading-relaxed">
          <li><strong className="text-gray-100">Handguns:</strong> Fired with one hand. Primary for CCW and duty sidearms.</li>
          <li><strong className="text-gray-100">Rifles:</strong> Shoulder-fired with rifled barrels for long-range gyroscopic stabilization.</li>
          <li><strong className="text-gray-100">Shotguns:</strong> Smoothbore shoulder-fired weapons for shot pellets or lead slugs.</li>
        </ul>
      </div>

      {/* 2. Interactive Caliber Cheat Sheet */}
      <div className="border-l-4 border-green-600 rounded-r-xl bg-gray-900 p-4 shadow-md">
        <h3 className="text-xl font-bold text-green-500 mb-2">2. Caliber Cheat Sheet</h3>
        <p className="text-xs text-gray-400 mb-4 italic">Tap a caliber to view standard ballistics.</p>
        
        <div className="space-y-2">
          {calibers.map((cal) => (
            <div key={cal.id} className="border border-gray-700 rounded bg-gray-800 overflow-hidden">
              <button 
                onClick={() => toggleCaliber(cal.id)}
                className="w-full text-left p-3 flex justify-between items-center focus:outline-none hover:bg-gray-700 transition-colors"
              >
                <span className="font-bold text-gray-100">{cal.name}</span>
                <span className="text-green-500 font-bold text-lg">
                  {expandedCaliber === cal.id ? '−' : '+'}
                </span>
              </button>
              
              {expandedCaliber === cal.id && (
                <div className="p-3 bg-black border-t border-gray-700 text-sm">
                  <p className="text-gray-300 mb-3">{cal.desc}</p>
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <div className="flex justify-between border-b border-gray-800 pb-1">
                      <span className="text-gray-500">Typical Grains:</span>
                      <span className="text-green-400 font-mono">{cal.grains}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-800 pb-1">
                      <span className="text-gray-500">Muzzle Velocity:</span>
                      <span className="text-green-400 font-mono">{cal.velocity}</span>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span className="text-gray-500">Muzzle Energy:</span>
                      <span className="text-green-400 font-mono">{cal.energy}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Projectile & Terminal Types */}
      <div className="border-l-4 border-pink-600 rounded-r-xl bg-gray-900 p-4 shadow-md">
        <h3 className="text-xl font-bold text-pink-500 mb-3">3. Projectile & Terminal Types</h3>
        <ul className="space-y-3 text-sm leading-relaxed list-disc pl-4 marker:text-pink-600">
          <li><strong className="text-gray-100">FMJ (Ball):</strong> Copper-wrapped lead. Non-expanding target ammo.</li>
          <li><strong className="text-gray-100">JHP (Hollow Point):</strong> Expands violently on soft tissue to dump energy and prevent over-penetration.</li>
          <li><strong className="text-gray-100">Hard Cast:</strong> Antimony-hardened lead for smashing bone without deformation.</li>
          <li><strong className="text-gray-100">OTM (Open Tip Match):</strong> Precision-manufactured aerodynamic match bullet.</li>
          <li><strong className="text-gray-100">Frangible:</strong> Compressed copper powder that disintegrates on steel to prevent splashback.</li>
          <li><strong className="text-gray-100">Subsonic:</strong> Velocity under 1,125 fps to eliminate the supersonic crack when suppressed.</li>
        </ul>
      </div>

      {/* 4. Safety Rules */}
      <div className="border-l-4 border-teal-500 rounded-r-xl bg-gray-900 p-4 shadow-md">
        <h3 className="text-xl font-bold text-teal-400 mb-3">4. 4 Universal Safety Rules</h3>
        <ol className="space-y-3 text-sm list-decimal font-bold text-gray-100 pl-5 marker:text-teal-400">
          <li>ALL GUNS ARE ALWAYS LOADED.</li>
          <li>NEVER POINT AT ANYTHING YOU ARE NOT WILLING TO DESTROY.</li>
          <li>KEEP FINGER OFF TRIGGER UNTIL ON TARGET.</li>
          <li>BE SURE OF YOUR TARGET AND WHAT IS BEYOND IT.</li>
        </ol>
      </div>

      {/* 5. Legal */}
      <div className="border-l-4 border-red-600 rounded-r-xl bg-gray-900 p-4 shadow-md">
        <h3 className="text-xl font-bold text-red-500 mb-3">5. Legal & Safe Harbor Statutes</h3>
        <ul className="space-y-3 text-sm leading-relaxed list-disc pl-4 marker:text-red-600 text-gray-300">
          <li>
            <strong className="text-gray-100">FOPA (18 U.S.C. § 926A):</strong> Protects interstate transport if the firearm is unloaded and locked in a separate compartment inaccessible to the vehicle cabin.
          </li>
          <li>
            <strong className="text-gray-100">Title II NFA:</strong> SBRs (&lt;16" barrel + stock), SBSs (&lt;18" barrel + stock), and Suppressors require Form 1/4 and a $200 Tax Stamp. <em>Note: As of 2026, individual eForm 4 wait times average 4-14 days.</em>
          </li>
          <li>
            <strong className="text-gray-100">Castle Doctrine / Stand Your Ground:</strong> Defines absence of duty to retreat when facing lethal threats in your domicile or public spaces where legally present.
          </li>
        </ul>
      </div>

      {/* 6. Field Stripping & Maintenance */}
      <div className="border-l-4 border-yellow-500 rounded-r-xl bg-gray-900 p-4 shadow-md mb-8">
        <h3 className="text-xl font-bold text-yellow-500 mb-3">6. Cleaning, Maintenance & Storage</h3>
        <ul className="space-y-3 text-sm leading-relaxed text-gray-300">
          <li>
            <strong className="text-yellow-400 block mb-1">1. Clear & Field Strip:</strong> Always verify the chamber and magazine are empty before disassembly. Refer to manufacturer specs to remove the slide or bolt carrier group.
          </li>
          <li>
            <strong className="text-yellow-400 block mb-1">2. Bore & Solvent:</strong> Attach a caliber-specific bore brush. Apply solvent to break down carbon and copper fouling inside the barrel, then push dry patches through until they come out clean.
          </li>
          <li>
            <strong className="text-yellow-400 block mb-1">3. Action & Components:</strong> Scrub the bolt face, slide rails, and trigger assembly with a nylon brush to remove loose carbon buildup.
          </li>
          <li>
            <strong className="text-yellow-400 block mb-1">4. Lubrication (CLP):</strong> Apply a light, even coat of high-quality gun oil to high-friction metal surfaces. Avoid over-lubricating, as excess oil attracts dirt, dust, and carbon buildup.
          </li>
          <li>
            <strong className="text-yellow-400 block mb-1">5. Storage & Climate:</strong> Wipe the exterior with a microfiber cloth to remove fingerprints and residual moisture. Store in a cool, dry environment utilizing a dehumidifier or desiccant packs to prevent rust and oxidation.
          </li>
        </ul>
      </div>

    </div>
  );
};
