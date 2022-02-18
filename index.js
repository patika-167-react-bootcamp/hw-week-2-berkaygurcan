//ilk olarak input değerlerini alalım

const customerList = []
let moneyTransferHistory= []
const productsList = []
const basketList = []
let filter = null
const selectSender = document.getElementById("sender")
const selectRecipient = document.getElementById("recipient")
const selectFilter = document.getElementById("filter")
const selectBasket = document.getElementById("basket")
const customerNameInput = document.getElementById("newCustomerName") 
const customerBalance = document.getElementById("newCustomerBalance") 
const amountInput = document.getElementById("amount")
const filterTextInput = document.getElementById("filterText")

let totalPrice = 0 // satış işlemi için

function addCustomer() { 
    //inputlardaki değerleri alalım
    
    const customerName = document.getElementById("newCustomerName").value 
    const customerBalance = document.getElementById("newCustomerBalance").value

    if(!customerName || !customerBalance) { //alanlar girilmemiş ise
       alert("Lütfen alanları doldurun")
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
     renderBasketOption() //sepetteki müşteri seçme selectimiz
    
    
    moneyTransferHistory.push({
        customerName: customerName,
        type: "add",
        text: `${customerName} müşterisi sistemde oluşturuldu.`
    })
    
     renderHistoryList()
     //inputların içlerini boşaltalım
     customerNameInput.value = ""
     newCustomerBalance.value = ""

}

function renderSenderOption () {
    
    selectSender.innerHTML = ""; //içini boşalttık
    selectSender.innerHTML = `<option selected>Lütfen Gönderici Seçiniz</option>`
    
  
    //listemizdeki kullanıcıları option olarak eklememiz gerekli

    customerList.forEach(function(customer) { //döngü içerisinde li elementlerimizi oluşturalım
        console.log(customer)
        const newOptionSender = document.createElement("option")
        newOptionSender.innerText = `${customer.name}`
        newOptionSender.setAttribute('data-id',customer.id)
        selectSender.appendChild(newOptionSender);  //tek bir elementi 2elemente atayamıyor muyuz
    })
}

function renderRecipientOption (exceptCustomerName) {
    
    selectRecipient.innerHTML = ""; //içini boşalttık
    selectRecipient.innerHTML = `<option selected>Lütfen Alıcı Seçiniz</option>`

  
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
    
    //customer id değerlerini li elementlerini render ederken içerisine ekledik
    const customerId = parseInt(targetLi.getAttribute("data-id"))
    //şimdi customerList içerisinden ilgili id değeri ile eşleşen kaydı silmemiz gerekli
    const index = customerList.findIndex(customer => customer.id === customerId);
    
    const deletedCustomer = customerList.splice(index,1)
    
    //history listemizde yazmak için durumu ekleyelim
    moneyTransferHistory.push({
        customerName: deletedCustomer[0].name,
        type: "delete",
        text: `${deletedCustomer[0].name} müşterisi sistemden silindi.`
    })
   
    //silme işleminden sonra müşteri listemizi tekrar render edelim(ui için)
    renderCustomerList() 
    //optionları tekrar render edelim
    renderSenderOption()
    renderRecipientOption()
    renderHistoryList()
    
}

function renderHistoryList(targetName = "") { 
    //tamamlanan işlemler bu fonksiyon yardımı ile render edilir.
    const mainLu = document.getElementById("historyList")
    mainLu.innerHTML = ""
   

    let resultmoneyTransferHistory; //Filremize göre şekillenicek

        if(filter === "Gönderen") {
            //text üzerinden gelen değere göre Customer Listemiz üzerinden filtreleme işlemi yapacağız
            resultmoneyTransferHistory = moneyTransferHistory.filter( history => history.senderCustomer?.name === targetName) 
            //üst satırdaki senderCustomer? aslında bir kaçış yapmamızı sağlıyor.Eğer sender customer yoksa hata vermek yerine görmezden gelip döngüye devam etmemizi sağlar
            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining

        } else if (filter === "Alıcı") {
            resultmoneyTransferHistory = moneyTransferHistory.filter( history => history.recipientCustomer?.name === targetName) 
        } else if (filter === "Gönderen & Alıcı"){ //her ikiside olabilir
            resultmoneyTransferHistory = moneyTransferHistory.filter( history => (history.senderCustomer?.name === targetName) ||  (history.recipientCustomer?.name === targetName)) 
        } else if (filter === null) { //filtreleme yoksa
            resultmoneyTransferHistory = moneyTransferHistory //orijinal history datasını aktarıyoruz
        }


    resultmoneyTransferHistory.forEach(function(history) {
        const {type} = history
        //li elementlerinin oluşturulması
        
        if(type === "transfer") {
            const {senderCustomer, recipientCustomer, date, amount, id } = history
            const newli = document.createElement("li")
            const newButton = document.createElement("button");
            newButton.innerText = "Geri Al"
            newButton.className = "btn btn-danger btn-sm mb-1" // boostrap üzerinden class verdik
            newButton.addEventListener('click', transferHistoryDelete)

            newli.className = "list-group-item"
            newli.innerText = `${senderCustomer.name} müşterisi ${recipientCustomer.name} müşterisine ${date} tarihinde ${amount} tl gönderdi  `
            newli.setAttribute('data-id',id) //moneyTransferHistory ilgili data'nın takip edilebilmesi için id gömdük 
            newli.appendChild(newButton)
            mainLu.appendChild(newli)

        } else if (type ==="add" || type === "delete") {
            const { text } = history
            const newli = document.createElement("li")
            newli.className = "list-group-item"
            newli.innerText = text
            mainLu.appendChild(newli)
            
        } 
        
    })
    
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
    
    if(!senderIsExists || !recipientIsExists) { //müşterilerden biri yoksa bu işlem artık gerçekleşmez
       alert("bu işlemi yapan kullanıcı artık mevcut olmadığı için geri alınamaz")
    }else {
        
        let deletedHistory =moneyTransferHistory.splice(index,1)
        //silme işleminden sonra history listemizi render etmeliyiz
        moneyTransferHistory
        filter = null //filtremiz varsa kapatıyoruzki listemiz tamamen görünsün
        renderHistoryList()
        revokeTransaction(deletedHistory) //silinen öğemizi gönderdik
    }
}

function revokeTransaction(deletedHistory) {
    // iptal edilen işlem gereği bakiyeleri geri yükleyeceğimiz fonksiyon
    //silinen history objesinden kayıtlarımıza ulaşıp güncelleyelim
    const {senderCustomer, recipientCustomer, amount} = deletedHistory[0] // destruction yaparak objeden sadece istediğimiz değerleri aldık .
    
    //gönderen ve alan müşterilerin bakiyelerini geri yükleyelim
    senderCustomer.balance += amount
    recipientCustomer.balance -= amount

    console.log("bakiyeler geri yüklendi")
    //değerlerimiz(statelerimiz) değişti ondan render ile ui kısmımızı güncelleyelim
    renderCustomerList()
}

function sendMoney() {
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
            alert("Pozitif bir bakiye giriniz")
            return false
        } 
        else if (amount > 0 && senderCustomer.balance - amount >= 0 ) {
            //gönderen ve alan müşterilerin bakiyelerini hesaplayalım
            senderCustomer.balance -= amount
            recipientCustomer.balance += amount

        } else {
            alert("yetersiz bakiye")
            return false
        }  
    
        amountInput.value = ""
        addTransferHistory(senderCustomer, recipientCustomer, amount, date) //history listemizi render edecek func
        renderCustomerList() // müşteri bakiyelerini ui kısmında güncelleyelim
    } else {
        alert("Gönderilecek miktarı giriniz / Gönderici-Alıcı müşterileri seçiniz")
    }

    function addTransferHistory(senderCustomer, recipientCustomer, amount, date) {
        moneyTransferHistory.push( { //transfer geçmişini kaydedilim
            id: Math.floor(Math.random() * 100), //id oluşturduk,
            senderCustomer,
            recipientCustomer,
            amount,
            date,
            type: "transfer",
        })
    
        renderHistoryList() //state üzerinde değişiklik oldu , render fonksiyonumuzu çalıştırırız
        
    }
    //obje içerisine html yazabilirsin! li leri öyle cagırabilirsin
    //@todo - li etiketini objede yazma durumlarını dene
}

