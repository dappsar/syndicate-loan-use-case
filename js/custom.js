var select_arr = ['Loan Taker', 'Seller', 'Confidant']
$(document).ready(function(){
    function createDropdown(){
        var drop = $('.customDropdown');
        var i;
        var htmlString = '<div class="dropContainer">';
        for( i=0; i < select_arr.length; i +=1){
            htmlString += '<div class="dropOption">'+select_arr[i]+'</div>';
        }
        htmlString += '</div>';
        drop.append(htmlString); 
    }
    createDropdown();

    $('.customDropdown').on('click', function(event){

        var container = $(this).children('div.dropContainer');
        var target = $(event.target);
        
        container.toggle();
        $(this).toggleClass('select_border');
        if(target.hasClass('dropOption')){     
            $(this).find('span.valueHolder1').text(target.text());
            $(this).children('span.valueHolder').addClass('float-label')
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

    /* ---------Appliaction tab js------- */
    
    $('.appplication_section ul li').click(function() {
        $('.appplication_section ul li.active').removeClass('active');
        $(this).closest('li').addClass('active');
    });

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


