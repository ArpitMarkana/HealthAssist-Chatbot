# WellnessWatch
### Problem Statement

The objective of this project is to develop a Smart Healthcare Recommendation System using advanced machine learning techniques to address the challenges in healthcare service delivery. The primary challenge is to leverage AI technologies to analyze user symptoms and recommend appropriate doctors based on specialty and availability. This system aims to streamline healthcare processes, improve patient outcomes, and enhance overall healthcare service efficiency.

### Solution

The Smart Healthcare Recommendation System employs machine learning models and modern web technologies to achieve its objectives:

- **Machine Learning Model**: Utilize PySpark and deep learning techniques to develop a recommendation engine capable of analyzing user symptoms and suggesting suitable doctors.
  
- **Backend Development**: Implement a Flask-based REST API to serve predictions from the machine learning model and manage system functionalities.

- **Frontend Design**: Develop a user-friendly React-based frontend to allow patients to input symptoms, receive personalized disease recommendations, and book appointments with suitable doctors.
 

### Technologies Used

The Smart Healthcare Recommendation System leverages the following technologies:

- **Machine Learning**: PySpark, TensorFlow, or PyTorch for developing and fine-tuning machine learning models.

- **Backend**: Flask for building the RESTful API to serve predictions and manage backend functionalities.

- **Frontend**: React for creating an intuitive and interactive user interface for patients and doctors.
  
 
 # To Run This Project:-
 # Use a base image with Node.js installed
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the Node.js application files to the container
COPY package*.json /.
# Add other necessary files if required

# Install dependencies
RUN npm install

# Expose the port on which the Node.js app runs

COPY . .

EXPOSE 3000

# Define the command to run your Node.js app
CMD ["npm", "start"]
# REQUIREMENTS
# pip install -r requirements.txt
pyspark===3.5.0
flask===2.0.2
findspark===2.0.1
numpy===1.26.0
Werkzeug==2.2.2
pandas===2.1.4

# Phase 1

- [x] Building and setting up a Machine Learning model.

- [x] Testing the model

# Phase 2

- [x] Building Rest API using Flask

- [ ] Planning Website and Database Structure

# Phase 3

- [ ] Building Frontend using React

- [ ] Integrating with model

- [ ] Getting Patients and Doctors Side ready

# Phase 4

- [ ] Building appointment system

- [ ] Testing with real users


# Website Plan

# User Side:

- Homepage:

Welcome message

Overview of the Smart Healthcare Recommendation System

Option to enter symptoms for disease recommendations

Navigation to other pages

- Disease Recommendations Page:

Input form for symptoms

Display of recommended diseases based on ALS model

Option to view details about each recommended disease

- Appointment Booking Page:

Calendar for selecting date and time

List of available doctors

Form for entering additional details (if any)

Button to submit the appointment request

- User Profile Page:

User information

History of booked appointments

Option to edit profile details

- Appointment Confirmation Page:

Confirmation message

Details of the booked appointment

Option to cancel the appointment

# Doctor Side:

- Doctor Dashboard:

Overview of appointments for the day/week

Option to view patient details and appointment information

- Appointment Management Page:

List of upcoming appointments

Ability to mark appointments as attended, rescheduled, or canceled

Calendar view of availability

- Patient Details Page:

Information about the patient

Details of past appointments

Option to update patient records

- Availability Management Page:

Calendar for setting availability

Ability to block out time slots when the doctor is not available

Option to update general availability settings

- Doctor Profile Page:

Personal and professional information

Option to update profile details

- Notifications Page(If time permits):

Receive notifications for new appointment requests

Alerts for any changes in the schedule

# Shared Pages:

- Login/Registration Page:

Secure user and doctor login/registration forms

- About Us/Contact Page:

Information about the Smart Healthcare Recommendation System

Contact details for support or inquiries