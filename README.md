## Project Objective  
The goal of this project was to develop a **scraper** that collects data from the **Google Play** platform and categorizes applications accordingly.  
This project serves as a **supporting tool** for an application classification project.  
The scraper was implemented using an [external scraper](https://github.com/facundoolano/google-play-scraper) written by **[facundoolano](https://github.com/facundoolano)**.  

---

## Functionality Description  
The **external scraper** used in this project has some limitations, the most significant being that retrieving applications from a specific category returns a **maximum of 200 results**.  
To bypass this limitation, additional **query parameters** are used.  

### 📡 Data Collection Process  
The scraper collects data **for each category** by:  
- Querying **multiple countries** from a predefined list  
- Retrieving data for **three different collections** per country:  
  - **TOP_PAID**  
  - **TOP_FREE**  
  - **TOP_GROSSING**  
- **Maximum number of retrieved applications per category:**  
  - **200 per collection**  
  - **200 × number of countries**  

In this implementation, the **maximum** number of applications collected is **149,400**, as it includes **249 country codes**.  

### 📂 Data Processing  
✔️ The scraper **first collects application IDs**, processing each category separately and storing the results in **category-specific files**.  
✔️ Once files for all categories are generated, a **final file** containing all application IDs is created.  
✔️ The final step generates a **CSV output file** with complete application details.  

⚠️ **Note:** The scraper can be executed with a **ratio parameter**, which generates a report comparing the proportion of **paid and free** applications for each category.  

---

## Data Scope  
Since this scraper was built for another project, it **only** collects the following details for each application:  

- **Number of installs**  
- **Score on Google Play**  
- **Number of score ratings**  
- **Number of reviews**  
- **Category**  
- **Free or paid status**  

---

## Running the Application  
The scraper can be executed in **two modes**:  

- 🚀 **Normal Mode** – retrieves only application data  
- 📊 **Ratio Mode** – retrieves application data and generates a **paid vs. free** report  

### Running in Normal Mode  
```bash
npm install
node app.js
```

### Running in Ratio Mode  
```bash
npm install
node app.js ratio
```
