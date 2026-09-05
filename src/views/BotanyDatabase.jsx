import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OFFLINE_FLORA_DB = [
  // --- DESERT & ARID SURVIVAL ---
  { id: 'f1', name: 'Prickly Pear Cactus (Opuntia)', type: 'Edible / Hydration', dangerLevel: 'Low (Spines)', color: '#00cc66', icon: '🌵', description: 'Segmented, flat cactus pads with red/purple bulbous fruit.', details: 'Pads (nopales) and fruit (tuna) are water-dense. Burn or scrape off microscopic glochid spines before consuming.', lookalikes: 'Other cacti.' },
  { id: 'f2', name: 'Saguaro (Carnegiea gigantea)', type: 'Edible / Hydration', dangerLevel: 'Low', color: '#00cc66', icon: '🏜️', description: 'Massive, towering columnar cactus with arms.', details: 'Produces ruby-red, nutrient-dense fruit mid-summer. DO NOT drink fluid from the inner trunk; it is highly alkaline and toxic.', lookalikes: 'Cardón cactus.' },
  { id: 'f3', name: 'Barrel Cactus (Ferocactus)', type: 'Hydration / Edible', dangerLevel: 'Moderate (Alkaline)', color: '#f59e0b', icon: '🛢️', description: 'Squat, cylinder-shaped cactus with heavy, curved red/yellow spines.', details: 'Fruit is edible (no spines, tart). The pulp contains moisture but is highly alkaline and can cause diarrhea if eaten in large amounts. Emergency hydration only.', lookalikes: 'Young saguaros.' },
  { id: 'f4', name: 'Creosote Bush (Larrea tridentata)', type: 'Medicinal / Utility', dangerLevel: 'Moderate (Internal)', color: '#3b82f6', icon: '🌿', description: 'Resinous evergreen shrub, smells strongly of desert rain.', details: 'Boil leaves for a potent antibacterial wash for wounds. Avoid heavy ingestion; high doses cause severe liver toxicity.', lookalikes: 'None.' },
  { id: 'f5', name: 'Mesquite (Prosopis)', type: 'Edible / Utility', dangerLevel: 'None', color: '#00cc66', icon: '🌳', description: 'Desert tree with fern-like leaves, sharp thorns, and long seed pods.', details: 'Seed pods are highly nutritious, sweet, and can be ground into high-calorie flour. Wood burns extremely hot and slow for cooking.', lookalikes: 'Palo Verde (edible seeds, green bark).' },
  { id: 'f6', name: 'Agave (Agave spp.)', type: 'Edible / Utility', dangerLevel: 'Moderate (Caustic Sap)', color: '#f59e0b', icon: '🪴', description: 'Large rosette of thick, fleshy, spiked leaves.', details: 'The heart (piña) can be slow-roasted in a pit for massive calories. Leaves yield strong cordage fibers. WARNING: Raw sap is highly caustic and causes contact dermatitis.', lookalikes: 'Yucca (also edible/utility).' },
  { id: 'f7', name: 'Yucca (Yucca spp.)', type: 'Edible / Soap', dangerLevel: 'Low', color: '#00cc66', icon: '🌾', description: 'Rosette of stiff, sword-like leaves with a tall central stalk of white flowers.', details: 'Flowers and fruit are edible. Roots contain saponins and can be crushed with water to make antibacterial soap or shampoo. Leaves make excellent cordage.', lookalikes: 'Agave.' },
  { id: 'f8', name: 'Mormon Tea (Ephedra)', type: 'Medicinal', dangerLevel: 'Low', color: '#3b82f6', icon: '🍵', description: 'Leafless, jointed green stems resembling upright broom bristles.', details: 'Contains ephedrine (a mild stimulant/decongestant). Brew stems into a tea to treat asthma, colds, and fatigue.', lookalikes: 'Broom snakeweed.' },
  { id: 'f9', name: 'Ocotillo (Fouquieria splendens)', type: 'Medicinal / Utility', dangerLevel: 'Low', color: '#3b82f6', icon: '🎋', description: 'Cluster of long, spiky, whip-like green canes with flaming red tips.', details: 'Flowers are edible and sweet. Bark tincture acts as a lymphatic stimulant. Canes can be cut to create living defensive fences.', lookalikes: 'None.' },

  // --- UNIVERSAL FORAGING & STAPLES ---
  { id: 'f10', name: 'Broadleaf Plantain (Plantago major)', type: 'Medicinal / Edible', dangerLevel: 'None', color: '#3b82f6', icon: '🌱', description: 'Low-growing weed with broad, ribbed green leaves in compacted soil.', details: '"Nature\'s Band-Aid". Chew leaves to a pulp for a drawing poultice on stings and minor cuts. Young leaves are edible.', lookalikes: 'Hosta (non-toxic).' },
  { id: 'f11', name: 'Dandelion (Taraxacum officinale)', type: 'Edible / Medicinal', dangerLevel: 'None', color: '#00cc66', icon: '🌼', description: 'Yellow flower, deeply toothed basal leaves, hollow stem with milky sap.', details: '100% edible. Leaves are highly nutritious (eat young to avoid bitterness). Roots can be roasted for coffee substitute. Sap cures warts.', lookalikes: 'Catsear, Hawksbeard (both edible).' },
  { id: 'f12', name: 'Cattail (Typha)', type: 'Edible / Utility', dangerLevel: 'Moderate (Water Quality)', color: '#00cc66', icon: '🌾', description: 'Tall reed with a brown, cigar-shaped flower spike near water.', details: 'The "Supermarket of the Swamp." Roots yield starch, early shoots are edible raw, pollen is a flour substitute. Fluff is highly flammable tinder. WARNING: Absorbs heavy metals from polluted water.', lookalikes: 'Toxic Iris species (before flowering).' },
  { id: 'f13', name: 'Mullein (Verbascum thapsus)', type: 'Medicinal / Utility', dangerLevel: 'Low', color: '#3b82f6', icon: '🌿', description: 'Fuzzy, exceptionally soft, large pale-green leaves with a tall yellow flower stalk.', details: 'Smoke or brew leaves as an expectorant for lung clearing. Leaves act as highly effective field toilet paper or boot insulation.', lookalikes: 'Foxglove (Highly Toxic - leaves are NOT fuzzy).' },
  { id: 'f14', name: 'Yarrow (Achillea millefolium)', type: 'Medicinal', dangerLevel: 'Low', color: '#3b82f6', icon: '🌸', description: 'Feathery, fern-like leaves with flat-topped clusters of tiny white flowers.', details: 'Powerful hemostatic (blood coagulant). Crush leaves and pack into bleeding wounds to rapidly accelerate clotting.', lookalikes: 'Poison Hemlock (LETHAL - distinguish by Yarrow\'s pleasant smell and fuzzy stem).' },
  { id: 'f15', name: 'Stinging Nettle (Urtica dioica)', type: 'Edible / Medicinal', dangerLevel: 'Low (Stings)', color: '#00cc66', icon: '🌿', description: 'Tall weed with serrated leaves covered in tiny stinging hairs.', details: 'Leaves contain formic acid and histamine (painful sting). Boiling or drying completely neutralizes the sting, leaving a superfood packed with protein and iron.', lookalikes: 'Dead Nettle (harmless).' },
  { id: 'f16', name: 'Purslane (Portulaca oleracea)', type: 'Edible', dangerLevel: 'Low', color: '#00cc66', icon: '🍀', description: 'Low, creeping succulent with smooth, reddish stems and paddle-shaped leaves.', details: 'Highest Omega-3 fatty acid content of any leafy land plant. Excellent raw or cooked. Tart, lemony flavor.', lookalikes: 'Spurge (Poisonous - exudes milky white sap when broken. Purslane sap is clear).' },
  { id: 'f17', name: 'Amaranth (Amaranthus)', type: 'Edible', dangerLevel: 'Low', color: '#00cc66', icon: '🌾', description: 'Tall weed with heavily veined leaves and dense clusters of tiny red/green flowers.', details: 'Leaves are edible like spinach. Seeds are a complete protein grain. Boiling removes nitrates in older leaves.', lookalikes: 'Pigweed (another name for Amaranth).' },
  { id: 'f18', name: 'White Pine (Pinus)', type: 'Edible / Utility', dangerLevel: 'Low', color: '#00cc66', icon: '🌲', description: 'Evergreen tree with long needles growing in bundles.', details: 'Needles chopped and steeped in hot water yield massive amounts of Vitamin C (prevents scurvy). Pine resin is highly flammable and acts as a waterproof glue or wound sealant.', lookalikes: 'Yew (LETHAL - flat needles, red berries).' },
  { id: 'f19', name: 'White Willow (Salix alba)', type: 'Medicinal', dangerLevel: 'Low', color: '#3b82f6', icon: '🌳', description: 'Tree typically found near water with long, narrow, silvery-green leaves.', details: 'Inner bark contains salicin (the chemical precursor to aspirin). Boil a small handful of inner bark to relieve fever, inflammation, and pain.', lookalikes: 'Other willows (also contain salicin).' },
  { id: 'f20', name: 'Oak (Quercus)', type: 'Edible / Utility', dangerLevel: 'Moderate (Tannins)', color: '#00cc66', icon: '🌳', description: 'Hardwood tree with lobed leaves and acorn nuts.', details: 'Acorns are a massive survival calorie source, but MUST be leached in running water or boiled multiple times to remove toxic/bitter tannins. Boiled acorn water is a strong antiseptic wash.', lookalikes: 'None.' },
  { id: 'f21', name: 'Wild Garlic / Onion (Allium)', type: 'Edible', dangerLevel: 'Moderate (Lookalikes)', color: '#00cc66', icon: '🧄', description: 'Grass-like tubular leaves springing from a small underground bulb.', details: 'Entire plant is edible. Strong antibacterial properties. Golden Rule: It MUST smell distinctly of onion/garlic. If it doesn\'t smell, do not eat it.', lookalikes: 'Death Camas (LETHAL - no onion smell).' },
  
  // --- LETHAL & TOXIC (KNOW THESE FIRST) ---
  { id: 'f22', name: 'Datura / Jimsonweed', type: 'Toxic / Deliriant', dangerLevel: 'EXTREME (LETHAL)', color: '#ef4444', icon: '☠️', description: 'Bushy weed with large white trumpet flowers and spiked seed pods.', details: 'Contains lethal scopolamine. Causes severe hyperthermia, terrifying 48-hour delirium, and death. Handle with gloves.', lookalikes: 'Moonflower.' },
  { id: 'f23', name: 'Poison Hemlock (Conium maculatum)', type: 'Toxic / Neurotoxin', dangerLevel: 'EXTREME (LETHAL)', color: '#ef4444', icon: '☠️', description: 'Tall plant, lacy fern leaves, white umbrella flowers, PURPLE splotches on stem.', details: 'Highly neurotoxic. Paralyzes respiratory muscles while you remain fully conscious. Death is rapid. Do not touch or burn.', lookalikes: 'Wild Carrot, Yarrow, Fennel.' },
  { id: 'f24', name: 'Water Hemlock (Cicuta)', type: 'Toxic / Convulsant', dangerLevel: 'EXTREME (LETHAL)', color: '#ef4444', icon: '☠️', description: 'Grows in wet areas. Veins of the leaves run to the cuts between the teeth, not the tips.', details: 'Considered North America\'s most toxic plant. A single bite of the root causes violent, fatal grand mal seizures. Contains cicutoxin.', lookalikes: 'Wild Parsnip, Water Parsnip.' },
  { id: 'f25', name: 'Death Camas (Toxicoscordion)', type: 'Toxic', dangerLevel: 'EXTREME (LETHAL)', color: '#ef4444', icon: '☠️', description: 'Looks identical to wild onion/garlic, but has NO onion smell.', details: 'Contains zygacine alkaloids. Ingestion causes frothing at the mouth, slowed heart rate, coma, and death. Always use the smell test.', lookalikes: 'Wild Onion, Wild Garlic, Camas.' },
  { id: 'f26', name: 'Oleander (Nerium oleander)', type: 'Toxic / Cardiac', dangerLevel: 'EXTREME (LETHAL)', color: '#ef4444', icon: '☠️', description: 'Common ornamental desert/suburban shrub with long dark leaves and pink/white flowers.', details: 'Contains lethal cardiac glycosides. Using an oleander branch to roast a hotdog over a fire is enough to stop your heart. Burning it creates toxic smoke.', lookalikes: 'Desert Willow.' },
  { id: 'f27', name: 'Deadly Nightshade (Atropa belladonna)', type: 'Toxic', dangerLevel: 'EXTREME (LETHAL)', color: '#ef4444', icon: '☠️', description: 'Bushy herb with dull green leaves and shiny, sweet-looking black berries.', details: 'Contains atropine. 2-5 berries can kill a child; 10-20 will kill an adult. Causes dilated pupils, hallucinations, and fatal cardiovascular failure.', lookalikes: 'Blueberries (different foliage).' },
  { id: 'f28', name: 'Castor Bean (Ricinus communis)', type: 'Toxic', dangerLevel: 'EXTREME (LETHAL)', color: '#ef4444', icon: '☠️', description: 'Large tropical-looking plant with massive star-shaped leaves and spiky red/green seed pods.', details: 'Seeds contain Ricin, one of the most potent toxins on Earth. Chewing just 1-2 seeds is universally fatal with no known antidote.', lookalikes: 'None.' },
  { id: 'f29', name: 'Foxglove (Digitalis purpurea)', type: 'Toxic / Cardiac', dangerLevel: 'EXTREME (LETHAL)', color: '#ef4444', icon: '☠️', description: 'Tall spike of beautiful, downward-pointing bell-shaped flowers (purple/pink).', details: 'Contains digitalis. Severely disrupts heart rhythms causing fatal cardiac arrest. Never confuse its basal leaves for Mullein.', lookalikes: 'Mullein (before flowering), Comfrey.' },
  { id: 'f30', name: 'White Snakeroot (Ageratina altissima)', type: 'Toxic', dangerLevel: 'EXTREME (LETHAL)', color: '#ef4444', icon: '☠️', description: 'Woodland herb with flat-topped clusters of fuzzy white flowers.', details: 'Contains tremetol. Historically famous for "Milk Sickness" (killed Abraham Lincoln\'s mother) when cows ate it and passed the toxin into milk. Fatal.', lookalikes: 'Boneset.' },
  { id: 'f31', name: 'Rosary Pea (Abrus precatorius)', type: 'Toxic', dangerLevel: 'EXTREME (LETHAL)', color: '#ef4444', icon: '☠️', description: 'Climbing vine with distinct hard, bright red seeds with a single black spot.', details: 'Contains abrin (similar to ricin but 75x more deadly). A single thoroughly chewed seed is fatal. Often used in imported jewelry.', lookalikes: 'None.' },
  
  // --- FUNGI (THE FATAL EXCEPTIONS) ---
  { id: 'f32', name: 'Death Cap (Amanita phalloides)', type: 'Toxic Fungi', dangerLevel: 'EXTREME (LETHAL)', color: '#ef4444', icon: '🍄', description: 'Mushroom with a pale yellowish/green cap, white gills, and a "cup" (volva) at the base of the stem.', details: 'The deadliest mushroom in the world. Destroys the liver and kidneys over a period of days. Tastes reportedly pleasant.', lookalikes: 'Paddy Straw Mushroom, Puffballs.' },
  { id: 'f33', name: 'Destroying Angel (Amanita bisporigera)', type: 'Toxic Fungi', dangerLevel: 'EXTREME (LETHAL)', color: '#ef4444', icon: '🍄', description: 'Pure white mushroom, white gills, white stem, bulbous cup at the base.', details: 'Contains amatoxins. Symptoms are delayed for 6-24 hours, giving false hope, before total liver and kidney failure sets in. Fatal.', lookalikes: 'Meadow Mushroom, Button Mushroom.' },
  { id: 'f34', name: 'Galerina (Galerina marginata)', type: 'Toxic Fungi', dangerLevel: 'EXTREME (LETHAL)', color: '#ef4444', icon: '🍄', description: 'Small, non-descript brown/yellow mushroom growing on rotting wood.', details: '"Autumn Skullcap." Contains the same amatoxins as the Death Cap. Extremely dangerous for foragers seeking hallucinogenic or edible brown mushrooms.', lookalikes: 'Honey Mushrooms, Psilocybes.' },
  { id: 'f35', name: 'Jack-o\'-Lantern (Omphalotus illudens)', type: 'Toxic Fungi', dangerLevel: 'High', color: '#ef4444', icon: '🍄', description: 'Bright orange mushrooms growing in large clusters on wood. Gills glow faintly green in total darkness.', details: 'Not usually fatal, but causes violent, severe gastrointestinal distress and cramping for several days.', lookalikes: 'Chanterelles (edible, but grow in soil, not wood).' }
];

