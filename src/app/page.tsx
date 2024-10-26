import HomePage from "@/componentPages/HomePage";
import FooterNavBar from "@/components/FooterNavBar";
export default function page() {
  return (
    <div>
      <HomePage />
      <div id="recent-article">
        <FooterNavBar />
      </div>
    </div>
  );
}
