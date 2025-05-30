import React from 'react';
import { CheckIcon, XIcon, StarIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const competitorNames = [
  "Builder A",
  "Builder B",
  "Builder C"
];

type Feature = {
  name: string;
  rezume: boolean;
  competitors: {
    competitor1: boolean;
    competitor2: boolean;
    competitor3: boolean;
  };
  badge?: string;
  highlight?: boolean;
};

const features: Feature[] = [
  {
    name: "AI-Powered Resume Generation",
    rezume: true,
    competitors: { competitor1: false, competitor2: false, competitor3: true },
    badge: "AI Exclusive", highlight: true
  },
  {
    name: "ATS-Friendly Templates",
    rezume: true,
    competitors: { competitor1: true, competitor2: true, competitor3: true }
  },
  {
    name: "Industry-Specific Suggestions",
    rezume: true,
    competitors: { competitor1: false, competitor2: false, competitor3: false },
    badge: "Exclusive"
  },
  {
    name: "Free Basic Version",
    rezume: true,
    competitors: { competitor1: false, competitor2: true, competitor3: false },
    badge: "Free"
  },
  {
    name: "Unlimited Downloads",
    rezume: true,
    competitors: { competitor1: false, competitor2: false, competitor3: false },
    badge: "Unlimited"
  },
  {
    name: "Real-Time Feedback",
    rezume: true,
    competitors: { competitor1: false, competitor2: false, competitor3: true }
  },
  {
    name: "No Watermarks",
    rezume: true,
    competitors: { competitor1: false, competitor2: true, competitor3: false }
  }
];

function getCompetitorKey(idx: number) {
  if (idx === 0) return 'competitor1';
  if (idx === 1) return 'competitor2';
  return 'competitor3';
}

export const ComparisonTable = () => {
  const isMobile = useIsMobile();

  const rezumeColStyle = "bg-gradient-to-br from-indigo-50 to-white text-primary font-bold shadow-sm border-accent/30 border";
  const rezumeTableHead = "bg-gradient-to-br from-indigo-50 to-white text-primary text-xl shadow-sm border-accent/30 border";
  const badgeStyle = "ml-2 inline-block bg-gradient-to-r from-orange-200 to-orange-400 text-orange-900 text-[11px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider align-middle";

  return (
    <section className="pt-4 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-accent/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent drop-shadow-lg">
              See the Rezume.dev Difference
            </span>
          </h2>
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 bg-accent/80 px-5 py-1.5 rounded-full shadow-lg border border-primary/20">
              <StarIcon className="w-5 h-5 text-amber-400" />
              <span className="font-semibold text-xl text-primary">Premium Features, No Extra Cost</span>
            </span>
          </div>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Compare how Rezume.dev leads the industry—unmatched innovation, value, and user experience.
          </p>
        </div>

        {isMobile ? (
          <div className="space-y-5">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`rounded-xl shadow-xl border px-0 border-accent/70 bg-gradient-to-br ${feature.highlight ? 'from-white to-accent/40' : 'from-white to-accent/40'} overflow-hidden`}
              >
                <div className="flex flex-row items-center justify-between gap-2 px-4 py-3 border-b border-accent/60 bg-gradient-to-r from-indigo-50/80 via-purple-50/90 to-white">
                  <span className="font-semibold text-gray-900 text-base">
                    {feature.name}
                    {feature.badge &&
                      <span className={badgeStyle}>
                        {feature.badge}
                      </span>
                    }
                  </span>
                </div>
                <div className="p-3 flex flex-row justify-between items-stretch">
                  <div className={`flex-1 flex flex-col items-center gap-1 ${feature.highlight ? 'bg-indigo-50/90' : 'bg-indigo-50/90'} py-2 mx-1 rounded-lg`}>
                    <span className={`text-xs font-bold text-primary`}>Rezume.dev</span>
                    {feature.rezume ? (
                      <span className="bg-white/30 p-1.5 rounded-full border border-white/60 flex items-center justify-center">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                      </span>
                    ) : (
                      <span className="bg-white/10 p-1.5 rounded-full border border-white/50 flex items-center justify-center">
                        <XIcon className="h-5 w-5 text-red-500" />
                      </span>
                    )}
                  </div>
                  {competitorNames.map((competitor, cIdx) => (
                    <div key={cIdx} className="flex-1 flex flex-col items-center gap-1 bg-gray-50 py-2 mx-1 rounded-lg">
                      <span className="text-xs font-semibold text-gray-700">{competitor}</span>
                      {feature.competitors[getCompetitorKey(cIdx)] ? (
                        <span className="bg-green-50 p-1.5 rounded-full border border-green-100 flex items-center justify-center">
                          <CheckIcon className="h-5 w-5 text-green-600" />
                        </span>
                      ) : (
                        <span className="bg-red-50 p-1.5 rounded-full border border-red-200 flex items-center justify-center">
                          <XIcon className="h-5 w-5 text-red-400" />
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="shadow-2xl rounded-2xl border-2 border-accent/70 bg-white/90 overflow-hidden backdrop-blur-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-base font-medium">
                <thead>
                  <tr>
                    <th className="py-5 px-6 text-left text-base font-bold text-primary border-b-2 border-accent/60 bg-gradient-to-r from-white via-accent/40 to-white">
                      Feature
                    </th>
                    <th className={rezumeTableHead + " py-5 px-8 border-b-2"}>
                      Rezume.dev
                    </th>
                    {competitorNames.map((competitor, cIdx) => (
                      <th
                        key={cIdx}
                        className="py-5 px-6 text-center text-base font-semibold text-gray-700 bg-accent/30 border-b-2 border-accent/40"
                      >
                        {competitor}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, idx) => (
                    <tr
                      key={idx}
                      className={`${idx % 2 === 0 ? "bg-white/95" : "bg-accent/10"}`}
                    >
                      <td className="py-5 px-6 font-semibold text-gray-900 whitespace-normal">
                        <span className="flex items-center gap-2">
                          {feature.name}
                          {feature.badge &&
                            <span className={badgeStyle}>{feature.badge}</span>
                          }
                        </span>
                      </td>
                      <td className={rezumeColStyle + " py-5 px-8 text-center align-middle"}>
                        {feature.rezume ? (
                          <span className="flex justify-center">
                            <span className="bg-white/25 p-2 rounded-full border border-accent/30 flex items-center justify-center">
                              <CheckIcon className="h-6 w-6 text-green-600 drop-shadow-sm" />
                            </span>
                          </span>
                        ) : (
                          <span className="flex justify-center">
                            <span className="bg-white/20 p-2 rounded-full border border-accent/30 flex items-center justify-center">
                              <XIcon className="h-6 w-6 text-red-500" />
                            </span>
                          </span>
                        )}
                      </td>
                      {competitorNames.map((competitor, cIdx) => (
                        <td
                          key={cIdx}
                          className="py-5 px-6 text-center align-middle"
                        >
                          {feature.competitors[getCompetitorKey(cIdx)] ? (
                            <span className="bg-green-50 p-2 rounded-full border border-green-100 flex items-center justify-center">
                              <CheckIcon className="h-5 w-5 text-green-600" />
                            </span>
                          ) : (
                            <span className="bg-red-50 p-2 rounded-full border border-red-200 flex items-center justify-center">
                              <XIcon className="h-5 w-5 text-red-400" />
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ComparisonTable;
