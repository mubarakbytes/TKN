import React, { useState } from 'react';

export default function HelpContent() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: 'How can I track my order?',
      answer: 'You can track your order by going to the "Orders" section and clicking on the order you want to track. Tracking details will be shown if available.',
    },
    {
      question: 'How do I contact customer support?',
      answer: 'You can contact support through our live chat, email us at support@example.com, or call us at +252 123 4567.',
    },
    {
      question: 'How do I reset my password?',
      answer: 'Go to the Profile Settings page, and enter a new password. Leave the password field empty if you don’t want to change it.',
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Help & Support</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Find answers to common questions or contact our support team.</p>
      </div>

      {/* FAQ Section */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow p-4"
          >
            <button
              onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              className="w-full text-left flex justify-between items-center"
            >
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{faq.question}</span>
              <span className="text-gray-500 dark:text-gray-400">{openFAQ === index ? '−' : '+'}</span>
            </button>
            {openFAQ === index && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{faq.answer}</p>
            )}
          </div>
        ))}

        {/* Contact Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Still need help?</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Reach out to our support team anytime.</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            📧 <span className="font-medium">Email:</span> support@example.com
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            📞 <span className="font-medium">Phone:</span> +252 123 4567
          </p>
        </div>
      </div>
    </div>
  );
}
