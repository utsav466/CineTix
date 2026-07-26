import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <Link href="/" className="footer-logo">
          CINETIX
        </Link>

        <nav className="footer-links" aria-label="Footer navigation">
          <Link href="/contact">Contact</Link>
          <Link href="/terms">Terms of Use</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/help">FAQ</Link>
        </nav>

        <div className="footer-socials" aria-label="Social media links">
          <a href="#" aria-label="Facebook">
            f
          </a>

          <a href="#" aria-label="Instagram">
            ◎
          </a>

          <a href="#" aria-label="Twitter">
            ♥
          </a>
        </div>
      </div>
    </footer>
  );
}