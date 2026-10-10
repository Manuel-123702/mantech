"""
seg3.py: Desktop navigation links with mega dropdowns
"""
SEG3 = """            {/* 1. Internships Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    'group inline-flex items-center gap-1 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-150',
                    'hover:bg-slate-100/80 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600',
                    pathname.startsWith('/internships') || pathname.startsWith('/fields') || pathname.startsWith('/locations')
                      ? 'text-blue-700 bg-blue-50/60'
                      : 'text-slate-700'
                  )}
                >
                  <span>Internships</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 group-hover:rotate-180 transition-transform duration-200" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={10}
                className="w-80 rounded-2xl border border-slate-200/90 bg-white/95 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in-50 zoom-in-95 duration-150"
              >
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Find Opportunities
                  </p>
                </div>
                {INTERNSHIP_MENU.map((item) => (
                  <DropdownMenuItem key={item.href} asChild className="p-0 focus:bg-transparent">
                    <Link
                      href={item.href}
                      className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-slate-50 transition-colors group"
                    >
                      <div className={cn('p-2 rounded-xl shrink-0 mt-0.5', item.color)}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {item.label}
                          </span>
                          {item.badge && (
                            <Badge className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0 border-amber-200 font-semibold">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 2. Organizations Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    'group inline-flex items-center gap-1 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-150',
                    'hover:bg-slate-100/80 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600',
                    pathname.startsWith('/companies') || pathname.startsWith('/universities')
                      ? 'text-blue-700 bg-blue-50/60'
                      : 'text-slate-700'
                  )}
                >
                  <span>Organizations</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 group-hover:rotate-180 transition-transform duration-200" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={10}
                className="w-80 rounded-2xl border border-slate-200/90 bg-white/95 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in-50 zoom-in-95 duration-150"
              >
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Host Enterprises & Academia
                  </p>
                </div>
                {ORGANIZATION_MENU.map((item) => (
                  <DropdownMenuItem key={item.href} asChild className="p-0 focus:bg-transparent">
                    <Link
                      href={item.href}
                      className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-slate-50 transition-colors group"
                    >
                      <div className={cn('p-2 rounded-xl shrink-0 mt-0.5', item.color)}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {item.label}
                          </span>
                          {item.badge && (
                            <Badge className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0 border-emerald-200 font-semibold">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 3. Resources Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    'group inline-flex items-center gap-1 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-150',
                    'hover:bg-slate-100/80 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600',
                    pathname.startsWith('/pricing') || pathname.startsWith('/resources') || pathname.startsWith('/faq')
                      ? 'text-blue-700 bg-blue-50/60'
                      : 'text-slate-700'
                  )}
                >
                  <span>Resources</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 group-hover:rotate-180 transition-transform duration-200" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={10}
                className="w-80 rounded-2xl border border-slate-200/90 bg-white/95 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in-50 zoom-in-95 duration-150"
              >
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Platform Insights
                  </p>
                </div>
                {RESOURCE_MENU.map((item) => (
                  <DropdownMenuItem key={item.href} asChild className="p-0 focus:bg-transparent">
                    <Link
                      href={item.href}
                      className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-slate-50 transition-colors group"
                    >
                      <div className={cn('p-2 rounded-xl shrink-0 mt-0.5', item.color)}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {item.label}
                        </span>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 4. Direct Link: About */}
            <Link
              href="/about"
              className={cn(
                'rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors',
                pathname === '/about'
                  ? 'text-blue-700 bg-blue-50/60'
                  : 'text-slate-700 hover:bg-slate-100/80 hover:text-blue-700'
              )}
            >
              About
            </Link>

            {/* 5. Direct Link: Contact */}
            <Link
              href="/contact"
              className={cn(
                'rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors',
                pathname === '/contact'
                  ? 'text-blue-700 bg-blue-50/60'
                  : 'text-slate-700 hover:bg-slate-100/80 hover:text-blue-700'
              )}
            >
              Contact
            </Link>
          </div>

"""
