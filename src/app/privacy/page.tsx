import React from 'react';

export const metadata = {
  title: 'Privacy Policy | Tadex',
  description: 'Privacy Policy for Tadex, a product of Voreza Technologies.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-[#004859]/10 text-[#004859] px-4 py-2 rounded-full text-sm font-medium mb-4">
            Privacy Policy
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#004859] mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Last Updated: May 27, 2026
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 space-y-6 text-slate-700 leading-relaxed">
          <p>
            Voreza Technologies ("we", "us", or "our") operates the Tadex platform (the "Platform"). This Privacy Policy describes how we collect, use, and share information in connection with your use of our Platform.
          </p>

          <h2 className="text-xl font-bold text-[#004859] mt-6">1. Information We Collect</h2>
          <p>
            We only collect the personal data that you voluntarily provide to us when registering for our waitlist or subscribing to our Platform features, which may include your email address. We do not collect or store any personal financial information, identity cards, or credentials.
          </p>

          <h2 className="text-xl font-bold text-[#004859] mt-6">2. How We Use Information</h2>
          <p>
            We use your contact information solely to manage your waitlist status, send you Platform updates, verify your subscription status, and provide customer support.
          </p>

          <h2 className="text-xl font-bold text-[#004859] mt-6">3. Data Sharing and Third Parties</h2>
          <p>
            We do not sell, rent, or trade your personal data with third parties. We only share information with third-party service providers (such as payment processors for billing verification) as necessary to facilitate our Platform operations, or as required by law.
          </p>

          <h2 className="text-xl font-bold text-[#004859] mt-6">4. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our data practices, please contact us at support@tadexapp.com.
          </p>
        </div>
      </div>
    </div>
  );
}