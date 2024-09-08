import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Card, Wifi, Time, Slider, List, Table, UserVoice, Volume, Views, Calendar, Filter, Leaf } from "@/modules/icons"
import CoffeeCard from "../components/cafe-card"
import LoadingPage from "./loading-page"

import { pois } from "@/utils/pois"

const Filters = ({ props, setPlaceData, cafes }) => {
    const [cafesShops, setCafesShops] = useState(cafes)
    const [loading, setLoading] = useState(true)
    const [filteredPlaces, setFilteredPlaces] = useState([])
    const [filters, setFilters] = useState([])
    const [sortBy, setSortBy] = useState("Price")
    const [selectedPlace, setSelectedPlace] = useState(0)
    const [structure, setStructure] = useState(0)
    const [moreFilters, setMoreFilters] = useState(false)
    const [page, setPage] = useState(1) // Inicialmente cargamos la primera página
    const [hasMore, setHasMore] = useState(true) // Indica si hay más datos para cargar
    const [totalResults, setTotalResults] = useState(0)
    const [showRemoveAll, setShowRemoveAll] = useState(false); // Estado para mostrar el botón "Remove all"

    // Función para cargar más filtros
    const loadMoreFilters = () => {
        setMoreFilters(!moreFilters)
    }

    // Efecto para cargar cafeterías inicialmente y cuando cambia la página
    useEffect(() => {
        setLoading(true)
        // Simula una llamada a la API para cargar datos paginados
        const loadCafes = async () => {
            try {
                // Puedes ajustar la cantidad de cafeterías por página aquí
                const cafesPerPage = 20
                const start = (page - 1) * cafesPerPage
                const end = start + cafesPerPage
                const cafesToShow = cafesShops.slice(start, end)
                setFilteredPlaces(prevCafes => [...prevCafes, ...cafesToShow])
                setLoading(false)

                // Si ya no hay más cafeterías por cargar, actualiza el estado
                if (end >= cafesShops.length) {
                    setHasMore(false)
                }
            } catch (error) {
                console.error("Error fetching cafes:", error)
                setLoading(false)
            }
        }

        loadCafes()

    }, [page, cafesShops])

    // Efecto para filtrar cafeterías cuando cambian los filtros o la ubicación
    useEffect(() => {
        let updatedPlaces = cafesShops;

        // Filtrar por ubicación
        if (props.place) {
            const placeLower = props.place.toLowerCase();
            updatedPlaces = updatedPlaces.filter(coffee =>
                coffee.address?.toLowerCase().includes(placeLower) // || coffee.name.toLowerCase().includes(placeLower)
            )
        }

        // Filtrar por términos de poi y otros filtros
        if (filters?.length > 0) {
            updatedPlaces = updatedPlaces.filter(place => {
                // Dividir el campo poi en términos individuales
                const poiTerms = place.poi?.split(',').map(term => term.trim().toLowerCase()) || [];
                // Verificar si todos los filtros están presentes en los términos de poi
                return filters.every(filter => poiTerms.includes(filter.toLowerCase()));
            });
        }

        // Ordenar según el criterio seleccionado
        if (sortBy === "Price") {
            updatedPlaces.sort((a, b) => {
                // Implementar la lógica de ordenamiento por precio aquí
                // Ejemplo:
                const priceRank = {
                    "PRICE_LEVEL_INEXPENSIVE": 1,
                    "PRICE_LEVEL_MODERATE": 3,
                    "PRICE_LEVEL_EXPENSIVE": 5
                };
                return priceRank[a.price] - priceRank[b.price];
            });
        } else if (sortBy === "Relevance") {
            updatedPlaces.sort((a, b) => b.score - a.score); // Ordenar por relevancia (score) de mayor a menor
        } else if (sortBy === "New") {
            updatedPlaces.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Ordenar por fecha de creación más reciente
        }

        // Actualizar los resultados filtrados y el total de resultados
        setTotalResults(updatedPlaces.length);
        // Reinicia la lista de cafeterías filtradas cuando se aplican nuevos filtros o lugar
        setFilteredPlaces(updatedPlaces.slice(0, 20)); // Muestra solo las primeras 20 cafeterías al aplicar filtros
        setPage(1); // Reinicia la página al cambiar los filtros o la ubicación

        // Mostrar botón "Remove all" cuando hay al menos 2 filtros seleccionados
        if (filters.length >= 2) {
            setShowRemoveAll(true);
        } else {
            setShowRemoveAll(false);
        }

    }, [props.place, filters, sortBy])

    const handleFilterClick = (name) => {
        const updatedFilters = filters.includes(name)
            ? filters.filter(filter => filter !== name)
            : [...filters, name]
        setFilters(updatedFilters)
    }

    const clearAllFilters = () => {
        setFilters([]);
        setShowRemoveAll(false); // Ocultar el botón "Remove all" después de limpiar los filtros
    };

    const essentialFilters = pois.slice(0, 8) // Obtener los 8 filtros esenciales
    const additionalFilters = pois.slice(8) // Obtener los filtros adicionales

    return (
        loading ? (
            <LoadingPage />
        ) : (
            <section className="z-0">
                <div className="z-40 flex flex-col gap-5 p-5 mt-20 bg-white">
                    <h2 className="hidden lg:block text-2xl text-darkgray">
                        Cafes in <span className="font-nyght font-semibold">{props.place}</span>
                    </h2>
                    <span className="hidden lg:block">{totalResults} results ·{" "}
                        <span>Sort by:{" "}
                            <button
                                onClick={() => {
                                    if (sortBy === "Price") {
                                        setSortBy("Relevance")
                                    } else if (sortBy === "Relevance") {
                                        setSortBy("New")
                                    } else setSortBy("Price")
                                }}
                                className="font-bold text-brand"
                            >
                                {sortBy}
                            </button>
                        </span>
                    </span>
                    <div className="flex justify-between items-start">
                        <div className="hidden lg:flex flex-wrap gap-2">
                            {/* Renderizar los filtros esenciales */}
                            {essentialFilters.map((poi, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleFilterClick(poi.name)}
                                    className={`hover:bg-gray/10 text-gray font-bold flex items-center gap-2 px-4 py-1 rounded-lg border-2 border-gray text-sm ${filters.includes(poi.name) && "bg-brand/30 hover:bg-brand/30"}`}
                                >
                                    <span>{poi.icon}</span> {poi.name}
                                </button>
                            ))}
                            {/* Renderizar filtros adicionales si moreFilters es true */}
                            {moreFilters && additionalFilters.map((poi, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleFilterClick(poi.name)}
                                    className={`hover:bg-gray/10 text-gray font-bold flex items-center gap-2 px-4 py-1 rounded-lg border-2 border-gray text-sm ${filters.includes(poi.name) && "bg-brand/30 hover:bg-brand/30"}`}
                                >
                                    <span>{poi.icon}</span> {poi.name}
                                </button>
                            ))}

                            {/* Botón para cargar más filtros */}
                            <button
                                onClick={loadMoreFilters}
                                className="hover:bg-gray/10 text-gray font-bold flex items-center gap-2 px-4 py-1 rounded-lg border-2 border-gray text-sm"
                            >
                                <Slider /> {moreFilters ? "Show less" : "Show more"}
                            </button>
                            {showRemoveAll && (
                                <button
                                    onClick={clearAllFilters}
                                    className="hover:bg-gray/10 text-gray font-bold flex items-center gap-2 px-4 py-1 rounded-lg border-2 border-gray text-sm"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>

                        <div className="flex gap-5">
                            <div className="flex flex-col lg:flex-row gap-2">
                                {/* Aquí irían los botones de estructura (Tabla / Lista) */}
                            </div>
                        </div>
                    </div>

                    {/* MOBILE MENU */}
                    <div className="flex lg:hidden w-full overflow-y-auto">
                        {additionalFilters.map((poi, index) => (
                            <button
                                key={index}
                                onClick={() => handleFilterClick(poi.name)}
                                className={`flex items-center text-center justify-center gap-2 p-1.5 mx-1 text-2xl ${filters.includes(poi.name) && "border-b-2 border-brand"}`}
                            >
                                <span>{poi.icon}</span>
                            </button>
                        ))}
                    </div>
                </div>
                {filteredPlaces.length === 0 &&
                    <div className="m-5 flex flex-col gap-10 justify-center items-center h-96">
                        <Image src={"/notfound.png"} width={200} height={200} alt="Not Found" />
                        <h4 className="text-xl font-bold">Coffee Break Required</h4>
                        <span className="text-md text-gray w-96 text-center">
                            Oops, it looks like the search results are not quite right. Please try searching with the name of a city, country, or a nearby café to find what you're looking for.
                        </span>
                    </div>
                }
                <section
                    className="grid grid-cols-1 lg:grid-cols-4 2xl:grid-cols-6 gap-10 p-5 w-full"
                >
                    {filteredPlaces.map((cafe, index) => (
                        <CoffeeCard
                            key={index}
                            id={index}
                            data={cafe}
                            size="xs"
                            props={{ setPlaceData, selectedPlace, structure, likes: props.likes }}
                        />
                    ))}
                </section>
            </section>
        )
    )
}

export default Filters
