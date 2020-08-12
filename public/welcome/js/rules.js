$(document).ready(function(){
    $(".next-one").click(function(){
        var form = $("#myform");
        form.validate({
            errorElement: 'span',
            errorClass: 'help-block',
            highlight: function(element, errorClass, validClass) {
                $(element).closest('.form-group').addClass("has-error");
            },
            unhighlight: function(element, errorClass, validClass) {
                $(element).closest('.form-group').removeClass("has-error");
            },
            rules: {  
                email: {
                    required: true,
                    minlength: 3,
                },     
                
            },
            messages: {                
                packagetype: {
                    required: "Please select a package",
                },          
                email: {
                    required: "Email required",
                },      
            }
        });
        if (form.valid() === true){
            current_fs = $('#step-one');
            next_fs = $('#steps-two');
          
            next_fs.show();
            current_fs.hide();
        }
    }); // end of step one
    $('#previous').click(function(){        
        current_fs = $('#steps-two');
        previous_fs = $('#step-one');

        previous_fs.show();
        current_fs.hide();
    });
});