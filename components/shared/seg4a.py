"""
seg4a.py: Right-side actions + mobile menu
"""
SEG4A = """          {/* Right-Side Actions: WhatsApp Concierge + User Auth Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick WhatsApp Support Pill */}
            <a
              href={waSupportLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-300/80 bg-emerald-50/80 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 hover:border-emerald-400 transition-all shadow-sm"
              title="Chat with MANTECH Support on WhatsApp"
            >
              <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" />
              <span>WhatsApp</span>
            </a>

            {user ? (
              /* Signed-In User Profile Menu */
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2.5 rounded-2xl p-1.5 pr-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    aria-label="User Account Menu"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-extrabold text-white shadow-sm">
                      {initials}
                    </span>
                    <span className="hidden flex-col items-start text-left leading-tight md:flex">
                      <span className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                        {displayName}
                      </span>
                      <span className="text-[10px] font-semibold text-blue-600">
                        {roleLabel}
                      </span>
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-64 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl"
                >
                  <DropdownMenuLabel className="px-3 py-2.5 bg-slate-50 rounded-xl mb-1">
                    <p className="text-xs font-bold text-slate-900">{displayName}</p>
                    <p className="text-[11px] font-semibold text-blue-600 mt-0.5">{roleLabel}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild className="cursor-pointer rounded-xl p-2.5 focus:bg-blue-50">
                    <Link href={dashboardLink} className="flex items-center gap-2.5 text-xs font-semibold text-slate-900">
                      <LayoutDashboard className="h-4 w-4 text-blue-600" />
                      <span>{roleLabel} Dashboard</span>
                    </Link>
                  </DropdownMenuItem>

                  {userRole === 'INTERN' && (
                    <DropdownMenuItem asChild className="cursor-pointer rounded-xl p-2.5 focus:bg-amber-50">
                      <Link href="/dashboard/intern/passport" className="flex items-center gap-2.5 text-xs font-semibold text-slate-900">
                        <Award className="h-4 w-4 text-amber-600" />
                        <span>My Intern Passport</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem asChild className="cursor-pointer rounded-xl p-2.5 focus:bg-slate-50">
                    <Link href="/settings" className="flex items-center gap-2.5 text-xs font-semibold text-slate-900">
                      <ShieldCheck className="h-4 w-4 text-slate-500" />
                      <span>Security & Privacy</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onSelect={() => void signOut()}
                    className="cursor-pointer rounded-xl p-2.5 text-xs font-semibold text-red-600 focus:bg-red-50 flex items-center gap-2.5"
                  >
                    <LogOut className="h-4 w-4 text-red-500" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* Signed-Out Call-to-Actions */
              <div className="flex items-center gap-2">
                {/* Quick access to the four role dashboards */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 px-3 text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded-xl"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                      <span>Dashboards</span>
                      <ChevronDown className="w-3.5 h-3.5 ml-1 text-slate-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-72 rounded-2xl border-slate-200 p-2 shadow-xl"
                  >
                    <DropdownMenuLabel className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Choose your workspace
                    </DropdownMenuLabel>
                    {[
                      {
                        href: '/dashboard/intern',
                        label: 'Intern Dashboard',
                        icon: GraduationCap,
                      },
                      {
                        href: '/dashboard/company',
                        label: 'Company Dashboard',
                        icon: Building2,
                      },
                      {
                        href: '/dashboard/university',
                        label: 'University Dashboard',
                        icon: BookOpen,
                      },
                      {
                        href: '/dashboard/admin',
                        label: 'Admin Control Center',
                        icon: ShieldCheck,
                      },
                    ].map((item) => (
                      <DropdownMenuItem
                        key={item.href}
                        asChild
                        className="cursor-pointer rounded-xl p-2.5 focus:bg-slate-50"
                      >
                        <Link
                          href={item.href}
                          className="flex items-center gap-2.5 text-xs font-semibold text-slate-900"
                        >
                          <item.icon className="h-4 w-4 text-slate-500" />
                          <span>{item.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 px-4 text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded-xl"
                  >
                    <LogIn className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                    <span>Sign In</span>
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl text-slate-700 hover:bg-slate-100 lg:hidden"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation with Smooth Backdrop Blur */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobile}
            />

            <motion.div
              className="fixed inset-x-0 top-16 z-50 flex flex-col bg-white border-b border-slate-200 shadow-2xl lg:hidden max-h-[85vh] overflow-y-auto"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <div className="p-4 space-y-4">
                {/* Mobile Quick Action Link */}
                <div className="flex items-center gap-2">
                  <a
                    href={waSupportLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-xs font-bold text-emerald-800"
                  >
                    <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                    <span>WhatsApp Concierge</span>
                  </a>
                </div>

                {/* Section 1: Internships */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                    Internships & Fields
                  </p>
                  <div className="space-y-1">
                    {INTERNSHIP_MENU.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobile}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-800"
                      >
                        <item.icon className="h-4 w-4 text-blue-600" />
                        <span>{item.label}</span>
                        {item.badge && (
                          <Badge className="ml-auto text-[9px] bg-amber-100 text-amber-800">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Section 2: Organizations */}
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                    Organizations
                  </p>
                  <div className="space-y-1">
                    {ORGANIZATION_MENU.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobile}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-800"
                      >
                        <item.icon className="h-4 w-4 text-emerald-600" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Section 3: Resources & Info */}
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                    Resources & Help
                  </p>
                  <div className="space-y-1">
                    {RESOURCE_MENU.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobile}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-800"
                      >
                        <item.icon className="h-4 w-4 text-purple-600" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                    <Link
                      href="/about"
                      onClick={closeMobile}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-800"
                    >
                      <Building2 className="h-4 w-4 text-slate-500" />
                      <span>About MANTECH</span>
                    </Link>
                    <Link
                      href="/contact"
                      onClick={closeMobile}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-800"
                    >
                      <MessageCircle className="h-4 w-4 text-slate-500" />
                      <span>Contact Us</span>
                    </Link>
                  </div>
                </div>

                {/* Mobile Auth Actions */}
                <div className="pt-3 border-t border-slate-200 space-y-2">
                  {user ? (
                    <>
                      <Link
                        href={dashboardLink}
                        onClick={closeMobile}
                        className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-blue-600 text-white font-bold text-xs"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Go to {roleLabel} Dashboard</span>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          closeMobile();
                          void signOut();
                        }}
                        className="w-full text-xs text-red-600 hover:bg-red-50 border-red-200"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        <span>Sign Out</span>
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Link href="/sign-in" onClick={closeMobile}>
                        <Button className="w-full text-xs font-bold bg-blue-600 text-white">
                          <LogIn className="w-3.5 h-3.5 mr-1.5" />
                          Sign In
                        </Button>
                      </Link>
                      <p className="pt-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Dashboards
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <Link href="/dashboard/intern" onClick={closeMobile}>
                          <Button
                            variant="outline"
                            className="w-full text-xs font-bold justify-start"
                          >
                            <GraduationCap className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                            Intern
                          </Button>
                        </Link>
                        <Link href="/dashboard/company" onClick={closeMobile}>
                          <Button
                            variant="outline"
                            className="w-full text-xs font-bold justify-start"
                          >
                            <Building2 className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                            Company
                          </Button>
                        </Link>
                        <Link href="/dashboard/university" onClick={closeMobile}>
                          <Button
                            variant="outline"
                            className="w-full text-xs font-bold justify-start"
                          >
                            <BookOpen className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                            University
                          </Button>
                        </Link>
                        <Link href="/dashboard/admin" onClick={closeMobile}>
                          <Button
                            variant="outline"
                            className="w-full text-xs font-bold justify-start"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                            Admin
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
"""
