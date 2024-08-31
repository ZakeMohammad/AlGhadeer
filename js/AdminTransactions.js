document.addEventListener("DOMContentLoaded", function() {
var token = localStorage.getItem('Token');
if(token==null){
window.location.href='login.html';
}


function parseJwt(token) {
    try {
        if (!token || typeof token !== 'string') {
            throw new Error('Invalid token format.');
        }
        const parts = token.split('.');
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

let decodedToken = parseJwt(token);

    let AdminImage = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone"];
    let AdminIDtoken = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid"];
    let AdminName = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

    let CurrentAdminPermission = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authentication"];


    if(AdminIDtoken == undefined)
    {  window.location.href = 'login.html';
    }
    let GetAdmin=()=>{
        fetch(`http://rashadalabbasy-001-site1.ctempurl.com/api/Admin/${AdminIDtoken}`,{
         method:'GET',
         headers:{
              'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
        }
        }).then(response=>{
            if(response.status!=200)
            {
                window.location.href = 'login.html';
                return;
            }
            else 
            return response.json();
        })
    };

    GetAdmin();
    
    function ChangeDateFormat(datetochange)
    {
        const date = new Date(datetochange);

        const options = { day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric', hour12: true };
        const formattedDate = date.toLocaleDateString('en-US', options).replace(',', ''); 
        return formattedDate; 
    }


document.getElementById('AdminImage').src =`http://rashadalabbasy-001-site1.ctempurl.com/Images/AdminImages/${AdminImage}`;
document.getElementById('AdminName').innerText =`${AdminName}`;
document.getElementById('UpdateMyPage').href=`UpdateAdmin.html?id=${AdminIDtoken}`;

function ShowID(id) {
   
}

if (window.location.pathname === '/index.html') {

const urlParams = new URLSearchParams(window.location.search);
const IsDenide = urlParams.get('id');

if(IsDenide !== null){
    $.gritter.add({
        title: '! تم حجب الوصول',
        text: 'لا يوجد لديك صلاحيات كافية لعرض الصفحة',
    });
    setTimeout(function() {
$('.gritter-item').addClass('RedNot');
}, 100);
}




    let DeleteThisCommit=0;

fetch('http://rashadalabbasy-001-site1.ctempurl.com/api/AdminPanelContent/DashpoordData', {
    method: 'GET', 
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
})
.then(response => {
    if (response.ok) {
        return response.json();
    }
    throw new Error('Network response was not ok.');
})
.then(data => {
    FillDashopoorData(data);
   
    
})
.catch(error => {
    console.error('There was a problem with the fetch operation:', error);
});


fetch('http://rashadalabbasy-001-site1.ctempurl.com/api/MainContant/AllCommits', {
    method: 'GET', 
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(response => {
    if (response.ok) {
        return response.json();
    }
    throw new Error('Network response was not ok.');
})
.then(data => {
    FillCommits(data);
})
.catch(error => {
    console.error('There was a problem with the fetch operation:', error);
});


function FillDashopoorData(Data){
    document.getElementById('AllAppointmetns').innerText=Data[0];
    document.getElementById('AvaliabelAppointmetns').innerText=Data[1];
    document.getElementById('closedrooms').innerText=Data[2];
    document.getElementById('AllStafs').innerText=Data[3];
    document.getElementById('numberofadmins').innerText=Data[4];
    document.getElementById('AllBookings').innerText=Data[5];
    document.getElementById('AllCommits').innerText=Data[6];
    document.getElementById('AllVisits').innerText=Data[7];
    document.getElementById('numberofclaints').innerText=Data[8];
    document.getElementById('RateValiabel1').innerText=Data[9]+'%';
    document.getElementById('RateValiabel2').style.width=Data[9]+'%';
    document.getElementById('RateNotValiabel1').innerText=Data[10]+'%';
    document.getElementById('RateNotValiabel2').style.width=Data[10]+'%';
    document.getElementById('LatestCommit').innerText= ChangeDateFormat(Data[11]);
    document.getElementById('LatestBooking').innerText=ChangeDateFormat(Data[12]);
    document.getElementById('LatestPayment').innerText=ChangeDateFormat(Data[13]);
};

function detectLanguage(text) {
    
    const arabicPattern = /[\u0600-\u06FF]/;
    const englishPattern = /[A-Za-z]/;

    if (arabicPattern.test(text)) {
        return "Arabic";
    } else if (englishPattern.test(text)) {
        return "English";
    } else {
        return "Unknown";
    }
};


    
function FillCommits(Data){
const CommitsData=document.getElementById('CommitsChat');
CommitsData.innerHTML='';
let commitcountent='';


Data.forEach((onecommit)=>{
if(detectLanguage(onecommit.description)==='Arabic'){
    commitcountent+=` <li class="right clearfix">
                                        <span class="chat-img pull-right">
                                           <img loading="lazy"  src="http://rashadalabbasy-001-site1.ctempurl.com/Images/CommitImages/${onecommit.image}"  style="height: 50px; width: 50px;" alt="User Avatar" class="img-circle" />
                                        </span>
                                        <div class="chat-body clearfix">
                                            <div class="header"  style="display: flex; justify-content: space-between; align-items: center;">
                                       
                                          <a class="btn btn-danger btn-grad deletebutton" data-id="${onecommit.id}" data-toggle="modal" data-target="#buttonedModal">حذف</a>         
                                              <strong class="pull-right primary-font"> ${onecommit.name}</strong>
                                               
                                            </div>
                                            <br />
                                            <p  style="font-style:initial; text-align: right;">
                                            ${onecommit.description}
                                            </p>
                                        </div>
                                    </li>`;
}
else{
    commitcountent+=`<li class="left clearfix">
                                        <span class="chat-img pull-left" >
                                           <img loading="lazy"  src="http://rashadalabbasy-001-site1.ctempurl.com/Images/CommitImages/${onecommit.image}" style="height: 50px; width: 50px;" alt="User Avatar" class="img-circle" />
                                        </span>
                                        <div class="chat-body clearfix">
                                            <div class="header" style="display: flex; justify-content: space-between; align-items: center;">
                                                <strong class="primary-font "> ${onecommit.name} </strong>
                                             <a class="btn btn-danger btn-grad deletebutton" data-id="${onecommit.id}" data-toggle="modal" data-target="#buttonedModal">حذف</a>                                             </div> <br />
                                            <p>
                                            ${onecommit.description}
                                            </p>
                                        </div>
                                    </li>`;
}

});
CommitsData.innerHTML=commitcountent;
document.querySelectorAll('.deletebutton').forEach(button => {
    button.addEventListener('click', function() {
        let id = this.getAttribute('data-id');
        DeleteThisCommit=id;
    });
});

}; 



$('#DeleteApp').click(function ()
{ 

    fetch(`http://rashadalabbasy-001-site1.ctempurl.com/api/AdminPanelContent/DeleteCommit?ID=${DeleteThisCommit}`, {
        method: 'DELETE', 
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('CloseDelete').click();
            $.gritter.add({
               title:  '! تمت العملية بنجاح',
               text: ` تم حذف التعليق بواسطة الادمن ${AdminName}` ,
           });
           setTimeout(function() {
           $('.gritter-item').addClass('GreenNot');
           }, 100);
            return response.json();
        }
        else{
            document.getElementById('CloseDelete').click();
            $.gritter.add({
               title:  '! لم يتم الحذف',
               text: `فشلت عملية حذف التعليق يرجى المحاولة لاحقا` ,
           });
           setTimeout(function() {
           $('.gritter-item').addClass('RedNot');
           }, 100);
           return false;
           
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

});



}


        if (window.location.pathname === '/Bookings.html') {
            let BookingTabel=document.getElementById('TabelContent');
            var BookingChoosenID=0;

            fetch(`http://rashadalabbasy-001-site1.ctempurl.com/api/AdminPanelContent/GetBookings`,{
                method:'GET',
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem('Token')}`,
                   'Content-Type': 'application/json'
               }
               }).then(response=>{
                   if(response.status!=200)
                   { return;
                   }
                   else
                   return response.json();
               }).then(data=>{
               
                FillBookings(data);
               });

               function FillBookings(Data){

                let BookingContent = ''; 
                let Status='';

                Data.forEach(element=>{
                    if(element.status===1){
                        Status='style="background-color: orange; color: white;text-align:center"> Pending';
                    }
                    if(element.status===2){
                        Status='style="background-color: blue; color: white;text-align:center"> Confirmed';
                    }
                    if(element.status===3){
                        Status='style="background-color: green; color: white;text-align:center"> Active';
                    }  
                     if(element.status===4){
                        Status='style="background-color: rgb(3, 128, 121); color: white; text-align:center"> Completed';
                    }
                    if(element.status===5){
                        Status='style="background-color: red; color: white;text-align:center"> Cancelled';
                    }
                    BookingContent += ` <tr class="gradeA">
                                            <td> 
                                                <button class="btn btn-grad btn-danger deletebutton" data-id="${element.id}"  data-toggle="modal" data-target="#buttonedModal" title="حذف الحجز"><i class="fa-solid fa-trash"></i></button>
                                                <button class="btn btn-grad btn-info ChangeStatus" data-id="${element.id}" data-toggle="modal" data-target="#buttonedModal2"><i class="fa-solid fa-calendar-check" title=" تغيير حالة الحجز"></i></button>
                                             </td>
                                             <td class="center" style="text-align:center">${element.changeStatusByAdminID}</td>
                                            <td ${Status}</td>
                                            <td>${element.customerPhone}"</td>
                                            <td class="center"> ${element.customerName}</td>
                                            <td class="center" style="text-align:center">${element.cost.toFixed(2)}</td>
                                            <td class="center">${element.dateFrom}</td>
                                            <td class="center">${element.dateTo}</td>
                                            <td class="center">${element.bookingDate}</td>
                                            <td class="center">${element.appartmentID}</td>
                                            <td class="">${element.id}</td>
                                        </tr>`;
                                            }
                
                );
                
                BookingTabel.innerHTML = BookingContent; 
                
                document.querySelectorAll('.deletebutton').forEach(button => {
                    button.addEventListener('click', function() {
                        BookingChoosenID = this.getAttribute('data-id');
                    });
                });
                document.querySelectorAll('.ChangeStatus').forEach(button => {
                    button.addEventListener('click', function() {          
                        BookingChoosenID = this.getAttribute('data-id');
                    });
            
                });
                
                };




                    document.getElementById('DeleteApp').addEventListener('click',function(){


                        fetch(`http://rashadalabbasy-001-site1.ctempurl.com/api/AdminPanelContent/DeleteBooking?BookingID=${BookingChoosenID}`, {
                            method: 'DELETE', 
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('Token')}`,
                                'Content-Type': 'application/json'
                            }
                        })
                        .then(response => {
                            if (response.ok) {
                                document.getElementById('CloseDelete').click();
                                $.gritter.add({
                                   title:  '! تمت العملية بنجاح',
                                   text: ` تم حذف هذه الحجز ` ,
                               });
                               setTimeout(function() {
                               $('.gritter-item').addClass('InfNot');
                               }, 100);
                               setTimeout(() => {
                                window.location.reload();
                            }, 5000);
                                return response.json();
                            }
                            else{
                                document.getElementById('CloseDelete').click();
                                $.gritter.add({
                                   title:  '! لم يتم الحذف',
                                   text: `فشلت عملية حذف الحجز يرجى المحاولة لاحقا` ,
                               });
                               setTimeout(function() {
                               $('.gritter-item').addClass('RedNot');
                               }, 100);
                               setTimeout(() => {
                                window.location.reload();
                            }, 5000);
                               return false;
                               
                            }
                        })
                        .catch(error => {
                            console.error('There was a problem with the fetch operation:', error);
                        });
                    });





                    document.querySelector('.ConfimB').addEventListener('click',function(){

                        fetch(`http://rashadalabbasy-001-site1.ctempurl.com/api/AdminPanelContent/ChangeBookingStatus?BookingID=${BookingChoosenID}&StatusID=1&AdminID=${AdminIDtoken}`,{
                            method:'PUT',
                            headers:{
                                'Authorization': `Bearer ${localStorage.getItem('Token')}`,
                               'Content-Type': 'application/json'
                           }
                           }).then(response=>{
                         
                               return response.text();
                           }).then(data=>{
                            $.gritter.add({
                                title:  'نتيجة التعديل',
                                text: `${data}` ,
                            });
                            setTimeout(function() {
                            $('.gritter-item').addClass('InfNot');
                            }, 100);
                            setTimeout(() => {
                             window.location.reload();
                         }, 5000);
                            });
                    });

                    document.querySelector('.StartB').addEventListener('click',function(){

                        document.getElementById('CloseChanges').click();
                        fetch(`http://rashadalabbasy-001-site1.ctempurl.com/api/AdminPanelContent/ChangeBookingStatus?BookingID=${BookingChoosenID}&StatusID=2&AdminID=${AdminIDtoken}`,{
                            method:'PUT',
                            headers:{
                                'Authorization': `Bearer ${localStorage.getItem('Token')}`,
                               'Content-Type': 'application/json'
                           }
                           }).then(response=>{
                               return response.text();
                           }).then(data=>{
                            $.gritter.add({
                                title:  'نتيجة التعديل',
                                text: `${data}` ,
                            });
                            setTimeout(function() {
                            $('.gritter-item').addClass('InfNot');
                            }, 100);
                            setTimeout(() => {
                             window.location.reload();
                         }, 5000);
                            });
              
                    });
                    document.querySelector('.CancelB').addEventListener('click',function(){
                        document.getElementById('CloseChanges').click();

                        fetch(`http://rashadalabbasy-001-site1.ctempurl.com/api/AdminPanelContent/ChangeBookingStatus?BookingID=${BookingChoosenID}&StatusID=4&AdminID=${AdminIDtoken}`,{
                            method:'PUT',
                            headers:{
                                'Authorization': `Bearer ${localStorage.getItem('Token')}`,
                               'Content-Type': 'application/json'
                           }
                           }).then(response=>{
                      
                               return response.text();
                           }).then(data=>{
                            $.gritter.add({
                                title:  'نتيجة التعديل',
                                text: `${data}` ,
                            });
                            setTimeout(function() {
                            $('.gritter-item').addClass('InfNot');
                            }, 100);
                            setTimeout(() => {
                             window.location.reload();
                         }, 5000);
                            });
              
                    });
                    document.querySelector('.ComplaidB').addEventListener('click',function(){
                        document.getElementById('CloseChanges').click();
                        fetch(`http://rashadalabbasy-001-site1.ctempurl.com/api/AdminPanelContent/ChangeBookingStatus?BookingID=${BookingChoosenID}&StatusID=3&AdminID=${AdminIDtoken}`,{
                            method:'PUT',
                            headers:{
                                'Authorization': `Bearer ${localStorage.getItem('Token')}`,
                               'Content-Type': 'application/json'
                           }
                           }).then(response=>{
                      
                               return response.text();
                           }).then(data=>{
                            $.gritter.add({
                                title:  'نتيجة التعديل',
                                text: `${data}` ,
                            });
                            setTimeout(function() {
                            $('.gritter-item').addClass('InfNot');
                            }, 100);
                            setTimeout(() => {
                             window.location.reload();
                         }, 5000);
                            });
              
                    });


        } ;




        if (window.location.pathname === '/Payments.html') {


            let PaymentTabel=document.getElementById('TabelContent');
            var PaymentChoosenID=0;


            fetch(`  http://rashadalabbasy-001-site1.ctempurl.com/api/AdminPanelContent/GetPayments`,{
                method:'GET',
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem('Token')}`,
                   'Content-Type': 'application/json'
               }
               }).then(response=>{
                   if(response.status!=200)
                   { return;
                   }
                   else
                   return response.json();
               }).then(data=>{
               
                FillPaym(data);
               });

               function FillPaym(Data){
                let PaymContent = ''; 
                Data.forEach(element=>{
                    PaymContent += ` <tr class="gradeA">
                                            <td> 
                                                <button class="btn btn-grad btn-danger deletebutton"  data-toggle="modal" data-target="#buttonedModal"><i class="fa-solid fa-trash"></i></button>
                                             </td>
                                            <td>${element.date}</td>
                                            <td> ${element.amount.toFixed(2)}</td>
                                            <td class="center">${element.adminID}</td>
                                            <td class="center">${element.bookingID}</td>
                                            <td class="center">${element.id}</td>
                                        </tr> `;
                });

                PaymentTabel.innerHTML = PaymContent; 
                
                document.querySelectorAll('.deletebutton').forEach(button => {
                    button.addEventListener('click', function() {
                        PaymentChoosenID = this.getAttribute('data-id');
                    });
                });

                };



                document.getElementById('DeleteApp').addEventListener('click',function(){


                    fetch(`http://rashadalabbasy-001-site1.ctempurl.com/api/AdminPanelContent/DeletePayments?ID=${PaymentChoosenID}`, {
                        method: 'DELETE', 
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('Token')}`,
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response => {
                        if (response.ok) {
                            document.getElementById('CloseDelete').click();
                            $.gritter.add({
                               title:  '! تمت العملية بنجاح',
                               text: ` تم حذف هذه الفاتورة ` ,
                           });
                           setTimeout(function() {
                           $('.gritter-item').addClass('GreenNot');
                           }, 100);
                           setTimeout(() => {
                            window.location.reload();
                        }, 5000);
                            return response.json();
                        }
                        else{
                            document.getElementById('CloseDelete').click();
                            $.gritter.add({
                               title:  '! لم يتم الحذف',
                               text: `فشلت عملية حذف الفاتورة يرجى المحاولة لاحقا` ,
                           });
                           setTimeout(function() {
                           $('.gritter-item').addClass('RedNot');
                           }, 100);
                           setTimeout(() => {
                            window.location.reload();
                        }, 5000);
                           return false;
                           
                        }
                    })
                    .catch(error => {
                        console.error('There was a problem with the fetch operation:', error);
                    });
                });



        } ;

        if (window.location.pathname === '/Transactions.html') {
            let TrantTabel=document.getElementById('TabelContent');
            var TranChoosenID=0;


            fetch(`http://rashadalabbasy-001-site1.ctempurl.com/api/AdminPanelContent/GetTransaction`,{
                method:'GET',
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem('Token')}`,
                   'Content-Type': 'application/json'
               }
               }).then(response=>{
                   if(response.status!=200)
                   { return;
                   }
                   else
                   return response.json();
               }).then(data=>{
               
                FillTran(data);
               });

               function FillTran(Data){
                let TranContent = ''; 
                Data.forEach(element=>{
                    TranContent += `<tr class="gradeA">
                                            <td> 
                                                <button class="btn btn-grad btn-danger deletebutton" data-id="${element.id}"  data-toggle="modal" data-target="#buttonedModal"><i class="fa-solid fa-trash"></i></button>
                                                <button class="btn btn-grad btn-default ShowInfo" data-info="${element.description}"  data-toggle="modal" data-target="#buttonedModal2"><i class="fa-solid fa-eye"></i></button>
                                             </td>
                                            <td>${element.date}</td>
                                            <td> ${element.description}</td>

                                            <td class="">${element.id}</td>
                                        </tr> `;
                });

                TrantTabel.innerHTML = TranContent; 
                
                document.querySelectorAll('.deletebutton').forEach(button => {
                    button.addEventListener('click', function() {
                        TranChoosenID = this.getAttribute('data-id');
                    });
                });
    
                document.querySelectorAll('.ShowInfo').forEach(button => {
                    button.addEventListener('click', function() {
                        document.getElementById('NotificationMessege').innerText=this.getAttribute('data-info');;
                    });
                });

                };

                document.getElementById('DeleteApp').addEventListener('click',function(){


                    fetch(` http://rashadalabbasy-001-site1.ctempurl.com/api/AdminPanelContent/DeleteTransaction?ID=${TranChoosenID}`, {
                        method: 'DELETE', 
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('Token')}`,
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response => {
                        if (response.ok) {
                            document.getElementById('CloseDelete').click();
                            $.gritter.add({
                               title:  '! تمت العملية بنجاح',
                               text: ` تم حذف هذه الحركة ` ,
                           });
                           setTimeout(function() {
                           $('.gritter-item').addClass('GreenNot');
                           }, 100);
                           setTimeout(() => {
                            window.location.reload();
                        }, 5000);
                            return response.json();
                        }
                        else{
                            document.getElementById('CloseDelete').click();
                            $.gritter.add({
                               title:  '! لم يتم الحذف',
                               text: `فشلت عملية حذف الحركة يرجى المحاولة لاحقا` ,
                           });
                           setTimeout(function() {
                           $('.gritter-item').addClass('RedNot');
                           }, 100);
                           setTimeout(() => {
                            window.location.reload();
                        }, 5000);
                           return false;
                           
                        }
                    })
                    .catch(error => {
                        console.error('There was a problem with the fetch operation:', error);
                    });
                });

        } ;




        if (window.location.pathname === '/TimeLine.html') {
    


          fetch('http://rashadalabbasy-001-site1.ctempurl.com/api/AdminPanelContent/GetTimeLine', {
            method: 'GET', 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            document.getElementById('LastConfirm').innerText=`${data[0]}`;
            document.getElementById('LatestPayment').innerText=`${data[1]}`;
            document.getElementById('LatestVisit').innerText=` ${data[2] }   تم زيارة الموقع لاخر مرة بتاريخ  `;
            document.getElementById('LatestBooking').innerText=`${data[3]}`;
        })


        } ;




        if (window.location.pathname === '/Admins.html') {
           
            if (( CurrentAdminPermission & 1) !== 1){
                window.location.href='index.html?id=1';
                return;
            }

            let AdminsTabel=document.getElementById('TabelContent');
            var AdminChoosenID=0;
            let AdminChoosenPermissions=1;
            fetch(`http://rashadalabbasy-001-site1.ctempurl.com/api/Admin`,{
                method:'GET',
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem('Token')}`,
                   'Content-Type': 'application/json'
               }
               }).then(response=>{
                   if(response.status!=200)
                   { return;
                   }
                   else
                   return response.json();
               }).then(data=>{
               
                FillAllAdmins(data);
               });

               
function FillAllAdmins(Data){

    let AdminContent = ''; 
    Data.forEach(element=>{
            AdminContent += `<tr class="gradeA">
                                        <td> 
                                            <button class="btn btn-grad btn-danger deletebutton" data-id="${element.id}" title="حذف الادمن"  data-toggle="modal" data-target="#buttonedModal"><i class="fa-solid fa-trash"></i></button>
                                            <button class="btn btn-grad btn-primary updatePermisions" data-id="${element.id}"  title="تعديل صلاحيات الادمن" data-toggle="modal" data-target="#newReg" ><i class="fa-solid fa-screwdriver-wrench"></i></button>
                                         </td>
                                        <td>${element.permissions}</td>
                                        <td class="center">${element.username}</td>
                                        <td class="center">${element.name}</td>
                                        <td class="">${element.id}</td>
                                    </tr>`;
                                }
    
    );
    
    AdminsTabel.innerHTML = AdminContent; 
    
    document.querySelectorAll('.deletebutton').forEach(button => {
        button.addEventListener('click', function() {
            AdminChoosenID = this.getAttribute('data-id');
        });
    });



    document.querySelectorAll('.updatePermisions').forEach(button => {
        button.addEventListener('click', function() {

            AdminChoosenID = this.getAttribute('data-id');
            let GetAdminDetilsForPermissions=()=>{
                fetch(`http://rashadalabbasy-001-site1.ctempurl.com/api/Admin/${AdminChoosenID}`,{
                 method:'GET',
                 headers:{
             'Authorization': `Bearer ${localStorage.getItem('Token')}`,
                'Content-Type': 'application/json'
                }
                }).then(response=>{
                    if(response.status!=200)
                    {
                    }
                    else 
                    return response.json();
                }).then(Data=>{
                    AdminChoosenPermissions=Data.permissions;
                });
            };
        
            GetAdminDetilsForPermissions();
        });


  

    });
    








    
    };

