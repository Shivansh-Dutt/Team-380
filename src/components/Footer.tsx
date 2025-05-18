
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t py-8">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold">E</span>
              </div>
              <span className="font-bold text-lg text-primary">EcoFinds</span>
            </Link>
            <p className="text-sm text-gray-600">
              Empowering sustainable consumption through a second-hand marketplace.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/add-product" className="text-sm text-gray-600 hover:text-primary">
                  Sell an Item
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-gray-600 hover:text-primary">
                  My Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/?category=clothing" className="text-sm text-gray-600 hover:text-primary">
                  Clothing
                </Link>
              </li>
              <li>
                <Link to="/?category=electronics" className="text-sm text-gray-600 hover:text-primary">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/?category=furniture" className="text-sm text-gray-600 hover:text-primary">
                  Furniture
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} EcoFinds. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
