import { HelpSection } from "./components/help-section";

const Page = () => {
    return (
        <div className="p-4 max-w-full overflow-x-auto">
            <h1 className="mb-4 text-lg font-semibold">Ayuda</h1>
            <HelpSection />
        </div>
    );
}

export default Page;