let AllPermisonTest = 0;

const permissionValues = {
    All: -1,                         
    CrudOnAdmin: 1,                 
    CrudOnAppart: 2,                 
    ChangeBookingStatus: 4,          
    ShowPayments: 8,                 
    DeletePayment: 16,                
    ShowTransaction: 32,            
    DeleteTransaction: 64,            
    CrudOnLanding: 128,               
    CrudOnAbout: 256,                
    CrudOnSoical: 512,               
    CrudOnStafs: 1024                 
};
const box1View = document.getElementById('box1View');
const box2View = document.getElementById('box2View');
const to1Button = document.getElementById('to1');
const to2Button = document.getElementById('to2');
const allTo1Button = document.getElementById('allTo1');
const allTo2Button = document.getElementById('allTo2');

function calculatePermissions() {
    // Check if 'جميع الصلاحيات' is present in box2View
    const allPermissionsSelected = Array.from(box2View.options).some(option => option.value === '-1');
    
    if (allPermissionsSelected) {
        return -1; // All permissions
    }

    // Otherwise, calculate normally
    let total = 0;
    Array.from(box2View.options).forEach(option => {
        total += parseInt(option.value, 10) || 0;
    });
    return total;
}

function updateButtonsState() {
    const allPermissionsSelected = Array.from(box2View.options).some(option => option.value === "-1");
    
    to2Button.disabled = allPermissionsSelected;
    allTo2Button.disabled = allPermissionsSelected;
}

