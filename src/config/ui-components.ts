export const uiComponentRegistry = [
  {name:'Animated Hero Section UI', source:'21st.dev', sourceUrl:'https://21st.dev/community/components/uniquesonu/animated-hero-section-ui/default', purpose:'Home hero reveal and subtle background lines', dependencies:['CSS'], reason:'Strong hierarchy with lightweight opacity/transform motion; adapted to ShadowTm tokens.'},
  {name:'Navbar components', source:'21st.dev', sourceUrl:'https://21st.dev/community/components/s/navbar', purpose:'Responsive navigation reference', dependencies:['CSS'], reason:'Glass-on-scroll behavior without a heavy 3D dependency.'},
  {name:'Dashboard components', source:'21st.dev', sourceUrl:'https://21st.dev/community/components/s/dashboard', purpose:'Stats, sidebar and admin data layout', dependencies:['CSS','lucide-react'], reason:'Dense information layout adapted to the infrastructure theme.'},
  {name:'Custom product cards', source:'21st.dev inspiration', sourceUrl:'NOT FOUND', purpose:'Server and fund products', dependencies:['CSS'], reason:'No single source matched both compact specs and demo status needs; custom component created.'},
  {name:'Custom preloader', source:'21st.dev inspiration', sourceUrl:'NOT FOUND', purpose:'Initial application load', dependencies:['CSS'], reason:'A CSS-only reveal keeps the first load fast and respects reduced motion.'}
] as const;
