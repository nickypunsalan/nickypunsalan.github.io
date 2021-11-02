function ValidateMobileNumber(mobileNumber) {

    console.log('mobileNoValidator -> mobileNumber param', mobileNumber);
    var cleansedMobileNumber = mobileNumber;
    cleansedMobileNumber = cleansedMobileNumber.replace(/\s/g,"");
    cleansedMobileNumber =  cleansedMobileNumber.replace("+","");
    cleansedMobileNumber = cleansedMobileNumber.replace(/\D/g,"");

    console.log('mobileNoValidator -> after regex cleanse', cleansedMobileNumber);

    if (cleansedMobileNumber.startsWith("614")) {
        cleansedMobileNumber = cleansedMobileNumber.replace(/^.{2}/g,"0");
    }

    if (cleansedMobileNumber.length !== 10) {
        console.log('mobileNoValidator -> incorrect cleansed num:', cleansedMobileNumber);
        return "";
    }

    if (!cleansedMobileNumber.startsWith("04")) {
        console.log('mobileNoValidator -> cleansed num does not begin with 04:', cleansedMobileNumber);
        return "";   
    }

    console.log('mobileNoValidator -> cleansed num:', cleansedMobileNumber);
    return cleansedMobileNumber;
}

function ValidateEmail(email) {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
}

export default { ValidateMobileNumber, ValidateEmail }