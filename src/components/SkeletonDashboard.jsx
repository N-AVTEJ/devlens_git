'use client'
export default function SkeletonDashboard() {
  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8 animate-pulse w-full pt-24">
      
      {/* Header skeleton */}
      <div className="flex justify-between mb-8">
        <div>
          <div className="h-3 w-32 bg-white/10 rounded mb-3" />
          <div className="h-8 w-56 bg-white/10 rounded mb-2" />
          <div className="h-3 w-48 bg-white/5 rounded" />
        </div>
        <div className="text-right">
          <div className="h-3 w-24 bg-white/10 rounded mb-3 ml-auto" />
          <div className="h-14 w-28 bg-[#ef233c]/10 rounded ml-auto" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Career matches skeleton */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="h-5 w-40 bg-white/10 rounded mb-6" />
            {[87, 72, 61, 55, 48].map((w, i) => (
              <div key={i} className="mb-5">
                <div className="flex justify-between mb-2">
                  <div className="h-3 w-36 bg-white/10 rounded" />
                  <div className="h-3 w-16 bg-white/10 rounded" />
                </div>
                <div className="h-1 bg-white/10 rounded overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-white/5 via-white/20 to-white/5 rounded"
                    style={{ 
                      width: `${w}%`,
                      background: 'linear-gradient(90deg, transparent, rgba(239,35,60,0.3), transparent)',
                      backgroundSize: '200% 100%',
                      animation: `shimmer 1.5s infinite ${i * 0.1}s`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Radar skeleton */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="h-5 w-36 bg-white/10 rounded mb-4" />
            <div className="h-64 bg-white/5 rounded-xl flex items-center justify-center">
              <div className="w-40 h-40 rounded-full border border-white/10 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border border-[#ef233c]/20" />
              </div>
            </div>
          </div>

          {/* Feedback skeleton */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="h-5 w-44 bg-white/10 rounded mb-4" />
            <div className="bg-black/50 border border-white/10 rounded-xl p-5 space-y-2">
              <div className="h-3 w-full bg-white/5 rounded" />
              <div className="h-3 w-4/5 bg-white/5 rounded" />
              <div className="h-3 w-3/5 bg-white/5 rounded" />
            </div>
          </div>
        </div>

        {/* Roadmap skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="h-5 w-36 bg-white/10 rounded mb-6" />
            {[1,2,3,4,5].map((i) => (
              <div key={i} className="flex gap-4 mb-6">
                <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-3 w-full bg-white/10 rounded mb-2" />
                  <div className="h-2 w-3/4 bg-white/5 rounded" />
                </div>
              </div>
            ))}
            <div className="h-12 bg-[#ef233c]/10 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
