import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CivicsRights() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Amendments');

  // --- FULL UDHR ARRAY ---
  const udhrArticles = [
    { id: 1, text: "All human beings are born free and equal in dignity and rights. They are endowed with reason and conscience and should act towards one another in a spirit of brotherhood." },
    { id: 2, text: "Everyone is entitled to all the rights and freedoms set forth in this Declaration, without distinction of any kind, such as race, colour, sex, language, religion, political or other opinion, national or social origin, property, birth or other status." },
    { id: 3, text: "Everyone has the right to life, liberty and security of person." },
    { id: 4, text: "No one shall be held in slavery or servitude; slavery and the slave trade shall be prohibited in all their forms." },
    { id: 5, text: "No one shall be subjected to torture or to cruel, inhuman or degrading treatment or punishment." },
    { id: 6, text: "Everyone has the right to recognition everywhere as a person before the law." },
    { id: 7, text: "All are equal before the law and are entitled without any discrimination to equal protection of the law. All are entitled to equal protection against any discrimination in violation of this Declaration and against any incitement to such discrimination." },
    { id: 8, text: "Everyone has the right to an effective remedy by the competent national tribunals for acts violating the fundamental rights granted him by the constitution or by law." },
    { id: 9, text: "No one shall be subjected to arbitrary arrest, detention or exile." },
    { id: 10, text: "Everyone is entitled in full equality to a fair and public hearing by an independent and impartial tribunal, in the determination of his rights and obligations and of any criminal charge against him." },
    { id: 11, text: "(1) Everyone charged with a penal offence has the right to be presumed innocent until proved guilty according to law in a public trial at which he has had all the guarantees necessary for his defence. (2) No one shall be held guilty of any penal offence on account of any act or omission which did not constitute a penal offence, under national or international law, at the time when it was committed." },
    { id: 12, text: "No one shall be subjected to arbitrary interference with his privacy, family, home or correspondence, nor to attacks upon his honour and reputation. Everyone has the right to the protection of the law against such interference or attacks." },
    { id: 13, text: "(1) Everyone has the right to freedom of movement and residence within the borders of each state. (2) Everyone has the right to leave any country, including his own, and to return to his country." },
    { id: 14, text: "(1) Everyone has the right to seek and to enjoy in other countries asylum from persecution. (2) This right may not be invoked in the case of prosecutions genuinely arising from non-political crimes or from acts contrary to the purposes and principles of the United Nations." },
    { id: 15, text: "(1) Everyone has the right to a nationality. (2) No one shall be arbitrarily deprived of his nationality nor denied the right to change his nationality." },
    { id: 16, text: "(1) Men and women of full age, without any limitation due to race, nationality or religion, have the right to marry and to found a family. (2) Marriage shall be entered into only with the free and full consent of the intending spouses. (3) The family is the natural and fundamental group unit of society and is entitled to protection by society and the State." },
    { id: 17, text: "(1) Everyone has the right to own property alone as well as in association with others. (2) No one shall be arbitrarily deprived of his property." },
    { id: 18, text: "Everyone has the right to freedom of thought, conscience and religion; this right includes freedom to change his religion or belief, and freedom, either alone or in community with others and in public or private, to manifest his religion or belief in teaching, practice, worship and observance." },
    { id: 19, text: "Everyone has the right to freedom of opinion and expression; this right includes freedom to hold opinions without interference and to seek, receive and impart information and ideas through any media and regardless of frontiers." },
    { id: 20, text: "(1) Everyone has the right to freedom of peaceful assembly and association. (2) No one may be compelled to belong to an association." },
    { id: 21, text: "(1) Everyone has the right to take part in the government of his country, directly or through freely chosen representatives. (2) Everyone has the right of equal access to public service in his country. (3) The will of the people shall be the basis of the authority of government." },
    { id: 22, text: "Everyone, as a member of society, has the right to social security and is entitled to realization, through national effort and international co-operation and in accordance with the organization and resources of each State, of the economic, social and cultural rights indispensable for his dignity and the free development of his personality." },
    { id: 23, text: "(1) Everyone has the right to work, to free choice of employment, to just and favourable conditions of work and to protection against unemployment. (2) Everyone, without any discrimination, has the right to equal pay for equal work. (3) Everyone who works has the right to just and favourable remuneration. (4) Everyone has the right to form and to join trade unions for the protection of his interests." },
    { id: 24, text: "Everyone has the right to rest and leisure, including reasonable limitation of working hours and periodic holidays with pay." },
    { id: 25, text: "(1) Everyone has the right to a standard of living adequate for the health and well-being of himself and of his family, including food, clothing, housing and medical care and necessary social services. (2) Motherhood and childhood are entitled to special care and assistance." },
    { id: 26, text: "(1) Everyone has the right to education. Education shall be free, at least in the elementary and fundamental stages. Elementary education shall be compulsory. (2) Education shall be directed to the full development of the human personality and to the strengthening of respect for human rights and fundamental freedoms." },
    { id: 27, text: "(1) Everyone has the right freely to participate in the cultural life of the community, to enjoy the arts and to share in scientific advancement and its benefits." },
    { id: 28, text: "Everyone is entitled to a social and international order in which the rights and freedoms set forth in this Declaration can be fully realized." },
    { id: 29, text: "(1) Everyone has duties to the community in which alone the free and full development of his personality is possible. (2) In the exercise of his rights and freedoms, everyone shall be subject only to such limitations as are determined by law solely for the purpose of securing due recognition and respect for the rights and freedoms of others." },
    { id: 30, text: "Nothing in this Declaration may be interpreted as implying for any State, group or person any right to engage in any activity or to perform any act aimed at the destruction of any of the rights and freedoms set forth herein." }
  ];

  
