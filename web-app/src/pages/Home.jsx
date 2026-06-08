import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ERA_COLORS = {
  'The College Dropout':'#B8B8B2','Late Registration':'#A0A09A',
  'Graduation':'#C8C8C2','808s and Heartbreak':'#90908A',
  'My Beautiful Dark Twisted Fantasy':'#D0D0CA','Yeezus':'#B0B0AA',
  'The Life of Pablo':'#C0C0BA','Ye':'#A8A8A2',
  'Jesus Is King':'#989892','Donda':'#888882',
  'Donda 2':'#B8B8B2','Vultures 1':'#A0A09A',
  'Vultures 2':'#C0C0BA','Bully':'#A8A8A2'
}

export default function Home({ albums, onOpenSong }) {
  const [open, setOpen] = useState(null)

  if (!albums.length) return null

  const totalSongs = albums.reduce((t,a) => t + a.songs.length, 0)
  const totalSamples = albums.reduce((t,a) => t + a.songs.reduce((s,x) => s + (x.sample_count||0), 0), 0)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero */}
      <div className="px-5 pt-16 pb-6 shrink-0">
        <p className="text-[10px] tracking-[5px] font-black text-[#5A5A56] mb-3">KANYE WEST · 完整档案</p>
        <h1 className="text-[56px] leading-[0.88] font-black tracking-[-2px] text-[#D4D4D0]"
          style={{ WebkitTextStroke: '1px #D4D4D0', color: 'transparent' }}>YE</h1>
        <div className="w-12 h-px bg-[#5A5A56] my-5" />
        <div className="flex gap-10">
          <div><span className="text-3xl font-black text-[#D4D4D0]">{albums.length}</span><span className="text-[9px] tracking-[3px] font-bold text-[#5A5A56] ml-1">专辑</span></div>
          <div><span className="text-3xl font-black text-[#D4D4D0]">{totalSongs}</span><span className="text-[9px] tracking-[3px] font-bold text-[#5A5A56] ml-1">曲目</span></div>
          <div><span className="text-3xl font-black text-[#D4D4D0]">{totalSamples}</span><span className="text-[9px] tracking-[3px] font-bold text-[#5A5A56] ml-1">采样</span></div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto pl-8 pr-5 pb-24 relative">
        <div className="absolute left-[23px] top-0 bottom-0 w-px bg-[#2A2A26]" />
        {albums.map((a, i) => {
          const c = ERA_COLORS[a.name] || '#555'
          const isOpen = open === i
          return (
            <div key={a.name} className="relative mb-10">
              <button onClick={() => setOpen(isOpen ? null : i)}
                className="absolute -left-[29px] top-1.5 w-[13px] h-[13px] border border-[#5A5A56] bg-[#0D0D0C] z-10 transition-all hover:scale-125"
                style={isOpen ? { background: c, borderColor: c } : {}} />
              <button onClick={() => setOpen(isOpen ? null : i)} className="block text-left pl-6 w-full">
                <span className="text-[10px] tracking-[3px] font-bold text-[#5A5A56]">{a.year}</span>
                <h3 className="text-xl font-black tracking-[-0.5px] text-[#D4D4D0] mt-0.5"
                  style={isOpen ? { color: c } : {}}>{a.name}</h3>
                <span className="text-[9px] tracking-[2px] font-bold text-[#5A5A56]">{a.songs.length} 首</span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.16,1,0.3,1] }}
                    className="overflow-hidden pl-10 mt-1">
                    {a.songs.map(s => (
                      <button key={s.id} onClick={() => onOpenSong({id:s.id,title:s.title,album:s.album,year:s.release_year,bpm:s.bpm,key:s.key,genre:s.sub_genre})}
                        className="flex items-center justify-between w-full py-2.5 border-l-2 border-[#2A2A26] pl-3 mb-px hover:border-[#B8B8B2] transition-colors text-left">
                        <span className="text-[13px] font-semibold text-[#8A8A84] truncate flex-1">{s.title}</span>
                        <span className="text-[10px] text-[#5A5A56] mr-2">{s.bpm||''}BPM</span>
                        {s.sample_count > 0 && <span className="text-[9px] font-black text-[#B8B8B2] bg-white/5 px-1.5">{s.sample_count}</span>}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
