import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Scene3D from './components/Scene3D'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import SongModal from './components/SongModal'

const API = 'http://localhost:8000/api/v1'
const TABS = ['作品', '搜索', '数据', '设置']
const ICONS = [
  <svg key="0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="0.5"/><rect x="14" y="3" width="7" height="7" rx="0.5"/><rect x="3" y="14" width="7" height="7" rx="0.5"/><rect x="14" y="14" width="7" height="7" rx="0.5"/></svg>,
  <svg key="1" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  <svg key="2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="7" y1="20" x2="7" y2="12"/><line x1="12" y1="20" x2="12" y2="5"/><line x1="17" y1="20" x2="17" y2="8"/></svg>,
  <svg key="3" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
]

export default function App() {
  const [tab, setTab] = useState(0)
  const [songs, setSongs] = useState([])
  const [albums, setAlbums] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedSong, setSelectedSong] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetch(`${API}/samples/artist-songs?artist_id=a01`)
      .then(r => r.json()).then(d => {
        if (!d.success) return
        setSongs(d.data)
        const g = {}
        d.data.forEach(s => { const a = s.album||'Unknown'; if(!g[a])g[a]=[]; g[a].push(s) })
        setAlbums(Object.entries(g).map(([n,s]) => ({ name:n, songs:s, year:s[0]?.release_year||0 })).sort((a,b)=>a.year-b.year))
      }).catch(()=>{})
  }, [])

  useEffect(() => {
    if (searchQuery.length < 1) { setSearchResults([]); return }
    const t = setTimeout(() => {
      fetch(`${API}/search?q=${encodeURIComponent(searchQuery)}&limit=50`)
        .then(r => r.json()).then(d => { if(d.success) setSearchResults(d.data) }).catch(()=>{})
    }, 200)
    return () => clearTimeout(t)
  }, [searchQuery])

  const openSong = useCallback((s) => { setSelectedSong(s); setModalOpen(true) }, [])

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0D0D0C]">
      <Scene3D />

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col h-full">
        <AnimatePresence mode="wait">
          <motion.div key={tab} className="flex-1 overflow-hidden"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16,1,0.3,1] }}>
            {tab === 0 && <Home albums={albums} onOpenSong={openSong} />}
            {tab === 1 && (
              <div className="flex flex-col h-full px-5 pt-16 pb-4">
                <p className="text-[10px] tracking-[4px] font-bold text-[#5A5A56] mb-2">搜索</p>
                <input className="w-full bg-transparent border-b border-[#2A2A26] text-[#D4D4D0] text-2xl font-black py-3 outline-none placeholder-[#5A5A56]"
                  placeholder="搜索 Kanye 作品集" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} />
                <div className="flex-1 overflow-y-auto mt-4">
                  {searchResults.map(s=>(
                    <div key={s.id} className="flex items-center justify-between py-3 border-b border-[#1A1A18] cursor-pointer hover:pl-2 transition-all"
                      onClick={() => openSong({id:s.id,title:s.title,album:s.album_title,year:s.release_year,bpm:s.bpm,key:s.key_signature,genre:s.sub_genre})}>
                      <span className="text-sm font-semibold text-[#8A8A84]">{s.title}</span>
                      <span className="text-[10px] text-[#5A5A56]">{s.release_year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tab === 2 && <Profile songs={songs} albums={albums} onOpenSong={openSong} />}
            {tab === 3 && <Settings />}
          </motion.div>
        </AnimatePresence>

        {/* Tab Bar */}
        <nav className="relative z-20 flex items-center justify-center bg-[#0D0D0C]/95 backdrop-blur-xl border-t border-[#2A2A26] pb-[env(safe-area-inset-bottom,8px)]">
          {TABS.map((label, i) => (
            <button key={label} onClick={() => setTab(i)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${i === tab ? 'text-[#B8B8B2]' : 'text-[#5A5A56]'}`}>
              {ICONS[i]}
              <span className="text-[9px] font-bold tracking-[2px]">{label}</span>
              {i === tab && <motion.div layoutId="tab" className="w-5 h-[2px] bg-[#B8B8B2] mt-0.5" />}
            </button>
          ))}
        </nav>
      </div>

      <SongModal song={selectedSong} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
