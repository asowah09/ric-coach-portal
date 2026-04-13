const { useState } = React;

// ── Brand ──────────────────────────────────────────────────────────────────
const B = {
  sky:"#89CFF0", yellow:"#FFD93D", gold:"#FFB703",
  deep:"#1E3A8A", white:"#FFFFFF",
};
// ── Google Sheet API ─────────────────────────────────────────────────────────
// After deploying your Apps Script, paste the Web App URL here:
const SHEET_API_URL = "YOUR_APPS_SCRIPT_URL_HERE";
// Example: "https://script.google.com/macros/s/AKfy.../exec"

async function fetchSheetAPI(params) {
  if (!SHEET_API_URL || SHEET_API_URL === "YOUR_APPS_SCRIPT_URL_HERE") return null;
  try {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${SHEET_API_URL}?${qs}`);
    const data = await res.json();
    if (data.error) { console.warn("Sheet API error:", data.error); return null; }
    return data;
  } catch(e) { console.warn("Sheet API fetch failed:", e); return null; }
}

const LOGO_B64 = "data:image/png;base64,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";

// ── Coach Accounts ─────────────────────────────────────────────────────────
const COACHES = [
  { name:"Alicia Williams",   password:"RIC2025!",   role:"Lead Coach & Founder" },
  { name:"Coach Jordan",      password:"Jordan25!",  role:"EF & Tutoring Coach" },
  { name:"Coach Maya",        password:"Maya25!",    role:"Educational Therapist" },
  { name:"Coach Devon",       password:"Devon25!",   role:"Test Prep Specialist" },
];

// ── Shared Constants ───────────────────────────────────────────────────────
const SUBJECTS = [
  "Mathematics","Algebra","Geometry","Pre-Calculus / Trigonometry","Calculus","Statistics",
  "Reading / ELA","Writing / Composition","Science – General","Biology","Chemistry",
  "Physics","Earth Science","History / Social Studies","World History","U.S. History",
  "Government / Civics","Geography","Foreign Language","Spanish","French","Mandarin",
  "Computer Science","Art / Creative Arts","Music","Study Skills / Organization",
  "Test Prep – ISEE","Test Prep – SAT","Test Prep – ACT","Multiple Subjects","Other",
];
const MOOD = ["😔 Struggling","😐 Neutral","🙂 Okay","😊 Good","🌟 Thriving"];
const EF_SKILLS = [
  "Task Initiation","Planning & Organization","Time Management","Working Memory",
  "Cognitive Flexibility","Inhibitory Control","Emotional Regulation",
  "Sustained Attention","Goal-Directed Persistence","Metacognition",
];
const EFFORT = ["1 – Minimal","2 – Low","3 – Moderate","4 – High","5 – Exceptional"];
const ENGAGEMENT = [
  {v:"1",l:"1 – Disengaged",   d:"Off-task or avoidant most of session",          c:"#EF4444"},
  {v:"2",l:"2 – Minimal",      d:"Required frequent redirection",                  c:"#F97316"},
  {v:"3",l:"3 – Moderate",     d:"Participated when prompted; some focus",         c:"#EAB308"},
  {v:"4",l:"4 – Mostly",       d:"Active with minimal redirection",                c:"#22C55E"},
  {v:"5",l:"5 – Full",         d:"Intrinsically motivated, self-directed",         c:"#10B981"},
];
const AUTONOMY = [
  {v:"emerging",    l:"🌱 Emerging",    d:"Needs full guidance; cannot break tasks down alone", c:"#94A3B8"},
  {v:"developing",  l:"🌿 Developing",  d:"Understands with significant prompting",              c:"#60A5FA"},
  {v:"approaching", l:"🌳 Approaching", d:"Can identify task demands with light cues",           c:"#34D399"},
  {v:"independent", l:"⭐ Independent", d:"Self-directs; initiates without prompting",           c:"#FFB703"},
];
const TEST_TYPES = ["ISEE – Lower Level","ISEE – Middle Level","ISEE – Upper Level","SAT","ACT","PSAT","AP Exam","State Assessment","Other"];
const ISEE_SECTIONS = ["Verbal Reasoning","Quantitative Reasoning","Reading Comprehension","Mathematics Achievement","Essay"];
const SAT_SECTIONS  = ["Reading & Writing","Math (No Calc)","Math (Calc)","Essay (if applicable)"];
const SKILL_LEVELS  = ["1 – Far Below","2 – Below","3 – Approaching","4 – At Level","5 – Above"];

const FORM_TYPES = [
  { id:"ef",    label:"Executive Function",  icon:"🧠", color:"#1E3A8A", desc:"EF coaching, strategy building, self-regulation" },
  { id:"tutor", label:"Tutoring",            icon:"📚", color:"#0891B2", desc:"Subject-specific instruction and skill building" },
  { id:"ethx",  label:"Educational Therapy", icon:"🌱", color:"#059669", desc:"Multisensory learning, learning profile, accommodations" },
  { id:"prep",  label:"Test Prep",           icon:"📝",  color:"#7C3AED", desc:"ISEE, SAT, ACT — section scores and drill focus" },
];


// ── Session Mode ─────────────────────────────────────────────────────────────
const SESSION_MODES = ["In-Person","Online","Hybrid"];

// ── VAKT + CRA Strategies ────────────────────────────────────────────────────
const VAKT_STRATEGIES = [
  {id:"V_color",    label:"Color-coding",            modality:"Visual"},
  {id:"V_diagram",  label:"Diagrams / Graphic organizers", modality:"Visual"},
  {id:"V_anchor",   label:"Anchor charts / Posters", modality:"Visual"},
  {id:"V_video",    label:"Video / Animation",       modality:"Visual"},
  {id:"A_readaloud",label:"Read-aloud",               modality:"Auditory"},
  {id:"A_verbal",   label:"Verbal rehearsal / Say it aloud", modality:"Auditory"},
  {id:"A_rhythm",   label:"Rhythm / Chanting",        modality:"Auditory"},
  {id:"A_audio",    label:"Audiobook / Recording",    modality:"Auditory"},
  {id:"K_manip",   label:"Manipulatives / Tiles",    modality:"Kinesthetic"},
  {id:"K_write",   label:"Whiteboard / Writing it out", modality:"Kinesthetic"},
  {id:"K_move",    label:"Movement / Walk & talk",   modality:"Kinesthetic"},
  {id:"K_build",   label:"Build / Create it",        modality:"Kinesthetic"},
  {id:"T_trace",   label:"Tracing / Finger writing", modality:"Tactile"},
  {id:"T_sand",    label:"Sand / Texture tray",      modality:"Tactile"},
  {id:"T_3d",      label:"3D models / Textured materials", modality:"Tactile"},
  {id:"CRA_C",     label:"Concrete (hands-on objects)", modality:"CRA"},
  {id:"CRA_R",     label:"Representational (pictures/drawings)", modality:"CRA"},
  {id:"CRA_A",     label:"Abstract (symbols/notation)", modality:"CRA"},
];
const MODALITY_COLORS = {
  Visual:"#7C3AED", Auditory:"#0891B2", Kinesthetic:"#059669", Tactile:"#D97706", CRA:"#1E3A8A"
};
const EFFECTIVENESS = [
  {v:"1", l:"Didn't connect", c:"#EF4444"},
  {v:"2", l:"Somewhat helpful", c:"#EAB308"},
  {v:"3", l:"Worked well", c:"#22C55E"},
];

// ── Shared UI ──────────────────────────────────────────────────────────────
const IS = {width:"100%",padding:"9px 13px",borderRadius:8,border:"1.5px solid #CBD5E1",fontFamily:"'Inter',sans-serif",fontSize:14,color:B.deep,background:"#F8FAFF",outline:"none",boxSizing:"border-box",transition:"border-color 0.2s"};
const TS = {...IS,resize:"vertical",minHeight:78};
const SS = {...IS,cursor:"pointer"};

const Sec = ({title,color,children}) => (
  <div style={{background:B.white,borderRadius:16,border:`2px solid ${color||B.sky}`,padding:"22px 26px",marginBottom:20,boxShadow:`0 4px 18px ${color||B.sky}12`}}>
    <div style={{fontFamily:"'Lexend',sans-serif",fontSize:12,fontWeight:700,color:color||B.deep,letterSpacing:"0.09em",textTransform:"uppercase",marginBottom:15,paddingBottom:8,borderBottom:`2px solid ${color||B.sky}25`}}>{title}</div>
    {children}
  </div>
);
const Fld = ({label,hint,req,children}) => (
  <div style={{marginBottom:15}}>
    <label style={{display:"block",fontFamily:"'Inter',sans-serif",fontSize:13,fontWeight:600,color:B.deep,marginBottom:3}}>
      {label}{req&&<span style={{color:B.gold}}> *</span>}
    </label>
    {hint&&<div style={{fontSize:11,color:"#6B7280",marginBottom:4,fontFamily:"'Inter',sans-serif",lineHeight:1.4}}>{hint}</div>}
    {children}
  </div>
);
const Grid = ({cols=2,children}) => <div style={{display:"grid",gridTemplateColumns:`repeat(${cols},1fr)`,gap:14}}>{children}</div>;
const Chips = ({options,value,onChange,multi=false}) => (
  <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:4}}>
    {options.map(o => {
      const on = multi ? value.includes(o) : value===o;
      return <span key={o} onClick={()=>{
        if(multi) onChange(on?value.filter(x=>x!==o):[...value,o]);
        else onChange(on?"":o);
      }} style={{display:"inline-block",padding:"5px 12px",borderRadius:20,fontSize:12,fontFamily:"'Inter',sans-serif",cursor:"pointer",border:`1.5px solid ${on?"#1E3A8A":"#CBD5E1"}`,background:on?"#1E3A8A":"#F8FAFF",color:on?"white":"#1E3A8A",margin:3,transition:"all 0.16s",fontWeight:500}}>{o}</span>;
    })}
  </div>
);
const RatingCards = ({options,value,onChange}) => (
  <div style={{display:"flex",flexDirection:"column",gap:6}}>
    {options.map(o=>{
      const on=value===o.v;
      return <div key={o.v} onClick={()=>onChange(on?"":o.v)} style={{display:"flex",alignItems:"center",gap:11,padding:"8px 12px",borderRadius:9,cursor:"pointer",border:`2px solid ${on?o.c:"#E2E8F0"}`,background:on?o.c+"15":"#F8FAFF",transition:"all 0.15s"}}>
        <div style={{width:18,height:18,borderRadius:"50%",flexShrink:0,background:on?o.c:"#E2E8F0",border:`2px solid ${on?o.c:"#CBD5E1"}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
          {on&&<div style={{width:6,height:6,borderRadius:"50%",background:"white"}}/>}
        </div>
        <div>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:12,fontWeight:700,color:on?o.c:B.deep}}>{o.l}</div>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:"#64748B"}}>{o.d}</div>
        </div>
      </div>;
    })}
  </div>
);
const Spinner = ({emoji,title,sub}) => (
  <div style={{textAlign:"center",padding:"70px 0"}}>
    <div style={{fontSize:48,marginBottom:14}} className="pulse">{emoji}</div>
    <div style={{fontFamily:"'Lexend',sans-serif",fontSize:20,color:B.deep}}>{title}</div>
    <div style={{fontFamily:"'Inter',sans-serif",color:"#64748B",marginTop:8,fontSize:14}}>{sub}</div>
  </div>
);
const EmptyTab = ({emoji,title,sub,onClick}) => (
  <div style={{textAlign:"center",padding:"60px 24px"}}>
    <div style={{fontSize:48,marginBottom:14}}>{emoji}</div>
    <div style={{fontFamily:"'Lexend',sans-serif",fontSize:19,color:B.deep,marginBottom:10}}>{title}</div>
    <div style={{fontFamily:"'Inter',sans-serif",fontSize:14,color:"#64748B",maxWidth:360,margin:"0 auto 20px",lineHeight:1.6}}>{sub}</div>
    <button onClick={onClick} style={{padding:"10px 24px",borderRadius:11,border:"none",background:B.deep,color:"white",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>← Back to Form</button>
  </div>
);

async function callClaude(prompt,max=1400) {
  const r = await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:max,messages:[{role:"user",content:prompt}]}),
  });
  const d = await r.json();
  return d.content?.map(b=>b.text||"").join("")||"Unable to generate.";
}

// ── PDF Print ──────────────────────────────────────────────────────────────
function openPDF(studentName,date,coachName,subject,summary,checklist,formType) {
  const checkRows = checklist.map(item=>`
    <div class="ci"><div class="box"></div><div class="clabel">${item}</div></div>`).join("");
  const planRows = summary.split("\n").map(line=>{
    if(line.startsWith("## ")) return `<h2>${line.replace("## ","")}</h2>`;
    if(line.match(/^\d+\./)) return `<div class="step"><div class="snum">${line.match(/^(\d+)/)[1]}</div><div class="stxt">${line.replace(/^\d+\.\s*/,"")}</div></div>`;
    if(line.startsWith("- ")) return `<p>• ${line.slice(2)}</p>`;
    if(line.trim()==="") return `<div style="height:7px"></div>`;
    return `<p>${line}</p>`;
  }).join("");
  const html=`<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@600;700&family=Inter:wght@400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',sans-serif;color:#1E3A8A;padding:36px 44px;max-width:700px;margin:0 auto}
.hdr{display:flex;align-items:center;gap:14px;margin-bottom:24px;padding-bottom:18px;border-bottom:3px solid #89CFF0}
.hdr img{height:46px;width:auto}
.div{width:1px;height:34px;background:#89CFF044}
.htxt .org{font-family:'Lexend',sans-serif;font-size:16px;font-weight:700;color:#1E3A8A}
.htxt .sub{font-size:11px;color:#89CFF0;font-weight:600;letter-spacing:0.06em;text-transform:uppercase}
.meta{margin-left:auto;text-align:right;font-size:12px;color:#64748B;line-height:1.7}
.badge{display:inline-block;padding:3px 10px;border-radius:12px;background:#1E3A8A;color:#FFD93D;font-size:10px;font-family:'Lexend',sans-serif;font-weight:700;margin-bottom:14px}
h2{font-family:'Lexend',sans-serif;font-size:15px;color:#1E3A8A;margin:16px 0 6px}
p{font-size:13px;line-height:1.7;color:#334155;margin:3px 0}
.step{display:flex;gap:10px;padding:7px 0;border-bottom:1px solid #E2E8F0;align-items:flex-start}
.step:last-child{border-bottom:none}
.snum{width:22px;height:22px;background:#1E3A8A;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:10px;font-weight:700;flex-shrink:0;margin-top:1px}
.stxt{font-size:13px;line-height:1.6;color:#334155;flex:1}
.card{background:#F8FAFF;border-radius:12px;border:2px solid #89CFF0;padding:18px 22px;margin-bottom:14px}
.stitle{font-family:'Lexend',sans-serif;font-size:12px;font-weight:700;color:#1E3A8A;letter-spacing:0.08em;text-transform:uppercase;margin:20px 0 10px;padding-bottom:5px;border-bottom:2px solid #FFB70325}
.ci{display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid #F1F5F9}
.ci:last-child{border-bottom:none}
.box{width:17px;height:17px;border:2px solid #1E3A8A;border-radius:4px;flex-shrink:0;margin-top:1px}
.clabel{font-size:13px;color:#334155;line-height:1.5;flex:1}
.ftr{margin-top:28px;padding-top:14px;border-top:2px solid #FFD93D44;display:flex;justify-content:space-between;align-items:center}
.ftr-l{font-family:'Lexend',sans-serif;font-size:12px;color:#1E3A8A;font-weight:700}
.ftr-r{font-size:11px;color:#94A3B8}
</style></head><body>
<div class="hdr">
  <img src="${LOGO_B64}" alt="Rise In Confidence"/>
  <div class="div"></div>
  <div class="htxt"><div class="org">Rise In Confidence</div><div class="sub">Weekly Student Plan</div></div>
  <div class="meta"><strong>${studentName}</strong><br/>${date}${subject?"<br/>"+subject:""}<br/>Coach: ${coachName}</div>
</div>
<div class="badge">${formType}</div>
<div class="card">${planRows}</div>
${checklist.length?`<div class="stitle">📋 My Weekly Checklist</div><div class="card">${checkRows}</div>`:""}
<div class="ftr">
  <div><div class="ftr-l">Rise In Confidence</div><div style="font-size:11px;color:#89CFF0">riseinconfidence.org</div></div>
  <div class="ftr-r">Prepared by ${coachName} · ${date}</div>
</div>
</body></html>`;

  const iframe=document.createElement("iframe");
  iframe.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;border:none;z-index:9999;background:white;";
  document.body.appendChild(iframe);
  iframe.contentDocument.open();
  iframe.contentDocument.write(html);
  iframe.contentDocument.close();
  const close=document.createElement("button");
  close.textContent="✕ Close Preview";
  close.style.cssText="position:fixed;top:12px;right:12px;z-index:10000;padding:8px 16px;background:#1E3A8A;color:white;border:none;border-radius:8px;cursor:pointer;font-family:sans-serif;font-size:13px;font-weight:600;";
  close.onclick=()=>{document.body.removeChild(iframe);document.body.removeChild(close);document.body.removeChild(pBtn);};
  document.body.appendChild(close);
  const pBtn=document.createElement("button");
  pBtn.textContent="🖨️ Print / Save PDF";
  pBtn.style.cssText="position:fixed;top:12px;right:150px;z-index:10000;padding:8px 16px;background:#FFB703;color:#1E3A8A;border:none;border-radius:8px;cursor:pointer;font-family:sans-serif;font-size:13px;font-weight:700;";
  pBtn.onclick=()=>iframe.contentWindow.print();
  document.body.appendChild(pBtn);
}

