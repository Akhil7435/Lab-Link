const labs=[
 {name:"Computer Lab",desc:"Programming, software development and computing.",seats:40,icon:"⌨"},
 {name:"Electronics Lab",desc:"Circuit design, testing and embedded systems.",seats:25,icon:"⌁"},
 {name:"Physics Lab",desc:"Experiments, measurements and applied physics.",seats:30,icon:"◉"},
 {name:"Chemistry Lab",desc:"Chemical analysis and practical experiments.",seats:20,icon:"⚗"}
];
const equipment=[
 {name:"Desktop Computer",lab:"Computer Lab",total:40,available:32},
 {name:"Arduino Uno Kit",lab:"Electronics Lab",total:15,available:9},
 {name:"Digital Multimeter",lab:"Electronics Lab",total:12,available:7},
 {name:"Oscilloscope",lab:"Electronics Lab",total:8,available:5},
 {name:"Optical Bench",lab:"Physics Lab",total:10,available:6},
 {name:"Microscope",lab:"Physics Lab",total:12,available:10},
 {name:"Digital Balance",lab:"Chemistry Lab",total:8,available:6},
 {name:"pH Meter",lab:"Chemistry Lab",total:10,available:8}
];
const $=id=>document.getElementById(id);
let bookings=JSON.parse(localStorage.getItem("lablinkBookings")||"[]");
function save(){localStorage.setItem("lablinkBookings",JSON.stringify(bookings));renderAll()}
function toast(message){const t=$("toast");t.textContent=message;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2600)}
function renderLabs(){
 $("labCards").innerHTML=labs.map(l=>`<article class="lab-card"><div class="lab-symbol">${l.icon}</div><h4>${l.name}</h4><p>${l.desc}</p><div class="lab-meta"><span>${l.seats} seats</span><span class="available">● Available</span></div></article>`).join("");
 $("labSelect").innerHTML='<option value="">Choose a laboratory</option>'+labs.map(l=>`<option>${l.name}</option>`).join("");
}
function renderEquipment(){
 const q=$("equipmentSearch").value.toLowerCase(),f=$("equipmentFilter").value;
 const rows=equipment.filter(e=>(f==="All"||e.lab===f)&&e.name.toLowerCase().includes(q));
 $("equipmentRows").innerHTML=rows.map(e=>`<tr><td><b>${e.name}</b></td><td>${e.lab}</td><td>${e.total}</td><td>${e.available}</td><td><span class="pill">${e.available>0?"Available":"Unavailable"}</span></td></tr>`).join("")||'<tr><td colspan="5">No matching equipment found.</td></tr>';
 $("equipmentCount").textContent=equipment.reduce((n,e)=>n+e.total,0);
}
function renderBookings(){
 $("bookingRows").innerHTML=bookings.map((b,i)=>`<tr><td><b>${escapeHTML(b.lab)}</b></td><td>${escapeHTML(b.date)}</td><td>${escapeHTML(b.slot)}</td><td>${escapeHTML(b.student)}</td><td><span class="pill">Requested</span></td><td><button class="delete-btn" data-delete="${i}">Cancel</button></td></tr>`).join("");
 $("emptyBookings").hidden=bookings.length>0;
 $("bookingCount").textContent=String(bookings.length).padStart(2,"0");
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function renderAll(){renderBookings();renderEquipment()}
function showView(name){
 document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id===name));
 document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===name));
 const titles={dashboard:"Dashboard",booking:"Book a Lab",equipment:"Equipment",history:"My Bookings"};
 $("pageTitle").textContent=titles[name]||"Dashboard";window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.go)));
$("bookingDate").min=new Date().toISOString().split("T")[0];
$("bookingForm").addEventListener("submit",e=>{
 e.preventDefault();
 const booking={student:$("studentName").value.trim(),studentId:$("studentId").value.trim(),lab:$("labSelect").value,date:$("bookingDate").value,slot:$("timeSlot").value,purpose:$("purpose").value.trim()};
 if(!booking.student||!booking.studentId||!booking.lab||!booking.date||!booking.slot||!booking.purpose){toast("Please complete all fields.");return}
 if(bookings.some(b=>b.lab===booking.lab&&b.date===booking.date&&b.slot===booking.slot)){toast("This lab slot is already requested in this browser.");return}
 bookings.unshift(booking);save();e.target.reset();$("bookingDate").min=new Date().toISOString().split("T")[0];toast("Your lab booking request has been saved.");showView("history");
});
$("bookingRows").addEventListener("click",e=>{const i=e.target.dataset.delete;if(i!==undefined){bookings.splice(Number(i),1);save();toast("Booking removed.")}});
$("equipmentSearch").addEventListener("input",renderEquipment);
$("equipmentFilter").addEventListener("change",renderEquipment);
renderLabs();renderAll();
