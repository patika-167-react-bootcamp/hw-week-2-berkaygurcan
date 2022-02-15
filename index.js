//ilk olarak input değerlerini alalım

const customerList = []

//initalize application
const selectSender = document.getElementById("sender")
const selectRecipient = document.getElementById("recipient")
const customerNameInput = document.getElementById("newCustomerName") 
const customerBalance = document.getElementById("newCustomerBalance") 
const amountInput = document.getElementById("amount") 


function addCustomer() { 
    //inputlardaki değerleri alalım
    
    const customerName = document.getElementById("newCustomerName").value 
    const customerBalance = document.getElementById("newCustomerBalance").value

    if(!customerName || !customerBalance) { //alanlar girilmemiş ise
        console.log("Lütfen alanları doldurun")
        return false
    }
    //değerleri customer listesine ekleyelim
    customerList.push({
        id: Math.floor(Math.random() * 100), //id oluşturduk
        name: customerName,
        balance: parseInt(customerBalance), //string yerine integer olarak yerleştirdik.Üzerinde sayısal işlem yapacağız
    })
   
    //render fonksiyonlarının çağrılması
     renderCustomerList() //customer listesini render edecek func
     // optionslarımızı render edecek fonksiyonlar
     renderSenderOption() 
     renderRecipientOption()
     renderCustomerForHistory(customerName) // kullanıcı eklendiğinde history kısmını güncellemeye yarayan render fonksiyonu
     
     console.log("kullanıcı başarılı şekilde eklendi")
     //inputların içlerini boşaltalım
     customerNameInput.value = ""
     newCustomerBalance.value = ""
    
}

function renderSenderOption () {
    selectSender.innerHTML = ""; //içini boşalttık
  
    //listemizdeki kullanıcıları option olarak eklememiz gerekli

    customerList.forEach(function(customer) { //döngü içerisinde li elementlerimizi oluşturalım
        const newOptionSender = document.createElement("option")
        newOptionSender.innerText = `${customer.name}`
        newOptionSender.setAttribute('data-id',customer.id)
        selectSender.appendChild(newOptionSender);  //tek bir elementi 2elemente atayamıyor muyuz
    })
}

function renderRecipientOption (exceptCustomerName) {
    selectRecipient.innerHTML = ""; //içini boşalttık
  
    //listemizdeki kullanıcıları option olarak eklememiz gerekli
    customerList.forEach(function(customer) { //döngü içerisinde li elementlerimizi oluşturalım
        if(customer.name !== exceptCustomerName) { //diğer listeden seçili değerimiz bu listede gözükmesin
            const newOptionRecipient = document.createElement("option")
            newOptionRecipient.innerText = `${customer.name}`
            newOptionRecipient.setAttribute('data-id',customer.id) //id değerini korumak ve sonradan erişmek için data-id olarak elemente ekliyoruz
            selectRecipient.appendChild(newOptionRecipient);  
        }
        
    })
}

//select işleminde değişiklik olunca çalışır.
selectSender.addEventListener('change', (event) => {
    renderRecipientOption(event.target.value) //alıcı dropdown da gönderici olmayacak
})



function renderCustomerList() { //bu fonkisyon ile birlikte müşteri ve bakiyeleri render edeceğiz.
    //ul listemizi alalım
    const mainLu = document.getElementById("customersBalanceList")
    mainLu.innerHTML = "" // içini boşaltıyoruz listemizi güncellemeden

    customerList.forEach(function(customer) { //döngü içerisinde li elementlerimizi oluşturalım
        //listemize ekleme yaparken div ve span olarak datayı ayırıp daha güzel şekilde gösterelim
        const newLi = document.createElement("li"); 
        newLi.className = "list-group-item d-flex justify-content-between align-items-start"; //hizalama işlemleri için
        const nameDiv = document.createElement("div");
        nameDiv.innerText = customer.name;
        const balanceSpan = document.createElement("span");
        balanceSpan.innerText = customer.balance
        newLi.appendChild(nameDiv);          
        newLi.appendChild(balanceSpan);
        mainLu.appendChild(newLi)
        
    })
}

function renderHistoryList(sender,recipient,amount) {
    //tamamlanan işlemler bu fonksiyon yardımı ile render edilir.

    const mainLu = document.getElementById("historyList")
    const newli = document.createElement("li")
    newli.className = "list-group-item"
    newli.innerText = `${sender} müşterisi ${recipient} müşterisine ${amount} tl gönderdi `
    mainLu.appendChild(newli)
}

function renderCustomerForHistory(customerName) { //eklenen kullanıcıyı history de sergilemek için

    const mainLu = document.getElementById("historyList")
    const newli = document.createElement("li")
    newli.className = "list-group-item"
    newli.innerText = `${customerName} müşterisi sistemde oluşturuldu.`
    mainLu.appendChild(newli)

}

function sendMoney() {
    //@todo - bu fonksiyon parçalanabilir
    //ilk olarak gönderici - alıcı müşterilerine ulaşmamız gerekir
    //getAttribute ile id değerini çekiyoruz ama gelen değer string int bir değere çevirip karşılaştırma yapacağız.
    const senderId = parseInt(selectSender.selectedOptions[0].getAttribute("data-id"))
    const recipientId = parseInt(selectRecipient.selectedOptions[0].getAttribute("data-id"))
    //id değerleri ile birlikte ilgili müşteri objesine ulaşalım
    const senderCustomer = customerList.find((customer) => customer.id === senderId)
    const recipientCustomer = customerList.find((customer) => customer.id === recipientId)
    
    const amount = parseInt(document.getElementById("amount").value)

    if(amount && senderCustomer && recipientCustomer) {//bakiye girildiyse işlemi gerçekleştirelim
        if (amount < 0) {
            console.log("Pozitif bir bakiye giriniz")
            return false
        } 
        else if (amount > 0 && senderCustomer.balance - amount >= 0 ) {
            //gönderen ve alan müşterilerin bakiyelerini hesaplayalım
            senderCustomer.balance -= amount
            recipientCustomer.balance += amount
        } else {
            console.log("yetersiz bakiye")
            return false
        }  
    
        console.log("Para gönderme işlemi başarılı")
        amountInput.value = ""
        renderHistoryList(senderCustomer.name, recipientCustomer.name, amount) //history listemizi render edecek func
        renderCustomerList() // müşteri bakiyelerini ui kısmında güncelleyelim
    } else {
        console.log("Gönderilecek miktarı giriniz / Gönderici-Alıcı müşterileri seçiniz")
    }

 
    
}