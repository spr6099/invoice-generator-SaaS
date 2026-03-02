import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";

const AppShell = () => {
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) setCollapsed(false);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("sidebar_collapsed", collapsed ? "true" : "false");
    } catch {}
  }, [collapsed]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Header scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle sidebar collapse/expand
  const toggleSidebar = () => setCollapsed(!collapsed);

  // Logout
  const logout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.warn("signOut error", err);
    }
    navigate("/login");
  };




 // Display name helpers
  const displayName = (() => {
    if (!user) return "User";
    const name = user.fullName || user.firstName || user.username || "";
    return name.trim() || (user.email || "").split?.("@")?.[0] || "User";
  })();

  const firstName = () => {
    const parts = displayName.split(" ").filter(Boolean);
    return parts.length ? parts[0] : displayName;
  };

  const initials = () => {
    const parts = displayName.split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };


  /* ----- Icons (kept as you had) ----- */
  const DashboardIcon = ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );

  const InvoiceIcon = ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );

  const CreateIcon = ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );

  const ProfileIcon = ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  const LogoutIcon = ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );

  const CollapseIcon = ({ className = "w-4 h-4", collapsed }) => (
    <svg
      className={`${className} transition-transform duration-300 ${
        collapsed ? "rotate-180" : ""
      }`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
      />
    </svg>
  );

  /* ----- SidebarLink ----- */
  const SidebarLink = ({ to, icon, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) => `
        ${appShellStyles.sidebarLink}
        ${collapsed ? appShellStyles.sidebarLinkCollapsed : ""}
        ${
          isActive
            ? appShellStyles.sidebarLinkActive
            : appShellStyles.sidebarLinkInactive
        }
      `}
      onClick={() => setMobileOpen(false)}
    >
      {({ isActive }) => (
        <>
          <div
            className={`${appShellStyles.sidebarIcon} ${
              isActive
                ? appShellStyles.sidebarIconActive
                : appShellStyles.sidebarIconInactive
            }`}
          >
            {icon}
          </div>
          {!collapsed && (
            <span className={appShellStyles.sidebarText}>{children}</span>
          )}
          {!collapsed && isActive && (
            <div className={appShellStyles.sidebarActiveIndicator} />
          )}
        </>
      )}
    </NavLink>
  );

  return (
    <div className={appShellStyles.root}>
      <div className={appShellStyles.layout}>
        {/* Sidebar */}
        <aside
          className={`${appShellStyles.sidebar} ${collapsed ? appShellStyles.sidebarCollapsed : appShellStyles.sidebarExpanded}`}
        >
          <div className={appShellStyles.sidebarGradient}></div>
          <div className={appShellStyles.sidebarContainer}>
            <div>
              <div
                className={`${appShellStyles.logoContainer} ${
                  collapsed ? appShellStyles.logoContainerCollapsed : ""
                }`}
              >
                {/* Logo navigates into the app dashboard */}
                <Link to="/" className={appShellStyles.logoLink}>
                  <div className="relative">
                    <img
                      src={logo}
                      alt="InvoiceAI Logo"
                      className={appShellStyles.logoImage}
                    />
                    <div className="absolute inset-0 rounded-lg blur-sm group-hover:blur-md transition-all duration-300" />
                  </div>
                  {!collapsed && (
                    <div className={appShellStyles.logoTextContainer}>
                      <span className={appShellStyles.logoText}>InvoiceAI</span>
                      <div className={appShellStyles.logoUnderline} />
                    </div>
                  )}
                </Link>
                {!collapsed && (
                  <button
                    onClick={toggleSidebar}
                    className={appShellStyles.collapseButton}
                    aria-label="Collapse sidebar"
                  >
                    <CollapseIcon collapsed={collapsed} />
                  </button>
                )}
              </div>

              <nav className={appShellStyles.nav}>
                <SidebarLink to="/app/dashboard" icon={<DashboardIcon />}>
                  Dashboard
                </SidebarLink>
                <SidebarLink to="/app/invoices" icon={<InvoiceIcon />}>
                  Invoices
                </SidebarLink>
                <SidebarLink to="/app/create-invoice" icon={<CreateIcon />}>
                  Create Invoice
                </SidebarLink>
                <SidebarLink to="/app/business" icon={<ProfileIcon />}>
                  Business Profile
                </SidebarLink>
              </nav>
            </div>

            <div className={appShellStyles.userSection}>
              <div
                className={`${appShellStyles.userDivider} ${
                  collapsed
                    ? appShellStyles.userDividerCollapsed
                    : appShellStyles.userDividerExpanded
                }`}
              >
                {!collapsed ? (
                  <button
                    onClick={logout}
                    className={appShellStyles.logoutButton}
                  >
                    <LogoutIcon className={appShellStyles.logoutIcon} />
                    <span>Logout</span>
                  </button>
                ) : (
                  <button
                    onClick={logout}
                    aria-label="Logout"
                    className="w-full flex items-center justify-center p-3 rounded-xl text-red-600 hover:bg-red-50 hover:shadow-sm transition-all duration-300"
                  >
                    <LogoutIcon className="w-5 h-5 hover:scale-110 transition-transform" />
                  </button>
                )}
                <div className={appShellStyles.collapseSection}>
                  <button
                    onClick={toggleSidebar}
                    className={`${appShellStyles.collapseButtonInner} ${
                      collapsed ? appShellStyles.collapseButtonCollapsed : ""
                    }`}
                    aria-label={
                      collapsed ? "Expand sidebar" : "Collapse sidebar"
                    }
                  >
                    {!collapsed && (
                      <span>{collapsed ? "Expand" : "Collapse"}</span>
                    )}
                    <CollapseIcon collapsed={collapsed} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {mobileOpen && (
          <div className={appShellStyles.mobileOverlay}>
            <div
              aria-hidden
              onClick={() => setMobileOpen(false)}
              className={appShellStyles.mobileBackdrop}
            />
            <div className={appShellStyles.mobileSidebar}>
              <div className={appShellStyles.mobileHeader}>
                <Link
                  to="/"
                  className={appShellStyles.mobileLogoLink}
                  onClick={() => setMobileOpen(false)}
                >
                  <img
                    src={logo}
                    alt="InvoiceAI Logo"
                    className={appShellStyles.mobileLogoImage}
                  />
                  <span className={appShellStyles.mobileLogoText}>
                    InvoiceAI
                  </span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className={appShellStyles.mobileCloseButton}
                >
                  <svg
                    className={appShellStyles.mobileCloseIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className={appShellStyles.mobileNav}>
                <NavLink
                  onClick={() => setMobileOpen(false)}
                  to="/app/dashboard"
                  className={({ isActive }) =>
                    `${appShellStyles.mobileNavLink} ${
                      isActive
                        ? appShellStyles.mobileNavLinkActive
                        : appShellStyles.mobileNavLinkInactive
                    }`
                  }
                >
                  <DashboardIcon /> Dashboard
                </NavLink>
                <NavLink
                  onClick={() => setMobileOpen(false)}
                  to="/app/invoices"
                  className={({ isActive }) =>
                    `${appShellStyles.mobileNavLink} ${
                      isActive
                        ? appShellStyles.mobileNavLinkActive
                        : appShellStyles.mobileNavLinkInactive
                    }`
                  }
                >
                  <InvoiceIcon /> Invoices
                </NavLink>
                <NavLink
                  onClick={() => setMobileOpen(false)}
                  to="/app/create-invoice"
                  className={({ isActive }) =>
                    `${appShellStyles.mobileNavLink} ${
                      isActive
                        ? appShellStyles.mobileNavLinkActive
                        : appShellStyles.mobileNavLinkInactive
                    }`
                  }
                >
                  <CreateIcon /> Create Invoice
                </NavLink>
                <NavLink
                  onClick={() => setMobileOpen(false)}
                  to="/app/business"
                  className={({ isActive }) =>
                    `${appShellStyles.mobileNavLink} ${
                      isActive
                        ? appShellStyles.mobileNavLinkActive
                        : appShellStyles.mobileNavLinkInactive
                    }`
                  }
                >
                  <ProfileIcon /> Business Profile
                </NavLink>
              </nav>

              <div className={appShellStyles.mobileLogoutSection}>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className={appShellStyles.mobileLogoutButton}
                >
                  <LogoutIcon /> Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <header
            className={`${appShellStyles.header} ${
              scrolled
                ? appShellStyles.headerScrolled
                : appShellStyles.headerNotScrolled
            }`}
          >
            <div className={appShellStyles.headerTopSection}>
              <div className={appShellStyles.headerContent}>
                <button
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open menu"
                  className={appShellStyles.mobileMenuButton}
                >
                  <svg
                    className={appShellStyles.mobileMenuIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                {!isMobile && (
                  <button
                    onClick={toggleSidebar}
                    className={appShellStyles.desktopCollapseButton}
                    aria-label={
                      collapsed ? "Expand sidebar" : "Collapse sidebar"
                    }
                  >
                    <CollapseIcon collapsed={collapsed} />
                  </button>
                )}

                <div className={appShellStyles.welcomeContainer}>
                  <h2 className={appShellStyles.welcomeTitle}>
                    Welcome back,{" "}
                    <span className={appShellStyles.welcomeName}>
                      {firstName()}!
                    </span>
                  </h2>
                  <p className={appShellStyles.welcomeSubtitle}>
                    Ready to create amazing invoices?
                  </p>
                </div>
              </div>
            </div>

            <div className={appShellStyles.headerActions}>
              <button
                onClick={() => navigate("/app/create-invoice")}
                className={appShellStyles.ctaButton}
              >
                <CreateIcon className={appShellStyles.ctaIcon} />
                <span className="hidden xs:inline">Create Invoice</span>
                <span className="xs:hidden">Create</span>
              </button>

              <div className={appShellStyles.userSectionDesktop}>
                <div className={appShellStyles.userInfo}>
                  <div className={appShellStyles.userName}>{displayName}</div>
                  <div className={appShellStyles.userEmail}>{user?.email}</div>
                </div>
                <div className={appShellStyles.userAvatarContainer}>
                  <div className={appShellStyles.userAvatar}>
                    {initials()}
                    <div className={appShellStyles.userAvatarBorder} />
                  </div>
                  <div className={appShellStyles.userStatus} />
                </div>
              </div>
            </div>
          </header>

          <main className={appShellStyles.main}>
            <div className={appShellStyles.mainContainer}>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppShell;

const appShellStyles = {
  // Layout
  root: "min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20",
  layout: "lg:flex",

  // Desktop Sidebar
  sidebar:
    "hidden lg:block bg-white/80 backdrop-blur-xl border-r border-gray-200/60 transition-all duration-500 ease-in-out relative",
  sidebarCollapsed: "w-20",
  sidebarExpanded: "w-80",
  sidebarGradient:
    "absolute inset-0 bg-gradient-to-b from-blue-50/5 to-transparent pointer-events-none",
  sidebarContainer:
    "px-6 py-8 h-full flex flex-col justify-between relative z-10",

  // Logo Area
  logoContainer: "mb-12 flex items-center",
  logoContainerCollapsed: "justify-center",
  logoLink: "inline-flex items-center group transition-all duration-300",
  logoImage: "h-16 w-16 object-contain drop-shadow-sm",
  logoTextContainer: "",
  logoText:
    "font-bold text-3xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent",
  logoUnderline:
    "h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 mt-1",
  collapseButton:
    "p-2 ml-7 rounded-lg border border-gray-200 bg-white/50 hover:bg-white hover:shadow-md transition-all duration-300 group",

  // Navigation
  nav: "space-y-2",
  sidebarLink:
    "group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 ease-out",
  sidebarLinkCollapsed: "justify-center",
  sidebarLinkActive:
    "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100",
  sidebarLinkInactive:
    "text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-md",
  sidebarIcon: "transition-all duration-300",
  sidebarIconActive: "text-blue-600 scale-110",
  sidebarIconInactive:
    "text-gray-400 group-hover:text-gray-600 group-hover:scale-105",
  sidebarText: "flex-1 transition-all duration-300",
  sidebarActiveIndicator: "w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse",

  // User Area
  userSection: "mt-auto",
  userDivider: "border-t border-gray-200/60 pt-6",
  userDividerCollapsed: "px-1",
  userDividerExpanded: "px-2",
  logoutButton:
    "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 hover:shadow-sm transition-all duration-300 group",
  logoutIcon: "w-5 h-5 group-hover:scale-110 transition-transform",
  collapseSection: "mt-4 flex justify-center",
  collapseButtonInner:
    "flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-white transition-all duration-300 text-xs text-gray-600 hover:text-gray-800",
  collapseButtonCollapsed: "justify-center w-10",

  // Mobile Sidebar
  mobileOverlay: "lg:hidden fixed inset-0 z-50",
  mobileBackdrop:
    "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
  mobileSidebar:
    "absolute inset-y-0 left-0 w-80 bg-white/90 backdrop-blur-xl border-r border-gray-200/60 p-6 overflow-auto transform transition-transform duration-300",
  mobileHeader: "mb-8 flex items-center justify-between",
  mobileLogoLink: "inline-flex items-center",
  mobileLogoImage: "h-10 w-10 object-contain",
  mobileLogoText:
    "font-bold text-xl ml-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent",
  mobileCloseButton:
    "p-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-white transition-all duration-300",
  mobileCloseIcon: "w-5 h-5 text-gray-600",
  mobileNav: "space-y-2",
  mobileNavLink:
    "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300",
  mobileNavLinkActive:
    "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100",
  mobileNavLinkInactive:
    "text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm",
  mobileLogoutSection: "mt-8 border-t border-gray-200/60 pt-6",
  mobileLogoutButton:
    "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-300",

  // Header
  header:
    "flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-40 transition-all duration-300 min-h-20",
  headerScrolled: "shadow-sm",
  headerNotScrolled: "shadow-none",
  headerTopSection:
    "flex items-center justify-between sm:justify-start w-full sm:w-auto py-3 sm:py-0",
  headerContent: "flex items-center gap-3 sm:gap-6",
  mobileMenuButton:
    "lg:hidden inline-flex items-center justify-center p-2 sm:p-3 rounded-xl border border-gray-200 bg-white/50 hover:bg-white hover:shadow-md transition-all duration-300",
  mobileMenuIcon: "w-5 h-5 text-gray-700",
  desktopCollapseButton:
    "hidden lg:flex items-center justify-center p-2 rounded-xl border border-gray-200 bg-white/50 hover:bg-white hover:shadow-md transition-all duration-300",
  welcomeContainer: "flex flex-col",
  welcomeTitle:
    "text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 tracking-tight",
  welcomeName:
    "bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent",
  welcomeSubtitle: "text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1",
  mobileUserAvatar: "lg:hidden flex items-center gap-2",
  mobileAvatar:
    "w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold shadow-lg",

  // Header Actions
  headerActions:
    "flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pb-3 sm:pb-0 border-t border-gray-100 sm:border-t-0 pt-3 sm:pt-0",
  ctaButton:
    "group inline-flex  items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 text-sm sm:text-base flex-1 sm:flex-none justify-center",
  ctaIcon: "w-4 h-4 text-white",
  ctaArrow:
    "w-0 group-hover:w-2 group-hover:ml-1 transition-all duration-300 overflow-hidden hidden sm:block",
  userSectionDesktop:
    " lg:flex md:flex items-center gap-4 pl-4 border-l border-gray-200/60",
  userInfo: "hidden sm:block text-right",
  userName: "text-sm font-medium text-gray-900",
  userEmail: "text-xs text-gray-500",
  userAvatarContainer: "relative ",
  userAvatar:
    "w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer group",
  userAvatarBorder:
    "absolute inset-0 rounded-2xl border-2 border-white/20 group-hover:border-white/40 transition-all duration-300",
  userStatus:
    "absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-sm",

  // Main Content
  main: "p-4 sm:p-6 lg:p-8",
  mainContainer: "max-w-7xl mx-auto",
};
