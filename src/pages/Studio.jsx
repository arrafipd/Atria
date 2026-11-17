import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Code, Copy, Download, FloppyDisk, Layers, Palette, Plus, SquaresFour, Stack, Trash, X, Eye } from '@phosphor-icons/react';
import './studio.css';

const starterElements = [
 {id:'el-1',type:'Button',name:'Primary button',text:'Get started',bg:'#242420',color:'#FFFFFF',border:'#242420',radius:8,padding:12,fontSize:14,borderWidth:1},
 {id:'el-2',type:'Card',name:'Feature card',text:'A thoughtful system',bg:'#FFFFFF',color:'#242420',border:'#E3E1DB',radius:12,padding:20,fontSize:15,borderWidth:1},
 {id:'el-3',type:'Badge',name:'Status badge',text:'Stable',bg:'#EDF4EA',color:'#45633B',border:'#CBDCC4',radius:999,padding:7,fontSize:12,borderWidth:1}
];
const componentTypes = [
 {type:'Button',group:'Actions',hint:'Primary and secondary actions'},
 {type:'Text field',group:'Forms',hint:'Text input with a label'},
 {type:'Checkbox',group:'Forms',hint:'Single boolean option'},
 {type:'Switch',group:'Forms',hint:'Toggle a setting'},
 {type:'Badge',group:'Feedback',hint:'Compact status label'},
 {type:'Alert',group:'Feedback',hint:'Contextual message'},
 {type:'Card',group:'Layout',hint:'Container for related content'},
 {type:'Navbar',group:'Navigation',hint:'Horizontal navigation'},
 {type:'Sidebar',group:'Navigation',hint:'Vertical navigation'},
 {type:'Avatar',group:'Identity',hint:'User identity marker'}
];
const palettes = [
 {name:'Neutral',colors:['#242420','#55534F','#99958D','#D5D1C8','#EEECE7']},
 {name:'Ocean',colors:['#102A43','#176B87','#2CA6A4','#B8E3DF','#F2F8F7']},
 {name:'Botanical',colors:['#193B2D','#547A52','#9DB89A','#D6E5D2','#F5F4EA']},
 {name:'Golden hour',colors:['#3B2525','#B6533C','#E99A70','#F2C66D','#FFF3DC']},
 {name:'Berry',colors:['#3B1F3A','#783B68','#B85C83','#E8B7C8','#FAF0F3']},
 {name:'Electric',colors:['#161625','#3857F5','#22C7D6','#D7F35B','#F7F8FC']},
 {name:'Lavender',colors:['#29233D','#65558F','#9B8BC7','#D9D1EF','#F5F2FC']},
 {name:'Clay',colors:['#49352D','#A85D43','#C98768','#E6CDB2','#F5EBDD']}
];
const starterTokens = [
 {name:'color.brand.primary',value:'#315FCE',kind:'color'},
 {name:'color.text.primary',value:'#242420',kind:'color'},
 {name:'color.surface.default',value:'#FFFFFF',kind:'color'},
 {name:'color.border.default',value:'#E3E1DB',kind:'color'},
 {name:'space.1',value:'4px',kind:'dimension'},
 {name:'space.2',value:'8px',kind:'dimension'},
 {name:'space.4',value:'16px',kind:'dimension'},
 {name:'space.6',value:'24px',kind:'dimension'},
 {name:'radius.sm',value:'4px',kind:'dimension'},
 {name:'radius.md',value:'8px',kind:'dimension'},
 {name:'radius.lg',value:'12px',kind:'dimension'},
 {name:'font.size.body',value:'14px',kind:'dimension'}
];
const safeRead=(key,fallback)=>{try{const value=localStorage.getItem(key);return value?JSON.parse(value):fallback}catch{return fallback}};
const freshElement=(type,index)=>({id:'el-'+Date.now()+'-'+index,type,name:type+' '+(index+1),text:type==='Button'?'New button':type==='Text field'?'Enter your email':type==='Badge'?'New status':type,bg:type==='Badge'?'#EDF4EA':'#FFFFFF',color:type==='Badge'?'#45633B':'#242420',border:'#E3E1DB',radius:type==='Badge'?999:8,padding:12,fontSize:14,borderWidth:1});