const ENCOUNTERS_GUIDE = [
  {
    title: "The 5th Amendment & Digital Passcodes",
    content: "Under current legal interpretations, the 5th Amendment protects the contents of your mind. Therefore, law enforcement generally CANNOT force you to surrender a memorized alphanumeric passcode. However, your physical traits are not protected. They CAN legally compel you to unlock a device using FaceID, TouchID, or iris scanners. In high-risk environments, temporarily disable biometric unlocking."
  },
  {
    title: "The Encounter Script (Read Aloud)",
    content: "If detained, you do not have to guess what to say. Memorize or read the following: 'I do not consent to any searches of my person, my property, my vehicle, or my digital devices. I invoke my 5th Amendment right to remain silent. I will not answer any questions without my attorney present. Am I being detained, or am I free to go?'"
  },
  {
    title: "Border Searches (Exceptions)",
    content: "Be aware that standard 4th Amendment protections against unreasonable search and seizure are heavily diluted at international borders and ports of entry. Customs and Border Protection (CBP) claims broad authority to perform 'basic' searches of electronic devices without a warrant. Keep highly sensitive data entirely off-device or forensically wiped when crossing borders."
  }
];

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
        {['Amendments', 'Constitution', 'Human Rights', 'Encounters', 'Guide'].map(tab => {
          let activeColor = '#fff';
          if (tab === 'Amendments') activeColor = '#ef4444';
          if (tab === 'Constitution') activeColor = '#3b82f6';
          if (tab === 'Human Rights') activeColor = '#00cc66';
      if (tab === 'Encounters') activeColor = '#a855f7';
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {udhrArticles.map(item => (
              <div key={item.id} style={{ ...cardStyle, borderLeft: '4px solid #00cc66', marginBottom: 0 }}>
                <h3 style={{ ...titleStyle, color: '#00cc66' }}>Article {item.id}</h3>
                <p style={textStyle}>{item.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 4: GUIDE & ETHOS                       */}
        {/* ========================================== */}
        
        {/* TAB: ENCOUNTERS */}
        {activeTab === 'Encounters' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px', borderLeft: '4px solid #a855f7' }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '1.1em', fontWeight: 'bold', color: '#a855f7', textAlign: 'center', textTransform: 'uppercase' }}>Digital & Civil Encounters</h3>
              {ENCOUNTERS_GUIDE.map((enc, idx) => (
                <div key={idx} style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: idx !== ENCOUNTERS_GUIDE.length - 1 ? '1px dashed #333' : 'none' }}>
                  <h4 style={{ color: '#fff', fontSize: '1.05em', marginBottom: '8px', marginTop: '0' }}>{enc.title}</h4>
                  <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5', margin: 0 }}>{enc.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
  
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
