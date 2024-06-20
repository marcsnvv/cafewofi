import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, Wifi, Time, Slider, List, Table, UserVoice, Volume, Views, Calendar, Filter, Leaf } from "@/modules/icons"
import CoffeeCard from "../components/cafe-card"

export default function Filters({ props, setPlaceData, cafes }) {
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

    // Función para cargar más cafeterías
    const loadMoreCafes = () => {
        setPage(prevPage => prevPage + 1) // Incrementa la página actual
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
        let updatedPlaces = cafesShops

        if (props.place) {
            const placeLower = props.place.toLowerCase();
            updatedPlaces = updatedPlaces.filter(coffee =>
                coffee.address.toLowerCase().includes(placeLower) || coffee.name.toLowerCase().includes(placeLower)
            )
        }

        if (filters?.length > 0) {
            updatedPlaces = updatedPlaces.filter(place =>
                filters.every(filter => place.pluses?.keywords?.includes(filter))
            );
        }

        setTotalResults(updatedPlaces.length)
        // Reinicia la lista de cafeterías filtradas cuando se aplican nuevos filtros o lugar
        setFilteredPlaces(updatedPlaces.slice(0, 20)) // Muestra solo las primeras 20 cafeterías al aplicar filtros
        setPage(1) // Reinicia la página al cambiar los filtros o la ubicación

    }, [props.place, filters])

    // Maneja el evento de scroll para cargar más cafeterías cuando el usuario se acerca al final de la página
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
            if (loading || !hasMore) return;
            loadMoreCafes();
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore]);

    return (
        loading ? <section className="h-full w-full items-center justify-center">
            {/* <Loader /> */}
            <h1>Loading...</h1>
        </section> :
            <section className="z-0 w-screen">
                <div className="z-40 lg:fixed flex flex-col gap-5 lg:p-10 p-5 mt-20 bg-white w-screen lg:w-[50vw] 2xl:w-[40vw]">
                    <h2 className="text-xl text-darkgray">
                        Coffe Shops in <span className="font-nyght font-semibold">{props.place}</span>
                    </h2>
                    <span>{totalResults} results ·{" "}
                        <span>Sort by:{" "}
                            <button
                                onClick={() => {
                                    if (sortBy === "Price") {
                                        setSortBy("Relevance")
                                    } else if (sortBy === "Relevance") {
                                        setSortBy("New")
                                    } else setSortBy("Price")
                                }}
                                className="font-bold text-brand">
                                {sortBy}
                            </button>
                        </span>
                    </span>
                    <div className="flex justify-between items-start">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => { const updatedFilters = filters.includes("Good pricing") ? filters.filter(filter => filter !== "Good pricing") : [...filters, "Good pricing"]; setFilters(updatedFilters) }}
                                className={`hover:bg-gray/10 text-gray font-bold flex items-center gap-2 px-4 py-1 rounded-lg border-2 border-gray text-sm ${filters.includes("Good pricing") && "bg-brand/30 hover:bg-brand/30"}`}>
                                <Card /> Price
                            </button>
                            <button
                                onClick={() => { const updatedFilters = filters.includes("Wifi") ? filters.filter(filter => filter !== "Wifi") : [...filters, "Wifi"]; setFilters(updatedFilters) }}
                                className={`hover:bg-gray/10 text-gray font-bold flex items-center gap-2 px-4 py-1 rounded-lg border-2 border-gray text-sm ${filters.includes("Wifi") && "bg-brand/30 hover:bg-brand/30"}`}>
                                <Wifi /> Wifi
                            </button>
                            <button
                                onClick={() => { const updatedFilters = filters.includes("Time") ? filters.filter(filter => filter !== "Time") : [...filters, "Time"]; setFilters(updatedFilters) }}
                                className={`hover:bg-gray/10 text-gray font-bold flex items-center gap-2 px-4 py-1 rounded-lg border-2 border-gray text-sm ${filters.includes("Time") && "bg-brand/30 hover:bg-brand/30"}`}>
                                <Time /> Time
                            </button>
                            <button
                                onClick={() => { setMoreFilters(moreFilters === false ? true : false) }}
                                className={`hover:bg-gray/10 text-gray font-bold flex items-center gap-2 px-4 py-1 rounded-lg border-2 border-gray text-sm`}>
                                <Slider /> More
                            </button>

                            <div className={`${moreFilters === true ? "flex" : "hidden"} gap-2 flex-wrap`}>
                                <button
                                    onClick={() => { const updatedFilters = filters.includes("Atmosphere") ? filters.filter(filter => filter !== "Atmosphere") : [...filters, "Atmosphere"]; setFilters(updatedFilters) }}
                                    className={`hover:bg-gray/10 text-gray font-bold flex items-center gap-2 px-4 py-1 rounded-lg border-2 border-gray text-sm ${filters.includes("Atmosphere") && "bg-brand/30 hover:bg-brand/30"}`}>
                                    <UserVoice /> Atmosphere
                                </button>
                                <button
                                    onClick={() => { const updatedFilters = filters.includes("Background music") ? filters.filter(filter => filter !== "Background music") : [...filters, "Background music"]; setFilters(updatedFilters) }}
                                    className={`hover:bg-gray/10 text-gray font-bold flex items-center gap-2 px-4 py-1 rounded-lg border-2 border-gray text-sm ${filters.includes("Background music") && "bg-brand/30 hover:bg-brand/30"}`}>
                                    <Volume /> Background music
                                </button>
                                <button
                                    onClick={() => { const updatedFilters = filters.includes("Panoramic views") ? filters.filter(filter => filter !== "Panoramic views") : [...filters, "Panoramic views"]; setFilters(updatedFilters) }}
                                    className={`hover:bg-gray/10 text-gray font-bold flex items-center gap-2 px-4 py-1 rounded-lg border-2 border-gray text-sm ${filters.includes("Panoramic views") && "bg-brand/30 hover:bg-brand/30"}`}>
                                    <Views /> Panoramic views
                                </button>
                                <button
                                    onClick={() => { const updatedFilters = filters.includes("Panoramic views") ? filters.filter(filter => filter !== "Events and Activities") : [...filters, "Events and Activities"]; setFilters(updatedFilters) }}
                                    className={`hover:bg-gray/10 text-gray font-bold flex items-center gap-2 px-4 py-1 rounded-lg border-2 border-gray text-sm ${filters.includes("Events and Activities") && "bg-brand/30 hover:bg-brand/30"}`}>
                                    <Calendar /> Events and Activities
                                </button>
                                <button
                                    onClick={() => { const updatedFilters = filters.includes("Specialty Coffee") ? filters.filter(filter => filter !== "Specialty Coffee") : [...filters, "Specialty Coffee"]; setFilters(updatedFilters) }}
                                    className={`hover:bg-gray/10 text-gray font-bold flex items-center gap-2 px-4 py-1 rounded-lg border-2 border-gray text-sm ${filters.includes("Specialty Coffee") && "bg-brand/30 hover:bg-brand/30"}`}>
                                    <Filter /> Specialty Coffee
                                </button>
                                <button
                                    onClick={() => { const updatedFilters = filters.includes("Vegan or Gluten Free Menu") ? filters.filter(filter => filter !== "Vegan or Gluten Free Menu") : [...filters, "Vegan or Gluten Free Menu"]; setFilters(updatedFilters) }}
                                    className={`hover:bg-gray/10 text-gray font-bold flex items-center gap-2 px-4 py-1 rounded-lg border-2 border-gray text-sm ${filters.includes("Vegan or Gluten Free Menu") && "bg-brand/30 hover:bg-brand/30"}`}>
                                    <Leaf /> Vegan or Gluten Free Menu
                                </button>


                            </div>
                        </div>

                        <div className="flex gap-5">
                            <div className="flex flex-col lg:flex-row gap-2">
                                <button className="p-1 rounded-lg hover:bg-lightgray" onClick={() => setStructure(1)}>
                                    <Table color={structure === 0 && true} />
                                </button>
                                <button className="p-1 rounded-lg hover:bg-lightgray" onClick={() => setStructure(0)}>
                                    <List color={structure === 1 && true} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <section
                    className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-10 p-5 mt-10 w-screen lg:w-[50vw] 2xl:w-[40vw]"
                >

                    {filteredPlaces.length === 0 &&
                        <div className="flex flex-col gap-10 justify-center items-center h-96">
                            <Image src={"/notfound.png"} width={200} height={200} alt="Not Found" />
                            <h4 className="text-xl font-bold">Coffee Break Required</h4>
                            <span className="text-md text-gray w-96 text-center">
                                Oops, it looks like the search results are not quite right. Please try searching with the name of a city, country, or a nearby café to find what you're looking for.
                            </span>
                        </div>
                    }
                    {filteredPlaces.map((cafe, index) => (
                        <CoffeeCard
                            id={index}
                            data={cafe}
                            size="xs"
                            props={{ setPlaceData, selectedPlace, structure, likes: props.likes }}
                        />
                    ))}
                </section>
            </section>
    )
}