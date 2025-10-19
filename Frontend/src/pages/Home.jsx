import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from '../components/Layout/Layout';

const Home = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Hero Section */}
        <section className="py-20">
          <div className="max-w-7xl !mx-auto !px-4 sm:!px-6 lg:!px-8 text-center">
            <h1 className="text-5xl font-bold text-gray-900 !mb-6">
              Welcome to <span className="text-primary-600">Versera</span>
            </h1>
            <p className="text-xl text-gray-600 !mb-8 max-w-3xl !mx-auto">
              A platform where writers share their stories and readers discover amazing content. 
              Join our community of storytellers and book lovers.
            </p>
            
            {!isAuthenticated ? (
              <div className="!space-x-4">
                <Link
                  to="/register"
                  className="bg-primary-600 text-white !px-8 !py-3 rounded-lg hover:bg-primary-700 transition text-lg font-medium"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="border border-primary-600 text-primary-600 !px-8 !py-3 rounded-lg hover:bg-primary-50 transition text-lg font-medium"
                >
                  Login
                </Link>
              </div>
            ) : (
              <div className="!space-x-4">
                {user?.role === 'writer' && (
                  <Link
                    to="/writer/dashboard"
                    className="bg-primary-600 text-white !px-8 !py-3 rounded-lg hover:bg-primary-700 transition text-lg font-medium"
                  >
                    Writer Dashboard
                  </Link>
                )}
                {user?.role === 'reader' && (
                  <Link
                    to="/dashboard"
                    className="bg-primary-600 text-white !px-8 !py-3 rounded-lg hover:bg-primary-700 transition text-lg font-medium"
                  >
                    Reader Dashboard
                  </Link>
                )}
                <Link
                  to="/stories"
                  className="border border-primary-600 text-primary-600 !px-8 !py-3 rounded-lg hover:bg-primary-50 transition text-lg font-medium"
                >
                  Browse Stories
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="!py-16 bg-white">
          <div className="max-w-7xl !mx-auto px-4 sm:!px-6 lg:!px-8">
            <div className="text-center !mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Why Choose Versera?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center !p-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center !mx-auto !mb-4">
                  <span className="text-2xl">✍️</span>
                </div>
                <h3 className="text-xl font-semibold !mb-2">For Writers</h3>
                <p className="text-gray-600">
                  Share your stories, build your audience, and get feedback from readers around the world.
                </p>
              </div>
              
              <div className="text-center !p-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center !mx-auto !mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-xl font-semibold !mb-2">For Readers</h3>
                <p className="text-gray-600">
                  Discover amazing stories, connect with writers, and be part of a vibrant reading community.
                </p>
              </div>
              
              <div className="text-center !p-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center !mx-auto !mb-4">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="text-xl font-semibold !mb-2">Safe & Secure</h3>
                <p className="text-gray-600">
                  Your content is protected with copyright features and community guidelines.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;