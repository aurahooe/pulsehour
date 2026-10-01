import "./globals.css";

export const metadata = {
  title: "Pulsehour",
  description: "A public wall that turns over with the hour.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <header className="top">
            <a className="mark" href="/">Pulsehour</a>
            <nav className="links">
              <a href="/wall">Wall</a>
              <a href="/write">Write</a>
              <a href="/account">Account</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
