const loadItems = async () => {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const items = await response.json();
        const itemsList = document.getElementById('items-list');
        itemsList.innerHTML = ''; 

        items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'bg-white p-4 rounded-lg shadow-md mb-4 flex justify-between items-center';

            const content = document.createElement('div');
            content.className = 'flex flex-col';
            content.innerHTML = `
                <span class="font-semibold text-lg text-blue-600">${item.title}</span>
                <span class="text-sm text-gray-500">${item.description || 'No description'}</span>
            `;
            li.appendChild(content);

            const editBtn = document.createElement('button');
            editBtn.className = 'bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 focus:outline-none ml-4 flex items-center';
            editBtn.innerHTML = '<i class="fas fa-edit mr-2"></i>Edit'; 
            editBtn.addEventListener('click', () => openModal(item));

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none ml-4 flex items-center';
            deleteBtn.innerHTML = '<i class="fas fa-trash mr-2"></i>Delete';  
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
    const items = itemsList.querySelectorAll('li');

    items.forEach(item => {
        const itemName = item.querySelector('.text-lg').textContent.toLowerCase();
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
