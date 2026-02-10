import React from "react"
import { useForm } from "react-hook-form"

const recipes = [
  {
    id: 1,
    name: "Butter Chicken",
    ingredients: ["Chicken", "Butter", "Cream", "Spices"],
    nutrition: "350 Kcal",
    image:
      "https://images.unsplash.com/photo-1728910107534-e04e261768ae?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnV0dGVyJTIwY2hpY2tlbnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 2,
    name: "Biryani",
    ingredients: ["Rice", "Meat", "Spices", "Yogurt"],
    nutrition: "400 Kcal",
    image:
      "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmlyeWFuaXxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 3,
    name: "Samosa",
    ingredients: ["Flour", "Potato", "Spices", "Oil"],
    nutrition: "200 cal",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Ftb3NhfGVufDB8fDB8fHww",
  },
  {
    id: 4,
    name: "Butter Paneer",
    ingredients: ["Paneer", "Butter", "Cream", "Spices", "vegetables"],
    nutrition: "200 Kcal",
    image:
      "https://images.unsplash.com/photo-1701579231378-3726490a407b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGFuZWVyfGVufDB8fDB8fHww",

  },
  {
    id: 5,
    name: "Rasmalai",
    ingredients: ["Milk", "Cornflour", "Sugar", "cardamom", "Safron"],
    nutrition: "160 cal",
    image:
      "data:image/jpeg;base64,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",
  },
]

export default function Cuisine() {
  const { register, watch } = useForm({ defaultValues: { search: "" } })
  const query = watch("search") || ""

  const list = recipes.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-blue mb-4">
        Cuisine Explorer
      </h1>

      <div className="mb-6">
        <input
          {...register("search")}
          placeholder="Search recipes"
          className="border px-3 py-2 w-full md:w-1/2 rounded"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {list.map((r) => (
          <div
            key={r.id}
            className="relative overflow-hidden min-h-[160px]
              bg-gradient-to-r from-gray-900 via-gray-800 to-transparent
              rounded shadow border border-gold/30 p-4 text-white"
          >
            {/* TEXT */}
            <div className="relative z-10 max-w-[60%]">
              <h3 className="font-bold text-gold text-lg">{r.name}</h3>
              <p className="text-sm mt-1 text-gray-300">
                Ingredients: {r.ingredients.join(", ")}
              </p>
              <p className="text-sm mt-1 text-gold font-semibold">
                {r.nutrition}
              </p>
            </div>

            {/* IMAGE */}
            <img
              src={r.image}
              alt={r.name}
              className="
                absolute right-0 top-0 h-full w-2/3 object-cover
                opacity-70
                [mask-image:linear-gradient(to_left,black,transparent)]
              "
            />
          </div>
        ))}
      </div>
    </div>
  )
}
