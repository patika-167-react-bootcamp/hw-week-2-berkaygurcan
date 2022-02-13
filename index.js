//ilk olarak input değerlerini alalım


const customerList = []
function addCustomer() {
    const customerName = document.getElementById("newCustomerName").value
    const customerBalance = document.getElementById("newCustomerBalance").value
    customerList.push({
        name: customerName,
        balance: customerBalance,
    })
   
     console.log(customerList)
    renderList() //render edecek func
}

function renderList() {
    //ul listemizi alalım
    const mainLu = document.getElementById("customersBalanceList")
    mainLu.innerHTML = "" // içini boşaltıyoruz listemizi güncellemeden

    customerList.forEach(function(customer) { //döngü içerimizde li elementlerimizi oluşturalım
        const newLi = document.createElement("li")
        newLi.innerText = `${customer.name} --- ${customer.balance}`
        mainLu.appendChild(newLi);
    })
    

}