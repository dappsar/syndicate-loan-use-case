let applicationType = 'Housing Development'
let currentTab = 'loanDetails'
var select_arr = ['Loan Taker', 'Seller', 'Confidant']
$(document).ready(function () {
    function createDropdown() {
        var drop = $('.customDropdown');
        var i;
        var htmlString = '<div class="dropContainer">';
        for (i = 0; i < select_arr.length; i += 1) {
            htmlString += '<div class="dropOption">' + select_arr[i] + '</div>';
        }
        htmlString += '</div>';
        drop.append(htmlString);
    }
    createDropdown();

    $('.customDropdown').on('click', function (event) {

        var container = $(this).children('div.dropContainer');
        var target = $(event.target);

        container.toggle();
        $(this).toggleClass('select_border');
        if (target.hasClass('dropOption')) {
            $(this).find('span.valueHolder1').text(target.text());
            $(this).children('span.valueHolder').addClass('float-label')
        }
    })

    /* ----------Input floating label js------------- */
    $(".form-label-group input").focus(function () {
        // $(this).parent().removeClass("round");
        $(this).parent().addClass("input_float_lbl");

    }).blur(function () {
        $(this).parent().removeClass("input_float_lbl");
        tmpval = $(this).val();
        if (tmpval == '') {
            $(this).parent().removeClass('input_float_lbl');

        } else {
            $(this).parent().addClass('input_float_lbl');

        }
    })
    /* ----------End Input floating label js------------- */

    /* ---------Appliaction tab js------- */

    $("body").on("click", ".appplication_section ul li", function () {
        $('.appplication_section ul li.active').removeClass('active');
        $(this).closest('li').addClass('active');
        let loan_heading = $(this).closest('li')[0].innerText.split("\n")[0];
        document.getElementById("heading_text").innerHTML= loan_heading;
        applicationType = $(this).closest('li')[0].innerText.split("\n")[0]
        manageTab(currentTab);
        restoreComment();
        approvals();
        keyData(currentTab);
    });

});

/* ----storing signup input data on browser------ */
var submitFormData = () => {
    let signupData = {};
    //get form object having input fields values
    let formData = document.getElementsByClassName("form-control")
    //getting drop down values from class
    let dropDownData = document.getElementsByClassName("valueHolder1")
    //managing current user
    sessionStorage.setItem('user', JSON.stringify(formData[0].value))
    sessionStorage.setItem('role', JSON.stringify(dropDownData[0].textContent))
    //getting values from form
    for (i = 0; i < formData.length; i++)
        //creating new key pair of tag and value from input
        signupData[formData[i].name] = formData[i].value
    //adding drop down selected value
    signupData.Role = dropDownData[0].textContent
    //storing data in localstorage
    setLocalStorage(new Date(), signupData)
}
/* ----end of storing input data on browser------ */




/* ----Setter Getter for local storage------ */
getLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key));
}
setLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
}



/* ----setting up the values of fields------ */
formValueSetter = (data) => {
    let formData = document.getElementsByClassName("form-control")
    for (i = 0; i < formData.length; i++) {
        formData[i].value = data[formData[i].name] ? data[formData[i].name] : '';//value binding
        formData[i].parentElement.className = "form-label-group float-lab input_float_lbl"//class binding
    }
    calculateTotalAmount();
}



/* ----storing pre defined data on browser------ */
var keyData = (tab) => {
    currentTab = tab;
    let keyDataObject = getLocalStorage(applicationType)
    if (keyDataObject && keyDataObject[tab])
        settingUpDropDown(keyDataObject[tab]);
    else {
        if (!keyDataObject) {
            //defining key data 
            keyDataObject = setUpEnv(tab);
            settingUpDropDown(keyDataObject);
            //storing data in localstorage
            formValueSetter(keyDataObject);
            setLocalStorage(applicationType, keyDataObject)
        }
        else {
            keyDataObject[tab] = setUpEnv(tab);
            settingUpDropDown(keyDataObject[tab]);
            //storing data in localstorage
            formValueSetter(keyDataObject[tab]);
            setLocalStorage(applicationType, keyDataObject)
        }

    }
}

settingUpDropDown = (keyDataObject) => {
    let dropDownData = document.getElementsByClassName("valueHolder1")
    for (i = 0; i < dropDownData.length; i++) {
        dropDownData[i].textContent = keyDataObject[dropDownData[i].previousElementSibling.innerHTML] ? keyDataObject[dropDownData[i].previousElementSibling.innerHTML] : '';
        dropDownData[i].parentElement.className = "customDropdown"
        dropDownData[i].previousElementSibling.className = "valueHolder float-label"
    }
}


//load amount calculation
calculateTotalAmount = () => {
    let total = parseInt(document.getElementById("loanAmount").value) + parseInt(document.getElementById("bank1").value) + parseInt(document.getElementById("bank2").value)
    document.getElementById("Total_value").textContent = total + ' €';
}

var manageTab = (tab) => {
    currentTab = tab;
    if (tab == 'involvedParties')
        keyData('involvedParties')

    let DetailsObject = getLocalStorage(applicationType)
    if (DetailsObject && DetailsObject[tab])
        formValueSetter(DetailsObject[tab]);
    else {
        if (!DetailsObject) {
            DetailsObject = setUpEnv(tab)
            let data = {}
            data[tab] = DetailsObject
            formValueSetter(DetailsObject);
            calculateTotalAmount();
            //storing data in localstorage
            setLocalStorage(applicationType, data)
        }
        else {
            DetailsObject[tab] = setUpEnv(tab)
            formValueSetter(DetailsObject[tab]);
            calculateTotalAmount();
            //storing data in localstorage
            setLocalStorage(applicationType, DetailsObject)

        }
    }


}



