
import React from 'react';
import { CheckIcon, XIcon } from 'lucide-react';

type Feature = {
  name: string;
  rezume: boolean;
  competitors: {
    resumeGenius: boolean;
    indeed: boolean;
    zety: boolean;
  };
};

const features: Feature[] = [
  {
    name: "AI-Powered Resume Generation",
    rezume: true,
    competitors: { resumeGenius: false, indeed: false, zety: true }
  },
  {
    name: "ATS-Friendly Templates",
    rezume: true,
    competitors: { resumeGenius: true, indeed: true, zety: true }
  },
  {
    name: "Customizable Design Options",
    rezume: true,
    competitors: { resumeGenius: true, indeed: false, zety: true }
  },
  {
    name: "Industry-Specific Suggestions",
    rezume: true,
    competitors: { resumeGenius: false, indeed: false, zety: false }
  },
  {
    name: "Free Basic Version",
    rezume: true,
    competitors: { resumeGenius: false, indeed: true, zety: false }
  },
  {
    name: "Unlimited Downloads",
    rezume: true,
    competitors: { resumeGenius: false, indeed: false, zety: false }
  },
  {
    name: "Cover Letter Builder",
    rezume: true,
    competitors: { resumeGenius: true, indeed: false, zety: true }
  },
  {
    name: "Real-Time Feedback",
    rezume: true,
    competitors: { resumeGenius: false, indeed: false, zety: true }
  },
  {
    name: "Job Application Tracking",
    rezume: true,
    competitors: { resumeGenius: false, indeed: true, zety: false }
  },
  {
    name: "No Watermarks",
    rezume: true,
    competitors: { resumeGenius: false, indeed: true, zety: false }
  }
];

export const ComparisonTable = () => {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How Rezume.dev Compares
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            See how we stack up against other resume builders in the market
          </p>
        </div>
        
        <div className="mt-8 overflow-hidden shadow-lg rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">Features</th>
                  <th scope="col" className="py-3.5 px-4 text-center text-sm font-semibold text-gray-900 bg-blue-50">Rezume.dev</th>
                  <th scope="col" className="py-3.5 px-4 text-center text-sm font-semibold text-gray-900">Resume Genius</th>
                  <th scope="col" className="py-3.5 px-4 text-center text-sm font-semibold text-gray-900">Indeed</th>
                  <th scope="col" className="py-3.5 px-4 text-center text-sm font-semibold text-gray-900">Zety</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {features.map((feature, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">{feature.name}</td>
                    <td className="py-4 px-4 text-center bg-blue-50">
                      {feature.rezume ? (
                        <CheckIcon className="h-5 w-5 text-green-600 mx-auto" />
                      ) : (
                        <XIcon className="h-5 w-5 text-red-600 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {feature.competitors.resumeGenius ? (
                        <CheckIcon className="h-5 w-5 text-green-600 mx-auto" />
                      ) : (
                        <XIcon className="h-5 w-5 text-red-600 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {feature.competitors.indeed ? (
                        <CheckIcon className="h-5 w-5 text-green-600 mx-auto" />
                      ) : (
                        <XIcon className="h-5 w-5 text-red-600 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {feature.competitors.zety ? (
                        <CheckIcon className="h-5 w-5 text-green-600 mx-auto" />
                      ) : (
                        <XIcon className="h-5 w-5 text-red-600 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;
