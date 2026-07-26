import Header from "./Header";import Footer from "./Footer";
export default function SiteShell({children}:{children:React.ReactNode}){return <div className="site-shell"><Header/><main>{children}</main><Footer/></div>}
