import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WOODLAND_GUIDES = [
  {
    title: 'Shelter: The Lean-To', icon: '🏕️',
    steps: ['1. Locate two sturdy trees roughly 6 feet apart.', '2. Lash a strong ridgepole (thick branch) horizontally between them at waist height.', '3. Lean "ribs" (thick sticks) against the ridgepole at a 45-degree angle.', '4. Layer horizontally with smaller sticks to create a lattice.', '5. Pack heavily with debris, leaves, and pine boughs from the bottom up to shed rain.'],
    tip: 'PRO-TIP: Make the debris wall at least 2 feet thick. If you can see daylight through the roof, it is going to leak.'
  },
  {
    title: 'Bed: Debris & Bough Bed', icon: '🛏️',
    steps: ['1. Never sleep directly on the ground; conduction will sap your body heat rapidly.', '2. Build a rectangular frame on the ground using 4 medium logs.', '3. Fill the frame with 8-12 inches of dry, dead leaves or pine needles.', '4. Compress the debris by laying on it, then add a top layer of soft pine boughs angled downward to create a mattress.'],
    tip: 'PRO-TIP: Your bed should be as thick as your shelter roof. Insulation underneath you is more important than blankets on top.'
  },
  {
    title: 'Fire: The Dakota Fire Hole', icon: '🔥',
    steps: ['1. Dig a main pit for the fire, about 1 foot wide and 1 foot deep.', '2. Dig a second, slightly smaller hole about a foot upwind.', '3. Tunnel the second hole at an angle to connect to the base of the main fire pit.', '4. Build your fire in the main pit. The second hole draws in oxygen.'],
    tip: 'PRO-TIP: This burns extremely hot, requires very little fuel, produces almost zero smoke, and hides the flame from view at night.'
  },
  {
    title: 'Crafting: Fire-Hardened Cane', icon: '🦯',
    steps: ['1. Cut a straight, dead-standing hardwood sapling (oak, hickory) roughly shoulder height.', '2. Strip all the bark off to prevent rot and hand blisters.', '3. Round the top end for a comfortable grip.', '4. Slowly rotate the bottom 3 inches over hot coals (do not let it catch fire) until slightly charred, then grind it on a rock.'],
    tip: 'PRO-TIP: Fire-hardening removes the last bits of moisture from the wood cells, making the tip dense enough to double as a defensive spear or digging stick.'
  },
  {
    title: 'Water: Sand & Charcoal Filter', icon: '💧',
    steps: ['1. Cut the bottom off a plastic bottle or use a hollow cone of birch bark. Hang it upside down.', '2. Stuff the neck tightly with clean cloth, cotton, or dense grass.', '3. Add a thick layer of crushed charcoal from a cold fire (crucial for filtering toxins).', '4. Add a layer of fine sand, followed by a top layer of small gravel to catch large debris.', '5. Pour water through multiple times until clear.'],
    tip: 'PRO-TIP: This ONLY removes sediment and some heavy chemicals. It DOES NOT kill bacteria. You MUST boil this filtered water before drinking.'
  }
];

const DESERT_GUIDES = [
  {
    title: 'Water: Finding Sources', icon: '🌵',
    steps: ['1. Look for patches of green vegetation, swarms of insects, or converging animal tracks.', '2. Dig at the lowest point of the outside edge of a dry river bend; water pools below the surface here.', '3. Check rock crevices and shaded canyons early in the morning for dew or lingering puddles.'],
    tip: 'PRO-TIP: Do not drink cactus fluid (except the Fishhook Barrel). Most cacti contain high levels of alkaline and oxalic acid that will cause vomiting and accelerate dehydration.'
  },
  {
    title: 'Water: The Solar Still', icon: '☀️',
    steps: ['1. Dig a hole roughly 3 feet wide and 2 feet deep in direct sunlight.', '2. Place a collection cup in the exact center.', '3. Place chopped vegetation or urinate strictly around the sides of the hole (not in the cup).', '4. Cover the hole completely with a clear plastic tarp, sealing the edges with sand and rocks.', '5. Place a small pebble in the center of the tarp directly over the cup.'],
    tip: 'PRO-TIP: Condensation evaporates from the dirt/urine, hits the plastic, and drips down into the cup as pure, distilled water.'
  },
  {
    title: 'Shelter: The Trench Shade', icon: '⛺',
    steps: ['1. Do not exert yourself building a massive shelter during the heat of the day.', '2. Dig a shallow trench in the sand (the earth is significantly cooler a few inches down).', '3. Stretch a tarp, poncho, or blanket over the trench, securing the corners with rocks.', '4. Leave the sides open to allow the breeze to flow through.'],
    tip: 'PRO-TIP: Limit all movement during peak sun. Travel, hunt, and gather only at night or in the very early morning.'
  }
];