function PreviewElement({item,selected,onClick}){
 const shared={boxSizing:'border-box',fontFamily:'Inter, Manrope, system-ui, sans-serif',fontSize:item.fontSize,color:item.color,border:item.borderWidth+'px solid '+item.border,borderRadius:item.radius,background:item.bg,padding:item.padding+'px 16px',cursor:'pointer',maxWidth:'100%'};
 const focus=selected?'0 0 0 2px #315FCE, 0 0 0 5px #315FCE22':'none';
 if(item.type==='Button')return <button onClick={onClick} style={{...shared,boxShadow:focus,fontWeight:650}}>{item.text}</button>;
 if(item.type==='Text field')return <label onClick={onClick} style={{display:'grid',gap:7,width:260,fontSize:12,color:'#77756F'}}><span>{item.name}</span><input readOnly placeholder={item.text} style={{...shared,width:'100%',boxShadow:focus,background:'#fff'}}/></label>;
 if(item.type==='Checkbox')return <label onClick={onClick} style={{display:'flex',alignItems:'center',gap:9,fontSize:13,color:item.color,outline:selected?'2px solid #315FCE':'none',outlineOffset:4}}><input type="checkbox" defaultChecked style={{accentColor:'#315FCE'}}/>{item.text}</label>;
 if(item.type==='Switch')return <label onClick={onClick} style={{display:'flex',alignItems:'center',gap:12,fontSize:13,color:item.color,outline:selected?'2px solid #315FCE':'none',outlineOffset:4}}><input type="checkbox" role="switch" defaultChecked style={{accentColor:'#315FCE',width:38,height:20}}/>{item.text}</label>;
 if(item.type==='Badge')return <span onClick={onClick} style={{...shared,display:'inline-flex',alignItems:'center',borderRadius:999,padding:'7px 11px',boxShadow:focus,fontWeight:650}}>{item.text}</span>;
 if(item.type==='Alert')return <div onClick={onClick} role="status" style={{...shared,width:300,boxShadow:focus}}><strong>{item.name}</strong><div style={{marginTop:4,opacity:.75}}>{item.text}</div></div>;
 if(item.type==='Card')return <article onClick={onClick} style={{...shared,width:270,minHeight:130,boxShadow:focus}}><strong style={{display:'block',marginBottom:8}}>{item.text}</strong><p style={{margin:0,opacity:.7,lineHeight:1.6,fontSize:12}}>A reusable surface for grouping content, context and actions.</p></article>;
 if(item.type==='Navbar')return <nav onClick={onClick} style={{...shared,width:420,display:'flex',alignItems:'center',gap:18,boxShadow:focus}}><strong>Brand</strong><span style={{marginLeft:'auto',fontSize:12}}>Product　Resources　About</span></nav>;
 if(item.type==='Sidebar')return <aside onClick={onClick} style={{...shared,width:190,display:'grid',gap:10,boxShadow:focus}}><strong>{item.text}</strong>{['Overview','Projects','Components','Settings'].map((x,i)=><span key={x} style={{padding:8,background:i===0?'#F0EFEB':'transparent',borderRadius:5,fontSize:12}}>{x}</span>)}</aside>;
 return <div onClick={onClick} style={{...shared,display:'inline-flex',alignItems:'center',gap:10,boxShadow:focus}}><span style={{width:28,height:28,borderRadius:99,background:'#D5D1C8',display:'grid',placeItems:'center',fontSize:10}}>SN</span>{item.text}</div>;
}