export default function BotanyDatabase() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(OFFLINE_FLORA_DB);

  const handleSearch = (e) => {
    const val = e.target.value.toLowerCase();
    setQuery(val);
    
    if (!val.trim()) {
      setResults(OFFLINE_FLORA_DB);
      return;
    }

    const filtered = OFFLINE_FLORA_DB.filter(plant => 
      plant.name.toLowerCase().includes(val) || 
      plant.type.toLowerCase().includes(val) ||
      plant.description.toLowerCase().includes(val) ||
      plant.details.toLowerCase().includes(val)
    );
    setResults(filtered);
  };

  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '20px', marginBottom: '15px' };

  return (
    <div className="view-wrapper pb-safe" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', marginRight: '15px' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#00cc66', fontSize: '1.2em' }}>Botany & Foraging</h2>
      </header>

      <div style={{ padding: '20px', overflowY: 'auto' }}>
        
        {/* Bridge to AI Scanner */}
        <button onClick={() => navigate('/schematics/scanner')} style={{ width: '100%', padding: '15px', background: 'rgba(0, 204, 102, 0.1)', border: '1px solid #00cc66', borderRadius: '8px', color: '#00cc66', fontWeight: 'bold', fontSize: '1em', marginBottom: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <span>👁️</span> Unknown Target? Use AI Visual Scanner
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '15px' }}>
          <p style={{ color: '#00cc66', fontWeight: 'bold', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>🌿 Offline Field Guide</p>
          <span style={{ color: '#888', fontSize: '0.8em', fontWeight: 'bold' }}>{OFFLINE_FLORA_DB.length} SPECIES LOADED</span>
        </div>

        <input 
          type="text" 
          placeholder="Search 'Edible', 'Medicinal', 'Toxic', or 'Cactus'..." 
          value={query}
          onChange={handleSearch}
          style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #00cc66', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '1.1em', marginBottom: '25px', boxSizing: 'border-box' }}
        />

        {results.length === 0 ? (
          <div style={{ color: '#888', textAlign: 'center', padding: '20px' }}>No offline records found for "{query}".</div>
        ) : (
          results.map(plant => (
            <div key={plant.id} style={{ ...cardStyle, borderLeft: `4px solid ${plant.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px', borderBottom: '1px solid #222', paddingBottom: '15px' }}>
                <div style={{ fontSize: '2.5rem', background: '#000', padding: '10px', borderRadius: '50%', border: '1px solid #333' }}>{plant.icon}</div>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', color: '#fff', fontSize: '1.1em' }}>{plant.name}</h3>
                  <span style={{ background: 'rgba(255,255,255,0.1)', color: plant.color, padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em', fontWeight: 'bold', textTransform: 'uppercase' }}>{plant.type}</span>
                </div>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <span style={{ color: '#888', fontSize: '0.85em', textTransform: 'uppercase', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Identification</span>
                <p style={{ color: '#ccc', margin: 0, fontSize: '0.95em', lineHeight: '1.5' }}>{plant.description}</p>
              </div>

              <div style={{ marginBottom: '15px', background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222' }}>
                <span style={{ color: plant.color, fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Field Notes & Uses</span>
                <p style={{ color: '#fff', margin: 0, fontSize: '0.95em', lineHeight: '1.5' }}>{plant.details}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85em', paddingBottom: '8px', borderBottom: '1px dashed #333' }}>
                  <span style={{ color: '#888', fontWeight: 'bold' }}>DANGER LEVEL:</span>
                  <strong style={{ color: plant.dangerLevel.includes('EXTREME') ? '#ef4444' : (plant.dangerLevel.includes('Moderate') || plant.dangerLevel.includes('High') ? '#f59e0b' : '#00cc66') }}>{plant.dangerLevel}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85em' }}>
                  <span style={{ color: '#888', fontWeight: 'bold', width: '30%' }}>LOOKALIKES:</span>
                  <span style={{ color: '#ccc', textAlign: 'right', width: '70%', lineHeight: '1.4' }}>{plant.lookalikes}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
