const VisitStatus = {
    STATUS_BOOKED: "Booked",
    STATUS_CANCELLED: "Cancelled",
    STATUS_ATTENDED: "Attended",
    STATUS_ALL: "All",
    STATUS_TODAY: "Today"
};

const SuccessTitle = {
    SUCC_BOOK_TITLE: "Visit created!",
    SUCC_CANCEL_TITLE: "Visit cancelled!",
    SUCC_ATTEND_TITLE: "Visit attended!"
}

const SuccessDescription = {
    SUCC_BOOK_DESC: "Visit will now appear in the visit list.",
    SUCC_CANCEL_DESC: "Visit has now been cancelled from the visit list.",
    SUCC_ATTEND_DESC: "Visit has now been marked as attended on the visit list."
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

const WarningTitle = {
    WARN_CANCEL_TITLE: "Cancelling a visit",
    WARN_ATTEND_TITLE: "Marking as Attended"
}

const WarningDescription = {
    WARN_CANCEL_DESC: "You are about to cancel this visit. Please confirm before doing so.",
    WARN_ATTEND_DESC: "You are about to mark this visit as attended. Please confirm before doing so."
}

export { VisitStatus, ErrorCode, ErrorDescription, ErrorTitle, SuccessTitle, SuccessDescription, WarningTitle,
WarningDescription };