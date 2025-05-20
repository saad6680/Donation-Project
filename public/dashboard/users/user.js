async function getUsers() {
    const tbody = document.querySelector('.user-table tbody');
    tbody.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';
  
    try {
      const response = await fetch('http://localhost:3000/users');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const users = await response.json();
      if (!Array.isArray(users)) throw new Error('Invalid response format');
      displayUsers(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      tbody.innerHTML = '<tr><td colspan="3">Failed to load users</td></tr>';
    }
  }
  
  function displayUsers(users) {
    const tbody = document.querySelector('.user-table tbody');
    
    const filteredUsers = users.filter(user => user.username !== 'admin');
    tbody.innerHTML = filteredUsers
      .map(
        (user) => `
          <tr data-user-id="${user._id || user.id}">
            <td>${setUser(user.username)}</td>
            <td>${setUser(user.email)}</td>
            <td>
              <button class="btn remove" data-action="remove" data-id="${user._id || user.id}">Remove</button>
              <button class="btn block" data-action="toggle-block" data-id="${user._id || user.id}" data-blocked="${user.status === 'false'}">
                ${user.status === 'false' ? 'Unblock' : 'Block'}
              </button>
            </td>
          </tr>
        `
      )
      .join('');
  
    tbody.addEventListener('click', handleTableActions);
  }
  
  
  function setUser(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }
  
  async function handleTableActions(event) {
    const button = event.target.closest('button');
    if (!button) return;
  
    const action = button.dataset.action;
    const userId = button.dataset.id;
  
    if (action === 'remove') {
      await removeUser(userId, button);
    } else if (action === 'toggle-block') {
      const isBlocked = button.dataset.blocked === 'true';
      await blockUser(userId, !isBlocked);
    }
  }
  
  async function removeUser(userId, buttonElement) {
    if (!confirm('Are you sure you want to remove this user?')) return;
  
    try {
      buttonElement.disabled = true;
      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        const row = buttonElement.closest('tr');
        if (row) {
          row.remove();
          alert('User has been successfully removed');
        }
      } else {
        let errorMessage = 'Failed to remove user';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          
        }
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error removing user:', error);
      alert('An error occurred while removing the user');
    } finally {
      buttonElement.disabled = false;
    }
  }
  
  async function blockUser(userId, blockStatus) {
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: blockStatus ? 'false' : 'true' }),
      });
  
      if (response.ok) {
        getUsers();
      } else {
        const errorData = await response.json();
        alert(`Failed to ${blockStatus ? 'block' : 'unblock'} user: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating user block status:', error);
      alert('An error occurred while updating user status');
    }
  }
  
  document.addEventListener('DOMContentLoaded', getUsers);
