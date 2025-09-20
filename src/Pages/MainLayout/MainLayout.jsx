import { Outlet } from 'react-router-dom';
import NavbarComponent from '../../Components/Navbar/Navbar';

export default function MainLayout() {
  return (
    <div>
      <NavbarComponent/>
      <div  >

      <Outlet/>
      </div>
    </div>
  );
}