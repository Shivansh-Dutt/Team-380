
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Plus, ShoppingCart, User, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";

export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleMenu}
        aria-label="Menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="container h-full flex flex-col">
            <div className="flex items-center justify-between py-4">
              <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">E</span>
                </div>
                <span className="font-bold text-lg text-primary">EcoFinds</span>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMenu}
                aria-label="Close Menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="flex flex-col py-8 space-y-6">
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="flex items-center space-x-3 px-4 py-2"
                    onClick={closeMenu}
                  >
                    <User className="h-5 w-5 text-primary" />
                    <span className="font-medium">My Profile</span>
                  </Link>
                  <Link 
                    to="/my-listings" 
                    className="flex items-center space-x-3 px-4 py-2"
                    onClick={closeMenu}
                  >
                    <Package className="h-5 w-5 text-primary" />
                    <span className="font-medium">My Listings</span>
                  </Link>
                  <Link 
                    to="/cart" 
                    className="flex items-center space-x-3 px-4 py-2"
                    onClick={closeMenu}
                  >
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    <span className="font-medium">Cart</span>
                  </Link>
                  <Link 
                    to="/add-product" 
                    className="flex items-center space-x-3 px-4 py-2"
                    onClick={closeMenu}
                  >
                    <Plus className="h-5 w-5 text-primary" />
                    <span className="font-medium">Sell an Item</span>
                  </Link>
                  <Link 
                    to="/purchases" 
                    className="flex items-center space-x-3 px-4 py-2"
                    onClick={closeMenu}
                  >
                    <Package className="h-5 w-5 text-primary" />
                    <span className="font-medium">Previous Purchases</span>
                  </Link>
                  <div 
                    className="flex items-center space-x-3 px-4 py-2 cursor-pointer"
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                  >
                    <span className="font-medium text-red-500">Logout</span>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="flex items-center space-x-3 px-4 py-2"
                    onClick={closeMenu}
                  >
                    <span className="font-medium">Login</span>
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex items-center space-x-3 px-4 py-2"
                    onClick={closeMenu}
                  >
                    <span className="font-medium text-primary">Sign Up</span>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
