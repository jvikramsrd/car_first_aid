function Home() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center text-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
      <h1 className="text-5xl font-bold">
        Welcome to <span className="text-blue-300">Car First Aid</span>
      </h1>
      <p className="mt-4 text-lg">
        Get quick car troubleshooting solutions with AI-powered diagnostics.
      </p>
      <button className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full shadow-md text-lg hover:opacity-80">
        Get Started
      </button>
    </div>
  );
}

export default Home;
