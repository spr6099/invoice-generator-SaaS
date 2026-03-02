import React, { useCallback, useEffect, useRef, useState } from "react";
import logo from "../assets/logo.png";
import { navbarStyles } from "../assets/dummyStyles";
import { Link, useNavigate } from "react-router-dom";
import { SignedOut, useAuth, useClerk, useUser } from "@clerk/clerk-react";
const Navbar = () => {
  const [open, setOpen] = useState(false); // mobile menu
  const [profileOpen, setProfileOpen] = useState(false); // avatar popover

  const { user } = useUser();
  console.log("user", user);
  const { getToken, isSignedIn } = useAuth();
  const clerk = useClerk();

  const navigate = useNavigate();
  const profileRef = useRef(null);

  const TOKEN_KEY = "token";

  // Safe token fetch + store helper with optional forceRefresh retry
  const fetchAndStoreToken = useCallback(async () => {
    try {
      if (!getToken) {
        // getToken not ready
        return null;
      }
      const token = await getToken().catch(() => null);
      if (token) {
        try {
          localStorage.setItem(TOKEN_KEY, token);
          console.log("token", token);
        } catch (e) {
          // ignore localStorage errors (private mode, etc.)
          // console.warn("Saving token to localStorage failed:", e);
        }
        // optional debug
        // console.log("🔐 Clerk token saved → localStorage");
        return token;
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  }, [getToken]);

  // Keep localStorage token in sync with Clerk auth state
  useEffect(() => {
    let mounted = true;

    (async () => {
      if (isSignedIn) {
        const t = await fetchAndStoreToken({ template: "default" }).catch(
          () => null,
        );
        console.log("t", t);
        if (!t && mounted) {
          // retry once forcing refresh (useful if token not yet available)
          await fetchAndStoreToken({ forceRefresh: true }).catch(() => null);
        }
      } else {
        // signed out: remove token
        try {
          localStorage.removeItem(TOKEN_KEY);
        } catch {} // silent catch,  In production, silent catch is acceptable.
      }
    })();
    return () => {
      mounted = false;
    };
  }, [isSignedIn, user, fetchAndStoreToken]);

  // Redirect user to app home after successful sign-in if on auth pages
  useEffect(() => {
    if (isSignedIn) {
      const pathname = window.location.pathname || "/";
      if (
        pathname === "/login" ||
        pathname === "/signup" ||
        pathname.startsWith("/auth") ||
        pathname === "/"
      ) {
        navigate("/app/dashboard", { replace: true });
      }
    }
  }, [isSignedIn, navigate]);

  // Close profile popover on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener("mousedown", onDocClick);
      document.addEventListener("touchstart", onDocClick);
    }
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("touchstart", onDocClick);
    };
  }, [profileOpen]);

  // Open Clerk sign-in modal (fallback to route if clerk unavailable)
  // So this function prevents that crash:   Cannot read property 'openSignIn' of undefined

  function openSignIn() {
    try {
      if (clerk && typeof clerk.openSignIn === "function") {
        clerk.openSignIn();
      } else {
        navigate("/login");
      }
    } catch (e) {
      console.error("openSignIn failed:", e);
      navigate("/login");
    }
  }

  // Open Clerk sign-up modal (fallback to route if clerk unavailable)
  function openSignUp() {
    try {
      if (clerk && typeof clerk.openSignUp === "function") {
        clerk.openSignUp();
      } else {
        navigate("/signup");
      }
    } catch (e) {
      console.error("openSignUp failed:", e);
      navigate("/signup");
    }
  }
  return (
    <header className={navbarStyles.header}>
      <div className={navbarStyles.container}>
        <nav className={navbarStyles.nav}>
          <div className={navbarStyles.logoSection}>
            <Link to="/" className={navbarStyles.logoLink}>
              <img
                src={logo}
                alt="InvoiceAI Logo"
                className={navbarStyles.logoImage}
              />
              <span className={navbarStyles.logoText}>InvoiceAI</span>
            </Link>

            <div className={navbarStyles.desktopNav}>
              <a href="#features" className={navbarStyles.navLink}>
                Features
              </a>
              <a href="#pricing" className={navbarStyles.navLinkInactive}>
                Pricing
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={navbarStyles.authSection}>
              <SignedOut>
                <button
                  onClick={openSignIn}
                  className={navbarStyles.signInButton}
                  type="button"
                >
                  Sign In
                </button>

                <button
                  onClick={openSignUp}
                  className={navbarStyles.signUpButton}
                  type="button"
                >
                  <div className={navbarStyles.signUpOverlay}></div>
                  <span className={navbarStyles.signUpText}>Get started</span>
                  <svg
                    className={navbarStyles.signUpIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14m-7-7l7 7-7 7" />
                  </svg>
                </button>
              </SignedOut>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle navigation"
              className={navbarStyles.mobileMenuButton}
            >
              <div className={navbarStyles.mobileMenuIcon}>
                <span
                  className={`${navbarStyles.mobileMenuLine1} ${
                    open
                      ? navbarStyles.mobileMenuLine1Open
                      : navbarStyles.mobileMenuLine1Closed
                  }`}
                />
                <span
                  className={`${navbarStyles.mobileMenuLine2} ${
                    open
                      ? navbarStyles.mobileMenuLine2Open
                      : navbarStyles.mobileMenuLine2Closed
                  }`}
                />
                <span
                  className={`${navbarStyles.mobileMenuLine3} ${
                    open
                      ? navbarStyles.mobileMenuLine3Open
                      : navbarStyles.mobileMenuLine3Closed
                  }`}
                />
              </div>
            </button>
          </div>
        </nav>
      </div>

      <div
        className={`${open ? "block" : "hidden"} ${navbarStyles.mobileMenu}`}
      >
        <div className={navbarStyles.mobileMenuContainer}>
          <a href="#features" className={navbarStyles.mobileNavLink}>
            Features
          </a>
          <a href="#pricing" className={navbarStyles.mobileNavLink}>
            Pricing
          </a>
          <a href="#faq" className={navbarStyles.mobileNavLink}>
            FAQ
          </a>

          <div className={navbarStyles.mobileAuthSection}>
            <SignedOut>
              <button
                onClick={openSignIn}
                className={navbarStyles.mobileSignIn}
              >
                Sign in
              </button>
              <button
                onClick={openSignUp}
                className={navbarStyles.mobileSignUp}
              >
                Get started
              </button>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
