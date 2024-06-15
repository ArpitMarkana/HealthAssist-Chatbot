# Healthcare Chatbot

A healthcare chatbot designed to gather symptoms from users and provide potential diagnoses. If the user is not satisfied with the initial diagnosis, the bot will offer alternative diagnoses. This project leverages datasets and models from Hugging Face for accurate and reliable predictions.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Project](#running-the-project)
- [Data and Model](#data-and-model)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Prerequisites

Ensure you have the following software installed on your machine:

- Python (version 3.10.0)
- Java (version 17.0.2)
- Node.js (version 18.14.2)
- npm (version 9.6.7)

## Installation

Follow these steps to set up the project on your local machine:

### Backend Setup

1. Navigate to the backend directory:
    ```bash
    cd backend
    ```

2. Install the required Python packages:
    ```bash
    pip3 install -r requirements.txt
    ```

### Frontend Setup

1. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2. Install the required Node.js packages:
    ```bash
    npm install
    ```

## Running the Project

1. Start the development server:
    ```bash
    npm run dev
    ```

2. Open your browser and go to:
    ```
    http://localhost:5173/
    ```

## Data and Model

This project utilizes the following datasets and model:

- **Datasets:**
  - [Symptom to Diagnosis Dataset by Gretel AI](https://huggingface.co/datasets/gretelai/symptom_to_diagnosis?row=2)
  - [Symptom to Diagnosis Dataset by Zabihin](https://huggingface.co/Zabihin/Symptom_to_Diagnosis?text=I%27ve+been+feeling+really+run+down+and+weak.+My+throat+is+sore+and+I%27ve+been+coughing+a+lot.+I%27ve+also+been+having+chills+and+a+fever)

- **Model:**
  - [Symptom to Diagnosis Prediction Model by Zabihin](https://huggingface.co/Zabihin/Symptom_to_Diagnosis?text=I%27ve+been+feeling+really+run+down+and+weak.+My+throat+is+sore+and+I%27ve+been+coughing+a+lot.+I%27ve+also+been+having+chills+and+a+fever)

The chatbot uses these resources to analyze the symptoms input by the user and provide accurate diagnoses based on the data and predictive model.

## Contributing

If you wish to contribute to the project, please fork the repository and create a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For further information or questions, feel free to contact the project team at [your_email@example.com].
