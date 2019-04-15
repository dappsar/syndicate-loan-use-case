/* 
custom.js defines main functionality for User Interface and Browser Storage of Loans
*/

var devMode = true;
var logMsgL1 = false;

// Start-up behavior
console.log('Syndicate Loan dApp MVP sucessfully loaded: \n version 0.1.4')

// Clear browser storage for testing purposes
// localStorage ? localStorage.clear() : console.log('No local storage to be cleared');
sessionStorage.clear();
$('#approval_status').hide();

// Arrays for Dropdown menus
var select_arr = ['Lender', 'Borrower'];

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];


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
    $('#approval_status').show();
});


// Object Literal Factory Function
// Function: DataStorage / Logic  
const createLoan = (name, id, purpose, state, registeringParty, date, addresses, approvalStatus, loanAmounts) => {
    return {
        name,
        id,
        purpose,
        state,              // e.g. in Review
        registeringParty,
        date,
        addresses,
        approvalStatus,
        loanAmounts
    }
}

var userMap = {};

// Create and store sample loans for users to show
// Function: Logic
function createSampleLoans() {
    id_s1 = createLoan('Housing Development Leipartstr', 'id_s1', 'Aquisition of apartment complex', 'review', 
    '0x31f9b7a755f5b2B41d26E6F841fc532C1230Ecf7', '1/23/2019',
     ['0x31f9b7a755f5b2B41d26E6F841fc532C1230Ecf7', '0xe972A893147F7C74176091da2d4848E6F6A9A076', '0xD8FE537661DBa027F9aCCB7671cB9227d29f90ff'], 
     [true, true , false], [500000, 200000 , 700000]);
    id_s2 = createLoan('Office Complex Alexanderplatz', 'id_s2', 'Loan for internal renovations', 'review', '0xD8FE537661DBa027F9aCCB7671cB9227d29f90ff', '2/21/2019',
     ['0x31f9b7a755f5b2B41d26E6F841fc532C1230Ecf7', '0xca35b7d915458ef540ade6068dfe2f44e8fa733c'], [false, false], [700000, 3500000]);
    id_s3 = createLoan('Exhibition Center East', 'id_s3', 'Building the foundations', 'review', '0x6Da8869C9E119374Db0D92862870b47Bf27f673f', '3/2/2019',
     ['0x6Da8869C9E119374Db0D92862870b47Bf27f673f', '0x14723a09acff6d2a60dcdf7aa4aff308fddc160c'], [false, true], [300000, 2500000]);
    sessionStorage.setItem(`id_s1`, JSON.stringify(id_s1));
    sessionStorage.setItem(`id_s2`, JSON.stringify(id_s2));
    sessionStorage.setItem(`id_s3`, JSON.stringify(id_s3));

    userMap["0x31f9b7a755f5b2B41d26E6F841fc532C1230Ecf7"] = {name: 'Berlin Investment Bank (S)', role: 'lender'};
    userMap["0xe972A893147F7C74176091da2d4848E6F6A9A076"] = {name: 'Infra Bank (S)', role: 'lender'};
    userMap["0xD8FE537661DBa027F9aCCB7671cB9227d29f90ff"] = {name: 'Albrecht Real Estate (S)', role: 'borrower'};
    userMap["0xca35b7d915458ef540ade6068dfe2f44e8fa733c"] = {name: 'City Housing Co. (S)', role: 'borrower'};
    userMap["0x14723a09acff6d2a60dcdf7aa4aff308fddc160c"] = {name: 'Berlin Estate (S)', role: 'borrower'};

    fillUserArray();

    // For Sample Loan Toggle: standard behavior, samples hidden
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
const updateLoanInBrowser = () => {
    // ### INCLUDE: Check if loan has changed
    if (devMode) alert('Saving changes to browser storage');
    // Load loan from array
    console.log('Saving loan with id: ' + activeLoanId);
 
    // Loads currently active loan
    var loanObj = JSON.parse(sessionStorage.getItem(activeLoanId));

    // Reads current form values from HTML and saves them to loaded loan Object
    loanObj.name = $('#loanName').val();
    loanObj.purpose = $('#loanPurpose').val();
    loanObj.state = $('#state').val();
    loanObj.registeringParty = $('#regParty').val();
    //loanObj.data = { interest_rate: "5%"; asjdhaskdhkja}
    //loanObj.data
    // loanObj.date = $('#loanDate').val();   // probably not necessary anymore

    // saves changes to loan object in session storage
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

// Function: UI
var deleteFromSidePanel = (_id) => {
    $(`li[data-storage-key="${_id}"`).remove();
}

// Function: UI
var addLoanToSidePanel = (_loanId, _loanName, _date, type) => {

    // Sets data-storage-key dependent on loan object type (local or from smart contract)
    // date is either the current or from smart contract storage

    var loanIdAttr; // For identification in attributes
    if (type == 'bc')
    {
        loanIdAttr = 'bc_'+_loanId;
        date = getDateInFormat(undefined, _date)
        bc_info = ' | loaded from Blockchain';
    }
    else {
        loanIdAttr = 'id_'+_loanId;
        date = getDateInFormat('full');
        bc_info = '';
    }

    $(".appplication_section ul").prepend(
        `<li data-storage-key="${loanIdAttr}">
            <div class="lists"><h4>${_loanName}</h4>
                <div class="status">
                <p>Waiting for review${bc_info}</p>

                </div>
                <span class="date">${date}</span>
            </div>
        </li>`);

       // Triggers clicking on the created / loaded loan
       $('li[data-storage-key="bc_3"]').trigger('click');

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
    unixtime = Math.floor(Date.now() / 1000);
    const newLoan = createLoan(loanName, tempLoanId, undefined, 'review', userAccount, unixtime);  
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


/*
Loads loan and writes data into html form
Function: UI + Logic (sets activeLoanId)
*/
function loadLoan(htmlObject) {
    $('#writeToChain').show();
    $('#updateToChain').hide();
    $('#btn_approveLoan').hide();

    $('#loan_users').empty();
    $('.approval_check').empty();
    $('#loan_amounts').empty();
    

    // Hides user data input fields in Involved Parties tab when loan is loaded
    $('#user_data_fields').hide();

        // Not necessary anymore? Resetting is possible by using .html() ? 
    // $('#pt_address').val('').hide();
    // $('label[for=pt_address').hide();
    // $('#pt_role').val('').hide();
    // $('label[for=pt_role').hide();    
    // $('#pt_name').val('').hide();
    // $('label[for=pt_name').hide();
    
    activeLoanId = htmlObject.getAttribute("data-storage-key");

    if (activeLoanId.includes('bc')) {
        $('#writeToChain').hide();
        $('#updateToChain').show();
        $('#btn_approveLoan').show();
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
        if (activeLoanId.includes('bc'))  $('#loanId').val(loanObj.id);
        if (!activeLoanId.includes('bc'))  $('#loanId').val("Not yet registered on Blockchain");
        $('#state').val(loanObj.state);
        $('#revisionNumber').val(loanObj.revisionNumber);
        $('#regParty').val(loanObj.registeringParty);
        // $('#loanDate').val(loanObj.date);        
        $('#loanDate').val(getDateInFormat(undefined, loanObj.date));

        if (loanObj.userId == 0) {
            $('#registration_info').text("You registered this loan and have special permissions");
        }
        else if (loanObj.userId) {
            $('#registration_info').text("You are part of this loan");
        }
        else {
            $('#registration_info').text("");
        }

        // Loads parties (users in loan) with approval status
        loadParties();
    }
    else {
        alert(`Error: Loan (${activeLoanId}) not found in your browser storage`);
    }
}


// Load all the parties belonging to the current Loan
// Function: UI
function loadParties() {
    var loanObj = JSON.parse(sessionStorage.getItem(activeLoanId));

    // html string for dropdown menu 
    var menuItems = "";

    // clear selected user from dropdown 
    $('.valueHolder1').empty();
    // Check case that loan in creation has not any addresses
    try {
        if (!loanObj.addresses) throw "Error: No addresses in loan object found"

        addr = loanObj.addresses;

        // Add check to see if user is YOU
        for (i = 0; i < addr.length; i++) {
            // console.log("Approval Status:" + loanObj.approvalStatus[i]);
            info = "";

            if (i == loanObj.userId) {
                info = "(You)";
            }

            // console.log("addr[i] :" + addr[i]);
            console.log(typeof addr[i]);
            // console.log("userMap[addr[i]].name " + userMap[addr[i]].name);
            if (userMap[addr[i]]) {
                userName = userMap[addr[i]].name;
                userRole = userMap[addr[i]].role;
            }
            else {
                userName = "Unregistered";
                userRole = "";
            }
            
            // Retrieves the loan amount of user at array position i, corresponding to address at position i
            userLoanSum = loanObj.loanAmounts[i];

            // Add users to UI Approval Status Panel 
            $('.approval_check').append(` 
            <div class="form-group">
                <input type="checkbox" id="user_${i}" title="${addr[i]}" disabled>
                <label for="user_${i}" title="${addr[i]}">${userName} ${info}</label>
            </div>
            `);

            $('#loan_amounts').append(`
            <div class="form-label-group float-lab input_float_lbl">
                <input type="text" id="amount_user_${i}" class="form-control" name="amount_user_${i}" value="${userLoanSum}"
                    required disabled>
                <label for="amount_user_${i}"><span>${userName} (${i})</span></label>
                <span class="euro">€</span>
            </div>`);
                      
            // Create dropdown items in involved parties tab ---> loading details (loadUserDetail) from document.ready
            menuItems += `<div class="dropOption" id="pt_user_${i}" title="${addr[i]}">${userName} (${i})</div>`;
            $('#involved_dropdown').html(menuItems);
            
            if (loanObj.approvalStatus[i] == true) {
                $(`#user_${i}`).prop('checked', true);
            }
            else {
                $(`#user_${i}`).prop('checked', false);
            }
        }

    }
    catch (error) {
        console.log(error);
    }
}



// Loads user data into form <section id="user_data_fields"> when selected in dropdown [Involved Parties Tab]
function loadUserDetail (address) {

    if (userMap[address]) {
        userName = userMap[address].name;
        userRole = userMap[address].role;
    }
    else {
        userName = "Unregistered";
        userRole = "Unknown";
    }

    $('#pt_address').val(address).closest('div').addClass('input_float_lbl');
    $('#pt_role').val(userRole).closest('div').addClass('input_float_lbl');
    $('#pt_name').val(userName).closest('div').addClass('input_float_lbl');

};



function createDropdown() {
    var drop = $('#signUpDropDown');
    var i;
    var htmlString = '<div class="dropContainer">';
    for (i = 0; i < select_arr.length; i += 1) {
        htmlString += '<div class="dropOption">' + select_arr[i] + '</div>';
    }
    htmlString += '</div>';
    drop.append(htmlString);
}

// Function: UI
$(document).ready(function () {

    createDropdown();
    // createLoanUsersDropDown();

    // Functionality for dropdown and loading user data (as of now conflicting with generic use (signup.html))
    $('.customDropdown').on('click', function (event) {
        var container = $(this).children('div.dropContainer');
        var target = $(event.target);

        container.toggle();
        $(this).toggleClass('select_border');
        if (target.hasClass('dropOption')) {
            $(this).find('span.valueHolder1').text(target.text());
            loadUserDetail(target.attr("title"));
            $('#user_data_fields').show();
            $(this).children('span.valueHolder').addClass('float-label input_float_lbl');
        }
    });

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
    });

    $('.date_picker').datepicker({
        autoclose: true
    });

    $(".add_applications").click(function () {
        $('.appplication_section ul li.active').removeClass('active');
    });

}); // MJ: end of callback in document.reayd()



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
// Function: UI
getDateInFormat = (format, timestamp) => {

    // check If UNIX timestamp is passed (e.g. for solidity date functions)
    if (timestamp) {
        var today = new Date(timestamp*1000);
    }
    else {
        var today = new Date();
    }

    if (format == 'full') {
        var dd = today.getDate();
        var yyyy = today.getFullYear();
        var month = monthNames[today.getMonth()];
        today = dd + ' ' + month + ' ' + yyyy;
        return today;
    }

    else {
       var dd = today.getDate();
       var yyyy = today.getFullYear();
       var mm = today.getMonth()+1;
       today = dd + '/' + mm + '/' + yyyy;
       return today; 
    }
}

// Function: Logic
var submitFormData = () => {
    console.log('submitFormData() called');
    if (devMode) alert('submitFormData() called');
    var userObj = {};

    userObj.company = $('#companyName').val();
    userObj.address = $('#signUpAddress').val();
    userObj.name = $('#signUpAddress').val();
    userObj.firstName = $('#firstName').val();
    userObj.lastName = $('#lastName').val();
    
    localStorage.setItem($('#signUpAddress').val(), JSON.stringify(userObj));
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


// Load amount calculation
calculateTotalAmount = () => {    
    let total = (parseFloat(document.getElementById("loanAmount").value?document.getElementById("loanAmount").value:0) + parseFloat(document.getElementById("bank1").value?document.getElementById("bank1").value:0) + parseFloat(document.getElementById("bank2").value?document.getElementById("bank2").value:0))
    document.getElementById("Total_value").textContent = total + ' €';      //bind calculated value to UI
}


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


