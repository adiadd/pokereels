"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import PokeTokLogo from "./PokeTokLogo"
import InfoModal from "./InfoModal"
import { Info, ExternalLink, Ruler, Weight, Zap, Heart, Shield, Swords, Wind, Brain, Target } from "lucide-react"

interface Pokemon {
  id: number
  name: string
  types: { type: { name: string } }[]
  sprites: { other: { "official-artwork": { front_default: string } } }
  height: number
  weight: number
  abilities: { ability: { name: string } }[]
  flavor_text_entries: { flavor_text: string; language: { name: string } }[]
  stats: { base_stat: number; stat: { name: string } }[]
}

export default function PokeTok() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const observer = useRef<IntersectionObserver | null>(null)

  const fetchPokemon = useCallback(async () => {
    setLoading(true)
    const randomId = Math.floor(Math.random() * 898) + 1
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
    const data = await response.json()

    const speciesResponse = await fetch(data.species.url)
    const speciesData = await speciesResponse.json()

    setPokemon((prev) => [...prev, { ...data, ...speciesData }])
    setLoading(false)
  }, [])

  const lastPokemonRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchPokemon()
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, fetchPokemon],
  )

  useEffect(() => {
    fetchPokemon()
  }, [fetchPokemon])

  const getStatIcon = (statName: string) => {
    switch (statName) {
      case "hp":
        return <Heart className="w-4 h-4" />
      case "attack":
        return <Swords className="w-4 h-4" />
      case "defense":
        return <Shield className="w-4 h-4" />
      case "special-attack":
        return <Zap className="w-4 h-4" />
      case "special-defense":
        return <Shield className="w-4 h-4" />
      case "speed":
        return <Wind className="w-4 h-4" />
      default:
        return <Target className="w-4 h-4" />
    }
  }

  return (
    <div className="h-screen overflow-y-auto snap-y snap-mandatory bg-gray-900 text-gray-100 relative">
      <div className="fixed top-4 right-4 z-10 flex flex-col items-end gap-2">
        <PokeTokLogo />
        <button onClick={() => setIsInfoModalOpen(true)} className="bg-gray-800 p-2 rounded-full shadow-lg">
          <Info className="w-5 h-5 text-white" />
        </button>
      </div>
      <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
      {pokemon.map((poke, index) => (
        <motion.div
          key={poke.id}
          className="h-screen w-full snap-start flex flex-col"
          ref={index === pokemon.length - 1 ? lastPokemonRef : null}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full h-1/2 relative bg-gray-800">
            <Image
              src={poke.sprites.other["official-artwork"].front_default || "/placeholder.svg"}
              alt={poke.name}
              layout="fill"
              objectFit="contain"
              priority={index === 0}
            />
          </div>
          <div className="w-full h-1/2 bg-gray-900 p-4 flex flex-col">
            <div className="bg-gray-800 rounded-3xl p-4 shadow-lg flex-grow flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-3xl sm:text-4xl font-bold capitalize text-gray-100">{poke.name}</h2>
                <span className="text-2xl font-semibold text-gray-400">#{poke.id}</span>
              </div>
              <div className="flex gap-2 mb-3">
                {poke.types.map((type) => (
                  <span
                    key={type.type.name}
                    className="px-3 py-1 rounded-full text-sm font-semibold text-gray-900"
                    style={{ backgroundColor: getTypeColor(type.type.name) }}
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3 text-sm sm:text-base text-gray-300">
                <div className="flex items-center gap-1">
                  <Ruler className="w-5 h-5" />
                  <span>{poke.height / 10}m</span>
                </div>
                <div className="flex items-center gap-1">
                  <Weight className="w-5 h-5" />
                  <span>{poke.weight / 10}kg</span>
                </div>
                <div className="flex items-center gap-1">
                  <Brain className="w-5 h-5" />
                  <span>{poke.abilities[0].ability.name}</span>
                </div>
              </div>
              <div className="mb-3">
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-200">Base Stats:</h3>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {poke.stats.map((stat) => (
                    <div key={stat.stat.name} className="flex items-center gap-1">
                      {getStatIcon(stat.stat.name)}
                      <span className="capitalize">{stat.stat.name.split("-")[0]}:</span>
                      <span className="font-semibold">{stat.base_stat}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-400 italic mb-3">
                {poke.flavor_text_entries
                  ?.find((entry) => entry.language.name === "en")
                  ?.flavor_text.replace(/\f/g, " ") || "No description available."}
              </p>
              <a
                href={`https://www.pokemon.com/us/pokedex/${poke.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-full transition-colors duration-300 mt-auto"
              >
                Pokédex <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function getTypeColor(type: string): string {
  const colors: { [key: string]: string } = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#EE99AC",
  }
  return colors[type] || "#888888"
}

