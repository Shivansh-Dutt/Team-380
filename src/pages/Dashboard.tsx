
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { getUserListings, getUserPurchases } from "../types/product";
import ProductCard from "../components/ProductCard";

const Dashboard = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  
  // Get a few of user's listings and purchases to show previews
  const userListings = user ? getUserListings(user.id).slice(0, 3) : [];
  const userPurchases = user ? getUserPurchases(user.id).slice(0, 3) : [];

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const handleSaveProfile = async () => {
    if (user) {
      try {
        await updateProfile({
          username,
          avatar
        });
        setIsEditing(false);
        toast.success("Profile updated successfully");
      } catch (error) {
        toast.error("Failed to update profile");
        console.error(error);
      }
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Manage your account details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-muted overflow-hidden">
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="flex-grow space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="username" className="text-sm font-medium">
                        Username
                      </label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input
                        id="email"
                        value={user.email}
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setUsername(user.username);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile}>
                        Save Changes
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Username</p>
                      <p className="font-medium">{user.username}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={handleLogout}
                      >
                        Log Out
                      </Button>
                      <Button onClick={() => setIsEditing(true)}>
                        Edit Profile
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Listings Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">My Listings</h2>
          <Link to="/my-listings">
            <Button variant="link">View All</Button>
          </Link>
        </div>
        
        {userListings.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground mb-4">You haven't listed any items yet</p>
              <Link to="/add-product">
                <Button>List an Item</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="product-grid">
            {userListings.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Recent Purchases Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Purchases</h2>
          <Link to="/purchases">
            <Button variant="link">View All</Button>
          </Link>
        </div>
        
        {userPurchases.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground mb-4">You haven't made any purchases yet</p>
              <Link to="/">
                <Button>Browse Items</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="product-grid">
            {userPurchases.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
