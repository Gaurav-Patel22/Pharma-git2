# Online Pharmacy Management System

## Project Description
The Online Pharmacy Management System is a web-based application that allows users to browse medicines, add products to a cart, and purchase medicines online.  
This system simplifies the process of ordering medicines from a pharmacy through a user-friendly interface.


## Features

- User Signup
- User Login Authentication
- View Medicines
- Add to Cart
- Online Shopping System
- Simple and Responsive Design

---

## Technologies Used

- HTML
- CSS
- JavaScript
- Node.js (Backend)
- MySQL Database
- Docker
- Jenkins (CI/CD)
- Git & GitHub
- AWS EC2 (Deployment)

---

## Project Structure

project-folder
│
├──public
│ └── index.html
│ └── login.html
│ └── signup.html
│ └── cart.html
│ └── style.css
│ └── script.js
│ └── cart.js
│ └── login.js
│ └── script.js
│ └── signup.js
│
├── server
│ └── server.js
│ └── db.js
│ └── package.json
│ └── package-lock.json
│
└── Dockerfile
└── README.md



---

## How to Run the Project

### Step 1: Clone the Repository
git clone 

### Step 2: Go to Project Folder
cd your-repository-name


### Step 3: Install Dependencies
npm install


### Step 4: Start the Server
node server.js


### Step 5: Open Website
Open in browser:
http://localhost:5000


## DevOps Pipeline

This project uses a CI/CD pipeline:

VS Code → GitHub → Jenkins → Docker → AWS EC2


Whenever code is pushed to GitHub:

1. Jenkins automatically triggers
2. Docker image is built
3. Application is deployed on AWS EC2


## Future Improvements

- Online Payment Integration
- Order Tracking System
- Admin Dashboard
- Medicine Stock Management


## Author

Gaurav Patel 


## License

This project is for educational and learning purposes.

