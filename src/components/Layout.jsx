import NavBar from "./ui/NavBar";

const Layout = ({ children, onSelectGame }) => (
    <div className="min-h-screen bg-gray-100 font-montserrat">
        <NavBar onSelect={onSelectGame} />
        <main className="container mx-auto p-4">
            {children}
        </main>
    </div>
);

export default Layout;
