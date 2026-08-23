import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CivicsRights() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Amendments');

  // --- STYLES ---
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };
  const titleStyle = { margin: '0 0 8px 0', fontSize: '1.1em', fontWeight: 'bold' };
  const textStyle = { color: '#aaa', fontSize: '0.9em', margin: 0, lineHeight: '1.5' };

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222' }}>
        <button className="back-btn" onClick={() => navigate('/')}>← Hub</button>
        <h2>Civics & Rights</h2>
      </header>

      {/* TOP TABS */}
      <div style={{ display: 'flex', background: '#111', padding: '10px', borderBottom: '1px solid #333', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {['Amendments', 'Constitution', 'Human Rights', 'Guide'].map(tab => {
          let activeColor = '#fff';
          if (tab === 'Amendments') activeColor = '#ef4444';
          if (tab === 'Constitution') activeColor = '#3b82f6';
          if (tab === 'Human Rights') activeColor = '#00cc66';
          if (tab === 'Guide') activeColor = '#f59e0b';

          return (
            <button 
              key={tab} onClick={() => setActiveTab(tab)}
              style={{ flex: 1, padding: '8px 10px', borderRadius: '8px', fontWeight: 'bold', border: 'none', whiteSpace: 'nowrap', background: activeTab === tab ? activeColor : '#222', color: activeTab === tab ? '#000' : '#aaa' }}>
              {tab}
            </button>
          )
        })}
      </div>

      <div className="calc-content" style={{ padding: '15px', overflowY: 'auto', flex: 1, paddingBottom: '95px' }}>
        
        {/* ========================================== */}
        {/* TAB 1: THE AMENDMENTS (Bill of Rights)     */}
        {/* ========================================== */}
        {activeTab === 'Amendments' && (
          <>
            <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
              <h3 style={{ ...titleStyle, color: '#ef4444' }}>I. First Amendment</h3>
              <p style={textStyle}>Congress shall make no law respecting an establishment of religion, or prohibiting the free exercise thereof; or abridging the freedom of speech, or of the press; or the right of the people peaceably to assemble, and to petition the Government for a redress of grievances.</p>
            </div>
            <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
              <h3 style={{ ...titleStyle, color: '#ef4444' }}>II. Second Amendment</h3>
              <p style={textStyle}>A well regulated Militia, being necessary to the security of a free State, the right of the people to keep and bear Arms, shall not be infringed.</p>
            </div>
            <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
              <h3 style={{ ...titleStyle, color: '#ef4444' }}>III. Third Amendment</h3>
              <p style={textStyle}>No Soldier shall, in time of peace be quartered in any house, without the consent of the Owner, nor in time of war, but in a manner to be prescribed by law.</p>
            </div>
            <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
              <h3 style={{ ...titleStyle, color: '#ef4444' }}>IV. Fourth Amendment</h3>
              <p style={textStyle}>The right of the people to be secure in their persons, houses, papers, and effects, against unreasonable searches and seizures, shall not be violated, and no Warrants shall issue, but upon probable cause, supported by Oath or affirmation, and particularly describing the place to be searched, and the persons or things to be seized.</p>
            </div>
            <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
              <h3 style={{ ...titleStyle, color: '#ef4444' }}>V. Fifth Amendment</h3>
              <p style={textStyle}>No person shall be held to answer for a capital, or otherwise infamous crime, unless on a presentment or indictment of a Grand Jury... nor shall be compelled in any criminal case to be a witness against himself, nor be deprived of life, liberty, or property, without due process of law; nor shall private property be taken for public use, without just compensation.</p>
            </div>
            <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
              <h3 style={{ ...titleStyle, color: '#ef4444' }}>VI. Sixth Amendment</h3>
              <p style={textStyle}>In all criminal prosecutions, the accused shall enjoy the right to a speedy and public trial, by an impartial jury of the State and district wherein the crime shall have been committed... and to be informed of the nature and cause of the accusation; to be confronted with the witnesses against him; to have compulsory process for obtaining witnesses in his favor, and to have the Assistance of Counsel for his defence.</p>
            </div>
            <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
              <h3 style={{ ...titleStyle, color: '#ef4444' }}>VII. Seventh Amendment</h3>
              <p style={textStyle}>In Suits at common law, where the value in controversy shall exceed twenty dollars, the right of trial by jury shall be preserved, and no fact tried by a jury, shall be otherwise re-examined in any Court of the United States, than according to the rules of the common law.</p>
            </div>
            <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
              <h3 style={{ ...titleStyle, color: '#ef4444' }}>VIII. Eighth Amendment</h3>
              <p style={textStyle}>Excessive bail shall not be required, nor excessive fines imposed, nor cruel and unusual punishments inflicted.</p>
            </div>
            <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
              <h3 style={{ ...titleStyle, color: '#ef4444' }}>IX. Ninth Amendment</h3>
              <p style={textStyle}>The enumeration in the Constitution, of certain rights, shall not be construed to deny or disparage others retained by the people.</p>
            </div>
            <div style={{ ...cardStyle, borderLeft: '4px solid #ef4444' }}>
              <h3 style={{ ...titleStyle, color: '#ef4444' }}>X. Tenth Amendment</h3>
              <p style={textStyle}>The powers not delegated to the United States by the Constitution, nor prohibited by it to the States, are reserved to the States respectively, or to the people.</p>
            </div>
          </>
        )}

        {/* ========================================== */}
        {/* TAB 2: THE CONSTITUTION                    */}
        {/* ========================================== */}
        {activeTab === 'Constitution' && (
          <>
            <div style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
              <h3 style={{ ...titleStyle, color: '#3b82f6' }}>The Preamble</h3>
              <p style={textStyle}>We the People of the United States, in Order to form a more perfect Union, establish Justice, insure domestic Tranquility, provide for the common defence, promote the general Welfare, and secure the Blessings of Liberty to ourselves and our Posterity, do ordain and establish this Constitution for the United States of America.</p>
            </div>
            <div style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
              <h3 style={{ ...titleStyle, color: '#3b82f6' }}>Article I: The Legislative Branch</h3>
              <p style={textStyle}>Establishes the Senate and the House of Representatives. Grants Congress the power to make laws, declare war, coin money, and regulate interstate and foreign commerce.</p>
            </div>
            <div style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
              <h3 style={{ ...titleStyle, color: '#3b82f6' }}>Article II: The Executive Branch</h3>
              <p style={textStyle}>Establishes the offices of the President and Vice President. Defines the President as the Commander in Chief of the armed forces and grants the power to enforce federal laws and make treaties.</p>
            </div>
            <div style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
              <h3 style={{ ...titleStyle, color: '#3b82f6' }}>Article III: The Judicial Branch</h3>
              <p style={textStyle}>Establishes the Supreme Court and grants Congress the power to create lower federal courts. Defines the scope of federal judicial power and guarantees the right to a trial by jury in criminal cases.</p>
            </div>
            <div style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
              <h3 style={{ ...titleStyle, color: '#3b82f6' }}>Article IV: The States</h3>
              <p style={textStyle}>Defines the relationship between the states and the federal government. Requires states to give "Full Faith and Credit" to the public acts, records, and judicial proceedings of other states.</p>
            </div>
            <div style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
              <h3 style={{ ...titleStyle, color: '#3b82f6' }}>Article V: The Amendment Process</h3>
              <p style={textStyle}>Outlines the process for amending the Constitution, requiring a two-thirds majority in both the House and the Senate, or by a constitutional convention called for by two-thirds of the State legislatures.</p>
            </div>
            <div style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
              <h3 style={{ ...titleStyle, color: '#3b82f6' }}>Article VI: The Supremacy Clause</h3>
              <p style={textStyle}>Establishes that the Constitution, federal laws made pursuant to it, and treaties made under its authority, constitute the "supreme Law of the Land." Requires all legislators, officers, and judges to take an oath to support the Constitution.</p>
            </div>
          </>
        )}

        {/* ========================================== */}
        {/* TAB 3: HUMAN RIGHTS (UDHR)                 */}
        {/* ========================================== */}
        {activeTab === 'Human Rights' && (
          <>
            <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66' }}>
              <h3 style={{ ...titleStyle, color: '#00cc66' }}>Article 1</h3>
              <p style={textStyle}>All human beings are born free and equal in dignity and rights. They are endowed with reason and conscience and should act towards one another in a spirit of brotherhood.</p>
            </div>
            <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66' }}>
              <h3 style={{ ...titleStyle, color: '#00cc66' }}>Article 3</h3>
              <p style={textStyle}>Everyone has the right to life, liberty and security of person.</p>
            </div>
            <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66' }}>
              <h3 style={{ ...titleStyle, color: '#00cc66' }}>Article 4</h3>
              <p style={textStyle}>No one shall be held in slavery or servitude; slavery and the slave trade shall be prohibited in all their forms.</p>
            </div>
            <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66' }}>
              <h3 style={{ ...titleStyle, color: '#00cc66' }}>Article 5</h3>
              <p style={textStyle}>No one shall be subjected to torture or to cruel, inhuman or degrading treatment or punishment.</p>
            </div>
            <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66' }}>
              <h3 style={{ ...titleStyle, color: '#00cc66' }}>Article 9</h3>
              <p style={textStyle}>No one shall be subjected to arbitrary arrest, detention or exile.</p>
            </div>
            <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66' }}>
              <h3 style={{ ...titleStyle, color: '#00cc66' }}>Article 11</h3>
              <p style={textStyle}>Everyone charged with a penal offence has the right to be presumed innocent until proved guilty according to law in a public trial at which he has had all the guarantees necessary for his defence.</p>
            </div>
            <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66' }}>
              <h3 style={{ ...titleStyle, color: '#00cc66' }}>Article 12</h3>
              <p style={textStyle}>No one shall be subjected to arbitrary interference with his privacy, family, home or correspondence, nor to attacks upon his honour and reputation. Everyone has the right to the protection of the law against such interference or attacks.</p>
            </div>
            <div style={{ ...cardStyle, borderLeft: '4px solid #00cc66' }}>
              <h3 style={{ ...titleStyle, color: '#00cc66' }}>Article 19</h3>
              <p style={textStyle}>Everyone has the right to freedom of opinion and expression; this right includes freedom to hold opinions without interference and to seek, receive and impart information and ideas through any media and regardless of frontiers.</p>
            </div>
          </>
        )}

        {/* ========================================== */}
        {/* TAB 4: GUIDE & ETHOS                       */}
        {/* ========================================== */}
        {activeTab === 'Guide' && (
          <>
            <div style={{ ...cardStyle, textAlign: 'center', padding: '30px 15px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <h2 style={{ color: '#f59e0b', fontSize: '1.8em', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '2px' }}>
                Sovereignty is Privacy.
              </h2>
              <h3 style={{ color: '#fff', fontSize: '1.2em', margin: '0 0 20px 0', fontWeight: 'normal' }}>
                Take back your freedom.
              </h3>
              <div style={{ width: '50px', height: '2px', background: '#f59e0b', margin: '0 auto 20px auto' }}></div>
              <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>
                This application is designed to function entirely offline, keeping your data local, your communications silent, and your knowledge absolute. No telemetry. No tracking. No compromises.
              </p>
            </div>

            <div style={{ ...cardStyle, borderLeft: '4px solid #333' }}>
              <h3 style={{ ...titleStyle, color: '#888' }}>Legal Disclaimer</h3>
              <p style={{ color: '#666', fontSize: '0.8em', margin: 0, lineHeight: '1.5' }}>
                The constitutional, civil, and human rights texts provided in this module are public domain documents compiled for educational and rapid-reference purposes. This information does not constitute formal legal advice. Laws and interpretations vary by jurisdiction.
              </p>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