const WINTER_GUIDES = [
  {
    title: 'Shelter: The Quinzee (Snow Cave)', icon: '❄️',
    steps: ['1. Pile snow into a massive mound roughly 6-8 feet high and 10 feet wide.', '2. Let the pile sit for 2-3 hours so the snow can "sinter" (harden and bond).', '3. Burrow a small entrance at the base, tunneling inward and slightly upward to trap heat.', '4. Hollow out the inside, leaving the walls and roof at least 1-2 feet thick.', '5. Poke a small ventilation stick through the roof.'],
    tip: 'PRO-TIP: If you plan on using a candle inside for heat or light, you MUST have a ventilation hole or you will die from carbon monoxide poisoning.'
  },
  {
    title: 'Bed: Thermal Isolation', icon: '🌡️',
    steps: ['1. Snow is frozen water; sleeping on it will cause rapid hypothermia.', '2. Build a raised platform of logs or thickly packed pine boughs at least 1 foot above the snow floor.', '3. Lay a reflective space blanket (silver side up) on the boughs to reflect body heat back at you.', '4. Keep your sleeping area small; your body heat has to warm the ambient air.'],
    tip: 'PRO-TIP: Sleep in the clothes you will wear tomorrow. Keep your boots inside the shelter (or your sleeping bag) so they do not freeze solid overnight.'
  },
  {
    title: 'Water: Melting Snow Safely', icon: '🧊',
    steps: ['1. Gather dense, clean snow or ice (ice yields more water for the fuel used).', '2. NEVER put fluffy snow into a dry, hot pot over a fire. It will sublimate into vapor and ruin the pot.', '3. Always keep a small amount of liquid water (a "primer") in the bottom of the pot, and add snow to the water to melt it.'],
    tip: 'PRO-TIP: NEVER eat snow directly to hydrate. It forces your body to expend massive amounts of caloric energy to melt it, rapidly accelerating hypothermia.'
  }
];

const URBAN_GUIDES = [
  {
    title: 'Water: Improvised Rain Catcher', icon: '🌧️',
    steps: ['1. String a clean tarp, heavy-duty trash bag, or poncho across an alleyway or between structures.', '2. Angle the material steeply so water funnels to a single low point.', '3. Place a clean bucket, bottle, or sealed container beneath the drip line.', '4. Avoid catching runoff from shingle roofs, lead gutters, or chemical-coated concrete.'],
    tip: 'PRO-TIP: In an urban environment, rain is the safest water source. Puddles and rivers contain industrial runoff, oil, and human waste.'
  },
  {
    title: 'Shelter: The Concrete Hide', icon: '🏢',
    steps: ['1. Seek abandoned industrial zones, high-rise stairwells, or shipping containers.', '2. Stay off the ground floor and away from exterior windows to remain unseen.', '3. Concrete is a thermal sink; it will drain your body heat instantly. Scavenge large amounts of cardboard to create a thick floor mat.', '4. Barricade the entry door from the inside using wedges or heavy debris.'],
    tip: 'PRO-TIP: Cardboard is one of the best urban insulators available. Tape it to windows to block light leaks and trap heat.'
  },
  {
    title: 'Fire: The Hobo Stove', icon: '🥫',
    steps: ['1. Find a large steel can (like a coffee can).', '2. Punch a series of holes around the bottom edge for air intake.', '3. Cut a small square "door" at the bottom to feed twigs into.', '4. Punch holes around the top edge to let smoke escape and place your pot directly on top.'],
    tip: 'PRO-TIP: This stove funnels heat directly upward, boils water incredibly fast with very little fuel (twigs, paper, scrap wood), and hides the flame.'
  }
];

