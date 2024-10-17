export default function About() {
  const sections = [
    {
      title: "How We Help You Discover Your Ikigai",
      content: [
        "At Ikigai Finder, we believe that everyone has a unique path that aligns their passions, skills, and values with the needs of the world. Our mission is to help you uncover your \"Ikigai\" – a Japanese concept that translates to \"a reason for being.\" This is the sweet spot where what you love, what you’re good at, what the world needs, and what you can be paid for all come together.",
        "Powered by cutting-edge technology, our platform leverages the intelligence of OpenAI to ask insightful questions, analyze your responses, and guide you toward a deeper understanding of yourself. With our intuitive process, you can explore your passions, evaluate your skills, and connect the dots between your life’s experiences and what truly matters to you."
      ]
    },
    {
      title: "Why Ikigai Matters",
      content: [
        "Finding your Ikigai can lead to a more fulfilling, balanced, and happy life. It can help you navigate career choices, improve personal growth, or even find joy in everyday activities. Whether you’re at a crossroads in your career, looking to align your work with your values, or simply exploring personal growth, Ikigai Finder is here to help."
      ]
    },
    {
      title: "Our Vision",
      content: [
        "We envision a world where people wake up inspired, feel empowered by their work, and live with purpose every day. With the help of artificial intelligence and a passion for personal development, we aim to make the journey of self-discovery accessible to everyone."
      ]
    }
  ];

  return (
    <div className="bg-white text-gray-800 min-h-screen py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold mb-6 text-center text-indigo-600">About Us</h1>
        <p className="text-lg leading-relaxed text-center mb-10">
          Welcome to <span className="font-semibold text-lg">Ikigai Finder</span>, your personal guide to discovering your true purpose in life!
        </p>

        {sections.map((section, index) => (
          <section className="mb-12" key={index}>
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">{section.title}</h2>
            {section.content.map((paragraph, idx) => (
              <p className="text-lg leading-relaxed mb-4" key={idx}>{paragraph}</p>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
};

