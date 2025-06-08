import './BookingsPage.css'
import { motion } from "framer-motion"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faXmark, faDownload, faLocationArrow, faMapLocation, faMapLocationDot, faLocationCrosshairs, faSearchLocation, faLocationPin, faFileDownload, faCancel, faExclamationCircle, faXmarksLines, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';

const BookingsPage = () => {

  const bookings = [
    {
      id: 1,
      name: "Skydiving Adventure",
      date: "2024-03-15",
      status: "Confirmed",
      location: "Mysore, Karnataka",
      image: "https://snowscene.com.au/wp-content/uploads/2020/06/experience-co-nz-skydive-queenstown-2-scaled.jpg"
    },
    {
      id: 2,
      name: "Himalayan Trekking",
      date: "2024-04-02",
      status: "Pending",
      location: "Mussoorie, Uttarakhand",
      image: "https://images.livemint.com/img/2022/05/20/original/Big_Story_Himalayan_Treks_Nepal_1653055597386.jpg"
    },
    {
      id: 3, // Changed from 2 to 3 to ensure unique key
      name: "Himalayan Trekking",
      date: "2024-04-02",
      status: "Pending",
      location: "Mussoorie, Uttarakhand",
      image: "https://images.livemint.com/img/2022/05/20/original/Big_Story_Himalayan_Treks_Nepal_1653055597386.jpg"
    },
  ];

  return (
    <motion.div
      className="bookings-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="bookings-title">Your Experiences</h2>

      <div className="bookings-grid">
        {bookings.map((booking) => (
          <div key={booking.id} className="booking-card">
            <div className="card-image">
              <img src={booking.image} alt={booking.name} />
            </div>

            <div className="card-content">
              <div className="card-header">
                <h3 className="experience-name">{booking.name}</h3>
                <span className={`status-badge ${booking.status.toLowerCase()}`}>
                  {booking.status}
                </span>
              </div>

              <div className="card-body">
                <p className="booking-date">
                  <span className="date-label">Booking Date:</span>
                  {new Date(booking.date).toLocaleDateString()}
                </p>

                <button className="location-btn">
                  <FontAwesomeIcon icon={faLocationDot} />
                  {booking.location}
                </button>
              </div>

              <div className="card-footer">
                <p>persons : 4</p>
                <div className="btns">
                  <button className="action-btn download-btn">
                    <FontAwesomeIcon icon={faDownload} />
                    Ticket
                  </button>
                  {booking.status === "Confirmed" ? (
                    <button className="action-btn review-btn">
                      Review
                    </button>
                  ) : (
                    <button className="action-btn cancel-btn">
                      <FontAwesomeIcon icon={faXmark} />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default BookingsPage;