// ── Editable Email Draft ───────────────────────────────────────────────────
const EmailDraft = ({value,onChange,color,emptyTitle,emptyIcon,emptyDesc,onBack}) => {
  if(!value) return <EmptyTab emoji={emptyIcon} title={emptyTitle} sub={emptyDesc} onClick={onBack}/>;
  return (<>
    <div style={{background:"#F0F9FF",border:`1px solid ${color}55`,borderRadius:10,padding:"10px 14px",marginBottom:12,fontFamily:"'Inter',sans-serif",fontSize:12,color:"#0E7490"}}>
      ✏️ <strong>Editable draft.</strong> Edit directly below, then select all and copy to paste into your email client.
    </div>
    <textarea value={value} onChange={e=>onChange(e.target.value)} onClick={e=>e.target.select()} style={{width:"100%",minHeight:440,padding:"16px 18px",fontFamily:"'Inter',sans-serif",fontSize:13.5,borderRadius:12,border:`2px solid ${color}55`,background:"white",color:"#1a1a2e",boxSizing:"border-box",resize:"vertical",lineHeight:1.8,outline:"none"}}/>
    <div style={{marginTop:10,display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
      <button onClick={()=>{const el=document.createElement("textarea");el.value=value;document.body.appendChild(el);el.select();document.execCommand("copy");document.body.removeChild(el);}} style={{padding:"10px 20px",borderRadius:10,border:"none",background:color,color:"white",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
        📋 Select All & Copy
      </button>
      <div style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:"#64748B"}}>Or: click box → Cmd+A → Cmd+C</div>
    </div>
    <div style={{marginTop:12,background:"#FFF7F0",borderRadius:10,border:`1px solid ${B.gold}44`,padding:"10px 14px",fontFamily:"'Inter',sans-serif",fontSize:12,color:"#92400E"}}>
      {color==="#0891B2"?"💡 Paste into Gmail, Outlook, ClassDojo, or Remind. For print, paste into Google Docs → File → Print.":"💡 Paste into a professional email to the teacher or IEP team. Can be attached to SST or IEP meeting notes."}
    </div>
  </>);
};

// ── Shared Header ──────────────────────────────────────────────────────────
const Header = ({coach,formType,tab,setTab,onBack}) => {
  const fc = FORM_TYPES.find(f=>f.id===formType);
  const TABS=[
    {id:"form",label:"📝 Form"},
    {id:"summary",label:"🌟 Student Plan"},
    {id:"family",label:"👨‍👩‍👧 Family"},
    {id:"school",label:"🏫 School"},
  ];
  return (
    <div style={{background:B.deep,padding:"14px 0 0",position:"sticky",top:0,zIndex:100,boxShadow:"0 4px 20px #1E3A8A44"}}>
      <div style={{maxWidth:860,margin:"0 auto",padding:"0 20px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12,flexWrap:"wrap"}}>
          <img src={LOGO_B64} alt="Rise In Confidence" style={{height:40,width:"auto",flexShrink:0}}/>
          <div style={{width:1,height:30,background:"rgba(137,207,240,0.25)",margin:"0 4px"}}/>
          {fc&&<div style={{display:"flex",alignItems:"center",gap:7}}>
            <span style={{fontSize:18}}>{fc.icon}</span>
            <div>
              <div style={{fontFamily:"'Lexend',sans-serif",color:B.white,fontSize:14,lineHeight:1.1}}>{fc.label} Session</div>
              <div style={{fontFamily:"'Inter',sans-serif",color:B.sky,fontSize:11}}>Rise In Confidence</div>
            </div>
          </div>}
          <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
            <div style={{fontFamily:"'Inter',sans-serif",color:"rgba(255,255,255,0.55)",fontSize:12}}>{coach.name}</div>
            <button onClick={onBack} style={{padding:"5px 12px",borderRadius:7,border:"1px solid rgba(137,207,240,0.35)",background:"transparent",color:B.sky,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600}}>⬅ Dashboard</button>
          </div>
        </div>
        <div style={{display:"flex",gap:3,overflowX:"auto"}}>
          {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"8px 18px",borderRadius:"10px 10px 0 0",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:13,border:"none",transition:"all 0.18s",whiteSpace:"nowrap",background:tab===t.id?"white":"transparent",color:tab===t.id?B.deep:"rgba(255,255,255,0.65)"}}>{t.label}</button>)}
        </div>
      </div>
    </div>
  );
};

// ── Shared Notes Section ───────────────────────────────────────────────────
const NotesSection = ({form,set}) => (
  <Sec title="📝 Notes & Communication" color="#7C3AED">
    <div style={{background:"#F5F3FF",border:"1px solid #DDD6FE",borderRadius:9,padding:"8px 12px",marginBottom:12,fontSize:11,color:"#6D28D9",fontFamily:"'Inter',sans-serif"}}>
      ⚠️ <strong>Internal Notes are coach-only.</strong> External Notes may be shared with student, parent, or team.
    </div>
    <Fld label="External Notes" hint="Sharable — professional tone, appropriate for student/parent/team">
      <textarea style={{...TS,minHeight:80}} value={form.externalNotes} onChange={e=>set("externalNotes",e.target.value)} placeholder="e.g. Student showed strong initiative today..."/>
    </Fld>
    <Grid>
      <Fld label="Parent / School Team Update" hint="For IEP team or caregivers">
        <textarea style={{...TS,minHeight:68}} value={form.parentUpdate} onChange={e=>set("parentUpdate",e.target.value)} placeholder="e.g. Parent should be aware of upcoming test..."/>
      </Fld>
      <Fld label="🔒 Internal Coach Notes" hint="Private — NOT shared with student or family">
        <textarea style={{...TS,minHeight:68,background:"#FFF7FF",borderColor:"#E9D5FF"}} value={form.internalNotes} onChange={e=>set("internalNotes",e.target.value)} placeholder="e.g. Perfectionism driving avoidance. Consider MI next session..."/>
      </Fld>
    </Grid>
  </Sec>
);

// ── Shared Goals Section ───────────────────────────────────────────────────
const GoalsSection = ({form,set}) => (
  <Sec title="🎯 Goals & Accountability" color={B.gold}>
    <Fld label="Goals Reviewed From Last Session" req>
      <textarea style={{...TS,minHeight:68}} value={form.goalsReviewed} onChange={e=>set("goalsReviewed",e.target.value)} placeholder="List commitments from last session..."/>
    </Fld>
    <Fld label="Goals Met This Week" hint="Be specific — partial credit counts.">
      <textarea style={{...TS,minHeight:68}} value={form.goalsMet} onChange={e=>set("goalsMet",e.target.value)} placeholder="e.g. Completed 2 of 3 steps..."/>
    </Fld>
    <Grid>
      <Fld label="Homework / Assignment Completion">
        <select style={SS} value={form.homeworkCompletion} onChange={e=>set("homeworkCompletion",e.target.value)}>
          <option value="">Select...</option>
          <option>Not attempted</option>
          <option>Partially complete (&lt;50%)</option>
          <option>Mostly complete (50–80%)</option>
          <option>Fully complete</option>
          <option>Completed + exceeded expectations</option>
        </select>
      </Fld>
      <Fld label="Student Effort Level">
        <select style={SS} value={form.effort} onChange={e=>set("effort",e.target.value)}>
          <option value="">Select...</option>
          {EFFORT.map(e=><option key={e}>{e}</option>)}
        </select>
      </Fld>
    </Grid>
    <Fld label="Goals & Action Steps for Next Week" req hint="Concrete — what will they DO?">
      <textarea style={{...TS,minHeight:90}} value={form.nextWeekGoals} onChange={e=>set("nextWeekGoals",e.target.value)} placeholder={"1. Complete reading chapter 3 by Tuesday\n2. Check assignment portal daily at 4pm\n3. Text coach with Thursday check-in"}/>
    </Fld>
    <Fld label="Student\'s Own Commitment (Their Words)" hint="Direct quote or close paraphrase">
      <textarea style={{...TS,minHeight:62}} value={form.studentCommitment} onChange={e=>set("studentCommitment",e.target.value)} placeholder={`e.g. "I'll do the first 2 problems right after dinner."`}/>
    </Fld>
  </Sec>
);

// ── Shared Session Info ────────────────────────────────────────────────────
const SessionInfo = ({form,set,coachName,showSubject=true,students=[],onStudentBlur,lookupState}) => (
  <Sec title="📅 Session Information" color={B.deep}>
    <Grid>
      <Fld label="Student Name" req hint={lookupState==="loading"?"🔍 Looking up previous sessions...":lookupState==="found"?"✅ Previous session found":lookupState==="notfound"?"🆕 New student — no prior sessions found":""}>
        <div style={{position:"relative"}}>
          <input
            style={{...IS, paddingRight: lookupState==="loading"?"36px":IS.paddingRight}}
            value={form.studentName}
            onChange={e=>set("studentName",e.target.value)}
            onBlur={e=>onStudentBlur&&onStudentBlur(e.target.value)}
            placeholder="Full name"
            list="student-list"
          />
          <datalist id="student-list">
            {students.map(s=><option key={s} value={s}/>)}
          </datalist>
          {lookupState==="loading"&&<div style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",fontSize:16}} className="pulse">🔍</div>}
        </div>
      </Fld>
      <Fld label="Session Date" req>
        <input type="date" style={IS} value={form.sessionDate} onChange={e=>set("sessionDate",e.target.value)}/>
      </Fld>
    </Grid>
    <SessionModeField form={form} set={set}/>
    {showSubject&&<>
      <Fld label="Subject Area" req hint="Primary subject focus of this session">
        <select style={SS} value={form.subject} onChange={e=>set("subject",e.target.value)}>
          <option value="">Select subject...</option>
          {SUBJECTS.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
      </Fld>
      {form.subject==="Other"&&<Fld label="Specify Subject"><input style={IS} value={form.subjectOther||""} onChange={e=>set("subjectOther",e.target.value)} placeholder="e.g. AP Environmental Science"/></Fld>}
    </>}
    <Fld label="Student\'s Mood & Readiness" req hint="How did the student present at the start?">
      <Chips options={MOOD} value={form.mood} onChange={v=>set("mood",v)}/>
    </Fld>
  </Sec>
);

// ── Shared Engagement Section ──────────────────────────────────────────────
const EngagementSection = ({form,set}) => (
  <Sec title="📊 Engagement & Autonomy" color="#0891B2">
    <Grid>
      <Fld label="Engagement Level" hint="How actively present and on-task?" req>
        <RatingCards options={ENGAGEMENT} value={form.engagement} onChange={v=>set("engagement",v)}/>
      </Fld>
      <Fld label="Task Autonomy" hint="How independently did they work?" req>
        <RatingCards options={AUTONOMY} value={form.autonomy} onChange={v=>set("autonomy",v)}/>
      </Fld>
    </Grid>
    <div style={{marginTop:10,background:"#FFF7F0",borderRadius:8,padding:"7px 12px",fontFamily:"'Inter',sans-serif",fontSize:11,color:"#92400E",border:`1px solid ${B.gold}33`}}>
      🔒 Engagement and autonomy ratings are <strong>coach-only</strong> — not visible in any student or parent-facing outputs.
    </div>
  </Sec>
);

// ── Session Mode Selector ────────────────────────────────────────────────────
// ── Student Lookup Hook ───────────────────────────────────────────────────────
function useStudentLookup(formType) {
  const [students, setStudents]       = useState([]);
  const [lookupState, setLookupState] = useState("idle"); // idle | loading | found | notfound | error
  const [lastSession, setLastSession] = useState(null);

  // Load student list for this form type — runs once on first render via lazy state init
  const [_loaded, _setLoaded] = useState(() => {
    fetchSheetAPI({ action:"getStudents", formType }).then(data => {
      if (data?.students) setStudents(data.students);
    });
    return true;
  });

  const lookupStudent = async (studentName, onFound) => {
    if (!studentName || studentName.length < 2) {
      setLookupState("idle"); setLastSession(null); return;
    }
    setLookupState("loading");
    const data = await fetchSheetAPI({ action:"getLastSession", student:studentName, formType });
    if (!data) { setLookupState("idle"); return; }
    if (data.found) {
      setLastSession(data);
      setLookupState("found");
      if (onFound) onFound(data);
    } else {
      setLastSession(null);
      setLookupState("notfound");
    }
  };

  return { students, lookupState, lastSession, lookupStudent };
}

// ── Student Last Session Banner ────────────────────────────────────────────────
const LastSessionBanner = ({lastSession, onApply}) => {
  if (!lastSession) return null;
  const acc = lastSession.overallAccuracy;
  return (
    <div style={{background:"linear-gradient(135deg,#1E3A8A,#1e40af)",borderRadius:12,padding:"14px 18px",marginBottom:14,border:`1px solid ${B.sky}44`}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontFamily:"'Lexend',sans-serif",color:B.yellow,fontSize:13,marginBottom:6}}>
            📋 Last Session Found — {lastSession.lastSessionDate}
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:16}}>
            {acc&&<div style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:"rgba(255,255,255,0.8)"}}>
              <span style={{color:B.sky}}>Accuracy: </span>
              <strong style={{color:B.yellow}}>{acc}%</strong>
            </div>}
            {lastSession.lastCoach&&<div style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:"rgba(255,255,255,0.8)"}}>
              <span style={{color:B.sky}}>Coach: </span>{lastSession.lastCoach}
            </div>}
            {lastSession.sessionCount&&<div style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:"rgba(255,255,255,0.8)"}}>
              <span style={{color:B.sky}}>Total sessions: </span>{lastSession.sessionCount}
            </div>}
            {lastSession.progressFlagged==="YES — Review Required"&&
              <div style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:"#FCA5A5",fontWeight:700}}>🚩 Previously Flagged</div>}
          </div>
          {lastSession.lastGoals&&<div style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:"rgba(255,255,255,0.65)",marginTop:6,lineHeight:1.5}}>
            <span style={{color:B.sky}}>Last week's goals: </span>{lastSession.lastGoals.split("\n").join(" · ")}
          </div>}
        </div>
        <button onClick={onApply} style={{padding:"8px 16px",borderRadius:9,border:"none",background:B.yellow,color:B.deep,fontFamily:"'Inter',sans-serif",fontSize:12,fontWeight:700,cursor:"pointer",flexShrink:0,whiteSpace:"nowrap"}}>
          ⬇ Auto-fill Previous Data
        </button>
      </div>
    </div>
  );
};

