import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
            🍳 AI Recipe Generator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover delicious recipes tailored to your ingredients, dietary
            preferences, and cooking style with the power of AI.
          </p>
        </div>

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                What&apos;s in your kitchen?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Enter your available ingredients and let our AI create
                personalized recipes just for you.
              </p>
              <div className="space-y-4">
                <Link href="/recipes">
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                    Start Generating Recipes ✨
                  </button>
                </Link>
              </div>
            </div>
            <div className="text-center">
              <div className="text-8xl mb-4">👨‍🍳</div>
              <p className="text-gray-500 dark:text-gray-400">
                AI-Powered Cooking Assistant
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Smart Matching
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              AI matches your ingredients with perfect recipes
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
            <div className="text-4xl mb-4">🥗</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Dietary Preferences
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Customized for vegan, keto, gluten-free & more
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Instant Results
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get recipes in seconds with step-by-step instructions
            </p>
          </div>
        </div>

        {/* Auth Section */}
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Get Started
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Sign in to save your favorite recipes and get personalized
            suggestions
          </p>
          <Link href="/auth">
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
              Sign In with Magic Link 🪄
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
