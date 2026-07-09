export interface SampleDataset {
  name: string;
  filename: string;
  rows: any[];
}

export const sampleDatasets: SampleDataset[] = [
  {
    name: "🏬 Retail Transactions & Performance",
    filename: "retail_sales_performance.csv",
    rows: [
      { Transaction_ID: "TX-1001", Product_Category: "Electronics", Item_Price: 1200, Units_Sold: 2, Purchase_Date: "2026-01-15", Payment_Method: "Credit Card", Customer_Gender: "Female", Satisfication_Rating: 5, Store_Location: "New York" },
      { Transaction_ID: "TX-1002", Product_Category: "Apparel", Item_Price: 45, Units_Sold: 4, Purchase_Date: "2026-01-18", Payment_Method: "PayPal", Customer_Gender: "Male", Satisfication_Rating: 4, Store_Location: "San Francisco" },
      { Transaction_ID: "TX-1003", Product_Category: "Electronics", Item_Price: 850, Units_Sold: 1, Purchase_Date: "2026-02-02", Payment_Method: "Credit Card", Customer_Gender: "Male", Satisfication_Rating: 3, Store_Location: "Boston" },
      { Transaction_ID: "TX-1004", Product_Category: "Home & Kitchen", Item_Price: 120, Units_Sold: 3, Purchase_Date: "2026-02-05", Payment_Method: "Debit Card", Customer_Gender: "Female", Satisfication_Rating: 5, Store_Location: "Chicago" },
      { Transaction_ID: "TX-1005", Product_Category: "Apparel", Item_Price: 65, Units_Sold: 2, Purchase_Date: "2026-02-12", Payment_Method: "Apple Pay", Customer_Gender: "Female", Satisfication_Rating: 4, Store_Location: "New York" },
      { Transaction_ID: "TX-1006", Product_Category: "Books", Item_Price: 20, Units_Sold: 10, Purchase_Date: "2026-02-19", Payment_Method: "PayPal", Customer_Gender: "Male", Satisfication_Rating: 5, Store_Location: "Seattle" },
      { Transaction_ID: "TX-1007", Product_Category: "Home & Kitchen", Item_Price: 310, Units_Sold: 1, Purchase_Date: "2026-03-01", Payment_Method: "Credit Card", Customer_Gender: "Female", Satisfication_Rating: 2, Store_Location: "Boston" },
      { Transaction_ID: "TX-1008", Product_Category: "Electronics", Item_Price: 1500, Units_Sold: 1, Purchase_Date: "2026-03-10", Payment_Method: "Debit Card", Customer_Gender: "Female", Satisfication_Rating: 5, Store_Location: "San Francisco" },
      { Transaction_ID: "TX-1009", Product_Category: "Apparel", Item_Price: 85, Units_Sold: 3, Purchase_Date: "2026-03-14", Payment_Method: "Apple Pay", Customer_Gender: "Male", Satisfication_Rating: 4, Store_Location: "Chicago" },
      { Transaction_ID: "TX-1010", Product_Category: "Books", Item_Price: 15, Units_Sold: 5, Purchase_Date: "2026-03-22", Payment_Method: "Credit Card", Customer_Gender: "Female", Satisfication_Rating: 4, Store_Location: "Seattle" },
      { Transaction_ID: "TX-1011", Product_Category: "Electronics", Item_Price: 95, Units_Sold: 8, Purchase_Date: "2026-04-01", Payment_Method: "PayPal", Customer_Gender: "Female", Satisfication_Rating: 4, Store_Location: "New York" },
      { Transaction_ID: "TX-1012", Product_Category: "Apparel", Item_Price: 320, Units_Sold: 1, Purchase_Date: "2026-04-05", Payment_Method: "Credit Card", Customer_Gender: "Male", Satisfication_Rating: 3, Store_Location: "Boston" },
      { Transaction_ID: "TX-1013", Product_Category: "Home & Kitchen", Item_Price: 150, Units_Sold: 2, Purchase_Date: "2026-04-12", Payment_Method: "Debit Card", Customer_Gender: "Male", Satisfication_Rating: 5, Store_Location: "Seattle" },
      { Transaction_ID: "TX-1014", Product_Category: "Books", Item_Price: 12, Units_Sold: 15, Purchase_Date: "2026-04-18", Payment_Method: "Apple Pay", Customer_Gender: "Female", Satisfication_Rating: 5, Store_Location: "Chicago" },
      { Transaction_ID: "TX-1015", Product_Category: "Electronics", Item_Price: 2200, Units_Sold: 1, Purchase_Date: "2026-04-25", Payment_Method: "Credit Card", Customer_Gender: "Male", Satisfication_Rating: 1, Store_Location: "San Francisco" } // Outlier Price
    ]
  },
  {
    name: "🏥 Clinical Healthcare Admissions",
    filename: "healthcare_patient_logs.xlsx",
    rows: [
      { Patient_ID: "PT-501", Age: 42, Diagnosis: "Influenza", Admission_Date: "2026-03-01", Readmitted: "No", Insurance_Provider: "Blue Cross", Bill_Amount: 1200, Treatment_Satisfaction: 4, Ward_Type: "General" },
      { Patient_ID: "PT-502", Age: 68, Diagnosis: "Cardiovascular Disease", Admission_Date: "2026-03-04", Readmitted: "Yes", Insurance_Provider: "Medicare", Bill_Amount: 18500, Treatment_Satisfaction: 5, Ward_Type: "ICU" },
      { Patient_ID: "PT-503", Age: 25, Diagnosis: "Appendicitis", Admission_Date: "2026-03-08", Readmitted: "No", Insurance_Provider: "Aetna", Bill_Amount: 9500, Treatment_Satisfaction: 3, Ward_Type: "Surgical" },
      { Patient_ID: "PT-504", Age: 55, Diagnosis: "Diabetes Mellitus", Admission_Date: "2026-03-12", Readmitted: "Yes", Insurance_Provider: "Medicare", Bill_Amount: 4300, Treatment_Satisfaction: 4, Ward_Type: "General" },
      { Patient_ID: "PT-505", Age: 71, Diagnosis: "Pneumonia", Admission_Date: "2026-03-15", Readmitted: "No", Insurance_Provider: "Blue Cross", Bill_Amount: 12500, Treatment_Satisfaction: 5, Ward_Type: "General" },
      { Patient_ID: "PT-506", Age: 19, Diagnosis: "Sports Injury", Admission_Date: "2026-03-19", Readmitted: "No", Insurance_Provider: "Aetna", Bill_Amount: 2200, Treatment_Satisfaction: 2, Ward_Type: "Outpatient" },
      { Patient_ID: "PT-507", Age: 61, Diagnosis: "Cardiovascular Disease", Admission_Date: "2026-03-22", Readmitted: "No", Insurance_Provider: "UnitedHealth", Bill_Amount: 25000, Treatment_Satisfaction: 4, Ward_Type: "ICU" },
      { Patient_ID: "PT-508", Age: 34, Diagnosis: "Gastroenteritis", Admission_Date: "2026-03-25", Readmitted: "No", Insurance_Provider: "Blue Cross", Bill_Amount: 3100, Treatment_Satisfaction: 4, Ward_Type: "General" },
      { Patient_ID: "PT-509", Age: 48, Diagnosis: "Diabetes Mellitus", Admission_Date: "2026-03-28", Readmitted: "No", Insurance_Provider: "UnitedHealth", Bill_Amount: 5100, Treatment_Satisfaction: 1, Ward_Type: "General" },
      { Patient_ID: "PT-510", Age: 82, Diagnosis: "Pneumonia", Admission_Date: "2026-04-01", Readmitted: "Yes", Insurance_Provider: "Medicare", Bill_Amount: 34000, Treatment_Satisfaction: 5, Ward_Type: "ICU" }, // Outlier Bill
      { Patient_ID: "PT-511", Age: 29, Diagnosis: "Influenza", Admission_Date: "2026-04-05", Readmitted: "No", Insurance_Provider: "Aetna", Bill_Amount: 1100, Treatment_Satisfaction: 4, Ward_Type: "Outpatient" },
      { Patient_ID: "PT-512", Age: 50, Diagnosis: "Appendicitis", Admission_Date: "2026-04-10", Readmitted: "No", Insurance_Provider: "Blue Cross", Bill_Amount: 11200, Treatment_Satisfaction: 3, Ward_Type: "Surgical" },
      { Patient_ID: "PT-513", Age: 64, Diagnosis: "Cardiovascular Disease", Admission_Date: "2026-04-15", Readmitted: "Yes", Insurance_Provider: "Aetna", Bill_Amount: 22000, Treatment_Satisfaction: 5, Ward_Type: "ICU" },
      { Patient_ID: "PT-514", Age: 37, Diagnosis: "Gastroenteritis", Admission_Date: "2026-04-19", Readmitted: "No", Insurance_Provider: "UnitedHealth", Bill_Amount: 2800, Treatment_Satisfaction: 5, Ward_Type: "General" }
    ]
  },
  {
    name: "🏦 Banking Loan Risk Matrix",
    filename: "banking_loan_audit.csv",
    rows: [
      { Account_No: "ACC-902", Age: 45, Income_USD: 115000, Credit_Score: 780, Loan_Amount: 80000, Loan_Purpose: "Mortgage", Default_History: "No", Debt_To_Income: 0.18, Approved: "Yes" },
      { Account_No: "ACC-903", Age: 28, Income_USD: 45000, Credit_Score: 590, Loan_Amount: 15000, Loan_Purpose: "Personal", Default_History: "Yes", Debt_To_Income: 0.35, Approved: "No" },
      { Account_No: "ACC-904", Age: 35, Income_USD: 72000, Credit_Score: 680, Loan_Amount: 32000, Loan_Purpose: "Car Loan", Default_History: "No", Debt_To_Income: 0.22, Approved: "Yes" },
      { Account_No: "ACC-905", Age: 52, Income_USD: 130000, Credit_Score: 810, Loan_Amount: 150000, Loan_Purpose: "Mortgage", Default_History: "No", Debt_To_Income: 0.15, Approved: "Yes" },
      { Account_No: "ACC-906", Age: 31, Income_USD: 52000, Credit_Score: 610, Loan_Amount: 8000, Loan_Purpose: "Personal", Default_History: "No", Debt_To_Income: 0.28, Approved: "Yes" },
      { Account_No: "ACC-907", Age: 61, Income_USD: 95000, Credit_Score: 750, Loan_Amount: 50000, Loan_Purpose: "Education", Default_History: "No", Debt_To_Income: 0.12, Approved: "Yes" },
      { Account_No: "ACC-908", Age: 41, Income_USD: 31000, Credit_Score: 540, Loan_Amount: 22000, Loan_Purpose: "Personal", Default_History: "Yes", Debt_To_Income: 0.45, Approved: "No" },
      { Account_No: "ACC-909", Age: 24, Income_USD: 38000, Credit_Score: 650, Loan_Amount: 12000, Loan_Purpose: "Car Loan", Default_History: "No", Debt_To_Income: 0.19, Approved: "Yes" },
      { Account_No: "ACC-910", Age: 49, Income_USD: 165000, Credit_Score: 790, Loan_Amount: 450000, Loan_Purpose: "Mortgage", Default_History: "No", Debt_To_Income: 0.29, Approved: "Yes" }, // High Debt-to-Income / Outlier Amount
      { Account_No: "ACC-911", Age: 38, Income_USD: 83000, Credit_Score: 720, Loan_Amount: 40000, Loan_Purpose: "Education", Default_History: "No", Debt_To_Income: 0.25, Approved: "Yes" },
      { Account_No: "ACC-912", Age: 57, Income_USD: 105000, Credit_Score: 820, Loan_Amount: 60000, Loan_Purpose: "Mortgage", Default_History: "No", Debt_To_Income: 0.11, Approved: "Yes" },
      { Account_No: "ACC-913", Age: 33, Income_USD: 49000, Credit_Score: 580, Loan_Amount: 18000, Loan_Purpose: "Personal", Default_History: "No", Debt_To_Income: 0.38, Approved: "No" },
      { Account_No: "ACC-914", Age: 43, Income_USD: 78000, Credit_Score: 710, Loan_Amount: 25000, Loan_Purpose: "Car Loan", Default_History: "No", Debt_To_Income: 0.20, Approved: "Yes" },
      { Account_No: "ACC-915", Age: 26, Income_USD: 120000, Credit_Score: 740, Loan_Amount: 35000, Loan_Purpose: "Personal", Default_History: "No", Debt_To_Income: 0.08, Approved: "Yes" }
    ]
  }
];
