import Card from '@/components/Card';

export default function Dashboard() {
  return (
    <div className="px-6 md:px-12 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 md:mb-24">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-[#050505] mb-6">
            Reality Architecture
          </h1>
          <p className="text-lg leading-relaxed font-normal text-[rgba(5,5,5,0.72)] max-w-3xl">
            AI-powered tools to analyze your patterns, rewrite limiting beliefs,
            explore future paths, and maintain daily alignment with your most
            empowered identity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <Card href="/reality-scan">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#050505] mb-3">
              Reality Scan
            </h2>
            <p className="text-lg leading-relaxed font-normal text-[rgba(5,5,5,0.72)]">
              Analyze recurring patterns, beliefs, and cognitive distortions in
              your life.
            </p>
          </Card>

          <Card href="/identity-designer">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#050505] mb-3">
              Identity Designer
            </h2>
            <p className="text-lg leading-relaxed font-normal text-[rgba(5,5,5,0.72)]">
              Rewrite limiting beliefs and design a new identity narrative.
            </p>
          </Card>

          <Card href="/simulation">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#050505] mb-3">
              Simulation Paths
            </h2>
            <p className="text-lg leading-relaxed font-normal text-[rgba(5,5,5,0.72)]">
              Explore two possible future paths based on different identity
              patterns.
            </p>
          </Card>

          <Card href="/daily">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#050505] mb-3">
              Daily Calibration
            </h2>
            <p className="text-lg leading-relaxed font-normal text-[rgba(5,5,5,0.72)]">
              Get a quick daily check-in to align with your empowered identity.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

