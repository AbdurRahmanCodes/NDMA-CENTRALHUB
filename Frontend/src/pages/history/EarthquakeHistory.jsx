import React from 'react';
import { Activity, Map, Shield, AlertTriangle } from 'lucide-react';

const EarthquakeHistory = () => {
  // Static data for earthquakes since we don't have a specific JSON for it
  const earthquakes = [
    {
      year: 2005,
      location: 'Kashmir & NWFP',
      magnitude: 7.6,
      deaths: '87,350+',
      description: 'The deadliest earthquake in Pakistan\'s history. Muzaffarabad was the epicenter. Millions were left homeless.'
    },
    {
      year: 2013,
      location: 'Balochistan (Awaran)',
      magnitude: 7.7,
      deaths: '825+',
      description: 'A powerful quake that created a new island (Zalzala Koh) off the coast of Gwadar.'
    },
    {
      year: 2015,
      location: 'Hindu Kush Region',
      magnitude: 7.5,
      deaths: '280+',
      description: 'Centered in Afghanistan but caused significant damage in KP and Gilgit-Baltistan.'
    },
    {
      year: 2019,
      location: 'Mirpur, AJK',
      magnitude: 5.6,
      deaths: '40+',
      description: 'Shallow earthquake causing severe infrastructure damage in Mirpur city and Jatlan.'
    }
  ];

  const guidelines = [
    {
      title: 'Drop, Cover, and Hold On',
      desc: 'If indoors, drop to the ground, take cover under a sturdy table, and hold on until shaking stops.',
      icon: <Activity className="text-orange-500" />
    },
    {
      title: 'Stay Away from Glass',
      desc: 'Move away from windows, mirrors, and anything that could shatter or fall on you.',
      icon: <AlertTriangle className="text-red-500" />
    },
    {
      title: 'Prepare an Emergency Kit',
      desc: 'Keep water, non-perishable food, flashlight, and first aid kit ready at all times.',
      icon: <Shield className="text-green-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Earthquake History</h1>
          <p className="text-gray-400">Seismic activity records and safety guidelines</p>
        </div>

        {/* 2005 Kashmir Earthquake Highlight */}
        <div className="bg-gradient-to-r from-red-900/40 to-background-light rounded-lg p-8 border border-red-900/50 mb-12 relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full mb-4">
              MOST DEVASTATING
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">2005 Kashmir Earthquake</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
              <div>
                <div className="text-gray-400 text-sm">Magnitude</div>
                <div className="text-4xl font-bold text-white">7.6</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Total Deaths</div>
                <div className="text-4xl font-bold text-white">87,350</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Homeless</div>
                <div className="text-4xl font-bold text-white">3.5M+</div>
              </div>
            </div>
            <p className="text-gray-300 max-w-3xl">
              On October 8, 2005, a massive earthquake struck the Kashmir region and North-West Frontier Province (now KP). 
              It remains the deadliest earthquake in the history of the South Asian subcontinent.
            </p>
          </div>
          <Activity className="absolute right-0 bottom-0 w-64 h-64 text-red-900/20 -mr-16 -mb-16" />
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Major Seismic Events</h2>
            <div className="space-y-4">
              {earthquakes.map((quake) => (
                <div key={quake.year} className="bg-background-light p-6 rounded-lg border border-background-lighter hover:border-primary transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white">{quake.location}</h3>
                    <span className="bg-background px-3 py-1 rounded text-primary font-bold">{quake.year}</span>
                  </div>
                  <div className="flex gap-4 text-sm mb-3">
                    <span className="text-orange-400 font-semibold">Mag: {quake.magnitude}</span>
                    <span className="text-red-400 font-semibold">Deaths: {quake.deaths}</span>
                  </div>
                  <p className="text-gray-400 text-sm">{quake.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Seismic Zones Map Placeholder */}
          <div className="bg-background-light rounded-lg p-6 border border-background-lighter flex flex-col">
            <h2 className="text-2xl font-bold text-white mb-6">Seismic Zones of Pakistan</h2>
            <div className="flex-1 bg-background rounded-lg flex items-center justify-center border border-dashed border-gray-700 min-h-[300px]">
              <div className="text-center p-6">
                <Map className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-400">Seismic Zone Map Visualization</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Pakistan lies on the boundary of the Indian and Eurasian tectonic plates, 
                  making it highly prone to seismic activity.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Preparedness Guidelines */}
        <div className="bg-background-light rounded-lg p-8 border border-background-lighter">
          <h2 className="text-2xl font-bold text-white mb-6">Earthquake Preparedness</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guidelines.map((guide, index) => (
              <div key={index} className="bg-background p-6 rounded-lg text-center hover:bg-background-lighter transition-colors">
                <div className="w-12 h-12 mx-auto bg-background-light rounded-full flex items-center justify-center mb-4">
                  {guide.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{guide.title}</h3>
                <p className="text-gray-400 text-sm">{guide.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarthquakeHistory;
