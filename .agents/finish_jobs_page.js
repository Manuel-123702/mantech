const fs = require('fs');
const appPath = 'c:/mantech_nexus/app/jobs/page.tsx';
let app = fs.readFileSync(appPath, 'utf8');

// Find where the content ends (look for the last </div> pattern)
const lastDivIndex = app.lastIndexOf('</div>');
const afterLastDiv = app.substring(lastDivIndex);

// The file currently ends after the 'subtitle' div, but we need:
// 1. The job card section (filteredJobs.map)
// 2. The closing tags

const newContent =
  `          {loading ? (
  <div className="flex items-center justify-center py-20">
    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
  </div>
) : filteredJobs.length === 0 ? (
  <div className="text-center py-16">
    <Inbox className="w-12 h-12 text-slate-600 mx-auto mb-4" />
    <p className="text-slate-400">No opportunities found matching your criteria.</p>
    <Button
      variant="outline"
      onClick={() => setFilters({ search: "", field: "all", city: "all", workMode: "all", jobType: "all", salaryMin: "", salaryMax: "", showAdvanced: false })}
      className="mt-4"
    >
      Clear all filters
    </Button>
  </div>
) : (
  <MotionSection className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {filteredJobs.map((job) => (
      <MotionItem key={job.id} className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all">
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            {job.isFeatured && (
              <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-900 text-[9px] border border-amber-200">
                <Sparkles className="w-3 h-3 mr-1" /> Featured
              </Badge>
            )}
            <Badge>{(job.type || 'FULL_TIME')}</Badge>
          </div>

          <h3 className="font-heading text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
            {job.title}
          </h3>

          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>{job.city}, Cameroon</span>
            <span>•</span>
            <span className="uppercase font-semibold text-slate-300">{job.workMode || 'ONSITE'}</span>
          </div>

          <p className="mt-3 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {job.description || job.summary || 'Professional opportunity with verified employer.'}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {(job.requiredSkills || []).slice(0, 3).map((skill: string, i: number) => (
              <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-700/60 text-[10px] text-slate-300 font-medium">
                {skill}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              {job.salaryMinXAF && (
                <span className="flex items-center gap-1">
                  <Banknote className="w-3.5 h-3.5" />
                  {job.salaryMinXAF.toLocaleString()} XAF
                </span>
              )}
            </div>
            <Link href={`/ opportunities / ${ job.slug }`}
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                View Details
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </MotionItem>
    ))}
  </MotionSection>
)}
      </MotionSection>
    </div>
  );
}
`;

const result = app.replace(afterLastDiv, newContent);
fs.writeFileSync(appPath, result, 'utf8');
console.log('File updated successfully');
console.log('New length:', result.length);
