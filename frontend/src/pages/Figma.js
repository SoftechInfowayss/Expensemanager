// App.jsx
import React from "react";

const App = () => {
  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      {/* Navbar */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="https://via.placeholder.com/32x32/4ade80/ffffff?text=V" alt="Logo" />
            <span className="text-xl font-bold text-gray-800">Nexcent</span>
          </div>
          <nav className="hidden md:flex space-x-8 text-gray-600">
            <a href="#" className="hover:text-black">Home</a>
            <a href="#" className="hover:text-black">Features</a>
            <a href="#" className="hover:text-black">Community</a>
            <a href="#" className="hover:text-black">Blog</a>
            <a href="#" className="hover:text-black">Pricing</a>
          </nav>
          <button className="ml-6 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
            Register Now →
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 flex flex-col-reverse md:flex-row items-center gap-10">
        {/* Left */}
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Lessons and insights <br />
            <span className="text-green-500">from 8 years</span>
          </h1>
          <p className="text-gray-500 mt-4">
            Where to grow your business as a photographer: site or social media?
          </p>
          <button className="mt-6 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
            Register
          </button>
        </div>
        {/* Right */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src="https://via.placeholder.com/400x300/10b981/ffffff?text=Illustration"
            alt="Hero Illustration"
            className="w-full max-w-sm"
          />
        </div>
      </section>

      {/* Dots */}
      <div className="flex justify-center space-x-2 pb-8">
        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
        <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
        <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
      </div>
      {/* Our Clients Section */}
<section className="bg-white py-16 text-center">
  <div className="max-w-4xl mx-auto px-4">
    <p className="text-green-500 text-sm mb-4">● ● ●</p>
    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Our Clients</h2>
    <p className="text-gray-500 mb-8">
      We have been working with some Fortune 500+ clients
    </p>

    {/* Logos */}
    <div className="flex flex-wrap justify-center gap-8 items-center mb-12">
      {["🌀", "👁️", "🖥️", "🎨", "🔗", "📟"].map((icon, idx) => (
        <div
          key={idx}
          className="text-3xl bg-gray-100 p-4 rounded-md shadow-sm"
        >
          {icon}
        </div>
      ))}
    </div>

    {/* Community System Heading */}
    <h3 className="text-2xl font-semibold text-gray-800 mb-2">
      Manage your entire community in a single system
    </h3>
    <p className="text-gray-500 mb-12">Who is Nexcent suitable for?</p>

    {/* Category Cards */}
    <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
      {/* Card 1 */}
      <div className="bg-white border rounded-lg shadow-sm p-6 text-left">
        <div className="bg-green-100 w-12 h-12 flex items-center justify-center rounded-full mb-4 text-green-600 text-2xl">
          👥
        </div>
        <h4 className="text-lg font-semibold text-gray-800 mb-2">
          Membership Organisations
        </h4>
        <p className="text-gray-500 text-sm">
          Empower your members with engagement and value.
        </p>
      </div>

      {/* Card 2 */}
      <div className="bg-white border rounded-lg shadow-sm p-6 text-left">
        <div className="bg-green-100 w-12 h-12 flex items-center justify-center rounded-full mb-4 text-green-600 text-2xl">
          🏢
        </div>
        <h4 className="text-lg font-semibold text-gray-800 mb-2">
          National Associations
        </h4>
        <p className="text-gray-500 text-sm">
          Streamline your national-level coordination with ease.
        </p>
      </div>

      {/* Card 3 */}
      <div className="bg-white border rounded-lg shadow-sm p-6 text-left">
        <div className="bg-green-100 w-12 h-12 flex items-center justify-center rounded-full mb-4 text-green-600 text-2xl">
          🚴‍♂️
        </div>
        <h4 className="text-lg font-semibold text-gray-800 mb-2">
          Clubs And Groups
        </h4>
        <p className="text-gray-500 text-sm">
          Bring your community together with powerful tools.
        </p>
      </div>
    </div>
  </div>
</section>

    </div>
  );
};

export default App;