function filterByCustomer() {
    
    const targetName = filterTextInput.value
     filter = selectFilter.value //state ekliyoruz aslında

    if(!targetName) {
        alert("lütfen filtre değerini giriniz")
        return false
    }
    
    renderHistoryList(targetName)
   
    
}

function resetFilter() {
    //filtresiz olarak çalıştığı zaten kendi listemiz yüklenecek
    filter = null
    renderHistoryList() //tekrar render ediyoruz history listemizi
    
}


// Card ve Sell işlemleri 

function addProduct() {

    //input üzerinden değerlerin alınması
    const productName = document.getElementById("productName").value
    const productQuantity = parseInt(document.getElementById("productQuantity").value)
    const productPrice = parseInt(document.getElementById("productPrice").value)

    //alan kontrolü
    if(!productName || !productQuantity || !productPrice) {
        alert("ilgili alanları doldurunuz")
        return false
    }

    //listemize ürünümüzü ekleyelim

    productsList.push( { 
        id: Math.floor(Math.random() * 100), //id oluşturduk,
        productName,
        productQuantity,
        productPrice
    })

    renderProductsList()
    
}

function renderProductsList() { //product listesinin render edilmesinden sorumlu fonksiyon

    //ul listemizi alalım
    const mainLu = document.getElementById("productsList")
    mainLu.innerHTML = "" // içini boşaltıyoruz listemizi güncellemeden

    productsList.forEach(function(product) { //döngü içerisinde li elementlerimizi oluşturalım

        //listemize ekleme yaparken div ve span olarak datayı ayırıp daha güzel şekilde gösterelim
        const newLi = document.createElement("li"); 
        newLi.className = "list-group-item d-flex justify-content-around align-items-center"; //hizalama işlemleri için
        newLi.setAttribute('data-id',product.id) // müşteri datasını li etiketine gömdük
        const productNameDiv = document.createElement("div");
        productNameDiv.innerText = product.productName;
        const productQuantitySpan = document.createElement("span");
        productQuantitySpan.innerText = product.productQuantity + " adet"
        const productPriceSpan = document.createElement("span");
        productPriceSpan.innerText = product.productPrice + " tl"

        //ekleme işlemi  için ekle butonu oluşturmamız ve  eklememiz gerekli
        const newButton = document.createElement("button"); 
        newButton.innerText = "Ekle"
        newButton.className = "btn btn-primary btn-sm mb-1" // boostrap üzerinden class verdik
        newButton.addEventListener('click', addTobasket)
        
        //ilgili elementlerin yerleştirilmesi
        newLi.appendChild(productNameDiv);          
        newLi.appendChild(productQuantitySpan);
        newLi.appendChild(productPriceSpan);
        newLi.appendChild(newButton)
        mainLu.appendChild(newLi)
        
    })
}