const SessionModeField = ({form,set}) => (
  <Fld label="Session Mode" req hint="How was this session delivered?">
    <div style={{display:"flex",gap:10,marginTop:4,flexWrap:"wrap"}}>
      {SESSION_MODES.map(m=>{
        const on=form.sessionMode===m;
        const icons={"In-Person":"🏫","Online":"💻","Hybrid":"🔀"};
        return <button key={m} type="button" onClick={()=>set("sessionMode",m)} style={{padding:"8px 18px",borderRadius:10,border:`2px solid ${on?B.deep:"#CBD5E1"}`,background:on?B.deep:"#F8FAFF",color:on?"white":B.deep,fontFamily:"'Inter',sans-serif",fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6,transition:"all 0.15s"}}>
          <span>{icons[m]}</span>{m}
        </button>;
      })}
    </div>
  </Fld>
);

// ── VAKT + CRA Strategy Logger ────────────────────────────────────────────────
const VAKTSection = ({strategies,setStrategies}) => {
  const grouped = ["Visual","Auditory","Kinesthetic","Tactile","CRA"].map(mod=>({
    mod, items: VAKT_STRATEGIES.filter(s=>s.modality===mod)
  }));
  const toggle = (id) => {
    setStrategies(prev => {
      if(prev.find(s=>s.id===id)) return prev.filter(s=>s.id!==id);
      return [...prev,{id,effectiveness:"",note:""}];
    });
  };
  const update = (id,field,val) => setStrategies(prev=>prev.map(s=>s.id===id?{...s,[field]:val}:s));
  const active = strategies.map(s=>s.id);

  return (
    <Sec title="🎨 VAKT + CRA Strategies" color="#7C3AED">
      <div style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:"#64748B",marginBottom:12,lineHeight:1.5}}>
        Select every strategy used this session, then rate its effectiveness and add a brief note.
      </div>
      {grouped.map(({mod,items})=>(
        <div key={mod} style={{marginBottom:14}}>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,fontWeight:700,color:MODALITY_COLORS[mod],letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:6,paddingBottom:4,borderBottom:`1.5px solid ${MODALITY_COLORS[mod]}30`}}>
            {mod==="CRA"?"CRA — Concrete · Representational · Abstract":mod}
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:6}}>
            {items.map(s=>{
              const on=active.includes(s.id);
              return <span key={s.id} onClick={()=>toggle(s.id)} style={{display:"inline-block",padding:"4px 11px",borderRadius:20,fontSize:12,fontFamily:"'Inter',sans-serif",cursor:"pointer",border:`1.5px solid ${on?MODALITY_COLORS[mod]:"#CBD5E1"}`,background:on?MODALITY_COLORS[mod]+"18":"#F8FAFF",color:on?MODALITY_COLORS[mod]:B.deep,fontWeight:on?700:500,transition:"all 0.15s"}}>{s.label}</span>;
            })}
          </div>
          {strategies.filter(s=>items.find(i=>i.id===s.id)).map(s=>{
            const info=VAKT_STRATEGIES.find(i=>i.id===s.id);
            return (
              <div key={s.id} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 12px",background:"#F8FAFF",borderRadius:9,border:`1px solid ${MODALITY_COLORS[mod]}30`,marginBottom:6}}>
                <div style={{fontFamily:"'Inter',sans-serif",fontSize:12,fontWeight:600,color:MODALITY_COLORS[mod],minWidth:160,paddingTop:6}}>{info?.label}</div>
                <div style={{display:"flex",gap:5}}>
                  {EFFECTIVENESS.map(e=>{
                    const sel=s.effectiveness===e.v;
                    return <button key={e.v} type="button" onClick={()=>update(s.id,"effectiveness",e.v)} style={{padding:"4px 10px",borderRadius:7,border:`1.5px solid ${sel?e.c:"#E2E8F0"}`,background:sel?e.c+"20":"white",color:sel?e.c:"#94A3B8",fontFamily:"'Inter',sans-serif",fontSize:11,fontWeight:sel?700:500,cursor:"pointer",transition:"all 0.14s",whiteSpace:"nowrap"}}>{e.l}</button>;
                  })}
                </div>
                <input value={s.note} onChange={e=>update(s.id,"note",e.target.value)} placeholder="Brief observation..." style={{...IS,flex:1,fontSize:12,padding:"5px 10px",minWidth:0}}/>
              </div>
            );
          })}
        </div>
      ))}
    </Sec>
  );
};

// ── Accuracy Tracker ──────────────────────────────────────────────────────────
const initSkill = (name="") => ({name,attempted:"",correct:"",note:""});

const AccuracySection = ({skills,setSkills,prevAccuracy,setPrevAccuracy,color="#1E3A8A",strategiesHistory=[],manualFlag,setManualFlag}) => {
  const addSkill = () => setSkills(p=>[...p,initSkill()]);
  const removeSkill = i => setSkills(p=>p.filter((_,j)=>j!==i));
  const upd = (i,field,val) => setSkills(p=>p.map((s,j)=>j===i?{...s,[field]:val}:s));

  const pct = (att,cor) => {
    const a=parseInt(att)||0, c=parseInt(cor)||0;
    if(a===0) return null;
    return Math.round((c/a)*100);
  };
  const totalAtt = skills.reduce((s,sk)=>s+(parseInt(sk.attempted)||0),0);
  const totalCor = skills.reduce((s,sk)=>s+(parseInt(sk.correct)||0),0);
  const totalPct = pct(totalAtt,totalCor);
  const prevPct = prevAccuracy ? parseInt(prevAccuracy) : null;
  const trend = totalPct!==null && prevPct!==null ? totalPct-prevPct : null;
  const trendColor = trend===null?"#94A3B8":trend>0?"#22C55E":trend<-10?"#EF4444":"#EAB308";
  const trendLabel = trend===null?"—":trend>0?`▲ +${trend}%`:trend===0?"→ No change":`▼ ${trend}%`;

  return (
    <Sec title="📈 Accuracy & Progress Tracker" color={color}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14,flexWrap:"wrap"}}>
        {totalPct!==null&&<div style={{background:B.deep,borderRadius:12,padding:"10px 20px",display:"flex",gap:20,alignItems:"center"}}>
          <div style={{textAlign:"center"}}>
            <div style={{fontFamily:"'Lexend',sans-serif",fontSize:24,color:B.yellow,lineHeight:1}}>{totalPct}%</div>
            <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:B.sky}}>This Session</div>
          </div>
          <div style={{width:1,height:36,background:"rgba(255,255,255,0.15)"}}/>
          <div style={{textAlign:"center"}}>
            <div style={{fontFamily:"'Lexend',sans-serif",fontSize:24,color:trendColor,lineHeight:1}}>{trendLabel}</div>
            <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:B.sky}}>vs Last Session</div>
          </div>
          <div style={{width:1,height:36,background:"rgba(255,255,255,0.15)"}}/>
          <div style={{textAlign:"center"}}>
            <div style={{fontFamily:"'Lexend',sans-serif",fontSize:16,color:"white",lineHeight:1}}>{totalCor}/{totalAtt}</div>
            <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:B.sky}}>Correct / Attempted</div>
          </div>
        </div>}
        <div style={{flex:1}}>
          <Fld label="Last Session Overall Accuracy %" hint="Enter previous session % to calculate trend — leave blank if first session">
            <input style={{...IS,maxWidth:180}} type="number" min={0} max={100} value={prevAccuracy} onChange={e=>setPrevAccuracy&&setPrevAccuracy(e.target.value)} placeholder="e.g. 68"/>
          </Fld>
        </div>
      </div>

      {/* Skill rows */}
      <div style={{marginBottom:10}}>
        <div style={{display:"grid",gridTemplateColumns:"1.8fr 80px 80px 80px 1fr",gap:8,padding:"5px 8px",fontFamily:"'Inter',sans-serif",fontSize:11,fontWeight:700,color:"#94A3B8",letterSpacing:"0.04em"}}>
          <div>SKILL / SECTION</div><div style={{textAlign:"center"}}>ATTEMPTED</div><div style={{textAlign:"center"}}>CORRECT</div><div style={{textAlign:"center"}}>%</div><div>NOTES</div>
        </div>
        {skills.map((sk,i)=>{
          const p=pct(sk.attempted,sk.correct);
          const pColor=p===null?"#CBD5E1":p>=80?"#22C55E":p>=60?"#EAB308":"#EF4444";
          return (
            <div key={i} style={{display:"grid",gridTemplateColumns:"1.8fr 80px 80px 80px 1fr",gap:8,padding:"6px 8px",borderRadius:8,background:i%2===0?"#F8FAFF":"white",alignItems:"center",marginBottom:3}}>
              <input value={sk.name} onChange={e=>upd(i,"name",e.target.value)} placeholder="e.g. Consonant blends" style={{...IS,fontSize:13,padding:"6px 10px"}}/>
              <input value={sk.attempted} onChange={e=>upd(i,"attempted",e.target.value)} type="number" min={0} placeholder="0" style={{...IS,fontSize:13,padding:"6px 10px",textAlign:"center"}}/>
              <input value={sk.correct} onChange={e=>upd(i,"correct",e.target.value)} type="number" min={0} placeholder="0" style={{...IS,fontSize:13,padding:"6px 10px",textAlign:"center"}}/>
              <div style={{textAlign:"center",fontFamily:"'Lexend',sans-serif",fontSize:15,fontWeight:700,color:pColor}}>{p!==null?p+"%":"—"}</div>
              <div style={{display:"flex",gap:5}}>
                <input value={sk.note} onChange={e=>upd(i,"note",e.target.value)} placeholder="Observation..." style={{...IS,fontSize:12,padding:"5px 9px",flex:1}}/>
                <button type="button" onClick={()=>removeSkill(i)} style={{padding:"5px 9px",borderRadius:7,border:"1px solid #FECACA",background:"#FEF2F2",color:"#EF4444",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontSize:13,fontWeight:700,flexShrink:0}}>×</button>
              </div>
            </div>
          );
        })}
      </div>
      <button type="button" onClick={addSkill} style={{padding:"7px 16px",borderRadius:9,border:`1.5px dashed ${color}55`,background:"transparent",color,fontFamily:"'Inter',sans-serif",fontSize:13,fontWeight:600,cursor:"pointer"}}>+ Add Skill / Section</button>

      {/* Progress alert */}
      {/* ── Alert: accuracy drop ── */}
      {trend!==null&&trend<=-10&&<div style={{marginTop:12,background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:9,padding:"10px 14px",fontFamily:"'Inter',sans-serif",fontSize:12,color:"#B91C1C"}}>
        ⚠️ <strong>Auto Alert — Accuracy Drop:</strong> Accuracy dropped {Math.abs(trend)}% since last session. Review strategy effectiveness and consider adjusting approach.
      </div>}
      {/* ── Alert: same strategies, no improvement ── */}
      {(()=>{if(strategiesHistory.length<3||trend===null||trend>0)return null;const recentIds=strategiesHistory.slice(-3);const repeated=recentIds[0].filter(id=>recentIds[1].includes(id)&&recentIds[2].includes(id));if(repeated.length===0)return null;const names=repeated.map(id=>VAKT_STRATEGIES.find(s=>s.id===id)?.label||id).join(", ");return(<div style={{marginTop:8,background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:9,padding:"10px 14px",fontFamily:"'Inter',sans-serif",fontSize:12,color:"#92400E"}}>⚠️ <strong>Auto Alert — Strategy Plateau:</strong> {names} {repeated.length===1?"has":"have"} been used for 3+ sessions with no accuracy gain. Consider introducing a new modality or approach.</div>);})()}
      {/* ── Alert: strong progress ── */}
      {trend!==null&&trend>=10&&<div style={{marginTop:8,background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:9,padding:"10px 14px",fontFamily:"'Inter',sans-serif",fontSize:12,color:"#166534"}}>
        🎉 <strong>Strong Progress:</strong> Accuracy improved {trend}% since last session. Document what worked and keep building.
      </div>}
      {/* ── Manual flag ── */}
      <div style={{marginTop:12,display:"flex",alignItems:"flex-start",gap:10}}>
        <button type="button" onClick={()=>setManualFlag&&setManualFlag(v=>!v)} style={{padding:"7px 14px",borderRadius:8,border:`1.5px solid ${manualFlag?"#EF4444":"#CBD5E1"}`,background:manualFlag?"#FEF2F2":"#F8FAFF",color:manualFlag?"#B91C1C":"#64748B",fontFamily:"'Inter',sans-serif",fontSize:12,fontWeight:700,cursor:"pointer",flexShrink:0,transition:"all 0.15s",whiteSpace:"nowrap"}}>
          {manualFlag?"🚩 Flagged for Review":"⚑ Flag for Review"}
        </button>
        <div style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:"#64748B",lineHeight:1.5,paddingTop:6}}>Manually flag this student's progress for supervisor review, strategy adjustment, or IEP/504 update discussion.</div>
      </div>
    </Sec>
  );
};

// ── Shared Generate Outputs ────────────────────────────────────────────────
const GenButtons = ({canGen,loading,onSummary,onFamily,onSchool}) => (
  <div style={{display:"flex",flexDirection:"column",gap:10}}>
    <button onClick={onSummary} disabled={!canGen||loading==="summary"} style={{width:"100%",padding:"14px",borderRadius:13,border:"none",background:canGen?`linear-gradient(135deg,${B.deep},#2563EB)`:"#CBD5E1",color:"white",fontSize:15,fontWeight:700,fontFamily:"'Inter',sans-serif",cursor:canGen?"pointer":"not-allowed",boxShadow:canGen?"0 6px 20px #1E3A8A33":"none",transition:"all 0.2s"}}>
      {loading==="summary"?"⏳ Generating...":"🌟 Generate Student Action Plan"}
    </button>
    {canGen&&<Grid>
      <button onClick={onFamily} disabled={loading==="family"} style={{padding:"12px",borderRadius:11,border:"none",background:"linear-gradient(135deg,#0891B2,#0E7490)",color:"white",fontSize:14,fontWeight:700,fontFamily:"'Inter',sans-serif",cursor:"pointer",boxShadow:"0 4px 12px #0891B218"}}>
        {loading==="family"?"⏳...":"👨‍👩‍👧 Family Email"}
      </button>
      <button onClick={onSchool} disabled={loading==="school"} style={{padding:"12px",borderRadius:11,border:"none",background:"linear-gradient(135deg,#7C3AED,#6D28D9)",color:"white",fontSize:14,fontWeight:700,fontFamily:"'Inter',sans-serif",cursor:"pointer",boxShadow:"0 4px 12px #7C3AED18"}}>
        {loading==="school"?"⏳...":"🏫 School Email"}
      </button>
    </Grid>}
    {!canGen&&<div style={{textAlign:"center",color:"#94A3B8",fontSize:12,fontFamily:"'Inter',sans-serif"}}>Complete Student Name, Mood, and required fields to generate</div>}
  </div>
);

// ── TSV Builder ────────────────────────────────────────────────────────────
function buildTSV(fields) {
  const clean=v=>(v||"").replace(/\t/g," ").replace(/\n/g," | ");
  const hdrs=fields.map(f=>f[0]);
  const vals=fields.map(f=>clean(Array.isArray(f[1])?f[1].join("; "):String(f[1]||"")));
  return [hdrs,vals].map(r=>r.join("\t")).join("\n");
}

