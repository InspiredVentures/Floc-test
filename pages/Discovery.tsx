
import React, { useState } from 'react';
import { MOCK_TRIPS } from '../constants';
import { Trip } from '../types';

interface Props {
  onSelectTrip: (trip: Trip) => void;
  onOpenNotifications: () => void;
}

const Discovery: React.FC<Props> = ({ onSelectTrip, onOpenNotifications }) => {
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>([]);

  const toggleJoin = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    if (joinedCommunities.includes(title)) {
      setJoinedCommunities(prev => prev.filter(t => t !== title));
    } else {
      setJoinedCommunities(prev => [...prev, title]);
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <header className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 pt-6 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <span className="material-symbols-outlined text-primary">explore</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white">Floc</h1>
          <button 
            onClick={onOpenNotifications}
            className="flex size-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 relative"
          >
            <span className="material-symbols-outlined text-white">notifications</span>
            <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-slate-800"></span>
          </button>
        </div>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
          <input className="w-full h-12 pl-11 pr-4 rounded-full bg-white dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary text-sm font-medium text-white placeholder:text-slate-400" placeholder="Search groups, destinations..." type="text"/>
        </div>
      </header>

      <section className="mt-6">
        <div className="flex items-center justify-between px-6 mb-4">
          <h2 className="text-xl font-bold text-white">Featured Groups</h2>
          <button className="text-primary text-sm font-semibold">See All</button>
        </div>
        <div className="flex overflow-x-auto no-scrollbar gap-4 px-6 pb-2">
          {MOCK_TRIPS.map(trip => (
            <div 
              key={trip.id}
              onClick={() => onSelectTrip(trip)}
              className="flex-none w-72 cursor-pointer transition-transform active:scale-95"
            >
              <div className="relative h-48 w-full rounded-xl overflow-hidden shadow-lg group">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${trip.image}")` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="px-2 py-1 bg-primary text-[10px] font-bold uppercase rounded-full text-background-dark mb-2 inline-block">Trending</span>
                  <h3 className="text-white font-bold text-lg leading-tight">{trip.title}</h3>
                  <p className="text-white/80 text-xs mt-1">{trip.membersCount} Tribe Members</p>
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex-none w-72">
            <div className="relative h-48 w-full rounded-xl overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuA__vLSoUMpZGHikmDzrJKni1cxFf3y9GIhi4e8hUrBbF8yvQXr6FZHUiDFLCWUooy69cEnzyF4p5cPQZM8Zo9D2BhAwVLwGf8mykEwcPOdi849Y2wCMKbwylbuSUMTGD2GzW91Zd-xH-IjmM5SWzm4SutIEsBxM9zxFfrwUUzBmeh1oyH3oG-mqe30TfkkbvNnwNtbqKBew7tKBQQYy5Oy5B-vaXGRhFjVCrfNl1Z4Sf5i8UOOSgbB7g7MspJFB3QHPUVYk7Tts5TF")` }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="px-2 py-1 bg-orange-500 text-[10px] font-bold uppercase rounded-full text-white mb-2 inline-block">Culinary</span>
                <h3 className="text-white font-bold text-lg leading-tight">Tuscany Wine Lovers</h3>
                <p className="text-white/80 text-xs mt-1">3.2k members</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 px-6 pb-12">
        <h2 className="text-xl font-bold mb-4 text-white">Trending Communities</h2>
        <div className="space-y-4">
          <CommunityCard 
            title="Parisian Flâneurs" 
            meta="Photography • 1.2k members" 
            img="https://lh3.googleusercontent.com/aida-public/AB6AXuCiCaN94O0-or37pnZeXZyrJnO2JtuYCDrJ1WQO_QY25f2qQPkgM7yxWbIv3ClDSNmRafoiOf2z_THsdgMPVt1TXN-vNwfk97vwThchPt4PkUnqMOHeE3QISwsyBEplhdMK6DBa2O14FC9Ov2ZsQf5055CioP1pxrI8taXGvQalIVPsaZ-LAhZh5_xAmKkJHydfuK5nngjBes5Q841NHcVpefdpgtB1R3gzAQpMLDcgS68Wwu7KrmxaqMlVDXmZaa_BhDJjIN5SMxsC" 
            isJoined={joinedCommunities.includes("Parisian Flâneurs")}
            onJoin={(e) => toggleJoin(e, "Parisian Flâneurs")}
          />
          <CommunityCard 
            title="Aurora Chasers" 
            meta="Expedition • 8.9k members" 
            img="https://lh3.googleusercontent.com/aida-public/AB6AXuBAgp6lBngLNQ8mx0Rn9Jx_zuqzXkbeAExgsIcjQAs7Ed29RS7h4I6lwWs1JZKFEVXJGChKeCGZpUAA5gybc5B9ebKhy_T8wmT-QdfaLwv3wGCSbniwug1s0YdHnEQe41ZqeXc6d9nuaNRuHpYhgvqjAkAsAzs9t95YiB2Xmdn8BgFShPuOrnRMHHyfUQDN1osFWmMPP60zXwq7i397FXy1hS4hhQw7wtwJJBESiu9zKAf1YTiE_4BB8jD9m7oviyqxKP40ZT7HADTE" 
            isJoined={joinedCommunities.includes("Aurora Chasers")}
            onJoin={(e) => toggleJoin(e, "Aurora Chasers")}
          />
          <CommunityCard 
            title="Rocky Mountain Nomads" 
            meta="Van Life • 2.4k members" 
            img="https://lh3.googleusercontent.com/aida-public/AB6AXuDZbZJ7SOKxgsPGg0wVrxMjby7YuE1Ca50mg-mpt9EAhDXnsFyLOAMjTjkAIDQqmg25dQeUke4wT6w0hD1RPh7NibR47ZYGjYReAJiL83CHRDNdTBqSGamPa95hOqYq0M4l-ZzJZytfMG2jFh20Vk0iYGtwekpa2LopfSIv_geQ6Pm-jgHSe7gqjqwSeWZFjyKHoV10HJ_Rw2-uvZ4ddk104KxHu9EPxyjoPGHTCLMbWjrQ-q_hZ3N50ws2GpkIJ2ZQR6O04YT2O-0r" 
            isJoined={joinedCommunities.includes("Rocky Mountain Nomads")}
            onJoin={(e) => toggleJoin(e, "Rocky Mountain Nomads")}
          />
        </div>
      </section>
    </div>
  );
};

const CommunityCard = ({ title, meta, img, isJoined, onJoin }: { title: string, meta: string, img: string, isJoined: boolean, onJoin: (e: any) => void }) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 shadow-sm transition-transform active:scale-95">
    <div className="size-16 rounded-xl bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${img})` }}></div>
    <div className="flex-1 min-w-0">
      <h4 className="font-bold text-base truncate text-white">{title}</h4>
      <p className="text-slate-500 dark:text-slate-400 text-xs">{meta}</p>
    </div>
    <button 
      onClick={onJoin}
      className={`text-xs font-bold px-4 py-2 rounded-full transition-all ${
        isJoined ? 'bg-white/10 text-slate-400 border border-white/5' : 'bg-primary text-background-dark hover:bg-primary/90'
      }`}
    >
      {isJoined ? 'Joined' : 'Join'}
    </button>
  </div>
);

export default Discovery;
