
/// let currentTab = 'keyData'

// Arrays for Dropdown menus
var select_arr = ['Borrower', 'Seller', 'Confident']
var select_arr2 = ['Client', 'Bank#1', 'Bank#2']

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];




// var testObject = { 'one': 1, 'two': 2, 'three': 3 };
// // Put the object into storage
// localStorage.setItem('testObject', JSON.stringify(testObject));
// // Retrieve the object from storage
// var retrievedObject = localStorage.getItem('testObject');
// console.log('retrievedObject: ', JSON.parse(retrievedObject));


// Clear Storage for testing purposes
localStorage.clear();
sessionStorage.clear();

const dummyLoan = { 
    keyData: {
            name: 'Housing Development Leipartstr',
            purpose: 'Aquisition of apartment complex',
            id: 0,
            regParty: 0,
            date: 0,
    },
    involvedParties: {
            stakeholder_1: {
                role: 'Client',
                name: 'Estato Inc',
                address: '5, 1st Avenue'
            },
            stakeholder_2: {
                role: 'Bank',
                name: 'web3Bank',
                address: '10, 5th Avenue'
            },
            stakeholder_3: {
                role: 'Bank',
                name: 'Credit Bank',
                address: '87, King Street'
            },

    },
}

// Object Literal Factory Function
// Function: DataStorage / Logic  
const createLoans = (name, id, purpose, state, registeringParty, date) => {
    return {
        name,
        id,
        purpose,
        state, //e.g. in Review
        registeringParty,
        date
    }
}


// Loan_Array
var loans = []; 
var tempLoanId = 0;
var activeLoanId;


// Function to Update Loan Object (Save Changes) 
// id removed, because it should not change.
// Consider Adding activeLoan (id) to params
const updateLoan = (name, purpose, registeringParty, date) => {
    // console.log('updateLoan() called, logging tempLoanId & activeLoan');  
    // console.log(tempLoanId);
    // console.log(activeLoan);
    _currentLoan = loans[activeLoanId];
    
    _currentLoan.name = $('#loanName').val();
    _currentLoan.purpose = $('#loanPurpose').val();
    _currentLoan.registeringParty = $('#regParty').val();
    _currentLoan.date = $('#loanDate').val();;  
    console.log(_currentLoan);

    sessionStorage.setItem(`id_${activeLoanId}`, JSON.stringify(_currentLoan));
}



// MJ: Create new Loan and add to Side Panel
// Function: UI & Logic
addItem = () => {

    // MJ: Retrieve value of loan name from Create-Loan-Modal
    loanName = $("#add_Loan").val();   
    
    // Set active Loan, to determine, where to write Updates to and what to display
    activeLoanId = tempLoanId; 
    
    // Checks for void name. Consider adding more checks here.  
    if (!loanName) {
        loanName = "unnamed loan";
    }
    const newLoan = createLoans(loanName, tempLoanId);
    loans.push(newLoan);
    console.log(loans);
    sessionStorage.setItem(`id_${tempLoanId}`, JSON.stringify(newLoan));


    // Write to Key Data Form
    $('#loanName').val(loanName).closest("div").addClass('input_float_lbl');
    $('#loanId').val(tempLoanId).closest("div").addClass('input_float_lbl');
    // $('#regParty').val('Here account address');



// Adding HTML elements to the left side panel
    $(".appplication_section ul").prepend(
        `<li class="active" id="loan_id_${tempLoanId}">
            <div class="lists"><h4>${loanName}</h4>
                <div class="status">
                <p>Waiting for review</p>
                </div>
                <span class="date">${getDateInFormate()}</span>
            </div>
        </li>`);

    // // MJ: I suppose this adds some data to an array different than the original object
    // Appliaction_data.unshift({ 'loanApplication': loanName, status: 'Waiting for review', time: getDateInFormate() });
    // setLocalStorage('loanType', Appliaction_data);

    $('.appplication_section ul li.active').trigger('click');

    tempLoanId++;
}



// console.log(dummyLoan);
// sessionStorage.setItem('id_1', JSON.stringify(dummyLoan));


function toggleLoans() {
    $('#sample_Loan1').toggle();
    $('#sample_Loan2').toggle();
    $('#sample_Loan3').toggle();
}




// MJ: Doing bunch of stuff, seemingly mostly for UI functionality
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
    function createDropdownagain() {
        var drop = $('.customDropdown.dd_role');
        var i;
        var htmlString = '<div class="dropContainer">';
        for (i = 0; i < select_arr2.length; i += 1) {
            htmlString += '<div class="dropOption">' + select_arr2[i] + '</div>';
        }
        htmlString += '</div>';
        drop.append(htmlString);
    }
    createDropdownagain();

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

    // Input floating label js
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

    /* ---------Appliaction tab js
    this code handle the event when you click
    on the application (when you switch application)
    ------- */
    $("body").on("click", ".appplication_section ul li", function () {
        $('.appplication_section ul li.active').removeClass('active');
        $(this).closest('li').addClass('active');
        let loan_heading = $(this).closest('li')[0].innerText.split("\n")[0];           
        $('.heading_text').html(loan_heading);
        applicationType = $(this).closest('li')[0].innerText.split("\n")[0]
        // manageTab(currentTab);                                      //to manage the state of tab in different application
        // restoreComment();                                           //to show comment acc. to the application
        // approvals();                                                //to show check box acc. to application
        // keyData(currentTab);                                       //to manage drop down
        
        // if (!getLocalStorage(applicationType)) {
        //     ResetForm();
        // }

    });

    $('.date_picker').datepicker({
        autoclose: true
    });
    $(".add_applications").click(function () {
        $('.appplication_section ul li.active').removeClass('active');
    })

});

