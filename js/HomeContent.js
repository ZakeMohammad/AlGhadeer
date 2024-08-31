document.addEventListener("DOMContentLoaded", function() {


    
if (window.location.pathname==='/HomeContent.html') {

    let LandingData=document.getElementById('HomeContentData');

  fetch(`https://rashadalabbasy-001-site1.ctempurl.com/api/MainContant/LandingContant`,{
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
    FillLandingData(data);
});
let IDForUpdatTextOrImage=0;


   function FillLandingData(Data){
  
    let LandingCountent = ''; 

    Data.forEach(element => {
            LandingCountent += `  <div class="panel panel-info" style="width: 360px;
    display: inline-block;">
                            <div class="panel-heading">
                             
                            </div>

                            <div class="panel-body">
                              
			<p style="text-align:center;    display: grid;
    grid-gap: 10px;">

		<a  id="example2" href="https://rashadalabbasy-001-site1.ctempurl.com/Images/LandingImages/${element.image}"   title="${element.text}"><img  style="width: 100%; height: 250px;" src="https://rashadalabbasy-001-site1.ctempurl.com/Images/LandingImages/${element.image}" alt="" /></a>
        <button class="btn btn-grad btn-default UpdateImge" data-id="${element.id}" data-toggle="modal" data-target="#formModal2">تحديث الصورة</button>
       <button class="btn btn-grad btn-default UpdateText" data-id="${element.id}" data-toggle="modal" data-target="#formModal">تحديث النص</button>
	        </p>
		</div>
		</div>`;
        
    });

    LandingData.innerHTML = LandingCountent; 

    document.querySelectorAll('.UpdateText').forEach(button => {
        button.addEventListener('click', function() {
            IDForUpdatTextOrImage = this.getAttribute('data-id');

            let GetLandingContent=()=>{
                fetch(`https://rashadalabbasy-001-site1.ctempurl.com/api/AdminPanelContent/GetLandingContentByID?id=${IDForUpdatTextOrImage}`,{
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
                    document.getElementById('Text').value=Data.text;
                });
            };
        
            GetLandingContent();
        });
    });

    document.querySelectorAll('.UpdateImge').forEach(button => {
        button.addEventListener('click', function() {
            IDForUpdatTextOrImage = this.getAttribute('data-id');
        });
    });


   };



   document.getElementById('UpdateImageFrom').addEventListener('submit',function(event){
   event.preventDefault();

    const imageFile1 = document.getElementById('imageInput1').files[0]; 
    const formData = new FormData();
 
    formData.append('id', IDForUpdatTextOrImage); 
    formData.append('AnyImage', 5); 
    formData.append('ImageFile1', imageFile1); 
    fetch(`https://rashadalabbasy-001-site1.ctempurl.com/api/AdminPanelContent/UpdateImagLandingContent`, {
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

document.getElementById('UpdateTextFrom').addEventListener('submit', function(event) {
    event.preventDefault();

  
    fetch(` https://rashadalabbasy-001-site1.ctempurl.com/api/AdminPanelContent/UpdateLanding${IDForUpdatTextOrImage}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('Token')}`,
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(document.getElementById('Text').value) 
    })
    .then(response => {
        document.getElementById('Closebtn').click();
        const contentType = response.headers.get('content-type');

        if (response.ok) {
            $.gritter.add({
                title: '! تمت العملية بنجاح',
                text: 'تم تعديل النص  ',
            });
            setTimeout(() => {
                $('.gritter-item').addClass('GreenNot');
            }, 100);
            setTimeout(() => {
                window.location.reload();
            }, 5000);
        } else {
            $.gritter.add({
                title: '! لم تتم العملية',
                text:  'فشل في تعديل النص يرجى تعبئة جميع الحقول',
            });
            setTimeout(() => {
                $('.gritter-item').addClass('RedNot');
            }, 100);
            setTimeout(() => {
                window.location.reload();
            }, 5000);
        }
    })
    .then(data => {
      
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error.message);
      
    });
});


};


        if (window.location.pathname==='/aboutus.html') {
        
            fetch(`https://rashadalabbasy-001-site1.ctempurl.com/api/MainContant/AboutUs`,{
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
                FillAboutUs(data);
          });
          
             function FillAboutUs(Data){
                document.querySelector('.TextAboutus').value=Data.description;
                document.getElementById('currentImage1').src=`https://rashadalabbasy-001-site1.ctempurl.com/Images/AboutUsImages/${Data.image1}`;
                document.getElementById('currentImage2').src=`https://rashadalabbasy-001-site1.ctempurl.com/Images/AboutUsImages/${Data.image2}`;
                document.getElementById('currentImage3').src=`https://rashadalabbasy-001-site1.ctempurl.com/Images/AboutUsImages/${Data.image3}`;
                document.getElementById('currentImage4').src=`https://rashadalabbasy-001-site1.ctempurl.com/Images/AboutUsImages/${Data.image4}`;

            };



            document.getElementById('UpdateDiscrptionForm').addEventListener('submit', function(event) {
                event.preventDefault();
            
                fetch(`https://rashadalabbasy-001-site1.ctempurl.com/api/AdminPanelContent/UpdateAboutUs1`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('Token')}`,
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify(document.querySelector('.TextAboutus').value) 
                })
                .then(response => {
                    document.getElementById('Closebtn').click();
                    const contentType = response.headers.get('content-type');
            
                    if (response.ok) {
                        $.gritter.add({
                            title: '! تمت العملية بنجاح',
                            text: 'تم تعديل النص  ',
                        });
                        setTimeout(() => {
                            $('.gritter-item').addClass('GreenNot');
                        }, 100);
                        setTimeout(() => {
                            window.location.reload();
                        }, 5000);
                    } else {
                        $.gritter.add({
                            title: '! لم تتم العملية',
                            text:  'فشل في تعديل النص يرجى تعبئة جميع الحقول',
                        });
                        setTimeout(() => {
                            $('.gritter-item').addClass('RedNot');
                        }, 100);
                        setTimeout(() => {
                            window.location.reload();
                        }, 5000);
                    }
                })
                .then(data => {
                  
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error.message);
                  
                });
            });
            


            document.querySelector('.UpdateImage1').addEventListener('submit',function(event){
                event.preventDefault();
             
                 const imageFile1 = document.getElementById('Image1').files[0]; 
                 const formData = new FormData();
              
                 formData.append('id', 1); 
                 formData.append('AnyImage', 1); 
                 formData.append('ImageFile1', imageFile1); 
                 fetch(`https://rashadalabbasy-001-site1.ctempurl.com/api/AdminPanelContent/UpdateImagAboutUs`, {
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

             document.querySelector('.UpdateImage2').addEventListener('submit',function(event){
                event.preventDefault();
             
                 const imageFile1 = document.getElementById('Image2').files[0]; 
                 const formData = new FormData();
              
                 formData.append('id',1); 
                 formData.append('AnyImage', 2); 
                 formData.append('ImageFile1', imageFile1); 
                 fetch(`https://rashadalabbasy-001-site1.ctempurl.com/api/AdminPanelContent/UpdateImagAboutUs`, {
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



             document.querySelector('.UpdateImage3').addEventListener('submit',function(event){
                event.preventDefault();
             
                 const imageFile1 = document.getElementById('Image3').files[0]; 
                 const formData = new FormData();
              
                 formData.append('id',1); 
                 formData.append('AnyImage', 3); 
                 formData.append('ImageFile1', imageFile1); 
                 fetch(`https://rashadalabbasy-001-site1.ctempurl.com/api/AdminPanelContent/UpdateImagAboutUs`, {
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




             document.querySelector('.UpdateImage4').addEventListener('submit',function(event){
                event.preventDefault();
             
                 const imageFile1 = document.getElementById('Image4').files[0]; 
                 const formData = new FormData();
              
                 formData.append('id', 1); 
                 formData.append('AnyImage',4); 
                 formData.append('ImageFile1', imageFile1); 
                 fetch(`https://rashadalabbasy-001-site1.ctempurl.com/api/AdminPanelContent/UpdateImagAboutUs`, {
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



 };


 if (window.location.pathname==='/SocilaMedia.html') {

 fetch(`https://rashadalabbasy-001-site1.ctempurl.com/api/MainContant/SocialMedia`,{
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
  FillSoicalMedia(data);
 });

 let UpdateForWhat=0;

 function FillSoicalMedia(Data){
    document.getElementById('Em').setAttribute('data-id',`1`);
    document.getElementById('Fa').setAttribute('data-id', `2`);
    document.getElementById('In').setAttribute('data-id', `3`);
    document.getElementById('Wa').setAttribute('data-id', `4`);
    document.getElementById('Te').setAttribute('data-id', `5`);

    document.querySelectorAll('.UpdateText').forEach(button => {
        button.addEventListener('click', function() {
    
            UpdateForWhat = button.getAttribute('data-id');
            switch(UpdateForWhat) {
                case '1':
                    document.getElementById('Result').value = Data.email;
                    document.getElementById('Result').setAttribute('data-id', `1`);
                    break;
                case '2':
                    document.getElementById('Result').value = Data.fasbookURL;
                    document.getElementById('Result').setAttribute('data-id', `2`);
                    break;
                case '3':
                    document.getElementById('Result').value = Data.instegramURL;
                    document.getElementById('Result').setAttribute('data-id', `3`);
                    break;
                case '4':
                    document.getElementById('Result').value = Data.watsAppNumber;
                    document.getElementById('Result').setAttribute('data-id', `4`);
                    break;
                case '5':
                    document.getElementById('Result').value = Data.phone;
                    document.getElementById('Result').setAttribute('data-id', `5`);
                    break;
            }
          
        });
    });
    
};



document.getElementById('UpdateTextFrom').addEventListener('submit', function(event) {
    event.preventDefault();
   
    const formData = new FormData();
    formData.append('anyurl', parseInt(document.getElementById('Result').getAttribute('data-id'), 10)); 
    formData.append('value', document.getElementById('Result').value);
  
    fetch(`https://rashadalabbasy-001-site1.ctempurl.com/api/AdminPanelContent/UpdateSoicalMedia`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('Token')}`
        
        },
        body: formData
    })
    .then(response => {
        document.getElementById('Closebtn').click();
        const contentType = response.headers.get('content-type');

        if (response.ok) {
            $.gritter.add({
                title: '! تمت العملية بنجاح',
                text: 'تم تعديل النص  ',
            });
            setTimeout(() => {
                $('.gritter-item').addClass('GreenNot');
            }, 100);
            setTimeout(() => {
                window.location.reload();
            }, 5000);
        } else {
            $.gritter.add({
                title: '! لم تتم العملية',
                text:  'فشل في تعديل النص يرجى تعبئة جميع الحقول',
            });
            setTimeout(() => {
                $('.gritter-item').addClass('RedNot');
            }, 100);
            setTimeout(() => {
                window.location.reload();
            }, 5000);
        }
    })
    .then(data => {
      
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error.message);
      
    });
});


  };


        if (window.location.pathname==='/Stafs.html') {



            let StafsData=document.getElementById('StafsData');

            fetch(`https://rashadalabbasy-001-site1.ctempurl.com/api/MainContant/Stafs`,{
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
              FillLandingData(data);
          });
          let UpdateTetxtForThisID=0;


             function FillLandingData(Data){
            
              let StafsCountent = ''; 
          
              Data.forEach(element => {
                StafsCountent += `
            <div class="panel panel-default" style="width: 360px;
    display: inline-block;">
                                <div class="panel-heading">
                                
                                </div>

                                <div class="panel-body">
                                
                <p style="text-align:center;    display: grid;
        grid-gap: 10px;">

            <a  id="example2" href="https://rashadalabbasy-001-site1.ctempurl.com/Images/StafsImages/${element.image}"  title=${element.name}"><img loading="lazy"  style="width: 100%; height: 250px;" src="https://rashadalabbasy-001-site1.ctempurl.com/Images/StafsImages/${element.image}" alt="" /></a>
            <button class="btn btn-grad btn-default UpdateImge" data-id="${element.id}"  data-toggle="modal" data-target="#formModal2">تحديث الصورة</button>
        <button class="btn btn-grad btn-default UpdateText" data-id="${element.id}" data-toggle="modal" data-target="#formModal">تحديث المعلومات</button>
                </p>
            </div>
            </div>`;
                  
              });
          
              StafsData.innerHTML = StafsCountent; 


              document.querySelectorAll('.UpdateText').forEach(button => {
                button.addEventListener('click', function() {
                    UpdateTetxtForThisID = this.getAttribute('data-id');
        
                    let GetLandingContent=()=>{
                        fetch(`https://rashadalabbasy-001-site1.ctempurl.com/api/AdminPanelContent/GetStafByID?id=${UpdateTetxtForThisID}`,{
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
                            document.getElementById('Name').value=Data.name;
                            document.getElementById('Phone').value=Data.phone;
                        });
                    };
                
                    GetLandingContent();
                });
            });


             document.querySelectorAll('.UpdateImge').forEach(button => {
        button.addEventListener('click', function() {
            UpdateTetxtForThisID = this.getAttribute('data-id');
        });


    });


};


document.getElementById('UpdateTextFrom').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData();
 
  
    formData.append('name', document.getElementById('Name').value); 
    formData.append('phone', document.getElementById('Phone').value); 
  
    fetch(` https://rashadalabbasy-001-site1.ctempurl.com/api/AdminPanelContent/UpdatStafs${UpdateTetxtForThisID}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('Token')}`
         
        },
        body: formData
    })
    .then(response => {
        document.getElementById('Closebtn1').click();
        const contentType = response.headers.get('content-type');

        if (response.ok) {
            $.gritter.add({
                title: '! تمت العملية بنجاح',
                text: 'تم تعديل النص  ',
            });
            setTimeout(() => {
                $('.gritter-item').addClass('GreenNot');
            }, 100);
            setTimeout(() => {
                window.location.reload();
            }, 5000);
        } else {
            $.gritter.add({
                title: '! لم تتم العملية',
                text:  'فشل في تعديل النص يرجى تعبئة جميع الحقول',
            });
            setTimeout(() => {
                $('.gritter-item').addClass('RedNot');
            }, 100);
            setTimeout(() => {
                window.location.reload();
            }, 5000);
        }
    })
    .then(data => {
      
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error.message);
      
    });
});


document.getElementById('UpdateImageFrom').addEventListener('submit',function(event){
    event.preventDefault();
 
     const imageFile1 = document.getElementById('imageInput1').files[0]; 
     const formData = new FormData();
  
     formData.append('id', UpdateTetxtForThisID); 
     formData.append('AnyImage', 5); 
     formData.append('ImageFile1', imageFile1); 
     fetch(`https://rashadalabbasy-001-site1.ctempurl.com/api/AdminPanelContent/UpdateImagStafs`, {
         method: 'PUT',
         headers: {
             'Authorization': `Bearer ${localStorage.getItem('Token')}`
         },
         body: formData
     })
     .then(response => {
         document.getElementById('Closebtn2').click();
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

 };


});