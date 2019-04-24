// The two arrays to be populated
var names = [];
var addresses = [];

// Fills array to be shown in global user list dropdown, called from retrieveUsers()
function fillUserArray() {

  if (devMode) console.log("fillUserArray() called");
  mapLength = Object.keys(userMap).length;

  if (mapLength > addresses.length) {
    for (i = 0; i < mapLength; i++) {
      // For loop iterates through keys of userMap object
      key = Object.keys(userMap)[i];

      // Check if address (=key) already exists is addresses array
      if (!addresses.includes(key)) {
        names.push(userMap[key].name);
        addresses.push(key);
      }
    }
    buildDropDown();
  } else {
    console.log("No additional users added, dropDown stays the same");
    return;
  }
}

function truncate(str, max) {
  return str.length > max ? str.substr(0, max - 1) + "…" : str;
}

//Find the input search box
let search = document.getElementById("searchField");

//Find every item inside the dropdown
let items = document.getElementsByClassName("user-dropdown-item");



function buildDropDown() {
  // if (devMode) console.log("buildDropDown() called");

  // Avoid duplication of items in html
  $('[id^="menuItem"] .user-dropdown-item').remove();

  let contents = [];

  for (i = 0; i < names.length; i++) {
    var addr_trunc = truncate(addresses[i], 8);

    contents.push(
      `<input type="button" class="user-dropdown-item dropdown-item" title="${
        addresses[i]
      }" "type="button" value="${names[i]} (${addr_trunc})"/>`
    );
  }
  $('[id^="menuItem"]').append(contents.join(""));

  //Hide the row that shows no items were found
  $('[id^="empty"]').hide();
}

// Capture the event when user types into the search box
$('#searchField')
.keydown(function() {
  filter(search.value.trim().toLowerCase());
})
.keyup(function() {
  filter(search.value.trim().toLowerCase());
});

//For every word entered by the user, check if the symbol starts with that word
//If it does show the symbol, else hide it
function filter(word) {
  let lngth = items.length;
  let collection = [];
  let hidden = 0;
  for (let i = 0; i < lngth; i++) {
    if (items[i].value.toLowerCase().startsWith(word)) {
      $(items[i]).show();
    } else {
      $(items[i]).hide();
      hidden++;
    }
  }

  //If all items are hidden, show the empty view
  if (hidden === lngth) {
    $('[id^="empty"]').show();
  } else {
    $('[id^="empty"]').hide();
  }
}

//If the user clicks on any item, set the title of the button as the text of the item
$('[id^="menuItem"]').on("click", ".user-dropdown-item", function() {
  // $('[id^="dropdown_users"]').text($(this)[0].value);
  $('[id^="dropdown_users"]').dropdown("toggle");
  $("#input_add_user").val($(this)[0].title); 
  $("#input_add_user")
    .closest("div")
    .addClass("input_float_lbl");
});

buildDropDown();
