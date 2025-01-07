# Multi-Election Voting App

## Overview

The Multi-Election Voting App is a seamless, user-friendly platform designed to manage and participate in elections. It allows users to register as voters, vote in elections, and view results. Admin users have extended capabilities to manage elections, voters, and candidates. The application supports multiple elections, ensuring that users can only vote once per election but participate in multiple ongoing elections. The app also features dark mode and light mode for enhanced usability.

---

## Features

### For Voters

- **User Registration and Login:**
  - Users can register and log in with a unified interface.
- **Participate in Elections:**
  - Vote in an election only once.
  - Participate in multiple ongoing elections if not already voted.
- **User-Friendly Design:**
  - Responsive interface with dark and light mode options.

### For Admins

- **Admin Authentication:**
  - Admin access is determined via backend authentication.
- **Election Management:**
  - Add, update, and delete elections.
- **Voter Management:**
  - Register, update, and delete voter accounts.
- **Candidate Management:**
  - Add, update, and delete candidates for elections.

---

## Technologies Used

### Frontend

- **React.js:** For building a responsive and dynamic user interface.
- **Redux:** State management for application-wide data.
- **React Router:** Navigation and routing.

### Backend

- **Node.js & Express.js:** Server-side logic and API handling.
- **MongoDB:** Database to store user, election, and voting data.

### Authentication & Security

- **JWT (JSON Web Tokens):** Secure user authentication.
- **bcrypt.js:** Password hashing for enhanced security.

### Additional Tools

- **Cloudinary:** Image hosting for candidate and election assets.
- **Framer Motion:** Smooth animations for a better user experience.

---

## Installation

### Prerequisites

- Node.js
- MongoDB
- Cloudinary account (for image uploads)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/multi-election-app.git
   cd multi-election-app
   ```

2. Install dependencies for both the client and server:

   ```bash
   cd client
   npm install

   cd ../server
   npm install
   ```

3. Configure environment variables:

   - Create a `.env` file in the `server` directory with the following:
     ```env
     MONGO_URI=your_mongo_db_connection_string
     JWT_SECRET=your_jwt_secret
     CLOUDINARY_CLOUD_NAME=your_cloudinary_name
     CLOUDINARY_API_KEY=your_cloudinary_api_key
     CLOUDINARY_API_SECRET=your_cloudinary_api_secret
     ```

4. Start the application:

   - For the client:
     ```bash
     cd client
     npm start
     ```
   - For the server:
     ```bash
     cd server
     npm run dev
     ```

5. Access the application at `http://localhost:3000`.

---

## Usage

1. **Register as a Voter:**
   - Fill out the registration form to create an account.
2. **Login:**
   - Use the login form to access the platform.
3. **Vote:**
   - Browse available elections and cast your vote.
4. **Admin Actions:**
   - Log in with admin credentials to manage elections, voters, and candidates.

---

## Folder Structure

```
root
├── client/          # React frontend
├── server/          # Express backend
├── .env             # Environment variables
├── README.md        # Project documentation
```

---

## Key Functionalities

### Authentication

- The backend handles authentication using JWT tokens.
- Passwords are hashed using bcrypt.js to ensure security.

### Election Logic

- A user can only vote once per election.
- Admins have the authority to manage all election data, ensuring transparency and proper monitoring.

---

## Future Enhancements

- Implement real-time voting results.
- Add email notifications for users after registration or voting.
- Introduce multi-language support for a broader audience.

---

## Contributions

Feel free to fork the repository and create a pull request to suggest improvements or new features.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Acknowledgements

Special thanks to the developers and the open-source community for the libraries and tools used in this project.

### Mentor Acknowledgement

- A big thank you to Egator for their mentorship and guidance throughout the development of this project.

