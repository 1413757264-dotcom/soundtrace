import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const API = 'http://localhost:8000/api/v1'
const TYPE_COLORS = { drum:'#D4D4D0', melody:'#C4C4BE', vocal_chop:'#B8B8B2', bass:'#C8C8C2', fx:'#BCBCB6', texture:'#C0C0BA' }

export default function SongModal({ song, open, onClose }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!song?.id || !open) return
    setLoading(true)
    setData(null)
    fetch(`${API}/search/enrich?song_id=${song.id}`)
      .then(r=>r.json()).then(d=>{ if(d.success) setData(d.data) }).catch(()=>{})
      .finally(()=>setLoading(false))
  }, [song?.id, open])

  if (!song) return null

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 bg-[#0D0D0C]/95 backdrop-blur-xl overflow-y-auto"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div className="min-h-full flex items-start justify-center p-5 pt-16"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.35, ease: [0.16,1,0.3,1] }}
            onClick={e => e.stopPropagation()}>
            <div className="w-full max-w-lg bg-[#181815] border border-[#2A2A26] p-8">
              <button onClick={onClose} className="absolute top-4 right-4 text-[10px] tracking-[4px] font-black text-[#5A5A56] hover:text-[#B8B8B2] transition-colors">关闭</button>

              <p className="text-[10px] tracking-[4px] font-black text-[#5A5A56] mb-1">{song.album||''}</p>
              <div className="w-8 h-px bg-[#5A5A56] my-4" />
              <h2 className="text-[38px] font-black leading-[1.05] tracking-[-1px] text-[#D4D4D0]">{song.title||''}</h2>
              <p className="text-[11px] tracking-[5px] font-black text-[#5A5A56] mt-2">KANYE WEST</p>

              <div className="flex gap-8 mt-6">
                <div><span className="text-2xl font-black text-[#D4D4D0]">{song.year||'-'}</span><span className="text-[8px] tracking-[2px] font-bold text-[#5A5A56] ml-1">年份</span></div>
                <div><span className="text-2xl font-black text-[#D4D4D0]">{song.bpm||'-'}</span><span className="text-[8px] tracking-[2px] font-bold text-[#5A5A56] ml-1">BPM</span></div>
                <div><span className="text-2xl font-black text-[#D4D4D0]">{song.key||'-'}</span><span className="text-[8px] tracking-[2px] font-bold text-[#5A5A56] ml-1">调式</span></div>
                <div><span className="text-2xl font-black text-[#D4D4D0]">{(data?.samples||[]).length}</span><span className="text-[8px] tracking-[2px] font-bold text-[#5A5A56] ml-1">采样</span></div>
              </div>

              {loading && <p className="text-[#5A5A56] text-xs text-center py-12">加载中...</p>}

              {data && (
                <>
                  {data.theme && (
                    <div className="mt-8">
                      <p className="text-[10px] tracking-[4px] font-black text-[#B8B8B2] mb-2">创作主题</p>
                      <p className="text-sm text-[#8A8A84] leading-relaxed">{data.theme}</p>
                    </div>
                  )}
                  {data.context && (
                    <div className="mt-6">
                      <p className="text-[10px] tracking-[4px] font-black text-[#B8B8B2] mb-2">采样故事</p>
                      <p className="text-sm text-[#8A8A84] leading-relaxed">{data.context}</p>
                    </div>
                  )}
                  {(data.credits||[]).length > 0 && (
                    <div className="mt-6">
                      <p className="text-[10px] tracking-[4px] font-black text-[#B8B8B2] mb-2">制作团队</p>
                      <p className="text-sm text-[#8A8A84]">{(data.credits||[]).map(c=>`${c.artist_name} (${c.role})`).join(' · ')}</p>
                    </div>
                  )}
                  <div className="mt-8">
                    <p className="text-base font-black tracking-[2px] text-[#D4D4D0]">采样 DNA</p>
                    <p className="text-[9px] tracking-[2px] font-bold text-[#5A5A56] mt-1 mb-6">{(data.samples||[]).length} 已确认采样源</p>
                    {(data.samples||[]).length === 0 ? (
                      <p className="text-sm text-[#5A5A56]">无已知采样源。原创作品。</p>
                    ) : (data.samples||[]).map((sp,i) => {
                      const tc = TYPE_COLORS[sp.type] || '#C4C4BE'
                      return (
                        <div key={i} className="border-l-[3px] bg-white/[0.01] p-4 mb-px" style={{borderLeftColor: tc}}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[9px] font-black tracking-[1px] px-2 py-1 bg-white/[0.04]" style={{color: tc}}>{(sp.type||'melody').toUpperCase()}</span>
                            <span className="text-[9px] font-black tracking-[1px]" style={{color: tc}}>{Math.round((sp.confidence||0)*100)}%</span>
                          </div>
                          <p className="text-base font-bold text-[#D4D4D0]">{sp.source_title}</p>
                          <p className="text-[13px] text-[#8A8A84] mt-1">{sp.source_artist}{sp.source_year ? ' · '+sp.source_year : ''}</p>
                          {sp.description && <p className="text-[11px] italic text-[#5A5A56] mt-2">{sp.description}</p>}
                        </div>
                      )
                    })}
                  </div>
                  {data.album_intro?.bio && (
                    <div className="mt-12 border-t border-[#2A2A26] pt-8">
                      <p className="text-[10px] tracking-[4px] font-black text-[#5A5A56] mb-2">专辑背景</p>
                      <p className="text-lg font-black text-[#B8B8B2]">{song.album}</p>
                      <p className="text-[10px] tracking-[3px] font-bold text-[#8A8A84] mt-1">{data.album_intro.era}</p>
                      <p className="text-sm text-[#8A8A84] leading-relaxed mt-3">{data.album_intro.bio}</p>
                      <div className="grid grid-cols-3 gap-3 mt-5">
                        <div><span className="text-[8px] tracking-[2px] font-bold text-[#5A5A56]">声音</span><p className="text-xs text-[#8A8A84] mt-1">{data.album_intro.sound}</p></div>
                        <div><span className="text-[8px] tracking-[2px] font-bold text-[#5A5A56]">主题</span><p className="text-xs text-[#8A8A84] mt-1">{data.album_intro.theme}</p></div>
                        <div><span className="text-[8px] tracking-[2px] font-bold text-[#5A5A56]">遗产</span><p className="text-xs text-[#8A8A84] mt-1">{data.album_intro.legacy}</p></div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
