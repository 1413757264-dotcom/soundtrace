export default function Profile({ songs, albums, onOpenSong }) {
  if (!songs.length) return null
  const ts = songs.reduce((t,s)=>t+(s.sample_count||0),0)
  const tc = songs.reduce((t,s)=>t+(s.credit_count||0),0)
  const st = songs.filter(s=>(s.sample_count||0)>0).length
  const tm = Math.floor(songs.reduce((t,s)=>t+(s.duration_ms||0),0)/60000)
  const ab = Math.round(songs.reduce((t,s)=>t+(s.bpm||0),0)/songs.length)
  const maxS = Math.max(...albums.map(a=>a.songs.reduce((t,s)=>t+(s.sample_count||0),0)),1)
  const top = songs.filter(s=>(s.sample_count||0)>0).sort((a,b)=>(b.sample_count||0)-(a.sample_count||0)).slice(0,10)

  return (
    <div className="flex flex-col h-full overflow-y-auto px-5 pt-16 pb-24">
      <p className="text-[10px] tracking-[5px] font-black text-[#5A5A56] mb-2">数据</p>
      <h2 className="text-5xl font-black tracking-[-2px] text-[#D4D4D0] leading-none">数据<br/>总览</h2>

      <div className="grid grid-cols-3 gap-px bg-[#2A2A26] mt-8">
        {[[songs.length,'曲目'],[ts,'采样'],[tc,'制作']].map(([v,l])=>(
          <div key={l} className="bg-[#181815] py-6 text-center"><span className="text-4xl font-black text-[#D4D4D0]">{v}</span><span className="block text-[8px] tracking-[3px] font-bold text-[#5A5A56] mt-2">{l}</span></div>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-1 mt-1">
        {[[albums.length,'专辑'],[st,'含采样'],[tm,'分钟'],[ab,'平均BPM']].map(([v,l])=>(
          <div key={l} className="bg-[#181815] py-3 text-center"><span className="text-lg font-black text-[#8A8A84]">{v}</span><span className="block text-[7px] tracking-[2px] font-bold text-[#5A5A56] mt-1">{l}</span></div>
        ))}
      </div>

      <p className="text-[10px] tracking-[4px] font-black text-[#B8B8B2] mt-10 mb-4">专辑采样分布</p>
      {albums.map(a => {
        const as = a.songs.reduce((t,s)=>t+(s.sample_count||0),0)
        return (
          <div key={a.name} className="flex items-center gap-4 py-2">
            <div className="h-0.5 bg-[#B8B8B2]" style={{width: Math.max((as/maxS)*100, 2)}} />
            <span className="text-xs font-semibold text-[#8A8A84] flex-1 truncate">{a.name}</span>
            <span className="text-[10px] font-bold text-[#5A5A56]">{a.songs.length}首·{as}采样</span>
          </div>
        )
      })}

      <p className="text-[10px] tracking-[4px] font-black text-[#B8B8B2] mt-10 mb-4">采样最多</p>
      {top.map((s,i) => (
        <button key={s.id} onClick={() => onOpenSong({id:s.id,title:s.title,album:s.album,year:s.release_year,bpm:s.bpm,key:s.key,genre:s.sub_genre})}
          className="flex items-center w-full py-3 border-b border-[#2A2A26] hover:pl-2 transition-all text-left">
          <span className="text-sm font-black text-[#B8B8B2] w-7">{String(i+1).padStart(2,'0')}</span>
          <span className="text-sm font-semibold text-[#8A8A84] flex-1">{s.title}</span>
          <span className="text-[10px] font-black text-[#B8B8B2]">{s.sample_count||0} 采样</span>
        </button>
      ))}
    </div>
  )
}
