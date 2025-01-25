'use client';
import { useState } from 'react';  // for handling tab switching
import AllApplications from '../../components/allapplication/AllApplications';
import ShortlistedApplications from '../../components/allapplication/ShortlistedApplications';
import Layout from '../../components/layout';

const CandidateApplication = () => {
  // State to track active tab
  //const [activeTab, setActiveTab] = useState('all');  // to be restored
  const [activeTab, setActiveTab] = useState('shortlisted');

  return (
    <Layout>
      {/* Tab Navigation */}
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px">
            {/* All Applications Tab */}
            <li className="me-2">
              <button
                type="button"
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === 'all'
                    ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('all')}
              >
                All Applications
              </button>
            </li>

            {/* Shortlisted Applications Tab */}
            <li className="me-2">
              <button
                type="button"
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === 'shortlisted'
                    ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('shortlisted')}
              >
                Shortlisted Applications
              </button>
            </li>
          </ul>
        </div>

        {/* Tab Content */}
        <div className="mt-1">
          {activeTab === 'all' ? <AllApplications /> : <ShortlistedApplications />}
        </div>
    </Layout>
  );
};

export default CandidateApplication;
