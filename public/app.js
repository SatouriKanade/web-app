const loadItems = async () => {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const items = await response.json();
        const itemsList = document.getElementById('items-list');
        itemsList.innerHTML = ''; 
        
        items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'list-group-item p-2 d-flex justify-content-between align-items-center';
            li.textContent = `${item.title} - ${item.description || 'No description'}`;

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.className = 'btn edit-btn ms-2'; 
            editBtn.addEventListener('click', () => openModal(item)); 

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'btn delete-btn ms-2';  
            deleteBtn.addEventListener('click', () => deleteItem(item.id));

            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
            itemsList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching items:', error);
    }
};

const searchItems = () => {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const itemsList = document.getElementById('items-list');
    const items = itemsList.querySelectorAll('.list-group-item');

    items.forEach(item => {
        const itemName = item.textContent.toLowerCase();
        item.style.display = itemName.includes(searchTerm) ? '' : 'none';
    });
};

const openModal = (item = null) => {
    const itemModal = new bootstrap.Modal(document.getElementById('itemModal'));
    itemModal.show();

    const itemNameInput = document.getElementById('itemName');
    const itemDescriptionInput = document.getElementById('itemDescription');
    if (item) {
        document.getElementById('itemModalLabel').textContent = 'Edit Item';
        itemNameInput.value = item.title;
        itemDescriptionInput.value = item.description || '';
    } else {
        document.getElementById('itemModalLabel').textContent = 'Add Item';
        itemNameInput.value = '';
        itemDescriptionInput.value = '';
    }
};

const handleItemSubmit = async (event) => {
    event.preventDefault();

    const itemName = document.getElementById('itemName').value;
    const itemDescription = document.getElementById('itemDescription').value;

    const item = { title: itemName, description: itemDescription };

    try {
        const response = await fetch('/api/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });

        if (response.ok) {
            loadItems();
            const itemModal = bootstrap.Modal.getInstance(document.getElementById('itemModal'));
            itemModal.hide();
        }
    } catch (error) {
        console.error('Error adding item:', error);
    }
};

const deleteItem = async (id) => {
    try {
        const response = await fetch(`/api/items/${id}`, { method: 'DELETE' });
        if (response.ok) {
            loadItems(); 
        }
    } catch (error) {
        console.error('Error deleting item:', error);
    }
};

document.getElementById('itemForm').addEventListener('submit', handleItemSubmit);
window.onload = loadItems;
