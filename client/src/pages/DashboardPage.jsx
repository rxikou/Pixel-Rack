import { useState } from 'react'
import Navbar from '../components/Navbar'
import Rack from '../components/Rack'
import EnvironmentSelector from '../components/EnvironmentSelector'
import UploadModal from '../components/UploadModal'
import Button from '../components/Button'
import { mockCars, environments } from '../data/mockData'

function DashboardPage() {
  const [cars, setCars] = useState(mockCars)
  const [environmentId, setEnvironmentId] = useState(environments[0].id)
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  function handleDelete(id) {
    setCars((prev) => prev.filter((car) => car.id !== id))
  }

  function handleUpload(newCar) {
    setCars((prev) => [...prev, newCar])
    setIsUploadOpen(false)
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar onUploadClick={() => setIsUploadOpen(true)} />

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-pixel text-sm text-text-primary sm:text-base">
            My Rack
          </h1>
          <Button variant="primary" onClick={() => setIsUploadOpen(true)}>
            + Upload Car
          </Button>
        </div>

        <EnvironmentSelector
          environments={environments}
          activeId={environmentId}
          onSelect={setEnvironmentId}
        />

        <Rack cars={cars} environmentId={environmentId} onDelete={handleDelete} />
      </main>

      {isUploadOpen && (
        <UploadModal
          onClose={() => setIsUploadOpen(false)}
          onUpload={handleUpload}
        />
      )}
    </div>
  )
}

export default DashboardPage
