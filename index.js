//ilk olarak input değerlerini alalım

const customerList = []
const moneyTransferHistory= []
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
        newLi.setAttribute('data-id',customer.id) // müşteri datasını li etiketine gömdük
        const nameDiv = document.createElement("div");
        nameDiv.innerText = customer.name;
        const balanceSpan = document.createElement("span");
        balanceSpan.innerText = customer.balance + "tl"

        //silme işlemi sil butonu oluşturmamız ve  eklememiz gerekli
        const newButton = document.createElement("button"); 
        newButton.innerText = "Sil"
        newButton.addEventListener('click', customerDelete)
        newButton.className = "btn btn-danger btn-sm mb-1" // boostrap üzerinden class verdik
        

        //ilgili elementlerin yerleştirilmesi
        newLi.appendChild(nameDiv);          
        newLi.appendChild(balanceSpan);
        newLi.appendChild(newButton)
        mainLu.appendChild(newLi)
        
    })
}


function customerDelete(e) {
    targetLi = e.path[1] //path yardımıyla butonu seçtiğimiz yerdeki li elementini aldık
    console.log(e.path)
    //customer id değerlerini li elementlerini render ederken içerisine ekledik
    const customerId = parseInt(targetLi.getAttribute("data-id"))
    //şimdi customerList içerisinden ilgili id değeri ile eşleşen kaydı silmemiz gerekli
    const index = customerList.findIndex(customer => customer.id === customerId);
    customerList.splice(index,1)
   
    //silme işleminden sonra müşteri listemizi tekrar render edelim(ui için)
    renderCustomerList() 
    //optionları tekrar render edelim
    renderSenderOption()
    renderRecipientOption()
    
}

function renderHistoryList() { 
    //tamamlanan işlemler bu fonksiyon yardımı ile render edilir.
    const mainLu = document.getElementById("historyList")
    mainLu.innerHTML = ""
    
    moneyTransferHistory.forEach(function(history) {
        const {senderCustomer, recipientCustomer, date, amount, id} = history
        //li elementlerinin oluşturulması
        const newli = document.createElement("li")

        const newButton = document.createElement("button");
        newButton.innerText = "Geri Al"
        newButton.className = "btn btn-danger btn-sm mb-1" // boostrap üzerinden class verdik
        newButton.addEventListener('click', transferHistoryDelete)

        newli.className = "list-group-item"
        newli.innerText = `${senderCustomer.name} müşterisi ${recipientCustomer.name} müşterisine ${date} tarihinde ${amount} tl gönderdi `
        newli.setAttribute('data-id',id) //moneyTransferHistory ilgili data'nın takip edilebilmesi için id gömdük 
        newli.appendChild(newButton)
        mainLu.appendChild(newli)

        
    })
    
}

function renderCustomerForHistory(customerName) { //eklenen kullanıcıyı history de sergilemek için

    const mainLu = document.getElementById("historyList")
    const newli = document.createElement("li")
    newli.className = "list-group-item"
    newli.innerText = `${customerName} müşterisi sistemde oluşturuldu.`
    mainLu.appendChild(newli)

}

function transferHistoryDelete(e) {

    targetLi = e.path[1] //path yardımıyla butonu seçtiğimiz yerdeki li elementini aldık

    //moneyTransferHistoryId id değerlerini li elementlerini render ederken içerisine ekledik
    const transferHistoryId = parseInt(targetLi.getAttribute("data-id"))
    //şimdi moneyTransferHistory içerisinden ilgili id değeri ile eşleşen kaydı silmemiz gerekli
    const index = moneyTransferHistory.findIndex(history => history.id === transferHistoryId);
    const {senderCustomer, recipientCustomer} = moneyTransferHistory[index] //bunu  müşterilerin kontrolü amaçlı kullanacağız
    
    //silme işlemi alıcı ve gönderici müşteri kayıtları customerList(yani müşteri listemizde) mevcutsa gerçekleşir
    const senderIsExists = customerList.some((customer) => customer.id === senderCustomer.id)
    const recipientIsExists = customerList.some((customer) => customer.id === recipientCustomer.id)
    
    if(senderIsExists || recipientIsExists) { //müşterilerden biri yoksa bu işlem artık gerçekleşmez
        console.log("bu işlemi yapan kullanıcı artık mevcut olmadığı için geri alınamaz")
    }else {
        let deletedHistory =moneyTransferHistory.splice(index,1)
        console.log(deletedHistory)
        //silme işleminden sonra history listemizi render etmeliyiz
        renderHistoryList()
        revokeTransaction(deletedHistory) //silinen öğemizi gönderdik
        console.log("işlem geri alındı")
    }
    
}

function revokeTransaction(deletedHistory) {
    // iptal edilen işlem gereği bakiyeleri geri yükleyeceğimiz fonksiyon
    //silinen history objesinden kayıtlarımıza ulaşıp güncelleyelim
    console.log(deletedHistory)
    const {senderCustomer, recipientCustomer, amount} = deletedHistory[0] // destruction yaparak objeden sadece istediğimiz değerleri aldık .
    
    //gönderen ve alan müşterilerin bakiyelerini geri yükleyelim
    senderCustomer.balance += amount
    recipientCustomer.balance -= amount

    console.log("bakiyeler geri yüklendi")
    //değerlerimiz(statelerimiz) değişti ondan render ile ui kısmımızı güncelleyelim
    renderCustomerList()
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

    const date = new Date().toLocaleString()

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
        addTransferHistory(senderCustomer, recipientCustomer, amount, date) //history listemizi render edecek func
        renderCustomerList() // müşteri bakiyelerini ui kısmında güncelleyelim
    } else {
        console.log("Gönderilecek miktarı giriniz / Gönderici-Alıcı müşterileri seçiniz")
    }

    function addTransferHistory(senderCustomer, recipientCustomer, amount, date) {
        moneyTransferHistory.push( { //transfer geçmişini kaydedilim
            id: Math.floor(Math.random() * 100), //id oluşturduk,
            senderCustomer,
            recipientCustomer,
            amount,
            date
        })
       
        renderHistoryList() //state üzerinde değişiklik oldu , render fonksiyonumuzu çalıştırırız
        
    }
    
}
