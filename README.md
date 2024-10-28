A real-time comments system that allows users to log in with a username, post comments, and see new comments appear in real-time. Built with Next.js and Material UI for the front end and Node.js, MySQL, and Socket.IO for the back end.

Features
User Authentication: Simple login with a username (no password required).
Real-Time Comments: View and add comments that updates in real-time.
Responsive UI: Built with Material UI to ensure a mobile-friendly and responsive interface.
Persistent Storage: Comments are stored in a MySQL database with timestamped entries.
Project Structure
The project consists of two main directories:

Client: Front-end built with Next.js and Material UI, with Axios used for API requests.
Server: Back-end built with Node.js and MySQL, using Socket.IO for real-time updates.
Requirements:
Node.js
MySQL
npm
Setup Instructions
1. Clone the Repository

git clone <repository-url>
cd <repository-folder>

2. Database Setup:

Open MySQL and create a new database named comments_db.
Create the comments table using the following SQL command:

sql
Copy code
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    comment TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
3. Server Setup
Navigate to the server directory:

cd server
Install server dependencies:
npm install express mysql2 socket.io axios nodemon
Configure your MySQL connection in server.js:

const db = mysql.createConnection({
    host: 'localhost',
    user: 'YOUR_MYSQL_USERNAME',   // Replace with your MySQL username
    password: 'YOUR_MYSQL_PASSWORD', // Replace with your MySQL password
    database: 'comments_db'
});
Implement the basic routes:
'/api/login' this will only take username and return the session Id
app.get('/api/comments)  for fetching comments
app.post('/api/comments) for adding new comments

Socket.IO setup:
io.on(connection) this listens for new clients connecting to the server

Start the server:
npm start
The server should start at http://localhost:3001.

4. Client Setup (Front-End)
Navigate to the client directory:

cd ../client
npx create-next-app client: this creates a next js app
Install client dependencies:


npm install axios socket.io-client
npm i @mui/material for styling

Create Ccomments.js:
This React component implements user login and comment posting capabilities, styled with Material UI.

State Variables: username stores the logged-in username, comment holds the user's input for the comment, comments stores a list of all comments, and sessionId tracks the login session

Socket connects to the server at http://localhost:3001 for real-time updates.
useEffect Hook

interactive UI with real-time updates.
Build the project:

npm run build
Start the client:

npm start
The client will run on http://localhost:3000.

When a user posts a comment, Socket.IO broadcasts the new comment to all connected clients, enabling real-time updates without page refresh.

Technologies Used
Front-End: Next.js, Material UI, Axios
Back-End: Node.js, Express, Socket.IO
Database: MySQL
Project Assumptions
Username-based authentication with session ID only, no password validation.
MySQL server is hosted locally at localhost:3306.
License
This project is open-source and available under the MIT License.