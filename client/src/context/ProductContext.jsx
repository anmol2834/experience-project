

import React, { createContext } from 'react'

export const context_of_product = createContext();

function ProductContext({children}) {

    const productInfo = [
        {
            "provider_Name": "anmol",
            "company_Name": "cheldain",
            "title": "scuba diving",
            "state": "Gujarat",
            "city": "Surat",
            "mrp": 1200,
            "price": 799,
            "rating": 3.5,
            "description": "Dive into an unforgettable underwater adventure! Experience the thrill of scuba diving as you explore vibrant marine life, stunning coral reefs, and the hidden wonders of the ocean. Safe, exciting, and perfect for all skill levels—book your dive today!",
            "stock": 30,
            "experience_img": "https://tse2.mm.bing.net/th?id=OIP.ZaNZG3FYwCR7zNPBK40ZXwHaE8&pid=Api&P=0&h=220"
        },
        {
            "provider_Name": "ravi",
            "company_Name": "SkyHigh Adventures",
            "title": "Paragliding",
            "state": "Himachal Pradesh",
            "city": "Bir Billing",
            "mrp": 3500,
            "price": 2499,
            "rating": 4,
            "description": "Soar high above the beautiful landscapes of Himachal Pradesh! Experience the thrill of paragliding with experienced pilots and enjoy breathtaking views. Book your flight now for an unforgettable adventure!",
            "stock": 20,
            "experience_img": "https://pickyourtrail.com/blog/wp-content/uploads/2021/07/sebastian-mittermeier-pagkGsPGds4-unsplash.jpg"
        },
        {
            "provider_Name": "priya",
            "company_Name": "Jungle Explorer",
            "title": "Jungle Safari",
            "state": "Madhya Pradesh",
            "city": "Kanha",
            "mrp": 2800,
            "price": 1999,
            "rating": 4.5,
            "description": "Embark on an exciting jungle safari and witness majestic tigers, elephants, and diverse wildlife in their natural habitat. Enjoy guided tours through the lush forests of Kanha National Park.",
            "stock": 15,
            "experience_img": "https://wildkasarwadi.com/assets/uploads/experiences/jungle_safari.jpg"
        },
        {
            "provider_Name": "rahul",
            "company_Name": "Extreme Thrills",
            "title": "Bungee Jumping",
            "state": "Goa",
            "city": "North Goa",
            "mrp": 4000,
            "price": 2999,
            "rating": 3,
            "description": "Take the leap of faith! Experience the ultimate adrenaline rush with bungee jumping from a towering height. Safe, thrilling, and an experience of a lifetime!",
            "stock": 10,
            "experience_img": "https://res.cloudinary.com/manawa/image/private/f_auto,c_limit,w_3840,q_auto/y5bpxssnrinkm3ho7k4j"
        },
        {
            "provider_Name": "sakshi",
            "company_Name": "Snowbound Treks",
            "title": "Himalayan Trekking",
            "state": "Uttarakhand",
            "city": "Mussoorie",
            "mrp": 5000,
            "price": 3499,
            "rating": 3.5,
            "description": "Conquer the majestic Himalayan trails! Join our expert-led trekking expeditions and experience breathtaking views, serene landscapes, and a sense of accomplishment.",
            "stock": 25,
            "experience_img": "https://images.livemint.com/img/2022/05/20/original/Big_Story_Himalayan_Treks_Nepal_1653055597386.jpg"
        },
        {
            "provider_Name": "amit",
            "company_Name": "Wild Rapids",
            "title": "White Water Rafting",
            "state": "Uttarakhand",
            "city": "Rishikesh",
            "mrp": 2500,
            "price": 1799,
            "rating": 4,
            "description": "Brace yourself for an electrifying ride through the rapids! Experience the thrill of white-water rafting in the scenic waters of Rishikesh.",
            "stock": 30,
            "experience_img": "https://tuktukdude.com/wp-content/uploads/2019/07/White-Water-Rafting-Sri-Lanka-1.jpg"
        },
        {
            "provider_Name": "neha",
            "company_Name": "SkyTouch Aviation",
            "title": "Hot Air Balloon Ride",
            "state": "Rajasthan",
            "city": "Jaipur",
            "mrp": 6000,
            "price": 4499,
            "rating": 4.5,
            "description": "Float gently over Jaipur’s stunning landscapes in a hot air balloon. Witness breathtaking sunrises and majestic forts from above!",
            "stock": 12,
            "experience_img": "https://www.newyorkupstate.com/resizer/yiT5rQMb77IwTwT6TOdWU4Xi92U=/1280x0/smart/cloudfront-us-east-1.images.arcpublishing.com/advancelocal/5RSPGAI72JBTHAUBTY2JXJJSDM.JPG"
        },
        {
            "provider_Name": "vikas",
            "company_Name": "SpeedTrack Racing",
            "title": "Go-Kart Racing",
            "state": "Maharashtra",
            "city": "Mumbai",
            "mrp": 1500,
            "price": 999,
            "rating": 5,
            "description": "Feel the need for speed! Enjoy an action-packed Go-Kart racing experience on professional tracks with top-tier safety.",
            "stock": 50,
            "experience_img": "https://c1.wallpaperflare.com/preview/552/491/721/go-kart-karting-race-racing.jpg"
        },
        {
            "provider_Name": "tina",
            "company_Name": "DiveDeep Explorers",
            "title": "Shark Cage Diving",
            "state": "Andaman and Nicobar",
            "city": "Port Blair",
            "mrp": 8000,
            "price": 5999,
            "rating": 3,
            "description": "Face your fears and come face-to-face with magnificent sharks in a safe and controlled environment. An adventure like no other!",
            "stock": 8,
            "experience_img": "https://www.diveworldwide.com/images/categories/latin_america_mexico_great_white_shark_cage_diving_category.jpg"
        },
        {
            "provider_Name": "deepak",
            "company_Name": "CaveQuest Adventures",
            "title": "Cave Exploration",
            "state": "Meghalaya",
            "city": "Cherrapunji",
            "mrp": 3200,
            "price": 2499,
            "rating": 2.5,
            "description": "Venture into the mysterious underground world of Meghalaya’s caves. Witness stunning rock formations and hidden waterfalls on this thrilling expedition!",
            "stock": 15,
            "experience_img": "https://hotelarenalspring.com/wp-content/uploads/2022/08/Venado_Cave_Trip-1024x683.jpg"
        },
        {
            "provider_Name": "sandeep",
            "company_Name": "AeroX",
            "title": "Skydiving",
            "state": "Karnataka",
            "city": "Mysore",
            "mrp": 20000,
            "price": 14999,
            "rating": 5,
            "description": "Take the ultimate plunge from 10,000 feet! Experience the unmatched thrill of freefalling with expert instructors.",
            "stock": 5,
            "experience_img": "https://snowscene.com.au/wp-content/uploads/2020/06/experience-co-nz-skydive-queenstown-2-scaled.jpg"
        }
    ]

  return (
    <context_of_product.Provider value={productInfo}>
        {children}
    </context_of_product.Provider>
  )
}

export default ProductContext
