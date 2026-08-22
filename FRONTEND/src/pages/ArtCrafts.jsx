import React, { useMemo, useState } from 'react'
import Modal from '../shared/Modal'

const crafts = [
  {
    id: 1,
    name: 'Madhubani Painting',
    img: 'https://thumbs.dreamstime.com/b/madhubani-painting-8294267.jpg',
    artisan: 'Radha Devi',
    region: 'Bihar',
    category: 'Paintings',
    description: 'Intricate linework and vibrant natural pigments on handmade paper, capturing mythological scenes from Mithila.',
  },
  {
    id: 2,
    name: 'Warli Art',
    img: 'https://i.ytimg.com/vi/UJtefdDzgpY/maxresdefault.jpg',
    artisan: 'Savitribai Wagh',
    region: 'Maharashtra',
    category: 'Paintings',
    description: 'Tribal storytelling in white rice paste on red ochre backgrounds, showing village life, harvest, and nature worship.',
  },
  {
    id: 3,
    name: 'Patachitra',
    img: 'https://www.indicinspirations.com/cdn/shop/products/mahakali-bengal-patachitra-painting-a5-frame-paintings-346595.jpg?v=1665660009&width=899',
    artisan: 'Jagannath Mahanta',
    region: 'Odisha',
    category: 'Paintings',
    description: 'Scroll painting tradition with bold outlines and mineral pigments, often narrating Jagannath and Ramayana stories.',
  },
  {
    id: 4,
    name: 'Channapatna Toys',
    img: 'https://storeassets.im-cdn.com/media-manager/channapatnatoysin/280eU8ASIK3BTw3yHkER_channapatna%20toys%20banner%2015_621x375_webp.jpg',
    artisan: 'Lakshmi R',
    region: 'Karnataka',
    category: 'Woodcraft',
    description: 'Eco-friendly wooden toys turned on lathes and finished with safe lacquer, known for smooth shapes and bright hues.',
  },
  {
    id: 5,
    name: 'Banarasi Brocade',
    img: 'https://i3.wp.com/www.thetalentedindian.com/wp-content/uploads/2026/02/TTI-Website-Images-5.jpeg',
    artisan: 'Iqbal Ansari',
    region: 'Uttar Pradesh',
    category: 'Textiles',
    description: 'Handloom silk with zari motifs inspired by Mughal florals and Persian vines, prized for weddings and heirlooms.',
  },
  {
    id: 6,
    name: 'Kullu Shawl Weaving',
    img: 'https://img-cdn.thepublive.com/filters:format(webp)/local-samosal/media/media_files/2025/03/11/2X9mf4ZwgdMxjOzsUZ10.jpg',
    artisan: 'Meena Thakur',
    region: 'Himachal Pradesh',
    category: 'Textiles',
    description: 'Handwoven wool shawls with geometric borders and natural dyes, crafted for warmth in the Himalayan climate.',
  },
  {
    id: 7,
    name: 'Blue Pottery',
    img: 'https://5.imimg.com/data5/ANDROID/Default/2022/6/IJ/JS/JL/97527935/product-jpeg.jpg',
    artisan: 'Shabnam Khan',
    region: 'Rajasthan',
    category: 'Ceramics',
    description: 'Quartz-based pottery glazed in cobalt blue with Persian-inspired motifs; low-fired, lead-free decorative ware.',
  },
  {
    id: 8,
    name: 'Dokra Metal Casting',
    img: 'https://housenama.com/cdn/shop/articles/the-art-of-dhokra-handmadeinindia-housenama.jpg?v=1720862777',
    artisan: 'Ramesh Murmu',
    region: 'Chhattisgarh',
    category: 'Metalwork',
    description: 'Lost-wax brass casting with textured surfaces and tribal figures, an unbroken 4000-year-old metallurgical craft.',
  },
  {
    id: 9,
    name: 'Bidriware Inlay',
    img: 'https://d35l77wxi0xou3.cloudfront.net/collab/craft1582795978Bidri-Banner.jpg',
    artisan: 'Parveen Quadri',
    region: 'Karnataka',
    category: 'Inlay',
    description: 'Blackened zinc alloy inlaid with fine silver wire motifs, polished to a mirror sheen for striking contrast.',
  },
  {
    id: 10,
    name: 'Meenakari Jewelry',
    img: 'https://veroniqtrends.com/wp-content/uploads/2020/02/VQ-1-18.jpeg',
    artisan: 'Anita Sharma',
    region: 'Rajasthan',
    category: 'Jewelry',
    description: 'Fire-glass enamel on gold-toned metal with floral filigree, creating vibrant reversible pendants and bangles.',
  },
  {
    id: 11,
    name: 'Kashmiri Papier-mâché',
    img: 'https://static.wixstatic.com/media/c61f3c_7fdfa4c620e5480e8af7aa35782ca320~mv2.png/v1/fill/w_568,h_320,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c61f3c_7fdfa4c620e5480e8af7aa35782ca320~mv2.png',
    artisan: 'Fayaz Mir',
    region: 'Jammu & Kashmir',
    category: 'Papier-mâché',
    description: 'Hand-molded paper pulp boxes painted with gold leaf and floral naqashi, sealed with a glossy lacquer finish.',
  },
  {
    id: 12,
    name: 'Bamboo Weave Basketry',
    img: 'https://www.indonesia.travel/contentassets/4cc27d21e5314614935c4672558a7ae5/bamboo-weaving.jpg',
    artisan: 'Imna Pongen',
    region: 'Nagaland',
    category: 'Basketry',
    description: 'Lightweight bamboo baskets with tight cross-weaves, crafted for fieldwork and transformed into contemporary décor.',
  },
]

