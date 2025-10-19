import React from 'react';
import { useSelector } from 'react-redux';
import Layout from '../../components/Layout/Layout';

const ReaderDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6 bg-white border-b border-gray-200">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Reader Dashboard
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Stories Read</h3>
                    <p className="text-3xl font-bold text-blue-600">0</p>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Likes Given</h3>
                    <p className="text-3xl font-bold text-green-600">0</p>
                  </div>
                  
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-800 mb-2">Comments</h3>
                    <p className="text-3xl font-bold text-purple-600">0</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Welcome, {user?.firstName}!</h3>
                  <p className="text-gray-600 mb-4">
                    As a reader, you can explore amazing stories, like your favorite pieces, 
                    and engage with writers through comments.
                  </p>
                  <div className="space-x-4">
                    <button className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700">
                      Browse Stories
                    </button>
                    <button className="border border-primary-600 text-primary-600 px-6 py-2 rounded-md hover:bg-primary-50">
                      My Favorites
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReaderDashboard;