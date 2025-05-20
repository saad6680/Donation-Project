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

  tbody.innerHTML = filteredUsers.map(user => `
    <tr data-user-id="${user._id || user.id}">
      <td>${setUser(user.username)}</td>
      <td>${setUser(user.email)}</td>
      <td>
        <button class="btn remove" onclick="removeUser('${user._id || user.id}', this)">Remove</button>
        <button class="btn block" onclick="toggleBlockUser('${user._id || user.id}', ${!user.isBlocked})">
          ${user.isBlocked ? 'Unblock' : 'Block'}
        </button>
      </td>
    </tr>
  `).join('');

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
    const blockStatus = button.dataset.blocked === 'true';
    await toggleBlockUser(userId, !blockStatus);
  }
}

async function removeUser(userId, buttonElement) {
  const confirmResult = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to remove this user?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, remove',
    cancelButtonText: 'Cancel'
  });

  if (!confirmResult.isConfirmed) return;

  try {
    buttonElement.disabled = true;

    const response = await fetch(`http://localhost:3000/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const row = buttonElement.closest('tr');
      if (row) row.remove();

      Swal.fire({
        icon: 'success',
        title: 'User Removed',
        text: 'User has been successfully removed.',
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true
      });
    } else {
      let errorMessage = 'Failed to remove user';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (_) {}

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage
      });
    }
  } catch (error) {
    console.error('Error removing user:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'An error occurred while removing the user'
    });
  } finally {
    buttonElement.disabled = false;
  }
}

async function toggleBlockUser(userId, blockStatus) {
  try {
    const response = await fetch(`http://localhost:3000/users/${userId}/toggle-block`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isBlocked: blockStatus }),
    });

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: blockStatus ? 'User Blocked' : 'User Unblocked',
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true
      });
      getUsers();
    } else {
      const errorData = await response.json();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to ${blockStatus ? 'block' : 'unblock'} user: ${errorData.message || 'Unknown error'}`
      });
    }
  } catch (error) {
    console.error('Error updating user block status:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'An error occurred while updating user status'
    });
  }
}

document.addEventListener('DOMContentLoaded', getUsers);
