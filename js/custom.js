/* 
custom.js defines main functionality for User Interface and Browser Storage of Loans
*/

console.log('Syndicate Loan dApp MVP sucessfully loaded: \n version 0.1.4')


// Arrays for Dropdown menus
var select_arr = ['Borrower', 'Seller', 'Confident']
var select_arr2 = ['Client', 'Bank#1', 'Bank#2']

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Clear browser storage for testing purposes
localStorage.clear();
sessionStorage.clear();

// Loan Overview: Here you selected the loans from the left panel / column
// #################### Does it need to be in .ready() ???? ##########################

$("body").on("click", ".appplication_section ul li", function () {
    $('.appplication_section ul li.active').removeClass('active');
    $(this).closest('li').addClass('active');      

    // passes ul/li object with data- attribute to loadLoan()
    loadLoan(this);

    // Display Form after loading first Loan
    $('#form-wrapper').removeClass('d-none');
    $('#select-info').hide();     
});




// Object Literal Factory Function
// Function: DataStorage / Logic  
const createLoan = (name, id, purpose, state, registeringParty, date) => {
    return {
        name,
        id,
        purpose,
        state, //e.g. in Review
        registeringParty,
        date
    }
}

// Create and store sample loans for users to show
// Function: Logic
function createSampleLoans() {
    id_s1 = createLoan('Housing Development Leipartstr', 'id_s1', 'Aquisition of apartment complex', 'review', '0x', '1/23/2019');
    id_s2 = createLoan('Office Complex Alexanderplatz', 'id_s2', 'Loan for internal renovations', 'review', '0x', '2/21/2019');
    id_s3 = createLoan('Exhibition Center East', 'id_s3', 'Building the foundations', 'review', '0x', '3/2/2019');
    sessionStorage.setItem(`id_s1`, JSON.stringify(id_s1));
    sessionStorage.setItem(`id_s2`, JSON.stringify(id_s2));
    sessionStorage.setItem(`id_s3`, JSON.stringify(id_s3));
    $('#sample_Loan1').hide();
    $('#sample_Loan2').hide();
    $('#sample_Loan3').hide();
}
// Reconsider page onLoad behavior: Should sample loans be auto-loaded or after pressing button?
createSampleLoans();

// Initialize tempLoanId for locally created loans (serves as key for storage)
var tempLoanId = 0;

// Variable to determine which loan is currently displayed in UI
var activeLoanId;


// Function to Update Loan Object (Save Changes from form fields) 
// Function: Logic
const updateLoan = (name, purpose, registeringParty, date) => {
    alert('Saving changes to browser storage');
    // Load loan from array
    console.log('Saving loan with id: ' + activeLoanId);
 
    // Loads currently active loan
    var loanObj = JSON.parse(sessionStorage.getItem(activeLoanId));

    // Reads current form values from HTML and saves them to loaded loan Object
    loanObj.name = $('#loanName').val();
    loanObj.purpose = $('#loanPurpose').val();
    loanObj.state = $('#state').val();
    loanObj.registeringParty = $('#regParty').val();
    loanObj.date = $('#loanDate').val();

    // Stores Updates to session storage
    sessionStorage.setItem(activeLoanId, JSON.stringify(loanObj));
}

// // function that shall automatically refresh side panel and load loans
// function refreshSidePanel() {
//     sessionKeys = Object.keys(sessionStorage);
//     sessionKeys.forEach( function(item) {
//         if (item.includes('bc')) {

//         }
//         else {

//         }
//     });
// }

var deleteFromSidePanel = (_id) => {
    $(`li[data-storage-key="${_id}"`).remove();
}


var addLoanToSidePanel = (_loanId, _loanName, _date, type) => {

    // Sets data-storage-key dependent on loan object type (local or from smart contract)
    // date is either the current or from smart contract storage
    var loanIdAttr;
    if (type == 'bc')
    {
        loanIdAttr = 'bc_'+_loanId;
        date = _date
        bc_info = ' | loaded from Blockchain';
    }
    else {
        loanIdAttr = 'id_'+_loanId;
        date = getDateInFormat('full');
        bc_info = '';
    }

    $(".appplication_section ul").prepend(
        `<li class="active" data-storage-key="${loanIdAttr}">
            <div class="lists"><h4>${_loanName}</h4>
                <div class="status">
                <p>Waiting for review${bc_info}</p>

                </div>
                <span class="date">${date}</span>
            </div>
        </li>`);

        // Triggers clicking on the created / loaded loan
        $('.appplication_section ul li.active').trigger('click');

    
}


