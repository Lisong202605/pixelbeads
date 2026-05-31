export function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">Last updated: May 31, 2026</p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
        <p className="text-gray-600 mb-4">
          We collect minimal information to provide our services:
        </p>
        <ul className="list-disc pl-6 text-gray-600 mb-6">
          <li>IP address (anonymized for analytics)</li>
          <li>Browser type and version</li>
          <li>Usage data (pages visited, features used)</li>
          <li>Images you upload for pattern conversion (temporary)</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
        <p className="text-gray-600 mb-4">
          We use the collected information to:
        </p>
        <ul className="list-disc pl-6 text-gray-600 mb-6">
          <li>Provide and improve our services</li>
          <li>Analyze usage patterns</li>
          <li>Display relevant advertisements</li>
          <li>Prevent abuse and ensure security</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Cookies</h2>
        <p className="text-gray-600 mb-4">
          We use cookies and similar technologies to enhance your experience. 
          You can control cookies through your browser settings.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Third-Party Services</h2>
        <p className="text-gray-600 mb-4">
          We use the following third-party services:
        </p>
        <ul className="list-disc pl-6 text-gray-600 mb-6">
          <li>Google Analytics (usage analytics)</li>
          <li>Google AdSense (advertising)</li>
          <li>Cloudflare (hosting and security)</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Data Retention</h2>
        <p className="text-gray-600 mb-4">
          Uploaded images are processed immediately and not stored on our servers. 
          Analytics data is retained for 26 months.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Your Rights</h2>
        <p className="text-gray-600 mb-4">
          You have the right to:
        </p>
        <ul className="list-disc pl-6 text-gray-600 mb-6">
          <li>Access your personal data</li>
          <li>Request deletion of your data</li>
          <li>Opt-out of analytics tracking</li>
          <li>Withdraw cookie consent</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Contact Us</h2>
        <p className="text-gray-600">
          If you have any questions about this Privacy Policy, please contact us at:
          privacy@pixelbeads.design
        </p>
      </div>
    </div>
  );
}
