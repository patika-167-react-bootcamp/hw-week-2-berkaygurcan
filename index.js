//ilk olarak input değerlerini alalım

const customerList = [ {
    //test datas
        name: "Berkay",
        balance: 100,
        id: 1
    },
    {
        name: "Fuat",
        balance: 30,
        id: 6
    },
    {
        name: "Utku",
        balance: 60,
        id: 7
    }
]

//initalize application
const selectSender = document.getElementById("sender")
const selectRecipient = document.getElementById("recipient")

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
        newOptionSender.setAttribute('data-id',customer.id)
        selectSender.appendChild(newOptionSender);  //tek bir elementi 2elemente atayamıyor muyuz
    })
}

function renderRecipientOption (exceptCustomerName) {
    selectRecipient.innerHTML = ""; //içini boşalttık
  
    //listemizdeki kullanıcıları option olarak eklememiz gerekli

    customerList.forEach(function(customer) { //döngü içerimizde li elementlerimizi oluşturalım
        if(customer.name !== exceptCustomerName) { //diğer listeden seçili değerimiz bu listede gözükmesin
            const newOptionRecipient = document.createElement("option")
            newOptionRecipient.innerText = `${customer.name}`
            newOptionRecipient.setAttribute('data-id',customer.id)
            selectRecipient.appendChild(newOptionRecipient);  //tek bir elementi 2elemente atayamıyor muyuz
        }
        
    })
}

//select işleminde değişiklik olunca çalışır.
selectSender.addEventListener('change', (event) => {
    console.log(event.target.value);
    renderRecipientOption(event.target.value) //alıcı dropdown da gönderici olmayacak
})

selectRecipient.addEventListener('change', (event) => {
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

function renderHistoryList(sender,recipient,amount) {
    //tamamlanan işlemler bu fonksiyon yardımı ile render edilir.

    const mainLu = document.getElementById("historyList")
    const newli = document.createElement("li")
    newli.innerText = `${sender} has sent ${amount} to ${recipient}`
    mainLu.appendChild(newli)


}

function sendMoney() {
    //@todo - para gönderme işlemi ile birlikte customerlist ve history list güncelleştirmeleri yapılacak
    //ilk olarak gönderici - alıcı müşterilerine ulaşmamız gerekir

    //getAttribute ile id değerini çekiyoruz ama gelen değer string int bir değere çevirip karşılaştırma yapacağız.
    const senderId = parseInt(selectSender.selectedOptions[0].getAttribute("data-id"))
    const recipientId = parseInt(selectRecipient.selectedOptions[0].getAttribute("data-id"))
    //id değerleri ile birlikte ilgili müşteri objesine ulaşalım
    const senderCustomer = customerList.find((customer) => customer.id === senderId)
    const recipientCustomer = customerList.find((customer) => customer.id === recipientId)
    
    const amount = parseInt(document.getElementById("amount").value)

    if(amount) {
        //bakiye girildiyse işlemi gerçekleştirelim
        //gönderen ve alan müşterilerin bakiyelerini hesaplayalım
        senderCustomer.balance -= amount
        recipientCustomer.balance += amount

        console.log(customerList)
        console.log("Para gönderme işlemi başarılı")
        renderHistoryList(senderCustomer.name, recipientCustomer.name, amount)

    } else {
        console.log("Gönderilecek miktarı giriniz")
        
    }
    //@todo bakiye yetersiz durumu
}