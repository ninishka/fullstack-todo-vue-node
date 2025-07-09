const API_BASE_URL = 'http://localhost:3000'

// Helper function to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('token')
  const headers = {}
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  return headers
}

export async function fetchTodos() {
  try {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      headers: getAuthHeaders()
    })
    if (!response.ok) {
      throw new Error('Failed to fetch todos')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching todos:', error)
    throw error
  }
}

export async function fetchTodoById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
      headers: getAuthHeaders()
    })
    if (!response.ok) {
      throw new Error(`Todo not found (${response.status})`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching todo:', error)
    throw error
  }
}

export async function createTodo(formData) {
  try {
    const headers = getAuthHeaders()
    
    const response = await fetch(`${API_BASE_URL}/todo`, {
      method: 'POST',
      headers: headers,
      body: formData
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      
      // Handle guest limit specifically
      if (response.status === 403 && errorData.guestLimitReached) {
        const error = new Error(errorData.error)
        error.guestLimitReached = true
        throw error
      }
      
      throw new Error(errorData.error || 'Failed to create todo')
    }
    return await response.json()
  } catch (error) {
    console.error('Error creating todo:', error)
    throw error
  }
}

export async function updateTodo(id, data) {
  try {
    const response = await fetch(`${API_BASE_URL}/todo/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ data })
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to update todo')
    }
    return await response.json()
  } catch (error) {
    console.error('Error updating todo:', error)
    throw error
  }
}

export async function deleteTodo(id) {
    try {
    const response = await fetch(`${API_BASE_URL}/todo/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
      });
  
      if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to delete todo');
      }
  
      return true;
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  }

export async function fetchGuestTodoCount() {
  try {
    const response = await fetch(`${API_BASE_URL}/guest/todo-count`)
    if (!response.ok) {
      throw new Error('Failed to fetch guest todo count')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching guest todo count:', error)
    throw error
  }
}
  