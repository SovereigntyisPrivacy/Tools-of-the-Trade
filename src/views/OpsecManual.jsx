import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OpsecManual() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Hardware & OS');

  const tabs = ['Hardware & OS', 'Networks & Comms', 'Financial Anonymity', 'Cryptography', 'Physical & Digital', 'Evasion & Camouflage', 'Crisis & Cover'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Hardware & OS':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ background: '#111', borderRadius: '12px', borderLeft: '4px solid #ef4444', padding: '20px' }}>
              <h3 style={{ color: '#ef4444', marginTop: 0, textTransform: 'uppercase' }}>Physical & OS Isolation</h3>
              <p style={{ color: '#ccc', lineHeight: '1.6', fontSize: '0.95em' }}>
                True sovereignty begins at the bare metal. If the operating system is compromised, all downstream cryptography is void. Security is achieved through strict compartmentalization and physical control.
              </p>
              
              <h4 style={{ color: '#fff', marginBottom: '5px' }}>Mobile Hardening</h4>
              <p style={{ color: '#aaa', lineHeight: '1.5', fontSize: '0.9em', margin: 0 }}>
                Migrate away from OEM Android builds to de-googled environments like GrapheneOS. For local development and system-level modifications, utilize tools like Shizuku paired with Termux to execute elevated commands locally without exposing the device to full root vulnerabilities. Disable all biometrics in high-risk zones; alphanumeric passcodes fall under 5th Amendment protections.
              </p>
              
              <h4 style={{ color: '#fff', marginBottom: '5px', marginTop: '15px' }}>Workstation Compartmentalization</h4>
              <p style={{ color: '#aaa', lineHeight: '1.5', fontSize: '0.9em', margin: 0 }}>
                Never mix daily web browsing with sovereign development or secure storage. Utilize OS-level isolation. Qubes OS acts as the gold standard for security by compartmentalizing tasks into isolated virtual machines. For raw local AI processing or stable development environments, Pop!_OS offers robust bare-metal Linux performance.
              </p>
              
              <h4 style={{ color: '#fff', marginBottom: '5px', marginTop: '15px' }}>Off-Grid Hardware Resiliency</h4>
              <p style={{ color: '#aaa', lineHeight: '1.5', fontSize: '0.9em', margin: 0 }}>
                Running continuous 24/7 cycles for background nodes or heavy local processing requires flawless physical infrastructure. High-capacity solar setups (e.g., EcoFlow Delta Pro Ultra configurations) must be paired with aggressive ambient heat ventilation—especially in extreme desert climates where ambient temperatures can instantly induce thermal throttling and hardware degradation.
              </p>
            </div>
          </div>
        );
      case 'Networks & Comms':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#111', borderRadius: '12px', borderLeft: '4px solid #a855f7', padding: '20px' }}>
              <h3 style={{ color: '#a855f7', marginTop: 0, textTransform: 'uppercase' }}>Decentralized Infrastructure</h3>
              <p style={{ color: '#ccc', lineHeight: '1.6', fontSize: '0.95em' }}>
                Clear-net ISP infrastructure routes and logs all standard DNS requests and unencrypted traffic. Sovereign communications require deliberate routing through zero-trust architectures.
              </p>
              
              <h4 style={{ color: '#fff', marginBottom: '5px' }}>The Sovereign Network & ZHTP</h4>
              <p style={{ color: '#aaa', lineHeight: '1.5', fontSize: '0.9em', margin: 0 }}>
                To bypass centralized choke points, route communications through decentralized network ecosystems utilizing privacy-focused protocols like ZHTP. Operating local background nodes enforces a zero-trust model where metadata is stripped or obfuscated, making traffic analysis mathematically unfeasible for passive observers.
              </p>
              
              <h4 style={{ color: '#fff', marginBottom: '5px', marginTop: '15px' }}>Mesh Networking & Local Comms</h4>
              <p style={{ color: '#aaa', lineHeight: '1.5', fontSize: '0.9em', margin: 0 }}>
                When macro-infrastructure fails or is actively monitored, fall back to localized mesh networks. 900MHz LoRa nodes allow for off-grid, encrypted text routing entirely independent of cell towers or satellite uplinks.
              </p>
            </div>
          </div>
        );
      case 'Financial Anonymity':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#111', borderRadius: '12px', borderLeft: '4px solid #f59e0b', padding: '20px' }}>
              <h3 style={{ color: '#f59e0b', marginTop: 0, textTransform: 'uppercase' }}>Sovereign Finance</h3>
              <p style={{ color: '#ccc', lineHeight: '1.6', fontSize: '0.95em' }}>
                Traditional fiat networks (KYC/AML) map every transaction to a persistent government identity. Financial sovereignty breaks this chain through physical assets and opaque digital ledgers.
              </p>
              
              <h4 style={{ color: '#fff', marginBottom: '5px' }}>Monero (XMR) & Self-Custody</h4>
              <p style={{ color: '#aaa', lineHeight: '1.5', fontSize: '0.9em', margin: 0 }}>
                Bitcoin's ledger is completely transparent and easily traceable by chain-analysis firms. For genuine financial anonymity, utilize Monero (XMR), which enforces mandatory ring signatures, ring confidential transactions (RingCT), and stealth addresses. Manage your XMR locally via open-source self-custody tools like Cake Wallet. Never leave funds on a centralized exchange.
              </p>
              
              <h4 style={{ color: '#fff', marginBottom: '5px', marginTop: '15px' }}>Decentralized Web Ecosystems</h4>
              <p style={{ color: '#aaa', lineHeight: '1.5', fontSize: '0.9em', margin: 0 }}>
                Avoid traditional ad-tech surveillance grids by utilizing privacy-focused browsers (like Brave) that block trackers natively. This allows participation in decentralized micro-economies without compromising your identity profile or hardware fingerprint.
              </p>
            </div>
          </div>
        );
      case 'Cryptography':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#111', borderRadius: '12px', borderLeft: '4px solid #10b981', padding: '20px' }}>
              <h3 style={{ color: '#10b981', marginTop: 0, textTransform: 'uppercase' }}>Cryptography & Data Custody</h3>
              <p style={{ color: '#ccc', lineHeight: '1.6', fontSize: '0.95em' }}>
                Cryptography is the ultimate equalizer. When implemented correctly, it allows an individual to possess data that a nation-state cannot access.
              </p>
              
              <h4 style={{ color: '#fff', marginBottom: '5px' }}>Asymmetric vs Symmetric Encryption</h4>
              <p style={{ color: '#aaa', lineHeight: '1.5', fontSize: '0.9em', margin: 0 }}>
                <strong>Symmetric (AES-256):</strong> Used for local data vaults. The same key locks and unlocks the data. If the key is lost, the data is mathematically destroyed forever.<br/><br/>
                <strong>Asymmetric (PGP / ECC Curve25519):</strong> Used for communications. You distribute your Public Key to the world so they can encrypt messages to you, but only your offline Private Key can decrypt them. Guard your Private Key with your life.
              </p>
              
              <h4 style={{ color: '#fff', marginBottom: '5px', marginTop: '15px' }}>The "Delete" Illusion & Panic Wipes</h4>
              <p style={{ color: '#aaa', lineHeight: '1.5', fontSize: '0.9em', margin: 0 }}>
                Standard OS deletion does not erase data; it merely removes the filesystem pointer, leaving the actual file intact for forensic recovery. Because modern solid-state drives (SSDs) use wear-leveling algorithms, true data destruction requires active forensic wiping protocols that overwrite the storage sectors with zero-bytes.
              </p>
              
              <h4 style={{ color: '#fff', marginBottom: '5px', marginTop: '15px' }}>Key Management</h4>
              <p style={{ color: '#aaa', lineHeight: '1.5', fontSize: '0.9em', margin: 0 }}>
                Digital security relies entirely on offline physical security. Never store seed phrases or master passwords in a cloud-connected password manager. Utilize physical, fireproof analog backups (stamped steel plates or notebooks in a safe) for your root cryptographic keys.
              </p>
            </div>
          </div>
        );
      case 'Physical & Digital':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#111', borderRadius: '12px', borderLeft: '4px solid #ef4444', padding: '20px' }}>
              <h3 style={{ color: '#ef4444', marginTop: 0, textTransform: 'uppercase' }}>Physical & Digital Intersection</h3>
              <p style={{ color: '#ccc', lineHeight: '1.6', fontSize: '0.95em' }}>
                The firewall between the digital and physical world is a myth. Digital surveillance dictates physical location, and physical access destroys digital encryption.
              </p>
              
              <h4 style={{ color: '#fff', marginBottom: '5px' }}>Physical Access is Root Access</h4>
              <p style={{ color: '#aaa', lineHeight: '1.5', fontSize: '0.9em', margin: 0 }}>
                Also known as the "Evil Maid" attack. If an adversary has uninterrupted physical access to your hardware, your software encryption is void. They can clone drives, install hardware keyloggers, or inject malicious payloads via rogue USBs (Rubber Duckies) in seconds. Never leave operational hardware unattended in unsecured locations. Apply tamper-evident seals to hardware seams.
              </p>
              
              <h4 style={{ color: '#fff', marginBottom: '5px', marginTop: '15px' }}>RF Discipline & Location Evasion</h4>
              <p style={{ color: '#aaa', lineHeight: '1.5', fontSize: '0.9em', margin: 0 }}>
                Your device is a localized radio beacon. Cellular modems constantly ping towers to triangulate your exact physical coordinates, while Wi-Fi and Bluetooth radios passively log the MAC addresses of everything you walk past. "Airplane Mode" is often a software illusion that fails to cut baseband power. To truly drop off the physical grid, devices must be powered down, battery-pulled if possible, and placed inside a mathematically proven Faraday bag.
              </p>
              
              <h4 style={{ color: '#fff', marginBottom: '5px', marginTop: '15px' }}>Supply Chain Interdiction</h4>
              <p style={{ color: '#aaa', lineHeight: '1.5', fontSize: '0.9em', margin: 0 }}>
                Assume Big Tech hardware is compromised upon manufacture. Adversaries take this further by intercepting hardware shipments in transit to physically implant micro-transmitters or modified firmware directly onto motherboards. Source operational hardware anonymously, purchase with physical cash or XMR, and flash all firmware immediately upon acquisition.
              </p>
              
              <h4 style={{ color: '#fff', marginBottom: '5px', marginTop: '15px' }}>Side-Channel & Acoustic Attacks</h4>
              <p style={{ color: '#aaa', lineHeight: '1.5', fontSize: '0.9em', margin: 0 }}>
                Advanced surveillance does not need to hack your code. Hidden microphones can record the acoustic signature of your keystrokes to mathematically recreate your passwords. Thermal cameras can read the lingering heat signature left on a keypad after you enter a PIN. Always shield your inputs physically, utilize randomized touchscreen layouts if available, and never underestimate passive data collection.
              </p>
            </div>
          </div>
        );
      case 'Evasion & Camouflage':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#111', borderRadius: '12px', borderLeft: '4px solid #8b5cf6', padding: '20px' }}>
              <h3 style={{ color: '#8b5cf6', marginTop: 0, textTransform: 'uppercase' }}>Evasion & Camouflage</h3>
              <p style={{ color: '#ccc', lineHeight: '1.6', fontSize: '0.95em' }}>
                When digital perimeters fall, physical evasion is your only fail-safe. True camouflage is behavioral, not just visual.
              </p>
              
              <h4 style={{ color: '#fff', marginBottom: '5px' }}>Surveillance Detection Routes (SDR)</h4>
              <p style={{ color: '#aaa', lineHeight: '1.5', fontSize: '0.9em', margin: 0 }}>
                Never travel directly to a secure location (safehouse, cache, or meeting). Utilize an SDR. Force followers into actions that reveal their presence: make three consecutive right turns, use stairs instead of escalators, or pause at reflective glass to check your six. If followed, do not accelerate—remain calm, proceed to a crowded public area, and execute a lateral exit.
              </p>
              
              <h4 style={{ color: '#fff', marginBottom: '5px', marginTop: '15px' }}>The "Gray Man" Principle</h4>
              <p style={{ color: '#aaa', lineHeight: '1.5', fontSize: '0.9em', margin: 0 }}>
                True evasion is not hiding in the shadows; it is hiding in plain sight. Do not wear tactical gear, camouflage, or political identifiers. Dress to the exact baseline of the environment you are in. Move at the average speed of the crowd. Become immediately forgettable to witnesses and behavioral profiling algorithms.
              </p>

              <h4 style={{ color: '#fff', marginBottom: '5px', marginTop: '15px' }}>Concealment vs. FLIR Evasion</h4>
              <p style={{ color: '#aaa', lineHeight: '1.5', fontSize: '0.9em', margin: 0 }}>
                Against aerial FLIR (Forward Looking Infrared), standard visual camouflage is useless. To mask a thermal signature, you must block heat radiation. Thick concrete, standard glass (IR largely reflects off glass), or a rigged Mylar space blanket spaced <em>away</em> from your body (so heat doesn't conduct directly to the outer layer) are your primary defenses against thermal optics.
              </p>
              
              <h4 style={{ color: '#fff', marginBottom: '5px', marginTop: '15px' }}>Decoys and Misdirection</h4>
              <p style={{ color: '#aaa', lineHeight: '1.5', fontSize: '0.9em', margin: 0 }}>
                If you must burn a digital identity while physically moving, utilize a decoy. Leave a powered-on, transmitting device on a bus or train moving away from your actual escape vector. Authorities will deploy resources tracking the digital ghost while you move offline in the opposite direction.
              </p>
            </div>
          </div>
        );
      case 'Crisis & Cover':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* BALLISTICS & COVER */}
            <div style={{ background: '#111', borderRadius: '12px', borderLeft: '4px solid #f97316', padding: '20px' }}>
              <h3 style={{ color: '#f97316', marginTop: 0, textTransform: 'uppercase' }}>Ballistics & Real-World Cover</h3>
              <p style={{ color: '#ccc', lineHeight: '1.6', fontSize: '0.95em' }}>
                Hollywood conditioning is fatal. <strong>Concealment</strong> hides you from eyesight; <strong>Cover</strong> stops kinetic energy. Do not confuse the two.
              </p>
              
              <h4 style={{ color: '#fff', marginBottom: '5px' }}>The NIJ Armor Scale</h4>
              <p style={{ color: '#aaa', lineHeight: '1.5', fontSize: '0.9em', margin: 0 }}>
                <strong>Soft Armor (Level II & IIIA):</strong> Kevlar/Aramid fibers catch handgun rounds (up to .44 Mag) like a microscopic net. They WILL NOT stop rifle rounds.<br/><br/>
                <strong>Hard Armor (Level III & IV):</strong> Ceramic plates shatter high-velocity rifle bullets, absorbing the energy. Steel plates (AR500) deflect bullets but create lethal spalling (shrapnel) unless coated in heavy anti-spall layers.
              </p>
              
              <h4 style={{ color: '#fff', marginBottom: '5px', marginTop: '15px' }}>Effective Environmental Cover</h4>
              <p style={{ color: '#aaa', lineHeight: '1.5', fontSize: '0.9em', margin: 0 }}>
                <strong>Vehicles:</strong> Car doors, seats, and trunks offer zero ballistic protection. A 9mm will punch straight through both doors. The ONLY reliable cover on a civilian vehicle is the engine block or the wheel axles.<br/><br/>
                <strong>Structures:</strong> Standard residential drywall and timber framing will not stop a 5.56 NATO round. Solid brick, reinforced concrete, or 18+ inches of densely packed earth/sandbags are required to reliably trap high-velocity projectiles.
              </p>
            </div>

            {/* THE ANTI-GUIDE */}
            <div style={{ background: '#111', borderRadius: '12px', borderLeft: '4px solid #ef4444', padding: '20px' }}>
              <h3 style={{ color: '#ef4444', marginTop: 0, textTransform: 'uppercase' }}>The Crisis Anti-Guide: What NOT To Do</h3>
              <p style={{ color: '#ccc', lineHeight: '1.6', fontSize: '0.95em' }}>
                Avoid these fatal behavioral traps during a sudden kinetic event or mass panic:
              </p>
              
              <h4 style={{ color: '#fff', marginBottom: '5px' }}>1. Do Not Succumb to Normalcy Bias</h4>
              <p style={{ color: '#aaa', lineHeight: '1.5', fontSize: '0.9em', margin: 0 }}>
                The brain will try to rationalize danger as a false alarm (e.g., "Those sound like fireworks"). Do not wait for others to react. If the baseline of your environment shatters, act immediately. Hesitation kills.
              </p>
              
              <h4 style={{ color: '#fff', marginBottom: '5px', marginTop: '15px' }}>2. Do Not Follow the Herd Blindly</h4>
              <p style={{ color: '#aaa', lineHeight: '1.5', fontSize: '0.9em', margin: 0 }}>
                In a panic, crowds default to the entrance they came in through. This creates fatal bottlenecks and trampling hazards. Always locate secondary service exits, kitchen doors, or loading docks the moment you enter a building. Move laterally to the crowd.
              </p>
              
              <h4 style={{ color: '#fff', marginBottom: '5px', marginTop: '15px' }}>3. Do Not Trap Yourself in Fatal Funnels</h4>
              <p style={{ color: '#aaa', lineHeight: '1.5', fontSize: '0.9em', margin: 0 }}>
                During an active threat, do not hide in public bathrooms, closets, or dead-end hallways. If a room does not have a secondary exit or a ground-floor window you can breach, it is a fatal trap.
              </p>
              
              <h4 style={{ color: '#fff', marginBottom: '5px', marginTop: '15px' }}>4. Do Not Rely on Cellular Grids</h4>
              <p style={{ color: '#aaa', lineHeight: '1.5', fontSize: '0.9em', margin: 0 }}>
                During a mass-casualty event, localized cell towers will instantly jam due to network overload. Do not freeze because you cannot call for instructions. Execute your pre-planned offline rally points immediately.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="view-wrapper pb-safe" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', marginRight: '15px' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#3b82f6', fontSize: '1.2em', textTransform: 'uppercase', letterSpacing: '1px' }}>OpSec Encyclopedia</h2>
      </header>

      <div style={{ padding: '10px 15px', overflowX: 'auto', display: 'flex', gap: '10px', borderBottom: '1px solid #222', scrollbarWidth: 'none' }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: activeTab === tab ? 'rgba(59, 130, 246, 0.15)' : '#111',
              color: activeTab === tab ? '#3b82f6' : '#888',
              border: activeTab === tab ? '1px solid #3b82f6' : '1px solid #333',
              padding: '8px 16px',
              borderRadius: '20px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              fontSize: '0.9em',
              cursor: 'pointer'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ padding: '20px', overflowY: 'auto' }}>
        {renderTabContent()}
      </div>
    </div>
  );
}
