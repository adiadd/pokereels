import { X } from "lucide-react"

interface InfoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">About PokéReels</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-300 mb-2">Scroll through to discover various Pokémon and their stats on PokéReels.</p>
        <p className="text-gray-300">
          Created by{" "}
          <a
            href="https://twitter.com/adiaddxyz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            @adiaddxyz
          </a>
        </p>
        <p className="text-sm sm:text-base text-gray-400 mt-4 italic">
          Disclaimer: PokéReels is not affiliated with, endorsed, sponsored, or specifically approved by Nintendo, The
          Pokémon Company, or any of their subsidiaries or affiliates.
        </p>
      </div>
    </div>
  )
}