//append comment
let appendComment = (comment, user) => {
    $('.History_pannel ul').prepend(`<li>
    <div class="histroy_detail">
        <div class="top_section">
            <p class="date">${getDateInFormate()}</p>
            <span class="explorer" data-toggle="modal" data-target="#commentpop" onclick="commentList()">View Detail</span>
        </div>
        <div class="status waiting">
            <p> Waiting for review</p>
        </div>
        
        
        <div id="commentSection"><div class="comments_feild">
            <p>${comment}</p>
        </div>
        <div class="comment_section">
            <p>
                <span class="cmt_from">Comment from</span>
                <span class="comment_by">${user}</span>
            </p>
        </div>
        </div>
            </div>
        </li>`)
}


//get date in the required formate
getDateInFormate = () => {
    var today = new Date();
    var dd = today.getDate();
    var yyyy = today.getFullYear()
    var month = monthNames[today.getMonth()]
    today = dd + ' ' + month + ' ' + yyyy;
    return today;
}

// storing signup input data on browser
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

// Setter Getter for local storage
getLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key));
}
setLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
}

//set fields empty
ResetForm = () => {
    let formData = document.getElementsByClassName("form-control")
    for (i = 0; i < formData.length; i++) {
        formData[i].value = '';//value binding
        formData[i].parentElement.className = "form-label-group float-lab"//class binding
    }
    calculateTotalAmount();
    let dropDownData = document.getElementsByClassName("valueHolder1")
    for (i = 0; i < dropDownData.length; i++) {
        dropDownData[i].textContent = '';
        // dropDownData[i].parentElement.className = "customDropdown"
        dropDownData[i].previousElementSibling.className = "valueHolder"
    }
}

// setting up the values of fields
formValueSetter = (data) => {
    let formData = document.getElementsByClassName("form-control")
    for (i = 0; i < formData.length; i++) {
        formData[i].value = data[formData[i].name] ? data[formData[i].name] : '';//value binding
        formData[i].parentElement.className = "form-label-group float-lab input_float_lbl"//class binding
    }
    calculateTotalAmount();
}



//function which set the value on drop down 
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
    let total = (parseFloat(document.getElementById("loanAmount").value?document.getElementById("loanAmount").value:0) + parseFloat(document.getElementById("bank1").value?document.getElementById("bank1").value:0) + parseFloat(document.getElementById("bank2").value?document.getElementById("bank2").value:0))
    document.getElementById("Total_value").textContent = total + ' €';      //bind calculated value to UI
}

// // Function for changing tabs: called when you switch the tab
// var manageTab = (tab) => {                                      //tab=name of current tab
//     console.log('manageTab');
//     currentTab = tab;                                           // Marcel: defining currentTab for other functions?         
//     restoreComment();
//     if (tab == 'involvedParties')
//         keyData('involvedParties')                              //just for drop down case

//     let DetailsObject = getLocalStorage(applicationType)        //getting value from drop down 
//     if (DetailsObject && DetailsObject[tab])                    //checking if value exsist
//         formValueSetter(DetailsObject[tab]);                    //function which set the text field values
//     else {
//         if (!DetailsObject) {                                   //when you didn't find application in local storage   
//             if (DefaultType.indexOf(applicationType) > -1) {
//                 DetailsObject = setUpEnv(tab)                       //get the predefined value from switch case function
//                 let data = {}
//                 data[tab] = DetailsObject                           //set up value acc. to tab
//                 formValueSetter(DetailsObject);                     //function which set the text field values
//                 calculateTotalAmount();                             //function which calculate the ammount acc. to (client,bank1,bank2)
//                 setLocalStorage(applicationType, data)              //storing data in localstorage
//             }
//         }
//         else {                                                  //when you find applicatioin in local storage but without tab info
            
//             if (DefaultType.indexOf(applicationType) > -1) {
//                 DetailsObject[tab] = setUpEnv(tab)                  //set up predefined value
//                 formValueSetter(DetailsObject[tab]);                //function which set the text field values
//                 calculateTotalAmount();                             //function which calculate the ammount acc. to (client,bank1,bank2)
//                 setLocalStorage(applicationType, DetailsObject)     //storing data in localstorage
//             }
//         }
//     }


// }