export default function SurvivalLibrary() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('woodland');

  const glassCard = { background: 'rgba(17, 17, 17, 0.7)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid #333', padding: '0', marginBottom: '15px', overflow: 'hidden' };

  const renderDatabase = (db, accentColor) => (
    <div style={{ marginTop: '20px' }}>
      {db.map((item, idx) => (
        <div key={idx} style={{ ...glassCard, borderLeft: `4px solid ${accentColor}` }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '15px', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>{item.title}</h3>
          </div>
          <div style={{ padding: '15px' }}>
            {item.steps.map((step, sIdx) => (
              <p key={sIdx} style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 10px 0', paddingLeft: '10px', textIndent: '-10px' }}>
                {step}
              </p>
            ))}
            {item.tip && (
              <div style={{ marginTop: '15px', padding: '10px', background: '#111', borderRadius: '6px', border: `1px solid ${accentColor}` }}>
                <p style={{ margin: 0, color: accentColor, fontSize: '0.85rem', fontWeight: 'bold' }}>{item.tip}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.8)' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', marginRight: '15px' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#10b981', fontSize: '1.2rem' }}>Survival Library</h2>
      </header>

      {/* CRITICAL WATER WARNING */}
      <div style={{ background: '#7f1d1d', padding: '15px', textAlign: 'center', borderBottom: '2px solid #ef4444' }}>
        <h4 style={{ color: '#fff', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>⚠️ CRITICAL WATER WARNING</h4>
        <p style={{ color: '#fca5a5', fontSize: '0.8rem', margin: 0, fontWeight: 'bold', lineHeight: '1.4' }}>
          NEVER drink clear water from an unknown source without purifying it. Pathogens, parasites (like Giardia), and heavy metals are INVISIBLE. Filtering removes debris; BOILING kills biology. Do both.
        </p>
      </div>

      <div style={{ display: 'flex', padding: '15px', gap: '8px', background: 'rgba(0,0,0,0.5)', overflowX: 'auto', whiteSpace: 'nowrap', WebkitOverflowScrolling: 'touch' }}>
        <button onClick={() => setActiveTab('woodland')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'woodland' ? '#10b981' : '#222', color: activeTab === 'woodland' ? '#000' : '#888' }}>🌲 Woodland</button>
        <button onClick={() => setActiveTab('desert')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'desert' ? '#f59e0b' : '#222', color: activeTab === 'desert' ? '#000' : '#888' }}>🏜️ Desert</button>
        <button onClick={() => setActiveTab('winter')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'winter' ? '#0ea5e9' : '#222', color: activeTab === 'winter' ? '#000' : '#888' }}>❄️ Winter</button>
        <button onClick={() => setActiveTab('urban')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'urban' ? '#71717a' : '#222', color: activeTab === 'urban' ? '#000' : '#888' }}>🏢 Urban</button>
      </div>

      <div style={{ padding: '0 15px 100px 15px', overflowY: 'auto' }}>
        {activeTab === 'woodland' && renderDatabase(WOODLAND_GUIDES, '#10b981')}
        {activeTab === 'desert' && renderDatabase(DESERT_GUIDES, '#f59e0b')}
        {activeTab === 'winter' && renderDatabase(WINTER_GUIDES, '#0ea5e9')}
        {activeTab === 'urban' && renderDatabase(URBAN_GUIDES, '#71717a')}
      </div>
    </div>
  );
}