// ── Prompts Factory ────────────────────────────────────────────────────────
function makePrompts(formType,form,baseData,extras={}) {
  const ft = FORM_TYPES.find(f=>f.id===formType)?.label||formType;
  const sub = extras.subject||form.subject||"";
  const autDesc = AUTONOMY.find(a=>a.v===form.autonomy)?.d||"";
  const autLabel = AUTONOMY.find(a=>a.v===form.autonomy)?.l||"";
  const engLabel = ENGAGEMENT.find(e=>e.v===form.engagement)?.l||"";

  const studentPrompt = {
    ef:`You are an EF coach at Rise In Confidence. Write a SHORT student-facing weekly action plan. Warm, clear, encouraging. Short sentences. No scores or ratings visible. Format:
## 🌟 Your Weekly Win Plan
[1–2 sentence warm opener using their mood — no numbers]
## 🎯 This Week\'s Focus
[2–3 sentences on EF skill(s) tied to ${sub||"their work"} in plain language]
## ✅ Your Action Steps
[4–6 numbered steps. Each = clear action + time estimate. Reference strategies discussed.]
## 🗓️ Your Commitment
[Restate their commitment warmly]
## 💡 One Thing to Remember
[One simple practical tip — positive framing]
SESSION DATA:${baseData}
NO scores/ratings visible to student. Empowering, specific. Max 350 words.
After plan output: ---CHECKLIST---
Then 5–7 short daily checklist items (one per line, plain text).`,

    tutor:`You are a tutor at Rise In Confidence. Write a SHORT student-facing weekly action plan. Warm, clear. Short sentences. No scores. Format:
## 📚 Your Study Plan This Week
[1–2 sentence warm opener — acknowledge their effort today]
## 🎯 What We\'re Working On
[2–3 sentences on the skill/concept focus. Why it matters. Make it relatable.]
## ✅ Your Practice Steps
[4–6 numbered steps. Specific practice tasks + time estimates. Reference any materials/methods used.]
## 🗓️ Your Commitment
[Restate their specific study commitment]
## 💡 Study Tip
[One practical tip for the skill they\'re building]
SESSION DATA:${baseData}
NO scores/ratings. Encouraging. Max 350 words.
After plan: ---CHECKLIST---
5–7 daily study checklist items (plain text, one per line).`,

    ethx:`You are an educational therapist at Rise In Confidence. Write a SHORT student-facing weekly action plan. Warm, empowering, dyslexia-friendly. Short sentences. No scores. Format:
## 🌱 Your Learning Plan This Week
[1–2 sentence warm opener — celebrate a specific strength observed today]
## 🎯 What We\'re Building
[2–3 sentences on the learning strategy/skill. Why it works for their brain. Strength-based.]
## ✅ Your Steps This Week
[4–6 numbered steps. Multisensory and specific. Include modality (read aloud, draw it, say it, etc.)]
## 🗓️ Your Commitment
[Restate their specific commitment]
## 💡 Brain Tip
[One learning strategy tip tied to their learning profile — positive and practical]
SESSION DATA:${baseData}
NO scores/ratings. Empowering. Max 350 words.
After plan: ---CHECKLIST---
5–7 daily checklist items (plain text, one per line).`,

    prep:`You are a test prep coach at Rise In Confidence. Write a SHORT student-facing weekly study plan. Motivating, focused, practical. No scores visible. Format:
## ✏️ Your Test Prep Plan This Week
[1–2 sentence motivating opener — acknowledge effort and progress]
## 🎯 This Week\'s Focus
[2–3 sentences on the section/skill being targeted. Why this moves their score. Concrete.]
## ✅ Your Practice Steps
[4–6 numbered steps. Specific drills, timed practice, review tasks + time estimates]
## 🗓️ Your Commitment
[Restate their specific study commitment]
## 💡 Test Strategy Tip
[One practical test-taking or study strategy tip for their focus area]
SESSION DATA:${baseData}
NO scores/ratings visible. Motivating. Max 350 words.
After plan: ---CHECKLIST---
5–7 daily prep checklist items (plain text, one per line).`,
  };

  const familyPrompt=`You are a coach at Rise In Confidence writing a SHORT weekly email for a student\'s FAMILY. Warm, brief, task-focused. No headers. No scores.
Format exactly:
Subject: Quick Update — ${form.studentName} (${form.sessionDate})

Hi [Family],

[1 sentence: one specific genuine win from this session.]

[1–2 sentences: what ${form.studentName} is working on and their exact commitment this week.]

To support at home:
• [specific action #1 — under 12 words]
• [specific action #2 — under 12 words]
• [specific action #3 — under 12 words]

[1 warm closing sentence.]

${form.coachName||"Your coach"}
Rise In Confidence | riseinconfidence.org

SESSION DATA:${baseData}
RULES: No headers. No scores. Under 150 words body. Tasks and needs only.`;

  const schoolPrompt=`You are a coach at Rise In Confidence writing a SHORT professional email to a student\'s TEACHER or SCHOOL TEAM. Direct, specific, task-focused. No headers. No numeric scores.
Format exactly:
Subject: Coaching Update — ${form.studentName} | ${form.sessionDate}

Hi [Teacher/Team],

[1 sentence: session type, focus area, one concrete behavioral observation.]

This week ${form.studentName} committed to: [their specific goal in 1 sentence].

In class this week, please:
• [specific classroom support #1 — under 15 words]
• [specific classroom support #2 — under 15 words]
• [specific classroom support #3 if needed]

[1 sentence on a strength. 1 sentence inviting questions.]

${form.coachName||"Your coach"}
Rise In Confidence | riseinconfidence.org

SESSION DATA:${baseData}
RULES: No headers. No numeric scores. Under 160 words body. Tasks and classroom needs only.`;

  return {
    student: studentPrompt[formType]||studentPrompt.ef,
    family: familyPrompt,
    school: schoolPrompt,
  };
}

// ════════════════════════════════════════════════════════════
// FORM: EF COACHING
// ════════════════════════════════════════════════════════════
const initEF={
  studentName:"Marcus J.",
  sessionDate:"2025-04-12",
  subject:"Writing / Composition",
  subjectOther:"",
  mood:"🙂 Okay",
  engagement:"3",
  autonomy:"developing",
  efFocus:["Task Initiation","Planning & Organization","Time Management"],
  efStrengths:"Marcus broke the essay prompt into smaller parts without being prompted — a real step forward. He also caught himself going off-task twice and self-corrected without coach intervention.",
  efChallenges:"Avoids starting writing tasks when he perceives them as too hard. Tends to reorganize desk or check phone instead of initiating. Underestimates how long writing takes by 2–3x.",
  efStrategiesUsed:"Backward planning from essay due date, body doubling during session, 'just write badly' reframe to reduce perfectionism paralysis, visual timer.",
  efStrategiesNew:"2-minute start rule — commit to writing for just 2 minutes before deciding if it's too hard. Traffic light self-monitoring: Green = working, Yellow = stuck, Red = need help.",
  homeworkCompletion:"Mostly complete (50–80%)",
  effort:"3 – Moderate",
  tools:"Google Calendar for due dates, sticky note daily checklist on desk, Focusmate for body doubling",
  goalsReviewed:"1. Write rough outline for English persuasive essay\n2. Set 20-min timer and start intro paragraph\n3. Check Google Classroom every day before 4pm",
  goalsMet:"Completed the outline independently — rough but done. Did not start the intro paragraph. Checked Google Classroom 3 of 5 days.",
  nextWeekGoals:"1. Use the 2-minute start rule to begin intro paragraph — Monday before 5pm\n2. Write one body paragraph using the outline — aim for Tuesday\n3. Check Google Classroom daily at 3:30pm\n4. Text Coach Alicia by Wednesday with a check-in emoji",
  studentCommitment:"I'll do the 2-minute rule on Monday right after I get home. If I'm stuck I'll text you.",
  externalNotes:"Marcus completed his essay outline independently this week — a significant milestone. He is building awareness of his avoidance patterns and responding well to visual supports and reframing strategies.",
  parentUpdate:"Please encourage Marcus to use the sticky note checklist on his desk each afternoon. A gentle 'have you checked Google Classroom yet?' around 3:30pm helps. Avoid doing the checklist for him — independence is the goal.",
  sessionMode:"In-Person",
  vaktStrategies:[{id:"V_color",effectiveness:"3",note:"Color-coded outline sections"},{id:"K_write",effectiveness:"3",note:"Whiteboard planning map"},{id:"CRA_R",effectiveness:"2",note:"Representational flowchart for essay structure"}],
  accuracySkills:[{name:"Outline completion",attempted:"5",correct:"4",note:"Solid structure"},{name:"Paragraph topic sentences",attempted:"3",correct:"2",note:"Needs more practice"}],
  prevAccuracy:"55",
    internalNotes:"Perfectionism appears to be the core driver of task avoidance, not laziness. He lights up when given permission to write badly. Parent may be over-scaffolding at home — worth a gentle conversation. Monitor for anxiety around upcoming state writing assessment."
};

function EFForm({coach,onBack}) {
  const [form,setForm]=useState({...initEF,coachName:coach.name});
  const [vaktStrategies,setVaktStrategies]=useState(initEF.vaktStrategies||[]);
  const [accuracySkills,setAccuracySkills]=useState(initEF.accuracySkills||[{'name':'','attempted':'','correct':'','note':''}]);
  const [prevAccuracy,setPrevAccuracy]=useState(initEF.prevAccuracy||'');
  const [manualFlag,setManualFlag]=useState(false);
  // strategiesHistory: array of arrays of strategy IDs used per session
  // In production, load from persistent store. Demo: simulate 3 sessions.
  const {students,lookupState,lastSession,lookupStudent} = useStudentLookup("ef");
  // In production, load strategiesHistory from lastSession.strategiesHistory
  const strategiesHistory = lastSession?.strategiesHistory || [['V_color','K_write'],['V_color','K_write','A_verbal'],['V_color','K_write','A_verbal']];

  const applyLastSession = (data) => {
    if (!data) return;
    if (data.overallAccuracy) setPrevAccuracy(data.overallAccuracy);
    if (data.accuracyBySkill?.length) setAccuracySkills(data.accuracyBySkill.map(s=>({...s,note:''})));
    if (data.lastGoals) set('goalsReviewed', data.lastGoals);
    if (data.lastTools) set('tools', data.lastTools);
    if (data.lastSubject) set('subject', data.lastSubject);
  };

  const [tab,setTab]=useState("form");
  const [summary,setSummary]=useState("");
  const [checklist,setChecklist]=useState([]);
  const [familyDraft,setFamilyDraft]=useState("");
  const [schoolDraft,setSchoolDraft]=useState("");
  const [loading,setLoading]=useState("");
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const sub=form.subject==="Other"?(form.subjectOther||"Other"):form.subject;
  const engLabel=ENGAGEMENT.find(e=>e.v===form.engagement)?.l||"";
  const autLabel=AUTONOMY.find(a=>a.v===form.autonomy)?.l||"";
  const autDesc=AUTONOMY.find(a=>a.v===form.autonomy)?.d||"";
  const canGen=!!(form.studentName&&form.mood&&form.efFocus.length>0);

  const baseData=`
Student: ${form.studentName} | Subject: ${sub} | Date: ${form.sessionDate} | Coach: ${coach.name}
Mood: ${form.mood} | Engagement (internal): ${engLabel} | Autonomy (internal): ${autLabel} — ${autDesc}
EF Focus: ${form.efFocus.join(", ")}
EF Strengths: ${form.efStrengths} | EF Challenges: ${form.efChallenges}
Strategies used: ${form.efStrategiesUsed} | New strategies: ${form.efStrategiesNew}
HW Completion: ${form.homeworkCompletion} | Effort: ${form.effort} | Tools: ${form.tools}
Goals reviewed: ${form.goalsReviewed} | Goals met: ${form.goalsMet}
Next week goals: ${form.nextWeekGoals} | Student commitment: ${form.studentCommitment}
Session mode: ${form.sessionMode}
Accuracy this session: ${accuracySkills.map(s=>s.name+'('+(s.correct||0)+'/'+(s.attempted||0)+')').join(', ')}
Previous session accuracy: ${prevAccuracy}%
VAKT strategies used + effectiveness: ${vaktStrategies.map(s=>{const info=VAKT_STRATEGIES.find(x=>x.id===s.id);return (info?.label||s.id)+': '+(['','Didn\'t connect','Somewhat helpful','Worked well'][s.effectiveness]||'unrated')+(s.note?' — '+s.note:'');}).join('; ')}
External notes: ${form.externalNotes} | Parent update: ${form.parentUpdate}`;

  const gen=async(type)=>{
    setLoading(type);setTab(type);
    const {student,family,school}=makePrompts("ef",{...form,coachName:coach.name},baseData,{subject:sub});
    try{
      if(type==="summary"){const r=await callClaude(student);const p=r.split("---CHECKLIST---");setSummary(p[0].trim());setChecklist(p[1]?.trim().split("\n").map(l=>l.trim()).filter(l=>l&&!l.startsWith("#"))||[]);}
      if(type==="family"){setFamilyDraft(await callClaude(family));}
      if(type==="school"){setSchoolDraft(await callClaude(school));}
    }catch{
      if(type==="summary")setSummary("⚠️ Error");
      if(type==="family")setFamilyDraft("⚠️ Error");
      if(type==="school")setSchoolDraft("⚠️ Error");
    }
    setLoading("");
  };

  const tsvFields=[
    ["Form Type","EF Coaching"],
    ["Session Mode",form.sessionMode],
    ["Overall Accuracy %",accuracySkills.reduce((s,sk)=>s+(parseInt(sk.attempted)||0),0)>0?Math.round(accuracySkills.reduce((s,sk)=>s+(parseInt(sk.correct)||0),0)/accuracySkills.reduce((s,sk)=>s+(parseInt(sk.attempted)||0),0)*100)+"%":""],
    ["Previous Accuracy %",prevAccuracy?prevAccuracy+"%":""],
    ["Accuracy by Skill",accuracySkills.map(s=>s.name+"("+s.correct+"/"+s.attempted+")").join("; ")],
    ["VAKT Strategies",vaktStrategies.map(s=>{const i=VAKT_STRATEGIES.find(x=>x.id===s.id);return (i?.label||s.id)+":"+["","✗","~","✓"][s.effectiveness||0]+(s.note?" ("+s.note+")":"");}).join("; ")],
    ["Progress Flagged",manualFlag?"YES — Review Required":"No"],["Export Date",new Date().toLocaleString()],
    ["Student",form.studentName],["Date",form.sessionDate],["Coach",coach.name],
    ["Subject",sub],["Mood",form.mood],["Engagement",engLabel],["Autonomy",autLabel],
    ["EF Focus",form.efFocus],["EF Strengths",form.efStrengths],["EF Challenges",form.efChallenges],
    ["Strategies Used",form.efStrategiesUsed],["New Strategies",form.efStrategiesNew],
    ["HW Completion",form.homeworkCompletion],["Effort",form.effort],["Tools",form.tools],
    ["Goals Reviewed",form.goalsReviewed],["Goals Met",form.goalsMet],
    ["Next Week Goals",form.nextWeekGoals],["Student Commitment",form.studentCommitment],
    ["External Notes",form.externalNotes],["Parent Update",form.parentUpdate],
    ["Internal Notes (Private)",form.internalNotes],["AI Summary",summary],
  ];

  return(<>
    <Header coach={coach} formType="ef" tab={tab} setTab={setTab} onBack={onBack}/>
    <div style={{maxWidth:860,margin:"0 auto",padding:"24px 20px 60px"}}>
      {tab==="form"&&<>
        <SessionInfo form={form} set={set} coachName={coach.name} students={students} lookupState={lookupState} onStudentBlur={name=>lookupStudent(name,applyLastSession)}/>
        <LastSessionBanner lastSession={lastSession} onApply={()=>applyLastSession(lastSession)}/>
        <EngagementSection form={form} set={set}/>
        <VAKTSection strategies={vaktStrategies} setStrategies={setVaktStrategies}/>
        <AccuracySection skills={accuracySkills} setSkills={setAccuracySkills} prevAccuracy={prevAccuracy} setPrevAccuracy={setPrevAccuracy} color="#1E3A8A" manualFlag={manualFlag} setManualFlag={setManualFlag} strategiesHistory={strategiesHistory}/>
        <Sec title="🧠 Executive Function Focus" color={B.sky}>
          <Fld label="EF Skills Targeted" hint="Select all that apply" req>
            <Chips options={EF_SKILLS} value={form.efFocus} onChange={v=>set("efFocus",v)} multi/>
          </Fld>
          <Grid>
            <Fld label="EF Strengths Observed"><textarea style={TS} value={form.efStrengths} onChange={e=>set("efStrengths",e.target.value)} placeholder="e.g. Initiated tasks with less prompting..."/></Fld>
            <Fld label="EF Challenges Noted"><textarea style={TS} value={form.efChallenges} onChange={e=>set("efChallenges",e.target.value)} placeholder="e.g. Difficulty estimating time..."/></Fld>
            <Fld label="Strategies Used" hint="CRA, chunking, visual timer, etc."><textarea style={TS} value={form.efStrategiesUsed} onChange={e=>set("efStrategiesUsed",e.target.value)} placeholder="e.g. Backward planning, body doubling..."/></Fld>
            <Fld label="New Strategies Introduced"><textarea style={TS} value={form.efStrategiesNew} onChange={e=>set("efStrategiesNew",e.target.value)} placeholder="e.g. 2-minute start rule..."/></Fld>
          </Grid>
          <Fld label="Tools & Systems in Use"><textarea style={{...TS,minHeight:60}} value={form.tools} onChange={e=>set("tools",e.target.value)} placeholder="e.g. Google Calendar, sticky note system, Focusmate..."/></Fld>
        </Sec>
        <GoalsSection form={form} set={set}/>
        <NotesSection form={form} set={set}/>
        <GenButtons canGen={canGen} loading={loading} onSummary={()=>gen("summary")} onFamily={()=>gen("family")} onSchool={()=>gen("school")}/>
      </>}
      {tab==="summary"&&<SummaryTab summary={summary} checklist={checklist} loading={loading} form={{...form,coachName:coach.name}} sub={sub} tsv={buildTSV(tsvFields)} onBack={()=>setTab("form")} onRegen={()=>gen("summary")} formTypeLabel="EF Coaching"/>}
      {tab==="family"&&<>{loading==="family"?<Spinner emoji="💌" title="Writing Family Email..." sub="One moment..."/>:<EmailDraft value={familyDraft} onChange={setFamilyDraft} color="#0891B2" emptyIcon="💌" emptyTitle="Family Email Not Generated Yet" emptyDesc="Fill out the form and click Family Email." onBack={()=>setTab("form")}/>}</>}
      {tab==="school"&&<>{loading==="school"?<Spinner emoji="🏫" title="Writing School Email..." sub="One moment..."/>:<EmailDraft value={schoolDraft} onChange={setSchoolDraft} color="#7C3AED" emptyIcon="🏫" emptyTitle="School Email Not Generated Yet" emptyDesc="Fill out the form and click School Email." onBack={()=>setTab("form")}/>}</>}
    </div>
  </>);
}

