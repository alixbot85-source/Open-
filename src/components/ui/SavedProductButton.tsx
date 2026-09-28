import React,{useEffect,useState} from 'react';
import {Heart} from 'lucide-react';
export type SavedProduct={id:string;type:'license'|'server'|'fund';name:string;detail:string;price:string;url:string};
const key='shadowtm-saved-products';
export function readSaved():SavedProduct[]{try{return JSON.parse(localStorage.getItem(key)||'[]')}catch{return []}}
export function SavedProductButton({product}:{product:SavedProduct}){const [saved,setSaved]=useState(false);useEffect(()=>setSaved(readSaved().some(x=>x.id===product.id)),[product.id]);function toggle(){const items=readSaved(),next=items.some(x=>x.id===product.id)?items.filter(x=>x.id!==product.id):[product,...items];localStorage.setItem(key,JSON.stringify(next));setSaved(next.some(x=>x.id===product.id));window.dispatchEvent(new Event('saved-products-change'))}return <button className={`saveProduct ${saved?'saved':''}`} onClick={toggle} aria-label={saved?'Remove from saved products':'Save product'} aria-pressed={saved}><Heart/></button>}