// MJ: Create new Loan and call function to add it to Side Panel
// Function: UI & Logic
var addItem = () => {
    // MJ: Retrieve value of loan name from Create-Loan-Modal
    loanName = $("#add_Loan").val();
    // Set the field of in the modal to the standard value   
    $("#add_Loan").val('Name of loan');

    // Set active Loan, to determine, where to write Updates to and what to display
    activeLoanId = 'id_'+tempLoanId;
    console.log('logging addItem: '+ activeLoanId); 
    
    // Checks for void name. Consider adding more checks here.  
    if (!loanName) {
        loanName = "unnamed loan";
    }
    // Add functionality to pass Blockchain Address
    const newLoan = createLoan(loanName, tempLoanId, undefined, 'review', curAddress, getDateInFormat());  
    sessionStorage.setItem(activeLoanId, JSON.stringify(newLoan));

    // call function that adds loan to UI side panel
    addLoanToSidePanel(tempLoanId, loanName);

    tempLoanId++;
}

// Togges sample loans for showroom functionality
// Function: UI
function toggleLoans() {
    console.log('toggleLoans called');
    $('#sample_Loan1').toggle();
    $('#sample_Loan2').toggle();
    $('#sample_Loan3').toggle();
}

// Function: Logic
function returnActiveLoan() {
    var activeLoan = JSON.parse(sessionStorage.getItem(activeLoanId));
    return activeLoan;
}

// loads loan and writes into html form
// Function: UI + Logic (sets activeLoanId)
function loadLoan(htmlObject) {
    $('#writeToChain').show();
    $('#updateToChain').hide();
    
    activeLoanId = htmlObject.getAttribute("data-storage-key");

    if (activeLoanId.includes('bc')) {
        $('#writeToChain').hide();
        $('#updateToChain').show();
    }

    // load loan from storage
    var loanObj = JSON.parse(sessionStorage.getItem(activeLoanId));
    // console.log(loanObj);
    // console.log(loanObj.name);

    /* 
    Simple error handling in case loan cannot be loaded 
    (e.g. cleared storage or other reasons) 
    */
    if (loanObj) {
        $('.heading_text').html(loanObj.name);
        $('#loanName').val(loanObj.name);
        $('#loanPurpose').val(loanObj.purpose);
        $('#loanId').val(loanObj.id);
        $('#state').val(loanObj.state);
        $('#revisionNumber').val(loanObj.revisionNumber);
        $('#regParty').val(loanObj.registeringParty);
        $('#loanDate').val(loanObj.date);        
        // $('#loanDate').val(getDateInFormat(undefined, loanObj.date));

    }
    else {
        alert(`Error: Loan (${activeLoanId}) not found in your browser storage`);
    }
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
    // MJ: Function: UI
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

    // // Loan Overview: Here you selected the loans from the left panel / column
    // // #################### Does it need to be in .ready() ???? ##########################

    // $("body").on("click", ".appplication_section ul li", function () {
    //     $('.appplication_section ul li.active').removeClass('active');
    //     $(this).closest('li').addClass('active');      

    //     // passes list element with data- attribute to loadLoan()
    //     loadLoan(this);
    //     $('#form-wrapper').removeClass('d-none');
    //     $('#select-info').hide();     
    // });



    $('.date_picker').datepicker({
        autoclose: true
    });
    $(".add_applications").click(function () {
        $('.appplication_section ul li.active').removeClass('active');
    })

}); // MJ: end of callback in document.reayd()