// ════════════════════════════════════════════════════════════
// FORM: TUTORING
// ════════════════════════════════════════════════════════════
const initTutor={
  studentName:"Sofia R.",
  sessionDate:"2025-04-12",
  subject:"Algebra",
  subjectOther:"",
  mood:"😊 Good",
  engagement:"4",
  autonomy:"approaching",
  conceptsTaught:"Solving two-step equations with variables on both sides. Introduced the distributive property as a prerequisite skill. Connected to real-world context: splitting a restaurant bill.",
  skillGaps:"Inconsistent application of inverse operations — sometimes adds when she should subtract. Does not check her answers by substituting back into the equation. Skips showing work under time pressure.",
  methodsUsed:"Algebra tiles for concrete modeling, color-coded steps (blue = variable side, red = constant side), think-aloud protocol, whiteboard modeling with student as 'teacher'.",
  studentMisconceptions:"Believed you always move the variable to the left side — corrected with examples showing both sides work. Thought the distributive property only applies with parentheses next to numbers, not variables.",
  practiceAssigned:"Khan Academy: Two-step equations (15 problems, aim for 85%+ accuracy). Textbook pg 94 #1–12 odds. One word problem from the worksheet — show all steps.",
  resourcesUsed:"Algebra tiles set, color-coded step-by-step reference card (laminated), Khan Academy, Pearson Algebra 1 textbook Ch. 2",
  homeworkCompletion:"Fully complete",
  effort:"4 – High",
  goalsReviewed:"1. Redo the 5 problems she got wrong on last week's quiz\n2. Complete Khan Academy: one-step equations module\n3. Practice showing all steps even on easy problems",
  goalsMet:"Completed all quiz corrections — got 4/5 right on the redo. Finished Khan Academy module with 91% accuracy. Showed steps on 80% of practice problems — still rushing on the last few.",
  nextWeekGoals:"1. Khan Academy: two-step equations — complete by Thursday (15 problems)\n2. Textbook pg 94 #1–12 odds — show every step\n3. Try the challenge word problem on the worksheet\n4. Come to next session with one question she got wrong to discuss",
  studentCommitment:"I'll do the Khan Academy on Tuesday and the textbook on Thursday. I'll bring my wrong answer to show you.",
  externalNotes:"Sofia had an excellent session today. She is building real confidence with algebra and is starting to catch her own errors. Her effort and preparation are paying off.",
  parentUpdate:"Sofia is making strong progress in algebra. Encourage her to complete her Khan Academy practice by Thursday this week. If she gets stuck, tell her to write down what she tried — that counts as showing work.",
  sessionMode:"In-Person",
  vaktStrategies:[{id:"K_manip",effectiveness:"3",note:"Algebra tiles — clicked immediately"},{id:"V_color",effectiveness:"3",note:"Blue=variable, red=constant — she used it independently"},{id:"A_verbal",effectiveness:"2",note:"Think-aloud helped catch errors"}],
  accuracySkills:[{name:"Two-step equations",attempted:"12",correct:"10",note:"Strong"},{name:"Distributive property",attempted:"8",correct:"5",note:"Still developing"},{name:"Word problems",attempted:"3",correct:"2",note:"Good setup, arithmetic error on #3"}],
  prevAccuracy:"72",
    internalNotes:"Sofia has strong procedural instincts but weak conceptual grounding — she can follow steps but doesn't always know why. Need to build more 'why' reasoning into sessions. Also noticing she gets anxious when she makes mistakes in front of me — work on normalizing errors as data."
};

function TutorForm({coach,onBack}) {
  const [form,setForm]=useState({...initTutor,coachName:coach.name});
  const [vaktStrategies,setVaktStrategies]=useState(initTutor.vaktStrategies||[]);
  const [accuracySkills,setAccuracySkills]=useState(initTutor.accuracySkills||[{'name':'','attempted':'','correct':'','note':''}]);
  const [prevAccuracy,setPrevAccuracy]=useState(initTutor.prevAccuracy||'');
  const [manualFlag,setManualFlag]=useState(false);
  // strategiesHistory: array of arrays of strategy IDs used per session
  // In production, load from persistent store. Demo: simulate 3 sessions.
  const {students,lookupState,lastSession,lookupStudent} = useStudentLookup("tutor");
  // In production, load strategiesHistory from lastSession.strategiesHistory
  const strategiesHistory = lastSession?.strategiesHistory || [['V_color','K_write'],['V_color','K_write','A_verbal'],['V_color','K_write','A_verbal']];

  const applyLastSession = (data) => {
    if (!data) return;
    if (data.overallAccuracy) setPrevAccuracy(data.overallAccuracy);
    if (data.accuracyBySkill?.length) setAccuracySkills(data.accuracyBySkill.map(s=>({...s,note:''})));
    if (data.lastGoals) set('goalsReviewed', data.lastGoals);
    if (data.lastTools) set('tools', data.lastTools);
    if (data.lastSubject) set('subject', data.lastSubject);
  };

  const [tab,setTab]=useState("form");
  const [summary,setSummary]=useState("");
  const [checklist,setChecklist]=useState([]);
  const [familyDraft,setFamilyDraft]=useState("");
  const [schoolDraft,setSchoolDraft]=useState("");
  const [loading,setLoading]=useState("");
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const sub=form.subject==="Other"?(form.subjectOther||"Other"):form.subject;
  const engLabel=ENGAGEMENT.find(e=>e.v===form.engagement)?.l||"";
  const autLabel=AUTONOMY.find(a=>a.v===form.autonomy)?.l||"";
  const autDesc=AUTONOMY.find(a=>a.v===form.autonomy)?.d||"";
  const canGen=!!(form.studentName&&form.mood&&sub);

  const baseData=`
Student: ${form.studentName} | Subject: ${sub} | Date: ${form.sessionDate} | Coach: ${coach.name}
Mood: ${form.mood} | Engagement (internal): ${engLabel} | Autonomy (internal): ${autLabel}
Concepts taught: ${form.conceptsTaught} | Skill gaps identified: ${form.skillGaps}
Methods used: ${form.methodsUsed} | Misconceptions addressed: ${form.studentMisconceptions}
Practice assigned: ${form.practiceAssigned} | Resources: ${form.resourcesUsed}
HW Completion: ${form.homeworkCompletion} | Effort: ${form.effort}
Goals reviewed: ${form.goalsReviewed} | Goals met: ${form.goalsMet}
Next week goals: ${form.nextWeekGoals} | Student commitment: ${form.studentCommitment}
Session mode: ${form.sessionMode}
Accuracy this session: ${accuracySkills.map(s=>s.name+'('+(s.correct||0)+'/'+(s.attempted||0)+')').join(', ')}
Previous session accuracy: ${prevAccuracy}%
VAKT strategies used + effectiveness: ${vaktStrategies.map(s=>{const info=VAKT_STRATEGIES.find(x=>x.id===s.id);return (info?.label||s.id)+': '+(['','Didn\'t connect','Somewhat helpful','Worked well'][s.effectiveness]||'unrated')+(s.note?' — '+s.note:'');}).join('; ')}
External notes: ${form.externalNotes} | Parent update: ${form.parentUpdate}`;

  const gen=async(type)=>{
    setLoading(type);setTab(type);
    const {student,family,school}=makePrompts("tutor",{...form,coachName:coach.name},baseData,{subject:sub});
    try{
      if(type==="summary"){const r=await callClaude(student);const p=r.split("---CHECKLIST---");setSummary(p[0].trim());setChecklist(p[1]?.trim().split("\n").map(l=>l.trim()).filter(l=>l&&!l.startsWith("#"))||[]);}
      if(type==="family")setFamilyDraft(await callClaude(family));
      if(type==="school")setSchoolDraft(await callClaude(school));
    }catch{
      if(type==="summary")setSummary("⚠️ Error");
      if(type==="family")setFamilyDraft("⚠️ Error");
      if(type==="school")setSchoolDraft("⚠️ Error");
    }
    setLoading("");
  };

  const tsvFields=[
    ["Form Type","Tutoring"],
    ["Session Mode",form.sessionMode],
    ["Overall Accuracy %",accuracySkills.reduce((s,sk)=>s+(parseInt(sk.attempted)||0),0)>0?Math.round(accuracySkills.reduce((s,sk)=>s+(parseInt(sk.correct)||0),0)/accuracySkills.reduce((s,sk)=>s+(parseInt(sk.attempted)||0),0)*100)+"%":""],
    ["Previous Accuracy %",prevAccuracy?prevAccuracy+"%":""],
    ["Accuracy by Skill",accuracySkills.map(s=>s.name+"("+s.correct+"/"+s.attempted+")").join("; ")],
    ["VAKT Strategies",vaktStrategies.map(s=>{const i=VAKT_STRATEGIES.find(x=>x.id===s.id);return (i?.label||s.id)+":"+["","✗","~","✓"][s.effectiveness||0]+(s.note?" ("+s.note+")":"");}).join("; ")],
    ["Progress Flagged",manualFlag?"YES — Review Required":"No"],["Export Date",new Date().toLocaleString()],
    ["Student",form.studentName],["Date",form.sessionDate],["Coach",coach.name],
    ["Subject",sub],["Mood",form.mood],["Engagement",engLabel],["Autonomy",autLabel],
    ["Concepts Taught",form.conceptsTaught],["Skill Gaps",form.skillGaps],
    ["Methods Used",form.methodsUsed],["Misconceptions",form.studentMisconceptions],
    ["Practice Assigned",form.practiceAssigned],["Resources",form.resourcesUsed],
    ["HW Completion",form.homeworkCompletion],["Effort",form.effort],
    ["Goals Reviewed",form.goalsReviewed],["Goals Met",form.goalsMet],
    ["Next Week Goals",form.nextWeekGoals],["Student Commitment",form.studentCommitment],
    ["External Notes",form.externalNotes],["Parent Update",form.parentUpdate],
    ["Internal Notes (Private)",form.internalNotes],["AI Summary",summary],
  ];

  return(<>
    <Header coach={coach} formType="tutor" tab={tab} setTab={setTab} onBack={onBack}/>
    <div style={{maxWidth:860,margin:"0 auto",padding:"24px 20px 60px"}}>
      {tab==="form"&&<>
        <SessionInfo form={form} set={set} coachName={coach.name} students={students} lookupState={lookupState} onStudentBlur={name=>lookupStudent(name,applyLastSession)}/>
        <LastSessionBanner lastSession={lastSession} onApply={()=>applyLastSession(lastSession)}/>
        <EngagementSection form={form} set={set}/>
        <VAKTSection strategies={vaktStrategies} setStrategies={setVaktStrategies}/>
        <AccuracySection skills={accuracySkills} setSkills={setAccuracySkills} prevAccuracy={prevAccuracy} setPrevAccuracy={setPrevAccuracy} color="#0891B2" manualFlag={manualFlag} setManualFlag={setManualFlag} strategiesHistory={strategiesHistory}/>
        <Sec title="📚 Tutoring Session Content" color="#0891B2">
          <Fld label="Concepts / Topics Taught This Session" req hint="Be specific — chapter, skill, standard">
            <textarea style={{...TS,minHeight:72}} value={form.conceptsTaught} onChange={e=>set("conceptsTaught",e.target.value)} placeholder="e.g. Solving two-step equations; introduced distributive property with algebra tiles..."/>
          </Fld>
          <Grid>
            <Fld label="Skill Gaps Identified" hint="What does the student not yet understand?">
              <textarea style={TS} value={form.skillGaps} onChange={e=>set("skillGaps",e.target.value)} placeholder="e.g. Confuses negative sign with subtraction; skips checking work..."/>
            </Fld>
            <Fld label="Misconceptions Addressed">
              <textarea style={TS} value={form.studentMisconceptions} onChange={e=>set("studentMisconceptions",e.target.value)} placeholder="e.g. Thought you always add exponents — corrected with examples..."/>
            </Fld>
            <Fld label="Teaching Methods Used" hint="Modeling, worked examples, manipulatives, visual aids, etc.">
              <textarea style={TS} value={form.methodsUsed} onChange={e=>set("methodsUsed",e.target.value)} placeholder="e.g. Algebra tiles, think-aloud, color-coded steps, whiteboard modeling..."/>
            </Fld>
            <Fld label="Practice / Problems Assigned">
              <textarea style={TS} value={form.practiceAssigned} onChange={e=>set("practiceAssigned",e.target.value)} placeholder="e.g. Khan Academy: 2-step equations (10 problems), textbook pg 47 #1–10 odds..."/>
            </Fld>
          </Grid>
          <Fld label="Resources / Materials Used" hint="Textbook, workbook, online tools, handouts">
            <input style={IS} value={form.resourcesUsed} onChange={e=>set("resourcesUsed",e.target.value)} placeholder="e.g. Khan Academy, Amplify Math Ch.4, custom worksheet..."/>
          </Fld>
        </Sec>
        <GoalsSection form={form} set={set}/>
        <NotesSection form={form} set={set}/>
        <GenButtons canGen={canGen} loading={loading} onSummary={()=>gen("summary")} onFamily={()=>gen("family")} onSchool={()=>gen("school")}/>
      </>}
      {tab==="summary"&&<SummaryTab summary={summary} checklist={checklist} loading={loading} form={{...form,coachName:coach.name}} sub={sub} tsv={buildTSV(tsvFields)} onBack={()=>setTab("form")} onRegen={()=>gen("summary")} formTypeLabel="Tutoring"/>}
      {tab==="family"&&<>{loading==="family"?<Spinner emoji="💌" title="Writing Family Email..." sub="One moment..."/>:<EmailDraft value={familyDraft} onChange={setFamilyDraft} color="#0891B2" emptyIcon="💌" emptyTitle="Family Email Not Generated Yet" emptyDesc="Fill out the form and click Family Email." onBack={()=>setTab("form")}/>}</>}
      {tab==="school"&&<>{loading==="school"?<Spinner emoji="🏫" title="Writing School Email..." sub="One moment..."/>:<EmailDraft value={schoolDraft} onChange={setSchoolDraft} color="#7C3AED" emptyIcon="🏫" emptyTitle="School Email Not Generated Yet" emptyDesc="Fill out the form and click School Email." onBack={()=>setTab("form")}/>}</>}
    </div>
  </>);
}

