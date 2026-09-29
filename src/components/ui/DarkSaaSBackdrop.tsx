import type {ReactNode} from 'react';

/**
 * Adapted for this project after inspecting 21st.dev's Elegant Dark Pattern.
 * Source: https://21st.dev/@jatin-yadav05/components/elegant-dark-pattern
 * The original preview has no listed runtime dependency; this version is CSS-only.
 */
export function DarkSaaSBackdrop({children}:{children:ReactNode}){
  return <div className="saasRoot"><div className="saasBackdrop" aria-hidden="true"><i/><i/><i/><span/></div>{children}</div>;
}

/**
 * Compact shared surface used by storefront, checkout, and management screens.
 * The metric hierarchy was adapted after inspecting:
 * https://21st.dev/@ravikatiyar162/components/card-10
 * Its original dependency is framer-motion. We intentionally use no count-up
 * animation and no extra dependency so reduced-motion and bundle size stay sane.
 */
export function SaaSSurface({children,className=''}:{children:ReactNode;className?:string}){
  return <div className={`saasSurface ${className}`.trim()}>{children}</div>;
}
