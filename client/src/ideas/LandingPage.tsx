import React, { useState } from 'react';
import { Search, Upload, Shield, Clock, FileCheck, Zap, ChevronDown, Menu, X } from 'lucide-react';
import UploadComponent from './UploadComponent';
import SearchBar from './SearchBar';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-sm shadow-sm py-2' : 'bg-transparent py-4'
      }`}>
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-sky-500" />
            <span className="text-xl font-bold text-slate-900">LegalEagle</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-600 hover:text-sky-500 transition-colors text-sm font-medium">Features</a>
            <a href="#how-it-works" className="text-slate-600 hover:text-sky-500 transition-colors text-sm font-medium">How It Works</a>
            <a href="#testimonials" className="text-slate-600 hover:text-sky-500 transition-colors text-sm font-medium">Testimonials</a>
            <a href="#pricing" className="text-slate-600 hover:text-sky-500 transition-colors text-sm font-medium">Pricing</a>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <a href="#" className="text-slate-700 hover:text-sky-500 transition-colors text-sm font-medium">Sign in</a>
            <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-slate-700 hover:text-sky-500"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 py-4 px-4 animate-fadeIn">
            <div className="flex flex-col space-y-3">
              <a href="#features" className="text-slate-600 hover:text-sky-500 transition-colors py-2 text-sm font-medium">Features</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-sky-500 transition-colors py-2 text-sm font-medium">How It Works</a>
              <a href="#testimonials" className="text-slate-600 hover:text-sky-500 transition-colors py-2 text-sm font-medium">Testimonials</a>
              <a href="#pricing" className="text-slate-600 hover:text-sky-500 transition-colors py-2 text-sm font-medium">Pricing</a>
              <div className="pt-4 flex flex-col space-y-3">
                <a href="#" className="text-slate-700 hover:text-sky-500 transition-colors text-sm font-medium">Sign in</a>
                <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 md:pt-20 lg:pt-24">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-20">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Compliance at the <span className="text-sky-500">Speed of Light</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
              Streamline legal document management with automated compliance analysis, 
              actionable tasks, and a searchable system for legal teams.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-sky-500 text-white px-6 py-3 rounded-lg hover:bg-sky-600 transition-colors shadow-sm flex items-center justify-center font-medium">
                <Upload className="h-5 w-5 mr-2" />
                Upload Documents
              </button>
              <button className="bg-white text-slate-800 border border-slate-200 px-6 py-3 rounded-lg hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center font-medium">
                <Search className="h-5 w-5 mr-2" />
                Search Database
              </button>
            </div>
          </div>
          
          <div className="relative mx-auto max-w-5xl">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                alt="Legal documents and compliance" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-slate-900/10 rounded-2xl"></div>
            </div>
            
            {/* Floating stats */}
            <div className="absolute -bottom-6 left-10 md:left-20 bg-white rounded-lg shadow-lg p-4 flex items-center space-x-4 border border-slate-100">
              <div className="bg-sky-100 p-2 rounded-full">
                <Clock className="h-6 w-6 text-sky-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Time Saved</p>
                <p className="text-2xl font-bold text-sky-500">80%</p>
              </div>
            </div>
            
            <div className="absolute -top-6 right-10 md:right-20 bg-white rounded-lg shadow-lg p-4 flex items-center space-x-4 border border-slate-100">
              <div className="bg-sky-100 p-2 rounded-full">
                <FileCheck className="h-6 w-6 text-sky-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Compliance Rate</p>
                <p className="text-2xl font-bold text-sky-500">99.8%</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Logos section */}
        <div className="mt-20 py-10 border-y border-slate-200">
          <div className="container mx-auto px-4 md:px-6">
            <p className="text-center text-sm font-medium text-slate-500 mb-6">TRUSTED BY LEADING COMPANIES</p>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-8">
              {['Acme Inc', 'GlobalCorp', 'LexFirm', 'TechGiant', 'LegalCo'].map((company) => (
                <div key={company} className="text-slate-400 text-lg font-semibold">{company}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search and Upload Components */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <SearchBar />
            <div className="mt-12">
              <UploadComponent />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Powerful Features</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              LegalEagle provides cutting-edge tools to streamline your legal document workflow.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
              <div className="bg-sky-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Zap className="h-7 w-7 text-sky-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Lightning Fast Analysis</h3>
              <p className="text-slate-600">
                Process documents at unprecedented speeds with our AI-powered analysis engine.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
              <div className="bg-sky-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <FileCheck className="h-7 w-7 text-sky-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Automated Compliance</h3>
              <p className="text-slate-600">
                Automatically check documents against regulatory standards and internal policies.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
              <div className="bg-sky-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Clock className="h-7 w-7 text-sky-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Time-Saving Workflows</h3>
              <p className="text-slate-600">
                Reduce manual review time by up to 80% with intelligent document processing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our streamlined process makes document compliance simple and efficient.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -ml-px hidden md:block"></div>
              
              <div className="space-y-12 md:space-y-24">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 flex justify-center mb-6 md:mb-0 relative">
                    <div className="bg-sky-500 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-sm z-10">
                      1
                    </div>
                  </div>
                  <div className="md:w-1/2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Upload Your Documents</h3>
                    <p className="text-slate-600">
                      Simply drag and drop your legal documents into our secure platform. We support all major document formats.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 flex justify-center mb-6 md:mb-0 md:order-last relative">
                    <div className="bg-sky-500 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-sm z-10">
                      2
                    </div>
                  </div>
                  <div className="md:w-1/2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Automated Analysis</h3>
                    <p className="text-slate-600">
                      Our AI engine analyzes your documents for compliance issues and risks, identifying potential problems in seconds.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 flex justify-center mb-6 md:mb-0 relative">
                    <div className="bg-sky-500 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-sm z-10">
                      3
                    </div>
                  </div>
                  <div className="md:w-1/2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Review Insights</h3>
                    <p className="text-slate-600">
                      Receive detailed reports with actionable insights and compliance recommendations that you can implement immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What Our Clients Say</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Hear from legal professionals who have transformed their document workflows with LegalEagle.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full bg-sky-100 flex items-center justify-center mr-4">
                  <span className="text-sky-500 font-bold">JD</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Jane Doe</h4>
                  <p className="text-sm text-slate-500">Corporate Counsel, Tech Inc.</p>
                </div>
              </div>
              <p className="text-slate-600 italic">
                "LegalEagle has cut our document review time in half. The compliance checks are thorough and the interface is intuitive."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full bg-sky-100 flex items-center justify-center mr-4">
                  <span className="text-sky-500 font-bold">MS</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Michael Smith</h4>
                  <p className="text-sm text-slate-500">Compliance Officer, Finance Co.</p>
                </div>
              </div>
              <p className="text-slate-600 italic">
                "The automated compliance checks have saved us countless hours and helped us avoid potential regulatory issues."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full bg-sky-100 flex items-center justify-center mr-4">
                  <span className="text-sky-500 font-bold">AJ</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Amanda Johnson</h4>
                  <p className="text-sm text-slate-500">Legal Director, Global Corp</p>
                </div>
              </div>
              <p className="text-slate-600 italic">
                "LegalEagle has become an essential tool for our legal team. The search functionality alone is worth the investment."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Choose the plan that's right for your team. All plans include a 14-day free trial.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Starter</h3>
              <p className="text-slate-600 mb-6">For small legal teams</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900">$99</span>
                <span className="text-slate-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-slate-600">
                  <svg className="h-5 w-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Up to 100 documents
                </li>
                <li className="flex items-center text-slate-600">
                  <svg className="h-5 w-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Basic compliance checks
                </li>
                <li className="flex items-center text-slate-600">
                  <svg className="h-5 w-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Email support
                </li>
              </ul>
              <button className="w-full py-2 bg-white border border-sky-500 text-sky-500 rounded-lg hover:bg-sky-50 transition-colors font-medium">
                Start Free Trial
              </button>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-sky-500 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-sky-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Professional</h3>
              <p className="text-slate-600 mb-6">For growing legal departments</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900">$249</span>
                <span className="text-slate-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-slate-600">
                  <svg className="h-5 w-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Up to 500 documents
                </li>
                <li className="flex items-center text-slate-600">
                  <svg className="h-5 w-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Advanced compliance analysis
                </li>
                <li className="flex items-center text-slate-600">
                  <svg className="h-5 w-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Priority support
                </li>
                <li className="flex items-center text-slate-600">
                  <svg className="h-5 w-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Custom templates
                </li>
              </ul>
              <button className="w-full py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors font-medium">
                Start Free Trial
              </button>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Enterprise</h3>
              <p className="text-slate-600 mb-6">For large organizations</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900">$599</span>
                <span className="text-slate-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-slate-600">
                  <svg className="h-5 w-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited documents
                </li>
                <li className="flex items-center text-slate-600">
                  <svg className="h-5 w-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Enterprise-grade security
                </li>
                <li className="flex items-center text-slate-600">
                  <svg className="h-5 w-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  24/7 dedicated support
                </li>
                <li className="flex items-center text-slate-600">
                  <svg className="h-5 w-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  API access
                </li>
              </ul>
              <button className="w-full py-2 bg-white border border-sky-500 text-sky-500 rounded-lg hover:bg-sky-50 transition-colors font-medium">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-sky-500 to-sky-600 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Legal Workflow?</h2>
            <p className="text-xl text-sky-100 mb-8 max-w-2xl mx-auto">
              Join thousands of legal professionals who trust LegalEagle for their document compliance needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-white text-sky-600 px-8 py-3 rounded-lg hover:bg-sky-50 transition-colors shadow-sm text-lg font-medium">
                Get Started Today
              </button>
              <button className="bg-transparent border border-white text-white px-8 py-3 rounded-lg hover:bg-sky-600 transition-colors text-lg font-medium">
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6 text-sky-400" />
                <span className="text-xl font-bold text-white">LegalEagle</span>
              </div>
              <p className="mb-4">
                Compliance at the Speed of Light
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z" />
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR Compliance</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} LegalEagle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;