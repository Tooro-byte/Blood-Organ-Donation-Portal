function Landing() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Donation Portal</h1>
      <p className="mb-4">Save lives by donating blood or organs.</p>
      <div>
        <a href="/login" className="bg-blue-500 text-white px-4 py-2 mr-2">
          Login
        </a>
        <a href="/signup" className="bg-green-500 text-white px-4 py-2">
          Signup
        </a>
      </div>
    </div>
  );
}

export default Landing;
