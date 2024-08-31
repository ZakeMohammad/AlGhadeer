$(function () {
    
    $('.list-inline li > a').click(function () {
        var activeForm = $(this).attr('href') + ' > form';
        $(activeForm).addClass('magictime swap');

        setTimeout(function () {
            $(activeForm).removeClass('magictime swap');
        }, 1000);
    });
});






localStorage.clear();

document.getElementById('LoginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let UserName = document.getElementById('UserName').value;
    let Password = document.getElementById('Password').value;
  


    fetch(`http://rashadalabbasy-001-site1.ctempurl.com/api/Login?UserName=${UserName}&Password=${Password}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        return response.text().then(Text => {
            if (!response.ok) {
                $.gritter.add({
                    title:  '!Falid to log in ',
                    text: `${Text}`
                });
                setTimeout(function() {
            $('.gritter-item').addClass('RedNot');
        }, 100);
              
                return Promise.reject(`Failed to log in: ${Text}`);
            }
           return Text;
        });
    })
    .then(Token => {

        localStorage.setItem('Token', Token);

        function parseJwt(Token) {
            try {
                if (!Token || typeof Token !== 'string') {
                    throw new Error('Invalid token format.');
                }
                const parts = Token.split('.');
                if (parts.length !== 3) {
                    throw new Error('Invalid token structure.');
                }
                const base64Url = parts[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const decodedPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const parsedPayload = JSON.parse(decodedPayload);
                return parsedPayload;
            } catch (error) {
                console.error('Failed to decode token:', error.message);
                return null;
            }
        }
        
        let decodedToken = parseJwt(Token);

        let AdminPermission = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authentication"];


        if(AdminPermission==0){
            $.gritter.add({
                title:  'Authorization header',
                text: `Access denied for system!`
            });
            setTimeout(function() {
        $('.gritter-item').addClass('RedNot');
    }, 100);
          
        }
        else{
            window.location.href='index.html';
        }
      


    })
    .catch(error => {
        console.error('Error:', error);
    });
});





