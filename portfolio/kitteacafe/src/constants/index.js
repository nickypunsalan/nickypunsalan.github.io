const VisitStatus = {
    STATUS_BOOKED: "Booked",
    STATUS_CANCELLED: "Cancelled",
    STATUS_ATTENDED: "Attended",
    STATUS_ALL: "All",
    STATUS_TODAY: "Today"
};

const SuccessTitle = {
    SUCC_BOOK_TITLE: "Visit created!"
}

const SuccessDescription = {
    SUCC_BOOK_DESC: "Visit will now appear in the visit list."
}

const ErrorCode = {
    ERR_BOOK: "ERR_BOOK",
    ERR_CANCEL: "ERR_CANCEL",
    ERR_ATTEND: "ERR_ATTEND",
    ERR_EDIT: "ERR_EDIT"
}

const ErrorTitle = {
    ERR_BOOK_TITLE: "Error booking a visit",
    ERR_CANCEL_TITLE: "Error cancelling a visit",
    ERR_ATTEND_TITLE: "Error attending a visit",
    ERR_EDIT_TITLE: "Error editing a visit"
}

const ErrorDescription = {
    ERR_BOOK_DESC: "Please review the information inputted in the form."
}

const WarningCode = {
    WARN_CANCEL: "Cancelling a visit",
    WARN_ATTEND: "Marking visit as attended"
}

export { VisitStatus, ErrorCode, ErrorDescription, ErrorTitle, SuccessTitle, SuccessDescription, WarningCode };