function updatePermissionsValue() {
    const permissionsValue = calculatePermissions();
    AllPermisonTest = permissionsValue;
    document.getElementById('PermisoinsNumber').innerText=`(${AllPermisonTest})`;

}

function moveAllOptionsToBox(targetBox) {
    const allOptions = Array.from(box1View.options);
    allOptions.forEach(option => {
        targetBox.add(option);
        option.selected = false;
    });
    updatePermissionsValue();
    updateButtonsState();
}

function moveSelectedOptions(source, target) {
    const selectedOptions = Array.from(source.selectedOptions);
    
    selectedOptions.forEach(option => {
        if (option.value === '-1' && target === box2View) { 
            moveAllOptionsToBox(target);
        } else {
            target.add(option);
        }
        option.selected = false;
    });
    updatePermissionsValue();
    updateButtonsState();
}

function moveSelectedOptionsBack(source, target) {
    const selectedOptions = Array.from(source.selectedOptions);

    selectedOptions.forEach(option => {
        if (option.value === '-1') { 
            moveAllOptionsToBox(target);
        } else {
            target.add(option);
        }
        option.selected = false;
    });
    updatePermissionsValue();
    updateButtonsState();
}

to1Button.addEventListener('click', () => moveSelectedOptions(box2View, box1View));
to2Button.addEventListener('click', () => moveSelectedOptions(box1View, box2View));
allTo1Button.addEventListener('click', () => moveAllOptionsToBox(box1View));
allTo2Button.addEventListener('click', () => moveAllOptionsToBox(box2View));

