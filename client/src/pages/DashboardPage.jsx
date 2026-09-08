import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Rack from '../components/Rack'
import RackHeader from '../components/RackHeader'
import EnvironmentGallery from '../components/EnvironmentGallery'
import UploadPanel from '../components/UploadPanel'
import {
  fetchCars,
  fetchEnvironments,
  deleteCar as deleteCarRequest,
} from '../api/cars'

function DashboardPage() {
  const [cars, setCars] = useState([])
  const [environments, setEnvironments] = useState([])
  const [sort, setSort] = useState('shelf')
  const [seriesFilter, setSeriesFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [carList, envList] = await Promise.all([
          fetchCars(),
          fetchEnvironments(),
        ])
        if (cancelled) return
        setCars(carList)
        setEnvironments(envList)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const seriesOptions = useMemo(
    () => [...new Set(cars.map((car) => car.series || 'Uncategorized'))],
    [cars],
  )

  const visibleCars = useMemo(() => {
    let result = cars
    if (seriesFilter !== 'all') {
      result = result.filter(
        (car) => (car.series || 'Uncategorized') === seriesFilter,
      )
    }
    if (sort === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    }
    return result
  }, [cars, seriesFilter, sort])

  const shelfCount = useMemo(
    () => new Set(visibleCars.map((car) => car.series || 'Uncategorized')).size,
    [visibleCars],
  )

  async function handleDelete(id) {
    const previous = cars
    setCars((prev) => prev.filter((car) => car.id !== id)) // optimistic
    try {
      await deleteCarRequest(id)
    } catch (err) {
      setCars(previous) // roll back so the UI cannot drift from the server
      setError(err.message)
    }
  }

  function handleUpload(newCar) {
    setCars((prev) => [...prev, newCar])
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[320px_1fr]">
        <aside>
          <UploadPanel onUpload={handleUpload} />
        </aside>

        <section className="flex flex-col gap-6">
          {error && (
            <p className="border-2 border-accent-pink/60 bg-bg-container/60 px-3 py-2 font-mono text-xs text-accent-pink">
              {error}
            </p>
          )}

          <div className="border-2 border-accent-blue/25 bg-bg-container/40 p-4">
            <RackHeader
              rackName="The Wooden Shelf"
              carCount={visibleCars.length}
              shelfCount={shelfCount}
              sort={sort}
              onSortChange={setSort}
              seriesFilter={seriesFilter}
              seriesOptions={seriesOptions}
              onFilterChange={setSeriesFilter}
            />

            <div className="pt-4">
              {isLoading ? (
                <p className="py-16 text-center font-mono text-sm text-text-secondary">
                  Loading your rack...
                </p>
              ) : (
                <Rack
                  cars={visibleCars}
                  environmentId="rack"
                  onDelete={handleDelete}
                />
              )}
            </div>
          </div>

          {environments.length > 0 && (
            <EnvironmentGallery environments={environments} />
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default DashboardPage
