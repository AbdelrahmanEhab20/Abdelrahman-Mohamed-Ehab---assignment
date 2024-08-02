# OCR ID Card Reader

This is a small React and Node.js application that uses OCR (Optical Character Recognition) to read and extract important information from ID cards. The extracted data is displayed in a form on the web page.

## Features

- Upload an image of an ID card.
- Extract key information such as Name, ID, Grade/Year, Date of Birth, Issued On, Address, and Expire Date.
- Display extracted data in read-only form fields.
- Handle errors when no image is selected or when the upload fails.
- Loader to indicate processing state.

## Technologies Used

- **Frontend**: React, Axios, CSS
- **Backend**: Node.js, Express, Tesseract.js, Multer, Cors

## Setup and Installation

### Prerequisites

- Node.js and npm installed
- Git installed

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   
2. Install backend dependenciesand Running :
cd backend
npm install
npm run dev

4. Install frontend dependencies and Running :
cd frontend
npm install
npm start
