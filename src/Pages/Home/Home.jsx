import Contacts from '../../Components/Posts/Contacts';
import RecentPosts from '../../Components/RecentPosts/RecentPosts';
import Posts from '../Posts/posts';

export default function Home() {
  return (
    <div className="flex justify-between ">
      {/* Left Sidebar */}
      <div className="wrapper">
        <div className="hidden md:block sticky top-0 bottom-0">

        <Contacts />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-2 md:px-4 flex-1 ">
        <Posts />
      </div>

      {/* Right Sidebar */}
      <div className="wrapper mr-2">
        <div className="hidden xl:block sticky top-28 right-0 bottom-24">

        <RecentPosts />
        </div>
      </div>
    </div>



  );
}
