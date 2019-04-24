/* 
custom.js defines main functionality for User Interface and Browser Storage of Loans
*/

var devMode = false;

// Start-up behavior
console.log("Syndicate Loan dApp MVP sucessfully loaded: \n version 0.1.4");

// Clear browser storage for testing purposes
// localStorage ? localStorage.clear() : console.log('No local storage to be cleared');
sessionStorage.clear();
$("#approval_status").hide();

// Arrays for Dropdown menus
var select_arr = ["lender", "borrower"];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

// Loan Overview: Here you selected the loans from the left panel / column
// #################### Does it need to be in .ready() ???? ##########################

$("body").on("click", ".appplication_section ul li", function() {
  $(".appplication_section ul li.active").removeClass("active");
  $(this)
    .closest("li")
    .addClass("active");

  // passes ul/li object with data- attribute to loadLoan()
  loadLoan(this);

  // Display Form after loading first Loan
  $("#form-wrapper").removeClass("d-none");
  $("#select-info").hide();
  $("#approval_status").show();
});

// Object Literal Factory Function
// Function: DataStorage / Logic
const createLoan = (
  name,
  id,
  revisionNumber,
  purpose,
  state,
  registeringParty,
  date,
  addresses,
  approvalStatus,
  loanAmounts
) => {
  return {
    name,
    id,
    revisionNumber,
    purpose,
    state, // e.g. in Review
    registeringParty,
    date,
    addresses,
    approvalStatus,
    loanAmounts
  };
};

var userMap = {};

// Create and store sample loans for users to show
// Function: Logic
function createSampleLoans() {
  id_s1 = createLoan(
    "Housing Development Leipartstr",
    "id_s1",
    1,
    "Aquisition of apartment complex",
    "review",
    "0x31f9b7a755f5b2B41d26E6F841fc532C1230Ecf7",
    "1549154800",
    [
      "0x31f9b7a755f5b2B41d26E6F841fc532C1230Ecf7",
      "0xe972A893147F7C74176091da2d4848E6F6A9A076",
      "0xD8FE537661DBa027F9aCCB7671cB9227d29f90ff"
    ],
    [true, true, false],
    [500000, 200000, 700000]
  );
  id_s2 = createLoan(
    "Office Complex Alexanderplatz",
    "id_s2",
    5,
    "Loan for internal renovations",
    "review",
    "0xD8FE537661DBa027F9aCCB7671cB9227d29f90ff",
    "1549314800",
    [
      "0x31f9b7a755f5b2B41d26E6F841fc532C1230Ecf7",
      "0xca35b7d915458ef540ade6068dfe2f44e8fa733c"
    ],
    [false, false],
    [700000, 3500000]
  );
  id_s3 = createLoan(
    "Exhibition Center East",
    "id_s3",
    2,
    "Building the foundations",
    "review",
    "0x6Da8869C9E119374Db0D92862870b47Bf27f673f",
    "1549194800",
    [
      "0x6Da8869C9E119374Db0D92862870b47Bf27f673f",
      "0x14723a09acff6d2a60dcdf7aa4aff308fddc160c"
    ],
    [false, true],
    [300000, 2500000]
  );
  sessionStorage.setItem(`id_s1`, JSON.stringify(id_s1));
  sessionStorage.setItem(`id_s2`, JSON.stringify(id_s2));
  sessionStorage.setItem(`id_s3`, JSON.stringify(id_s3));

  userMap["0x31f9b7a755f5b2B41d26E6F841fc532C1230Ecf7"] = {
    name: "Berlin Investment Bank (S)",
    role: "lender"
  };
  userMap["0xe972A893147F7C74176091da2d4848E6F6A9A076"] = {
    name: "Infra Bank (S)",
    role: "lender"
  };
  userMap["0xD8FE537661DBa027F9aCCB7671cB9227d29f90ff"] = {
    name: "Albrecht Real Estate (S)",
    role: "borrower"
  };
  userMap["0xca35b7d915458ef540ade6068dfe2f44e8fa733c"] = {
    name: "City Housing Co. (S)",
    role: "borrower"
  };
  userMap["0x14723a09acff6d2a60dcdf7aa4aff308fddc160c"] = {
    name: "Berlin Estate (S)",
    role: "borrower"
  };

  fillUserArray();

  // For Sample Loan Toggle: standard behavior, samples hidden
  $("#sample_Loan1").hide();
  $("#sample_Loan2").hide();
  $("#sample_Loan3").hide();
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
  if (devMode) alert("Saving changes to browser storage");
  // Load loan from array
  //console.log('Saving loan with id: ' + activeLoanId);

  // Loads currently active loan
  var loanObj = JSON.parse(sessionStorage.getItem(activeLoanId));
  id = loanObj.userId;

  // Reads current form values from HTML and saves them to loaded loan Object directly
  loanObj.name = $("#loanName").val();
  loanObj.state = $("#state").val();
  loanObj.registeringParty = $("#regParty").val();

  // dataObject where most values will be stored
  var dataStringObj = {};
  dataStringObj.purpose = $("#loanPurpose").val(); // Purpose is on keydata tab

  // Check if loan already exists on blockchain (only then additional tabs shall be active)
  if (activeLoanId.includes("bc")) {
    // Getting the loan amount from user's field, which is not disabled, and store it in local object
    loanObj.loanAmounts[id] = $(`#amount_user_${id}`).val();

    // Store all the field values in an object
    dataStringObj.descript = $("#object_descript").val();
    dataStringObj.total_area = $("#total_area").val();
    dataStringObj.usable_area = $("#usable_area").val();
    dataStringObj.outdoor_area = $("#outdoor_area").val();
    dataStringObj.object_price = $("#object_price").val();
    dataStringObj.price_sqm = $("#price_sqm").val();
  }

  loanObj.dataStringObj = dataStringObj;
  // Store Object with all field values as string, so it can be stored on smart contract
  loanObj.dataString = JSON.stringify(dataStringObj);

  // loanObj.date = $('#loanDate').val();   // probably not necessary anymore

  // saves changes to loan object in session storage
  sessionStorage.setItem(activeLoanId, JSON.stringify(loanObj));
};

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
var deleteFromSidePanel = _id => {
  $(`li[data-storage-key="${_id}"`).remove();

  $("#form-wrapper").addClass("d-none");
  $("#select-info").show();
};


