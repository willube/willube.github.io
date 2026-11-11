import { ScrollProgress } from "@/components/Reveal";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { TechFocus } from "@/components/TechFocus";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { BackgroundMesh } from "@/components/BackgroundMesh";
export default function HomePage() {
 return <><a className="skip-link" href="#main">Skip to content</a><BackgroundMesh/><ScrollProgress/><Navbar/><main id="main"><Hero/><Projects/><TechFocus/><Contact/></main><Footer/></>;
}