// ════════════════════════════════════════════════════════════
// FORM: EDUCATIONAL THERAPY
// ════════════════════════════════════════════════════════════
const initETHX={
  studentName:"Darius V.",
  sessionDate:"2025-04-12",
  subject:"Reading / ELA",
  subjectOther:"",
  mood:"😐 Neutral",
  engagement:"3",
  autonomy:"developing",
  learningProfile:["Dyslexia","Executive Function Challenges","Anxiety-related Learning Impact"],
  sensoryNeeds:"Needed one movement break at 30 min — walked to water fountain, returned ready to work. Prefers standing at whiteboard over sitting. Fidget cube used throughout — helps him focus.",
  multisensoryApproach:["Auditory (read aloud, verbal rehearsal)","Kinesthetic (manipulatives, movement)","Oral expression","Multisensory reading (Orton-Gillingham)","Visual (color-coding, graphic organizers)"],
  strategiesTaught:"Orton-Gillingham phoneme segmentation with tapping. Sound-symbol correspondence review for consonant blends (bl, cl, fl, gl, pl, sl). Finger tapping for syllable counting. Color-coded syllable types: open syllables in blue, closed in red.",
  skillFocus:"Decoding consonant blends in CVC and CVCC words. Fluency with high-frequency Tier 2 vocabulary from upcoming chapter book. Comprehension monitoring — stopping to ask 'does this make sense?'",
  accommodationsInPlace:"Extended time (1.5x) on all assessments, read-aloud for tests, preferential seating near teacher, reduced writing volume, access to audiobooks via Learning Ally",
  accommodationsNeeded:"Speech-to-text software for longer writing assignments. Permission to submit voice memos instead of written responses for reading responses. Recommend review of IEP goals — current decoding goal may need updating to reflect progress.",
  studentResponse:"Initially flat affect and said 'I hate reading.' Warmed up significantly once we used the whiteboard and tapping — he said 'this is actually kind of fun' by the end. Engaged for the last 25 minutes without prompting.",
  homeworkCompletion:"Partially complete (<50%)",
  effort:"3 – Moderate",
  goalsReviewed:"1. Read 10 minutes aloud at home every day using the tracking sheet\n2. Practice the bl/cl/fl blend flashcards 3x this week\n3. Listen to chapter 4 on Learning Ally before next session",
  goalsMet:"Read aloud 4 of 7 days — mom confirmed with the tracking sheet. Did not practice flashcards. Listened to chapter 4 on Learning Ally — came in knowing what happened.",
  nextWeekGoals:"1. Read aloud at home 5 of 7 days — use the tracking sheet, aim for 10 minutes\n2. Blend flashcard practice — 5 min, 3x this week (Monday, Wednesday, Friday)\n3. Listen to chapter 5 on Learning Ally\n4. Write 2 sentences about chapter 5 using the sentence frame provided",
  studentCommitment:"I'll do the flashcards after dinner on Monday, Wednesday, and Friday. Mom said she'd sit with me.",
  externalNotes:"Darius is making real progress with phoneme awareness and blend decoding. His engagement improved significantly today when we used hands-on, movement-based approaches. He listened to his chapter book independently — a strong sign of growing reading confidence.",
  parentUpdate:"Darius responded really well to the tapping and whiteboard work today. Please continue the daily read-aloud log — even 5–10 minutes counts. For flashcard practice, after-dinner works best per his report. It helps if you sit nearby without jumping in — let him try first.",
  sessionMode:"In-Person",
  vaktStrategies:[{id:"A_readaloud",effectiveness:"2",note:"Read-aloud reduced decoding load"},{id:"K_write",effectiveness:"3",note:"Whiteboard standing — best engagement"},{id:"T_trace",effectiveness:"3",note:"Finger tapping for phoneme segmentation — strong response"},{id:"CRA_C",effectiveness:"3",note:"Concrete letter tiles for blend building"},{id:"V_color",effectiveness:"2",note:"Color syllable types — introduced, needs more practice"}],
  accuracySkills:[{name:"Consonant blend decoding (bl/cl/fl)",attempted:"20",correct:"14",note:"Improved from 8/20 last session"},{name:"High-frequency word recognition",attempted:"15",correct:"11",note:"Sight words building"},{name:"Reading fluency (words/min)",attempted:"1",correct:"1",note:"62 wpm — up from 54 wpm"}],
  prevAccuracy:"45",
    internalNotes:"Darius shows classic dyslexia profile with compounding anxiety — his flat affect at session start is a protective mechanism, not attitude. Orton-Gillingham approach is working. Strong auditory and kinesthetic learner. Need to address writing avoidance more directly — may benefit from speech-to-text trial before next IEP meeting. Flag for parent: current IEP writing goal is too low — should be updated."
};
const MS_APPROACHES=["Visual (color-coding, graphic organizers)","Auditory (read aloud, verbal rehearsal)","Kinesthetic (manipulatives, movement)","Tactile (tracing, building)","Oral expression","Written expression","Drawing/diagramming","Technology-assisted","Multisensory reading (Orton-Gillingham)","CRA (Concrete-Representational-Abstract)"];
const LEARNING_PROFILES=["Dyslexia","Dyscalculia","Dysgraphia","ADHD","Auditory Processing Disorder","Visual Processing Disorder","Executive Function Challenges","Anxiety-related Learning Impact","Twice-Exceptional (2e)","Language Processing Disorder","Other / Multiple"];

function ETHXForm({coach,onBack}) {
  const [form,setForm]=useState({...initETHX,coachName:coach.name});
  const [vaktStrategies,setVaktStrategies]=useState(initETHX.vaktStrategies||[]);
  const [accuracySkills,setAccuracySkills]=useState(initETHX.accuracySkills||[{'name':'','attempted':'','correct':'','note':''}]);
  const [prevAccuracy,setPrevAccuracy]=useState(initETHX.prevAccuracy||'');
  const [manualFlag,setManualFlag]=useState(false);
  // strategiesHistory: array of arrays of strategy IDs used per session
  // In production, load from persistent store. Demo: simulate 3 sessions.
  const {students,lookupState,lastSession,lookupStudent} = useStudentLookup("ethx");
  // In production, load strategiesHistory from lastSession.strategiesHistory
  const strategiesHistory = lastSession?.strategiesHistory || [['V_color','K_write'],['V_color','K_write','A_verbal'],['V_color','K_write','A_verbal']];

  const applyLastSession = (data) => {
    if (!data) return;
    if (data.overallAccuracy) setPrevAccuracy(data.overallAccuracy);
    if (data.accuracyBySkill?.length) setAccuracySkills(data.accuracyBySkill.map(s=>({...s,note:''})));
    if (data.lastGoals) set('goalsReviewed', data.lastGoals);
    if (data.lastTools) set('tools', data.lastTools);
    if (data.lastSubject) set('subject', data.lastSubject);
  };

  const [tab,setTab]=useState("form");
  const [summary,setSummary]=useState("");
  const [checklist,setChecklist]=useState([]);
  const [familyDraft,setFamilyDraft]=useState("");
  const [schoolDraft,setSchoolDraft]=useState("");
  const [loading,setLoading]=useState("");
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const sub=form.subject==="Other"?(form.subjectOther||"Other"):form.subject;
  const engLabel=ENGAGEMENT.find(e=>e.v===form.engagement)?.l||"";
  const autLabel=AUTONOMY.find(a=>a.v===form.autonomy)?.l||"";
  const autDesc=AUTONOMY.find(a=>a.v===form.autonomy)?.d||"";
  const canGen=!!(form.studentName&&form.mood);

  const baseData=`
Student: ${form.studentName} | Subject: ${sub} | Date: ${form.sessionDate} | Coach: ${coach.name}
Mood: ${form.mood} | Engagement (internal): ${engLabel} | Autonomy (internal): ${autLabel}
Learning profile: ${form.learningProfile} | Sensory/regulatory needs: ${form.sensoryNeeds}
Multisensory approaches used: ${form.multisensoryApproach.join(", ")}
Strategies taught: ${form.strategiesTaught} | Skill focus: ${form.skillFocus}
Accommodations in place: ${form.accommodationsInPlace} | Accommodations needed: ${form.accommodationsNeeded}
Student response to session: ${form.studentResponse}
HW Completion: ${form.homeworkCompletion} | Effort: ${form.effort}
Goals reviewed: ${form.goalsReviewed} | Goals met: ${form.goalsMet}
Next week goals: ${form.nextWeekGoals} | Student commitment: ${form.studentCommitment}
Session mode: ${form.sessionMode}
Accuracy this session: ${accuracySkills.map(s=>s.name+'('+(s.correct||0)+'/'+(s.attempted||0)+')').join(', ')}
Previous session accuracy: ${prevAccuracy}%
VAKT strategies used + effectiveness: ${vaktStrategies.map(s=>{const info=VAKT_STRATEGIES.find(x=>x.id===s.id);return (info?.label||s.id)+': '+(['','Didn\'t connect','Somewhat helpful','Worked well'][s.effectiveness]||'unrated')+(s.note?' — '+s.note:'');}).join('; ')}
External notes: ${form.externalNotes} | Parent update: ${form.parentUpdate}`;

  const gen=async(type)=>{
    setLoading(type);setTab(type);
    const {student,family,school}=makePrompts("ethx",{...form,coachName:coach.name},baseData,{subject:sub});
    try{
      if(type==="summary"){const r=await callClaude(student);const p=r.split("---CHECKLIST---");setSummary(p[0].trim());setChecklist(p[1]?.trim().split("\n").map(l=>l.trim()).filter(l=>l&&!l.startsWith("#"))||[]);}
      if(type==="family")setFamilyDraft(await callClaude(family));
      if(type==="school")setSchoolDraft(await callClaude(school));
    }catch{
      if(type==="summary")setSummary("⚠️ Error");
      if(type==="family")setFamilyDraft("⚠️ Error");
      if(type==="school")setSchoolDraft("⚠️ Error");
    }
    setLoading("");
  };

  const tsvFields=[
    ["Form Type","Educational Therapy"],
    ["Session Mode",form.sessionMode],
    ["Overall Accuracy %",accuracySkills.reduce((s,sk)=>s+(parseInt(sk.attempted)||0),0)>0?Math.round(accuracySkills.reduce((s,sk)=>s+(parseInt(sk.correct)||0),0)/accuracySkills.reduce((s,sk)=>s+(parseInt(sk.attempted)||0),0)*100)+"%":""],
    ["Previous Accuracy %",prevAccuracy?prevAccuracy+"%":""],
    ["Accuracy by Skill",accuracySkills.map(s=>s.name+"("+s.correct+"/"+s.attempted+")").join("; ")],
    ["VAKT Strategies",vaktStrategies.map(s=>{const i=VAKT_STRATEGIES.find(x=>x.id===s.id);return (i?.label||s.id)+":"+["","✗","~","✓"][s.effectiveness||0]+(s.note?" ("+s.note+")":"");}).join("; ")],
    ["Progress Flagged",manualFlag?"YES — Review Required":"No"],["Export Date",new Date().toLocaleString()],
    ["Student",form.studentName],["Date",form.sessionDate],["Coach",coach.name],
    ["Subject",sub],["Mood",form.mood],["Engagement",engLabel],["Autonomy",autLabel],
    ["Learning Profile",form.learningProfile],["Sensory Needs",form.sensoryNeeds],
    ["Multisensory Approaches",form.multisensoryApproach],
    ["Strategies Taught",form.strategiesTaught],["Skill Focus",form.skillFocus],
    ["Accommodations In Place",form.accommodationsInPlace],["Accommodations Needed",form.accommodationsNeeded],
    ["Student Response",form.studentResponse],
    ["HW Completion",form.homeworkCompletion],["Effort",form.effort],
    ["Goals Reviewed",form.goalsReviewed],["Goals Met",form.goalsMet],
    ["Next Week Goals",form.nextWeekGoals],["Student Commitment",form.studentCommitment],
    ["External Notes",form.externalNotes],["Parent Update",form.parentUpdate],
    ["Internal Notes (Private)",form.internalNotes],["AI Summary",summary],
  ];

  return(<>
    <Header coach={coach} formType="ethx" tab={tab} setTab={setTab} onBack={onBack}/>
    <div style={{maxWidth:860,margin:"0 auto",padding:"24px 20px 60px"}}>
      {tab==="form"&&<>
        <SessionInfo form={form} set={set} coachName={coach.name} students={students} lookupState={lookupState} onStudentBlur={name=>lookupStudent(name,applyLastSession)}/>
        <LastSessionBanner lastSession={lastSession} onApply={()=>applyLastSession(lastSession)}/>
        <EngagementSection form={form} set={set}/>
        <VAKTSection strategies={vaktStrategies} setStrategies={setVaktStrategies}/>
        <AccuracySection skills={accuracySkills} setSkills={setAccuracySkills} prevAccuracy={prevAccuracy} setPrevAccuracy={setPrevAccuracy} color="#059669" manualFlag={manualFlag} setManualFlag={setManualFlag} strategiesHistory={strategiesHistory}/>
        <Sec title="🌱 Learning Profile & Therapeutic Focus" color="#059669">
          <Fld label="Learning Profile / Areas of Impact" hint="Select all relevant">
            <Chips options={LEARNING_PROFILES} value={form.learningProfile} onChange={v=>set("learningProfile",v)} multi/>
          </Fld>
          <Grid>
            <Fld label="Sensory / Regulatory Needs Observed" hint="Fidgets, movement breaks, sensory sensitivities, self-regulation moments">
              <textarea style={TS} value={form.sensoryNeeds} onChange={e=>set("sensoryNeeds",e.target.value)} placeholder="e.g. Needed 2 movement breaks; preferred standing at whiteboard..."/>
            </Fld>
            <Fld label="Student Response to Today\'s Session" hint="Emotional, behavioral, engagement observations">
              <textarea style={TS} value={form.studentResponse} onChange={e=>set("studentResponse",e.target.value)} placeholder="e.g. Initially resistant but engaged fully once we used manipulatives..."/>
            </Fld>
          </Grid>
          <Fld label="Multisensory Approaches Used This Session" hint="Select all used">
            <Chips options={MS_APPROACHES} value={form.multisensoryApproach} onChange={v=>set("multisensoryApproach",v)} multi/>
          </Fld>
          <Grid>
            <Fld label="Strategies / Techniques Taught">
              <textarea style={TS} value={form.strategiesTaught} onChange={e=>set("strategiesTaught",e.target.value)} placeholder="e.g. Orton-Gillingham phoneme blending, self-monitoring checklist..."/>
            </Fld>
            <Fld label="Specific Skill Focus This Session">
              <textarea style={TS} value={form.skillFocus} onChange={e=>set("skillFocus",e.target.value)} placeholder="e.g. Decoding consonant blends, paragraph organization..."/>
            </Fld>
          </Grid>
        </Sec>
        <Sec title="📋 Accommodations" color="#0891B2">
          <Grid>
            <Fld label="Accommodations Currently In Place" hint="IEP, 504, or informal">
              <textarea style={TS} value={form.accommodationsInPlace} onChange={e=>set("accommodationsInPlace",e.target.value)} placeholder="e.g. Extended time, preferential seating, read-aloud for tests..."/>
            </Fld>
            <Fld label="Additional Accommodations Recommended">
              <textarea style={TS} value={form.accommodationsNeeded} onChange={e=>set("accommodationsNeeded",e.target.value)} placeholder="e.g. Access to audio books, permission to type vs. handwrite, graphic organizer templates..."/>
            </Fld>
          </Grid>
        </Sec>
        <GoalsSection form={form} set={set}/>
        <NotesSection form={form} set={set}/>
        <GenButtons canGen={canGen} loading={loading} onSummary={()=>gen("summary")} onFamily={()=>gen("family")} onSchool={()=>gen("school")}/>
      </>}
      {tab==="summary"&&<SummaryTab summary={summary} checklist={checklist} loading={loading} form={{...form,coachName:coach.name}} sub={sub} tsv={buildTSV(tsvFields)} onBack={()=>setTab("form")} onRegen={()=>gen("summary")} formTypeLabel="Educational Therapy"/>}
      {tab==="family"&&<>{loading==="family"?<Spinner emoji="💌" title="Writing Family Email..." sub="One moment..."/>:<EmailDraft value={familyDraft} onChange={setFamilyDraft} color="#0891B2" emptyIcon="💌" emptyTitle="Family Email Not Generated Yet" emptyDesc="Fill out the form and click Family Email." onBack={()=>setTab("form")}/>}</>}
      {tab==="school"&&<>{loading==="school"?<Spinner emoji="🏫" title="Writing School Email..." sub="One moment..."/>:<EmailDraft value={schoolDraft} onChange={setSchoolDraft} color="#7C3AED" emptyIcon="🏫" emptyTitle="School Email Not Generated Yet" emptyDesc="Fill out the form and click School Email." onBack={()=>setTab("form")}/>}</>}
    </div>
  </>);
}

