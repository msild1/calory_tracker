// Storage Controller
const StorageCtrl = (function(){
    // public methods
    return {
        storeItem: function (item){
        let items;
        if(localStorage.getItem("items") === null) {
            items = [];
            items.push(item);
            localStorage.setItem("items", JSON.stringify(items));
            } else {
            items = JSON.parse(localStorage.getItem("items"));
            items.push(item);
            localStorage.setItem("items", JSON.stringify(items));
        }
        },
        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        }
    }

})();

// Item Controller
const ItemCtrl = (function (){
    console.log("ItemCtrl")
    // Item Constructor
    const Item = function (id,name,calories){
        this.id = id
        this.name = name
        this.calories = calories
    }

    // Data Structure
    const data = {
        items: [
        ],
        total: 0,
        currentItem: null
    }
    return {
        getItems: function (){
            return data.items
        },
        logData: function (){
            return data
        },
        addItem: function (name,calories){
            let ID;
            if(data.items.length > 0){
                ID=data.items[data.items.length - 1].id + 1
                console.log(ID)
            } else {
                ID = 0
            }
            calories = parseInt(calories);
            newItem = new Item(ID,name,calories);
            data.items.push(newItem);
            return newItem
        },
        getTotalCalories: function (){
            let total = 0
            data.items.forEach(function (item){
                total = total + item.calories
                console.log(total)
            });
            data.total = total;
            console.log(data.total)
            return data.total
        },
    }
})();

// UI Controller
const UICtrl = (function (){
    const UISelectors = {
        itemList: "#item-list",
        itemNameInput: "#item-name",
        itemCaloriesInput: "#item-calories",
        addBtn: ".add-btn",
        totalCalories: ".total-calories"
    }
    return {
        populateItemList: function (items) {
            // create html content
            let html = '';

            // parse data and create list items html
            items.forEach(function (item) {
                html += `<li class="collection-item" id="item-${item.id}">
        		<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        		<a href="#" class="secondary-content">
          			<i class="edit-item fa fa-pencil"></i>
        		</a>
      			</li>`;
            });

            // insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
            },
        getSelectors: function (){
            return UISelectors
        },
        getItemInput: function (){
            return {
                name:document.querySelector(UISelectors.itemNameInput).value,
                calories:document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item){
            // create li element
            const li = document.createElement('li');
            // add class
            li.className = 'collection-item';
            // add ID
            li.id = `item-${item.id}`;
            // add HTML
            li.innerHTML = `<strong>${item.name}: </strong> 
      			<em>${item.calories} Calories</em>
		    	<a href="#" class="secondary-content">
		    		<i class="edit-item fa fa-pencil"></i>
		    	</a>`;
            // insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        clearInput: function (){
            document.querySelector(UISelectors.itemNameInput).value = "";
            document.querySelector(UISelectors.itemCaloriesInput).value = "";
        },

        showTotalCalories: function (totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories
        }
    }
})();

// App Controller
const App = (function (ItemCtrl,StorageCtrl,UICtrl){
    const loadEventListeners = function (){
        const UISelectors = UICtrl.getSelectors();
        console.log(UISelectors)
        document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit)
        document.addEventListener("DOMContentLoaded",getItemsFromStorage)
    }
    // item add submit function
    const itemAddSubmit = function (event){
        const input = UICtrl.getItemInput()
        if(input.name !== "" && input.calories !== ""){
            const newItem = ItemCtrl.addItem(input.name,input.calories)
            UICtrl.addListItem(newItem);
            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);
            StorageCtrl.storeItem(newItem)
            UICtrl.clearInput()
        }

        event.preventDefault()
    }
    const getItemsFromStorage = function (){
        const items = StorageCtrl.getItemsFromStorage()
        items.forEach(function (item){
            ItemCtrl.addItem(item["name"], item["calories"])
        })
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories)
        UICtrl.populateItemList(items)
    }
    return {
        init: function (){
            console.log("Initializing App")
            const items = ItemCtrl.getItems()
            console.log(items)
            UICtrl.populateItemList(items)
            loadEventListeners();
        }
    }
})(ItemCtrl,StorageCtrl, UICtrl);

App.init()