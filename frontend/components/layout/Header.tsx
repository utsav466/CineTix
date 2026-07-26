import Link from "next/link";

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="site-logo">
          CINETIX
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          <Link href="/">Movies</Link>
          <Link href="/cinemas">Cinemas</Link>
          <Link href="/offers">Offers</Link>
          <Link href="/my-tickets">My Tickets</Link>
          <Link href="/help">Help</Link>
        </nav>

        <div className="header-actions">
          <span className="header-location">📍 Kathmandu</span>

          <Link href="/login" className="sign-in-link">
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}