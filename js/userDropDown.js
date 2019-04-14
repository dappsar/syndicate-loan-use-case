// Initialize with the list of symbols

let names = ["ING (Sample)", "Real Dev GmbH (Sample)", "Albrecht (Sample)"];

function fillUserArray() {
    for (i = 0; i < globalUserArray.length; i++) {
        names.push(globalUserArray[i].name);
    }
    buildDropDown(names);
}


//Find the input search box
let search = document.getElementById("searchField")

//Find every item inside the dropdown
let items = document.getElementsByClassName("dropdown-item")
// An idea, as [My Profile] uses the same class, which causes problems
// items.shift();
// items.shift();

function buildDropDown(values) {
    // to avoid duplication of items
    $('[id^="menuItem"] .dropdown-item').remove();

    let contents = []
    for (let name of values) {
    contents.push('<input type="button" class="dropdown-item" type="button" value="' + name + '"/>')
    }
    $('[id^="menuItem"]').append(contents.join(""))

    //Hide the row that shows no items were found
    $('[id^="empty"]').hide()
}

//Capture the event when user types into the search box
window.addEventListener('input', function () {
    filter(search.value.trim().toLowerCase())
})



//For every word entered by the user, check if the symbol starts with that word
//If it does show the symbol, else hide it
function filter(word) {
    let lngth = items.length
    let collection = []
    let hidden = 0
    for (let i = 0; i < lngth; i++) {
        if (items[i].value.toLowerCase().startsWith(word)) {
            $(items[i]).show()
        }
        else {
            $(items[i]).hide()
            hidden++
        }
    }

    //If all items are hidden, show the empty view
    if (hidden === lngth) {
        $('[id^="empty"]').show()
    }
    else {
        $('[id^="empty"]').hide()
    }
}



//If the user clicks on any item, set the title of the button as the text of the item
$('[id^="menuItem"]').on('click', '.dropdown-item', function(){
    $('[id^="dropdown_users"]').text($(this)[0].value)
    $('[id^="dropdown_users"]').dropdown('toggle');
})

buildDropDown(names);