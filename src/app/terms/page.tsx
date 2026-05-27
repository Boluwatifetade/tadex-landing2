import React from 'react';

export const metadata = {
  title: 'Terms of Service | Tadex',
  description: 'Terms of Service for Tadex, a product of Voreza Technologies.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-[#004859]/10 text-[#004859] px-4 py-2 rounded-full text-sm font-medium mb-4">
            Terms of Service
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#004859] mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Last Updated: May 27, 2026
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 space-y-6 text-slate-700 leading-relaxed">
          <p>
            Welcome to Tadex (the "Platform"), owned and operated by Voreza Technologies ("we", "us", or "our"). By accessing or using the Platform, you agree to be bound by these Terms of Service ("Terms"). If you do not agree, please do not use the Platform.
          </p>

          <h2 className="text-xl font-bold text-[#004859] mt-6">1. Eligibility</h2>
          <p>
            You must be at least 18 years old and have the capacity to form a binding contract to use this Platform.
          </p>

          <h2 className="text-xl font-bold text-[#004859] mt-6">2. Nature of Service</h2>
          <p>
            Tadex is a workflow automation platform. We do not provide financial services, trading services, investment advice, or brokerage services. Voreza Technologies does not hold, manage, or have custody of user funds or assets. All outcomes or actions that occur on third-party systems connected by you are outside our control and liability.
          </p>

          <h2 className="text-xl font-bold text-[#004859] mt-6">3. Disclaimer of Warranties</h2>
          <p>
            The Platform is provided on an "AS IS" and "AS AVAILABLE" basis, without any warranties of any kind, either express or implied. We do not warrant that the Platform will be uninterrupted, error-free, or completely secure.
          </p>

          <h2 className="text-xl font-bold text-[#004859] mt-6">4. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Voreza Technologies shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages, including but not limited to loss of profits, data, or goodwill, arising out of your use or inability to use the Platform.
          </p>

          <h2 className="text-xl font-bold text-[#004859] mt-6">5. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to its conflict of law principles.
          </p>

          <h2 className="text-xl font-bold text-[#004859] mt-6">6. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at support@voreza.com.
          </p>
        </div>
      </div>
    </div>
  );
}