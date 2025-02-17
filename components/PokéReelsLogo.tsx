import { Sparkles } from "lucide-react"

export default function PokéReelsLogo() {
  return (
    <div className="flex flex-col items-end">
      <div className="flex items-center gap-2 text-white bg-gray-800 rounded-full px-3 py-1 shadow-lg">
        <Sparkles className="w-5 h-5 text-yellow-400" />
        <span className="font-bold text-xl">PokéReels</span>
      </div>
    </div>
  )
}