// append comment
// Comment functionality off
let appendComment = (comment, user) => {
    $('.History_pannel ul').prepend(`<li>
    <div class="histroy_detail">
        <div class="top_section">
            <p class="date">${getDateInFormat()}</p>
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


// MJ: Function returns date as string, option: full, with month name, or regular
getDateInFormat = (format, timestamp) => {

    if (format == 'full') {

        var today = new Date(timestamp*1000);
        var dd = today.getDate();
        var yyyy = today.getFullYear();
        var month = monthNames[today.getMonth()];
        today = dd + ' ' + month + ' ' + yyyy;
        return today;
    }

    else {

       var today = new Date();
       var dd = today.getDate();
       var yyyy = today.getFullYear();
       var mm = today.getMonth()+1;
       today = dd + '/' + mm + '/' + yyyy;
       return today; 
    }
}

var submitFormData = () => {
    console.log('submitFormData() called');
    alert('submitFormData() called');
    var userObj = {};

    userObj.company = $('#companyName').val();
    userObj.address = $('#signUpAddress').val();
    userObj.name = $('#signUpAddress').val();
    userObj.firstName = $('#firstName').val();
    userObj.lastName = $('#lastName').val();
    
    sessionStorage.setItem($('#signUpAddress').val(), JSON.stringify(userObj));
}

// // MJ: Signup page: Consider complete rewrite soon
// var submitFormData = () => {

//     let signupData = {};
//     //get form object having input fields values
//     let formData = document.getElementsByClassName("form-control")
//     //getting drop down values from class
//     let dropDownData = document.getElementsByClassName("valueHolder1")
//     //managing current user
//     sessionStorage.setItem('user', JSON.stringify(formData[0].value))
//     sessionStorage.setItem('role', JSON.stringify(dropDownData[0].textContent))
//     //getting values from form
//     for (i = 0; i < formData.length; i++)
//         //creating new key pair of tag and value from input
//         signupData[formData[i].name] = formData[i].value
//     //adding drop down selected value
//     signupData.Role = dropDownData[0].textContent
//     //storing data in localstorage
//     setLocalStorage(new Date(), signupData)

// }

// // Setter Getter for local storage
// getLocalStorage = (key) => {
//     return JSON.parse(localStorage.getItem(key));
// }
// setLocalStorage = (key, value) => {
//     localStorage.setItem(key, JSON.stringify(value));
// }



// //set fields empty
// ResetForm = () => {
//     let formData = document.getElementsByClassName("form-control")
//     for (i = 0; i < formData.length; i++) {
//         formData[i].value = '';//value binding
//         formData[i].parentElement.className = "form-label-group float-lab"//class binding
//     }
//     calculateTotalAmount();
//     let dropDownData = document.getElementsByClassName("valueHolder1")
//     for (i = 0; i < dropDownData.length; i++) {
//         dropDownData[i].textContent = '';
//         // dropDownData[i].parentElement.className = "customDropdown"
//         dropDownData[i].previousElementSibling.className = "valueHolder"
//     }
// }

// setting up the values of fields
// formValueSetter = (data) => {
//     let formData = document.getElementsByClassName("form-control")
//     for (i = 0; i < formData.length; i++) {
//         formData[i].value = data[formData[i].name] ? data[formData[i].name] : '';//value binding
//         formData[i].parentElement.className = "form-label-group float-lab input_float_lbl"//class binding
//     }
//     calculateTotalAmount();
// }



// //function which set the value on drop down 
// settingUpDropDown = (keyDataObject) => {
//     let dropDownData = document.getElementsByClassName("valueHolder1")
//     for (i = 0; i < dropDownData.length; i++) {
//         dropDownData[i].textContent = keyDataObject[dropDownData[i].previousElementSibling.innerHTML] ? keyDataObject[dropDownData[i].previousElementSibling.innerHTML] : '';
//         dropDownData[i].parentElement.className = "customDropdown"
//         dropDownData[i].previousElementSibling.className = "valueHolder float-label"
//     }
// }

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





// //manage predefined data structure 
// setUpEnv = (tab) => {
//     switch (tab) {
//         case "keyData":
//             return {
//                 'Name Of Loan': 'Seller',
//                 'Purpose Of Loan': 'Confidant'
//             };
//         case "involvedParties":
//             return {
//                 'RoleType': 'Client',
//                 'Role': 'Loan Takker',
//                 'Name': 'testing',
//                 'address': 'This is 37/1 testing address, gurgaon'
//             };
//         case "objectDetails":
//             return {
//                 'Description': 'Loan Takker',
//                 'Total Area Outdoor+Indoor': '1000 yards',
//                 'Usable Area Net Floor Space': '800 yards',
//                 'Total Area Outdoor': '200 yards',
//                 'Purchase Price': '1200000',
//                 'Price Per Sqaure Meter': '1200'
//             }
//         case "loanDetails":
//             return {
//                 'Client': 1200000,
//                 'Bank#1': 1300000,
//                 'Bank#2': 1400000,
//                 'Interest Rate': 18,
//                 'Loan Payout Structure': 'testing Cumulative',
//                 'Load Repayment Structure': 'testing structure',
//                 'Loan Start': 'Select loan start date',
//                 'Loan Duration': 'testing duration 12 months'
//             }
//         case "documentDetails":
//             return {
//                 'Expose': 'testing expose',
//                 'Time Sheet': 'testing with time sheet',
//                 'Additional document': 'tester document'
//             }
//     }
// }

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


