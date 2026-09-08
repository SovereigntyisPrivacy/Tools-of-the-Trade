import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ELECTRONICS_DB = [
  {
    id: 'core',
    title: 'Core Logic (CPU & Mobo)',
    icon: '🧠',
    color: '#3b82f6',
    sections: [
      {
        heading: 'The Motherboard (The Nervous System)',
        content: 'The motherboard is the central nervous system of the machine. It is a multi-layered fiberglass printed circuit board (PCB) filled with microscopic copper traces. Its sole purpose is to route electrical signals and power between components at near the speed of light. Without it, the components are deaf and blind.'
      },
      {
        heading: 'The CPU (The Brain)',
        content: 'The Central Processing Unit is billions of microscopic transistors etched into a silicon wafer. A transistor is simply an electronic switch—it is either ON (1) or OFF (0). The CPU rapidly flips these switches to perform mathematics.\n\nIt contains two main parts:\n1. The ALU (Arithmetic Logic Unit): Does the actual math.\n2. The Control Unit: Directs traffic, telling memory when to send data to the ALU.'
      },
      {
        heading: 'Clock Speed (The Heartbeat)',
        content: 'A CPU cannot do anything without a clock. A microscopic quartz crystal on the motherboard vibrates when electricity hits it. A 4.0 GHz processor experiences 4 billion of these vibrations (clock cycles) every single second. With every tick, the CPU flips its transistors to process a new instruction.'
      }
    ]
  },
  {
    id: 'memory',
    title: 'Memory & Storage (RAM & SSD)',
    icon: '💾',
    color: '#f59e0b',
    sections: [
      {
        heading: 'The Hierarchy of Speed',
        content: 'Why do we have different types of memory? Cost and physics. The closer memory is to the CPU, the faster it must be, but the more expensive it is to build. The CPU has its own microscopic memory (L1/L2/L3 Cache) that is lightning fast but holds almost nothing. If it needs more, it asks the RAM. If the RAM doesn\'t have it, it asks the SSD/HDD.'
      },
      {
        heading: 'RAM: Volatile Memory (The Workbench)',
        content: 'Random Access Memory (RAM) uses capacitors that hold an electrical charge to represent a 1. Because capacitors leak energy, the motherboard must constantly refresh them thousands of times a second. This is why RAM is "Volatile." The absolute second you pull the power, the electrons drain, and the data ceases to exist. It is your active workbench.'
      },
      {
        heading: 'Storage: Non-Volatile (The Filing Cabinet)',
        content: 'Solid State Drives (SSDs) use NAND flash memory. Instead of leaky capacitors, they force electrons through an insulating oxide layer into a "floating gate." Once inside, the electrons are physically trapped, even when the power is cut. This is how data survives a reboot.\n\nHard Disk Drives (HDDs) use a mechanical needle to physically flip the magnetic polarity of microscopic sectors on a spinning metal platter to North (1) or South (0).'
      }
    ]
  },
  {
    id: 'power',
    title: 'Power & Expansion (GPU/PSU)',
    icon: '⚡',
    color: '#ef4444',
    sections: [
      {
        heading: 'The Power Supply Unit (PSU)',
        content: 'The wall outlet provides Alternating Current (AC). Computer logic gates require perfectly stable Direct Current (DC). The PSU is a massive transformer that converts 120V/240V AC into highly regulated 3.3V, 5V, and 12V DC "rails." Running high-demand hardware on continuous 24/7 cycles requires calculating your total system wattage draw and ensuring your PSU (and off-grid solar inverters) can supply at least 20% more than the maximum load to prevent catastrophic voltage drops.'
      },
      {
        heading: 'The GPU (Parallel Processing)',
        content: 'A CPU has a few very powerful cores (like 8 professors) meant to solve complex math sequentially. A Graphics Processing Unit (GPU) has thousands of weaker cores (like 5,000 kindergarteners) meant to solve millions of simple math problems simultaneously. This is called parallel processing, and it is why GPUs are used for rendering pixels on a screen, mining cryptographic hashes, and training local AI neural networks.'
      },
      {
        heading: 'PCIe & Expansion Cards',
        content: 'Peripheral Component Interconnect Express (PCIe) is the high-speed highway that connects expansion cards (like GPUs, heavy-duty RAID controllers, or specialized network cards) directly to the CPU. PCIe slots have different "lanes" (x1, x4, x8, x16). A graphics card requires an x16 slot to ensure the massive amount of visual data isn\'t bottlenecked.'
      }
    ]
  },
  {
    id: 'io',
    title: 'I/O & Bridging',
    icon: '🔌',
    color: '#10b981',
    sections: [
      {
        heading: 'The Southbridge (PCH)',
        content: 'The CPU is too busy and too fast to talk directly to your slow USB keyboard or hard drive. It delegates this to a secondary chip on the motherboard known as the Platform Controller Hub (PCH) or Southbridge. The PCH manages all the slow traffic (USB, SATA, Audio) and bundles it up before sending it to the CPU.'
      },
      {
        heading: 'Network Interface Controllers (NIC)',
        content: 'The NIC is the hardware bridge between the motherboard and the outside world. Every NIC is manufactured with a burned-in, globally unique 48-bit identifier called a MAC address (Media Access Control). If you connect to a physical network, that router logs your hardware\'s MAC address. Sovereign nodes often spoof this address at the OS level to prevent physical hardware tracking.'
      },
      {
        heading: 'USB (Universal Serial Bus)',
        content: 'Before USB, every device (mouse, printer, keyboard) had a proprietary port. USB standardized this by providing four basic pins: 5V Power, Ground, Data+, and Data-. It allows the machine to enumerate (identify) a device immediately upon plug-in by reading its internal hardware descriptor.'
      }
    ]
  },
  {
    id: 'diagnostics',
    title: 'Bare-Metal Diagnostics',
    icon: '🛠️',
    color: '#8b5cf6',
    sections: [
      {
        heading: 'The POST Sequence',
        content: 'When you press the power button, the CPU is blind. It immediately reads a tiny flash chip on the motherboard containing the BIOS/UEFI. This runs the Power-On Self-Test (POST). It physically interrogates the RAM, CPU, and GPU. If a component fails to respond, the motherboard will halt and emit an error code via a sequence of beeps or diagnostic LEDs.'
      },
      {
        heading: 'Hardware Maintenance & Reseating',
        content: '90% of hardware failures are physical seating issues or dust bridging a connection. When disassembling and cleaning an internal desktop setup, you must manually release the PCIe retention clip before pulling a graphics card or expansion card. Use 99% isopropyl alcohol and a soft brush to clean the gold contact pins. Never use a standard vacuum on a PCB; the static discharge will instantly kill the silicon logic gates.'
      },
      {
        heading: 'Thermal Management & Throttling',
        content: 'Silicon logic gates generate immense heat. If the CPU or GPU exceeds 95°C, it will "thermal throttle"—artificially slowing down its clock speed to prevent melting its own traces. Proper thermal paste application is required to fill microscopic air gaps between the silicon die and the metal heatsink. If a machine is hard-crashing under heavy load, it is almost always a thermal failure or a failing PSU rail.'
      },
      {
        heading: 'Clearing the CMOS',
        content: 'If you corrupt the low-level BIOS settings (e.g., an unstable RAM overclock or a forgotten BIOS password), you can nuke the volatile BIOS memory by unplugging the machine and removing the silver CR2032 watch battery on the motherboard for 60 seconds. This cuts power to the CMOS chip, wiping the settings back to factory defaults.'
      }
    ]
  }
];