// // comment saved locally
// storeComment = () => {
//     restoreComment();
//     let comment = document.getElementById('comment').value;                                     //get comment value from modal when you comment
//     let commentedData = getLocalStorage(applicationType) ? getLocalStorage(applicationType) : ''//getting application data from localstorage
//     let user = JSON.parse(sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')) : 'unknown User'//getting current user
//     //user = `${user}-${modal}`
//     appendComment(comment, user);                                                              //function to bind comments in right hand side box
//     if (commentedData && commentedData[currentTab]) {                                           //check if data from localstorage give us comments 
    
//         if (commentedData[currentTab]['comment']) {
//             commentedData[currentTab]['comment'][new Date().getTime()] = { [user]:{'comment': comment }}                 //bind the next comment with user name
//             setLocalStorage(applicationType, commentedData)                                     //save the updated comments in localstorage
//         }
//         else {
//             commentedData[currentTab] = Object.assign(commentedData[currentTab], { 'comment': { [new Date().getTime()]:{[user]: { 'comment': comment } } }})
//             setLocalStorage(applicationType, commentedData)                                     //set local storage with updated data
//         }
//     }
//     document.getElementById('comment').value = "";
//     // else {                                                                                     //in case local storage given object dont have comments yet
    
//     //     // let data = Object.assign(commentedData, { 'comment': { [currentTab]: { [user]: { 'comment': comment } } } }) //bind comment
//     //     // setLocalStorage(applicationType, data)                                               //set local storage with updated data
//     // }
// }





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
                'RoleType': 'Client',
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
                'Loan Start': 'Select loan start date',
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

// //when to click on update button
// modalValue = (tab) => {
//     let localDb = getLocalStorage(applicationType) ? getLocalStorage(applicationType) : { [tab]: {} };                                                  //getting data of current application from local storage
//     let formData = document.getElementsByClassName("form-control")                                  //getting form data from UI
//     localDb[tab]?localDb[tab]:localDb[tab] = setUpEnv(tab)
//     for (i = 0; i < formData.length; i++)
//         localDb[tab][formData[i].name] ? (localDb[tab][formData[i].name] = formData[i].value) : ''  //updating the editted data in object get from local storage
//     let dropData = document.getElementsByClassName("valueHolder1")                                  //getting drop down from UI                            
//     for (i = 0; i < dropData.length; i++)
//         localDb[tab][dropData[i].previousElementSibling.innerHTML] = dropData[i].textContent;       //setting up the editted data into object come from local storage
//     calculateTotalAmount();
//     let user = JSON.parse(sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')) : 'unknown User'//getting current user
//     if (localDb['approvals']) {                                                                     //if local storage object has approval thing
//         if (!localDb['approvals'].includes(user))                                                   //check user exsist who is updating
//             localDb['approvals'].push(user)                                                         //adding user who is updating
//     }
//     else
//         localDb['approvals'] = [user]
//     setLocalStorage(applicationType, localDb);
//     approvals();
// }

// //when click on approval
// approvals = () => {
//     let users = getLocalStorage(applicationType) ? getLocalStorage(applicationType)['approvals'] : [];
    
//     if (users) {
//         if (users.includes('Bank#1'))
//             document.getElementById("Bank1").checked = true;
//         else
//             document.getElementById("Bank1").checked = false;
//         if (users.includes('Bank#2'))
//             document.getElementById("Bank2").checked = true;
//         else
//             document.getElementById("Bank2").checked = false;
//         if (users.includes('Client'))
//             document.getElementById("Client").checked = true;
//         else
//             document.getElementById("Client").checked = false;
//     }
//     else {
//         document.getElementById("Bank2").checked = false;
//         document.getElementById("Bank1").checked = false;
//         document.getElementById("Client").checked = false;
//     }
// }

// approvals();

// //predefined Comment from local storage
// var restoreComment = () => {
//     $(".History_pannel ul").empty();  //$("#commentSection").empty();
//     let comments = getLocalStorage(applicationType) ? getLocalStorage(applicationType)[currentTab] : {};    
//     if(comments)
//     if ('comment' in comments) {
//         for (comment in comments['comment']) {
//             let data = comments['comment'][comment]
//             let key = Object.keys(data)[0]
//             let commentedText = data[Object.keys(data)[0]].comment            
//             appendComment(commentedText, key);
//         }
//     }
// }
// restoreComment();

// //Application loan list
// (() => {
//     let application_list = getLocalStorage('loanType');
//     if (application_list)
//         for (i = application_list.length - 4; i >= 0; i--) {
//             $(".appplication_section ul").prepend('<li><div class="lists"><h4>' + application_list[i].loanApplication + '</h4><div class="status"><p>' + application_list[i].status + '</p></div><span class="date">' + application_list[i].time + '</span></div></li>');
//             Appliaction_data = application_list;
//         }

// })()


// custom file upload js 
$('#chooseFile').bind('change', function () {
    var filename = $("#chooseFile").val();
    if (/^\s*$/.test(filename)) {
        $(".file-upload").removeClass('active');
        $("#noFile").text("No file chosen...");
    }
    else {
        $(".file-upload").addClass('active');
        $("#noFile").text(filename.replace("C:\\fakepath\\", ""));
    }
});

/* ------Redirect to Logout---------*/
Logout = () => {
    window.location.href = "Signup.html";
}


