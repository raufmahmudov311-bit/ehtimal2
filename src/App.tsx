import {useEffect,useState} from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import {L} from './data'
const M=({t,b}:{t:string;b?:boolean})=><span dangerouslySetInnerHTML={{__html:katex.renderToString(t,{displayMode:b,throwOnError:false})}}/>
type S={done:number[];last:number;scores:number[];wrong:number[];exam:string}
const init:S={done:[],last:-1,scores:[],wrong:[],exam:''}
const load=():S=>{try{return {...init,...JSON.parse(localStorage.getItem('ea')||'{}')}}catch{return init}}
const C=(n:number,k:number)=>{let r=1;for(let i=1;i<=k;i++)r=r*(n-k+i)/i;return r}
const f4=(x:number)=>x.toFixed(4).replace('.',',')
type V='home'|'lab'|'quiz'|'formulas'|number

function Lab(){
 const [n,setN]=useState(10),[p,setP]=useState(0.3),[k,setK]=useState(3),[m,setM]=useState(4),[q,setQ]=useState(0.95)
 const kk=Math.min(k,n),pr=(i:number)=>C(n,i)*p**i*(1-p)**(n-i)
 const ps=Array.from({length:n+1},(_,i)=>pr(i)),mx=Math.max(...ps)
 const k0=ps.indexOf(mx),w=300/(n+1)
 return <div className="grid">
 <section className="card"><h2>Bernoulli sınağı</h2>
 <label>n = {n}<input type="range" min={1} max={30} value={n} onChange={e=>setN(+e.target.value)}/></label>
 <label>p = {p}<input type="range" min={0.05} max={0.95} step={0.05} value={p} onChange={e=>setP(+e.target.value)}/></label>
 <label>k = {kk}<input type="range" min={0} max={n} value={kk} onChange={e=>setK(+e.target.value)}/></label>
 <svg viewBox="0 0 300 120" role="img" aria-label="Bernoulli paylanması">{ps.map((v,i)=><rect key={i} x={i*w+1} y={110-100*v/mx} width={Math.max(w-2,1)} height={100*v/mx} className={i===kk?'bar sel':'bar'}/>)}</svg>
 <p><M t={`P_{${n}}(${kk})=${f4(pr(kk))}`}/></p><p>Ən ehtimallı say k₀ = <b>{k0}</b> (ehtimal {f4(mx)})</p></section>
 <section className="card"><h2>Sensor etibarlılığı</h2>
 <label>Sensor sayı = {m}<input type="range" min={1} max={10} value={m} onChange={e=>setM(+e.target.value)}/></label>
 <label>Hər sensorun etibarlılığı = {q}<input type="range" min={0.5} max={0.99} step={0.01} value={q} onChange={e=>setQ(+e.target.value)}/></label>
 <p>Ardıcıl (hamısı işləməlidir): <b>{f4(q**m)}</b></p><p>Paralel (biri kifayətdir): <b>{f4(1-(1-q)**m)}</b></p>
 <p className="muted">Ardıcıl sxemdə sensor artdıqca etibarlılıq azalır, paralel sxemdə artır.</p></section></div>
}

function Quiz({st,save}:{st:S;save:(s:S)=>void}){
 const [i,setI]=useState(0),[sel,setSel]=useState<number|null>(null),[ans,setAns]=useState<number[]>([]),[end,setEnd]=useState(false)
 if(end){const sc=ans.filter(Boolean).length;const wr=L.map((_,j)=>j).filter(j=>!ans[j])
  return <div className="card"><h2>Nəticə: {sc*10} bal / 100</h2><p>Düzgün: {sc}/10</p>
  <p>{wr.length?'Zəif mövzular: '+wr.map(j=>(j+1)+'. '+L[j].t).join('; '):'Bütün cavablar düzgündür.'}</p>
  <button onClick={()=>{save({...st,scores:[...st.scores,sc*10],wrong:wr});setI(0);setSel(null);setAns([]);setEnd(false)}}>Nəticəni saxla və yenidən başla</button></div>}
 const x=L[i].quiz
 return <div className="card"><h2>Sual {i+1}/10</h2><p>{x.q}</p>
 {x.o.map((o,j)=><button key={j} className={'opt'+(sel!==null?(j===x.a?' ok':j===sel?' no':''):'')} disabled={sel!==null} onClick={()=>{setSel(j);const a=[...ans];a[i]=j===x.a?1:0;setAns(a)}}>{o}</button>)}
 {sel!==null&&<><p>{sel===x.a?'Düzgündür.':'Yanlışdır.'} Həll: {L[i].ex.steps[0]} Cavab nümunəsi dərsdə: {L[i].t}.</p>
 <button onClick={()=>{if(i===9)setEnd(true);else{setI(i+1);setSel(null)}}}>{i===9?'Nəticəyə bax':'Növbəti sual'}</button></>}
 {st.scores.length>0&&<p className="muted">Son nəticələr: {st.scores.slice(-5).join(', ')}</p>}</div>
}

