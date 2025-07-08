
const KeyStatsSection = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="animate-fade-in">
            <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
            <div className="text-gray-600">Time Reduction in Data Processing</div>
          </div>
          <div className="animate-fade-in">
            <div className="text-3xl font-bold text-indigo-600 mb-2">500+</div>
            <div className="text-gray-600">CA Firms Trust Us</div>
          </div>
          <div className="animate-fade-in">
            <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
            <div className="text-gray-600">Uptime Guarantee</div>
          </div>
          <div className="animate-fade-in">
            <div className="text-3xl font-bold text-pink-600 mb-2">24/7</div>
            <div className="text-gray-600">AI Assistant Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KeyStatsSection;
