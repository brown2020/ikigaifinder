import FooterNavBar from "@/components/FooterNavBar";
import SectionHeader from "@/components/SectionHeader";

export default function About() {
  const sections = [
    {
      title: "How We Help You Discover Your Ikigai",
      content: [
        'At Ikigai Finder, we believe that everyone has a unique path that aligns their passions, skills, and values with the needs of the world. Our mission is to help you uncover your "Ikigai" – a Japanese concept that translates to "a reason for being." This is the sweet spot where what you love, what you’re good at, what the world needs, and what you can be paid for all come together.',
        "Powered by cutting-edge technology, our platform leverages the intelligence of OpenAI to ask insightful questions, analyze your responses, and guide you toward a deeper understanding of yourself. With our intuitive process, you can explore your passions, evaluate your skills, and connect the dots between your life’s experiences and what truly matters to you.",
      ],
    },
    {
      title: "Why Ikigai Matters",
      content: [
        "Finding your Ikigai can lead to a more fulfilling, balanced, and happy life. It can help you navigate career choices, improve personal growth, or even find joy in everyday activities. Whether you’re at a crossroads in your career, looking to align your work with your values, or simply exploring personal growth, Ikigai Finder is here to help.",
      ],
    },
    {
      title: "Our Vision",
      content: [
        "We envision a world where people wake up inspired, feel empowered by their work, and live with purpose every day. With the help of artificial intelligence and a passion for personal development, we aim to make the journey of self-discovery accessible to everyone.",
      ],
    },
  ];

  return (
    <>
      <section className="relative sm:px-10 px-5 py-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_60%)] pointer-events-none" />
        <div className="container mx-auto sm:px-4 relative">
          <SectionHeader
            title="About Us"
            subtitle="Welcome to Ikigai Finder, your guide to discovering purpose."
          />
          <div className="max-w-3xl mx-auto mt-8 space-y-10 text-gray-700">
            {sections.map((section, index) => (
              <section key={index}>
                <h2 className="text-xl font-semibold">{section.title}</h2>
                {section.content.map((paragraph, idx) => (
                  <p className="leading-relaxed mt-3" key={idx}>
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </section>
      <FooterNavBar />
    </>
  );
}
