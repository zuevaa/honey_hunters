function alert(message) {
    $('#alert').empty();
    $('#alert').append('<div class="alert alert-danger alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>');
}

function getMessage() {
    $.get('/rest/message', function( data ) {
        $('.card-row').empty();
        data.forEach(element => {
            $('.card-row').append('<div class="col-4 col-sm-12 col-md-6 col-lg-4 card-cell"> \
                    <div class="card"> \
                        <div class="card-body"> \
                            <h5 class="card-title">'+element.name+'</h5> \
                            <h5 class="card-email">'+element.email+'</h5> \
                            <p class="card-text">'+element.message+'</p> \
                        </div> \
                    </div> \
                </div>');
        });
    })
    .fail(function(data) {
        alert(data.message);
    });
}

function addMessage(message) {
    console.log(message);
    $.post('/rest/message', JSON.stringify(message), function( data ) {
        getMessage();
    })
    .fail(function() {
        alert(data.message);
    });
}

$( document ).ready(function() {
    getMessage();
    $('#addMessage').click(function(event) {
        event.preventDefault();
        var error = false;
        console.log($('#name').val() == '');
        console.log($('#name').val());
        
        if ($('#name').val() == '') {
            $('#name').addClass('is-invalid');
            error = true;
        }
        else {
            $('#name').removeClass('is-invalid');
        }
        if ($('#email').val() == '') {
            $('#email').addClass('is-invalid');
            error = true;
        }
        else {
            var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!re.test(String($('#email').val()).toLowerCase())) {
                $('#email').addClass('is-invalid');
                error = true;                
            }
            else {
                $('#email').removeClass('is-invalid');
            }
        }
        if ($('#message').val() == '') {
            $('#message').addClass('is-invalid');
            error = true;
        }
        else {
            $('#message').removeClass('is-invalid');
        }
        if (error) {
            return;
        }
        var message = {};
        message.name = $('#name').val();
        message.email = $('#email').val();
        message.message = $('#message').val();
        addMessage(message);
        $(':input','#message_form')
            .not(':button, :submit, :reset, :hidden')
            .val('')
            .prop('checked', false)
            .prop('selected', false);
    });
});