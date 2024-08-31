
document.addEventListener('DOMContentLoaded', function() {

  var NAME_ITEM = "el-toast",
  ICONS = {
   SUCCESS: {
    CLASSES: ["fa", "fa-check-circle"]
   },
   DANGER: {
    CLASSES: ["fa", "fa-exclamation-triangle"]
   },
   INFO: {
    CLASSES: ["fa", "fa-exclamation-circle"]
   },
   ALERT: {
    CLASSES: ["fa", "fa-exclamation-triangle"]
   }
  },
  MOBILE_RESOLUTION = 720;
  
  var $templateItem = document.querySelector("#elToastItem");
  $templateItem = $templateItem.cloneNode(true).content;
  
  class ToastItem extends HTMLLIElement {
  constructor() {
   super();
  
   this._eventOnRemove =
    new CustomEvent("TOAST_REMOVED") || document.createEvent("TOAST_REMOVED");
  
   this.isVisible = false;
  }
  
  connectedCallback() {
   let type = this.getAttribute("type").toUpperCase(),
    description = this.getAttribute("description"),
    timeout = Number(this.getAttribute("timeout")),
    hideClose = Boolean(JSON.parse(this.getAttribute("hide-close")));
  
   if (!ICONS.hasOwnProperty(type)) {
    throw new Error(`[${NAME_ITEM}] Tipo inválido de toast`);
   }
  
   let $item = $templateItem.cloneNode(true),
    $itemDescription = $item.querySelector(`.${NAME_ITEM}__description`),
    $itemIcon = $item.querySelector(`.${NAME_ITEM}__icon`),
    $icon = document.createElement("i"),
    $itemProgress = $item.querySelector(`.${NAME_ITEM}__progress`),
    $itemProgressBar = $item.querySelector(`.${NAME_ITEM}__bar`),
    $itemClose = $item.querySelector(`.${NAME_ITEM}__close`),
    $itemCloseAction = $item.querySelector(`.${NAME_ITEM}__close button`),
    $container = this.parentElement.parentElement;
  
   this.addEventListener("TOAST_REMOVED", this.checkVisible, false);
  
   if (hideClose) {
    $itemClose.remove();
   } else {
    $itemCloseAction.addEventListener("click", (event) =>
     $container.remove(this.id)
    );
   }
  
   $icon.classList.add(...ICONS[type].CLASSES);
  
   $itemIcon.appendChild($icon);
  
   this.classList.add(`${NAME_ITEM}__item`);
   this.classList.add(`${NAME_ITEM}__item--${type.toLowerCase()}`);
  
   if (description.length > 100) {
    setShortDescription();
   } else {
    setFullDescription();
   }
  
   function setFullDescription(event) {
    $itemDescription.innerText = description;
  
    if (!event) return;
  
    let viewLess = document.createElement("button");
    viewLess.innerText = "View less";
    viewLess.addEventListener("click", setShortDescription);
  
    $itemDescription.appendChild(viewLess);
   }
  
   function setShortDescription() {
    let viewMore = document.createElement("button");
    viewMore.innerText = "View more";
    viewMore.addEventListener("click", setFullDescription);
  
    $itemDescription.innerText = description.slice(0, 99) + "...";
    $itemDescription.appendChild(viewMore);
   }
  
   this.appendChild($item);
  
   this.checkVisible();
  
   if (timeout === 0) {
    $itemProgress.classList.add(`${NAME_ITEM}__progress--hide`);
    return;
   }
  
   let countdownValue = 100,
    size = timeout - countdownValue;
  
   let checking = setInterval(() => {
    if (this.isVisible && !$container.isMouseOver()) {
     $itemProgressBar.style.width =
      (size * 100) / (timeout - countdownValue) + "%";
  
     size -= countdownValue;
    }
  
    if (size < -countdownValue) {
     $container.remove(this.id);
  
     clearInterval(checking);
    }
   }, countdownValue);
  }
  
  checkVisible() {
   if (this.parentNode) {
    let numCards = document.body.clientWidth > MOBILE_RESOLUTION ? 3 : 1;
    this.isVisible =
     Array.from(this.parentNode.children).indexOf(this) < numCards;
   }
  }
  
  remove() {
   let parent = this.parentElement;
   this.classList.add(`${NAME_ITEM}__item--removing`);
   if (
    !parent ||
    parent.nodeType !== Node.ELEMENT_NODE ||
    !this ||
    this.nodeType !== Node.ELEMENT_NODE
   )
    return false;
  
   setTimeout(() => {
    if (parent.hasChildNodes() && parent.contains(this)) {
     parent.removeChild(this);
  
     parent.parentElement.dispatchEvent(this._eventOnRemove);
  
     return true;
    }
    return false;
   }, 300);
  }
  
  setOnClose(action) {
   let $itemCloseAction = this.querySelector(`.${NAME_ITEM}__close button`);
  
   $itemCloseAction.addEventListener("click", action);
  }
  
  setActions(actions) {
   if (!actions.length) {
    return;
   }
  
   let $itemActions = this.querySelector(`.${NAME_ITEM}__action`);
  
   actions.map((action) => {
    if (typeof action !== "object") {
     throw new Error(`[${NAME_ITEM}] Ação inválida`);
     return;
    }
  
    let $action = document.createElement("button");
  
    if (typeof action.title !== "string") {
     throw new Error(`[${NAME_ITEM}] Informe um título válido para a ação`);
    }
  
    $action.innerText = action.title;
  
    if (typeof action.onClick !== "function") {
     throw new Error(`[${NAME_ITEM}] Informe um função válida para a ação`);
    }
  
    $action.addEventListener("click", action.onClick);
  
    $itemActions.appendChild($action);
   });
  }
  
  static is() {
   return `${NAME_ITEM}-item`;
  }
  }
  
  customElements.define(ToastItem.is(), ToastItem, { extends: "li" });
  
  var NAME = "el-toast",
  TIMEOUT_REMOVE = 8000,
  DOM_LIMIT = 5;
  
  let $template = document.querySelector("#elToast");
  $template = $template.cloneNode(true).content.querySelector(`.${NAME}`);
  
  class Toast extends HTMLElement {
  constructor() {
   super();
  
   this._eventOnRemove =
    new CustomEvent("TOAST_REMOVED") || document.createEvent("TOAST_REMOVED");
  
   this._mouseOver = false;
  
   this._list = {};
  
   this._listCache = {};
  }
  
  isMouseOver() {
   return this._mouseOver;
  }
  
  setMouseOver(value) {
   this._mouseOver = Boolean(value);
  }
  
  connectedCallback() {
   this.appendChild($template);
  
   this.addEventListener("TOAST_REMOVED", broadcastToastRemoved, false);
   this.addEventListener("mouseenter", handleMouseOver);
   this.addEventListener("touchstart", handleMouseOver);
   this.addEventListener("touchend", handleMouseOut);
   document.body.addEventListener("touchend", handleMouseOut);
   this.addEventListener("mouseleave", handleMouseOut);
  
   function handleMouseOver() {
    $template.classList.add(`${NAME}--paused`);
    this.setMouseOver(true);
   }
  
   function handleMouseOut() {
    $template.classList.remove(`${NAME}--paused`);
    this.setMouseOver(false);
   }
  
   function broadcastToastRemoved() {
    Object.values(this._list)
     .slice(0, 5)
     .map((toast) => {
      toast.dispatchEvent(this._eventOnRemove);
     });
   }
  }
  
  publish(config) {
   let type = String(config.type || "info"),
    description = String(config.description || ""),
    timeout =
     config.timeout < 0 || typeof config.timeout !== "number"
      ? TIMEOUT_REMOVE
      : config.timeout,
    onClose =
     typeof config.onClose === "function" ? config.onClose : function () {},
    hideClose = Boolean(config.hideClose),
    actions = typeof config.actions === "object" ? config.actions : [],
    $toast = document.createElement("li", { is: `${NAME}-item` }),
    id = "toast_" + generateId();
  
   if (!description) {
    throw new Error(`[${NAME}] É necessário informar uma descrição`);
   }
  
   $toast.id = id;
   $toast.setAttribute("type", type);
   $toast.setAttribute("description", description);
   $toast.setAttribute("timeout", timeout);
   $toast.setAttribute("hide-close", hideClose);
  
   $toast = $toast.cloneNode(true);
  
   if (Object.values(this._list).length > DOM_LIMIT) {
    this._listCache[id] = {
     el: $toast,
     hideClose: hideClose,
     onClose: onClose,
     actions: actions
    };
   } else {
    $toast = $template.appendChild($toast);
  
    if (!$toast) {
     return;
    }
    if (!hideClose) {
     $toast.setOnClose(onClose);
    }
  
    if (actions.length) {
     $toast.setActions(actions);
    }
  
    this._list[id] = $toast;
   }
  
   function generateId() {
    return Math.random().toString(36).substr(2, 9);
   }
  
   return id;
  }
  remove(id) {
   if (this._list.hasOwnProperty(id)) {
    this._list[id].remove();
  
    delete this._list[id];
   } else if (this._listCache.hasOwnProperty(id)) {
    delete this._listCache[id];
   } else {
    return;
   }
  
   if (Object.keys(this._listCache).length) {
    let keyCached = Object.keys(this._listCache)[0],
     valueCached = Object.values(this._listCache)[0];
  
    valueCached.el = $template.appendChild(valueCached.el);
  
    if (!valueCached.hideClose) {
     valueCached.el.setOnClose(valueCached.onClose);
    }
  
    if (valueCached.actions.length) {
     valueCached.el.setActions(valueCached.actions);
    }
  
    this._list[keyCached] = valueCached.el;
  
    delete this._listCache[keyCached];
   }
  }
  static is() {
   return NAME;
  }
  }
  
  customElements.define(Toast.is(), Toast);
  
  var toast = document.querySelector("el-toast");
  

  
if (window.location.pathname !== '/RoomDetails.html') {
  document.querySelector('.AddCommitForm').addEventListener('submit',function(e){
    e.preventDefault();

   
   const imageFile1 = document.getElementById('CImage').files[0]; 


   const formData = new FormData(); 
   formData.append('Commit.ID', 0);
   formData.append('Commit.Name', document.getElementById('CName').value);  
   formData.append('Commit.Date', new Date().toISOString().split('T')[0]);
   formData.append('Commit.Description', document.getElementById('CDescription').value);
   formData.append('Commit.Image', '1');
   formData.append('ImageFile1', imageFile1);

   console.log(formData);

   fetch('https://rashadalabbasy-001-site1.ctempurl.com/api/MainContant/AddCommit', {
       method: 'POST', 
   
       body: formData
   })
   .then(response => {
      
       
       if (response.ok) {
        toast.publish({
            type: "success",
            description:
             `Commit Added succssfilly , thank you ${document.getElementById('CName').value} for give us this coomit`,
            timeout: 8000
           });
           document.getElementById('CName').value='';
           document.getElementById('CDescription').value='';
           document.getElementById('CImage').value='';
       } else {
        toast.publish({
            type: "danger",
            description:
             `There is wrong , please come back again latter.`,
            timeout: 8000
           });
           document.getElementById('CName').value='';
           document.getElementById('CDescription').value='';
           document.getElementById('CImage').value='';

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
   





});
}


let FillSoicalMedia=()=>{
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
    document.getElementById('Wa').href=`https://wa.me/${data.phone}`;
    document.getElementById('Fa').href=data.fasbookURL;
    document.getElementById('In').href=data.instegramURL;
    document.getElementById('Em').href=href=`mailto:${data.email}`;
  
    if (window.location.pathname==='/contact.html') {
      document.getElementById('email1').innerHTML = '<i class="fa fa-envelope-open text-primary me-2"></i>'+data.email;
      document.getElementById('email2').innerHTML='<i class="fa fa-envelope-open text-primary me-2"></i>'+data.email;
      document.getElementById('email1').href=`mailto:${data.email}`;
      document.getElementById('email2').href=`mailto:${data.email}`;
    }


    document.getElementById('EmailTop').innerText=data.email;
    document.getElementById('EmailTop').href=`mailto:${data.email}`;
    document.getElementById('PhoneTop').innerText = '+962 ' + data.phone.substring(1);
    document.getElementById('PhoneTop').href=`tel:+${data.phone}`;
    document.getElementById('FasTop').href=data.fasbookURL;
    document.getElementById('InsTop').href=data.instegramURL;
    document.getElementById('WatTop').href=`https://wa.me/${data.watsAppNumber.substring(1)}`;

  })
  };
  
  


  FillSoicalMedia();


if (window.location.pathname==='/index2.html') {

 let LandingData=document.getElementById('LandingContent');

 let AboutusData=document.getElementById('AboutusContent');

 let RandomRoomData=document.getElementById('BookingsRomms');


 
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


   function FillLandingData(Data){
    let counter = 0;
    let LandingCountent = ''; 

    Data.forEach(element => {
        counter++;
        if (counter === 1) { 
            LandingCountent += `<div class="carousel-item active">
                       <img loading="lazy"  class="w-100" style="height: 600px;" id="Image1" src="https://rashadalabbasy-001-site1.ctempurl.com/Images/LandingImages/${element.image}" alt="Image">
                        <div class="carousel-caption d-flex flex-column align-items-center justify-content-center">
                            <div class="p-3" style="max-width: 700px;">
                                <h6 class="section-title text-white text-uppercase mb-3 animated slideInDown">Al-Ghadder</h6>
                                <h1 class="display-3 text-white mb-4 animated slideInDown" id="Content1">${element.text}</h1>
                                <a href="room.html" class="btn btn-primary py-md-3 px-md-5 me-3 animated slideInLeft">Our Rooms</a>
                                <a href="#BookingsRomms" class="btn btn-light py-md-3 px-md-5 animated slideInRight">Book A Room</a>
                            </div>
                        </div>
                    </div>`;
        } else {
            LandingCountent += `<div class="carousel-item">
                       <img loading="lazy"  class="w-100" style="height: 600px;" id="Image1" src="https://rashadalabbasy-001-site1.ctempurl.com/Images/LandingImages/${element.image}" alt="Image">
                        <div class="carousel-caption d-flex flex-column align-items-center justify-content-center">
                            <div class="p-3" style="max-width: 700px;">
                                <h6 class="section-title text-white text-uppercase mb-3 animated slideInDown">Al-Ghadder</h6>
                                <h1 class="display-3 text-white mb-4 animated slideInDown" id="Content1">${element.text}</h1>
                                <a href="room.html" class="btn btn-primary py-md-3 px-md-5 me-3 animated slideInLeft">Our Rooms</a>
                                <a href="#BookingsRomms" class="btn btn-light py-md-3 px-md-5 animated slideInRight">Book A Room</a>
                            </div>
                        </div>
                    </div>`;
        }
    });

    LandingData.innerHTML = LandingCountent; 

   }

   function FillAboutUs(Data){
   
    let AboutUsContent = ''; 
    AboutUsContent = ` <div class="col-lg-6">
                        <h6 class="section-title text-start text-primary text-uppercase">About Us</h6>
                        <h1 class="mb-4">Welcome to <span class="text-primary text-uppercase">Al-Ghadder</span></h1>
                        <p class="mb-4">${Data.description}</p>
                        <div class="row g-3 pb-4">
                            <div class="col-sm-4 wow fadeIn" data-wow-delay="0.1s">
                                <div class="border rounded p-1">
                                    <div class="border rounded text-center p-4">
                                        <i class="fa fa-hotel fa-2x text-primary mb-2"></i>
                                        <h2 class="mb-1" data-toggle="counter-up">${Data.romms}</h2>
                                        <p class="mb-0">Rooms</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-4 wow fadeIn" data-wow-delay="0.3s">
                                <div class="border rounded p-1">
                                    <div class="border rounded text-center p-4">
                                        <i class="fa fa-users-cog fa-2x text-primary mb-2"></i>
                                        <h2 class="mb-1" data-toggle="counter-up">${Data.stafs}</h2>
                                        <p class="mb-0">Staffs</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-4 wow fadeIn" data-wow-delay="0.5s">
                                <div class="border rounded p-1">
                                    <div class="border rounded text-center p-4">
                                        <i class="fa fa-users fa-2x text-primary mb-2"></i>
                                        <h2 class="mb-1" data-toggle="counter-up">${Data.claints}</h2>
                                        <p class="mb-0">Clients</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    
                    </div>
                    <div class="col-lg-6">
                        <div class="row g-3">
                            <div class="col-6 text-end">
                               <img loading="lazy"  class="img-fluid rounded w-75 wow zoomIn" data-wow-delay="0.1s" src="https://rashadalabbasy-001-site1.ctempurl.com/Images/AboutUsImages/${Data.image1}" style="margin-top: 25%;">
                            </div>
                            <div class="col-6 text-start">
                               <img loading="lazy"  class="img-fluid rounded w-100 wow zoomIn" data-wow-delay="0.3s" src="https://rashadalabbasy-001-site1.ctempurl.com/Images/AboutUsImages/${Data.image2}">
                            </div>
                            <div class="col-6 text-end">
                               <img loading="lazy"  class="img-fluid rounded w-50 wow zoomIn" data-wow-delay="0.5s" src="https://rashadalabbasy-001-site1.ctempurl.com/Images/AboutUsImages/${Data.image3}">
                            </div>
                            <div class="col-6 text-start">
                               <img loading="lazy"  class="img-fluid rounded w-75 wow zoomIn" data-wow-delay="0.7s" src="https://rashadalabbasy-001-site1.ctempurl.com/Images/AboutUsImages/${Data.image4}">
                            </div>
                        </div>
                    </div>`;
    AboutusData.innerHTML = AboutUsContent; 
}





fetch(`https://rashadalabbasy-001-site1.ctempurl.com/api/MainContant/RandomRoom`,{
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
    FillRandomRooms(data);
   });


   function FillRandomRooms(Data){
   
    let RandomRoomCountent = ''; 
    let Avaliabel='';
    let wifi=''
  
    Data.forEach(element => {

    if(element.avaliabel===true){
        Avaliabel='Avaliabel';
    }
    else{
        Avaliabel='Not Avaliabel';
    }
    if(element.wIfi===true){
        wifi='style="color:green;" ></i>Wifi</small>';
    }
    else{
        wifi='style="color:red;" ></i>Wifi</small>';
    }
       
        RandomRoomCountent += ` <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                        <div class="room-item shadow rounded overflow-hidden">
                            <div class="position-relative">
                               <img loading="lazy"  class="img-fluid" style="height: 250px; width:100%"  src="https://rashadalabbasy-001-site1.ctempurl.com/Images/AppartmentImages/${element.image1}" alt="">
                                <small class="position-absolute start-0 top-100 translate-middle-y bg-primary text-white rounded py-1 px-3 ms-4">${element.costPerNight} JD/Night</small>
                            </div>
                            <div class="p-4 mt-2">
                                <div class="d-flex justify-content-between mb-3">
                                    <h5 class="mb-0">Appartment  ${element.appartmentNumber}</h5>
                                    <div class="ps-2">
                                        <small >  <i class="fa-solid fa-house-lock border-end me-3 pe-2"style="color:#FEA116;"></i>${Avaliabel} </small>
                                    </div>
                                </div>
                                <div class="d-flex mb-3">
                                    <small class="border-end me-3 pe-3" id="Beds"><i class="fa fa-bed text-primary me-2"></i>${element.bed} Bed</small>
                                    <small class="border-end me-3 pe-3" id="Baths"><i class="fa fa-bath text-primary me-2"></i>${element.bath} Bath</small>
                                    <small id="IsWifif"><i class="fa fa-wifi  me-2"${wifi}
                                </div>
                                <p class="text-body mb-3" id="Description">${element.description}.</p>
                                <div class="d-flex justify-content-between">
                                    <a class="btn btn-sm btn-primary rounded py-2 px-4" href="RoomDetails.html?id=${element.id}">View Detail</a>
                                    <a class="btn btn-sm btn-dark rounded py-2 px-4" href="booking.html?id=${element.id}">Book Now</a>
                                </div>
                            </div>
                        </div>
                    </div>`;
      
    });

    RandomRoomCountent+='<a class="btn btn-primary py-3 px-5 mt-2" href="room.html">Explore More</a>'
    RandomRoomData.innerHTML = RandomRoomCountent; 
}



fetch(`https://rashadalabbasy-001-site1.ctempurl.com/api/MainContant/RandomCommit`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
}).then(response => {
    if (response.status != 200) {
        return;
    } else {
        return response.json();
    }
}).then(data => {
    FillRandomCommit(data);
});

function FillRandomCommit(Data) {
    let CommitContent = '';

    Data.forEach(element => {
        CommitContent += `
           <div class="item">
               <div class="shadow-effect">
                  <img loading="lazy"  class="img-circle" style="width: 80px; height: 80px; border-radius: 50%;" src="https://rashadalabbasy-001-site1.ctempurl.com/Images/CommitImages/${element.image}" alt="">
                   <p>${element.description}</p>
               </div>
               <div class="testimonial-name">${element.name}</div>
           </div>
        `;
    });


    $('#customers-testimonials').html(CommitContent);

    $('#customers-testimonials').owlCarousel({
        loop: true,
        center: true,
        items: 3,
        margin: 0,
        autoplay: true,
        dots: true,
        autoplayTimeout: 8500,
        smartSpeed: 450,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            1170: {
                items: 3
            }
        }
    });
}

}



if(window.location.pathname==='/room.html'){


    let RoomsData=document.getElementById('RoomssContent');

    fetch(`https://rashadalabbasy-001-site1.ctempurl.com/api/MainContant/AllRooms`,{
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
    Data.forEach(element=>{
        if(element.avaliabel===true){
            Avaliabel='Avaliabel';
        }
        else{
            Avaliabel='Not Avaliabel';
        }
        if(element.wIfi===true){
            wifi='style="color:green;" ></i>Wifi</small>';
        }
        else{
            wifi='style="color:red;" ></i>Wifi</small>';
        }
        RoomsContent += ` <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                            <div class="room-item shadow rounded overflow-hidden">
                                <div class="position-relative">
                                   <img loading="lazy"  class="img-fluid" style="height: 250px; width:100%"  src="https://rashadalabbasy-001-site1.ctempurl.com/Images/AppartmentImages/${element.image1}" alt="">
                                    <small class="position-absolute start-0 top-100 translate-middle-y bg-primary text-white rounded py-1 px-3 ms-4">${element.costPerNight} JD/Night</small>
                                </div>
                                <div class="p-4 mt-2">
                                    <div class="d-flex justify-content-between mb-3">
                                        <h5 class="mb-0">Appartment  ${element.appartmentNumber}</h5>
                                        <div class="ps-2">
                                            <small >  <i class="fa-solid fa-house-lock border-end me-3 pe-2"style="color:#FEA116;"></i>${Avaliabel} </small>
                                        </div>
                                    </div>
                                    <div class="d-flex mb-3">
                                        <small class="border-end me-3 pe-3" id="Beds"><i class="fa fa-bed text-primary me-2"></i>${element.bed} Bed</small>
                                        <small class="border-end me-3 pe-3" id="Baths"><i class="fa fa-bath text-primary me-2"></i>${element.bath} Bath</small>
                                        <small id="IsWifif"><i class="fa fa-wifi  me-2"${wifi}
                                    </div>
                                    <p class="text-body mb-3" id="Description">${element.description}.</p>
                                    <div class="d-flex justify-content-between">
                                        <a class="btn btn-sm btn-primary rounded py-2 px-4" href="RoomDetails.html?id=${element.id}">View Detail</a>
                                        <a class="btn btn-sm btn-dark rounded py-2 px-4" href="booking.html?id=${element.id}">Book Now</a>
                                    </div>
                                </div>
                            </div>
                        </div>`;
    } 
);

    RoomsData.innerHTML = RoomsContent; 
};

}


if(window.location.pathname==='/RoomDetails.html'){
    let ID = new URLSearchParams(window.location.search).get('id');

    let GetDetails=()=>{
        fetch(`https://rashadalabbasy-001-site1.ctempurl.com/api/MainContant/RoomDeltails?id=${ID}`,{
         method:'GET',
         headers:{
            'Content-Type': 'application/json'
        }
        }).then(response=>{
            if(response.status!=200)
            {
                window.location.href = 'index2.html';           
                 return;
            }
            else
            return response.json();
        }).then(data=>{
    
          document.getElementById('AppartmentNumber').innerText=data.appartmentNumber;
          document.getElementById('CostPerNight').innerText=data.costPerNight+' JD';
          document.getElementById('Beds').innerText=data.bed;
          document.getElementById('Baths').innerText=data.bath;
          document.getElementById('Description').innerText=data.description;
          document.getElementById('BookThisRoom').href=`booking.html?id=${data.id}`;
          
          if(data.avaliabel===true){
            document.getElementById('Availability').innerText='Avaliabel';
          }
          else{
            document.getElementById('Availability').innerText='Not Avaliabel';
          }
          
          if(data.wifi===true){
            document.getElementById('WiFi').innerText='High-Speed Internet';  
          }
          else{
            document.getElementById('WiFi').innerText='No Internet';  
          }
        
         document.getElementById('Description').innerText=data.description;

          document.getElementById('image1').src=`https://rashadalabbasy-001-site1.ctempurl.com/Images/AppartmentImages/${data.image1}`;
          document.getElementById('image2').src=`https://rashadalabbasy-001-site1.ctempurl.com/Images/AppartmentImages/${data.image2}`;
          document.getElementById('image3').src=`https://rashadalabbasy-001-site1.ctempurl.com/Images/AppartmentImages/${data.image3}`;
          document.getElementById('image4').src=`https://rashadalabbasy-001-site1.ctempurl.com/Images/AppartmentImages/${data.image4}`;
        })
        };
        
    
        GetDetails();
}



if(window.location.pathname==='/booking.html'){
    let ID = new URLSearchParams(window.location.search).get('id');

    let PriceForAppartment=0;
  
    let FinalPrice=0;

    let GetDetails=()=>{
        fetch(`https://rashadalabbasy-001-site1.ctempurl.com/api/MainContant/RoomDeltails?id=${ID}`,{
         method:'GET',
         headers:{
            'Content-Type': 'application/json'
        }
        }).then(response=>{
            if(response.status!=200)
            {
                window.location.href = 'index2.html';           
                 return;
            }
            else
            return response.json();
        }).then(data=>{
            PriceForAppartment=data.costPerNight
          document.getElementById('image1').src=`https://rashadalabbasy-001-site1.ctempurl.com/Images/AppartmentImages/${data.image1}`;
          document.getElementById('image2').src=`https://rashadalabbasy-001-site1.ctempurl.com/Images/AppartmentImages/${data.image2}`;
          document.getElementById('image3').src=`https://rashadalabbasy-001-site1.ctempurl.com/Images/AppartmentImages/${data.image3}`;
          document.getElementById('image4').src=`https://rashadalabbasy-001-site1.ctempurl.com/Images/AppartmentImages/${data.image4}`;
        })
        };

        GetDetails();

        $(function () {
            $('#checkin').datetimepicker({
                format: 'L', 
                useCurrent: false
            });
        
            $('#checkout').datetimepicker({
                format: 'L',
                useCurrent: false
            });
        
            $('#checkin').on('change.datetimepicker', function (e) {
                validateDates();
            });
        
            $('#checkout').on('change.datetimepicker', function (e) {
                validateDates();
            });
        });
        



        function validateDates() {
            const checkInValue = document.getElementById('checkin').value;
            const checkOutValue = document.getElementById('checkout').value;
        
            if (checkInValue && checkOutValue) {
                const checkIn = new Date(checkInValue);
                const checkOut = new Date(checkOutValue);
                const wrongCheak = document.getElementById('WrongCheak');
                const message = document.getElementById('message');
        
                if(checkIn< new Date(Date.now())){
                    document.getElementById('BookingNow').disabled = true;
                    wrongCheak.style.display = 'block';
                    message.innerText = '---';
                    FinalPrice=0;
                    return;
                }
                if (checkIn < checkOut) {
                    const timeDifference = checkOut - checkIn;
                    const daysBetween = Math.ceil(timeDifference / (1000 * 3600 * 24));
                   
                    if (daysBetween <= 0) {
                        document.getElementById('BookingNow').disabled = true;
                        wrongCheak.style.display = 'block';
                        FinalPrice=0;
                        message.innerText = '---';
                    } else {
                        document.getElementById('BookingNow').disabled = false;
                        wrongCheak.style.display = 'none';
                       
                        const TotalCost = (timeDifference / (1000 * 3600 * 24)) * PriceForAppartment ;
                        FinalPrice=TotalCost.toFixed(2);
                        document.getElementById('Cost').value=TotalCost.toFixed(2);
                        message.innerText = ` ${daysBetween-1} night(s) and cost: ${TotalCost.toFixed(2)} JD.`;
                    }
                } else {
                    document.getElementById('BookingNow').disabled = true;
                    wrongCheak.style.display = 'block';
                    message.innerText = '---';
                    FinalPrice=0;
                }
            }
        }


        validateDates();
        const BookingForm= document.querySelector('.BookingForm');

        BookingForm.addEventListener('submit',(event)=>{
          event.preventDefault();

          const checkinValue = new Date(document.getElementById('checkin').value);
          const checkoutValue = new Date(document.getElementById('checkout').value);
          
          const name = document.getElementById('name').value;
          const number = document.getElementById('Number').value;
      const bookingData = {
        id: 0,
        appartmentID: ID,
        dateFrom: checkinValue,
        dateTo: checkoutValue,
        bookingDate: new Date().toISOString(),
        cost: FinalPrice,
        customerName: name,
        customerPhone: number,
        status: 1,
        changeStatusByAdminID: 1
    };
    

  fetch(`https://rashadalabbasy-001-site1.ctempurl.com/api/MainContant/BookAAppartment`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(bookingData)
})
.then(response => {
    if (response.ok) { 
        return response.text().then(text => {
            toast.publish({
                type: "success",
                description: `${text}`,
                timeout: 8000
            });
            
            setTimeout(() => {
                toast.publish({
                    type: "info",
                    description: `Thank you ${name} for booking one of our appartments , we will call lees than day to confim the booking throw this phone: ${number}`,
                    timeout: 10000
                });
            }, 5000);
    
        });
    } else {
        return response.text().then(text => {
            toast.publish({
                type: "danger",
                description: `${text}`,
                timeout: 8000
            });
        });
    }
})
.catch(error => {
    console.error('Error:', error);
});
});

}

if(window.location.pathname==='/about.html'){
    let AboutusData=document.getElementById('AboutusContent');
    let StafsData=document.getElementById('StafsSection');


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
   
        let AboutUsContent = ''; 
        AboutUsContent = ` <div class="col-lg-6">
                            <h6 class="section-title text-start text-primary text-uppercase">About Us</h6>
                            <h1 class="mb-4">Welcome to <span class="text-primary text-uppercase">Al-Ghadder</span></h1>
                            <p class="mb-4">${Data.description}</p>
                            <div class="row g-3 pb-4">
                                <div class="col-sm-4 wow fadeIn" data-wow-delay="0.1s">
                                    <div class="border rounded p-1">
                                        <div class="border rounded text-center p-4">
                                            <i class="fa fa-hotel fa-2x text-primary mb-2"></i>
                                            <h2 class="mb-1" data-toggle="counter-up">${Data.romms}</h2>
                                            <p class="mb-0">Rooms</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-4 wow fadeIn" data-wow-delay="0.3s">
                                    <div class="border rounded p-1">
                                        <div class="border rounded text-center p-4">
                                            <i class="fa fa-users-cog fa-2x text-primary mb-2"></i>
                                            <h2 class="mb-1" data-toggle="counter-up">${Data.stafs}</h2>
                                            <p class="mb-0">Staffs</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-4 wow fadeIn" data-wow-delay="0.5s">
                                    <div class="border rounded p-1">
                                        <div class="border rounded text-center p-4">
                                            <i class="fa fa-users fa-2x text-primary mb-2"></i>
                                            <h2 class="mb-1" data-toggle="counter-up">${Data.claints}</h2>
                                            <p class="mb-0">Clients</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        
                        </div>
                        <div class="col-lg-6">
                            <div class="row g-3">
                                <div class="col-6 text-end">
                                   <img loading="lazy"  class="img-fluid rounded w-75 wow zoomIn" data-wow-delay="0.1s" src="https://rashadalabbasy-001-site1.ctempurl.com/Images/AboutUsImages/${Data.image1}" style="margin-top: 25%;">
                                </div>
                                <div class="col-6 text-start">
                                   <img loading="lazy"  class="img-fluid rounded w-100 wow zoomIn" data-wow-delay="0.3s" src="https://rashadalabbasy-001-site1.ctempurl.com/Images/AboutUsImages/${Data.image2}">
                                </div>
                                <div class="col-6 text-end">
                                   <img loading="lazy"  class="img-fluid rounded w-50 wow zoomIn" data-wow-delay="0.5s" src="https://rashadalabbasy-001-site1.ctempurl.com/Images/AboutUsImages/${Data.image3}">
                                </div>
                                <div class="col-6 text-start">
                                   <img loading="lazy"  class="img-fluid rounded w-75 wow zoomIn" data-wow-delay="0.7s" src="https://rashadalabbasy-001-site1.ctempurl.com/Images/AboutUsImages/${Data.image4}">
                                </div>
                            </div>
                        </div>`;
        AboutusData.innerHTML = AboutUsContent; 
    }
    
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
        FillStafs(data);
       });

                    function FillStafs(Data){
        
                        let Stafscontent = ''; 
                        Data.forEach((data)=>{
                            Stafscontent+= `<div class="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
                            <div class="rounded shadow overflow-hidden">
                                <div class="position-relative">
                                   <img loading="lazy"  class="img-fluid" style="width: 100%; height: 250px;" src="https://rashadalabbasy-001-site1.ctempurl.com/Images/StafsImages/${data.image}" alt="">
                                    <div class="position-absolute start-50 top-100 translate-middle d-flex align-items-center">
                                        <a class="btn btn-square btn-primary mx-1" href="https://wa.me/${data.phone}?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20your%20services" target="_blank"><i class="fa-brands fa-whatsapp"></i></a>

                                    </div>
                                </div>
                                <div class="text-center p-4 mt-3">
                                    <h5 class="fw-bold mb-0">${data.name}</h5>
                                 
                                </div>
                            </div>
                        </div>`;
                        });

                        StafsData.innerHTML = Stafscontent; 
                    }
                    

}