updatePermissionsValue();






document.querySelector('.UpdateForm').addEventListener('submit', function(event) {
    event.preventDefault();


    fetch(`http://rashadalabbasy-001-site1.ctempurl.com/api/Admin/ChangePermission${AdminChoosenID}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('Token')}`,
            'Content-Type': 'application/json' 
        },
        body: AllPermisonTest
    })
    .then(response => {
        document.getElementById('CloseUpdate').click();
        const contentType = response.headers.get('content-type');

        if (response.ok) {
            if (contentType && contentType.includes('application/json')) {
                return response.json();
            } else {
                return response.text(); 
            }
        } else {
            return response.text().then(text => {
                throw new Error(text);
            });
        }
    })
    .then(data => {
        $.gritter.add({
            title: '! تمت العملية بنجاح',
            text: 'تم  تعديل صلاحيات الادمن ',
        });
        setTimeout(() => {
            $('.gritter-item').addClass('GreenNot');
        }, 100);
        setTimeout(() => {
            window.location.reload();
        }, 5000);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error.message);
        $.gritter.add({
            title: '! لم تتم العملية',
            text:  'فشل في تعديل صلاحيات يرجى تعبئة جميع الحقول',
        });
        setTimeout(() => {
            $('.gritter-item').addClass('RedNot');
        }, 100);
        setTimeout(() => {
            window.location.reload();
        }, 5000);
    });

});




