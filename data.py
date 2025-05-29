# from pymongo import MongoClient
# import pandas as pd

# client = MongoClient("mongodb+srv://sadhvinipagidimarri99:sadhvini99@attendancecluster.m5bdxun.mongodb.net/?retryWrites=true&w=majority&appName=AttendanceCluster")
# db = client["test"]
# collection = db["users"]

# excel_file = "student.xlsx"
# xls = pd.ExcelFile(excel_file)

# students = []

# for sheet_name in xls.sheet_names:
#     if sheet_name.strip().upper() == "KR23 CSE":
#         continue  # skip this sheet

#     df = xls.parse(sheet_name)
#     df.columns = df.columns.str.strip()

#     print("Sheet:", sheet_name)
#     print("Columns:", df.columns)

#     for index, row in df.iterrows():
#         if pd.isna(row.get("HTNO")):
#             continue

#         student = {
#             "username": row.get("HTNO"),
#             "name": row.get("Student Name"),
#             "originalSection": row.get("ORIGINAL SECTION", "N/A"),  # default if missing
#             "operationalSection": row.get("OPERATIONAL SECTION", "N/A"),
#             "password": "Kmit123$",
#             "role": "student"
#         }
#         students.append(student)

# if students:
#     collection.insert_many(students)
#     print(f"{len(students)} students inserted successfully!")
# else:
#     print("No students found to insert.")


from pymongo import MongoClient

# Replace with your MongoDB Atlas connection string
uri = "mongodb+srv://sadhvinipagidimarri99:sadhvini99@attendancecluster.m5bdxun.mongodb.net/?retryWrites=true&w=majority&appName=AttendanceCluster"

# Connect to the client
client = MongoClient(uri)

# Access the database and collection
db = client["test"]  # Database name
collection = db["users"]  # Collection name

# Query for documents where role is "admin"
admins = collection.find({ "role": "student" })

# Print results
for admin in admins:
    print(admin)



