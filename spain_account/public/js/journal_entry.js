// TRIGGER WHEN 'ACCOUNT' FIELD IS MODIFIED IN THE 'JOURNAL ENTRY ACCOUNT' CHILD TABLE
frappe.ui.form.on("Journal Entry Account", {
    account(frm, cdt, cdn) {
        // GET THE CURRENT ROW DATA
        var row = locals[cdt][cdn];

        // CHECK IF AN ACCOUNT IS SELECTED
        if (row.account) {
            // FETCH AND SET THE ACCOUNT BALANCE IF ACCOUNT IS SELECTED
            set_account_balance(frm, row);
        } else {
            // CLEAR 'CUSTOM_ACCOUNT_BALANCE' FIELD IF NO ACCOUNT IS SELECTED
            frappe.model.set_value(cdt, cdn, "custom_account_balance", null);
        }
    },
});

// FUNCTION TO FETCH AND SET THE ACCOUNT BALANCE
function set_account_balance(frm, row) {
    // MAKE SERVER-SIDE CALL TO FETCH THE ACCOUNT BALANCE FOR THE SELECTED ACCOUNT
    frappe.call({
        method: "erpnext.accounts.utils.get_balance_on",
        args: {
            account: row.account,
            company: frm.doc.company,
        },
        callback: function (r) {
            // CHECK IF A BALANCE IS RETURNED
            if (r.message) {
                // SET THE 'CUSTOM_ACCOUNT_BALANCE' FIELD WITH THE RETURNED BALANCE
                frappe.model.set_value(
                    row.doctype,
                    row.name,
                    "custom_account_balance",
                    r.message
                );
            } else {
                // SET 'CUSTOM_ACCOUNT_BALANCE' FIELD WITH 0 IF NO BALANCE IS RETURNED
                frappe.model.set_value(
                    row.doctype,
                    row.name,
                    "custom_account_balance",
                    0
                );
            }
        },
        error: function (err) {
            // HANDLE ERROR
            frappe.msgprint(__("Failed to fetch account balance: ") + err);
        },
    });
}
