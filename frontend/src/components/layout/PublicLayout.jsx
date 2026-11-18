import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "../common/Button";
import { useAuth } from "../../context/AuthContext";
import { homeForRole } from "../../lib/roles";

const LINKS = [
  { to: "/product", label: "Product" },
  { to: "/for-recruiters", label: "For Recruiters" },
  { to: "/for-candidates", label: "For Candidates" },
  { to: "/how-it-works", label: "How It Works" },
];

export const PublicLayout = ({ children }) => {
  const { isAuthenticated, role } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-ink-950">
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-page items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-7 lg:flex">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-semibold ${isActive ? "text-navy-800" : "text-ink-600 hover:text-ink-950"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            {isAuthenticated ? (
              <Link to={homeForRole(role)}>
                <Button variant="primary">Open workspace</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary">Get Started</Button>
                </Link>
              </>
            )}
          </div>
          <button type="button" className="rounded-md p-2 text-ink-800 lg:hidden" onClick={() => setOpen((value) => !value)} aria-label={open ? "Close menu" : "Open menu"}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open ? (
          <div className="border-t border-line bg-white px-4 py-4 lg:hidden">
            <div className="flex flex-col gap-3">
              {LINKS.map((link) => (
                <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)} className="text-base font-semibold text-ink-800">
                  {link.label}
                </NavLink>
              ))}
              <div className="mt-2 flex gap-2">
                {isAuthenticated ? (
                  <Link to={homeForRole(role)} onClick={() => setOpen(false)}>
                    <Button variant="primary">Open workspace</Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setOpen(false)}><Button variant="secondary">Sign In</Button></Link>
                    <Link to="/register" onClick={() => setOpen(false)}><Button variant="primary">Get Started</Button></Link>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </header>
      <main>{children}</main>
      <footer className="border-t border-line bg-paper">
        <div className="mx-auto grid max-w-page gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-600">
              HireSense AI is a recruitment workspace for teams that want a clear record of every role, application, and screening decision.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-950">Explore</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-ink-600">
              <Link to="/product" className="hover:text-ink-950">Product</Link>
              <Link to="/how-it-works" className="hover:text-ink-950">How it works</Link>
              <Link to="/for-recruiters" className="hover:text-ink-950">For recruiters</Link>
              <Link to="/for-candidates" className="hover:text-ink-950">For candidates</Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-950">Account</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-ink-600">
              <Link to="/login" className="hover:text-ink-950">Sign in</Link>
              <Link to="/register" className="hover:text-ink-950">Create an account</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-line px-4 py-4 text-center text-sm text-ink-600">
          HireSense AI
        </div>
      </footer>
    </div>
  );
};