function addTobasket(e) {
    //Ürün yanındaki ekle butonuna tıklanınca burası çalışacak ve sepet listesine ürün eklenecek.
    targetLi = e.path[1] //path yardımıyla butonu seçtiğimiz yerdeki li elementini aldık
    
    const productId = parseInt(targetLi.getAttribute("data-id"))
    
    //şimdi productsList içerisinden ilgili id değeri ile eşleşen kaydı bulmamız gerekli
    const productObj = productsList.find(product => product.id === productId);

    //bu kaydı sepet listesine eklememiz gerekli
    
    const basketObj = basketList.find(product => product.productId === productId);
    
    //önceden sepette bu ürün varsa 
    if(basketObj) {
        basketObj.basketQuantity += 1 //adeti bir adet attırıcaz
        basketObj.total = basketObj.basketQuantity * basketObj.unitPrice //yeni total fiyatı adet * birim fiyatından buluruz
    }
    //önceden sepette bu ürün mevcut değilse
    else {
        basketList.push({
            id: Math.floor(Math.random() * 100), //id oluşturduk,
            productId: productObj.id,
            productName : productObj.productName,
            basketQuantity: 1,
            unitPrice: productObj.productPrice,
            total: productObj.productPrice
        })
    }

    renderBasketList()

}

function renderBasketList() {

     //ul listemizi alalım
     const mainLu = document.getElementById("basketList")
     mainLu.innerHTML = "" // içini boşaltıyoruz listemizi güncellemeden
 
     basketList.forEach(function(product) { //döngü içerisinde li elementlerimizi oluşturalım
 
         //listemize ekleme yaparken div ve span olarak datayı ayırıp daha güzel şekilde gösterelim
         const newLi = document.createElement("li")
         newLi.className = "list-group-item d-flex justify-content-center align-items-center"; //hizalama işlemleri için
         newLi.setAttribute('data-id',product.id) // basket datasını li etiketine gömdük
         const productBasketDiv = document.createElement("div");
         productBasketDiv.innerText = `${product.productName} adet: ${product.basketQuantity} birim fiyatı: ${product.unitPrice} toplam: ${product.total}`
       
         //ilgili elementlerin yerleştirilmesi
         newLi.appendChild(productBasketDiv);          
         mainLu.appendChild(newLi)
         
     })

     //toplam ödenecek tutarımızı hesaplayalım
      totalPrice = basketList.reduce(function (prevValue, currentValue) {
         return prevValue + currentValue.total
     }, 0)

     //sayfanın en alt kısmında bütün ürünlerin fiyatlarını göstermemiz gerekli
     const totalPriceLi = document.createElement("div")
     totalPriceLi.style = "text-align: center;" // @todo - stillendirmesine bak
     totalPriceLi.innerText = `Toplam Ödenecek Tutar : ${totalPrice}`
     mainLu.appendChild(totalPriceLi)

}

function resetBasket() {
    //basket listemizi sıfırlayalım
    basketList.splice(0,basketList.length) //listemizi tamamen boşaltırız
    renderBasketList()
}

function sell() { //satış yapma işlemi

    //ilgili müşterinin bakiyesinden satış işlemini düşmeliyiz
    //bu yüzden ilk olarak müşterimize ulaşalım
    const id = parseInt(selectBasket.selectedOptions[0].getAttribute("data-id"))
    const customer = customerList.find((customer) => customer.id === id)

    if(!customer) {
        alert("Müşteri sistemde mevcut değil satış işlemi yapılamıyor.")
        return false
    }

    customer.balance -= totalPrice
   
    renderCustomerList()
    resetBasket()
}


function renderBasketOption () {
    selectBasket.innerHTML = ""; //içini boşalttık
  
    //listemizdeki kullanıcıları option olarak eklememiz gerekli

    customerList.forEach(function(customer) { //döngü içerisinde li elementlerimizi oluşturalım
        const newOptionBasket = document.createElement("option")
        newOptionBasket.innerText = `${customer.name}`
        newOptionBasket.setAttribute('data-id',customer.id)
        selectBasket.appendChild(newOptionBasket);  //tek bir elementi 2elemente atayamıyor muyuz
    })


}