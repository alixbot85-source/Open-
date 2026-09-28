import React from 'react';
import {Link,useLocation} from 'react-router-dom';
import {Home,KeyRound,Server,WalletCards,LayoutDashboard} from 'lucide-react';

/** Adapted from Victor Welander's Expandable Tabs on 21st.dev. */
export function ProductDock(){const {pathname}=useLocation();const items=[['/','Home',Home],['/license.php','Licenses',KeyRound],['/server.php','Servers',Server],['/offledger.php','Resources',WalletCards],['/dashboard','Workspace',LayoutDashboard]] as const;return <nav className="productDock" aria-label="Quick navigation">{items.map(([to,label,Icon])=>{const active=to==='/'?pathname==='/':pathname.includes(to.replace('.php',''));return <Link to={to} className={active?'active':''} key={to} aria-label={label}><Icon/><span>{label}</span>{active&&<i/>}</Link>})}</nav>}
