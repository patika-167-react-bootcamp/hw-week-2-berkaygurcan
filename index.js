//ilk olarak input değerlerini alalım

const customerList = [ {
    //test datas
        name: "Berkay",
        balance: 12000,
        id: 1
    },
    {
        name: "Fuat",
        balance: 400,
        id: 2
    },
    {
        name: "Utku",
        balance: 9000,
        id: 3
    }
]

//init
const selectSender = document.getElementById("sender")
const recipientSender = document.getElementById("recipient")

renderCustomerList()
renderSenderOption()
renderRecipientOption()


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
     renderSenderOption() // optionslarımızı render edecek func
}

function renderSenderOption () {
    selectSender.innerHTML = ""; //içini boşalttık
  
    //listemizdeki kullanıcıları option olarak eklememiz gerekli

    customerList.forEach(function(customer) { //döngü içerimizde li elementlerimizi oluşturalım
        const newOptionSender = document.createElement("option")
        newOptionSender.innerText = `${customer.name}`
        selectSender.appendChild(newOptionSender);  //tek bir elementi 2elemente atayamıyor muyuz
    })
}

function renderRecipientOption (exceptCustomerName) {
    recipientSender.innerHTML = ""; //içini boşalttık
  
    //listemizdeki kullanıcıları option olarak eklememiz gerekli

    customerList.forEach(function(customer) { //döngü içerimizde li elementlerimizi oluşturalım
        if(customer.name !== exceptCustomerName) { //diğer listeden seçili değerimiz bu listede gözükmesin
            const newOptionRecipient = document.createElement("option")
            newOptionRecipient.innerText = `${customer.name}`
            recipientSender.appendChild(newOptionRecipient);  //tek bir elementi 2elemente atayamıyor muyuz
        }
        
    })
}

//select işleminde değişiklik olunca çalışır.
selectSender.addEventListener('change', (event) => {
    console.log(event.target.value);
    renderRecipientOption(event.target.value)
})

recipientSender.addEventListener('change', (event) => {
    console.log(event.target.value);
})


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