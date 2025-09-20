import { Link } from "react-router-dom";
import notFoundImage from "../../assets/NotFound.png"; 

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-600">
      <img 
        src={notFoundImage} 
        alt="Not Found" 
        className="size-96 object-contain mb-6" 
      />
      <Link 
        to="/" 
        className="text-blue-500 hover:underline text-lg"
      >
        Back to Home
      </Link>
    </div>
  );
}
