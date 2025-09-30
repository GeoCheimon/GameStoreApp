import { Outlet } from 'react-router-dom';
import Header from '../HomePage/Header';
import ProfileSidebar from './ProfileSidebar';
import './ProfilePage.css';
const ProfilePage = () => {
  return (
    <>
      <Header />
      <div className="container-xl py-5">
        <div className="row g-4 align-items-start">
          {/* Αριστερή Στήλη: Sidebar */}
          <aside className="col-12 col-md-3">
            <ProfileSidebar />
          </aside>

          {/* Δεξιά Στήλη: Το περιεχόμενο της υποσελίδας */}
          <main className="col-12 col-md-9">
            {/* Το <Outlet /> είναι το μαγικό component του React Router.
              Λειτουργεί σαν placeholder όπου θα "ζωγραφιστεί" το component
              της ενεργής υποσελίδας (π.χ. το AccountDetails, MyGames, κτλ).
            */}
            <div className="profile-content-wrapper">
                <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;