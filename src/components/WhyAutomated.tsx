'use client'
import { Button } from '@/components/ui/button'
import { Clock, Brain, TrendingUp, AlertTriangle, Zap, DollarSign } from 'lucide-react'

export default function WhyAutomated() {
  const problems = [
    {
      icon: AlertTriangle,
      title: "Emotional Trading",
      description: "FOMO and fear lead to poor decisions",
      color: "text-red-500",
      bgColor: "bg-red-50"
    },
    {
      icon: Clock,
      title: "Missed Opportunities",
      description: "Markets move while you sleep or work",
      color: "text-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      icon: Brain,
      title: "Analysis Paralysis",
      description: "Overthinking delays profitable trades",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50"
    }
  ];

  const solutions = [
    {
      icon: Zap,
      title: "Automate your crypto trades safely using real signals Connect your exchange, execute signals automatically",
      description: "Trades execute in milliseconds, not minutes",
      metric: "3.2x faster"
    },
    {
      icon: Brain,
      title: "Zero Emotions",
      description: "Stick to your strategy without second-guessing",
      metric: "100% disciplined"
    },
    {
      icon: DollarSign,
      title: "Maximize Profits",
      description: "Never miss a signal or opportunity again",
      metric: "24/7 trading"
    }
  ];

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22%23004859%22 fill-opacity=%220.02%22%3E%3Cpolygon points=%2250 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40%22/%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-[#004859]/10 text-[#004859] px-4 py-2 rounded-full text-sm font-medium mb-4">
            The Trading Revolution
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#004859]">
            Why Automated Trading?
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Transform your trading from emotional guesswork to systematic profit generation
          </p>
        </div>

        {/* Problems vs Solutions */}
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-16">
          {/* Problems Side */}
          <div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Manual Trading Problems</h3>
              <div className="w-16 h-1 bg-red-400 mx-auto rounded"></div>
            </div>
            <div className="space-y-6">
              {problems.map((problem, index) => {
                const IconComponent = problem.icon;
                return (
                  <div key={index} className="flex items-start gap-4 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${problem.bgColor} flex items-center justify-center`}>
                      <IconComponent className={`w-6 h-6 ${problem.color}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">{problem.title}</h4>
                      <p className="text-slate-600">{problem.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Solutions Side */}
          <div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-[#004859] mb-4">Tadex Automated Solutions</h3>
              <div className="w-16 h-1 bg-[#00B894] mx-auto rounded"></div>
            </div>
            <div className="space-y-6">
              {solutions.map((solution, index) => {
                const IconComponent = solution.icon;
                return (
                  <div key={index} className="relative p-6 bg-gradient-to-br from-white to-[#004859]/5 rounded-xl border border-[#004859]/20 shadow-sm hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#00B894]/10 flex items-center justify-center group-hover:bg-[#00B894]/20 transition-colors">
                        <IconComponent className="w-6 h-6 text-[#00B894]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#004859] mb-2">{solution.title}</h4>
                        <p className="text-slate-600 mb-2">{solution.description}</p>
                        <div className="inline-flex items-center bg-[#00B894]/20 text-[#00B894] px-3 py-1 rounded-full text-sm font-medium">
                          {solution.metric}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-[#004859] to-[#006B7C] rounded-2xl p-8 lg:p-12 text-white text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold mb-8">The Numbers Don&apos;t Lie</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#00B894] mb-2">68%</div>
              <p className="text-blue-100">Better execution accuracy</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#00B894] mb-2">3.2x</div>
              <p className="text-blue-100">Faster trade execution</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#00B894] mb-2">24/7</div>
              <p className="text-blue-100">Never miss an opportunity</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-lg text-slate-600 mb-6">
            Leverage advanced analytics to inform your strategy.
          </p>
          <Button className="bg-[#00B894] hover:bg-[#00A085] text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <TrendingUp className="w-5 h-5 mr-2" />
            Join the Waitlist
          </Button>
        </div>
      </div>
    </section>
  )
}