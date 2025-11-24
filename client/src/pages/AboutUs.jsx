import React from 'react'
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa'

const AboutUs = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Lê Tấn Nguyện",
      role: "CEO & Founder",
      image: "https://ui-avatars.com/api/?name=Le+Tan+Nguyen&background=3B82F6&color=fff&size=400",
      description: "Passionate about fashion and technology with 10+ years of experience in e-commerce.",
      email: "nguyenvana@veloura.com",
      linkedin: "#",
      github: "#"
    },
    {
      id: 2,
      name: "Võ Ngọc Phú",
      role: "Creative Director",
      image: "https://ui-avatars.com/api/?name=Vo+Ngoc+Phu&background=10B981&color=fff&size=400",
      description: "Expert in fashion design and branding with a keen eye for trends and customer preferences.",
      email: "vongocphu@veloura.com",
      linkedin: "#",
      github: "#"
    },
    {
      id: 3,
      name: "Dương Ngọc Linh Đan",
      role: "Technical Lead",
      image: "https://ui-avatars.com/api/?name=Duong+Ngoc+Linh+Dan&background=8B5CF6&color=fff&size=400",
      description: "Full-stack developer specializing in building scalable e-commerce platforms and solutions.",
      email: "duongngoclinhdan@veloura.com",
      linkedin: "#",
      github: "#"
    },
    {
      id: 4,
      name: "Dương Chí Thiện",
      role: "Marketing Manager",
      image: "https://ui-avatars.com/api/?name=Duong+Chi+Thien&background=F59E0B&color=fff&size=400",
      description: "Marketing strategist focused on digital growth and building strong customer relationships.",
      email: "duongchithien@veloura.com",
      linkedin: "#",
      github: "#"
    }
  ]

  return (
    <div className="max-padd-container py-12 md:py-20">
      {/* Hero Section */}
      <div className="text-center mb-16 mt-20">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          About <span className="text-secondary">Veloura</span>
        </h1>
        <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          We are a passionate team dedicated to bringing you the finest collection of fashion. 
          Our mission is to make quality clothing accessible to everyone while maintaining 
          sustainable and ethical practices.
        </p>
      </div>

      {/* Our Story Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 md:p-12 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Story</h2>
        <div className="max-w-4xl mx-auto space-y-4 text-gray-700 leading-relaxed">
          <p>
            Founded in 2020, Veloura started with a simple vision: to create a clothing brand 
            that combines style, quality, and affordability. What began as a small online store 
            has grown into a trusted destination for fashion enthusiasts worldwide.
          </p>
          <p>
            We believe that everyone deserves to look and feel their best. That's why we carefully 
            curate each piece in our collection, ensuring it meets our high standards for quality, 
            comfort, and design. From casual everyday wear to elegant formal attire, we have something 
            for every occasion.
          </p>
          <p>
            Our commitment extends beyond just selling clothes. We're dedicated to sustainable fashion 
            practices, ethical manufacturing, and giving back to our community. When you shop with us, 
            you're not just buying clothes – you're supporting a movement toward better fashion.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Meet Our Team</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          The talented individuals behind Veloura who work tirelessly to bring you 
          the best shopping experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <div 
              key={member.id}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden aspect-square">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-secondary font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {member.description}
                </p>

                {/* Social Links */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-600 rounded-full hover:bg-secondary hover:text-white transition-all duration-300"
                    title="Email"
                  >
                    <FaEnvelope className="w-4 h-4" />
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-600 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300"
                    title="LinkedIn"
                  >
                    <FaLinkedin className="w-4 h-4" />
                  </a>
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300"
                    title="GitHub"
                  >
                    <FaGithub className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="text-center p-8 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            ⭐
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Quality First</h3>
          <p className="text-gray-600">
            We never compromise on quality. Every product is carefully inspected to meet our high standards.
          </p>
        </div>

        <div className="text-center p-8 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            🌱
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Sustainable</h3>
          <p className="text-gray-600">
            Committed to eco-friendly practices and reducing our environmental footprint.
          </p>
        </div>

        <div className="text-center p-8 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            ❤️
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Customer Focused</h3>
          <p className="text-gray-600">
            Your satisfaction is our priority. We're here to provide exceptional service and support.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-secondary to-tertiary rounded-2xl p-8 md:p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Join Our Fashion Journey</h2>
        <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
          Subscribe to our newsletter and be the first to know about new collections, 
          exclusive offers, and fashion tips.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-6 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button className="px-8 py-3 bg-white text-secondary font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  )
}

export default AboutUs