export default function ArtCrafts() {
  const [selected, setSelected] = useState(null)
  const [activeTab, setActiveTab] = useState('All')

  const tabs = useMemo(() => ['All', ...new Set(crafts.map((c) => c.category))], [])

  const visibleCrafts = useMemo(() => (
    activeTab === 'All' ? crafts : crafts.filter((c) => c.category === activeTab)
  ), [activeTab])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm uppercase tracking-wide text-amber-600 font-semibold">Craft Atlas</p>
          <h1 className="text-3xl font-bold mt-1">Art & Crafts Gallery</h1>
          <p className="text-gray-600 mt-1">Browse regional crafts, then tap a card to view details and imagery.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                activeTab === tab
                  ? 'bg-orange-600 text-white border-orange-600 shadow'
                  : 'bg-orange-500/90 text-white border-orange-400 hover:bg-orange-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {visibleCrafts.map((c) => (
          <article
            key={c.id}
            className="cursor-pointer relative rounded-xl overflow-hidden border border-gray-800 bg-slate-900 shadow-lg hover:shadow-2xl transition"
            onClick={() => setSelected(c)}
          >
            <div className="h-56 w-full overflow-hidden">
              <img src={c.img} alt={c.name} loading="lazy" width="400" height="224" className="h-full w-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-1 text-white drop-shadow-lg">
              <h3 className="font-semibold text-lg">{c.name}</h3>
              <p className="text-sm text-gray-100">By {c.artisan}</p>
              <p className="text-xs text-gray-200">{c.region} • {c.category}</p>
            </div>
          </article>
        ))}
      </div>

      {selected && (
        <Modal onClose={() => setSelected(null)}>
          <div className="grid md:grid-cols-2 gap-6 items-start">
            <img src={selected.img} alt={selected.name} loading="lazy" width="600" height="400" className="w-full rounded-lg object-cover" />
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-wide text-amber-500 font-semibold">{selected.category}</p>
              <h2 className="text-2xl font-bold">{selected.name}</h2>
              <p className="text-gray-700 leading-relaxed">{selected.description}</p>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-semibold text-gray-800">Artisan:</span> {selected.artisan}</p>
                <p><span className="font-semibold text-gray-800">Region:</span> {selected.region}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
