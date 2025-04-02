function Marketplace() {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-6">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Marketplace</h2>
          <p className="text-gray-600 mb-4">Buy car parts & tools at great prices.</p>
  
          <div className="grid grid-cols-2 gap-4">
            <div className="border p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">🔋 Car Battery</h3>
              <p className="text-gray-500">$99.99</p>
              <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Buy
              </button>
            </div>
            <div className="border p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">🛠 Tool Kit</h3>
              <p className="text-gray-500">$49.99</p>
              <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Buy
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default Marketplace;
  