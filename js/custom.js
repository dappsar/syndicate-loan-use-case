var select_arr = ['Loan Taker', 'Seller', 'Confidant']
$(document).ready(function(){
    function createDropdown(){
        var drop = $('#customDropdown');
        var i;
        var htmlString = '<div class="dropContainer">';
        for( i=0; i < select_arr.length; i +=1){
            htmlString += '<div class="dropOption">'+select_arr[i]+'</div>';
        }
        htmlString += '</div>';
        drop.append(htmlString); 
    }
    createDropdown();

    $('#customDropdown').on('click', function(event){
        var container = $(this).find('.dropContainer');
        var target = $('#customDropdown');
        var target = $(event.target);

        if(target.hasClass('valueHolder') || target.hasClass('valueHolder1') || target.attr('id')=== 'customDropdown'){
            container.show();
            $('#customDropdown').addClass('select_border');
        }else if(target.hasClass('dropOption')){     
            $('#customDropdown').removeClass('select_border');               
            $(this).find('span.valueHolder1').text(target.text());
            $('.valueHolder').addClass('float-label');
            container.hide();
        }
    })

    /* ----------Input floating label js------------- */
    $(".form-label-group input").focus(function(){
        // $(this).parent().removeClass("round");
        $(this).parent().addClass("input_float_lbl");
     
       }).blur(function(){
            $(this).parent().removeClass("input_float_lbl");
            tmpval = $(this).val();
            if(tmpval == '') {
                $(this).parent().removeClass('input_float_lbl');
                
            } else {
                $(this).parent().addClass('input_float_lbl');
                
            }
       })
    /* ----------End Input floating label js------------- */    


});

/* ----storing input data on browser------ */


function myFunction(){
    const fname = document.getElementById("inputFname").value;
    const lname = document.getElementById("inputLname").value;
    const cname = document.getElementById("inputCompany").value;
    const bchain = document.getElementById("inputPublic").value;
    const sbtn = document.getElementById("submit_btn").value;
    
    console.log(fname, lname);
    if(fname && lname && cname && bchain){
        localStorage.setItem(fname, lname, cname, bchain);
    }
}