// Function: Logic 
// Checks if approval status array in object has min of 3 users and if all are true
function returnApprovalStatus(_loanId_key) {
    loanObj = JSON.parse(sessionStorage.getItem(_loanId_key));
    if (loanObj.length > 2 && loanObj.approvalStatus.every(Boolean) == true) {
        return true;
    }
    else {
        return false;
    }
}

// Function: UI
var addLoanToSidePanel = (_loanId, _loanName, _date, type) => {
  // Sets data-storage-key dependent on loan object type (local or from smart contract)
  // date is either the current or from smart contract storage

  var loanIdAttr; // For identification in attributes
  if (type == "bc") {
    loanIdAttr = "bc_" + _loanId;
    date = getDateInFormat(undefined, _date);
    bc_info = "from blockchain";
  } else {
    loanIdAttr = "id_" + _loanId;
    date = getDateInFormat("full");
    bc_info = "locally stored";
  }

  console.log("addLoanToSidePanel()" + activeLoanId);
  if (returnApprovalStatus(loanIdAttr) == true) {
    reviewStatus = "Loan Approved";
  }
  else {
    reviewStatus = "In review";
  }


  $(".appplication_section ul").prepend(
    `<li data-storage-key="${loanIdAttr}">
            <div class="lists"><h4>${_loanName}</h4>
                <div class="status">
                <p>${reviewStatus} | ${bc_info}</p>

                </div>
                <span class="date">${date}</span>
            </div>
        </li>`
  );

  // Triggers clicking on the created / loaded loan ## CANT BE HERE BECAUSE IT BREAKS LOGLOANS
  //    $(`li[data-storage-key="${loanIdAttr}"]`).trigger('click');
};

// MJ: Create new Loan and call function to add it to Side Panel
// Function: UI & Logic
var addItem = () => {
  // MJ: Retrieve value of loan name from Create-Loan-Modal
  loanName = $("#add_Loan").val();
  // Set the field of in the modal to the standard value
  // $("#add_Loan").val('Name of loan');
  $("#add_Loan").val("");

  // Set active Loan, to determine, where to write Updates to and what to display
  activeLoanId = "id_" + tempLoanId;
  //console.log('logging addItem: '+ activeLoanId);

  // Checks for void name. Consider adding more checks here.
  if (!loanName) {
    loanName = "unnamed loan";
  }
  // Add functionality to pass Blockchain Address
  unixtime = Math.floor(Date.now() / 1000);
  const newLoan = createLoan(
    loanName,
    tempLoanId,
    "0",
    undefined,
    "review",
    userAccount,
    unixtime
  );
  sessionStorage.setItem(activeLoanId, JSON.stringify(newLoan));

  // call function that adds loan to UI side panel
  addLoanToSidePanel(tempLoanId, loanName);
  $(`li[data-storage-key="${activeLoanId}"]`).trigger("click");
  $("#tab-A").trigger("click");

  tempLoanId++;
};