if(window.location.pathname==='/testimonial.html'){

    fetch(`https://rashadalabbasy-001-site1.ctempurl.com/api/MainContant/AllCommits`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.status != 200) {
            return;
        } else {
            return response.json();
        }
    }).then(data => {
        FillRandomCommit(data);
    });
    
    function FillRandomCommit(Data) {
        let CommitContent = '';
    
        Data.forEach(element => {
            CommitContent += `
               <div class="item">
                   <div class="shadow-effect">
                      <img loading="lazy"  class="img-circle" style="width: 80px; height: 80px; border-radius: 50%;" src="https://rashadalabbasy-001-site1.ctempurl.com/Images/CommitImages/${element.image}" alt="">
                       <p>${element.description}</p>
                   </div>
                   <div class="testimonial-name">${element.name}</div>
               </div>
            `;
        });
    
    
        $('#customers-testimonials').html(CommitContent);
    
        $('#customers-testimonials').owlCarousel({
            loop: true,
            center: true,
            items: 3,
            margin: 0,
            autoplay: true,
            dots: true,
            autoplayTimeout: 8500,
            smartSpeed: 450,
            responsive: {
                0: {
                    items: 1
                },
                768: {
                    items: 2
                },
                1170: {
                    items: 3
                }
            }
        });
    }


}


});



