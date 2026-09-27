import React, {useRef} from 'react';

type MagicCardProps={children:React.ReactNode;className?:string;onClick?:()=>void};

/** Adapted from 21st.dev Magic UI Magic Card: pointer spotlight + illuminated border. */
export function MagicCard({children,className='',onClick}:MagicCardProps){
 const ref=useRef<HTMLDivElement>(null);
 function move(event:React.PointerEvent<HTMLDivElement>){
  if(event.pointerType==='touch'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const rect=ref.current?.getBoundingClientRect();if(!rect)return;
  ref.current?.style.setProperty('--magic-x',`${event.clientX-rect.left}px`);
  ref.current?.style.setProperty('--magic-y',`${event.clientY-rect.top}px`);
 }
 return <div ref={ref} className={`magicCard ${className}`} onPointerMove={move} onClick={onClick}>{children}</div>
}
