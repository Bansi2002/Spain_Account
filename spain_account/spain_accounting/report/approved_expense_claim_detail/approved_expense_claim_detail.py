# Copyright (c) 2025, info@xappiens.com and contributors
# For license information, please see license.txt

import frappe

def execute(filters=None):
    if not filters:
        filters = {}

    conditions = "ec.docstatus = 1"  
    
    if filters.get("company"):
        conditions += f" AND ec.company = '{filters.get('company')}'"
    
    if filters.get("from_date") and filters.get("to_date"):
        conditions += f" AND ec.posting_date BETWEEN '{filters.get('from_date')}' AND '{filters.get('to_date')}'"

    if filters.get("employee"):
        conditions += f" AND ec.employee = '{filters.get('employee')}'"

    query = f"""
        SELECT 
            emp.employee_name AS "Employee Full Name:Data",
            emp.custom_dninie AS "DNI/NIE:Data",
            SUM(CASE WHEN ect.expense_type = 'Dleta' THEN ect.amount ELSE 0 END) AS "Dleta:Currency",
            SUM(CASE WHEN ect.expense_type = 'Kilometraje' THEN ect.amount ELSE 0 END) AS "Kilometraje:Currency",
            SUM(ect.amount) AS "Total:Currency"
        FROM `tabExpense Claim` ec
        JOIN `tabExpense Claim Detail` ect ON ec.name = ect.parent
        JOIN `tabEmployee` emp ON ec.employee = emp.name
        WHERE {conditions}
        GROUP BY ec.employee
    """

    data = frappe.db.sql(query, as_list=True)

    columns = [
        {"label": "Employee Full Name", "fieldname": "employee_full_name", "fieldtype": "Data", "width": 200},
        {"label": "DNI/NIE", "fieldname": "dni_no", "fieldtype": "Data", "width": 120},
        {"label": "Dleta", "fieldname": "dleta", "fieldtype": "Currency", "width": 120},
        {"label": "Kilometraje", "fieldname": "kilometraje", "fieldtype": "Currency", "width": 120},
        {"label": "Total", "fieldname": "total", "fieldtype": "Currency", "width": 120},
    ]

    return columns, data
