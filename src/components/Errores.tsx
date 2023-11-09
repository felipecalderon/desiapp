const Errores = ({error, reset}: {error: Error, reset: () => void}) => {
    const handleReset = () => {
        reset()
      }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
            Falló al cargar: {error.message}
            </h2>
            <p className='text-gray-600 dark:text-gray-200 mb-4'>Contacte al administrador y recargue la página.</p>
            <button
            onClick={handleReset}
            className="bg-blue-500 dark:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-400 dark:hover:bg-blue-300 transition duration-200"
            >
            Reiniciar
            </button>
        </div>
        </div>
  )
}

export default Errores