// Copyright (c) 2025, info@xappiens.com and contributors
// For license information, please see license.txt

frappe.query_reports["Approved Expense Claim Detail"] = {
	"filters": [
        {
            fieldname: "company",
            label: __("Company"),
            fieldtype: "Link",
            options: "Company",
        },
        {
            fieldname: "from_date",
            label: __("From Date"),
            fieldtype: "Date",
            default: frappe.datetime.add_months(frappe.datetime.nowdate(), -1).slice(0, 8) + "21",
        },
        {
            fieldname: "to_date",
            label: __("To Date"),
            fieldtype: "Date",
            default: frappe.datetime.nowdate().slice(0, 8) + "21",
        },
        {
            fieldname: "employee",
            label: __("Employee"),
            fieldtype: "Link",
            options: "Employee",  
        },
    ]
};