export default function App(){
 const [v,setV]=useState<V>('home'),[st,setSt]=useState<S>(load),[dark,setDark]=useState(matchMedia('(prefers-color-scheme: dark)').matches)
 useEffect(()=>{document.documentElement.dataset.theme=dark?'dark':'light'},[dark])
 const save=(s:S)=>{setSt(s);try{localStorage.setItem('ea',JSON.stringify(s))}catch{}}
 const go=(x:V)=>{setV(x);if(typeof x==='number')save({...st,last:x});scrollTo(0,0)}
 const pct=Math.round(st.done.length*10)
 const days=st.exam?Math.ceil((+new Date(st.exam)-Date.now())/864e5):null
 return <div className="app"><header><b onClick={()=>go('home')} className="logo">Ehtimal Akademiyası</b>
 <nav>{(['home','lab','quiz','formulas'] as const).map(x=><button key={x} className={v===x?'on':''} onClick={()=>go(x)}>{{home:'Ana səhifə',lab:'Laboratoriya',quiz:'İmtahan rejimi',formulas:'Düsturlar'}[x]}</button>)}
 <button onClick={()=>setDark(!dark)} aria-label="Tema">{dark?'Açıq':'Tünd'}</button></nav></header><main>
 {v==='home'&&<><h1>Kollokvium: mövzu 1–10</h1>
 <div className="grid"><div className="card"><h3>İrəliləyiş</h3><div className="bar0"><i style={{width:pct+'%'}}/></div><p>{pct}% ({st.done.length}/10 dərs)</p>
 {st.last>=0&&<button onClick={()=>go(st.last)}>Davam et: {L[st.last].t}</button>}</div>
 <div className="card"><h3>İmtahana qalan vaxt</h3><input type="date" value={st.exam} onChange={e=>save({...st,exam:e.target.value})}/><p>{days===null?'Tarixi seçin.':days>=0?days+' gün':'İmtahan keçib.'}</p></div></div>
 <h2>Dərslər</h2><div className="list">{L.map((l,i)=><button key={i} className="row" onClick={()=>go(i)}><span>{i+1}. {l.t}</span><span>{st.done.includes(i)?'Tamamlandı':'Başla'}</span></button>)}</div></>}
 {typeof v==='number'&&(()=>{const l=L[v];return <article><h1>{v+1}. {l.t}</h1><h3>Nəzəriyyə</h3><p>{l.theory}</p>
 <h3>Düsturlar</h3>{l.f.map(f=><div key={f.n}><b>{f.n}</b><div className="fm"><M t={f.l} b/></div></div>)}<p>{l.sym}</p>
 <h3>Həll olunmuş nümunə</h3><div className="card"><p>{l.ex.q}</p><ol>{l.ex.steps.map((s,i)=><li key={i}>{s}</li>)}</ol><p><b>Cavab: {l.ex.a}</b></p></div>
 <h3>Ən çox edilən səhv</h3><p>{l.err}</p><h3>Mühəndislik əlaqəsi</h3><p>{l.eng}</p>
 <div className="nav"><button disabled={v===0} onClick={()=>go(v-1)}>Əvvəlki</button>
 <button onClick={()=>save({...st,done:Array.from(new Set([...st.done,v]))})}>{st.done.includes(v)?'Tamamlanıb':'Dərsi tamamla'}</button>
 <button disabled={v===9} onClick={()=>go(v+1)}>Növbəti</button></div></article>})()}
 {v==='lab'&&<><h1>Mühəndislik laboratoriyası</h1><Lab/></>}
 {v==='quiz'&&<><h1>İmtahan rejimi</h1><Quiz st={st} save={save}/></>}
 {v==='formulas'&&<><h1>Düsturlar kitabxanası</h1>{L.map((l,i)=>l.f.map(f=><div className="card" key={i+f.n}><b>{i+1}. {f.n}</b><div className="fm"><M t={f.l} b/></div><p className="muted">{l.sym}</p></div>))}</>}
 </main></div>
}
