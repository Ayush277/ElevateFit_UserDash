import React, { useState, useEffect } from 'react';
import { User, Search, Droplets, Crown, Bike, FileWarning as Running, Footprints, Plus, Minus } from 'lucide-react';

function App() {
  // User profile state
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [waterCount, setWaterCount] = useState<number>(2);
  const [weightLossPercentage, setWeightLossPercentage] = useState<number>(3);
  const [weekStreak, setWeekStreak] = useState<number>(3);
  
  // Load profile picture from localStorage on component mount
  useEffect(() => {
    const savedProfilePic = localStorage.getItem('profilePic');
    if (savedProfilePic) {
      setProfilePic(savedProfilePic);
    }
  }, []);

  // Simulate weight loss progress over time
  useEffect(() => {
    const timer = setInterval(() => {
      setWeightLossPercentage(prev => {
        const newValue = prev + 0.01;
        return newValue > 100 ? 100 : newValue;
      });
    }, 60000); // Update every minute for demo purposes
    
    return () => clearInterval(timer);
  }, []);

  // Handle file upload for profile picture
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        localStorage.setItem('profilePic', base64String);
        setProfilePic(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle water intake tracking
  const handleWaterClick = () => {
    if (waterCount < 10) {
      setWaterCount(prev => prev + 1);
      // Update streak if this is the first water of the day
      if (waterCount === 0) {
        updateStreak();
      }
    }
  };

  const handleWaterDecrement = () => {
    if (waterCount > 0) {
      setWaterCount(prev => prev - 1);
    }
  };

  // Update weekly streak
  const updateStreak = () => {
    if (weekStreak < 7) {
      setWeekStreak(prev => prev + 1);
    }
  };

  // Calculate pie chart segments for weight loss visualization
  const calculatePieChartStyle = (percentage: number) => {
    return {
      background: `conic-gradient(#0ea5e9 0% ${percentage}%, #e5e7eb ${percentage}% 100%)`
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - User Info and Weight Goal */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-cyan-500 overflow-hidden relative">
                {profilePic ? (
                  <img 
                    src={profilePic} 
                    alt="User Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={32} className="text-cyan-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                )}
                <label htmlFor="profile-upload" className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer transition-opacity">
                  <span className="text-white text-xs">Change</span>
                </label>
                <input 
                  id="profile-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleProfilePicChange}
                />
              </div>
              <div>
                <h2 className="text-xl font-bold">AYUSH</h2>
                <p className="text-gray-500 text-sm">Joined 4 months ago</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold mb-2">Weight loss Goal</h3>
              <p className="mb-4"><span className="font-bold">Loss: 5kg</span> / Month</p>
              
              <div className="relative h-40 w-40 mx-auto mb-4">
                <div 
                  className="w-full h-full rounded-full"
                  style={calculatePieChartStyle(weightLossPercentage)}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white rounded-full w-32 h-32 flex items-center justify-center">
                    <span className="text-2xl font-bold text-cyan-500">{weightLossPercentage.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              <p className="text-center text-sm text-gray-500">Progress updates in real-time</p>
            </div>
          </div>
          
          {/* Middle Column - Progress Bars */}
          <div className="space-y-6">
            <div className="bg-gray-200 rounded-full flex items-center px-4 py-2">
              <Search size={20} className="text-gray-500 mr-2" />
              <input 
                type="text" 
                placeholder="Search Activities, messages" 
                className="bg-transparent w-full outline-none text-gray-700"
              />
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Weight loss Goal</span>
                  <span>{weightLossPercentage.toFixed(1)}%</span>
                </div>
                <div className="h-4 bg-gray-400 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-400 rounded-full transition-all duration-1000" 
                    style={{ width: `${weightLossPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Daily water goal</span>
                  <span>{waterCount}/10</span>
                </div>
                <div className="h-4 bg-gray-400 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-400 rounded-full transition-all duration-300" 
                    style={{ width: `${waterCount * 10}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Week Streak</span>
                  <span>{weekStreak}/7</span>
                </div>
                <div className="h-4 bg-gray-400 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-400 rounded-full transition-all duration-300" 
                    style={{ width: `${(weekStreak / 7) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Water and Leaderboard */}
          <div className="space-y-6">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:shadow-lg transition-shadow"
              onClick={handleWaterClick}
            >
              <div className="flex items-center">
                <Droplets size={32} className="text-white mr-4" />
                <div>
                  <span className="text-white text-xl font-bold">Water</span>
                  <p className="text-white text-sm">Click to add a cup</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  className="bg-white bg-opacity-20 w-8 h-8 rounded-full flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWaterDecrement();
                  }}
                >
                  <Minus size={16} className="text-white" />
                </button>
                <div className="bg-white bg-opacity-30 w-16 h-16 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">{waterCount}</span>
                </div>
                <button 
                  className="bg-white bg-opacity-20 w-8 h-8 rounded-full flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWaterClick();
                  }}
                >
                  <Plus size={16} className="text-white" />
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Leader" 
                    className="w-20 h-20 rounded-full object-cover border-4 border-yellow-400"
                  />
                  <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1">
                    <Crown size={16} className="text-white" />
                  </div>
                </div>
              </div>
              
              <div className="text-center mb-2">
                <h3 className="font-bold">Eiden</h3>
                <p className="text-yellow-500 font-bold text-xl">2430</p>
                <p className="text-gray-400 text-xs">@username</p>
              </div>
              
              <div className="flex justify-between mt-4">
                <div className="text-center">
                  <div className="relative">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                      alt="User" 
                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-400"
                    />
                  </div>
                  <h4 className="font-medium text-sm mt-1">Jackson</h4>
                  <p className="text-blue-400 font-bold">1847</p>
                  <p className="text-gray-400 text-xs">@username</p>
                </div>
                
                <div className="text-center">
                  <div className="relative">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                      alt="User" 
                      className="w-16 h-16 rounded-full object-cover border-2 border-green-400"
                    />
                  </div>
                  <h4 className="font-medium text-sm mt-1">Emma Aria</h4>
                  <p className="text-green-400 font-bold">1674</p>
                  <p className="text-gray-400 text-xs">@username</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Activity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <ActivityCard 
            title="Cycling Hero" 
            icon={<Bike size={24} className="text-white" />}
            current="10 km / week"
            progress={55}
            target="Target: 50km"
            onComplete={updateStreak}
          />
          
          <ActivityCard 
            title="Daily Running" 
            icon={<Running size={24} className="text-white" />}
            current="5 km / week"
            progress={75}
            target="Target: 7km/ week"
            onComplete={updateStreak}
          />
          
          <ActivityCard 
            title="Daily Steps" 
            icon={<Footprints size={24} className="text-white" />}
            current="10000 steps / week"
            progress={95}
            target="Target: 12000/week"
            onComplete={updateStreak}
          />
        </div>
      </div>
    </div>
  );
}

function ActivityCard({ title, icon, current, progress, target, onComplete }: { title: string, icon: React.ReactNode, current: string, progress: number, target: string, onComplete: () => void }) {
  const [currentProgress, setCurrentProgress] = useState(progress);
  
  // Function to increment progress when card is clicked
  const incrementProgress = () => {
    if (currentProgress < 100) {
      const newProgress = Math.min(currentProgress + 5, 100);
      setCurrentProgress(newProgress);
      
      // If activity is completed, update streak
      if (newProgress === 100 && onComplete) {
        onComplete();
      }
    }
  };
  
  return (
    <div 
      className="bg-cyan-50 rounded-3xl p-6 relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={incrementProgress}
    >
      <div className="absolute top-6 left-6 bg-gradient-to-br from-cyan-400 to-cyan-600 w-12 h-12 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      
      <div className="ml-16">
        <h3 className="text-cyan-600 font-bold text-lg">{title}</h3>
        <p className="text-gray-500 text-sm">{current}</p>
      </div>
      
      <div className="mt-8">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Progress</span>
          <span className="text-cyan-600 font-bold">{currentProgress}%</span>
        </div>
        
        <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
          <div 
            className="h-full bg-cyan-500 rounded-full transition-all duration-300" 
            style={{ width: `${currentProgress}%` }}
          ></div>
        </div>
        
        <p className="text-gray-500 text-sm mt-4">{target}</p>
        <p className="text-xs text-cyan-600 mt-2">Click to add progress</p>
      </div>
    </div>
  );
}

export default App;