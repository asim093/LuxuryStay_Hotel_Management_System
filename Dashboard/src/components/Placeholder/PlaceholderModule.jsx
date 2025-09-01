import { useState } from 'react';
import { 
  Hotel, 
  Calendar, 
  CreditCard, 
  BarChart3, 
  Settings,
  Construction
} from 'lucide-react';

const PlaceholderModule = ({ title, description, icon: Icon, features }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-6">
          <Icon size={40} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">{description}</p>
      </div>

      {/* Coming Soon Card */}
      <div className="card bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Construction size={48} className="text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon!</h2>
        <p className="text-gray-600 mb-6">
          This module is currently under development. We're working hard to bring you the best experience.
        </p>
        
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3">Planned Features:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-blue-800">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="btn btn-outline"
        >
          {isExpanded ? 'Show Less' : 'Learn More'}
        </button>

        {isExpanded && (
          <div className="mt-6 text-left bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Development Status:</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>UI/UX Design - Completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Frontend Development - In Progress</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span>Backend Integration - Planned</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span>Testing & Deployment - Planned</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Need This Feature?</h3>
          <p className="text-gray-600 mb-4">
            If you need this functionality urgently, please contact our development team.
          </p>
          <button className="btn btn-primary btn-sm">Contact Support</button>
        </div>

        <div className="card bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Suggestions?</h3>
          <p className="text-gray-600 mb-4">
            Have ideas for features? We'd love to hear your suggestions!
          </p>
          <button className="btn btn-outline btn-sm">Submit Feedback</button>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderModule;
