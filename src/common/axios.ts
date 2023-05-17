import axios from 'axios'

export default axios.create({
  baseURL: import.meta.env.VITE_SERVER_HOST,
  headers: {
    Authorization: 'Bearer ' + import.meta.env.VITE_TERMINAL_TOKEN
  }
})