let modal = ''//variable to store modal tab
modalValue = (tabName) => modal = tabName;


//comment saved locally
storeComment = () => {
    let comment = document.getElementById('comment').value;
    let commentedData = getLocalStorage(applicationType) ? getLocalStorage(applicationType) : ''
    let user = JSON.parse(sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')) : 'unknown User'//getting current user
    //user = `${user}-${modal}`
    appendComment(comment, user);
    if (commentedData && commentedData['comment']) {
        commentedData['comment'][user] = { 'comment': comment }
        setLocalStorage(applicationType, commentedData)
    }
    else {
        let data = Object.assign(commentedData, { 'comment': { [user]: { 'comment': comment } } })
        setLocalStorage(applicationType, data)
    }
}

//manage predefined data structure 
setUpEnv = (tab) => {
    switch (tab) {
        case "keyData":
            return {
                'Name Of Loan': 'Seller',
                'Purpose Of Loan': 'Confidant'
            };
        case "involvedParties":
            return {
                'Role': 'Loan Takker',
                'Name': 'testing',
                'address': 'This is 37/1 testing address, gurgaon'
            };
        case "objectDetails":
            return {
                'Description': 'Loan Takker',
                'Total Area Outdoor+Indoor': '1000 yards',
                'Usable Area Net Floor Space': '800 yards',
                'Total Area Outdoor': '200 yards',
                'Purchase Price': '1200000',
                'Price Per Sqaure Meter': '1200'
            }
        case "loanDetails":
            return {
                'Client': 1200000,
                'Bank#1': 1300000,
                'Bank#2': 1400000,
                'Interest Rate': 18,
                'Loan Payout Structure': 'testing Cumulative',
                'Load Repayment Structure': 'testing structure',
                'Loan Start': 'testing loan start on 26 feb 2019',
                'Loan Duration': 'testing duration 12 months'
            }
        case "documentDetails":
            return {
                'Expose': 'testing expose',
                'Time Sheet': 'testing with time sheet',
                'Additional document': 'tester document'
            }
    }
}




//getting updated data
updatedData = (tab) => {
    let localDb = getLocalStorage(applicationType)
    let formData = document.getElementsByClassName("form-control")
    for (i = 0; i < formData.length; i++)
        localDb[tab][formData[i].name] ? (localDb[tab][formData[i].name] = formData[i].value) : ''
    let dropData = document.getElementsByClassName("valueHolder1")
    for (i = 0; i < dropData.length; i++)
        localDb[tab][dropData[i].previousElementSibling.innerHTML] = dropData[i].textContent;
    calculateTotalAmount();
    let user = JSON.parse(sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')) : 'unknown User'//getting current user
    if (localDb['approvals']) {
        if (!localDb['approvals'].includes(user))
            localDb['approvals'].push(user)
    }
    else
        localDb['approvals'] = [user]
    setLocalStorage(applicationType, localDb);
    approvals();
}

//get check box value

approvals = () => {
    let users = getLocalStorage(applicationType)['approvals'];
    if (users) {
        if (users.includes('Bank#1'))
            document.getElementById("Bank1").checked = true;
        else
            document.getElementById("Bank1").checked = false;
        if (users.includes('Bank#2'))
            document.getElementById("Bank2").checked = true;
        else
            document.getElementById("Bank2").checked = false;
        if (users.includes('Client'))
            document.getElementById("Client").checked = true;
        else
            document.getElementById("Client").checked = false;
    }
    else {
        document.getElementById("Bank2").checked = false;
        document.getElementById("Bank1").checked = false;
        document.getElementById("Client").checked = false;
    }
} 
approvals();
//append comment
appendComment = (comment, user) => {
    $('#commentSection').append(`<div class="comments_feild">
    <p>${comment}</p>
</div>
    <div class="comment_section">
        <p>
            <span class="cmt_from">Comment from</span>
            <span class="comment_by">${user}</span>
        </p>
    </div>`)
}

//predefined Comment from local storage
restoreComment = () => {
    $("#commentSection").empty();
    let comments = getLocalStorage(applicationType)['comment'];
    for (comment in comments) {
        appendComment(comments[comment].comment, comment)
    }
}
restoreComment();

/* ---------Storing loan application list data ---------*/

let Appliaction_data = [
    { 'loanApplication': 'Housing Development', 'status': 'In review', 'time': '1 March 2019' },
    { 'loanApplication': 'Sale of an appartment complex', 'status': 'Waiting for review', 'time': '6 March 2019' },
    { 'loanApplication': 'Housing Development Leipartstr', 'status': 'Approved', 'time': '1 Jan 2019' }
]

let text_value;

addItem = () => {
    text_value = document.getElementById("add_loan_applications").value;
    if (!text_value) {
        return false;
    }
    else {
        $(".appplication_section ul").append('<li><div class="lists"><h4>' + text_value + '</h4><div class="status"><p>Waiting for review</p></div><span class="date">' + new Date() + '</span></div></li>');
        Appliaction_data.push({ 'loanApplication': text_value, status: 'Waiting for review', time: new Date() });
        setLocalStorage('loanType', Appliaction_data);
    }
}

/* ---------Application loan list -----------*/
(() => {
    let application_list = getLocalStorage('loanType');
    if (application_list)
        for (i = 3; i < application_list.length; i++) {
            $(".appplication_section ul").append('<li><div class="lists"><h4>' + application_list[i].loanApplication + '</h4><div class="status"><p>' + application_list[i].status + '</p></div><span class="date">' + application_list[i].time + '</span></div></li>');
            Appliaction_data = application_list;
        }

})()

/* ------Redirect to Logout---------*/ 
Logout = () =>{
    window.location.href = "Signup.html";
}





