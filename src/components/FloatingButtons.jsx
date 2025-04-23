import React, { useState } from 'react';

const FloatingButtons = () => {
  const [showSupportModal, setShowSupportModal] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-4">
      {/* Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Landlord Support</h2>
              <button
                onClick={() => setShowSupportModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              If you need assistance with posting, please contact us using the information below:
            </p>
            <div className="space-y-3">
              <a
                href="tel:0938359708"
                className="flex items-center justify-center gap-2 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Phone: 0938359708
              </a>
              <a
                href="https://zalo.me/0938359708"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              >
                Zalo: 0938359708
              </a>
            </div>
            <div className="mt-6">
              <p className="text-gray-600 mb-3">After-hours Support:</p>
              <a
                href="https://zalo.me/Apartment58"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              >
                Zalo: Apartment58
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Support Button */}
      <button
        onClick={() => setShowSupportModal(true)}
        className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all duration-300"
        title="Support"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="bg-gray-700 hover:bg-gray-800 text-white p-3 rounded-full shadow-lg transition-all duration-300"
        title="Back to top"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
};

export default FloatingButtons;