// Togges sample loans for showroom functionality
// Function: UI
function toggleLoans() {
  //console.log('toggleLoans called');
  $("#sample_Loan1").toggle();
  $("#sample_Loan2").toggle();
  $("#sample_Loan3").toggle();
}

// Function: Logic
function returnActiveLoan() {
  var activeLoan = JSON.parse(sessionStorage.getItem(activeLoanId));
  return activeLoan;
}

function refreshUI() {
  sessionKeys = Object.keys(sessionStorage);
  if (devMode) console.log("refreshUI called");
  // Basic check to see if active loan still exists
  if (!sessionKeys.includes(activeLoanId)) {
    $("#form-wrapper").addClass("d-none");
    $("#select-info").show();
  }
}

/*
Loads loan and writes data into html form
Function: UI + Logic (sets activeLoanId)
*/
function loadLoan(htmlObject) {
  // if (devMode) alert(`loadLoan() called`);

  // Hide or show fields depending on the current loan state
  $("#tab-A").trigger("click");

  $("#writeToChain").show();
  $("#updateToChain").hide();
  $("#btn_approveLoan").hide();

  // Making tabs inaccessible for local loans
  $("#tab-B, #tab-C, #tab-D, #tab-E").hide();

  // Clearing from other loans in panel
  $("#loan_users").empty();
  $(".approval_check").empty();
  $("#loan_amounts").empty();

  // Clear all input fields
  $("#tab_contents input").val("");

  // Hides user data fields (name, role...) in Involved Parties tab when loan is loaded
  $("#user_data_fields").hide();

  // Not necessary anymore? Resetting is possible by using .html() ?
  // $('#pt_address').val('').hide();
  // $('label[for=pt_address').hide();
  // $('#pt_role').val('').hide();
  // $('label[for=pt_role').hide();
  // $('#pt_name').val('').hide();
  // $('label[for=pt_name').hide();

  activeLoanId = htmlObject.getAttribute("data-storage-key");

  if (activeLoanId.includes("bc")) {
    $("#writeToChain").hide();
    $("#updateToChain").show();
    $("#btn_approveLoan").show();

    // Making tabs accessible for loans after loading from bc
    $("#tab-B, #tab-C, #tab-D, #tab-E").show();
  } else if (activeLoanId.includes("id_s")) {
    $("#writeToChain").hide();
    $("#updateToChain").hide();
    $("#btn_approveLoan").hide();

    // Making tabs accessible for sample loans
    $("#tab-B, #tab-C, #tab-D, #tab-E").show();
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
    $(".heading_text").html(loanObj.name);
    $("#loanName").val(loanObj.name);

    $("#loanPurpose").val(loanObj.purpose);

    if (activeLoanId.includes("bc")) $("#loanId").val(loanObj.id);
    if (!activeLoanId.includes("bc"))
      $("#loanId").val("Not yet registered on Blockchain");
    $("#state").val(loanObj.state);
    $("#revisionNumber").val(loanObj.revisionNumber);
    $("#regParty").val(loanObj.registeringParty);
    // $('#loanDate').val(loanObj.date);
    $("#loanDate").val(getDateInFormat(undefined, loanObj.date));

    // Check if JSON dataString exists and then fill fields
    if (loanObj.dataStringObj) {
      var o = loanObj.dataStringObj;
      // console.log(o);
      if (o.purpose) $("#loanPurpose").val(loanObj.dataStringObj.purpose);
      if (o.descript) $("#object_descript").val(loanObj.dataStringObj.descript);
      if (o.total_area) $("#total_area").val(loanObj.dataStringObj.total_area);
      if (o.usable_area)
        $("#usable_area").val(loanObj.dataStringObj.usable_area);
      if (o.outdoor_area)
        $("#outdoor_area").val(loanObj.dataStringObj.outdoor_area);
      if (o.object_price)
        $("#object_price").val(loanObj.dataStringObj.object_price);
      if (o.price_sqm) $("#price_sqm").val(loanObj.dataStringObj.price_sqm);
    }

    // Checking the id and owner status of current user
    if (loanObj.userId == 0) {
      $("#registration_info").text(
        "You registered this loan and have special permissions"
      );
    } else if (loanObj.userId) {
      $("#registration_info").text("You are part of this loan");
    } else {
      $("#registration_info").text("");
    }

    // Loads parties (users in loan) with approval status
    loadParties();

    // Evaluation of loan amounts
    calculateTotalAmount();

    $('[id^="amount"]')
      .change(function() {
        calculateTotalAmount();
      })
      .keydown(function() {
        calculateTotalAmount();
      })
      .keyup(function() {
        calculateTotalAmount();
      });
  } else {
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
  $(".valueHolder1").empty();
  // Check case that loan in creation has got no addresses
  try {
    if (!loanObj.addresses) throw "Error: No addresses in loan object found";

    addr = loanObj.addresses;

    // Add check to see if user is YOU
    for (i = 0; i < addr.length; i++) {
      // console.log("Approval Status:" + loanObj.approvalStatus[i]);
      info = "";
      disable = true;

      if (i == loanObj.userId) {
        info = "(You)";
        disable = false;
      }

      // console.log("addr[i] :" + addr[i]);
      // console.log(typeof addr[i]);
      // console.log("userMap[addr[i]].name " + userMap[addr[i]].name);
      if (userMap[addr[i]]) {
        userName = userMap[addr[i]].name;
        userRole = userMap[addr[i]].role;
      } else {
        userName = "Unregistered";
        userRole = "";
      }

      // Retrieves the loan amount of user at array position i, corresponding to address at position i
      userLoanSum = loanObj.loanAmounts[i];

      // Add users to UI Approval Status Panel
      $(".approval_check").append(` 
            <div class="form-group">
                <input type="checkbox" id="user_${i}" title="${
        addr[i]
      }" disabled>
                <label for="user_${i}" title="${
        addr[i]
      }">${userName} ${info}</label>
            </div>
            `);

      $("#loan_amounts").append(`
            <div class="form-label-group float-lab input_float_lbl">
                <input type="text" id="amount_user_${i}" class="form-control" name="amount_user_${i}" value="${userLoanSum}"
                    required disabled>
                <label for="amount_user_${i}"><span>${userName} (${i})</span></label>
                <span class="euro">€</span>
            </div>`);
      if (!disable) $(`#amount_user_${i}`).prop("disabled", false);

      // Create dropdown items in involved parties tab ---> loading details (loadUserDetail) from document.ready
      menuItems += `<div class="dropOption" id="pt_user_${i}" title="${
        addr[i]
      }">${userName} (${i})</div>`;
      $("#involved_dropdown").html(menuItems);

      if (loanObj.approvalStatus[i] == true) {
        $(`#user_${i}`).prop("checked", true);
      } else {
        $(`#user_${i}`).prop("checked", false);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

// Loads user data into form <section id="user_data_fields"> when selected in dropdown [Involved Parties Tab]
// called from document.ready
function loadUserDetail(address) {
  if (userMap[address]) {
    userName = userMap[address].name;
    userRole = userMap[address].role;
  } else {
    userName = "Unregistered";
    userRole = "Unknown";
  }

  $("#pt_address")
    .val(address)
    .closest("div")
    .addClass("input_float_lbl");
  $("#pt_role")
    .val(userRole)
    .closest("div")
    .addClass("input_float_lbl");
  $("#pt_name")
    .val(userName)
    .closest("div")
    .addClass("input_float_lbl");
}

function createSignUpDropdown() {
  var drop = $("#signUpDropDown");
  var i;
  var htmlString = '<div class="dropContainer">';
  for (i = 0; i < select_arr.length; i += 1) {
    htmlString += '<div class="dropOption">' + select_arr[i] + "</div>";
  }
  htmlString += "</div>";
  drop.append(htmlString);
}

// Function: UI
$(document).ready(function() {
  createSignUpDropdown();
  // createLoanUsersDropDown();

  // Event handler for SignUp Dropdown menu
  $("#signUpDropDown").on("click", function(event) {
    var container = $(this).children("div.dropContainer");
    var target = $(event.target);

    container.toggle();
    $(this).toggleClass("select_border");
    if (target.hasClass("dropOption")) {
      $(this)
        .find("span.valueHolder1")
        .text(target.text());
      $(this)
        .children("span.valueHolder")
        .addClass("float-label");
    }
  });

  // Event handler for involved parties tab dropdown
  $("#participant_dropdown").on("click", function(event) {
    var container = $(this).children("div.dropContainer");
    var target = $(event.target);

    container.toggle();
    $(this).toggleClass("select_border");
    if (target.hasClass("dropOption")) {
      $(this)
        .find("span.valueHolder1")
        .text(target.text());
      loadUserDetail(target.attr("title"));
      $("#user_data_fields").show();
      $(this)
        .children("span.valueHolder")
        .addClass("float-label input_float_lbl");
    }
  });

  // Input floating label js
  // MJ: Function: UI
  $(".form-label-group input")
    .focus(function() {
      // $(this).parent().removeClass("round");
      $(this)
        .parent()
        .addClass("input_float_lbl");
    })
    .blur(function() {
      $(this)
        .parent()
        .removeClass("input_float_lbl");
      tmpval = $(this).val();
      if (tmpval == "") {
        $(this)
          .parent()
          .removeClass("input_float_lbl");
      } else {
        $(this)
          .parent()
          .addClass("input_float_lbl");
      }
    });

  $(".date_picker").datepicker({
    autoclose: true
  });

  $(".add_applications").click(function() {
    $(".appplication_section ul li.active").removeClass("active");
  });
}); // MJ: end of callback in document.reayd()

// Comment functionality off
let appendComment = (comment, user) => {
  $(".History_pannel ul").prepend(`<li>
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
        </li>`);
};

// MJ: Function returns date as string, option: full, with month name, or regular
// Function: UI
getDateInFormat = (format, timestamp) => {
  // check If UNIX timestamp is passed (e.g. for solidity date functions)
  if (timestamp) {
    var today = new Date(timestamp * 1000);
  } else {
    var today = new Date();
  }

  if (format == "full") {
    var dd = today.getDate();
    var yyyy = today.getFullYear();
    var month = monthNames[today.getMonth()];
    today = dd + " " + month + " " + yyyy;
    return today;
  } else if (format == "time") {
    var hh = today.getHours();
    var min = today.getMinutes();
    if (min < 10) min = `0${min}`; //adds the zero
    today = dd + "/" + mm + "/" + yyyy;
    today = `${hh}:${min}`;
    return today;
  } else {
    var dd = today.getDate();
    var yyyy = today.getFullYear();
    var mm = today.getMonth() + 1;
    today = dd + "/" + mm + "/" + yyyy;
    return today;
  }
};


// Function: Logic
async function submitFormData() {    
  //console.log('submitFormData() called');

  // validate input data
  const constraints = {
    companyName: {
        presence: true
    }
  }
  var form = $("#signupForm");
  var values = await validate.collectFormValues(form);
  var errors = validate(values, constraints);
  showErrors(form[0], errors);
  var role = $('#signUpDropDown .valueHolder1').text();
  if(!role) $('#signUpDropDownWrapper .messages').html(`<p class="help-block error">Role name can't be blank</p>`)
  else $('#signUpDropDownWrapper .messages').html(``)
  
  if (!errors) {
    if (devMode) alert("submitFormData() called");
    var userObj = {};

    userObj.company = $("#companyName").val();
    userObj.address = $("#signUpAddress").val();
    userObj.firstName = $("#firstName").val();
    userObj.lastName = $("#lastName").val();
    userObj.role = $("#signUpDropDown .valueHolder1").text();

    localStorage.setItem($("#signUpAddress").val(), JSON.stringify(userObj));
    // signUpRegistration(userObj.company, userObj.role, userObj.address);
  }
};

// Function: UI. Summing up loan amounts in html form
function calculateTotalAmount() {
  let sum = 0;
  // Set field value equal zero
  $("#total_value").val(sum);

  // Retrieve array with all the loan amount input fields
  loanInputs = $('[id^="amount"]');

  // Parsing text field values and summing up

  for (i = 0; i < loanInputs.length; i++) {
    sum = parseFloat(sum) + parseFloat(loanInputs[i].value);
  }
  $("#total_value").val(sum);
  $("#total_value")
    .closest("div")
    .addClass("input_float_lbl");
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

// custom file upload js
$("#chooseFile").bind("change", function() {
  var filename = $("#chooseFile").val();
  if (/^\s*$/.test(filename)) {
    $(".file-upload").removeClass("active");
    $("#noFile").text("No file chosen...");
  } else {
    $(".file-upload").addClass("active");
    $("#noFile").text(filename.replace("C:\\fakepath\\", ""));
  }
});

/* ------Redirect to Logout---------*/
Logout = () => {
  window.location.href = "Signup.html";
};
