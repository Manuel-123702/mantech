"""
seg2.py: Navbar component start - hooks, state, header/logo
"""
SEG2 = """export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const { user } = useUser();
  const { signOut } = useClerk();

  const userRole =
    ((user?.publicMetadata as Record<string, unknown> | undefined)?.role as string | undefined) ??
    ((user?.unsafeMetadata as Record<string, unknown> | undefined)?.role as string | undefined);

  const dashboardLink =
    userRole === 'COMPANY'
      ? '/dashboard/company'
      : userRole === 'UNIVERSITY'
        ? '/dashboard/university'
        : userRole === 'ADMIN'
          ? '/dashboard/admin'
          : '/dashboard/intern';

  const roleLabel = userRole ? (ROLE_LABEL[userRole] ?? userRole) : 'Member';

  const displayName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    user?.username ||
    'My Account';

  const initials =
    `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() ||
    displayName.charAt(0).toUpperCase();

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-slate-200/80 bg-white/90 shadow-[0_4px_30px_-5px_rgba(15,23,42,0.08)] backdrop-blur-xl'
          : 'border-b border-slate-200/40 bg-white/70 backdrop-blur-md'
      )}
    >
      <nav className="container-mantech mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            'flex items-center justify-between transition-all duration-300',
            scrolled ? 'h-16' : 'h-20'
          )}
        >
          {/* Logo & Cameroon Identity Tag */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 transition-transform hover:scale-[1.01]"
              aria-label="MANTECH Nexus Home"
            >
              <Logo size={scrolled ? 135 : 150} />
            </Link>

            <FloatingBadge className="hidden xl:inline-flex">
              <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-50/80 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 shadow-sm backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                CAMEROON #1
              </span>
            </FloatingBadge>
          </div>

          {/* Desktop Navigation Links with Animated Mega Dropdowns */}
          <div className="hidden items-center gap-x-1 lg:flex">
"""