// ════════════════════════════════════════════════════════════
// FORM: TEST PREP
// ════════════════════════════════════════════════════════════
const initPrep={
  studentName:"Amara T.",
  sessionDate:"2025-04-12",
  mood:"😊 Good",
  engagement:"4",
  autonomy:"approaching",
  testType:"ISEE – Upper Level",
  testDate:"2025-05-17",
  sectionFocus:["Verbal Reasoning","Reading Comprehension"],
  currentScore:"Stanine 4 overall — Verbal: Stanine 3, Reading: Stanine 4, Math: Stanine 5",
  targetScore:"Stanine 6+ overall, Verbal: Stanine 5+",
  sectionScores:"Verbal Reasoning: Stanine 3 (synonyms strong, sentence completion weak)\nReading Comprehension: Stanine 4 (literal strong, inference weak)\nQuantitative Reasoning: Stanine 5\nMath Achievement: Stanine 5",
  drillsCompleted:"20 ISEE synonym questions — 75% accuracy (improved from 60% last week). 15 sentence completion questions — 60% accuracy (identifying root words helping). 2 timed reading passages — answered 8/10 literal, 4/6 inference questions correctly.",
  errorPatterns:"On sentence completion: guesses when she doesn't know a word instead of using elimination. On reading inference: goes back to text but chooses too literally — misses implied meaning. Under time pressure in last 5 questions, accuracy drops to ~45%.",
  testStrategiesTaught:"Root word decoding for unfamiliar vocabulary (Latin/Greek roots: bene, mal, port, rupt). Process of elimination — cross out 2 clearly wrong answers first, then choose between remaining. Inference strategy: 'what is the author suggesting, not just saying?' — look for tone words.",
  practiceAssigned:"ISEE Prep Book: Verbal Ch. 4 — synonym drill (25 questions). Root word flashcards — 10 new roots (list provided). 1 full timed reading passage with inference questions from the practice test PDF. Review wrong answers before next session.",
  homeworkCompletion:"Mostly complete (50–80%)",
  effort:"4 – High",
  goalsReviewed:"1. Complete Verbal Ch. 3 synonym drill (20 questions)\n2. Review 8 Latin root words from last session\n3. Do 1 timed reading passage independently",
  goalsMet:"Completed synonym drill — 80% accuracy. Reviewed root words — knew 6 of 8 on quiz. Did 1 timed passage but ran over time by 4 minutes.",
  nextWeekGoals:"1. Verbal Ch. 4 synonym drill — 25 questions, track accuracy\n2. Root word flashcards — 10 new roots, 5 min daily\n3. 1 full timed reading passage — strict 25-minute timer, note which inference questions tripped her up\n4. Review wrong answers and write one sentence explaining why the right answer is correct",
  studentCommitment:"I'll do the reading passage on Wednesday with a real timer this time. Flashcards every morning while I eat breakfast.",
  externalNotes:"Amara is making consistent progress — her synonym accuracy improved from 60% to 75% in two weeks. She is building strong test strategy habits and her confidence is growing. Test date is May 17th — we are on track.",
  parentUpdate:"Amara is working hard and making real gains in verbal reasoning — her weakest section. Please make sure she has a quiet spot for her Wednesday timed reading practice with no interruptions. The 25-minute timer is important. Flashcard review at breakfast is a great routine — keep encouraging it.",
  sessionMode:"Online",
  vaktStrategies:[{id:"V_color",effectiveness:"3",note:"Color-coded elimination crosses — she adopted immediately"},{id:"A_verbal",effectiveness:"3",note:"Saying root words aloud + meaning — strong recall"},{id:"V_diagram",effectiveness:"2",note:"Passage annotation map — helpful for inference"}],
  accuracySkills:[{name:"Synonym questions",attempted:"20",correct:"15",note:"Up from 12/20 last week"},{name:"Sentence completion",attempted:"15",correct:"9",note:"Root word strategy helping"},{name:"Reading inference",attempted:"6",correct:"4",note:"Improvement — was 2/6"},{name:"Reading literal",attempted:"10",correct:"9",note:"Strong"}],
  prevAccuracy:"60",
    internalNotes:"Amara is a strong math student who underestimates herself in verbal. Confidence issue more than ability issue — her errors are strategy errors, not comprehension gaps. Key focus: elimination strategy and inference inference. With 5 weeks to test, realistic target is Stanine 5 verbal. Stanine 6 is possible with consistent practice. Parent is highly involved — good, but needs to avoid adding test pressure. Coach parent on keeping conversations focused on effort, not score."
};

