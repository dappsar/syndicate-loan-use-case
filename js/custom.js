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

    $('.appplication_section ul li').click(function () {
        $('.appplication_section ul li.active').removeClass('active');
        $(this).closest('li').addClass('active');
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
    console.log(sessionStorage.setItem('user', JSON.stringify(formData[0].value)))
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
    console.log('setter:: ', key, typeof value, value)
    return JSON.parse(localStorage.setItem(key, JSON.stringify(value)));
}



/* ----setting up the values of fields------ */
formValueSetter = (data) => {
    let formData = document.getElementsByClassName("form-control")
    for (i = 0; i < formData.length; i++) {
        formData[i].value = data[formData[i].name] ? data[formData[i].name] : '';//value binding
        formData[i].parentElement.className = "form-label-group float-lab input_float_lbl"//class binding
    }
}



/* ----storing pre defined data on browser------ */
var keyData = (tab) => {
    let keyDataObject = getLocalStorage(tab)
    if (keyDataObject)
        settingUpDropDown(keyDataObject);
    else {
        //defining key data 
        keyDataObject = setUpEnv(tab);
        settingUpDropDown(keyDataObject);
        //storing data in localstorage
        formValueSetter(keyDataObject);
        setLocalStorage(tab, keyDataObject)
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
    if (tab == 'involvedParties')
        keyData('involvedParties')

    let DetailsObject = getLocalStorage(tab)
    if (DetailsObject)
        formValueSetter(DetailsObject);
    else {
        DetailsObject = setUpEnv(tab)
        formValueSetter(DetailsObject);
        calculateTotalAmount();
        //storing data in localstorage
        setLocalStorage(tab, DetailsObject)
    }
        

}



let modal = ''//variable to store modal tab
modalValue = (tabName) => modal = tabName;


//comment saved locally
storeComment = () => {
    let comment = document.getElementById('comment').value;
    let commentedData = getLocalStorage('comment')
    let user = JSON.parse(sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')) : 'unknown User'//getting current user
    user = `${user}-${modal}`

    if (commentedData) {
        commentedData = Object.assign(commentedData, { [user]: { 'comment': comment } })
        setLocalStorage('comment', commentedData)
    }
    else
        setLocalStorage('comment', { [user]: { 'comment': comment } })
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
