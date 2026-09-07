import { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Rack from '../components/Rack'
import RackHeader from '../components/RackHeader'
import EnvironmentGallery from '../components/EnvironmentGallery'
import UploadPanel from '../components/UploadPanel'
import { mockCars, environments } from '../data/mockData'

function DashboardPage() {
  const [cars, setCars] = useState(mockCars)
  const [environmentId, setEnvironmentId] = useState(environments[0].id)
  const [sort, setSort] = useState('shelf')
  const [seriesFilter, setSeriesFilter] = useState('all')

  const seriesOptions = useMemo(
    () => [...new Set(cars.map((car) => car.series || 'Uncategorized'))],
    [cars],
  )

  const visibleCars = useMemo(() => {
    let result = cars
    if (seriesFilter !== 'all') {
      result = result.filter((car) => (car.series || 'Uncategorized') === seriesFilter)
    }
    if (sort === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    }
    return result
  }, [cars, seriesFilter, sort])

  function handleDelete(id) {
    setCars((prev) => prev.filter((car) => car.id !== id))
  }

  function handleUpload(newCar) {
    setCars((prev) => [...prev, newCar])
  }

  const activeEnvironment = environments.find((env) => env.id === environmentId)

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[300px_1fr]">
        <aside>
          <UploadPanel onUpload={handleUpload} />
        </aside>

        <section className="flex flex-col gap-4">
          <RackHeader
            rackName={activeEnvironment?.name ?? ''}
            carCount={visibleCars.length}
            sort={sort}
            onSortChange={setSort}
            seriesFilter={seriesFilter}
            seriesOptions={seriesOptions}
            onFilterChange={setSeriesFilter}
          />

          <Rack cars={visibleCars} environmentId={environmentId} onDelete={handleDelete} />

          <EnvironmentGallery
            environments={environments}
            activeId={environmentId}
            onSelect={setEnvironmentId}
          />
        </section>
      </main>
    </div>
  )
}

export default DashboardPage
