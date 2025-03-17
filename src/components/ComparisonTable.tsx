
import React from 'react';
import { CheckIcon, XIcon, TrophyIcon } from 'lucide-react';
import { GradientHeading } from './ui/gradient-heading';
import { useIsMobile } from '@/hooks/use-mobile';

type Feature = {
  name: string;
  rezume: boolean;
  competitors: {
    competitor1: boolean;
    competitor2: boolean;
    competitor3: boolean;
  };
};

const features: Feature[] = [
  {
    name: "AI-Powered Resume Generation",
    rezume: true,
    competitors: { competitor1: false, competitor2: false, competitor3: true }
  },
  {
    name: "ATS-Friendly Templates",
    rezume: true,
    competitors: { competitor1: true, competitor2: true, competitor3: true }
  },
  {
    name: "Industry-Specific Suggestions",
    rezume: true,
    competitors: { competitor1: false, competitor2: false, competitor3: false }
  },
  {
    name: "Free Basic Version",
    rezume: true,
    competitors: { competitor1: false, competitor2: true, competitor3: false }
  },
  {
    name: "Unlimited Downloads",
    rezume: true,
    competitors: { competitor1: false, competitor2: false, competitor3: false }
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

export const ComparisonTable = () => {
  const isMobile = useIsMobile();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-accent/30">
      <div className="max-w-7xl mx-auto">
        {/* Main heading with larger size and gradient color */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Feature Comparison
            </span>
          </h2>
          
          {/* Badge positioned below the heading */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center justify-center gap-2 bg-accent/50 px-4 py-1 rounded-full">
              <TrophyIcon size={18} className="text-primary" />
              <span className="text-sm font-medium text-primary">Compare Features</span>
            </div>
          </div>
          
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            See how Rezume.dev stands out with premium features included at no extra cost
          </p>
        </div>
        
        {isMobile ? (
          // Mobile view - Stacked cards
          <div className="space-y-4">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-md overflow-hidden border border-accent/60">
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-accent/60">
                  <h3 className="font-medium text-gray-900">{feature.name}</h3>
                </div>
                <div className="p-4 grid grid-cols-4">
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold mb-2 text-primary">Rezume.dev</span>
                    <div className="flex justify-center">
                      {feature.rezume ? (
                        <span className="bg-green-100 p-1.5 rounded-full">
                          <CheckIcon className="h-5 w-5 text-green-600" />
                        </span>
                      ) : (
                        <span className="bg-red-100 p-1.5 rounded-full">
                          <XIcon className="h-5 w-5 text-red-600" />
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold mb-2 text-gray-600">Builder A</span>
                    <div className="flex justify-center">
                      {feature.competitors.competitor1 ? (
                        <span className="bg-green-100/70 p-1.5 rounded-full">
                          <CheckIcon className="h-5 w-5 text-green-600" />
                        </span>
                      ) : (
                        <span className="bg-red-100/70 p-1.5 rounded-full">
                          <XIcon className="h-5 w-5 text-red-600" />
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold mb-2 text-gray-600">Builder B</span>
                    <div className="flex justify-center">
                      {feature.competitors.competitor2 ? (
                        <span className="bg-green-100/70 p-1.5 rounded-full">
                          <CheckIcon className="h-5 w-5 text-green-600" />
                        </span>
                      ) : (
                        <span className="bg-red-100/70 p-1.5 rounded-full">
                          <XIcon className="h-5 w-5 text-red-600" />
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold mb-2 text-gray-600">Builder C</span>
                    <div className="flex justify-center">
                      {feature.competitors.competitor3 ? (
                        <span className="bg-green-100/70 p-1.5 rounded-full">
                          <CheckIcon className="h-5 w-5 text-green-600" />
                        </span>
                      ) : (
                        <span className="bg-red-100/70 p-1.5 rounded-full">
                          <XIcon className="h-5 w-5 text-red-600" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Desktop view - Traditional table
          <div className="shadow-xl rounded-xl border border-accent/60">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-accent/60">
                <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <tr>
                    <th scope="col" className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Features</th>
                    <th scope="col" className="py-4 px-6 text-center text-sm font-semibold text-primary bg-indigo-100/80">
                      <span className="flex justify-center items-center">
                        <span className="bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent font-bold">
                          Rezume.dev
                        </span>
                      </span>
                    </th>
                    <th scope="col" colSpan={3} className="py-4 px-6 text-center text-sm font-semibold text-gray-700">
                      <span className="block text-gray-600">Other Resume Builders</span>
                      <div className="flex justify-center space-x-12 mt-2">
                        <span>Builder A</span>
                        <span>Builder B</span>
                        <span>Builder C</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-indigo-50/30'}>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">{feature.name}</td>
                      <td className="py-4 px-6 text-center bg-indigo-50/50">
                        {feature.rezume ? (
                          <div className="flex justify-center">
                            <span className="bg-green-100 p-1.5 rounded-full">
                              <CheckIcon className="h-5 w-5 text-green-600" />
                            </span>
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <span className="bg-red-100 p-1.5 rounded-full">
                              <XIcon className="h-5 w-5 text-red-600" />
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {feature.competitors.competitor1 ? (
                          <div className="flex justify-center">
                            <span className="bg-green-100/70 p-1.5 rounded-full">
                              <CheckIcon className="h-5 w-5 text-green-600" />
                            </span>
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <span className="bg-red-100/70 p-1.5 rounded-full">
                              <XIcon className="h-5 w-5 text-red-600" />
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {feature.competitors.competitor2 ? (
                          <div className="flex justify-center">
                            <span className="bg-green-100/70 p-1.5 rounded-full">
                              <CheckIcon className="h-5 w-5 text-green-600" />
                            </span>
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <span className="bg-red-100/70 p-1.5 rounded-full">
                              <XIcon className="h-5 w-5 text-red-600" />
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {feature.competitors.competitor3 ? (
                          <div className="flex justify-center">
                            <span className="bg-green-100/70 p-1.5 rounded-full">
                              <CheckIcon className="h-5 w-5 text-green-600" />
                            </span>
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <span className="bg-red-100/70 p-1.5 rounded-full">
                              <XIcon className="h-5 w-5 text-red-600" />
                            </span>
                          </div>
                        )}
                      </td>
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