export default function Studio(){
 const [elements,setElements]=useState(()=>safeRead('atria:builder:elements',starterElements));
 const [tokens,setTokens]=useState(()=>safeRead('atria:builder:tokens',starterTokens));
 const [activePanel,setActivePanel]=useState('Add');
 const [selectedId,setSelectedId]=useState('el-1');
 const [exportOpen,setExportOpen]=useState(false);
 const [format,setFormat]=useState('React');
 const [copied,setCopied]=useState(false);
 const [saved,setSaved]=useState(false);
 const [canvasName,setCanvasName]=useState(()=>safeRead('atria:builder:name','Untitled design system'));
 const selected=elements.find(item=>item.id===selectedId)||elements[0];
 const updateSelected=patch=>setElements(old=>old.map(item=>item.id===selectedId?{...item,...patch}:item));
 const addElement=type=>{const item=freshElement(type,elements.length);setElements(old=>[...old,item]);setSelectedId(item.id);setActivePanel('Layers')};
 const updateToken=(index,patch)=>setTokens(old=>old.map((token,i)=>i===index?{...token,...patch}:token));
 const addToken=()=>setTokens(old=>[...old,{name:'color.new.token',value:'#8A78C5',kind:'color'}]);
 const removeElement=id=>{const next=elements.filter(item=>item.id!==id);setElements(next);if(selectedId===id)setSelectedId(next[0]?.id||'')};
 const saveWorkspace=()=>{localStorage.setItem('atria:builder:elements',JSON.stringify(elements));localStorage.setItem('atria:builder:tokens',JSON.stringify(tokens));localStorage.setItem('atria:builder:name',JSON.stringify(canvasName));setSaved(true);window.setTimeout(()=>setSaved(false),1600)};
 const applyPalette=palette=>{if(selected)updateSelected({bg:palette.colors[4],color:palette.colors[0],border:palette.colors[2]});setTokens(old=>old.map(token=>token.name==='color.brand.primary'?{...token,value:palette.colors[1]}:token))};
 const exportText=useMemo(()=>{
  if(format==='Tokens')return JSON.stringify({name:canvasName,tokens},null,2);
  if(format==='CSS')return ':root {\\n'+tokens.map(t=>'  --'+t.name.replaceAll('.','-')+': '+t.value+';').join('\\n')+'\\n}\\n';
  if(format==='HTML')return elements.map(item=>'<!-- '+item.name+' -->\\n<div class="atria-'+item.type.toLowerCase().replaceAll(' ','-')+'">'+item.text+'</div>').join('\\n\\n');
  return elements.map(item=>{const name=item.type.replace(/[^a-z0-9]/gi,'')+'Component';return 'export function '+name+'() {\\n  return <div style={{ background: "'+item.bg+'", color: "'+item.color+'", border: "'+item.borderWidth+'px solid '+item.border+'", borderRadius: "'+item.radius+'px", padding: "'+item.padding+'px 16px" }}>'+item.text+'</div>;\\n}'}).join('\\n\\n');
 },[format,canvasName,tokens,elements]);
 const copyExport=async()=>{try{await navigator.clipboard.writeText(exportText);setCopied(true);window.setTimeout(()=>setCopied(false),1400)}catch{}};
 const downloadExport=()=>{const ext=format==='Tokens'?'json':format==='React'?'jsx':format==='HTML'?'html':'css';const url=URL.createObjectURL(new Blob([exportText],{type:'text/plain'}));const anchor=document.createElement('a');anchor.href=url;anchor.download='atria-design-system.'+ext;anchor.click();URL.revokeObjectURL(url)};
 const onDrop=event=>{event.preventDefault();const type=event.dataTransfer.getData('text/atria-component');if(type)addElement(type)};
 const panelItems=[{id:'Add',label:'Add',icon:<Plus size={15}/>},{id:'Layers',label:'Layers',icon:<Layers size={15}/>},{id:'Tokens',label:'Tokens',icon:<Stack size={15}/>},{id:'Palettes',label:'Palettes',icon:<Palette size={15}/>}];
 return <div className="atria-builder">
  <header className="builder-topbar">
   <div className="builder-brand-wrap"><Link to="/" className="builder-back"><ArrowLeft size={15}/> Atria</Link><span className="builder-top-divider"/><div className="builder-wordmark"><span className="brand-mark"><span/><span/><span/><span/></span> atria<span>.</span></div><span className="builder-context">/ STUDIO</span></div>
   <div className="builder-project-name"><input aria-label="Design system name" value={canvasName} onChange={e=>setCanvasName(e.target.value)}/></div>
   <div className="builder-actions"><Link to="/explore" className="builder-explore-link">Explore library <ArrowLeft size={13}/></Link><button className="builder-save" onClick={saveWorkspace}>{saved?<Check size={15}/>:<FloppyDisk size={15}/>} {saved?'Saved':'Save'}</button><button className="builder-export" onClick={()=>setExportOpen(v=>!v)}><Code size={15}/> Export</button></div>
  </header>
  <div className="builder-shell">
   <aside className="builder-left">
    <div className="builder-panel-tabs">{panelItems.map(item=><button key={item.id} className={activePanel===item.id?'active':''} onClick={()=>setActivePanel(item.id)}>{item.icon}<span>{item.label}</span></button>)}</div>
    {activePanel==='Add'&&<div className="builder-panel-content"><div className="builder-section-title"><span>COMPONENTS</span><small>{componentTypes.length} ITEMS</small></div>
     {['Actions','Forms','Feedback','Layout','Navigation','Identity'].map(group=><section className="builder-component-group" key={group}><h3>{group}</h3><div className="builder-component-list">{componentTypes.filter(item=>item.group===group).map(item=><button key={item.type} draggable onDragStart={event=>event.dataTransfer.setData('text/atria-component',item.type)} onClick={()=>addElement(item.type)}><span className="builder-component-glyph">{item.type.slice(0,1)}</span><span><strong>{item.type}</strong><small>{item.hint}</small></span><Plus size={14}/></button>)}</div></section>)}
    </div>}
    {activePanel==='Layers'&&<div className="builder-panel-content"><div className="builder-section-title"><span>LAYERS</span><small>{elements.length} ITEMS</small></div>{elements.length===0&&<p className="builder-empty">Add a component to start building.</p>}
     {elements.map((item,index)=><div className={'builder-layer '+(selectedId===item.id?'selected':'')} key={item.id}><button className="builder-layer-select" onClick={()=>setSelectedId(item.id)}><span className="builder-layer-index">{String(index+1).padStart(2,'0')}</span><span><strong>{item.name}</strong><small>{item.type}</small></span></button><button className="builder-icon-button" aria-label={'Delete '+item.name} onClick={()=>removeElement(item.id)}><Trash size={14}/></button></div>)}
     <button className="builder-add-inline" onClick={()=>setActivePanel('Add')}><Plus size={14}/> Add component</button>
    </div>}
    {activePanel==='Tokens'&&<div className="builder-panel-content"><div className="builder-section-title"><span>DESIGN TOKENS</span><button onClick={addToken}><Plus size={13}/> Add</button></div>{tokens.map((token,index)=><div className="builder-token-row" key={token.name+index}><div><strong>{token.name}</strong><small>{token.kind}</small></div>{token.kind==='color'?<input aria-label={token.name} type="color" value={token.value} onChange={e=>updateToken(index,{value:e.target.value})}/>:<input aria-label={token.name} value={token.value} onChange={e=>updateToken(index,{value:e.target.value})}/>}</div>)}</div>}
    {activePanel==='Palettes'&&<div className="builder-panel-content"><div className="builder-section-title"><span>COLOR PALETTES</span><small>{palettes.length} SETS</small></div>{palettes.map(palette=><button className="builder-palette" key={palette.name} onClick={()=>applyPalette(palette)}><span>{palette.colors.map(color=><i key={color} style={{background:color}}/>)}</span><strong>{palette.name}</strong><small>Apply to selection</small></button>)}</div>}
   </aside>
   <main className="builder-workspace">
    <div className="builder-workspace-head"><div><span>CANVAS</span><strong>{elements.length} components</strong></div><div className="builder-canvas-tools"><span><Eye size={14}/> Live preview</span><span>100%</span></div></div>
    <div className="builder-canvas-scroll" onDragOver={event=>event.preventDefault()} onDrop={onDrop}><div className="builder-artboard"><div className="builder-artboard-head"><span>{canvasName||'Untitled design system'}</span><small>COMPONENT PLAYGROUND</small></div>
     {elements.length===0?<div className="builder-drop-empty"><SquaresFour size={28}/><strong>Your canvas is empty</strong><span>Choose a component from the left panel or drag it here.</span></div>:<div className="builder-canvas-elements">{elements.map(item=><div key={item.id} className="builder-canvas-element"><button className={'builder-element-name '+(selectedId===item.id?'active':'')} onClick={()=>setSelectedId(item.id)}>{item.name}</button><PreviewElement item={item} selected={selectedId===item.id} onClick={()=>setSelectedId(item.id)}/></div>)}</div>}
     <div className="builder-artboard-foot"><span>ATRIA / DESIGN SYSTEM</span><span>{elements.length} ELEMENTS</span></div>
    </div></div><div className="builder-workspace-foot"><span>LOCAL WORKSPACE</span><span>Changes are saved in this browser when you click Save</span></div>
   </main>
   <aside className="builder-right">
    <div className="builder-inspector-head"><div><span>INSPECTOR</span><strong>{selected?selected.name:'No selection'}</strong></div>{selected&&<button className="builder-icon-button" aria-label="Delete selected component" onClick={()=>removeElement(selected.id)}><Trash size={15}/></button>}</div>
    {selected?<div className="builder-inspector-content">
     <section className="builder-inspector-section"><h3>Content</h3><label className="builder-input-label">Layer name<input value={selected.name} onChange={e=>updateSelected({name:e.target.value})}/></label><label className="builder-input-label">Text / label<input value={selected.text} onChange={e=>updateSelected({text:e.target.value})}/></label></section>
     <section className="builder-inspector-section"><h3>Appearance</h3>
      <label className="builder-color-field">Background <span><input type="color" value={selected.bg} onChange={e=>updateSelected({bg:e.target.value})}/><input value={selected.bg} onChange={e=>updateSelected({bg:e.target.value})}/></span></label>
      <label className="builder-color-field">Text <span><input type="color" value={selected.color} onChange={e=>updateSelected({color:e.target.value})}/><input value={selected.color} onChange={e=>updateSelected({color:e.target.value})}/></span></label>
      <label className="builder-color-field">Border <span><input type="color" value={selected.border} onChange={e=>updateSelected({border:e.target.value})}/><input value={selected.border} onChange={e=>updateSelected({border:e.target.value})}/></span></label>
      <label className="builder-range-label">Radius <strong>{selected.radius}px</strong><input type="range" min="0" max="40" value={Math.min(selected.radius,40)} onChange={e=>updateSelected({radius:Number(e.target.value)})}/></label>
      <label className="builder-range-label">Padding <strong>{selected.padding}px</strong><input type="range" min="4" max="32" value={selected.padding} onChange={e=>updateSelected({padding:Number(e.target.value)})}/></label>
      <label className="builder-range-label">Font size <strong>{selected.fontSize}px</strong><input type="range" min="10" max="24" value={selected.fontSize} onChange={e=>updateSelected({fontSize:Number(e.target.value)})}/></label>
      <label className="builder-range-label">Border width <strong>{selected.borderWidth}px</strong><input type="range" min="0" max="4" value={selected.borderWidth} onChange={e=>updateSelected({borderWidth:Number(e.target.value)})}/></label>
     </section>
     <section className="builder-inspector-section"><h3>Quick values</h3><div className="builder-radius-presets">{[0,4,8,12,20,999].map(value=><button key={value} className={selected.radius===value?'active':''} onClick={()=>updateSelected({radius:value})}>{value===999?'Pill':value}</button>)}</div></section>
     <button className="builder-delete-button" onClick={()=>removeElement(selected.id)}><Trash size={14}/> Remove component</button>
    </div>:<p className="builder-empty">Select a component on the canvas or add one from the library.</p>}
   </aside>
  </div>
  {exportOpen&&<div className="builder-export-backdrop" onClick={()=>setExportOpen(false)}><section className="builder-export-dialog" onClick={event=>event.stopPropagation()}><div className="builder-export-head"><div><span>DEVELOPER HANDOFF</span><h2>Export your system</h2></div><button onClick={()=>setExportOpen(false)} aria-label="Close export"><X size={18}/></button></div><div className="builder-export-formats">{['React','CSS','HTML','Tokens'].map(item=><button key={item} className={format===item?'active':''} onClick={()=>setFormat(item)}>{item}</button>)}</div><pre className="builder-export-code">{exportText}</pre><div className="builder-export-actions"><button onClick={copyExport}>{copied?<Check size={15}/>:<Copy size={15}/>} {copied?'Copied':'Copy code'}</button><button onClick={downloadExport}><Download size={15}/> Download</button></div></section></div>}
 </div>;
}
