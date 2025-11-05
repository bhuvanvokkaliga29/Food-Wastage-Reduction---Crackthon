# ♻️ Food Wastage Reduction & Donation System 🍱

> **Connecting Food Donors (Hotels, Events, Caterers) → NGOs, Shelters & Needy People**
>  
> 🌍 *A smart platform to reduce food wastage and fight hunger — powered by transparency, simplicity, and trust.*

---
my previous works: Linkdin:https://www.linkedin.com/in/bhuvan-gowda-h-k-4ba8b5318
GitHub 
## 🌟 Project Overview

The **Food Wastage Reduction App** bridges the gap between **food donors** and **receivers (NGOs, old-age homes, orphanages, etc.)**.  
It enables hotels, canteens, marriage halls, colleges, and companies to **donate surplus food** in real-time with verified data, ensuring zero waste and maximum impact.

---

## 🎯 Problem Statement

Every day, tons of food from hotels, events, and messes go to waste while thousands go hungry.  
Our system creates a **transparent, easy-to-use donation platform** where verified donors can list available food and NGOs or individuals can claim it instantly — reducing waste and feeding the needy.

---
📷 **Screenshots Folder:** `/demo/`📷 **Screenshots Folder:** `/demo/`
![WhatsApp Image 2025-11-05 at 13 50 55_e21c0592](https://github.com/user-attachments/assets/70c682d5-10eb-4f6d-a1cd-68f525fe0330)
![WhatsApp Image 2025-11-05 at 13 50 55_886e61fe](https://github.com/user-attachments/assets/d4269730-74b8-4da6-b4ca-e64fcb5ffeae)
![WhatsApp Image 2025-11-05 at 13 50 54_4b38c881](https://github.com/user-attachments/assets/dc3c762e-346f-48cc-92de-128868f66e8f)
![WhatsApp Image 2025-11-05 at 13 55 05_0f5feaad](https://github.com/user-attachments/assets/96b50363-dda4-4f81-b366-579d41dffdd3)
<img width="1515" height="766" alt="Screenshot 2025-11-05 140342" src="https://github.com/user-attachments/assets/8e767f88-82d8-4db2-9622-5e76e51d53c2" />
<img width="1415" height="585" alt="Screenshot 2025-11-05 140354" src="https://github.com/user-attachments/assets/8d22e1e2-46c9-444a-8f1d-bcc66095f2ae" />





## 💡 Key Features

### 🧑‍🍳 Donor Side
- Donor signup with **OTP verification (demo auto-login enabled)**  
- Add donor type: `Hotel / Canteen / Marriage Hall / Company / Event / College Function`
- Upload available food details (with photo, quantity, expiry time)
- Auto-update “Food Sold” status once receiver books
- Donor profile with:
  - Name, Contact, Type, Years of Service
  - Upload History & Rewards Dashboard
  - Unique Donor ID Card (Auto-generated)
  - View previous donations and impact count

### 🏡 Receiver Side
- Receiver signup with **auto-login (any demo credentials)**
- Dashboard displaying **100+ available donations** (mock data generated)
- View donor details (Name, Contact, Address, Timing)
- Book donations via:
  - 📞 **Direct call**
  - 💬 **WhatsApp Connect**
  - 🚚 **Partner Integration (Swiggy, Zomato, Porter)**
- Real-time updates: “Available / Sold”
- Receiver profile with unique ID card and booking history

### 🏛️ Government & NGO Tie-ups
- Pre-added verified NGOs like:
  - Akshaya Patra Foundation
  - Robin Hood Army
  - Uday Foundation
  - Vruddha Ashrams & Orphanages
- Integrated with government schemes for hunger reduction
- Transparent tracking of donations for public welfare records

### 🧾 Mock Data Included
- 100+ donor listings near **AMC College, Rajankunte, Bengaluru**
- Example Donors:
  - *Hotel Green Leaf*, Rajankunte
  - *AMC College Canteen*
  - *Sri Lakshmi Marriage Hall*
  - *Taj Foods Pvt Ltd (Corporate Mess)*
  - *Biryani House, Yelahanka*
- Example Receivers:
  - *Akshaya Patra Yelahanka*
  - *Hope NGO Rajankunte*
  - *Old Age Home Bengaluru North*
  - *Street Food Volunteers – Malleswaram*

---

## 🧠 Workflow

### Donor Flow:
`Login/Register → Verify OTP → Upload Food Details → Confirm Availability → Mark as Sold (After Booking)`

### Receiver Flow:
`Login → View Nearby Donations → Contact or Book via Call/WhatsApp → Confirm Pickup → Mark as Received`

### System Flow:
`Data Stored in Database → Live Updates on Dashboard → Government/Ngo Access for Reports`

---

## 🧩 Tech Stack

| Layer | Tools Used |
|-------|-------------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mock Data + Bolt Auto Data Generation) |
| Location | Google Maps API |
| Authentication | OTP Demo Login (Auto-success for testing) |
| Mock Data | generated JSON (100+ donors/receivers) |
| Theme | Green & White (Eco-friendly) |
| Hosting | Render / Vercel (Demo) |



---

## 🧱 Database Structure (MongoDB)

### Collection: Donors
```json
{
  "id": "DNR001",
  "name": "Hotel Green Leaf",
  "type": "Hotel",
  "contact": "+91 9876543210",
  "email": "greenleaf@gmail.com",
  "yearsOfService": 5,
  "address": "Bengaluru",
  "availableFood": {
    "item": "Veg Fried Rice",
    "quantity": "25 plates",
    "expiryTime": "3 hours",
    "photo": "food1.jpg",
    "status": "Available"
  }
}
Collection: Receivers
json
Copy code
{
  "id": "RCV101",
  "name": "Akshaya Patra Foundation",
  "contact": "+91 9988776655",
  "address": "Yelahanka, Bengaluru",
  "bookings": [
    {
      "donorId": "DNR001",
      "status": "Booked",
      "pickupTime": "5:30 PM"
    }
  ]
}
📊 Impact Goals
✅ Reduce daily food waste from events & hotels
✅ Feed thousands through local NGO tie-ups
✅ Promote eco-friendly practices
✅ Create transparent food-sharing network

