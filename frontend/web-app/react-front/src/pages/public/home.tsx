import { Link } from "react-router-dom";

const Home: React.FC = () => {
    return (
        <div className="flex gap-5 items-center justify-center h-screen">
            <button className="shadow-lg rounded-lg p-5 bg-blue-400 text-white font-semibold">
                <Link to='/signup'>
                    Sign-up
                </Link>
            </button>
            <button className="shadow-lg rounded-lg p-5 bg-cyan-400 text-white font-semibold">
                <Link to='/login'>
                    Login
                </Link>
            </button>
        </div>
    );
}

export default Home;