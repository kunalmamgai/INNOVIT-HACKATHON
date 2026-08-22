import React, { useState } from 'react'

const items = [    { id:1, title: 'Taj Mahal', img:'https://static.wixstatic.com/media/055605_65e20a7fcbc54e2e8720adfc2544c35e~mv2.jpg/v1/fill/w_600,h_400,al_c,q_80/taj_new_contant_edited.jpg', desc:'The Taj Mahal, a white marble mausoleum in Agra, India, was commissioned in 1632 by Mughal Emperor Shah Jahan to honor his beloved wife Mumtaz Mahal, who died during childbirth. Construction took about 22 years, blending Persian, Islamic, and Indian architecture' },    { id:2, title: 'Qutub Minar', img:'https://plus.unsplash.com/premium_photo-1697730320983-f99aab252a44?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cXV0dWIlMjBtaW5hcnxlbnwwfHwwfHx8MA%3D%3D', desc:'Qutub Minar is a towering 72.5-meter minaret in Delhi, India, built starting in 1199 by Qutb-ud-din Aibak as a victory tower and mosque call minaret. Completed by Iltutmish, it features five fluted storeys of red sandstone and marble with intricate Quranic carvings and balconies.' },    { id:3, title: 'Hampi', img:'https://images.unsplash.com/photo-1667115788169-b4549d3d5b4d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGFtcGklMjB0ZW1wbGV8ZW58MHx8MHx8fDA%3D', desc:'Hampi is a UNESCO World Heritage Site in Karnataka, India, featuring ruins of the Vijayanagara Empires capital from the 14th-16th centuries. This vast complex of Dravidian temples, palaces, and monuments amid boulder-strewn landscapes showcases intricate carvings at sites like Virupaksha and Vitthala temples. Sacked in 1565, it evokes the empires lost grandeur. ' }
]

export default function Carousel(){
  const [expandedCardId, setExpandedCardId] = useState(null)

  const previewLength = 180

  function getPreviewText(text) {
    if (text.length <= previewLength) return text
    return `${text.slice(0, previewLength)}...`
  }

  return (
    <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border-2 border-earth/60 bg-sand p-3 sm:p-4 md:p-6 shadow-2xl">
      <img
        src="/assets/hero-placeholder.svg"
        alt="Heritage motif background"
        width="1200"
        height="400"
        className="absolute inset-0 w-full h-full object-cover blur-sm scale-105"
      />
      <div className="absolute inset-0 bg-sand/85" />

      <div className="relative mobile-side-scroll no-scrollbar flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto pb-2">
        {items.map((item) => {
          const isExpanded = expandedCardId === item.id
          const isLongDescription = item.desc.length > previewLength

          return (
          <div key={item.id} className="min-w-[85%] sm:min-w-[320px] md:min-w-[340px] bg-white/80 border border-earth/30 rounded-2xl shadow-md overflow-hidden backdrop-blur-sm flex flex-col">
            <img src={item.img} alt={item.title} loading="lazy" width="400" height="192" className="h-44 sm:h-48 w-full object-cover" />
            <div className="p-3 sm:p-4 flex flex-col flex-1">
              <h4 className="font-bold text-earth text-base sm:text-lg">{item.title}</h4>
              <p className="text-gray-700 text-xs sm:text-sm mt-2 leading-relaxed flex-1">
                {isExpanded ? item.desc : getPreviewText(item.desc)}
              </p>
              {isLongDescription && (
                <button
                  type="button"
                  className="mt-3 pt-1 text-sm font-semibold !text-black hover:underline self-start"
                  onClick={() => setExpandedCardId(isExpanded ? null : item.id)}
                >
                  {isExpanded ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>
          </div>
        )})}
      </div>
    </div>
  )
}
