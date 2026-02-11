import React, { useState } from 'react'

const languages = [
  { id:1, name:'Hindi', script:'देवनागरी', speakers:'345M' },
  { id:2, name:'Tamil', script:'தமிழ்', speakers:'75M' },
  { id:3, name:'Sanskrit', script:'संस्कृत', speakers:'25k' }
  
]

export default function Languages(){
  const [selected, setSelected] = useState(null)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-blue">Languages & Literature</h1>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {languages.map(l=> (
          <div key={l.id} className="bg-gray-800 rounded shadow p-4 cursor-pointer hover:shadow-lg transition text-white border border-gold/30" onClick={()=>setSelected(l)}>
            <h3 className="font-bold text-lg text-gold">{l.name}</h3>
            <p className="font-noto text-2xl mt-2 text-white">{l.script}</p>
            <p className="text-sm text-gray-300 mt-2">{l.speakers} speakers</p>
          </div>
        ))}
      </div>
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={()=>setSelected(null)}>
          <div className="bg-gray-800 rounded shadow p-8 max-w-sm text-white border border-gold/30" onClick={e=>e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-gold">{selected.name}</h2>
            <p className="font-noto text-4xl mt-4 text-white">{selected.script}</p>
            <p className="mt-4 text-gray-300">{selected.speakers} speakers worldwide</p>
          </div>
        </div>
      )}
    </div>
  )
}
