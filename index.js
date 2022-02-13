//ilk olarak input değerlerini alalım

const customerList = []
function addCustomer() {
    const customerName = document.getElementById("newCustomerName").value
    const customerBalance = document.getElementById("newCustomerBalance").value
    customerList.push({
        id: Math.floor(Math.random() * 100), //id oluşturduk
        name: customerName,
        balance: customerBalance,
    })
   
     console.log(customerList)
     renderCustomerList() //render edecek func
     renderOptions() // optionslarımızı render edecek func
}

function renderOptions () {
    const selectSender = document.getElementById("sender")
    selectSender.innerHTML = ""; //içini boşalttık

    const recipientSender = document.getElementById("recipient")
    recipientSender.innerHTML = ""; //içini boşalttık
    //listemizdeki kullanıcıları option olarak eklememiz gerekli

    customerList.forEach(function(customer) { //döngü içerimizde li elementlerimizi oluşturalım
        const newOptionSender = document.createElement("option")
        newOptionSender.innerText = `${customer.name}`
        selectSender.appendChild(newOptionSender);  //tek bir elementi 2elemente atayamıyor muyuz
        
        const newOptionRecipient = document.createElement("option")
        newOptionRecipient.innerText = `${customer.name}`
        recipientSender.appendChild(newOptionRecipient); 
    })

   


}

function renderCustomerList() {
    //ul listemizi alalım
    const mainLu = document.getElementById("customersBalanceList")
    mainLu.innerHTML = "" // içini boşaltıyoruz listemizi güncellemeden

    customerList.forEach(function(customer) { //döngü içerimizde li elementlerimizi oluşturalım
        const newLi = document.createElement("li")
        newLi.innerText = `${customer.name} --- ${customer.balance}`
        mainLu.appendChild(newLi);
    })
}

function sendMoney() {
    console.log("para gönderilme func calıştı")
    //@todo - para gönderme işlemi ile birlikte customerlist ve history list güncelleştirmeleri yapılacak
}