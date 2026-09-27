import React from 'react';
import {Link} from 'react-router-dom';
import {ArrowRight} from 'lucide-react';

type Props={to:string;children:React.ReactNode;className?:string;secondary?:boolean};

/** Adapted from Origin UI's verified animated-arrow button. */
export function AnimatedLink({to,children,className='',secondary=false}:Props){return <Link to={to} className={`animatedLink ${secondary?'animatedLinkSecondary':''} ${className}`}><span>{children}</span><i><ArrowRight aria-hidden="true"/></i></Link>}
