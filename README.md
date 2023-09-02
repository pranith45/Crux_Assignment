# Crux_Assignment
## Overview
### Front-End
1. Simple single page application where you can find two entries,
   - one, to enter the sheets url and import the data into postgresql database.
   - other, to enter the user query to generate the corresponding sql query and the data from database. (press enter after entering user query)
2. Visualisation section where the retrived data gets displayed.
### Back-End
Majorly consists of two api's 
- /google-sheets-to-db/ : This api's work is to store the data in url into the postgresql database([Sheet link](https://docs.google.com/spreadsheets/d/1Mx8fo5G7CI3NDoxo8jd_RDWMNQ3FtNaUdL3IfNUYxm8/edit?usp=sharing)).
- /chat-interface/ : This api's work is to get the sql query for the user queries.
## Technologies used
1. Front-End -> React
2. Back-End -> Django
3. Database -> Postgresql

## How to run the assignment locally
- Firstly create a local database in postgresql through pgadmin.
- Clone the repository using git clone in your local machine ([Repo link](https://github.com/pranith45/Crux_Assignment.git))
- Now make changes in settings.py file(backend/cruxbackend/settings.py), with the created database above. Corresponding database details can be found in pgadmin.
- Navigate to the backend folder from the root folder and run `python manage.py runserver`, this will start your backend server locally on port number 8000.
- Navigate to the frontend folder from the root folder and run `npm start`, this will start your front end server locally on port number 3000.
