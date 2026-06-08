export default function Settings() {
  return (
    <div className="flex flex-col h-full px-5 pt-16 pb-24">
      <p className="text-[10px] tracking-[5px] font-black text-[#5A5A56] mb-2">设置</p>
      <h2 className="text-5xl font-black tracking-[-2px] text-[#D4D4D0] leading-none mb-8">设置</h2>
      {[
        ['关于', 'Kanye West 采样档案 v1.0'],
        ['数据来源', '本地数据库 · 221首歌 · 14张专辑'],
        ['技术', 'React · Three.js · Framer Motion'],
        ['设计', 'Brutalist · Yeezy 秀场风格'],
      ].map(([l,v]) => (
        <div key={l} className="flex justify-between items-center py-4 border-b border-[#2A2A26]">
          <span className="text-sm font-semibold text-[#8A8A84]">{l}</span>
          <span className="text-xs text-[#5A5A56]">{v}</span>
        </div>
      ))}
      <p className="text-[10px] text-[#5A5A56] mt-auto text-center pt-10">"我将成为史上最伟大的艺术家"<br/>KANYE WEST</p>
    </div>
  )
}