document.getElementById('DeleteApp').addEventListener('click',function(){


    fetch(`http://rashadalabbasy-001-site1.ctempurl.com/api/Admin/${AdminChoosenID}`, {
        method: 'DELETE', 
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('Token')}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('CloseDelete').click();
            $.gritter.add({
               title:  '! تمت العملية بنجاح',
               text: ` تم حذف الادمن  ` ,
           });
           setTimeout(function() {
           $('.gritter-item').addClass('InfNot');
           }, 100);
           setTimeout(() => {
            window.location.reload();
        }, 5000);
            return response.json();
        }
        else{
            document.getElementById('CloseDelete').click();
            $.gritter.add({
               title:  '! لم يتم الحذف',
               text: `فشلت عملية حذف الادمن يرجى المحاولة لاحقا` ,
           });
           setTimeout(function() {
           $('.gritter-item').addClass('RedNot');
           }, 100);
           setTimeout(() => {
            window.location.reload();
        }, 5000);
           return false;
           
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});




        } ;





        if (window.location.pathname === '/AddAdmin.html') {
    

            document.querySelector('.AddAdminForm').addEventListener('submit', function(event) {
                event.preventDefault();
            
                const imageFile1 = document.getElementById('Image1').files[0]; 

                const formData = new FormData(); 
                formData.append('Entity.ID', 0);
                formData.append('Entity.Username', document.querySelector('.Username').value);  
                formData.append('Entity.Name', document.querySelector('.Name').value);
                formData.append('Entity.Password', document.querySelector('.Password').value);
                formData.append('Entity.Permissions',0);
                formData.append('Entity.Image', '1');              
                formData.append('ImageFile1', imageFile1);
                formData.append('AddByAdminID', 1);
                fetch('http://rashadalabbasy-001-site1.ctempurl.com/api/Admin/AddNewAdmin', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('Token')}`
                    },
                    body: formData
                })
                .then(response => {
                    const contentType = response.headers.get('content-type');
                    
                    if (response.ok) {
                        $.gritter.add({
                            title: '! تمت العملية بنجاح',
                            text: 'تم اضافة  الادمن',
                        });
                        setTimeout(function() {
                            $('.gritter-item').addClass('GreenNot');
                        }, 100);
                        setTimeout(function() {
                            window.location.reload();
                        }, 5000);
                        if (contentType && contentType.includes('application/json')) {
                            return response.json();
                        } else {
                            return response.text(); 
                        }
                    } else {
                        $.gritter.add({
                            title: '! لم تتم العملية',
                            text:  'فشل في اضافة الادمن يرجى تعبئة جميع الحقول',
                        });
                        setTimeout(function() {
                            $('.gritter-item').addClass('RedNot');
                        }, 100);
                      
        
                        if (contentType && contentType.includes('application/json')) {
                            return response.json().then(errorData => {
                                throw new Error(errorData);
                            });
                        } else {
                            return response.text().then(errorText => {
                                throw new Error(errorText);
                            });
                        }
                    }
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error.message);
                });
                
        
            }
        );
        


        } ;






        if (window.location.pathname === '/UpdateAdmin.html') {

            let ID = new URLSearchParams(window.location.search).get('id');
        
                  
                    let GetAdmin=()=>{
                        fetch(`http://rashadalabbasy-001-site1.ctempurl.com/api/Admin/${ID}`,{
                         method:'GET',
                         headers:{
                     'Authorization': `Bearer ${localStorage.getItem('Token')}`,
                        'Content-Type': 'application/json'
                        }
                        }).then(response=>{
                            if(response.status!=200)
                            {
                                window.location.href='index.html';
                                return;
                            }
                            else 
                            return response.json();
                        }).then(Data=>{
                            document.querySelector('.Username').value=Data.username;
                            document.querySelector('.Name').value=Data.name;
                        });
                    };       
                    GetAdmin();



                    document.querySelector('.UpdateForm').addEventListener('submit', function(event) {
                        event.preventDefault();
                    
                        const requestData = {
                            ID: 0,
                            Username: document.querySelector('.Username').value,
                            Name: document.querySelector('.Name').value,
                            Password: document.querySelector('.Password').value,
                            Image: "56",
                            Permissions: 1
                            
                        };
                    
                        fetch(`http://rashadalabbasy-001-site1.ctempurl.com/api/Admin/${ID}`, {
                            method: 'PUT',
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('Token')}`,
                                'Content-Type': 'application/json' 
                            },
                            body: JSON.stringify(requestData) 
                        })
                        .then(response => {
                            const contentType = response.headers.get('content-type');
                    
                            if (response.ok) {
                                $.gritter.add({
                                    title: '! تمت العملية بنجاح',
                                    text: 'تم تعديل الصفحة الشخصية ',
                                });
                                setTimeout(() => {
                                    $('.gritter-item').addClass('GreenNot');
                                }, 100);
                                setTimeout(() => {
                                    window.location.href='index.html';
                                }, 5000);
                            } else {
                                $.gritter.add({
                                    title: '! لم تتم العملية',
                                    text: '     يرجى اختيار اسم مستخدم اخر ',
                                });
                                setTimeout(() => {
                                    $('.gritter-item').addClass('RedNot');
                                }, 100);
                                setTimeout(() => {
                                    window.location.href='index.html';
                                }, 5000);
                            
                            }
                        })
                        .catch(error => {
                            console.error('There was a problem with the fetch operation:', error.message);
                        });
                    });


                    document.getElementById('UpdateImageForm').addEventListener('submit',function(event){
                        event.preventDefault();
                     
                         const imageFile1 = document.getElementById('Image1').files[0]; 
                         const formData = new FormData();
                      
                         formData.append('id', ID); 
                         formData.append('AnyImage', 5); 
                         formData.append('ImageFile1', imageFile1); 
                         fetch(`http://rashadalabbasy-001-site1.ctempurl.com/api/AdminPanelContent/UpdateImagAdmin`, {
                             method: 'PUT',
                             headers: {
                                 'Authorization': `Bearer ${localStorage.getItem('Token')}`
                             },
                             body: formData
                         })
                         .then(response => {
                           
                             if (response.ok) {
                                 $.gritter.add({
                                     title: '! تمت العملية بنجاح',
                                     text: 'تم تحديث الصورة',
                                 });
                                 setTimeout(function() {
                             $('.gritter-item').addClass('GreenNot');
                         }, 100);
                         setTimeout(function() {
                             window.location.href='index.html';
                         }, 5000);
                             } else {
                                 $.gritter.add({
                                     title: '! لم تتم العملية',
                                     text: 'فشل في تحديث الصورة يرجى المحاولة لاحقا',
                                 });
                                 setTimeout(function() {
                             $('.gritter-item').addClass('RedNot');
                         }, 100);
                         setTimeout(function() {
                            window.location.href='index.html';
                         }, 5000);
                                 return false;
                             }
                         })
                         .catch(error => {
                             console.error('There was a problem with the fetch operation:', error);
                         });
                         
                     });
                    
                    
        } ;
    


        if (window.location.pathname === '/Appartments.html') {
            if (( CurrentAdminPermission & 2) !== 2){
                window.location.href='index.html?id=1';
                return;
            }
        }
        if (window.location.pathname === '/AddAppartment.html') {
            if (( CurrentAdminPermission & 2) !== 2){
                window.location.href='index.html?id=1';
                return;
            }
        }
        if (window.location.pathname === '/Bookings.html') {
            if (( CurrentAdminPermission & 4) !== 4){
                window.location.href='index.html?id=1';
                return;
            }
        }
        if (window.location.pathname === '/Payments.html') {
            if (( CurrentAdminPermission & 8) !== 8){
                window.location.href='index.html?id=1';
                return;
            }
        }
        if (window.location.pathname === '/Transactions.html') {
            if (( CurrentAdminPermission & 32) !== 32){
                window.location.href='index.html?id=1';
                return;
            }
        }
        if (window.location.pathname === '/HomeContent.html') {
            if (( CurrentAdminPermission & 128) !== 128){
                window.location.href='index.html?id=1';
                return;
            }
        }
        if (window.location.pathname === '/aboutus.html') {
            if (( CurrentAdminPermission & 256) !== 256){
                window.location.href='index.html?id=1';
                return;
            }
        }
        if (window.location.pathname === '/SocilaMedia.html') {
            if (( CurrentAdminPermission & 512) !== 512){
                window.location.href='index.html?id=1';
                return;
            }
        }
        if (window.location.pathname === '/Stafs.html') {
            if (( CurrentAdminPermission & 1024) !== 1024){
                window.location.href='index.html?id=1';
                return;
            }
        }



    });
    


