import pandas as pd

# Load the Excel file
df = pd.read_excel('pdf_15sep.xlsx')

# Forward fill the 'Company' column
df['Company'] = df['Company'].ffill()

# Save the updated data back to Excel
df.to_excel('updated_file.xlsx', index=False)
