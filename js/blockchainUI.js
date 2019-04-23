/*  
   From here: Functionality regarding the User Interface (UI)  
*/
function printAddress(_address) {
  $(".bc_address").val(_address);
  $(".bc_address").html(_address);

  // Consider: pass into onLoad event listener
  userAccount = _address;
}

// Notification currently popping up in History Panel
function txNotifyUI(event, caller, _id, _userAddress) {
  $("#tx_current").removeClass("d-none");
  if (devMode) alert("called txNotifyUI");

  let date = getDateInFormat();
  let time = getDateInFormat("time");

  if (event == "send") {
    switch (caller) {
      case "create":
        message = "<strong>Creating loan...</strong>";
        break;
      case "update":
        message = "<strong>Updating loan...</strong>";
        break;
      case "approve":
        message = "<strong>Approving loan...</strong>";
        break;
      case "register":
        message = "<strong>Registering user...</strong>";
        break;
      case "add":
        message = "<strong>Adding user to loan...</strong>";
        break;
      case "delete":
        message = `<strongDeleting loan...</strong>`;
    }
    $("#tx_text").html(
      "Sending transaction to the Blockchain Network. " + message
    );
    $("#tx-date").html(`${date}<span class="time" id="tx-time">${time}</span>`);
  } else if (event == "conf") {
    switch (caller) {
      case "create":
        message = "<strong>Loan successfully created.</strong>";
        break;
      case "update":
        message = `<strong>Loan (${_id}) successfully updated.</strong>`;
        break;
      case "approve":
        message = `<strong>Loan (${_id}) successfully approved.</strong>`;
        break;
      case "register":
        message = `<strong>User ${truncate(
          _userAddress,
          12
        )} was successfully registered.</strong>`;
        break;
      case "add":
        message = `<strong>User ${truncate(
          _userAddress,
          12
        )} added to loan (${_id}).</strong>`;
        break;
      case "delete":
        message = `<strong>Loan (${_id}) was successfully deleted.</strong>`;
    }
    $("#tx_text").html("Transaction confirmed. " + message);
    $("#tx-date").html(`${date}<span class="time" id="tx-time">${time}</span>`);

    // Writing Tx to local storage and UI (TX History)
    writeTxHistory(message, date, time);
  }
}

// var txCounter;
// localStorage.setItem('tx_counter', txCounter);

function writeTxHistory(_message, _date, _time) {
  if (devMode) console.log("writeTxHistory called");

  $("#tx_info_no_tx").hide();
  $("#tx_history").append(`
    <li>
        <div class="histroy_detail">
            <div class="top_section">
                <p class="date" >${_date}<span class="time">${_time}</span></p>
            </div>
            <p class="banks_application">${_message}</p>
        </div>
    </li>`);

  // If no object in Storage, write history object and counter
  // Improve so that highest key number is read
  if (localStorage.getItem("tx_hist") == null) {
    //console.log("localStorage.getItem('tx_hist') == null");

    // Init object for storage
    var localTxHistory = {};
    var txCounter = 0;
    localStorage.setItem("tx_counter", txCounter);
    localStorage.setItem("tx_hist", JSON.stringify(localTxHistory));
  } else {
    localTxHistory = JSON.parse(localStorage.getItem("tx_hist"));
    var txCounter = localStorage.getItem("tx_counter");
    if (!txCounter || txCounter == "undefined") txCounter = 0;
  }

  // Load array from storage and append current tx_object, then write to storage again
  // localTxHistory = localStorage.getItem('tx_hist');

  txObject = { message: _message, date: _date, time: _time };
  //console.log(txObject);

  localTxHistory[txCounter] = txObject;
  localStorage.setItem("tx_hist", JSON.stringify(localTxHistory));

  txCounter++;
  localStorage.setItem("tx_counter", txCounter);
}

function loadTxHistory() {
  if (devMode) console.log("loadTxHistory() called ");
  localTxHistory = JSON.parse(localStorage.getItem("tx_hist"));

  n = Object.keys(localTxHistory).length;
  for (i = 0; i < n; i++) {
    _message = localTxHistory[i].message;
    _date = localTxHistory[i].date;
    _time = localTxHistory[i].time;

    $("#tx_info_no_tx").hide();
    $("#tx_history").append(`
        <li>
            <div class="histroy_detail">
                <div class="top_section">
                    <p class="date" >${_date}<span class="time">${_time}</span></p>
                </div>
                <p class="banks_application">${_message}</p>
            </div>
        </li>`);
  }
}

// Prints Network to Front-End (Header) and reacts dynamically to changes
function printNetwork() {
  web3.eth.net.getId().then(netId => {
    switch (netId) {
      case 1:
        // console.log('This is Mainnet');
        $("#bc_network").html(
          'Ethereum Mainnet <span class="warning"> - Please switch to Kovan - </span>'
        );
        break;
      case 2:
        // console.log('This is the deprecated Morden test network.');
        $("#bc_network").html(
          'Morden <span class="warning"> - Please switch to Kovan - </span>'
        );
        break;
      case 3:
        // console.log('This is the Ropsten test network.');
        $("#bc_network").html(
          'Ropsten <span class="warning"> - Please switch to Kovan - </span>'
        );
        break;
      case 4:
        // console.log('This is the Rinkeby test network.');
        $("#bc_network").html(
          'Rinkeby <span class="warning"> - Please switch to Kovan - </span>'
        );
        break;
      case 5:
        // console.log('This is the network with ID 5');
        $("#bc_network").html(netId);
        break;
      case 42:
        // console.log('This is the Kovan test network);
        $("#bc_network").html("Kovan");
        break;
      default:
        // console.log('This is an unknown network.');
        $("#bc_network").html(
          'Unkown <span class="warning"> - Please switch to Kovan - </span>'
        );
    }
  });
}