function PrepForm({coach,onBack}) {
  const [form,setForm]=useState({...initPrep,coachName:coach.name});
  const [vaktStrategies,setVaktStrategies]=useState(initPrep.vaktStrategies||[]);
  const [accuracySkills,setAccuracySkills]=useState(initPrep.accuracySkills||[{'name':'','attempted':'','correct':'','note':''}]);
  const [prevAccuracy,setPrevAccuracy]=useState(initPrep.prevAccuracy||'');
  const [manualFlag,setManualFlag]=useState(false);
  // strategiesHistory: array of arrays of strategy IDs used per session
  // In production, load from persistent store. Demo: simulate 3 sessions.
  const {students,lookupState,lastSession,lookupStudent} = useStudentLookup("prep");
  // In production, load strategiesHistory from lastSession.strategiesHistory
  const strategiesHistory = lastSession?.strategiesHistory || [['V_color','K_write'],['V_color','K_write','A_verbal'],['V_color','K_write','A_verbal']];

  const applyLastSession = (data) => {
    if (!data) return;
    if (data.overallAccuracy) setPrevAccuracy(data.overallAccuracy);
    if (data.accuracyBySkill?.length) setAccuracySkills(data.accuracyBySkill.map(s=>({...s,note:''})));
    if (data.lastGoals) set('goalsReviewed', data.lastGoals);
    if (data.lastTools) set('tools', data.lastTools);
    if (data.lastSubject) set('subject', data.lastSubject);
  };

  const [tab,setTab]=useState("form");
  const [summary,setSummary]=useState("");
  const [checklist,setChecklist]=useState([]);
  const [familyDraft,setFamilyDraft]=useState("");
  const [schoolDraft,setSchoolDraft]=useState("");
  const [loading,setLoading]=useState("");
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const engLabel=ENGAGEMENT.find(e=>e.v===form.engagement)?.l||"";
  const autLabel=AUTONOMY.find(a=>a.v===form.autonomy)?.l||"";
  const autDesc=AUTONOMY.find(a=>a.v===form.autonomy)?.d||"";
  const sectionOptions=form.testType.startsWith("SAT")||form.testType==="PSAT"?SAT_SECTIONS:form.testType.startsWith("ISEE")?ISEE_SECTIONS:ISEE_SECTIONS;
  const canGen=!!(form.studentName&&form.mood&&form.testType);

  const baseData=`
Student: ${form.studentName} | Test: ${form.testType} | Test Date: ${form.testDate} | Date: ${form.sessionDate} | Coach: ${coach.name}
Mood: ${form.mood} | Engagement (internal): ${engLabel} | Autonomy (internal): ${autLabel}
Section focus: ${form.sectionFocus.join(", ")}
Current score/level: ${form.currentScore} | Target score: ${form.targetScore}
Section scores/levels: ${form.sectionScores}
Drills completed: ${form.drillsCompleted} | Error patterns: ${form.errorPatterns}
Test strategies taught: ${form.testStrategiesTaught} | Practice assigned: ${form.practiceAssigned}
HW Completion: ${form.homeworkCompletion} | Effort: ${form.effort}
Goals reviewed: ${form.goalsReviewed} | Goals met: ${form.goalsMet}
Next week goals: ${form.nextWeekGoals} | Student commitment: ${form.studentCommitment}
Session mode: ${form.sessionMode}
Accuracy this session: ${accuracySkills.map(s=>s.name+'('+(s.correct||0)+'/'+(s.attempted||0)+')').join(', ')}
Previous session accuracy: ${prevAccuracy}%
VAKT strategies used + effectiveness: ${vaktStrategies.map(s=>{const info=VAKT_STRATEGIES.find(x=>x.id===s.id);return (info?.label||s.id)+': '+(['','Didn\'t connect','Somewhat helpful','Worked well'][s.effectiveness]||'unrated')+(s.note?' — '+s.note:'');}).join('; ')}
External notes: ${form.externalNotes} | Parent update: ${form.parentUpdate}`;

  const gen=async(type)=>{
    setLoading(type);setTab(type);
    const {student,family,school}=makePrompts("prep",{...form,coachName:coach.name},baseData,{subject:form.testType});
    try{
      if(type==="summary"){const r=await callClaude(student);const p=r.split("---CHECKLIST---");setSummary(p[0].trim());setChecklist(p[1]?.trim().split("\n").map(l=>l.trim()).filter(l=>l&&!l.startsWith("#"))||[]);}
      if(type==="family")setFamilyDraft(await callClaude(family));
      if(type==="school")setSchoolDraft(await callClaude(school));
    }catch{
      if(type==="summary")setSummary("⚠️ Error");
      if(type==="family")setFamilyDraft("⚠️ Error");
      if(type==="school")setSchoolDraft("⚠️ Error");
    }
    setLoading("");
  };

  const tsvFields=[
    ["Form Type","Test Prep"],
    ["Session Mode",form.sessionMode],
    ["Overall Accuracy %",accuracySkills.reduce((s,sk)=>s+(parseInt(sk.attempted)||0),0)>0?Math.round(accuracySkills.reduce((s,sk)=>s+(parseInt(sk.correct)||0),0)/accuracySkills.reduce((s,sk)=>s+(parseInt(sk.attempted)||0),0)*100)+"%":""],
    ["Previous Accuracy %",prevAccuracy?prevAccuracy+"%":""],
    ["Accuracy by Skill",accuracySkills.map(s=>s.name+"("+s.correct+"/"+s.attempted+")").join("; ")],
    ["VAKT Strategies",vaktStrategies.map(s=>{const i=VAKT_STRATEGIES.find(x=>x.id===s.id);return (i?.label||s.id)+":"+["","✗","~","✓"][s.effectiveness||0]+(s.note?" ("+s.note+")":"");}).join("; ")],
    ["Progress Flagged",manualFlag?"YES — Review Required":"No"],["Export Date",new Date().toLocaleString()],
    ["Student",form.studentName],["Date",form.sessionDate],["Coach",coach.name],
    ["Test Type",form.testType],["Test Date",form.testDate],
    ["Mood",form.mood],["Engagement",engLabel],["Autonomy",autLabel],
    ["Section Focus",form.sectionFocus],["Current Score",form.currentScore],
    ["Target Score",form.targetScore],["Section Scores",form.sectionScores],
    ["Drills Completed",form.drillsCompleted],["Error Patterns",form.errorPatterns],
    ["Strategies Taught",form.testStrategiesTaught],["Practice Assigned",form.practiceAssigned],
    ["HW Completion",form.homeworkCompletion],["Effort",form.effort],
    ["Goals Reviewed",form.goalsReviewed],["Goals Met",form.goalsMet],
    ["Next Week Goals",form.nextWeekGoals],["Student Commitment",form.studentCommitment],
    ["External Notes",form.externalNotes],["Parent Update",form.parentUpdate],
    ["Internal Notes (Private)",form.internalNotes],["AI Summary",summary],
  ];

  return(<>
    <Header coach={coach} formType="prep" tab={tab} setTab={setTab} onBack={onBack}/>
    <div style={{maxWidth:860,margin:"0 auto",padding:"24px 20px 60px"}}>
      {tab==="form"&&<>
        <SessionInfo form={form} set={set} coachName={coach.name} showSubject={false} students={students} lookupState={lookupState} onStudentBlur={name=>lookupStudent(name,applyLastSession)}/>
        <LastSessionBanner lastSession={lastSession} onApply={()=>applyLastSession(lastSession)}/>
        <EngagementSection form={form} set={set}/>
        <VAKTSection strategies={vaktStrategies} setStrategies={setVaktStrategies}/>
        <AccuracySection skills={accuracySkills} setSkills={setAccuracySkills} prevAccuracy={prevAccuracy} setPrevAccuracy={setPrevAccuracy} color="#7C3AED" manualFlag={manualFlag} setManualFlag={setManualFlag} strategiesHistory={strategiesHistory}/>
        <Sec title="✏️ Test Prep Details" color="#7C3AED">
          <Grid>
            <Fld label="Test Type" req>
              <select style={SS} value={form.testType} onChange={e=>{set("testType",e.target.value);set("sectionFocus",[]);}}>
                <option value="">Select test...</option>
                {TEST_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </Fld>
            <Fld label="Upcoming Test Date" hint="If scheduled">
              <input type="date" style={IS} value={form.testDate} onChange={e=>set("testDate",e.target.value)}/>
            </Fld>
            <Fld label="Current Overall Score / Level" hint="Baseline or most recent">
              <input style={IS} value={form.currentScore} onChange={e=>set("currentScore",e.target.value)} placeholder="e.g. 800 / 2400, Stanine 4, Level 2..."/>
            </Fld>
            <Fld label="Target Score / Level">
              <input style={IS} value={form.targetScore} onChange={e=>set("targetScore",e.target.value)} placeholder="e.g. 900+, Stanine 6, Top 25%..."/>
            </Fld>
          </Grid>
          {form.testType&&<Fld label="Section Focus This Session" hint="Select all sections worked on">
            <Chips options={sectionOptions} value={form.sectionFocus} onChange={v=>set("sectionFocus",v)} multi/>
          </Fld>}
          <Fld label="Section Scores / Performance Levels" hint="Current levels by section — for tracking progress">
            <textarea style={{...TS,minHeight:68}} value={form.sectionScores} onChange={e=>set("sectionScores",e.target.value)} placeholder="e.g. Verbal Reasoning: Stanine 3 | Math Achievement: Stanine 5 | Reading: Stanine 4..."/>
          </Fld>
          <Grid>
            <Fld label="Drills / Practice Completed in Session">
              <textarea style={TS} value={form.drillsCompleted} onChange={e=>set("drillsCompleted",e.target.value)} placeholder="e.g. 15 synonym questions (85% accuracy), 10 math grid-ins, timed reading passage..."/>
            </Fld>
            <Fld label="Error Patterns Identified" hint="Recurring mistake types or weak areas">
              <textarea style={TS} value={form.errorPatterns} onChange={e=>set("errorPatterns",e.target.value)} placeholder="e.g. Misreads question stem under time pressure; rushes multiple-choice in last 5 min..."/>
            </Fld>
            <Fld label="Test Strategies Taught">
              <textarea style={TS} value={form.testStrategiesTaught} onChange={e=>set("testStrategiesTaught",e.target.value)} placeholder="e.g. Process of elimination, plugging in numbers, annotation strategy for reading..."/>
            </Fld>
            <Fld label="Independent Practice Assigned">
              <textarea style={TS} value={form.practiceAssigned} onChange={e=>set("practiceAssigned",e.target.value)} placeholder="e.g. ISEE Prep Book: Verbal Ch.3 (20 questions), 1 timed reading passage..."/>
            </Fld>
          </Grid>
        </Sec>
        <GoalsSection form={form} set={set}/>
        <NotesSection form={form} set={set}/>
        <GenButtons canGen={canGen} loading={loading} onSummary={()=>gen("summary")} onFamily={()=>gen("family")} onSchool={()=>gen("school")}/>
      </>}
      {tab==="summary"&&<SummaryTab summary={summary} checklist={checklist} loading={loading} form={{...form,coachName:coach.name}} sub={form.testType} tsv={buildTSV(tsvFields)} onBack={()=>setTab("form")} onRegen={()=>gen("summary")} formTypeLabel="Test Prep"/>}
      {tab==="family"&&<>{loading==="family"?<Spinner emoji="💌" title="Writing Family Email..." sub="One moment..."/>:<EmailDraft value={familyDraft} onChange={setFamilyDraft} color="#0891B2" emptyIcon="💌" emptyTitle="Family Email Not Generated Yet" emptyDesc="Fill out the form and click Family Email." onBack={()=>setTab("form")}/>}</>}
      {tab==="school"&&<>{loading==="school"?<Spinner emoji="🏫" title="Writing School Email..." sub="One moment..."/>:<EmailDraft value={schoolDraft} onChange={setSchoolDraft} color="#7C3AED" emptyIcon="🏫" emptyTitle="School Email Not Generated Yet" emptyDesc="Fill out the form and click School Email." onBack={()=>setTab("form")}/>}</>}
    </div>
  </>);
}

// ════════════════════════════════════════════════════════════
// SHARED SUMMARY TAB
// ════════════════════════════════════════════════════════════
function SummaryTab({summary,checklist,loading,form,sub,tsv,onBack,onRegen,formTypeLabel}) {
  const [showPrint,setShowPrint]=useState(false);
  const [inclHeaders,setInclHeaders]=useState(false);
  const renderMD=text=>text.split("\n").map((line,i)=>{
    if(line.startsWith("## ")) return <h3 key={i} style={{color:B.deep,fontFamily:"'Lexend',sans-serif",marginTop:18,marginBottom:5,fontSize:15}}>{line.replace("## ","")}</h3>;
    if(line.match(/^\d+\./)) return <div key={i} style={{display:"flex",gap:10,padding:"6px 0",borderBottom:"1px solid #F1F5F9",alignItems:"flex-start"}}>
      <div style={{width:22,height:22,background:B.deep,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:10,fontWeight:700,flexShrink:0,marginTop:1}}>{line.match(/^(\d+)/)[1]}</div>
      <div style={{fontFamily:"'Inter',sans-serif",fontSize:14,lineHeight:1.6,color:"#334155",flex:1}}>{line.replace(/^\d+\.\s*/,"")}</div>
    </div>;
    if(line.startsWith("- ")) return <div key={i} style={{padding:"3px 0 3px 8px",fontFamily:"'Inter',sans-serif",fontSize:14,lineHeight:1.6,color:"#334155"}}>• {line.slice(2)}</div>;
    if(line.trim()==="") return <div key={i} style={{height:7}}/>;
    return <p key={i} style={{margin:"3px 0",fontFamily:"'Inter',sans-serif",fontSize:14,lineHeight:1.65,color:"#334155"}}>{line}</p>;
  });

  if(loading==="summary") return <Spinner emoji="✨" title={`Building ${form.studentName}\'s Plan...`} sub="Crafting personalized action steps and checklist"/>;
  if(!summary) return <EmptyTab emoji="🌟" title="Student Plan Not Generated Yet" sub="Fill out the form and click Generate Student Action Plan." onClick={onBack}/>;
  return(<>
    <div style={{background:B.deep,borderRadius:16,padding:"16px 22px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
      <div>
        <div style={{fontFamily:"'Lexend',sans-serif",color:B.yellow,fontSize:18}}>{form.studentName}\'s Weekly Plan</div>
        <div style={{fontFamily:"'Inter',sans-serif",color:B.sky,fontSize:12,marginTop:2}}>{form.sessionDate}{sub?" · "+sub:""} · {formTypeLabel} · Coach: {form.coachName}</div>
      </div>
      <button onClick={onRegen} style={{padding:"7px 14px",borderRadius:8,border:`1.5px solid ${B.sky}55`,background:"transparent",color:B.sky,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>🔄 Regenerate</button>
    </div>
    <div style={{background:B.white,borderRadius:16,border:`2px solid ${B.sky}`,padding:"24px 28px",boxShadow:"0 8px 24px #89CFF018",marginBottom:16}}>
      {renderMD(summary)}
    </div>
    {checklist.length>0&&<div style={{background:B.white,borderRadius:16,border:`2px solid ${B.gold}`,padding:"20px 26px",marginBottom:16}}>
      <div style={{fontFamily:"'Lexend',sans-serif",fontSize:13,color:B.deep,marginBottom:12,letterSpacing:"0.04em"}}>📋 MY WEEKLY CHECKLIST</div>
      {checklist.map((item,i)=>(
        <label key={i} style={{display:"flex",gap:11,alignItems:"flex-start",padding:"8px 0",borderBottom:i<checklist.length-1?"1px solid #F1F5F9":"none",cursor:"pointer"}}>
          <input type="checkbox" style={{width:17,height:17,accentColor:B.deep,marginTop:2,flexShrink:0}}/>
          <span style={{fontFamily:"'Inter',sans-serif",fontSize:14,lineHeight:1.55,color:"#334155"}}>{item}</span>
        </label>
      ))}
    </div>}
    <button onClick={()=>openPDF(form.studentName,form.sessionDate,form.coachName,sub,summary,checklist,formTypeLabel)} style={{width:"100%",padding:"13px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${B.gold},#F59E0B)`,color:B.deep,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"'Inter',sans-serif",marginBottom:10,boxShadow:"0 4px 14px #FFB70328"}}>
      📄 Open PDF / Print Preview
    </button>
    <div style={{background:"#FFFBEB",borderRadius:10,border:`1px solid ${B.gold}44`,padding:"9px 14px",fontFamily:"'Inter',sans-serif",fontSize:12,color:"#92400E",marginBottom:14}}>
      💡 In the PDF preview → click <strong>Print / Save PDF</strong> → choose <strong>Save as PDF</strong> in your print dialog to download and email to student.
    </div>
    <div style={{background:"#F0F9FF",border:`1px solid ${B.sky}`,borderRadius:13,padding:"13px 16px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,flexWrap:"wrap",gap:8}}>
        <div style={{fontFamily:"'Lexend',sans-serif",fontSize:13,color:B.deep}}>📊 Google Sheets Export</div>
        <div style={{display:"flex",alignItems:"center",gap:8,background:"white",border:"1px solid #E2E8F0",borderRadius:8,padding:"5px 10px"}}>
          <span style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:"#64748B"}}>Include column headers?</span>
          <button onClick={()=>setInclHeaders(v=>!v)} style={{padding:"3px 12px",borderRadius:6,border:"none",background:inclHeaders?B.deep:"#E2E8F0",color:inclHeaders?"white":"#64748B",fontFamily:"'Inter',sans-serif",fontSize:11,fontWeight:700,cursor:"pointer",transition:"all 0.15s"}}>
            {inclHeaders?"Yes — first session":"No — add to existing"}
          </button>
        </div>
      </div>
      <div style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:"#475569",marginBottom:8,lineHeight:1.5}}>
        {inclHeaders
          ? <span>First time? <strong>Include headers ON</strong> — paste into cell A1 to set up your sheet with column names.</span>
          : <span>Returning student? <strong>Headers OFF</strong> — click the first empty row in your sheet → paste. Data only, no duplicate headers.</span>}
      </div>
      <textarea readOnly onClick={e=>e.target.select()} style={{width:"100%",minHeight:62,padding:"8px 11px",fontFamily:"monospace",fontSize:11,borderRadius:8,border:"1px solid #CBD5E1",background:"white",color:"#1a1a2e",boxSizing:"border-box",resize:"vertical",cursor:"text"}}
        value={inclHeaders ? tsv : tsv.split("\n").slice(1).join("\n")}/>
      <div style={{fontFamily:"'Inter',sans-serif",fontSize:11,color:"#94A3B8",marginTop:4}}>Tab-separated — splits into columns automatically.</div>
    </div>
    <button onClick={onBack} style={{marginTop:12,width:"100%",padding:"12px",borderRadius:12,border:`2px solid ${B.deep}`,background:"transparent",color:B.deep,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>← Back to Form</button>
  </>);
}

// ════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ════════════════════════════════════════════════════════════
function Login({onLogin}) {
  const [name,setName]=useState("");
  const [pass,setPass]=useState("");
  const [err,setErr]=useState("");
  const [showPass,setShowPass]=useState(false);

  const attempt=()=>{
    const coach=COACHES.find(c=>c.name===name&&c.password===pass);
    if(coach){setErr("");onLogin(coach);}
    else setErr("Incorrect name or password. Please try again.");
  };

  return(
    <div style={{minHeight:"100vh",background:`linear-gradient(160deg,${B.deep} 0%,#1e40af 60%,#1d4ed8 100%)`,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:420}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <img src={LOGO_B64} alt="Rise In Confidence" style={{height:72,width:"auto",marginBottom:18}}/>
          <div style={{fontFamily:"'Lexend',sans-serif",color:B.yellow,fontSize:14,letterSpacing:"0.08em",textTransform:"uppercase"}}>Coach Portal</div>
          <div style={{fontFamily:"'Inter',sans-serif",color:"rgba(255,255,255,0.5)",fontSize:13,marginTop:4}}>Sign in to access your session forms</div>
        </div>
        <div style={{background:"rgba(255,255,255,0.07)",backdropFilter:"blur(12px)",borderRadius:20,border:"1px solid rgba(255,255,255,0.12)",padding:"32px 28px"}}>
          <div style={{marginBottom:18}}>
            <label style={{display:"block",fontFamily:"'Inter',sans-serif",fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.75)",marginBottom:6}}>Your Name</label>
            <select value={name} onChange={e=>setName(e.target.value)} style={{width:"100%",padding:"11px 14px",borderRadius:10,border:"1px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.1)",color:name?"white":"rgba(255,255,255,0.45)",fontFamily:"'Inter',sans-serif",fontSize:14,outline:"none",cursor:"pointer"}}>
              <option value="">Select your name...</option>
              {COACHES.map(c=><option key={c.name} value={c.name} style={{color:B.deep,background:"white"}}>{c.name}</option>)}
            </select>
          </div>
          <div style={{marginBottom:22}}>
            <label style={{display:"block",fontFamily:"'Inter',sans-serif",fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.75)",marginBottom:6}}>Password</label>
            <div style={{position:"relative"}}>
              <input type={showPass?"text":"password"} value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&attempt()} placeholder="Enter your password" style={{width:"100%",padding:"11px 44px 11px 14px",borderRadius:10,border:"1px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.1)",color:"white",fontFamily:"'Inter',sans-serif",fontSize:14,outline:"none",boxSizing:"border-box"}}/>
              <button onClick={()=>setShowPass(v=>!v)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.5)",fontSize:16,padding:0}}>
                {showPass?"🙈":"👁️"}
              </button>
            </div>
          </div>
          {err&&<div style={{background:"rgba(239,68,68,0.2)",border:"1px solid rgba(239,68,68,0.4)",borderRadius:8,padding:"9px 13px",fontFamily:"'Inter',sans-serif",fontSize:13,color:"#FCA5A5",marginBottom:16}}>{err}</div>}
          <button onClick={attempt} style={{width:"100%",padding:"13px",borderRadius:11,border:"none",background:`linear-gradient(135deg,${B.yellow},${B.gold})`,color:B.deep,fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"'Inter',sans-serif",boxShadow:"0 6px 20px rgba(255,215,0,0.3)"}}>
            Sign In →
          </button>
          <div style={{textAlign:"center",marginTop:16,fontFamily:"'Inter',sans-serif",fontSize:12,color:"rgba(255,255,255,0.35)"}}>
            Secure · For authorized Rise In Confidence coaches only
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// DASHBOARD
// ════════════════════════════════════════════════════════════
function Dashboard({coach,onSelect,onLogout}) {
  const today=new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#EEF4FF,#F0F9FF)"}}>
      <div style={{background:B.deep,padding:"20px 0",boxShadow:"0 4px 20px #1E3A8A44"}}>
        <div style={{maxWidth:860,margin:"0 auto",padding:"0 20px",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
          <img src={LOGO_B64} alt="Rise In Confidence" style={{height:44,width:"auto"}}/>
          <div style={{width:1,height:32,background:"rgba(137,207,240,0.25)",margin:"0 4px"}}/>
          <div>
            <div style={{fontFamily:"'Inter',sans-serif",color:B.sky,fontSize:11,letterSpacing:"0.06em",textTransform:"uppercase",fontWeight:600}}>Coach Portal</div>
            <div style={{fontFamily:"'Inter',sans-serif",color:"rgba(255,255,255,0.5)",fontSize:11}}>Rise In Confidence</div>
          </div>
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:12}}>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:"'Lexend',sans-serif",color:B.white,fontSize:14}}>{coach.name}</div>
              <div style={{fontFamily:"'Inter',sans-serif",color:B.sky,fontSize:11}}>{coach.role}</div>
            </div>
            <button onClick={onLogout} style={{padding:"6px 14px",borderRadius:8,border:"1px solid rgba(137,207,240,0.3)",background:"transparent",color:B.sky,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600}}>Sign Out</button>
          </div>
        </div>
      </div>
      <div style={{maxWidth:860,margin:"0 auto",padding:"36px 20px 60px"}}>
        <div style={{marginBottom:32}}>
          <div style={{fontFamily:"'Lexend',sans-serif",fontSize:26,color:B.deep,marginBottom:6}}>Good {new Date().getHours()<12?"Morning":new Date().getHours()<17?"Afternoon":"Evening"}, {coach.name.split(" ")[0]}! 👋</div>
          <div style={{fontFamily:"'Inter',sans-serif",fontSize:14,color:"#64748B"}}>{today} · Select a session type to begin</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:18}}>
          {FORM_TYPES.map(ft=>(
            <div key={ft.id} onClick={()=>onSelect(ft.id)} style={{background:B.white,borderRadius:18,border:`2px solid ${ft.color}22`,padding:"28px 24px",cursor:"pointer",transition:"all 0.2s",boxShadow:`0 4px 20px ${ft.color}12`}}
              onMouseEnter={e=>{e.currentTarget.style.border=`2px solid ${ft.color}`;e.currentTarget.style.boxShadow=`0 8px 32px ${ft.color}28`;e.currentTarget.style.transform="translateY(-2px)";}}
              onMouseLeave={e=>{e.currentTarget.style.border=`2px solid ${ft.color}22`;e.currentTarget.style.boxShadow=`0 4px 20px ${ft.color}12`;e.currentTarget.style.transform="translateY(0)";}}>
              <div style={{fontSize:36,marginBottom:14}}>{ft.icon}</div>
              <div style={{fontFamily:"'Lexend',sans-serif",fontSize:18,color:B.deep,marginBottom:6}}>{ft.label}</div>
              <div style={{fontFamily:"'Inter',sans-serif",fontSize:13,color:"#64748B",lineHeight:1.5,marginBottom:16}}>{ft.desc}</div>
              <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"7px 16px",borderRadius:20,background:ft.color,color:"white",fontFamily:"'Inter',sans-serif",fontSize:12,fontWeight:700}}>
                Start Session →
              </div>
            </div>
          ))}
        </div>
        <div style={{marginTop:32,background:B.white,borderRadius:14,border:`1px solid ${B.sky}44`,padding:"18px 22px"}}>
          <div style={{fontFamily:"'Lexend',sans-serif",fontSize:13,color:B.deep,marginBottom:8}}>📊 After Each Session</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
            {[["🌟 Student Plan","Generate a personalized AI action plan + checklist PDF to email the student"],["👨‍👩‍👧 Family Email","Short, task-focused weekly update ready to copy-paste"],["🏫 School Email","Professional teacher/IEP team note ready to send"]].map(([t,d])=>(
              <div key={t} style={{background:"#F8FAFF",borderRadius:10,padding:"12px 14px"}}>
                <div style={{fontFamily:"'Inter',sans-serif",fontSize:13,fontWeight:700,color:B.deep,marginBottom:4}}>{t}</div>
                <div style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:"#64748B",lineHeight:1.5}}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// ROOT APP
// ════════════════════════════════════════════════════════════
function App() {
  const [coach,setCoach]=useState(null);
  const [activeForm,setActiveForm]=useState(null);
  if(!coach) return <Login onLogin={c=>{setCoach(c);setActiveForm(null);}}/>;
  if(!activeForm) return <Dashboard coach={coach} onSelect={setActiveForm} onLogout={()=>{setCoach(null);setActiveForm(null);}}/>;
  const back=()=>setActiveForm(null);
  if(activeForm==="ef")    return <EFForm    coach={coach} onBack={back}/>;
  if(activeForm==="tutor") return <TutorForm coach={coach} onBack={back}/>;
  if(activeForm==="ethx")  return <ETHXForm  coach={coach} onBack={back}/>;
  if(activeForm==="prep")  return <PrepForm  coach={coach} onBack={back}/>;
  return null;
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(App));
