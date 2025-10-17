import React from 'react';
import { Facebook, Instagram, Youtube, Linkedin, Mail, Phone, MapPin, Award } from 'lucide-react';
import { OptimizedImage } from '@/components/OptimizedImage';
import { Link } from 'react-router-dom';
import BusinessInfoDisplay from '@/components/BusinessInfoDisplay';


const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-900 text-white border-t-4 border-amber-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <OptimizedImage
                src="https://d64gsuwffb70l.cloudfront.net/6851e91275b884fa54047eb7_1759425593381_497bd79a.webp"
                alt="Hoven Construction Corp - Los Angeles Premier Construction Company"
                width={200}
                height={80}
                className="h-16 w-auto mb-3"
                loading="lazy"
              />
            </div>

            <p className="text-gray-400 mb-2 font-semibold">
              Est. 2009
            </p>
            <p className="text-gray-400 mb-4">
              Los Angeles' premier construction company specializing in home remodels and ADU construction.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-amber-400">Services</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => handleLinkClick('services')} className="text-gray-400 hover:text-amber-400 transition-colors">
                  Kitchen Remodeling
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('services')} className="text-gray-400 hover:text-amber-400 transition-colors">
                  Bathroom Renovation
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('services')} className="text-gray-400 hover:text-amber-400 transition-colors">
                  ADU Construction
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('services')} className="text-gray-400 hover:text-amber-400 transition-colors">
                  Whole Home Remodels
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('services')} className="text-gray-400 hover:text-amber-400 transition-colors">
                  Room Additions
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-amber-400">Service Areas</h4>
            <ul className="space-y-2">
              <li><a href="/location/beverly-hills" className="text-gray-400 hover:text-amber-400">Beverly Hills</a></li>
              <li><a href="/location/santa-monica" className="text-gray-400 hover:text-amber-400">Santa Monica</a></li>
              <li className="text-gray-400">Venice</li>
              <li className="text-gray-400">Brentwood</li>
              <li className="text-gray-400">Pacific Palisades</li>
              <li className="text-gray-400">Manhattan Beach</li>
              <li className="text-gray-400">Culver City</li>
            </ul>
          </div>


          <div>
            <h4 className="text-lg font-semibold mb-4 text-amber-400">Contact Info</h4>
            <div className="space-y-3">
              <a href="tel:+13108532131" className="flex items-center gap-3 text-gray-400 hover:text-amber-400">
                <Phone className="w-5 h-5" />
                310.853.2131
              </a>
              <a href="mailto:hein@hovenconstruction.com" className="flex items-center gap-3 text-gray-400 hover:text-amber-400">
                <Mail className="w-5 h-5" />
                hein@hovenconstruction.com
              </a>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5" />
                Los Angeles, CA
              </div>
            </div>

            <div className="mt-4 p-4 bg-slate-800 rounded-lg border-2 border-amber-400/30">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-bold text-amber-400">Licensed & Insured</span>
              </div>
              <div className="text-xs text-gray-300">
                CA License #1118018
              </div>
              <div className="text-xs text-gray-300 mt-1">
                EPA Lead-Safe Certified
              </div>
              <div className="text-xs text-gray-400 mt-1">
                NAT-F282538-1
              </div>
            </div>

          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Hoven Construction Corp. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-amber-400 text-sm">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-amber-400 text-sm">Terms of Service</Link>
              <a href="/admin" className="text-gray-400 hover:text-amber-400 text-sm">Admin</a>


            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;