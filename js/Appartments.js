document.addEventListener("DOMContentLoaded", function() {

if (window.location.pathname === '/AddAppartment.html') {

    document.querySelector('.AddAppartmentForm').addEventListener('submit', function(event) {
        event.preventDefault();
    
        const imageFile1 = document.getElementById('Image1').files[0]; 
        const imageFile2 = document.getElementById('Image2').files[0]; 
        const imageFile3 = document.getElementById('Image3').files[0]; 
        const imageFile4 = document.getElementById('Image4').files[0]; 
    
        const formData = new FormData(); 
        formData.append('ID', 0);
        formData.append('CostPerNight', document.querySelector('.Price').value);  
        formData.append('AppartmentNumber', document.querySelector('.AppartmentNumber').value);
        formData.append('Bed', document.querySelector('.Rooms').value);
        formData.append('Bath', document.querySelector('.Paths').value);
        formData.append('WIfi', document.querySelector('.IsWifi').checked);
        formData.append('Description', document.querySelector('.AppartmentDesc').value);
        formData.append('Avaliabel', true);
        formData.append('Image1', 1);
        formData.append('Image2', 3);
        formData.append('Image3', 4);
        formData.append('Image4', 3);
        formData.append('ImageFile1', imageFile1);
        formData.append('ImageFile2', imageFile2);
        formData.append('ImageFile3', imageFile3);
        formData.append('ImageFile4', imageFile4);
    
        console.log(formData);
        fetch('http://rashadalabbasy-001-site1.ctempurl.com/api/Appartment/AddNew', {
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
                    text: 'تم اضافة الشقة للنظام',
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
                    text:  'فشل في اضافة الشقة يرجى تعبئة جميع الصور',
                });
                setTimeout(function() {
                    $('.gritter-item').addClass('RedNot');
                }, 100);
                setTimeout(function() {
                    window.location.reload();
                }, 5000);

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
        .then(data => {
            if (typeof data === 'object') {
                
            } else {

         
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error.message);
          
        });
        

    }
);



}


if (window.location.pathname === '/Appartments.html') {

let AppartmentsTabel=document.getElementById('TabelContent');
var AppartmentChoosenID=0;

fetch(`http://rashadalabbasy-001-site1.ctempurl.com/api/MainContant/AllRooms`,{
    method:'GET',
    headers:{
       'Content-Type': 'application/json'
   }
   }).then(response=>{
       if(response.status!=200)
       { return;
       }
       else
       return response.json();
   }).then(data=>{
    FillAllRooms(data);
   });




function FillAllRooms(Data){

let RoomsContent = ''; 
console.log(Data);
let counter=0;

Data.forEach(element=>{
    counter++;
    let stylefortr='';
    if(element.avaliabel===true){
        Avaliabel='متوفرة';
        stylefortr='style="background-color: green; color: white;text-align:center"';
    }
    else{
        Avaliabel='محجوزة';
      
        stylefortr='style="background-color: red; color: white;text-align:center"';
    }
    if(element.wIfi===true){
        wifi='متوفر';
    }
    else{
        wifi='غير متوفر';
    }
    if((counter%2)!==0){
        RoomsContent += `<tr class="gradeA">
        <td> 
            <button class="btn btn-grad btn-danger deletebutton" data-id="${element.id}"  data-toggle="modal" title="حذف الشقة" data-target="#buttonedModal"><i class="fa-solid fa-trash"></i></button>
            <button class="btn btn-grad btn-success updateTextbutton" data-id="${element.id}" data-toggle="modal" title="تعديل الشقة" data-target="#newReg"><i class="fa-solid fa-file-pen"></i></button>
            <button class="btn btn-grad btn-default updateImagesbutton" data-id="${element.id}" data-toggle="modal" title="تعديل الصور" data-target="#newReg2"><i class="fa-solid fa-pen-to-square"></i></button>
         </td>
        <td>${wifi}</td>
        <td ${stylefortr}>${Avaliabel}</td>
        <td class="center">${element.bed}</td>
        <td class="center">${element.bath}</td>
        <td class="center">${element.costPerNight}</td>
        <td class="center">${element.description}</td>
        <td class="center">${element.appartmentNumber}</td>
        <td class="">${element.id}</td>
    </tr>`;
    }
    else{
        RoomsContent += `<tr class="gradeA">
        <td> 
            <button class="btn btn-grad btn-danger deletebutton" data-id="${element.id}"  data-toggle="modal" title="حذف الشقة" data-target="#buttonedModal"><i class="fa-solid fa-trash"></i></button>
            <button class="btn btn-grad btn-success updateTextbutton" data-id="${element.id}" data-toggle="modal" title="تعديل الشقة" data-target="#newReg"><i class="fa-solid fa-file-pen"></i></button>
            <button class="btn btn-grad btn-default updateImagesbutton" data-id="${element.id}" data-toggle="modal" title="تعديل الصور" data-target="#newReg2"><i class="fa-solid fa-pen-to-square"></i></button>
         </td>
        <td>${wifi}</td>
        <td  ${stylefortr}>${Avaliabel}</td>
        <td class="center">${element.bed}</td>
        <td class="center">${element.bath}</td>
        <td class="center">${element.costPerNight}</td>
        <td class="center">${element.description}</td>
        <td class="center">${element.appartmentNumber}</td>
        <td class="">${element.id}</td>
    </tr>`;
    }

} 

);

AppartmentsTabel.innerHTML = RoomsContent; 

document.querySelectorAll('.deletebutton').forEach(button => {
    button.addEventListener('click', function() {
        AppartmentChoosenID = this.getAttribute('data-id');
    });
});

document.querySelectorAll('.updateTextbutton').forEach(button => {
    button.addEventListener('click', function() {
        AppartmentChoosenID = this.getAttribute('data-id');
        let GetAppartment=()=>{
            fetch(`http://rashadalabbasy-001-site1.ctempurl.com/api/Appartment/GetByIDAp?id=${AppartmentChoosenID}`,{
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
                console.log(Data);
             
                document.querySelector('.AppartmentNumber').value=Data.appartmentNumber;
                document.querySelector('.Paths').value=Data.bath;
                document.querySelector('.Rooms').value=Data.bed;
                document.querySelector('.Price').value=Data.costPerNight;
                document.querySelector('.AppartmentDesc').value=Data.description;
                document.querySelector('.IsWifi').checked = Data.wIfi === 'true' || Data.wIfi === true;
            });
        };
    
        GetAppartment();
    });
});


document.querySelectorAll('.updateImagesbutton').forEach(button => {
    button.addEventListener('click', function() {
        AppartmentChoosenID = this.getAttribute('data-id');

    });
});

};


document.getElementById('DeleteApp').addEventListener('click',function(event){

    event.preventDefault();
    fetch(`http://rashadalabbasy-001-site1.ctempurl.com/api/Appartment/${AppartmentChoosenID}`, {
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
               text: ` تم حذف هذه الشقة ` ,
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
               text: `فشلت عملية حذف الشقة يرجى المحاولة لاحقا` ,
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



document.getElementById('UpdateImage1').addEventListener('submit',function(event){
    event.preventDefault();

    const imageFile = document.getElementById('Image1').files[0]; 
    const formData = new FormData();
 
    formData.append('id', AppartmentChoosenID); 
    formData.append('AnyImage', 1); 
    formData.append('ImageFile', imageFile); 
    fetch(`http://rashadalabbasy-001-site1.ctempurl.com/api/Appartment/UpdateImages`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('Token')}`
        },
        body: formData
    })
    .then(response => {
        document.getElementById('Closebtn').click();
        if (response.ok) {
            $.gritter.add({
                title: '! تمت العملية بنجاح',
                text: 'تم تحديث الصورة',
            });
            setTimeout(function() {
        $('.gritter-item').addClass('GreenNot');
    }, 100);
    setTimeout(function() {
        window.location.reload();
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
        window.location.reload();
    }, 5000);
            return false;
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
    
})


document.getElementById('UpdateImage2').addEventListener('submit',function(event){
    event.preventDefault();
    const imageFile = document.getElementById('Image2').files[0]; 
    const formData = new FormData();
    formData.append('ImageFile', imageFile); 
    formData.append('id', AppartmentChoosenID); 
    formData.append('AnyImage', 2); 
    
    fetch(`http://rashadalabbasy-001-site1.ctempurl.com/api/Appartment/UpdateImages`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('Token')}`
        },
        body: formData
    })
    .then(response => {
        document.getElementById('Closebtn').click();
        if (response.ok) {
            $.gritter.add({
                title: '! تمت العملية بنجاح',
                text: 'تم تحديث الصورة',
            });
            setTimeout(function() {
        $('.gritter-item').addClass('GreenNot');
    }, 100);
    setTimeout(function() {
        window.location.reload();
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
        window.location.reload();
    }, 5000);
            return false;
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
})



document.getElementById('UpdateImage3').addEventListener('submit',function(event){
    
    event.preventDefault();
    const imageFile = document.getElementById('Image3').files[0]; 
    const formData = new FormData();
  
    formData.append('id', AppartmentChoosenID); 
    formData.append('AnyImage', 3); 
    formData.append('ImageFile', imageFile); 
    fetch(`http://rashadalabbasy-001-site1.ctempurl.com/api/Appartment/UpdateImages`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('Token')}`
        },
        body: formData
    })
    .then(response => {
        document.getElementById('Closebtn').click();
        if (response.ok) {
            $.gritter.add({
                title: '! تمت العملية بنجاح',
                text: 'تم تحديث الصورة',
            });
            setTimeout(function() {
        $('.gritter-item').addClass('GreenNot');
    }, 100);
    setTimeout(function() {
        window.location.reload();
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
        window.location.reload();
    }, 5000);
            return false;
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
    

})



document.getElementById('UpdateImage4').addEventListener('submit',function(event){
    event.preventDefault();
    const imageFile = document.getElementById('Image4').files[0]; 
    const formData = new FormData();
    formData.append('id',AppartmentChoosenID);
    formData.append('AnyImage',4);  
    formData.append('ImageFile',imageFile);
    fetch(`http://rashadalabbasy-001-site1.ctempurl.com/api/Appartment/UpdateImages`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('Token')}` 
        },
        body: formData
    })
    .then(response => {
        document.getElementById('Closebtn').click();
        if (response.ok) {
            $.gritter.add({
                title: '! تمت العملية بنجاح',
                text: 'تم تحديث الصورة',
            });
            setTimeout(function() {
        $('.gritter-item').addClass('GreenNot');
    }, 100);
    setTimeout(function() {
        window.location.reload();
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
        window.location.reload();
    }, 5000);
            return false;
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
    
});


document.querySelector('.UpdateForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const requestData = {
        ID: 0,
        CostPerNight: document.querySelector('.Price').value,
        AppartmentNumber: document.querySelector('.AppartmentNumber').value,
        Bed: document.querySelector('.Rooms').value,
        Bath: document.querySelector('.Paths').value,
        WIfi: document.querySelector('.IsWifi').checked,
        Description: document.querySelector('.AppartmentDesc').value,
        Avaliable: true,
        Image1: "56",
        Image2: "7",
        Image3: "9",
        Image4: "7"
    };

    fetch(`http://rashadalabbasy-001-site1.ctempurl.com/api/Appartment/${AppartmentChoosenID}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('Token')}`,
            'Content-Type': 'application/json' // Add Content-Type header
        },
        body: JSON.stringify(requestData) 
    })
    .then(response => {
        document.getElementById('Closebtn').click();
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
            text: 'تم تعديل الشقة ',
        });
        setTimeout(() => {
            $('.gritter-item').addClass('GreenNot');
        }, 100);
        setTimeout(() => {
            window.location.reload();
        }, 8000);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error.message);
        $.gritter.add({
            title: '! لم تتم العملية',
            text: error.message || 'فشل في تعديل الشقة يرجى تعبئة جميع الحقول',
        });
        setTimeout(() => {
            $('.gritter-item').addClass('RedNot');
        }, 100);
        setTimeout(() => {
            window.location.reload();
        }, 8000);
    });
});




}

});