export default function ElectronicsDatabase() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(ELECTRONICS_DB[0].id);

  const activeSection = ELECTRONICS_DB.find(db => db.id === activeTab);

  return (
    <div className="view-wrapper pb-safe" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', marginRight: '15px' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#3b82f6', fontSize: '1.2em', textTransform: 'uppercase', letterSpacing: '1px' }}>Electronics & Hardware</h2>
      </header>

      <div style={{ padding: '10px 15px', overflowX: 'auto', display: 'flex', gap: '10px', borderBottom: '1px solid #222', scrollbarWidth: 'none' }}>
        {ELECTRONICS_DB.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? `rgba(${hexToRgb(tab.color)}, 0.15)` : '#111',
              color: activeTab === tab.id ? tab.color : '#888',
              border: activeTab === tab.id ? `1px solid ${tab.color}` : '1px solid #333',
              padding: '8px 16px',
              borderRadius: '20px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              fontSize: '0.9em',
              cursor: 'pointer'
            }}
          >
            {tab.title}
          </button>
        ))}
      </div>

      <div style={{ padding: '20px', overflowY: 'auto' }}>
        {activeSection && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
              <span style={{ fontSize: '2.5rem', background: '#111', padding: '10px', borderRadius: '50%', border: `1px solid ${activeSection.color}` }}>{activeSection.icon}</span>
              <div>
                <h2 style={{ margin: '0 0 5px 0', color: '#fff', fontSize: '1.3em', textTransform: 'uppercase' }}>{activeSection.title}</h2>
              </div>
            </div>

            {activeSection.sections.map((sec, idx) => (
              <div key={idx} style={{ background: '#111', borderRadius: '8px', padding: '15px', borderLeft: `4px solid ${activeSection.color}` }}>
                <h4 style={{ color: activeSection.color, marginTop: 0, textTransform: 'uppercase', marginBottom: '8px' }}>{sec.heading}</h4>
                <p style={{ color: '#ccc', margin: 0, lineHeight: '1.6', fontSize: '0.95em', whiteSpace: 'pre-line' }}>{sec.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255, 255, 255';
}
